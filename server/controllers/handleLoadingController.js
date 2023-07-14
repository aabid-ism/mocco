import conn from "../conn.js";

// <-------------------- GET UNREAD LOCAL NEWS POSTS -------------------->
export const getLocalNewsLoading = async (req, res) => {
  const readPostIndices = req.body.readPostIndices || [];

  try {
    // getting references to database and collection
    const db = conn.getDb();
    const newsCollection = await db.collection("local");

    // Query for unread news objects
    const unreadNews = await newsCollection
      .find({ postIndex: { $nin: readPostIndices } }) // Exclude read post indexes
      .sort({ postIndex: -1 }) // Sort by post index in descending order
      .limit(50) // Limit to 50 news objects
      .toArray();

    res.send(unreadNews).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
};

// <-------------------- GET UNREAD INTERNATIONAL NEWS POSTS -------------------->
export const getInternationalNewsLoading = async (req, res) => {
  const readPostIndices = req.body.readPostIndices || [];

  try {
    // getting references to database and collection
    const db = conn.getDb();
    const newsCollection = await db.collection("international");

    // Query for unread news objects
    const unreadNews = await newsCollection
      .find({ postIndex: { $nin: readPostIndices } }) // Exclude read post indexes
      .sort({ postIndex: -1 }) // Sort by post index in descending order
      .limit(50) // Limit to 50 news objects
      .toArray();

    res.send(unreadNews).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
};

// <-------------------- GET REMAINING NUMBER OF POSTS -------------------->
export const getNewsTags = async (req, res) => {
  const readPostIndices = req.body.readPostIndices || [];
  const reqTag = req.query.reqTag;
  if (!reqTag) {
    return res.send("Tag is Empty").status(400);
  }

  try {
    // getting references to database and collection
    const db = conn.getDb();
    const internationalNewsCollection = await db.collection("international");

    // Query for unread posts from international news collection with reqTag
    const unreadInternationalNews = await internationalNewsCollection
      .find({
        $and: [
          { postIndex: { $nin: readPostIndices } }, // Exclude read post indexes
          { mainTag: reqTag }, // match the Tag
        ],
      })
      .sort({ postIndex: -1 }) // Sort by post index in descending order
      .limit(50) // Limit to 50 news objects
      .toArray();

    const localNewsCollection = await db.collection("local");

    // Query for unread posts from local news collection with reqTag
    const unreadLocalNews = await localNewsCollection
      .find({
        $and: [
          { postIndex: { $nin: readPostIndices } }, // Exclude read post indexes
          { mainTag: reqTag }, // match the Tag
        ],
      })
      .sort({ postIndex: -1 }) // Sort by post index in descending order
      .limit(50) // Limit to 50 news objects
      .toArray();

    // combine two unread results and sort on postIndex
    let combinedResult = [...unreadLocalNews, ...unreadInternationalNews];
    combinedResult.sort(
      (a, b) => new Date(b.postIndex) - new Date(a.postIndex)
    );

    res.send(combinedResult).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
};
