import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useLayoutEffect,
} from "react";
import { ChevronDown, Search, X } from "lucide-react";

export interface ColumnDef<T> {
  header: string;
  key: keyof T;
  width?: string;
}

interface TableDropdownProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  value: string | number | undefined;
  onChange: (item: T | null) => void;
  placeholder?: string;
  valueKey: keyof T;
  className?: string;
}

const Dropdown = <T extends object>({
  data,
  columns,
  value,
  onChange,
  placeholder = "Select...",
  valueKey,
  className = "w-full",
}: TableDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuPosition, setMenuPosition] = useState<"bottom" | "top">("bottom");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
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

  // Calculate position (Up or Down) whenever it opens
  useLayoutEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;

      // We assume the dropdown max-height is around 300px + some buffer
      const REQUIRED_SPACE = 320;

      if (spaceBelow < REQUIRED_SPACE) {
        setMenuPosition("top");
      } else {
        setMenuPosition("bottom");
      }
    }
  }, [isOpen]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((item) => {
      return columns.some((col) => {
        const val = item[col.key];
        return String(val).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, columns, searchTerm]);

  const selectedItemObj = useMemo(() => {
    return data.find((item) => String(item[valueKey]) === String(value));
  }, [data, value, valueKey]);

  const displayLabel = selectedItemObj
    ? String(selectedItemObj[columns[1]?.key || columns[0]?.key])
    : value || placeholder;

  const handleSelect = (e: React.MouseEvent, item: T) => {
    e.stopPropagation();
    const isSelected = String(item[valueKey]) === String(value);

    if (isSelected) {
      onChange(null);
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
    setSearchTerm("");
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* TRIGGER INPUT */}
      <div
        className="w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 flex items-center justify-between cursor-pointer hover:border-gray-400 focus-within:ring-1 focus-within:ring-[#60a5fa] focus-within:border-[#60a5fa] transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`text-[13px] truncate ${
            !value ? "text-gray-500" : "text-gray-700 font-medium"
          }`}
        >
          {displayLabel}
        </span>

        <div className="flex items-center gap-1">
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
        <div
          className={`
            absolute left-0 bg-white border border-gray-200 shadow-xl rounded-sm z-50 flex flex-col max-h-[300px] overflow-hidden animate-in fade-in zoom-in-95 duration-100
            ${
              menuPosition === "top"
                ? "bottom-full mb-1 origin-bottom"
                : "top-full mt-1 origin-top"
            }
          `}
          // Ensure min-width but respect parent width logic
          style={{ width: "100%", minWidth: "300px" }}
        >
          {/* Search Bar */}
          <div className="p-2 border-b border-gray-100 bg-gray-50/50 shrink-0 z-20">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Table Header */}
          <div className="flex bg-gray-100 border-b border-gray-200 text-[11px] font-bold text-gray-600 px-3 py-1.5 shrink-0 z-10">
            {columns.map((col) => (
              <div
                key={col.key as string}
                className={`${col.width || "flex-1"} px-2 text-left`}
              >
                {col.header}
              </div>
            ))}
          </div>

          {/* Scrollable List */}
          <div className="overflow-y-auto flex-1 p-1 min-h-0">
            {filteredData.length > 0 ? (
              filteredData.map((item) => {
                const isSelected = String(item[valueKey]) === String(value);

                return (
                  <div
                    key={String(item[valueKey])}
                    className={`flex items-center text-[12px] px-3 py-2 border-b border-gray-50 cursor-pointer transition-colors rounded-sm
                      ${
                        isSelected
                          ? "bg-blue-50 text-blue-700 font-medium border-blue-100"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                    onClick={(e) => handleSelect(e, item)}
                  >
                    {columns.map((col) => (
                      <div
                        key={col.key as string}
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
                <span>No results found</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
