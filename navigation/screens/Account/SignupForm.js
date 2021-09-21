import React, { useState, useLayoutEffect } from "react";
import {
  Button,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Text,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

export default function SignupForm({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry={true}
        autoCapitalize="none"
        placeholderTextColor="white"
      />
      <TextInput
        style={styles.input}
        placeholder="Username / Nickname"
        autoCapitalize="none"
        placeholderTextColor="white"
      />
      <TouchableOpacity>
        <AntDesign name="plussquare" size={55} color="black" />
      </TouchableOpacity>
      <Text style={{ color: "#000000", marginVertical: 10 }}>
        Choose your profile picture
      </Text>

      <TouchableOpacity style={styles.button_submit} onPress={() => navigation.navigate('AccountQuestion')}>
        <Button title="Next" color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  button_submit: {
    height: 40,
    width: 120,
    borderRadius: 14,
    backgroundColor: "#17CAF1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  profileimage: {
    width: "100%",
    height: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#60C8ED",
  },
});
