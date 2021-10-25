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
  });
  return dateString;
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

export function useAccountUserid() {
  const [userid, setUserid] = useState([]);

  useEffect(() => {
    __isTheUserAuthenticated();
  }, []);

  function __isTheUserAuthenticated() {
    const userId = fbdata.auth().currentUser.uid;
    setUserid(userId);
  }
  return userid;
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

export function useQuestionList() {
  const [QList, setQList] = useState([]);
  React.useEffect(() => {
    const questionRef = fbdata
      .database()
      .ref("/sa-question")
      .orderByChild("id");
    const OnLoadingListener = questionRef.once("value", (snapshot) => {
      setQList([]);
      snapshot.forEach((childSnapshot) => {
        setQList((QList) => [...QList, childSnapshot.val()]);
      });
    });
    return () => {
      questionRef.off();
    };
  }, []);
  return QList;
}

export function useUserAnswer(question, username) {
  const [answerbyUserList, setAnswerbyUserList] = useState([]);
  React.useEffect(() => {
    const accQARef = fbdata
      .database()
      .ref("/qanswerbyuser/" + username + "/" + question);
    const OnLoadingListener = accQARef.once("value", (snapshot) => {
      setAnswerbyUserList([]);
      if (snapshot.exists) {
        snapshot.forEach((childSnapshot) => {
          setAnswerbyUserList((answerbyUserList) => [
            ...answerbyUserList,
            childSnapshot.val(),
          ]);
        });
      }
    });
    return () => {
      accQARef.off();
    };
  }, []);
  return answerbyUserList;
}

export function increaseAnswerCount(currentUserID) {
  const userRef = fbdata.database().ref("users/" + currentUserID);
  const answerCountRef = fbdata
    .database()
    .ref("users/" + currentUserID + "/answerCount/");
  answerCountRef.once("value", (snapshot) => {
    var newCount = snapshot.val() + 1;
    userRef.update({ answerCount: newCount });
  });
}

export function decreaseAnswerCount(currentUserID) {
  const userRef = fbdata.database().ref("users/" + currentUserID);
  const answerCountRef = fbdata
    .database()
    .ref("users/" + currentUserID + "/answerCount/");
  answerCountRef.once("value", (snapshot) => {
    var newCount = snapshot.val() - 1;
    userRef.update({ answerCount: newCount });
  });
}

export function increasePostCount(currentUserID) {
  const userRef = fbdata.database().ref("users/" + currentUserID);
  const postCountRef = fbdata
    .database()
    .ref("users/" + currentUserID + "/postCount/");
  postCountRef.once("value", (snapshot) => {
    var newCount = snapshot.val() + 1;
    userRef.update({ postCount: newCount });
  });
}

export function decreasePostCount(currentUserID) {
  const userRef = fbdata.database().ref("users/" + currentUserID);
  const postCountRef = fbdata
    .database()
    .ref("users/" + currentUserID + "/postCount/");
  postCountRef.once("value", (snapshot) => {
    var newCount = snapshot.val() - 1;
    userRef.update({ postCount: newCount });
  });
}

export function getCurrentDateString() {
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();

  return year + "-" + month + "-" + date;
}

export function getDateFormatOne(dateOb) {
  // let dateOb = new Date(date);
  let dd = dateOb.getDate();
  let mm = dateOb.getMonth() + 1;
  let yyyy = dateOb.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  const formatedDateOb = yyyy + "-" + mm + "-" + dd;
  return formatedDateOb;
}

export function getDateFormatTwo(dateOb) {
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
  var day = dateOb.getDate();
  var monthWord = months[dateOb.getMonth()];
  var fullYear = dateOb.getFullYear();
  const formatedDateOb = day + " " + monthWord + " " + fullYear;
  return formatedDateOb;
}

export function getDateFormatThree(day, month, year) {
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
  var monthWord = months[month - 1];
  const formatedDateOb = day + " " + monthWord + " " + year;
  return formatedDateOb;
}

export function useCategoryList() {
  const [categoryList, setCategoryList] = useState([]);
  useEffect(() => {
    const postCategoryRef = fbdata
      .database()
      .ref("/postCategory/")
      .orderByChild("id");
    const OnLoadingListener = postCategoryRef.once("value", (snapshot) => {
      setCategoryList([]);
      snapshot.forEach((childSnapshot) => {
        setCategoryList((categoryList) => [
          ...categoryList,
          childSnapshot.val(),
        ]);
      });
    });
    return () => {
      postCategoryRef.off();
    };
  }, []);
  return categoryList;
}

export function useAgegroupList() {
  const [ageGroupList, setAgeGroupList] = useState([]);
  useEffect(() => {
    const AgeGroupRef = fbdata
      .database()
      .ref("/ageCategory/")
      .orderByChild("key");
    const OnLoadingListener = AgeGroupRef.once("value", (snapshot) => {
      setAgeGroupList([]);
      snapshot.forEach((childSnapshot) => {
        setAgeGroupList((ageGroupList) => [
          ...ageGroupList,
          childSnapshot.val(),
        ]);
      });
    });
    return () => {
      AgeGroupRef.off();
    };
  }, []);
  return ageGroupList;
}
