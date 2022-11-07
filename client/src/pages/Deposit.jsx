import React, { useState, useContext, useEffect } from "react";
import SubmitBtn from "../components/SubmitBtn";
import CustomCard from "../components/Card";
import Form from "react-bootstrap/Form";
import { UserContext } from "../index";
import PageNotFound from "../components/PageNotFound";
import { handleChange, downloadScreenshot } from "../helper/handleHelper";
import {
  QueryGetUser,
  MutationUpdateUser,
} from "../helper/queryMutationHelper";
import dayjs from "dayjs";
import { COLORS } from "../themes";
import { useParams } from "react-router-dom";
import NotAuthorized from "../components/NotAuthorized";
import html2canvas from "html2canvas";
import Loading from "../components/Loading";
import { useMediaQuery } from "react-responsive";

// ** If grabbing value from onChange on each keychange, use ref OR e.target.value; NOT depositValue
// ** setState won't update until next render, so messes up disabled/abled button

export default function Deposit({ userId, userEmail }) {
  console.log("----- DEPOSIT -----");
  // const ref = useRef(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [status, setStatus] = useState("");
  const [switchState, setSwitchState] = useState(
    localStorage.getItem("auto-snp") === "true" ? true : false
  );
  const [showDownload, setDownload] = useState(false);
  const [timestamp, setTimestamp] = useState("");
  const [depositValue, setDepositValue] = useState("");
  const [textColor, setTextColor] = useState("");
  const { id: paramId } = useParams();
  const ctx = useContext(UserContext);
  const isBigScreen = useMediaQuery({ query: "(min-width: 650px)" });
  const isBiggerScreen = useMediaQuery({ query: "(min-width: 900px)" });
  const isBiggestScreen = useMediaQuery({ query: "(min-width: 1200px)" });

  let balance, transactions, uri, base64;

  if (ctx.user && !ctx.user.id) ctx.user.id = userId;

  // Check if userId matches url parameter; if NOT --> Not Authorized
  console.log("USER ID", userId);
  console.log("PARAM ID", paramId);

  useEffect(() => {
    console.count("Deposit useEffect");
    // Download Screenshot
    if (showDownload && timestamp) {
      html2canvas(document.body).then((canvas) => {
        uri = canvas.toDataURL();
        console.log("uri", uri);
        downloadScreenshot("Deposit", timestamp, uri);

        setShowSubmit(false);
        setDepositValue("");
        setTimestamp("");
      });
    }
  }, [timestamp]);

  if (userId !== paramId) return <NotAuthorized id={userId} />;

  // Update User using GraphQL Mutation
  const updateUser = MutationUpdateUser(userId, userEmail);

  // Get User Query: Retrieve Balance & Transactions
  try {
    let { loading, currentBalance, xTransactions } = QueryGetUser(userId);
    if (loading) return <Loading />;
    balance = currentBalance;
    transactions = xTransactions;
  } catch (err) {
    console.error("ERRORROROROROR", err.message);

    if (err.message == "Data is null") {
      console.error("DATA IS NULL");
      // setShowPage(false);
      return <PageNotFound id={paramId} />;
    } else if (err.message == "Error getting User Data") {
      return (
        <h1 style={{ color: "red" }}>ERROR GETTING USER DATA: {err.message}</h1>
      );
    }
  }

  function handleDeposit() {
    // console.log("ref", ref.current.value, typeof ref.current.value);
    console.log("-- handleDeposit FUNCTION --");
    console.log("depositVal", depositValue, typeof depositValue);
    const depositInt = parseInt(depositValue);
    const timeStamp = dayjs().format("MM/DD/YYYY HH:mm:ss");
    balance += depositInt;
    transactions = [
      ...transactions,
      {
        info: `Deposit $${depositInt}`,
        timeStamp,
      },
    ];

    try {
      updateUser({
        variables: { id: userId, userData: { balance, transactions } },
      });
    } catch (err) {
      console.error("Deposit updateUser Error", err.message);
      setTextColor("red");
      setStatus("Transaction Error. Please Try Again");
    }

    setTimestamp(timeStamp);
    setTextColor(COLORS.transactionComplete);
    setStatus("Deposit Complete!");

    // If Snapshot Switch is on --> Take Screenshot
    if (switchState) {
      console.log("take screenshot");
      setDownload(true);
    } else {
      setShowSubmit(false);
      setDepositValue("");
      setTimestamp("");
    }
  }

  return (
    <>
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
        <h1>Deposit</h1>

        <CustomCard
          id="#deposit-card"
          bgHeaderColor={COLORS.darkerTheme}
          header="Deposit Into Account"
          bgColor={COLORS.cardBodyBg}
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
                <SubmitBtn
                  name="Deposit"
                  handleClick={handleDeposit}
                  bgColor={COLORS.darkerTheme}
                />
              ) : (
                <SubmitBtn name="Deposit" disabled="true" />
              )}
            </Form>
          }
        />
      </div>
    </>
  );
}
