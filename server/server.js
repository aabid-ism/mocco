// load environment variables
import("./loadEnv.js");

// load packages
import express from "express";
import cors from "cors";
import conn from "./conn.js";

// importing routes
import news from "./routes/news.js";

const app = express();
const PORT = process.env.PORT || 5555;
//  middleware
const corsOptions = {
    origin: "*",
  };
app.use(cors(corsOptions));
app.use(express.json());

// defining routes
app.use("/", news);

// Global error handling
app.use((err, _req, res, next) => {
    res.status(500).send("Uh oh! An unexpected error occured.");
  });

app.listen(PORT, "0.0.0.0", async () => {
    await conn.connectToServer();
    console.log(`Server listening on port ${PORT}`);
  });
  