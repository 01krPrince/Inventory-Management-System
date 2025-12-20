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

// Humare existing Master Modal ko import karenge
import LoyaltyCardMaster from "../../../../../components/LoyaltyCardMaster.tsx";

// --- TYPE DEFINITIONS ---
interface LoyaltyCardData {
  _id: string;
  code: string;
  name: string;
  type: string; // e.g., Gold, Silver, Platinum
  description?: string;
  [key: string]: any;
}

export type DataItem = LoyaltyCardData;

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

// --- COLUMN DEFINITIONS ---
const LoyaltyColumns: Column[] = [
  { key: "code", label: "Code", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "type", label: "Type", sortable: true },
];

const initialPageSize = 10;

export default function LoyaltyCard() {
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

  // Mock Data for Loyalty Cards
  const mockLoyaltyCards: LoyaltyCardData[] = [
    { _id: "1", code: "LC-GOLD", name: "Gold Membership", type: "Tier 1" },
    { _id: "2", code: "LC-SILV", name: "Silver Plus", type: "Tier 2" },
    { _id: "3", code: "LC-PLAT", name: "Platinum Executive", type: "Premium" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setApiData(mockLoyaltyCards);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter & Sort Logic
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

  // const totalEntries = filteredData.length;
  // const totalPages = Math.ceil(totalEntries / pageSize);
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
      {/* FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <LoyaltyCardMaster onClose={handleCloseForm} index={100} />
        </div>
      )}

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
                  handlePrint("loyalty-table", "Loyalty Card Directory")
                }
                className="p-2 border rounded-lg hover:bg-gray-50 transition"
              >
                <PrintIcon className="size-5" />
              </button>
              <button
                onClick={() =>
                  handleExport(filteredData, LoyaltyColumns, "Loyalty_Cards")
                }
                className="p-2 border rounded-lg hover:bg-gray-50 transition"
              >
                <ExportIcon className="size-5" />
              </button>

              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search loyalty cards..."
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                onClick={handleAddNew}
                className="bg-[#0c5888] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#124463] flex items-center gap-1 shadow-sm transition-all active:scale-95"
              >
                <PlusIcon size={16} /> Add New
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-left text-sm" id="loyalty-table">
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
                  {LoyaltyColumns.map((col) => (
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
                      <div className="flex items-center">
                        {col.label}
                        {sortConfig.key === col.key &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp size={12} className="ml-1" />
                          ) : (
                            <ChevronDown size={12} className="ml-1" />
                          ))}
                      </div>
                    </th>
                  ))}
                  <th className="p-4 text-center no-print uppercase text-[11px] text-gray-600 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.map((row, idx) => (
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
                    <td className="p-4 font-medium text-gray-800">
                      {row.code}
                    </td>
                    <td className="p-4 text-blue-700 font-medium">
                      {row.name}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full text-[12px]">
                        {row.type}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
