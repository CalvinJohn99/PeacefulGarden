import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, Button, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import RNPickerSelect from "react-native-picker-select";
import { CheckBox } from "react-native-elements";
import { Avatar } from "react-native-elements";
import fbdata from "../../../firebase";
import {
  useCategoryList,
  useAgegroupList,
} from "../../components/CommonFunctions.js";
import commonStyles from "../../../commonStyles.js";
// import Interest from "./../../../assets/Interest";
// import AgeCategories from "./../../../assets/AgeCategories";

const placeholder = {
  label: "Select your age...",
  value: null,
  color: "#9EA0A4",
};

function AccountInterest({ navigation, route }) {
  const { newdata } = route.params;
  // const ageGroupList = useAgegroupList();
  const [checkboxes, setCheckboxes] = useState([]);
  const [age, setAge] = useState(null);
  const [data, setData] = useState({
    uid: "",
    username: "",
    img: "",
    // age: "",
    interest: {},
  });

  useEffect(() => {
    const postCategoryRef = fbdata
      .database()
      .ref("/postCategory/")
      .orderByChild("id");
    const OnLoadingListener = postCategoryRef.once("value", (snapshot) => {
      setCheckboxes([]);
      snapshot.forEach((childSnapshot) => {
        setCheckboxes((checkboxes) => [...checkboxes, childSnapshot.val()]);
      });
    });
    return () => {
      postCategoryRef.off();
    };
  }, []);

  const handleData = (uuid) => {
    data.uid = uuid;
    data.username = newdata.username;
    data.img = newdata.img;
    // data.age = age;
    data.interest = checkboxes;
    setData({ ...data });
  };

  const onChangeBox = (itemSelected, index) => {
    const newData = checkboxes.map((item) => {
      if (item.id === itemSelected.id) {
        return {
          ...item,
          check: !item.check,
        };
      }
      return {
        ...item,
        check: item.check,
      };
    });
    setCheckboxes(newData);
  };

  const renderCheckBox = checkboxes.map((item, index) => {
    return (
      <View style={{ width: "48%" }}>
        <CheckBox
          checkedColor="green"
          checked={item.check}
          title={item.value}
          uncheckedIcon="circle-o"
          checkedIcon="dot-circle-o"
          onPress={() => onChangeBox(item, index)}
          key={index}
        />
      </View>
    );
  });

  async function addProfileAuth() {
    return new Promise(async (res, rej) => {
      const response = await fetch(newdata.img);
      const file = await response.blob();

      let upload = fbdata
        .storage()
        .ref(data.uid + "/")
        .child(data.uid)
        .put(file);

      upload.on(
        "stated_changed",
        (snapshot) => {},
        (err) => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          console.log(url);
          updateProfile(url);
          res(url);
        }
      );
    });
  }

  function updateProfile(url) {
    const update = {
      displayName: data.username,
      photoURL: url,
    };
    fbdata.auth().currentUser.updateProfile(update);
    console.log("1. Add Auth Done!");
  }

  function addRealTimeDatabase() {
    fbdata
      .database()
      .ref("users/" + data.uid)
      .set(
        {
          username: data.username,
          profileImage: data.img,
          // age: data.age,
          interest: data.interest,
          postCount: 0,
          answerCount: 0,
        },
        function (error) {
          if (error) {
            alert("Error!!!");
          }
        }
      );
    console.log("2. Add Realtime Done!");
  }

  function signUp() {
    fbdata
      .auth()
      .createUserWithEmailAndPassword(newdata.email, newdata.password)
      .then(function (user) {
        fbdata.auth().currentUser.sendEmailVerification();
        // console.log("User account created & signed in!");
        handleData(user["user"]["uid"]);
        addRealTimeDatabase();
      })
      .then(() => {
        fbdata.auth().currentUser.updateProfile({
          displayName: data.username,
          photoURL: data.img,
        });

        // console.log(newdata.img);
        // if (newdata.img === null) {
        //   fbdata
        //     .auth()
        //     .currentUser.updateProfile({ displayName: data.username });
        // } else {
        //   addProfileAuth();
        // }
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          alert("This email address has been registered!");
        }
        if (error.code === "auth/invalid-email") {
          alert("The email address is invalid!");
        }
        console.error(error);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: "100%",
          height: "25%",
          backgroundColor: "#00BCD4",
          // flexDirection: "column",
          // alignItems: "center",
          justifyContent: "center",
          paddingLeft: 20,
        }}
      >
        <View style={styles.userInfo}>
          <Avatar
            size="large"
            rounded
            source={{
              uri: `${newdata.img}`,
            }}
          />
          <Text style={{ fontSize: 30, fontWeight: "bold", marginLeft: 20 }}>
            {newdata.username}
          </Text>
        </View>
      </View>

      <View style={commonStyles.answerContainer}>
        {/* <View style={styles.questionForm}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Age Group</Text>
          <RNPickerSelect
            style={pickerSelectStyles}
            onValueChange={(value) => setAge(value)}
            placeholder={placeholder}
            items={ageGroupList}
          />
        </View> */}

        <View style={styles.questionForm}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>
            Interest
          </Text>
          <View style={styles.checkBoxGroup}>{renderCheckBox}</View>
        </View>
        <TouchableOpacity
          style={styles.button_submit}
          onPress={() => {
            signUp();
          }}
        >
          {/* <Button title="Next" color="#fff" /> */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default AccountInterest;

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
    backgroundColor: "white",
  },
  userInfo: {
    marginBottom: 30,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  questionForm: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "95%",
    marginVertical: 30,
    marginHorizontal: 20,
  },

  button_submit: {
    height: 50,
    width: 130,
    borderRadius: 14,
    backgroundColor: "#00BCD4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    marginTop: 20,
  },
  checkBoxGroup: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
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
