import { useThemeColor } from "@/hooks/useThemeColor";
import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { Appearance, useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useThemeColor();
  return (
    //colorScheme === "dark" ? DarkTheme :
    <ThemeProvider value={DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#141118",
          },
          headerTintColor: theme.background,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          headerTitleAlign: "center",
          headerBackButtonDisplayMode: "minimal",
          // headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "Reminders", headerTitleAlign: "left" }}
        />
        <Stack.Screen
          name="createLocationReminder"
          options={{ title: "Location reminder" }}
        />
      </Stack>
    </ThemeProvider>
  );
}
