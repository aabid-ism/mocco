import React from "react";
import sportsimg from "../../assets/sports.svg";
import { Button } from "react-bootstrap";

function TagCard(props) {
  // return (
  //   <>
  //     <Card style={{ borderRadius: "10px", margin: "10px" }}>
  //       <Card.Header>
  //         <div
  //           style={{
  //             display: "flex",
  //             alignItems: "center",
  //             justifyContent: "center",
  //           }}
  //         >
  //           <img
  //             src={sportsimg}
  //             alt="Example"
  //             style={{ width: "24px", marginRight: "8px" }}
  //           />
  //           <h5>{props.tag}</h5>
  //         </div>
  //       </Card.Header>
  //     </Card>
  //   </>
  // );

  return (
    <div style={{ margin: "10px" }}>
      <Button style={{ width: "200px" }} variant="outline-secondary">
        <img
          src={sportsimg}
          alt="Example"
          style={{ width: "24px", marginRight: "8px" }}
        />
        {props.tag}
      </Button>{" "}
    </div>
  );
}

export default TagCard;
