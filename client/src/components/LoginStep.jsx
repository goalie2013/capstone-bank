import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { app } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { UserContext } from "../index";
import NotAuthorized from "./NotAuthorized";
import { QueryGetUserByEmail } from "../helper/queryMutationHelper";
import { axiosLogin } from "../helper/axiosHelper";
import Loading from "./Loading";

// Need a LoginStep bc Query functions for GraphQL run right away, so create issues in Login component.
// Get User Info from Email Query --> Get New Access & Refresh Tokens -> Navigate to Deposit
export default function LoginStep({ email }) {
  console.log("---LOGINSTEP---");
  const [showModal, setShowModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const ctx = useContext(UserContext);
  const firebaseAuth = getAuth(app);
  const paramEmail = useParams();
  let id;
  let userData;
  // const userEmail = email ? email : paramEmail;

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      console.log("firebase auth state changed");
      console.log("user", user);
      if (user) {
        ctx.user = { email: user.email };
        setUserEmail(user.email);
      } else {
        navigate("/", { replace: true });
      }
    });
  }, []);

  try {
    let { user, loading } = QueryGetUserByEmail(userEmail);
    if (loading) return <Loading />;
    userData = user;

    console.log("USER DATA", userData);
  } catch (err) {
    console.error("ERRORROROROROR", err.message);

    if (err.message == "Data is null") {
      console.error("DATA IS NULL");
      // setShowPage(false);
      //   return <PageNotFound id={paramId} />;
    } else if (err.message == "Error getting User Data") {
      return (
        <h1 style={{ color: "red" }}>ERROR GETTING USER DATA: {err.message}</h1>
      );
    }
  }

  if (userData) {
    const userObj = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
    };

    // Go to server /login to get Access & Refresh Tokens
    console.log("axios call", userObj);
    axiosLogin(userObj, ctx.user, navigate);
  } else {
    console.log("NO DATA");
  }

  return (
    <>
      {showModal ? (
        <>
          <NotAuthorized id={id} />
        </>
      ) : (
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
      )}
    </>
  );
}
