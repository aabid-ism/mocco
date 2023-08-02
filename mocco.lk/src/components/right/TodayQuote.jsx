import React, { useEffect } from "react";
import { fetchAllQuotes } from "../../services/FetchService";
import {
  useMoccoNewsFeedDispatchContext,
  useMoccoNewsFeedContext,
} from "../../providers/NewsProvider";
import "./fade.css";
import LoadingSpinner from "../loadspinner";
import { Carousel } from "react-bootstrap";

function TodayQuote() {
  const dispatch = useMoccoNewsFeedDispatchContext();
  const appState = useMoccoNewsFeedContext();
  const QUOTE_CHANGE_INTERVAL = 5000;

  useEffect(async () => {
    const response = await fetchAllQuotes();
    dispatch({
      type: "LOAD_ALL_QUOTES",
      payload: response,
    });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>
        <h3>Spotlight</h3>
        <hr></hr>
      </div>
      {!appState.is_loading ? (
        appState.quotes.length > 0 ? (
          <Carousel
            indicators={false}
            interval={QUOTE_CHANGE_INTERVAL}
            data-bs-theme="dark"
          >
            {appState.quotes.map((quoteData, index) => (
              <Carousel.Item
                key={index}
                style={{
                  paddingLeft: "50px",
                  paddingRight: "50px",
                  fontSize: "0.9rem",
                }}
              >
                <div style={{ display: "flex" }}>
                  <div>
                    <p>
                      {appState.language === "English"
                        ? quoteData.quote
                        : quoteData.s_quote}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontStyle: "italic",
                  }}
                >
                  <div>
                    <p
                      onClick={() => {
                        window.open(quoteData.url, "_blank");
                      }}
                    >
                      -{" "}
                      {appState.language === "English"
                        ? quoteData.author
                        : quoteData.s_author}
                    </p>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <p>No quotes available today</p>
        )
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}

export default TodayQuote;
