import * as React from "react";
import { View, Text, SafeAreaView, StyleSheet, Image} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import backgroundAccount from './../../../assets/backgroundAccount.png'

export default function MainAccountScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.textTitle}>Peaceful Garden</Text>

        <TouchableOpacity
          style={{ marginVertical: 5 }}
          onPress={() => navigation.navigate("SigninForm")}
        >
          <View style={styles.button}>
            <Text style={{ fontWeight: "bold", color: "#fff" }}>Sign In</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginVertical: 10 }}
          onPress={() => navigation.navigate("SignupForm")}
        >
          <View style={styles.button}>
            <Text style={{ fontWeight: "bold", color: "#fff" }}>Create Account</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.backgroundImageFrame}>
        <Image source = {backgroundAccount} style={styles.backgroundImage}></Image>
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
    paddingHorizontal: 0,
    backgroundColor: "#fff",
  },
  form : {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  textTitle: {
    fontSize: 40,
    fontWeight: "bold",
    marginVertical: 20,
  },
  button: {
    width: 130,
    height: 50,
    backgroundColor: "#17CAF1",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 14,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImageFrame: {
    width: "100%",
    height: "100%",
    marginVertical: 10,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
});
