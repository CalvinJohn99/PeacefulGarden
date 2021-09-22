import firebase from "firebase/app";
import "firebase/database";

import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUXNmwHZfHMK4EL_pKJ4-XmnI40h4GLZ4",
  authDomain: "evanspg-d62d6.firebaseapp.com",
  databaseURL: "https://evanspg-d62d6-default-rtdb.firebaseio.com",
  projectId: "evanspg-d62d6",
  storageBucket: "evanspg-d62d6.appspot.com",
  messagingSenderId: "642272696498",
  appId: "1:642272696498:web:690396c1e632abe8fc91ab",
  measurementId: "G-NC0JZZQD0S"
};

// initialize firebase
// expo will create the database whenever we save the file. In order to avoid the duplicates of database creation and errors, we use an if condition to control that.
if (!firebase.apps.length) {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  console.log("\nKết nối firebase thành công\n")
}


const fbdata = firebase;

export default fbdata;
