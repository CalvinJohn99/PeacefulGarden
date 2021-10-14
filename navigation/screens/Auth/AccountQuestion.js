import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Button,
  View,
  TextInput,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar } from 'react-native-elements';

function AccountQuestion({navigation , route}) {
  const [answer1, setAnswer1] = useState(null)
  const [answer2, setAnswer2] = useState(null)
  const [newdata, setNewdata] = useState({username: "", password:"", email: "",img:"", answer1: "", answer2: ""})
  const {data} = route.params;

  const handleSignUp = () => {  
    newdata.username = data.username;
    newdata.password = data.password;
    newdata.email = data.email;
    newdata.img = data.img;
    newdata.imgName = data.imgName;
    newdata.answer1 = answer1;
    newdata.answer2 = answer2;
    setNewdata({ ...newdata });
  }
  
  return (
    <SafeAreaView style={styles.container}>
     <View style={styles.container}>
      <View style={styles.userInfo}>
      <Avatar
            size="large"
            rounded
            source={{
              uri: `${data.img}`,
            }}
          />
        <Text style={{ fontSize: 30, fontWeight: "bold", marginHorizontal: 10, }}>{data.username}</Text>
      </View>
      <View style={styles.questionForm}>
        <Text style={{ fontSize: 16, fontWeight: "normal" }}>
          1. What is your dream job?
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Your Answer"
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={(text) => { setAnswer1(text) }} value={answer1}
        />
      </View>
      <View style={styles.questionForm}>
        <Text style={{ fontSize: 16, fontWeight: "normal" }}>
          2. What is the name of your first pet?
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Your Answer"
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={(text) => { setAnswer2(text) }} value={answer2}
        />
      </View>
      <TouchableOpacity
        style={styles.button_submit}
        onPress={() => {
          handleSignUp()
          navigation.navigate("AccountAge", {newdata: newdata})
          }}
      >
        <Button title="Next" color="#fff" />
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default AccountQuestion;

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
  userInfo: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  questionForm: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginVertical: 20,
  },
  input: {
    height: 50,
    width: "100%",
    fontSize: 18,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
    marginVertical: 10,
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
