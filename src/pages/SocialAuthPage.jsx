/* eslint-disable no-unused-vars */
import github from "../assets/github.png";
import google from "../assets/google.png";

import firebase from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const auth = firebase.auth();

function SocialAuthPage() {
  const [user] = useAuthState(auth);
  console.log(user);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const signInWithGithub = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/*  Mock Signup  */}
      <h1>SignUp</h1>
      <input type="email" placeholder="email" style={{ marginBottom: 10 }} />
      <input
        type="password"
        placeholder="password"
        style={{ marginBottom: 10 }}
      />
      <button style={{ marginBottom: 20 }}>Signup</button>

      {/*  Firebase Social Auth Buttons  */}
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

      {/*  Logout Buttons  */}
      {user ? (
        <p onClick={() => auth.signOut()} style={{ color: "red" }}>
          Logout
        </p>
      ) : (
        <p>Please login first</p>
      )}
    </div>
  );
}

export default SocialAuthPage;
