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
import commonStyles, {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} from "../../commonStyles.js";
import { FontAwesome5 } from "@expo/vector-icons";
import { LikePostButton } from "../components/LikeButton";

// Post Item component
// view full post content
export default function PostItem(props) {
  // receive item (post) passed from PostList component
  const item = props.item;
  // useState variable: toggle modal overlay visibility
  const [modalVisible, setModalVisible] = useState(false);

  // render view
  return (
    <View
      style={{
        width: SCREEN_WIDTH * 0.7,
        height: 200,
        marginHorizontal: 20,
        borderRadius: 20,
      }}
    >
      {/* render each post with image, title and creator username */}
      <TouchableOpacity
        style={{ borderRadius: 20, height: "90%" }}
        onPress={() => {
          setModalVisible(true);
          console.log(item);
        }}
      >
        <ImageBackground
          source={{ uri: item.imageURL }}
          imageStyle={{ opacity: 0.9, borderRadius: 20 }}
          style={{ width: "100%", height: "100%" }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "#E8E6F4",
              position: "absolute",
              bottom: 0,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: 18,
                fontWeight: "bold",
                marginHorizontal: 15,
                paddingVertical: 10,
                flex: 5,
              }}
            >
              {item.title}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                marginLeft: 10,
                flex: 1,
                flexGrow: 1,
                alignItems: "flex-end",
                paddingBottom: 6,
                justifyContent: "center",
              }}
            >
              <LikePostButton post={item} />
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
      <View style={{ alignSelf: "flex-end", marginTop: 3, marginRight: 10 }}>
        <Text style={{ fontWeight: "bold" }}>by {item.username}</Text>
      </View>

      {/* view full post modal overlay, 
          visible when modalVisible is true */}
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
                backgroundColor: "#DBF0FF",
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
              <FontAwesome5 name="times" size={40} color="grey" />
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
                  fontSize: 14,
                  fontWeight: "bold",
                  marginTop: 20,
                  color: "grey",
                }}
              >
                Posted by {item.username}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  marginTop: 5,
                  color: "grey",
                }}
              >
                Posted on {item.creationDate}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  marginTop: 5,
                  color: "grey",
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
              <Text style={{ fontSize: 18, marginTop: 30 }}>
                {item.content}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
