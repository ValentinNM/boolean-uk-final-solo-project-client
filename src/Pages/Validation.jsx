import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CALL_ME_SERVER } from "../utils/constants";

export default function Validation() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [profileToValidate, setProfileToValidate] = useState([]);
  // const [isChecked, setIsChecked] = useState([true, false]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify(profileToValidate),
    };

    console.log({ profileToValidate });

    fetch(`${CALL_ME_SERVER}/profile/validate`, fetchOptions)
      .then((res) => res.json())
      .then((account) => {
        console.log({ account });

        if (!account) {
          alert(account.error);
        } else {
          navigate("/dashboard");
        }
      });
  };

  const handleUserInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "checkbox" && event.target.checked !== false) {
      setProfileToValidate({
        ...profileToValidate,
        [name]: event.target.checked,
      });
    } else if (name === "dob") {
      let dob = Date(value).toStringISO();

      setProfileToValidate({
        ...profileToValidate,
        [name]: dob,
      });
    } else {
      setProfileToValidate({
        ...profileToValidate,
        [name]: value,
      });
    }
  };

  return (
    <Box
      className="center"
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <header>
        <h1 className="margin center">Account Validation</h1>
      </header>
      <h4>Please note that all fields marked with * are mandatory </h4>
      <section className="center-style-form">
        <div>
          <TextField
            required
            id="standard-required"
            label="First Name"
            name="firstName"
            onChange={handleUserInput}
            variant="standard"
          />
          <TextField
            required
            id="standard-required"
            label="Last Name"
            name="lastName"
            onChange={handleUserInput}
            variant="standard"
          />
        </div>
        <div className="validation-address">
          <TextField
            required
            id="standard-required"
            label="Main Address"
            name="mainAddress"
            onChange={handleUserInput}
            variant="standard"
          />
          <TextField
            required
            id="standard-required"
            label="City"
            name="city"
            onChange={handleUserInput}
            variant="standard"
          />
          <TextField
            required
            id="standard-required"
            label="Postcode"
            name="postcode"
            onChange={handleUserInput}
            variant="standard"
          />
          <TextField
            required
            id="standard-required"
            label="Country"
            name="country"
            onChange={handleUserInput}
            variant="standard"
          />
        </div>
        <div>
          {/* TODO-> FIND THE RIGHT MUI DATE ELEMENT TO BE ADDED */}
          <TextField
            id="standard-helperText"
            label="Date of Birth"
            name="dob"
            onChange={handleUserInput}
            helperText="Format: DD-MM-YYYY"
            variant="standard"
          />
          {/* <TextField
            id="standard-number"
            label="Starting Balance"
            type="number"
            name="startingBalance"
            onChange={handleUserInput}
            variant="standard"
            placeholder="0.00"
            InputLabelProps={{
              shrink: true,
            }}
          /> */}
        </div>
        <div className="two-columns-spaced">
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  type="checkbox"
                  // checked={isChecked}
                  name="subscribed"
                  onClick={handleUserInput}
                />
              }
              label="Subscribe to our weekly newsletter"
            />
          </FormGroup>
          <Button variant="outlined" onClick={handleSubmit}>
            {" "}
            Submit{" "}
          </Button>
        </div>
      </section>
    </Box>
  );
}
