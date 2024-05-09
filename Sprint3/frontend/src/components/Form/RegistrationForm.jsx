import "./form.css";
import React, { useState } from "react";

export default function RegistrationForm({ onUserLogin, type, repForRegisteringClient }) {
  let classNameContainer = "";
  if (type === "user") {
    classNameContainer = "registrationform";
  } else {
    classNameContainer = "registrationform Rep";
  }
  const [isRegister, setIsRegister] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    console.log("the login was responded atleast");
    const loginData = {
      email: loginEmail,
      password: loginPassword,
    };

    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("login was a success", data.type);
          onUserLogin(data.type);
        } else {
          alert("wrong credentials please try again");
        }
      })
      .catch((error) => {
        console.error("Login Error:", error);
      });
  };

  const handleRegistration = (event) => {
    event.preventDefault(); // This will prevent the default behavior of the submit button

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const registrationData = {
      firstName,
      lastName,
      email,
      password,
      access_level: type,
    };

    fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(registrationData),
    })
      .then((response) => {
        if (!response.ok) {
          // If the server response is not ok, throw an error
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          alert("Your signed up, please login!");
          return response.json();
        }
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  function handle_Switching_To_Sign_In(value, event) {
    event.preventDefault();
    setIsRegister(value);
  }
  return (
    <>

      {isRegister ? (
        <form className={classNameContainer} onSubmit={handleRegistration}>
          {repForRegisteringClient ? (
            <p className="title">Register Client</p>
          ) : type === "user" ? (
            <p className="title">Register</p>
          ) : (
            <p className="title">Register a REP</p>
          )}


          {repForRegisteringClient ? (
            <p className="message">Add your client to DriveDev.</p>
          ) : type === "user" ? (
            <p className="message">
              Signup now and get full access to DriveDev.
            </p>
          ) : (
            <p className="message">Provide information for REP</p>
          )}


          <div className="flex">
            <input
              required
              placeholder="Firstname"
              type="text"
              className="input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              required
              placeholder="Lastname"
              type="text"
              className="input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <input
            required
            placeholder="Email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            placeholder="Password"
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            required
            placeholder="Confirm password"
            type="password"
            className="input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" className="register-button">
            Register
          </button>

          {type === "user" && !repForRegisteringClient ? (
            <p className="signin">
              Already have an account?{" "}
              <a
                href="#!"
                onClick={(e) => handle_Switching_To_Sign_In(false, e)}
              >
                Sign in
              </a>
            </p>
          ) : (
            ""
          )}
        </form>
      ) : (
        <form className="registrationform" onSubmit={handleLogin}>
          <p className="title">Sign In</p>
          <p className="message-SignIn">Welcome back to DriveDev.</p>
          <input
            required
            placeholder="Email"
            type="email"
            className="input"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <input
            required
            placeholder="Password"
            type="password"
            className="input"
            style={{ marginTop: "10px" }}
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />

          <button className="register-button" style={{ marginTop: "45px" }}>
            Login
          </button>

          <p className="signin">
            Don't have an account?{" "}
            <a
              href="index"
              onClick={(e) => handle_Switching_To_Sign_In(true, e)}
            >
              Sign up
            </a>
          </p>
        </form>
      )}
    </>
  );
}
