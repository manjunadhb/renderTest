import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function TopNavigation() {
  let navigate = useNavigate();

  let storeObj = useSelector((store) => {
    return store;
  });

  useEffect(() => {
    if (storeObj && storeObj.userDetails && storeObj.userDetails.email) {
    } else {
      navigate("/");
    }
  }, []);

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/tasks">Tasks</Link>
      <Link to="/editProfile">Edit Profile</Link>
      <Link to="/">Logout</Link>
    </nav>
  );
}

export default TopNavigation;
