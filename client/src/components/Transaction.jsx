import React from "react";

export default function Transaction(props) {
  const styles = {
    backgroundColor: props.idx % 2 === 0 ? "lightgray" : "white",
  };

  return (
    <div className="transaction" style={styles}>
      <h4>{props.transaction.timeStamp}</h4>
      <h4 style={{ marginLeft: "3rem" }}>{props.transaction.info}</h4>
    </div>
  );
}
