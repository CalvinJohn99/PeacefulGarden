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
import commonStyles from "../../commonStyles.js";

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

  const [QAList, setQAList] = useState([]);
  useEffect(() => {
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
    <SafeAreaView style={commonStyles.pageContainer}>
      <Animatable.View
        // animation="fadeInUp"
        style={[
          commonStyles.questionHeaderWrapper,
          { backgroundColor: questioncolor },
        ]}
      >
        <View />
        <SharedElement id={`item.${item.id}.question`}>
          <Text style={commonStyles.questionText}>
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

      <Animatable.View style={commonStyles.answerContainer}>
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
          style={{
            width: "95%",
            marginTop: 20,
            marginBottom: 30,
          }}
          data={QAList}
          renderItem={({ item }) => (
            <Animatable.View animation="fadeInUp" style={styles.answerCon}>
              <Text
                style={{
                  marginTop: 10,
                  alignSelf: "flex-end",
                  paddingRight: 10,
                }}
              >
                {" "}
                Posted on {item.creationDate}{" "}
              </Text>
              <Text style={styles.answerText}> {item.answer} </Text>

              <View
                style={{
                  flexGrow: 1,
                  marginTop: 4,
                  alignSelf: "flex-end",
                  paddingRight: 10,
                  // flexDirection: "row-reverse",
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

              {/* <View
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
                    marginLeft: 10,
                    flexGrow: 1,
                  }}
                >
                  <LikeButton question={currentQuestion} answer={item} />
                </View>
              </View> */}
            </Animatable.View>
          )}
          keyExtractor={(item) => item.id}
        ></FlatList>
      </Animatable.View>
    </SafeAreaView>
  );
}

// QuestionViewAnswer.SharedElement = (route, otherRoute, showing) => {
//   const { item } = route.params;
//   return [
//     // { id: `item.${item.id}.question` },
//     { id: `item.${item.id}.question`, animation: "fadeInUp" },
//   ];
// };

export default QuestionViewAnswer;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   // marginTop: StatusBar.currentHeight || 20,
  //   alignItems: "center",
  //   backgroundColor: "#ffffff",
  // },

  answerCon: {
    marginVertical: 20,
    padding: 5,
    width: "95%",
    alignSelf: "center",
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
    padding: 10,
    color: "black",
    fontSize: 18,
  },

  // submitSection: {
  //   flexDirection: "row",
  //   height: 100,
  // },

  // dateCon: {
  //   alignItems: "center",
  //   justifyContent: "center",
  //   flex: 3,
  //   left: 5,
  // },

  // todayDate: {
  //   fontWeight: "bold",
  //   fontSize: 26,
  // },

  newbutton: {
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
