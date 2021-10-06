// @refresh state

import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
//Import Firebase
import fbdata from "./firebase";
//Import Screens
import MainContainer from "./navigation/MainContainer.js";
import SignupForm from "./navigation/screens/Auth/SignupForm";
import SigninForm from "./navigation/screens/Auth/SigninForm";
import MainAccountScreen from "./navigation/screens/Auth/MainAccountScreen";
import AccountQuestion from "./navigation/screens/Auth/AccountQuestion";
import AccountAge from "./navigation/screens/Auth/AccountAge";

const Stack = createNativeStackNavigator();
function App() {
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
    <NavigationContainer>
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
              options={{ title: "Account" }}
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
              name="AccountQuestion"
              component={AccountQuestion}
              options={{ title: "Create New Account" }}
            />
            <Stack.Screen
              name="AccountAge"
              component={AccountAge}
              options={{ title: "Create New Account" }}
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
