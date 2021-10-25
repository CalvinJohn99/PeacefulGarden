import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import backgroundAccount from "./../../../assets/backgroundAccountBlue.jpg";

export default function MainAccountScreen({ navigation }) {
  return (
    <SafeAreaView style={{ width: "100%", height: "100%" }}>
      <ImageBackground
        source={backgroundAccount}
        resizeMode="cover"
        style={{ width: "100%", height: "100%", marginTop: 100 }}
      >
        <View style={styles.container}>
          <View style={styles.form}>
            <Text style={styles.textTitle}>Peaceful Garden</Text>

            <TouchableOpacity
              style={{ marginTop: 50, marginBottom: 15 }}
              onPress={() => navigation.navigate("SigninForm")}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Sign In</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginVertical: 15 }}
              onPress={() => navigation.navigate("SignupForm")}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Create Account</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* <View style={styles.backgroundImageFrame}>
        <Image
          source={backgroundAccount}
          style={styles.backgroundImage}
        ></Image>
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingHorizontal: 20,
    // backgroundColor: "white",
  },
  form: {
    width: "100%",
    // height: "100%",
    display: "flex",
    flexDirection: "column",
    // alignSelf: "center",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 50,
    marginTop: 100,
  },
  textTitle: {
    fontSize: 40,
    fontWeight: "bold",
    marginVertical: 20,
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 14,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#00BCD4",
    fontSize: 22,
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
