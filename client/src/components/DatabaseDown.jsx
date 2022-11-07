import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import pic from "../assets/sad-laptop.png";

export default function DatabaseDown() {
  console.log("DatabaseDown");

  const styles = {
    display: "flex",
    minHeight: "85vh",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  let id;

  return (
    <>
      {/* <NavBar id={id} /> */}

      <div style={styles}>
        <img
          src={pic}
          className="img-fluid"
          alt="Sad Computer"
          style={{ width: "12rem", marginBottom: "1.5rem" }}
        />
        <h1 style={{ textAlign: "center" }}>
          503 <br />
          Service Unavailable
        </h1>
        <hr />
        <h3>Try Reloading Page</h3>
        <hr />
        <h3>
          Go to{" "}
          <Link to="/" style={{}}>
            Homepage
          </Link>
        </h3>
      </div>
    </>
  );
}
