import React, { useState, useRef, useEffect, useMemo, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X } from 'lucide-react';

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
  zIndex?: number;
}

const Dropdown = <T extends object>({
  data,
  columns,
  value,
  onChange,
  placeholder = 'Select...',
  valueKey,
  className = 'w-full',
  disabled = false,
  zIndex,
}: TableDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Position and Visibility State
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [menuPosition, setMenuPosition] = useState<'bottom' | 'top'>('bottom');
  const [isVisible, setIsVisible] = useState(false);

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Position Calculation
  useLayoutEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const REQUIRED_SPACE = 300;

      const isTop = spaceBelow < REQUIRED_SPACE;
      setMenuPosition(isTop ? 'top' : 'bottom');

      setCoords({
        left: rect.left,
        top: isTop ? rect.top - 5 : rect.bottom + 5,
        width: rect.width,
      });

      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // 2. Event Listeners (FIXED SCROLL LOGIC)
  useEffect(() => {
    const handleGlobalEvents = (event: Event) => {
      if (event.type === 'mousedown') {
        const mouseEvent = event as MouseEvent;
        if (
          dropdownRef.current?.contains(mouseEvent.target as Node) ||
          triggerRef.current?.contains(mouseEvent.target as Node)
        ) {
          return;
        }
        setIsOpen(false);
      } else if (event.type === 'scroll') {
        // Only close if scrolling something OUTSIDE the dropdown
        if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleGlobalEvents);
      // Capture: true is necessary to detect scroll on parent containers
      window.addEventListener('scroll', handleGlobalEvents, { capture: true });
    }

    return () => {
      document.removeEventListener('mousedown', handleGlobalEvents);
      window.removeEventListener('scroll', handleGlobalEvents, {
        capture: true,
      });
    };
  }, [isOpen]);

  const filteredData = useMemo(() => {
    // 1. Clean the search term (remove spaces, make lowercase)
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return data;

    return data.filter((item) => {
      // 2. Search across ALL columns defined in 'columns' prop
      return columns.some((col) => {
        const val = item[col.key];

        // 3. Safe string conversion
        // Converts null/undefined to "" so they don't match text like "null"
        const strVal = val === null || val === undefined ? '' : String(val);

        // 4. Check if this specific column value contains the search term
        return strVal.toLowerCase().includes(normalizedSearch);
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
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setIsOpen(false);
    setSearchTerm('');
  };

  const DropdownMenu = (
    <div
      ref={dropdownRef}
      className="animate-in fade-in zoom-in-95 fixed flex flex-col overflow-hidden rounded-sm border border-gray-300 bg-white shadow-2xl duration-100"
      style={{
        left: coords.left,
        top: menuPosition === 'bottom' ? coords.top : 'auto',
        bottom: menuPosition === 'top' ? window.innerHeight - coords.top : 'auto',
        width: Math.max(coords.width, 400), // Slightly wider for table view
        maxHeight: '300px',
        zIndex: zIndex ?? 9999,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        overscrollBehavior: 'contain', // Prevents background page from scrolling
      }}>
      {/* Search Header */}
      <div className="shrink-0 border-b border-gray-100 bg-gray-50/50 p-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-sm border border-gray-300 py-1.5 pl-9 pr-3 text-xs shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {/* Table Header */}
      <div className="flex shrink-0 border-b border-gray-200 bg-gray-100 px-3 py-1.5 text-[11px] font-bold text-gray-600">
        {columns.map((col) => (
          <div key={col.key as string} className={`${col.width || 'flex-1'} px-2 text-left`}>
            {col.header}
          </div>
        ))}
      </div>

      {/* Scrollable List Area */}
      <div className="flex-1 overflow-y-auto p-1">
        {filteredData.length > 0 ? (
          filteredData.map((item) => {
            const isSelected = String(item[valueKey]) === String(value);
            return (
              <div
                key={String(item[valueKey])}
                className={`flex cursor-pointer items-center rounded-sm border-b border-gray-50 px-3 py-2 text-[12px] transition-colors ${
                  isSelected
                    ? 'border-blue-100 bg-blue-50 font-medium text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={(e) => handleSelect(e, item)}>
                {columns.map((col) => (
                  <div key={col.key as string} className={`${col.width || 'flex-1'} truncate px-2`}>
                    {String(item[col.key] || '-')}
                  </div>
                ))}
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-xs text-gray-500">No results found</div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`relative ${className}`} ref={triggerRef}>
      <div
        className={`flex h-[30px] w-full cursor-pointer items-center justify-between rounded-sm border border-gray-300 bg-white px-2 transition-all focus-within:border-[#60a5fa] focus-within:ring-1 focus-within:ring-[#60a5fa] hover:border-gray-400 ${
          disabled ? 'cursor-not-allowed bg-gray-100 opacity-70' : ''
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}>
        <span
          className={`truncate text-[13px] ${
            !value ? 'text-gray-500' : 'font-medium text-gray-700'
          }`}>
          {displayLabel}
        </span>
        <div className="flex items-center gap-1">
          {value && !disabled && (
            <div
              onClick={handleClear}
              className="rounded-full p-0.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-red-500">
              <X size={12} />
            </div>
          )}
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>
      {isOpen && createPortal(DropdownMenu, document.body)}
    </div>
  );
};

export default Dropdown;
