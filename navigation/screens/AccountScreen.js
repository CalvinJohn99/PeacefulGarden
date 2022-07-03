import React from "react";
import AccountInfo from "./Account/AccountInfo";

// Account screen
// call componenet <AccountInfo>
// pass navigation
function AccountScreen({ navigation }) {
  return <AccountInfo navigation={navigation}></AccountInfo>;
}

export default AccountScreen;
