import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, Text, TextProps } from "react-native";

export type TextVariants =
  | "default"
  | "title"
  | "defaultSemiBold"
  | "subtitle"
  | "link";
export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: keyof typeof styles;
};

export default function ThemedText({
  lightColor,
  darkColor,
  variant,
  style,
  ...props
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[style, { color }, variant ? styles[variant] : undefined]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
});
