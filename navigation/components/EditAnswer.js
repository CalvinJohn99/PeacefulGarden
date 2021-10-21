// @refresh state
import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import fbdata from "../../firebase.js";
import EditAnswerInput from "./EditAnswerInput.js";

export default function ListAnswerbyQuestion(props) {
  const [qabyacc, setQabyacc] = useState([]);
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

  if (qabyacc.length === 0) {
    return null;
  }
  return (
    <View
      style={{
        width: "100%",
        // borderWidth: 2,
        // borderColor: "black",
        backgroundColor: "white",
        borderRadius: 20,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
        borderWidth: 1,
        borderColor: "rgba(178,185,214,0.5)",
        // shadowColor: "grey",
        // shadowOffset: {
        //   width: 2,
        //   height: 5,
        // },
        // shadowOpacity: 0.36,
        // shadowRadius: 5,
        // elevation: 11,
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
