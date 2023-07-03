import { React, createContext, useReducer, useContext } from "react";
import { fetchDefaultFeed } from "../services/FetchService";
import { FeedType, NewsType, Language } from "../enums";

// stores and provides the state of the webapp
export const moccoNewsFeedContext = createContext(null);

// stores and provides the dispatch functions of the webapp
export const moccoNewsFeedDispatchContext = createContext(null);

export function useMoccoNewsFeedContext() {
  return useContext(moccoNewsFeedContext);
}

export function useMoccoNewsFeedDispatchContext() {
  return useContext(moccoNewsFeedDispatchContext);
}

// Mocco Provider provides a Higher-Order Component to automatically wrap
// the state context (Mocco Context) and dispatch contect (MoccoDispatchContext)
export function MoccoNewsFeedProvider({ children }) {
  const [mocco, dispatch] = useReducer(moccoReducer, initialMocco);

  return (
    <moccoNewsFeedContext.Provider value={mocco}>
      <moccoNewsFeedDispatchContext.Provider value={dispatch}>
        {children}
      </moccoNewsFeedDispatchContext.Provider>
    </moccoNewsFeedContext.Provider>
  );
}

// Mocco Reducer
function moccoReducer(mocco, action) {
  switch (action.type) {
    case "FetchDefaultFeed": {
      console.log(action.payload);
      return {
        ...mocco,
        feedTag: FeedType.YESTERDAY,
        newsTag: NewsType.EMPTY,
        postFeed: action.payload,
      };
    }
    case "SetNFetchTagSpecificFeed": {
    }
    case "FetchYdayFeed": {
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

// Initial Mocco
const initialMocco = {
  language: "English",
  feedTag: FeedType.ALL,
  newsTag: NewsType.EMPTY,
  postFeed: [],
};
