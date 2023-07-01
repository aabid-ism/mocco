import { React, createContext, useReducer, useContext } from "react";
import { fetchDefaultFeed } from "../services/FetchService";
import { FeedType, NewsType, Language } from "../enums";
// stores and provides the state of the webapp
export const MoccoContext = createContext(null);

// stores and provides the dispatch functions of the webapp
export const MoccoDispatchContext = createContext(null);

export function useMoccoContext() {
  return useContext(MoccoContext);
}

export function useMoccoDispatch() {
  return useContext(MoccoDispatchContext);
}

// Mocco Provider provides a Higher-Order Component to automatically wrap
// the state context (Mocco Context) and dispatch contect (MoccoDispatchContext)
export function MoccoProvider({ children }) {
  const [mocco, dispatch] = useReducer(moccoReducer, initialMocco);

  return (
    <MoccoContext.Provider value={mocco}>
      <MoccoDispatchContext.Provider value={dispatch}>
        {children}
      </MoccoDispatchContext.Provider>
    </MoccoContext.Provider>
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
