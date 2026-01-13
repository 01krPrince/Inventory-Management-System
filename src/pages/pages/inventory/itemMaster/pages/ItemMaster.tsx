import React, {
  useState,
  useRef,
  useCallback,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
} from "react";

import {
  Plus,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  Printer,
  Download,
  EditIcon,
} from "lucide-react";

import AddNewItem from "../../../../../components/addItemMaster/AddNewItem";
import { ItemApiData } from "../models/ItemModel";
import { fetchItems, deleteItemApi } from "../api/itemService";
import { handlePrint } from "../../../../../components/function/functions";

// --- HELPER: Extract Display Value (CRITICAL FIX) ---
// Handles 'name' (Brand/Category) and 'item_name' (Under Group)
const getDisplayValue = (value: any): string => {
  if (value === null || value === undefined) return "";

  if (typeof value === "object") {
    // 1. Handle "Under Group" which uses 'item_name'
    if (value.item_name) return String(value.item_name);
    // 2. Handle "Brand/Category" which uses 'name'
    if (value.name) return String(value.name);
    // 3. Fallback to code if names are missing
    if (value.code) return String(value.code);

    return ""; // Empty object or unrecognized structure
  }

  return String(value);
};

// --- EXPORT FUNCTION ---
const handleExport = (data: any[], columns: Column[], fileName: string) => {
  const headers = columns
    .filter((col) => col.key !== "actions" && col.key !== "checkbox")
    .map((col) => col.label)
    .join(",");
  const rows = data
    .map((row) =>
      columns
        .filter((col) => col.key !== "actions" && col.key !== "checkbox")
        .map((col) => {
          const val = row[col.key];
          // Use helper to ensure objects are exported as strings
          const cleanVal = getDisplayValue(val).replace(/"/g, '""');
          return `"${cleanVal}"`;
        })
        .join(",")
    )
    .join("\n");

  const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- TYPE DEFINITIONS ---
export interface DataItem extends ItemApiData {
  widget?: boolean;
  inactive?: boolean;
  [key: string]: any;
}

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  type?: string;
  required?: boolean;
  render?: (value: any) => React.ReactNode;
}

interface SortConfig {
  key: keyof DataItem | null;
  direction: "ascending" | "descending";
}

// --- COLUMN DEFINITIONS ---
const ItemColumns: Column[] = [
  {
    key: "inactive",
    label: "Inactive",
    sortable: true,
    render: (value: boolean) => (
      <span
        className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
          value
            ? "bg-red-100 text-red-600 dark:bg-red-900/40"
            : "bg-green-100 text-green-600 dark:bg-green-900/40"
        }`}
      >
        {value ? "YES" : "NO"}
      </span>
    ),
  },
  { key: "name", label: "Name", sortable: true },
  { key: "code", label: "Code", sortable: true },

  // BRAND: Object with .name
  {
    key: "brand",
    label: "Brand",
    sortable: true,
    render: (value: any) => (
      <span className="font-medium text-gray-700">
        {getDisplayValue(value)}
      </span>
    ),
  },

  { key: "gst_classfication", label: "HSN Code", sortable: true },

  // CATEGORY: Object with .name
  {
    key: "category",
    label: "Category",
    sortable: true,
    render: (value: any) => <span>{getDisplayValue(value)}</span>,
  },

  // UNDER GROUP: Object with .item_name (Handled by getDisplayValue)
  {
    key: "under_group",
    label: "Group",
    sortable: true,
    render: (value: any) => <span>{getDisplayValue(value)}</span>,
  },

  { key: "type", label: "Type", sortable: true },
  { key: "barcode", label: "Bar Code", sortable: true },
  { key: "rackbin_no", label: "Rack Box", sortable: true },
];

const pageSizeOptions = [5, 10, 20, 50];
const initialPageSize = 10;

// --- TABLE LOGIC HOOK ---
const useItemTableLogic = (initialData: DataItem[], initialSize: number) => {
  const [data, setData] = useState<DataItem[]>(initialData);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(initialSize);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    setData(initialData);
    if (initialData.length < data.length) setCurrentPage(1);
    setSelectedRows([]);
  }, [initialData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize]);

  const sortedAndFilteredData = useMemo(() => {
    let sortableData = [...data];

    // FILTER LOGIC: Uses getDisplayValue to search inside objects
    let filteredData = sortableData.filter((item) =>
      Object.keys(item).some((key) => {
        const val = item[key];
        return getDisplayValue(val)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    );

    // SORT LOGIC: Uses getDisplayValue to sort based on the name text
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        const sortKey = sortConfig.key!;
        const aVal = getDisplayValue(a[sortKey]);
        const bVal = getDisplayValue(b[sortKey]);

        if (aVal < bVal) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return filteredData;
  }, [data, searchTerm, sortConfig]);

  const sortedDataLength = sortedAndFilteredData.length;
  const totalPages = Math.ceil(sortedDataLength / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedAndFilteredData.slice(start, end);
  }, [sortedAndFilteredData, currentPage, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage === 0 && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const startEntry = Math.min(
    sortedDataLength,
    (currentPage - 1) * pageSize + 1
  );
  const endEntry = Math.min(sortedDataLength, currentPage * pageSize);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxPageButtons = 5;
    let start = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let end = Math.min(totalPages, start + maxPageButtons - 1);

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages, currentPage]);

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig.key === (key as keyof DataItem) &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key: key as keyof DataItem, direction });
  };

  const renderSortIndicator = (key: string) => {
    if (sortConfig.key !== (key as keyof DataItem)) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="size-3 ml-1" />
    ) : (
      <ChevronDown className="size-3 ml-1" />
    );
  };

  return {
    data,
    setData,
    searchTerm,
    setSearchTerm,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    selectedRows,
    setSelectedRows,
    paginatedData,
    sortedDataLength,
    totalPages,
    startEntry,
    endEntry,
    pageNumbers,
    requestSort,
    renderSortIndicator,
  };
};

interface ResizableHeaderProps {
  col: Column;
  requestSort: (key: string) => void;
  renderSortIndicator: (key: string) => React.JSX.Element | null;
  setColumnWidths: Dispatch<SetStateAction<Record<string, number | undefined>>>;
  columnWidths: Record<string, number | undefined>;
  onDragStart: (key: string) => void;
  onDragOver: (key: string) => void;
  onDrop: (draggedKey: string, droppedOverKey: string) => void;
  columnIndex: number;
}

const ResizableHeader = ({
  col,
  requestSort,
  renderSortIndicator,
  setColumnWidths,
  columnWidths,
  onDragStart,
  onDragOver,
  onDrop,
}: ResizableHeaderProps) => {
  const thRef = useRef<HTMLTableHeaderCellElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const keyString = col.key as string;

  const style = {
    width: columnWidths[keyString] ? `${columnWidths[keyString]}px` : undefined,
    minWidth: "30px",
  };

  const startResizing = useCallback(
    (mouseDownEvent: React.MouseEvent<HTMLDivElement>) => {
      mouseDownEvent.stopPropagation();
      mouseDownEvent.preventDefault();
      const startX = mouseDownEvent.clientX;
      if (!thRef.current) return;
      const initialWidth = thRef.current.offsetWidth;
      const doResizing = (mouseMoveEvent: MouseEvent) => {
        const newWidth = Math.max(
          initialWidth + (mouseMoveEvent.clientX - startX),
          30
        );
        setColumnWidths((prev: Record<string, number | undefined>) => ({
          ...prev,
          [keyString]: newWidth,
        }));
      };
      const stopResizing = () => {
        window.removeEventListener("mousemove", doResizing);
        window.removeEventListener("mouseup", stopResizing);
      };
      window.addEventListener("mousemove", doResizing);
      window.addEventListener("mouseup", stopResizing);
    },
    [keyString, setColumnWidths]
  );

  const handleHeaderClick = () => {
    if (col.sortable) {
      requestSort(col.key);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLTableHeaderCellElement>) => {
    if (
      e.target instanceof HTMLElement &&
      e.target.className.includes("cursor-col-resize")
    )
      return;
    e.dataTransfer.setData("text/plain", keyString);
    setIsDragging(true);
    if (keyString !== "actions" && keyString !== "checkbox") {
      onDragStart(keyString);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableHeaderCellElement>) => {
    if (
      e.target instanceof HTMLElement &&
      e.target.className.includes("cursor-col-resize")
    )
      return;
    e.preventDefault();
    if (keyString !== "actions" && keyString !== "checkbox") {
      onDragOver(keyString);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLTableHeaderCellElement>) => {
    e.preventDefault();
    const draggedColKey = e.dataTransfer.getData("text/plain") as string;

    if (keyString !== "actions" && keyString !== "checkbox") {
      onDrop(draggedColKey, keyString);
    }
  };

  return (
    <th
      ref={thRef}
      key={keyString}
      draggable={true}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      className={`p-4 relative cursor-move text-left ${
        col.sortable
          ? "hover:bg-gray-100 dark:hover:bg-gray-700/80 transition duration-150"
          : ""
      } ${
        isDragging ? "opacity-50 border-blue-500 border-2" : ""
      } border-r border-dashed border-gray-300 dark:border-gray-600`}
      onClick={handleHeaderClick}
      style={style}
    >
      <span className="flex items-center whitespace-nowrap pointer-events-none">
        {col.label} {col.sortable && renderSortIndicator(col.key)}
      </span>
      <div
        className="absolute top-0 right-0 h-full w-2 cursor-col-resize z-20 opacity-0 hover:opacity-100 transition duration-150 bg-transparent hover:bg-blue-400 dark:hover:bg-blue-600"
        onMouseDown={startResizing}
        onClick={(e) => e.stopPropagation()}
      />
    </th>
  );
};

// --- ItemMaster Component (Main Export) ---
export default function ItemMaster() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [apiData, setApiData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- API DATA FETCHING ---
  const loadItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchItems();

      // Transform API data to include UI specific flags
      const processedData: DataItem[] = result.map((item: any) => ({
        ...item,
        widget: false, // Default UI state
        inactive: false, // Default UI state
      }));

      setApiData(processedData);
    } catch (err) {
      console.error("Failed to fetch item data:", err);
      setError("Failed to load item data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const [editingRow, setEditingRow] = useState<DataItem | null>(null);

  const [columnWidths, setColumnWidths] = useState<
    Record<string, number | undefined>
  >({
    checkbox: 30,
    sno: 40,
    widget: 50,
    inactive: 70,
    actions: 100,
  });

  const [currentColumns, setCurrentColumns] = useState<Column[]>(ItemColumns);

  const {
    data,
    setData,
    searchTerm,
    setSearchTerm,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    selectedRows,
    setSelectedRows,
    paginatedData,
    sortedDataLength,
    totalPages,
    startEntry,
    endEntry,
    pageNumbers,
    requestSort,
    renderSortIndicator,
  } = useItemTableLogic(apiData, initialPageSize);

  // --- Drag & Drop Handlers ---
  const handleDragStart = useCallback((_key: string) => {}, []);
  const handleDragOver = useCallback((_key: string) => {}, []);

  const handleDrop = useCallback(
    (draggedKey: string, droppedOverKey: string) => {
      if (!draggedKey || !droppedOverKey) return;

      const draggedColIndex = currentColumns.findIndex(
        (col) => col.key === draggedKey
      );
      const droppedOverIndex = currentColumns.findIndex(
        (col) => col.key === droppedOverKey
      );

      if (
        draggedColIndex === -1 ||
        droppedOverIndex === -1 ||
        draggedColIndex === droppedOverIndex
      ) {
        return;
      }

      const newColumns = [...currentColumns];
      const [draggedItem] = newColumns.splice(draggedColIndex, 1);
      newColumns.splice(droppedOverIndex, 0, draggedItem);

      setCurrentColumns(newColumns);
    },
    [currentColumns]
  );

  // --- Data Handlers ---
  const isSelected = (row: DataItem) =>
    selectedRows.includes(row._id as string);
  const handleSelectRow = (row: DataItem) => {
    setSelectedRows((prev: string[]) =>
      isSelected(row)
        ? prev.filter((id: string) => id !== row._id)
        : [...prev, row._id as string]
    );
  };

  const handleSelectAll = () => {
    const allIdsOnPage = paginatedData.map(
      (row: DataItem) => row._id as string
    );
    const areAllSelected = allIdsOnPage.every((id: string) =>
      selectedRows.includes(id)
    );

    if (areAllSelected) {
      setSelectedRows((prev: string[]) =>
        prev.filter((id: string) => !allIdsOnPage.includes(id))
      );
    } else {
      setSelectedRows((prev: string[]) => [
        ...new Set([...prev, ...allIdsOnPage]),
      ]);
    }
  };

  const handleOpenEditModal = (row: DataItem) => {
    setEditingRow(row);
    setShowAddForm(true);
  };

  const handleDelete = async (item: DataItem) => {
    if (!item._id) return;

    if (
      window.confirm(
        `Are you sure you want to delete Item: ${item.name} (${
          item.code || "No Code"
        })?`
      )
    ) {
      try {
        const response = await deleteItemApi(item._id);

        setData((prev: DataItem[]) =>
          prev.filter((u: DataItem) => u._id !== item._id)
        );
        setSelectedRows((prev: string[]) =>
          prev.filter((id: string) => id !== item._id)
        );

        if (!response.success && response.message !== "Item not found") {
          alert(`Warning: ${response.message}`);
        }
      } catch (error) {
        alert("Failed to delete item from server.");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one row to delete.");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedRows.length} selected row(s)?`
      )
    ) {
      try {
        setIsLoading(true);
        const deletePromises = selectedRows.map((id) => deleteItemApi(id));
        await Promise.all(deletePromises);

        await loadItems();
        setSelectedRows([]);
      } catch (err) {
        alert("Some items could not be deleted.");
        setIsLoading(false);
      }
    }
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingRow(null);
  };

  const handleFormSuccess = () => {
    loadItems();
    handleCloseForm();
  };

  const areAllOnPageSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row: DataItem) =>
      selectedRows.includes(row._id as string)
    );

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex justify-center items-center h-64 bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <Loader2 className="size-8 text-blue-600 animate-spin mr-2" />
          <span className="text-lg text-gray-700 dark:text-gray-300">
            Loading item data...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="p-8 text-center text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-300 rounded-xl shadow-lg dark:border-red-700">
          <p className="font-semibold text-lg">Error</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={loadItems}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // --- STACKING LOGIC: Base Z-Index for the first popup ---
  const BASE_Z_INDEX = 50;

  return (
    <>
      {/* 1. Main Table View (Always Visible) */}
      <div className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-full">
        {/* Control Panel */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              Show
              <select
                value={pageSize}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setPageSize(Number(e.target.value))
                }
                aria-label="Entries per page"
                className="mx-2 p-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-white appearance-none cursor-pointer"
              >
                {pageSizeOptions.map((option: number) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              entries
            </div>

            {selectedRows.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 flex items-center bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition shadow-sm"
              >
                <Trash2 className="size-4 mr-1" />
                Bulk Delete ({selectedRows.length})
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <button
              onClick={() =>
                handlePrint("printable-table", "Item Master Directory")
              }
              className="p-2 text-gray-600 dark:text-gray-300 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title="Print Table"
            >
              <Printer className="size-5" />
            </button>

            <button
              onClick={() =>
                handleExport(data, currentColumns, "ItemMasterDirectory")
              }
              className="p-2 text-gray-600 dark:text-gray-300 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title="Export to CSV"
            >
              <Download className="size-5" />
            </button>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full p-2 pl-10 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
            </div>

            <button
              onClick={() => {
                setEditingRow(null);
                setShowAddForm(true);
              }}
              className="px-3 py-2 flex items-center bg-[#0c5888] text-white text-sm font-medium hover:bg-[#124463] transition shadow-md whitespace-nowrap rounded-lg"
            >
              <Plus className="size-4 mr-1" />
              Add New Item
            </button>
          </div>
        </div>
        <hr className="mb-4 border-gray-100 dark:border-gray-700" />

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full table-fixed" id="printable-table">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 text-left text-xs font-semibold uppercase text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                {/* Checkbox Column */}
                <th
                  className="p-4 w-10 no-print text-center border-r border-dashed border-gray-300 dark:border-gray-600"
                  style={{ width: columnWidths["checkbox"] || "30px" }}
                >
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 dark:bg-gray-600 dark:border-gray-500 border-gray-300 focus:ring-blue-500"
                    checked={areAllOnPageSelected}
                    onChange={handleSelectAll}
                  />
                </th>

                {/* Sno. Column */}
                <th
                  className="p-4 w-12 text-center border-r border-dashed border-gray-300 dark:border-gray-600"
                  style={{ width: columnWidths["sno"] || "40px" }}
                >
                  Sno.
                </th>

                {/* Data Columns */}
                {currentColumns.map((col: Column, index: number) => (
                  <ResizableHeader
                    key={col.key as string}
                    col={col}
                    requestSort={requestSort}
                    renderSortIndicator={renderSortIndicator}
                    setColumnWidths={setColumnWidths}
                    columnIndex={index}
                    columnWidths={columnWidths}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  />
                ))}

                {/* Actions Column */}
                <th
                  className="p-4 text-center whitespace-nowrap no-print border-r border-dashed border-gray-300 dark:border-gray-600"
                  style={{ width: columnWidths["actions"] || "100px" }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row: DataItem, index: number) => (
                  <tr
                    key={row._id}
                    className="even:bg-gray-50/50 dark:even:bg-gray-700/10 border-t border-gray-100 dark:border-gray-700/50 text-sm text-gray-800 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700/30 transition duration-150"
                  >
                    {/* Checkbox Cell */}
                    <td
                      className="p-4 w-10 no-print text-center border-r border-gray-200 dark:border-gray-700"
                      style={{
                        width: columnWidths["checkbox"] || "30px",
                      }}
                    >
                      <input
                        type="checkbox"
                        className="rounded text-blue-600 dark:bg-gray-600 dark:border-gray-500 border-gray-300 focus:ring-blue-500"
                        checked={isSelected(row)}
                        onChange={() => handleSelectRow(row)}
                      />
                    </td>

                    {/* Sno. Cell */}
                    <td
                      className="p-4 w-12 text-center border-r border-gray-200 dark:border-gray-700"
                      style={{ width: columnWidths["sno"] || "40px" }}
                    >
                      {startEntry + index}
                    </td>

                    {/* Data Cells */}
                    {currentColumns.map((col: Column, colIndex: number) => {
                      const value = row[col.key as keyof DataItem];

                      if (col.render) {
                        return (
                          <td
                            key={colIndex}
                            className="p-4 whitespace-nowrap overflow-hidden text-ellipsis text-center border-r border-gray-200 dark:border-gray-700"
                            style={{
                              width: columnWidths[col.key as string]
                                ? `${columnWidths[col.key as string]}px`
                                : undefined,
                            }}
                          >
                            {col.render(value)}
                          </td>
                        );
                      }

                      // Use helper for standard cells as well to catch any unhandled objects
                      const displayValue = getDisplayValue(value);

                      return (
                        <td
                          key={colIndex}
                          className="p-4 whitespace-nowrap overflow-hidden text-ellipsis border-r border-gray-200 dark:border-gray-700"
                          style={{
                            width: columnWidths[col.key as string]
                              ? `${columnWidths[col.key as string]}px`
                              : undefined,
                          }}
                        >
                          {displayValue === "" ? "null" : displayValue}
                        </td>
                      );
                    })}

                    {/* Actions Cell */}
                    <td
                      className="p-4 text-center space-x-2 whitespace-nowrap no-print border-r border-gray-200 dark:border-gray-700"
                      style={{
                        width: columnWidths["actions"] || "100px",
                      }}
                    >
                      <button
                        onClick={() => handleOpenEditModal(row)}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 transition"
                        title="Edit"
                      >
                        <EditIcon className="size-4 inline" />
                      </button>

                      <button
                        onClick={() => handleDelete(row)}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition"
                        title="Delete"
                      >
                        <Trash2 className="size-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={currentColumns.length + 3}
                    className="p-8 text-center text-lg text-gray-500 dark:text-gray-400"
                  >
                    No matching item entries found. 📦
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startEntry} to {endEntry} of {sortedDataLength} entries.
            (Total Pages: {totalPages})
          </div>

          <div className="flex space-x-2 items-center justify-center mt-4">
            <button
              onClick={() =>
                setCurrentPage((prev: number) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700/40 dark:text-gray-500"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-[#0c5888]/10 hover:text-[#0c5888] dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-[#0c5888]/20"
              }`}
            >
              Previous
            </button>

            {pageNumbers.map((page: number) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? "bg-[#0c5888] text-white shadow-md border border-transparent dark:bg-[#0c5888]"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-[#0c5888]/10 hover:text-[#0c5888] dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-[#0c5888]/20"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage >= totalPages}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                currentPage >= totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700/40 dark:text-gray-500"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-[#0c5888]/10 hover:text-[#0c5888] dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-[#0c5888]/20"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 2. RECURSIVE MODAL OVERLAY LOGIC */}
      {showAddForm && (
        <div
          className="w-full h-full fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm p-4"
          style={{ zIndex: BASE_Z_INDEX }}
        >
          {/* Ensure dimensions are large enough */}
          <div className="overflow-auto bg-transparent relative">
            <AddNewItem
              onClose={handleCloseForm}
              onSuccess={handleFormSuccess}
              initialData={editingRow ? (editingRow as any) : undefined}
              index={BASE_Z_INDEX}
            />
          </div>
        </div>
      )}
    </>
  );
}
