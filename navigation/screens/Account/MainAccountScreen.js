import * as React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

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

        <TouchableOpacity style={{alignSelf: "flex-end" }}>
          <Text style={{ fontSize: 10  }}>Forget password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginVertical: 10 }}
          onPress={() => navigation.navigate("SignupForm")}
        >
          <View style={styles.button}>
            <Text style={{ fontWeight: "bold", color: "#fff" }}>Sign Up</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.backgroundImage}></View>
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
    marginVertical: 30,
  },
  button: {
    width: 120,
    height: 40,
    backgroundColor: "#17CAF1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    backgroundColor: "#17CAF1",
    width: "100%",
    height: "100%",
    borderRadius: 100,
    borderWidth: 5,
    borderColor: "#000000",
  },
});
