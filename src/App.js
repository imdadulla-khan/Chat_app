import { useContext, useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./style.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { db } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";

function App() {
  const { currentUser, authLoading } = useContext(AuthContext);

  // Mark user as online/offline
  useEffect(() => {
    if (!currentUser) return;

    const userDocRef = doc(db, "users", currentUser.uid);

    // Mark user as online
    const setOnline = async () => {
      try {
        await updateDoc(userDocRef, { online: true });
        console.log("User marked online");
      } catch (error) {
        console.error("Error marking user online:", error);
      }
    };

    // Mark user as offline
    const setOffline = async () => {
      try {
        await updateDoc(userDocRef, { online: false });
        console.log("User marked offline");
      } catch (error) {
        console.error("Error marking user offline:", error);
      }
    };

    setOnline();

    // Handle tab close or browser unload
    window.addEventListener("beforeunload", setOffline);

    // Cleanup listener
    return () => {
      setOffline();
      window.removeEventListener("beforeunload", setOffline);
    };
  }, [currentUser]);

  // Protect routes
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  if (authLoading) {
    // Show a loading indicator while waiting for Firebase auth
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
