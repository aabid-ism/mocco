import express from "express";
import {
  getQuotes,
  editQuotes,
  addQuotes,
  deleteQuotes,
} from "../../controllers/quotesController.js";
import requireAuth from "../../middlewares/requireAuth.js";

const router = express.Router();

// GET QUOTES FROM quotes COLLECTION.
router.post("/get-quotes", getQuotes);

// ADD QUOTES TO quotes COLLECTION.
router.post("/add-quotes", requireAuth, addQuotes);

// EDIT QUOTES TO quotes COLLECTION.
router.post("/edit-quotes", requireAuth, editQuotes);

// DELETE QUOTES FROM quotes COLLECTION.
router.post("/delete-quotes", requireAuth, deleteQuotes);

export default router;
