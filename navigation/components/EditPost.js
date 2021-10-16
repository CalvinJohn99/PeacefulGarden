// @refresh state
import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import fbdata from "../../firebase.js";
import EditPostInput from "./EditPostInput.js";

export default function ListPost(props) {
  const [postByInterest, setPostByInterest] = useState([]);
  React.useEffect(() => {
    const postRef = fbdata
      .database()
      .ref("/postbyuser/" + props.username + "/" + props.post.category)
      .orderByChild("negTimestamp");
    const OnLoadingListener = postRef.on("value", (snapshot) => {
      setPostByInterest([]);
      if (snapshot.exists) {
        snapshot.forEach((childSnapshot) => {
          setPostByInterest((postByInterest) => [...postByInterest, childSnapshot.val()]);
        });
      }
    });
    return () => {
      postByInterest.off("value", OnLoadingListener);
    };
  }, []);

  if (postByInterest.length === 0) {
    return null;
  }
  return (
    <View>
      <Text style={{ fontWeight: "bold", fontSize: 20 }}>
        {props.post.category}
      </Text>
      <FlatList
        // style={{ top: 20 }}
        data={postByInterest}
        renderItem={({ item }) => <EditPostInput item={item} />}
      />
    </View>
  );
}
