// imports
import express from "express";
import {
  uploadEnglishImage,
  uploadSinhalaImage,
  deleteEnglishImage,
  deleteSinhalaImage,
} from "../../controllers/notificationImagePipelineController.js";
import multer from "multer";

const router = express.Router();

// setting up upload strategy
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single(
  "notification-image"
);

// Posting an English Notification Image
router.post("/english", uploadStrategy, uploadEnglishImage);

// Posting an Sinhala Notification Image
router.post("/sinhala", uploadStrategy, uploadSinhalaImage);

// Deleting an english Notification Image
router.post("/delete-english-image", deleteEnglishImage);

// Deleting a sinhala Notification Image
router.post("/delete-sinhala-image", deleteSinhalaImage);

export default router;
