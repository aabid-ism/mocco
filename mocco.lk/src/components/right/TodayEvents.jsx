import React, { useEffect } from "react";
import { fetchAllEvents } from "../../services/FetchService";
import {
  useMoccoNewsFeedDispatchContext,
  useMoccoNewsFeedContext,
} from "../../providers/NewsProvider";
import DateString from "./DateString";
import LoadingSpinner from "../loadspinner";
import EventButton from "./EventButton";

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
      <div
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {!appState.is_loading ? (
          appState.events.length > 0 ? (
            appState.events.map((event) => (
              <div>
                <EventButton event={event} lang={appState.language} />
              </div>
            ))
          ) : (
            <p>No events available today</p>
          )
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
}

export default TodayEvents;
