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

// Import the centralized theme
import { COLORS } from "../../../../constants/colors";

// --- TYPE DEFINITIONS ---
interface BarcodeRateData {
  id: number;
  sNo: number;
  itemName: string;
  barcode: string;
  rate: string;
  effectiveFrom: string;
}

interface BarcodeRateColumn {
  key: keyof Omit<BarcodeRateData, "id">;
  label: string;
  sortable: boolean;
}

// Fix for handleExport compatibility
interface ExportColumn {
  key: string;
  label: string;
  sortable: boolean;
  [key: string]: any;
}

interface SortConfig {
  key: keyof BarcodeRateData | null;
  direction: "ascending" | "descending";
}

// Define the shape for the form data
type BarcodeRateFormData = Omit<BarcodeRateData, "id" | "sNo">;

// --- 1. MOCK DATA AND COLUMN DEFINITIONS ---

const initialBarcodeRatesData: BarcodeRateData[] = [
  {
    id: 1,
    sNo: 1,
    itemName: "Super Mild Shampoo 200ml",
    barcode: "8901234567890",
    rate: "120.00",
    effectiveFrom: "2024-06-01",
  },
  {
    id: 2,
    sNo: 2,
    itemName: "Classic Earl Grey Tea",
    barcode: "8909876543210",
    rate: "450.00",
    effectiveFrom: "2024-07-15",
  },
  {
    id: 3,
    sNo: 3,
    itemName: "Almond Milk 1L",
    barcode: "8901122334455",
    rate: "299.00",
    effectiveFrom: "2024-01-01",
  },
];

const barcodeRateColumns: BarcodeRateColumn[] = [
  { key: "sNo", label: "S.No.", sortable: true },
  { key: "itemName", label: "Item Name", sortable: true },
  { key: "barcode", label: "Barcode", sortable: true },
  { key: "rate", label: "Rate (₹)", sortable: true },
  { key: "effectiveFrom", label: "Effective From", sortable: true },
];

const pageSizeOptions = [5, 10, 20, 50];
const initialPageSize = 10;

// Mock hook for table logic (Reused Logic)
const useTableLogicMock = (
  initialData: BarcodeRateData[],
  initialSize: number
) => {
  const [data, setData] = useState<BarcodeRateData[]>(initialData);
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

  const requestSort = (key: keyof BarcodeRateData) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const renderSortIndicator = (key: keyof BarcodeRateData) => {
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
const barcodeFormFields = [
  { key: "itemName", label: "Item Name", type: "text", required: true },
  { key: "barcode", label: "Barcode Number", type: "text", required: true },
  { key: "rate", label: "New Rate", type: "number", required: true },
  {
    key: "effectiveFrom",
    label: "Effective From Date",
    type: "date",
    required: true,
  },
];

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: BarcodeRateFormData) => void;
}

const AddBarcodeRateModal: React.FC<AddModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const initialData: BarcodeRateFormData = {
    itemName: "",
    barcode: "",
    rate: "",
    effectiveFrom: "",
  };
  const [formData, setFormData] = useState<BarcodeRateFormData>(initialData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.itemName ||
      !formData.rate ||
      !formData.effectiveFrom ||
      !formData.barcode
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    onAdd(formData);
    setFormData(initialData); // Reset form
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
        <h2
          className="text-2xl font-semibold mb-6 border-b pb-2"
          style={{
            color: COLORS.textPrimary,
            borderColor: COLORS.border,
          }}
        >
          Create New Barcode Rate
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {barcodeFormFields.map((col) => (
            <div key={col.key} className="col-span-1">
              <label
                htmlFor={col.key}
                className="block text-sm font-medium mb-1"
                style={{ color: COLORS.textSecondary }}
              >
                {col.label}
                {col.required && (
                  <span style={{ color: COLORS.danger }}>*</span>
                )}
              </label>
              <input
                id={col.key}
                type={col.type}
                name={col.key}
                value={formData[col.key as keyof BarcodeRateFormData] || ""}
                onChange={handleChange}
                // Applied Theme Focus Ring
                className={`w-full p-2.5 border rounded-lg focus:ring-2 shadow-sm outline-none transition-all focus:ring-[${COLORS.primary}]`}
                style={{
                  borderColor: COLORS.border,
                  color: COLORS.textPrimary,
                }}
                required={col.required}
              />
            </div>
          ))}
          <div
            className="col-span-full flex justify-end space-x-3 pt-4 border-t mt-4"
            style={{ borderColor: COLORS.border }}
          >
            <button
              type="button"
              onClick={onClose}
              // Applied Neutral Hover
              className={`px-5 py-2.5 rounded-lg transition font-medium bg-gray-100 hover:bg-[${COLORS.neutralHover}]`}
              style={{ color: COLORS.textPrimary }}
            >
              Cancel
            </button>
            <button
              type="submit"
              // Applied Primary Hover
              className={`px-5 py-2.5 rounded-lg transition font-medium shadow-md text-white hover:bg-[${COLORS.primaryHover}]`}
              style={{ backgroundColor: COLORS.primary }}
            >
              Add Rate
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
  rowData: BarcodeRateData | null;
  onUpdate: (data: BarcodeRateData) => void;
}

const EditBarcodeRateModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  rowData,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<BarcodeRateData | {}>({});

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
    const updatedData = formData as BarcodeRateData;

    if (
      !updatedData.itemName ||
      !updatedData.rate ||
      !updatedData.barcode ||
      !updatedData.effectiveFrom
    ) {
      alert("Please fill in all required fields.");
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
        <h2
          className="text-2xl font-semibold mb-6 border-b pb-2"
          style={{
            color: COLORS.textPrimary,
            borderColor: COLORS.border,
          }}
        >
          Edit Barcode Rate: {rowData?.itemName}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {barcodeFormFields.map((col) => (
            <div key={col.key} className="col-span-1">
              <label
                htmlFor={col.key}
                className="block text-sm font-medium mb-1"
                style={{ color: COLORS.textSecondary }}
              >
                {col.label}
                {col.required && (
                  <span style={{ color: COLORS.danger }}>*</span>
                )}
              </label>
              <input
                id={col.key}
                type={col.type}
                name={col.key}
                value={
                  (formData as BarcodeRateData)[
                    col.key as keyof BarcodeRateData
                  ] || ""
                }
                onChange={handleChange}
                // Applied Theme Focus Ring
                className={`w-full p-2.5 border rounded-lg focus:ring-2 shadow-sm outline-none transition-all focus:ring-[${COLORS.primary}]`}
                style={{
                  borderColor: COLORS.border,
                  color: COLORS.textPrimary,
                }}
                required={col.required}
              />
            </div>
          ))}
          <div
            className="col-span-full flex justify-end space-x-3 pt-4 border-t mt-4"
            style={{ borderColor: COLORS.border }}
          >
            <button
              type="button"
              onClick={onClose}
              // Applied Neutral Hover
              className={`px-5 py-2.5 rounded-lg transition font-medium bg-gray-100 hover:bg-[${COLORS.neutralHover}]`}
              style={{ color: COLORS.textPrimary }}
            >
              Cancel
            </button>
            <button
              type="submit"
              // Applied Primary Hover
              className={`px-5 py-2.5 rounded-lg transition font-medium shadow-md text-white hover:bg-[${COLORS.primaryHover}]`}
              style={{ backgroundColor: COLORS.primary }}
            >
              Update Rate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- 3. MAIN COMPONENT ---

export default function UpdateBarcodeRate() {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingRow, setEditingRow] = useState<BarcodeRateData | null>(null);

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
  } = useTableLogicMock(initialBarcodeRatesData, initialPageSize);

  const isSelected = (row: BarcodeRateData) => selectedRows.includes(row.id);

  const handleSelectRow = (row: BarcodeRateData) => {
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

  const handleAddBarcodeRate = (newData: BarcodeRateFormData) => {
    const newId = data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    const newEntry: BarcodeRateData = {
      ...newData,
      id: newId,
      sNo: data.length + 1,
    };
    setData((prev) => [...prev, newEntry]);
  };

  const handleUpdateBarcodeRate = (updatedData: BarcodeRateData) => {
    setData((prevData) =>
      prevData.map((row) => (row.id === updatedData.id ? updatedData : row))
    );
  };

  const handleOpenEditModal = (row: BarcodeRateData) => {
    setEditingRow({ ...row });
    setIsEditModalOpen(true);
  };

  const handleDelete = (row: BarcodeRateData) => {
    if (
      window.confirm(
        `Are you sure you want to delete rate for: ${row.itemName}?`
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
      <div
        className="bg-white p-6 rounded-xl shadow-lg border w-full"
        style={{ borderColor: COLORS.border }}
      >
        {/* Control Panel */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            {/* Show Entries Dropdown */}
            <div
              className="flex items-center text-sm"
              style={{ color: COLORS.textSecondary }}
            >
              Show
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                // Applied Theme Focus Ring
                className={`mx-2 p-1 border rounded-md focus:ring-2 outline-none appearance-none cursor-pointer focus:ring-[${COLORS.primary}]`}
                style={{
                  borderColor: COLORS.border,
                  color: COLORS.textPrimary,
                }}
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
                className="px-3 py-1.5 flex items-center text-white rounded-lg text-sm font-medium hover:opacity-90 transition shadow-sm"
                style={{ backgroundColor: COLORS.danger }}
              >
                <TrashIcon className="size-4 mr-1" />
                Bulk Delete ({selectedRows.length})
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <button
              onClick={() =>
                handlePrint("barcode-rate-table", "Update Barcode Rate")
              }
              // Applied Neutral Hover
              className={`p-2 border rounded-lg hover:bg-[${COLORS.neutralHover}] transition`}
              style={{
                borderColor: COLORS.border,
                color: COLORS.textSecondary,
              }}
              title="Print Table"
            >
              <PrintIcon className="size-5" />
            </button>
            <button
              onClick={() =>
                handleExport(
                  data,
                  barcodeRateColumns as unknown as ExportColumn[],
                  "BarcodeRates"
                )
              }
              // Applied Neutral Hover
              className={`p-2 border rounded-lg hover:bg-[${COLORS.neutralHover}] transition`}
              style={{
                borderColor: COLORS.border,
                color: COLORS.textSecondary,
              }}
              title="Export to XLSX"
            >
              <ExportIcon className="size-5" />
            </button>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search Item, Barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                // Applied Theme Focus Ring
                className={`w-full p-2.5 pl-10 border rounded-lg focus:ring-2 shadow-sm outline-none focus:ring-[${COLORS.primary}]`}
                style={{
                  borderColor: COLORS.border,
                  color: COLORS.textPrimary,
                }}
              />
              <SearchIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4"
                style={{ color: COLORS.textMuted }}
              />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              // Applied Primary Hover
              className={`px-3 py-2 flex items-center text-white text-sm font-medium hover:bg-[${COLORS.primaryHover}] transition shadow-md whitespace-nowrap rounded-lg`}
              style={{ backgroundColor: COLORS.primary }}
            >
              <PlusIcon className="size-4 mr-1" />
              Update Barcode Rate
            </button>
          </div>
        </div>

        <hr className="mb-4" style={{ borderColor: COLORS.border }} />

        {/* Table Section */}
        <div
          className="overflow-x-auto rounded-lg border"
          style={{ borderColor: COLORS.border }}
        >
          <table className="min-w-full table-fixed" id="barcode-rate-table">
            <thead>
              <tr
                className="bg-gray-50 text-left text-xs font-semibold uppercase border-b"
                style={{
                  color: COLORS.textPrimary,
                  borderColor: COLORS.border,
                }}
              >
                {/* Checkbox Column */}
                <th
                  className="p-4 w-10 no-print border-r border-dashed"
                  style={{
                    width: "40px",
                    borderColor: COLORS.borderDark,
                  }}
                >
                  <input
                    type="checkbox"
                    // Applied Theme Focus Ring
                    className={`rounded focus:ring-2 focus:ring-[${COLORS.primary}]`}
                    checked={areAllOnPageSelected}
                    onChange={handleSelectAll}
                  />
                </th>

                {/* Data Columns */}
                {barcodeRateColumns.map((col) => (
                  <th
                    key={col.key}
                    // Applied Neutral Hover on Sort
                    className={`p-4 relative whitespace-nowrap ${
                      col.sortable
                        ? `cursor-pointer hover:bg-[${COLORS.neutralHover}] transition duration-150`
                        : ""
                    } border-r border-dashed`}
                    style={{ borderColor: COLORS.borderDark }}
                    onClick={() =>
                      col.sortable &&
                      requestSort(col.key as keyof BarcodeRateData)
                    }
                  >
                    <span className="flex items-center whitespace-nowrap">
                      {col.label}
                      {col.sortable &&
                        renderSortIndicator(col.key as keyof BarcodeRateData)}
                    </span>
                  </th>
                ))}
                {/* Actions Column */}
                <th
                  className="p-4 text-center whitespace-nowrap no-print border-r border-dashed"
                  style={{
                    width: "100px",
                    borderColor: COLORS.borderDark,
                  }}
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
                    // Applied Row Hover
                    className={`border-t hover:bg-[${COLORS.rowHover}] transition duration-150`}
                    style={{
                      borderColor: COLORS.border,
                      color: COLORS.textPrimary,
                    }}
                  >
                    {/* Checkbox Cell */}
                    <td
                      className="p-4 w-10 no-print border-r"
                      style={{
                        width: "40px",
                        borderColor: COLORS.border,
                      }}
                    >
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={isSelected(row)}
                        onChange={() => handleSelectRow(row)}
                      />
                    </td>

                    {/* Data Cells */}
                    {barcodeRateColumns.map((col) => (
                      <td
                        key={col.key}
                        className="p-4 whitespace-nowrap overflow-hidden text-ellipsis border-r"
                        style={{ borderColor: COLORS.border }}
                      >
                        {row[col.key]}
                      </td>
                    ))}

                    {/* Actions Cell */}
                    <td
                      className="p-4 text-center space-x-2 whitespace-nowrap no-print border-r"
                      style={{
                        width: "100px",
                        borderColor: COLORS.border,
                      }}
                    >
                      <button
                        onClick={() => handleOpenEditModal(row)}
                        // Applied Neutral Hover
                        className={`p-1.5 rounded-full hover:bg-[${COLORS.neutralHover}] transition`}
                        style={{ color: COLORS.primary }}
                        aria-label="Edit"
                        title="Edit"
                      >
                        <EditIcon className="size-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(row)}
                        // Applied Neutral Hover
                        className={`p-1.5 rounded-full hover:bg-[${COLORS.neutralHover}] transition`}
                        style={{ color: COLORS.danger }}
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
                    colSpan={barcodeRateColumns.length + 2}
                    className="p-8 text-center text-lg"
                    style={{ color: COLORS.textMuted }}
                  >
                    No matching items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
          <div className="text-sm" style={{ color: COLORS.textSecondary }}>
            Showing {startEntry} to {endEntry} of {sortedDataLength} entries.
            (Total Pages: {totalPages})
          </div>

          <div className="flex space-x-2 items-center justify-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 border ${
                currentPage === 1
                  ? "bg-gray-100 cursor-not-allowed"
                  : "bg-white"
              }`}
              style={{
                borderColor: COLORS.border,
                color:
                  currentPage === 1 ? COLORS.textMuted : COLORS.textPrimary,
              }}
            >
              Previous
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 border shadow-sm ${
                  currentPage !== page
                    ? `hover:bg-[${COLORS.primaryLight}]`
                    : ""
                }`}
                style={
                  currentPage === page
                    ? {
                        backgroundColor: COLORS.primary,
                        color: COLORS.white,
                        borderColor: COLORS.primary,
                      }
                    : {
                        backgroundColor: COLORS.white,
                        color: COLORS.textPrimary,
                        borderColor: COLORS.border,
                      }
                }
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage >= totalPages}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 border ${
                currentPage >= totalPages
                  ? "bg-gray-100 cursor-not-allowed"
                  : "bg-white"
              }`}
              style={{
                borderColor: COLORS.border,
                color:
                  currentPage >= totalPages
                    ? COLORS.textMuted
                    : COLORS.textPrimary,
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ADD POPUP */}
      <AddBarcodeRateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddBarcodeRate}
      />

      {/* EDIT POPUP */}
      <EditBarcodeRateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        rowData={editingRow}
        onUpdate={handleUpdateBarcodeRate}
      />
    </>
  );
}
