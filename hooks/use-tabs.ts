import { createContext, useContext } from "react";

export type BrowserTab = {
  id: string;
  title: string;
  snapshotUri?: string;
  history: {
    index: number;
    entries: string[];
  };
};

export const TabsContext = createContext<{
  tabs: BrowserTab[];
  activeTabId: string | null;
  addTab: (url?: string) => void;
  closeTab: (id: string) => void;
  updateTab: (id: string, props: Partial<BrowserTab>) => void;
  switchTab: (id: string) => void;
}>({
  tabs: [],
  activeTabId: null,
  addTab: () => {},
  closeTab: () => {},
  updateTab: () => {},
  switchTab: () => {},
});

export const useTabs = () => useContext(TabsContext);
