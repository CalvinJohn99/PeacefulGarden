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
  Image,
} from "react-native";
import fbdata from "../../firebase.js";
import useCurrentDate from "../components/CommonFunctions.js";
import Ionicons from "react-native-vector-icons/Ionicons";

const getBackgroundColor = (id) => {
  if (id % 3 === 1) {
    return "#B6E4CB";
  } else if (id % 3 === 2) {
    return "#B5CBDF";
  } else if (id % 3 === 0) {
    return "#E8D8D8";
  }
};

function storeMComment(moodURL, comment) {
  var newMoodCommentKey = fbdata
    .database()
    .ref("/Mood/AAA/03Sep2021/")
    .push().key;
  var dataToSave = {
    id: newMoodCommentKey,
    moodURL: moodURL,
    comment: comment,
    timestamp: {
      ".sv": "timestamp",
    },
    negTimestamp: 0,
  };
  var updates = {};
  updates["/Mood/AAA/03Sep2021/" + newMoodCommentKey] = dataToSave;

  return fbdata
    .database()
    .ref()
    .update(updates, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("update is sucessful");
        updateNegTimestamp(newMoodCommentKey);
      }
    });
}

function updateNegTimestamp(newMoodCommentKey) {
  const timeRef = fbdata
    .database()
    .ref("/Mood/AAA/03Sep2021/" + newMoodCommentKey + "/timestamp/");
  const negTimeRef = fbdata
    .database()
    .ref("/Mood/AAA/03Sep2021/" + newMoodCommentKey);
  timeRef.once("value", (snapshot) => {
    var negTimestampValue = snapshot.val() * -1;
    negTimeRef.update({ negTimestamp: negTimestampValue });
  });
}

function getMoodIconURL() {
  const moodIconURLRef = fbdata.database().ref("/MoodIconURL/");
  moodIconURLRef.get().then((snapshot) => {
    return snapshot.val();
  });
}

export default function CreateMood({ navigation }) {
  const currentDate = useCurrentDate();
  const [moodURL, setMoodURL] = useState("");
  const [comment, setComment] = useState("");
  const [focusedText, setFocusedText] = useState(false);
  const [focusedExcited, setFocusedExcited] = useState(false);
  const [focusedHappy, setFocusedHappy] = useState(false);
  const [focusedBored, setFocusedBored] = useState(false);
  const [focusedSad, setFocusedSad] = useState(false);
  const [focusedAngry, setFocusedAngry] = useState(false);
  const moodIconURL = getMoodIconURL();

  const getBorderColorText = () => {
    if (focusedText) {
      return "blue";
    }
    return "white";
  };

  const getBorderColorExcited = () => {
    if (focusedExcited) {
      return "blue";
    }
    return "white";
  };

  const getBorderColorHappy = () => {
    if (focusedHappy) {
      return "blue";
    }
    return "white";
  };

  const getBorderColorBored = () => {
    if (focusedBored) {
      return "blue";
    }
    return "white";
  };

  const getBorderColorSad = () => {
    if (focusedSad) {
      return "blue";
    }
    return "white";
  };

  const getBorderColorAngry = () => {
    if (focusedAngry) {
      return "blue";
    }
    return "white";
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setFocusedText(false);
      }}
    >
      <SafeAreaView style={styles.outerContainer}>
        <Text style={styles.todayDate}> {currentDate} </Text>

        <View>
          <Text style={{ fontWeight: "bold", fontSize: 22, paddingTop: 50 }}>
            How do you feel today?
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={[
              styles.moodBorder,
              { borderColor: getBorderColorExcited() },
            ]}
            onPress={() => {
              setFocusedExcited(true);
              setFocusedHappy(false);
              setFocusedBored(false);
              setFocusedSad(false);
              setFocusedAngry(false);

              setMoodURL(
                "https://firebasestorage.googleapis.com/v0/b/peacefulgarden-a4b5c.appspot.com/o/MoodIcons%2FExcited.jpg?alt=media&token=bb96a203-67dd-4e89-9da6-de5f43b073b6"
              );
            }}
          >
            <Image
              style={styles.moodIcon}
              source={require("../../assets/Excited.jpg")}
            ></Image>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.moodBorder, { borderColor: getBorderColorHappy() }]}
            onPress={() => {
              setFocusedHappy(true);
              setFocusedExcited(false);
              setFocusedBored(false);
              setFocusedSad(false);
              setFocusedAngry(false);
              setMoodURL(
                "https://firebasestorage.googleapis.com/v0/b/peacefulgarden-a4b5c.appspot.com/o/MoodIcons%2FHappy.jpg?alt=media&token=731740b2-c734-4270-8913-75825afd6416"
              );
            }}
          >
            <Image
              style={styles.moodIcon}
              source={require("../../assets/Happy.jpg")}
            ></Image>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.moodBorder, { borderColor: getBorderColorBored() }]}
            onPress={() => {
              setFocusedBored(true);
              setFocusedExcited(false);
              setFocusedHappy(false);
              setFocusedSad(false);
              setFocusedAngry(false);
              setMoodURL(
                "https://firebasestorage.googleapis.com/v0/b/peacefulgarden-a4b5c.appspot.com/o/MoodIcons%2FBored.jpg?alt=media&token=50513fb4-a7b1-4fe5-afe3-9b65a0d50092"
              );
            }}
          >
            <Image
              style={styles.moodIcon}
              source={require("../../assets/Bored.jpg")}
            ></Image>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.moodBorder, { borderColor: getBorderColorSad() }]}
            onPress={() => {
              setFocusedSad(true);
              setFocusedExcited(false);
              setFocusedHappy(false);
              setFocusedBored(false);
              setFocusedAngry(false);
              setMoodURL(
                "https://firebasestorage.googleapis.com/v0/b/peacefulgarden-a4b5c.appspot.com/o/MoodIcons%2FSad.jpg?alt=media&token=a2bd9511-1887-42b3-b887-bcf1b500a799"
              );
            }}
          >
            <Image
              style={styles.moodIcon}
              source={require("../../assets/Sad.jpg")}
            ></Image>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.moodBorder, { borderColor: getBorderColorAngry() }]}
            onPress={() => {
              setFocusedAngry(true);
              setFocusedExcited(false);
              setFocusedHappy(false);
              setFocusedBored(false);
              setFocusedSad(false);
              setMoodURL(
                "https://firebasestorage.googleapis.com/v0/b/peacefulgarden-a4b5c.appspot.com/o/MoodIcons%2FAngry.jpg?alt=media&token=3ceaa2f8-82e8-41e2-b974-0114b1beb77f"
              );
            }}
          >
            <Image
              style={styles.moodIcon}
              source={require("../../assets/Angry.jpg")}
            ></Image>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={{ fontWeight: "bold", fontSize: 22, paddingTop: 30 }}>
            Comments
          </Text>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { borderColor: getBorderColorText() }]}
            multiline={true}
            editable={true}
            autofocus={true}
            placeholder="Please insert your comments here"
            onChangeText={(text) => setComment(text)}
            value={comment}
            onFocus={() => {
              setFocusedText(true);
            }}
            //returnKeyType="done"
          />
        </View>
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={styles.postbutton}
            onPress={() => {
              storeMComment(moodURL, comment);
              navigation.navigate("Journal", { screen: "ViewMood" });
            }}
          >
            <Text style={styles.postbuttontext}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.submitSection}>
          <TouchableOpacity
            style={styles.postbutton}
            onPress={() => {
              navigation.navigate("Journal", { screen: "ViewMood" });
            }}
          >
            <Text style={styles.postbuttontext}>Change</Text>
          </TouchableOpacity>
        </View> */}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: "center",
    //justifyContent: "center",
  },

  todayDate: {
    top: 20,
    fontWeight: "bold",
    fontSize: 26,
  },

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
    top: 50,
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
    backgroundColor: "#1067CC",
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
});
