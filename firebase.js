import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import "firebase/auth";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMUuAhdumTGYMSVuWjRQmKSRKJhONusAg",
  authDomain: "peacefulgarden-a4b5c.firebaseapp.com",
  databaseURL:
    "https://peacefulgarden-a4b5c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "peacefulgarden-a4b5c",
  storageBucket: "peacefulgarden-a4b5c.appspot.com",
  messagingSenderId: "595789693308",
  appId: "1:595789693308:web:6c2e1faf2651b5c8e924f9",
  measurementId: "G-45KC4GX795",
};

// initialize firebase
// expo will create the database whenever we save the file. In order to avoid the duplicates of database creation and errors, we use an if condition to control that.
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const fbdata = firebase.database();

export const fbstorage = firebase.storage();

export default fbdata;
