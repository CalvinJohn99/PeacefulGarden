import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import fbdata from "../../firebase.js";
import { decreasePostCount } from "./CommonFunctions.js";

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
              deletePost(item.id, username, userID);
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
        // transparent={true}
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
            <Text>Edit Post</Text>
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
              onChangeText={(text) => {
                setEditPostContent(text);
              }}
              value={editPostContent}
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
                    updatePost(item.id, item.username, editPostContent);
                    setModalVisible(!modalVisible);
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
