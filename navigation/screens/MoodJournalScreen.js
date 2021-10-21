// @refresh state
import * as React from "react";
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { FontAwesome, Octicons } from "@expo/vector-icons";

import fbdata from "../../firebase.js";
import useCurrentDate, {
  useAccountUsername,
} from "../components/CommonFunctions.js";
import FloatingButton from "../components/FloatingButton.js";
import commonStyles, {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} from "../../commonStyles.js";
//import ViewMood from "./ViewMood";
//import {Card, Avatar} from 'react-native-paper';

export default function MoodJournalScreen({ navigation }) {
  const currentDate = useCurrentDate();
  const currentUsername = useAccountUsername();
  const mood = { color: "green" };
  const journal = { color: "blue" };

  return (
    <SafeAreaView style={styles.outerContainer}>
      {/* <View>
        <Text style={{ top: 20, fontWeight: "bold", fontSize: 26 }}>
          {" "}
          {currentDate}{" "}
        </Text>
      </View> */}

      {/* <View style={styles.submitSection}>
        <TouchableOpacity
          style={styles.postbutton}
          onPress={() => {
            navigation.navigate("Journal", { screen: "CreateMood" });
          }}
        >
          <Text style={styles.postbuttontext}>New</Text>
        </TouchableOpacity>
      </View> */}

      <View style={styles.calendar}>
        <Calendar
          onVisibleMonthsChange={(months) => {
            console.log("now these months are visible", months);
          }}
          maxDate={new Date()}
          onDayPress={(day) => {
            navigation.navigate("MoodJournal", {
              screen: "ViewMoodJournal",
              params: { currentUsername, day },
            });
          }}
          // onDayLongPress={(day) => {
          //   console.log("selected day", day);
          // }}
          monthFormat={"MMM yyyy"}
          onMonthChange={(month) => {
            console.log("month changed", month);
          }}
          hideArrows={false}
          hideExtraDays={false}
          disableMonthChange={true}
          firstDay={1}
          onPressArrowLeft={(subtractMonth) => subtractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
          enableSwipeMonths={false}
          // markingType={"multi-dot"}
          // markedDates={{
          //   "2021-10-01": { dots: [mood, journal] },
          //   "2021-10-06": { dots: [mood, journal] },
          //   "2021-10-07": { dots: [mood] },
          //   "2021-10-14": {
          //     dots: [mood],
          //     selected: true,
          //     selectedColor: "lightblue",
          //   },
          // }}
        />
      </View>

      {/* <View style={styles.remarks}>
        <Text style={[styles.remarksDetails]}>Remarks:</Text>

        <View style={[styles.remarksDetails]}>
          <Text>
            <FontAwesome name="circle" size={24} color="lightblue" /> : Today
          </Text>
        </View>

        <View style={[styles.remarksDetails]}>
          <Text>
            <Octicons name="primitive-dot" size={24} color="green" /> : Mood
          </Text>
        </View>

        <View style={[styles.remarksDetails]}>
          <Text>
            <Octicons name="primitive-dot" size={24} color="blue" /> : Journal
          </Text>
        </View>
      </View> */}

      <View style={styles.container}>
        <FloatingButton navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: "center",
  },

  container: {
    flex: 1,
    alignItems: "center",
    position: "absolute",
    bottom: SCREEN_HEIGHT * 0.1,
  },

  calendar: {
    marginTop: 50,
    width: "80%",
  },

  remarks: {
    width: "70%",
    backgroundColor: "#B6E4CB",
    justifyContent: "center",
    //alignItems: 'center',
    marginTop: 30,
    marginLeft: -30,
    padding: 10,
    borderRadius: 20,
  },

  remarksDetails: {
    left: 10,
    //margin: 10,
    padding: 5,
  },

  createNewButton: {
    position: "absolute",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
    //backgroundColor: 'red',
  },

  floatingButton: {
    resizeMode: "contain",
    width: 50,
    height: 50,
  },

  safe: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: "white",
    margin: 5,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

/* <CalendarList
              // Callback which gets executed when visible months change in scroll view. Default = undefined
              onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
              // Max amount of months allowed to scroll to the past. Default = 50
              pastScrollRange={4}
              // Max amount of months allowed to scroll to the future. Default = 50
              futureScrollRange={4}
              // Enable or disable scrolling of calendar list
              scrollEnabled={true}
              // Enable or disable vertical scroll indicator. Default = false
              showScrollIndicator={true}
              maxDate = {new Date()} 
              onDayPress={(day) => {console.log(new Date())}}
              hideArrows={true}
              hideExtraDays={true}
              markingType={'custom'}
              markedDates={{
                maxDate: {selected: true, marked: true, selectedColor: 'blue'},
               //[new Date()]: {selected: true, marked: true, selectedColor: 'blue'},               
                }}

                //markingType={'multi-dot'}
                //markedDates={{
                //  '2021-10-01': {dots: [vacation, massage, workout], selected: true, selectedColor: 'red'},
                  //'2021-10-06': {dots: [massage, workout]}
               // }}
              //markedDates={MoodHistory}
            /> */
