import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import fbdata from "../../firebase.js";
import { decreasePostCount } from "./CommonFunctions.js";
import commonStyles from "../../commonStyles.js";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

function deletePost(
  postID,
  postCategory,
  postImageRef,
  postUsername,
  postUserID
) {
  const deletePostRef = fbdata
    .database()
    .ref("posts/" + postCategory + "/" + postID);
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

  fbdata.storage().refFromURL(postImageRef).delete();
}

function updatePost(
  postID,
  postUsername,
  postCategory,
  newPostContent,
  url,
  ref
) {
  fbdata
    .database()
    .ref("posts/" + postCategory + "/" + postID)
    .update({ content: newPostContent, imageURL: url, imageRef: ref });
  fbdata
    .database()
    .ref("postsbyacc/" + postUsername + "/" + postID)
    .update({ content: newPostContent, imageURL: url, imageRef: ref });
}

export default function EditPost(props) {
  const item = props.item;
  const username = props.username;
  const userID = props.userID;
  const [image, setImage] = useState(item.imageURL);
  const [imageUpdated, setImageUpdated] = useState(false);
  const [editPostContent, setEditPostContent] = useState(item.content);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteImageVisible, setDeleteImageVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const [contentErrorStatus, setContentErrorStatus] = useState(false);
  const [imageErrorStatus, setImageErrorStatus] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      setImageErrorStatus(false);
      setImageUpdated(true);
    }
  };

  const updatePostImage = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });

    const ref = fbdata
      .storage()
      .ref("posts/" + username + "/")
      .child(new Date().toISOString());
    const snapshot = ref.put(blob);

    snapshot.on(
      fbdata.storage.TaskEvent.STATE_CHANGED,
      () => {
        setUploading(true);
      },
      (error) => {
        setUploading(false);
        console.log(error);
        blob.close();
        return;
      },
      () => {
        snapshot.snapshot.ref.getDownloadURL().then((url) => {
          setUploading(false);
          // console.log("download url", url);
          blob.close();
          if (editPostContent === "" || image === "") {
            setErrorStatus(true);
          } else {
            updatePost(
              item.id,
              item.username,
              item.category,
              editPostContent,
              url,
              ref.toString()
            );
            setModalVisible(!modalVisible);
            // alert("Successfully posted!");
            // navigation.navigate("Post", { screen: "GPostList" });
          }
          return url;
        });
      }
    );
  };

  const getBorderColor = () => {
    if (focused) {
      return "#00BCD4";
    }
    return "white";
  };

  const onSubmit = () => {
    if (editPostContent === "" || image === "") {
      if (editPostContent === "") {
        setContentErrorStatus(true);
      }
      if (image === "") {
        setImageErrorStatus(true);
      }
    } else {
      if (imageUpdated) {
        updatePostImage();
        setImageUpdated(false);
      } else {
        updatePost(
          item.id,
          item.username,
          item.category,
          editPostContent,
          item.imageURL,
          item.imageRef
        );
        setModalVisible(!modalVisible);
      }
    }
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
              marginVertical: 20,
              marginHorizontal: "7%",
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
              backgroundColor: "#F02A4B",
              padding: 10,
              marginVertical: 20,
              marginHorizontal: "7%",
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
                style={[
                  commonStyles.modalButton,
                  { backgroundColor: "#F02A4B" },
                ]}
                onPress={() => {
                  deletePost(
                    item.id,
                    item.category,
                    item.imageRef,
                    username,
                    userID
                  );
                }}
              >
                <Text style={commonStyles.modalButtonText}>Delete</Text>
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
          <ScrollView>
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
                setFocused(false);
              }}
            >
              <View
                style={[
                  commonStyles.modalSecondView,
                  {
                    backgroundColor: "#DBF0FF",
                    width: SCREEN_WIDTH * 0.9,
                    marginTop: 80,
                  },
                ]}
              >
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
                      setContentErrorStatus(false);
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

                {contentErrorStatus === true ? (
                  <Text style={styles.formErrorMsg}>
                    Please enter your content to post!
                  </Text>
                ) : null}

                <View style={{ alignItems: "center", marginTop: 70 }}>
                  {image === "" ? (
                    <TouchableOpacity
                      style={{ alignSelf: "center" }}
                      onPress={() => {
                        pickImage();
                      }}
                    >
                      <FontAwesome5 name="plus" size={40} color="grey" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.postImage}
                      onPress={() => {
                        setDeleteImageVisible(true);
                      }}
                    >
                      <Image
                        source={{ uri: image }}
                        style={{ width: "100%", height: 200, borderRadius: 20 }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {imageErrorStatus === true ? (
                  <Text
                    style={[
                      styles.formErrorMsg,
                      { marginLeft: 0, marginTop: 10 },
                    ]}
                  >
                    Please upload a photo to proceed!
                  </Text>
                ) : null}

                <View style={{ flexDirection: "row", marginTop: 50 }}>
                  <TouchableOpacity
                    style={[
                      commonStyles.modalButton,
                      { backgroundColor: "#00BCD4" },
                    ]}
                    onPress={() => {
                      setImage(item.imageURL);
                      setEditPostContent(item.content);
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <Text style={commonStyles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  {!uploading ? (
                    <TouchableOpacity
                      style={[
                        commonStyles.modalButton,
                        { backgroundColor: "#F3B000" },
                      ]}
                      onPress={() => {
                        onSubmit();
                      }}
                    >
                      <Text style={commonStyles.modalButtonText}>Save</Text>
                    </TouchableOpacity>
                  ) : (
                    <ActivityIndicator size="large" color="#000" />
                  )}

                  {/* <TouchableOpacity
                    style={[
                      commonStyles.modalButton,
                      { backgroundColor: "#F3B000" },
                    ]}
                    onPress={() => {
                      onSubmit();
                      // updatePost(item.id, item.username, editPostContent);
                      // setModalVisible(!modalVisible);
                    }}
                  >
                    <Text style={commonStyles.modalButtonText}>Save</Text>
                  </TouchableOpacity> */}
                </View>

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={deleteImageVisible}
                  onRequestClose={() => {
                    setDeleteImageVisible(!deleteImageVisible);
                  }}
                >
                  <View style={commonStyles.modalFirstView}>
                    <View style={commonStyles.modalSecondView}>
                      <Text style={commonStyles.deleteWarningTitle}>
                        Delete image?
                      </Text>
                      <View
                        style={{ flexDirection: "row", marginVertical: 10 }}
                      >
                        <TouchableOpacity
                          style={[
                            commonStyles.modalButton,
                            { backgroundColor: "#00BCD4" },
                          ]}
                          onPress={() => {
                            setDeleteImageVisible(!deleteImageVisible);
                          }}
                        >
                          <Text style={commonStyles.modalButtonText}>
                            Cancel
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            commonStyles.modalButton,
                            { backgroundColor: "#F02A4B" },
                          ]}
                          onPress={() => {
                            setImage("");
                            fbdata.storage().refFromURL(item.imageRef).delete();
                            setDeleteImageVisible(!deleteImageVisible);
                          }}
                        >
                          <Text style={commonStyles.modalButtonText}>
                            Delete
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  formErrorMsg: {
    color: "red",
    fontSize: 20,
    marginTop: 40,
    marginLeft: 10,
  },

  postImage: {
    alignItems: "center",
    width: "95%",
    // height: 200,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
});
