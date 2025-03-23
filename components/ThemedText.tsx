import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, TextProps, StyleSheet } from "react-native";

type TypeOptions =
  | "title"
  | "defaultSemiBold"
  | "subtitle"
  | "link"
  | "inverted";
export type ThemedTextProps = TextProps & {
  type?: Array<TypeOptions> | TypeOptions;
};

export function ThemedText({ type, style, ...rest }: ThemedTextProps) {
  const theme = useThemeColor();

  return (
    <Text
      style={[
        { color: type?.includes("inverted") ? theme.secondary : theme.text },
        !type ? styles.default : undefined,
        type?.includes("title") ? styles.title : undefined,
        type?.includes("defaultSemiBold") ? styles.defaultSemiBold : undefined,
        type?.includes("subtitle") ? styles.subtitle : undefined,
        type?.includes("link") ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
  },
  defaultSemiBold: {
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    fontSize: 16,
  },
});
