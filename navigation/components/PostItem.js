import * as React from "react";
import styled from "styled-components";
import Textarea from "react-native-textarea";
import { Dimensions, ScrollView , Button} from "react-native";
import LikeButton from './LikeButton'

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";

const BoxContent = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 10px;
  width: 100%;
`;

const BoxImage = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 10px;
  width: 100%;
`;
const ImageContainer = styled(View)`
    position: relative;
    height: 200px;
    border-radius: 10px;
    border: 4px solid #fff;
    margin-top: 10px;
    box-shadow: 2px 2px rgba(0,0,0, 0.2);
`;
export default function PostItem({}) {
  const [text, onChangeText] = React.useState("Useless Text");
  return (
    <View style={styles.container}>
    
      <BoxImage>
        <View style={styles.boxInfo}>
          <Text style={styles.textTitle}>13/08/2020</Text>
          <Text style={styles.textTitle}>Others</Text>
          <Text style={styles.textTitle}>HHGirl</Text>      
        </View>
        <ImageContainer>
          <Image
            source={require("../../assets/opening1.jpg")}
            style={styles.postImage}
          ></Image>
          <Text style={{position: "absolute",fontSize: 26, fontWeight: "bold", color: "#fff", top: 5, left: 5,}}>HAPPY NEW YEAR</Text>
        </ImageContainer>
      </BoxImage>
      <BoxContent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.boxInput}>
            <Textarea
              multiline
              containerStyle={styles.textareaContainer}
              style={styles.textarea}
              onChangeText={onChangeText}
              value = {text}
              //defaultValue={this.state.text}
              maxLength={120}
              placeholder={"Content"}
              placeholderTextColor={"#000000"}
              underlineColorAndroid={"transparent"}    
              accessibilityRole={"keyboardkey"}       
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={{display:"flex", flexDirection:"row-reverse", marginTop: 4}}>
        <LikeButton />
        </View>
        
      </BoxContent>
      
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: width,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
   padding: 10,
  },
  boxInput: {
    width: "100%",
  },
  textareaContainer: {
    height: 300,
    padding: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  textarea: {
    textAlignVertical: "top", // hack android
    height: 170,
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    padding: 5,
  },
  textTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  postImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
   
  },
  boxInfo: {
      display: "flex",
      flexDirection:"row",
      justifyContent: "space-between",
      marginLeft: 5,
      marginRight: 5,
  }
});
