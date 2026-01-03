import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBvYONBZRG5iVmT-dfvRnlv_stwA4K6PIw",
  authDomain: "dharashalti.firebaseapp.com", // 🔴 double-check spelling
  databaseURL: "https://dharashalti-default-rtdb.firebaseio.com",
  projectId: "dharashalti",
  storageBucket: "dharashalti.appspot.com",
  messagingSenderId: "898028048902",
  appId: "1:898028048902:web:b14fa2dc602e6586e8a987"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
