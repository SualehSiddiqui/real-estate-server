import {
    addNewProperty,
    getProperties,
    uploadPropertyImage,
    deleteFromCloudinary,
    deleteExistingProperty,
    editSpecificProperty,
    getCityOrState,
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
    const filters = req.body;
    getProperties(filters, res)
}

const uploadImage = (req, res) => {
    const { id } = req.params;
    uploadPropertyImage(id, req, res);
}

const deleteImage = (req, res) => {
    const { public_id, id } = req.params;
    deleteFromCloudinary(public_id, id, res);
}

const getAllCityOrState = (req, res) => {
    const { type, q = '' } = req.query;
    getCityOrState(type, q, res);
}

export {
    addProperty,
    getAllProperties,
    uploadImage,
    deleteImage,
    deleteProperty,
    editProperty,
    getAllCityOrState,
};