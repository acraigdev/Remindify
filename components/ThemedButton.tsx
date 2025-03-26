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
        backgroundColor: theme.primary,
        padding: 15,
        borderRadius: 50,
        ...(typeof style === "object" && { ...style }),
      }}
    >
      {typeof label === "string" ? (
        <ThemedText
          type={["title"]}
          style={{ color: theme.tertiary, textAlign: "center" }}
        >
          {label}
        </ThemedText>
      ) : (
        label
      )}
    </Pressable>
  );
}
