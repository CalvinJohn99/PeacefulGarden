import React, { useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Button, Input, Icon } from "react-native-elements";
import fbdata from "../../../firebase";
import * as Animatable from "react-native-animatable";
import commonStyles from "../../../commonStyles.js";

export default function ResetPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const reset = async () => {
    setShowLoading(true);
    try {
      await fbdata.auth().sendPasswordResetEmail(email);
      setShowLoading(false);
      setShowMessage(true);
    } catch (e) {
      setShowLoading(false);
      Alert.alert("Please enter your registered email to reset password!");
      // Alert.alert(e.message);
    }
  };
  return (
    <SafeAreaView style={commonStyles.pageContainer}>
      <View
        style={{
          width: "100%",
          height: "25%",
          backgroundColor: "#00BCD4",
          // flexDirection: "column",
          // alignItems: "center",
          justifyContent: "center",
          paddingLeft: 20,
        }}
        // style={[
        //   commonStyles.questionHeaderWrapper,
        //   { backgroundColor: "#00BCD4" },
        // ]}
      >
        <Text
          style={{
            color: "white",
            fontSize: 26,
            fontWeight: "bold",
          }}
        >
          Reset Password
        </Text>
      </View>

      <View style={commonStyles.answerContainer}>
        <Input
          inputContainerStyle={{
            marginTop: 40,
            marginHorizontal: 10,
          }}
          style={styles.textInput}
          placeholder="Your Email"
          autoCapitalize="none"
          leftIcon={<Icon name="mail" size={24} color="#00BCD4" />}
          value={email}
          onChangeText={setEmail}
        />
        {showLoading && (
          <View style={styles.activity}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        {showMessage && (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>
              Check your email box to reset your password
            </Text>
          </Animatable.View>
        )}

        <TouchableOpacity
          style={styles.button_submit}
          onPress={() => {
            reset();
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
            Reset
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.button_submit}
          onPress={() => {
            navigation.navigate("SigninForm");
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
            Back to Sign in
          </Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    height: 400,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "red",
  },
  subContainer: {
    marginBottom: 20,
    padding: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  activity: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    fontSize: 18,
    margin: 5,
    width: 200,
  },
  errorMsg: {
    color: "green",
    fontSize: 12,
  },
  button_submit: {
    height: 50,
    width: 160,
    borderRadius: 14,
    // backgroundColor: "#17CAF1",
    backgroundColor: "#00BCD4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    marginTop: 30,
    // marginVertical: 20,
  },
});
