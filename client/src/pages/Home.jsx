import React from "react";
import CustomCard from "../components/Card";
import moneyPic from "../assets/money.jpeg";
import { COLORS } from "../themes.js";
import moneyIcon from "../assets/money-icon.png";
import NavBar from "../components/NavBar";

export default function Home() {
  return (
    <>
      {" "}
      <NavBar />
      <div className="page-wrapper">
        <span
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          <h1 style={{ fontWeight: 700 }}>Bad Bank</h1>
          <img
            src={moneyIcon}
            className="img-fluid"
            alt="Coins with rooting plant"
            style={{ width: "5rem", marginLeft: "1.25rem" }}
          />
        </span>
        <CustomCard
          bgHeaderColor={COLORS.cardHeader}
          txtColor="#000"
          bgColor={COLORS.cardBackground}
          header="Welcome"
          title="Welcome to our Bank"
          text="You can use this bank to deposit and withdraw savings, and view your transaction history."
          body={
            <img
              src={moneyPic}
              className="img-fluid"
              alt="Coins with rooting plant"
            />
          }
        />
      </div>
    </>
  );
}
