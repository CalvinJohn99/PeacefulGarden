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
  ScrollView,
} from "react-native";
import useCurrentDate, {
  getDateFormatThree,
} from "../components/CommonFunctions.js";
import { FontAwesome5 } from "@expo/vector-icons";
import fbdata from "../../firebase.js";
import commonStyles from "../../commonStyles.js";
import EditMoodInput from "../components/EditMoodInput.js";
import EditJournalInput from "../components/EditJournalInput.js";
import VirtualizedView from "../components/VirtualizedView.js";

export default function ViewMoodJournal({ navigation, route }) {
  const { currentUsername, day } = route.params;
  const selectedDate = getDateFormatThree(day.day, day.month, day.year);
  const currentDate = useCurrentDate();
  const [moodList, setMoodList] = useState([]);
  const [journalList, setJournalList] = useState([]);

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

    const journalRef = fbdata
      .database()
      .ref("/Journal/" + currentUsername + "/" + day.dateString)
      .orderByChild("negTimestamp");
    const journalListener = journalRef.on("value", (snapshot) => {
      setJournalList([]);
      snapshot.forEach((childSnapshot) => {
        setJournalList((journalList) => [...journalList, childSnapshot.val()]);
      });
    });

    return () => {
      moodRef.off("value", moodListener);
      journalRef.off("value", journalListener);
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
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
      <View style={{ height: 70 }}>
        <Text style={[commonStyles.todayDate]}> {selectedDate} </Text>
      </View>

      <VirtualizedView>
        <View style={styles.outerSection}>
          <View style={styles.headerSection}>
            <Text style={styles.headerText}>Mood</Text>
          </View>

          <FlatList
            style={{
              alignSelf: "center",
              width: "95%",
              // marginTop: 20,
              // backgroundColor: "#DBF0FF",
              // borderRadius: 20,
              // borderWidth: 2,
              // borderColor: "blue",
            }}
            data={moodList}
            renderItem={({ item }) => (
              <EditMoodInput
                item={item}
                currentUsername={currentUsername}
                day={day}
              />
            )}
            keyExtractor={(item) => item.id}
            listKey={(item) => item.id}
          ></FlatList>
        </View>

        <View style={styles.outerSection}>
          <View style={styles.headerSection}>
            <Text style={styles.headerText}>Journal</Text>
          </View>

          <FlatList
            style={{
              alignSelf: "center",
              width: "95%",
              // marginTop: 20,
              // marginBottom: 40,
              // borderWidth: 2,
              // borderColor: "red",
            }}
            data={journalList}
            // renderItem={renderItem}
            renderItem={({ item }) => (
              <EditJournalInput
                item={item}
                currentUsername={currentUsername}
                day={day}
              />
            )}
            keyExtractor={(item) => item.id}
            listKey={(item) => item.id}
          ></FlatList>
        </View>
      </VirtualizedView>
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

  outerSection: {
    marginHorizontal: 12,
    // borderWidth: 2,
    // borderColor: "red",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DBF0FF",
    borderRadius: 20,
    marginBottom: 50,
    paddingVertical: 10,
  },

  headerSection: {
    backgroundColor: "rgba(0,188,212,0.4)",
    width: "80%",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 20,
  },

  headerText: {
    marginVertical: 15,
    fontSize: 24,
    fontWeight: "bold",
  },
});
