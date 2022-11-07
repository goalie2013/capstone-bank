import React, { useState, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import { UserContext } from "../index";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import googleLogo from "../assets/google-logo.png";
import { COLORS } from "../themes";
import { QueryGetUserByEmail } from "../helper/queryMutationHelper";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../mutations/userMutations";
import { axiosLogin } from "../helper/axiosHelper";
import Loading from "./Loading";
import LoginStep from "./LoginStep";

export default function GoogleAuth({ setShow, setStatus, mode }) {
  const [userEmail, setUserEmail] = useState("");
  const [userCreated, setUserCreated] = useState(false);
  const ctx = useContext(UserContext);
  const navigate = useNavigate();
  const auth = getAuth(app);
  auth.languageCode = "it";

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    "login_hint": "user@example.com",
  });

  // try {
  //   const { user } = QueryGetUserByEmail(userEmail);
  //   if (user) {
  //     console.log("User already exists");
  //     navigate(`/login-success/${userEmail}`);
  //   }
  // } catch (err) {
  //   console.error("QueryGetUserByEmail Error:", err.message);
  //   setStatus("Google Sign In Error");
  // }

  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);
  if (loading) return <Loading />;
  if (error) {
    console.error("createUser Error", error);
    return false;
  }
  if (data && data.createUser) {
    console.log("DATA PRESENT!!", data);
    const newUser = data.createUser;
    console.log("axios /login call");
    axiosLogin(newUser, ctx.user, navigate);
  } else {
    console.log("NO DATA");
  }

  function handleGoogleAuth() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        const user = result.user;
        console.log("Google user", user);
        const name = user.displayName;
        const email = user.email;

        ctx.user = { name, email };
        setUserEmail(email);

        // Create User into Database
        //TODO:If user.metadata.lastLoginAt - user.metadata.createdAt > 1000 -->
        // DONT CREATE USER IN DB
        try {
          console.log("createUser()");
          createUser({ variables: { user: { name, email } } });
        } catch (err) {
          console.error("createUser Error", err.message);
        }
        // return <LoginStep email={email} />;
        // setShow(false);
        console.log("after createUser");
        setUserCreated(true);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.error("Google SignIn Error", errorMessage);
        setStatus("Google Sign In Error");
      });
  }

  return (
    <>
      {userCreated ? (
        <LoginStep email={userEmail} />
      ) : (
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
                <span style={{ color: COLORS.lighterTheme }}>
                  {mode === "Login" ? "Log In" : "Sign Up"}
                </span>
              </span>
            </Button>
          </div>
        </Form>
      )}
    </>
  );
}
