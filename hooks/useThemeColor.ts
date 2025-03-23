import { Colors } from "@/utils/colors";
import { useColorScheme } from "react-native";

export function useThemeColor() {
  // TODO
  //   const theme = useColorScheme() ?? "light";
  const theme = "light";
  return Colors[theme];
}
