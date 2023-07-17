import { storage } from "../firebase-config/firebaseConfig.js";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
  getMetadata,
} from "firebase/storage";

// Use a random number to generate a unique file name,
// removing "0." from the start of the string.
const getImageFileName = (originalName) => {
  const identifier = Math.random().toString().replace(/0\./, "");
  return `${identifier}-${originalName}`;
};

// <-------------------- UPLOAD AN IMAGE TO FIREBASE -------------------->
export const uploadImage = async (req, res) => {
  let dateOnly;

  // checking whether the imageUrl is available or not.
  if (req.body.imageUrl) {
    // finding previous date in the url.
    const dateRegex = /(\d{4}-\d{2}-\d{2})/;
    const previousDate =
      req.body.imageUrl && typeof req.body.imageUrl === "string"
        ? req.body.imageUrl.match(dateRegex)
        : null;
    dateOnly = previousDate[1];
  } else {
    const today = new Date();
    const dateTimeString = today.toISOString();
    dateOnly = dateTimeString.split("T")[0];
  }

  // finalised image file path.
  const imageFilePath = `r_img/${dateOnly}/${getImageFileName(
    req.file.originalname
  )}`;

  const imageRef = ref(storage, imageFilePath);

  // adding the file data type.
  const metaData = {
    contentType: req.file.mimetype,
  };

  try {
    const snapShot = await uploadBytesResumable(
      imageRef,
      req.file.buffer,
      metaData
    );

    // getting the image url and returning it.
    const filePath = await getDownloadURL(snapShot.ref);
    res.send(filePath).status(200);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// <-------------------- DELETE AN IMAGE FROM FIREBASE-------------------->
export const deleteImage = async (req, res) => {
  try {
    // Check if the image URL is provided
    if (req.body.imgUrl) {
      const url = req.body.imgUrl;

      // get file name from url
      const regex = /%2F(.*?)\?alt=media/;
      const match = url.match(regex);
      if (match && match[1]) {
        const imagePath = decodeURIComponent(match[1]);
        const deleteRef = ref(storage, `r_img/${imagePath}`);

        // checking if the image is available
        getMetadata(deleteRef)
          .then(() => {
            deleteObject(deleteRef)
              .then(() => {
                res.status(200).json({ message: "Image deleted successfully" });
              })
              .catch((deleteError) => {
                res.status(500).json({ message: deleteError });
              });
          })
          .catch((error) => {
            if (error.code === "storage/object-not-found") {
              res.status(500).json({ message: "Image doesnt exist" });
            } else {
              res.status(500).json({ message: "Internal Server Error" });
            }
          });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
