import firebase from "firebase";
import "firebase/database";

import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKE,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

// Iniciando Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
console.log("Firebase Connection 🚀");

export default firebaseApp;
