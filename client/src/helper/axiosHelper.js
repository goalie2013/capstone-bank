import axios from "axios";

export function axiosLogin(userObj, user, navigate) {
  axios
    .post("https://betterbank.herokuapp.com/login", userObj)
    .then((response) => {
      console.log("axios response", response);
      console.log("axios response", response.data.accessToken);

      // Reset context if user already created bc don't want id bug
      user = {};
      user = { ...userObj };

      // Reset localStorage token in case not empty, then add new token
      localStorage.removeItem("token");
      localStorage.setItem("token", response.data.accessToken);
      localStorage.removeItem("refresh token");
      localStorage.setItem("refresh token", response.data.refreshToken);
    })
    .then(() => {
      console.log("Successful Login! Navigate to Deposit...");
      navigate(`/deposit/${userObj.id}`, { replace: true });
    })
    .catch((err) => console.error("axios ERROR", err.message));
}

export function axiosAuthorizeUserTokens(
  user,
  token,
  setJwt,
  setServerDown,
  setShowModal,
  logout
) {
  console.log("authorizeUserTokens FUNCTION");
  axios
    .post("https://betterbank.herokuapp.com/authorize", user, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("axios response", response);

      // If already have user Id -> Go to page;
      // Else, set token globally & wait for data to get user Id
      // if (userId && email) setShowPage(true);
      // else setJwt(token);
      setJwt(token);
    })
    .catch((err) => {
      console.error("axios ERROR", err.message);
      if (err.message === "Network Error") setServerDown(true);
      //
      // Else if: Token sent to /authorize was null -->
      // send request for new access token using refresh token
      else if (err.message === "Request failed with status code 401") {
        const refreshToken = localStorage.getItem("refresh token");
        // If No refresh token either --> Log user out
        if (refreshToken == null || !refreshToken) logout();

        getNewAccessToken(refreshToken, setJwt, setShowModal, logout);
      }
      //
      // Else If Invalid token --> Log user out
      else if (err.message === "Request failed with status code 403") {
        logout();
      } else {
        // Show NotAuthorized
        setShowModal(true);
      }
    });
}

function getNewAccessToken(refreshToken, setJwt, setShowModal, logout) {
  axios
    .post("https://betterbank.herokuapp.com/newaccesstoken", {
      token: refreshToken,
    })
    .then((response) => {
      console.log("newaccesstoken response", response);
      localStorage.setItem("token", response.data.accessToken);
      setJwt(response.data.accessToken);
    })
    .catch((err) => {
      console.error("newaccesstoken Error", err.message);
      if (err.message === "Request failed with status code 403") logout();
      else setShowModal(true);
    });
}

export default { axiosLogin, axiosAuthorizeUserTokens };
