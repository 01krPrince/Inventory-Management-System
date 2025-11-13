import { SidebarProvider, useSidebar } from "../context/SidebarContext";
// Import the TabContext components from their new file
import { TabProvider, useTabs } from "../context/TabContext"; 

import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import React from 'react';

// --- COMPONENT MAP (MOCK COMPONENTS) ---
const Dashboard = () => <div className="text-3xl font-bold p-10 mt-6 text-center bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 rounded-xl shadow-2xl">
    <h1 className="mb-2">Dashboard View</h1>
    <p className="text-base font-normal text-gray-500 dark:text-gray-400">Content for the default home screen.</p>
</div>;

const ComponentMap: { [key: string]: React.FC<any> } = {
    '/dashboard': Dashboard,
    '/customer': () => <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">Customer Management View</div>,
    '/price-list': () => <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">Price List Configuration</div>,
    '/party-sale-discount-rate': () => <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">Party Discount View</div>,
    '/brandwise-discount-charges': () => <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">Brandwise Discount/Charges View</div>,
    '/estimate': () => <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">Estimate Generator</div>,
    '/calendar': () => <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">Calendar View Component</div>,
    '/profile': () => <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">User Profile Settings</div>,
    '/form-elements': () => <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">Form Elements View</div>,
    '/basic-tables': () => <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">Basic Tables View</div>,
    '/blank': () => <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">Blank Page View</div>,
    '/error-404': () => <div className="p-6 mt-6 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-lg">404 Error Page</div>,
    // ... add all other paths from navItems and othersItems here
    '/fallback': () => <div className="p-6 mt-6 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-lg">Component not found for this tab path.</div>
};
// --- END COMPONENT MAP ---


// --- TAB BAR COMPONENT ---
const TabBar: React.FC = () => {
    const { openTabs, activeTabPath, setActiveTab, closeTab } = useTabs();

    const activeTabClasses = "border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-medium bg-gray-50 dark:bg-gray-700/50";
    const inactiveTabClasses = "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/70";

    return (
        <div className="flex items-center space-x-1 border-b border-gray-200 dark:border-gray-800 px-4 pt-2 overflow-x-auto whitespace-nowrap hidden-scrollbar">
            {openTabs.map((tab) => (
                <div
                    key={tab.path}
                    className={`flex items-center px-4 py-2 text-sm rounded-t-lg transition-colors duration-150 cursor-pointer ${
                        tab.path === activeTabPath ? activeTabClasses : inactiveTabClasses
                    }`}
                    onClick={() => setActiveTab(tab.path)}
                >
                    <span className="truncate max-w-40">{tab.name}</span>
                    {tab.path !== '/dashboard' && ( // Prevent closing the default tab
                        <button
                            className="ml-2 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent tab activation when closing
                                closeTab(tab.path);
                            }}
                            aria-label={`Close ${tab.name} tab`}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};
// --- END TAB BAR COMPONENT ---


const LayoutContent: React.FC = () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();
    const { activeTabPath } = useTabs(); // Get the currently active tab path
    
    // Select the component to render based on the active path
    const ActiveComponent = ComponentMap[activeTabPath] || ComponentMap['/fallback'];


    return (
        <>
            {/* Hiding scrollbar CSS moved here for global effect on main scrolling elements */}
            <style>
                {`
                .hidden-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hidden-scrollbar {
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none; /* Firefox */
                }
                `}
            </style>
            
            <div className="min-h-screen xl:flex">
                <div>
                    {/* AppSidebar is correctly rendered inside the TabProvider via LayoutContent */}
                    <AppSidebar />
                    <Backdrop />
                </div>
                <div
                    className={`flex-1 transition-all duration-300 ease-in-out ${
                        isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
                    } ${isMobileOpen ? "ml-0" : ""}`}
                >
                    <AppHeader />
                    
                    {/* TAB BAR SECTION - Uses useTabs */}
                    <TabBar />
                    
                    <div className="p-4 mx-auto max-w-[1536px] md:p-6">
                        {/* RENDER ACTIVE COMPONENT */}
                        <ActiveComponent /> 
                    </div>
                </div>
            </div>
        </>
    );
};

const AppLayout: React.FC = () => {
    return (
        <SidebarProvider>
            {/* FIX: TabProvider wraps LayoutContent which contains AppSidebar, ensuring context is available. */}
            <TabProvider>
                <LayoutContent />
            </TabProvider>
        </SidebarProvider>
    );
};

export default AppLayout;