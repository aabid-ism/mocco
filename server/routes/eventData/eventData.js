import express from "express";
import {
  getEventData,
  editEventData,
  addEventData,
  deleteEventData,
} from "../../controllers/eventData.js";
import requireAuth from "../../middlewares/requireAuth.js";

const router = express.Router();

// GET EVENT DATA FROM events COLLECTION.
router.post("/get-event-data", getEventData);

// ADD EVENT DATA TO events COLLECTION.
router.post("/add-event-data", requireAuth, addEventData);

// EDIT EVENT DATA TO events COLLECTION.
router.post("/edit-event-data", requireAuth, editEventData);

// DELETE EVENT DATA FROM events COLLECTION.
router.post("/delete-event-data", requireAuth, deleteEventData);

export default router;
