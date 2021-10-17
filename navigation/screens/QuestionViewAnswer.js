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
  Animated,
} from "react-native";
import * as Animatable from "react-native-animatable";

import fbdata from "../../firebase.js";

import useCurrentDate from "../components/CommonFunctions.js";
import LikeButton from "../components/LikeButton";
import { SharedElement } from "react-navigation-shared-element";
import Ionicons from "react-native-vector-icons/Ionicons";

function QuestionViewAnswer({ navigation, route }) {
  const { item } = route.params;
  const questionid = route.params.item.id;
  const questiontext = route.params.item.question;
  const questioncolor = route.params.item.color;
  const currentQuestion = {
    id: questionid,
    question: questiontext,
    color: questioncolor,
  };
  const currentDate = useCurrentDate();

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
      });
    });
    return () => {
      questionAnswerRef.off();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View
        // animation="fadeInUp"
        style={[styles.question, { backgroundColor: questioncolor }]}
      >
        <View style={{ backgroundColor: "red" }} />
        <SharedElement id={`item.${item.id}.question`}>
          <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: -20 }}>
            {" "}
            {item.id}. {item.question}{" "}
          </Text>
        </SharedElement>
      </Animatable.View>
      {/* <View style={styles.submitSection}>
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
          }}
        >
          <Text style={styles.newbuttontext}>New</Text>
        </TouchableOpacity>
      </View> */}

      <Animatable.View
        style={{
          marginTop: -20,
          width: "100%",
          height: "78%",
          backgroundColor: "white",
          borderRadius: 20,
          alignItems: "center",
        }}
        // animation="fadeInUp"
      >
        <Animatable.View animation="zoomIn">
          <TouchableOpacity
            // animation="fadeInUp"
            style={styles.newbutton}
            onPress={() => {
              navigation.navigate("Question", {
                screen: "QCreateAnswer",
                params: { currentQuestion },
              });
            }}
          >
            <Ionicons name="add-circle" size={60} color="#f3b000" />
          </TouchableOpacity>
        </Animatable.View>

        <FlatList
          style={{ width: "90%", marginTop: 20 }}
          data={QAList}
          renderItem={({ item }) => (
            <Animatable.View animation="fadeInUp" style={styles.answerCon}>
              <Text style={styles.answerText}> {item.answer} </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    flexGrow: 1,
                    marginTop: 4,
                  }}
                >
                  <Text
                    style={{
                      paddingTop: 6,
                      paddingLeft: 20,
                      fontWeight: "bold",
                    }}
                  >
                    by {item.username}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row-reverse",
                    marginTop: 4,
                    flexGrow: 1,
                  }}
                >
                  <LikeButton question={currentQuestion} answer={item} />
                </View>
              </View>
            </Animatable.View>
          )}
          keyExtractor={(item) => item.id}
        ></FlatList>
      </Animatable.View>
    </SafeAreaView>
  );
}

QuestionViewAnswer.SharedElement = (route, otherRoute, showing) => {
  const { item } = route.params;
  return [
    // { id: `item.${item.id}.question` },
    { id: `item.${item.id}.question`, animation: "fadeInUp" },
  ];
};

export default QuestionViewAnswer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: StatusBar.currentHeight || 20,
    alignItems: "center",
    backgroundColor: "#ffffff",
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
    fontSize: 22,
  },

  question: {
    // top: 20,
    // margin: 20,
    padding: 20,
    // paddingVertical: 20,
    // borderRadius: 20,
    width: "100%",
    height: "25%",
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
    // backgroundColor: "#1067CC",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
    shadowColor: "#f3b000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 9,
  },

  newbuttontext: {
    fontWeight: "bold",
    color: "white",
    fontSize: 22,
  },
});
