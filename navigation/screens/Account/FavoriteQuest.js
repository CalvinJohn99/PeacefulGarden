import * as React from "react";
import { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Text, FlatList } from "react-native";
import { useQuestionList } from "../../components/CommonFunctions.js";
import ListFavoriteAnswer from "../../components/ListFavoriteAnswer.js";
import commonStyles, {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} from "../../../commonStyles.js";

export default function FavoriteQuest(props) {
  const Qlist = useQuestionList();

  return (
    <View>
      <FlatList
        style={{
          width: SCREEN_WIDTH * 0.92,
          borderRadius: 20,
          // borderWidth: 2,
          // borderColor: "red",
        }}
        data={Qlist}
        renderItem={({ item }) => (
          <View>
            <ListFavoriteAnswer question={item} username={props.username} />
            {/* <Text>{item.question}</Text> */}
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      ></FlatList>
    </View>
  );
}
