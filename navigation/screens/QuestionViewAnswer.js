import * as React from "react";
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";
import Ionicons from "react-native-vector-icons/Ionicons";

// import firebase from "firebase.js"
import fbdata from "../../firebase.js";

// import common styles from "commonStyls"
import commonStyles from "../../commonStyles.js";

// import component
import LikeButton from "../components/LikeButton";

// View answer based on selected question
// Receive question object from QuestionScreen
// Show FlatList of answers of the passed question
function QuestionViewAnswer({ navigation, route }) {
  // Recieve question id, question, color and put into a new variable currentQuestion
  const questionid = route.params.item.id;
  const questiontext = route.params.item.question;
  const questioncolor = route.params.item.color;
  const currentQuestion = {
    id: questionid,
    question: questiontext,
    color: questioncolor,
  };

  // Read answer list of the passed question from firebase and put into array QAList
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

  // render the screen
  return (
    <SafeAreaView style={commonStyles.pageContainer}>
      {/* show question with the corresponding background colour */}
      <Animatable.View
        style={[
          commonStyles.questionHeaderWrapper,
          { backgroundColor: questioncolor },
        ]}
      >
        <View />
        <Text style={commonStyles.questionText}>
          {questionid}. {questiontext}
        </Text>
      </Animatable.View>

      {/* Plus new button using plus icon, navigate to create new answer for the passed question once clicked, pass variable currentQuestion to the create ansewr screen */}
      <Animatable.View style={commonStyles.answerContainer}>
        <Animatable.View animation="zoomIn">
          <TouchableOpacity
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

        {/* List of answers of the question passed from QuestionScreen */}
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
              </View>
            </Animatable.View>
          )}
          keyExtractor={(item) => item.id}
        ></FlatList>
      </Animatable.View>
    </SafeAreaView>
  );
}

export default QuestionViewAnswer;

// style sheet
const styles = StyleSheet.create({
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
