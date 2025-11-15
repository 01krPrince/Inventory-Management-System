import React from 'react';
import { useTabs } from '../context/TabContext';

export const TabBar: React.FC = React.memo(() => {
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
                    {/* Only show close button if not the dashboard tab */}
                    {tab.path !== '/dashboard' && (
                        <button
                            className="ml-2 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent the tab's onClick from firing
                                closeTab(tab.path);
                            }}
                            aria-label={`Close ${tab.name} tab`}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    )}
                </div>
            ))}

            {/* Tailwind scrollbar-hiding utility styles */}
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
        </div>
    );
});