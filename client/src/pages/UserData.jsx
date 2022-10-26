import React, { useContext } from "react";
import NavBar from "../components/NavBar";
import Transaction from "../components/Transaction";
import CustomCard from "../components/Card";
import { COLORS } from "../themes";
import { useParams } from "react-router-dom";
import { QueryGetUser } from "../helper/queryMutationHelper";
import { UserContext } from "../index";
import PageNotFound from "../components/PageNotFound";
import { MdOutlineAttachMoney } from "react-icons/md";

export default function UserData({ token, userId, userEmail }) {
  let { id } = useParams();
  let userName, balance, transactions, transactionsEl;
  const ctx = useContext(UserContext);
  console.log("ctx", ctx);
  if (!ctx.user.id) ctx.user.id = userId;

  try {
    const { loading, queriedId, name, currentBalance, xTransactions } =
      QueryGetUser(id);
    console.log("loading", loading);
    if (loading)
      //TODO: Change to Spinner
      return (
        <>
          <NavBar id={userId} />
          <h1>LOADING!!!</h1>
        </>
      );

    id = queriedId;
    userName = name;
    balance = currentBalance;
    transactions = xTransactions;
    console.log("name", userName, balance, transactions);
  } catch (err) {
    // if (err.message == "Loading") return <h1>Loading...</h1>;
  }

  // Check if userId matches url parameter; if NOT --> Not Authorized
  console.log("USER ID", userId);
  console.log("PARAM ID", id);
  if (userId !== id) return <PageNotFound id={userId} />;

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

  return (
    <>
      <NavBar id={userId} />
      {userName && (
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
            {userName} Transaction History
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
            bgHeaderColor="#000"
            // header={`${userName} Transaction History`}
            body={<h4>{transactionsEl}</h4>}
          ></CustomCard>
        </div>
      )}
    </>
  );
}
