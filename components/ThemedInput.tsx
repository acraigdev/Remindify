import { useThemeColor } from "@/hooks/useThemeColor";
import { TextInput, TextInputProps, View } from "react-native";
import { Icon, IconSymbolName } from "./Icon";
import { forwardRef } from "react";

interface ThemedInputProps extends TextInputProps {
  icon?: IconSymbolName;
  value?: string;
  onChangeText?: (val: string) => void;
}

export const ThemedInput = forwardRef(
  ({ icon, ...rest }: ThemedInputProps, ref) => {
    const theme = useThemeColor();
    return (
      <View
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: theme.border,
          height: 60,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: 10,
          gap: 8,
          width: "100%",
          backgroundColor: theme.background,
        }}
      >
        {icon && <Icon name={icon} color={theme.border} size={30} />}
        <TextInput
          ref={ref}
          style={{
            color: theme.border,
            fontSize: 16,
            height: 60,
            width: "100%",
          }}
          {...rest}
          placeholderTextColor={theme.borderLight}
        />
      </View>
    );
  }
);
