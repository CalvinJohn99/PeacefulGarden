import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, Button, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CheckBox } from "react-native-elements";
import { Avatar } from "react-native-elements";
import fbdata from "../../../firebase";
import commonStyles from "../../../commonStyles.js";

// choose account interest category and sign up account with firebase authentication
function AccountInterest({ navigation, route }) {
  // receive data passed from Signup Form
  const { newdata } = route.params;
  // interest category
  const [checkboxes, setCheckboxes] = useState([]);
  // set userdata
  const [data, setData] = useState({
    uid: "",
    username: "",
    img: "",
    interest: {},
  });

  // read interest category from firebase
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

  // set user data
  const handleData = (uuid) => {
    data.uid = uuid;
    data.username = newdata.username;
    data.img = newdata.img;
    data.interest = checkboxes;
    setData({ ...data });
  };

  // handle onchange of checkbox value
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

  // render checkbox
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

  // store user information in firebase realtime database
  function addRealTimeDatabase() {
    fbdata
      .database()
      .ref("users/" + data.uid)
      .set(
        {
          username: data.username,
          profileImage: data.img,
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

  // handle sign up, create account
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

  // render view
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: "100%",
          height: "25%",
          backgroundColor: "#00BCD4",
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
        <View style={styles.questionForm}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>
            Interest
          </Text>
          <Text style={{ marginLeft: 15, marginTop: 20, color: "#00BCD4" }}>
            *Post feed is based on the selected interest category.
          </Text>
          <Text style={{ marginLeft: 15, marginTop: 10, color: "#00BCD4" }}>
            *Interest categories can be amended in setting after login.
          </Text>
          <View style={styles.checkBoxGroup}>{renderCheckBox}</View>
        </View>
        <TouchableOpacity
          style={styles.button_submit}
          onPress={() => {
            signUp();
          }}
        >
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
