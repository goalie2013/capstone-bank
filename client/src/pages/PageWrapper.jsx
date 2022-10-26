import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccessCard from "../components/AccessCard";
import { handleNavigate } from "../helper/handleHelper";
import axios from "axios";

export default function PageWrapper(props) {
  console.log("----- PAGEWRAPPER ------");
  const [showModal, setShowModal] = useState(false);
  let navigate = useNavigate();

  // useEffect(() => {
  //   if (token) fetchData(token);
  // }, [token]);

  // const fetchData = async (token) => {
  //   const result = await axios.get("http://localhost:5000/api/todos", {
  //     headers: {
  //       Authorization: "Bearer " + token,
  //     },
  //   });
  //   console.log(result.data);
  // };

  return (
    <>
      {showModal ? (
        <div
          style={{
            display: "flex",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            // top: "60%",
          }}
        >
          <AccessCard
            bodyTxt="Must create account to access Bank Transactions."
            handleClick={(e) => handleNavigate(e, navigate)}
          />
          {/* {props.accessCard} */}

          <div className="overlay"></div>
        </div>
      ) : (
        <>{props.pageComponent}</>
      )}
    </>
  );
}
