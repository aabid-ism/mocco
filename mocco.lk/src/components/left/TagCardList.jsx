import React from "react";
import TagCard from "./TagCard";
import { NewsType } from "../../enums";
import { useMoccoNewsFeedContext } from "../../providers/NewsProvider";

// importing Icons
import { AccidentsIcon } from "./TagIcons/TagIcons";
import { CrimeIcon } from "./TagIcons/TagIcons";
import { EconomyIcon } from "./TagIcons/TagIcons";
import { EducationIcon } from "./TagIcons/TagIcons";
import { EntertainmentIcon } from "./TagIcons/TagIcons";
import { EnvironmentIcon } from "./TagIcons/TagIcons";
import { HealthIcon } from "./TagIcons/TagIcons";
import { HumanitarianIcon } from "./TagIcons/TagIcons";
import { PoliticsIcon } from "./TagIcons/TagIcons";
import { SportsIcon } from "./TagIcons/TagIcons";
import { TechnologyIcon } from "./TagIcons/TagIcons";

function TagCardList() {
  const newsTagsList = Object.values(NewsType);
  const appState = useMoccoNewsFeedContext();
  let focusTag = appState.newsTag;
  const filteredNewsTagsList = newsTagsList.filter((tag) => tag !== "");

  const tagToIconMap = {
    Accidents: <AccidentsIcon />,
    Crime: <CrimeIcon />,
    Education: <EducationIcon />,
    Economy: <EconomyIcon />,
    Entertainment: <EntertainmentIcon />,
    Environment: <EnvironmentIcon />,
    Health: <HealthIcon />,
    Humanitarian: <HumanitarianIcon />,
    Politics: <PoliticsIcon />,
    Sports: <SportsIcon />,
    Technology: <TechnologyIcon />,
  };

  // spawning TagCards
  const tagCardList = filteredNewsTagsList.map((tag) => (
    <TagCard tag={tag} key={tag} focus={tag == focusTag}>
      {tagToIconMap[`${tag}`]}
    </TagCard>
  ));
  return <>{tagCardList}</>;
}

export default TagCardList;
