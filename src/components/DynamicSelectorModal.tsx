import React, { useState, useMemo } from "react";
import { Plus, Search, Check } from "lucide-react";
import AddNewItem from "./addItemMaster/AddNewItem";

export interface SelectorColumn {
  key: string;
  label: string;
  width?: string;
}

interface DynamicSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  data: any[];
  columns: SelectorColumn[];
  onSelect: (selectedItem: any) => void;
  /** Callback when a new item is created successfully */
  onNewItemCreated?: (newItem: any) => void;
  /** Alias for onNewItemCreated (for backward compatibility) */
  onCreateNew?: (newItem: any) => void;
}

const DynamicSelectorModal: React.FC<DynamicSelectorModalProps> = ({
  isOpen,
  onClose,
  title = "Select Item",
  data,
  columns,
  onSelect,
  onNewItemCreated,
  onCreateNew,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // --- Filter Logic ---
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter((item) => {
      return columns.some((col) => {
        const value = item[col.key];
        return value
          ? String(value).toLowerCase().includes(lowerSearch)
          : false;
      });
    });
  }, [data, searchTerm, columns]);

  // --- Handlers ---
  const handleRowClick = (item: any) => {
    onSelect(item);
    setSearchTerm("");
    onClose();
  };

  const handleClose = () => {
    setSearchTerm("");
    setIsCreating(false);
    onClose();
  };

  const handleSuccessCreate = (newItem: any) => {
    // Call whichever handler is provided
    if (onNewItemCreated) {
      onNewItemCreated(newItem);
    } else if (onCreateNew) {
      onCreateNew(newItem);
    }

    setIsCreating(false); // Switch back to list view
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start pt-10 justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[85vh]">
        {/* --- VIEW 1: CREATE NEW ITEM FORM --- */}
        {isCreating ? (
          <AddNewItem
            onClose={() => setIsCreating(false)}
            onSuccess={handleSuccessCreate}
          />
        ) : (
          /* --- VIEW 2: SELECTOR LIST --- */
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-[#1e4e79] p-3 flex items-center justify-between text-white">
              <h2 className="font-semibold text-lg tracking-wide">{title}</h2>
              {/* Button is now UNCONDITIONAL - always visible */}
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-1 px-3 py-1 text-sm font-medium bg-white/20 hover:bg-white/30 rounded transition-colors"
              >
                <Plus size={16} strokeWidth={2.5} />
                Add New
              </button>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e4e79]/50 focus:border-[#1e4e79] text-sm"
                  autoFocus
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 bg-gray-100 min-h-[300px]">
              <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                <div className="flex bg-gray-50 border-b text-xs font-semibold text-gray-600 px-2 py-1">
                  {columns.map((col) => (
                    <div
                      key={col.key}
                      className={`${col.width || "flex-1"} px-2`}
                    >
                      {col.label}
                    </div>
                  ))}
                </div>

                {filteredData.length > 0 ? (
                  filteredData.map((item, rowIndex) => (
                    <button
                      key={rowIndex || item.id}
                      onClick={() => handleRowClick(item)}
                      className="w-full flex items-center text-left py-2 px-2 border-b last:border-b-0 hover:bg-blue-50 transition-colors group text-sm"
                    >
                      {columns.map((col) => (
                        <div
                          key={col.key}
                          className={`${
                            col.width || "flex-1"
                          } px-2 truncate text-gray-700`}
                        >
                          {item[col.key]}
                        </div>
                      ))}
                      <div className="w-6 opacity-0 group-hover:opacity-100 text-[#1e4e79]">
                        <Check className="w-4 h-4" />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No results found for "{searchTerm}"
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={handleClose}
                className="px-6 py-1.5 bg-[#1e4e79] text-white rounded-sm text-sm hover:bg-[#163a5e] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicSelectorModal;
