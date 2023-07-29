import React from "react";
import Badge from "react-bootstrap/Badge";
import Accordion from "react-bootstrap/Accordion";

const EventButton = ({ event, lang }) => {
  return (
    <Accordion
      style={{
        cursor: "pointer",
        color: "black",
        margin: "5px",
      }}
    >
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <div
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
            {lang === "English" ? event.name : event.s_name}
          </div>
        </Accordion.Header>
        <Accordion.Body style={{ fontSize: "0.9rem", textAlign: "left" }}>
          {lang === "English" ? event.desc : event.s_desc}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default EventButton;
