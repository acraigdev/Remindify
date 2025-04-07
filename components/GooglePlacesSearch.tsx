import { useThemeColor } from "@/hooks/useThemeColor";
import { Platform } from "react-native";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
import { ThemedInput } from "./ThemedInput";
import { forwardRef, useEffect, useRef } from "react";
import { Nullable } from "@/utils/types";
import { ThemedText } from "./ThemedText";
import { useReminderContext } from "@/utils/ReminderContext";

type GoogleSearchProps = {
  onSearchError: (e: Nullable<string>) => void;
  placeId: Nullable<string>;
  onPlaceIdSelect: (id: Nullable<string>) => void;
};

// Todo: this is searching when typing the title on web
// Look into non-google alternatives

export function GooglePlacesSearch({
  onSearchError,
  placeId,
  onPlaceIdSelect,
}: GoogleSearchProps) {
  const theme = useThemeColor();
  const ref = useRef<Nullable<GooglePlacesAutocompleteRef>>(null);
  const { places } = useReminderContext();
  const currentPlace = placeId ? places[placeId] : null;

  const key =
    Platform.OS === "web"
      ? process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_WEB
      : process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID;
  console.log(key);

  useEffect(() => {
    if (currentPlace && currentPlace.formattedAddress)
      ref.current?.setAddressText(currentPlace.formattedAddress);
  }, []);
  return (
    <>
      <GooglePlacesAutocomplete
        ref={ref}
        placeholder="Location"
        onPress={(data, details = null) => {
          onSearchError(null);
          onPlaceIdSelect(data.place_id);
        }}
        preProcess={(query) => {
          if (query?.length < 4) return "";
          return query;
        }}
        onFail={(e) => {
          console.log(e);
          onSearchError(e);
        }}
        listEmptyComponent={
          <ThemedText style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
            No results
          </ThemedText>
        }
        currentLocation={true}
        currentLocationLabel="Current location"
        nearbyPlacesAPI="GoogleReverseGeocoding"
        query={{
          key,
          language: "en",
        }}
        debounce={1000}
        requestUrl={{
          useOnPlatform: "web",
          url: "https://proxy-nhvsjqhtua-uc.a.run.app/https://maps.googleapis.com/maps/api",
        }}
        textInputProps={{
          InputComp: Input,
        }}
        styles={{
          container: {
            width: "100%",
            zIndex: 100,
          },
          listView: {
            borderWidth: 1,
            borderRadius: 10,
            borderColor: theme.border,
            marginTop: 4,
          },
        }}
      />
    </>
  );
}

// eslint-disable-next-line react/display-name
const Input = forwardRef(({ style, ...props }, ref) => {
  const theme = useThemeColor();

  return (
    <ThemedInput
      ref={ref}
      {...props}
      icon="location.fill"
      placeholder="Location"
      style={{
        width: "90%",
        color: theme.text,
        fontSize: 16,
        height: 60,
      }}
    />
  );
});
