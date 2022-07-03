import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, FlatList } from "react-native";
import fbdata from "../../firebase.js";
import commonStyles from "../../commonStyles.js";
import PlayMusic from "../components/PlayMusic.js";

// Music Screens
// List different type of music in a flat list
export default function MusicScreen({ navigation }) {
  // create a useState variable, initialised as null
  const [musicList, setMusicList] = useState();

  // read music date (imageURL and musicURL) from firebase, and put into the array musicList
  useEffect(() => {
    const musicRef = fbdata.database().ref("/relaxingMusic").orderByChild("id");
    const OnLoadingListener = musicRef.once("value", (snapshot) => {
      setMusicList([]);
      snapshot.forEach((childSnapshot) => {
        setMusicList((musicList) => [...musicList, childSnapshot.val()]);
      });
    });
    return () => {
      musicRef.off();
    };
  }, []);

  // render view
  return (
    <SafeAreaView style={commonStyles.pageContainer}>
      <FlatList
        style={{ top: 20, width: "100%", marginBottom: 50 }}
        data={musicList}
        // render each music item
        // called component <PlayMusic>
        // pass variable music item as music={item}
        renderItem={({ item }) => <PlayMusic music={item} />}
        keyExtractor={(item) => item.id.toString()}
      ></FlatList>
    </SafeAreaView>
  );
}

// Style Sheet
const styles = StyleSheet.create({
  musicButton: {
    height: 200,
    margin: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  musicName: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: 84,
    alignSelf: "center",
    textAlign: "center",
  },

  box2: {
    flex: 1,
    // borderWidth: 3,
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
  },

  playMusic: {
    alignSelf: "center",
    shadowColor: "white",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 9,
  },
});
