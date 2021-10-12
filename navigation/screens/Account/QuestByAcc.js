import * as React from "react";
import { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Text, FlatList } from "react-native";
import {
  useAccountUsername,
  useQuestionList,
  useUserAnswer,
} from "../../components/CommonFunctions.js";
import ListAnswerbyQuestion from "../../components/EditAnswer";

export default function QuestByAcc({ navigation }) {
  const username = useAccountUsername();
  const Qlist = useQuestionList();

  return (
    <View>
      <FlatList
        data={Qlist}
        renderItem={({ item }) => (
          <View>
            <ListAnswerbyQuestion question={item} username={username} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      ></FlatList>
    </View>
  );
}
