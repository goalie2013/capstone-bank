import React from "react";
import Button from "react-bootstrap/Button";
import { COLORS } from "../themes";

export default function SubmitBtn(props) {
  return props.disabled ? (
    <Button
      disabled
      variant="primary"
      className="submit-btn py-3 disabled"
      style={{
        backgroundColor: COLORS.disabledBtnColor,
        borderColor: "#e1e2e2",
        color: COLORS.lighterTheme,
      }}
      onClick={props.handleClick}
    >
      {props.name}
    </Button>
  ) : (
    <Button
      variant="primary"
      className="submit-btn py-3"
      style={{
        backgroundColor: props.bgColor,
        borderColor: COLORS.darkerTheme,
        color: COLORS.lighterTheme,
        boxShadow: "0 0.5rem 1.25rem rgba(0, 0, 0, 0.3)",
      }}
      onClick={props.handleClick}
      type="submit"
    >
      {props.name}
    </Button>
  );
}
