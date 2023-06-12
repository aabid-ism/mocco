import conn from "../conn.js";
import express from "express";

const router = express.Router();

router.get("/",  async (req, res) => {
    try {
            const db = conn.getDb();
            const collection = await db.collection("news");
            const results = await collection.find({}).limit(50).toArray();
            res.send(results).status(200);
    } 
    catch (error) {
        res.send(error).status(500);
    }
    });


export default router;