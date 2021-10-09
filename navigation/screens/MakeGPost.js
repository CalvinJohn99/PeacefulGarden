import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {ScrollView, View, Text, TextInput, StyleSheet, Button, Alert, ActivityIndicator, Image, Platform, } from 'react-native';
import { Picker } from '@react-native-community/picker';
import useCurrentDate, { useAccountUsername, }
    from "../components/CommonFunctions.js";
import * as ImagePicker from 'expo-image-picker';

import firebase from 'firebase';
import 'firebase/database';
import 'firebase/storage';
import firebaseConfig from '../../firebase';
import fbdata from "../../firebase.js";

if(firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

function storePost(category, title, content, imageURL, 
    username, date) {
    var newPostKey = firebase.database().ref("posts/").push().key;
    var dataToSave = {
      id: newPostKey,
      category: category,
      title: title,
      content: content, imageURL: imageURL, 
      username: username, date: date, 
      timestamp: {
        ".sv": "timestamp",
      },
    };
    var updates = {};
    updates["/posts/" + newPostKey] = dataToSave;
    // fbdata.ref('qanswer/' + question + '/' + key).set(dataToSave);
  
    return firebase.database().ref().update(updates, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Post data successfuly uploaded.");
        updateNegTimestamp(newPostKey);
      }
    });
}

function updateNegTimestamp(key) {
    const timeRef = firebase.database()
      .ref("/posts/" + key + "/timestamp/");
    const negTimeRef = firebase.database()
      .ref("/posts/" + key + "/");
    timeRef.once("value", (snapshot) => {
      var negTimestampValue = snapshot.val() * -1;
      console.log(negTimestampValue);
      negTimeRef.update({ negTimestamp: negTimestampValue });
    });
}  

export default function GPostScreen() {
        
    const [image, setImage] = useState("");
    const [uploading, setUploading] = useState(false);  
    
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryValue, setCategoryValue] = useState("Others");
    const currentDate = useCurrentDate();
    const username = useAccountUsername();

    const [errorStatus, setErrorStatus] = useState(false);

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

    const makePost = async () => {
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
                if (title === ""  || content === ""
                    || image === "" ) {
                    setErrorStatus(true);
                } else {
                    storePost(categoryValue, title, content, 
                        url, username, currentDate);
                        alert("Successfully posted!");
                }

                return url;
            });
        }
        );

    };    

    return(
    
    <ScrollView contentContainerStyle={styles.container}>

        <View style={{flexDirection: 'row', marginBottom: 20,
                width: '100%', height: '7%', marginTop: 10,
                alignItems: 'center', justifyContent: 'space-between', }}>
            <View style={{ paddingLeft: 20}}>
                <Text style={styles.textStyle}>13 Aug 2021</Text>
            </View>
            <View style={{paddingRight: 20}}>
                <Text style={styles.textStyle}>uqpf</Text>
            </View>
        </View>

        <View style={{width: '95%', justifyContent: 'space-around',
            marginBottom: 40, marginLeft: 20, marginRight: 20,
            padding: 15, backgroundColor: '#dbf0ff', borderRadius: 20}}>

            <View style={{width: '100%', marginBottom: 25}}>
                <Text style={styles.header}>Category</Text>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <View style={styles.dropDown}>
                        <Picker
                        selectedValue={categoryValue}
                        style={{ marginLeft: 10, height: 30, width: '100%'}}
                        onValueChange={(itemValue, itemIndex) => setCategoryValue(itemValue)}>
                            <Picker.Item label="Hiking" value="Hiking" />
                            <Picker.Item label="Tech" value="Tech" />
                            <Picker.Item label="Travel" value="Travel" />
                            <Picker.Item label="Gardening" value="Gardening" />
                            <Picker.Item label="Cook" value="Cook" />
                            <Picker.Item label="Movie" value="Movie" />
                            <Picker.Item label="Music" value="Music" />
                            <Picker.Item label="Dog" value="Dog" />
                        </Picker>
                    </View>
                </View>
            </View>

            <View style={{width: '100%', marginBottom: 25, 
                alignItems: 'center'}}>
                <Text style={[styles.header, 
                    {paddingRight: 292}]}>Title</Text>
                <TextInput style={[styles.input, {paddingTop: 0}]}
                    numberOfLines={1}
                    onChangeText={text => setTitle(text)}
                    value={title}
                    placeholder="Enter title here..."
                    />
            </View>

            <View style={{width: '100%', marginBottom: 25,
                }}>
                <Text style={[styles.header, 
                    {paddingRight: 260}]}>Content</Text>
                <TextInput style={[styles.input, {height: 150,
                    borderRadius: 20, textAlignVertical: 'top'}]}
                    multiline={true}
                    editable={true}
                    autofocus={true}        
                    onChangeText={text => setContent(text)}
                    value={content}
                    placeholder="Enter Content here..."
                    />
            </View>

            <View style={{width: '100%', alignItems: 'center'}}>
                <Text style={[styles.header, 
                    {paddingRight: 279, paddingBottom: 10}]}>Photo</Text>
                <Image source={{ uri: image }} style={styles.postImage} />

                <Button title="choose picture" onPress={pickImage} />
           </View>
        </View>

        <View style={{marginBottom: 25, width: '95%', 
            flexDirection: 'row', alignItems: 'center',
            justifyContent: 'space-around'}}>
            <Text style={{color: 'red', width: 200}}>
                *This post will be made public once you "post" it!</Text>
            {!uploading?<Button title="Post" onPress={makePost} />:<ActivityIndicator size="large" color="#000"/>}
        </View>
        <StatusBar style="auto" />

    </ScrollView>   
    );
}

  const styles = StyleSheet.create({
    container: {
        //flex:1,
        justifyContent: 'space-around',
        alignItems: 'center',
/*        backgroundColor: "#fff",
        padding: 20,
        margin: 10,*/
    }, 
    header: {
      color: 'black',
      fontSize:20,
      fontWeight: 'bold',
      paddingLeft: 10
    },  
    dropDown: {
      alignItems: "center",
      backgroundColor: '#fff',
      borderRadius: 10,
      marginTop: 10,
      width: '98%',
    },
     input: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        height: 30,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: 10,
        width: '98%',
    },
    textStyle:{
      fontSize: 18,
      color:'black',
      fontWeight: 'bold' 
    },
    postImage: {width: 375, height: 250, 
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 35, 
        borderWidth: 4},
        marginTop: 10
 })