import * as React from "react";
import { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Text, FlatList } from "react-native";
import {
  useAccountUsername,
  usePostData,
  useUserAnswer,
} from "../../components/CommonFunctions.js";
import ListPost from "../../components/EditPost.js";

export default function GPostByInterest({ navigation }) {
  const username = useAccountUsername();
  const Post = usePostData();

  return (
    <View>
      <FlatList
        data={Post}
        renderItem={({ item }) => (
          <View>
            <ListPost question={item} username={username} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      ></FlatList>
    </View>
  );
}
