import React from "react";
import DatePicker from "./DatePicker";
import TagCard from "./TagCard";
import TagCardList from "./TagCardList";
import LanguageToggle from "./LanguageToggle";

function LeftSidebar() {
  return (
    <div>
      {/* <DatePicker /> */}
      <h3>Discover</h3>
      <hr></hr>
      <TagCardList />
    </div>
  );
}

export default LeftSidebar;
