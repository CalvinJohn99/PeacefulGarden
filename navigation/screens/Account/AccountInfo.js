import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View, Button } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CheckBox } from "react-native-elements";
import SegmentedControlTab from "react-native-segmented-control-tab";
import fbdata from "../../../firebase";
import Interest from "../../../assets/Interest";
import { Avatar } from "react-native-elements";
import QuestByAcc from "./QuestByAcc.js";

function AccountInfo() {
  const [user, setUser] = useState([]);
  const [uid, setUid] = useState("");
  const [interest, setInterest] = useState(Interest);
  const [customSelectedIndex, setCustomSelectedIndex] = useState(0);

  useEffect(() => {
    __isTheUserAuthenticated();
  }, []);

  function __isTheUserAuthenticated() {
    const userId = fbdata.auth().currentUser.uid;
    setUid(userId);
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
      <CheckBox
        checkedColor="green"
        checked={item.check}
        title={item.value}
        uncheckedIcon="circle-o"
        checkedIcon="dot-circle-o"
        onPress={() => onChangeBox(item, index)}
        key={index}
      />
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topInfo}>
        <View style={styles.userInfo}>
          <Avatar
            size="large"
            rounded
            source={{
              uri: `${user["img"]}`,
            }}
          />
          <Text
            style={{ fontSize: 20, fontWeight: "bold", marginHorizontal: 10 }}
          >
            {user["username"]}
          </Text>
        </View>
        <TouchableOpacity
          style={stylesSheet.button_submit}
          onPress={() => {
            handleSignOut();
          }}
        >
          <Button title="Logout" color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={stylesSheet.MainContainer}>
        <View style={stylesSheet.MainContainer}>
          <SegmentedControlTab
            borderRadius={10}
            badges={[40, 36]}
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
            activeTabStyle={{ backgroundColor: "#1067CC" }}
            tabTextStyle={{
              color: "#000000",
              fontWeight: "bold",
              fontSize: 16,
            }}
            activeTabTextStyle={{ color: "#fff", fontSize: 16 }}
          />
          <View style={stylesSheet.contentStyle}>
            {customSelectedIndex === 0 && (
              <Text style={stylesSheet.tabTextStyle}>
                {" "}
                Selected Tab = Put your posts here{" "}
              </Text>
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
              <View>
                <Text style={stylesSheet.tabTextStyle}>
                  {" "}
                  Selected Tab = Put your setting here{" "}
                </Text>
                <TouchableOpacity>
                  <Text>change color to red</Text>
                </TouchableOpacity>
              </View>
            )}
            {customSelectedIndex === 3 && (
              <View>
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
                  <Button title="Update" color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default AccountInfo;

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
    backgroundColor: "#1067CC",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    color: "white",
    marginHorizontal: 20,
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
    backgroundColor: "#1067CC",
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
