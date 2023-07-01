import axios from "axios";

// fetches and returns a list of news objects from MongoDB
export async function fetchDefaultFeed() {
  try {
    const response = await axios.get("http://127.0.0.1:5555/feed");
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// ------UNIT TESTS ---------

// const posts = await fetchDefaultFeed();
// console.log(posts);
