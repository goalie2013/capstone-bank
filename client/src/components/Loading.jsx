import NavBar from "../components/NavBar";

export default function Loading({ id }) {
  console.log("---Loading Component---");
  return (
    <>
      {/* <NavBar id={id} /> */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="sr-only"></span>
        </div>
      </div>
    </>
  );
}
