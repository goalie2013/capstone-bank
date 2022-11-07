import React, { useState, useContext } from "react";
import SubmitBtn from "../components/SubmitBtn";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import CustomCard from "../components/Card";
import { UserContext } from "../index";
import { validate } from "../helper/userFormsHelper";
import { axiosLogin } from "../helper/axiosHelper";
import { COLORS } from "../themes";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../mutations/userMutations";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import GoogleAuth from "../components/GoogleAuth";
import Loading from "../components/Loading";
import { createFirebaseUser } from "../helper/authHelper";

export default function CreateAccount() {
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
  const firebaseAuth = getAuth(app);
  let id;

  // If ctx.user.id exists --> go back page
  if (ctx.user && ctx.user.id) navigate(-1);

  // createUser GraphQL Mutation
  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);
  if (error) {
    console.error("Apollo Error", error);
    alert(error.message);
  }
  if (loading) return <Loading />;
  if (data && data.createUser) {
    console.log("DATA PRESENT!!", data);
    const newUser = data.createUser;
    console.log("newUser", newUser);

    // Get & Store JWT Token
    console.log("axios /login call");
    axiosLogin(newUser, ctx.user, navigate);
  } else {
    console.log("NO DATA");
  }

  let stateObj = { name, email, password };
  let setStateObj = {
    setStatus,
    setNameTxtColor,
    setEmailTxtColor,
    setPassTxtColor,
  };

  const nameStyles = { color: nameTxtColor };
  const emailStyles = { color: emailTxtColor };
  const passStyles = { color: passTxtColor };

  function handleCreate() {
    // Validate --> Firebase Auth create User --> createUser Mutation for DB
    console.log("handleCreate", name, email, password);
    if (!validate(name, "name", stateObj, setStateObj)) return;
    if (!validate(email, "email", stateObj, setStateObj)) return;
    if (!validate(password, "password", stateObj, setStateObj)) return;

    console.log("Passed validation!!");

    // Create User Firebase Auth
    createFirebaseUser(firebaseAuth, email, password, setStatus);

    // Create User into Database
    try {
      console.log("call createUser()");
      createUser({ variables: { user: { name, email, password } } });
    } catch (err) {
      console.error("createUser Error", err.message);
    }

    // Show Create Account Success Component
    setShow(false);
  }

  return (
    <>
      {/* <NavBar id={id} /> */}
      <div className="page-wrapper">
        <h1 style={{ fontWeight: 900, marginBottom: "0.5rem" }}>
          Create Account
        </h1>
        <h5 style={{ marginTop: "1rem" }}>
          Already have an accout?{" "}
          <Link to="/login" className="link">
            Log In Here
          </Link>
        </h5>

        <CustomCard
          bgHeaderColor={COLORS.darkerTheme}
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

                    <SubmitBtn
                      name="Create Account"
                      handleClick={handleCreate}
                    />
                  </Form>
                  <GoogleAuth
                    setShow={setShow}
                    setStatus={setStatus}
                    mode="Signup"
                  />
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

// function clearForm() {
//   setName("");
//   setEmail("");
//   setPassword("");
//   setShow(true);
// }
