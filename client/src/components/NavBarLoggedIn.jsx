import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";
import { MdSettings } from "react-icons/md";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { COLORS } from "../themes";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

export default function NavBarLoggedIn({ id, style, setExpanded, logout }) {
  console.count("----NAVBARLOGGEDIN----");
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <Nav>
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

      {/* <Button
          className="loginOutBtn"
          style={{
            background: COLORS.lighterTheme,
            color: COLORS.darkerTheme,
            fontWeight: 800,
            boxShadow: "0 0.2rem 0.75rem rgba(0, 0, 0, 0.3)",
            marginLeft: "1rem",
          }}
          onClick={() => {
            loggedIn ? logout() : login();
            setExpanded(false);
          }}
        >
          {btnTxt}
        </Button> */}

      <Dropdown align="end">
        <Dropdown.Toggle
          variant="success"
          id="dropdown-autoclose-true"
          style={{
            backgroundColor: COLORS.darkerTheme,
            borderColor: COLORS.darkerTheme,
            color: COLORS.lighterTheme,
            marginLeft: "-1rem",
          }}
        >
          <MdSettings style={{ marginRight: "0.25rem" }} />
          {isSmallScreen && <> Settings</>}
        </Dropdown.Toggle>
        <Dropdown.Menu
          style={{
            background: "#e5eaf5",
            //   display: "flex",
            //   flexDirection: "column",
            //   alignItems: "center",
            textAlign: "center",
          }}
        >
          <Dropdown.Item>
            <Button
              id="navLogOutBtn"
              className="loginOutBtn"
              style={{
                background: COLORS.lighterTheme,
                color: COLORS.darkerTheme,
                fontWeight: 800,
                boxShadow: "0 0.2rem 0.75rem rgba(0, 0, 0, 0.3)",
                width: "70%",
                margin: "0.5rem",
              }}
              onClick={() => {
                logout();
                setExpanded(false);
              }}
            >
              Log Out
            </Button>
          </Dropdown.Item>
          <Dropdown.Divider />

          <Dropdown.Item as="button" id="navDeleteBtn">
            <Button
              style={{
                background: "red",
                color: COLORS.lighterTheme,
                fontWeight: 800,
                boxShadow: "0 0.2rem 0.75rem rgba(0, 0, 0, 0.3)",
                width: "70%",
                margin: "0.5rem",
              }}
              onClick={() => {
                navigate(`/deleteAccount/${id}`);
                setExpanded(false);
              }}
            >
              Delete
            </Button>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Nav>
  );
}
