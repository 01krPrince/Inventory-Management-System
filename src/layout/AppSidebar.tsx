import React, { useCallback, useEffect, useState } from "react";
// Changed import from "react-router-dom" Link to just Link, but must behave like a button
import { useLocation } from "react-router-dom"; 
// Assuming TabContext is in a relative path for demonstration
import { useTabs, TabItem } from "../context/TabContext"; 

// Assume these icons are defined in a separate file (e.g., '../icons')
// Using inline SVG as a fallback structure for demonstration
type IconProps = React.SVGAttributes<SVGSVGElement>;

const GridIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const CalenderIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const UserCircleIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const ListIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const TableIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 7h20M2 17h20M5 2c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v20c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2z"/></svg>;
const PageIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>;
const PieChartIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10l-9-9 9 9 9-9 9 9z"/></svg>;
const BoxCubeIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>;
const PlugInIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-2.5-2.25-2.5-5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5c0 2.75-2.5 5-2.5 5z"/><line x1="12" y1="12" x2="12" y2="14.5"/><path d="M12 9V2M15 6l-3-4-3 4"/></svg>;
const ChevronDownIcon: React.FC<IconProps> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;

// --- Mock Context for Demo ---
const useSidebar = () => ({
  isSidebarOpen: true, // Always open for demo
  closeSidebar: () => console.log("Sidebar closed"),
});

// --- Type Definitions (Reused) ---
type NestedItem = { name: string; path: string; pro?: boolean; new?: boolean; };
type SubItem = { name: string; path: string; pro?: boolean; new?: boolean; nestedItems?: NestedItem[]; };
type NavItem = { name: string; icon: React.ReactNode; path?: string; subItems?: SubItem[]; };

// --- Navigation Data (as provided by user) ---

const navItems: NavItem[] = [
  {
    icon: <GridIcon className="w-5 h-5" />,
    name: "Sale",
    subItems: [
      { name: "Customer", path: "/customer", pro: false },
      {
        name: "Sale Price List",
        path: "/sale-price-list-parent",
        pro: false,
        nestedItems: [
          { name: "Price List", path: "/price-list" },
          { name: "Party-Sale Discount Rate", path: "/party-sale-discount-rate" },
          { name: "Brandwise Discount/Charges", path: "/brandwise-discount-charges" },
        ],
      },
      { name: "Estimate", path: "/estimate", pro: false },
      { name: "Sales Order", path: "/sales-order", pro: false },
      { name: "Dispatch", path: "/dispatch", pro: false },
      { name: "Sales Return Challan", path: "/sales-return-challan", pro: false },
      { name: "Sale Invoice", path: "/sale-invoice", pro: false },
      { name: "Sales Credit Note", path: "/sales-credit-note", pro: false },
      { name: "Sales Debit Note", path: "/sales-debit-note", pro: false },
      { name: "Sales Return", path: "/sales-return", pro: false },
      { name: "Payment Receipt", path: "/payment-receipt", pro: false },
      { name: "Cheque Return", path: "/cheque-return", pro: false },
      { name: "Update Logistic", path: "/update-logistic", pro: false },
      { name: "Bulk Dispatch/Invoice", path: "/bulk-dispatch-invoice", pro: false },
      { name: "E-Commerce (1)", path: "/e-commerce-1", pro: false },
      { name: "E-Commerce (2)", path: "/e-commerce-2", pro: false }
    ],
  },
  {
    icon: <CalenderIcon className="w-5 h-5" />,
    name: "Calendar",
    path: "/calendar",
  },
  {
    icon: <UserCircleIcon className="w-5 h-5" />,
    name: "User Profile",
    path: "/profile",
  },
  {
    name: "Forms",
    icon: <ListIcon className="w-5 h-5" />,
    subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  },
  {
    name: "Tables",
    icon: <TableIcon className="w-5 h-5" />,
    subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  },
  {
    name: "Pages",
    icon: <PageIcon className="w-5 h-5" />,
    subItems: [
      { name: "Blank Page", path: "/blank", pro: false },
      { name: "404 Error", path: "/error-404", pro: false },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon className="w-5 h-5" />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon className="w-5 h-5" />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon className="w-5 h-5" />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

// --- Utility Functions/Constants ---

/** Checks if the current path matches the item's path or is a descendant. */
const isActive = (itemPath: string | undefined, currentPath: string): boolean => {
  if (!itemPath) return false;
  // Exact match
  if (itemPath === currentPath) return true;
  // Check if it's a parent of the current path (e.g., /settings is active for /settings/profile)
  if (itemPath.length > 1 && currentPath.startsWith(itemPath)) return true;
  return false;
};

/** Finds the top-level parent name of the currently active link. */
const findActiveParentName = (items: NavItem[], currentPath: string): string => {
  for (const item of items) {
    // Check top level
    if (isActive(item.path, currentPath)) return item.name;

    if (item.subItems) {
      for (const subItem of item.subItems) {
        // Check Level 2
        if (isActive(subItem.path, currentPath)) return item.name;

        // Check Level 3
        if (subItem.nestedItems) {
          if (subItem.nestedItems.some(i => isActive(i.path, currentPath))) {
            return item.name;
          }
        }
      }
    }
  }
  return "";
};

// Tailwind CSS Utility Classes for consistent styling
const baseLinkClasses = "flex items-center text-sm px-4 py-2 rounded-lg transition-colors duration-200 w-full";
const activeLinkClasses = "bg-indigo-600 text-white shadow-md";
const inactiveLinkClasses = "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700";
const parentLinkClasses = "font-medium";

// --- Level 3 Nested Item Component ---
const NestedSidebarLink: React.FC<{ item: NestedItem; currentPath: string }> = ({ item, currentPath }) => {
  const { addTab, activeTabPath } = useTabs(); // Use TabContext
  const isItemActive = item.path === activeTabPath; // Check against activeTabPath now

  return (
    <li className="mb-1 ml-4">
      <button // CHANGED FROM <Link> TO <button>
        onClick={() => addTab(item)} // ADDED TAB LOGIC
        className={`${baseLinkClasses} ${isItemActive ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' : inactiveLinkClasses} py-1.5`}
      >
        <span className={`w-1.5 h-1.5 rounded-full mr-3 ${isItemActive ? 'bg-indigo-600' : 'bg-gray-400 dark:bg-gray-500'}`} />
        {item.name}
        {(item.pro || item.new) && (
          <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${item.pro ? 'bg-yellow-400 text-black' : 'bg-green-500 text-white'}`}>
            {item.pro ? 'Pro' : 'New'}
          </span>
        )}
      </button> {/* This is the corrected closing tag */}
    </li>
  );
};

// --- Level 2 Sub Item Component ---
const SubSidebarItem: React.FC<{ item: SubItem; currentPath: string }> = ({ item, currentPath }) => {
  const { addTab, activeTabPath } = useTabs(); // Use TabContext
  const [isOpen, setIsOpen] = useState(false);
  const hasNestedItems = !!item.nestedItems && item.nestedItems.length > 0;
  
  // Determine if this item or any of its nested children are active
  const isItemOrChildActive = item.path === activeTabPath || (hasNestedItems && item.nestedItems?.some(i => i.path === activeTabPath));

  // Auto-open if a nested item is active on initial load/path change
  useEffect(() => {
    if (hasNestedItems && item.nestedItems?.some(i => i.path === activeTabPath)) {
      setIsOpen(true);
    }
  }, [activeTabPath, hasNestedItems, item.nestedItems]);

  const toggleOpen = (e: React.MouseEvent) => {
    if (hasNestedItems) {
      e.preventDefault(); 
      setIsOpen(prev => !prev);
    } else if (item.path) {
        // If it's a direct link, open the tab
        addTab(item);
    }
  };

  const linkStyles = isItemOrChildActive 
    ? 'bg-indigo-50 text-indigo-600 dark:bg-gray-700 dark:text-indigo-400 font-medium' 
    : inactiveLinkClasses;

  return (
    <li className="mb-1 ml-2">
      <button // CHANGED FROM <Link> TO <button>
        onClick={toggleOpen}
        // role="link" to maintain some semantic meaning
        className={`${baseLinkClasses} ${linkStyles} ${hasNestedItems ? 'justify-between' : ''}`}
      >
        <span className="ml-1"></span> {/* Indentation visual spacer */}
        {item.name}
        {hasNestedItems && (
          <ChevronDownIcon className={`w-4 h-4 ml-auto transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        )}
      </button> {/* Removed the trailing comment here */}

      {/* Level 3 Nesting (Fixed Transition: Max-Height) */}
      {hasNestedItems && (
        <ul
          // Using max-h-96 (384px) for the Level 3 list, which is more than enough space for the 3 items
          className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pt-1' : 'max-h-0'}`}
        >
          {item.nestedItems?.map((nestedItem) => (
            <NestedSidebarLink key={nestedItem.path} item={nestedItem} currentPath={currentPath} />
          ))}
        </ul>
      )}
    </li>
  );
};

// --- Level 1 Nav Item Component (The Main Menu Item) ---
const MainSidebarItem: React.FC<{ 
  item: NavItem; 
  currentPath: string; 
  onToggle: (name: string) => void; 
  isOpen: boolean 
}> = ({ item, currentPath, onToggle, isOpen }) => {
    
  const { addTab, activeTabPath } = useTabs(); // Use TabContext
    
  const isItemActive = item.path === activeTabPath; // Check against activeTabPath now
  const hasSubItems = !!item.subItems && item.subItems.length > 0;

  // Determine if the main item is active OR if any of its descendants are active
  const isParentActive = isItemActive || (hasSubItems && item.subItems && item.subItems.some(subItem => 
    subItem.path === activeTabPath || (subItem.nestedItems && subItem.nestedItems.some(i => i.path === activeTabPath))
  ));

  const handleClick = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault();
      onToggle(item.name);
    } else if (item.path) {
        // If it's a direct link, open the tab
        addTab(item as TabItem);
    }
  };
    
  const linkStyles = isItemActive // Only use active style if it's the direct active tab
    ? activeLinkClasses 
    : (isParentActive && hasSubItems // Use a distinct style for an open/active parent container
      ? 'bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-medium'
      : inactiveLinkClasses);

  const linkContent = (
    <>
      <div className="flex items-center">
        {item.icon}
        <span className="ml-3">{item.name}</span>
      </div>
      {hasSubItems && (
        <ChevronDownIcon className={`w-4 h-4 ml-auto transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      )}
    </>
  );

  return (
    <li className="mb-2">
      <button // CHANGED FROM <Link> TO <button>
        onClick={handleClick}
        className={`${baseLinkClasses} justify-between ${linkStyles} ${parentLinkClasses}`}
      >
        {linkContent}
      </button> {/* Removed the trailing comment on this line */}

      {/* Level 2 Nesting (Fixed Transition: Max-Height) */}
      {hasSubItems && (
        <ul
          // Using a very large max-height (1000px) ensures that the list will transition smoothly
          // regardless of how many items are rendered, fixing the collapse issue.
          className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] mt-1' : 'max-h-0'}`}
        >
          {item.subItems?.map((subItem) => (
            <SubSidebarItem key={subItem.path || subItem.name} item={subItem} currentPath={currentPath} />
          ))}
        </ul>
      )}
    </li>
  );
};

// --- Main Sidebar Component ---
const AppSidebar: React.FC = () => {
  // useLocation is now primarily used for initial setup/context, not for link logic
  const location = useLocation();
  const currentPath = location.pathname; // This remains for initial highlight/open logic
  
  // Assuming useSidebar provides the global open/close state
  const { isSidebarOpen } = useSidebar(); 

  // State to manage which main menu item is open
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Auto-open the parent section based on the current active path (if the route matters)
  // NOTE: Since you are moving to a tab system, the active state is managed by useTabs,
  // but this useEffect can still be useful if you need to open the parent menu on first load
  useEffect(() => {
    const allItems = [...navItems, ...othersItems];
    const activeParentName = findActiveParentName(allItems, currentPath);
    
    // Set active parent, but don't force it open if another section is already manually open
    if (activeParentName) {
        setOpenSection(activeParentName);
    }
  }, [currentPath]);

  // Handler to toggle open/close state for a main menu item
  const handleToggle = useCallback((name: string) => {
    setOpenSection(prev => (prev === name ? null : name));
  }, []);

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-4 transition-transform duration-300 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-y-auto shadow-xl hidden-scrollbar 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
    >
        {/* Style tag for hidden-scrollbar moved to AppLayout for better structure */}
      <div className="flex-shrink-0 flex items-center justify-center p-4 h-16">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">Gemini Menu</span>
      </div>

      <div className="flex flex-col h-[calc(100vh-4rem)] px-3 py-4 space-y-4">
        
        {/* Main Navigation Section */}
        <nav className="space-y-2">
          <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 px-4 mb-3">Main Menu</h3>
          {navItems.map((item) => (
            <MainSidebarItem
              key={item.name}
              item={item}
              currentPath={currentPath}
              onToggle={handleToggle}
              isOpen={openSection === item.name}
            />
          ))}
        </nav>

        {/* Separator */}
        <div className="h-px bg-gray-200 dark:bg-gray-700 mx-4" />
        
        {/* Others Section */}
        <nav className="space-y-2">
          <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 px-4 mt-2 mb-3">Others</h3>
          {othersItems.map((item) => (
            <MainSidebarItem
              key={item.name}
              item={item}
              currentPath={currentPath}
              onToggle={handleToggle}
              isOpen={openSection === item.name}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;