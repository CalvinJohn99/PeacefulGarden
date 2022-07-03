// @refresh state
import * as React from "react";
import { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";

import { useAccountUsername } from "../components/CommonFunctions.js";
import FloatingButton from "../components/FloatingButton.js";
import commonStyles, {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} from "../../commonStyles.js";

// Mood Journal Screen
// Calendar navigation
// Pass date to ViewMoodJournal screen once a date is selected
export default function MoodJournalScreen({ navigation }) {
  const currentUsername = useAccountUsername();

  // render view
  return (
    <SafeAreaView style={styles.outerContainer}>
      {/* render calendar navigation,
          select a date to navigate,
          pass date to ViewMoodJournal screen*/}
      <View style={styles.calendar}>
        <Calendar
          onVisibleMonthsChange={(months) => {
            console.log("now these months are visible", months);
          }}
          maxDate={new Date()}
          onDayPress={(day) => {
            navigation.navigate("Diary", {
              screen: "ViewMoodJournal",
              params: { currentUsername, day },
            });
          }}
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
        />
      </View>

      {/* called floating button component
          allow navigation to create mood and journal respectively
          pass navigation to floating button */}
      <View style={styles.container}>
        <FloatingButton navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

// Style Sheet
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
