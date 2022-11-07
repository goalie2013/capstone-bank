import React from "react";
import Card from "react-bootstrap/Card";
import { COLORS } from "../themes";

export default function CustomCard(props) {
  // Dynamic Styles
  // Separate Card Header & Body so doesn't have to be the same color
  function classes(str) {
    if (str === "header") {
      const bg = props.bgHeaderColor ? " bg-" + props.bgHeaderColor : " ";
      const txt = props.txtHeaderColor
        ? " text-" + props.txtHeaderColor
        : " text-black";
      console.log("bg", bg);
      return "card mb-3 " + "bg" + txt;
    } else {
      const bg = props.bgColor ? " bg-" + props.bgColor : " ";
      const txt = props.txtColor ? " text-" + props.txtColor : " text-black";
      // console.log("bg", bg);
      return "card custom-card mb-3 rounded " + bg + txt;
    }
  }

  function classesAlert(str) {
    if (str === COLORS.transactionComplete) {
      return "alert alert-success";
    } else {
      return "alert alert-danger";
    }
  }

  return (
    <Card
      className="{classes()} kk imageborder"
      style={{
        // backgroundColor: props.bgColor,
        background: props.bgColor,
        width: "25rem",
        marginTop: "2.5rem",
        boxShadow: "0 3rem 5rem rgba(0, 0, 0, 0.2)",
        borderRadius: "20px",
      }}
    >
      {/* <Card.Header
        // className={classes("header")}
        className="card-header"
        style={{
          backgroundColor: props.bgHeaderColor,
        }}
      > */}
      <div
        style={{
          textAlign: "center",
          color: COLORS.lighterTheme,
          background: props.bgHeaderColor,
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          fontSize: "1.75rem",
          padding: "1rem",
          overflowWrap: "break-word",
        }}
      >
        {props.header}
      </div>
      {/* </Card.Header> */}
      <Card.Body>
        {props.title && (
          <h5 style={{ fontWeight: "800" }} className="card-title">
            {props.title}
          </h5>
        )}
        {props.text && (
          <p className="card-text" style={{ fontWeight: "700" }}>
            {props.text}
          </p>
        )}
        {props.body}
        {props.statusText && (
          <div
            className={classesAlert(props.statusColor)}
            role="alert"
            style={{
              color: props.statusColor,
              marginTop: "0.5rem",
              textAlign: "center",
              boxShadow: "0 0.25rem 1rem rgba(0, 0, 0, 0.3)",
            }}
          >
            {props.statusText}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
