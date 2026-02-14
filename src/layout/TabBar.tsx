import React, { useCallback } from 'react';
import { useTabs } from '../context/TabContext';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export const TabBar: React.FC = React.memo(() => {
  const { openTabs, activeTabPath, setActiveTab, closeTab, reorderTabs } = useTabs();

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source } = result;

      if (!destination || destination.index === source.index) {
        return;
      }

      reorderTabs(source.index, destination.index);
    },
    [reorderTabs]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="tab-bar-droppable" direction="horizontal">
        {(droppableProvided) => (
          <div
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
            className="flex flex-wrap items-center space-x-1 whitespace-normal border-b border-gray-200 px-4 dark:border-gray-800">
            {openTabs.map((tab, index) => (
              <Draggable key={tab.path} draggableId={tab.path} index={index}>
                {(draggableProvided) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                    className={`flex cursor-pointer items-center rounded-t-lg px-4 py-1 text-sm transition-colors duration-150 ${
                      tab.path === activeTabPath
                        ? 'border-b-2 border-[#0c5888] bg-white font-bold text-[#0c5888]'
                        : 'text-gray-600 hover:text-[#0c5888] dark:text-gray-300'
                    }`}
                    onClick={() => setActiveTab(tab.path)}>
                    <span className="w-auto">{tab.name}</span>
                    {tab.path !== '/welcome' && (
                      <button
                        className="ml-2 rounded-full p-0.5 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          closeTab(tab.path);
                        }}
                        aria-label={`Close ${tab.name} tab`}>
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>

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

      {activeTabPath !== '/welcome' ? (
        <div className="py-auto flex h-6 w-auto justify-center bg-[#0c5888] align-bottom text-amber-50">
          {openTabs.find((t) => t.path === activeTabPath)?.name}
        </div>
      ) : (
        ''
      )}
    </DragDropContext>
  );
});
