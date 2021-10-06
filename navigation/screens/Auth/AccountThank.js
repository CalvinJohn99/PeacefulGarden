import React, {useEffect} from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

function AccountThank({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textGroup}>
        <Text style={styles.textTitle}>Thank you for signning up !</Text>
        <Text>You will be directed to the login page</Text>
      </View>
    </SafeAreaView>
  );
}

export default AccountThank;

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
  textGroup: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    
  },
  textTitle: {
    fontSize: 40,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
});
