import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

export default function Footer() {
  return (
    <div className="footer">
      <Navbar>
        <Container>
          <Navbar.Brand
            href="#home"
            style={{ fontSize: "0.85em", color: "#fcf6f5ff" }}
          >
            © 2022 Bad Bank Inc.
            <hr />
            Created by Gabriel Grinstein
          </Navbar.Brand>
        </Container>
      </Navbar>
    </div>
  );
}
