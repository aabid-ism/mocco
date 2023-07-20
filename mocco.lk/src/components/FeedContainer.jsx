import React, { useEffect, useState, useRef, useCallback } from "react";
import NewsCard from "./NewsCard/NewsCard";
import Row from "react-bootstrap/Row";
import {
  useMoccoNewsFeedContext,
  useMoccoNewsFeedDispatchContext,
} from "../providers/NewsProvider";
import { fetchDefaultFeed, loadMorePosts } from "../services/FetchService";
import LoadingSpinner from "./loadspinner";
import LanguageToggle from "./left/LanguageToggle";
import Lottie from "lottie-react";
import TagAnimation from "./TagAnimation";
import { FeedType } from "../enums";

// import hook from "../assets/hook.json";
function FeedContainer() {
  // getting references for the dispatch function and appState(moccoContext)
  const dispatch = useMoccoNewsFeedDispatchContext();
  const appState = useMoccoNewsFeedContext();

  // ref is needed to directly access and mutate loading state within handlescroll
  const isLoadingMorePostsRef = useRef(false);
  // ref is needed to directly access and mutate a state variable from the handlescroll event handler
  let metaDataForLoading = useRef({
    feedTag: "LOCAL",
    newsTag: null,
    lastPostIndex: null,
  });
  // updating useRefs when the Feed Container Re-Renders
  function handleRefs() {
    // handle lastPostIndex
    if (appState.postFeed.length > 1) {
      metaDataForLoading.current.lastPostIndex =
        appState.postFeed[appState.postFeed.length - 1].postIndex;
      metaDataForLoading.current.feedTag = appState.feedTag;
      metaDataForLoading.current.newsTag = appState.newsTag;
    }
  }
  const handleScroll = async (event) => {
    const scrollY = window.scrollY; // scrolled position relative to the top
    const windowHeight = window.innerHeight; // height of viewport
    const documentHeight = document.documentElement.scrollHeight; // height of entire scrollable view

    // Check if scrolled to the bottom
    if (
      scrollY + windowHeight + 200 >= documentHeight &&
      !isLoadingMorePostsRef.current
    ) {
      // set loading to true to avoid calls while fetching is occurring
      isLoadingMorePostsRef.current = true;

      let morePosts;

      if (metaDataForLoading.current.feedTag == "LOCAL") {
        morePosts = await loadMorePosts(
          "LOCAL",
          metaDataForLoading.current.lastPostIndex
        );
        dispatch({
          type: "LOAD_TO_FEED",
          payload: morePosts,
        });
      } else if (metaDataForLoading.current.feedTag == "INTERNATIONAL") {
        morePosts = await loadMorePosts(
          "INTERNATIONAL",
          metaDataForLoading.current.lastPostIndex
        );
      } else if (metaDataForLoading.current.feedTag == "TAG") {
        morePosts = await loadMorePosts(
          "TAG",
          metaDataForLoading.current.lastPostIndex,
          metaDataForLoading.current.newsTag
        );
        dispatch({
          type: "LOAD_TO_TAG_FEED",
          payload: morePosts,
        });
      }

      // TIMEOUT TO AVOID UNNECESSARY MULTIPLE CALLS
      setTimeout(() => {
        isLoadingMorePostsRef.current = false;
      }, 500);
    }
  };

  useEffect(() => {
    handleRefs();
  });
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
      window.removeEventListener("scroll", handleScroll);
    };
  });

  // List of initial NewsCards
  const newsCardsList = appState.postFeed.map((newsObj) => (
    <NewsCard
      key={newsObj._id}
      heading={newsObj.title}
      sinhalaHeading={newsObj.sinhalaTitle}
      tag={newsObj.mainTag}
      description={newsObj.description}
      sinhalaDescription={newsObj.sinhalaDescription}
      source={newsObj.sourceName}
      sourceUrl={newsObj.sourceUrl}
      imageUrl={newsObj.imageUrl}
      lang={appState.language}
    />
  ));

  handleRefs();

  let feed = newsCardsList;
  console.log(appState);
  // const defaultOptions = {
  //   loop: true, // Set this to false if you don't want the animation to loop
  //   autoplay: true, // Set this to false if you don't want the animation to play automatically
  //   animationData: hook,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice", // Adjust the animation's position
  //   },
  // };

  // THE FEED
  return (
    <div style={{ margin: "0px" }}>
      {/* <img src="MOCCO.svg"></img> */}
      <Row
        className="d-sm-none"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <LanguageToggle />
      </Row>
      {appState.feedTag == FeedType.TAG && (
        <Row style={{ display: "flex", justifyContent: "center" }}>
          <TagAnimation tag={appState.newsTag} />
        </Row>
      )}
      {
        appState.is_loading ? (
          <div>
            <LoadingSpinner />
          </div>
        ) : (
          feed
        )
        // <Lottie options={defaultOptions} height={100} width={100} />
      }
    </div>
  );
}

export default FeedContainer;
