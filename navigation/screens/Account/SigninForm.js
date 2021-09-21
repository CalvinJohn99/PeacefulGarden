import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Button,
  TextInput,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from "react-native";

export default function SigninForm({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        placeholderTextColor="white"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
        placeholderTextColor="white"
      />
      <View style={styles.button_submit}>
        <Button title="Login" color="#fff" />
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
