import { useThemeColor } from "@/hooks/useThemeColor";
import { Pressable, PressableProps, Text } from "react-native";
import { ThemedText } from "./ThemedText";
import { ReactNode } from "react";

interface ThemedButtonProps extends PressableProps {
  label: ReactNode;
}
export function ThemedButton({ label, style, ...rest }: ThemedButtonProps) {
  const theme = useThemeColor();
  return (
    <Pressable
      {...rest}
      style={{
        backgroundColor: theme.tertiary,
        padding: 15,
        borderRadius: 20,
        ...(typeof style === "object" && { ...style }),
      }}
    >
      {typeof label === "string" ? (
        <ThemedText type={["title"]} style={{ color: theme.primary }}>
          {label}
        </ThemedText>
      ) : (
        label
      )}
    </Pressable>
  );
}
