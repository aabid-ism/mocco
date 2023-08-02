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

// MoccoNewsFeedProvider provides a Higher-Order Component to automatically wrap
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
      return {
        ...state,
        feedTag: FeedType.LOCAL,
        newsTag: NewsType.EMPTY,
        postFeed: action.payload,
        is_loading: false,
        need_to_go_up: true,
      };
    }

    case "LOAD_INTL_TO_FEED": {
      return {
        ...state,
        feedTag: FeedType.INTERNATIONAL,
        newsTag: NewsType.EMPTY,
        postFeed: action.payload,
        is_loading: false,
        need_to_go_up: true,
      };
    }

    case "LOAD_TO_FEED": {
      return {
        ...state,
        postFeed: [...state.postFeed, ...action.payload],
        is_loading: false,
      };
    }

    case "SET_TAG_FEED": {
      return {
        ...state,
        feedTag: FeedType.TAG,
        newsTag: NewsType[action.payload.tag],
        postFeed: [...action.payload.data],
        is_loading: false,
        need_to_go_up: true,
      };
    }

    case "LOAD_TO_TAG_FEED": {
      return {
        ...state,
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
    case "WENT_UP": {
      return {
        ...state,
        need_to_go_up: false,
      };
    }

    case "LOAD_ALL_QUOTES": {
      return {
        ...state,
        quotes: [...state.quotes, ...action.payload],
        is_loading: false,
      };
    }

    case "LOAD_ALL_EVENTS": {
      return {
        ...state,
        events: [...state.events, ...action.payload],
        is_loading: false,
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

// Initial State
const initialState = {
  language: "English",
  feedTag: FeedType.NEWS,
  newsTag: NewsType.EMPTY,
  postFeed: [],
  is_loading: true,
  need_to_go_up: false,
  quotes: [],
  events: [],
};
