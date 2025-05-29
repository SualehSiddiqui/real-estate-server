import {
    addProperty,
    getAllProperties,
    uploadImage,
    deleteImage,
    deleteProperty,
    editProperty,
} from "../controllers/property/index.js";

import express from "express";
import upload from "../middleware/multer.js";

const Router = express.Router();

Router.post('/all', getAllProperties);
Router.post('/', addProperty);
Router.post('/edit/:id', editProperty);
Router.delete('/delete/:id', deleteProperty);
Router.post('/image/:id', upload.array('files'), uploadImage)
Router.delete('/image/:id/:public_id', deleteImage)

export default Router;