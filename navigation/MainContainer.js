import * as React from "react";

// import navigation
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";

// import screens
import HomeScreen from "./screens/HomeScreen";
import GPostScreen from "./screens/GPostScreen";
import QuestionScreen from "./screens/QuestionScreen";
import QuestionViewAnswer from "./screens/QuestionViewAnswer";
import AnswerQuestion from "./screens/AnswerQuestion";
import JournalMoodScreen from "./screens/JournalMoodScreen";
import MusicScreen from "./screens/MusicScreen";
import AccountScreen from "./screens/AccountScreen";

// Create Self-awareness Question stack
const QuesStack = createStackNavigator();
const QuesStackScreen = () => {
  return (
    <QuesStack.Navigator
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Post"
        component={GPostScreen}
        options={{ headerTitle: "Gratefulness Post" }}
      />
      <Tab.Screen
        name="Question"
        component={QuesStackScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalMoodScreen}
        options={{ headerTitle: "Journal and Mood" }}
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
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
