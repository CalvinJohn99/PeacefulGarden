import * as React from "react";
import { useState, useEffect } from "react";
import fbdata from "../../firebase.js";

export default function useMoodIcon() {
  const [MCList, setMCList] = useState([]);
  React.useEffect(() => {
    const moodRef = fbdata
      .database()
      .ref("/Mood/AAA/03Sep2021")
      .orderByChild("negTimestamp");
    const OnLoadingListener = moodRef.once("value", (snapshot) => {
      setMCList([]);
      snapshot.forEach((childSnapshot) => {
        setMCList((MCList) => [...MCList, childSnapshot.toJSON()]);
        console.log(childSnapshot.toJSON());
      });
    });
    return () => {
      moodRef.off();
    };
  }, []);
  return MCList;
}
