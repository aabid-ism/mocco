// imports
import express from "express";
import {
  uploadImage,
  deleteImage,
} from "../../controllers/imagePipelineController.js";
import multer from "multer";

const router = express.Router();

// setting up upload strategy
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single("image");

// Posting an Image
router.post("/", uploadStrategy, uploadImage);

// Deleting an Image
router.post("/delete-image", deleteImage);

export default router;
