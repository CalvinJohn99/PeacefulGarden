import * as React from "react";
import { useState, useEffect } from "react";
import { SafeAreaView, View, FlatList, Text, StyleSheet } from "react-native";

// import components
import { getDateFormatThree } from "../components/CommonFunctions.js";
import commonStyles from "../../commonStyles.js";
import EditMoodInput from "../components/EditMoodInput.js";
import EditJournalInput from "../components/EditJournalInput.js";
import VirtualizedView from "../components/VirtualizedView.js";

// Import firebase from file "firebase.js"
import fbdata from "../../firebase.js";

// ViewMoodJournal screen
// based on the date passed from MoodJournalScreen
export default function ViewMoodJournal({ navigation, route }) {
  // receive variables from screen MoodJournalScreen
  const { currentUsername, day } = route.params;

  // Transform the date form into Day FullMonth FullYear
  const selectedDate = getDateFormatThree(day.day, day.month, day.year);

  // create useState variable of empty array, to hold array of mood and journal based on day passed from MoodJournalScreen
  const [moodList, setMoodList] = useState([]);
  const [journalList, setJournalList] = useState([]);

  // Read mood and journal on the day passed over from firebase, and put into the respective arrays.
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

  // render view
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* date header, show selected date */}
      <View style={{ height: 70 }}>
        <Text style={[commonStyles.todayDate]}> {selectedDate} </Text>
      </View>

      {/* enbrace two flatlist in the VirtualizedView */}
      <VirtualizedView>
        <View style={styles.outerSection}>
          <View style={styles.headerSection}>
            <Text style={styles.headerText}>Mood</Text>
          </View>

          {/* Mood list */}
          <FlatList
            style={{
              alignSelf: "center",
              width: "95%",
            }}
            data={moodList}
            renderItem={({ item }) => (
              // call EditMoodInput component, pass each mood item, username and day
              <EditMoodInput
                item={item}
                currentUsername={currentUsername}
                day={day}
              />
            )}
            // each list item should have a unique key
            keyExtractor={(item) => item.id}
            // each list should have a unique key
            listKey={(item) => item.id}
          ></FlatList>
        </View>

        {/* Journal List */}
        <View style={styles.outerSection}>
          <View style={styles.headerSection}>
            <Text style={styles.headerText}>Journal</Text>
          </View>

          <FlatList
            style={{
              alignSelf: "center",
              width: "95%",
            }}
            data={journalList}
            renderItem={({ item }) => (
              // call EditJournalInput component, pass each Journal item, username and day
              <EditJournalInput
                item={item}
                currentUsername={currentUsername}
                day={day}
              />
            )}
            // each list item should have a unique key
            keyExtractor={(item) => item.id}
            // each list should have a unique key
            listKey={(item) => item.id}
          ></FlatList>
        </View>
      </VirtualizedView>
    </SafeAreaView>
  );
}

// style sheet
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
