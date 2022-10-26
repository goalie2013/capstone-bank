import React, { useState, useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Login from "../pages/Login";
import { Link } from "react-router-dom";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";
import moneyBag from "../assets/money-bag.png";
import { Button } from "react-bootstrap";
import { COLORS } from "../themes";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../index";

export default function NavBar({ id }) {
  const ctx = useContext(UserContext);
  const [expanded, setExpanded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
    Object.keys(ctx.user).length === 0 ? false : true
  );
  const firebaseAuth = getAuth(app);
  const navigate = useNavigate();

  console.log("NAVBAR ID", id);
  console.log("length", Object.keys(ctx.user).length, loggedIn);

  const style = {
    backgroundColor: "#89abe3ff",
    color: "#fcf6f5ff",
    minHeight: "9vh",
  };

  function login() {
    console.log("Login");
    navigate("/login");
  }

  function logout() {
    console.log("Logout");
    console.log("currentUser before", firebaseAuth.currentUser);
    firebaseAuth.signOut();
    console.log("currentUser after", firebaseAuth.currentUser);
    setLoggedIn(false);
    ctx.user = {};
    navigate("/");
  }

  return (
    <>
      {/* <Router> */}
      <Navbar
        variant="light"
        expand="md"
        expanded={expanded}
        className="p-3 navbar"
        style={style}
      >
        <Container>
          <Navbar.Brand>
            <Link to="/" style={style} onClick={() => setExpanded(false)}>
              <span
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-end",
                }}
              >
                <img
                  src={moneyBag}
                  className="img-fluid logo"
                  alt="Money Bag"
                  style={{
                    width: "2.5rem",
                    marginRight: "0.5rem",
                  }}
                />
              </span>
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
                    to={`/deposit/${id}`}
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
                    to={`/withdraw/${id}`}
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
                    to={`/data/${id}`}
                    style={style}
                    className="link"
                    onClick={() => setExpanded(false)}
                  >
                    Transactions
                  </Link>
                </Nav.Link>
              </Nav.Item>
              {/* <Nav.Item>
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
              </Nav.Item> */}
              {/* <Nav.Item>
                <Nav.Link>
                  <Link to="/" style={style} className="link" onClick={logout}>
                    Logout
                  </Link>
                </Nav.Link>
              </Nav.Item> */}
              <Button
                className="loginOutBtn"
                style={{
                  background: COLORS.lighterTheme,
                  color: COLORS.darkerTheme,
                  fontWeight: 800,
                  boxShadow: "0 0.2rem 0.75rem rgba(0, 0, 0, 0.3)",
                  marginLeft: "1rem",
                }}
                onClick={() => {
                  !id || id === "bad-request" ? login() : logout();
                  setExpanded(false);
                }}
              >
                {loggedIn ? "Logout" : "Log In"}
              </Button>
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
