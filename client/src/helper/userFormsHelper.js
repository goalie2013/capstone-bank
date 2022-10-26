import validator from "validator";

export function validate(field, label, stateObj, setStateObj) {
  console.log("---- validate ----");

  const { name, email, password } = stateObj;
  const { setStatus, setNameTxtColor, setEmailTxtColor, setPassTxtColor } =
    setStateObj;

  if (!field) {
    setStatus(
      `Error: ${label[0].toUpperCase() + label.substring(1)} must be filled out`
    );
    return false;
  }

  // Name Validation (No special characters or numbers)
  if (field === name && !validator.matches(field, /[a-zA-Z ]+$/)) {
    setNameTxtColor("red");
    setStatus("Name must only contain letters");
    return false;
  } else {
    setNameTxtColor("black");
  }

  // Email Validation
  if (field === email && !validator.isEmail(field)) {
    console.log("EMAIL VALIDATION");
    setEmailTxtColor("red");
    setStatus("Email not valid. Try Again");
    return false;
  } else {
    setEmailTxtColor("black");
  }

  // Password Length Validation
  if (field === password && field.length < 8) {
    setPassTxtColor("red");
    setStatus("Password must be at least 8 characters");
    // document.documentElement.style.setProperty("--password-txt-color", "red");
    return false;
  } else {
    setPassTxtColor("gray");
  }

  // If Validation Passed:
  // in case already present from previous validation fail:
  setStatus("");
  // document.documentElement.style.setProperty("--password-txt-color", "gray");
  return true;
}
