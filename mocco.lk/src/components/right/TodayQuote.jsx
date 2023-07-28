import React, { useState, useEffect } from "react";
import { fetchAllQuotes } from "../../services/FetchService";
import {
  useMoccoNewsFeedDispatchContext,
  useMoccoNewsFeedContext,
} from "../../providers/NewsProvider";
import "./fade.css";
import quote from "../../assets/quote.png";
import double_quotes from "../../assets/double-quotes.png";

function TodayQuote() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const dispatch = useMoccoNewsFeedDispatchContext();
  const appState = useMoccoNewsFeedContext();
  // const [fadeIn, setFadeIn] = useState(true);

  useEffect(async () => {
    const response = await fetchAllQuotes();
    dispatch({
      type: "LOAD_ALL_QUOTES",
      payload: response,
    });
  }, []);

  // Update the displayed quote every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // setFadeIn(!fadeIn);
      setCurrentQuoteIndex(
        (prevIndex) => (prevIndex + 1) % appState.quotes.length
      );
    }, 5000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [appState]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>
        <h3>Bulletin</h3>
        <hr></hr>
      </div>
      <div
        style={{ display: "flex" }}
        // className={`fade-in-out ${fadeIn ? "fade-in" : "fade-out"}`}
      >
        {appState.quotes.length > 0 ? (
          <>
            <div>
              <img src={quote} alt="Quotes" />
            </div>
            <div>
              <p>{appState.quotes[currentQuoteIndex].quote}</p>
            </div>
          </>
        ) : (
          "Loading..."
        )}
      </div>
      <div
        style={{ display: "flex", justifyContent: "space-between" }}
        // className={`fade-in-out ${fadeIn ? "fade-in" : "fade-out"}`}
      >
        {appState.quotes.length > 0 ? (
          <>
            <div>
              <p>- {appState.quotes[currentQuoteIndex].author}</p>
            </div>
            <div>
              <img src={double_quotes} alt="Quotes" />
            </div>
          </>
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
}

export default TodayQuote;
