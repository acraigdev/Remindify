import { GooglePlacesSearch } from "@/components/GooglePlacesSearch";
import { SegmentedButton } from "@/components/SegmentedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Flow, Nullable, ReminderType } from "@/utils/types";
import React, { Suspense, useState } from "react";
import { View, ScrollView, Platform } from "react-native";
import * as Location from "expo-location";
import { ThemedButton } from "@/components/ThemedButton";
import { router, useLocalSearchParams } from "expo-router";
import uuid from "react-native-uuid";
import { GetLocationPermissions } from "@/components/GetLocationPermissions";
import { useReminderContext } from "@/utils/ReminderContext";
import { ThemedModal } from "@/components/ThemedModal";

export default function CreateLocationReminder() {
  const theme = useThemeColor();
  const { reminders, upsertReminder, removeReminder } = useReminderContext();
  const { id: editReminderId } = useLocalSearchParams();
  const editLocation =
    editReminderId && typeof editReminderId === "string"
      ? reminders[editReminderId]
      : null;

  const [searchError, setSearchError] = useState<Nullable<string>>(null);
  const [submitError, setSubmitError] = useState<Nullable<string>>(null);

  const [reminderName, setReminderName] = useState<Nullable<string>>(
    editLocation?.title ?? null
  );
  const [reminderFlow, setReminderFlow] = useState<Flow>(
    editLocation?.flow ?? Flow.enter
  );
  const [placeId, setPlaceId] = useState<Nullable<string>>(
    editLocation?.placeId ?? null
  );

  // Polyfill needed for Google Autofill component
  Location.installWebGeolocationPolyfill();

  const addLocationReminder = async () => {
    if (!reminderName || !placeId) {
      setSubmitError("Reminders must have a selected location and a name.");
      return;
    }

    const index = editLocation ? editLocation.id : uuid.v4();

    await upsertReminder({
      id: index,
      type: ReminderType.location,
      title: reminderName,
      flow: reminderFlow,
      placeId,
    });
    router.dismissAll();
    router.replace("/");
  };

  const isLimit =
    (Platform.OS === "android" && Object.keys(reminders).length === 100) ||
    (Platform.OS === "ios" && Object.keys(reminders).length === 20);

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
      {isLimit && (
        <ThemedModal
          onClose={() => {
            router.dismissAll();
            router.replace("/");
          }}
        >
          <ThemedText style={{ textAlign: "center", marginBottom: 10 }}>
            You have reached the maximum number of location reminders for your
            device.
          </ThemedText>
          <ThemedButton
            type="secondary"
            label="Cancel"
            onPress={() => {
              router.dismissAll();
              router.replace("/");
            }}
          />
        </ThemedModal>
      )}
      <Suspense>
        <GetLocationPermissions />
      </Suspense>
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
            onSearchError={(e) => setSearchError(e)}
            placeId={placeId}
            onPlaceIdSelect={(id) => {
              setSubmitError(null);
              setPlaceId(id);
            }}
          />
        </ScrollView>
        <ThemedInput
          value={reminderName ?? ""}
          onChangeText={(name) => {
            setSubmitError(null);
            setReminderName(name);
          }}
          placeholder="Reminder name"
        />
        <View style={{ width: "100%" }}>
          <ThemedText type="defaultSemiBold">Reminder Type</ThemedText>
        </View>
        <SegmentedButton
          options={[
            { label: "Arrival", value: Flow.enter },
            { label: "Departure", value: Flow.exit },
          ]}
          selected={reminderFlow}
          onSelectionChange={(val) => setReminderFlow(val as Flow)}
        />
      </View>
      <View>
        <ThemedText
          type="error"
          style={{ width: "75%", marginHorizontal: "auto", marginBottom: 10 }}
        >
          {searchError ?? submitError}
        </ThemedText>
        <ThemedButton label="Save" onPress={addLocationReminder} />
        {editLocation && (
          <ThemedButton
            label="Delete"
            type="secondary"
            onPress={async () => {
              await removeReminder(editLocation.id);
              router.dismissAll();
              router.replace("/");
            }}
          />
        )}
      </View>
    </View>
  );
}
