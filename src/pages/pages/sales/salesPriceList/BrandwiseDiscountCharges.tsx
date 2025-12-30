import React, { useState, useMemo } from "react";
// Assuming these imports exist from your original component's context
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
interface BrandDiscountData {
  id: number;
  sNo: number;
  description: string;
  effectiveFrom: string;
  rateOrCharge: string;
  [key: string]: string | number;
}

interface BrandDiscountColumn {
  key: keyof Omit<BrandDiscountData, "id" | "sNo"> | "sNo" | "id" | "actions";
  label: string;
  sortable: boolean;
}

interface ExportColumn {
  key: string;
  label: string;
  sortable: boolean;
  [key: string]: any;
}

interface SortConfig {
  key: keyof BrandDiscountData | null;
  direction: "ascending" | "descending";
}

// --- 1. MOCK DATA AND COLUMN DEFINITIONS ---

const initialBrandDiscountData: BrandDiscountData[] = [
  {
    id: 1,
    sNo: 1,
    description: "Brand X - Summer Clearance Discount",
    effectiveFrom: "2024-06-01",
    rateOrCharge: "10% Discount",
  },
  {
    id: 2,
    sNo: 2,
    description: "Brand Y - Premium Handling Charge",
    effectiveFrom: "2024-07-15",
    rateOrCharge: "5% Charge",
  },
  {
    id: 3,
    sNo: 3,
    description: "Brand Z - Volume Rebate",
    effectiveFrom: "2024-01-01",
    rateOrCharge: "2% Discount",
  },
];

const brandDiscountColumns: BrandDiscountColumn[] = [
  { key: "sNo", label: "S.No.", sortable: true },
  { key: "description", label: "Description", sortable: true },
  { key: "rateOrCharge", label: "Rate/Charge", sortable: false },
  { key: "effectiveFrom", label: "Effective From", sortable: true },
];

const pageSizeOptions = [5, 10, 20];
const initialPageSize = 5;

// Mock hook for table logic
const useTableLogicMock = (
  initialData: BrandDiscountData[],
  _columns: BrandDiscountColumn[],
  initialSize: number
) => {
  const [data, setData] = useState<BrandDiscountData[]>(initialData);
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
        const sortKey = sortConfig.key as keyof BrandDiscountData;
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

  const requestSort = (key: keyof BrandDiscountData) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const renderSortIndicator = (key: keyof BrandDiscountData) => {
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

type BrandDiscountFormData = Omit<BrandDiscountData, "id" | "sNo">;

const brandDiscountFormFields = [
  { key: "description", label: "Description", type: "text", required: true },
  {
    key: "effectiveFrom",
    label: "Effective From Date",
    type: "date",
    required: true,
  },
  {
    key: "rateOrCharge",
    label: "Rate / Charge (e.g., 5% Discount)",
    type: "text",
    required: true,
  },
];

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: BrandDiscountFormData) => void;
}

const AddBrandDiscountModal: React.FC<AddModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const initialData: BrandDiscountFormData = {
    description: "",
    effectiveFrom: "",
    rateOrCharge: "",
  };
  const [formData, setFormData] = useState<BrandDiscountFormData>(initialData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.description ||
      !formData.effectiveFrom ||
      !formData.rateOrCharge
    ) {
      alert(
        "Please fill in Description, Effective From Date, and Rate/Charge."
      );
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
        <h2
          className="text-2xl font-semibold mb-6 border-b pb-2"
          style={{
            color: COLORS.textPrimary,
            borderColor: COLORS.border,
          }}
        >
          Create New Brand Discount/Charge
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {brandDiscountFormFields.map((col) => (
            <div key={col.key} className="col-span-1">
              <label
                htmlFor={col.key}
                className="block text-sm font-medium mb-1"
                style={{ color: COLORS.textSecondary }}
              >
                {col.label}{" "}
                {col.required && (
                  <span style={{ color: COLORS.danger }}>*</span>
                )}
              </label>
              <input
                id={col.key}
                type={col.type}
                name={col.key}
                value={formData[col.key as keyof BrandDiscountFormData] || ""}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg focus:ring-2 shadow-sm outline-none transition-all"
                style={
                  {
                    borderColor: COLORS.border,
                    color: COLORS.textPrimary,
                    "--tw-ring-color": COLORS.primary,
                  } as React.CSSProperties
                }
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
              // Updated: Using COLORS.neutralHover
              className={`px-5 py-2.5 rounded-lg transition font-medium bg-gray-100 hover:bg-[${COLORS.neutralHover}]`}
              style={{ color: COLORS.textPrimary }}
            >
              Cancel
            </button>
            <button
              type="submit"
              // Updated: Using COLORS.primaryHover
              className={`px-5 py-2.5 rounded-lg transition font-medium shadow-md text-white hover:bg-[${COLORS.primaryHover}]`}
              style={{ backgroundColor: COLORS.primary }}
            >
              Create Entry
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
  rowData: BrandDiscountData | null;
  onUpdate: (data: BrandDiscountData) => void;
}

const EditBrandDiscountModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  rowData,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<BrandDiscountData | {}>({});

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
    const updatedData = formData as BrandDiscountData;

    if (
      !updatedData.description ||
      !updatedData.effectiveFrom ||
      !updatedData.rateOrCharge
    ) {
      alert(
        "Please fill in Description, Effective From Date, and Rate/Charge."
      );
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
          Edit Brand Discount/Charge: {rowData?.description}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {brandDiscountFormFields.map((col) => (
            <div key={col.key} className="col-span-1">
              <label
                htmlFor={col.key}
                className="block text-sm font-medium mb-1"
                style={{ color: COLORS.textSecondary }}
              >
                {col.label}{" "}
                {col.required && (
                  <span style={{ color: COLORS.danger }}>*</span>
                )}
              </label>
              <input
                id={col.key}
                type={col.type}
                name={col.key}
                value={
                  (formData as BrandDiscountData)[
                    col.key as keyof BrandDiscountData
                  ] || ""
                }
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg focus:ring-2 shadow-sm outline-none transition-all"
                style={
                  {
                    borderColor: COLORS.border,
                    color: COLORS.textPrimary,
                    "--tw-ring-color": COLORS.primary,
                  } as React.CSSProperties
                }
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
              // Updated: Using COLORS.neutralHover
              className={`px-5 py-2.5 bg-gray-100 rounded-lg hover:bg-[${COLORS.neutralHover}] transition font-medium`}
              style={{ color: COLORS.textPrimary }}
            >
              Cancel
            </button>
            <button
              type="submit"
              // Updated: Using COLORS.primaryHover
              className={`px-5 py-2.5 rounded-lg transition font-medium shadow-md text-white hover:bg-[${COLORS.primaryHover}]`}
              style={{ backgroundColor: COLORS.primary }}
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

export default function BrandwiseDiscountCharges() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<BrandDiscountData | null>(null);

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
  } = useTableLogicMock(
    initialBrandDiscountData,
    brandDiscountColumns,
    initialPageSize
  );

  const isSelected = (row: BrandDiscountData) => selectedRows.includes(row.id);

  const handleSelectRow = (row: BrandDiscountData) => {
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

  const handleAddBrandDiscount = (newDiscountData: BrandDiscountFormData) => {
    const newId = data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    const newSNo = data.length + 1;

    const newEntry = {
      ...newDiscountData,
      id: newId,
      sNo: newSNo,
    } as BrandDiscountData;

    setData((prev) => [...prev, newEntry]);
  };

  const handleUpdateBrandDiscount = (updatedData: BrandDiscountData) => {
    setData((prevData) =>
      prevData.map((row) => (row.id === updatedData.id ? updatedData : row))
    );
  };

  const handleOpenEditModal = (row: BrandDiscountData) => {
    setEditingRow({ ...row });
    setIsEditModalOpen(true);
  };

  const handleDelete = (row: BrandDiscountData) => {
    if (
      window.confirm(
        `Are you sure you want to delete entry for: ${row.description}?`
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
                className="mx-2 p-1 border rounded-md focus:ring-2 outline-none appearance-none cursor-pointer"
                style={
                  {
                    borderColor: COLORS.border,
                    color: COLORS.textPrimary,
                    "--tw-ring-color": COLORS.primary,
                  } as React.CSSProperties
                }
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
                handlePrint(
                  "brand-discount-table",
                  "Brandwise Discount/Charges"
                )
              }
              // Updated: Using COLORS.neutralHover
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
                  brandDiscountColumns as unknown as ExportColumn[],
                  "BrandDiscounts"
                )
              }
              // Updated: Using COLORS.neutralHover
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
                placeholder="Search all columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2.5 pl-10 border rounded-lg focus:ring-2 shadow-sm outline-none"
                style={
                  {
                    borderColor: COLORS.border,
                    color: COLORS.textPrimary,
                    "--tw-ring-color": COLORS.primary,
                  } as React.CSSProperties
                }
              />
              <SearchIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4"
                style={{ color: COLORS.textMuted }}
              />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              // Updated: Using COLORS.primaryHover
              className={`px-3 py-2 flex items-center text-white text-sm font-medium hover:bg-[${COLORS.primaryHover}] transition shadow-md whitespace-nowrap rounded-lg`}
              style={{ backgroundColor: COLORS.primary }}
            >
              <PlusIcon className="size-4 mr-1" />
              Create New
            </button>
          </div>
        </div>

        <hr className="mb-4" style={{ borderColor: COLORS.border }} />

        {/* Table Section */}
        <div
          className="overflow-x-auto rounded-lg border"
          style={{ borderColor: COLORS.border }}
        >
          <table className="min-w-full table-fixed" id="brand-discount-table">
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
                    className="rounded focus:ring-2"
                    checked={areAllOnPageSelected}
                    onChange={handleSelectAll}
                    style={
                      {
                        "--tw-ring-color": COLORS.primary,
                      } as React.CSSProperties
                    }
                  />
                </th>

                {/* Data Columns */}
                {brandDiscountColumns.map((col) => (
                  <th
                    key={col.key}
                    // Updated: Using COLORS.neutralHover for header hover
                    className={`p-4 relative whitespace-nowrap ${
                      col.sortable
                        ? `cursor-pointer hover:bg-[${COLORS.neutralHover}] transition duration-150`
                        : ""
                    } border-r border-dashed`}
                    style={{ borderColor: COLORS.borderDark }}
                    onClick={() =>
                      col.sortable &&
                      requestSort(col.key as keyof BrandDiscountData)
                    }
                  >
                    <span className="flex items-center whitespace-nowrap">
                      {col.label}
                      {col.sortable &&
                        renderSortIndicator(col.key as keyof BrandDiscountData)}
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
                    // Updated: Using COLORS.rowHover
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
                    {brandDiscountColumns.map((col) => (
                      <td
                        key={col.key}
                        className="p-4 whitespace-nowrap overflow-hidden text-ellipsis border-r"
                        style={{ borderColor: COLORS.border }}
                      >
                        {row[col.key as keyof BrandDiscountData]}
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
                        // Updated: Using COLORS.neutralHover
                        className={`p-1.5 rounded-full hover:bg-[${COLORS.neutralHover}] transition`}
                        style={{ color: COLORS.primary }}
                        aria-label="Edit"
                        title="Edit"
                      >
                        <EditIcon className="size-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(row)}
                        // Updated: Using COLORS.neutralHover
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
                    colSpan={brandDiscountColumns.length + 2}
                    className="p-8 text-center text-lg"
                    style={{ color: COLORS.textMuted }}
                  >
                    No matching brand discount or charge entries found. 🙁
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
      <AddBrandDiscountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddBrandDiscount}
      />

      {/* EDIT POPUP */}
      <EditBrandDiscountModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        rowData={editingRow}
        onUpdate={handleUpdateBrandDiscount}
      />
    </>
  );
}
