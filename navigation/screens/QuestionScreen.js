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

import useCurrentDate from "../components/CommonFunctions.js";

const getBackgroundColor = (id) => {
  if (id % 3 === 1) {
    return "#B6E4CB";
  } else if (id % 3 === 2) {
    return "#B5CBDF";
  } else if (id % 3 === 0) {
    return "#E8D8D8";
  }
};

export default function QuestionScreen({ navigation }) {
  const [QList, setQList] = useState([]);
  React.useEffect(() => {
    const questionRef = fbdata
      .database()
      .ref("/sa-question")
      .orderByChild("id");
    const OnLoadingListener = questionRef.once("value", (snapshot) => {
      setQList([]);
      snapshot.forEach((childSnapshot) => {
        setQList((QList) => [...QList, childSnapshot.val()]);
        console.log(childSnapshot.val());
      });
    });
    return () => {
      questionRef.off();
    };
  }, []);

  const currentDate = useCurrentDate();

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={{ top: 10, fontWeight: "bold", fontSize: 26 }}>
          {" "}
          {currentDate}{" "}
        </Text>
      </View>

      <FlatList
        style={{ top: 20 }}
        data={QList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              { backgroundColor: getBackgroundColor(item.id) },
            ]}
            onPress={() => {
              navigation.navigate("Question", {
                screen: "QViewAnswer",
                params: { item },
              });
              console.log({ item });
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 20,
    alignItems: "center",
  },
  item: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
  },
  question: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
  },
});
