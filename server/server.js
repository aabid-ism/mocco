// Load environment variables
import("./loadEnv.js");

// Load packages
import express from "express";
import cors from "cors";
import conn from "./conn.js";
import rateLimit from "express-rate-limit";

// Importing routes
import auth from "./routes/auth/auth.js";
import news from "./routes/news/news.js";
import image from "./routes/image-pipeline/imagepipeline.js";
import event from "./routes/eventImagePipeline/eventImagePipeline.js";
import loadposts from "./routes/loadPosts/loadPosts.js";
import handleLoading from "./routes/handleLoading/handleLoading.js";
import events from "./routes/eventData/eventData.js";
import quotes from "./routes/quotes/quotes.js";

import swaggerUi from "swagger-ui-express";
import * as path from "path";

const app = express();
const PORT = process.env.PORT || 5555;

//  Middlewares
const allowedOrigins = [
  "https://mocco-admin.web.app",
  "https://mocco.lk",
<<<<<<< HEAD
  "http://127.0.0.1:5173",
=======
  "http://localhost:5173",
>>>>>>> b4d83ac (added localhost to allowed origins)
];

const corsOptions = {
  origin: allowedOrigins,
};

// Limit requests from a single IP to 100 requests per hour
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 500,
});

app.use(limiter);
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
app.use("/event-image", event);
app.use("/loadPosts", loadposts);
app.use("/handleLoading", handleLoading);
app.use("/events", events);
app.use("/quotes", quotes);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(jsonObject));

// Global error handling
app.use((err, _req, res, next) => {
  console.error(err);
  res.status(500).send("Uh oh! An unexpected error occured.");
});

app.listen(PORT, "0.0.0.0", async () => {
  await conn.connectToServer();
  console.log(`Server listening on port ${PORT}`);
});
