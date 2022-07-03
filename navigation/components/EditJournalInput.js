import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import fbdata from "../../firebase.js";
import commonStyles, {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} from "../../commonStyles.js";

// update journal content in firebase realtime database
function updateJournalInformation(
  username,
  journalDate,
  journalID,
  journalContent,
  imageURL,
  imageRef
) {
  fbdata
    .database()
    .ref("/Journal/" + username + "/" + journalDate + "/" + journalID + "/")
    .update({
      journalContent: journalContent,
      imageURL: imageURL,
      imageRef: imageRef,
    });
}

// delete journal on firebase realtime database
function deleteJournal(username, journalDate, journalID) {
  const journalRef = fbdata
    .database()
    .ref("/Journal/" + username + "/" + journalDate + "/" + journalID + "/");

  journalRef.get().then((snapshot) => {
    if (snapshot.exists()) {
      journalRef.remove();
    }
  });
}

// component to show and edit journal item
// called by ViewMoodJournal screen
// oepn modal overlay to edit and delete journal
// allow edit of journal images
export default function EditJournalInput(props) {
  // receive variables from ViewMoodJournal screen
  const journalItem = props.item;
  const username = props.currentUsername;
  const day = props.day;

  // array of imageURL, will be updated if image editted
  var imageURL = journalItem.imageURL;
  // array of image firebase storage reference, will be updated if image editted
  var imageRef = journalItem.imageRef;
  // hold new picked images
  const [newImages, setNewImages] = useState([]);
  // hold editted journal content, initialised as the original journal content
  const [journalContent, setJournalContent] = useState(
    journalItem.journalContent
  );
  // modal overlay visibility status
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  // text input focus status
  const [focusedText, setFocusedText] = useState(false);
  // hold index of original photo which is deleted
  const [oldIndex, setOldIndex] = useState(null);
  // hold modal overlay visibility status
  const [deleteOldImageModalVisible, setDeleteOldImageModalVisible] =
    useState(false);
  const [deleteNewImageModalVisible, setDeleteNewImageModalVisible] =
    useState(false);
  // hold removed newly picked image
  const [removeNew, setRemoveNew] = useState(false);
  // image uploading status
  const [uploading, setUploading] = useState(false);

  // const [imageChange, setImageChange] = useState(false);
  // hold error status
  const [imageErrorStatus, setImageErrorStatus] = useState(false);
  const [contentErrorStatus, setContentErrorStatus] = useState(false);

  // request media library permission async
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

  // remove newly picked up image from newImages
  const onRemoveNewImages = (item) => {
    setNewImages(newImages.filter((it) => it !== item));
  };

  // remove original image from imageURL and imageRef, and remove image on firebase storage
  const onRemoveOldImages = (index) => {
    // setOldRef(imageRef[index]);
    fbdata.storage().refFromURL(imageRef[index]).delete();
    imageURL.splice(index, 1);
    imageRef.splice(index, 1);
  };

  // handle pick up image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setNewImages((newImages) => [...newImages, result.uri]);
    }
  };

  // handle new image uploading
  // call updateJournalInformation function
  const updateJournal = () => {
    var numberOfNewImages = newImages.length;
    let i = 0;
    newImages.map(async (image) => {
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
        .ref("journal/" + username + "/" + journalItem.journalDate)
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
            imageURL.push(url);
            imageRef.push(ref.toString());
            blob.close();

            if (i === numberOfNewImages) {
              setUploading(false);
              console.log("number of new images uploaded: ", i);
              console.log("update image url: ", imageURL);
              updateJournalInformation(
                username,
                journalItem.journalDate,
                journalItem.id,
                journalContent,
                imageURL,
                imageRef
              );
              setModalVisible(!modalVisible);
            }
          });
        }
      );
    });
  };

  // return text input border based on variable focusedText
  const getBorderColorText = () => {
    if (focusedText) {
      return "#00BCD4";
    }
    return "white";
  };

  // handle onSubmit when "save is clicked"
  // set error status true if any field is empty
  const onSubmit = () => {
    if (
      journalContent === "" ||
      (imageURL.length === 0 && newImages.length === 0)
    ) {
      if (journalContent === "") {
        setContentErrorStatus(true);
      }
      if (imageURL.length === 0 && newImages.length === 0) {
        setImageErrorStatus(true);
      }
    } else {
      if (newImages.length !== 0) {
        updateJournal();
      } else {
        updateJournalInformation(
          username,
          journalItem.journalDate,
          journalItem.id,
          journalContent,
          imageURL,
          imageRef
        );
        setModalVisible(!modalVisible);
      }
    }
  };

  // render view
  return (
    <View>
      <TouchableOpacity
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          // alignItems: "center",
          shadowColor: "grey",
          shadowOffset: {
            width: 5,
            height: 5,
          },
          shadowOpacity: 0.36,
          shadowRadius: 10,
          elevation: 9,
          marginVertical: 12,
        }}
        onPress={() => {
          setModalVisible(true);
        }}
        activeOpacity={0.6}
      >
        <Text
          style={{ marginVertical: 20, fontSize: 16, paddingHorizontal: 20 }}
        >
          {journalItem.journalContent}
        </Text>
        <View
          style={{
            width: "100%",
            marginTop: 10,
            marginBottom: 50,
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {journalItem.imageURL.map((image, index) => {
            if (journalItem.imageURL.length === 0) {
              return null;
            } else if (journalItem.imageURL.length === 1) {
              return (
                <View
                  style={{
                    width: "90%",
                    height: 200,
                  }}
                >
                  <Image
                    source={{ uri: image }}
                    style={{ width: "100%", height: "100%" }}
                  ></Image>
                </View>
              );
            } else if (journalItem.imageURL.length === 2) {
              return (
                <View
                  style={{
                    width: "45%",
                    height: 150,
                    alignItems: "center",
                    justifyContent: "center",
                    margin: 5,
                  }}
                >
                  <Image
                    source={{ uri: image }}
                    style={{ width: "100%", height: "100%" }}
                  ></Image>
                </View>
              );
            }
            return null;
          })}
        </View>

        <View
          style={{
            width: "100%",
            marginTop: 10,
            marginBottom: 50,
            flexDirection: "row",
            flexWrap: "wrap",
            paddingLeft: 8,
          }}
        >
          {journalItem.imageURL.map((image, index) => {
            if (journalItem.imageURL.length < 3) {
              return null;
            }
            return (
              <View
                style={{
                  width: "30%",
                  height: 100,
                  // borderWidth: 2,
                  // borderColor: "blue",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: 5,
                }}
              >
                <Image
                  source={{ uri: image }}
                  style={{ width: "100%", height: "100%" }}
                ></Image>
              </View>
            );
          })}
        </View>
      </TouchableOpacity>

      {/* edit modal overlay */}
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
            <View
              style={[
                commonStyles.modalSecondView,
                {
                  backgroundColor: "rgba(0,188,212,0.2)",
                  // height: SCREEN_HEIGHT * 0.8,
                  width: SCREEN_WIDTH * 0.9,
                  marginTop: 50,
                },
              ]}
            >
              <TouchableOpacity
                style={{ position: "absolute", top: 10, right: 20 }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setJournalContent(journalItem.journalContent);
                  imageURL = journalItem.imageURL;
                  imageRef = journalItem.imageRef;
                  setNewImages([]);
                  setFocusedText(false);
                  // setImageChange(false);
                }}
              >
                <FontAwesome5 name="times" size={40} color="black" />
              </TouchableOpacity>

              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Edit Journal
              </Text>

              <View style={commonStyles.modalInputBoxWrapper}>
                <TextInput
                  style={[
                    commonStyles.inputBox,
                    { borderColor: getBorderColorText() },
                  ]}
                  multiline={true}
                  editable={true}
                  autofocus={true}
                  onChangeText={(text) => setJournalContent(text)}
                  value={journalContent}
                  onFocus={() => {
                    setFocusedText(true);
                  }}
                />
                {contentErrorStatus === true ? (
                  <Text style={[styles.formErrorMsg]}>
                    Please enter journal content to proceed!
                  </Text>
                ) : null}
              </View>

              <View
                style={{
                  marginTop: 90,
                  width: "100%",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  // borderColor: "red",
                  // borderWidth: 2,
                }}
              >
                {imageURL.map((image, index) => {
                  return (
                    <TouchableOpacity
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
                      onPress={() => {
                        setOldIndex(index);
                        setDeleteOldImageModalVisible(true);
                      }}
                    >
                      <Image
                        source={{ uri: image }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </TouchableOpacity>
                  );
                })}

                {newImages.map((image, index) => {
                  return (
                    <TouchableOpacity
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
                      onPress={() => {
                        setRemoveNew(image);
                        setDeleteNewImageModalVisible(true);
                      }}
                    >
                      <Image
                        source={{ uri: image }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </TouchableOpacity>
                  );
                })}

                {newImages.length + imageURL.length < 9 ? (
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
              </View>

              {imageErrorStatus === true ? (
                <Text
                  style={[
                    styles.formErrorMsg,
                    { marginLeft: 0, marginTop: 10 },
                  ]}
                >
                  Please upload at least one photo!
                </Text>
              ) : null}

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 60,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!uploading ? (
                  <TouchableOpacity
                    style={[
                      commonStyles.modalButton,
                      { backgroundColor: "#F3B000", marginHorizontal: "5%" },
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

                <TouchableOpacity
                  style={[
                    commonStyles.modalButton,
                    { backgroundColor: "#F02A4B", marginHorizontal: "5%" },
                  ]}
                  onPress={() => {
                    setDeleteModalVisible(true);
                  }}
                >
                  <Text style={commonStyles.modalButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>

              {/* delete original image modal overlay */}
              <Modal
                animationType="fade"
                transparent={true}
                visible={deleteOldImageModalVisible}
                onRequestClose={() => {
                  setDeleteOldImageModalVisible(!deleteOldImageModalVisible);
                }}
              >
                <View style={commonStyles.modalFirstView}>
                  <View style={commonStyles.modalSecondView}>
                    <Text style={commonStyles.deleteWarningTitle}>
                      Delete image?
                    </Text>
                    <View style={{ flexDirection: "row", marginVertical: 10 }}>
                      <TouchableOpacity
                        style={[
                          commonStyles.modalButton,
                          { backgroundColor: "#00BCD4" },
                        ]}
                        onPress={() => {
                          setDeleteOldImageModalVisible(
                            !deleteOldImageModalVisible
                          );
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
                          onRemoveOldImages(oldIndex);
                          setDeleteOldImageModalVisible(
                            !deleteOldImageModalVisible
                          );
                        }}
                      >
                        <Text style={commonStyles.modalButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

              {/* delete newly picked up image modal overlay */}
              <Modal
                animationType="fade"
                transparent={true}
                visible={deleteNewImageModalVisible}
                onRequestClose={() => {
                  setDeleteNewImageModalVisible(!deleteNewImageModalVisible);
                }}
              >
                <View style={commonStyles.modalFirstView}>
                  <View style={commonStyles.modalSecondView}>
                    <Text style={commonStyles.deleteWarningTitle}>
                      Delete image?
                    </Text>
                    <View style={{ flexDirection: "row", marginVertical: 10 }}>
                      <TouchableOpacity
                        style={[
                          commonStyles.modalButton,
                          { backgroundColor: "#00BCD4" },
                        ]}
                        onPress={() => {
                          setDeleteNewImageModalVisible(
                            !deleteNewImageModalVisible
                          );
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
                          onRemoveNewImages(removeNew);
                          setDeleteNewImageModalVisible(
                            !deleteNewImageModalVisible
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
                animationType="fade"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => {
                  setDeleteModalVisible(!deleteModalVisible);
                }}
              >
                <View style={commonStyles.modalFirstView}>
                  <View style={commonStyles.modalSecondView}>
                    <Text style={commonStyles.deleteWarningTitle}>
                      Confirm delete?
                    </Text>
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
                          deleteJournal(
                            username,
                            journalItem.journalDate,
                            journalItem.id
                          );
                          setDeleteModalVisible(!deleteModalVisible);
                        }}
                      >
                        <Text style={commonStyles.modalButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
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
    // marginTop: 3,
  },
});
