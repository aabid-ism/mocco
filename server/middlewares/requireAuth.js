import jwt from "jsonwebtoken";
import conn from "../conn.js";
import { ObjectId } from "mongodb";

const requireAuth = async (req, res, next) => {
  if (req.method === "POST") {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const token = authorization.split(" ")[1];
    try {
      const { _id } = jwt.verify(token, process.env.SECRET_KEY);

      // Convert _id string to ObjectId
      const userId = new ObjectId(_id);

      // getting references to database and collection
      const db = conn.getDb();
      const authorsCollection = await db.collection("authors");
      req.user = await authorsCollection.findOne(
        { _id: userId },
        { projection: { _id: 1 } }
      );

      next();
    } catch (err) {
      return res.status(401).json({ message: "Request is not authorized" });
    }
  } else {
    next();
  }
};

export default requireAuth;
