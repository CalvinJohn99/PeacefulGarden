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
  FlatList,
  Modal,
} from "react-native";
import { Audio } from "expo-av";
import { FontAwesome5 } from "@expo/vector-icons";
import fbdata from "../../firebase.js";
import commonStyles from "../../commonStyles.js";
import PlayMusic from "../components/PlayMusic.js";

// export function RelaxMusicScreen({ navigation }) {
//   const [isToggleOn, setIsToggleOn] = React.useState(false);
//   const [sound, setSound] = React.useState();

//   async function playSound() {
//     console.log("Loading Sound");
//     const { sound } = await Audio.Sound.createAsync(
//       require("../../assets/relaxM.mp3")
//     );
//     setSound(sound);

//     console.log("Playing Sound");
//     await sound.playAsync();
//   }

//   async function pauseSound() {
//     await sound.pauseAsync();
//     // setSound(!sound);
//   }

//   React.useEffect(() => {
//     return sound
//       ? () => {
//           console.log("Unloading Sound");
//           sound.unloadAsync();
//         }
//       : undefined;
//   }, [sound]);

//   function handleClick() {
//     if (isToggleOn) {
//       setIsToggleOn(false);
//       pauseSound();
//     } else {
//       setIsToggleOn(true);
//       playSound();
//     }
//   }

//   return (
//     <View style={styles.box2}>
//       <ImageBackground
//         source={require("../../assets/1.jpg")}
//         resizeMode="cover"
//         style={styles.image}
//       >
//         {/* <Button title="Play Sound" onPress={playSound} />

//         <Button title="Pause Sound" onPress={pauseSound} /> */}
//         <TouchableOpacity
//           style={styles.playMusic}
//           onPress={() => {
//             handleClick();
//           }}
//         >
//           {isToggleOn ? (
//             <FontAwesome5 name="pause-circle" size={80} color="white" />
//           ) : (
//             <FontAwesome5 name="play-circle" size={80} color="white" />
//           )}
//         </TouchableOpacity>
//       </ImageBackground>
//     </View>
//   );
// }

// export function PianoMusicScreen({ navigation }) {
//   const [sound, setSound] = React.useState();

//   async function playSound() {
//     console.log("Loading Sound");
//     const { sound } = await Audio.Sound.createAsync(
//       require("../../assets/pianoM.mp3")
//     );
//     setSound(sound);

//     console.log("Playing Sound");
//     await sound.playAsync();
//   }

//   async function pauseSound() {
//     await sound.pauseAsync();
//   }

//   React.useEffect(() => {
//     return sound
//       ? () => {
//           console.log("Unloading Sound");
//           sound.unloadAsync();
//         }
//       : undefined;
//   }, [sound]);

//   return (
//     <View style={styles.box2}>
//       <ImageBackground
//         source={require("../../assets/2.jpg")}
//         resizeMode="cover"
//         style={styles.image}
//       >
//         <Button title="Play Sound" onPress={playSound} />

//         <Button title="Pause Sound" onPress={pauseSound} />
//       </ImageBackground>
//     </View>
//   );
// }

// export function RainDropMusicScreen({ navigation }) {
//   const [sound, setSound] = React.useState();

//   async function playSound() {
//     console.log("Loading Sound");
//     const { sound } = await Audio.Sound.createAsync(
//       require("../../assets/rainM.mp3")
//     );
//     setSound(sound);

//     console.log("Playing Sound");
//     await sound.playAsync();
//   }

//   async function pauseSound() {
//     await sound.pauseAsync();
//   }

//   React.useEffect(() => {
//     return sound
//       ? () => {
//           console.log("Unloading Sound");
//           sound.unloadAsync();
//         }
//       : undefined;
//   }, [sound]);

//   return (
//     <View style={styles.box2}>
//       <ImageBackground
//         source={require("../../assets/3.jpg")}
//         resizeMode="cover"
//         style={styles.image}
//       >
//         <Button title="Play Sound" onPress={playSound} />

//         <Button title="Pause Sound" onPress={pauseSound} />
//       </ImageBackground>
//     </View>
//   );
// }

// export function MedMusicScreen({ navigation }) {
//   const [sound, setSound] = React.useState();

//   async function playSound() {
//     console.log("Loading Sound");
//     const { sound } = await Audio.Sound.createAsync(
//       require("../../assets/medM.mp3")
//     );
//     setSound(sound);

//     console.log("Playing Sound");
//     await sound.playAsync();
//   }

//   async function pauseSound() {
//     await sound.pauseAsync();
//   }

//   React.useEffect(() => {
//     return sound
//       ? () => {
//           console.log("Unloading Sound");
//           sound.unloadAsync();
//         }
//       : undefined;
//   }, [sound]);

//   return (
//     <View style={styles.box2}>
//       <ImageBackground
//         source={require("../../assets/4.jpg")}
//         resizeMode="cover"
//         style={styles.image}
//       >
//         <Button title="Play Sound" onPress={playSound} />

//         <Button title="Pause Sound" onPress={pauseSound} />
//       </ImageBackground>
//     </View>
//   );
// }

// export function SleepMusicScreen({ navigation }) {
//   const [sound, setSound] = React.useState();

//   async function playSound() {
//     console.log("Loading Sound");
//     const { sound } = await Audio.Sound.createAsync(
//       require("../../assets/sleepM.mp3")
//     );
//     setSound(sound);

//     console.log("Playing Sound");
//     await sound.playAsync();
//   }

//   async function pauseSound() {
//     await sound.pauseAsync();
//   }

//   React.useEffect(() => {
//     return sound
//       ? () => {
//           console.log("Unloading Sound");
//           sound.unloadAsync();
//         }
//       : undefined;
//   }, [sound]);

//   return (
//     <View style={styles.box2}>
//       <ImageBackground
//         source={require("../../assets/5.jpg")}
//         resizeMode="cover"
//         style={styles.image}
//       >
//         <Button title="Play Sound" onPress={playSound} />

//         <Button title="Pause Sound" onPress={pauseSound} />
//       </ImageBackground>
//     </View>
//   );
// }

export default function MusicScreen({ navigation }) {
  const [musicList, setMusicList] = useState();

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

  return (
    <SafeAreaView style={commonStyles.pageContainer}>
      <FlatList
        style={{ top: 20, width: "100%" }}
        data={musicList}
        renderItem={({ item }) => <PlayMusic music={item} />}
        keyExtractor={(item) => item.id.toString()}
      ></FlatList>
    </SafeAreaView>
  );

  // return (
  //   <SafeAreaView style={commonStyles.pageContainer}>
  //     <FlatList
  //       style={{ top: 20, width: "100%" }}
  //       data={musicList}
  //       renderItem={({ item: music }) => (
  //         <View>
  //           <TouchableOpacity
  //             style={styles.musicButton}
  //             onPress={() => {
  //               navigation.navigate("Music", {
  //                 screen: "PlayMusic",
  //                 params: { music },
  //               });
  //             }}
  //           >
  //             <ImageBackground
  //               source={{ uri: music.imageURL }}
  //               resizeMode="cover"
  //               style={{ width: "100%", height: "100%" }}
  //             >
  //               <Text style={styles.musicName}>{music.name}</Text>
  //             </ImageBackground>
  //           </TouchableOpacity>
  //         </View>
  //       )}
  //       keyExtractor={(item) => item.id.toString()}
  //     ></FlatList>
  //   </SafeAreaView>
  // );
}

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
