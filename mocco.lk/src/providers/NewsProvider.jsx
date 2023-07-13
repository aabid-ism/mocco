import { React, createContext, useReducer, useContext } from "react";
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
  const [moccoNewsFeedState, dispatch] = useReducer(moccoReducer, initialState);

  return (
    <moccoNewsFeedContext.Provider value={moccoNewsFeedState}>
      <moccoNewsFeedDispatchContext.Provider value={dispatch}>
        {children}
      </moccoNewsFeedDispatchContext.Provider>
    </moccoNewsFeedContext.Provider>
  );
}

// Mocco Reducer
function moccoReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING": {
      return {
        ...state,
        is_loading: true,
      };
    }
    case "DispatchDefaultFeed": {
      // console.log(action.payload);
      return {
        ...state,
        feedTag: FeedType.NEWS,
        newsTag: NewsType.EMPTY,
        postFeed: action.payload,
        is_loading: false,
      };
    }

    case "LOAD_TO_FEED": {
      // console.log(action.payload);
      return {
        ...state,
        feedTag: FeedType.NEWS,
        newsTag: NewsType.EMPTY,
        postFeed: [...state.postFeed, ...action.payload],
        is_loading: false,
      };
    }

    case "SET_LANG": {
      return {
        ...state,
        language: action.payload,
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
const initialState = {
  language: "English",
  is_loading: true,
  feedTag: FeedType.NEWS,
  newsTag: NewsType.EMPTY,
  postFeed: [],
};