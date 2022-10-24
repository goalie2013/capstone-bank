import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CreateAccount from "./pages/CreateAccount";
import PageWrapper from "./pages/PageWrapper";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import UserData from "./pages/UserData";
import { Route, BrowserRouter, Routes, Link } from "react-router-dom";
import AllData from "./pages/AllData";

console.log(
  "process.env.REACT_APP_SERVER_PORT",
  process.env.REACT_APP_SERVER_PORT
);

function App() {
  return (
    <div className="app-wrapper">
      <BrowserRouter>
        {/* <NavBar /> */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createaccount" element={<CreateAccount />} />
            <Route
              path="/deposit/:id"
              element={<PageWrapper pageComponent={<Deposit />} />}
            />
            <Route
              path="/withdraw/:id"
              element={<PageWrapper pageComponent={<Withdraw />} />}
            />
            <Route
              path="/data/:id"
              element={<PageWrapper pageComponent={<UserData />} />}
            />
            {/*<Route path="/alldata" element={<AllData />} /> */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

function PageNotFound() {
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

export default App;
