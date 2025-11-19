import React, { useCallback, useEffect, useState, useRef } from "react";
import { allItems } from "./navigation";
import { ChevronRightIcon } from "../components/icons";
import LogoWithIntroAnimation from "./LogoWithIntroAnimation";

const findActiveItemPath = (items: any[] = [], activePath: string): boolean => {
  for (const item of items) {
    if (item.path === activePath) return true;
    if (item.subItems) {
      if (findActiveItemPath(item.subItems, activePath)) return true;
    }
    if (item.nestedItems) {
      if (
        item.nestedItems.some((i: { path: string }) => i.path === activePath)
      ) {
        return true;
      }
    }
  }
  return false;
};

const baseLinkClasses =
  "flex items-center text-sm px-3 py-2 rounded-md transition-colors duration-200 w-full";
const primaryColorClass = "bg-[#0c5888] text-white shadow-md";
const inactiveLinkClasses =
  "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700";

interface NavItem {
  name: string;
  path?: string;
  icon?: React.ReactElement;
  subItems?: NavItem[];
  nestedItems?: NavItem[];
}

const NestedLink = React.memo(
  ({
    item,
    addTab,
    activeTabPath,
    onClose,
  }: {
    item: NavItem;
    addTab: (item: NavItem) => void;
    activeTabPath: string;
    onClose: () => void;
  }) => {
    const isItemActive = item.path === activeTabPath;

    return (
      <li className="mb-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            // This is always a leaf node, so it adds a tab.
            addTab(item);
            onClose(); // Closes all flyouts (Level 2 and 3)
          }}
          className={`flex items-center justify-start text-xs px-3 py-1.5 rounded-md w-full transition-colors duration-150 ${
            isItemActive
              ? "bg-indigo-100 text-[#0c5888] font-semibold"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-3 ${
              isItemActive ? "bg-[#0c5888]" : "bg-gray-400"
            }`}
          />
          {item.name}
        </button>
      </li>
    );
  }
);

// =========================================================================================
// LEVEL 3 CONTAINER: NESTED FLYOUT BOX
// =========================================================================================

interface NestedFlyoutBoxProps {
  item: NavItem & { nestedItems: NavItem[] };
  parentBounds: DOMRect; // Bounds of the SubFlyoutItem button
  onClose: () => void;
  addTab: (item: NavItem) => void;
  activeTabPath: string;
}

const NestedFlyoutBox: React.FC<NestedFlyoutBoxProps> = ({
  item,
  parentBounds,
  onClose,
  addTab,
  activeTabPath,
}) => {
  const flyoutRef = useRef<HTMLDivElement>(null);

  // Position the box based on the viewport coordinates of the SubFlyoutItem button
  const style = {
    top: parentBounds.top,
    preventOverflow: "scroll",
    left: parentBounds.right, // Start immediately to the right of the SubFlyoutItem button
    maxHeight: `calc(100vh - ${parentBounds.top}px - 20px)`,
  };

  return (
    <div
      ref={flyoutRef}
      className="fixed z-50 w-72 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-2xl border border-gray-300 dark:border-gray-600 overflow-y-auto"
      style={style}
    >
      <h4 className="text-sm font-bold text-[#0c5888] dark:text-indigo-400 mb-2 border-b border-gray-300 dark:border-gray-600 pb-2">
        {item.name}
      </h4>
      <ul className="space-y-1">
        {item.nestedItems.map((nestedItem) => (
          <NestedLink
            key={nestedItem.path}
            item={nestedItem}
            addTab={addTab}
            activeTabPath={activeTabPath}
            onClose={onClose}
          />
        ))}
      </ul>
    </div>
  );
};

// =========================================================================================
// LEVEL 2: SUB FLYOUT ITEM
// =========================================================================================

interface SubFlyoutItemProps {
  item: NavItem;
  addTab: (item: NavItem) => void;
  activeTabPath: string;
  onClose: () => void; // Overall close function (from AppSidebar)
  onHover: (data: { item: NavItem; bounds: DOMRect }) => void; // To tell parent (FlyoutBox/FlyoutWrapper) to open nested flyout
  isThirdLevelActive: boolean;
}

const SubFlyoutItem = React.memo(
  ({
    item,
    addTab,
    activeTabPath,
    onClose,
    onHover,
    isThirdLevelActive,
  }: SubFlyoutItemProps) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const hasNestedItems = !!item.nestedItems && item.nestedItems.length > 0;

    const isItemActive =
      item.path === activeTabPath ||
      (hasNestedItems &&
        item.nestedItems!.some((i) => i.path === activeTabPath));

    // Handler to inform the parent (FlyoutWrapper) to open the adjacent menu
    const handleMouseEnter = () => {
      if (buttonRef.current) {
        const bounds = buttonRef.current.getBoundingClientRect();
        onHover({ item, bounds });
      }
    };

    // Click only navigates if the item has a path AND no nested items.
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      // If the item has nested items, it is a parent link and should only open the nested flyout on hover.
      if (!hasNestedItems && item.path) {
        addTab(item);
        onClose();
      }
      // If it has nested items or no path, the click is ignored (only hover is functional).
    };

    return (
      <li
        className="mb-1"
        onMouseEnter={handleMouseEnter} // Trigger hover logic
      >
        <button
          ref={buttonRef} // Attach ref to get bounds
          onClick={handleClick}
          className={`flex items-center justify-between text-sm px-3 py-2 rounded-md w-full transition-colors duration-150 ${
            isItemActive || isThirdLevelActive
              ? "bg-white text-[#0c5888] font-medium shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <span>{item.name}</span>
          {hasNestedItems && (
            <ChevronRightIcon
              className={`w-3 h-3 transition-transform duration-200 ${
                isThirdLevelActive ? "transform rotate-90" : ""
              }`}
            />
          )}
        </button>
      </li>
    );
  }
);

// =========================================================================================
// LEVEL 2 CONTAINER: FLYOUT BOX
// =========================================================================================

interface FlyoutBoxProps {
  item: NavItem & { subItems: NavItem[] };
  parentBounds: DOMRect;
  onClose: () => void; // Overall close function (from AppSidebar)
  addTab: (item: NavItem) => void;
  activeTabPath: string;
  onSubItemHover: (data: { item: NavItem; bounds: DOMRect }) => void; // Passed from FlyoutWrapper
  activeNestedFlyout: {
    item: NavItem & { nestedItems: NavItem[] };
    bounds: DOMRect;
  } | null; // Passed from FlyoutWrapper
}

const FlyoutBox: React.FC<FlyoutBoxProps> = ({
  item,
  parentBounds,
  onClose,
  addTab,
  activeTabPath,
  onSubItemHover,
  activeNestedFlyout,
}) => {
  const flyoutRef = useRef<HTMLDivElement>(null);

  const style = {
    top: parentBounds.top,
    left: parentBounds.right,
    maxHeight: `calc(100vh - ${parentBounds.top}px - 20px)`,
  };

  return (
    <div
      ref={flyoutRef}
      className="fixed z-50 w-72 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-y-auto"
      style={style}
    >
      <h4 className="text-lg font-bold text-[#0c5888] dark:text-indigo-400 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
        {item.name}
      </h4>
      <ul className="space-y-1">
        {item.subItems.map((subItem) => (
          <SubFlyoutItem
            key={subItem.path || subItem.name}
            item={subItem}
            addTab={addTab}
            activeTabPath={activeTabPath}
            onClose={onClose}
            onHover={onSubItemHover} // Pass the handler from FlyoutWrapper
            isThirdLevelActive={subItem.name === activeNestedFlyout?.item.name}
          />
        ))}
      </ul>
    </div>
  );
};

// =========================================================================================
// WRAPPER: FLYOUT WRAPPER (MODIFIED)
// Enforces click-to-open behavior from Level 1.
// =========================================================================================

interface FlyoutWrapperProps {
  activeFlyout: {
    item: NavItem & { subItems: NavItem[] };
    bounds: DOMRect;
  } | null;
  onCloseFlyout: () => void;
  addTab: (item: NavItem) => void;
  activeTabPath: string;
  isClickOpened: boolean; // Kept in interface to avoid errors from parent
}

const FlyoutWrapper: React.FC<FlyoutWrapperProps> = ({
  activeFlyout,
  onCloseFlyout,
  addTab,
  activeTabPath,
  // isClickOpened, <--- REMOVED: unused variable causing TS error
}) => {
  const [activeNestedFlyout, setActiveNestedFlyout] = useState<{
    item: NavItem & { nestedItems: NavItem[] };
    bounds: DOMRect;
  } | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------------------------------------
  // FIX APPLIED HERE:
  // When the parent flyout (activeFlyout) changes, we MUST reset the
  // nested flyout state. Otherwise, switching from Tab C to Tab A keeps
  // Tab C's nested sub-items active.
  // -------------------------------------------------------------------------
  useEffect(() => {
    setActiveNestedFlyout(null);
  }, [activeFlyout]);
  // -------------------------------------------------------------------------

  const handleSubItemHover = useCallback(
    ({ item, bounds }: { item: NavItem; bounds: DOMRect }) => {
      if (item.nestedItems && item.nestedItems.length > 0) {
        setActiveNestedFlyout({
          item: item as NavItem & { nestedItems: NavItem[] },
          bounds,
        });
      } else {
        // If the hovered item has no nested items, close the nested flyout
        setActiveNestedFlyout(null);
      }
    },
    []
  );

  // MODIFIED: Since SidebarLink now only opens the flyout via click,
  // we rely on handleClickOutside to close the main flyout.
  // This handler is simplified to only close the nested (Level 3) flyout on mouse leave.
  const handleWrapperMouseLeave = useCallback(() => {
    // Only close the Level 3 nested flyout. The main flyout stays open.
    setActiveNestedFlyout(null);
  }, []);

  useEffect(() => {
    // This effect handles clicks *outside* the entire wrapper (main flyout + nested flyout)
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeFlyout &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node) &&
        (event.target as HTMLElement).closest("aside") === null // Make sure not clicking sidebar
      ) {
        onCloseFlyout();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCloseFlyout, activeFlyout]);

  if (!activeFlyout) return null; // Don't render if no main flyout is active

  return (
    // The wrapper div covers the area where both flyouts can appear
    <div
      className="absolute top-0 left-0"
      onMouseLeave={handleWrapperMouseLeave} // Now only closes the Level 3 flyout
      ref={wrapperRef}
    >
      {/* The main FlyoutBox */}
      {/* Added KEY to ensure complete re-render when switching parent tabs */}
      <FlyoutBox
        key={activeFlyout.item.name}
        item={activeFlyout.item}
        parentBounds={activeFlyout.bounds}
        onClose={onCloseFlyout}
        addTab={addTab}
        activeTabPath={activeTabPath}
        onSubItemHover={handleSubItemHover}
        activeNestedFlyout={activeNestedFlyout}
      />

      {/* The NestedFlyoutBox, rendered if active */}
      {activeNestedFlyout && activeNestedFlyout.item.nestedItems && (
        <NestedFlyoutBox
          item={activeNestedFlyout.item}
          parentBounds={activeNestedFlyout.bounds}
          onClose={onCloseFlyout}
          addTab={addTab}
          activeTabPath={activeTabPath}
        />
      )}
    </div>
  );
};

// =========================================================================================
// LEVEL 1: SIDEBAR LINK (MODIFIED)
// REMOVED HOVER FUNCTIONALITY: Only click opens the flyout.
// =========================================================================================

interface SidebarLinkProps {
  item: NavItem;
  onClick: (data: { item: NavItem; bounds: DOMRect; isClick: boolean }) => void; // MODIFIED
  isActive: boolean;
  addTab: (item: NavItem) => void;
  onCloseFlyout: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = React.memo(
  ({ item, onClick, isActive, addTab, onCloseFlyout }) => {
    const linkRef = useRef<HTMLButtonElement>(null);
    const hasSubItems = !!item.subItems && item.subItems.length > 0;

    const handleClick = () => {
      if (!linkRef.current) return;

      if (hasSubItems) {
        // Flyout only opens on click, so we pass isClick: true
        const bounds = linkRef.current.getBoundingClientRect();
        onClick({ item, bounds, isClick: true });
      } else if (item.path) {
        addTab(item);
        onCloseFlyout();
      }
    };

    // --- REMOVED handleMouseEnter FUNCTION ---

    return (
      // --- REMOVED onMouseEnter={handleMouseEnter} PROP ---
      <li className="mb-1">
        <button
          ref={linkRef}
          onClick={handleClick}
          className={`${baseLinkClasses} ${
            isActive ? primaryColorClass : inactiveLinkClasses
          } font-medium flex-col justify-center h-16 pt-2 pb-2 relative`}
        >
          {item.icon &&
            React.cloneElement(item.icon, {
              className: `w-5 h-5 ${isActive ? "text-white" : "text-current"}`,
            } as React.HTMLAttributes<HTMLElement>)}
          <span className="text-xs mt-1 truncate max-w-full">{item.name}</span>
          {hasSubItems && (
            <ChevronRightIcon
              className={`absolute right-1 w-3 h-3 ${
                isActive ? "text-white" : "text-gray-500"
              }`}
            />
          )}
        </button>
      </li>
    );
  }
);

// =========================================================================================
// MAIN COMPONENT: APP SIDEBAR
// =========================================================================================

interface AppSidebarProps {
  addTab: (item: NavItem) => void;
  activeTabPath: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  addTab,
  activeTabPath,
}) => {
  const [activeFlyout, setActiveFlyout] = useState<{
    item: NavItem & { subItems: NavItem[] };
    bounds: DOMRect;
  } | null>(null);

  // New state to track if the current active flyout was opened by a click
  const [isClickOpened, setIsClickOpened] = useState(false);

  const handleLinkClick = useCallback(
    ({
      item,
      bounds,
      isClick,
    }: {
      item: NavItem;
      bounds: DOMRect;
      isClick: boolean; // Receive new flag
    }) => {
      // If the same item is clicked, close it
      if (activeFlyout?.item.name === item.name && isClick) {
        setActiveFlyout(null);
        setIsClickOpened(false);
      } else {
        // Open the flyout
        setActiveFlyout({
          item: item as NavItem & { subItems: NavItem[] },
          bounds,
        });
        // Set the mode of opening
        // Since SidebarLink only calls this with isClick: true, isClickOpened will be true here
        setIsClickOpened(isClick);
      }
    },
    [activeFlyout]
  );

  const handleCloseFlyout = useCallback(() => {
    // Closes the main flyout and resets the click state
    setActiveFlyout(null);
    setIsClickOpened(false);
  }, []);

  const isMainLinkActive = useCallback(
    (item: NavItem) => {
      return (
        item.path === activeTabPath ||
        findActiveItemPath(item.subItems, activeTabPath)
      );
    },
    [activeTabPath]
  );

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-40 h-screen py-4 w-[110px] bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-y-auto shadow-lg`}
        style={{ scrollbarWidth: "thin", scrollbarColor: "#888 #f1f1f1" }}
      >
        <div className="flex flex-col h-full px-2">
          <div className="flex justify-center mb-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <LogoWithIntroAnimation />
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

      {/* Renders the FlyoutWrapper which contains both Level 2 and Level 3 flyouts */}
      <FlyoutWrapper
        activeFlyout={activeFlyout}
        onCloseFlyout={handleCloseFlyout}
        addTab={addTab}
        activeTabPath={activeTabPath}
        isClickOpened={isClickOpened} // Pass new state down
      />
    </>
  );
};
