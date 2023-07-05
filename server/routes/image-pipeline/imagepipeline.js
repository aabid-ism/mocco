// imports
import express from "express";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  newPipeline,
} from "@azure/storage-blob";
import multer from "multer";
import getStream from "into-stream";

// setting up upload strategy
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single("image");

// containers
const containerName2 = "images";

// constants
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };

// azure variables
const sharedKeyCredential = new StorageSharedKeyCredential(
  process.env.AZURE_STORAGE_ACCOUNT_NAME,
  process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY
);

const pipeline = newPipeline(sharedKeyCredential);

const blobServiceClient = new BlobServiceClient(
  `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
  pipeline
);

// Use a random number to generate a unique file name,
// removing "0." from the start of the string.
const getBlobName = (originalName) => {
  const identifier = Math.random().toString().replace(/0\./, "");
  return `${identifier}-${originalName}`;
};

const router = express.Router();

// Posting an Image
router.post("/", uploadStrategy, async (req, res) => {
  const today = new Date();
  const dateTimeString = today.toISOString();
  const dateOnly = dateTimeString.split("T")[0];
  const blobName = `${dateOnly}/${getBlobName(req.file.originalname)}`;

  // Check if the image URL is provided
  if (req.body.imageUrl) {
    // Extract the blob name from the provided image URL
    const path = req.body.imageUrl;
    const existingBlobName = path.slice(
      path.indexOf(containerName2) + containerName2.length + 1
    );

    // Get the "images" container
    const containerClient =
      blobServiceClient.getContainerClient(containerName2);

    // Check if a blob with the existing blob name exists
    const existingBlobClient =
      containerClient.getBlockBlobClient(existingBlobName);
    const exists = await existingBlobClient.exists();

    if (exists) {
      // Delete the existing blob
      await existingBlobClient.delete();
    }
  }

  // get the stream of bytes from req.file
  const stream = getStream(req.file.buffer);
  // get the "images" container
  const containerClient = blobServiceClient.getContainerClient(containerName2);
  // create a new blob with the unique name we generated
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  try {
    await blockBlobClient.uploadStream(
      stream,
      uploadOptions.bufferSize,
      uploadOptions.maxBuffers,
      { blobHTTPHeaders: { blobContentType: "image/jpeg" } }
    );
    // Construct the file path
    const filePath = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${containerName2}/${blobName}`;
    res.send(filePath).status(200);
  } catch (err) {
    console.log(err);
    return res.status(404).send(err);
  }
});

// Deleting an Image
router.post("/delete-image", async (req, res) => {
  try {
    // Check if the image URL is provided
    if (req.body.imgUrl) {
      // Extract the blob name from the provided image URL
      const path = req.body.imgUrl;
      const existingBlobName = path.slice(
        path.indexOf(containerName2) + containerName2.length + 1
      );

      // Get the "images" container
      const containerClient =
        blobServiceClient.getContainerClient(containerName2);

      // Check if a blob with the existing blob name exists
      const existingBlobClient =
        containerClient.getBlockBlobClient(existingBlobName);
      const exists = await existingBlobClient.exists();

      if (exists) {
        // Delete the existing blob
        await existingBlobClient.delete();
      }
    }
  } catch (err) {
    console.error(err);
  }
});

export default router;
