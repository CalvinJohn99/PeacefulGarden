import * as React from 'react';
import { useState, useEffect} from "react";


export default function useCurrentDate(){
    const [currentDate, setCurrentDate] = useState(null);
    useEffect(() => {
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var TodayDate = new Date().getDate();
        var TodayMonthWord = months[new Date().getMonth()];
        var TodayYear = new Date().getFullYear();
        setCurrentDate(
            TodayDate + ' ' + TodayMonthWord + ' ' + TodayYear
        );
    });
    return currentDate;
}


 