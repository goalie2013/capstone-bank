import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { COLORS } from "../themes";

export default function NavBarLoggedOut({ id, style, setExpanded, login }) {
  return (
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
          login();
          setExpanded(false);
        }}
      >
        Log In
      </Button>
    </Nav>
  );
}
