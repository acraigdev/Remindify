import { Icon } from "@/components/Icon";
import { LocationReminder } from "@/components/LocationReminder";
import { ThemedButton } from "@/components/ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LocationAlert } from "@/utils/types";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function Index() {
  const router = useRouter();
  const theme = useThemeColor();
  const items: Array<LocationAlert> = [
    {
      id: 1,
      type: "location",
      title: "Set Alarm",
      flow: "exit",
      placeId: "ChIJ06flI8dOE4cRXvXsKr6pZP4",
    },
    {
      id: 2,
      type: "location",
      title: "Scan receipt",
      flow: "enter",
      placeId: "ChIJYYwBVCJHE4cRSZ9lcM9OWLU",
    },
    {
      id: 3,
      type: "location",
      title: "Say hi to mom",
      flow: "enter",
      placeId: "ChIJCSf6615OE4cRO4cOAnZT3w4",
    },
  ];
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: 15,
        backgroundColor: theme.background,
        gap: 10,
      }}
    >
      {items.map((location) => (
        <LocationReminder key={location.id} location={location} />
      ))}
      <ThemedButton
        onPress={() => {
          console.log("Add!");
          router.push("/createLocationReminder");
        }}
        label={<Icon name="plus" size={40} color={theme.primary} />}
        style={{
          position: "absolute",
          bottom: 15,
          right: 15,
          aspectRatio: "1/1",
          shadowColor: "#000",
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 0.6,
          shadowRadius: 3,
          elevation: 4,
        }}
      />
    </View>
  );
}
