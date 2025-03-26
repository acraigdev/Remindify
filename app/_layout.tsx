import { useThemeColor } from "@/hooks/useThemeColor";
import { queryClient } from "@/utils/queryClient";
import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { StorageContextProvider } from "@/utils/StorageContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useThemeColor();
  return (
    //colorScheme === "dark" ? DarkTheme :
    <QueryClientProvider client={queryClient}>
      <StorageContextProvider>
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
            name="CreateLocationReminder"
            options={{ title: "Location reminder" }}
          />
        </Stack>
      </StorageContextProvider>
    </QueryClientProvider>
  );
}
