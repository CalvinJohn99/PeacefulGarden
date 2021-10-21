import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {ScrollView, View, Text, TextInput, StyleSheet, Button, Alert, ActivityIndicator, Image, Platform, } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import 'firebase/database';
import 'firebase/storage';


export default function UploadImage() {
        
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
            setImage(Platform.OS === 'ios' ? result.uri.replace('file://', '') : result.uri);
        }
        console.log(Image)
    };

  

    return(
    
    <ScrollView contentContainerStyle={styles.container}>
        <View style={{width: '95%', justifyContent: 'space-around',
            marginBottom: 40, marginLeft: 20, marginRight: 20,
            padding: 15, backgroundColor: '#dbf0ff', borderRadius: 20}}>
                <Image source={{ uri: image }} style={styles.postImage} />
                <Button title="choose picture" onPress={pickImage} />
         
        </View>
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