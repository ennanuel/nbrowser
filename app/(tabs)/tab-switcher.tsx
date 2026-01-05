import ThemedView from "@/components/themed-view";
import { MaterialIconSymbol } from "@/components/ui/icon-symbol";
import { BrowserTab, useTabs } from "@/hooks/use-tabs";
import { useThemeColor } from "@/hooks/use-theme-color";
import { PlatformPressable } from "@react-navigation/elements";
import { Image } from "expo-image";
import { router, useNavigation } from "expo-router";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsSwitcher() {
  const navigation = useNavigation();
  const { tabs, activeTabId, switchTab, closeTab } = useTabs();

  const highlightColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const inset = useSafeAreaInsets();

  const populateTabData = (tab: BrowserTab, index: number) =>
    ({
      ...tab,
      index,
      activeTabId,
      colors: {
        text: textColor,
        highlight: highlightColor,
      },
      closeTab,
      switchTab: (id: string) => {
        switchTab(id);
        // navigation.goBack();
        router.push({ pathname: "/(tabs)/[id]", params: { id } });
      },
    } as BrowserTabProps);

  const tabItems = tabs.map(populateTabData);

  const renderItem = ({
    item: {
      id,
      index,
      colors,
      title,
      snapshotUri,
      activeTabId,
      closeTab,
      switchTab,
    },
  }: {
    item: BrowserTabProps;
  }) => {
    const isActive = activeTabId == id;

    return (
      <TouchableOpacity
        onPress={() => switchTab(id)}
        style={{
          marginRight: index % 2 == 0 ? "4%" : 0,
          borderRadius: 6,
          borderWidth: 1,
          borderStyle: "solid",
          width: "100%",
          maxWidth: "48%",
          borderColor: isActive ? colors.highlight : colors.text,
          backgroundColor: isActive ? `${colors.highlight}33` : "transparent",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderBottomWidth: 1,
            borderStyle: "solid",
            borderBottomColor: colors.text,
          }}
        >
          <Text ellipsizeMode="tail" style={{ width: "60%" }}>
            {title}
          </Text>
          <PlatformPressable
            onPress={(event) => {
              event.preventDefault();
              closeTab(id);
            }}
          >
            <MaterialIconSymbol name="xmark" color={colors.text} />
          </PlatformPressable>
        </View>
        <View style={{ flex: 1, height: 120 }}>
          {snapshotUri ? (
            <Image
              source={snapshotUri}
              style={{ width: "100%", height: "100%", resizeMode: "cover" }}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={{ flex: 1, padding: 16, paddingTop: inset.top + 16 }}>
      <ThemedView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <FlatList
            data={tabItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={{
              flex: 1,
              gap: 12,
              justifyContent: "space-between",
            }}
          />
        </ScrollView>
      </ThemedView>
      <ThemedView style={{ flexDirection: "row" }}></ThemedView>
    </ThemedView>
  );
}

type BrowserTabProps = BrowserTab & {
  index: number;
  activeTabId: string | null;
  switchTab: (id: string) => void;
  closeTab: (id: string) => void;
  colors: Record<string, string>;
};
