import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

export interface ColumnDef<T> {
  header: string;
  key: keyof T;
  width?: string;
}

interface TableDropdownProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  value: string | undefined;
  // Updated type to allow null (for deselection)
  onChange: (item: T | null) => void;
  placeholder?: string;
  valueKey: keyof T;
}

const Dropdown = <T extends object>({
  data,
  columns,
  value,
  onChange,
  placeholder = "Select...",
  valueKey,
}: TableDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredData = data.filter((item) => {
    return columns.some((col) => {
      const val = item[col.key];
      return String(val).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const handleSelect = (e: React.MouseEvent, item: T) => {
    e.stopPropagation();
    // Logic: If clicked item is ALREADY selected, deselect it.
    const isSelected = String(item[valueKey]) === String(value);

    if (isSelected) {
      onChange(null); // Pass null to clear
    } else {
      onChange(item);
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* TRIGGER INPUT */}
      <div
        className="w-full h-[32px] bg-white border border-gray-300 rounded-sm px-3 flex items-center justify-between cursor-pointer hover:border-gray-400 focus-within:ring-1 focus-within:ring-[#60a5fa] focus-within:border-[#60a5fa] transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`text-[13px] truncate ${
            !value ? "text-gray-500" : "text-gray-700 font-medium"
          }`}
        >
          {value || placeholder}
        </span>

        <div className="flex items-center gap-1">
          {/* Show 'X' to clear if value exists */}
          {value && (
            <div
              onClick={handleClear}
              className="p-0.5 hover:bg-gray-200 rounded-full text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={12} />
            </div>
          )}
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>

      {/* DROPDOWN BODY */}
      {isOpen && (
        <div className="absolute top-full left-0 w-[450px] min-w-full bg-white border border-gray-200 shadow-2xl rounded-md z-50 mt-1 flex flex-col max-h-[350px] animate-in fade-in zoom-in-95 duration-100">
          {/* Search Bar */}
          <div className="p-2 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-20 rounded-t-md">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Table Header */}
          <div className="flex bg-gray-100 border-b border-gray-200 text-xs font-bold text-gray-600 px-3 py-2 sticky top-[50px] z-10">
            {columns.map((col, idx) => (
              <div
                key={idx}
                className={`${col.width || "flex-1"} px-2 text-left`}
              >
                {col.header}
              </div>
            ))}
          </div>

          {/* Table List */}
          <div className="overflow-y-auto flex-1 p-1">
            {filteredData.length > 0 ? (
              filteredData.map((item, idx) => {
                const isSelected = String(item[valueKey]) === String(value);

                return (
                  <div
                    key={idx}
                    className={`flex items-center text-[13px] px-3 py-2.5 border-b border-gray-50 cursor-pointer transition-colors rounded-sm
                      ${
                        isSelected
                          ? "bg-blue-50 text-blue-700 font-medium border-blue-100"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                    onClick={(e) => handleSelect(e, item)}
                  >
                    {columns.map((col, cIdx) => (
                      <div
                        key={cIdx}
                        className={`${col.width || "flex-1"} px-2 truncate`}
                      >
                        {String(item[col.key] || "-")}
                      </div>
                    ))}
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-xs text-gray-500 flex flex-col items-center gap-2">
                <Search size={20} className="opacity-30" />
                <span>No results found for "{searchTerm}"</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
