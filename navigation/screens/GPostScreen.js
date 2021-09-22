import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button, ActivityIndicator, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import LandingScreen from './components/auth/landing';

const firebaseConfig = {
  apiKey: "AIzaSyCji-K8sqfIZWvHKz0cWhD3CJzrJwQv2Fg",
  authDomain: "image-picker-de811.firebaseapp.com",
  databaseURL: "https://image-picker-de811-default-rtdb.firebaseio.com",
  projectId: "image-picker-de811",
  storageBucket: "image-picker-de811.appspot.com",
  messagingSenderId: "519256811097",
  appId: "1:519256811097:web:271d79d05d564993d17348"
};

if(firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

/*
const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen name="Landing" component={LandingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}*/


LogBox.ignoreLogs(['Setting a timer for a long period']);

export default function App() {

  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  // https://github.com/expo/expo/issues/2402
  const uploadImage = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', image, true);
      xhr.send(null);
    });

    const ref = firebase.storage().ref().child(new Date().toISOString())
    const snapshot = ref.put(blob)

    snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED, 
    () => {
      setUploading(true)
    },
    (error) => {
      setUploading(false)
      console.log(error)
      blob.close()
      return;
    },
    () => {
      snapshot.snapshot.ref.getDownloadURL().then((url) => {
        setUploading(false)
        console.log("download url", url)
        blob.close();
        return url;
      });
    }
    );
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={{width:350, height: 250}} />
      <Button title="choose picture" onPress={pickImage} />
      {!uploading?<Button title="upload" onPress={uploadImage} />:<ActivityIndicator size="large" color="#000"/>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
