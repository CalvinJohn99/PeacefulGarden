import * as React from "react";

// import navigation
import {
  NavigationContainer,
  StackActions,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import Ionicons from "react-native-vector-icons/Ionicons";
import commonStyles, { SCREEN_WIDTH, SCREEN_HEIGHT } from "../commonStyles";

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
      <QuesStack.Screen
        name="GPostList"
        component={GPostScreen}
        options={{ headerTitle: "Gratefulness Post" }}
      />
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
const QuesStack = createStackNavigator();
// const QuesStack = createSharedElementStackNavigator();
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
      <QuesStack.Screen
        name="QList"
        component={QuestionScreen}
        options={{ headerTitle: "Question List" }}
      />
      <QuesStack.Screen
        name="QViewAnswer"
        component={QuestionViewAnswer}
        options={() => ({
          headerTitle: "View Answer",
          // gestureEnabled: false,
          // transitionSpec: {
          //   open: { animation: "timing", config: { duration: 5000 } },
          //   close: { animation: "timing", config: { duration: 500 } },
          // },
          // cardStyleInterpolator: ({ current: { progress } }) => {
          //   return {
          //     cardStyle: {
          //       opacity: progress,
          //     },
          //   };
          // },
        })}
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
      initialRouteName="MoodJournalCalendar"
      screenOptions={{
        headerStyle: commonStyles.headerBGColor,
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <JMStack.Screen
        name="MoodJournalCalendar"
        component={MoodJournalScreen}
        options={{ headerTitle: "Mood and Journal" }}
      />

      <JMStack.Screen
        name="CreateMood"
        component={CreateMood}
        options={{ headerTitle: "Create Mood" }}
      />

      <JMStack.Screen
        name="CreateJournal"
        component={CreateJournal}
        options={{ headerTitle: "Create Journal" }}
      />

      <JMStack.Screen
        name="ViewMoodJournal"
        component={ViewMoodJournal}
        options={{ headerTitle: "My Story" }}
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
        // headerStyle: {
        //   backgroundColor: "#1067CC",
        // },
        headerStyle: commonStyles.headerBGColor,
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
        // tabBarStyle: {
        //   backgroundColor: "#1067CC",
        // },
        tabBarStyle: commonStyles.bottomBGColor,
      })}
    >
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

            // alignItems: "center",
            // justifyContent: "center",
          },
        }}
      />
      <Tab.Screen
        name="Post"
        component={GPostStackScreen}
        options={{ headerShown: false }}
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
        // name="MoodJournal"
        name="Diary"
        component={JMStackScreen}
        options={{ headerShown: false }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // navigation.dispatch(StackActions.popToTop());

            const routeName =
              getFocusedRouteNameFromRoute(route) ?? "MoodJournalCalendar";
            if (routeName !== "MoodJournalCalendar") {
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
