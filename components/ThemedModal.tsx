import { useThemeColor } from "@/hooks/useThemeColor";
import { ReactNode } from "react";
import { Modal, View } from "react-native";

export function ThemedModal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  const theme = useThemeColor();
  return (
    <Modal animationType="fade" transparent={true} onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.overlay,
        }}
      >
        <View
          style={{
            backgroundColor: theme.background,
            width: "90%",
            padding: 40,
            borderRadius: 15,
          }}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
}
