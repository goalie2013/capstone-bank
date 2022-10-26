import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccessCard from "../components/AccessCard";
import { handleNavigate } from "../helper/handleHelper";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import NavBar from "../components/NavBar";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_EMAIL } from "../queries/userQueries";
import NotAuthorized from "../components/NotAuthorized";
import UserData from "./UserData";

export default function AuthWrapper({ pageComponent }) {
  console.log("----- AUTHWRAPPER ------");
  const [showModal, setShowModal] = useState(false);
  const [auth, setAuth] = useState(
    window.localStorage.getItem("auth") === true || false
  );
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  let navigate = useNavigate();
  const firebaseAuth = getAuth(app);

  const { id } = useParams();

  console.log("EMAIL", email);
  const { loading, error, data } = useQuery(GET_USER_BY_EMAIL, {
    variables: { email },
    // pollInterval: 1000,
  });
  if (loading) console.error("LOADINGGGGG");
  if (error) console.error("ERROR");

  console.log("GET_USER_BY_EMAIL DATA", data);

  // If userCred is null, means no user logged in w/ auth token -->
  // Deny page entry &/or redirect to Create Account page
  useEffect(() => {
    firebaseAuth.onAuthStateChanged((userCred) => {
      if (userCred) {
        console.log("userCred", userCred);
        console.log("useEffect auth", auth);
        console.log("EMAIL", userCred.email);
        setEmail(userCred.email);

        setAuth(true);
        window.localStorage.setItem("auth", "true");

        userCred.getIdToken().then((token) => {
          console.log("useEffect token", token);
          window.localStorage.setItem("token", token);
          setToken(token);
        });
      } else {
        console.warn("NO USER CREDENTIAL");
        if (auth) {
          console.log("running setAuth...");
          setAuth(false);
        }
        console.log("auth after NO USER CRED", auth);
        window.localStorage.setItem("auth", "false");
        window.localStorage.setItem("token", "");
        setShowModal(true);
        console.log("FDSFSDFKFSDK", auth);
        // return <NotAuthorized id={id} />;
        setShowModal(true);
      }
    });
  }, []);

  console.log("pageComponent", pageComponent);

  if (data) {
    if (data.getUserByEmail && data.getUserByEmail.id !== id) {
      console.log("data.getUserByEmail.id", data.getUserByEmail.id);
      return <NotAuthorized id={data.getUserByEmail.id} />;
    }

    if (token && data.getUserByEmail) {
      switch (pageComponent) {
        case "Deposit":
          return (
            <Deposit
              token={token}
              userId={data.getUserByEmail.id}
              userEmail={data.getUserByEmail.email}
            />
          );
        case "Withdraw":
          return (
            <Withdraw
              token={token}
              userId={data.getUserByEmail.id}
              userEmail={data.getUserByEmail.email}
            />
          );
        case "UserData":
          return (
            <UserData
              token={token}
              userId={data.getUserByEmail.id}
              userEmail={data.getUserByEmail.email}
            />
          );
      }
    }
  }
  return (
    <>
      {showModal ? (
        <>
          {/* <NavBar />
          <div
            style={{
              display: "flex",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              // top: "60%",
            }}
          >
            <AccessCard
              bodyTxt="Must be signed in to access Bank Transactions."
              handleClick={(e) => handleNavigate(e, navigate)}
            />

            <div className="overlay"></div>
          </div> */}
          <NotAuthorized id={id} />
        </>
      ) : (
        // token && <X token={token} />
        //TODO:
        // <NotAuthorized />
        <>
          <NavBar id={id} />
          <div
            class="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
          >
            <div
              class="spinner-border text-primary"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span class="sr-only"></span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
