import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Button,
  View,
  Image,

} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import RNPickerSelect from "react-native-picker-select";
import { CheckBox } from "react-native-elements";
import fbdata from "../../../firebase";
const Interest = [
  { id: 1, value: "Tech", check: false },
  { id: 2, value: "Cook", check: false },
  { id: 3, value: "Movie", check: false },
  { id: 4, value: "Music", check: false },
  { id: 5, value: "Gardening", check: false },
  { id: 6, value: "Travel", check: false },
  { id: 7, value: "Dog", check: false },
  { id: 8, value: "Hiking", check: false },
];
const AgeCategories = [
  { label: "16-20", value: "16-20" },
  { label: "21-25", value: "21-25" },
  { label: "26-30", value: "26-30" },
  { label: "31-35", value: "31-35" },
];

function AccountAge({ navigation, route }) {
  const [checkboxes, setCheckboxes] = useState(Interest);
  const [age, setAge] = useState(null);
  const [uidtemp, setUidtemp] = useState(null);
  const [data, setData] = useState({
    uid: "",
    username: "",
    password: "",
    email: "",
    answer1: "",
    answer2: "",
    age: "",
    interest: {},
  });
  const placeholder = {
    label: "Select your age...",
    value: null,
    color: "#9EA0A4",
  };
  const { newdata } = route.params;
  
  // This function using for adding to database realtime
  const handleSignUp = (uuid) => {
    data.uid = uuid,
    data.username = newdata.username;
    data.password = newdata.password;
    data.email = newdata.email;
    data.answer1 = newdata.answer1;
    data.answer2 = newdata.answer2;
    data.age = age;
    data.interest = selected.map((item) => item.value);
    setData({ ...data });
    console.log(data);
  };
  const toggleCheckbox = (id) => {
    let temp = checkboxes.map((checkbox) => {
      if (id === checkbox.id) {
        return { ...checkbox, check: !checkbox.check };
      }
      return checkbox;
    });
    setCheckboxes(temp);
  };
  let selected = checkboxes.filter((checkbox) => checkbox.check);

  const renderCheckBox = Interest.map((item) => {
    return (
      <TouchableOpacity key={item.id} onPress = {() => {
        toggleCheckbox(item.id)
      }}>
        <CheckBox
          checked={item.check}
          title= {item.value}
        />
      </TouchableOpacity>
    );
  });
  const renderSelected = selected.map((item) => {
    return <Text style={{marginHorizontal: 5, fontWeight: "bold"}}>{item.value}</Text>;
  });

  function addDataBase() {
    fbdata.database().ref("users/" + data.uid).set(
      {
        username: data.username,
        email: data.email,
        password: data.password,
        answer1: data.answer1,
        answer2: data.answer2,
        age: data.age,
        interest: data.interest,
      },
      function (error) {
        if (error) {
          // The write failed...
          alert("Lỗi");
        } else {
          // Data saved successfully!
          alert("Thành Công !!!");
        }
      }
    );
  }

  function signUp(email, password) {
  fbdata.auth()
    .createUserWithEmailAndPassword(newdata.email, newdata.password)
    .then(function (user) {
    console.log('User account created & signed in!');
    handleSignUp(user["user"]["uid"]);
    addDataBase();
     })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }

      console.error(error);
    });
}

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>
          {newdata.username}
        </Text>
        <Image
          style={{ width: 80, height: 80, borderRadius: 50, borderWidth: 1 }}
          source={require("./../../../assets/opening1.jpg")}
        />
      </View>
      <View style={styles.questionForm}>
        <Text style={{ fontSize: 16, fontWeight: "normal" }}>Age</Text>
        <RNPickerSelect
          style={pickerSelectStyles}
          onValueChange={(value) => setAge(value)}
          placeholder={placeholder}
          items={AgeCategories}
        />
      </View>
      <View style={styles.questionForm}>
        <Text style={{ fontSize: 16, fontWeight: "normal" }}>Interest</Text>
        <View style={styles.checkBoxGroup}>
          {renderCheckBox}
          {renderSelected}
        </View>
      </View>
      <TouchableOpacity
        style={styles.button_submit}
        onPress={() => {
          signUp()
          navigation.navigate("AccountThank");
        }}
      >
        <Button title="Next" color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default AccountAge;

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
  userInfo: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionForm: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginVertical: 30,
  },

  button_submit: {
    height: 40,
    width: 120,
    borderRadius: 14,
    backgroundColor: "#17CAF1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  checkBoxGroup: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  profileimage: {
    width: "100%",
    height: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#60C8ED",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
    marginVertical: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
