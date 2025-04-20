// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // ใช้สำหรับ Authentication
import { getFirestore, } from "firebase/firestore"; // ใช้สำหรับ Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGUnebrLLf142DXWns-kT79gKU1mylyPQ",
  authDomain: "car-tax-app-d650a.firebaseapp.com",
  projectId: "car-tax-app-d650a",
  storageBucket: "car-tax-app-d650a.appspot.com",
  messagingSenderId: "571095430583",
  appId: "1:571095430583:web:cb13f8f93de5730bd4e432",
  measurementId: "G-X6XWR1JC9G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// Get Auth and Firestore instances
export const auth = getAuth(app);  // สำหรับ Firebase Authentication
export const db = getFirestore(app);  // สำหรับ Firestore

