// @refresh state
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
} from "react-native";
import useCurrentDate, {
  getCurrentDateString,
} from "../components/CommonFunctions.js";
import { FontAwesome5 } from "@expo/vector-icons";
import fbdata from "../../firebase.js";
import commonStyles from "../../commonStyles.js";
import EditMoodInput from "../components/EditMoodInput.js";

export default function ViewMood({ navigation, route }) {
  const { currentUsername, day } = route.params;
  const currentDate = useCurrentDate();
  const [moodList, setMoodList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    const moodRef = fbdata
      .database()
      .ref("/Mood/" + currentUsername + "/" + day.dateString)
      .orderByChild("negTimestamp");
    const moodListener = moodRef.on("value", (snapshot) => {
      setMoodList([]);
      snapshot.forEach((childSnapshot) => {
        setMoodList((moodList) => [...moodList, childSnapshot.val()]);
      });
    });
    return () => {
      moodRef.off("value", moodListener);
    };
  }, []);

  return (
    <SafeAreaView style={commonStyles.pageContainer}>
      {/* <View style={{ borderWidth: 2, borderColor: "red" }}>
        <Text style={commonStyles.todayDate}> {currentDate} </Text>
        <Text
          style={[
            commonStyles.todayDate,
            { borderWidth: 2, borderColor: "blue" },
          ]}
        >
          {" "}
          {day.dateString}{" "}
        </Text>
      </View> */}
      <Text
        style={[
          commonStyles.todayDate,
          // { borderWidth: 2, borderColor: "blue" },
        ]}
      >
        {" "}
        {day.dateString}{" "}
      </Text>

      <Text style={{ marginTop: 50, fontSize: 20, fontWeight: "bold" }}>
        Mood
      </Text>

      <FlatList
        style={{
          width: "98%",
          marginTop: 20,
        }}
        data={moodList}
        // renderItem={renderItem}
        renderItem={({ item }) => (
          <EditMoodInput
            item={item}
            currentUsername={currentUsername}
            day={day}
          />
        )}
        keyExtractor={(item) => item.id}
      ></FlatList>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
  },
  mood: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
  },
  MComment: {
    marginVertical: 20,
    padding: 10,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "grey",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.36,
    shadowRadius: 5,
    elevation: 11,
  },

  MCommentList: {
    padding: 20,
    color: "black",
  },
});
