import baseAxios from "../utility/baseAxios.js";

// fetches and returns a list of news objects from MongoDB
export async function fetchDefaultFeed() {
  try {
    const response = await baseAxios.get("news/local-news");
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchIntlNews() {
  try {
    const response = await baseAxios.get("news/international-news");
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// load more posts
export async function loadMorePosts(post_type, ref_postIndex, tag = null) {
  if (post_type == "LOCAL") {
    try {
      const response = await baseAxios.get(
        `/loadposts/local-news/?ref_postIndex=${ref_postIndex}/`
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  } else if (post_type == "TAG") {
    try {
      const response = await baseAxios.get(
        `/loadPosts/tag/?ref_postIndex=${ref_postIndex}&req_tag=${tag.toLowerCase()}`
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  } else if (post_type == "INTERNATIONAL") {
    try {
      const response = await baseAxios.get(
        `/loadPosts/international-news/?ref_postIndex=${ref_postIndex}}/`
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}

// load quotes
export async function fetchAllQuotes() {
  try {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    const response = await baseAxios.post("quotes/get-quotes", {
      date: formattedDate,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// load events
export async function fetchAllEvents() {
  try {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    const response = await baseAxios.post("events/get-event-data", {
      date: formattedDate,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// ------UNIT TESTS ---------

// const posts = await fetchDefaultFeed();
// console.log(posts);
