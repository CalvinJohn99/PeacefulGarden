// @refresh state
import * as React from "react";
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import useCurrentDate, {
  getCurrentDateString,
} from "../components/CommonFunctions.js";
import { FontAwesome5 } from "@expo/vector-icons";
import fbdata from "../../firebase.js";
import commonStyles from "../../commonStyles.js";
import EditMoodInput from "../components/EditMoodInput.js";

export default function ViewMood({ navigation, route }) {
  const { currentUsername, day } = route.params;
  const currentDate = useCurrentDate();
  const [moodList, setMoodList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    const moodRef = fbdata
      .database()
      .ref("/Mood/" + currentUsername + "/" + day.dateString)
      .orderByChild("negTimestamp");
    const moodListener = moodRef.on("value", (snapshot) => {
      setMoodList([]);
      snapshot.forEach((childSnapshot) => {
        setMoodList((moodList) => [...moodList, childSnapshot.val()]);
      });
    });
    return () => {
      moodRef.off("value", moodListener);
    };
  }, []);

  // const renderItem = ({ item }) => {
  //   return (
  //     <View>
  //       <TouchableOpacity
  //         style={{
  //           width: "90%",
  //           marginVertical: 20,
  //           display: "flex",
  //           flexDirection: "row",
  //           alignSelf: "center",
  //           backgroundColor: "white",
  //           // borderWidth: 2,
  //           // borderColor: "grey",
  //           borderRadius: 20,
  //           shadowColor: "grey",
  //           shadowOffset: {
  //             width: 5,
  //             height: 5,
  //           },
  //           shadowOpacity: 0.36,
  //           shadowRadius: 10,
  //           elevation: 9,
  //         }}
  //         onLongPress={() => {
  //           setModalVisible(true);
  //         }}
  //         activeOpacity={0.6}
  //       >
  //         <FontAwesome5
  //           name={item.moodFontAwesome5Icon}
  //           size={40}
  //           color={item.color}
  //           style={{ flex: 1, marginLeft: 10, marginVertical: 10 }}
  //         />
  //         <Text
  //           style={{
  //             flex: 3,
  //             marginLeft: 10,
  //             marginTop: 15,
  //             marginBottom: 10,
  //             fontSize: 16,
  //           }}
  //         >
  //           {" "}
  //           {item.comment}{" "}
  //         </Text>
  //       </TouchableOpacity>

  //       <Modal
  //         animationType="slide"
  //         transparent={true}
  //         visible={modalVisible}
  //         onRequestClose={() => {
  //           setModalVisible(!modalVisible);
  //         }}
  //       >
  //         <View style={commonStyles.modalFirstView}>
  //           <View
  //             style={[
  //               commonStyles.modalSecondView,
  //               { backgroundColor: "rgba(0,188,212,0.2)" },
  //             ]}
  //           >
  //             <TouchableOpacity
  //               onPress={() => {
  //                 setModalVisible(!modalVisible);
  //               }}
  //             >
  //               <FontAwesome5 name="times" size={40} color="black" />
  //             </TouchableOpacity>

  //             <View style={{ flexDirection: "row", marginTop: 40 }}>
  //               <TouchableOpacity
  //                 style={[
  //                   commonStyles.modalButton,
  //                   { backgroundColor: "#F3B000" },
  //                 ]}
  //                 onPress={() => {}}
  //               >
  //                 <Text style={commonStyles.modalButtonText}>Edit</Text>
  //               </TouchableOpacity>
  //               <TouchableOpacity
  //                 style={[
  //                   commonStyles.modalButton,
  //                   { backgroundColor: "#F02A4B" },
  //                 ]}
  //                 onPress={() => {
  //                   setDeleteModalVisible(true);
  //                 }}
  //               >
  //                 <Text style={commonStyles.modalButtonText}>Delete</Text>
  //               </TouchableOpacity>
  //             </View>

  //             <Modal
  //               animationType="fade"
  //               transparent={true}
  //               visible={deleteModalVisible}
  //               onRequestClose={() => {
  //                 setDeleteModalVisible(!deleteModalVisible);
  //               }}
  //             >
  //               <View style={commonStyles.modalFirstView}>
  //                 <View style={commonStyles.modalSecondView}>
  //                   <Text style={commonStyles.deleteWarningTitle}>
  //                     Confirm delete?
  //                   </Text>
  //                   <Text style={commonStyles.deleteWarningText}>
  //                     * Once delete, it is unrecoverable!
  //                   </Text>
  //                   <View style={{ flexDirection: "row", marginVertical: 10 }}>
  //                     <TouchableOpacity
  //                       style={[
  //                         commonStyles.modalButton,
  //                         { backgroundColor: "#00BCD4" },
  //                       ]}
  //                       onPress={() => {
  //                         setDeleteModalVisible(!deleteModalVisible);
  //                       }}
  //                     >
  //                       <Text style={commonStyles.modalButtonText}>Cancel</Text>
  //                     </TouchableOpacity>
  //                     <TouchableOpacity
  //                       style={[
  //                         commonStyles.modalButton,
  //                         { backgroundColor: "#F02A4B" },
  //                       ]}
  //                       onPress={() => {
  //                         deleteMood(item, currentUsername, day.dateString);
  //                       }}
  //                     >
  //                       <Text style={commonStyles.modalButtonText}>Delete</Text>
  //                     </TouchableOpacity>
  //                   </View>
  //                 </View>
  //               </View>
  //             </Modal>
  //           </View>
  //         </View>
  //       </Modal>
  //     </View>
  //   );
  // };

  return (
    <SafeAreaView style={commonStyles.pageContainer}>
      <View>
        <Text style={commonStyles.todayDate}> {currentDate} </Text>
        <Text style={commonStyles.todayDate}> {day.dateString} </Text>
      </View>

      <FlatList
        style={{
          width: "98%",
          marginTop: 20,
        }}
        data={moodList}
        // renderItem={renderItem}
        renderItem={({ item }) => (
          <EditMoodInput
            item={item}
            currentUsername={currentUsername}
            day={day}
          />
        )}
        keyExtractor={(item) => item.id}
      ></FlatList>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
  },
  mood: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
  },
  MComment: {
    marginVertical: 20,
    padding: 10,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "grey",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.36,
    shadowRadius: 5,
    elevation: 11,
  },

  MCommentList: {
    padding: 20,
    color: "black",
  },
});
