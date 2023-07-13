import baseAxios from "../utility/baseAxios.js";

// fetches and returns a list of news objects from MongoDB
export async function fetchDefaultFeed() {
  try {
    const response = await baseAxios.get("news/feed");
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// load more posts
export async function loadMorePosts(post_type, ref_postIndex, tag = null) {
  if (post_type == "ALL") {
    try {
      const response = await baseAxios.get(
        `/loadposts/news/?ref_postIndex=${ref_postIndex}`
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  } else if (post_type == "TAG") {
    try {
      const response = await baseAxios.get(
        `/loadposts/news/?ref_postIndex=${ref_postIndex}`
      );
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}

// ------UNIT TESTS ---------

const posts = await fetchDefaultFeed();
console.log(posts);
