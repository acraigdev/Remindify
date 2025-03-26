import { Nullable } from "@/utils/types";
import { Pressable, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { Icon } from "./Icon";
import { useThemeColor } from "@/hooks/useThemeColor";

type Option = {
  label: string;
  value: string;
};
type SegmentedButtonProps = {
  options: Array<Option>;
  selected: Nullable<string>;
  onSelectionChange: (val: string) => void;
};

export function SegmentedButton({
  options,
  selected,
  onSelectionChange,
}: SegmentedButtonProps) {
  const theme = useThemeColor();
  return (
    <View style={{ display: "flex", flexDirection: "row", width: "100%" }}>
      {options.map((option, i) => (
        <Pressable
          key={i}
          onPress={() => onSelectionChange(option.value)}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            backgroundColor:
              option.value === selected ? theme.secondary : theme.background,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: theme.border,
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            ...(i === 0 && {
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
            }),
            ...(i === options.length - 1 && {
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
            }),
          }}
        >
          {option.value === selected && (
            <Icon name="checkmark" color={theme.text} />
          )}
          <ThemedText>{option.label}</ThemedText>
        </Pressable>
      ))}
    </View>
  );
}
