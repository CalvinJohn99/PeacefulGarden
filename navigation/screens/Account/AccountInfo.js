import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CheckBox } from "react-native-elements";
import SegmentedControlTab from "react-native-segmented-control-tab";
import fbdata from "../../../firebase";
import Avatar_Default from "../../../assets/Avatar_Default.png";
import { Avatar } from "react-native-elements";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input } from "react-native-elements";
import QuestByAcc from "./QuestByAcc.js";
import PostByAcc from "./PostByAcc";
import * as Animatable from "react-native-animatable";

const sleep = (m) => new Promise((r) => setTimeout(r, m));

export default function AccountInfo(props) {
  const [user, setUser] = useState([]);
  const [uid, setUid] = useState("");
  const [image, setImage] = useState(Avatar_Default);
  const [username, setUserName] = useState("");
  const [interest, setInterest] = useState([]);
  const [customSelectedIndex, setCustomSelectedIndex] = useState(3);
  const [verify, setVerify] = useState(false);
  const [isLoading, setShowLoading] = useState(false);
  const [updateEmail, setUpdateEmail] = useState(null);
  const [updateUserName, setUpdateUserName] = useState(null);
  const [showResetMessage, setShowResetMessage] = useState(false);

  // useEffect(() => {
  //   setShowLoading(true);
  //   __isTheUserAuthenticated();
  // }, []);

  useEffect(() => {
    props.navigation.addListener("focus", () => {
      setShowLoading(true);
      __isTheUserAuthenticated();
      setCustomSelectedIndex(3);
    });
  }, []);

  function __isTheUserAuthenticated() {
    const userId = fbdata.auth().currentUser.uid;
    setUid(userId);
    setImage(fbdata.auth().currentUser.photoURL);
    setUserName(fbdata.auth().currentUser.displayName);
    setVerify(fbdata.auth().currentUser.emailVerified);

    if (userId !== null) {
      fbdata
        .database()
        .ref("users/" + userId)
        .on("value", (querySnapShot) => {
          let userinfo = querySnapShot.val() ? querySnapShot.val() : {};
          setUser(userinfo);
          setInterest(userinfo["interest"]);
        });
    }
    setShowLoading(false);
  }

  function handleSignOut() {
    fbdata
      .auth()
      .signOut()
      .then(() => {
        console.log("User signed out!");
      });
  }

  function handleUpdate() {
    fbdata
      .database()
      .ref("users/" + uid)
      .update(
        {
          interest: interest,
        },
        function (error) {
          if (error) {
            // The write failed...
            alert("Error");
          } else {
            // Data saved successfully!
            alert("Update successful !!!");
          }
        }
      );
  }

  function handleSendVerifyEmail() {
    fbdata.auth().currentUser.sendEmailVerification();
  }

  async function handleUpdateUsername() {
    const auth = fbdata.auth();
    try {
      await auth.currentUser.updateProfile({ displayName: updateUserName });
      __isTheUserAuthenticated();
      console.log("Username updated!");
      // await sleep(3000);
      // handleSignOut();
    } catch (err) {
      console.log(err);
      alert(err);
    }
  }

  async function handleUpdateEmail() {
    const auth = fbdata.auth();
    try {
      await auth.currentUser.updateEmail(updateEmail);
      console.log("Email updated!");
      alert("Email updated!! Please sign in again");
      await sleep(3000);
      handleSignOut();
    } catch (err) {
      console.log(err);
      alert(err);
    }
  }

  async function handleResetPassword() {
    if (verify) {
      const registeredEmail = fbdata.auth().currentUser.email;
      // console.log(registeredEmail);
      try {
        await fbdata.auth().sendPasswordResetEmail(registeredEmail);
        setShowResetMessage(true);
        await sleep(3000);
        handleSignOut();
      } catch (e) {
        Alert.alert("Please enter your registered email to reset password!");
        console.log(e);
        // Alert.alert(e.message);
      }
    } else {
      Alert.alert("Please verify your email before reset password!");
    }
  }

  const updateCustomSegment = (index) => {
    setCustomSelectedIndex(index);
  };

  const onChangeBox = (itemSelected) => {
    const newData = interest.map((item) => {
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
    setInterest(newData);
  };

  const renderCheckBox = interest.map((item, index) => {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topInfo}>
        <View style={styles.userInfo}>
          <Avatar
            containerStyle={{ borderWidth: 3, borderColor: "white" }}
            size="large"
            rounded
            source={{
              uri: `${image}`,
            }}
          />

          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              marginHorizontal: 10,
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginVertical: 5 }}
            >
              {username}
            </Text>
            {verify ? (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <AntDesign name="checkcircle" color="green" size={12} />
                <Text style={{ color: "green", fontSize: 12 }}>
                  {" "}
                  Verified Email
                </Text>
              </View>
            ) : (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome name="warning" color="red" size={12} />
                  <Text style={{ color: "red", fontSize: 12 }}>
                    {" "}
                    Please verify your email
                  </Text>
                </View>
                <TouchableOpacity
                  style={{ marginVertical: 5 }}
                  onPress={() => handleSendVerifyEmail()}
                >
                  <Text>Send Again</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={stylesSheet.button_submit}
          onPress={() => {
            handleSignOut();
          }}
        >
          {/* <Button title="Logout" color="#fff" /> */}
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "grey" }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
      <View style={stylesSheet.MainContainer}>
        <View style={stylesSheet.MainContainer}>
          <SegmentedControlTab
            borderRadius={10}
            badges={[user["postCount"], user["answerCount"]]}
            values={["Post", "Quest", "Setting", "Interest"]}
            selectedIndex={customSelectedIndex}
            onTabPress={updateCustomSegment}
            tabsContainerStyle={{
              height: 50,
            }}
            tabStyle={{
              backgroundColor: "#F0F0F0",
              borderWidth: 0,
              borderColor: "transparent",
              borderRadius: 10,
              marginHorizontal: 4,
            }}
            activeTabStyle={{ backgroundColor: "#00BCD4" }}
            tabTextStyle={{
              color: "#000000",
              fontWeight: "bold",
              fontSize: 16,
            }}
            activeTabTextStyle={{ color: "#fff", fontSize: 16 }}
          />
          <View style={stylesSheet.contentStyle}>
            {customSelectedIndex === 0 && (
              <View style={{ flex: 1, alignItems: "center", top: 10 }}>
                <PostByAcc username={user["username"]} userID={uid} />
              </View>
              // <Text style={stylesSheet.tabTextStyle}>
              //   {" "}
              //   Selected Tab = Put your posts here{" "}
              // </Text>
            )}
            {customSelectedIndex === 1 && (
              // <Text style={stylesSheet.tabTextStyle}>
              //   {" "}
              //   Selected Tab = Put your questions here{" "}
              // </Text>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  top: 10,
                  // justifyContent: "center",
                }}
              >
                <QuestByAcc />
              </View>
            )}
            {customSelectedIndex === 2 && (
              <ScrollView
                contentContainerStyle={{
                  paddingBottom: 100,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "95%",
                    paddingVertical: 20,
                  }}
                >
                  <View>
                    <Text style={styles.text}>Username</Text>
                    <Input
                      placeholder={fbdata.auth().currentUser.displayName}
                      autoCapitalize="none"
                      onChangeText={(value) => setUpdateUserName(value)}
                      value={updateUserName}
                    />

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        handleUpdateUsername();
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color: "white",
                        }}
                      >
                        Update
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ marginTop: 30 }}>
                    <Text style={styles.text}>Email</Text>
                    <Input
                      placeholder={fbdata.auth().currentUser.email}
                      autoCapitalize="none"
                      onChangeText={(value) => setUpdateEmail(value)}
                      value={updateEmail}
                    />

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        handleUpdateEmail();
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color: "white",
                        }}
                      >
                        Update
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ marginTop: 30 }}>
                    <Text style={styles.text}>Password</Text>
                    <Text style={{ marginTop: 5, marginLeft: 10 }}>
                      Reset password via registered email
                    </Text>
                    {showResetMessage && (
                      <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>
                          Check your email box to reset your password!
                        </Text>
                      </Animatable.View>
                    )}
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        handleResetPassword();
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color: "white",
                        }}
                      >
                        Reset
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
            {customSelectedIndex === 3 && (
              <ScrollView
                contentContainerStyle={{
                  paddingBottom: 100,
                }}
              >
                <View style={stylesSheet.wrapperText}>
                  <Text style={stylesSheet.headerText}>Interest</Text>
                  <Text style={stylesSheet.subText}>Multi-selection</Text>
                </View>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {renderCheckBox}
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    handleUpdate();
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    Update
                  </Text>
                </TouchableOpacity>

                <Text style={{ marginLeft: 15, marginTop: 20 }}>
                  *Post will shown based on the interest category selected.
                </Text>

                {/* <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "95%",
                    marginTop: 50,
                    paddingVertical: 20,
                  }}
                >
                  <Text style={styles.text}>Username</Text>
                  <Input
                    placeholder={fbdata.auth().currentUser.displayName}
                    autoCapitalize="none"
                    onChangeText={(value) => setUpdateUserName(value)}
                    value={updateUserName}
                  />

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      handleUpdateUsername();
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      Update
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.text}>Email</Text>
                  <Input
                    placeholder={fbdata.auth().currentUser.email}
                    autoCapitalize="none"
                    onChangeText={(value) => setUpdateEmail(value)}
                    value={updateEmail}
                  />

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      handleUpdateEmail();
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      Update
                    </Text>
                  </TouchableOpacity>
                </View> */}
              </ScrollView>
            )}
          </View>
        </View>
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
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: "#fff",
  },
  topInfo: {
    backgroundColor: "#f2f2f2",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  userInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  button: {
    height: 50,
    width: 130,
    borderRadius: 14,
    backgroundColor: "#F3B000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    color: "white",
    marginHorizontal: 20,
    marginTop: 20,
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
  tabview: {
    backgroundColor: "#000000",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  errorMsg: {
    marginTop: 10,
    marginLeft: 10,
    color: "green",
    fontSize: 14,
  },
});

const stylesSheet = StyleSheet.create({
  MainContainer: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    width: "100%",
  },
  contentStyle: {
    marginTop: 10,
    backgroundColor: "#f2f2f2",
    width: "100%",
    height: "90%",
  },

  titleText: {
    fontSize: 22,
    color: "#000",
    textAlign: "center",
    padding: 8,
  },

  tabTextStyle: {
    padding: 20,
    color: "#000",
    fontSize: 18,
  },
  wrapperText: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    height: 50,
  },
  headerText: {
    fontSize: 20,
    color: "#000",
    textAlign: "left",
    fontWeight: "bold",
    padding: 8,
  },
  subText: {
    fontSize: 15,
    color: "#000",
    textAlign: "left",
    fontWeight: "normal",
    padding: 8,
  },
  button_submit: {
    height: 40,
    width: 100,
    borderRadius: 14,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    alignSelf: "center",
  },

  divider: {
    alignSelf: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginTop: 20,
  },
});
