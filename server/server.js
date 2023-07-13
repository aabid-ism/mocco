// load environment variables
import("./loadEnv.js");

// load packages
import express from "express";
import cors from "cors";
import conn from "./conn.js";

// importing routes
import auth from "./routes/auth/auth.js";
import news from "./routes/news.js";
import image from "./routes/image-pipeline/imagepipeline.js";
import explorenews from "./routes/get-news/get-news-by-tag.js";
import loadposts from "./routes/get-news/loadposts.js";
import handleloading from "./routes/get-news/handleloading.js";
import swaggerUi from "swagger-ui-express";
import * as path from "path";
import { load } from "firebase-tools/lib/commands/index.js";

const app = express();
const PORT = process.env.PORT || 5555;

//  middleware
const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(express.json());
const getJsonFromFile = async (filePath) => {
  try {
    const fs = await import("fs");
    const jsonData = fs.readFileSync(filePath, "utf8");
    const jsonObject = JSON.parse(jsonData);
    return jsonObject;
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return null;
  }
};

const swaggerDocumentPath = path.join("./swagger-output.json");
const jsonObject = await getJsonFromFile(swaggerDocumentPath);

// defining routes
app.use("/auth", auth);
app.use("/news", news);
app.use("/image", image);
app.use("/explore-news", explorenews);
app.use("/handleloading", handleloading);
app.use("/loadposts", loadposts);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(jsonObject));

// Global error handling
app.use((err, _req, res, next) => {
  console.error(err);
  res.status(500).send("Uh oh! An unexpected error occured.");
});

app.listen(PORT, "0.0.0.0", async () => {
  await conn.connectToServer();
  console.log(`Server listening on port ${PORT}`);
});
