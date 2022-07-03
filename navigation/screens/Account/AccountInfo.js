import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
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
  // set user information
  const [user, setUser] = useState([]);
  const [uid, setUid] = useState("");
  const [image, setImage] = useState(Avatar_Default);
  const [username, setUserName] = useState("");
  const [interest, setInterest] = useState([]);
  // set initial index of custom tab
  const [customSelectedIndex, setCustomSelectedIndex] = useState(3);
  const [verify, setVerify] = useState(false);
  const [isLoading, setShowLoading] = useState(false);
  // hold new email input by user
  const [updateEmail, setUpdateEmail] = useState(null);
  // show password reset message based on "verify"
  const [showResetMessage, setShowResetMessage] = useState(false);

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

  // sign out account
  function handleSignOut() {
    fbdata
      .auth()
      .signOut()
      .then(() => {
        console.log("User signed out!");
      });
  }

  // handle update of interest category
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

  // handle resend verificatino email
  function handleSendVerifyEmail() {
    fbdata.auth().currentUser.sendEmailVerification();
  }

  // handle update email address
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

  // handle reset password
  async function handleResetPassword() {
    if (verify) {
      const registeredEmail = fbdata.auth().currentUser.email;
      try {
        await fbdata.auth().sendPasswordResetEmail(registeredEmail);
        setShowResetMessage(true);
        await sleep(3000);
        handleSignOut();
      } catch (e) {
        Alert.alert("Please enter your registered email to reset password!");
        console.log(e);
      }
    } else {
      Alert.alert("Please verify your email before reset password!");
    }
  }

  // update the selected custom segment
  const updateCustomSegment = (index) => {
    setCustomSelectedIndex(index);
  };

  // handle check box valueOnChange
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

  // render check box
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

  // render view
  return (
    <SafeAreaView style={styles.container}>
      {/* user information and sign out section */}
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

      {/* 4 segment tabs */}
      <View style={stylesSheet.MainContainer}>
        <View style={stylesSheet.MainContainer}>
          <SegmentedControlTab
            borderRadius={10}
            badges={[user["postCount"], user["answerCount"]]}
            values={["Post", "Q&A", "Setting", "Interest"]}
            selectedIndex={customSelectedIndex}
            onTabPress={updateCustomSegment}
            tabsContainerStyle={{
              height: 50,
            }}
            tabStyle={{
              backgroundColor: "white",
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
            activeTabTextStyle={{ color: "white", fontSize: 16 }}
          />

          <View style={stylesSheet.contentStyle}>
            {/* view and edit account post */}
            {customSelectedIndex === 0 && (
              <View style={{ flex: 1, alignItems: "center", top: 10 }}>
                <PostByAcc username={user["username"]} userID={uid} />
              </View>
            )}

            {/* view and edit account answer */}
            {customSelectedIndex === 1 && (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  top: 10,
                }}
              >
                <QuestByAcc />
              </View>
            )}

            {/* change account setting */}
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

            {/* update account interest category */}
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

                <Text
                  style={{ marginLeft: 15, marginTop: 20, color: "#00BCD4" }}
                >
                  *Post feed is based on the selected interest category.
                </Text>
                <Text
                  style={{ marginLeft: 15, marginTop: 10, color: "#00BCD4" }}
                >
                  *Interest categories can be amended in setting after login.
                </Text>
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
    backgroundColor: "#f2f2f2",
  },
  topInfo: {
    backgroundColor: "white",
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
    backgroundColor: "#f2f2f2",
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
    backgroundColor: "white",
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
    backgroundColor: "#F2F2F2",
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
