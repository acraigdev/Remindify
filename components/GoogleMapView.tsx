// import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";

import { AppleMaps, GoogleMaps } from "expo-maps";
import { Platform, Text } from "react-native";

// export function GoogleMapView() {
//     return <MapView />
// }

export function MapView() {
  if (Platform.OS === "ios") {
    return <AppleMaps.View style={{ flex: 1 }} />;
  } else if (Platform.OS === "android") {
    return <GoogleMaps.View style={{ flex: 1 }} />;
  } else {
    return <Text>Maps are only available on Android and iOS</Text>;
  }
}
