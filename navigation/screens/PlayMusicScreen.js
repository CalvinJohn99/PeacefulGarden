import * as React from "react";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  Touchable,
  FlatList,
} from "react-native";
import { Audio } from "expo-av";
import { FontAwesome5 } from "@expo/vector-icons";

export default function playMusicScreen({ navigation, route }) {
  const { music } = route.params;
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [sound, setSound] = useState();

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync({ uri: music.musicURL });
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  async function pauseSound() {
    await sound.pauseAsync();
    // setSound(!sound);
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  function handleClick() {
    if (isToggleOn) {
      setIsToggleOn(false);
      pauseSound();
    } else {
      setIsToggleOn(true);
      playSound();
    }
  }

  return (
    <View style={styles.box2}>
      <ImageBackground
        source={{ uri: music.imageURL }}
        resizeMode="cover"
        style={styles.image}
      >
        <TouchableOpacity
          style={styles.playMusic}
          onPress={() => {
            handleClick();
          }}
        >
          {isToggleOn ? (
            <FontAwesome5 name="pause-circle" size={80} color="white" />
          ) : (
            <FontAwesome5 name="play-circle" size={80} color="white" />
          )}
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 20,
    margin: 10,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: 84,
    textAlign: "center",
  },
  box: {
    flex: 0.3,
    // borderWidth: 3,
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
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
