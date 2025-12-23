import { useState, useEffect, useMemo } from "react";
import {
  PlusIcon,
  TrashIcon,
  EditIcon,
  SearchIcon,
  ChevronDown,
  ChevronUp,
  Loader2,
  Calendar, // Added for date icons
  Tag, // Added for name icon
  Hash, // Added for sequence icon
} from "lucide-react";

import {
  handlePrint,
  handleExport,
  PrintIcon,
  ExportIcon,
} from "../../../../../components/function/functions.tsx";

// Import your new CreateNewPromotion modal
import CreateNewPromotion from "../../../../../components/CreateNewPromotion.tsx";

// --- TYPE DEFINITIONS ---
interface PromotionData {
  _id: string;
  name: string;
  sequence: number; // Changed to number for sorting
  fromDate: string; // Using string for display simplicity
  toDate: string;
  [key: string]: any;
}

export type DataItem = PromotionData;

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  icon?: React.ElementType;
}

// --- COLUMN DEFINITIONS ---
// specific columns requested: Name, Sequence, From Date, To Date
const PromotionColumns: Column[] = [
  { key: "name", label: "Promotion Name", sortable: true, icon: Tag },
  { key: "sequence", label: "Sequence", sortable: true, icon: Hash },
  { key: "fromDate", label: "From Date", sortable: true, icon: Calendar },
  { key: "toDate", label: "To Date", sortable: true, icon: Calendar },
];

const initialPageSize = 10;

export default function Promotions() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [, setEditingRow] = useState<DataItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState<DataItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [currentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DataItem | null;
    direction: "ascending" | "descending";
  }>({
    key: null,
    direction: "ascending",
  });

  // --- Mock Data for Promotions ---
  const mockPromotions: PromotionData[] = [
    {
      _id: "1",
      name: "Winter Sale 2025",
      sequence: 1,
      fromDate: "2025-12-01",
      toDate: "2025-12-31",
    },
    {
      _id: "2",
      name: "New Year Blast",
      sequence: 2,
      fromDate: "2026-01-01",
      toDate: "2026-01-05",
    },
    {
      _id: "3",
      name: "Happy Hour Snacks",
      sequence: 3,
      fromDate: "2025-12-10",
      toDate: "2026-02-10",
    },
    {
      _id: "4",
      name: "BOGO T-Shirts",
      sequence: 10,
      fromDate: "2025-12-22",
      toDate: "2025-12-25",
    },
    {
      _id: "5",
      name: "Clearance 50%",
      sequence: 5,
      fromDate: "2025-11-01",
      toDate: "2025-11-30",
    },
  ];

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setApiData(mockPromotions);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // --- Filter & Sort Logic ---
  const filteredData = useMemo(() => {
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

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
      {/* FORM MODAL - Directly rendering CreateNewPromotion */}
      {/* It has its own fixed overlay, so we don't need a wrapper here */}
      {isFormOpen && <CreateNewPromotion onClose={handleCloseForm} />}

      {/* TABLE SECTION */}
      <div
        className={`transition-all duration-300 ${
          isFormOpen ? "blur-sm opacity-50 pointer-events-none" : ""
        }`}
      >
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="border rounded p-1 outline-none"
              >
                {[5, 10, 20].map((sz) => (
                  <option key={sz} value={sz}>
                    {sz}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  handlePrint("promotions-table", "Promotions Directory")
                }
                className="p-2 border rounded-lg hover:bg-gray-50 transition"
              >
                <PrintIcon className="size-5" />
              </button>
              <button
                onClick={() =>
                  handleExport(
                    filteredData,
                    PromotionColumns,
                    "Promotions_List"
                  )
                }
                className="p-2 border rounded-lg hover:bg-gray-50 transition"
              >
                <ExportIcon className="size-5" />
              </button>

              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search promotions..."
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                onClick={handleAddNew}
                className="bg-[#164e78] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#124463] flex items-center gap-1 shadow-sm transition-all active:scale-95"
              >
                <PlusIcon size={16} /> Add New
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border rounded-lg">
            <table
              className="min-w-full text-left text-sm"
              id="promotions-table"
            >
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 w-12 no-print">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="p-4 font-semibold uppercase text-[11px] text-gray-600">
                    S No.
                  </th>
                  {PromotionColumns.map((col) => {
                    const Icon = col.icon;
                    return (
                      <th
                        key={col.key}
                        className="p-4 font-semibold text-gray-600 uppercase text-[11px] cursor-pointer"
                        onClick={() =>
                          setSortConfig({
                            key: col.key as any,
                            direction:
                              sortConfig.direction === "ascending"
                                ? "descending"
                                : "ascending",
                          })
                        }
                      >
                        <div className="flex items-center gap-1">
                          {Icon && <Icon size={14} className="text-gray-400" />}
                          {col.label}
                          {sortConfig.key === col.key &&
                            (sortConfig.direction === "ascending" ? (
                              <ChevronUp size={12} className="ml-1" />
                            ) : (
                              <ChevronDown size={12} className="ml-1" />
                            ))}
                        </div>
                      </th>
                    );
                  })}
                  <th className="p-4 text-center no-print uppercase text-[11px] text-gray-600 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, idx) => (
                    <tr
                      key={row._id}
                      className="hover:bg-blue-50/40 transition-colors"
                    >
                      <td className="p-4 no-print">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="p-4 text-gray-500">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>

                      {/* Name */}
                      <td className="p-4 font-medium text-gray-800">
                        {row.name}
                      </td>

                      {/* Sequence */}
                      <td className="p-4 text-gray-600">{row.sequence}</td>

                      {/* From Date */}
                      <td className="p-4 text-gray-600">
                        <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs border border-green-100 whitespace-nowrap">
                          {row.fromDate}
                        </span>
                      </td>

                      {/* To Date */}
                      <td className="p-4 text-gray-600">
                        <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs border border-red-100 whitespace-nowrap">
                          {row.toDate}
                        </span>
                      </td>

                      <td className="p-4 text-center no-print">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(row)}
                            className="text-blue-600 p-1.5 hover:bg-blue-50 rounded-full transition-colors"
                          >
                            <EditIcon size={16} />
                          </button>
                          <button className="text-red-600 p-1.5 hover:bg-red-50 rounded-full transition-colors">
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      No promotions found. Click "Add New" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Info */}
          <div className="mt-4 text-xs text-gray-400 flex justify-between">
            <div>
              Showing {paginatedData.length} of {apiData.length} entries
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
