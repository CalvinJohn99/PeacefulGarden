import * as React from "react";

// import navigation components
import {
  StackActions,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

// import other elements
import Ionicons from "react-native-vector-icons/Ionicons";
import commonStyles from "../commonStyles";

// import screens
import HomeScreen from "./screens/HomeScreen";
import GPostScreen from "./screens/GPostScreen";
import CreatePost from "./screens/CreatePost.js";
import QuestionScreen from "./screens/QuestionScreen";
import QuestionViewAnswer from "./screens/QuestionViewAnswer";
import AnswerQuestion from "./screens/AnswerQuestion";
import MoodJournalScreen from "./screens/MoodJournalScreen";
import CreateMood from "./screens/CreateMood";
import CreateJournal from "./screens/CreateJournal.js";
import ViewMoodJournal from "./screens/ViewMoodJournal";
import MusicScreen from "./screens/MusicScreen";
import AccountScreen from "./screens/AccountScreen";

// Create Gratefulness Post stack
// Nested within bottom tab navigation
const GPostStack = createStackNavigator();

const GPostStackScreen = () => {
  return (
    <GPostStack.Navigator
      initialRouteName="GPostList"
      screenOptions={{
        headerStyle: commonStyles.headerBGColor,
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      {/* Post list screen */}
      <QuesStack.Screen
        name="GPostList"
        component={GPostScreen}
        options={{ headerTitle: "Gratefulness Post" }}
      />

      {/* Create post screen */}
      <QuesStack.Screen
        name="CreatePost"
        component={CreatePost}
        options={() => ({
          headerTitle: "Create Gratefulness Post",
        })}
      />
    </GPostStack.Navigator>
  );
};

// Create Self-awareness Question stack
// Nested within bottom tab navigation
const QuesStack = createStackNavigator();

const QuesStackScreen = () => {
  return (
    <QuesStack.Navigator
      initialRouteName="QList"
      screenOptions={{
        headerStyle: commonStyles.headerBGColor,
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      {/* Question list screen */}
      <QuesStack.Screen
        name="QList"
        component={QuestionScreen}
        options={{ headerTitle: "Question List" }}
      />

      {/* View answers of correspoinding questions */}
      <QuesStack.Screen
        name="QViewAnswer"
        component={QuestionViewAnswer}
        options={() => ({
          headerTitle: "View Answer",
        })}
      />

      {/* Create answer for a particular question */}
      <QuesStack.Screen
        name="QCreateAnswer"
        component={AnswerQuestion}
        options={{ headerTitle: "Post Answer" }}
      />
    </QuesStack.Navigator>
  );
};

// Create Journal and Mood Stack
// Nested within bottom tab navigation
const JMStack = createStackNavigator();
const JMStackScreen = () => {
  return (
    <JMStack.Navigator
      initialRouteName="MoodJournalCalendar"
      screenOptions={{
        headerStyle: commonStyles.headerBGColor,
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      {/* Calendar navigation to view mood and journal */}
      <JMStack.Screen
        name="MoodJournalCalendar"
        component={MoodJournalScreen}
        options={{ headerTitle: "Mood and Journal" }}
      />

      {/* Create mood screen */}
      <JMStack.Screen
        name="CreateMood"
        component={CreateMood}
        options={{ headerTitle: "Create Mood" }}
      />

      {/* Create journal screen */}
      <JMStack.Screen
        name="CreateJournal"
        component={CreateJournal}
        options={{ headerTitle: "Create Journal" }}
      />

      {/* View mood and journal in detail, edit and delete modd and journal */}
      <JMStack.Screen
        name="ViewMoodJournal"
        component={ViewMoodJournal}
        options={{ headerTitle: "My Story" }}
      />
    </JMStack.Navigator>
  );
};

// Create bottom tab navigation
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: commonStyles.headerBGColor,
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
        },

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Post") {
            iconName = focused ? "earth" : "earth-outline";
          } else if (route.name === "Question") {
            iconName = focused ? "bulb" : "bulb-outline";
          } else if (route.name === "Diary") {
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
        tabBarStyle: commonStyles.bottomBGColor,
      })}
    >
      {/* Home page of the app */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "rgba(0, 188, 212, 0.45)",
            position: "absolute",
            bottom: 60,
            marginHorizontal: 25,
            paddingTop: 15,
            height: 90,
            borderRadius: 20,
            shadowColor: "black",
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.8,
            shadowRadius: 5,
            elevation: 20,
          },
        }}
      />

      {/* Navigate to post stack, the initial screen is view post list */}
      <Tab.Screen
        name="Post"
        component={GPostStackScreen}
        options={{ headerShown: false }}
        // When navigate to the post tab, navigation will be directed to the initial screen of post stack
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            const routeName =
              getFocusedRouteNameFromRoute(route) ?? "GPostList";
            if (routeName !== "GPostList") {
              navigation.dispatch(StackActions.popToTop());
            }
          },
        })}
      />

      {/* Navigate to the question stack, the initial screen is question list */}
      <Tab.Screen
        name="Question"
        component={QuesStackScreen}
        options={{ headerShown: false }}
        // When navigate to the question tab, navigation will be directed to the initial screen
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "QList";
            if (routeName !== "QList") {
              navigation.dispatch(StackActions.popToTop());
            }
          },
        })}
      />

      {/* Navigate to mood and journal stack, the initial screen is calendar navigation */}
      <Tab.Screen
        name="Diary"
        component={JMStackScreen}
        options={{ headerShown: false }}
        // When navigate to the mood and journal tab, navigation will be directed to the initial screen
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            const routeName =
              getFocusedRouteNameFromRoute(route) ?? "MoodJournalCalendar";
            if (routeName !== "MoodJournalCalendar") {
              navigation.dispatch(StackActions.popToTop());
            }
          },
        })}
      />

      {/* Navigate to relaxing music screen */}
      <Tab.Screen
        name="Music"
        component={MusicScreen}
        options={{ headerTitle: "Relaxing Music" }}
      />

      {/* Navigate to account screen */}
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

// export bottom tab navigation as default
export default function MainContainer() {
  return <MyTabs />;
}
