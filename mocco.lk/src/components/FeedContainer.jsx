import React, { useEffect } from "react";
import NewsCard from "./NewsCard";
import {
  useMoccoNewsFeedContext,
  useMoccoNewsFeedDispatchContext,
} from "../providers/NewsProvider";
import { fetchDefaultFeed } from "../services/FetchService";

function FeedContainer() {
  // getting references for the dispatch function and appState(moccoContext)
  const dispatch = useMoccoNewsFeedDispatchContext();
  const appState = useMoccoNewsFeedContext();

  useEffect(() => {
    // Fetching the latest news
    const fetchInitialPosts = async () => {
      const initialNewsPosts = await fetchDefaultFeed();

      dispatch({
        type: "FetchDefaultFeed",
        payload: initialNewsPosts,
      });
    };
    fetchInitialPosts();
  }, []);

  // List of initial NewsCards
  const newsCardsList = appState.postFeed.map((newsObj) => (
    <NewsCard
      key={newsObj._id}
      heading={newsObj.heading}
      description={newsObj.description}
    />
  ));

  const feed = newsCardsList;
  // THE FEED
  return <div style={{ padding: "80px" }}>{feed}</div>;
}

export default FeedContainer;
