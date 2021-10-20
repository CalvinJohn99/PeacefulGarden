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
  getDateFormatOne,
} from "../components/CommonFunctions.js";
import * as ImagePicker from "expo-image-picker";
import fbdata from "../../firebase";
import commonStyles from "../../commonStyles.js";
import { FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

// if (fbdata.apps.length === 0) {
//   fbdata.initializeApp(firebaseConfig);
// }

function storeJournal(
  username,
  currentDate,
  journalDate,
  journalContent,
  imageURL,
  imageRef
) {
  var newJournalKey = fbdata
    .database()
    .ref("/Journal/" + username + "/" + journalDate + "/")
    .push().key;
  var dataToSave = {
    id: newJournalKey,
    username: username,
    creationDate: currentDate,
    journalDate: journalDate,
    journalContent: journalContent,
    imageURL: imageURL,
    imageRef: imageRef,
    timestamp: {
      ".sv": "timestamp",
    },
    negTimestamp: 0,
  };
  var updates = {};
  updates["/Journal/" + username + "/" + journalDate + "/" + newJournalKey] =
    dataToSave;

  return fbdata
    .database()
    .ref()
    .update(updates, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Journal data successfuly uploaded.");
        updateNegTimestampJournal(username, journalDate, newJournalKey);
      }
    });
}

function updateNegTimestampJournal(username, journalDate, key) {
  const timeRef = fbdata
    .database()
    .ref(
      "/Journal/" + username + "/" + journalDate + "/" + key + "/timestamp/"
    );
  const negTimeRef = fbdata
    .database()
    .ref("/Journal/" + username + "/" + journalDate + "/" + key + "/");
  timeRef.once("value", (snapshot) => {
    var negTimestampValue = snapshot.val() * -1;
    console.log(negTimestampValue);
    negTimeRef.update({ negTimestamp: negTimestampValue });
  });
}

export default function CreateJournal({ navigation }) {
  const currentDate = useCurrentDate();
  const username = useAccountUsername();
  const [date, setDate] = useState(new Date());
  const [journalDate, setJournalDate] = useState(getDateFormatOne(new Date()));
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);
  const [journalContent, setJournalContent] = useState("");

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

  const onChange = (event, selectedDate) => {
    const currentJournalDate = selectedDate || date;
    setDate(currentJournalDate);
    const formatedJournalDate = getDateFormatOne(currentJournalDate);
    setJournalDate(formatedJournalDate);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImages((images) => [...images, result.uri]);
    }
  };

  // console.log("image array: ", images);

  const createJournal = () => {
    var numberOfImages = images.length;
    let i = 0;
    let imageURLs = [];
    let imageRefs = [];
    images.map(async (image) => {
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
        .ref("journal/" + username + "/" + journalDate)
        .child(new Date().toISOString());
      const uploadTask = ref.put(blob);

      uploadTask.on(
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
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            i++;
            imageURLs.push(url);
            imageRefs.push(ref.toString());
            blob.close();
            setUploading(false);
            if (i === numberOfImages) {
              console.log("number of images uploaded: ", i);
              // console.log("imageURLSet: ", imageURLSet);
              storeJournal(
                username,
                currentDate,
                journalDate,
                journalContent,
                imageURLs,
                imageRefs
              );
            }
          });
        }
      );
    });
  };

  // console.log("images: ", images);
  // console.log("imageURLs: ", imageURLs);

  // const AddImage = () => {
  //   for (let i = 0; i < 9; i++) {
  //     render(
  //       <View>
  //         <Text>Test</Text>
  //       </View>
  //     );
  //   }
  // };

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
            <Text style={styles.header}>Select Date</Text>
            <View
              style={{
                alignSelf: "center",
                width: "90%",
                alignItems: "center",
                backgroundColor: "white",
                marginTop: 10,
                paddingVertical: 5,
                paddingHorizontal: 20,
                borderRadius: 10,
              }}
            >
              <DateTimePicker
                testID="dateTimerPicker"
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
                style={{
                  width: 125,
                }}
              />
            </View>
          </View>

          <View style={{ width: "100%", marginBottom: 25 }}>
            <Text style={[styles.header]}>Journal</Text>
            <TextInput
              style={[
                styles.input,
                { height: 150, borderRadius: 20, textAlignVertical: "top" },
              ]}
              multiline={true}
              editable={true}
              autofocus={true}
              onChangeText={(text) => setJournalContent(text)}
              value={journalContent}
              placeholder="Start to write your journal here..."
            />
          </View>
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text
              style={[styles.header, { alignSelf: "left", paddingBottom: 10 }]}
            >
              Photo
            </Text>

            <View
              style={{
                width: "95%",
                flexDirection: "row",
                flexWrap: "wrap",
                // borderColor: "red",
                // borderWidth: 2,
              }}
            >
              {images.map((image) => {
                return (
                  <View
                    style={{
                      width: "30%",
                      height: 100,
                      // borderWidth: 2,
                      // borderColor: "blue",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "white",
                      margin: 5,
                    }}
                  >
                    <Image
                      source={{ uri: image }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </View>
                );
              })}

              {images.length < 9 ? (
                <View
                  style={{
                    width: "30%",
                    height: 100,
                    // borderWidth: 2,
                    // borderColor: "blue",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "white",
                    margin: 5,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      pickImage();
                    }}
                  >
                    <FontAwesome5 name="plus" size={40} color="grey" />
                  </TouchableOpacity>
                </View>
              ) : null}

              {/* <View
                style={{
                  width: "45%",
                  height: 100,
                  borderWidth: 2,
                  borderColor: "blue",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  margin: 10,
                }}
              >  */}

              {/* {images.length === 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      pickImage();
                    }}
                  >
                    <FontAwesome5 name="plus" size={40} color="grey" />
                  </TouchableOpacity>
                ) : (
                  <Image
                    source={{ uri: images[0] }}
                    style={{ width: "100%", height: "100%" }}
                  />
                )}
              </View>

              {images.length < 2 ? (
                <TouchableOpacity
                  onPress={() => {
                    pickImage();
                  }}
                >
                  <FontAwesome5 name="plus" size={40} color="grey" />
                </TouchableOpacity>
              ) : (
                <Image source={{ uri: images[1] }} style={styles.postImage} />
              )} */}
            </View>

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
                createJournal();
                // uploadJournal(
                //   username,
                //   journalDate,
                //   journalContent,
                //   imageURLs,
                //   currentDate
                // );
                // navigation.navigate("Journal", {
                //   screen: "History",
                // });
              }}
            >
              <Text style={styles.postbuttontext}>Save</Text>
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
