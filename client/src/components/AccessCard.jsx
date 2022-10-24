import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export default function AccessCard(props) {
  return (
    <Card className="card-denied">
      <Card.Header style={{ color: "white", backgroundColor: "red" }}>
        ACCESS DENIED
      </Card.Header>
      <Card.Body style={{ padding: "2rem" }}>
        <p style={{ fontSize: "1.5em", marginBottom: "1rem" }} className="xf">
          No user detected.
          <br />
          {/* Must create account to access Bank transactions. */}
          {props.bodyTxt}
        </p>
        <footer className="denied-btns">
          <Button
            variant="primary"
            className="denied-btn-1"
            value="Create Account"
            onClick={props.handleClick}
          >
            Create Account
          </Button>
          <Button
            variant="primary"
            className="denied-btn-2"
            value="Home"
            onClick={props.handleClick}
          >
            Home
          </Button>
        </footer>
      </Card.Body>
    </Card>
  );
}
