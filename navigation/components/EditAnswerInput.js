import * as React from "react";
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import fbdata from "../../firebase.js";

function deleteAnswer(question, answerID, username) {
  const answerRef = fbdata
    .database()
    .ref("/qanswer/" + question.question + "/" + answerID + "/");
  const answerbyUserRef = fbdata
    .database()
    .ref(
      "/qanswerbyuser/" +
        username +
        "/" +
        question.question +
        "/" +
        answerID +
        "/"
    );

  answerRef.get().then((snapshot) => {
    if (snapshot.exists()) {
      answerRef.remove();
    }
  });

  answerbyUserRef.get().then((snapshot) => {
    if (snapshot.exists()) {
      answerbyUserRef.remove();
    }
  });
}

export default function EditAnswerInput(props) {
  console.log(props.item);
  const [editAnswer, setEditAnswer] = useState(props.item.answer);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <Text>{props.item.creationDate}</Text>
      <Text>{props.item.answer}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItem: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexGrow: 1,
            alignItem: "center",
            justifyContent: "center",
            marginHorizontal: "10%",
            marginVertical: 10,
            //   marginLeft: "10%",
            //   marginRight: "10%",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "blue",
            }}
          >
            <Text
              style={{ textAlign: "center", color: "white" }}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              Edit
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexGrow: 1,
            alignItem: "center",
            justifyContent: "center",
            marginHorizontal: "10%",
            marginVertical: 10,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "green",
            }}
            onPress={() => {
              deleteAnswer(
                props.item.question,
                props.item.id,
                props.item.username
              );
            }}
          >
            <Text style={{ textAlign: "center", color: "white" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: "70%",
              backgroundColor: "white",
              borderRadius: 20,
              padding: 35,
              alignItem: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacit: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text>Edit answer</Text>
            {/* <TouchableOpacity
                style={{ margin: 10 }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity> */}

            <TextInput
              multiline={true}
              editable={true}
              autofocus={true}
              // placeholder={props.item.answer}
              onChangeText={(text) => {
                setEditAnswer(text);
              }}
              value={editAnswer}
              clearTextOnFocus={true}
              style={{ height: "30%", top: 20 }}
              // onFocus={() => {
              // setFocused(true);
              // }}
            />
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={{ margin: 10 }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={{ margin: 10 }}
                  onPress={() => {
                    deleteAnswer(
                      props.item.question,
                      props.item.id,
                      props.item.username
                    );
                  }}
                >
                  <Text>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
