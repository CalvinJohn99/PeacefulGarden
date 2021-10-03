import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import fbdata from "./../../firebase";
import { View, Text } from "react-native";

import SignupForm from "./Account/SignupForm";
import SigninForm from "./Account/SigninForm";
import MainAccountScreen from "./Account/MainAccountScreen";
import AccountQuestion from "./Account/AccountQuestion";
import AccountAge from "./Account/AccountAge";
import AccountThank from "./Account/AccountThank";
import AccountInfo from "./Account/AccountInfo";

const Stack = createNativeStackNavigator();
function AccountScreen({ navigation }) {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    //console.log(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = fbdata.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#1067CC",
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      {user === null ? (
        <>
          <Stack.Screen
            name="MainAccountScreen"
            component={MainAccountScreen}
            options={{ title: 'Account' }}
          />
          <Stack.Screen name="SigninForm" component={SigninForm} options={{ title: 'Login' }}/>
          <Stack.Screen name="SignupForm" component={SignupForm} options={{ title: 'Create New Account' }}/>
          <Stack.Screen name="AccountQuestion" component={AccountQuestion} options={{ title: 'Create New Account' }} />
          <Stack.Screen name="AccountAge" component={AccountAge} options={{ title: 'Create New Account' }}/>
          <Stack.Screen name="AccountThank" component={AccountThank} />
        </>
      ) : (
        <Stack.Screen name="AccountInfo" component={AccountInfo} options={{ title: 'Account' }}/>
      )}
    </Stack.Navigator>
  );
}

export default AccountScreen;
