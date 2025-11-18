import React, { useState, useRef, useEffect } from "react";

const ThemeToggleButton = () => null;
const NotificationDropdown = () => null;

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleApplicationMenu = () =>
    setApplicationMenuOpen(!isApplicationMenuOpen);
  const toggleUserMenu = () => setUserMenuOpen(!isUserMenuOpen);

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
    <header className="sticky top-0 z-50 flex w-full bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-all duration-300 ease-in-out">
      <div className="flex flex-col items-center justify-between w-full grow lg:flex-row lg:px-6">
        {/* Left Section */}
        <div className="flex items-center justify-between w-full gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-2 transition-all duration-300 ease-in-out">
          <a href="https://solution.alignbooks.com/#/login" target="_blank">
            <div className="ml-3 p-2 h-10 flex items-center justify-center transition-all duration-300 ease-in-out">
              <span className="text-xl font-bold text-[#0c5888] dark:text-white transition-all duration-300 ease-in-out">
                Inventory
              </span>
            </div>
          </a>

          {/* Mobile menu button */}
          <button
            onClick={toggleApplicationMenu}
            className="lg:hidden flex items-center justify-center w-9 h-9 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-all duration-300 ease-in-out"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 10.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S4.5 12.83 4.5 12 5.17 10.5 6 10.5zm12 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S16.5 12.83 16.5 12s.67-1.5 1.5-1.5zm-6 0c.83 0 1.5.67 1.5 1.5S12.83 13.5 12 13.5 10.5 12.83 10.5 12s.67-1.5 1.5-1.5z"
              />
            </svg>
          </button>

          {/* Desktop Search */}
          <div className="hidden lg:block">
            <form>
              <div className="relative">
                <span className="absolute -translate-y-1/2 left-4 top-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04 9.37a6.33 6.33 0 1 1 12.67 0 6.33 6.33 0 0 1-12.67 0zM9.37 1.54A7.83 7.83 0 1 0 14.36 15.4l2.82 2.82a.75.75 0 1 0 1.06-1.06l-2.82-2.82a7.83 7.83 0 0 0-6.05-12.8z"
                    />
                  </svg>
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search or type command..."
                  className="h-9 w-full rounded-lg border border-gray-200 bg-transparent py-1.5 pl-10 pr-12 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-[#0c5888] focus:ring-2 focus:ring-[#0c5888]/20 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-[#0c5888] transition-all duration-300 ease-in-out"
                />
                <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[5px] py-[3px] text-[10px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.05] dark:text-gray-400">
                  <span>⌘</span>
                  <span>K</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Section */}
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } w-full items-center justify-between gap-3 px-4 py-2 lg:flex lg:justify-end lg:px-0 transition-all duration-300 ease-in-out`}
        >
          <div className="flex items-center gap-3">
            <ThemeToggleButton />
            <NotificationDropdown />

            {/* Avatar Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 dark:border-gray-700 overflow-hidden focus:ring-2 focus:ring-[#0c5888]/40 transition-all duration-300 ease-in-out"
              >
                <img
                  src="https://ui-avatars.com/api/?name=Admin+User&background=0c5888&color=fff"
                  alt="User Avatar"
                  className="w-9 h-9"
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ease-in-out">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      Admin User
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      admin@example.com
                    </p>
                  </div>
                  <button
                    key="account"
                    className="w-full text-left px-4 py-1.5 text-sm text-gray-700 hover:bg-[#0c5888]/10 hover:text-[#0c5888] dark:text-gray-300 dark:hover:text-[#0c5888] transition-colors"
                  >
                    Account
                  </button>
                  <button
                    key="logout"
                    className="w-full text-left px-4 py-1.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors"
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
