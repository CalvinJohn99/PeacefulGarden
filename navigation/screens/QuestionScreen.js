import * as React from 'react';
import { useState, useEffect} from "react";
import {SafeAreaView, View, FlatList, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';

import fbdata from '../../firebase.js';

import useCurrentDate from '../components/CommonFunctions.js';


const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity
    style={[styles.item, backgroundColor]}
    onPress={onPress}
    >
        <Text style={[styles.question, textColor]}> {item.id}. {item.question} </Text>
    </TouchableOpacity>
  );


export default function QuestionScreen({navigation}) {

    const [QList, setQList] = useState([]);
    React.useEffect(() => {
      const questionRef = fbdata.ref('/sa-question').orderByChild('id');
      const OnLoadingListener = questionRef.once('value', snapshot => {
        setQList([]);
        snapshot.forEach((childSnapshot) => {
          setQList(QList=>[...QList,childSnapshot.val()]);
          console.log(childSnapshot.val());
        });
      });
      return () => {
        questionRef.off();
      }
    },[]);

    const [selectedId, setSelectedId] = useState(null);

    const renderItem = ({ item }) => {

      const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#B6E4CB";
      const color = item.id === selectedId ? 'white' : 'black';
      return (
          <Item 
              item={item}
              onPress={() => setSelectedId(item.id)}
              backgroundColor={{backgroundColor}}
              textColor={{color}}
          />
      );
    };

    const currentDate = useCurrentDate();

    return(
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={{top: 10, fontWeight: "bold", fontSize: 26}}> {currentDate} </Text>
            </View>
          
            <FlatList
                style={{top: 20}}
                data={QList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                extraData={selectedId}
            />
            {/*
            <TouchableOpacity
                style={{backgroundColor: "#1067CC", padding: 20}}
                //onPress={() => navigation.navigate('Post')}
                >
                    <Text style={{textAlign: 'center', fontWeight: 'bold', color: 'white'}}>More Questions?</Text>
            </TouchableOpacity> */}
            
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 20, 
        alignItems: 'center',
    },
    item: {
        margin: 20,
        padding: 20,
        backgroundColor: "#B6E4CB",
        borderRadius: 20,
    },
    question: {
        fontSize: 26,
        textAlign: 'center', 
        fontWeight: 'bold'
    }
});