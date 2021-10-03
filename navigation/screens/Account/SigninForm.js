import React, { useState, useLayoutEffect } from "react";
import {
  Button,
  StyleSheet,
  SafeAreaView,
  Text,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import fbdata from "../../../firebase";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input } from "react-native-elements";

export default function SigninForm({ navigation }) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [data, setData] = useState({ password: "", email: "" });
  const handleSignIn = () => {
    data.password = password;
    data.email = email;
    setData({ ...data });
  };
  function signIn(email, password) {
    fbdata
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function () {
        alert("Login Successful!");
      })
      .catch((error) => {
        if (error.code === "auth/auth/wrong-password") {
          alert("Wrong password");
        } else if (
          error.code === "auth/invalid-email" ||
          error.code === "auth/invalid-argument"
        ) {
          alert("That email address is invalid!");
        } else {
          alert("The password is invalid or the user does not have a password");
        }
        console.error(error);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.text}>Enter your registered email to log in</Text>
      <Input
        placeholder="Email@address.com"
        leftIcon={<Icon name="user" size={24} color="#C4C4C6" />}
        onChangeText={(value) => setEmail(value)}
        value={email}
      />
      <Input 
      placeholder="Password" 
      secureTextEntry={true} 
      leftIcon={<Icon name="lock" size={24} color="#C4C4C6" />}
      onChangeText={(value) => setPassword(value)}
      value={password}
      />
      <TouchableOpacity style={{alignSelf: "flex-end" }}>
          <Text style={{ fontSize: 16 }}>Forget password?</Text>
        </TouchableOpacity>
      <TouchableOpacity
        style={styles.button_submit}
        onPress={() => {
          handleSignIn();
          signIn(data.email, data.password);
        }}
      >
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 18,
    fontWeight: "normal",
    color: "#000000",
    alignSelf: "flex-start",
    marginVertical: 20,
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
    borderRadius: 14,
    backgroundColor: "#17CAF1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    marginVertical: 20,
  },
});
