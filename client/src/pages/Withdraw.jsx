import React, { useState, useEffect, useContext } from "react";
import NavBar from "../components/NavBar";
import CustomCard from "../components/Card";
import Form from "react-bootstrap/Form";
import SubmitBtn from "../components/SubmitBtn";
import { UserContext } from "../index";
import PageNotFound from "../components/PageNotFound";
import { handleChange } from "../helper/handleHelper";
import {
  QueryGetUser,
  MutationUpdateUser,
  QueryGetUserByEmail,
} from "../helper/queryMutationHelper";
import dayjs from "dayjs";
import { COLORS } from "../themes";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Withdraw({ token, userId, userEmail }) {
  console.log("----- WITHDRAW -----");
  const [showSubmit, setShowSubmit] = useState(false);
  const [status, setStatus] = useState("");
  const [withdrawValue, setWithdrawValue] = useState("");
  const [textColor, setTextColor] = useState("");
  const { id } = useParams();
  let balance, transactions;
  const ctx = useContext(UserContext);
  console.log("ctx", ctx);

  if (!ctx.user.id) ctx.user.id = userId;

  useEffect(() => {
    if (token) fetchData(token);
  }, [token]);

  const fetchData = async (token) => {
    console.log("fetchData token", token);
    const result = await axios.get("http://localhost:5050/api/todos", {
      headers: {
        Authorization: `Bearer + ${token}`,
      },
    });
    console.log(result.data);
  };

  // Check if userId matches url parameter; if NOT --> Not Authorized
  console.log("USER ID", userId);
  console.log("PARAM ID", id);
  if (userId !== id) return <PageNotFound id={userId} />;

  // Update User Mutation
  const updateUser = MutationUpdateUser(id, userEmail);

  // Get User Query
  try {
    QueryGetUserByEmail(userEmail);
    let { queriedId, currentBalance, xTransactions } = QueryGetUser(id);
    // userId = queriedId;
    balance = currentBalance;
    transactions = xTransactions;
  } catch (err) {
    console.error("ERRORROROROROR", err.message);

    if (err.message == "Data is null") {
      console.error("DATA IS NULL");
      // setShowPage(false);
      return <PageNotFound id={id} />;
    } else if (err.message == "Error getting User Data") {
      return (
        <h1 style={{ color: "red" }}>ERROR GETTING USER DATA: {err.message}</h1>
      );
    }
  }

  function handleWithdraw() {
    console.log("-- handleWithdraw --");
    console.log("withdrawValue", withdrawValue, typeof withdrawValue);

    // Do NOT have to caste withdrawValue to int. Works bc JS internally converts a subtraction to a number
    // DOES NOT WORK FOR ADDITION
    if (balance - withdrawValue < 0) {
      setTextColor("red");
      setStatus(`Transaction FAILED. Balance cannot be negative`);
      setShowSubmit(false);
      return false;
    }

    balance -= withdrawValue;
    transactions = [
      ...transactions,
      {
        info: `Withdraw $${withdrawValue}`,
        timeStamp: dayjs().format("MM/DD/YYYY HH:mm:ss"),
      },
    ];

    try {
      updateUser({ variables: { id, userData: { balance, transactions } } });
    } catch (err) {
      console.error("Withdraw updateUser Error", err.message);
    }

    setTextColor(COLORS.transactionComplete);
    setStatus("Withdraw Complete!");
    setShowSubmit(false);
    setWithdrawValue("");
  }

  return (
    <>
      <NavBar id={userId} />
      <div className="page-wrapper">
        <h1>Withdraw</h1>
        <CustomCard
          bgHeaderColor={COLORS.cardHeader}
          header="Withdraw From Account"
          bgColor={COLORS.cardBackground}
          statusText={status}
          statusColor={textColor}
          body={
            <Form
              className="form"
              // onSubmit={(e) =>
              //   handleKeyPress(e, handleWithdraw, setTextColor, setStatus)
              // }
            >
              <Form.Group className="mb-2" controlId="formWithdraw">
                <Form.Label style={{ fontSize: "1.5rem" }}>
                  Withdraw Amount
                </Form.Label>
                <Form.Control
                  required
                  // ref={ref}
                  size="lg"
                  type="text"
                  placeholder="Withdraw"
                  value={withdrawValue}
                  onChange={(e) =>
                    handleChange(
                      e,
                      setWithdrawValue,
                      setStatus,
                      setShowSubmit,
                      setTextColor
                    )
                  }
                />
              </Form.Group>

              {showSubmit ? (
                <SubmitBtn name="Withdraw" handleClick={handleWithdraw} />
              ) : (
                <SubmitBtn name="Withdraw" disabled="true" />
              )}
            </Form>
          }
        />
        {/* DEVELOPMENT ONLY */}
        {/* <div>{JSON.stringify(user)}</div> */}
      </div>
    </>
  );
}
