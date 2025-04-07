import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { Flow, LocationReminder, Nullable } from "./types";
import { useSuspenseQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { invariant } from "ts-invariant";
import { queryClient } from "./queryClient";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { Platform } from "react-native";
import { sendPushNotification } from "@/hooks/useNotifications";
import * as Device from "expo-device";

const key =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_WEB
    : process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID;

export const ReminderContext = createContext<
  Nullable<{
    places: Places;
    reminders: Reminders;
    upsertReminder: (reminder: LocationReminder) => void;
    removeReminder: (reminderId: string) => void;
    upsertLocation: (place: PlaceResult) => void;
  }>
>(null);

const StorageKey = {
  reminders: "reminders",
  places: "places",
};

type PlaceResult = {
  placeId: string;
  displayName?: {
    text?: string;
  };
  location?: {
    latitude?: string;
    longitude?: string;
  };
  formattedAddress?: string;
};

type Reminders = Record<string, LocationReminder>;
type Places = Record<string, PlaceResult>;

const GEOFENCING_TASK = "GEOFENCING_TRACKER";
TaskManager.defineTask(
  GEOFENCING_TASK,
  async ({ data: { eventType, region }, error }) => {
    if (error) {
      console.error(error.message);
      return;
    }
    if (
      eventType === Location.GeofencingEventType.Enter ||
      eventType === Location.GeofencingEventType.Exit
    ) {
      const reminders = await getReminders();
      const reminder = reminders?.[region.identifier];
      invariant(reminder, "Reminder ID not found");
      const metadata = {
        device: Device.deviceName,
        reminder: reminder,
      };
      if (eventType === Location.GeofencingEventType.Enter) {
        sendPushNotification({
          title: reminder.title,
          body: JSON.stringify({ ...metadata, geofence: "enter" }),
        });
      } else if (eventType === Location.GeofencingEventType.Exit) {
        sendPushNotification({
          title: reminder.title,
          body: JSON.stringify({ ...metadata, geofence: "exit" }),
        });
      }
    }
  }
);

const getReminders = async () => {
  const reminders = await AsyncStorage.getItem(StorageKey.reminders);
  return reminders ? (JSON.parse(reminders) as Reminders) : null;
};

const updateGeofencing = async (regions: Location.LocationRegion[]) => {
  await Location.startGeofencingAsync(GEOFENCING_TASK, regions);
  /**
   *  If you want to add or remove regions from already running geofencing task, you can just call startGeofencingAsync again with the new array of regions.
   */
};

export const ReminderContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {
    data: reminders = {},
    // error: remindersError,
    // isLoading: remindersLoading,
  } = useSuspenseQuery({
    queryKey: ["getReminders"],
    queryFn: async () => await AsyncStorage.getItem(StorageKey.reminders),
    select: (res) => {
      return res !== null ? (JSON.parse(res) as Reminders) : {};
    },
  });

  const {
    data: places = {},
    // error: placesError,
    // isLoading: placesLoading,
  } = useSuspenseQuery({
    queryKey: ["getPlaces"],
    queryFn: async () => await AsyncStorage.getItem(StorageKey.places),
    select: (res) => {
      return res !== null ? (JSON.parse(res) as Places) : {};
    },
  });

  const upsertLocation = useCallback(
    async (place: PlaceResult) => {
      const copy = Object.assign({}, places);
      copy[place.placeId] = place;
      await AsyncStorage.setItem(StorageKey.places, JSON.stringify(copy));
    },
    [places]
  );

  const upsertReminder = useCallback(
    async (reminder: LocationReminder) => {
      if (!reminder.placeId) return;
      const copy = Object.assign({}, reminders);
      copy[reminder.id] = reminder;
      await AsyncStorage.setItem(StorageKey.reminders, JSON.stringify(copy));

      let location = places[reminder.placeId]
        ? places[reminder.placeId]
        : await fetch(
            `https://places.googleapis.com/v1/places/${reminder.placeId}?fields=location,formattedAddress,displayName&key=${key}`
          ).then((res) => res.json());

      if (location) {
        await upsertLocation({ ...location, placeId: reminder.placeId });
      }
      queryClient.invalidateQueries({ queryKey: ["getReminders"] });
      queryClient.invalidateQueries({ queryKey: ["getPlaces"] });
      await updateGeofencing([
        {
          identifier: reminder.id,
          latitude: location.location?.latitude,
          longitude: location.location?.longitude,
          radius: 500,
          notifyOnEnter: reminder.flow === Flow.enter,
          notifyOnExit: reminder.flow === Flow.exit,
        },
      ]);
      return;
    },
    [places, reminders, upsertLocation]
  );

  const removeReminder = useCallback(
    async (reminderId: string) => {
      const reminder = reminders[reminderId];
      const copy = Object.assign({}, reminders);
      delete copy[reminderId];
      await AsyncStorage.setItem(StorageKey.reminders, JSON.stringify(copy));

      const placesCopy = Object.assign({}, places);
      delete placesCopy[reminder.placeId];
      await AsyncStorage.setItem(StorageKey.places, JSON.stringify(placesCopy));

      queryClient.invalidateQueries({ queryKey: ["getReminders"] });
      queryClient.invalidateQueries({ queryKey: ["getPlaces"] });

      if (!Object.keys(copy).length) {
        await Location.stopGeofencingAsync(GEOFENCING_TASK);
      }
      return;
    },
    [reminders, places]
  );

  const reminderContext = useMemo(
    () => ({
      reminders,
      places,
      upsertLocation,
      upsertReminder,
      removeReminder,
    }),
    [places, reminders, removeReminder, upsertLocation, upsertReminder]
  );

  return (
    <ReminderContext.Provider value={reminderContext}>
      {children}
    </ReminderContext.Provider>
  );
};

export function useReminderContext() {
  const reminderContext = useContext(ReminderContext);
  invariant(reminderContext, "storageContext nullish");
  return reminderContext;
}
