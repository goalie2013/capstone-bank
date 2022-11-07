import React, { useState, useEffect, useContext } from "react";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import NotAuthorized from "../components/NotAuthorized";
import UserData from "./UserData";
import DeleteAccount from "./DeleteAccount";
import DatabaseDown from "../components/DatabaseDown";
import PageNotFound from "../components/PageNotFound";
import { UserContext } from "../index";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { axiosAuthorizeUserTokens } from "../helper/axiosHelper";
import Loading from "../components/Loading";
import { QueryGetUserByEmail } from "../helper/queryMutationHelper";

// Get Email -> Query User by Email
// Authorize JWT Tokens
// If User && JWT Verified --> Go to desired page
export default function AuthWrapperNew({ pageComponent }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showServerDown, setServerDown] = useState(false);
  const [showPage, setShowPage] = useState(false);
  const [email, setEmail] = useState("");
  const [jwtValid, setJwtValid] = useState("");
  const firebaseAuth = getAuth(app);
  const { id: paramId } = useParams();
  const ctx = useContext(UserContext);
  let userId = ctx.user && ctx.user.id;

  console.count("----- AUTHWRAPPERNew ------");
  console.log("pageComponent", pageComponent);
  console.log("EMAIL", email);

  function logout() {
    console.log("logout FUNCTION Called");
    firebaseAuth.signOut();
    ctx.user = {};
    localStorage.removeItem("token");
    localStorage.removeItem("refresh token");
    navigate("/");
  }

  // Authorize user by sending JWT to Server & verifying token
  useEffect(() => {
    console.count("useEffect");

    if (ctx.user.email && !email) {
      console.log("Set email from ctx");
      setEmail(ctx.user.email);
    }

    // Use firebaseAuth to get user's email, so can use it to query for user in DB
    firebaseAuth.onAuthStateChanged((userCredential) => {
      if (userCredential) {
        console.count("userCredential EMAIL");
        if (!email) setEmail(userCredential.email);
      } else {
        console.warn("NO USER CREDENTIAL");
        if (jwtValid) setJwtValid("");
        // setShowModal(true);
      }
    });

    // User authenticated; now need to authorize by passing JWT to Server to verify
    const token = localStorage.getItem("token");
    console.log("token from localStorage", token);

    axiosAuthorizeUserTokens(
      ctx.user,
      token,
      setJwtValid,
      setServerDown,
      setShowModal,
      logout
    );
  }, []);

  // GET USER BY EMAIL GRAPHQL QUERY
  let userData;
  const startTime = new Date();

  try {
    let { user, loading } = QueryGetUserByEmail(email);
    if (loading) return <Loading id={paramId} />;

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

  // If user ID does NOT equal the parameter ID ==> Not Authorized
  //   if (ctx.user && ctx.user.id && ctx.user.id !== paramId) {
  //     console.log("USER ID AND PARAM ID NOT THE SAME");
  //     return <NotAuthorized id={ctx.user.id} />;
  //   }

  if (userData) {
    console.log("DATA FOUND");
    console.log("jwtValid", jwtValid);
    userId = userData.id;

    // If user ID does NOT equal the parameter ID ==> Not Authorized
    if (userData && userId !== paramId) {
      console.log("userData.id", userId);
      return <NotAuthorized id={userId} />;
    }

    if ((jwtValid && userData) || showPage) {
      console.log("switching page...");
      switch (pageComponent) {
        case "Deposit":
          return <Deposit userId={userId} userEmail={userData.email} />;
        case "Withdraw":
          return <Withdraw userId={userId} userEmail={userData.email} />;
        case "UserData":
          return <UserData userId={userId} userEmail={userData.email} />;
        case "DeleteAccount":
          return <DeleteAccount user={userData} />;
      }
    }
  } else {
    // If takes longer than 8 seconds to find user data, show Page Not Found

    const endTime = new Date();
    let timeDiff = endTime - startTime; //in ms
    // strip the ms
    timeDiff /= 1000;

    // get seconds
    const seconds = Math.round(timeDiff);
    console.log(seconds + " seconds");

    if (seconds > 8) return <PageNotFound id={paramId} />;
  }

  return (
    <>
      {showModal ? (
        <NotAuthorized id={paramId} />
      ) : showServerDown ? (
        <DatabaseDown />
      ) : (
        <Loading id={paramId} />
      )}
    </>
  );
}

// ** setState in global scope is BAD. rerender loop
//   if (showPage) {
//     switch (pageComponent) {
//       case "Deposit":
//         return <Deposit userId={userId} userEmail={email} />;
//       case "Withdraw":
//         return <Withdraw userId={id} userEmail={email} />;
//       case "UserData":
//         return <UserData userId={id} userEmail={email} />;
//     }
//   }
