import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Image, Button, ActivityIndicator, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Picker } from '@react-native-community/picker';

import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';

const firebaseConfig = {
  apiKey: "AIzaSyBvxZ3XGNOmsp1vXdM4Lh-Wcai2fe8ECNQ",
  authDomain: "gratefulness-posts.firebaseapp.com",
  databaseURL: "https://gratefulness-posts-default-rtdb.firebaseio.com",
  projectId: "gratefulness-posts",
  storageBucket: "gratefulness-posts.appspot.com",
  messagingSenderId: "204123862413",
  appId: "1:204123862413:web:52aa285ef04de2ccb639c4"
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


// LogBox.ignoreLogs(['Setting a timer for a long period']);


export default function GPostScreen() {

  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [value, onChangeText] = useState();
  const [selectedValue, setSelectedValue] = useState("java");

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

      <View style={{flexDirection:'row'}}>
        <Text style={[styles.textStyle,]}>13 Aug 2021</Text>
        <Text style={[styles.textStyle,{textAlign:'right'}]}>uqpf</Text>
      </View>
      
      <Text style={styles.header}>Category</Text>
      <View style={styles.dropDown}>
        <Picker
        selectedValue={selectedValue}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        >
        <Picker.Item label="Football" value="Football" />
        <Picker.Item label="Hiking" value="Hiking" />
        <Picker.Item label="Computer Game" value="Computer game" />
        <Picker.Item label="Others" value="Others" />
        </Picker>
      </View>

      <Text style={styles.header}>Title</Text>

      <TextInput style={styles.input}
      numberOfLines={4}
      onChangeText={text => onChangeText(text)}
      value={value}
      placeholder="title"
      />

      <Text style={styles.header}>Photo</Text>



      <Button
      title="Confirm Thoughts"
      onPress={() => Alert.alert('Simple Button pressed')}
      />


      <Image source={{ uri: image }} style={styles.postImage} />
      <Button title="choose picture" onPress={pickImage} />
      {!uploading?<Button title="upload" onPress={uploadImage} />:<ActivityIndicator size="large" color="#000"/>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "#fff",
    padding: 20,
    margin: 10,
  }, 
  header: {
    backgroundColor: 'lightblue',
    color: 'black',
    fontSize:30,
  },  
  dropDown: {
    flex: 0.4,
    alignItems: "center",
  },
  input: {
  backgroundColor: 'white',
  flex: 0.3,
  },
  textStyle:{
    fontSize: 25,
    color:'black', 
    padding:20,
  },
  normal: {fontSize: 18, fontStyle:'normal'},
  bold: {fontWeight: 'bold', fontSize: 17},
  italic: {fontStyle: 'italic', fontSize: 17},
  post: {width: 350, height: 250},
  postImage: {width: 350, height: 250, 
      borderColor:"lightblue", borderRadius: 35, borderWidth: 4},
  postText: {color: '#fff', fontWeight: 'bold', 
      position:'absolute', padding: 20, fontSize: 18},            
});
