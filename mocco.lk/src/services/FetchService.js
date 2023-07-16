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

// load more posts
export async function loadMorePosts(post_type, ref_postIndex, tag = null) {
  if (post_type == "ALL") {
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
  }
}

// ------UNIT TESTS ---------

// const posts = await fetchDefaultFeed();
// console.log(posts);
