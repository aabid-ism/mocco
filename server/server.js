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
const app = express();
const PORT = process.env.PORT || 5555;

//  middleware
const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(express.json());

// defining routes
app.use("/auth", auth);
app.use("/news", news);
app.use("/image", image);
app.use("/explore-news", explorenews);
app.use("/loadposts", loadposts);

// Global error handling
app.use((err, _req, res, next) => {
  console.error(err);
  res.status(500).send("Uh oh! An unexpected error occured.");
});

app.listen(PORT, "0.0.0.0", async () => {
  await conn.connectToServer();
  console.log(`Server listening on port ${PORT}`);
});
