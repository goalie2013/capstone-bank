import React, { useState, useContext } from "react";
import NavBar from "../components/NavBar";
import SubmitBtn from "../components/SubmitBtn";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import CustomCard from "../components/Card";
import { UserContext } from "../index";
import { COLORS } from "../themes";
import { validate } from "../helper/userFormsHelper";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import GoogleSignIn from "../components/GoogleSignIn";
import { LOG_IN_USER } from "../mutations/userMutations";
import { useMutation } from "@apollo/client";

export default function Login() {
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("");
  // const [statusTextColor, setStatusTextColor] = useState("");
  const [nameTxtColor, setNameTxtColor] = useState("black");
  const [emailTxtColor, setEmailTxtColor] = useState("black");
  const [passTxtColor, setPassTxtColor] = useState("gray");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const ctx = useContext(UserContext);
  const navigate = useNavigate();
  let id;
  ctx.user.id ? (id = ctx.user.id) : (id = "bad-request");

  let stateObj = { name, email, password };
  let setStateObj = {
    setStatus,
    setNameTxtColor,
    setEmailTxtColor,
    setPassTxtColor,
  };

  const nameStyles = {
    color: nameTxtColor,
  };
  const emailStyles = {
    color: emailTxtColor,
  };
  const passStyles = {
    color: passTxtColor,
  };

  // Firebase can check real password automatically so DONT need this
  //   const [loginUser, { data, loading, error }] = useMutation(LOG_IN_USER);
  //   if (loading) console.warn("LOADING");
  //   if (error) console.error("Error LOG_IN_USER", error.message);
  //   if (data) console.log("LOG_IN_USER data", data);

  function handleLogin() {
    console.log("handleLogin", name, email, password);
    // e.preventDefault();
    if (!validate(name, "name", stateObj, setStateObj)) return;
    if (!validate(email, "email", stateObj, setStateObj)) return;
    if (!validate(password, "password", stateObj, setStateObj)) return;

    console.log("Passed validation!!");

    const firebaseAuth = getAuth(app);
    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        // User is now Logged In
        const user = userCredential.user;
        console.log("Logged In User", user);

        setShow(false);
      })
      .catch((err) => {
        console.error("Error loggin in user", err.message);
        setStatus("Login Failed. Please Try Again");
      });
  }

  return (
    <>
      <NavBar id={id} />
      <div className="page-wrapper">
        <h1 style={{ fontWeight: 900, marginBottom: "0.5rem" }}>Log In</h1>
        <h5 style={{ marginTop: "1rem" }}>
          Don't have an accout?{" "}
          <Link to="/createaccount" className="link">
            Sign up Here!
          </Link>
        </h5>

        <CustomCard
          // bgHeaderColor={COLORS.cardHeader}
          // header="Create Account"
          bgColor={COLORS.cardBackground}
          statusText={status}
          statusColor={COLORS.modalHeader}
          body={
            show ? (
              <>
                <Card.Body>
                  <Form className="form" onSubmit={(e) => e.preventDefault()}>
                    <Form.Group className="mb-4" controlId="formName">
                      {/* <Form.Label>Name</Form.Label> */}
                      <Form.Control
                        style={nameStyles}
                        required
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => {
                          setName(e.currentTarget.value);
                          setNameTxtColor("black");
                          setStatus("");
                        }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formEmail">
                      <Form.Control
                        style={emailStyles}
                        required
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.currentTarget.value);
                          setEmailTxtColor("black");
                          setStatus("");
                        }}
                      />
                      <Form.Text>
                        We'll never share your email with anyone else.
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formPassword">
                      <Form.Control
                        required
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.currentTarget.value);
                          setPassTxtColor("gray");
                          setStatus("");
                        }}
                      />
                      <Form.Text style={passStyles}>
                        Must be at least 8 characters long
                      </Form.Text>
                    </Form.Group>

                    <SubmitBtn name="Log In" handleClick={handleLogin} />
                  </Form>
                  <GoogleSignIn />
                </Card.Body>
              </>
            ) : (
              <>
                <Card.Body className="form">
                  <h5 style={{ textAlign: "center", fontSize: "1.5em" }}>
                    Success
                  </h5>
                </Card.Body>
              </>
            )
          }
        />
      </div>
    </>
  );
}
