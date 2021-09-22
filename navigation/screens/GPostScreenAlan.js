import * as React from 'react';
import {View, Text, TextInput, StyleSheet, Button, Alert , Platform, Picker, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, SafeAreaView} from 'react-native';





const textInput = (props) => {
    return (
      <TextInput
        {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
        editable
        maxLength={1000}
      />
    );
  }


export default function JournalMoodScreen({navigation}) {

    const [value, onChangeText] = React.useState();

    const [selectedValue, setSelectedValue] = React.useState("java");

    return(

    
    <SafeAreaView style={styles.container}>

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

  </SafeAreaView>   
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
 })