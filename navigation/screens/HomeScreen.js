import * as React from "react";
import { useState, useEffect } from "react";
import { View, ImageBackground } from "react-native";
import { useOpeningNum } from "../components/CommonFunctions";
import fbdata from "../../firebase.js";

// Home Screen of Peaceful Garden
// Render random image background
export default function HomeScreen({ navigation }) {
  // useState variable: openingImageURL, initialised as ""
  const [openingImageURL, setOpeningImageURL] = useState("");
  // called userOpeningNum function from CommonFunctions, which return the number of opening image in firebase
  const num = useOpeningNum();

  // once focus: trigger useEffect hook
  // create a random variable between 1 and the number of opening images in firebase, inclusive,
  // read an opening image url based on the random number generated
  // assign it to the variable openingImageURL
  useEffect(() => {
    navigation.addListener("focus", () => {
      setOpeningImageURL("");
      const index = Math.floor(Math.random() * num) + 1;
      console.log("opening image photo number: ", index);
      const openingImageRef = fbdata
        .database()
        .ref("/OpeningImage/" + index + "/url/");
      const OnLoadingListener = openingImageRef.once("value", (snapshot) => {
        setOpeningImageURL(snapshot.val().toString());
      });
      return () => {
        openingImageRef.off();
      };
    });
  }, []);

  // useEffect(() => {
  //   const index = Math.floor(Math.random() * num) + 1;
  //   const openingImageRef = fbdata
  //     .database()
  //     .ref("/OpeningImage/" + index + "/url/");
  //   const OnLoadingListener = openingImageRef.once("value", (snapshot) => {
  //     setOpeningImageURL(snapshot.val().toString());
  //   });
  //   return () => {
  //     openingImageRef.off();
  //   };
  // }, []);

  // render view
  return (
    <View>
      {/* render a image background covered the entire mobile phone */}
      <ImageBackground
        source={{
          uri: openingImageURL ? openingImageURL : null,
        }}
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
      ></ImageBackground>
    </View>
  );
}
