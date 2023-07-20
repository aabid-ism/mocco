import React from "react";
import TagCardList from "./TagCardList";

function LeftSidebar() {
  return (
    <div style={{ marginTop: "30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          paddingLeft: "10px",
        }}
      >
        <h3>Discover</h3>
      </div>

      <hr></hr>
      <TagCardList />
    </div>
  );
}

export default LeftSidebar;
