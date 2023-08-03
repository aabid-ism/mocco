import React from "react";
import Accordion from "react-bootstrap/Accordion";

const EventButton = ({ event, lang }) => {
  return (
    <Accordion
      style={{
        cursor: "pointer",
        color: "black",
        marginBottom: "2%",
      }}
    >
      <Accordion.Item eventKey="0">
        <Accordion.Button
          style={{
            backgroundColor: "white",
            boxShadow: "none",
            fontSize: "0.9rem",
          }}
        >
          <div>{lang === "English" ? event.name : event.s_name}</div>
        </Accordion.Button>
        <Accordion.Body
          style={{
            fontSize: "0.9rem",
            paddingTop: 0,
            overflowWrap: "break-word",
          }}
        >
          <hr></hr>
          {lang === "English" ? event.desc : event.s_desc}
          <div style={{ paddingTop: "3px" }}>
            <a href={event.srcUrl} target="_blank">
              Learn more
            </a>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default EventButton;
