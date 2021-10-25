import * as React from "react";
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import fbdata from "../../firebase.js";
import useCurrentDate, {
  useAccountUsername,
  useAccountUserid,
  increaseAnswerCount,
} from "../components/CommonFunctions.js";
import commonStyles from "../../commonStyles.js";

function storeQAnswer(
  currentQuestion,
  answer,
  currentUser,
  currentUserID,
  currentDate
) {
  var newAnswerKey = fbdata
    .database()
    .ref()
    .child(currentQuestion.question)
    .push().key;
  var dataToSave = {
    id: newAnswerKey,
    username: currentUser,
    answer: answer,
    creationDate: currentDate,
    timestamp: {
      ".sv": "timestamp",
    },
    negTimestamp: 0,
    question: currentQuestion,
  };
  var updates = {};
  updates["/qanswer/" + currentQuestion.question + "/" + newAnswerKey] =
    dataToSave;
  updates[
    "/qanswerbyuser/" +
      currentUser +
      "/" +
      currentQuestion.question +
      "/" +
      newAnswerKey
  ] = dataToSave;

  return fbdata
    .database()
    .ref()
    .update(updates, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("update is sucessful");
        updateNegTimestampQA(currentQuestion.question, newAnswerKey);
        updateNegTimestampQAbyAcc(
          currentQuestion.question,
          currentUser,
          newAnswerKey
        );
        increaseAnswerCount(currentUserID);
      }
    });
}

function updateNegTimestampQA(question, key) {
  const timeRef = fbdata
    .database()
    .ref("/qanswer/" + question + "/" + key + "/timestamp/");
  const negTimeRef = fbdata
    .database()
    .ref("/qanswer/" + question + "/" + key + "/");
  timeRef.once("value", (snapshot) => {
    var negTimestampValue = snapshot.val() * -1;
    negTimeRef.update({ negTimestamp: negTimestampValue });
  });
}

function updateNegTimestampQAbyAcc(question, currentUser, key) {
  const timeRef = fbdata
    .database()
    .ref(
      "/qanswerbyuser/" +
        currentUser +
        "/" +
        question +
        "/" +
        key +
        "/timestamp/"
    );
  const negTimeRef = fbdata
    .database()
    .ref("/qanswerbyuser/" + currentUser + "/" + question + "/" + key + "/");
  timeRef.once("value", (snapshot) => {
    var negTimestampValue = snapshot.val() * -1;
    negTimeRef.update({ negTimestamp: negTimestampValue });
  });
}

export default function AnswerQuestion({ navigation, route }) {
  const currentDate = useCurrentDate();
  const currentUser = useAccountUsername();
  const currentUserID = useAccountUserid();
  const { currentQuestion } = route.params;
  const [answer, setAnswer] = useState("");
  const [focused, setFocused] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);

  const getBorderColor = () => {
    if (focused) {
      return "#00BCD4";
    }
    return "white";
  };

  const onSubmit = () => {
    if (answer === "") {
      setErrorStatus(true);
    } else {
      storeQAnswer(
        currentQuestion,
        answer,
        currentUser,
        currentUserID,
        currentDate
      );
      alert("Successfully posted!");
      navigation.navigate("Question", { screen: "QList" });
    }
  };

  // const enterAnswer = (text) => {
  //   if (text.trim() != 0) {
  //     setAnswer(text);
  //     setErrorStatus(false);
  //   } else {
  //     setAnswer("");
  //     setErrorStatus(true);
  //   }
  // };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setFocused(false);
      }}
    >
      <SafeAreaView style={commonStyles.pageContainer}>
        {/* <Text style={styles.todayDate}> {currentDate} </Text> */}

        <View
          style={[
            commonStyles.questionHeaderWrapper,
            { backgroundColor: currentQuestion.color },
          ]}
        >
          <Text style={commonStyles.questionText}>
            {" "}
            {currentQuestion.id}. {currentQuestion.question}{" "}
          </Text>
        </View>

        {/* <View
          style={[styles.question, { backgroundColor: currentQuestion.color }]}
        >
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            {" "}
            {currentQuestion.id}. {currentQuestion.question}{" "}
          </Text>
        </View> */}

        <View style={commonStyles.answerContainer}>
          <View style={commonStyles.inputBoxWrapper}>
            <TextInput
              style={[commonStyles.inputBox, { borderColor: getBorderColor() }]}
              multiline={true}
              editable={true}
              autofocus={true}
              placeholder="Please insert your answer here"
              onChangeText={(text) => {
                setAnswer(text);
                setErrorStatus(false);
              }}
              value={answer}
              onFocus={() => {
                setFocused(true);
              }}
              //returnKeyType="done"
            />
          </View>
          <View
            style={{
              marginTop: 30,
              alignSelf: "flex-start",
              marginLeft: "10%",
            }}
          >
            {errorStatus === true ? (
              <Text style={styles.formErrorMsg}>
                Please enter your answer to post!
              </Text>
            ) : null}
          </View>

          <View style={styles.submitSection}>
            <View style={styles.warningTextCon}>
              <Text style={{ color: "red", fontWeight: "bold" }}>
                *This answer will be made public once you "Post" it!
              </Text>
            </View>
            <TouchableOpacity
              style={styles.postbutton}
              onPress={() => {
                onSubmit();
              }}
              // onPress={() => {
              //   storeQAnswer(currentQuestion.question, answer);
              //   alert("Successfully posted!");
              //   navigation.navigate("Question", { screen: "QList" });
              // }}
            >
              <Text style={styles.postbuttontext}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  // outerContainer: {
  //   flex: 1,
  //   alignItems: "center",
  //   //justifyContent: "center",
  // },

  // todayDate: {
  //   top: 20,
  //   fontWeight: "bold",
  //   fontSize: 26,
  // },

  // question: {
  //   top: 20,
  //   margin: 20,
  //   padding: 20,
  //   borderRadius: 20,
  //   width: "90%",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },

  submitSection: {
    flexDirection: "row",
    top: 40,
    width: "90%",
    height: 100,
  },

  warningTextCon: {
    alignItems: "center",
    justifyContent: "center",
    flex: 2,
    padding: 15,
  },

  postbutton: {
    backgroundColor: "#f3b000",
    justifyContent: "center",
    alignItems: "center",
    // marginVertical: 20,
    // marginHorizontal: 20,
    margin: 20,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 20,
    flex: 1,
  },

  postbuttontext: {
    fontWeight: "bold",
    color: "white",
    fontSize: 22,
  },

  formErrorMsg: {
    color: "red",
    fontSize: 20,
    // marginTop: 10,
    // alignSelf: "flex-start",
    // marginLeft: "10%",
    // marginLeft: -50,
  },
});
