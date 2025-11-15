import React, { useCallback, useEffect, useState, useRef } from "react";
import { allItems } from "./navigation"; // Import navigation data
import { ChevronRightIcon } from "../components/icons"; // Import icons
import { useTabs } from '../context/TabContext'; // Import useTabs

// Utility to check if an item or its sub-items match the active path
const findActiveItemPath = (items: any[] = [], activePath: string): boolean => {
    for (const item of items) {
      if (item.path === activePath) return true;
      if (item.subItems) {
        // Recursive check for subItems (Level 2)
        if (findActiveItemPath(item.subItems, activePath)) return true;
      }
      if (item.nestedItems) {
        // Direct check for nestedItems (Level 3)
        if (item.nestedItems.some((i: { path: string }) => i.path === activePath)) {
          return true;
        }
      }
    }
    return false;
};

// Tailwind CSS Classes
const baseLinkClasses = "flex items-center text-sm px-3 py-2 rounded-md transition-colors duration-200 w-full";
const primaryColorClass = "bg-[#0c5888] text-white shadow-md";
const inactiveLinkClasses = "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700";


// ============================================
// LEVEL 3 LINK
// ============================================
interface NavItem { name: string; path: string; icon?: React.ReactElement; subItems?: NavItem[]; nestedItems?: NavItem[]; }

const NestedLink = React.memo(({ item, addTab, activeTabPath }: { item: NavItem, addTab: (item: NavItem) => void, activeTabPath: string }) => {
    const isItemActive = item.path === activeTabPath;

    return (
        <li className="mb-1">
            <button
                onClick={(e) => { 
                    e.stopPropagation(); 
                    addTab(item); 
                }}
                className={`flex items-center text-xs px-3 py-1.5 rounded-md w-full transition-colors duration-150 ${
                    isItemActive
                        ? 'bg-indigo-100 text-indigo-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
                <span className={`w-1.5 h-1.5 rounded-full mr-3 ${isItemActive ? 'bg-indigo-600' : 'bg-gray-400'}`} />
                {item.name}
            </button>
        </li>
    );
});

// ============================================
// LEVEL 2 FLYOUT ITEM
// ============================================
const SubFlyoutItem = React.memo(({ item, addTab, activeTabPath }: { item: NavItem, addTab: (item: NavItem) => void, activeTabPath: string }) => {
    const [isNestedOpen, setIsNestedOpen] = useState(false);
    const hasNestedItems = !!item.nestedItems && item.nestedItems.length > 0;
    
    // Check if the current path or any nested child's path is active
    const isItemActive = item.path === activeTabPath || (hasNestedItems && item.nestedItems!.some(i => i.path === activeTabPath));

    useEffect(() => {
        if (isItemActive) {
            setIsNestedOpen(true);
        }
    }, [isItemActive]);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (hasNestedItems) {
            setIsNestedOpen(prev => !prev);
        } else {
            addTab(item);
        }
    };

    return (
        <li className="mb-1">
            <button
                onClick={handleClick}
                className={`flex items-center justify-between text-sm px-3 py-2 rounded-md w-full transition-colors duration-150 ${
                    isItemActive
                        ? 'bg-white text-[#0c5888] font-medium shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
                <span>{item.name}</span>
                {hasNestedItems && (
                    <ChevronRightIcon className={`w-3 h-3 transition-transform duration-200 ${isNestedOpen ? 'transform rotate-90' : ''}`} />
                )}
            </button>
            
            {/* Level 3: Nested Menu */}
            {hasNestedItems && isNestedOpen && (
                <ul className="pl-4 pt-1 mt-1 border-l border-gray-200 dark:border-gray-700">
                    {item.nestedItems!.map(nestedItem => (
                        <NestedLink 
                            key={nestedItem.path} 
                            item={nestedItem} 
                            addTab={addTab} 
                            activeTabPath={activeTabPath} 
                        />
                    ))}
                </ul>
            )}
        </li>
    );
});


// ============================================
// FLYOUT BOX (Levels 2 & 3)
// ============================================
interface FlyoutBoxProps {
    item: NavItem & { subItems: NavItem[] };
    parentBounds: DOMRect;
    onClose: () => void;
    addTab: (item: NavItem) => void;
    activeTabPath: string;
}

const FlyoutBox: React.FC<FlyoutBoxProps> = ({ item, parentBounds, onClose, addTab, activeTabPath }) => {
    const flyoutRef = useRef<HTMLDivElement>(null);

    // Position the flyout based on the sidebar link's position
    const style = {
        top: parentBounds.top,
        left: parentBounds.right,
        maxHeight: `calc(100vh - ${parentBounds.top}px - 20px)`, // Prevent overflow
    };

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                flyoutRef.current && 
                !flyoutRef.current.contains(event.target as Node) && 
                (event.target as HTMLElement).closest('aside') === null // Don't close if clicking inside the fixed sidebar
            ) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={flyoutRef}
            className="fixed z-50 w-72 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-y-auto"
            style={style}
        >
            <h4 className="text-lg font-bold text-[#0c5888] dark:text-indigo-400 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                {item.name} Sub-Menu
            </h4>
            <ul className="space-y-1">
                {item.subItems.map(subItem => (
                    <SubFlyoutItem
                        key={subItem.path || subItem.name}
                        item={subItem}
                        addTab={addTab}
                        activeTabPath={activeTabPath}
                    />
                ))}
            </ul>
        </div>
    );
};


// ============================================
// LEVEL 1 FIXED SIDEBAR LINK
// ============================================
interface SidebarLinkProps {
    item: NavItem;
    onClick: (data: { item: NavItem, bounds: DOMRect }) => void;
    isActive: boolean;
    addTab: (item: NavItem) => void;
    onCloseFlyout: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = React.memo(({ item, onClick, isActive, addTab, onCloseFlyout }) => {
    const linkRef = useRef<HTMLButtonElement>(null);
    const hasSubItems = !!item.subItems && item.subItems.length > 0;
    
    const handleClick = () => {
        if (!linkRef.current) return;

        if (hasSubItems) {
            // Get boundaries to position the flyout box
            const bounds = linkRef.current.getBoundingClientRect();
            onClick({ item, bounds });
        } else {
            // Navigate 1st layer link without sub-items
            addTab(item);
            onCloseFlyout(); // Close flyout when a tab is added directly from the main sidebar
        }
    };

    return (
        <li className="mb-1">
            <button
                ref={linkRef}
                onClick={handleClick}
                // Tailwind classes for the vertical, icon-focused sidebar link
                className={`${baseLinkClasses} ${isActive ? primaryColorClass : inactiveLinkClasses} font-medium flex-col justify-center h-16 pt-2 pb-2 relative`}
            >
                {/* Clone element ensures icon inherits props like className */}
                {item.icon && React.cloneElement(item.icon, {
                    className: `w-5 h-5 ${isActive ? 'text-white' : 'text-current'}`,
                })}
                <span className="text-xs mt-1 truncate max-w-full">{item.name}</span>
                {hasSubItems && (
                    <ChevronRightIcon className={`absolute right-1 w-3 h-3 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                )}
            </button>
        </li>
    );
});

// ============================================
// MAIN SIDEBAR COMPONENT
// ============================================
interface AppSidebarProps {
    addTab: (item: NavItem) => void;
    activeTabPath: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ addTab, activeTabPath }) => {
    // State to manage the open flyout: { item: itemObject, bounds: DOMRect }
    const [activeFlyout, setActiveFlyout] = useState<{ item: NavItem & { subItems: NavItem[] }, bounds: DOMRect } | null>(null);

    const handleLinkClick = useCallback(({ item, bounds }: { item: NavItem, bounds: DOMRect }) => {
        // Type assertion for 'item' since we check for subItems presence before calling
        setActiveFlyout(prev => (prev?.item.name === item.name ? null : { item: item as NavItem & { subItems: NavItem[] }, bounds }));
    }, []);

    const handleCloseFlyout = useCallback(() => {
        setActiveFlyout(null);
    }, []);
    
    // Determines if the main link or any of its nested children are active
    const isMainLinkActive = useCallback((item: NavItem) => {
        return item.path === activeTabPath || findActiveItemPath(item.subItems, activeTabPath);
    }, [activeTabPath]);

    return (
        <>
            <aside
                className={`fixed top-0 left-0 z-40 h-screen py-4 w-[110px] bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-y-auto shadow-lg`}
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#888 #f1f1f1' }}
            >
                <div className="flex flex-col h-full px-2">
                    <div className="flex justify-center mb-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="text-xl font-extrabold text-[#0c5888] dark:text-indigo-400">APP</div>
                    </div>
                    <nav className="flex-grow space-y-1">
                        {allItems.map((item) => (
                            <SidebarLink
                                key={item.name}
                                item={item}
                                onClick={handleLinkClick}
                                isActive={isMainLinkActive(item)}
                                addTab={addTab}
                                onCloseFlyout={handleCloseFlyout}
                            />
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Render FlyoutBox if activeFlyout is set and has subItems */}
            {activeFlyout && activeFlyout.item.subItems && (
                <FlyoutBox
                    item={activeFlyout.item}
                    parentBounds={activeFlyout.bounds}
                    onClose={handleCloseFlyout}
                    addTab={addTab}
                    activeTabPath={activeTabPath}
                />
            )}
        </>
    );
};