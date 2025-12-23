import {
  useState,
  useMemo,
  useEffect,
  Dispatch,
  SetStateAction,
  JSX,
} from "react";
import * as XLSX from "xlsx";
import {
  PrintIcon,
  ExportIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "../icons";

// --- Type Definitions ---

// Define a general interface for table data items.
// Using [key: string]: any allows access like row[col.key]
export interface DataItem {
  [key: string]: any;
}

// Define the structure for a table column
export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

// Define the structure for the sorting configuration state
interface SortConfig {
  key: string | null;
  direction: "ascending" | "descending";
}

// Define the return type for the hook for clarity
interface TableLogicResult {
  data: DataItem[];
  setData: Dispatch<SetStateAction<DataItem[]>>;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  selectedRows: DataItem[];
  setSelectedRows: Dispatch<SetStateAction<DataItem[]>>;
  sortConfig: SortConfig;
  paginatedData: DataItem[];
  sortedDataLength: number;
  totalPages: number;
  startEntry: number;
  endEntry: number;
  pageNumbers: number[];
  requestSort: (key: string) => void;
  renderSortIndicator: (key: string) => JSX.Element | null;
}

/**
 * Custom hook to encapsulate table state management (filtering, sorting, pagination).
 * @param initialData - The starting data array.
 * @param columns - The column definitions.
 * @param initialPageSize - Default items per page.
 * @returns All necessary state and derived data for rendering the table.
 */
export const useTableLogic = (
  initialData: DataItem[],
  columns: Column[],
  initialPageSize: number
): TableLogicResult => {
  const [data, setData] = useState<DataItem[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: columns[0]?.key || null,
    direction: "ascending",
  });
  const [selectedRows, setSelectedRows] = useState<DataItem[]>([]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return data.filter(
      (
        row: DataItem // Added DataItem type to 'row'
      ) =>
        columns.some(
          (
            col: Column // Added Column type to 'col'
          ) =>
            String(row[col.key] ?? "")
              .toLowerCase()
              .includes(lowerCaseSearchTerm)
        )
    );
  }, [data, searchTerm, columns]);

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key) {
      sortableItems.sort((a: DataItem, b: DataItem) => {
        // Added DataItem types to 'a' and 'b'
        const sortKey = sortConfig.key as string;
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        let comparisonA: string | number = aValue;
        let comparisonB: string | number = bValue;

        // Numerical sorting for Age and Salary
        if (sortKey === "age" || sortKey === "salary") {
          comparisonA = parseFloat(String(aValue).replace(/[^0-9.]/g, "")) || 0;
          comparisonB = parseFloat(String(bValue).replace(/[^0-9.]/g, "")) || 0;
        }

        if (comparisonA < comparisonB) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (comparisonA > comparisonB) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pageSize]);

  useEffect(() => {
    // Reset page and selection when page size or filter changes
    setCurrentPage(1);
    setSelectedRows([]);
  }, [pageSize, searchTerm]);

  const startEntry = Math.min(
    sortedData.length,
    (currentPage - 1) * pageSize + 1
  );
  const endEntry = Math.min(sortedData.length, currentPage * pageSize);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages, currentPage]);

  const requestSort = (key: string) => {
    // Added string type to 'key'
    let direction: SortConfig["direction"] = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const renderSortIndicator = (key: string): JSX.Element | null => {
    // Added string type to 'key'
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUpIcon className="ml-1 size-3" />
    ) : (
      <ChevronDownIcon className="ml-1 size-3" />
    );
  };

  return {
    // State
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
    sortConfig,

    // Derived Data
    paginatedData,
    sortedDataLength: sortedData.length,
    totalPages,
    startEntry,
    endEntry,
    pageNumbers,

    // Handlers & Utilities
    requestSort,
    renderSortIndicator,
  };
};

/**
 * Handles the logic for exporting the full dataset to an Excel file.
 * @param exportData - The full data array.
 * @param columns - The column definitions used for headers/keys.
 * @param fileName - The desired file name.
 */
const handleExport = (
  exportData: DataItem[], // Explicitly typed
  columns: Column[], // Explicitly typed
  fileName: string = "DataExport"
) => {
  const headers: string[] = columns.map((col: Column) => col.label);
  const keys: string[] = columns.map((col: Column) => col.key);

  const sheetData = [
    headers, // Header row
    ...exportData.map(
      (
        row: DataItem // Explicitly typed 'row'
      ) => keys.map((key: string) => row[key]) // Explicitly typed 'key'
    ),
  ];

  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

/**
 * Handles the logic for printing the table content.
 * @param elementId - The ID of the HTML element (table) to print.
 * @param title - The title for the print window.
 */
const handlePrint = (elementId: string, title: string = "Print Document") => {
  // Explicitly typed 'elementId'
  const printableContent = document.getElementById(elementId)?.outerHTML;

  if (!printableContent) {
    console.error(`Element with ID '${elementId}' not found for printing.`);
    return;
  }

  const printWindow: Window | null = window.open(
    "",
    "",
    "height=600,width=800"
  );

  // Added null check to prevent TS18047 errors
  if (printWindow) {
    printWindow.document.write("<html><head><title>" + title + "</title>");
    // Basic styling for print, hides action/checkbox columns (marked with .no-print)
    printWindow.document.write("<style>");
    printWindow.document.write(
      "table { width: 100%; border-collapse: collapse; }"
    );
    printWindow.document.write(
      "th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }"
    );
    printWindow.document.write("thead { background-color: #f2f2f2; }");
    printWindow.document.write(".no-print { display: none !important; }");
    printWindow.document.write("</style>");
    printWindow.document.write("</head><body>");
    printWindow.document.write("<h1>" + title + "</h1>");
    printWindow.document.write(printableContent);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  } else {
    console.error("Could not open print window.");
  }
};

export {
  ChevronUpIcon,
  ChevronDownIcon,
  ExportIcon,
  PrintIcon,
  handleExport,
  handlePrint,
};
