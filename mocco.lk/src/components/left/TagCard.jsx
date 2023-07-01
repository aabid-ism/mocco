import React from "react";
import sportsimg from "../../assets/sports.svg";
import { Card } from "react-bootstrap";

function TagCard(props) {
  return (
    <>
      <Card style={{ borderRadius: "10px", margin: "10px" }}>
        <Card.Header>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={sportsimg}
              alt="Example"
              style={{ width: "24px", marginRight: "8px" }}
            />
            <h5>{props.tag}</h5>
          </div>
        </Card.Header>
      </Card>
    </>
  );
}

export default TagCard;
