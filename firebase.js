import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfvkrBJ52KyBurDg8nNeb8KQ3MvDbaUII",
  authDomain: "greatful-2ffc2.firebaseapp.com",
  databaseURL: "https://greatful-2ffc2-default-rtdb.firebaseio.com",
  projectId: "greatful-2ffc2",
  storageBucket: "greatful-2ffc2.appspot.com",
  messagingSenderId: "884190027685",
  appId: "1:884190027685:web:f8f58d582a4967838e524c",
  measurementId: "G-JXG6XC1GND"
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
