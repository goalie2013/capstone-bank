import React from "react";
import { COLORS } from "../themes";

export default function Transaction(props) {
  const styles = {
    // backgroundColor: props.idx % 2 === 0 ? "lightgray" : "white",
    backgroundColor:
      props.idx % 2 === 0 ? COLORS.darkerTheme : COLORS.lighterTheme,
    color: props.idx % 2 === 0 ? COLORS.lighterTheme : COLORS.darkerTheme,
  };

  return props.empty ? (
    <div className="transaction" style={{}}>
      <h2>No Transactions</h2>
    </div>
  ) : (
    <div className="transaction" style={styles}>
      <h4 style={{ fontSize: "1.5rem" }}>{props.transaction.timeStamp}</h4>
      <h4 style={{ marginLeft: "3rem", fontSize: "1.5rem" }}>
        {props.transaction.info}
      </h4>
    </div>
  );
}
