// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6S2JvQ-nt-5truY1-WZXs4vyIBqlccTE",
  authDomain: "cosc4p02.firebaseapp.com",
  projectId: "cosc4p02",
  storageBucket: "cosc4p02.appspot.com",
  messagingSenderId: "507870719627",
  appId: "1:507870719627:web:66bfe94b37c062fd34ee8e",
  measurementId: "G-RTD2M2LPFJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


export {app, auth, provider};
