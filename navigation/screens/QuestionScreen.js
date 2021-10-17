import * as React from "react";
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import fbdata from "../../firebase.js";
import commonStyles from "../../commonStyles.js";

import useCurrentDate from "../components/CommonFunctions.js";
import { SharedElement } from "react-navigation-shared-element";

// const getBackgroundColor = (id) => {
//   if (id % 3 === 1) {
//     return "#B6E4CB";
//   } else if (id % 3 === 2) {
//     return "#B5CBDF";
//   } else if (id % 3 === 0) {
//     return "#E8D8D8";
//   }
// };

function QuestionScreen({ navigation }) {
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

  const currentDate = useCurrentDate();

  return (
    <SafeAreaView style={commonStyles.pageContainer}>
      {/* <View>
        <Text style={{ marginTop: 20, fontWeight: "bold", fontSize: 26 }}>
          {" "}
          {currentDate}{" "}
        </Text>
      </View> */}

      <FlatList
        style={{ top: 20 }}
        data={QList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { backgroundColor: item.color }]}
            onPress={() => {
              navigation.navigate("Question", {
                screen: "QViewAnswer",
                params: { item },
              });
            }}
          >
            <SharedElement id={`item.${item.id}.question`}>
              <Text style={styles.question}>
                {" "}
                {item.id}. {item.question}{" "}
              </Text>
            </SharedElement>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      ></FlatList>
    </SafeAreaView>
  );
}

export default QuestionScreen;

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
