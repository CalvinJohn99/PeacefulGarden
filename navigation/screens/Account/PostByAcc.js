// @refresh state
import * as React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import fbdata from "../../../firebase.js";
import EditPost from "../../components/EditPost.js";

export default function PostByAcc(props) {
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const postbyAccRef = fbdata
      .database()
      .ref("/postsbyacc/" + props.username)
      .orderByChild("negTimestamp");
    const PostbyAccountListener = postbyAccRef.on("value", (snapshot) => {
      setUserPosts([]);
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          setUserPosts((userPosts) => [...userPosts, childSnapshot.val()]);
        });
      }
    });
    return () => {
      postbyAccRef.off("value", PostbyAccountListener);
    };
  }, []);

  if (userPosts.length === 0) {
    return null;
  }

  return (
    <View>
      <FlatList
        // horizontal
        // pagingEnabled={true}
        // showsHorizontalScrollIndicator={false}
        // lagacyImplementation={false}
        // style={{ width: "100%" }}
        // showsVerticalScrollIndicator={false}
        data={userPosts}
        renderItem={({ item }) => (
          <EditPost
            item={item}
            username={props.username}
            userID={props.userID}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
