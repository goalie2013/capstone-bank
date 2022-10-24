import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

export default function Footer() {
  return (
    <div className="footer">
      <Navbar>
        <Container>
          <Navbar.Brand href="#home" style={{ fontSize: "0.85em" }}>
            © 2022 Bad Bank Inc.
          </Navbar.Brand>
        </Container>
      </Navbar>
    </div>
  );
}
