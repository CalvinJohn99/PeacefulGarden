import * as React from 'react';
import { useState, useEffect} from "react";
import {SafeAreaView, View, FlatList, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';

import firebase from "firebase/app";
import 'firebase/database';

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMUuAhdumTGYMSVuWjRQmKSRKJhONusAg",
  authDomain: "peacefulgarden-a4b5c.firebaseapp.com",
  databaseURL: "https://peacefulgarden-a4b5c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "peacefulgarden-a4b5c",
  storageBucket: "peacefulgarden-a4b5c.appspot.com",
  messagingSenderId: "595789693308",
  appId: "1:595789693308:web:6c2e1faf2651b5c8e924f9",
  measurementId: "G-45KC4GX795"
};

// initialize firebase
// expo will create the database whenever we save the file. In order to avoid the duplicates of database creation and errors, we use an if condition to control that.
if(firebase.apps.length === 0) {
firebase.initializeApp(firebaseConfig);
}

// Get a database reference
const fbdata = firebase.database();

function readQuestion() {
  var SAQdata = fbdata.ref('sa-question/').orderByChild('id');
  var questionList = [];

  SAQdata.once('value').then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
      questionList.push(childSnapshot.val());
      console.log(childSnapshot.val());
    });
  }).catch((error) => {
    console.error(error);
  });

  /*
  SAQdata.once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      questionList.push(childSnapshot.val());
    });
  }); */

  return questionList;
}


/*
const QDATA = [
    { id: '1',
      Question: 'When am I at my best?',
    },
    { id: '2',
      Question: 'What kind of person do I want to be today?',
    },
    { id: '3',
      Question: 'What situation make me feel terrible, and what do they have in common?',
    },
    { id: '4',
      Question: 'What activities am I doing when it feels like time flies by?',
    },
    { id: '5',
      Question: 'What is working well in my life and work today?',
    },
    { id: '6',
      Question: 'If i had a magic wand, how would my life be better in 3 months?',
    },
    { id: '7',
      Question: 'If I change nothing, what will your life look like three months from now? How does this make me feel?',
    },
    { id: '8',
      Question: 'What actions, if taken, would make me proud of myself, regardless of the outcome?',
    },
    { id: '9',
      Question: 'When negative thoughts arise, how do I deal with them?',
    },
    { id: '10',
      Question: 'How do I stay grounded when I feel overwhelmed?',
    },
    { id: '11',
      Question: 'What motivates me to make progress?',
    },
  ];
*/

const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity
    style={[styles.item, backgroundColor]}
    onPress={onPress}
    >
        <Text style={[styles.question, textColor]}> {item.id}. {item.question} </Text>
    </TouchableOpacity>
  );


export default function QuestionScreen({navigation}) {

    const [currentDate, setCurrentDate] = useState(null);
    useEffect(() => {
      var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      var TodayDate = new Date().getDate();
      var TodayMonthWord = months[new Date().getMonth()];
      var TodayYear = new Date().getFullYear();
      setCurrentDate(
          TodayDate + ' ' + TodayMonthWord + ' ' + TodayYear
      );
  }, []);
    
    const [selectedId, setSelectedId] = useState(null);

    //var questiondata = readQuestion();

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

    return(
        <SafeAreaView style={styles.container}>
          
          
            <View>
                <Text style={{top: 10, fontWeight: "bold", fontSize: 26}}> {currentDate} </Text>
            </View>
          
            
          
           
            <FlatList
                style={{top: 20}}
                data={readQuestion()}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
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