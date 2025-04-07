import { useThemeColor } from "@/hooks/useThemeColor";
import { Pressable, PressableProps } from "react-native";
import { ThemedText } from "./ThemedText";
import { ReactNode } from "react";

interface ThemedButtonProps extends PressableProps {
  label: ReactNode;
  type?: "secondary";
}
export function ThemedButton({
  label,
  type,
  style,
  ...rest
}: ThemedButtonProps) {
  const theme = useThemeColor();
  return (
    <Pressable
      {...rest}
      style={{
        ...(!type && { backgroundColor: theme.primary }),
        padding: 15,
        borderRadius: 50,
        ...(typeof style === "object" && { ...style }),
      }}
    >
      {typeof label === "string" ? (
        <ThemedText
          type={["subtitle"]}
          style={{
            ...(type === "secondary"
              ? { color: theme.primary, fontSize: 16 }
              : { color: theme.background }),
            textAlign: "center",
          }}
        >
          {label}
        </ThemedText>
      ) : (
        label
      )}
    </Pressable>
  );
}
