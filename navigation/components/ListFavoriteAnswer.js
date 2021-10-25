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
  StyleSheet,
} from "react-native";
import fbdata from "../../firebase.js";
import LikeButton from "../components/LikeButton.js";

export default function ListFavoriteAnswer(props) {
  const [fabyquest, setFabyquest] = useState([]);
  useEffect(() => {
    const fQARef = fbdata
      .database()
      .ref(
        "/likedAnswer/" + props.username + "/" + props.question.question + "/"
      )
      .orderByChild("negTimestamp");
    const OnLoadingListener = fQARef.on("value", (snapshot) => {
      setFabyquest([]);
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          setFabyquest((fabyquest) => [...fabyquest, childSnapshot.val()]);
        });
      }
    });
    return () => {
      fQARef.off("value", OnLoadingListener);
    };
  }, []);

  // console.log(fabyquest);

  if (fabyquest.length === 0) {
    return null;
  }
  return (
    // <View>
    //   <Text> Check </Text>
    // </View>

    <View
      style={{
        width: "100%",
        // borderWidth: 2,
        // borderColor: "black",
        backgroundColor: "white",
        borderRadius: 20,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
        borderWidth: 1,
        borderColor: "rgba(178,185,214,0.5)",
        // shadowColor: "grey",
        // shadowOffset: {
        //   width: 2,
        //   height: 5,
        // },
        // shadowOpacity: 0.36,
        // shadowRadius: 5,
        // elevation: 11,
      }}
    >
      <View
        style={{
          width: "100%",
          backgroundColor: props.question.color,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 20,
          paddingHorizontal: 15,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: "grey",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.36,
          shadowRadius: 5,
          elevation: 11,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
          {props.question.question}
        </Text>
      </View>
      <FlatList
        style={{
          alignItems: "left",
          marginHorizontal: 10,
          paddingBottom: 20,
        }}
        data={fabyquest}
        renderItem={({ item }) => (
          // <EditAnswerInput
          //   answer={item}
          //   username={props.username}
          //   question={props.question}
          // />
          <View>
            <Text style={{ marginTop: 10, alignSelf: "flex-end" }}>
              {" "}
              Posted on {item.creationDate}{" "}
            </Text>
            <Text style={styles.answerText}> {item.answer} </Text>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <View
                style={{
                  flexGrow: 1,
                  marginTop: 4,
                }}
              >
                <Text
                  style={{
                    paddingTop: 6,
                    paddingLeft: 20,
                    fontWeight: "bold",
                  }}
                >
                  by {item.username}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  marginTop: 4,
                  marginLeft: 10,
                  flexGrow: 1,
                }}
              >
                <LikeButton question={props.question} answer={item} />
                {/* <Text>Like</Text> */}
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  answerText: {
    padding: 10,
    color: "black",
    fontSize: 18,
  },
});
