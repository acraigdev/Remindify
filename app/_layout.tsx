import { useThemeColor } from "@/hooks/useThemeColor";
import { queryClient } from "@/utils/queryClient";
import { Stack } from "expo-router";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { ReminderContextProvider } from "@/utils/ReminderContext";

export default function RootLayout() {
  const theme = useThemeColor();
  return (
    <QueryClientProvider client={queryClient}>
      <ReminderContextProvider>
        <StatusBar />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.background,
            },
            headerTintColor: theme.text,
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
      </ReminderContextProvider>
    </QueryClientProvider>
  );
}
