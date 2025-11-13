import React, { createContext, useContext, useState, ReactNode } from "react";

// ✅ Reusing types from AppSidebar’s data structure
export type NestedItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
};

export type SubItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
  nestedItems?: NestedItem[];
};

// ✅ Export TabItem so it can be reused elsewhere
export type TabItem = SubItem | NestedItem;

interface TabContextType {
  openTabs: TabItem[];
  activeTabPath: string;
  addTab: (item: TabItem) => void;
  setActiveTab: (path: string) => void;
  closeTab: (path: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

// TabContext.tsx (The hook that throws the error if not wrapped)
export const useTabs = () => {
    const context = useContext(TabContext);
    if (!context) {
        throw new Error('useTabs must be used within a TabProvider'); // <--- Error thrown here
    }
    return context;
};

// ✅ Default (always open) tab
const DEFAULT_TAB: TabItem = { name: "Dashboard", path: "/dashboard" };

export const TabProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [openTabs, setOpenTabs] = useState<TabItem[]>([DEFAULT_TAB]);
  const [activeTabPath, setActiveTabPath] = useState<string>(DEFAULT_TAB.path);

  const addTab = (item: TabItem) => {
    setOpenTabs((prevTabs) => {
      if (!prevTabs.find((tab) => tab.path === item.path)) {
        return [...prevTabs, item];
      }
      return prevTabs;
    });
    setActiveTabPath(item.path);
  };

  const closeTab = (path: string) => {
    setOpenTabs((prevTabs) => {
      const updatedTabs = prevTabs.filter((tab) => tab.path !== path);

      if (activeTabPath === path) {
        // Find the path of the last remaining tab, or default to Dashboard
        const newActiveTabPath =
          updatedTabs.length > 0
            ? updatedTabs[updatedTabs.length - 1].path
            : DEFAULT_TAB.path;
        setActiveTabPath(newActiveTabPath);
      }

      // Ensure default tab stays if all are closed
      return updatedTabs.length > 0 ? updatedTabs : [DEFAULT_TAB];
    });
  };

  const setActiveTab = (path: string) => {
    setActiveTabPath(path);
  };

  return (
    <TabContext.Provider
      value={{ openTabs, activeTabPath, addTab, setActiveTab, closeTab }}
    >
      {children}
    </TabContext.Provider>
  );
};