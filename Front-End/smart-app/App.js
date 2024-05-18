import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeBaseProvider } from "native-base";
import { LogBox, StatusBar } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import { AuthProvider } from './AuthContext';
import LoginCandidatScreen from "./screens/LoginCandidatScreen";
import CreateQuestionnaireScreen from "./screens/CreateQuestionnaireScreen";
import EditQuestionnaireScreen from './screens/EditQuestionnaireScreen';
import QuestionnaireScreen from './screens/QuestionnaireScreen';
import HomeScreen from "./screens/HomeScreen";
import LandingScreen from "./screens/LandingScreen";
import QuestionScreen from "./screens/QuestionScreen";
import { Ionicons } from "@expo/vector-icons";
import ParametreScreen from './screens/ParametreScreen';
import ProfileCandidatScreen from './screens/ProfileCandidatScreen';

LogBox.ignoreLogs([
  "In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.",
]);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "TabHome") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Questionnaire") {
            iconName = focused ? "help-circle" : "help-circle-outline";
          } else if (route.name === "Parametre") {
            iconName = focused? "settings-outline" : "settings-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: [{ display: "flex" }, null],
      })}
    >
      <Tab.Screen
        name="TabHome"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Questionnaire"
        component={QuestionnaireScreen}
        options={{ title: "Questionnaire" }}
      />
      <Tab.Screen
      name="Parametre"
      component={ParametreScreen}
      options={{ title: "Parametre" }}
    />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NativeBaseProvider>
        <StatusBar barStyle="dark-content" />
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Landing"
              component={LandingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LoginCandidat"
              component={LoginCandidatScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={MyTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Question"
              component={QuestionScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
            name="CreateQuestionnaire"
            component={CreateQuestionnaireScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditQuestionnaire"
            component={EditQuestionnaireScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
          name="ProfileCandidat"
          component={ProfileCandidatScreen}
          options={{ headerShown: false }}
        />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </AuthProvider>
  );
}
