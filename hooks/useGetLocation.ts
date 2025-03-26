import { useStorageContext } from "@/utils/StorageContext";
import { Nullable } from "@/utils/types";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Platform } from "react-native";

const key =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_WEB
    : process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID;

export function useGetLocation({ placeId }: { placeId: Nullable<string> }) {
  const { places, upsertLocation } = useStorageContext();

  const { data: location } = useSuspenseQuery({
    queryKey: ["getLocation", placeId],
    queryFn: async () => {
      if (!placeId) return null;
      if (places[placeId]) return places[placeId];
      return await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?fields=displayName,location&key=${key}`
      ).then((res) => res.json());
    },
  });

  useEffect(() => {
    if (placeId && !places[placeId] && location) {
      upsertLocation({ ...location, placeId });
    }
  });

  return location;
}
