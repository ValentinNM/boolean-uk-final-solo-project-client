import { useState, useEffect } from "react";
import { CALL_ME_SERVER } from "../utils/constants";
import { Link } from "react-router-dom";

// TODO -> Add styling
export default function Account() {
  const [profileData, setProfileData] = useState([]);

  const fetchOptions = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };

  useEffect(() => {
    fetch(`${CALL_ME_SERVER}/users/profile/view`, fetchOptions)
      .then((res) => res.json())
      .then((data) => {
        setProfileData(data.profile);
      });
  },[]);

  const {
    firstName,
    lastName,
    postcode,
    mainAddress,
    city,
    country,
    subscribed,
    validated,
  } = profileData;

  let { dob } = profileData;

  // let dob = dob.split("T")[0];

  return (
    <>
      <div>
        <header>
          <h1>Account Settings</h1>
        </header>
        <main>
          <div>
            <h2>Profile</h2>
            <p>First Name: {firstName}</p>
            <p>Last Name: {lastName}</p>
            <p>Date of birth: {dob }</p>
            <p>Address: {mainAddress}</p>
            <p>City: {city}</p>
            <p>Postcode: {postcode}</p>
            <p>Country: {country}</p>
            <p>
              Subscribed:
              {subscribed ? "Yes" : "No"}
            </p>
            <p>Validated :{validated ? "Yes" : "No"}</p>
            <Link to="/profile/edit" state={profileData}>
              Edit
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
