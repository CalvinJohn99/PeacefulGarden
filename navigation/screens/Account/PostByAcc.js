// @refresh state
import * as React from "react";
import { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import fbdata from "../../../firebase.js";
import EditPost from "../../components/EditPost.js";

export default function PostByAcc(props) {
  // useState variable: hold post made by current user
  const [userPosts, setUserPosts] = useState([]);

  // read post created by current user
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

  // render view
  return (
    <View>
      <FlatList
        data={userPosts}
        renderItem={({ item }) => (
          // call EditPost
          // pass variable post, username and userID
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
