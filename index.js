import express from "express";
import cors from "cors";
import Router from "./Routes/index.js";
import mongoose from "./config/db.js";
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 8000;

// Allowed origins
const allowedOrigins = [
    'https://real-estate-website-six-coral.vercel.app', // Local development
    'http://localhost:5173', // Local development
    // Add other origins as needed
];

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            // Allow requests with no origin (like mobile apps or curl requests)
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};

// Middleware
app.use(cors(corsOptions));

// Checking MongoDB connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function () {
    console.log("db connected");
});

// Tells that data is coming in JSON format
app.use(express.json());

// To write HTML and CSS in backend
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use("/api", Router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});