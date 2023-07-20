import React from "react";
import Lottie from "lottie-react";

import Accidents from "../assets/animations/Accidents.json";
import Crime from "../assets/animations/Crime.json";
import Education from "../assets/animations/Education.json";
import Economy from "../assets/animations/Economy.json";
import Entertainment from "../assets/animations/Entertainment.json";
import Environment from "../assets/animations/Environment.json";
import Health from "../assets/animations/Health.json";
import Humanitarian from "../assets/animations/Humanitarian.json";
import Politics from "../assets/animations/Politics.json";
import Sports from "../assets/animations/Sports.json";
import Technology from "../assets/animations/Technology.json";

function TagAnimation(props) {
  const style = {
    height: 100,
  };

  const tagToAnimationMap = {
    Accidents: Accidents,
    Crime: Crime,
    Education: Education,
    Economy: Economy,
    Entertainment: Entertainment,
    Environment: Environment,
    Health: Health,
    Humanitarian: Humanitarian,
    Politics: Politics,
    Sports: Sports,
    Technology: Technology,
  };

  return (
    <div>
      <Lottie
        animationData={tagToAnimationMap[props.tag]}
        style={style}
        loop={true}
      />
      <h2>{props.tag}</h2>
    </div>
  );
}

export default TagAnimation;
