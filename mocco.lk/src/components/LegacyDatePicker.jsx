import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Collapse from "react-bootstrap/Collapse";

function DatePicker() {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <Card>
        <Card.Header onClick={handleToggle}>
          <h5>September</h5>
        </Card.Header>
        <Collapse in={open}>
          <ListGroup variant="flush">
            <ListGroup.Item>July 1st</ListGroup.Item>
            <ListGroup.Item>July 2nd</ListGroup.Item>
            <ListGroup.Item>July 3rd</ListGroup.Item>
          </ListGroup>
        </Collapse>
      </Card>
      <Card>
        <Card.Header onClick={handleToggle}>
          <h5>September</h5>
        </Card.Header>
        <Collapse in={open}>
          <ListGroup variant="flush">
            <ListGroup.Item>July 1st</ListGroup.Item>
            <ListGroup.Item>July 2nd</ListGroup.Item>
            <ListGroup.Item>July 3rd</ListGroup.Item>
          </ListGroup>
        </Collapse>
      </Card>
      <Card>
        <Card.Header onClick={handleToggle}>
          <h5>September</h5>
        </Card.Header>
        <Collapse in={open}>
          <ListGroup variant="flush">
            <ListGroup.Item>July 1st</ListGroup.Item>
            <ListGroup.Item>July 2nd</ListGroup.Item>
            <ListGroup.Item>July 3rd</ListGroup.Item>
          </ListGroup>
        </Collapse>
      </Card>
    </>
  );
}

export default DatePicker;
