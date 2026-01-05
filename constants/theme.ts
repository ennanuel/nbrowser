type ThemeColor = {
  dark: Record<string, string>;
  light: Record<string, string>;
};

export const Color: ThemeColor = {
  dark: {
    background: "#000000",
    text: "#FAFAFA",
    tint: "#FFFF00",
  },
  light: {
    background: "#FFFFFF",
    text: "#202020",
    tint: "#AAAAFF",
  },
};
