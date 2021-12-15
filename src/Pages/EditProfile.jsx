import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CALL_ME_SERVER } from "../utils/constants";
import { Alert } from "@mui/material";

export default function EditProfile() {
  const [profileToEdit, setProfileToEdit] = useState([]);
  const [someAlert, setSomeAlert] = useState(null);

  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setProfileToEdit(location.state);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const fetchOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(profileToEdit),
    };

    fetch(`${CALL_ME_SERVER}/users/profile/edit`, fetchOptions)
      .then((res) => res.json())
      .catch(console.error())
      .then((updated) => {
        const magic = updated.updatedProfile
        setSomeAlert(magic);
      });
  };

  const handleUserInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    const checked = event.target.checked;

    if (name === "subscribed") {
      setProfileToEdit({
        ...profileToEdit,
        [name]: checked,
      });
    } else {
      setProfileToEdit({
        ...profileToEdit,
        [name]: value,
      });
    }
  };

  return (
    <div>
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
          <h1 className="margin center">Edit Personal Details</h1>
        </header>
        <div>
          {" "}
          {someAlert ?
            <Alert severity="success" color="info">
              Your request has been completed successfully — check it out!
            </Alert>
           : 
            <p></p>
          }{" "}
        </div>
        <section className="center-style-form">
          <div>
            <TextField
              label="First Name"
              name="firstName"
              value={profileToEdit.firstName}
              onChange={handleUserInput}
              variant="standard"
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={profileToEdit.lastName}
              onChange={handleUserInput}
              variant="standard"
            />
          </div>
          <div className="validation-address">
            <TextField
              label="Main Address"
              name="mainAddress"
              value={profileToEdit.mainAddress}
              onChange={handleUserInput}
              variant="standard"
            />
            <TextField
              label="City"
              name="city"
              value={profileToEdit.city}
              onChange={handleUserInput}
              variant="standard"
            />
            <TextField
              label="Postcode"
              name="postcode"
              value={profileToEdit.postcode}
              onChange={handleUserInput}
              variant="standard"
            />
            <TextField
              label="Country"
              name="country"
              value={profileToEdit.country}
              onChange={handleUserInput}
              variant="standard"
            />
          </div>
          <div></div>
          <div className="two-columns-spaced">
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name="subscribed"
                    value={profileToEdit.subscribed}
                    onChange={handleUserInput}
                  />
                }
                label="Subscribe to our weekly newsletter"
              />
            </FormGroup>
            <Button variant="outlined" onClick={handleSubmit}>
              {" "}
              Apply{" "}
            </Button>
          </div>
        </section>
      </Box>
    </div>
  );
}
