import * as React from "react";
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import fbdata from "../../firebase.js";
import commonStyles, {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} from "../../commonStyles.js";
import { FontAwesome5 } from "@expo/vector-icons";

export default function PostList(props) {
  const interestItem = props.interestItem;
  const [postByCategory, setPostByCategory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

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

  console.log(interestItem);
  console.log(postByCategory);

  if (postByCategory.length === 0) {
    return null;
  }

  return (
    <View>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          paddingLeft: 15,
          paddingVertical: 20,
          alignSelf: "left",
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
          <View
            style={{
              width: SCREEN_WIDTH * 0.7,
              height: 200,
              marginHorizontal: 20,
              borderRadius: 20,
            }}
          >
            <TouchableOpacity
              style={{ borderRadius: 20 }}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <ImageBackground
                source={{ uri: item.imageURL }}
                imageStyle={{ opacity: 0.4, borderRadius: 20 }}
                style={{ width: "100%", height: "100%" }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 22,
                    fontWeight: "bold",
                    position: "absolute",
                    left: 15,
                    bottom: 20,
                  }}
                >
                  {item.title}
                </Text>
              </ImageBackground>
            </TouchableOpacity>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View style={commonStyles.modalFirstView}>
                <View
                  style={[
                    commonStyles.modalSecondView,
                    {
                      backgroundColor: "rgba(0,188,212,0.5)",
                      alignItems: "center",
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={{ position: "absolute", top: 10, right: 20 }}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <FontAwesome5 name="times" size={40} color="black" />
                  </TouchableOpacity>

                  <View
                    style={{
                      width: "100%",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        marginTop: 30,
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        marginTop: 10,
                      }}
                    >
                      Posted by {item.username}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        marginTop: 5,
                      }}
                    >
                      Posted on {item.creationDate}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        marginTop: 5,
                      }}
                    >
                      Category: {item.category}
                    </Text>
                    <View style={{ width: "100%", height: 200, marginTop: 30 }}>
                      <ImageBackground
                        source={{ uri: item.imageURL }}
                        imageStyle={{ borderRadius: 20 }}
                        style={{ width: "100%", height: "100%" }}
                      ></ImageBackground>
                    </View>
                    <Text style={{ fontSize: 16, marginTop: 30 }}>
                      {item.content}
                    </Text>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}
      ></FlatList>
    </View>
  );
}
