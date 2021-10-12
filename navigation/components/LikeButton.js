import React, { useState, useEffect } from "react";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import fbdata from "../../firebase";
import { useAccountUsername } from "./CommonFunctions";

export default function LikeButton(props) {
  const [liked, setLiked] = useState(false);
  const currentUser = useAccountUsername();

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

  function likeAnswer() {
    const addLikeAnswerRef = fbdata
      .database()
      .ref(
        "/qanswer/" + props.question.question + "/" + props.answer.id + "/likes"
      );
    checkLikeAnswerRef.get().then((snapshot) => {
      if (!snapshot.exists()) {
        addLikeAnswerRef.update({ [currentUser]: true });
      } else {
        checkLikeAnswerRef.remove();
      }
    });
  }

  return (
    <Pressable
      onPress={() => {
        // setLiked((isLiked) => !isLiked);
        likeAnswer();
      }}
    >
      <MaterialCommunityIcons
        name={liked ? "heart" : "heart-outline"}
        size={32}
        color={liked ? "red" : "black"}
      />
    </Pressable>
  );
}
