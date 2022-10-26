import React, { useContext } from "react";
import CustomCard from "../components/Card";
import moneyPic from "../assets/home-pic.png";
import transactionPic from "../assets/transaction-vector.png";
import { COLORS } from "../themes.js";
// import moneyIcon from "../assets/money-icon.png";
import moneyBag from "../assets/money-bag.png";
import NavBar from "../components/NavBar";
import { UserContext } from "../index";

export default function Home() {
  const ctx = useContext(UserContext);
  let id;
  console.log("ctx", ctx);
  ctx.user.id ? (id = ctx.user.id) : (id = "bad-request");

  return (
    <>
      <NavBar id={id} />
      <div className="page-wrapper">
        <span
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          <img
            src={moneyBag}
            className="img-fluid"
            alt="Money Bag"
            style={{ width: "5rem", marginRight: "1.5rem" }}
          />
          <h1 style={{ fontWeight: 900 }}>Bad Bank</h1>
        </span>
        <CustomCard
          bgHeaderColor={COLORS.cardHeader}
          txtColor="#000"
          bgColor={COLORS.cardBackground}
          header="Welcome"
          title="Welcome to our Bank"
          text="Deposit and withdraw savings, and view your transaction history."
          body={
            <img
              src={moneyPic}
              className="img-fluid"
              alt="Bad Bank Logo. Palm with Coin"
            />
          }
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-around",
            width: "100%",
            marginTop: "5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={transactionPic}
              className="img-fluid"
              alt="Bad Bank Logo. Palm with Coin"
              style={{
                width: "15rem",
                marginBottom: "1.5rem",
              }}
            />
            <h4>
              Easy tracking of finances
              <br /> with Transaction History
            </h4>
          </div>
          <img
            src={transactionPic}
            className="img-fluid"
            alt="Bad Bank Logo. Palm with Coin"
            style={{
              width: "15rem",
            }}
          />
        </div>
      </div>
    </>
  );
}
