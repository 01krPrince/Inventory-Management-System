import React, { useCallback, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { allItems } from './navigation';
import { ChevronRightIcon } from '../components/icons';
import LogoWithIntroAnimation from './LogoWithIntroAnimation';

interface NavItem {
  name: string;
  path?: string;
  icon?: React.ReactElement;
  subItems?: NavItem[];
  nestedItems?: NavItem[];
}

const useSmartPosition = (
  parentBounds: DOMRect | null,
  menuWidth: number = 208 // matching w-52 (52 * 4px = 208px)
) => {
  const [coords, setCoords] = useState({ top: 0, left: 0, maxHeight: '100vh' });

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
    if (item.subItems && findActiveItemPath(item.subItems, activePath)) return true;
    if (item.nestedItems?.some((i: { path: string }) => i.path === activePath)) return true;
  }
  return false;
};

const baseLinkClasses =
  'flex items-center text-sm px-3 py-1.5 rounded-md transition-colors duration-200 w-full';
const primaryColorClass = 'bg-[#0c5888] text-white shadow-md';
const inactiveLinkClasses =
  'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700';

const NestedLink = React.memo(({ item, addTab, activeTabPath, onClose }: any) => {
  const isItemActive = item.path === activeTabPath;
  return (
    <li className="mb-[2px] list-none">
      <button
        onClick={(e) => {
          e.stopPropagation();
          addTab(item);
          onClose();
        }}
        className={`flex w-full items-start justify-start gap-2 rounded-r-md px-3 py-1.5 text-sm transition-colors duration-150 ${
          isItemActive
            ? 'bg-indigo-50 font-medium text-[#0c5888] dark:bg-gray-700 dark:text-indigo-300'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}>
        <span className="flex-1 whitespace-normal break-words text-left">{item.name}</span>
      </button>
    </li>
  );
});

const NestedFlyoutBox: React.FC<any> = ({ item, parentBounds, onClose, addTab, activeTabPath }) => {
  const coords = useSmartPosition(parentBounds);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="animate-in fade-in zoom-in-95 fixed z-[110] ml-4 w-52 overflow-y-auto rounded-r-xl border border-gray-200 bg-gray-50 p-3 shadow-2xl duration-150 dark:border-gray-700 dark:bg-gray-900"
      style={{
        top: coords.top,
        left: coords.left,
        maxHeight: coords.maxHeight,
      }}>
      <h4 className="mb-2 border-b border-gray-200 pb-1.5 text-base font-bold text-[#0c5888] dark:border-gray-700 dark:text-indigo-400">
        {item.name}
      </h4>
      <ul className="m-0 list-none space-y-0.5 p-0">
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
  ({ item, addTab, activeTabPath, onClose, onToggleNested, isThirdLevelActive }: any) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const hasNestedItems = !!item.nestedItems && item.nestedItems.length > 0;
    const isItemActive =
      item.path === activeTabPath ||
      (hasNestedItems && item.nestedItems!.some((i: any) => i.path === activeTabPath));

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
            }
          }}
          className={`flex w-full items-start justify-between gap-2 rounded-r-md px-3 py-1.5 text-sm transition-colors duration-150 ${
            isItemActive || isThirdLevelActive
              ? 'bg-indigo-50 font-medium text-[#0c5888] dark:bg-gray-700 dark:text-indigo-300'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}>
          <span className="flex-1 whitespace-normal break-words text-left">{item.name}</span>

          {hasNestedItems && (
            <ChevronRightIcon
              className={`mt-[2px] h-3 w-3 flex-shrink-0 transition-transform ${
                isThirdLevelActive ? 'rotate-90' : ''
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
      className="animate-in fade-in zoom-in-95 fixed z-[100] ml-4 w-52 overflow-y-auto rounded-r-xl border border-gray-200 bg-gray-50 p-3 shadow-2xl duration-150 dark:border-gray-700 dark:bg-gray-900"
      style={{
        top: coords.top,
        left: coords.left,
        maxHeight: coords.maxHeight,
      }}>
      <h4 className="mb-2 border-b border-gray-200 pb-1.5 text-base font-bold text-[#0c5888] dark:border-gray-700 dark:text-indigo-400">
        {item.name}
      </h4>
      <ul className="m-0 list-none space-y-0.5 p-0">
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

const FlyoutWrapper: React.FC<any> = ({ activeFlyout, onCloseFlyout, addTab, activeTabPath }) => {
  const [activeNestedFlyout, setActiveNestedFlyout] = useState<any>(null);

  useEffect(() => {
    setActiveNestedFlyout(null);
  }, [activeFlyout]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.closest('aside') ||
        target.closest('.fixed.z-\\[100\\]') ||
        target.closest('.fixed.z-\\[110\\]')
      ) {
        return;
      }
      onCloseFlyout();
      setActiveNestedFlyout(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

    return (
      <li className="mb-[2px] list-none">
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
            }
          }}
          className={`${baseLinkClasses} ${
            isActive ? primaryColorClass : inactiveLinkClasses
          } relative h-[60px] flex-col justify-center font-medium transition-all active:scale-95`}>
          {item.icon &&
            React.cloneElement(item.icon, {
              className: `w-5 h-5 ${isActive ? 'text-white' : 'text-current'}`,
            } as any)}
          <span className="mt-1 max-w-full truncate text-[11px]">{item.name}</span>
          {hasSubItems && (
            <ChevronRightIcon
              className={`absolute right-1 h-2.5 w-2.5 ${
                isActive ? 'text-white' : 'text-gray-500'
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
      <aside className="fixed left-0 top-0 z-[120] h-screen w-[80px] overflow-y-auto border-r border-gray-200 bg-white py-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div className="flex h-full flex-col px-2">
          <div className="mb-3 flex h-[80px] justify-center border-b border-gray-200 py-1.5 dark:border-gray-700">
            <LogoWithIntroAnimation />
          </div>
          <nav className="flex-grow space-y-[1px]">
            {allItems.map((item) => (
              <SidebarLink
                key={item.name}
                item={item}
                onClick={handleLinkClick}
                isActive={
                  item.path === activeTabPath || findActiveItemPath(item.subItems, activeTabPath)
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
