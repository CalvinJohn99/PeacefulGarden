// @refresh state
import * as React from "react";
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import useCurrentDate, {
  useAccountUsername,
  useAccountUserid,
} from "../components/CommonFunctions";
import fbdata from "../../firebase.js";
import commonStyles from "../../commonStyles.js";
import PostList from "../components/PostList.js";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function GPostScreen({ navigation }) {
  const currentDate = useCurrentDate();
  const [currentUserID, setCurrentUserID] = useState(null);
  const [userInterest, setUserInterest] = useState([]);

  useEffect(() => {
    __isTheUserAuthenticated();
  }, []);

  function __isTheUserAuthenticated() {
    const userId = fbdata.auth().currentUser.uid;
    setCurrentUserID(userId);
    if (userId !== null) {
      fbdata
        .database()
        .ref("/users/" + userId + "/interest/")
        .on("value", (snapshot) => {
          setUserInterest([]);
          snapshot.forEach((childSnapshot) => {
            setUserInterest((userInterest) => [
              ...userInterest,
              childSnapshot.val(),
            ]);
          });
        });
    }
  }

  const renderItem = ({ item: interestItem }) => {
    if (interestItem.check) {
      return (
        <View style={{ marginBottom: 30 }}>
          <PostList interestItem={interestItem} />
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={commonStyles.pageContainer}>
      <View
        style={{
          flexDirection: "row",
          marginBottom: 20,
          width: "100%",
          // height: "7%",
          marginTop: 20,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ paddingLeft: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {currentDate}
          </Text>
        </View>
        <View style={{ paddingRight: 20 }}>
          <TouchableOpacity
            style={{
              // backgroundColor: "#F3B000",
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 20,
            }}
            onPress={() => {
              navigation.navigate("Post", { screen: "CreatePost" });
            }}
          >
            {/* <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
              Create Post
            </Text> */}
            <Ionicons name="add-circle" size={60} color="#f3b000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marinTop: 50 }}>
        <FlatList
          data={userInterest}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        ></FlatList>
      </View>
    </SafeAreaView>
  );
}
