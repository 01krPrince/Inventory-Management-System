import { useState, useEffect, useMemo } from "react";
import {
  PlusIcon,
  TrashIcon,
  EditIcon,
  SearchIcon,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

import {
  handlePrint,
  handleExport,
  PrintIcon,
  ExportIcon,
} from "../../../../../components/function/functions.tsx";
import POSCouponMaster from "../../../../../components/POSCouponMaster.tsx";

// --- TYPE DEFINITIONS ---
interface Coupon {
  _id: string;
  codeNo: string;
  code: string;
  validUpTo: string;
  calculation: string;
  percentage: string;
  value: string;
  maxAmount: string;
  [key: string]: any;
}

export type DataItem = Coupon;

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

// --- COLUMN DEFINITIONS ---
const CouponColumns: Column[] = [
  { key: "codeNo", label: "Code No", sortable: true },
  { key: "code", label: "Code", sortable: true },
  { key: "validUpTo", label: "Valid Up To", sortable: true },
  { key: "calculation", label: "Calculation", sortable: true },
  { key: "percentage", label: "Percentage", sortable: true },
  { key: "value", label: "Value", sortable: true },
  { key: "maxAmount", label: "Max Amount", sortable: true },
];

const initialPageSize = 10;

export default function POSCoupon() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [, setEditingRow] = useState<DataItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState<DataItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DataItem | null;
    direction: "ascending" | "descending";
  }>({
    key: null,
    direction: "ascending",
  });

  // Mock Data
  const mockCoupons: Coupon[] = [
    {
      _id: "1",
      codeNo: "CPN-101",
      code: "SYS-001",
      validUpTo: "2025-12-31",
      calculation: "Percentage",
      percentage: "10%",
      value: "0",
      maxAmount: "500",
    },
    {
      _id: "2",
      codeNo: "SAVE50",
      code: "SYS-002",
      validUpTo: "2025-06-15",
      calculation: "Fixed",
      percentage: "N/A",
      value: "50",
      maxAmount: "50",
    },
    {
      _id: "3",
      codeNo: "FESTIVE25",
      code: "SYS-003",
      validUpTo: "2025-11-20",
      calculation: "Percentage",
      percentage: "25%",
      value: "0",
      maxAmount: "1000",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setApiData(mockCoupons);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Filtering and Sorting Logic
  const filteredAndSortedData = useMemo(() => {
    let result = apiData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key!];
        const bVal = b[sortConfig.key!];
        if (aVal < bVal) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [apiData, searchTerm, sortConfig]);

  const totalEntries = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalEntries / pageSize);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Sorting Handler
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending")
      direction = "descending";
    setSortConfig({ key: key as keyof DataItem, direction });
  };

  const handleAddNew = () => {
    setEditingRow(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (row: DataItem) => {
    setEditingRow(row);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRow(null);
  };

  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="relative w-full">
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <POSCouponMaster onClose={handleCloseForm} index={100} />
        </div>
      )}

      <div
        className={`transition-all duration-300 ${
          isFormOpen ? "blur-sm opacity-50 pointer-events-none" : ""
        }`}
      >
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Show</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="border rounded p-1 text-sm"
              >
                {[5, 10, 20, 50].map((sz) => (
                  <option key={sz} value={sz}>
                    {sz}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-500">entries</span>
            </div>

            <div className="flex items-center gap-3">
              {/* PRINT BUTTON */}
              <button
                onClick={() =>
                  handlePrint("printable-table", "Coupon Master Directory")
                }
                className="p-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                title="Print Table"
              >
                <PrintIcon className="size-5" />
              </button>

              {/* EXPORT BUTTON */}
              <button
                onClick={() =>
                  handleExport(
                    filteredAndSortedData,
                    CouponColumns,
                    "Coupon_Directory"
                  )
                }
                className="p-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                title="Export to CSV"
              >
                <ExportIcon className="size-5" />
              </button>

              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search coupons..."
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                onClick={handleAddNew}
                className="bg-[#0c5888] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#124463] flex items-center gap-1"
              >
                <PlusIcon size={16} /> Add New
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table
              className="min-w-full text-left text-sm"
              id="printable-table"
            >
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 w-12 no-print">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="p-4 font-semibold uppercase text-[11px]">
                    SNo.
                  </th>
                  {CouponColumns.map((col) => (
                    <th
                      key={col.key}
                      className="p-4 font-semibold text-gray-700 cursor-pointer uppercase text-[11px]"
                      onClick={() => col.sortable && requestSort(col.key)}
                    >
                      <div className="flex items-center">
                        {col.label}{" "}
                        {sortConfig.key === col.key &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp size={12} />
                          ) : (
                            <ChevronDown size={12} />
                          ))}
                      </div>
                    </th>
                  ))}
                  <th className="p-4 text-center no-print">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedData.map((row, idx) => (
                  <tr key={row._id} className="hover:bg-blue-50/30 transition">
                    <td className="p-4 no-print">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="p-4">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="p-4 font-medium text-blue-700">
                      {row.codeNo}
                    </td>
                    <td className="p-4">{row.code}</td>
                    <td className="p-4">{row.validUpTo}</td>
                    <td className="p-4">{row.calculation}</td>
                    <td className="p-4">{row.percentage}</td>
                    <td className="p-4">₹{row.value}</td>
                    <td className="p-4">₹{row.maxAmount}</td>
                    <td className="p-4 text-center no-print">
                      <button
                        onClick={() => handleEditClick(row)}
                        className="text-blue-600 hover:bg-blue-100 p-1.5 rounded-full"
                      >
                        <EditIcon size={16} />
                      </button>
                      <button className="text-red-600 hover:bg-red-100 p-1.5 rounded-full ml-2">
                        <TrashIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination UI */}
          <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
            <p>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalEntries)} of {totalEntries}{" "}
              entries
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
