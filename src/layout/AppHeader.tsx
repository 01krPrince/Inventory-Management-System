import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import { useTabs } from "../context/TabContext"; 
import { useLayoutContext } from "./AppLayout"; // ← IMPORT SHARED CONTEXT
import { PlusCircle, RefreshCw, Star, Settings, Bell, X, Menu } from "lucide-react";

// ==========================================
// 1. COMPONENT: Opening Transaction Menu
// ==========================================
const OpeningTransactionMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<any>;
  addTab: (tab: { path: string; name: string }) => void;
}> = ({ isOpen, onClose, triggerRef, addTab }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right - 320,
      });
    }
  }, [isOpen, triggerRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const openingItems = [
    { name: "Opening Outstanding Bills - Customer", path: "/opening-outstanding-customer" },
    { name: "Opening Outstanding Bills - Vendor", path: "/opening-outstanding-vendor" },
    { name: "Opening Stock", path: "/opening-stock" },
    { name: "Opening Financials", path: "/opening-financials" },
    { name: "Opening Leaves", path: "/opening-leaves" },
    { name: "Opening Stock - Barcode", path: "/opening-stock-barcode" },
    { name: "Opening Stock - Fixed Asset", path: "/opening-stock-fixed-asset" },
    { name: "Opening POS Customer", path: "/opening-pos-customer" },
  ];

  const menuContent = (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        zIndex: 9999,
      }}
      className="w-80 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-100 font-sans"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-[#003f6b] text-white">
        <h3 className="font-semibold text-sm tracking-wide">
          Opening Transaction
        </h3>
        <button onClick={onClose} className="hover:text-gray-200">
          <X size={18} />
        </button>
      </div>

      <div className="py-2 text-sm text-[#003f6b] dark:text-gray-200">
        {openingItems.map((item) => (
          <button
            key={item.path}
            onClick={() => {
              addTab({ path: item.path, name: item.name }); 
              onClose(); 
            }}
            className="w-full text-left px-5 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );

  return createPortal(menuContent, document.body);
};

// ==========================================
// 2. COMPONENT: Action Icons (Refresh, Fav, Config, Notif)
// ==========================================
const HeaderActionButtons: React.FC = () => {
  const iconClass =
    "text-gray-500 dark:text-gray-400 hover:text-[#0c5888] dark:hover:text-white transition-colors cursor-pointer";

  return (
    <div className="flex items-center gap-3 md:gap-4 mr-2">
      <button className={iconClass} title="Refresh">
        <RefreshCw size={20} />
      </button>
      <button className={iconClass} title="Favorites">
        <Star size={20} />
      </button>
      <button className={iconClass} title="Configuration">
        <Settings size={20} />
      </button>
      <div className="relative">
        <button className={iconClass} title="Notifications">
          <Bell size={20} />
        </button>
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
      </div>
    </div>
  );
};

const ThemeToggleButton = () => null; // Placeholder

// ==========================================
// 3. MAIN COMPONENT: AppHeader
// ==========================================
const AppHeader: React.FC = () => {
  const { logout } = useAuth();
  const { addTab } = useTabs(); 
  const { setIsMobileOpen } = useLayoutContext(); // ← GET MENU TRIGGER

  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [userCoords, setUserCoords] = useState({ top: 0, left: 0 });
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userTriggerRef = useRef<HTMLDivElement>(null);

  const [isTransMenuOpen, setTransMenuOpen] = useState(false);
  const transTriggerRef = useRef<HTMLDivElement>(null);

  const toggleUserMenu = () => setUserMenuOpen(!isUserMenuOpen);
  const toggleTransMenu = () => setTransMenuOpen(!isTransMenuOpen);

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
  };

  useLayoutEffect(() => {
    if (isUserMenuOpen && userTriggerRef.current) {
      const rect = userTriggerRef.current.getBoundingClientRect();
      setUserCoords({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right - 192,
      });
    }
  }, [isUserMenuOpen]);

  useEffect(() => {
    const handleClickOutsideUser = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        userTriggerRef.current &&
        !userTriggerRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideUser);
    return () => document.removeEventListener("mousedown", handleClickOutsideUser);
  }, []);

  const UserMenuContent = (
    <div
      ref={userMenuRef}
      style={{
        position: "fixed",
        top: userCoords.top,
        left: userCoords.left,
        zIndex: 9999,
      }}
      className="w-48 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
        <p className="text-sm font-medium dark:text-white">Admin User</p>
        <p className="text-xs text-gray-500 truncate">admin@example.com</p>
      </div>
      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#0c5888]/10 transition-colors">
        Account
      </button>
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
      >
        Logout
      </button>
    </div>
  );

  return (
    <header className="sticky top-0 z-20 w-full bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-all duration-300 ease-in-out">
      <div className="flex flex-col w-full grow lg:flex-row lg:px-6">
        
        {/* === HEADER TOP ROW (Hamburger + Brand + Mobile Icons) === */}
        <div className="flex items-center justify-between w-full gap-2 px-3 sm:gap-4 lg:justify-normal lg:w-auto lg:py-1">
          <div className="flex items-center gap-2">
            {/* MOBILE HAMBURGER MENU */}
            <button 
              className="lg:hidden p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu size={24} />
            </button>

            <a
              href="https://solution.alignbooks.com/#/login"
              target="_blank"
              rel="noreferrer"
            >
              <div className="lg:ml-3 p-2 h-10 flex items-center justify-center">
                <span className="text-xl font-bold text-[#0c5888] dark:text-white">
                  Inventory
                </span>
              </div>
            </a>
          </div>

          {/* === MOBILE ICONS === */}
          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggleButton />
            <div className="relative" ref={userTriggerRef}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 dark:border-gray-700 overflow-hidden"
              >
                <img
                  src="https://ui-avatars.com/api/?name=Admin+User&background=0c5888&color=fff"
                  alt="User Avatar"
                  className="w-9 h-9 rounded-full"
                />
              </button>
            </div>
          </div>
        </div>

        {/* === DESKTOP ICONS (Right Aligned) === */}
        <div className="flex w-full items-center justify-end px-3 py-2 border-t lg:border-t-0 lg:px-0 lg:py-2">
          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggleButton />
            <HeaderActionButtons />

            <div className="relative mr-2" ref={transTriggerRef}>
              <button
                onClick={toggleTransMenu}
                className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                  isTransMenuOpen
                    ? "bg-[#0c5888] text-white"
                    : "bg-gray-100 text-[#0c5888] hover:bg-gray-200 dark:bg-gray-800 dark:text-white"
                }`}
                title="Opening Transactions"
              >
                <PlusCircle size={20} />
              </button>
            </div>

            <div className="relative" ref={userTriggerRef}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center justify-center w-9 h-9 rounded-full border dark:border-gray-700 ring-offset-2 hover:ring-2 ring-[#0c5888]/50 transition-all"
              >
                <img
                  src="https://ui-avatars.com/api/?name=Admin+User&background=0c5888&color=fff"
                  alt="User Avatar"
                  className="w-9 h-9 rounded-full"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isUserMenuOpen && createPortal(UserMenuContent, document.body)}

      <OpeningTransactionMenu
        isOpen={isTransMenuOpen}
        onClose={() => setTransMenuOpen(false)}
        triggerRef={transTriggerRef}
        addTab={addTab}
      />
    </header>
  );
};

export default AppHeader;