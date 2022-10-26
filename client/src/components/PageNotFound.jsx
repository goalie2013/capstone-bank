import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import pic from "../assets/shrug.png";

export default function PageNotFound({ id }) {
  const styles = {
    display: "flex",
    minHeight: "85vh",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <>
      <NavBar id={id} />

      <div style={styles}>
        <img
          src={pic}
          className="img-fluid"
          alt="Panda Cartoon Shrugging Confusingly"
          style={{ width: "12rem", marginBottom: "1.5rem" }}
        />
        <h1 style={{ textAlign: "center" }}>
          404 <br />
          Page Not Found
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
