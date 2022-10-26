import React, { useState, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import { UserContext } from "../index";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../mutations/userMutations";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import googleLogo from "../assets/google-logo.png";
import { COLORS } from "../themes";
import { QueryGetUserByEmail } from "../helper/queryMutationHelper";

export default function GoogleAuthCreateUser() {
  const ctx = useContext(UserContext);
  const [userEmail, setUserEmail] = useState("");
  const auth = getAuth(app);
  auth.languageCode = "it";

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    "login_hint": "user@example.com",
  });

  const navigate = useNavigate();

  const emailExists = QueryGetUserByEmail(userEmail);
  console.log("emailExists", emailExists);
  if (emailExists && emailExists.getUserByEmail) {
    console.log("EMAIL ALREADY EXISTSSSS");
    const { getUserByEmail } = emailExists;
    const { id } = getUserByEmail;
    navigate(`/deposit/${id}`);
  }

  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);
  if (error) console.error("Apollo Error", error);
  if (loading) console.log("LOADING");
  if (data) {
    console.log("DATA PRESENT!!", data);
    if (!emailExists) {
      ctx.user.email = userEmail;
      navigate(`/deposit/${data.createUser.id}`);
    }
  } else {
    console.log("NO DATA");
  }

  function handleGoogleAuth() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("Google user", user);
        console.log("name", user.displayName);
        const name = user.displayName;
        const email = user.email;
        setUserEmail(email);
        try {
          setTimeout(() => {
            createUser({ variables: { user: { name, email } } }, 2000);
          });
        } catch (err) {
          console.error("createUser Error", err.message);
        }
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
            <span style={{ color: COLORS.lighterTheme }}>Sign Up</span>
          </span>
        </Button>
      </div>
    </Form>
  );
}
