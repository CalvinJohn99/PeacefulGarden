import * as React from "react";
import { SafeAreaView, View, Text } from "react-native";
import commonStyles from "../../commonStyles.js";

export default function CreatePost({ navigation, route }) {
  return (
    <SafeAreaView style={commonStyles.pageContainer}>
      <Text>Create Post</Text>
    </SafeAreaView>
  );
}
