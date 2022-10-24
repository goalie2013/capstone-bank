// import React from "react";
import NavBar from "../components/NavBar";
import Transaction from "../components/Transaction";
import CustomCard from "../components/Card";
import { COLORS } from "../themes";
import { useParams } from "react-router-dom";
import { QueryGetUser } from "../helper/queryMutationHelper";
import { Link } from "react-router-dom";

export default function UserData() {
  const { id } = useParams();
  let userName, balance, transactions, transactionsEl;

  try {
    const { loading, name, currentBalance, xTransactions } = QueryGetUser(id);
    console.log("loading", loading);
    if (loading)
      //TODO: Change to Spinner
      return (
        <>
          <NavBar userId={id} />
          <h1>LOADING!!!</h1>
        </>
      );

    userName = name;
    balance = currentBalance;
    transactions = xTransactions;
    console.log("name", userName, balance, transactions);
  } catch (err) {
    // if (err.message == "Loading") return <h1>Loading...</h1>;
  }

  console.log("transactions", transactions);

  // const transactions =
  //   currentUser &&
  //   currentUser.transactions.map((el, i) => {
  //`${i + 1}: ${el}`;
  // return <Transaction key={i} idx={i} transaction={el} />;
  // });
  try {
    transactionsEl = transactions.map((el, idx) => {
      // `${idx + 1}: ${el}`;
      return <Transaction key={idx} idx={idx} transaction={el} />;
    });
  } catch (err) {
    if (err.message == "Cannot read properties of undefined (reading 'map')") {
      return (
        <>
          <h2>404 Page Not Found</h2>
          <hr />
          <h3>
            Go to{" "}
            <Link to="/" style={{}}>
              Homepage
            </Link>
          </h3>
        </>
      );
    }
  }

  return (
    <>
      <NavBar userId={id} />
      {userName && (
        <div className="page-wrapper">
          <h1>All Data</h1>
          <h3 style={{ marginTop: "2rem" }}>
            <b>Your Current Balance: {balance}</b>
          </h3>
          {/* <h3>Transaction History</h3> */}
          <CustomCard
            bgHeaderColor={COLORS.cardHeader}
            header={`${userName} Transaction History`}
            body={<h4>{transactionsEl}</h4>}
          ></CustomCard>
          {/* {transactions} */}
        </div>
      )}
    </>
  );
}
