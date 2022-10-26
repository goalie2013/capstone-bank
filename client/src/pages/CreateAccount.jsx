import React, { useState, useContext } from "react";
import NavBar from "../components/NavBar";
import SubmitBtn from "../components/SubmitBtn";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import CustomCard from "../components/Card";
import { UserContext } from "../index";
// import validator from "validator";
import { validate } from "../helper/userFormsHelper";
import { COLORS } from "../themes";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../mutations/userMutations";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import GoogleAuthCreateUser from "../components/GoogleAuth";

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
  ctx.user.id ? (id = ctx.user.id) : (id = "bad-request");

  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);
  if (error) console.error("Apollo Error", error);
  if (loading) console.log("LOADING");
  if (data && data.createUser) {
    console.log("DATA PRESENT!!", data);
    ctx.user.id = data.createUser.id;
    navigate(`/deposit/${data.createUser.id}`);
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

  const nameStyles = {
    color: nameTxtColor,
  };
  const emailStyles = {
    color: emailTxtColor,
  };
  const passStyles = {
    color: passTxtColor,
  };

  function handleCreate() {
    console.log("handleCreate", name, email, password);
    // e.preventDefault();
    if (!validate(name, "name", stateObj, setStateObj)) return;
    if (!validate(email, "email", stateObj, setStateObj)) return;
    if (!validate(password, "password", stateObj, setStateObj)) return;

    console.log("Passed validation!!");

    // Create User with Firebase Auth
    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        // User is now Signed In
        const user = userCredential.user;
        console.log("Firebase User", user);
        // Reset context if user already created
        ctx.user = {};
        ctx.user = {
          name: name,
          email: user.email,
        };
      })
      .catch((error) => {
        console.error("Firebase Create User Error", error.message);
        setStatus(`Error: ${error.message}`);
      });

    // Create User into Database
    try {
      createUser({ variables: { user: { name, email, password } } });
    } catch (err) {
      console.error("createUser Error", err.message);
    }

    setShow(false);
  }

  return (
    <>
      <NavBar id={id} />
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

                    <SubmitBtn
                      name="Create Account"
                      handleClick={handleCreate}
                    />
                  </Form>
                  <GoogleAuthCreateUser />
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

// function validate(field, label) {
//   console.log("---- validate ----");

//   if (!field) {
//     // setStatusTextColor("red");
//     setStatus(
//       `Error: ${
//         label[0].toUpperCase() + label.substring(1)
//       } must be filled out`
//     );
//     return false;
//   }

//   // Name Validation (No special characters or numbers)
//   if (field === name && !validator.matches(field, /[a-zA-Z ]+$/)) {
//     // setStatusTextColor("red");
//     setNameTxtColor("red");
//     setStatus("Name must only contain letters");
//     return false;
//   } else {
//     // setStatusTextColor("");
//     setNameTxtColor("black");
//   }

//   // Email Validation
//   if (field === email && !validator.isEmail(field)) {
//     console.log("EMAIL VALIDATION");
//     // setStatusTextColor("red");
//     setEmailTxtColor("red");
//     setStatus("Email not valid. Try Again");
//     return false;
//   } else {
//     // setStatusTextColor("");
//     setEmailTxtColor("black");
//   }

//   // Password Length Validation
//   if (field === password && field.length < 8) {
//     console.log("XDDDDXDXXDXDXD");
//     // setStatusTextColor("red");
//     setPassTxtColor("red");
//     setStatus("Password must be at least 8 characters");
//     // document.documentElement.style.setProperty("--password-txt-color", "red");
//     return false;
//   } else {
//     // setStatusTextColor("");
//     setPassTxtColor("gray");
//   }

//   // If Validation Passed:
//   // in case already present from previous validation fail:
//   setStatus("");
//   // document.documentElement.style.setProperty("--password-txt-color", "gray");
//   return true;
// }
