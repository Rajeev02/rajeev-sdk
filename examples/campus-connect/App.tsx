import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { LoginScreen } from "./src/screens/LoginScreen";

export default function App() {
  const [screen, setScreen] = useState<"onboarding" | "login" | "main">(
    "onboarding",
  );

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        {screen === "onboarding" && (
          <OnboardingScreen onComplete={() => setScreen("login")} />
        )}
        {screen === "login" && (
          <LoginScreen onLogin={() => setScreen("main")} />
        )}
        {screen === "main" && <AppNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
