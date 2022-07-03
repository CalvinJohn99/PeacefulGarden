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
  getDateFormatOne,
} from "../components/CommonFunctions.js";
import commonStyles, {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} from "../../commonStyles.js";
import { FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

// upload mood content to firebase realtime database
// file path: Mood/username/date/uniquekey
function storeMComment(
  moodIconName,
  moodID,
  comment,
  moodDate,
  currentUsername,
  moodColor
) {
  var newMoodCommentKey = fbdata
    .database()
    .ref("/Mood/" + currentUsername + "/" + moodDate + "/")
    .push().key;
  var dataToSave = {
    id: newMoodCommentKey,
    moodFontAwesome5Icon: moodIconName,
    moodID: moodID,
    comment: comment,
    creationDate: moodDate,
    color: moodColor,
    timestamp: {
      ".sv": "timestamp",
    },
    negTimestamp: 0,
  };
  var updates = {};
  updates[
    "/Mood/" + currentUsername + "/" + moodDate + "/" + newMoodCommentKey
  ] = dataToSave;

  return fbdata
    .database()
    .ref()
    .update(updates, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("update is sucessful");
        updateNegTimestamp(moodDate, currentUsername, newMoodCommentKey);
      }
    });
}

// update negTimestamp of the mood
// used to sort mood in descending order
function updateNegTimestamp(moodDate, currentUsername, newMoodCommentKey) {
  const timeRef = fbdata
    .database()
    .ref(
      "/Mood/" +
        currentUsername +
        "/" +
        moodDate +
        "/" +
        newMoodCommentKey +
        "/timestamp/"
    );
  const negTimeRef = fbdata
    .database()
    .ref("/Mood/" + currentUsername + "/" + moodDate + "/" + newMoodCommentKey);
  timeRef.once("value", (snapshot) => {
    var negTimestampValue = snapshot.val() * -1;
    negTimeRef.update({ negTimestamp: negTimestampValue });
  });
}

// create mood screen
export default function CreateMood({ navigation }) {
  // call useAccountUsername from commonFunctions
  const currentUsername = useAccountUsername();
  // useState variables:
  // date: value of date selector
  const [date, setDate] = useState(new Date());
  // moodDate: format selected date as "yyyy-mm-dd"
  const [moodDate, setMoodDate] = useState(getDateFormatOne(new Date()));
  // moodFontAwesome5Icon: mood list read from firebase
  const [moodFontAwesome5Icon, setMoodFontAwesome5Icon] = useState([]);
  // moodColor: set mood color once selected
  const [moodColor, setMoodColor] = useState([]);
  // forcusedText: text input focus status
  const [focusedText, setFocusedText] = useState(false);
  // comment: store comment inut
  const [comment, setComment] = useState("");
  // selectedID: store selected id of mood icon
  const [selectedID, setSelectedID] = useState(null);
  // selectedIcon: store selected mood icon name
  const [selectedIcon, setSelectedIcon] = useState(null);
  // error status for comment & mood
  const [commentErrorStatus, setCommentErrorStatus] = useState(false);
  const [moodErrorStatus, setMoodErrorStatus] = useState(false);

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

  // on change of date picker
  const onChange = (event, selectedDate) => {
    const currentMoodDate = selectedDate || date;
    setDate(currentMoodDate);
    const formatedMoodDate = getDateFormatOne(currentMoodDate);
    setMoodDate(formatedMoodDate);
  };

  // change text input border colour based on variable focusedText
  const getBorderColorText = () => {
    if (focusedText) {
      return "#00BCD4";
    }
    return "white";
  };

  // render mood list in a horizontal flatlist
  // change border and background colour of mood once selected
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

  // handle on submit action once "post" button is clicked
  // set error status to true if either icon or comment is empty
  // call storeMood otherwise, and navigate back to calendar navigation of MoodJournalScreen
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
        moodDate,
        currentUsername,
        moodColor
      );
      alert("Successfully saved!");
      navigation.navigate("Diary", {
        screen: "MoodJournalCalendar",
      });
    }
  };

  // render view
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

        {/* date picker section */}
        <View
          style={{
            width: "100%",
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={styles.header}>Select Date</Text>
          <View
            style={{
              backgroundColor: "white",
              paddingVertical: 5,
              borderRadius: 10,
              marginLeft: "2%",
              flex: 2,
            }}
          >
            <DateTimePicker
              testID="dateTimerPicker"
              value={date}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={onChange}
              style={{
                width: 125,
              }}
            />
          </View>
        </View>

        {/* Mood picker section */}
        <View
          style={{
            marginTop: 20,
            height: SCREEN_HEIGHT * 0.08,
          }}
        >
          <FlatList
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

        {/* Comment section */}
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
          />
          {commentErrorStatus === true ? (
            <Text style={styles.formErrorMsg}>
              Please insert your comment to proceed!
            </Text>
          ) : null}
        </View>

        {/* submission section */}
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

// style sheet
const styles = StyleSheet.create({
  moodIcon: {
    width: 60,
    height: 60,
    left: 18,
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginRight: 20,
  },

  moodBorder: {
    borderWidth: 2,
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
    height: 80,
  },

  postbutton: {
    backgroundColor: "#F3B000",
    justifyContent: "center",
    alignItems: "center",
    margin: 15,
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
    marginVertical: 10,
  },
  header: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: 35,
    flex: 1,
  },
});
