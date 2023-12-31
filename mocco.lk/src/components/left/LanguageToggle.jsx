import React, { useState } from "react";
import { ButtonGroup, Button, ToggleButton } from "react-bootstrap";
import { useMoccoNewsFeedDispatchContext } from "../../providers/NewsProvider";

function LanguageToggle() {
  const [checked, setChecked] = useState(true);

  const dispatch = useMoccoNewsFeedDispatchContext();

  function toggle(lang) {
    dispatch({
      type: "SET_LANG",
      payload: lang,
    });

    setChecked((checked) => !checked);
  }

  const buttonStyle = {
    // backgroundColor: "#ff0000",
    // color: "#ffffff",
    // margin: "5px",
  };
  return (
    <div>
      <ButtonGroup>
        <ToggleButton
          variant="light"
          type="checkbox"
          checked={checked}
          onClick={(e) => toggle("English")}
          style={buttonStyle}
        >
          ENG
        </ToggleButton>
        <ToggleButton
          variant="light"
          type="checkbox"
          checked={!checked}
          onClick={(e) => toggle("Sinhala")}
          style={buttonStyle}
        >
          සිංහල
        </ToggleButton>
      </ButtonGroup>
    </div>
  );
}

export default LanguageToggle;
