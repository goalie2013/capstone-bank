import React, { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import SubmitBtn from "../components/SubmitBtn";
import CustomCard from "../components/Card";
import Form from "react-bootstrap/Form";
import { handleChange, handleKeyPress } from "../helper/handleHelper";
import {
  QueryGetUser,
  MutationUpdateUser,
} from "../helper/queryMutationHelper";
import dayjs from "dayjs";
import { COLORS } from "../themes";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";

// ** If grabbing value from onChange on each keychange, use ref OR e.target.value; NOT depositValue
// ** setState won't update until next render, so messes up disabled/abled button

export default function Deposit() {
  console.log("---- DEPOSIT -----");
  // const ref = useRef(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [status, setStatus] = useState("");
  const [depositValue, setDepositValue] = useState("");
  const [textColor, setTextColor] = useState("");
  const [showPage, setShowPage] = useState(false);
  const { id } = useParams();
  let balance, transactions;
  const auth = getAuth(app);
  console.log("auth.currentUser", auth.currentUser);
  auth.currentUser
    .getIdToken(/* forceRefresh */ true)
    .then(function (idToken) {
      // Send token to your backend via HTTPS
      console.log("idToken", idToken);
    })
    .catch(function (error) {
      // Handle error
    });

  const updateUser = MutationUpdateUser(id);

  try {
    let { currentBalance, xTransactions } = QueryGetUser(id);
    console.log("HOW DOES IT GET HERE??????");
    balance = currentBalance;
    transactions = xTransactions;
  } catch (err) {
    console.error("ERRORROROROROR", err.message);

    if (err.message == "Data is null") {
      console.error("DATA IS NULL");
      // setShowPage(false);
      return (
        <>
          <NavBar userId={id} />
          <h1 style={{ color: "red", textAlign: "center" }}>
            NO USER DATA/NOT AUTHORIZED
          </h1>
        </>
      );
    } else if (err.message == "Error getting User Data") {
      return (
        <h1 style={{ color: "red" }}>ERROR GETTING USER DATA: {err.message}</h1>
      );
    }
  }

  // To get rid of glitch where you see the page first
  // setTimeout(() => {
  //   console.log("SET TIMEOUT!!!!!!!!!!!!");
  //   if (!showPage) setShowPage(true);
  // }, 2000);

  if (!showPage) setShowPage(true);

  function handleDeposit() {
    // console.log("ref", ref.current.value, typeof ref.current.value);
    console.log("-- handleDeposit --");
    console.log("depositVal", depositValue, typeof depositValue);
    const depositInt = parseInt(depositValue);
    balance += depositInt;
    transactions = [
      ...transactions,
      {
        info: `Deposit $${depositInt}`,
        timeStamp: dayjs().format("MM/DD/YYYY HH:mm:ss"),
      },
    ];

    try {
      updateUser({ variables: { id, userData: { balance, transactions } } });
    } catch (err) {
      console.error("Deposit updateUser Error", err.message);
    }

    setTextColor("green");
    setStatus("Deposit Complete!");
    setShowSubmit(false);
    setDepositValue("");
  }

  return (
    <>
      <NavBar userId={id} />
      {showPage && (
        <div className="page-wrapper">
          <h1>Deposit</h1>
          <CustomCard
            bgHeaderColor={COLORS.cardHeader}
            header="Deposit Into Account"
            bgColor={COLORS.cardBackground}
            statusText={status}
            statusColor={textColor}
            body={
              <Form
                className="form"
                // onSubmit={(e) =>
                //   handleKeyPress(e, handleDeposit, setTextColor, showSubmit,setStatus)
                // }
                onSubmit={(e) => e.preventDefault()}
              >
                <Form.Group className="mb-4" controlId="formDeposit">
                  <Form.Label style={{ fontSize: "1.5rem" }}>
                    Deposit Amount
                  </Form.Label>
                  <Form.Control
                    required
                    // ref={ref}
                    size="lg"
                    type="text"
                    placeholder="Deposit"
                    value={depositValue}
                    onChange={(e) =>
                      handleChange(
                        e,
                        setDepositValue,
                        setStatus,
                        setShowSubmit,
                        setTextColor
                      )
                    }
                  />
                </Form.Group>

                {showSubmit ? (
                  <SubmitBtn name="Deposit" handleClick={handleDeposit} />
                ) : (
                  <SubmitBtn name="Deposit" disabled="true" />
                )}
              </Form>
            }
          />
          {/* DEVELOPMENT ONLY */}
          {/* <div>{JSON.stringify(user)}</div> */}
        </div>
      )}
    </>
  );
}

// function handleKeyPress(e) {
//   console.log("--- handleKeyPress ---");
//   e.preventDefault();
//   if (e.keyCode === 13) {
//     if (show === true) {
//       handleDeposit();
//       return false;
//     } else {
//       setTextColor("red");
//       setStatus("Cannot Complete Deposit");
//       return false;
//     }
//   } else {
//     return false;
//   }
// }
