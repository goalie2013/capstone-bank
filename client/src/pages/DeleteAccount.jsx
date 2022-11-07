import { useState, useContext } from "react";
import CustomCard from "../components/Card";
import SubmitBtn from "../components/SubmitBtn";
import Card from "react-bootstrap/Card";
import { COLORS } from "../themes.js";
import { useMutation } from "@apollo/client";
import { DELETE_USER } from "../mutations/userMutations";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import { getAuth, deleteUser as deleteFirebaseUser } from "firebase/auth";
import { UserContext } from "../index";

export default function DeleteAccount({ user }) {
  const navigate = useNavigate();
  const firebaseAuth = getAuth(app);
  const ctx = useContext(UserContext);
  const [show, setShow] = useState(true);
  const { id, name, email } = user;
  const nameLower = name.toLowerCase();
  const nameCapitalized = nameLower[0].toUpperCase() + nameLower.slice(1);

  console.log("email", email);

  const [deleteUser, { data, loading, error }] = useMutation(DELETE_USER);
  if (loading) {
    console.log("--DELETEUSER LOADING--");
    return "Loading";
  }
  if (error) {
    console.error("deleteUser Error", error);
    alert(error.message);
    return false;
  }

  console.log("data", data);

  function handleDelete() {
    console.log("handleDelete FUNCTION");
    try {
      deleteUser({ variables: { id } });
      deleteFirebaseUser(firebaseAuth.currentUser)
        .then(() => {
          setShow(false);
        })
        .catch((err) => {
          alert(err.message);
          return false;
        });
    } catch (err) {
      console.error("createUser Error", err.message);
      alert(err.message);
      return false;
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refresh token");
    localStorage.removeItem("auto-snp");
    ctx.user = {};
    navigate("/");
  }
  return (
    <div className="page-wrapper">
      <CustomCard
        bgHeaderColor="red"
        txtColor="#fff"
        bgColor="white"
        header="Delete Account"
        // title="Welcome to Better Bank"

        body={
          <>
            <h4 style={{ color: "red" }}>
              We'll be sad to see you go {nameCapitalized}{" "}
            </h4>
            {show ? (
              <div style={{ textAlign: "center" }}>
                <SubmitBtn
                  name="Delete Account"
                  handleClick={handleDelete}
                  bgColor={COLORS.modalHeader}
                />
              </div>
            ) : (
              <>
                <Card.Body className="form">
                  <h5 style={{ textAlign: "center", fontSize: "1.5em" }}>
                    Account Deleted Successfully
                  </h5>
                </Card.Body>
              </>
            )}
          </>
        }
      />
    </div>
  );
}
