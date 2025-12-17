import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
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
  disabled?: boolean;
  zIndex?: number; // Manual Z-Index control
}

const Dropdown = <T extends object>({
  data,
  columns,
  value,
  onChange,
  placeholder = "Select...",
  valueKey,
  className = "w-full",
  disabled = false,
  zIndex, // Receive index from parent
}: TableDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Position and Visibility State
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [menuPosition, setMenuPosition] = useState<"bottom" | "top">("bottom");

  // This flag prevents the "Blink". We only set it to true after calculating position.
  const [isVisible, setIsVisible] = useState(false);

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Measure and Position (Runs synchronously before paint)
  useLayoutEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const REQUIRED_SPACE = 300;

      const isTop = spaceBelow < REQUIRED_SPACE;
      setMenuPosition(isTop ? "top" : "bottom");

      setCoords({
        left: rect.left,
        top: isTop ? rect.top - 5 : rect.bottom + 5,
        width: rect.width,
      });

      // Now that we have coordinates, make it visible
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // 2. Global Click & Scroll Listeners
  useEffect(() => {
    const handleGlobalEvents = (event: Event) => {
      if (event.type === "mousedown") {
        const mouseEvent = event as MouseEvent;
        // If clicking inside the dropdown (portal) or trigger, ignore
        if (
          dropdownRef.current?.contains(mouseEvent.target as Node) ||
          triggerRef.current?.contains(mouseEvent.target as Node)
        ) {
          return;
        }
        setIsOpen(false);
      } else if (event.type === "scroll") {
        // Close on scroll to prevent detached menu
        if (isOpen) setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleGlobalEvents);
      window.addEventListener("scroll", handleGlobalEvents, { capture: true });
    }

    return () => {
      document.removeEventListener("mousedown", handleGlobalEvents);
      window.removeEventListener("scroll", handleGlobalEvents, {
        capture: true,
      });
    };
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
    onChange(isSelected ? null : item);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setIsOpen(false);
    setSearchTerm("");
  };

  // --- PORTAL MENU ---
  const DropdownMenu = (
    <div
      ref={dropdownRef}
      className="fixed bg-white border border-gray-300 shadow-2xl rounded-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100"
      style={{
        left: coords.left,
        top: menuPosition === "bottom" ? coords.top : "auto",
        bottom:
          menuPosition === "top" ? window.innerHeight - coords.top : "auto",
        width: Math.max(coords.width, 300),
        maxHeight: "300px",
        // USE THE PROP. If not provided, fallback to 9999
        zIndex: zIndex ?? 9999,
        // HIDE until calculated
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <div className="p-2 border-b border-gray-100 bg-gray-50/50 shrink-0">
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
          />
        </div>
      </div>
      <div className="flex bg-gray-100 border-b border-gray-200 text-[11px] font-bold text-gray-600 px-3 py-1.5 shrink-0">
        {columns.map((col) => (
          <div
            key={col.key as string}
            className={`${col.width || "flex-1"} px-2 text-left`}
          >
            {col.header}
          </div>
        ))}
      </div>
      <div className="overflow-y-auto flex-1 p-1">
        {filteredData.length > 0 ? (
          filteredData.map((item) => {
            const isSelected = String(item[valueKey]) === String(value);
            return (
              <div
                key={String(item[valueKey])}
                className={`flex items-center text-[12px] px-3 py-2 border-b border-gray-50 cursor-pointer transition-colors rounded-sm ${
                  isSelected
                    ? "bg-blue-50 text-blue-700 font-medium border-blue-100"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
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
          <div className="p-6 text-center text-xs text-gray-500">
            No results found
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`relative ${className}`} ref={triggerRef}>
      <div
        className={`w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 flex items-center justify-between cursor-pointer hover:border-gray-400 focus-within:ring-1 focus-within:ring-[#60a5fa] focus-within:border-[#60a5fa] transition-all ${
          disabled ? "bg-gray-100 cursor-not-allowed opacity-70" : ""
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span
          className={`text-[13px] truncate ${
            !value ? "text-gray-500" : "text-gray-700 font-medium"
          }`}
        >
          {displayLabel}
        </span>
        <div className="flex items-center gap-1">
          {value && !disabled && (
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
      {/* RENDER PORTAL */}
      {isOpen && createPortal(DropdownMenu, document.body)}
    </div>
  );
};

export default Dropdown;
