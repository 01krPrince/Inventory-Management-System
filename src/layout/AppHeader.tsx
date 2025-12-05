import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ThemeToggleButton = () => null;
const NotificationDropdown = () => null;

const AppHeader: React.FC = () => {
  const { logout } = useAuth(); // ✅ AuthContext

  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleUserMenu = () => setUserMenuOpen(!isUserMenuOpen);

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout(); // ✅ global logout
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-all duration-300 ease-in-out">
      <div className="flex flex-col w-full grow lg:flex-row lg:px-6">
        {/* === HEADER TOP ROW === */}
        <div className="flex items-center justify-between w-full gap-2 px-3 sm:gap-4 lg:justify-normal lg:w-auto lg:py-1">
          <a href="https://solution.alignbooks.com/#/login" target="_blank">
            <div className="ml-3 p-2 h-10 flex items-center justify-center">
              <span className="text-xl font-bold text-[#0c5888] dark:text-white">
                Inventory
              </span>
            </div>
          </a>

          {/* === MOBILE ICONS === */}
          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggleButton />
            <NotificationDropdown />

            <div className="relative" ref={userMenuRef}>
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

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
                  <div className="px-4 py-1 border-b">
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-gray-500">admin@example.com</p>
                  </div>

                  <button className="w-full text-left px-4 py-1.5 text-sm hover:bg-[#0c5888]/10">
                    Account
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-1.5 text-sm hover:bg-red-50 hover:text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* === SEARCH + DESKTOP ICONS === */}
        <div className="flex flex-col items-center justify-between w-full gap-3 px-3 py-2 border-t lg:border-t-0 lg:flex-row lg:px-0 lg:py-2">
          <div className="w-full lg:w-fit">
            <input
              ref={inputRef}
              placeholder="Search or type command..."
              className="h-9 w-full rounded-lg border py-1.5 pl-10 pr-12 text-sm"
            />
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggleButton />
            <NotificationDropdown />

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center justify-center w-9 h-9 rounded-full border"
              >
                <img
                  src="https://ui-avatars.com/api/?name=Admin+User&background=0c5888&color=fff"
                  alt="User Avatar"
                  className="w-9 h-9"
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-gray-500">admin@example.com</p>
                  </div>

                  <button className="w-full text-left px-4 py-1.5 text-sm hover:bg-[#0c5888]/10">
                    Account
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-1.5 text-sm hover:bg-red-50 hover:text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
