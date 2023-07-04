import React, { useEffect, useState, useRef, useCallback } from "react";
import NewsCard from "./NewsCard";
import {
  useMoccoNewsFeedContext,
  useMoccoNewsFeedDispatchContext,
} from "../providers/NewsProvider";
import { fetchDefaultFeed, loadMorePosts } from "../services/FetchService";

function FeedContainer() {
  // getting references for the dispatch function and appState(moccoContext)
  const dispatch = useMoccoNewsFeedDispatchContext();
  const appState = useMoccoNewsFeedContext();

  // ref is needed to directly access and mutate loading state within handlescroll
  const isLoadingMorePostsRef = useRef(false);
  // ref is needed to directly access the createdAt Value of the last post rendered
  const lastPostCreatedAt = useRef(null);

  const handleScroll = async (event) => {
    // scrolled position relative to the top
    const scrollY = window.scrollY;
    // height of viewport
    const windowHeight = window.innerHeight;
    // height of entire scrollable view
    const documentHeight = document.documentElement.scrollHeight;
    // Check if scrolled to the bottom

    if (
      scrollY + windowHeight >= documentHeight &&
      !isLoadingMorePostsRef.current
    ) {
      // set loading to avoid multiple calls
      isLoadingMorePostsRef.current = true;

      console.log("Calling for more posts...");

      // API CALL
      const morePosts = await loadMorePosts(lastPostCreatedAt.current);

      dispatch({
        type: "LOAD_TO_FEED",
        payload: morePosts,
      });
      // TIMEOUT TO AVOID UNNECESSARY MULTIPLE CALLS
      setTimeout(() => {
        isLoadingMorePostsRef.current = false;
      }, 2000);
    }
  };
  useEffect(() => {
    // dispatch({ type: "SET_LOADING" });
    // Fetching the latest news
    const fetchInitialPosts = async () => {
      const initialNewsPosts = await fetchDefaultFeed();
      dispatch({
        type: "DispatchDefaultFeed",
        payload: initialNewsPosts,
      });
    };

    fetchInitialPosts();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      console.log("being destroyed...");
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // List of initial NewsCards
  const newsCardsList = appState.postFeed.map((newsObj) => (
    <NewsCard
      key={newsObj._id}
      heading={newsObj.title}
      description={newsObj.description}
      imageUrl={newsObj.imageUrl}
    />
  ));
  if (appState.postFeed.length > 1) {
    lastPostCreatedAt.current =
      appState.postFeed[appState.postFeed.length - 1].createdAt;
  }
  let feed = newsCardsList;
  // THE FEED
  return (
    <div style={{ padding: "80px" }}>
      {feed}
      {appState.is_loading && <h2> loading...</h2>}
    </div>
  );
}

export default FeedContainer;
