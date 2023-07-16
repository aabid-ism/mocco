import React from "react";
import TodayEvents from "./TodayEvents";
import TodayQuote from "./TodayQuote";
import DateString from "./DateString";

function RightSidebar() {
  return (
    <>
      <DateString />
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
