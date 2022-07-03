// @refresh state
import * as React from "react";
import { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import fbdata from "../../firebase.js";
import EditAnswerInput from "./EditAnswerInput.js";

// EditAnswer component which read answers for each question and pass each answer to EditAnsewrInput component
export default function ListAnswerbyQuestion(props) {
  // useState variable: hold answer of passed question from QuestByAcc component under account
  const [qabyacc, setQabyacc] = useState([]);
  // read ansewrs for each question
  React.useEffect(() => {
    const accQARef = fbdata
      .database()
      .ref("/qanswerbyuser/" + props.username + "/" + props.question.question)
      .orderByChild("negTimestamp");
    const OnLoadingListener = accQARef.on("value", (snapshot) => {
      setQabyacc([]);
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          setQabyacc((qabyacc) => [...qabyacc, childSnapshot.val()]);
        });
      }
    });
    return () => {
      accQARef.off("value", OnLoadingListener);
    };
  }, []);

  // if no answer for a particular question, return null
  if (qabyacc.length === 0) {
    return null;
  }

  // render view
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "white",
        borderRadius: 20,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
        borderWidth: 1,
        borderColor: "rgba(178,185,214,0.5)",
      }}
    >
      <View
        style={{
          width: "100%",
          backgroundColor: props.question.color,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 20,
          paddingHorizontal: 15,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: "grey",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.36,
          shadowRadius: 5,
          elevation: 11,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
          {props.question.question}
        </Text>
      </View>
      <FlatList
        style={{
          alignItems: "left",
          marginHorizontal: 10,
          paddingBottom: 20,
        }}
        data={qabyacc}
        renderItem={({ item }) => (
          <EditAnswerInput
            item={item}
            username={props.username}
            userID={props.userID}
          />
        )}
      />
    </View>
  );
}
