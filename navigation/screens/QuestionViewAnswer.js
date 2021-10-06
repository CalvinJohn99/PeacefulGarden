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

import useCurrentDate, {
  useAccountUsername,
} from "../components/CommonFunctions.js";
import LikeButton from "../components/LikeButton";

const getBackgroundColor = (id) => {
  if (id % 3 === 1) {
    return "#B6E4CB";
  } else if (id % 3 === 2) {
    return "#B5CBDF";
  } else if (id % 3 === 0) {
    return "#E8D8D8";
  }
};

export default function QuestionViewAnswer({ navigation, route }) {
  const questionid = route.params.item.id;
  const questiontext = route.params.item.question;
  const currentQuestion = { id: questionid, question: questiontext };
  const username = useAccountUsername();

  const [QAList, setQAList] = useState([]);
  React.useEffect(() => {
    const questionAnswerRef = fbdata
      .database()
      .ref("/qanswer/" + questiontext)
      .orderByChild("negTimestamp");
    const OnLoadingListener = questionAnswerRef.once("value", (snapshot) => {
      setQAList([]);
      snapshot.forEach((childSnapshot) => {
        setQAList((QAList) => [...QAList, childSnapshot.val()]);
        console.log(childSnapshot.val());
      });
    });
    return () => {
      questionAnswerRef.off();
    };
  }, []);

  const currentDate = useCurrentDate();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.submitSection}>
        <View style={styles.dateCon}>
          <Text style={styles.todayDate}> {currentDate} </Text>
        </View>
        <TouchableOpacity
          style={styles.newbutton}
          onPress={() => {
            navigation.navigate("Question", {
              screen: "QCreateAnswer",
              params: { currentQuestion },
            });
            // console.log(currentQuestion);
          }}
        >
          <Text style={styles.newbuttontext}>New</Text>
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.question,
          { backgroundColor: getBackgroundColor(questionid) },
        ]}
      >
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
          {" "}
          {questionid}. {questiontext}{" "}
        </Text>
      </View>

      <FlatList
        style={{ top: 20, width: "90%" }}
        data={QAList}
        renderItem={({ item }) => (
          <View style={styles.answerCon}>
            <Text style={styles.answerText}> {item.answer} </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                marginTop: 4,
              }}
            >
              <LikeButton
                question={currentQuestion}
                answer={item}
                username={username}
              />
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
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

  answerCon: {
    marginVertical: 20,
    padding: 10,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "grey",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.36,
    shadowRadius: 5,
    elevation: 11,
  },

  answerText: {
    padding: 20,
    color: "black",
  },

  question: {
    top: 20,
    margin: 20,
    padding: 20,
    borderRadius: 20,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },

  submitSection: {
    flexDirection: "row",
    height: 100,
  },

  dateCon: {
    alignItems: "center",
    justifyContent: "center",
    flex: 3,
    left: 5,
  },

  todayDate: {
    fontWeight: "bold",
    fontSize: 26,
  },

  newbutton: {
    backgroundColor: "#1067CC",
    justifyContent: "center",
    alignItems: "center",
    margin: 15,
    borderRadius: 20,
    flex: 1,
  },

  newbuttontext: {
    fontWeight: "bold",
    color: "white",
    fontSize: 22,
  },
});
