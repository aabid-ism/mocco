import conn from "../conn.js";

// <-------------------- GET REMAINING NUMBER OF LOCAL NEWS POSTS -------------------->
export const getLocalNews = async (req, res) => {
  const ref_postIndex = parseInt(req.query.ref_postIndex);
  const OUTPUT = 10;

  if (!ref_postIndex) {
    return res.send("ref_postIndex is required").status(400);
  }

  try {
    // getting references to database and collection
    const db = conn.getDb();
    const localNewsCollection = await db.collection("local");

    const result = await localNewsCollection
      .aggregate([
        {
          $match: {
            postIndex: { $lt: ref_postIndex },
          },
        },
        {
          $sort: { postIndex: -1 },
        },
        {
          $limit: OUTPUT,
        },
      ])
      .toArray();

    res.send(result).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
};

// <-------------------- GET REMAINING NUMBER OF INTERNATIONAL NEWS POSTS -------------------->
export const getInternationalNews = async (req, res) => {
  const ref_postIndex = parseInt(req.query.ref_postIndex);
  const OUTPUT = 10;

  if (!ref_postIndex) {
    return res.send("ref_postIndex is required").status(400);
  }
  try {
    // getting references to database and collection
    const db = conn.getDb();
    const internationalNewsCollection = await db.collection("international");

    const result = await internationalNewsCollection
      .aggregate([
        {
          // objID should be replaced by postIndex
          $match: {
            postIndex: { $lt: ref_postIndex },
          },
        },
        {
          $sort: { postIndex: -1 },
        },
        {
          $limit: OUTPUT,
        },
      ])
      .toArray();

    res.send(result).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
};

// <-------------------- GET REMAINING NUMBER OF POSTS -------------------->
export const getNewsTags = async (req, res) => {
  const ref_postIndex = parseInt(req.query.ref_postIndex);
  const req_tag = req.query.req_tag;
  const OUTPUT = 10;

  if (!ref_postIndex) {
    return res.send("ref_postIndex is required").status(400);
  }

  if (!req_tag) {
    return res.send("req_tag is required!").status(404);
  }

  try {
    // getting references to database and collection
    const db = await conn.getDb();
    const internationalNewsCollection = await db.collection("international");
    const localNewsCollection = await db.collection("local");

    // finding top  posts from news collection
    const localNewsResult = await localNewsCollection
      .aggregate([
        {
          // objID should be replaced by postIndex
          $match: {
            mainTag: req_tag,
            postIndex: { $lt: ref_postIndex },
          },
        },
        {
          $sort: { postIndex: -1 },
        },
        {
          $limit: OUTPUT,
        },
      ])
      .toArray();
    // finding top  posts from life collection
    const internationalNewsResult = await internationalNewsCollection
      .aggregate([
        {
          // objID should be replaced by postIndex
          $match: {
            mainTag: req_tag,
            postIndex: { $lt: ref_postIndex },
          },
        },
        {
          $sort: { postIndex: -1 },
        },
        {
          $limit: OUTPUT,
        },
      ])
      .toArray();

    // filtering out the top posts from the two results
    // Sort the documents based on the 'createdAt' field
    let combinedResult = [...localNewsResult, ...internationalNewsResult];
    combinedResult.sort(
      (a, b) => new Date(b.postIndex) - new Date(a.postIndex)
    );

    // Extract the first OUPUT number of documents with the earliest 'createdAt' values
    const filteredDocuments = combinedResult.slice(0, OUTPUT);

    res.send(filteredDocuments).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
};
