import * as React from "react";
import { useState, useEffect } from "react";
import fbdata from "../../firebase";

export default function useCurrentDate() {
  const [currentDate, setCurrentDate] = useState(null);
  useEffect(() => {
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    var TodayDate = new Date().getDate();
    var TodayMonthWord = months[new Date().getMonth()];
    var TodayYear = new Date().getFullYear();
    setCurrentDate(TodayDate + " " + TodayMonthWord + " " + TodayYear);
  });
  return currentDate;
}

export function useDateString() {
  const [dateString, setDateString] = useState(null);
  useEffect(() => {
    var TodayDate = new Date().getDate();
    var TodayMonth = new Date().getMonth() + 1;
    var TodayYear = new Date().getFullYear();
    setDateString(TodayYear + "-" + TodayMonth + "-" + TodayDate);
    setCurrentDate(TodayDate + " " + TodayMonthWord + " " + TodayYear);
  });
  return currentDate;
}

export function useOpeningNum() {
  const [openingImageNum, setOpeningImageNum] = useState(0);
  useEffect(() => {
    const openingImageNumRef = fbdata.database().ref("/OpeningImage/");
    const OnLoadingListener = openingImageNumRef.once("value", (snapshot) => {
      setOpeningImageNum(snapshot.numChildren());
    });
    return () => {
      openingImageNumRef.off();
    };
  }, []);
  return openingImageNum;
}

export function useOpeningImage() {
  const [openingImageURL, setOpeningImageURL] = useState("");
  const num = useOpeningNum();
  useEffect(() => {
    const index = Math.floor(Math.random() * num) + 1;
    const openingImageRef = fbdata
      .database()
      .ref("/OpeningImage/" + index + "/url/");
    const OnLoadingListener = openingImageRef.once("value", (snapshot) => {
      setOpeningImageURL(snapshot.val().toString());
    });
    return () => {
      openingImageRef.off();
    };
  }, []);
  return openingImageURL;
}

export function useAccountUsername() {
  const [username, setUserName] = useState([]);
  const [uid, setUid] = useState("");

  useEffect(() => {
    __isTheUserAuthenticated();
  }, []);

  function __isTheUserAuthenticated() {
    const userId = fbdata.auth().currentUser.uid;
    setUid(userId);
    if (userId !== null) {
      fbdata
        .database()
        .ref("users/" + userId + "/username/")
        .on("value", (querySnapShot) => {
          let userinfo = querySnapShot.val() ? querySnapShot.val() : {};
          setUserName(userinfo);
        });
    }
  }
  return username;
}
