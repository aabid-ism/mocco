import React from "react";
import DatePicker from "./DatePicker";
import TagCard from "./TagCard";
import TagCardList from "./TagCardList";
import LanguageToggle from "./LanguageToggle";

function LeftSidebar() {
  return (
    <div>
      <LanguageToggle />
      <DatePicker />
      <TagCardList />
    </div>
  );
}

export default LeftSidebar;
