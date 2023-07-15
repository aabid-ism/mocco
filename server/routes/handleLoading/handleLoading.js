// Loading more posts for News, Extra and TagFeed
import express from "express";
import {
  getLocalNewsLoading,
  getInternationalNewsLoading,
  getNewsTags,
} from "../../controllers/handleLoadingController.js";

const router = express.Router();

/* 
    @route GET /handleloading/local-news/
    @vars body: readPostIndices (list of read postIndexes)
    @desc gets the next OUTPUT number of unread posts from the local collection
    @returns OUTPUT number or remaining number of unread posts
*/
router.get("/local-news/", getLocalNewsLoading);

/* 
    @route GET /handleloading/international-news/
    @vars body: readPostIndices
    @desc gets next 50 unread posts from international collection
    @returns OUTPUT number or remaining number of unread posts
*/
router.get("/international-news/", getInternationalNewsLoading);

/* 
    @route GET /handleloading/tag/
    @vars body: readPostIndices, query: reqTag
    @desc gets next 50 unread posts with the maintag of reqTag (from both local and international collections)
    @returns OUTPUT number or remaining number of posts, 400 if parameters are not provided
*/
router.get("/tag/", getNewsTags);

export default router;
