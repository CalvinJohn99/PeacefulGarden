// @refresh state
import * as React from 'react';
import MainContainer from './navigation/MainContainer.js';
import firebase from "firebase/app";
import 'firebase/database';

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvxZ3XGNOmsp1vXdM4Lh-Wcai2fe8ECNQ",
  authDomain: "gratefulness-posts.firebaseapp.com",
  projectId: "gratefulness-posts",
  storageBucket: "gratefulness-posts.appspot.com",
  messagingSenderId: "204123862413",
  appId: "1:204123862413:web:52aa285ef04de2ccb639c4"
};

// initialize firebase
// expo will create the database whenever we save the file. In order to avoid the duplicates of database creation and errors, we use an if condition to control that.
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

// Get a database reference
const fbdata = firebase.database();

function App() {
  return (
    <MainContainer />
  );
}

export default App;