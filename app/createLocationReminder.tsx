import { MapView } from "@/components/GoogleMapView";
import { GooglePlacesSearch } from "@/components/GooglePlacesSearch";
import { Icon } from "@/components/Icon";
import { SegmentedButton } from "@/components/SegmentedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Flow, LocationReminder, Nullable } from "@/utils/types";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, Platform } from "react-native";
import * as Location from "expo-location";
import { ThemedButton } from "@/components/ThemedButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { Point } from "react-native-google-places-autocomplete";
import { useGetLocation } from "@/hooks/useGetLocation";
import { useStorageContext } from "@/utils/StorageContext";

// TODO: Validate on save
// AsyncStorage.setItem('location', JSON.stringify(json));
// Geofencing  - 100 ON ANDRIOID 20 on ios

export default function CreateLocationReminder() {
  const theme = useThemeColor();
  const { reminders, upsertReminder } = useStorageContext();
  const { id: editReminderId } = useLocalSearchParams();
  const editLocation =
    editReminderId && typeof editReminderId === "string"
      ? reminders[editReminderId]
      : null;

  const [searchError, setSearchError] = useState<Nullable<string>>(null);

  const [reminderName, setReminderName] = useState<Nullable<string>>(
    editLocation?.title ?? null
  );
  const [reminderType, setReminderType] = useState<Flow>(
    editLocation?.flow ?? "enter"
  );
  const [placeId, setPlaceId] = useState<Nullable<string>>(
    editLocation?.placeId ?? null
  );
  const [isFailedPermissions, setIsFailedPermissions] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Nullable<Point>>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== "granted") {
        setIsFailedPermissions(true);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    }

    getCurrentLocation();
  }, []);

  const addLocationReminder = () => {
    const index = editLocation
      ? editLocation.id
      : Number(Object.keys(reminders)?.at(-1) ?? 0) + 1;

    // TODO: need a better id format so I can tell if a reminder already exists
    // TODO: enum
    upsertReminder({
      id: index,
      type: "location",
      title: reminderName,
      flow: reminderType,
      placeId,
    });
    router.push("/");
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 15,
        backgroundColor: theme.backgroundTint,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          display: "flex",
          gap: 15,
          alignItems: "center",
        }}
      >
        <ScrollView
          horizontal={true}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ width: "100%" }}
          style={{ width: "100%" }}
        >
          <GooglePlacesSearch
            currentLocation={currentLocation}
            onSearchError={(e) => setSearchError(e)}
            placeId={placeId}
            onPlaceIdSelect={(id) => setPlaceId(id)}
          />
        </ScrollView>
        <ThemedInput
          value={reminderName ?? ""}
          onChangeText={setReminderName}
          placeholder="Reminder name"
        />
        <View style={{ width: "100%" }}>
          <ThemedText type="defaultSemiBold">Reminder Type</ThemedText>
        </View>
        <SegmentedButton
          options={[
            { label: "Arrival", value: "enter" },
            { label: "Departure", value: "exit" },
          ]}
          selected={reminderType}
          onSelectionChange={(val) => setReminderType(val as Flow)}
        />
      </View>
      <View>
        <ThemedText style={{ color: "red" }}>
          {isFailedPermissions ?? searchError}
        </ThemedText>
        <ThemedButton label="Save" onPress={addLocationReminder} />
      </View>
    </View>
  );
}
