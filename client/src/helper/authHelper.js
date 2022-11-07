// import { useContext } from "react";
import { app } from "../firebase";
import { UserContext } from "../index";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// const navigate = useNavigate();
// const ctx = useContext(UserContext);
const firebaseAuth = getAuth(app);

export const siteAuth = {
  logout(navigate) {
    console.log("Logout FUNCTION");
    console.log("currentUser before", firebaseAuth.currentUser);
    firebaseAuth.signOut();
    console.log("currentUser after", firebaseAuth.currentUser);
    // ctx.user = {};
    localStorage.removeItem("token");
    navigate("/");
  },
  login(navigate) {
    console.log("Login");
    navigate("/login");
  },
};

// Create User with Firebase Auth
export function createFirebaseUser(firebaseAuth, email, password, setStatus) {
  createUserWithEmailAndPassword(firebaseAuth, email, password)
    .then((userCredential) => {
      // User is now Signed In
      const user = userCredential.user;
      console.log("Firebase User", user);
    })
    .catch((error) => {
      console.error("Firebase Create User Error", error.message);
      setStatus(`Error: ${error.message}`);
    });
}

export default { siteAuth, createFirebaseUser };
