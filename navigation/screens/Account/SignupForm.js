import React, { useState, useEffect } from "react";
import {
  Button,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Text,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import RandomImage from "./../../components/RandomImage"

export default function SignupForm({ navigation }) {
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const [email, setEmail] = useState(null)
  const [data, setData] = useState({username: "", password:"", email: ""})
  const handleSignUp = () => {  
        data.username = username;
        data.password = password;
        data.email = email;
        setData({ ...data });
  }

  

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        placeholderTextColor="white"
        onChangeText={(text) => { setEmail(text) }} value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
        placeholderTextColor="white"
        onChangeText={(text) => { setPassword(text) }} value={password}
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
        placeholder="Username"
        autoCapitalize="none"
        placeholderTextColor="white"
        onChangeText={(text) => { setUsername(text) }} value={username}
      />
      
      <Text style={{ color: "#000000", marginVertical: 10 }}>
        Choose your profile picture
      </Text>
      <RandomImage></RandomImage>

      <TouchableOpacity style={styles.button_submit} onPress={() => {
         handleSignUp()
        navigation.navigate("AccountQuestion", {data: data})
      }}>
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
