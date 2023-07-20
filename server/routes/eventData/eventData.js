import express from "express";
import {
  getEventData,
  editEventData,
  addEventData,
  deleteEventData,
} from "../../controllers/eventData.js";

const router = express.Router();

// GET EVENT DATA FROM events COLLECTION.
router.post("/get-event-data", getEventData);

// ADD EVENT DATA TO events COLLECTION.
router.post("/add-event-data", addEventData);

// EDIT EVENT DATA TO events COLLECTION.
router.post("/edit-event-data", editEventData);

// DELETE EVENT DATA FROM events COLLECTION.
router.post("/delete-event-data", deleteEventData);

export default router;
