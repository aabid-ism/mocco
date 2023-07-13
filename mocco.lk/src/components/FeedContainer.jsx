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
  // ref is needed to directly access and mutate a state variable from the handlescroll event handler
  const metaDataForLoading = useRef({
    feedtag: "NEWS",
    newstag: null,
    lastPostIndex: null,
  });

  const handleScroll = async (event) => {
    const scrollY = window.scrollY; // scrolled position relative to the top
    const windowHeight = window.innerHeight; // height of viewport
    const documentHeight = document.documentElement.scrollHeight; // height of entire scrollable view

    // Check if scrolled to the bottom
    if (
      scrollY + windowHeight >= documentHeight &&
      !isLoadingMorePostsRef.current
    ) {
      // set loading to true to avoid calls while fetching is occurring
      isLoadingMorePostsRef.current = true;

      let morePosts;
      console.log(metaDataForLoading.current);
      if (metaDataForLoading.current.feedtag == "NEWS") {
        morePosts = await loadMorePosts(
          "ALL",
          metaDataForLoading.current.lastPostIndex
        );
      } else if (metaDataForLoading.current.feedtag == "LIFESTYLE") {
        morePosts = await loadMorePosts(
          "LIFESTYLE",
          metaDataForLoading.current.lastPostIndex
        );
      } else if (metaDataForLoading.current.feedtag == "TAG") {
        morePosts = await loadMorePosts(
          "TAG",
          metaDataForLoading.current.lastPostIndex,
          metaDataForLoading.current.newstag
        );
      }
      if (morePosts) {
        dispatch({
          type: "LOAD_TO_FEED",
          payload: morePosts,
        });
      }

      // TIMEOUT TO AVOID UNNECESSARY MULTIPLE CALLS
      setTimeout(() => {
        isLoadingMorePostsRef.current = false;
      }, 1000);
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
      window.removeEventListener("scroll", () =>
        console.log("handle scroll destroyed!")
      );
    };
  });

  // List of initial NewsCards
  const newsCardsList = appState.postFeed.map((newsObj) => (
    <NewsCard
      key={newsObj._id}
      heading={newsObj.title}
      sinhalaHeading={newsObj.sinhalaTitle}
      description={newsObj.description}
      sinhalaDescription={newsObj.sinhalaDescription}
      imageUrl={newsObj.imageUrl}
      lang={appState.language}
    />
  ));
  if (appState.postFeed.length > 1) {
    metaDataForLoading.current.lastPostIndex =
      appState.postFeed[appState.postFeed.length - 1].postIndex;
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
