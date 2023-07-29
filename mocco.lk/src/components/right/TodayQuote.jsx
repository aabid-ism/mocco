import React, { useState, useEffect } from "react";
import { fetchAllQuotes } from "../../services/FetchService";
import {
  useMoccoNewsFeedDispatchContext,
  useMoccoNewsFeedContext,
} from "../../providers/NewsProvider";
import "./fade.css";
import quote from "../../assets/quote.png";
import double_quotes from "../../assets/double-quotes.png";
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
        <h3>Bulletin</h3>
        <hr></hr>
      </div>
      {!appState.is_loading ? (
        appState.quotes.length > 0 ? (
          <Carousel
            controls={false}
            indicators={false}
            interval={QUOTE_CHANGE_INTERVAL}
            data-bs-theme="dark"
          >
            {appState.quotes.map((quoteData, index) => (
              <Carousel.Item key={index} style={{ paddingX: "25px" }}>
                <div style={{ display: "flex" }}>
                  <div>
                    <img src={quote} alt="Quotes" />
                  </div>
                  <div>
                    <p>
                      {appState.language === "English"
                        ? quoteData.quote
                        : quoteData.s_quote}
                    </p>
                  </div>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <p>
                      -{" "}
                      {appState.language === "English"
                        ? quoteData.author
                        : quoteData.s_author}
                    </p>
                  </div>
                  <div>
                    <img src={double_quotes} alt="Quotes" />
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
