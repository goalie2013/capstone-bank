import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

export default function NavBar({ userId }) {
  const [expanded, setExpanded] = useState(false);

  const style = {
    color: "black",
  };

  return (
    <>
      {/* <Router> */}
      <Navbar
        variant="light"
        expand="md"
        expanded={expanded}
        className="p-3 navbar"
      >
        <Container>
          <Navbar.Brand>
            <Link to="/" style={style} onClick={() => setExpanded(false)}>
              Bad Bank
            </Link>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={() => setExpanded(expanded ? false : "expanded")}
          />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav>
              <Nav.Item>
                <Nav.Link>
                  <Link
                    to="/createaccount"
                    style={style}
                    className="link"
                    onClick={() => setExpanded(false)}
                  >
                    Create Account
                  </Link>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link>
                  <Link
                    to={`/deposit/${userId}`}
                    style={style}
                    className="link"
                    onClick={() => setExpanded(false)}
                  >
                    Deposit
                  </Link>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link>
                  <Link
                    to={`/withdraw/${userId}`}
                    style={style}
                    className="link"
                    onClick={() => setExpanded(false)}
                  >
                    Withdraw
                  </Link>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link>
                  <Link
                    to={`/data/${userId}`}
                    style={style}
                    className="link"
                    onClick={() => setExpanded(false)}
                  >
                    User Data
                  </Link>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link>
                  <Link
                    to="/alldata"
                    style={style}
                    className="link"
                    onClick={() => setExpanded(false)}
                  >
                    All Data
                  </Link>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createaccount" element={<CreateAccount />} />
            <Route
              path="/deposit"
              element={<PageWrapper pageComponent={<Deposit />} />}
            />
            <Route
              path="/withdraw"
              element={<PageWrapper pageComponent={<Withdraw />} />}
            />
            <Route
              path="/data"
              element={<PageWrapper pageComponent={<Data />} />}
            />
          </Routes> */}
      {/* </Router> */}
    </>
  );
}
