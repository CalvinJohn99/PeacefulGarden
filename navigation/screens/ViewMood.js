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
} from "react-native";

import useCurrentDate from "../components/CommonFunctions.js";

import useMoodIcon from "./getMood";

const getBackgroundColor = (id) => {
  if (id % 3 === 1) {
    return "#B6E4CB";
  } else if (id % 3 === 2) {
    return "#B5CBDF";
  } else if (id % 3 === 0) {
    return "#E8D8D8";
  }
};

export default function ViewMood({ navigation }) {
  const currentDate = useCurrentDate();
  const MoodList = useMoodIcon();

  const renderItem = ({ item }) => {
    const imageURLLink = item.moodURL.toString();
    const commentWritten = item.comment;
    return (
      <View>
        <Image
          style={{ height: 50, width: 50 }}
          source={{ uri: imageURLLink }}
        ></Image>
        <Text> {commentWritten} </Text>
        <Text>{item.negTimestamp}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={{ top: 10, fontWeight: "bold", fontSize: 26 }}>
          {" "}
          {currentDate}{" "}
        </Text>
      </View>

      <FlatList
        style={{ top: 20, bottom: 200 }}
        data={MoodList}
        renderItem={renderItem}

        //keyExtractor={(item) => item.id.toString()}
      ></FlatList>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 20,
    alignItems: "center",
  },
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
