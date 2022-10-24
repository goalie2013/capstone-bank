import React, { useState, useContext } from "react";
import NavBar from "../components/NavBar";
import SubmitBtn from "../components/SubmitBtn";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import CustomCard from "../components/Card";
// import { UserContext } from "..";
import validator from "validator";
import { COLORS } from "../themes";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import GoogleAuthSignInUser from "../components/GoogleAuth";

export default function SignInAccount() {
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState("");
  const [statusTextColor, setStatusTextColor] = useState("");
  const [nameTxtColor, setNameTxtColor] = useState("black");
  const [emailTxtColor, setEmailTxtColor] = useState("black");
  const [passTxtColor, setPassTxtColor] = useState("gray");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const ctx = useContext(UserContext);
  // console.log("ctx", ctx);
  const navigate = useNavigate();

  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);
  if (error) console.error("Apollo Error", error);
  if (loading) console.log("LOADING");
  if (data) {
    console.log("DATA PRESENT!!", data);
    navigate(`/deposit/${data.createUser.id}`);
  } else {
    console.log("NO DATA");
  }

  const nameStyles = {
    color: nameTxtColor,
  };
  const emailStyles = {
    color: emailTxtColor,
  };
  const passStyles = {
    color: passTxtColor,
  };

  function validate(field, label) {
    console.log("---- validate ----");

    if (!field) {
      setStatusTextColor("red");
      setStatus(
        `Error: ${
          label[0].toUpperCase() + label.substring(1)
        } must be filled out`
      );
      return false;
    }

    // Name Validation (No special characters or numbers)
    if (field === name && !validator.matches(field, /[a-zA-Z ]+$/)) {
      setStatusTextColor("red");
      setNameTxtColor("red");
      setStatus("Name must only contain letters");
      return false;
    } else {
      setStatusTextColor("");
      setNameTxtColor("black");
    }

    // Email Validation
    if (field === email && !validator.isEmail(field)) {
      console.log("EMAIL VALIDATION");
      setStatusTextColor("red");
      setEmailTxtColor("red");
      setStatus("Email not valid. Try Again");
      return false;
    } else {
      setStatusTextColor("");
      setEmailTxtColor("black");
    }

    // Password Length Validation
    if (field === password && field.length < 8) {
      console.log("XDDDDXDXXDXDXD");
      setStatusTextColor("red");
      setPassTxtColor("red");
      setStatus("Password must be at least 8 characters");
      // document.documentElement.style.setProperty("--password-txt-color", "red");
      return false;
    } else {
      setStatusTextColor("");
      setPassTxtColor("gray");
    }

    // If Validation Passed:
    // in case already present from previous validation fail:
    setStatus("");
    // document.documentElement.style.setProperty("--password-txt-color", "gray");
    return true;
  }

  function handleCreate() {
    console.log("handleCreate", name, email, password);
    // e.preventDefault();
    if (!validate(name, "name")) return;
    if (!validate(email, "email")) return;
    if (!validate(password, "password")) return;

    console.log("Passed validation!!");

    try {
      createUser({ variables: { user: { name, email, password } } });
    } catch (err) {
      console.error("createUser Error", err.message);
    }

    setShow(false);
  }

  function clearForm() {
    setName("");
    setEmail("");
    setPassword("");
    setShow(true);
  }

  return (
    <>
      <NavBar />
      <div className="page-wrapper">
        <h1>Create Account</h1>

        <CustomCard
          bgHeaderColor={COLORS.cardHeader}
          header="Create Account"
          bgColor={COLORS.cardBackground}
          statusText={status}
          statusColor={statusTextColor}
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
                  <SubmitBtn
                    name="Add Another Account"
                    handleClick={clearForm}
                  />
                </Card.Body>
              </>
            )
          }
        />
      </div>
    </>
  );
}
