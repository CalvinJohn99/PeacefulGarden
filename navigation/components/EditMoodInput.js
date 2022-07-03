import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import fbdata from "../../firebase.js";
import commonStyles, {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} from "../../commonStyles.js";

// function handle deleteMood from firebase
function deleteMood(moodItem, currentUsername, dateString) {
  const moodRef = fbdata
    .database()
    .ref("/Mood/" + currentUsername + "/" + dateString + "/" + moodItem.id);

  moodRef.get().then((snapshot) => {
    if (snapshot.exists()) {
      moodRef.remove();
    }
  });
}

// function handle update mood content in firebase
function updateMood(
  selectedIcon,
  selectedID,
  moodColor,
  moodComment,
  currentUsername,
  dateString,
  moodCommentID
) {
  fbdata
    .database()
    .ref("/Mood/" + currentUsername + "/" + dateString + "/" + moodCommentID)
    .update({
      comment: moodComment,
      moodFontAwesome5Icon: selectedIcon,
      moodID: selectedID,
      color: moodColor,
    });
}

// component edit mood input called by ViewMoodJournal
// list down mood in descending order of creation time
// allow edit and delete of mood by click on mood, open edit modal overlay
export default function EditMoodInput(props) {
  // receive variables moodItem, currentUsername, day
  const moodItem = props.item;
  const currentUsername = props.currentUsername;
  const day = props.day;
  // hold selected mood, initilised to the selected in the moodItem data
  const [selectedIcon, setSelectedIcon] = useState(
    moodItem.moodFontAwesome5Icon
  );
  const [selectedID, setSelectedID] = useState(moodItem.moodID);
  // hole edited mood commnet, initilised to the original mood comment
  const [moodComment, setMoodComment] = useState(moodItem.comment);
  // hold modal visibility status
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  // hold text input focus status
  const [focusedText, setFocusedText] = useState(false);
  // hold edited mood colour, initilised to the original mood colour
  const [moodColor, setMoodColor] = useState(moodItem.color);
  // an array holding mood list from firebase
  const [moodFontAwesome5Icon, setMoodFontAwesome5Icon] = useState([]);

  // read mood list from firebase
  useEffect(() => {
    const moodRef = fbdata
      .database()
      .ref("/MoodFontAwesome5/")
      .orderByChild("id");
    const OnLoadingListener = moodRef.once("value", (snapshot) => {
      setMoodFontAwesome5Icon([]);
      snapshot.forEach((childSnapshot) => {
        setMoodFontAwesome5Icon((moodFontAwesome5Icon) => [
          ...moodFontAwesome5Icon,
          childSnapshot.val(),
        ]);
      });
    });
    return () => {
      moodRef.off();
    };
  }, []);

  // return text input border colour based on focus status
  const getBorderColorText = () => {
    if (focusedText) {
      return "#00BCD4";
    }
    return "white";
  };

  // render mood list
  // change mood border and background colour based on selectedID
  const renderItem = ({ item }) => {
    const iconBackgroundColor = selectedID === item.id ? item.color : "white";
    const iconfilledColor = selectedID === item.id ? "white" : item.color;
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          marginVertical: 2.5,
          borderRadius: 50,
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: SCREEN_WIDTH * 0.001,
          borderWidth: 3,
          borderColor: "white",
        }}
        onPress={() => {
          setSelectedID(item.id);
          setSelectedIcon(item.FontAwesome5Name);
          setMoodColor(item.color);
        }}
      >
        <View
          style={{ borderRadius: 50, backgroundColor: iconBackgroundColor }}
        >
          <FontAwesome5
            name={item.FontAwesome5Name}
            size={SCREEN_WIDTH * 0.1}
            color={iconfilledColor}
          />
        </View>
      </TouchableOpacity>
    );
  };

  // render view
  return (
    <View>
      <TouchableOpacity
        style={{
          width: "98%",
          marginVertical: 12,
          display: "flex",
          flexDirection: "row",
          alignSelf: "center",
          backgroundColor: "white",
          borderRadius: 20,
          shadowColor: "grey",
          shadowOffset: {
            width: 5,
            height: 5,
          },
          shadowOpacity: 0.36,
          shadowRadius: 10,
          elevation: 9,
        }}
        onPress={() => {
          setModalVisible(true);
        }}
        activeOpacity={0.6}
      >
        <FontAwesome5
          name={moodItem.moodFontAwesome5Icon}
          size={40}
          color={moodItem.color}
          style={{
            flex: 1,
            paddingLeft: 20,
            marginVertical: 10,
          }}
        />
        <Text
          style={{
            flex: 4,
            marginTop: 15,
            marginRight: 18,
            marginBottom: 10,
            fontSize: 16,
          }}
        >
          {moodItem.comment}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={commonStyles.modalFirstView}>
          <View
            style={[
              commonStyles.modalSecondView,
              { backgroundColor: "rgba(0,188,212,0.2)" },
            ]}
          >
            <TouchableOpacity
              style={{ position: "absolute", top: 10, right: 20 }}
              onPress={() => {
                setModalVisible(!modalVisible);
                setSelectedIcon(moodItem.moodFontAwesome5Icon);
                setSelectedID(moodItem.moodID);
                setMoodColor(moodItem.color);
                setMoodComment(moodItem.comment);
                setFocusedText(false);
              }}
            >
              <FontAwesome5 name="times" size={40} color="black" />
            </TouchableOpacity>

            <View
              style={{
                marginTop: 60,
                width: "100%",
                backgroundColor: "white",
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FlatList
                data={moodFontAwesome5Icon}
                numColumns={5}
                style={{
                  width: "98%",
                }}
                columnWrapperStyle={{ flex: 1, justifyContent: "center" }}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
              ></FlatList>
            </View>

            <View style={commonStyles.modalInputBoxWrapper}>
              <TextInput
                style={[
                  commonStyles.inputBox,
                  { borderColor: getBorderColorText() },
                ]}
                multiline={true}
                editable={true}
                autofocus={true}
                placeholder="Please insert your comments here"
                onChangeText={(text) => setMoodComment(text)}
                value={moodComment}
                onFocus={() => {
                  setFocusedText(true);
                }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 60,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={[
                  commonStyles.modalButton,
                  { backgroundColor: "#F3B000", marginHorizontal: "7%" },
                ]}
                onPress={() => {
                  updateMood(
                    selectedIcon,
                    selectedID,
                    moodColor,
                    moodComment,
                    currentUsername,
                    day.dateString,
                    moodItem.id
                  );
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={commonStyles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  commonStyles.modalButton,
                  { backgroundColor: "#F02A4B", marginHorizontal: "7%" },
                ]}
                onPress={() => {
                  setDeleteModalVisible(true);
                }}
              >
                <Text style={commonStyles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>

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
                        deleteMood(moodItem, currentUsername, day.dateString);
                      }}
                    >
                      <Text style={commonStyles.modalButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </Modal>
    </View>
  );
}
