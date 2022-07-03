import React, { useState, useEffect } from "react";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import fbdata from "../../firebase";
import { useAccountUsername } from "./CommonFunctions";

// component handle like button on answers of questions
export default function LikeButton(props) {
  // useState variable: liked, initialized as false
  // hold the status of answer, true: liked, red, false: unliked, white
  const [liked, setLiked] = useState(false);
  const currentUser = useAccountUsername();

  // the firebase ref to snapshot the liked status
  // snapshot exist: isLiked
  // snapshot !exist: !isLiked
  const checkLikeAnswerRef = fbdata
    .database()
    .ref(
      "/qanswer/" +
        props.question.question +
        "/" +
        props.answer.id +
        "/likes/" +
        currentUser
    );

  // listen to the value change on the reference, and set useState variable "liked"
  // snapshot exists: setLiked(true)
  // snapshot !exists: setLiked(false);
  useEffect(() => {
    const likeListener = checkLikeAnswerRef.on("value", (snapshot) => {
      if (snapshot.exists()) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    });
    return () => {
      checkLikeAnswerRef.off("value", likeListener);
    };
  }, []);

  // handle click on the liked button
  // snapshot exists: change to unlike, remove the ref
  // snapshot !exists: change to like, add ref and value
  function likeAnswer() {
    const addLikeAnswerRef = fbdata
      .database()
      .ref(
        "/qanswer/" +
          props.question.question +
          "/" +
          props.answer.id +
          "/likes/"
      );
    checkLikeAnswerRef.get().then((snapshot) => {
      if (!snapshot.exists()) {
        addLikeAnswerRef.update({ [currentUser]: true });
      } else {
        checkLikeAnswerRef.remove();
      }
    });
  }

  // render view
  return (
    <Pressable
      onPress={() => {
        likeAnswer();
      }}
    >
      <MaterialCommunityIcons
        name={liked ? "heart" : "heart-outline"}
        size={32}
        color={liked ? "#F02A4B" : "black"}
      />
    </Pressable>
  );
}

// component handle like button of post
export function LikePostButton(props) {
  // useState variable: liked, initialized as false
  // hold the status of post, true: liked, red, false: unliked, white
  const [liked, setLiked] = useState(false);
  const currentUser = useAccountUsername();

  // the firebase ref to snapshot the liked status
  // snapshot exist: isLiked
  // snapshot !exist: !isLiked
  const checkLikePostRef = fbdata
    .database()
    .ref(
      "/posts/" +
        props.post.category +
        "/" +
        props.post.id +
        "/likes/" +
        currentUser
    );

  // listen to the value change on the reference, and set useState variable "liked"
  // snapshot exists: setLiked(true)
  // snapshot !exists: setLiked(false);
  useEffect(() => {
    const postlikeListener = checkLikePostRef.on("value", (snapshot) => {
      if (snapshot.exists()) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    });
    return () => {
      checkLikePostRef.off("value", postlikeListener);
    };
  }, []);

  // handle click on the liked button
  // snapshot exists: change to unlike, remove the ref
  // snapshot !exists: change to like, add ref and value
  function likePost() {
    const addLikePostRef = fbdata
      .database()
      .ref("/posts/" + props.post.category + "/" + props.post.id + "/likes/");
    checkLikePostRef.get().then((snapshot) => {
      if (!snapshot.exists()) {
        addLikePostRef.update({ [currentUser]: true });
      } else {
        checkLikePostRef.remove();
      }
    });
  }

  // render view
  return (
    <Pressable
      onPress={() => {
        likePost();
      }}
    >
      <MaterialCommunityIcons
        name={liked ? "heart" : "heart-outline"}
        size={32}
        color={liked ? "#F02A4B" : "black"}
      />
    </Pressable>
  );
}
