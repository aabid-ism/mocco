import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";
function LanguageToggle() {
  return (
    <div>
      <ButtonGroup aria-label="Basic example">
        <Button variant="secondary">English</Button>
        <Button variant="secondary">සිංහල</Button>
      </ButtonGroup>
    </div>
  );
}

export default LanguageToggle;
