import React from 'react';
import { useTabs } from '../context/TabContext';

export const TabBar: React.FC = React.memo(() => {
    const { openTabs, activeTabPath, setActiveTab, closeTab } = useTabs();

    return (
        <div className="flex items-center space-x-1 border-b border-gray-200 dark:border-gray-800 px-4 pt-2 overflow-x-auto whitespace-nowrap hidden-scrollbar">
  {openTabs.map((tab) => (
    <div
      key={tab.path}
      className={`flex items-center px-4 py-2 text-sm rounded-t-lg transition-colors duration-150 cursor-pointer ${
        tab.path === activeTabPath
          ? 'bg-white text-[#0c5888] border-b-2 border-[#0c5888]'
          : 'text-gray-600 dark:text-gray-300 hover:text-[#0c5888]'
      }`}
      onClick={() => setActiveTab(tab.path)}
    >
      <span className="truncate max-w-40">{tab.name}</span>
      {tab.path !== '/dashboard' && (
        <button
          className="ml-2 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          onClick={(e) => {
            e.stopPropagation();
            closeTab(tab.path);
          }}
          aria-label={`Close ${tab.name} tab`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      )}
    </div>
  ))}

  <style>
    {`
      .hidden-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hidden-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}
  </style>
</div>

    );
});

