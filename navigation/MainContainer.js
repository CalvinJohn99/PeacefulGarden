import * as React from "react";

// import navigation
import {
  NavigationContainer,
  StackActions,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";

// import screens
import HomeScreen from "./screens/HomeScreen";
import GPostScreen from "./screens/GPostScreen";
import QuestionScreen from "./screens/QuestionScreen";
import QuestionViewAnswer from "./screens/QuestionViewAnswer";
import AnswerQuestion from "./screens/AnswerQuestion";
import JournalMoodScreen from "./screens/JournalMoodScreen";
import CreateMood from "./screens/CreateMood";
import ViewMood from "./screens/ViewMood";
import History from "./screens/History";
import MusicScreen from "./screens/MusicScreen";
import AccountScreen from "./screens/AccountScreen";

// Create Self-awareness Question stack
const QuesStack = createNativeStackNavigator();
const QuesStackScreen = () => {
  return (
    <QuesStack.Navigator
      initialRouteName="QList"
      screenOptions={{
        headerStyle: { backgroundColor: "#1067CC" },
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <QuesStack.Screen
        name="QList"
        component={QuestionScreen}
        options={{ headerTitle: "Question List" }}
      />
      <QuesStack.Screen
        name="QViewAnswer"
        component={QuestionViewAnswer}
        options={{ headerTitle: "View Answer" }}
      />
      <QuesStack.Screen
        name="QCreateAnswer"
        component={AnswerQuestion}
        options={{ headerTitle: "Post Answer" }}
      />
    </QuesStack.Navigator>
  );
};

const JMStack = createNativeStackNavigator();
const JMStackScreen = () => {
  return (
    <JMStack.Navigator
      initialRouteName="JMNav"
      screenOptions={{
        headerStyle: { backgroundColor: "#1067CC" },
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <JMStack.Screen
        name="JMNav"
        component={JournalMoodScreen}
        options={{ headerTitle: "Journal and Mood" }}
      />

      <JMStack.Screen
        name="CreateMood"
        component={CreateMood}
        options={{ headerTitle: "Create Mood" }}
      />
      <JMStack.Screen
        name="ViewMood"
        component={ViewMood}
        options={{ headerTitle: "View Mood" }}
      />

      <JMStack.Screen
        name="History"
        component={History}
        options={{ headerTitle: "History" }}
      />
    </JMStack.Navigator>
  );
};

// Create tab
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: "#1067CC",
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        // headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Post") {
            iconName = focused ? "earth" : "earth-outline";
          } else if (route.name === "Question") {
            iconName = focused ? "bulb" : "bulb-outline";
          } else if (route.name === "Journal") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "Music") {
            iconName = focused ? "musical-notes" : "musical-notes-outline";
          } else if (route.name === "Account") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: "#1067CC",
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: "Home" }}
      />
      <Tab.Screen
        name="Post"
        component={GPostScreen}
        options={{ headerTitle: "Gratefulness Post" }}
      />
      <Tab.Screen
        name="Question"
        component={QuesStackScreen}
        options={{ headerShown: false }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // work with transition delay
            // navigation.dispatch(
            //   CommonActions.reset({
            //     index: 0,
            //     routes: [{ name: "QList" }],
            //   })
            // );

            // work with transition delay
            // navigation.reset({
            //   index: 0,
            //   routes: [{ name: "QList" }],
            // });

            // work with development-only error -- action pop_to_top was not handled by any navigator
            // navigation.dispatch(StackActions.popToTop());

            const routeName = getFocusedRouteNameFromRoute(route) ?? "QList";
            if (routeName !== "QList") {
              navigation.dispatch(StackActions.popToTop());
            }
          },
        })}
      />
      <Tab.Screen
        name="Journal"
        component={JMStackScreen}
        options={{ headerShown: false }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // navigation.dispatch(StackActions.popToTop());

            const routeName = getFocusedRouteNameFromRoute(route) ?? "JMNav";
            if (routeName !== "JMNav") {
              navigation.dispatch(StackActions.popToTop());
            }
          },
        })}
      />
      <Tab.Screen
        name="Music"
        component={MusicScreen}
        options={{ headerTitle: "Relaxing Music" }}
      />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default function MainContainer() {
  return <MyTabs />;
}
