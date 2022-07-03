import * as React from "react";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Audio } from "expo-av";
import { FontAwesome5 } from "@expo/vector-icons";
import commonStyles from "../../commonStyles.js";

// play music component
// receive music from Music Screen
// open music in a modal overlay
// play and stop funcitons are implemented
export default function PlayMusic(props) {
  // receive music from Music Screen
  const music = props.music;
  // useState variable: isToggleOn, to handle the button click status
  const [isToggleOn, setIsToggleOn] = useState(false);
  // useState variable: sound, to hold the sound track
  const [sound, setSound] = useState();
  // useState variable: modalVisible, to toggle modal visibility, true is visible, false is invisible
  const [modalVisible, setModalVisible] = useState(false);

  // play music function
  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync({ uri: music.musicURL });
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  // pause music function
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

  // handle touchable icon
  // initial state of isToggleOn is false
  // click play, setIsToggleOn(true)
  // click pause, setIsToggleOn(false)
  function handleClick() {
    if (isToggleOn) {
      setIsToggleOn(false);
      pauseSound();
    } else {
      setIsToggleOn(true);
      playSound();
    }
  }

  // render view
  return (
    <View>
      {/* touchable item holding music item */}
      <TouchableOpacity
        style={styles.musicButton}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <ImageBackground
          source={{ uri: music.imageURL }}
          resizeMode="cover"
          style={{ width: "100%", height: "100%" }}
        >
          <Text style={styles.musicName}>{music.name}</Text>
        </ImageBackground>
      </TouchableOpacity>

      {/* open when the music item is clicked */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={commonStyles.modalFirstView}>
          <View style={styles.playMusicContainer}>
            <ImageBackground
              source={{ uri: music.imageURL }}
              resizeMode="cover"
              style={{ width: "100%", height: "100%" }}
            >
              <TouchableOpacity
                style={{ position: "absolute", top: 45, right: 25 }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <FontAwesome5 name="times" size={40} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.playMusic}
                onPress={() => {
                  handleClick();
                }}
              >
                {/* false: show play button
                    true: show stop button */}
                {isToggleOn ? (
                  <FontAwesome5 name="stop-circle" size={80} color="white" />
                ) : (
                  <FontAwesome5 name="play-circle" size={80} color="white" />
                )}
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// style sheet
const styles = StyleSheet.create({
  playMusicContainer: {
    width: "100%",
    height: "100%",
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
  },

  playMusic: {
    alignSelf: "center",
    marginTop: "80%",
    shadowColor: "white",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 9,
  },

  musicButton: {
    height: 200,
    margin: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  musicName: {
    marginTop: 60,
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: 84,
    alignSelf: "center",
    textAlign: "center",
  },
});
