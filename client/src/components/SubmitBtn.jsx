import React from "react";
import Button from "react-bootstrap/Button";
import { COLORS } from "../themes";

export default function SubmitBtn(props) {
  return props.disabled ? (
    <Button
      disabled
      variant="primary"
      className="submit-btn py-3"
      style={{
        backgroundColor: `${COLORS.btnColor}`,
        borderColor: "#e1e2e2",
        color: "#000",
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
        backgroundColor: `${COLORS.btnColor}`,
        borderColor: "#e1e2e2",
        color: "#000",
      }}
      onClick={props.handleClick}
      type="submit"
    >
      {props.name}
    </Button>
  );
}
