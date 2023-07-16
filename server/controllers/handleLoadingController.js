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

// <-------------------- GET TODAY NEWS POSTS -------------------->
export const getTodayNews = async (req, res) => {
  // get client's current Date Time
  const originalTime = req.query.todayDateTime;

  // Extract the date part and the time part
  const [datePart, timeAndOffsetPart] = originalTime.split("T");
  // Extract the time part and the offset part
  const [timePart, offsetPart] = timeAndOffsetPart.split("+");

  // Create the updated date-time string by appending the desired time and the offset
  const updatedDateString = `${datePart}T00:00:00+${offsetPart}`;

  // gets converted to Zulu Time automatically
  const currentDateTime = new Date(updatedDateString);

  try {
    // getting references to database and collection
    const db = conn.getDb();
    const intlCollection = await db.collection("international");
    const localCollection = await db.collection("local");

    // Query for today's local news objects
    const todayLocal = await localCollection
      .find({ createdAt: { $gt: currentDateTime } }) // greater than 00:00 today
      .sort({ postIndex: -1 }) // Sort by post index in descending order
      // .limit(50)
      .toArray();

    // Query for today's intlnews objects
    const todayIntl = await intlCollection
      .find({ createdAt: { $gt: currentDateTime } }) // greater than 00:00 today
      .sort({ postIndex: -1 }) // Sort by post index in descending order
      // .limit(50)
      .toArray();

    // combine two unread results and sort on postIndex
    let combinedResult = [...todayLocal, ...todayIntl];
    combinedResult.sort(
      (a, b) => new Date(b.postIndex) - new Date(a.postIndex)
    );

    res.send(combinedResult).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
};
