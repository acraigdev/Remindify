import { Nullable } from "@/utils/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

type PlaceResult = {
  displayName?: {
    text?: string;
  };
  location?: {
    latitude?: string;
    longitude?: string;
  };
};

export function useGetLocation({ placeId }: { placeId: string }) {
  const key =
    Platform.OS === "web"
      ? process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_WEB
      : process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID;
  const [location, setLocation] = useState<Nullable<PlaceResult>>(null);
  const getCachedLocation = async () => {
    try {
      const value = await AsyncStorage.getItem(placeId);
      if (value !== null && JSON.parse(value).displayName) {
        setLocation(JSON.parse(value));
        return;
      }
      getLocationFromGoogle();
    } catch (e) {
      console.error(e);
    }
  };

  const getLocationFromGoogle = async () => {
    try {
      await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?fields=displayName,location&key=${key}`
      )
        .then((res) => res.json())
        .then((json) => {
          AsyncStorage.setItem(placeId, JSON.stringify(json));
          setLocation(json);
          return;
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCachedLocation();
  }, []);

  return location;
}
