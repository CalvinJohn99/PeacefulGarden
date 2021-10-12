import * as React from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Image,
} from "react-native";

import { useState, useEffect } from "react";

import fbdata from "../../firebase.js";
import useCurrentDate from "../components/CommonFunctions.js";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import ViewMood from "./ViewMood";

/*
const getBackgroundColor = (id) => {
    if (id % 3 === 1) {
      return "#B6E4CB";
    } else if (id % 3 === 2) {
      return "#B5CBDF";
    } else if (id % 3 === 0) {
      return "#E8D8D8";
    }
  };
*/

export default function History({ navigation }) {
  const currentDate = useCurrentDate();
  //const MoodHistory = ViewMood();
  const mood = { key: "mood", color: "green", selectedDotColor: "blue" };
  const journal = { key: "journal", color: "red" };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <View>
        <Text style={{ top: 20, fontWeight: "bold", fontSize: 26 }}>
          {" "}
          {currentDate}{" "}
        </Text>
      </View>

      <View style={styles.submitSection}>
        <TouchableOpacity
          style={styles.postbutton}
          onPress={() => {
            navigation.navigate("Journal", { screen: "CreateMood" });
          }}
        >
          <Text style={styles.postbuttontext}>New</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Calendar
          // Initially visible month. Default = Date()
          onVisibleMonthsChange={(months) => {
            console.log("now these months are visible", months);
          }}
          maxDate={new Date()}
          onDayPress={(day) => {
            console.log("selected day", day);
          }}
          // Handler which gets executed on day long press. Default = undefined
          onDayLongPress={(day) => {
            console.log("selected day", day);
          }}
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat={"MMM   yyyy"}
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          onMonthChange={(month) => {
            console.log("month changed", month);
          }}
          // Hide month navigation arrows. Default = false
          hideArrows={false}
          // Replace default arrows with custom ones (direction can be 'left' or 'right')
          //renderArrow={(direction) => (<Arrow/>)}
          // Do not show days of other months in month page. Default = false
          hideExtraDays={false}
          // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
          // day from another month that is visible in calendar page. Default = false
          disableMonthChange={true}
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
          firstDay={1}
          // Handler which gets executed when press arrow icon left. It receive a callback can go back month
          onPressArrowLeft={(subtractMonth) => subtractMonth()}
          // Handler which gets executed when press arrow icon right. It receive a callback can go next month
          onPressArrowRight={(addMonth) => addMonth()}
          enableSwipeMonths={false}
          markingType={"multi-dot"}
          markedDates={{
            "2021-10-01": { dots: [mood, journal] },
            "2021-10-06": { dots: [mood] },
            "2021-10-07": {
              dots: [mood],
              selected: true,
              selectedColor: "lightblue",
            },
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: "center",
  },

  submitSection: {
    flexDirection: "row",
    //top: 50,
    height: 40,
    right: -100,
    marginBottom: 30,
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
    fontSize: 18,
  },
});
