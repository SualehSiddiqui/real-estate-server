import PropertySchema from "../../joiModels/Property.js";
import Property from "../../models/Property.js";
import cloudinary from "../../config/cloudinary.js";

const addNewProperty = async (property, res) => {
    try {
        await PropertySchema.validateAsync(property);
        const propertyExist = await Property.findOne({ name: property.name, category: property.category });
        if (propertyExist) {
            return res.status(400).send({ success: false, message: 'Property with that name already exist' });
        }

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

const getProperties = async (status, res) => {
    try {
        let propertyExist;
        if (status === 'all') {
            propertyExist = await Property.find({});
        } else {
            propertyExist = await Property.find({ status: status });
        }
        if (!propertyExist) {
            return res.status(400).send({ success: false, message: 'Property does not exist' });
        }

        return res.status(200).send({ success: true, message: 'All Properties', data: propertyExist });

    } catch (error) {
        console.log("error", error);
        return res.status(error.status || 500).send({ success: false, message: error.message || 'Internal Server Error' });
    }
};

const getOneProperty = async (id, res) => {
    try {
        const propertyExist = await Property.findById(id);
        if (!propertyExist) {
            return res.status(400).send({ success: false, message: 'Property does not exist' });
        }

        return res.status(200).send({ success: true, message: 'Property found', property: propertyExist });

    } catch (error) {
        console.log("error", error);
        return res.status(error.status || 500).send({ success: false, message: error.message || 'Internal Server Error' });
    }
};

const getPropertiesBySearch = async (obj, res) => {
    try {

        const filter = { ...obj.filter };
        delete obj.filter;

        // Prepare the query object
        const query = { ...obj };

        // If filter has a price range, add it to the query
        if (filter && filter.price && filter.price.minPrice && filter.price.maxPrice) {
            query.price = {
                $gte: filter.price.minPrice,  // greater than or equal to minPrice
                $lte: filter.price.maxPrice   // less than or equal to maxPrice
            };
        }

        // Initialize sort object based on selected sort option
        let sortQuery = {};

        switch (filter.sort) {
            case 'featured':
                sortQuery = { featured: -1 };
                break;
            case 'date-old-to-new':
                sortQuery = { createdAt: 1 };
                break;
            case 'date-new-to-old':
                sortQuery = { createdAt: -1 };
                break;
            case 'alphabetically-a-to-z':
                sortQuery = { name: 1 };
                break;
            case 'alphabetically-z-to-a':
                sortQuery = { name: -1 };
                break;
            case 'alphabetically-low-to-high':
                sortQuery = { price: 1 };
                break;
            case 'alphabetically-high-to-low':
                sortQuery = { price: -1 };
                break;
            default:
                break;
        }

        // Fetch the properties from the database
        const properties = await Property.find(query).sort(sortQuery);

        return res.status(200).send({ success: true, data: properties })
    } catch (error) {
        console.log("error", error);
        res.status(404).send({ success: false, message: error.message })
    }
};

export {
    addNewProperty,
    getProperties,
    getOneProperty,
    uploadPropertyImage,
    deleteFromCloudinary,
    deleteExistingProperty,
    editSpecificProperty,
    getPropertiesBySearch,
};