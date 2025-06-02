import PropertySchema from "../../joiModels/Property.js";
import Property from "../../models/Property.js";
import cloudinary from "../../config/cloudinary.js";
import usStates from "states-us";
import allCities from 'all-the-cities';

const addNewProperty = async (property, res) => {
    try {
        console.log('property', property.features)
        await PropertySchema.validateAsync(property);

        const newProperty = new Property(property);
        const savedProperty = await newProperty.save().then(res => res.toObject());

        return res.status(200).send({ success: true, message: 'Property has been added but image upload left', property: savedProperty });

    } catch (error) {
        console.log("error", error);
        return res.status(error.status || 500).send({ success: false, message: error.message || 'Internal Server Error' });
    }
};

const editSpecificProperty = async (id, property, res) => {
    try {
        await PropertySchema.validateAsync(property);
        const propertyExist = await Property.findById(id);
        if (!propertyExist) {
            return res.status(400).send({ success: false, message: 'No property with that id exist' });
        }

        const updatedProperty = await Property.findByIdAndUpdate(id, property, { new: true });

        return res.status(200).send({ success: true, message: 'Property has been Updated', property: updatedProperty });

    } catch (error) {
        console.log("error", error);
        return res.status(error.status || 500).send({ success: false, message: error.message || 'Internal Server Error' });
    }
};

const deleteExistingProperty = async (id, res) => {
    try {
        const propertyExist = await Property.findById(id);
        if (!propertyExist) {
            return res.status(400).send({ success: false, message: 'Property does not Found' });
        }

        propertyExist.imgUrl.map(async (v) => {
            await cloudinary.api.delete_resources([v.public_id], { resource_type: 'image' }, async (deleteError, deleteResult) => {
                if (deleteError && deleteError.http_code !== 404) { // If error is not 'not found'
                    console.error("Cloudinary delete error:", deleteError);
                    return res.status(500).send({ success: false, error: deleteError });
                }
                console.log("deleteResult", deleteResult);
            });
        })

        await Property.findByIdAndDelete(id);

        // Check for existing image and delete it if present

        return res.status(200).send({ success: true, message: 'Property has been deleted' });

    } catch (error) {
        console.log("error", error);
        return res.status(error.status || 500).send({ success: false, message: error.message || 'Internal Server Error' });
    }
};

const uploadToCloudinary = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder, resource_type: 'auto' }, // Upload file buffer, detect resource type
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            }
        ).end(fileBuffer); // Directly upload the file buffer to Cloudinary
    });
};

const deleteFromCloudinary = async (public_id, propertyId, res) => {
    try {
        const decodedPublicId = decodeURIComponent(public_id);
        // Check for existing image and delete it if present
        await cloudinary.api.delete_resources([decodedPublicId], { resource_type: 'image' }, async (deleteError, deleteResult) => {
            if (deleteError && deleteError.http_code !== 404) { // If error is not 'not found'
                console.error("Cloudinary delete error:", deleteError);
                return res.status(500).send({ success: false, error: deleteError });
            }
        });

        // Then, remove the image reference from the property document (if it exists)
        const property = await Property.findOneAndUpdate(
            { _id: propertyId },
            { $pull: { imgUrl: { public_id: decodedPublicId } } }, // Remove the image with the specific decodedPublicId
            { new: true }
        );

        if (!property) {
            return res.status(404).send({ success: false, message: 'Property not found' });
        }

        return res.status(200).send({ success: true, message: 'Image deleted and property updated' });

    } catch (error) {
        console.log("error", error);
        await Property.findByIdAndDelete(id);
        res.status(500).send({ success: false, error: error?.message });
    }
};

const uploadPropertyImage = async (id, req, res) => {
    try {
        const files = req.files;
        const uploadedUrls = [];

        // Upload each file asynchronously
        for (const file of files) {
            const folder = 'RealEstate'; // Folder name for Cloudinary

            try {
                // Upload file buffer directly to Cloudinary
                const result = await uploadToCloudinary(file.buffer, folder);
                const { secure_url: url, public_id } = result;

                // Save URL and public_id to array
                uploadedUrls.push({ url, public_id });

            } catch (error) {
                // In case of error, delete the property from the DB
                await Property.findByIdAndDelete(id);
                return res.status(500).send({ success: false, error: 'Error uploading files' });
            }
        }

        // Update the property with uploaded URLs
        const updatedProperty = await Property.findByIdAndUpdate(
            id,
            { $push: { imgUrl: uploadedUrls } },
            { new: true }
        );

        // Respond with success
        return res.status(200).send({
            success: true,
            message: 'Property has been added and images have been uploaded',
            property: updatedProperty,
        });
    } catch (error) {
        console.log("error", error);
        await Property.findByIdAndDelete(id);
        res.status(500).send({ success: false, error: error?.message });
    }
};

const getProperties = async (filters, res) => {
    try {
        const {
            page,
            size,
            userId,
            title,
            availableFor,
            _id,
            city,
            state
        } = filters;

        // Build filter object
        const filter = {};

        // Filter by _id if provided and valid
        if (_id && _id !== '' && _id !== 'undefined') {
            filter._id = _id;
        }

        // Filter by userId if provided and valid
        if (userId && userId !== 'all' && userId !== 'undefined') {
            filter.addedBy = userId;
        }

        // Filter by title (search) if provided
        if (title && title !== 'undefined') {
            filter.title = { $regex: new RegExp(title, 'i') };
        }

        // Filter by availableFor (search) if provided
        if (availableFor && availableFor !== 'undefined') {
            filter.availableFor = availableFor;
        }

        // Filter by city (search) if provided
        if (city && city !== 'undefined') {
            filter.city = city.toLowerCase();
        }

        // Filter by state (search) if provided
        if (state && state !== 'undefined') {
            filter.state = state.toLowerCase();
        }

        // Count documents based on filter
        const totalProperties = await Property.countDocuments(filter);

        let properties;

        if (page !== undefined && size !== undefined && page !== 'undefined' && size !== 'undefined') {
            const skip = (Number(page) - 1) * Number(size);
            properties = await Property.find(filter).sort({ title: 1 }).skip(skip).limit(Number(size));
        } else {
            properties = await Property.find(filter).sort({ title: 1 });
        }

        return res.status(200).send({
            success: true,
            message: 'Filtered Properties',
            properties,
            totalProperties,
        });

    } catch (error) {
        console.log("error", error);
        return res.status(error.status || 500).send({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

const getCityOrState = async (type, q, res) => {
    try {
        console.log({ type, q })
        const query = (q || "").toLowerCase().trim();
        let data = [];

        if (!type || (type !== 'city' && type !== 'state')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or missing type. Must be "city" or "state".',
                data: [],
            });
        }

        if (type === 'state') {
            data = Array.from(new Set(
                usStates.states
                    .filter(x => x.name.toLowerCase().startsWith(query))
                    .map(x => x.name)
            ));
        }

        if (type === 'city') {
            data = Array.from(new Set(
                allCities
                    .filter(city => city.country === 'US' && city.name.toLowerCase().startsWith(query))
                    .map(city => city.name)
            ));
        }

        res.status(200).json({
            success: true,
            message: 'Fetched data successfully',
            data,
        });
    } catch (error) {
        console.error("Error getting city/state data:", error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error',
            data: [],
        });
    }
};

export {
    addNewProperty,
    getProperties,
    editSpecificProperty,
    deleteFromCloudinary,
    deleteExistingProperty,
    uploadPropertyImage,
    getCityOrState,
};