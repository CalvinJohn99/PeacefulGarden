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
} from "react-native";
import fbdata from "../../firebase.js";
import useCurrentDate, {
  useAccountUsername,
  useDateString,
} from "../components/CommonFunctions.js";

const getBackgroundColor = (id) => {
  if (id % 3 === 1) {
    return "#B6E4CB";
  } else if (id % 3 === 2) {
    return "#B5CBDF";
  } else if (id % 3 === 0) {
    return "#E8D8D8";
  }
};

function storeQAnswer(currentQuestion, answer, currentUser, currentDate) {
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
  // const dateString = useDateString();
  const { currentQuestion } = route.params;
  const [answer, setAnswer] = useState("");
  const [focused, setFocused] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);

  const getBorderColor = () => {
    if (focused) {
      return "blue";
    }
    return "white";
  };

  const onSubmit = () => {
    if (answer === "") {
      setErrorStatus(true);
    } else {
      storeQAnswer(currentQuestion, answer, currentUser, currentDate);
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
      <SafeAreaView style={styles.outerContainer}>
        <Text style={styles.todayDate}> {currentDate} </Text>
        <View
          style={[
            styles.question,
            { backgroundColor: getBackgroundColor(currentQuestion.id) },
          ]}
        >
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            {" "}
            {currentQuestion.id}. {currentQuestion.question}{" "}
          </Text>
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { borderColor: getBorderColor() }]}
            multiline={true}
            editable={true}
            autofocus={true}
            placeholder="Please insert your answer here"
            onChangeText={(text) => setAnswer(text)}
            value={answer}
            onFocus={() => {
              setFocused(true);
            }}
            //returnKeyType="done"
          />
        </View>
        {errorStatus === true ? (
          <Text style={styles.formErrorMsg}>
            Please enter your answer to post!
          </Text>
        ) : null}

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
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: "center",
    //justifyContent: "center",
  },

  todayDate: {
    top: 20,
    fontWeight: "bold",
    fontSize: 26,
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

  inputWrapper: {
    top: 20,
    padding: 8,
    margin: 10,
    width: "90%",
    height: "50%",
    borderColor: "black",
    shadowColor: "grey",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.36,
    shadowRadius: 5,
    elevation: 11,
  },

  input: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "white",
    padding: 20,
    paddingTop: 20,
  },

  submitSection: {
    flexDirection: "row",
    top: 50,
    height: 100,
  },

  warningTextCon: {
    alignItems: "center",
    justifyContent: "center",
    flex: 2,
    left: 10,
    padding: 15,
  },

  postbutton: {
    backgroundColor: "#1067CC",
    justifyContent: "center",
    alignItems: "center",
    margin: 15,
    padding: 15,
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
    marginLeft: -70,
  },
});
