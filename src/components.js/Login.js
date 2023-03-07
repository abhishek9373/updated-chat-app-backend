import React, { useState } from "react";
import "./all-css/Login.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LOGIN_URL } from "../Constant";

export default function Login() {
  // storage
  const usenavigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [response, setresponse] = useState(null);

  function isValidEmail(email) {
    // Regular expression for email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the email against the regular expression
    return emailRegex.test(email);
  }

  const sendToLogin = (e) => {
    e.preventDefault();
    console.log("called");
    if (isValidEmail(email)) {
      if (password.length >= 5) {
        axios
          .post(LOGIN_URL, {
            email: email,
            password: password,
          })
          .then((edt) => {
            if (edt.data.invalid_pass == false) {
              localStorage.setItem("token", edt.data.authToken);
              usenavigate("/chats");
            } else {
              if (edt.data.invalid_pass) {
                alert("Invalid password")
              }
              if (edt.data.Nouser) {
                alert("No user")
              }
            }
          })
          .catch((error) => {
            alert("Somethin wrong");
          });
      } else {
        alert("password at least 5 characters long")

      }
    } else {
      alert("Email and password are wrong")
    }
  };

  return (
    <div className="Container">
     
      <div>
        <div className="header-aligner">
          <h3>Login</h3>
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
            onChange={(e) => {
              setpassword(e.target.value);
            }}
          />
        </div>
        <br />
        <br />
        <div className="btn-justify">
          <h4>
            New user <Link to="/">Register</Link>
          </h4>{" "}
          &nbsp;
          <button type="submit" onClick={sendToLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
