import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, FlatList, 
    Button, TouchableNativeFeedback} from 'react-native';
import fbdata from '../../firebase';


export default function GPostScreen({ navigation }) {   
    const [post, setPost] = useState([]);
    React.useEffect(() => {
        const postRef = fbdata.database().ref("/sa-question").orderByChild("id");
        const OnLoadingListener = questionRef.once("value", (snapshot) => {
          setQList([]);
          snapshot.forEach((childSnapshot) => {
            setQList((QList) => [...QList, childSnapshot.val()]);
            console.log(childSnapshot.val());
          });
        });
        return () => {
          questionRef.off();
        };
      }, []);
    
    
    return(        
        <View style={styles.container}>

            <View style={{flexDirection: 'row', 
                width: '95%', paddingBottom: 15, paddingTop: 15,
                alignItems: 'center', }}>
                <View style={{width: '75%', paddingLeft: 10}}>
                <Text style={styles.italic}>
                    Everyone's grateful for something. Have a 
                    <Text style={styles.bold}> look.</Text>
                </Text> 
                </View>
                <TouchableNativeFeedback>
                    <View style={{width: '25%', padding: 15, 
                        backgroundColor: '#467fcf', borderRadius: 30, 
                        justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 24, color: '#fff', 
                            fontWeight: 'bold'}}>New</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>

            <FlatList
                data={post}
                renderItem={({ item }) => (
                    <View>
                        <TouchableOpacity style = {styles.post}>
                            <Image style={styles.postImage} source={item.imgLoc}/>
                            <Text style={styles.postText}>{item.title}</Text>
                        </TouchableOpacity>
                        <View style={{width: '80%', paddingBottom: 20, paddingTop: 10}}>
                            <Text style={{ alignItems: 'flex-start', paddingLeft: 20, 
                                fontWeight: 'bold', fontSize: 18}}>
                                {item.user}
                            </Text>
                        </View>
                    </View>
                )}
            />

                       
            <StatusBar style="auto" />

        </View>

    );
}
const styles = StyleSheet.create({
        container: {flex: 1, 
            justifyContent: 'space-around', 
            alignItems: 'center'},
        normal: {fontSize: 18, fontStyle:'normal'},
        bold: {fontWeight: 'bold', fontSize: 17},
        italic: {fontStyle: 'italic', fontSize: 17},
        post: {width: 350, height: 250},
        postImage: {width: 350, height: 250, 
            borderColor:"#fff", borderRadius: 35, borderWidth: 4},
        postText: {color: '#fff', fontWeight: 'bold', 
            position:'absolute', padding: 20, fontSize: 18},            
    });

    /*
            <TouchableOpacity style = {styles.post}>
                <Image style={styles.postImage} source={require("../../assets/newYears.jpg")}/>
                <Text style={styles.postText}>Happy New Years!</Text>
            </TouchableOpacity>

            <View style={{width: '80%', paddingBottom: 20, paddingTop: 10}}>
            <Text style={{ alignItems: 'flex-start', fontWeight: 'bold', fontSize: 18}}>
                HHGirl
            </Text>
            </View>

            <TouchableOpacity style = {styles.post}>
                <Image style={styles.postImage} source={require("../../assets/first_pet.jpg")}/>
                <Text style={styles.postText}>Got my first pet!</Text>
            </TouchableOpacity>
*/
/*
<View style={{width: '20%', padding: 10, 
                    backgroundColor: '#467fcf', borderRadius: 30, 
                    justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 21, color: '#fff', fontWeight: 'bold'}}>New</Text>
                </View>

*/