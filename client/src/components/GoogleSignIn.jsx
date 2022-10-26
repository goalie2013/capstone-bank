import React, { useState, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../index";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import googleLogo from "../assets/google-logo.png";
import { COLORS } from "../themes";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_EMAIL } from "../queries/userQueries";

export default function GoogleSignIn() {
  const [email, setEmail] = useState("");
  const ctx = useContext(UserContext);
  const firebaseAuth = getAuth(app);
  firebaseAuth.languageCode = "it";
  const navigate = useNavigate();
  let id;

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    "login_hint": "user@example.com",
  });

  console.log("QueryGetUserByEmail FUNCTION");
  const { loading, error, data } = useQuery(GET_USER_BY_EMAIL, {
    variables: { email },
    // pollInterval: 1000,
  });
  if (data && data.getUserByEmail) {
    id = data.getUserByEmail.id;
    ctx.user.id = id;
    navigate(`/deposit/${id}`);
  }

  function handleGoogleAuth() {
    signInWithPopup(firebaseAuth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // The signed-in user info:
        const user = result.user;
        console.log("Google user", user);
        console.log("name", user.displayName);
        ctx.user.email = user.email;
        setEmail(user.email);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const emailErr = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.error("Google SignIn Error", errorMessage);
      });
  }

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          className="btn-light"
          style={{
            width: "19rem",
            placeItems: "center",
            borderRadius: "20px",
            marginTop: "1rem",
            backgroundColor: COLORS.darkerTheme,
          }}
          onClick={handleGoogleAuth}
        >
          <span
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={googleLogo}
              className="img-fluid btn-light"
              alt="Google Logo"
              style={{ width: "3rem", marginRight: "0.8rem" }}
            />
            <span style={{ color: COLORS.lighterTheme }}>Log In</span>
          </span>
        </Button>
      </div>
    </Form>
  );
}
