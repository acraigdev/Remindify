import { Icon } from "@/components/Icon";
import { LocationReminderPreview } from "@/components/LocationReminderPreview";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { useNotifications } from "@/hooks/useNotifications";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useReminderContext } from "@/utils/ReminderContext";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function Index() {
  const router = useRouter();
  const theme = useThemeColor();
  const { reminders } = useReminderContext();
  useNotifications();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: 15,
        backgroundColor: theme.backgroundTint,
        gap: 10,
      }}
    >
      {Object.values(reminders).map((location) => (
        <LocationReminderPreview key={location.id} reminder={location} />
      ))}

      {!Object.keys(reminders).length && (
        <View style={{ marginTop: 20 }}>
          <ThemedText type="subtitle">No reminders created</ThemedText>
        </View>
      )}
      <ThemedButton
        onPress={() => {
          router.push("/CreateLocationReminder");
        }}
        label={<Icon name="plus" size={40} color={theme.tertiary} />}
        style={{
          position: "absolute",
          bottom: 15,
          right: 15,
          aspectRatio: "1/1",
          boxShadowColor: "#000",
          boxShadowOffset: { width: 1, height: 1 },
          boxShadowOpacity: 0.6,
          boxShadowRadius: 3,
          elevation: 4,
        }}
      />
    </View>
  );
}
