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
  currentUserID
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
        updateNegTimestampPosts(category, newPostKey);
        updateNegTimestampPostsAcc(username, newPostKey);
        increasePostCount(currentUserID);
      }
    });
}

function updateNegTimestampPosts(category, key) {
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

  console.log(categoryValue);

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

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
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
          console.log("download url", url);
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
              currentUserID
            );
            alert("Successfully posted!");
            navigation.navigate("Post", { screen: "GPostList" });
          }
          return url;
        });
      }
    );
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
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={[styles.header, { alignSelf: "left" }]}>Title</Text>
            <TextInput
              style={[styles.input, { paddingTop: 0 }]}
              numberOfLines={1}
              onChangeText={(text) => setTitle(text)}
              value={title}
              placeholder="Enter title here..."
            />
          </View>
          <View style={{ width: "100%", marginBottom: 25 }}>
            <Text style={[styles.header, { alignSelf: "left" }]}>Content</Text>
            <TextInput
              style={[
                styles.input,
                { height: 150, borderRadius: 20, textAlignVertical: "top" },
              ]}
              multiline={true}
              editable={true}
              autofocus={true}
              onChangeText={(text) => setContent(text)}
              value={content}
              placeholder="Enter Content here..."
            />
          </View>
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text
              style={[styles.header, { alignSelf: "left", paddingBottom: 10 }]}
            >
              Photo
            </Text>
            {image === "" ? (
              <TouchableOpacity
                onPress={() => {
                  pickImage();
                }}
              >
                <FontAwesome5 name="plus" size={40} color="grey" />
              </TouchableOpacity>
            ) : (
              <Image source={{ uri: image }} style={styles.postImage} />
            )}
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
                makePost();
              }}
            >
              <Text style={styles.postbuttontext}>Post</Text>
            </TouchableOpacity>
          ) : (
            <ActivityIndicator size="large" color="#000" />
          )}
        </View>

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
    width: "95%",
    height: 200,
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
    marginLeft: -70,
  },
});
