import React from "react";
import { Button, ToggleButton } from "react-bootstrap";
import { loadMorePosts } from "../../services/FetchService";
import { useMoccoNewsFeedDispatchContext } from "../../providers/NewsProvider";
import "./TagCard.css";
import "../../assets/tagIcons/Politics.svg";

function TagCard(props) {
  const dispatch = useMoccoNewsFeedDispatchContext();

  async function sendTagFeedRequest() {
    // fetch
    const postData = await loadMorePosts("TAG", 999999, props.tag);
    // dispatch
    dispatch({
      type: "SET_TAG_FEED",
      // toUpperCase because in the provider we use enums.js
      payload: { tag: props.tag.toUpperCase(), data: postData },
    });
  }

  return (
    <div>
      <Button
        style={{
          display: "flex",
          justifyContent: "flex-start",
          width: "200px",
          padding: "10px",
          borderWidth: "0",
        }}
        variant="light"
        className="tag-button"
        size="md"
        onClick={sendTagFeedRequest}
        active={props.focus}
      >
        {props.children}
        {props.tag}
      </Button>{" "}
    </div>
  );
}

export default TagCard;
