import * as React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import useCurrentDate from "../components/CommonFunctions";

export default function JournalMoodScreen({ navigation }) {
  const currentDate = useCurrentDate();

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={{ top: 20, fontWeight: "bold", fontSize: 26 }}>
          {" "}
          {currentDate}{" "}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.jmNav, { backgroundColor: "#B6E4CB" }]}
        onPress={() => navigation.navigate("Journal", { screen: "CreateMood" })}
      >
        <Text style={styles.jmNavText}>Create Mood</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.jmNav, { backgroundColor: "#B5CBDF" }]}>
        <Text style={styles.jmNavText}>Journal</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.jmNav, { backgroundColor: "#E8D8D8" }]}>
        <Text style={styles.jmNavText}>History</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  jmNav: {
    top: 120,
    margin: 20,
    padding: 20,
    borderRadius: 20,
    width: "60%",
  },
  jmNavText: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
  },
});
