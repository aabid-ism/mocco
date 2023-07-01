import React from "react";
import TagCard from "./TagCard";

// All Tags Array
const news_categories = [
  "Arts and Culture",
  "Business and Finance",
  "Crime",
  "Education",
  "Entertainment",
  "Environment",
  "Health and Medicine",
  "International",
  "Lifestyle",
  "Opinion",
  "Politics",
  "Religion",
  "Science",
  "Sports",
  "Travel and Tourism",
  "Technology",
];

const tagCardList = news_categories.map((tag) => (
  <TagCard tag={tag} key={tag} />
));

function TagCardList() {
  return <>{tagCardList}</>;
}

export default TagCardList;
