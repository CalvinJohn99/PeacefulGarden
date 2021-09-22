import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Button,
  TextInput,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import fbdata from "../../../firebase";
export default function SigninForm({ navigation }) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [data, setData] = useState({password:"", email: ""})
  const [info, setInfo] = useState()
  const handleSignIn = () => {  
    data.password = password;
    data.email = email;
    setData({ ...data });
}
const get_DATA = (userId) => {
  fbdata.database().ref('users/').on('value', function (snapshot) {
    let array = [];
    snapshot.forEach(function (childSnapshot) {
      if(userId === childSnapshot.key){
        var childData = childSnapshot.val();
        console.log(childData)
      }
      // array.push({
      //   uid: childSnapshot.key,
      //   username: childData.username,
      //   password: childData.password,
      //   email: childData.email,
      //   answer1: childData.answer1,
      //   answer2: childData.answer2,
      //   age: childData.age,
      //   interest: childData.interest,
      // });
    });
    // console.log(array[0])
    // setInfo(array)
  });
}

  function signIn(email, password) {
    fbdata.auth()
    .signInWithEmailAndPassword(email, password)
    .then(function (user) {
      alert('Login Successful!' + "\n" +
            "Your email: " + user["user"]["email"] + "\n"
            + "Your uid: " + user["user"]["uid"] + "\n"
      )
      get_DATA(user["user"]["uid"]);
    })
    .catch(error => {
      if (error.code === 'auth/auth/wrong-password') {
        console.log('Wrong password');
      }
  
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
  
      console.error(error);
    }); 
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        placeholderTextColor="white"
        onChangeText={(value) => setEmail(value)} value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
        placeholderTextColor="white"
        onChangeText={(value) => setPassword(value)} value={password}
      />
      <TouchableOpacity style={styles.button_submit} onPress={() => {
         handleSignIn()
        signIn(data.email,data.password)
        }}>
        <Button title="Login" color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
   paddingVertical: 100,
  },
  input: {
    width: 350,
    height: 50,
    backgroundColor: "#C4C4C6",
    margin: 10,
    padding: 8,
    color: "white",
    fontSize: 18,
    fontWeight: "300",
    marginBottom: 10,
  },

  button_submit: {
    height: 50,
    width: 130,
    borderRadius: 10,
    backgroundColor: "#60C8ED",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    marginVertical: 20,
  },
});
