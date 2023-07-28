import React from "react";
import TodayEvents from "./TodayEvents";
import TodayQuote from "./TodayQuote";

function RightSidebar() {
  return (
    <div>
      <div style={{ marginTop: "30px" }}>
        <TodayQuote />
      </div>
      <div style={{ marginTop: "70px" }}>
        <TodayEvents />
      </div>
    </div>
  );
}

export default RightSidebar;
