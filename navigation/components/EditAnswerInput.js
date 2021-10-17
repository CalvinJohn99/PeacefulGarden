import * as React from "react";
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import fbdata from "../../firebase.js";
import { decreaseAnswerCount } from "../components/CommonFunctions.js";
import commonStyles from "../../commonStyles.js";

function deleteAnswer(question, answerID, username, userID) {
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

  decreaseAnswerCount(userID);
}

function updateAnswer(question, answerID, username, newAnswer) {
  fbdata
    .database()
    .ref("/qanswer/" + question.question + "/" + answerID + "/")
    .update({ answer: newAnswer });
  fbdata
    .database()
    .ref(
      "/qanswerbyuser/" +
        username +
        "/" +
        question.question +
        "/" +
        answerID +
        "/"
    )
    .update({ answer: newAnswer });
}

export default function EditAnswerInput(props) {
  const [editAnswer, setEditAnswer] = useState(props.item.answer);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  const getBorderColor = () => {
    if (focused) {
      return "#00BCD4";
    }
    return "white";
  };

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
              setDeleteModalVisible(true);
            }}
          >
            <Text style={{ textAlign: "center", color: "white" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => {
          setDeleteModalVisible(!deleteModalVisible);
        }}
      >
        <View style={commonStyles.modalFirstView}>
          <View style={commonStyles.modalSecondView}>
            <Text style={commonStyles.deleteWarningTitle}>Confirm delete?</Text>
            <Text style={commonStyles.deleteWarningText}>
              * Once delete, it is unrecoverable!
            </Text>
            <View style={{ flexDirection: "row", marginVertical: 10 }}>
              <TouchableOpacity
                style={[
                  commonStyles.modalButton,
                  { backgroundColor: "#00BCD4" },
                ]}
                onPress={() => {
                  setDeleteModalVisible(!deleteModalVisible);
                }}
              >
                <Text style={commonStyles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[commonStyles.modalButton, { backgroundColor: "red" }]}
                onPress={() => {
                  deleteAnswer(
                    props.item.question,
                    props.item.id,
                    props.item.username,
                    props.userID
                  );
                }}
              >
                <Text style={commonStyles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={commonStyles.modalFirstView}>
          <View style={commonStyles.modalSecondView}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Edit answer
            </Text>

            <View style={commonStyles.modalInputBoxWrapper}>
              <TextInput
                multiline={true}
                editable={true}
                autofocus={true}
                // placeholder={props.item.answer}
                onChangeText={(text) => {
                  setEditAnswer(text);
                }}
                value={editAnswer}
                // clearTextOnFocus={true}
                style={[
                  commonStyles.inputBox,
                  { borderColor: getBorderColor() },
                ]}
                onFocus={() => {
                  setFocused(true);
                }}
              />
            </View>
            <View style={{ flexDirection: "row", marginTop: 40 }}>
              <TouchableOpacity
                style={[
                  commonStyles.modalButton,
                  { backgroundColor: "#00BCD4" },
                ]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={commonStyles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[commonStyles.modalButton, { backgroundColor: "red" }]}
                onPress={() => {
                  updateAnswer(
                    props.item.question,
                    props.item.id,
                    props.item.username,
                    editAnswer
                  );
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={commonStyles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
