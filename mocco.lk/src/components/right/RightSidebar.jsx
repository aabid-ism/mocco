import React from "react";
import TodayEvents from "./TodayEvents";
import TodayQuote from "./TodayQuote";

function RightSidebar() {
  return (
    <>
      <h3>Today</h3>
      <hr></hr>
      <TodayEvents />
      <h4>Today's Quote</h4>
      <hr></hr>
      <TodayQuote />
      <h4>Today's Sponsor</h4>
    </>
  );
}

export default RightSidebar;
