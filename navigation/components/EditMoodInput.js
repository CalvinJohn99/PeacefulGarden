import * as React from "react";
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from "react-native";
import useCurrentDate, {
  getCurrentDateString,
} from "../components/CommonFunctions.js";
import { FontAwesome5 } from "@expo/vector-icons";
import fbdata from "../../firebase.js";
import commonStyles, {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} from "../../commonStyles.js";

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

export default function EditMoodInput(props) {
  const moodItem = props.item;
  const currentUsername = props.currentUsername;
  const day = props.day;
  const [selectedIcon, setSelectedIcon] = useState(
    moodItem.moodFontAwesome5Icon
  );
  const [selectedID, setSelectedID] = useState(moodItem.moodID);
  const [moodComment, setMoodComment] = useState(moodItem.comment);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [focusedText, setFocusedText] = useState(false);
  const [moodColor, setMoodColor] = useState(moodItem.color);
  const [moodFontAwesome5Icon, setMoodFontAwesome5Icon] = useState([]);

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

  const getBorderColorText = () => {
    if (focusedText) {
      return "#00BCD4";
    }
    return "white";
  };

  const renderItem = ({ item }) => {
    const iconBackgroundColor = selectedID === item.id ? item.color : "white";
    const iconfilledColor = selectedID === item.id ? "white" : item.color;
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          marginVertical: 2.5,
          // paddingHorizontal: 5,
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
          // borderWidth: 2,
          // borderColor: "grey",
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
        onLongPress={() => {
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
            // borderWidth: 2,
            // borderColor: "red",
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
                // height: SCREEN_HEIGHT * 0.1,
                backgroundColor: "white",
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                // borderWidth: 2,
                // borderColor: "red",
              }}
            >
              <FlatList
                data={moodFontAwesome5Icon}
                numColumns={5}
                style={{
                  width: "98%",
                  // paddingVertical: 10,
                  // backgroundColor: "blue",
                  // alignSelf: "center",
                  // width: SCREEN_WIDTH * 0.73,
                  // marginTop: SCREEN_HEIGHT * 0.004,
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
                //returnKeyType="done"
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
