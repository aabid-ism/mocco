import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";
function DatePicker() {
  return (
    <>
      <ButtonGroup aria-label="Basic example">
        <Button variant="secondary">All</Button>
        <Button variant="secondary">Today</Button>
        <Button variant="secondary">Yesterday</Button>
      </ButtonGroup>
    </>
  );
}

export default DatePicker;
