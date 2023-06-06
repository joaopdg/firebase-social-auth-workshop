/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import axios from "axios";

import github from "../assets/github.png";
import google from "../assets/google.png";

/* Imports for Firebase */
import firebase from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
const auth = firebase.auth();

function SocialAuthPage() {
  /* React Hooks */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successSignupMessage, setSuccessSignupMessage] = useState("");
  const [successLoginMessage, setSuccessLoginMessage] = useState("");
  const { storeToken, authenticateUser, user, logoutUser } =
    useContext(AuthContext);

  /* Firebase Hook */
  const [firebaseUser] = useAuthState(auth);

  /* Create account on MongoDB */
  const handleSignup = async (e) => {
    try {
      e.preventDefault();
      const body = {
        email,
        password,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/auth/signup`,
        body
      );
      setSuccessSignupMessage("Account created");
    } catch (error) {
      console.log(error);
    }
  };

  /* Login account on MongoDB */
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const body = {
        email,
        password,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/auth/login`,
        body
      );
      storeToken(response.data.authToken);
      authenticateUser();
      setSuccessLoginMessage("Loggedin with success");
    } catch (error) {
      console.log(error);
    }
  };

  /* Sign in with Google */
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  /* Sign in with Github */
  const signInWithGithub = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider);
  };

  /* Receive user info from Firebase and make a copy of it into MongoDB */
  const handleCopyUserToDb = async () => {
    try {
      const body = {
        email,
        password,
      };
      //Check the BACKEND-ROUTE.js file to see the route that you need to create
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/auth/social-auth`,
        body
      );
      storeToken(response.data.authToken);
      authenticateUser();
      setSuccessLoginMessage("Loggedin with success");
    } catch (error) {
      console.log(error);
    }
  };

  if (firebaseUser) {
    if (email === "") {
      setEmail(firebaseUser.email);
    }
    if (password === "") {
      setPassword(firebaseUser.uid);
    }
    if (email !== "" && password !== "" && !user) {
      handleCopyUserToDb();
    }
  }

  /* Logout user from MongoDB and Firebase */
  const handleLogout = () => {
    setEmail("");
    setPassword("");
    setSuccessLoginMessage("");

    auth.signOut();
    logoutUser();
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: 200 }}>
          {/*------------------*/}
          {/*  MongoDB Signup  */}
          {/*------------------*/}
          <form
            onSubmit={handleSignup}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <h1>SignUp</h1>
            <input
              type="email"
              placeholder="email"
              style={{ marginBottom: 10 }}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="password"
              style={{ marginBottom: 10 }}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p>{successSignupMessage}</p>
            <button type="submit" style={{ marginBottom: 20 }}>
              Signup
            </button>
          </form>

          {/*-------------------------------------------*/}
          {/*  Firebase Social Auth Buttons for Signup  */}
          {/*-------------------------------------------*/}
          <img
            src={google}
            onClick={signInWithGoogle}
            style={{ width: 200, marginBottom: 10 }}
          />
          <img
            src={github}
            onClick={signInWithGithub}
            style={{ width: 200, marginBottom: 10 }}
          />
        </div>
        <div>
          {/*-----------------*/}
          {/*  MongoDB Login  */}
          {/*-----------------*/}
          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <h1>Login</h1>
            <input
              type="email"
              placeholder="email"
              style={{ marginBottom: 10 }}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="password"
              style={{ marginBottom: 10 }}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p>{successLoginMessage}</p>
            <button type="submit" style={{ marginBottom: 20 }}>
              Login
            </button>
          </form>
          {/*------------------------------------------*/}
          {/*  Firebase Social Auth Buttons for Login  */}
          {/*------------------------------------------*/}
          <img
            src={google}
            onClick={signInWithGoogle}
            style={{ width: 200, marginBottom: 10 }}
          />
          <img
            src={github}
            onClick={signInWithGithub}
            style={{ width: 200, marginBottom: 10 }}
          />
        </div>
      </div>
      {/*-----------------*/}
      {/*  Logout Button  */}
      {/*-----------------*/}
      {firebaseUser || user ? (
        <p onClick={handleLogout} style={{ color: "red" }}>
          Logout
        </p>
      ) : (
        <p>Please singup or login first</p>
      )}
    </>
  );
}

export default SocialAuthPage;
