import { View, StyleSheet, Pressable } from "react-native";
import { Icon } from "./Icon";
import { LocationReminder } from "@/utils/types";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import { router } from "expo-router";
import { useReminderContext } from "@/utils/ReminderContext";

export function LocationReminderPreview({
  reminder,
}: {
  reminder: LocationReminder;
}) {
  const theme = useThemeColor();
  const { places } = useReminderContext();
  const loc = places[reminder.placeId];

  return (
    <View
      style={{
        backgroundColor: theme.secondary,
        borderColor: theme.border,
        ...styles.container,
      }}
    >
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/CreateLocationReminder",
            params: { id: reminder.id },
          })
        }
      >
        <View style={styles.inside}>
          <Icon
            name="location.fill"
            color={theme.background}
            style={{
              backgroundColor: theme.primary,
              borderRadius: 20,
              padding: 4,
            }}
          />
          <View style={{ flexShrink: 1 }}>
            <ThemedText type="defaultSemiBold">{reminder.title}</ThemedText>
            <ThemedText>{`${
              reminder.flow === "enter" ? "Arrive at" : "Leaving"
            } ${loc?.displayName?.text ?? loc?.formattedAddress}`}</ThemedText>
          </View>
          <Icon
            name="arrowtriangle.right.fill"
            color={theme.text}
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
