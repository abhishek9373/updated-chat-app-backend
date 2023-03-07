import React, { useEffect, useState } from "react";
import "./all-css/Register.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { REGISTER_URL } from "../Constant";
import Nolaptop from "./Nolaptop";

export default function Register() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpass, setconfirmpassword] = useState("");


  const usenavigate = useNavigate();

  function isValidEmail(email) {
    // Regular expression for email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the email against the regular expression
    return emailRegex.test(email);
  }

  const sendToRegister = (e) => {
    e.preventDefault();

    if (isValidEmail(email)) {
      if (password === confirmpass) {
        if (name.length >= 2 && password != null && password.length >= 5) {
          axios
            .post(REGISTER_URL, {
              name: name,
              email: email,
              password: password,
            })
            .then((dt) => {
              if (dt.data.inserted == true) {
                alert("Account created you can login now");
                usenavigate("/login");
              } else if (dt.data.user_already_present == true) {
                alert("User already present");
              } else if (dt.data.server_error) {
                alert("Server error");
              } else {
                alert("Something Went Wrong");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          alert(
            "name contain at least two characters and password is at least 5 character long"
          );
        }
      } else {
        alert("password does not match");
      }
    } else {
      alert("Invalid email format");
    }
  };

  return (
    <div className="Container">
      <div>
        <div className="header-aligner">
          <h3>Register</h3>
        </div>

        <div className="input-lable">
          Email
          <br />
          <input
            type="email"
            name="email"
            id="email"
            required
            placeholder="example@gmail.com"
            onChange={(e) => {
              setemail(e.target.value);
            }}
          />
        </div>
        <br />
        <br />
        <div className="input-lable">
          password
          <br />
          <input
            type="password"
            name="password"
            placeholder="**********"
            id="password"
            required
            onChange={(e) => {
              setpassword(e.target.value);
            }}
          />
        </div>
        <br />
        <br />
        <div className="input-lable">
          Confirm Password
          <br />
          <input
            type="password"
            name="password"
            placeholder="**********"
            id="confirmpassword"
            required
            onChange={(e) => {
              setconfirmpassword(e.target.value);
            }}
          />
        </div>
        <br />
        <br />
        <div className="input-lable">
          Name
          <br />
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            id="name"
            required
            onChange={(e) => {
              setname(e.target.value);
            }}
          />
        </div>
        <br />
        <br />
        <div className="btn-justify">
          <h4>
            Already a user <Link to="login">Login</Link>
          </h4>{" "}
          &nbsp;
          <button onClick={sendToRegister}>Next</button>
        </div>
      </div>
    </div>
  );
}
