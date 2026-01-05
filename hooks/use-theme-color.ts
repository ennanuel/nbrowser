import { Color } from "@/constants/theme";
import { useColorScheme } from "react-native";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Color.dark & keyof typeof Color.light
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  return colorFromProps || Color[theme][colorName];
}
