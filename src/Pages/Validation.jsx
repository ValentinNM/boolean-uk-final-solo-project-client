import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CALL_ME_SERVER } from "../utils/constants";

export default function Validation() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [profileToValidate, setProfileToValidate] = useState([]);

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

    fetch(`${CALL_ME_SERVER}/users/validation`, fetchOptions)
      .then((res) => res.json())
      .then((account) => {
        if (account.error) {
          alert("Error: Unknown\n Please try again");
        } else if (account.profile) {
          navigate("/dashboard");
        }
      });
  };

  const handleUserInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    const checked = event.target.checked;

    if (name === "subscribed") {
      setProfileToValidate({
        ...profileToValidate,
        [name]: checked,
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
          <TextField
            required
            name="dob"
            label="Date of Birth"
            type="date"
            onChange={handleUserInput}
            sx={{ width: 220 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            disabled
            id="standard-disabled"
            label="Your Demo Starting Balance"
            defaultValue=" $ 100,000 "
            variant="standard"
          />
        </div>
        <div className="two-columns-spaced">
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox name="subscribed" onChange={handleUserInput} />
              }
              label="Subscribe to our weekly newsletter"
            />
          </FormGroup>
          <Button variant="outlined" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </section>
    </Box>
  );
}
