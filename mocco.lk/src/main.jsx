import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import 'bootstrap/dist/css/bootstrap.min.css';
import ReactGA from "react-ga4";

ReactGA.initialize("G-4P69ZF1MMD");

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <App />
  /* </React.StrictMode> */
);

const SendAnalytics = () => {
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname,
  });
};
reportWebVitals(SendAnalytics);
