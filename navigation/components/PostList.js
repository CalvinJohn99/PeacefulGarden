import * as React from "react";
import { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import fbdata from "../../firebase.js";
import PostItem from "../components/PostItem.js";

// PostList component
// called in GPostScreen
// read post by category and pass post item to PostItem
export default function PostList(props) {
  // receive interest category from GPostScreen
  const interestItem = props.interestItem;
  // useState variable: hold post of the single category received
  const [postByCategory, setPostByCategory] = useState([]);

  // read post by category from firebase
  useEffect(() => {
    const postByCategoryRef = fbdata
      .database()
      .ref("/posts/" + interestItem.value)
      .orderByChild("negTimestamp");
    const postByCategoryListener = postByCategoryRef.on("value", (snapshot) => {
      setPostByCategory([]);
      snapshot.forEach((childSnapshot) => {
        setPostByCategory((postByCategory) => [
          ...postByCategory,
          childSnapshot.val(),
        ]);
      });
    });
    return () => {
      postByCategoryRef.off("value", postByCategoryListener);
    };
  }, []);

  // if there is no post in a particular category
  // return null
  if (postByCategory.length === 0) {
    return null;
  }

  // render view
  return (
    <View>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          paddingLeft: 15,
          paddingVertical: 20,
        }}
      >
        {interestItem.value}
      </Text>
      <FlatList
        horizontal
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        lagacyImplementation={false}
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
        data={postByCategory}
        renderItem={({ item }) => (
          // call PostItem
          // pass variable Item (post)
          <PostItem item={item} />
        )}
      ></FlatList>
    </View>
  );
}
