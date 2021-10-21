import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  FlatList,
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
  TouchableOpacity,
  Modal,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import useCurrentDate, {
  useAccountUsername,
  useAccountUserid,
  useCategoryList,
  increasePostCount,
} from "../components/CommonFunctions.js";
import * as ImagePicker from "expo-image-picker";
import fbdata from "../../firebase";
import commonStyles from "../../commonStyles.js";
import { FontAwesome5 } from "@expo/vector-icons";

// if (fbdata.apps.length === 0) {
//   fbdata.initializeApp(firebaseConfig);
// }

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

export default function GPostScreen({ navigation }) {
  const categoryList = useCategoryList();
  const currentDate = useCurrentDate();
  const username = useAccountUsername();
  const currentUserID = useAccountUserid();

  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);

  const [categoryValue, setCategoryValue] = useState("Others");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [titleErrorStatus, setTitleErrorStatus] = useState(false);
  const [contentErrorStatus, setContentErrorStatus] = useState(false);
  const [photoErrorStatus, setPhotoErrorStatus] = useState(false);

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
      setPhotoErrorStatus(false);
    }
  };

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
          if (title === "" || content === "" || image === "") {
            setErrorStatus(true);
          } else {
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
            // alert("Successfully posted!");
            // navigation.navigate("Post", { screen: "GPostList" });
          }
          return url;
        });
      }
    );
  };

  const onSubmit = () => {
    if (title === "" || content === "" || image === "") {
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

  return (
    <SafeAreaView style={commonStyles.pageContainer}>
      <ScrollView
        contentContainerStyle={{
          // justifyContent: "center",
          // alignItem: "center",
          paddingBottom: 100,
        }}
        style={{
          width: "100%",
          paddingBottom: 160,
        }}
      >
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
          <View style={{ width: "100%", marginBottom: 25 }}>
            <Text style={styles.header}>Category</Text>
            <View style={{ width: "100%", alignItems: "center" }}>
              <View style={styles.dropDown}>
                <RNPickerSelect
                  // onValueChange={(value) => console.log(value)}
                  onValueChange={(value) => {
                    setCategoryValue(value);
                    console.log(value);
                  }}
                  items={categoryList}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              marginBottom: 25,
              // alignItems: "center",
              // justifyContent: "center",
            }}
          >
            <Text style={[styles.header]}>Title</Text>
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
            {titleErrorStatus === true ? (
              <Text style={styles.formErrorMsg}>
                Please enter your title to post!
              </Text>
            ) : null}
          </View>
          <View style={{ width: "100%", marginBottom: 25 }}>
            <Text style={styles.header}>Content</Text>
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
            {contentErrorStatus === true ? (
              <Text style={styles.formErrorMsg}>
                Please enter your content to post!
              </Text>
            ) : null}
          </View>
          <View style={{ width: "100%" }}>
            <Text style={[styles.header, { paddingBottom: 10 }]}>Photo</Text>
            <View style={{ alignItems: "center" }}>
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
            {photoErrorStatus === true ? (
              <Text style={styles.formErrorMsg}>
                Please enter your answer to post!
              </Text>
            ) : null}
            {/* <Image source={{ uri: image }} style={styles.postImage} /> */}
            {/* <Button title="choose picture" onPress={pickImage} /> */}
          </View>
        </View>
        <View style={styles.submitSection}>
          <View style={styles.warningTextCon}>
            <Text style={{ color: "red", fontWeight: "bold" }}>
              *This answer will be made public once you "Post" it!
            </Text>
          </View>
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
              {/* <Text style={commonStyles.deleteWarningText}>
                * Once delete, it is unrecoverable!
              </Text> */}
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
                    setDeleteModalVisible(!deleteModalVisible);
                  }}
                >
                  <Text style={commonStyles.modalButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* <View
          style={{
            marginBottom: 25,
            width: "95%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            // height: 200,
          }}
        >
          <Text style={{ color: "red", width: 200 }}>
            *This post will be made public once you "post" it!
          </Text>
          {!uploading ? (
            <Button title="Post" onPress={makePost} />
          ) : (
            <ActivityIndicator size="large" color="#000" />
          )}
        </View> */}
        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex:1,
    justifyContent: "space-around",
    alignItems: "center",
    /*        backgroundColor: "#fff",
        padding: 20,
        margin: 10,*/
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
    // height: 200,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  // marginTop: 10,

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
