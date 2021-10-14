import React, { useState, useEffect } from "react";
import {
  Button,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  View,
  Platform,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Animatable from "react-native-animatable";
import Feather from "react-native-vector-icons/Feather";
import * as ImagePicker from 'expo-image-picker';
import RandomImage from "./../../components/RandomImage";
import { Avatar } from "react-native-elements";

export default function SignupForm({ navigation }) {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const [check_textInputChange, setCheck_textInputChange] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isValidUser, setIsValidUser] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(true);
  const [img, setImg] = useState(null);
  const [imgName, setImgName] = useState(null);
  const [data, setData] = useState({
    username: "",
    password: "",
    email: "",
    img: "",
    imgName: "",
  });
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
      const filename = result.uri.substring(result.uri.lastIndexOf('/') + 1);
     
      setImg(result.uri);
      setImgName(filename);
    }
   
};
  const handleSignUp = () => {
    if(username === null || 
      password === null || 
      email === null || 
      isValidConfirmPassword === false) {
      alert("Please fill your information.")
    } else {
    data.username = username;
    data.password = password;
    data.email = email;
    data.img = img;
    data.imgName = imgName;
    setData({ ...data });
    console.log(data);
    navigation.navigate("AccountQuestion", { data: data });
    }
    
  };
  const textInputChange = (val) => {
    if (val.trim().length >= 4) {
      setUsername(val);
      setCheck_textInputChange(true);
      setIsValidUser(true);
    } else {
      setUsername(val);
      setCheck_textInputChange(false);
      setIsValidUser(false);
    }
  };
  const handlePasswordChange = (val) => {
    if (val.trim().length >= 8) {
      setPassword(val);
      setIsValidPassword(true);
    } else {
      setPassword(val);
      setIsValidPassword(false);
    }
  };

  const handleConfirmPassword = (val) => {
    if (val === password) {
      setIsValidConfirmPassword(true);
    } else {
      setIsValidConfirmPassword(false);
    }
  };
  const updateSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  const handleValidUser = (val) => {
    if (val.trim().length >= 4) {
      setIsValidUser(true);
    } else {
      setIsValidUser(false);
    }
  };

  // const handleImg = (imgValue) => {
  //   setImg("https://unsplash.it/150/200?image=" + imgValue);
  //   console.log(img);
  // };

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
    <Text style={styles.title}>Register</Text>
    <Text style={styles.text}>Please fill in a few details below</Text>
      <View style={styles.action}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => {
            setEmail(text);
          }}
          value={email}
        />
      </View>

      <View style={styles.action}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={secureTextEntry ? true : false}
          autoCapitalize="none"
          onChangeText={(val) => handlePasswordChange(val)}
        />
        <TouchableOpacity onPress={updateSecureTextEntry}>
          {secureTextEntry ? (
            <Feather name="eye-off" color="grey" size={20} />
          ) : (
            <Feather name="eye" color="grey" size={20} />
          )}
        </TouchableOpacity>
      </View>

      {isValidPassword ? null : (
        <Animatable.View animation="fadeInLeft" duration={500}>
          <Text style={styles.errorMsg}>
            Password must be 8 characters long.
          </Text>
        </Animatable.View>
      )}
      <View style={styles.action}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={secureTextEntry ? true : false}
          autoCapitalize="none"
          onChangeText={(val) => handleConfirmPassword(val)}
        />
      </View>
      {isValidConfirmPassword ? null : (
        <Animatable.View animation="fadeInLeft" duration={500}>
          <Text style={styles.errorMsg}>
            Password does not match.
          </Text>
        </Animatable.View>
      )}

      <View style={styles.action}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          onChangeText={(val) => textInputChange(val)}
          onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
        />
        {check_textInputChange ? (
          <Animatable.View animation="bounceIn">
            <Feather name="check-circle" color="green" size={20} />
          </Animatable.View>
        ) : null}
      </View>
      {isValidUser ? null : (
        <Animatable.View animation="fadeInLeft" duration={500}>
          <Text style={styles.errorMsg}>
            Username must be 4 characters long.
          </Text>
        </Animatable.View>
      )}
      <Button title="Choose your profile picture" onPress={pickImage} />
      {img ? (
        <Avatar
            size="large"
            rounded
            source={{
              uri: `${img}`,
            }}
          />
      ) : null}
      <TouchableOpacity
        style={styles.button_submit}
        onPress={() => { handleSignUp();}}
      >
        <Button title="Next" color="#fff" />
      </TouchableOpacity>      
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    alignSelf: "flex-start"
  },
  text: {
    fontSize: 18,
    fontWeight: "normal",
    color: "#000000",
    alignSelf: "flex-start",
    marginVertical: 10,
  },
  action: {
    flexDirection: "row",
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  input: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
    fontSize: 18,
  },
  button_submit: {
    height: 50,
    width: 130,
    borderRadius: 14,
    backgroundColor: "#17CAF1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    marginVertical: 20,
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 12,
  },
});
