import React, { useEffect } from "react";
import { fetchAllEvents } from "../../services/FetchService";
import {
  useMoccoNewsFeedDispatchContext,
  useMoccoNewsFeedContext,
} from "../../providers/NewsProvider";
import DateString from "./DateString";

function TodayEvents() {
  const dispatch = useMoccoNewsFeedDispatchContext();
  const appState = useMoccoNewsFeedContext();

  useEffect(async () => {
    const response = await fetchAllEvents();
    dispatch({
      type: "LOAD_ALL_EVENTS",
      payload: response,
    });
  }, []);

  return (
    <div>
      <DateString />
      <hr></hr>
      <div>
        {appState.events.length > 0 ? (
          appState.events.map((event) => (
            <div
              style={{
                display: "flex",
                textAlign: "left",
                cursor: "pointer",
                color: "black",
              }}
              onClick={() => {
                window.open(event.srcUrl, "_blank");
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "blue"; // Change the text color on hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "black"; // Revert text color
              }}
            >
              <p>{event.name}</p>
            </div>
          ))
        ) : (
          <p>No events available today</p>
        )}
      </div>
    </div>
  );
}

export default TodayEvents;
