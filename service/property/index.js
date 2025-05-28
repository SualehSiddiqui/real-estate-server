import PropertySchema from "../../joiModels/Property.js";
import Property from "../../models/Property.js";
import cloudinary from "../../config/cloudinary.js";

const addNewProperty = async (property, res) => {
    try {

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

const getProperties = async (page, size, status, res) => {
    try {
        let properties;
        const totalProperties = await Property.countDocuments({});
        if (page !== 'undefined' && size !== 'undefined') {
            const skip = (Number(page) - 1) * size;

            if (status === 'all') {
                properties = await Property.find({}).sort({ name: 1 }).skip(skip).limit(size);
            } else {
                properties = await Property.find({ status: status === 'show' ? true : false }).sort({ name: 1 }).skip(skip).limit(size);
            }
        } else {
            properties = await Property.find({}).sort({ name: 1 });
        }

        return res.status(200).send({ success: true, message: 'All Properties', properties, totalProperties });

    } catch (error) {
        console.log("error", error);
        return res.status(error.status || 500).send({ success: false, message: error.message || 'Internal Server Error' });
    }
};

const getPropertiesBySearch = async (searchValue, res) => {
    try {
        const data = await Property.find({ title: { $regex: new RegExp(searchValue, 'i') } }).sort({ title: 1 })
        return res.status(201).send({ sucess: true, data })
    } catch (error) {
        console.log('error--->', error)
        res.send({ success: false, error, message: error.message })
    }
}

export {
    addNewProperty,
    getProperties,
    editSpecificProperty,
    deleteFromCloudinary,
    deleteExistingProperty,
    uploadPropertyImage,
    getPropertiesBySearch,
};