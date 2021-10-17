import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import fbdata from "../../firebase.js";
import { decreasePostCount } from "./CommonFunctions.js";
import commonStyles from "../../commonStyles.js";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

function deletePost(postID, postUsername, postUserID) {
  const deletePostRef = fbdata.database().ref("posts/" + postID);
  const deletePostbyAccRef = fbdata
    .database()
    .ref("postsbyacc/" + postUsername + "/" + postID);

  deletePostRef.get().then((snapshot) => {
    if (snapshot.exists()) {
      deletePostRef.remove();
    }
  });

  deletePostbyAccRef.get().then((snapshot) => {
    if (snapshot.exists()) {
      deletePostbyAccRef.remove();
    }
  });

  decreasePostCount(postUserID);
}

function updatePost(postID, postUsername, newPostContent) {
  fbdata
    .database()
    .ref("posts/" + postID)
    .update({ content: newPostContent });
  fbdata
    .database()
    .ref("postsbyacc/" + postUsername + "/" + postID)
    .update({ content: newPostContent });
}

export default function EditPost(props) {
  const item = props.item;
  const username = props.username;
  const userID = props.userID;
  const [editPostContent, setEditPostContent] = useState(item.content);
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
      <Card
        style={{
          marginVertical: 20,
          width: SCREEN_WIDTH * 0.9,
          // height: SCREEN_HEIGHT * 0.55,
          borderRadius: 20,
          margin: 20,
          shadowColor: "grey",
          shadowOffset: { width: 5, height: 5 },
          shadowOpacity: 0.5,
          shadowRadius: 20,
          elevation: 5,
        }}
      >
        <Card.Cover
          style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
          source={{ uri: item.imageURL }}
        />
        <Card.Content style={{ marginVertical: 5 }}>
          <Title>{item.title}</Title>
          <Paragraph style={{ marginTop: 5 }}>{item.content}</Paragraph>
          <Paragraph style={{ marginTop: 5 }}>{item.date}</Paragraph>
        </Card.Content>
        <Card.Actions style={{ flex: 1 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#f3b000",
              padding: 10,
              margin: 20,
              alignItems: "center",
              borderRadius: 20,
            }}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "red",
              padding: 10,
              margin: 20,
              alignItems: "center",
              borderRadius: 20,
            }}
            onPress={() => {
              setDeleteModalVisible(true);
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
              Delete
            </Text>
          </TouchableOpacity>
        </Card.Actions>
      </Card>
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
                  deletePost(item.id, username, userID);
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
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
              setFocused(false);
            }}
          >
            <View style={commonStyles.modalSecondView}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Edit Post
              </Text>

              <View style={commonStyles.modalInputBoxWrapper}>
                <TextInput
                  multiline={true}
                  editable={true}
                  autofocus={true}
                  onChangeText={(text) => {
                    setEditPostContent(text);
                  }}
                  value={editPostContent}
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
                  style={[
                    commonStyles.modalButton,
                    { backgroundColor: "#F3B000" },
                  ]}
                  onPress={() => {
                    updatePost(item.id, item.username, editPostContent);
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={commonStyles.modalButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // deleteModal: {
  //   width: "70%",
  //   backgroundColor: "white",
  //   borderRadius: 20,
  //   padding: 35,
  //   // alignItem: "center",
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacit: 0.25,
  //   shadowRadius: 4,
  //   elevation: 5,
  // },
});
