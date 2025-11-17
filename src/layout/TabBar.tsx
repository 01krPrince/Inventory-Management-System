import React, { useCallback } from "react";
import { useTabs } from "../context/TabContext";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"; // 👈 Import DND components

export const TabBar: React.FC = React.memo(() => {
  // Destructure the new reorderTabs function
  const { openTabs, activeTabPath, setActiveTab, closeTab, reorderTabs } =
    useTabs();

  // 1. Handle the drag end event
  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source } = result;

      // Dropped outside a droppable area, or dropped back in the same spot
      if (!destination || destination.index === source.index) {
        return;
      }

      // Call the context function to update the order
      reorderTabs(source.index, destination.index);
    },
    [reorderTabs]
  ); // Dependency on reorderTabs

  return (
    // 2. Wrap the entire component with DragDropContext
    <DragDropContext onDragEnd={onDragEnd}>
      {/* 3. The area where tabs can be dropped (the tab bar itself) */}
      <Droppable droppableId="tab-bar-droppable" direction="horizontal">
        {(droppableProvided) => (
          <div
            // Apply the droppable properties
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
            className="flex items-center space-x-1 border-b border-gray-200 dark:border-gray-800 px-4 pt-2 overflow-x-auto whitespace-nowrap hidden-scrollbar"
          >
            {openTabs.map((tab, index) => (
              // 4. Each tab must be a Draggable component
              <Draggable key={tab.path} draggableId={tab.path} index={index}>
                {(draggableProvided) => (
                  <div
                    // Apply the draggable properties
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps} // Makes the entire tab the drag handle
                    className={`flex items-center px-4 py-2 text-sm rounded-t-lg transition-colors duration-150 cursor-pointer ${
                      tab.path === activeTabPath
                        ? "bg-white text-[#0c5888] font-bold border-b-2 border-[#0c5888]"
                        : "text-gray-600 dark:text-gray-300 hover:text-[#0c5888]"
                    }`}
                    onClick={() => setActiveTab(tab.path)}
                  >
                    {/* ... (rest of the tab content remains the same) */}
                    <span className="truncate max-w-40">{tab.name}</span>
                    {tab.path !== "/welcome" && (
                      <button
                        className="ml-2 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          closeTab(tab.path);
                        }}
                        aria-label={`Close ${tab.name} tab`}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {/* 5. Important: Add the Droppable placeholder */}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>

      {/* ... (The style block and active tab content remains the same) */}
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

      {activeTabPath !== "/welcome" ? (
        <div className="h-10 p-2 flex align-bottom justify-center bg-[#0c5888] text-amber-50">
          {openTabs.find((t) => t.path === activeTabPath)?.name}
        </div>
      ) : (
        ""
      )}
    </DragDropContext>
  );
});
