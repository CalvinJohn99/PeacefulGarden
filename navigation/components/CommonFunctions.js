import * as React from "react";
import { useState, useEffect } from "react";
import fbdata from "../../firebase";
import Interest from "../../assets/Interest";

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
  const [username, setUserName] = useState([Interest]);
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
export function useAccountInterest() {
  const userId = fbdata.auth().currentUser.uid;
  const [interest, setInterest] = useState([]);
  React.useEffect(() => {
    console.log(userId);
    const interestRef = fbdata.database()
        .ref("/users/" + userId + "/" + "interest/");
    const interestListener = interestRef.on("value", (snapshot) => {
        setInterest([]);
        snapshot.forEach((childSnapshot) => {
            setInterest((interest) => [...interest, childSnapshot.val()]);
        });
    });  
    return () => {
      interestRef.off();
    };
  }, []);
  return interest;
}

export function usePostData() {
  const [Post, setPost] = useState([]);
  React.useEffect(() => {
    const postRef = fbdata.database()
    .ref("/posts/").orderByChild("negTimestamp");
    const OnLoadingListener = postRef.on("value", (snapshot) => {
      setPost([]);
      snapshot.forEach((childSnapshot) => {
          setPost((Post) => [...Post, childSnapshot.val()]);
          //console.log(childSnapshot.val());
      });
    });
    return () => {
      postRef.off();
    };
  }, []);
  return Post;
}

export function useInterestingPost() {
  const Post = usePostData();
  const interest = useAccountInterest();
  console.log(interest);
  const [InterestingPost, setInterestingPost] = useState([]);
  React.useEffect(() => {
    setInterestingPost([]);
    Post.forEach((post) => {
      interest.forEach((userInterest) => {
        if (post.category === userInterest.value) {
          if (userInterest.check === true) {
              setInterestingPost((InterestingPost) => 
                  [...InterestingPost, post]);
              //console.log(post);
              //break;
          }
          //break;
        }
      })
    })
  }, []);
  return InterestingPost;
}
