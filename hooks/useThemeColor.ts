import { Colors } from "@/utils/colors";
import { useColorScheme } from "react-native";

export function useThemeColor() {
  const theme = useColorScheme() ?? "light";
  return Colors[theme];
}
