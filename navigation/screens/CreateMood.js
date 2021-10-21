// @refresh state
import * as React from "react";
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import fbdata from "../../firebase.js";
import {
  useAccountUsername,
  getCurrentDateString,
} from "../components/CommonFunctions.js";
import commonStyles, {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} from "../../commonStyles.js";
import { FontAwesome5 } from "@expo/vector-icons";

function storeMComment(
  moodIconName,
  moodID,
  comment,
  currentDateString,
  currentUsername,
  moodColor
) {
  var newMoodCommentKey = fbdata
    .database()
    .ref("/Mood/" + currentUsername + "/" + currentDateString + "/")
    .push().key;
  var dataToSave = {
    id: newMoodCommentKey,
    moodFontAwesome5Icon: moodIconName,
    moodID: moodID,
    comment: comment,
    creationDate: currentDateString,
    color: moodColor,
    timestamp: {
      ".sv": "timestamp",
    },
    negTimestamp: 0,
  };
  var updates = {};
  updates[
    "/Mood/" +
      currentUsername +
      "/" +
      currentDateString +
      "/" +
      newMoodCommentKey
  ] = dataToSave;

  return fbdata
    .database()
    .ref()
    .update(updates, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("update is sucessful");
        updateNegTimestamp(
          currentDateString,
          currentUsername,
          newMoodCommentKey
        );
      }
    });
}

function updateNegTimestamp(
  currentDateString,
  currentUsername,
  newMoodCommentKey
) {
  const timeRef = fbdata
    .database()
    .ref(
      "/Mood/" +
        currentUsername +
        "/" +
        currentDateString +
        "/" +
        newMoodCommentKey +
        "/timestamp/"
    );
  const negTimeRef = fbdata
    .database()
    .ref(
      "/Mood/" +
        currentUsername +
        "/" +
        currentDateString +
        "/" +
        newMoodCommentKey
    );
  timeRef.once("value", (snapshot) => {
    var negTimestampValue = snapshot.val() * -1;
    negTimeRef.update({ negTimestamp: negTimestampValue });
  });
}

// function getMoodIconURL() {
//   const moodIconURLRef = fbdata.database().ref("/MoodIconURL/");
//   moodIconURLRef.get().then((snapshot) => {
//     return snapshot.val();
//   });
// }

export default function CreateMood({ navigation }) {
  const currentDateString = getCurrentDateString();
  const currentUsername = useAccountUsername();
  const [moodFontAwesome5Icon, setMoodFontAwesome5Icon] = useState([]);
  const [moodColor, setMoodColor] = useState([]);
  const [focusedText, setFocusedText] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedID, setSelectedID] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [commentErrorStatus, setCommentErrorStatus] = useState(false);
  const [moodErrorStatus, setMoodErrorStatus] = useState(false);

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
    const iconBackgroundColor = item.id === selectedID ? item.color : "white";
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
          setMoodErrorStatus(false);
        }}
      >
        <View
          style={{ borderRadius: 50, backgroundColor: iconBackgroundColor }}
        >
          <FontAwesome5
            name={item.FontAwesome5Name}
            size={SCREEN_WIDTH * 0.15}
            color={iconfilledColor}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const onSubmit = () => {
    if (selectedIcon === null || comment === "") {
      if (selectedIcon === null) {
        setMoodErrorStatus(true);
      }
      if (comment === "") {
        setCommentErrorStatus(true);
      }
    } else {
      storeMComment(
        selectedIcon,
        selectedID,
        comment,
        currentDateString,
        currentUsername,
        moodColor
      );
      alert("Successfully saved!");
      navigation.navigate("MoodJournal", {
        screen: "MoodJournalCalendar",
      });
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setFocusedText(false);
      }}
    >
      <SafeAreaView style={commonStyles.pageContainer}>
        <View>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 26,
              marginTop: 30,
              marginBottom: 20,
            }}
          >
            How do you feel today?
          </Text>
        </View>

        <View
          style={{
            marginTop: 20,
            height: SCREEN_HEIGHT * 0.08,
          }}
        >
          <FlatList
            // horizontal
            // pagingEnabled={true}
            // showsHorizontalScrollIndicator={false}
            // lagacyImplementation={false}
            // style={{ width: "100%" }}
            // showsVerticalScrollIndicator={false}
            data={moodFontAwesome5Icon}
            numColumns={5}
            style={{
              width: SCREEN_WIDTH * 0.9,
            }}
            columnWrapperStyle={{ flex: 1, justifyContent: "center" }}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          ></FlatList>
        </View>
        {moodErrorStatus === true ? (
          <Text style={[styles.formErrorMsg]}>
            Please select a mood to proceed!
          </Text>
        ) : null}

        <View
          style={[commonStyles.inputBoxWrapper, { height: "40%", top: 20 }]}
        >
          <TextInput
            style={[
              commonStyles.inputBox,
              { borderColor: getBorderColorText() },
            ]}
            multiline={true}
            editable={true}
            autofocus={true}
            placeholder="Please insert your comments here"
            onChangeText={(text) => {
              setComment(text);
              setCommentErrorStatus(false);
            }}
            value={comment}
            onFocus={() => {
              setFocusedText(true);
            }}
            //returnKeyType="done"
          />
          {commentErrorStatus === true ? (
            <Text style={styles.formErrorMsg}>
              Please insert your comment to proceed!
            </Text>
          ) : null}
        </View>
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={styles.postbutton}
            onPress={() => {
              onSubmit();
            }}
          >
            <Text style={styles.postbuttontext}>Save</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  // todayDate: {
  //   width: "100%",
  //   textAlign: "center",
  //   top: 20,
  //   fontWeight: "bold",
  //   fontSize: 26,
  //   borderWidth: 2,
  //   borderColor: "red",
  // },

  moodIcon: {
    width: 60,
    height: 60,
    //top: 30,
    left: 18,
    flexDirection: "row",
    justifyContent: "space-evenly",
    //marginVertical: SPACING,
    //marginBottom: SPACING + 32,
    marginRight: 20,
  },

  moodBorder: {
    borderWidth: 2,
    //height: 60,
    //top: 30,
    //left: 30,
    //flexDirection: 'row',
    //justifyContent: 'space-evenly',
    //marginVertical: SPACING,
    //marginBottom: SPACING + 32,
    //marginRight:30,
  },

  inputWrapper: {
    padding: 8,
    marginTop: 30,
    width: "90%",
    height: "40%",
    borderColor: "black",
    shadowColor: "grey",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.36,
    shadowRadius: 5,
    elevation: 11,
  },

  input: {
    padding: 10,
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "white",
  },

  submitSection: {
    flexDirection: "row",
    top: 70,
    height: 100,
  },

  warningTextCon: {
    alignItems: "center",
    justifyContent: "center",
    flex: 2,
    left: 10,
    padding: 15,
  },

  postbutton: {
    backgroundColor: "#F3B000",
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
    // marginLeft: 5,
    marginVertical: 10,
  },
});
