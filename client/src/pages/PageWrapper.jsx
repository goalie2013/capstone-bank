import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AccessCard from "../components/AccessCard";
import { handleNavigate } from "../helper/handleHelper";

export default function PageWrapper(props) {
  console.log("----- PAGEWRAPPER ------");
  const [showModal, setShowModal] = useState(false);
  // const ctx = useContext(UserContext);
  // const currentUser = ctx.users[ctx.users.length - 1];
  //TODO:
  const currentUser = {};

  let navigate = useNavigate();

  // console.log("ctx", ctx);
  // console.log("currentUser", currentUser);
  console.log("showModal value", showModal);

  // If context is empty, means no user signed up -->
  // Deny page entry &/or redirect to Create Account page
  useEffect(() => {
    // ctx.users.length === 0 ? setShowModal(true) : setShowModal(false);
  }, []);

  return (
    <>
      {showModal ? (
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
            bodyTxt="Must create account to access Bank Transactions."
            handleClick={(e) => handleNavigate(e, navigate)}
          />
          {/* {props.accessCard} */}

          <div className="overlay"></div>
        </div>
      ) : (
        <>{props.pageComponent}</>
      )}
    </>
  );
}
