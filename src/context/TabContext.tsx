import React, { createContext, useContext, useState, useCallback } from 'react';

// Update this interface in your TabContext.tsx or types file
export interface TabItem {
  name: string;
  path: string;
  icon?: React.ReactElement;
  // Add these two optional properties
  componentKey?: string;
  data?: any;
}

// 2. Define the TabContextValue interface, correctly including reorderTabs
interface TabContextValue {
  openTabs: TabItem[];
  activeTabPath: string;
  setActiveTab: (path: string) => void;
  closeTab: (path: string) => void;
  addTab: (item: TabItem) => void;
  reorderTabs: (sourceIndex: number, destinationIndex: number) => void; // <-- CORRECTLY PLACED
}

const TabContext = createContext<TabContextValue | undefined>(undefined);

export const useTabs = (): TabContextValue => {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTabs must be used within a TabProvider');
  }
  return context;
};

// Helper function for immutable array reordering
const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed as T);
  return result;
};

export const TabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const defaultTab: TabItem = { name: 'Dashboard', path: '/welcome' };
  const [openTabs, setOpenTabs] = useState<TabItem[]>([defaultTab]);
  const [activeTabPath, setActiveTabPath] = useState(defaultTab.path);

  // 3. Implement the reorderTabs function using useCallback and the reorder helper
  const reorderTabs = useCallback((sourceIndex: number, destinationIndex: number) => {
    // Prevent reordering if the start and end positions are the same
    if (sourceIndex === destinationIndex) return;

    setOpenTabs((prevTabs) => reorder(prevTabs, sourceIndex, destinationIndex));
  }, []);

  const addTab = useCallback((item: TabItem) => {
    setOpenTabs((prev) => {
      if (!prev.find((tab) => tab.path === item.path)) {
        return [...prev, item];
      }
      return prev;
    });
    setActiveTabPath(item.path);
  }, []);

  const closeTab = useCallback(
    (path: string) => {
      if (path === '/welcome') return;

      setOpenTabs((prev) => {
        const newTabs = prev.filter((tab) => tab.path !== path);

        if (path === activeTabPath) {
          const closedTabIndex = prev.findIndex((tab) => tab.path === path);

          // Logic to activate the tab to the right, then left, then the first one
          const newActiveTab = newTabs[closedTabIndex] || newTabs[closedTabIndex - 1] || newTabs[0];

          if (newActiveTab) {
            setActiveTabPath(newActiveTab.path);
          } else {
            // Fallback to the default tab if all others are closed
            setActiveTabPath('/welcome');
          }
        }
        return newTabs;
      });
    },
    [activeTabPath]
  );

  const setActiveTab = setActiveTabPath;

  const value: TabContextValue = {
    openTabs,
    activeTabPath,
    setActiveTab,
    closeTab,
    addTab,
    reorderTabs, // <-- NOW DEFINED AND EXPORTED
  };

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
};
