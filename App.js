// @refresh state

// Import relevant react native libraries
import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

// import firebase from file "firebase.js"
import fbdata from "./firebase";

// import various screens from folder navigation
import MainContainer from "./navigation/MainContainer.js";
import SignupForm from "./navigation/screens/Auth/SignupForm";
import SigninForm from "./navigation/screens/Auth/SigninForm";
import MainAccountScreen from "./navigation/screens/Auth/MainAccountScreen";
import AccountInterest from "./navigation/screens/Auth/AccountInterest";
import ResetPassword from "./navigation/screens/Auth/ResetPassword";

// import shared style sheet
import commonStyles from "./commonStyles.js";

// Create a stack navigation
const Stack = createNativeStackNavigator();

// The root function of peaceful garden
function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  // Listen to user state change
  // firebase function onAuthStateChanged is triggered when the user state change in firebase authentication
  useEffect(() => {
    const subscriber = fbdata.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // render screens based on user state
  // No user -- render MainAccountScreen
  // active user -- render MainContainer (the main bottom tab container consisting main functionalities of the app)
  if (initializing) return null;
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: commonStyles.headerBGColor,
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
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SigninForm"
              component={SigninForm}
              options={{ title: "Login" }}
            />
            <Stack.Screen
              name="SignupForm"
              component={SignupForm}
              options={{ title: "Create New Account" }}
            />
            <Stack.Screen
              name="AccountInterest"
              component={AccountInterest}
              options={{ title: "Create New Account" }}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPassword}
              options={{ title: "Reset Password" }}
            />
          </>
        ) : (
          <Stack.Screen
            name="MainContainer"
            component={MainContainer}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
