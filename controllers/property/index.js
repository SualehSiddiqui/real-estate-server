import {
    addNewProperty,
    getProperties,
    uploadPropertyImage,
    deleteFromCloudinary,
    deleteExistingProperty,
    editSpecificProperty,
    getPropertiesBySearch
} from '../../service/index.js';

const addProperty = (req, res) => {
    const property = req.body;
    addNewProperty(property, res)
}

const deleteProperty = (req, res) => {
    const { id } = req.params;
    deleteExistingProperty(id, res)
}

const editProperty = (req, res) => {
    const { id } = req.params;
    const property = req.body;
    editSpecificProperty(id, property, res)
}

const getAllProperties = (req, res) => {
    const { page, size, status } = req.params;
    getProperties(page, size, status, res)
}

const uploadImage = (req, res) => {
    const { id } = req.params;
    uploadPropertyImage(id, req, res);
}

const deleteImage = (req, res) => {
    const { public_id, id } = req.params;
    deleteFromCloudinary(public_id, id, res);
}

const getSpecificPropertiesBySearch = (req, res) => {
    const { searchValue } = req.params;
    getPropertiesBySearch(searchValue, res);
}

export {
    addProperty,
    getAllProperties,
    uploadImage,
    deleteImage,
    deleteProperty,
    editProperty,
    getSpecificPropertiesBySearch
};