import {
    addProperty,
    getAllProperties,
    getSpecificProperty,
    uploadImage,
    deleteImage,
    deleteProperty,
    editProperty,
    getSpecificPropertiesBySearch
} from "../controllers/property/index.js";

import express from "express";
import upload from "../middleware/multer.js";

const Router = express.Router();

Router.post('/', addProperty);
Router.post('/edit/:id', editProperty);
Router.delete('/delete/:id', deleteProperty);
Router.get('/:status', getAllProperties);
Router.get('/one/:id', getSpecificProperty);
Router.post('/image/:id', upload.array('files'), uploadImage)
Router.delete('/image/:id/:public_id', deleteImage)
Router.post('/search', getSpecificPropertiesBySearch);

export default Router;