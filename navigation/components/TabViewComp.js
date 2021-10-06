import React, { useState, useEffect } from "react";
import { Button } from "react-native";

import { View, SafeAreaView, StyleSheet, Text } from "react-native";
import { CheckBox } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import SegmentedControlTab from "react-native-segmented-control-tab";
import fbdata from "./../../firebase";
import Interest from "./../../assets/Interest";


export default function TabViewComp({uid}) {
  const [data, setData] = useState(Interest);
  const [user, setUser] = useState([]);
  const [customSelectedIndex, setCustomSelectedIndex] = useState(0);

  useEffect(() => {
    getData();
  }, []);

  function getData() {
    if (uid !== null) {
      fbdata
        .database()
        .ref("users/" + uid)
        .on("value", (querySnapShot) => {
          let data = querySnapShot.val() ? querySnapShot.val() : {};
          console.log(data);
          setUser(data);
          setData(data['interest'])
        });
    }
  }
  const updateCustomSegment = (index) => {
    setCustomSelectedIndex(index);
  };

  const onChangeBox = (itemSelected) => {
    const newData = data.map((item) => {
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
    setData(newData);
  };
  const renderCheckBox = data.map((item, index) => {
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

  function handleUpdate(){
    // fbdata.database().ref('users/' + uid).set({
    //   interest: data,
    // }, function (error) {
    //   if (error) {
    //     // The write failed...
    //     alert('Lỗi')
    //   } else {
    //     // Data saved successfully!
    //     alert('Thành Công !!!')
    //   }
    // });
  }

  return (
    <SafeAreaView style={stylesSheet.MainContainer}>
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
          tabTextStyle={{ color: "#000000", fontWeight: "bold", fontSize: 16 }}
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
            <Text style={stylesSheet.tabTextStyle}>
              {" "}
              Selected Tab = Put your questions here{" "}
            </Text>
          )}
          {customSelectedIndex === 2 && (
            <Text style={stylesSheet.tabTextStyle}>
              {" "}
              Selected Tab = Put your setting here{" "}
            </Text>
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
              <TouchableOpacity style={stylesSheet.button_submit} >
                <Button title="Update" color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

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
    width: 120,
    borderRadius: 10,
    backgroundColor: "#1067CC",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    alignSelf: "center",
    margin: 50,
  },

  divider: {
    alignSelf: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginTop: 20,
  },
});
