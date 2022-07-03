import React, { useState, useLayoutEffect } from "react";
import { Button, StyleSheet, SafeAreaView, View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import fbdata from "../../../firebase";
import Icon from "react-native-vector-icons";
import { Input } from "react-native-elements";
import commonStyles from "../../../commonStyles.js";

export default function SigninForm({ navigation }) {
  // user input of email and password
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  // set user data
  const [data, setData] = useState({ password: "", email: "" });
  // error status
  const [emailErrorStatus, setEmailErrorStatus] = useState(false);
  const [passwordErrorStatus, setPasswordErrorStatus] = useState(false);

  // set user data before sign in
  const handleSignIn = () => {
    data.password = password;
    data.email = email;
    setData({ ...data });
  };

  // handle sign in function
  function signIn(email, password) {
    fbdata
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function () {
        console.log("Login Successful!");
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
          alert("The email / password is invalid!");
        }
        console.error(error);
      });
  }

  // handle onsubmit once "sign in" is clicked
  // if there is empty input, set error to true
  const onSubmit = () => {
    if (email === null || password === null) {
      if (email === null) {
        setEmailErrorStatus(true);
      }
      if (password === null) {
        setPasswordErrorStatus(true);
      }
    } else {
      handleSignIn();
      signIn(data.email, data.password);
    }
  };

  // render view
  return (
    <SafeAreaView style={commonStyles.pageContainer}>
      <View
        style={{
          width: "100%",
          height: "25%",
          backgroundColor: "#00BCD4",
          justifyContent: "center",
          paddingLeft: 20,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 26,
            fontWeight: "bold",
          }}
        >
          Welcome
        </Text>
      </View>

      <View style={commonStyles.answerContainer}>
        <Text
          style={{
            marginTop: 30,
            alignSelf: "flex-start",
            marginLeft: 20,
            fontSize: 16,
          }}
        >
          Please login with your existing account
        </Text>
        <Input
          inputContainerStyle={{
            marginTop: 40,
            marginHorizontal: 10,
          }}
          style={{ paddingLeft: 10 }}
          placeholder="Email@address.com"
          leftIcon={{
            type: "ionicons",
            name: "mail",
            size: 24,
            color: "#00BCD4",
          }}
          autoCapitalize="none"
          onChangeText={(value) => {
            setEmail(value);
            setEmailErrorStatus(false);
          }}
          value={email}
        />
        {emailErrorStatus === true ? (
          <Text style={styles.formErrorMsg}>
            Please enter your email to login!
          </Text>
        ) : null}
        <Input
          inputContainerStyle={{
            marginTop: 20,
            marginHorizontal: 10,
          }}
          style={{ paddingLeft: 10 }}
          placeholder="Password"
          secureTextEntry={true}
          leftIcon={{
            type: "font-awesome",
            name: "lock",
            size: 24,
            color: "#00BCD4",
          }}
          autoCapitalize="none"
          onChangeText={(value) => {
            setPassword(value);
            setPasswordErrorStatus(false);
          }}
          value={password}
        />
        {passwordErrorStatus === true ? (
          <Text style={[styles.formErrorMsg, { marginBottom: 30 }]}>
            Please enter your password to login!
          </Text>
        ) : null}

        <TouchableOpacity
          style={{ alignSelf: "flex-end", marginTop: 30 }}
          onPress={() => {
            navigation.navigate("ResetPassword");
          }}
        >
          <Text style={{ fontSize: 16 }}>Forget password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button_submit}
          onPress={() => {
            onSubmit();
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
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

  button_submit: {
    height: 50,
    width: 130,
    borderRadius: 14,
    backgroundColor: "#00BCD4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    marginTop: 30,
  },
  formErrorMsg: {
    color: "red",
    fontSize: 16,
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 10,
  },
});
