import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import {
  useMoccoNewsFeedContext,
  useMoccoNewsFeedDispatchContext,
} from "../../providers/NewsProvider";
function LanguageToggle() {
  const dispatch = useMoccoNewsFeedDispatchContext();
  function toggle(lang) {
    dispatch({
      type: "SET_LANG",
      payload: lang,
    });
  }

  return (
    <div>
      <ButtonGroup aria-label="Basic example">
        <Button variant="secondary" onClick={(e) => toggle("English")}>
          English
        </Button>
        <Button variant="secondary" onClick={(e) => toggle("Sinhala")}>
          සිංහල
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default LanguageToggle;
