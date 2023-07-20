// imports
import express from "express";
import {
  uploadEventImage,
  deleteEventImage,
} from "../../controllers/eventImageController.js";
import multer from "multer";

const router = express.Router();

// setting up upload strategy
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single("image");

// Posting an Image
router.post("/", uploadStrategy, uploadEventImage);

// Deleting an Image
router.post("/delete-event-image", deleteEventImage);

export default router;
