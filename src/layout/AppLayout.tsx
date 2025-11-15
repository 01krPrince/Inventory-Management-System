import React from "react";
import { TabProvider, useTabs } from '../context/TabContext';
import  AppHeader  from "./AppHeader";

import { TabBar } from './TabBar'; 
import { AppSidebar } from './AppSidebar'; 
import Welcome from "../pages/Dashboard/Welcome";
import Customer from "../pages/Customer";

const useSidebar = () => ({
    isExpanded: false,
    isHovered: false,
    isMobileOpen: false 
});
const Backdrop = () => null; 

const ComponentMap: { [key: string]: React.FC } = {
    '/dashboard': Welcome,
    '/customer': Customer,
    '/price-list': () => <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">🏷️ price list View</div>,
    '/party-sale-discount-rate': () => <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">👥 Party Discount View</div>,
    '/brandwise-discount-charges': () => <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">🏷️ Brandwise Discount/Charges View</div>,
    '/estimate': () => <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">🧾 Estimate Generator</div>,
    '/calendar': () => <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">📅 Calendar View Component</div>,
    '/profile': () => <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">⚙️ User Profile Settings</div>,
    '/form-elements': () => <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">📄 Form Elements View</div>,
    '/basic-tables': () => <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">📊 Basic Tables View</div>,
    '/blank': () => <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">🔲 Blank Page View</div>,
    '/error-404': () => <div className="p-6 mt-6 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-lg">⚠️ 404 Error Page</div>,
    '/fallback': () => <div className="p-6 mt-6 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-lg">❗ Component not found for this tab path.</div>
};


const LayoutContent: React.FC = () => {
    const { isMobileOpen } = useSidebar();
    const { openTabs, activeTabPath, addTab } = useTabs(); 
    
    const fixedSidebarWidthClass = "lg:ml-[110px]"; 
    
    return (
        <>
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
            
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 xl:flex">
                <div>
                    <AppSidebar addTab={addTab} activeTabPath={activeTabPath} /> 
                    <Backdrop />
                </div>
                
                <div
                    className={`flex-1 transition-all duration-300 ease-in-out ${
                        fixedSidebarWidthClass 
                    } ${isMobileOpen ? "ml-0" : ""}`}
                >
                    <AppHeader /> 
                    
                    <TabBar />
                    
                    <div className="p-4 mx-auto max-w-[1536px] md:p-6">
                        {openTabs.map(tab => {
                            const TabComponent = ComponentMap[tab.path] || ComponentMap['/fallback'];
                            return (
                                <div 
                                    key={tab.path} 
                                    className={tab.path === activeTabPath ? 'block' : 'hidden'}
                                >
                                    <TabComponent />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

const AppLayout: React.FC = () => {
    return (
        <TabProvider>
            <LayoutContent />
        </TabProvider>
    );
};

export default AppLayout;