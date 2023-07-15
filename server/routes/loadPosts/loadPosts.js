// Loading more posts for News, Extra and TagFeed
import express from "express";
import {
  getLocalNews,
  getInternationalNews,
  getNewsTags,
} from "../../controllers/loadingPostController.js";

const router = express.Router();

/* 
    @route GET /loadposts/local-news/
    @query vars: ref_postIndex
    @desc gets the next OUTPUT number of posts with postIndex lower than ref_postIndex from the local collection
    @returns OUTPUT number or remaining number of posts, 400 if ref_postIndex not provided
*/
router.get("/local-news/", getLocalNews);

/* 
    @route GET /loadposts/international-news/
    @query vars: ref_postIndex
    @desc gets next 20 posts with postIndex lower than ref_postIndex from the international collection
    @returns OUTPUT numberor remaining number of posts, 400 if ref_postIndex not provided
*/
router.get("/international-news/", getInternationalNews);

/* 
    @route GET /loadposts/tag/
    @query vars: ref_postIndex, req_tag
    @desc gets next 20 posts with postIndex lower than ref_postIndex and matches req_tag from both collections
    @returns OUTPUT number or remaining number of posts, 400 if parameters are not provided
*/
router.get("/tag/", getNewsTags);

export default router;
