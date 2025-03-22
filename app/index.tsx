import { LocationReminder } from "@/components/LocationReminder";
import { LocationAlert } from "@/utils/types";
import { Button, Text, View } from "react-native";
import { MenuView, MenuComponentRef } from "@react-native-menu/menu";
import { useRef } from "react";

export default function Index() {
  const menuRef = useRef<MenuComponentRef>(null);
  const items: Array<LocationAlert> = [
    {
      id: 1,
      type: "location",
      title: "Set Alarm",
      flow: "exit",
      latitude: 38.93234596890752,
      longitude: -104.76848275772883,
    },
    {
      id: 2,
      type: "location",
      title: "Scan receipt",
      flow: "enter",
      latitude: 38.87833818989012,
      longitude: -104.71642263231774,
    },
  ];
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: 15,
        backgroundColor: "#ffffff",
        gap: 10,
      }}
    >
      {items.map((location) => (
        <LocationReminder location={location} />
      ))}
    </View>
  );
}
