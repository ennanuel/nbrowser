import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolViewProps, SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

type IconMapping = Record<
  SymbolViewProps["name"],
  ComponentProps<typeof MaterialIcons>["name"]
>;
type IconSymbolName = keyof typeof MAPPING;

type MaterialIconSymbolProps = {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
};

const MAPPING = {
  "arrow.clockwise": "refresh",
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  magnifyingglass: "search",
  xmark: "close",
  plus: "add",
} as IconMapping;

export function MaterialIconSymbol({
  name,
  size,
  color,
  style,
  weight,
}: MaterialIconSymbolProps) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      weight={weight}
      style={style}
      name={MAPPING[name]}
    />
  );
}
