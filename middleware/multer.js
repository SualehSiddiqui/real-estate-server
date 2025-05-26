import multer from "multer";

// // Set up multer to save files to the local 'images' directory
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'images');
//     },
//     filename: function (req, file, cb) {
//         const fileName = file.originalname;
//         cb(null, Date.now() + '-' + fileName.replaceAll(" ", ""));
//     }
// });

// const upload = multer({ storage: storage });
// Set up multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export default upload;