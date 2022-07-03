import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Image,
  Platform,
  TouchableOpacity,
  Modal,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
// import from the build
import fbdata from "../../firebase";
import commonStyles from "../../commonStyles.js";
import useCurrentDate, {
  useAccountUsername,
  useAccountUserid,
  increasePostCount,
} from "../components/CommonFunctions.js";

// upload post information to firebase realtime database in two collections
// file path: posts/category/uniquekey
// file path: postsbyacc/username/uniquekey
// update postcount in user collection by 1
function storePost(
  category,
  title,
  content,
  imageURL,
  username,
  date,
  imageRef,
  currentUserID,
  navigation
) {
  var newPostKey = fbdata
    .database()
    .ref("/posts/" + category + "/")
    .push().key;
  var dataToSave = {
    id: newPostKey,
    category: category,
    title: title,
    content: content,
    imageURL: imageURL,
    imageRef: imageRef,
    username: username,
    creationDate: date,
    timestamp: {
      ".sv": "timestamp",
    },
    negTimestamp: 0,
  };
  var updates = {};
  updates["/posts/" + category + "/" + newPostKey] = dataToSave;
  updates["/postsbyacc/" + username + "/" + newPostKey] = dataToSave;

  return fbdata
    .database()
    .ref()
    .update(updates, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Post data successfuly uploaded.");
        updateNegTimestampPosts(category, newPostKey, navigation);
        updateNegTimestampPostsAcc(username, newPostKey);
        increasePostCount(currentUserID);
      }
    });
}

// update the negTimestamp in the posts collection on firebase
// file path: posts/category/uniquekey
function updateNegTimestampPosts(category, key, navigation) {
  const timeRef = fbdata
    .database()
    .ref("/posts/" + category + "/" + key + "/timestamp/");
  const negTimeRef = fbdata
    .database()
    .ref("/posts/" + category + "/" + key + "/");
  timeRef.once("value", (snapshot) => {
    var negTimestampValue = snapshot.val() * -1;
    console.log(negTimestampValue);
    negTimeRef.update({ negTimestamp: negTimestampValue });
  });

  alert("Successfully posted!");
  navigation.navigate("Post", { screen: "GPostList" });
}

// update the negTimestamp in the user posts collection on firebase
// file path: postsbyacc/username/uniquekey
function updateNegTimestampPostsAcc(username, key) {
  const timeRef = fbdata
    .database()
    .ref("/postsbyacc/" + username + "/" + key + "/timestamp/");
  const negTimeRef = fbdata
    .database()
    .ref("/postsbyacc/" + username + "/" + key + "/");
  timeRef.once("value", (snapshot) => {
    var negTimestampValue = snapshot.val() * -1;
    console.log(negTimestampValue);
    negTimeRef.update({ negTimestamp: negTimestampValue });
  });
}

// Create post screen
export default function CreatePost({ navigation }) {
  // create currentDate, username and currentUserID from commonFunctions
  const currentDate = useCurrentDate();
  const username = useAccountUsername();
  const currentUserID = useAccountUserid();

  // useState variables: hold uer interest selected category
  const [categoryList, setCategoryList] = useState([]);

  // useState variable: image, store image picked up by expo image picker
  const [image, setImage] = useState("");
  // useState variable: uploading, set true when image file start to upload, and set false after uploading finish
  const [uploading, setUploading] = useState(false);

  // useState variables: hold user inputs
  const [categoryValue, setCategoryValue] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // useState variable: toggle modal overlay
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // useState variables: error status
  const [categoryErrorStatus, setCategoryErrorStatus] = useState(false);
  const [titleErrorStatus, setTitleErrorStatus] = useState(false);
  const [contentErrorStatus, setContentErrorStatus] = useState(false);
  const [photoErrorStatus, setPhotoErrorStatus] = useState(false);

  // request media library permission from the phone
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
    __isTheUserAuthenticated();
  }, []);

  // read user interest category
  function __isTheUserAuthenticated() {
    const userId = fbdata.auth().currentUser.uid;
    if (userId !== null) {
      fbdata
        .database()
        .ref("/users/" + userId + "/interest/")
        .once("value", (snapshot) => {
          setCategoryList([]);
          snapshot.forEach((childSnapshot) => {
            if (childSnapshot.val().check) {
              setCategoryList((categoryList) => [
                ...categoryList,
                childSnapshot.val(),
              ]);
            }
          });
        });
    }
  }

  // pick up image from camera roll, assign image path to useState variable "image"
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  // upload image to firebase storage
  // call storePost function
  const makePost = async () => {
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
          storePost(
            categoryValue,
            title,
            content,
            url,
            username,
            currentDate,
            ref.toString(),
            currentUserID,
            navigation
          );
          return url;
        });
      }
    );
  };

  // handle click on post button
  // if any one of category, title, content and image is empty, set the corresponding error status (true), and show error message to users
  const onSubmit = () => {
    if (
      categoryValue === null ||
      title === "" ||
      content === "" ||
      image === ""
    ) {
      if (categoryValue === null) {
        setCategoryErrorStatus(true);
      }
      if (title === "") {
        setTitleErrorStatus(true);
      }
      if (content === "") {
        setContentErrorStatus(true);
      }
      if (image === "") {
        setPhotoErrorStatus(true);
      }
    } else {
      makePost();
    }
  };

  // render view
  return (
    <SafeAreaView style={commonStyles.pageContainer}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        style={{
          width: "100%",
          paddingBottom: 160,
        }}
      >
        {/* header of create post screen, including curernt date and username */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 20,
            width: "100%",
            height: "7%",
            marginTop: 10,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ paddingLeft: 20 }}>
            <Text style={styles.textStyle}>{currentDate}</Text>
          </View>
          <View style={{ paddingRight: 20 }}>
            <Text style={styles.textStyle}>{username}</Text>
          </View>
        </View>
        <View
          style={{
            width: "95%",
            justifyContent: "center",
            alignSelf: "center",
            marginBottom: 40,
            marginLeft: 20,
            marginRight: 20,
            padding: 15,
            backgroundColor: "#DBF0FF",
            borderRadius: 20,
          }}
        >
          {/* post category section */}
          <View style={{ width: "100%", marginBottom: 25 }}>
            <Text style={styles.header}>Category</Text>
            {/* picker to select category, assign value to categoryValue onValueChange */}
            <View style={{ width: "100%", alignItems: "center" }}>
              <View style={styles.dropDown}>
                <RNPickerSelect
                  onValueChange={(value) => {
                    setCategoryValue(value);
                    console.log(value);
                    setCategoryErrorStatus(false);
                  }}
                  items={categoryList}
                />
              </View>
            </View>
            {/* Error message */}
            <View>
              {categoryErrorStatus === true ? (
                <Text style={styles.formErrorMsg}>
                  Please enter your title to post!
                </Text>
              ) : null}
            </View>
          </View>

          {/* title section */}
          <View
            style={{
              width: "100%",
              marginBottom: 25,
            }}
          >
            <Text style={[styles.header]}>*Title</Text>
            <TextInput
              style={[styles.input, { paddingTop: 0 }]}
              numberOfLines={1}
              onChangeText={(text) => {
                setTitle(text);
                setTitleErrorStatus(false);
              }}
              value={title}
              placeholder="Enter title here..."
            />
            {/* error message */}
            {titleErrorStatus === true ? (
              <Text style={styles.formErrorMsg}>
                Please enter your title to post!
              </Text>
            ) : null}
          </View>

          {/* content section */}
          <View style={{ width: "100%", marginBottom: 25 }}>
            <Text style={styles.header}>*Content</Text>
            <TextInput
              style={[
                styles.input,
                { height: 150, borderRadius: 20, textAlignVertical: "top" },
              ]}
              multiline={true}
              editable={true}
              autofocus={true}
              onChangeText={(text) => {
                setContent(text);
                setContentErrorStatus(false);
              }}
              value={content}
              placeholder="Enter Content here..."
            />
            {/* content error message */}
            {contentErrorStatus === true ? (
              <Text style={styles.formErrorMsg}>
                Please enter your content to post!
              </Text>
            ) : null}
          </View>

          {/* photo section */}
          <View style={{ width: "100%" }}>
            <Text style={[styles.header, { paddingBottom: 10 }]}>Photo*</Text>
            <View style={{ alignItems: "center" }}>
              {image === "" ? (
                <TouchableOpacity
                  style={{ alignSelf: "center" }}
                  onPress={() => {
                    pickImage();
                    setPhotoErrorStatus(false);
                  }}
                >
                  <FontAwesome5 name="plus" size={40} color="grey" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.postImage}
                  onPress={() => {
                    setDeleteModalVisible(true);
                  }}
                >
                  <Image
                    source={{ uri: image }}
                    style={{ width: "100%", height: 200, borderRadius: 20 }}
                  />
                </TouchableOpacity>
              )}
            </View>
            {/* photo error message */}
            {photoErrorStatus === true ? (
              <Text style={styles.formErrorMsg}>
                Please enter your answer to post!
              </Text>
            ) : null}
          </View>
        </View>

        {/* submission section */}
        <View style={styles.submitSection}>
          {/* warning message */}
          <View style={styles.warningTextCon}>
            <Text style={{ color: "red", fontWeight: "bold" }}>
              *This answer will be made public once you "Post" it!
            </Text>
            <Text
              style={{ color: "#00BCD4", fontWeight: "bold", marginTop: 5 }}
            >
              *Post grateful stories, appreciate the beauaty of life!
            </Text>
          </View>
          {/* post button, show activity indicator if uploading is true */}
          {!uploading ? (
            <TouchableOpacity
              style={styles.postbutton}
              onPress={() => {
                onSubmit();
                // makePost();
              }}
            >
              <Text style={styles.postbuttontext}>Post</Text>
            </TouchableOpacity>
          ) : (
            <ActivityIndicator size="large" color="#000" />
          )}
        </View>

        {/* modal overlay, delete selected photo */}
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
              <Text style={commonStyles.deleteWarningTitle}>Delete image?</Text>
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
                    setImage("");
                    // setPhotoErrorStatus(false);
                    setDeleteModalVisible(!deleteModalVisible);
                  }}
                >
                  <Text style={commonStyles.modalButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

// Style Sheet
const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around",
    alignItems: "center",
  },
  header: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 10,
  },

  dropDown: {
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginTop: 10,
    width: "98%",
    height: 30,
    paddingLeft: 15,
  },

  input: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    height: 30,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 10,
    width: "98%",
    alignSelf: "center",
  },
  textStyle: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  postImage: {
    alignItems: "center",
    width: "95%",
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
  },

  submitSection: {
    flexDirection: "row",
    top: 20,
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
    marginLeft: 5,
  },
});
