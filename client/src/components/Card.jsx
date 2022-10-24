import React from "react";
import Card from "react-bootstrap/Card";

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
      return "card mb-3 " + bg + txt;
    } else {
      const bg = props.bgColor ? " bg-" + props.bgColor : " ";
      const txt = props.txtColor ? " text-" + props.txtColor : " text-black";
      // console.log("bg", bg);
      return "card custom-card mb-3 " + bg + txt;
    }
  }

  return (
    <Card
      className="{classes()} kk"
      style={{
        backgroundColor: props.bgColor,
        width: "25rem",
        marginTop: "2.5rem",
        boxShadow: "0 3rem 5rem rgba(0, 0, 0, 0.2)",
      }}
    >
      <Card.Header
        className={classes("header")}
        style={{ backgroundColor: props.bgHeaderColor }}
      >
        {props.header}
      </Card.Header>
      <Card.Body>
        {props.title && <h5 className="card-title">{props.title}</h5>}
        {props.text && <p className="card-text">{props.text}</p>}
        {props.body}
        {props.statusText && (
          <div id={props.statusColor}>{props.statusText}</div>
        )}
      </Card.Body>
    </Card>
  );
}
