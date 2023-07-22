import express from "express";
import {
  getInternationalNews,
  getLocalNews,
  getUnpublishedNews,
  getLocalNewsByDate,
  getAllDropDowns,
  pushNews,
  approveLocalNews,
  editUnpublishedNews,
  editLocalNews,
  deleteUnpublishedNews,
  deleteLocalNews,
  deleteInternationalNews,
  getInternationalNewsByDate,
  approveInternationalNews,
  editInternationalNews,
  addLocalToInternational,
  addInternationalToLocal,
  exactPostNotification,
} from "../../controllers/newsController.js";
import requireAuth from "../../middlewares/requireAuth.js";

const router = express.Router();

router.get("/exact-post", exactPostNotification);

// GET ALL INTERNATIONAL NEWS FROM international COLLECTION.
router.get("/international-news", getInternationalNews);

// GET ALL LOCAL NEWS FROM local COLLECTION.
router.get("/local-news", getLocalNews);

// PUSH NEWS TO THE newsStage COLLECTION (UNPUBLISHED).
router.post("/push-news", requireAuth, pushNews);

// APPROVE LOCAL NEWS FOR PUBLICATION BY DELETING FROM newsStage AND INSERTING TO local COLLECTION.
router.post("/approve-local-news", requireAuth, approveLocalNews);

// GET ALL UNPUBLISHED NEWS FROM newsStage COLLECTION.
router.get("/get-unpublished-news", getUnpublishedNews);

// GET ALL PUBLISHED LOCAL NEWS FROM local COLLECTION BASED ON THE SELECTED DATE.
router.post("/get-local-news-by-date", getLocalNewsByDate);

// GET ALL DROP DOWNS FROM mainTags and secondaryTags COLLECTIONS.
router.get("/get-drop-downs", getAllDropDowns);

// EDIT UNPUBLISHED NEWS IN THE newsStage COLLECTION.
router.post("/edit-unpublished-news", requireAuth, editUnpublishedNews);

// EDIT PUBLISHED LOCAL NEWS IN THE local COLLECTION.
router.post("/edit-local-news", requireAuth, editLocalNews);

// DELETE UNPUBLISHED NEWS IN THE newsStage COLLECTION.
router.post("/delete-unpublished-news", requireAuth, deleteUnpublishedNews);

// DELETE PUBLISHED LOCAL NEWS IN THE local COLLECTION.
router.post("/delete-local-news", requireAuth, deleteLocalNews);

// GET ALL PUBLISHED INTERNATIONAL NEWS FROM THE International COLLECTION BASED ON THE SELECTED DATE.
router.post("/get-international-news-by-date", getInternationalNewsByDate);

// APPROVE INTERNATIONAL NEWS FOR PUBLICATION BY DELETING FROM newsStage AND INSERTING TO International COLLECTION.
router.post(
  "/approve-international-news",
  requireAuth,
  approveInternationalNews
);

// EDIT PUBLISHED INTERNATIONAL NEWS IN THE International COLLECTION.
router.post("/edit-international-news", requireAuth, editInternationalNews);

// DELETE PUBLISHED INTERNATIONAL NEWS IN THE International COLLECTION.
router.post("/delete-international-news", requireAuth, deleteInternationalNews);

// ADD LOCAL NEWS TO INTERNATIONAL NEWS FOR PUBLICATION BY DELETING FROM local AND INSERTING TO International COLLECTION.
router.post(
  "/add-local-to-international",
  requireAuth,
  addLocalToInternational
);

// ADD INTERNATIONAL NEWS TO LOCAL NEWS FOR PUBLICATION BY DELETING FROM International AND INSERTING TO local COLLECTION.
router.post(
  "/add-international-to-local",
  requireAuth,
  addInternationalToLocal
);

export default router;
