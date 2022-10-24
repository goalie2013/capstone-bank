import React, { useState } from "react";
import { Form } from "react-bootstrap";
import SubmitBtn from "./SubmitBtn";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../mutations/userMutations";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { QueryUserEmail } from "../helper/queryMutationHelper";

export default function GoogleAuthCreateUser() {
  const [email, setEmail] = useState("");
  const auth = getAuth(app);
  auth.languageCode = "it";

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    "login_hint": "user@example.com",
  });

  const navigate = useNavigate();

  // const emailExists = QueryUserEmail(email);
  // if (emailExists) {
  //   console.log("ALREADY EXISTSSSS");
  //   const { id } = emailExists;
  //   navigate(`/deposit/${id}`);
  // }

  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);
  if (error) console.error("Apollo Error", error);
  if (loading) console.log("LOADING");
  if (data) {
    console.log("DATA PRESENT!!", data);
    navigate(`/deposit/${data.createUser.id}`);
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
        setEmail(email);
        try {
          // const emailExists = QueryUserEmail(email);
          // if (emailExists) {
          //   console.log("ALREADY EXISTSSSS");
          //   const { id, email } = emailExists;
          //   navigate(`/deposit/${id}`);
          // }
          createUser({ variables: { user: { name, email } } });
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
      <SubmitBtn name="Google" handleClick={handleGoogleAuth} />
    </Form>
  );
}
