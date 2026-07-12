import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import { allItems } from "./navigation";
import { ChevronRightIcon } from "../components/icons";
import LogoWithIntroAnimation from "./LogoWithIntroAnimation";
import { useLayoutContext } from "./AppLayout"; // ← IMPORT SHARED CONTEXT
import { X } from "lucide-react"; 

interface NavItem {
  name: string;
  path?: string;
  icon?: React.ReactElement;
  subItems?: NavItem[];
  nestedItems?: NavItem[];
}

const useSmartPosition = (
  parentBounds: DOMRect | null,
  menuWidth: number = 208
) => {
  const [coords, setCoords] = useState({ top: 0, left: 0, maxHeight: "100vh" });

  useLayoutEffect(() => {
    if (!parentBounds) return;

    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const OVERLAP = 10;

    const spaceRight = vw - parentBounds.right;
    const shouldFlipLeft = spaceRight < menuWidth;

    let left = shouldFlipLeft
      ? parentBounds.left - menuWidth + OVERLAP
      : parentBounds.right - OVERLAP;

    let top = parentBounds.top;
    const estimatedHeight = 400;
    const spaceBottom = vh - top;

    if (spaceBottom < 200) {
      top = Math.max(10, vh - estimatedHeight - 20);
    }

    setCoords({
      top,
      left,
      maxHeight: `calc(100vh - ${top + 20}px)`,
    });
  }, [parentBounds, menuWidth]);

  return coords;
};

const findActiveItemPath = (items: any[] = [], activePath: string): boolean => {
  for (const item of items) {
    if (item.path === activePath) return true;
    if (item.subItems && findActiveItemPath(item.subItems, activePath))
      return true;
    if (item.nestedItems?.some((i: { path: string }) => i.path === activePath))
      return true;
  }
  return false;
};

const baseLinkClasses =
  "flex items-center text-sm px-3 py-1.5 rounded-md transition-colors duration-200 w-full";
const primaryColorClass = "bg-[#0c5888] text-white shadow-md";
const inactiveLinkClasses =
  "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700";

const NestedLink = React.memo(
  ({ item, addTab, activeTabPath, onClose }: any) => {
    const isItemActive = item.path === activeTabPath;
    const { setIsMobileOpen } = useLayoutContext(); 

    return (
      <li className="mb-[2px] list-none">
        <button
          onClick={(e) => {
            e.stopPropagation();
            addTab(item);
            onClose();
            if (window.innerWidth < 1024) setIsMobileOpen(false); // Auto close mobile
          }}
          className={`flex items-start justify-start gap-2 text-sm px-3 py-1.5 rounded-r-md w-full transition-colors duration-150 ${
            isItemActive
              ? "bg-indigo-50 dark:bg-gray-700 text-[#0c5888] dark:text-indigo-300 font-medium"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <span className="flex-1 text-left whitespace-normal break-words">
            {item.name}
          </span>
        </button>
      </li>
    );
  }
);

const NestedFlyoutBox: React.FC<any> = ({
  item,
  parentBounds,
  onClose,
  addTab,
  activeTabPath,
}) => {
  const coords = useSmartPosition(parentBounds);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed z-[130] ml-4 w-52 p-3 bg-gray-50 dark:bg-gray-900 rounded-r-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
      style={{
        top: coords.top,
        left: coords.left,
        maxHeight: coords.maxHeight,
      }}
    >
      <h4 className="text-base font-bold text-[#0c5888] dark:text-indigo-400 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1.5">
        {item.name}
      </h4>
      <ul className="space-y-0.5 list-none p-0 m-0">
        {item.nestedItems.map((nestedItem: any) => (
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

const SubFlyoutItem = React.memo(
  ({
    item,
    addTab,
    activeTabPath,
    onClose,
    onToggleNested,
    isThirdLevelActive,
  }: any) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const hasNestedItems = !!item.nestedItems && item.nestedItems.length > 0;
    const isItemActive =
      item.path === activeTabPath ||
      (hasNestedItems &&
        item.nestedItems!.some((i: any) => i.path === activeTabPath));
    const { setIsMobileOpen } = useLayoutContext();

    return (
      <li className="mb-[2px] list-none">
        <button
          ref={buttonRef}
          onClick={(e) => {
            e.stopPropagation();
            if (hasNestedItems) {
              onToggleNested({
                item,
                bounds: buttonRef.current?.getBoundingClientRect(),
              });
            } else if (item.path) {
              addTab(item);
              onClose();
              if (window.innerWidth < 1024) setIsMobileOpen(false); 
            }
          }}
          className={`flex items-start justify-between gap-2 text-sm px-3 py-1.5 rounded-r-md w-full transition-colors duration-150 ${
            isItemActive || isThirdLevelActive
              ? "bg-indigo-50 dark:bg-gray-700 text-[#0c5888] dark:text-indigo-300 font-medium"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <span className="flex-1 text-left whitespace-normal break-words">
            {item.name}
          </span>

          {hasNestedItems && (
            <ChevronRightIcon
              className={`w-3 h-3 mt-[2px] flex-shrink-0 transition-transform ${
                isThirdLevelActive ? "rotate-90" : ""
              }`}
            />
          )}
        </button>
      </li>
    );
  }
);

const FlyoutBox: React.FC<any> = ({
  item,
  parentBounds,
  onClose,
  addTab,
  activeTabPath,
  onSubItemClick,
  activeNestedFlyout,
}) => {
  const coords = useSmartPosition(parentBounds);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed z-[125] ml-4 w-52 p-3 bg-gray-50 dark:bg-gray-900 rounded-r-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
      style={{
        top: coords.top,
        left: coords.left,
        maxHeight: coords.maxHeight,
      }}
    >
      <h4 className="text-base font-bold text-[#0c5888] dark:text-indigo-400 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1.5">
        {item.name}
      </h4>
      <ul className="space-y-0.5 list-none p-0 m-0">
        {item.subItems.map((subItem: any) => (
          <SubFlyoutItem
            key={subItem.path || subItem.name}
            item={subItem}
            addTab={addTab}
            activeTabPath={activeTabPath}
            onClose={onClose}
            onToggleNested={onSubItemClick}
            isThirdLevelActive={subItem.name === activeNestedFlyout?.item.name}
          />
        ))}
      </ul>
    </div>
  );
};

const FlyoutWrapper: React.FC<any> = ({
  activeFlyout,
  onCloseFlyout,
  addTab,
  activeTabPath,
}) => {
  const [activeNestedFlyout, setActiveNestedFlyout] = useState<any>(null);

  useEffect(() => {
    setActiveNestedFlyout(null);
  }, [activeFlyout]);

  useEffect(() => {
    // Added touchstart for mobile compatibility
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.closest("aside") ||
        target.closest(".fixed.z-\\[125\\]") ||
        target.closest(".fixed.z-\\[130\\]")
      ) {
        return;
      }
      onCloseFlyout();
      setActiveNestedFlyout(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    }
  }, [onCloseFlyout]);

  if (!activeFlyout) return null;

  return (
    <>
      <FlyoutBox
        item={activeFlyout.item}
        parentBounds={activeFlyout.bounds}
        onClose={onCloseFlyout}
        addTab={addTab}
        activeTabPath={activeTabPath}
        onSubItemClick={(data: any) => {
          if (activeNestedFlyout?.item.name === data.item.name) {
            setActiveNestedFlyout(null);
          } else {
            setActiveNestedFlyout(data);
          }
        }}
        activeNestedFlyout={activeNestedFlyout}
      />

      {activeNestedFlyout && (
        <NestedFlyoutBox
          item={activeNestedFlyout.item}
          parentBounds={activeNestedFlyout.bounds}
          onClose={() => {
            onCloseFlyout();
            setActiveNestedFlyout(null);
          }}
          addTab={addTab}
          activeTabPath={activeTabPath}
        />
      )}
    </>
  );
};

const SidebarLink: React.FC<any> = React.memo(
  ({ item, onClick, isActive, addTab, onCloseFlyout }) => {
    const linkRef = useRef<HTMLButtonElement>(null);
    const hasSubItems = !!item.subItems && item.subItems.length > 0;
    const { setIsMobileOpen } = useLayoutContext(); 

    return (
      <li className="mb-[2px] list-none relative">
        <button
          ref={linkRef}
          onClick={(e) => {
            e.stopPropagation();
            if (hasSubItems) {
              onClick({
                item,
                bounds: linkRef.current?.getBoundingClientRect(),
                isClick: true,
              });
            } else if (item.path) {
              addTab(item);
              onCloseFlyout();
              if (window.innerWidth < 1024) setIsMobileOpen(false); 
            }
          }}
          className={`${baseLinkClasses} ${
            isActive ? primaryColorClass : inactiveLinkClasses
          } font-medium flex-col justify-center h-[60px] relative transition-all active:scale-95`}
        >
          {item.icon &&
            React.cloneElement(item.icon, {
              className: `w-5 h-5 ${isActive ? "text-white" : "text-current"}`,
            } as any)}
          <span className="text-[11px] mt-1 truncate max-w-full">
            {item.name}
          </span>
          {hasSubItems && (
            <ChevronRightIcon
              className={`absolute right-1 w-2.5 h-2.5 ${
                isActive ? "text-white" : "text-gray-500"
              }`}
            />
          )}
        </button>
      </li>
    );
  }
);

export const AppSidebar: React.FC<{
  addTab: (item: NavItem) => void;
  activeTabPath: string;
}> = ({ addTab, activeTabPath }) => {
  const [activeFlyout, setActiveFlyout] = useState<any>(null);
  const { isMobileOpen, setIsMobileOpen } = useLayoutContext(); 

  const handleLinkClick = useCallback(
    ({ item, bounds }: any) => {
      if (activeFlyout?.item.name === item.name) {
        setActiveFlyout(null);
      } else {
        setActiveFlyout({ item, bounds });
      }
    },
    [activeFlyout]
  );

  return (
    <>
      <aside 
        className={`fixed top-0 left-0 z-[120] h-screen py-3 w-[80px] bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-y-auto shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* MOBILE CLOSE BUTTON */}
        <button 
          onClick={() => setIsMobileOpen(false)} 
          className="lg:hidden absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col h-full px-2 mt-4 lg:mt-0">
          <div className="flex h-[80px] justify-center mb-3 py-1.5 border-b border-gray-200 dark:border-gray-700">
            <LogoWithIntroAnimation />
          </div>
          <nav className="flex-grow space-y-[1px]">
            {allItems.map((item) => (
              <SidebarLink
                key={item.name}
                item={item}
                onClick={handleLinkClick}
                isActive={
                  item.path === activeTabPath ||
                  findActiveItemPath(item.subItems, activeTabPath)
                }
                addTab={addTab}
                onCloseFlyout={() => setActiveFlyout(null)}
              />
            ))}
          </nav>
        </div>
      </aside>
      
      <FlyoutWrapper
        activeFlyout={activeFlyout}
        onCloseFlyout={() => setActiveFlyout(null)}
        addTab={addTab}
        activeTabPath={activeTabPath}
      />
    </>
  );
};