import * as React from "react";
import { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import fbdata from "../../firebase.js";
import useCurrentDate from "../components/CommonFunctions.js";
import * as FileSystem from 'expo-file-system';
import { Modal } from "react-native-paper";
const image1 = require('../../assets/journal/1.jpeg')
const image2 = require('../../assets/journal/1.png')
const image3 = require('../../assets/journal/2.jpeg')
const image4 = require('../../assets/journal/3.jpeg')
const image5 = require('../../assets/journal/3.png')
const image6 = require('../../assets/journal/4.jpeg')
const image7 = require('../../assets/journal/5.jpeg')
const image8 = require('../../assets/journal/6.png')
const image9 = require('../../assets/journal/7.jpeg')
const image10 = require('../../assets/journal/10.png')
const image11 = require('../../assets/journal/11.png')
const image12 = require('../../assets/journal/12.png')
const image13 = require('../../assets/journal/13.png')
const image14 = require('../../assets/journal/14.png')

const localImages = [
  {
    image: image1,
    name: '1.jpeg'
  },
  {
    image: image2,
    name: '1.png'
  },
  {
    image: image3,
    name: '2.jpeg'
  },
  {
    image: image4,
    name: '3.jpeg'
  },
  {
    image: image5,
    name: '3.png'
  },
  {
    image: image6,
    name: '4.jpeg'
  },
  {
    image: image7,
    name: '5.jpeg'
  },
  {
    image: image8,
    name: '6.png'
  },
  {
    image: image9,
    name: '7.jpeg'
  },
  {
    image: image10,
    name: '10.png'
  },
  {
    image: image11,
    name: '11.png'
  },
  {
    image: image12,
    name: '12.png'
  },
  {
    image: image13,
    name: '13.png'
  },
  {
    image: image14,
    name: '14.png'
  }
]

export default function CreateJournal({ navigation }) {
  const currentDate = useCurrentDate();
  const [comment, setComment] = useState("");
  const [focusedText, setFocusedText] = useState(false);
  const [images, setImages] = useState([])
  const [visible, setVisible] = useState(false)
  const [success, setSuccess] = useState(false)

  const storeMComment = async () => {
    var newMoodCommentKey = fbdata
      .database()
      .ref("/Journal/")
      .push().key;

    const file = await Promise.all(images.map(it => uploadImageToStorage(it.image, it.name)))
    var dataToSave = {
      id: newMoodCommentKey,
      comment: comment,
      images: file
    };
    var updates = {};
    updates["/Journal/" + newMoodCommentKey] = dataToSave;

    return fbdata
      .database()
      .ref()
      .update(updates, (error) => {
        if (error) {
          console.log(error);
        } else {
          setSuccess(true)
          setComment('')
          setImages([])
          setTimeout(() => {
            setSuccess(false)
          }, 2000);
          console.log("update is sucessful");
        }
      });
  }

  const uploadImageToStorage = async (path, name) => {
    return await new Promise(async (resolve, reject) => {
      const exampleImageUri = Image.resolveAssetSource(path).uri
      const response = await fetch(exampleImageUri);
      const blob = await response.blob();
      fbdata.storage().ref('/Journal/images/' + name).put(blob).then((res) => {
        resolve(name);
      }).catch((e) => {
        reject('uploading image error => ', e);
      })
    })
  }

  const onChangeSelectImages = (item) => {
    if (images.find(it => it.image === item.image)) {
      setImages(images.filter(it => it.image !== item.image))
    } else {
      setImages([...images, item])
    }

    setVisible(false)
  }

  const onRemoveSelectImages = (item) => {
    setImages(images.filter(it => it.image !== item.image))
  }

  return (
    <View style={{ flexDirection: 'column', flex: 1 }}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setFocusedText(false);
        }}
      >
        <SafeAreaView style={styles.outerContainer}>
          <Text style={styles.todayDate}> {currentDate} </Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              multiline={true}
              editable={true}
              autofocus={true}
              placeholder="record your day, activities and dream here......"
              onChangeText={(text) => setComment(text)}
              value={comment}
              onFocus={() => {
                setFocusedText(true);
              }}
            />
          </View>
          <Text style={styles.title}>Pictrue:</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'flex-start', paddingLeft: 30, }}>
            {images.map(it => {
              return <TouchableOpacity onPress={() => { onRemoveSelectImages(it) }}><Image source={it.image} style={{ width: 40, height: 40, margin: 5, }} /></TouchableOpacity>
            })}
            {images.length <= 9 && <TouchableOpacity onPress={() => setVisible(true)}>
              <Image source={require('../../assets/add.png')} style={styles.add} />
            </TouchableOpacity>}
          </View>

          <View style={styles.submitSection}>
            <TouchableOpacity
              style={[styles.postbutton, comment ? {} : { backgroundColor: '#999' }]}
              onPress={() => {
                if (comment) {
                  storeMComment();
                }
              }}
            >
              <Text style={styles.postbuttontext}>Save</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
      <Modal visible={visible} style={{ flex: 1 }}>
        <View style={{ backgroundColor: '#fff', height: '100%', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', alignContent: 'flex-end' }}>
          {localImages.map(it => {
            return <TouchableOpacity style={{ width: '30%', height: '12%', margin: 5, borderRadius: 5 }} onPress={() => onChangeSelectImages(it)}>
              <Image source={it.image} style={{ width: '100%', height: '100%', }} />
            </TouchableOpacity>
          })}
        </View>
      </Modal>
      <Modal visible={success} style={{ flex: 1, flexDirection: 'row' }}>
        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => setSuccess(false)}>
          <View style={{ backgroundColor: '#fff', height: 100, width: 80 }}>
            <Image source={require('../../assets/成功.png')} style={{ width: '100%', height: '100%', }} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View >
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: "center",
  },

  todayDate: {
    fontWeight: "bold",
    fontSize: 26,
  },

  add: {
    width: 40,
    height: 40,
    margin: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#999'
  },
  title: {
    paddingLeft: 30,
    alignSelf: 'flex-start',
    fontWeight: "bold",
    fontSize: 18,
  },

  moodIcon: {
    width: 60,
    height: 60,
    left: 18,
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginRight: 20,
  },

  moodBorder: {
    borderWidth: 2,
  },

  inputWrapper: {
    padding: 8,
    marginTop: 30,
    width: "90%",
    height: "40%",
    borderColor: "black",
    shadowColor: "grey",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.36,
    shadowRadius: 5,
    elevation: 11,
  },

  input: {
    padding: 10,
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "white",
  },

  submitSection: {
    flexDirection: "row",
    top: 50,
    height: 100,
  },

  warningTextCon: {
    alignItems: "center",
    justifyContent: "center",
    flex: 2,
    left: 10,
    padding: 15,
  },

  postbutton: {
    backgroundColor: "#1067CC",
    justifyContent: "center",
    alignItems: "center",
    margin: 15,
    padding: 15,
    borderRadius: 20,
    flex: 1,
  },

  postbuttontext: {
    fontWeight: "bold",
    color: "white",
    fontSize: 22,
  },
});
