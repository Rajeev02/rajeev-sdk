import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import { Colors } from "../theme";

import { DashboardScreen } from "../screens/DashboardScreen";
import { TimetableScreen } from "../screens/TimetableScreen";
import { NotesScreen } from "../screens/NotesScreen";
import { FeesScreen } from "../screens/FeesScreen";
import { EventsScreen } from "../screens/EventsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { NotificationsScreen } from "../screens/NotificationsScreen";
import { IDCardScreen } from "../screens/IDCardScreen";
import { LecturesScreen } from "../screens/LecturesScreen";
import { VideoStudioScreen } from "../screens/VideoStudioScreen";

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const AcademicsStack = createNativeStackNavigator();
const CampusStack = createNativeStackNavigator();

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icon}</Text>
    </View>
  );
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Dashboard" component={DashboardScreen} />
      <HomeStack.Screen name="Notifications" component={NotificationsScreen} />
    </HomeStack.Navigator>
  );
}

function AcademicsStackScreen() {
  return (
    <AcademicsStack.Navigator screenOptions={{ headerShown: false }}>
      <AcademicsStack.Screen name="Timetable" component={TimetableScreen} />
      <AcademicsStack.Screen name="Notes" component={NotesScreen} />
      <AcademicsStack.Screen name="Lectures" component={LecturesScreen} />
      <AcademicsStack.Screen name="VideoStudio" component={VideoStudioScreen} />
    </AcademicsStack.Navigator>
  );
}

function CampusStackScreen() {
  return (
    <CampusStack.Navigator screenOptions={{ headerShown: false }}>
      <CampusStack.Screen name="Events" component={EventsScreen} />
      <CampusStack.Screen name="IDCard" component={IDCardScreen} />
    </CampusStack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 88,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Academics"
        component={AcademicsStackScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="📚" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Fees"
        component={FeesScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="💳" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Campus"
        component={CampusStackScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🎓" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}
