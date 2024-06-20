import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  let firstNameInputRef = useRef();
  let lastNameInputRef = useRef();
  let ageInputRef = useRef();
  let emailInputRef = useRef();
  let passwordInputRef = useRef();
  let mobileNoInputRef = useRef();
  let profilePicInputRef = useRef();

  let [profilePic, setProfilePic] = useState("./images/noImage.png");

  let onSignupUsingFD = async () => {
    let dataToSend = new FormData();
    dataToSend.append("firstName", firstNameInputRef.current.value);
    dataToSend.append("lastName", lastNameInputRef.current.value);
    dataToSend.append("age", ageInputRef.current.value);
    dataToSend.append("email", emailInputRef.current.value);
    dataToSend.append("password", passwordInputRef.current.value);
    dataToSend.append("mobileNo", mobileNoInputRef.current.value);

    for (let i = 0; i < profilePicInputRef.current.files.length; i++) {
      //dataToSend.append("profilePic", profilePicInputRef.current.files[i]);
    }

    let reqOptions = {
      method: "POST",
      body: dataToSend,
    };

    let JSONData = await fetch("/register", reqOptions);

    let JSOData = await JSONData.json();

    alert(JSOData.msg);

    console.log(JSOData);
  };

  return (
    <div className="App">
      <form>
        <h2>Signup</h2>
        <div>
          <label>First Name</label>
          <input ref={firstNameInputRef}></input>
        </div>
        <div>
          <label>Last Name</label>
          <input ref={lastNameInputRef}></input>
        </div>
        <div>
          <label>Age</label>
          <input ref={ageInputRef}></input>
        </div>
        <div>
          <label>Email</label>
          <input ref={emailInputRef}></input>
        </div>
        <div>
          <label>Password</label>
          <input ref={passwordInputRef}></input>
        </div>
        <div>
          <label>Mobile No.</label>
          <input ref={mobileNoInputRef}></input>
        </div>
        <div>
          <label>Profile Pic</label>
          <input
            ref={profilePicInputRef}
            type="file"
            accept="image/*"
            onChange={(eo) => {
              let selectedPicPath = URL.createObjectURL(eo.target.files[0]);
              setProfilePic(selectedPicPath);
            }}
          ></input>
          <br></br>
          <img src={profilePic} className="profilePicPreview"></img>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              onSignupUsingFD();
            }}
          >
            Sign Up
          </button>
        </div>
      </form>
      <br></br>
      <br></br>
      <Link to="/">Login</Link>
    </div>
  );
}

export default Signup;
