import { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  PrintIcon,
  ExportIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "../icons";

/**
 * Custom hook to encapsulate table state management (filtering, sorting, pagination).
 * @param {Array<Object>} initialData - The starting data array.
 * @param {Array<Object>} columns - The column definitions.
 * @param {number} initialPageSize - Default items per page.
 * @returns {Object} - All necessary state and derived data for rendering the table.
 */
export const useTableLogic = (initialData, columns, initialPageSize) => {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: columns[0]?.key || null,
    direction: "ascending",
  });
  const [selectedRows, setSelectedRows] = useState([]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return data.filter((row) =>
      columns.some((col) =>
        String(row[col.key] ?? "")
          .toLowerCase()
          .includes(lowerCaseSearchTerm)
      )
    );
  }, [data, searchTerm, columns]);

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        let comparisonA = aValue;
        let comparisonB = bValue;

        // Numerical sorting for Age and Salary
        if (sortConfig.key === "age" || sortConfig.key === "salary") {
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
    setCurrentPage(1);
    setSelectedRows([]);
  }, [pageSize, searchTerm]);

  const startEntry = Math.min(
    sortedData.length,
    (currentPage - 1) * pageSize + 1
  );
  const endEntry = Math.min(sortedData.length, currentPage * pageSize);

  const pageNumbers = useMemo(() => {
    const pages = [];
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

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const renderSortIndicator = (key) => {
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
 * @param {Array<Object>} exportData - The full data array.
 * @param {Array<Object>} columns - The column definitions used for headers/keys.
 * @param {string} fileName - The desired file name.
 */
const handleExport = (exportData, columns, fileName = "DataExport") => {
  const headers = columns.map((col) => col.label);
  const keys = columns.map((col) => col.key);

  const sheetData = [
    headers, // Header row
    ...exportData.map((row) => keys.map((key) => row[key])),
  ];

  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

/**
 * Handles the logic for printing the table content.
 * @param {string} elementId - The ID of the HTML element (table) to print.
 * @param {string} title - The title for the print window.
 */
const handlePrint = (elementId, title = "Print Document") => {
  const printableContent = document.getElementById(elementId)?.outerHTML;

  if (!printableContent) {
    console.error(`Element with ID '${elementId}' not found for printing.`);
    return;
  }

  const printWindow = window.open("", "", "height=600,width=800");
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
};

export {
  ChevronUpIcon,
  ChevronDownIcon,
  ExportIcon,
  PrintIcon,
  handleExport,
  handlePrint,
};
