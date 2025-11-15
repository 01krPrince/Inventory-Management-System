import React, { createContext, useContext, useState, useCallback } from 'react';

// Define the shape of a tab item
interface TabItem {
    name: string;
    path: string;
}

// Define the shape of the context value (same as the hook's return value)
interface TabContextValue {
    openTabs: TabItem[];
    activeTabPath: string;
    setActiveTab: (path: string) => void;
    closeTab: (path: string) => void;
    addTab: (item: TabItem) => void;
}

// 1. Create the Context 
// Initialize with 'undefined' and assert the type to prevent initial null/undefined checks elsewhere.
const TabContext = createContext<TabContextValue | undefined>(undefined);

// 2. Define the useTabs hook
// This hook provides easy access to the context value.
export const useTabs = (): TabContextValue => {
    const context = useContext(TabContext);
    if (context === undefined) {
        throw new Error('useTabs must be used within a TabProvider');
    }
    return context;
};

// 3. Define the TabProvider component (The missing piece)
export const TabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // --- State and Logic from your original 'useTabs' hook ---
    const defaultTab: TabItem = { name: "Dashboard", path: "/dashboard" };
    const [openTabs, setOpenTabs] = useState<TabItem[]>([defaultTab]);
    const [activeTabPath, setActiveTabPath] = useState(defaultTab.path);

    const addTab = useCallback((item: TabItem) => {
        setOpenTabs(prev => {
            // Only add if the tab doesn't already exist
            if (!prev.find(tab => tab.path === item.path)) {
                return [...prev, item];
            }
            return prev;
        });
        // Always set the new/existing tab as active
        setActiveTabPath(item.path);
    }, []);

    const closeTab = useCallback((path: string) => {
        // Prevent closing the dashboard
        if (path === '/dashboard') return;

        setOpenTabs(prev => {
            const newTabs = prev.filter(tab => tab.path !== path);
            
            // Only update activeTabPath if the closed tab was the active one
            if (path === activeTabPath) {
                const closedTabIndex = prev.findIndex(tab => tab.path === path);
                
                // Determine the next active tab: (after -> before -> dashboard)
                const newActiveTab = newTabs[closedTabIndex] || newTabs[closedTabIndex - 1] || newTabs[0];

                if (newActiveTab) {
                    setActiveTabPath(newActiveTab.path);
                } else {
                    setActiveTabPath('/dashboard'); 
                }
            }
            return newTabs;
        });
    }, [activeTabPath]);

    // Use setActiveTabPath directly as setActiveTab
    const setActiveTab = setActiveTabPath;

    // The value provided by the context
    const value: TabContextValue = {
        openTabs,
        activeTabPath,
        setActiveTab,
        closeTab,
        addTab
    };

    return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
};