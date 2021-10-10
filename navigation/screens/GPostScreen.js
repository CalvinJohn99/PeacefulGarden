import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, FlatList, 
    Button, TouchableNativeFeedback} from 'react-native';
import fbdata from '../../firebase';

import Interest from "../../assets/Interest";
import useCurrentDate, {
    useAccountUsername,
  } from "../components/CommonFunctions.js";
  import LikeButton from "../components/LikeButton";  

export default function GPostScreen({ navigation }) {
    
    const userId = fbdata.auth().currentUser.uid;
    const [interest, setInterest] = useState([]);
    const [Post, setPost] = useState([]);
    const [InterestingPost, setInterestingPost] = useState([]);

    React.useEffect(() => {

        const postRef = fbdata.database()
            .ref("/posts/").orderByChild("negTimestamp");
        const OnLoadingListener = postRef.on("value", (snapshot) => {
            setPost([]);
            snapshot.forEach((childSnapshot) => {
                setPost((Post) => [...Post, childSnapshot.val()]);
                console.log(childSnapshot.val());
            });
        });

        console.log(userId);
        const interestRef = fbdata.database()
            .ref("/users/" + userId + "/" + "interest/");
        const interestListener = interestRef.on("value", (snapshot) => {
            setInterest([]);
            snapshot.forEach((childSnapshot) => {
                setInterest((interest) => [...interest, childSnapshot.val()]);
            });
        });  

        console.log(interest);

        setInterestingPost([]);
        Post.forEach((post) => {
            interest.forEach((userInterest) => {
                if (post.category === userInterest.value) {
                    if (userInterest.check === true) {
                        setInterestingPost((InterestingPost) => 
                            [...InterestingPost, post]);
                        console.log(post);
                        //break;
                    }
                    //break;
                }
            })
        })
/*
        for (var aPost in Post) {
            for (var anInterest in interest) {
                if (aPost["category"] !== anInterest["value"]) {
                    continue;
                }
                if (interest["check"] === true) {
                    setInterestingPost((InterestingPost) => 
                        [...InterestingPost, aPost]);
                        console.log(aPost);
                        break;
                }
                break;
            }
        }  */  
        return () => {
            interestRef.off();
            postRef.off();
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
                data={InterestingPost}
                renderItem={({ item }) => (
                    
                        <View>
                            <TouchableOpacity style = {styles.post}>
                                <Image style={styles.postImage} source={{uri: item.imageURL}}/>
                                <Text style={styles.postText}>{item.title}</Text>
                            </TouchableOpacity>
                            <View style={{width: '80%', paddingBottom: 20, paddingTop: 10}}>
                                <Text style={{ alignItems: 'flex-start', paddingLeft: 20, 
                                    fontWeight: 'bold', fontSize: 18}}>
                                    {item.username}
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
        post: {width: 375, height: 250},
        postImage: {width: 375, height: 250, 
            borderColor:"#fff", borderRadius: 30, borderWidth: 4},
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

/*
for (var Post in Posts) {
    for (var interest in interests) {
        if (Post["category"] !== interest["value"]) {
            continue;
        }
        if (interest["check"] === true) {
            setInterestingPosts((InterestingPosts) => 
                [...InterestingPosts, Post]);
                console.log(Post);
        }
        break;
    }
}*/
