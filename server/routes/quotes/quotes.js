import express from "express";
import {
  getQuotes,
  editQuotes,
  addQuotes,
  deleteQuotes,
} from "../../controllers/quotesController.js";

const router = express.Router();

// GET QUOTES FROM quotes COLLECTION.
router.post("/get-quotes", getQuotes);

// ADD QUOTES TO quotes COLLECTION.
router.post("/add-quotes", addQuotes);

// EDIT QUOTES TO quotes COLLECTION.
router.post("/edit-quotes", editQuotes);

// DELETE QUOTES FROM quotes COLLECTION.
router.post("/delete-quotes", deleteQuotes);

export default router;
