// ----------------------------------------
// Deposit & Withdraw handleChange function
// ----------------------------------------
export function handleChange(e, setValue, setStatus, setShow, setTextColor) {
  console.log("-- handleChange --");
  setValue(e.target.value);
  const target = e.target;

  console.log("target.value", target.value);
  console.log(typeof target.value);
  // console.log("ref", ref.current.value);

  if (isNaN(target.value) && target.value !== "-") {
    setTextColor("red");
    setStatus(`Please submit numbers only`);
    setShow(false);
    return false;
  }
  if (!target.value || target.value === "-" || parseInt(target.value) === 0) {
    // setTextColor("red");
    // setStatus(`Value is empty`);
    setShow(false);
    return false;
  }

  if (parseInt(target.value) < 0) {
    console.log("NEGATIVE");
    setTextColor("red");
    setStatus(`Cannot submit a negative value`);
    setShow(false);
    return false;
  }

  setStatus("");
  // if (ref.current.value) setShow(false);
  if (target.value) setShow(true);
  else setShow(false);
}

// export function handleKeyPress(
//   e,
//   handleTransaction,
//   setTextColor,
//   setStatus,
//   show,
//   setTextColor
// ) {
//   console.log("--- handleKeyPress ---");
//   e.preventDefault();
//   if (e.keyCode === 13) {
//     if (show === true) {
//       handleTransaction();
//       return false;
//     } else {
//       setTextColor("red");
//       setStatus("Cannot Complete Deposit");
//       return false;
//     }
//   } else {
//     return false;
//   }
// }

export function handleNavigate(btnEvent, navigate) {
  btnEvent.target.value === "Home" ? navigate("/") : navigate("/createaccount");
  // console.log(btnEvent.target.value);
}

export function downloadScreenshot(type, timestamp, uri) {
  const downloadLink = document.createElement("a");
  const fileName = `${type}-${timestamp}.jpeg`;

  downloadLink.href = uri;
  downloadLink.download = fileName;
  downloadLink.click();
}

export default {
  handleChange,
  handleNavigate,
  downloadScreenshot,
};

// ----------------------------------------
// Deposit & Withdraw handleChange function
// ----------------------------------------
// export default function handleChange(
//   value,
//   name,
//   setStatus,
//   setShow,
//   setTextColor
// ) {
//   console.log("---- handleChange ----");

//   console.log("deposit Value: ", value);

//   if (!value) {
//     setTextColor("red");
//     setStatus(`${name} field cannot be empty`);
//     setShow(true);
//     return false;
//   }
//   if (isNaN(value)) {
//     setTextColor("red");
//     setStatus(`${name} field can only be number`);
//     setShow(true);
//     return false;
//   }

//   if (parseInt(value) < 0) {
//     console.log("NEGATIVE");
//     setTextColor("red");
//     setStatus(`${name} field cannot be negative`);
//     setShow(true);
//     return false;
//   }

//   // console.log('ref', ref.current.value);
//   //   console.log("depositVal", depositValue);
//   setStatus("");
//   if (value) setShow(false);
//   else setShow(true);
// }

// Screenshot
// axios
//   //https://betterbank.herokuapp.com/screenshot
//   .get("http://localhost:5050/screenshot", {
//     params: {
//       date: timeStamp,
//       type: "Deposit",
//       id: userId,
//     },
//   })
//   .then((result) => {
//     console.log("screenshot done", result);
//     screenshot = result.data;

//     base64 = `data:image/jpeg;base64,${result.data}`;
//     // base64 = imgStr;
//     console.log(base64);
//     // downloadScreenshot("Deposit", timeStamp, base64);

//     setDownload(true);

//     setTextColor(COLORS.transactionComplete);
//     setStatus("Screenshot Complete");
//   })
//   .catch((err) => {
//     console.error("screenshot Error", err.message);
//     setTextColor("red");
//     setStatus("Could not complete Screenshot");
//   });
