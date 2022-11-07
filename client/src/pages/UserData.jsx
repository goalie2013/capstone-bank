import React, { useContext } from "react";
import Transaction from "../components/Transaction";
import CustomCard from "../components/Card";
import { COLORS } from "../themes";
import { useParams } from "react-router-dom";
import { QueryGetUser } from "../helper/queryMutationHelper";
import { UserContext } from "../index";
import PageNotFound from "../components/PageNotFound";
import { MdOutlineAttachMoney } from "react-icons/md";
import NotAuthorized from "../components/NotAuthorized";
import Loading from "../components/Loading";

export default function UserData({ userId, userEmail }) {
  console.count(" --- UserData ---");
  let { id: paramId } = useParams();
  let userName, balance, transactions, transactionsEl;
  const ctx = useContext(UserContext);
  console.log("ctx", ctx);
  if (!ctx.user.id) ctx.user.id = userId;

  try {
    const { loading, name, currentBalance, xTransactions } =
      QueryGetUser(userId);
    if (loading) return <Loading />;
    userName = name;
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

  // Check if userId matches url parameter; if NOT --> Not Authorized
  console.log("USER ID", userId);
  console.log("PARAM ID", paramId);
  if (userId !== paramId) return <NotAuthorized id={userId} />;

  console.log("transactions", transactions);

  try {
    transactionsEl = transactions.map((el, idx) => {
      // `${idx + 1}: ${el}`;
      return <Transaction key={idx} idx={idx} transaction={el} empty={false} />;
    });
    if (transactions.length === 0)
      transactionsEl = <Transaction empty={true} />;
  } catch (err) {
    if (err.message == "Cannot read properties of undefined (reading 'map')") {
      return <PageNotFound />;
    }
  }

  const nameLower = userName.toLowerCase();
  // const nameCapitalized = nameLower[0].toUpperCase() + nameLower.slice(1);

  const words = userName.split(" ");
  const nameCapitalized = words
    .map((word) => word[0].toUpperCase() + word.substring(1))
    .join(" ");

  return (
    <>
      {/* <NavBar id={userId} /> */}
      {nameCapitalized ? (
        <div className="page-wrapper">
          <h1
            style={{
              textAlign: "center",
              color: COLORS.darkerTheme,
              fontSize: "2.5rem",
              padding: "1rem",
              overflowWrap: "break-word",
              fontWeight: 900,
            }}
          >
            {nameCapitalized} Transaction History
          </h1>
          <h3 style={{ marginTop: "2rem" }}>
            <b>
              Your Current Balance: <MdOutlineAttachMoney />
              <span style={{ fontFamily: "Roboto", fontSize: "1.5rem" }}>
                {balance}
              </span>
            </b>
          </h3>
          {/* <h3>Transaction History</h3> */}
          <CustomCard
            bgHeaderColor={COLORS.darkerTheme}
            bgColor={COLORS.cardBodyBg}
            body={<h4>{transactionsEl}</h4>}
          />
        </div>
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
