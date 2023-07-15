// Load environment variables
import("./loadEnv.js");

// Load packages
import express from "express";
import cors from "cors";
import conn from "./conn.js";

// Importing routes
import auth from "./routes/auth/auth.js";
import news from "./routes/news/news.js";
import image from "./routes/image-pipeline/imagepipeline.js";
import loadposts from "./routes/loadPosts/loadPosts.js";
import handleLoading from "./routes/handleLoading/handleLoading.js";
import swaggerUi from "swagger-ui-express";
import * as path from "path";

const app = express();
const PORT = process.env.PORT || 5555;

//  Middlewares
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

// Defining routes
app.use("/auth", auth);
app.use("/news", news);
app.use("/image", image);
app.use("/loadPosts", loadposts);
app.use("/handleLoading", handleLoading);
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
