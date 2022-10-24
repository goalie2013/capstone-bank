import React, { useState, useEffect } from "react";

export default function AllData() {
  const [data, setData] = useState("");

  useEffect(() => {
    const url = `http://localhost:3000/account/all`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        setData(JSON.stringify(data));
      });
  }, []);

  return (
    <div style={{ minHeight: "85vh" }}>
      <h5>All Data in Store:</h5>
      {data}
    </div>
  );
}
