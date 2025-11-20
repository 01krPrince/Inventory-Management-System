import React, { useState, useMemo } from "react";
// Assuming these imports exist in your project structure
import {
  PrintIcon,
  PlusIcon,
  TrashIcon,
  EditIcon,
  SearchIcon,
  ExportIcon,
} from "../../../../components/icons";

import {
  handlePrint,
  handleExport,
} from "../../../../components/function/functions";

// --- TYPE DEFINITIONS ---
interface PriceListData {
  id: number;
  sNo: number;
  categoryName: string;
  effectiveFromDate: string;
  description: string;
  branchName: string;
  [key: string]: any; // Index signature for safe generic access (sorting/filtering)
}

interface PriceListColumn {
  key: keyof Omit<PriceListData, "id">;
  label: string;
  sortable: boolean;
}

interface SortConfig {
  key: keyof PriceListData | null;
  direction: "ascending" | "descending";
}

// Define the shape for the form data (Includes all necessary fields except id and sNo)
type PriceListFormData = Omit<PriceListData, "id" | "sNo">;

// --- 1. MOCK DATA AND COLUMN DEFINITIONS ---

const initialPriceListData: PriceListData[] = [
  {
    id: 1,
    sNo: 1,
    categoryName: "Standard Goods",
    effectiveFromDate: "2024-01-01",
    description: "Default pricing tier for general items.",
    branchName: "Main Branch",
  },
  {
    id: 2,
    sNo: 2,
    categoryName: "Premium Services",
    effectiveFromDate: "2024-03-15",
    description: "High-value consulting rates.",
    branchName: "Central Office",
  },
  {
    id: 3,
    sNo: 3,
    categoryName: "Wholesale Components",
    effectiveFromDate: "2023-11-20",
    description: "Volume discounts for bulk procurement.",
    branchName: "Warehouse Depot",
  },
];

const priceListColumns: PriceListColumn[] = [
  { key: "sNo", label: "S.No.", sortable: true },
  { key: "categoryName", label: "Category Name", sortable: true },
  { key: "effectiveFromDate", label: "Effective From Date", sortable: true },
  { key: "description", label: "Description", sortable: false },
  { key: "branchName", label: "Branch Name", sortable: true },
];

const pageSizeOptions = [5, 10, 20];
const initialPageSize = 5;

// Mock hook for table logic
const useTableLogicMock = (
  initialData: PriceListData[],
  initialSize: number
) => {
  const [data, setData] = useState<PriceListData[]>(initialData);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(initialSize);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });

  const sortedAndFilteredData = useMemo(() => {
    let sortableData = [...data];
    let filteredData = sortableData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        const sortKey = sortConfig.key!;
        // Cast values to string for consistent comparison if needed,
        // or rely on built-in comparison if types are mostly strings/numbers
        const aVal = a[sortKey];
        const bVal = b[sortKey];

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

  const startEntry = Math.min(
    sortedDataLength,
    (currentPage - 1) * pageSize + 1
  );
  const endEntry = Math.min(sortedDataLength, currentPage * pageSize);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxPageButtons = 5;
    const start = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const end = Math.min(totalPages, start + maxPageButtons - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages, currentPage]);

  const requestSort = (key: keyof PriceListData) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const renderSortIndicator = (key: keyof PriceListData) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? " ▲" : " ▼";
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

// --- 2. MODAL COMPONENTS (ADD & EDIT) ---

// Define fields for the forms
const priceListFormFields = [
  { key: "categoryName", label: "Category Name", type: "text", required: true },
  {
    key: "effectiveFromDate",
    label: "Effective From Date",
    type: "date",
    required: true,
  },
  { key: "description", label: "Description", type: "text", required: false },
  { key: "branchName", label: "Branch Name", type: "text", required: false },
];

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: PriceListFormData) => void;
}

const AddPriceListModal: React.FC<AddModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const initialData: PriceListFormData = {
    categoryName: "",
    effectiveFromDate: "",
    description: "",
    branchName: "",
  };
  const [formData, setFormData] = useState<PriceListFormData>(initialData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryName || !formData.effectiveFromDate) {
      alert("Please fill in Category Name and Effective From Date.");
      return;
    }
    onAdd(formData);
    setFormData(initialData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-70 flex items-center justify-center backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg m-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white border-b pb-2 border-gray-100 dark:border-gray-700">
          Create New Price List
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {priceListFormFields.map((col) => (
            <div key={col.key} className="col-span-1">
              <label
                htmlFor={col.key}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {col.label}
                {col.required && <span className="text-red-500">*</span>}
              </label>
              <input
                id={col.key}
                type={col.type}
                name={col.key}
                value={String(
                  formData[col.key as keyof PriceListFormData] || ""
                )}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                required={col.required}
              />
            </div>
          ))}
          <div className="col-span-full flex justify-end space-x-3 pt-4 border-t mt-4 border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
            >
              Create Price List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: PriceListData | null;
  onUpdate: (data: PriceListData) => void;
}

const EditPriceListModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  rowData,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<PriceListData | {}>({});

  // Sync formData with rowData when it changes
  useMemo(() => {
    setFormData(rowData ? { ...rowData } : {});
  }, [rowData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = formData as PriceListData;

    if (!updatedData.categoryName || !updatedData.effectiveFromDate) {
      alert("Please fill in Category Name and Effective From Date.");
      return;
    }
    onUpdate(updatedData);
    onClose();
  };

  if (!isOpen || !rowData) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-70 flex items-center justify-center backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg m-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white border-b pb-2 border-gray-100 dark:border-gray-700">
          Edit Price List: {rowData?.categoryName}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {priceListFormFields.map((col) => (
            <div key={col.key} className="col-span-1">
              <label
                htmlFor={col.key}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {col.label}
                {col.required && <span className="text-red-500">*</span>}
              </label>
              <input
                id={col.key}
                type={col.type}
                name={col.key}
                // Ensure value is a string for the input element
                value={String((formData as PriceListData)[col.key] || "")}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                required={col.required}
              />
            </div>
          ))}
          <div className="col-span-full flex justify-end space-x-3 pt-4 border-t mt-4 border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- 3. MAIN COMPONENT ---

export default function PriceListDirectory() {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingRow, setEditingRow] = useState<PriceListData | null>(null);

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
  } = useTableLogicMock(initialPriceListData, initialPageSize);

  const isSelected = (row: PriceListData) => selectedRows.includes(row.id);

  const handleSelectRow = (row: PriceListData) => {
    setSelectedRows((prev) =>
      isSelected(row) ? prev.filter((id) => id !== row.id) : [...prev, row.id]
    );
  };

  const handleSelectAll = () => {
    const allIdsOnPage = paginatedData.map((row) => row.id);
    const areAllSelected = allIdsOnPage.every((id) =>
      selectedRows.includes(id)
    );

    if (areAllSelected) {
      setSelectedRows((prev) =>
        prev.filter((id) => !allIdsOnPage.includes(id))
      );
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...allIdsOnPage])]);
    }
  };

  const handleAddPriceList = (newPriceListData: PriceListFormData) => {
    const newId = data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    const newSNo = data.length + 1;

    // FIX: Explicitly assemble the new entry, ensuring all required fields
    // (categoryName, effectiveFromDate) are present to satisfy PriceListData.
    const newEntry: PriceListData = {
      id: newId,
      sNo: newSNo,
      categoryName: newPriceListData.categoryName, // Required field
      effectiveFromDate: newPriceListData.effectiveFromDate, // Required field
      // Optional fields with fallback handling
      description: newPriceListData.description || "N/A",
      branchName: newPriceListData.branchName || "N/A",
    };

    // The setData call is now satisfied because newEntry is definitively PriceListData
    setData((prev: PriceListData[]): PriceListData[] => [...prev, newEntry]);
  };

  const handleUpdatePriceList = (updatedData: PriceListData) => {
    setData((prevData) =>
      prevData.map((row) => (row.id === updatedData.id ? updatedData : row))
    );
  };

  const handleOpenEditModal = (row: PriceListData) => {
    setEditingRow({ ...row }); // Pass a clone to isolate modal state
    setIsEditModalOpen(true);
  };

  const handleDelete = (row: PriceListData) => {
    if (
      window.confirm(
        `Are you sure you want to delete Price List: ${row.categoryName}?`
      )
    ) {
      setData((prev) => prev.filter((u) => u.id !== row.id));
      setSelectedRows((prev) => prev.filter((id) => id !== row.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one row to delete.");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedRows.length} selected row(s)?`
      )
    ) {
      setData((prev) => prev.filter((u) => !selectedRows.includes(u.id)));
      setSelectedRows([]);
    }
  };

  const areAllOnPageSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedRows.includes(row.id));

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-full">
        {/* Control Panel */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            {/* Show Entries Dropdown */}
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              Show
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="mx-2 p-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-white appearance-none cursor-pointer"
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              entries
            </div>

            {/* Bulk Delete Button */}
            {selectedRows.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 flex items-center bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition shadow-sm"
              >
                <TrashIcon className="size-4 mr-1" />
                Bulk Delete ({selectedRows.length})
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <button
              onClick={() =>
                handlePrint("price-list-table", "Price List Directory")
              }
              className="p-2 text-gray-600 dark:text-gray-300 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title="Print Table"
            >
              <PrintIcon className="size-5" />
            </button>
            <button
              onClick={() =>
                handleExport(
                  data,
                  priceListColumns as any,
                  "PriceListDirectory"
                )
              }
              className="p-2 text-gray-600 dark:text-gray-300 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title="Export to XLSX"
            >
              <ExportIcon className="size-5" />
            </button>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search all columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-2 flex items-center bg-[#0c5888] text-white text-sm font-medium hover:bg-[#124463] transition shadow-md whitespace-nowrap rounded-lg"
            >
              <PlusIcon className="size-4 mr-1" />
              Create New
            </button>
          </div>
        </div>

        <hr className="mb-4 border-gray-100 dark:border-gray-700" />

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full table-fixed" id="price-list-table">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 text-left text-xs font-semibold uppercase text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                {/* Checkbox Column */}
                <th
                  className="p-4 w-10 no-print border-r border-dashed border-gray-300 dark:border-gray-600"
                  style={{ width: "40px" }}
                >
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 dark:bg-gray-600 dark:border-gray-500 border-gray-300 focus:ring-blue-500"
                    checked={areAllOnPageSelected}
                    onChange={handleSelectAll}
                  />
                </th>

                {/* Data Columns */}
                {priceListColumns.map((col) => (
                  <th
                    key={col.key}
                    className={`p-4 relative whitespace-nowrap ${
                      col.sortable
                        ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/80 transition duration-150"
                        : ""
                    } border-r border-dashed border-gray-300 dark:border-gray-600`}
                    onClick={() =>
                      col.sortable &&
                      requestSort(col.key as keyof PriceListData)
                    }
                  >
                    <span className="flex items-center whitespace-nowrap">
                      {col.label}
                      {col.sortable &&
                        renderSortIndicator(col.key as keyof PriceListData)}
                    </span>
                  </th>
                ))}
                {/* Actions Column */}
                <th
                  className="p-4 text-center whitespace-nowrap no-print border-r border-dashed border-gray-300 dark:border-gray-600"
                  style={{ width: "100px" }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className="even:bg-gray-50/50 dark:even:bg-gray-700/10 border-t border-gray-100 dark:border-gray-700/50 text-sm text-gray-800 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700/30 transition duration-150"
                  >
                    {/* Checkbox Cell */}
                    <td
                      className="p-4 w-10 no-print border-r border-gray-200 dark:border-gray-700"
                      style={{ width: "40px" }}
                    >
                      <input
                        type="checkbox"
                        className="rounded text-blue-600 dark:bg-gray-600 dark:border-gray-500 border-gray-300 focus:ring-blue-500"
                        checked={isSelected(row)}
                        onChange={() => handleSelectRow(row)}
                      />
                    </td>

                    {/* Data Cells */}
                    {priceListColumns.map((col) => (
                      <td
                        key={col.key}
                        className="p-4 whitespace-nowrap overflow-hidden text-ellipsis border-r border-gray-200 dark:border-gray-700"
                      >
                        {row[col.key]}
                      </td>
                    ))}

                    {/* Actions Cell */}
                    <td
                      className="p-4 text-center space-x-2 whitespace-nowrap no-print border-r border-gray-200 dark:border-gray-700"
                      style={{ width: "100px" }}
                    >
                      <button
                        onClick={() => handleOpenEditModal(row)}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 transition"
                        aria-label="Edit"
                        title="Edit"
                      >
                        <EditIcon className="size-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(row)}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition"
                        aria-label="Delete"
                        title="Delete"
                      >
                        <TrashIcon className="size-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={priceListColumns.length + 2}
                    className="p-8 text-center text-lg text-gray-500 dark:text-gray-400"
                  >
                    No matching price list entries found. 🙁
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
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700/40 dark:text-gray-500"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-[#0c5888]/10 hover:text-[#0c5888] dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-[#0c5888]/20"
              }`}
            >
              Previous
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? "bg-[#0c5888] text-white shadow-md border border-transparent dark:bg-[#0c5888]"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-[#0c5888]/10 hover:hover:text-[#0c5888] dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-[#0c5888]/20"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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

      {/* ADD POPUP */}
      <AddPriceListModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPriceList}
      />

      {/* EDIT POPUP */}
      <EditPriceListModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        rowData={editingRow}
        onUpdate={handleUpdatePriceList}
      />
    </>
  );
}
