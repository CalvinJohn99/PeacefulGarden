import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  TextInput,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
function AccountQuestion({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>John Henry</Text>
        <Image
          style={{ width: 80, height: 80, borderRadius: 50, borderWidth: 1 }}
          source={require("./../../../assets/opening1.jpg")}
        />
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
        />
      </View>
      <TouchableOpacity
        style={styles.button_submit}
        onPress={() => navigation.navigate("AccountAge")}
      >
        <Button title="Next" color="#fff" />
      </TouchableOpacity>
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionForm: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginVertical: 30,
  },
  input: {
    height: 36,
    width: "100%",
    fontSize: 16,
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
