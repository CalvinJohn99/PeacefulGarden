import * as React from "react";
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  View,
  ActivityIndicator,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import fbdata, { fbstorage } from "../../firebase.js";
//import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";

export default function JournalMoodScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageURL, setImageURL] = useState(" ");

  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        // const { status2 } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
        // if (status2 !== "granted") {
        //   alert("Sorry, we need camera roll permissions to make this work!");
        // }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    // There is an issue with visual studio code that
    //
    if (!result.cancelled) {
      setImage(result.uri);
      console.log({ image });
    }

    // if (result.cancelled === false) {
    //   setImage({ localUri: result.uri });
    //   console.log(image);
    //   console.log(result.uri);
    // }
  };

  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const uploadImage = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });

    const uploadRef = fbstorage.ref("/post/").child(new Date().toISOString());
    const uploadTask = uploadRef.put(blob);

    uploadTask.on(
      "state_changed",
      () => {
        setUploading(true);
      },
      (error) => {
        setUploading(false);
        console.log(error);
        blob.close();
        return;
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          setUploading(false);
          const imageDownloadURL = url;
          console.log("download url", url);
          console.log("imageDownloadURL: ", imageDownloadURL);
          blob.close();
          fbdata.ref("/post/").push({
            imageURL1: imageDownloadURL,
            imageURL2: url,
            test: 1,
          });
          return url;
        });
      }
    );
  };

  const uploadPost = async () => {
    const imageRemoteURL = await uploadImage();
    console.log("image remote url: ", imageRemoteURL);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Text
        onPress={() => navigation.navigate("Home")}
        styles={{ fontSize: 26, fontWeigt: "bold" }}
      >
        Personal Journal and Mood Tracker Screen
      </Text>

      <Image source={{ uri: image }} style={{ width: 350, height: 250 }} />

      {/* <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {image && (
          <Image source={{ uri: image }} sytle={{ width: 200, height: 200 }} />
        )}
      </View> */}

      <TouchableOpacity
        style={{
          backgroundColor: "#B6E4CB",
          justifyContent: "center",
          alignItems: "center",
          margin: 10,
          padding: 10,
          borderRadius: 20,
          width: "80%",
          height: 100,
        }}
        onPress={pickImage}
      >
        <Text style={{ fontWeight: "bold", fontSize: 22 }}>Choose Picture</Text>
      </TouchableOpacity>

      {/* <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        )}
      </View> */}

      {!uploading ? (
        <TouchableOpacity
          style={{
            backgroundColor: "#B5CBDF",
            justifyContent: "center",
            alignItems: "center",
            margin: 10,
            padding: 10,
            borderRadius: 20,
            width: "80%",
            height: 100,
          }}
          onPress={uploadPost}
        >
          <Text style={{ fontWeight: "bold", fontSize: 22 }}>
            Submit Picture
          </Text>
        </TouchableOpacity>
      ) : (
        <ActivityIndicator size="large" color="#000" />
      )}

      {/* <TouchableOpacity
        style={{
          backgroundColor: "#B5CBDF",
          justifyContent: "center",
          alignItems: "center",
          margin: 10,
          padding: 10,
          borderRadius: 20,
          width: "80%",
          height: 100,
        }}
        onPress={uploadImage}
      >
        <Text style={{ fontWeight: "bold", fontSize: 22 }}>Submit Picture</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
}
