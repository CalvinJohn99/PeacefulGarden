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

function AccountAge({ navigation }) {
  const placeholder = {
    label: "Select your age...",
    value: null,
    color: "#9EA0A4",
  };

  const [checkboxes, setCheckboxes] = useState(Interest);
  const Interest = [
    { id: 1, value: "Tech", check: false },
    { id: 2, value: "Cook", check: false },
    { id: 3, value: "Movie", check: false },
    { id: 4, value: "Music", check: false },
    { id: 5, value: "Gardening", check: false },
    { id: 6, value: "Travel", check: false },
    { id: 7, value: "Dog", check: false },
    { id: 8, value: "HIking", check: false },
  ];
  const toggleCheckbox = (id) => {
    const data = checkboxes;
    const index = data.findIndex((x) => x.id === id);
    data[index].check = !data[index].check;
    setCheckboxes(data);
  };
 const renderCheckBox = Interest.map((item, key) => {
      return (
        <TouchableOpacity key={key} onPress={() => toggleCheckbox(item.id)}>
          <CheckBox
            left
            title={item.value}  
            checked= {item.check}
          />
        </TouchableOpacity>
      );
    });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>John Henry</Text>
        <Image
          style={{ width: 80, height: 80, borderRadius: 50, borderWidth: 1 }}
          source={require("./../../../assets/opening1.jpg")}
        />
      </View>
      <View style={styles.questionForm}>
        <Text style={{ fontSize: 16, fontWeight: "normal" }}>Age</Text>
        <RNPickerSelect
          style={pickerSelectStyles}
          onValueChange={(value) => console.log(value)}
          placeholder={placeholder}
          items={[
            { label: "16-20", value: "16-20" },
            { label: "21-25", value: "21-25" },
            { label: "26-30", value: "26-30" },
            { label: "31-35", value: "31-35" },
          ]}
        />
      </View>
      <View style={styles.questionForm}>
        <Text style={{ fontSize: 16, fontWeight: "normal" }}>Interest</Text>
        <View style={styles.checkBoxGroup}>
            {renderCheckBox}
        </View>
      </View>
      <TouchableOpacity
        style={styles.button_submit}
        onPress={() => navigation.navigate("AccountThank")}
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
