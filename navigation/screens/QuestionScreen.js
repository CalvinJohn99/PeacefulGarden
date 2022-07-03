import * as React from "react";
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import fbdata from "../../firebase.js";
import commonStyles from "../../commonStyles.js";

// Question Screen
// View question list and select quesiton to view its answers
function QuestionScreen({ navigation }) {
  // create a useState variable, initialize it to be an empty array
  // read the question from firebase, and put into the array QList
  const [QList, setQList] = useState([]);
  useEffect(() => {
    const questionRef = fbdata
      .database()
      .ref("/sa-question")
      .orderByChild("id");
    const OnLoadingListener = questionRef.once("value", (snapshot) => {
      setQList([]);
      snapshot.forEach((childSnapshot) => {
        setQList((QList) => [...QList, childSnapshot.val()]);
      });
    });
    return () => {
      questionRef.off();
    };
  }, []);

  // render view
  return (
    <SafeAreaView style={commonStyles.pageContainer}>
      {/* render question list */}
      <FlatList
        style={{ top: 20, marginBottom: 30 }}
        data={QList}
        renderItem={({ item }) => (
          // each questino is a touchable button
          // onPress: navigate to QuestionViewAnswer Screen
          // pass variable question as {item}
          <TouchableOpacity
            style={[styles.item, { backgroundColor: item.color }]}
            onPress={() => {
              navigation.navigate("Question", {
                screen: "QViewAnswer",
                params: { item },
              });
            }}
          >
            <Text style={styles.question}>
              {" "}
              {item.id}. {item.question}{" "}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      ></FlatList>
    </SafeAreaView>
  );
}

// export QuestionScreen as default
export default QuestionScreen;

// Style Sheet
const styles = StyleSheet.create({
  item: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    height: 170,
    justifyContent: "center",
  },
  question: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
  },
});
