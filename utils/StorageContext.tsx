import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { LocationReminder, Nullable } from "./types";
import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { invariant } from "ts-invariant";

export const StorageContext = createContext<
  Nullable<{
    places: Places;
    reminders: Reminders;
    upsertReminder: (reminder: LocationReminder) => void;
    removeReminder: (reminderId: string) => void;
    upsertLocation: (place: PlaceResult) => void;
    removeLocation: (placeId: string) => void;
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
};

type Reminders = Record<string, LocationReminder>;
type Places = Record<string, PlaceResult>;

export const StorageContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {
    data: reminders = {},
    // error: remindersError,
    // isLoading: remindersLoading,
  } = useQuery({
    queryKey: ["getReminders"],
    queryFn: async () => await AsyncStorage.getItem(StorageKey.reminders),
    select: (res) => (res !== null ? (JSON.parse(res) as Reminders) : {}),
  });

  const {
    data: places = {},
    // error: placesError,
    // isLoading: placesLoading,
  } = useQuery({
    queryKey: ["getPlaces"],
    queryFn: async () => await AsyncStorage.getItem(StorageKey.places),
    select: (res) => (res !== null ? (JSON.parse(res) as Places) : {}),
  });

  const upsertReminder = useCallback(
    (reminder: LocationReminder) => {
      reminders[reminder.id] = reminder;
      AsyncStorage.setItem(StorageKey.reminders, JSON.stringify(reminders));
    },
    [reminders]
  );

  const removeReminder = useCallback(
    (reminderId: string) => {
      delete reminders[reminderId];
      AsyncStorage.setItem(StorageKey.reminders, JSON.stringify(reminders));
    },
    [reminders]
  );

  const upsertLocation = useCallback(
    (place: PlaceResult) => {
      places[place.placeId] = place;
      AsyncStorage.setItem(StorageKey.places, JSON.stringify(places));
    },
    [places]
  );

  const removeLocation = useCallback(
    (placeId: string) => {
      delete places[placeId];
      AsyncStorage.setItem(StorageKey.places, JSON.stringify(places));
    },
    [places]
  );

  const storageContext = useMemo(
    () => ({
      reminders,
      places,
      upsertLocation,
      removeLocation,
      upsertReminder,
      removeReminder,
    }),
    [
      places,
      reminders,
      removeLocation,
      removeReminder,
      upsertLocation,
      upsertReminder,
    ]
  );

  return (
    <StorageContext.Provider value={storageContext}>
      {children}
    </StorageContext.Provider>
  );
};

export function useStorageContext() {
  const storageContext = useContext(StorageContext);
  invariant(storageContext, "storageContext nullish");
  return storageContext;
}
