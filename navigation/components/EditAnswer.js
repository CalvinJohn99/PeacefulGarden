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
      if (snapshot.exists) {
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
    <View>
      <Text style={{ fontWeight: "bold", fontSize: 20 }}>
        {props.question.question}
      </Text>
      <FlatList
        // style={{ top: 20 }}
        data={qabyacc}
        renderItem={({ item }) => <EditAnswerInput item={item} />}
      />
    </View>
  );
}
