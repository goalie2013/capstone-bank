import React, { useState, useContext, useEffect } from "react";
import CustomCard from "../components/Card";
import Form from "react-bootstrap/Form";
import SubmitBtn from "../components/SubmitBtn";
import { UserContext } from "../index";
import PageNotFound from "../components/PageNotFound";
import NotAuthorized from "../components/NotAuthorized";
import { handleChange, downloadScreenshot } from "../helper/handleHelper";
import {
  QueryGetUser,
  MutationUpdateUser,
  QueryGetUserByEmail,
} from "../helper/queryMutationHelper";
import dayjs from "dayjs";
import { COLORS } from "../themes";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import Loading from "../components/Loading";
import { useMediaQuery } from "react-responsive";

export default function Withdraw({ token, userId, userEmail }) {
  console.log("----- WITHDRAW -----");
  const [showSubmit, setShowSubmit] = useState(false);
  const [status, setStatus] = useState("");
  const [withdrawValue, setWithdrawValue] = useState("");
  const [textColor, setTextColor] = useState("");
  const [switchState, setSwitchState] = useState(
    localStorage.getItem("auto-snp") === "true" ? true : false
  );
  const [showDownload, setDownload] = useState(false);
  const [timestamp, setTimestamp] = useState("");
  const { id: paramId } = useParams();
  let balance, transactions, uri;
  const ctx = useContext(UserContext);
  const isBigScreen = useMediaQuery({ query: "(min-width: 650px)" });
  const isBiggerScreen = useMediaQuery({ query: "(min-width: 900px)" });
  const isBiggestScreen = useMediaQuery({ query: "(min-width: 1200px)" });

  if (ctx.user && !ctx.user.id) ctx.user.id = userId;

  useEffect(() => {
    // Download Screenshot
    if (showDownload && timestamp) {
      html2canvas(document.body).then((canvas) => {
        uri = canvas.toDataURL();
        console.log("uri", uri);
        downloadScreenshot("Withdraw", timestamp, uri);

        setShowSubmit(false);
        setWithdrawValue("");
        setTimestamp("");
      });
    }
  }, [timestamp]);

  // Update User Mutation
  const updateUser = MutationUpdateUser(userId, userEmail);

  // Check if userId matches url parameter; if NOT --> Not Authorized
  console.log("USER ID", userId);
  console.log("PARAM ID", paramId);
  if (userId !== paramId) return <NotAuthorized id={userId} />;

  // Get User Query
  try {
    let { loading, currentBalance, xTransactions } = QueryGetUser(userId);
    if (loading) return <Loading />;
    balance = currentBalance;
    transactions = xTransactions;
  } catch (err) {
    console.error("ERRORROROROROR", err.message);

    if (err.message === "Data is null") {
      console.error("DATA IS NULL");
      // setShowPage(false);
      return <PageNotFound id={paramId} />;
    } else if (err.message === "Error getting User Data") {
      return (
        <h1 style={{ color: "red" }}>ERROR GETTING USER DATA: {err.message}</h1>
      );
    }
  }

  function handleWithdraw() {
    console.log("-- handleWithdraw --");
    console.log("withdrawValue", withdrawValue, typeof withdrawValue);
    const timeStamp = dayjs().format("MM/DD/YYYY HH:mm:ss");

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
        timeStamp,
      },
    ];

    try {
      updateUser({
        variables: { id: userId, userData: { balance, transactions } },
      });
    } catch (err) {
      console.error("Withdraw updateUser Error", err.message);
      setTextColor("red");
      setStatus("Transaction Error. Please Try Again");
    }

    setTimestamp(timeStamp);
    setTextColor(COLORS.transactionComplete);
    setStatus("Withdraw Complete!");

    if (switchState) {
      console.log("take screenshot");
      setDownload(true);
    } else {
      setShowSubmit(false);
      setWithdrawValue("");
      setTimestamp("");
    }
  }

  return (
    <>
      {/* <NavBar id={userId} /> */}
      <div className="page-wrapper">
        <Form
          style={{
            position: "relative",
            bottom: "65px",
            right: isBiggestScreen
              ? "390px"
              : isBiggerScreen
              ? "290px"
              : isBigScreen
              ? "190px"
              : "90px",
            margin: "0 auto",
          }}
        >
          <Form.Check
            type="switch"
            id="snapshot-switch"
            label="Snapshot of Transaction"
            defaultChecked={switchState}
            onChange={() => {
              localStorage.setItem("auto-snp", !switchState);
              setSwitchState((prevVal) => !prevVal);
            }}
          />
        </Form>
        <h1>Withdraw</h1>
        <CustomCard
          bgHeaderColor={COLORS.darkerTheme}
          header="Withdraw From Account"
          bgColor={COLORS.cardBodyBg}
          statusText={status}
          statusColor={textColor}
          body={
            <Form
              className="form"
              // onSubmit={(e) =>
              //   handleKeyPress(e, handleWithdraw, setTextColor, setStatus)
              // }
              onSubmit={(e) => e.preventDefault()}
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
                <SubmitBtn
                  name="Withdraw"
                  handleClick={handleWithdraw}
                  bgColor={COLORS.darkerTheme}
                />
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
