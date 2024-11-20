import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCwcWNyXxdACm3hxkPwg01evJrPCJtwI0E",
  authDomain: "chat-app-cabda.firebaseapp.com",
  projectId: "chat-app-cabda",
  storageBucket: "chat-app-cabda.firebasestorage.app",
  messagingSenderId: "601755705054",
  appId: "1:601755705054:web:e797ad9dcd1128170d2c4f",
  measurementId: "G-0BK2FZV9WG",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();

// const analytics = getAnalytics(app);
