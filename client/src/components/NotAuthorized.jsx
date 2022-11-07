import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import pic from "../assets/no-to-the-hand.png";

export default function NotAuthorized({ id }) {
  console.log("NOT AUTHORIZED ID", id);
  const styles = {
    display: "flex",
    minHeight: "85vh",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <>
      {/* <NavBar id={id} /> */}

      <div style={styles}>
        <img
          src={pic}
          className="img-fluid"
          alt="No Cross Sign with Shadow Pointing No"
          style={{ width: "12rem", marginBottom: "1.5rem" }}
        />
        <h1 style={{ textAlign: "center" }}>
          401 <br />
          Not Authorized
        </h1>
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
