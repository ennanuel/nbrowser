import ThemedText from "@/components/themed-text";
import ThemedView from "@/components/themed-view";
import { MaterialIconSymbol } from "@/components/ui/icon-symbol";
import { useTabs } from "@/hooks/use-tabs";
import { useThemeColor } from "@/hooks/use-theme-color";
import { PlatformPressable } from "@react-navigation/elements";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";
import WebView from "react-native-webview";

const HOME_URL = "https://ezema.dev";

export default function BrowserTabScreen() {
  const { id } = useLocalSearchParams();

  const { activeTabId, tabs, addTab, updateTab } = useTabs();

  const activeTab = tabs.find((tab) => tab.id === id);
  const historyIndex = activeTab?.history?.index ?? 0;
  const history = activeTab?.history?.entries ?? [];
  const url = history[historyIndex];

  const insets = useSafeAreaInsets();

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isWebPageLoading, setIsLoadingWebPage] = useState(false);

  const [editUrl, setEditUrl] = useState("");
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  const canNext = historyIndex < history.length - 1;
  const canPrev = historyIndex > 0;

  const nextHistory = () => {
    if (canNext) {
      const newIndex = historyIndex + 1;
      if (activeTabId)
        updateTab(activeTabId, {
          history: { index: newIndex, entries: history },
        });
    }
  };
  const prevHistory = () => {
    if (canPrev) {
      const newIndex = historyIndex - 1;
      if (activeTabId)
        updateTab(activeTabId, {
          history: { index: newIndex, entries: history },
        });
    }
  };
  const reload = () => {
    webviewRef.current?.reload();
  };
  const cancelPageLoad = () => {
    webviewRef.current?.stopLoading();
    setIsLoadingWebPage(false);
    setLoadingProgress(0);
  };

  const handleHistory = (newUrl: string) => {
    if (newUrl !== history[historyIndex]) {
      const updatedHistory = history.slice(0, historyIndex + 1);
      updatedHistory.push(newUrl);

      if (!activeTabId) return;
      updateTab(activeTabId, {
        history: { index: updatedHistory.length - 1, entries: updatedHistory },
      });
    }
  };

  const viewShotRef = useRef<ViewShot>(null);
  const webviewRef = useRef<WebView>(null);
  const inputRef = useRef<TextInput>(null);

  const captureViewShot = async () => {
    const snapshotUri = await viewShotRef.current?.capture?.();
    if (!snapshotUri || !activeTabId) return;
    updateTab(activeTabId, { snapshotUri });
  };

  const updateUrlRef = (value: string) => {
    setEditUrl(value);
  };

  const cancelEdit = () => {
    inputRef.current?.blur();
  };

  const changeEditUrl = (urlValue: string) => {
    if (inputRef.current?.isFocused()) return;
    setEditUrl(
      urlValue.match(/^(?:https?:\/\/)?(?:www\.)?([^/:]+)/i)?.[1] ?? urlValue
    );
  };

  const viewURL = () => {
    let finalUrl = editUrl.trim();
    const urlRegex =
      /^(?:(ftp|https)?:\/\/)?(?:[a-z0-9]{2,3}\.)?[a-z0-9_-]+\.[a-z0.9]+/i;

    try {
      if (urlRegex.test(finalUrl)) {
        if (!/^https?:\/\//i.test(editUrl) && !/^ftp:\/\//i.test(editUrl)) {
          finalUrl = `https://${finalUrl}`;
        }
        new URL(finalUrl);
      } else {
        throw new Error("Not a url");
      }
    } catch (error) {
      const searchQuery = encodeURIComponent(editUrl);
      finalUrl = `https://www.google.com/search?q=${searchQuery}`;
    } finally {
      handleHistory(finalUrl);
    }
    inputRef.current?.blur();
  };

  const handleNavigationStateChange = (navState: {
    url: string;
    title?: string;
  }) => {
    handleHistory(navState.url);
    changeEditUrl(navState.url);
    updateTab(activeTabId!, { title: navState.title ?? navState.url });
  };

  return (
    <ThemedView
      style={{
        flex: 1,
        flexDirection: "column-reverse",
        paddingTop: insets.top,
      }}
    >
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 6,
        }}
      >
        <ThemedView
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          {[
            { title: "Back", disabled: !canPrev, action: prevHistory },
            { title: "Forward", disabled: !canNext, action: nextHistory },
          ].map(({ title, action, disabled }) => (
            <PlatformPressable
              key={title}
              onPress={action}
              disabled={disabled}
              style={{
                width: 32,
                aspectRatio: 1,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderStyle: "solid",
                borderRadius: "50%",
                opacity: disabled ? 0.3 : 1,
                display: disabled && title == "Forward" ? "none" : "flex",
              }}
            >
              <MaterialIconSymbol
                name={title === "Back" ? "chevron.left" : "chevron.right"}
                size={24}
                color={textColor}
              />
            </PlatformPressable>
          ))}
        </ThemedView>
        <ThemedView
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PlatformPressable
            onPress={() => addTab()}
            style={{
              width: 32,
              aspectRatio: 1,
              borderRadius: "50%",
              backgroundColor: textColor,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIconSymbol name="plus" color={backgroundColor} size={24} />
          </PlatformPressable>
        </ThemedView>
        <ThemedView
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Link
            href="./tab-switcher"
            style={{
              minWidth: 24,
              paddingHorizontal: 4,
              paddingVertical: 2,
              borderRadius: 4,
              borderWidth: 2,
              borderStyle: "solid",
              borderColor: `${textColor}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={captureViewShot}
          >
            <ThemedText
              style={{
                fontWeight: 600,
              }}
            >
              {tabs.length}
            </ThemedText>
          </Link>
        </ThemedView>
      </ThemedView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ height: "auto" }}
      >
        <ThemedView
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            padding: 6,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: textColor,
          }}
        >
          <TextInput
            ref={inputRef}
            value={editUrl}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="go"
            placeholder="Enter a URL"
            onChangeText={updateUrlRef}
            onFocus={() => {
              setEditUrl(url);
              setIsInputFocused(true);
            }}
            onBlur={() => {
              setIsInputFocused(false);
              changeEditUrl(url);
            }}
            onSubmitEditing={viewURL}
            clearButtonMode="while-editing"
            style={{
              flex: 1,
              paddingVertical: 6,
              paddingHorizontal: 12,
              height: 36,
              color: textColor,
            }}
          />
          {isInputFocused ? (
            <Button title="Cancel" onPress={cancelEdit} />
          ) : (
            <PlatformPressable
              onPress={isWebPageLoading ? cancelPageLoad : reload}
              style={{
                width: 32,
                aspectRatio: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIconSymbol
                name={isWebPageLoading ? "xmark" : "arrow.clockwise"}
                color={textColor}
                size={24}
              />
            </PlatformPressable>
          )}
        </ThemedView>
      </KeyboardAvoidingView>
      <Loader isLoading={isWebPageLoading} progress={loadingProgress} />
      <ViewShot
        ref={viewShotRef}
        style={{ flex: 1 }}
        options={{ format: "jpg", quality: 0.8 }}
      >
        <WebView
          cacheEnabled
          useWebView2
          style={{
            backgroundColor,
            flex: 1,
            height: "100%",
          }}
          ref={webviewRef}
          source={{ uri: url }}
          injectedJavaScript={detectVideoJS}
          onNavigationStateChange={handleNavigationStateChange}
          onOpenWindow={(ev) => {
            addTab(ev.nativeEvent.targetUrl);
          }}
          onLoadProgress={({ nativeEvent }) => {
            setLoadingProgress(nativeEvent.progress);
          }}
          onLoadStart={() => {
            setIsLoadingWebPage(true);
          }}
          onLoad={() => {
            setIsLoadingWebPage(false);
          }}
          onLoadEnd={() => {
            setIsLoadingWebPage(false);
          }}
          onMessage={(event) => {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === "VIDEO_FOUND") setEditUrl("Video found!");
          }}
        />
      </ViewShot>
    </ThemedView>
  );
}

const Loader = ({
  progress,
  isLoading,
}: {
  progress: number;
  isLoading: boolean;
}) => {
  const height = useSharedValue(4);
  const scaleX = useSharedValue(0);
  const tintColor = useThemeColor({}, "tint");

  useEffect(() => {
    scaleX.value = withSpring(progress, { duration: 0.2 });
  }, [progress]);

  useEffect(() => {
    if (isLoading) {
      height.value = withSpring(3, { duration: 0.1 });
    } else {
      height.value = withSpring(0, { duration: 0.3 });
    }
  }, [isLoading]);

  return (
    <ThemedView style={{ width: "100%", backgroundColor: tintColor + "33" }}>
      <Animated.View
        style={{
          backgroundColor: tintColor,
          height,
          transformOrigin: "left",
          transform: [
            {
              scaleX,
            },
          ],
        }}
      ></Animated.View>
    </ThemedView>
  );
};

const detectVideoJS = `
  (function() {
    let interval = setInterval(() => {
      const videos = document.querySelectorAll('video');
      videos.forEach(v => {
        if (v.currentSrc) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'VIDEO_FOUND',
            url: v.currentSrc
          }));
          clearInterval(interval);
        }
      });
    }, 2000); // Check every 2 seconds for dynamic content
  })();
`;
