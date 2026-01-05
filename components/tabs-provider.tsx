import { BrowserTab, TabsContext } from "@/hooks/use-tabs";
import { useEffect, useState } from "react";
import uuid from "react-native-uuid";

const DEFAULT_URL = "https://google.com";

export default function TabsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tabs, setTabs] = useState<BrowserTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const addTab = (url = DEFAULT_URL) => {
    const tab = {
      id: uuid.v4(),
      title: url,
      history: { index: 0, entries: [url] },
    };
    setTabs((prev) => [...prev, tab]);
    setActiveTabId(tab.id);
  };
  const closeTab = (id: string) => {
    const tabIndex = tabs.findIndex((tab) => tab.id == id);
    setTabs((prev) => prev.filter((tab) => tab.id !== id));
    if (activeTabId === id) {
      for (let i = tabIndex + 1; i >= 0; i--) {
        if (i === tabIndex) continue;
        else if (tabs[i]) {
          setActiveTabId(tabs[i].id);
          break;
        }
      }
    }
  };
  const updateTab = (id: string, tabProps: Partial<BrowserTab>) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id == id ? { ...tab, ...tabProps } : tab))
    );
  };
  const switchTab = (id: string) => {
    setActiveTabId(id);
  };

  useEffect(() => {
    if (tabs.length < 1) {
      addTab();
    }
  }, [tabs]);

  return (
    <TabsContext.Provider
      value={{ tabs, activeTabId, addTab, closeTab, updateTab, switchTab }}
    >
      {children}
    </TabsContext.Provider>
  );
}
