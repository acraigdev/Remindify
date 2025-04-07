import { useSuspenseQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { ThemedText } from "./ThemedText";
import { ThemedButton } from "./ThemedButton";
import { router } from "expo-router";
import { queryClient } from "@/utils/queryClient";
import { useState } from "react";
import { ThemedModal } from "./ThemedModal";
import * as Linking from "expo-linking";

const requestPermissions = async () => {
  let backgroundStatus = null;
  const foregroundStatus = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus.status === "granted") {
    backgroundStatus = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus.status === "granted") {
      return true;
    }
  }
  if (
    foregroundStatus.status === "denied" ||
    backgroundStatus?.status === "denied"
  ) {
    return "denied";
  }
};

export function GetLocationPermissions() {
  const { data: backgroundPermissions, error } = useSuspenseQuery({
    queryKey: ["getLocationPermissions"],
    queryFn: async () => Location.getBackgroundPermissionsAsync(),
    select: (res) => {
      return res;
    },
  });
  const [denied, setDenied] = useState<boolean>(false);

  if (backgroundPermissions.granted) return <></>;
  return (
    <ThemedModal
      onClose={() => {
        router.dismissAll();
        router.replace("/");
      }}
    >
      {!denied && !error && backgroundPermissions.status !== "denied" ? (
        <>
          <ThemedText style={{ textAlign: "center" }}>
            To use location reminders, you must enable precise background
            location permissions.
          </ThemedText>
          <ThemedText style={{ textAlign: "center" }}>
            Location reminders check your proximity to your saved locations to
            alert you when you arrive or depart the area.
          </ThemedText>
          <ThemedButton
            label="Enable permissions"
            style={{ marginTop: 40 }}
            onPress={() =>
              requestPermissions().then((res) => {
                if (typeof res === "string") {
                  setDenied(true);
                  return;
                }
                if (res) {
                  setDenied(false);
                  queryClient.invalidateQueries({
                    queryKey: ["getLocationPermissions"],
                  });
                }
              })
            }
          />
        </>
      ) : (
        <>
          <ThemedText style={{ marginBottom: 40, textAlign: "center" }}>
            {denied || backgroundPermissions.status === "denied"
              ? "Background permissions are required for location reminders. Please enable precise background tracking in your app settings."
              : String(error)}
          </ThemedText>
          <ThemedButton
            label="Settings"
            onPress={() => Linking.openSettings()}
          />
        </>
      )}

      <ThemedButton
        type="secondary"
        label="Cancel"
        onPress={() => {
          router.dismissAll();
          router.replace("/");
        }}
      />
    </ThemedModal>
  );
}
