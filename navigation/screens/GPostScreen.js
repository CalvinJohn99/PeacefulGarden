// @refresh state
import * as React from "react";
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import fbdata from "../../firebase.js";
import commonStyles from "../../commonStyles.js";
// import components
import useCurrentDate from "../components/CommonFunctions";
import PostList from "../components/PostList.js";

// View Post Screen
export default function GPostScreen({ navigation }) {
  // call useCurrentDate function, return date in the format "day fullmonth fullyear"
  const currentDate = useCurrentDate();
  // useState Variable: userInterest
  // hold user interest list
  const [userInterest, setUserInterest] = useState([]);

  useEffect(() => {
    __isTheUserAuthenticated();
  }, []);

  // read uesr interest list from firebase
  function __isTheUserAuthenticated() {
    const userId = fbdata.auth().currentUser.uid;
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

  // render user interest category
  const renderItem = ({ item: interestItem }) => {
    if (interestItem.check) {
      return (
        <View style={{ marginBottom: 30 }}>
          {/* called PostList component, 
              pass the variable interestItem */}
          <PostList interestItem={interestItem} />
        </View>
      );
    }
  };

  // render view
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
        {/* Plus new function */}
        <View style={{ paddingRight: 20 }}>
          <TouchableOpacity
            style={{
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 20,
            }}
            onPress={() => {
              navigation.navigate("Post", { screen: "CreatePost" });
            }}
          >
            <Ionicons name="add-circle" size={60} color="#f3b000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* render interest category flatlist, using renderItem component */}
      <View
        style={{
          marinTop: 10,
          paddingBottom: 120,
          width: "96%",
        }}
      >
        <FlatList
          data={userInterest}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        ></FlatList>
      </View>
    </SafeAreaView>
  );
}
