import { View, StyleSheet, Pressable } from "react-native";
import { Icon } from "./Icon";
import { LocationAlert } from "@/utils/types";
import { useGetLocation } from "@/hooks/useGetLocation";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";

export function LocationReminder({ location }: { location: LocationAlert }) {
  const theme = useThemeColor();
  const loc = useGetLocation({
    placeId: location.placeId,
  });

  return (
    <View
      style={{
        backgroundColor: theme.secondary,
        borderColor: theme.border,
        ...styles.container,
      }}
    >
      <Pressable onPress={() => console.log("Clicked")}>
        <View style={styles.inside}>
          <Icon
            name="location.fill"
            color={theme.secondary}
            style={{
              backgroundColor: theme.primary,
              borderRadius: 20,
              padding: 4,
            }}
          />
          <View style={{ flexShrink: 1 }}>
            <ThemedText type="defaultSemiBold">{location.title}</ThemedText>
            <ThemedText>{`${
              location.flow === "enter" ? "Arrive at" : "Leaving"
            } ${loc?.displayName?.text ?? ""}`}</ThemedText>
          </View>
          <Icon
            name="arrowtriangle.right.fill"
            color="inherit"
            style={{ marginLeft: "auto" }}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    alignSelf: "stretch",
  },
  inside: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
