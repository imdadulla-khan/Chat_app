import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import logo from "../img/logo.webp";
import { doc, updateDoc } from "firebase/firestore";

const Navbar = () => {
  // Handle sign-out
  const handleSignOut = async () => {
    // Update Firestore online status to false
    if (currentUser?.uid) {
      await updateDoc(doc(db, "users", currentUser.uid), {
        online: false,
        lastSeen: new Date(),
      });
    }
    // Sign out the user
    await signOut(auth);
  };

  const { currentUser } = useContext(AuthContext);
  return (
    <div className="navbar">
      <span className="logo">iChat</span>
      <div className="user">
        <img src={logo} alt="Ichat logo" />
        <span>{currentUser.displayName}</span>
        <button onClick={handleSignOut}>logout</button>
      </div>
    </div>
  );
};
export default Navbar;
