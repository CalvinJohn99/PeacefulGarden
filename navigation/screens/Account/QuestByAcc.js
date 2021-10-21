import * as React from "react";
import { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Text, FlatList } from "react-native";
import {
  useAccountUserid,
  useAccountUsername,
  useQuestionList,
  useUserAnswer,
} from "../../components/CommonFunctions.js";
import ListAnswerbyQuestion from "../../components/EditAnswer";
import commonStyles, {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} from "../../../commonStyles.js";

export default function QuestByAcc({ navigation }) {
  const userID = useAccountUserid();
  const username = useAccountUsername();
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
            <ListAnswerbyQuestion
              question={item}
              username={username}
              userID={userID}
            />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      ></FlatList>
    </View>
  );
}
