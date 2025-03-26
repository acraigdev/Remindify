import { useThemeColor } from "@/hooks/useThemeColor";
import { Platform, View } from "react-native";
import {
  GooglePlacesAutocomplete,
  Place,
  Point,
} from "react-native-google-places-autocomplete";
import { Icon } from "./Icon";
import { ThemedInput } from "./ThemedInput";
import { forwardRef, useEffect, useState } from "react";
import * as Location from "expo-location";
import { Nullable } from "@/utils/types";
import { ThemedText } from "./ThemedText";

// Prepopulate with either setAddressText or predefined or preProcess
// Current location doesnt work
type GoogleSearchProps = {
  currentLocation: Nullable<Point>;
  onSearchError: (e: Nullable<string>) => void;
  placeId: Nullable<string>;
  onPlaceIdSelect: (id: Nullable<string>) => void;
};

// Todo: this is searching when typing the title??

export function GooglePlacesSearch({
  currentLocation,
  onSearchError,
  placeId,
  onPlaceIdSelect,
}: GoogleSearchProps) {
  const theme = useThemeColor();

  const key =
    Platform.OS === "web"
      ? process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_WEB
      : process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID;
  return (
    <>
      <GooglePlacesAutocomplete
        placeholder="Location"
        onPress={(data, details = null) => {
          onSearchError(null);
          onPlaceIdSelect(data.place_id);
          console.log("Pressed", data, details);
        }}
        onFail={(e) => onSearchError(e)}
        onNotFound={() => {
          onSearchError(null);
          console.log("Not found");
        }}
        query={{
          key,
          language: "en",
        }}
        // GooglePlacesDetailsQuery={{
        //   fields: "name,geometry",
        // }}
        // fetchDetails={true}
        debounce={1000}
        // predefinedPlaces={
        //   currentLocation
        //     ? [
        //         {
        //           description: "Current location",
        //           geometry: { location: currentLocation },
        //         },
        //       ]
        //     : []
        // }
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
            backgroundColor: theme.background,
            zIndex: 100,
          },
          textInput: {
            borderWidth: 1,
            borderRadius: 10,
            borderColor: theme.border,
            height: 60,
            backgroundColor: "red",
            fontSize: 16,
            placeholderTextColor: theme.borderLight,
          },
          listView: {
            borderWidth: 1,
            borderRadius: 10,
            borderColor: theme.border,
            marginTop: 4,
          },
          row: {
            borderBottomWidth: 1,
            borderColor: theme.borderLight,
          },
        }}
      />
    </>
  );
}

// eslint-disable-next-line react/display-name
const Input = forwardRef(({ style, ...props }, ref) => {
  return (
    <ThemedInput
      ref={ref}
      {...props}
      icon="location.fill"
      placeholder="Location"
    />
  );
});
