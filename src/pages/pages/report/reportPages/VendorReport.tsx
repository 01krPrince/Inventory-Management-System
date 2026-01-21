import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Search,
  Edit3,
  Trash2,
  Printer,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

// --- API & COMPONENT IMPORTS ---
import CrudVendor from "../../purchase/vendor/pages/AddNewVendor";
import {
  getAllVendors,
  deleteVendor,
} from "../../purchase/vendor/api/vendorService";

import {
  handleExport,
  handlePrint,
} from "../../../../components/function/functions";

// --- EXPORT COLUMN DEFINITIONS ---
const ReportColumns = [
  { key: "code", label: "Vendor Code" },
  { key: "vend_name", label: "Vendor Name" },
  { key: "gst_no", label: "GSTIN" },
  { key: "gst", label: "GST Type" },
  { key: "under_ledger", label: "Ledger Group" },
  { key: "registration_date", label: "Reg. Date" },
];

// --- INTERFACE ---
interface Vendor {
  _id: string;
  vend_name: string;
  print_name?: string;
  gst_no?: string;
  identification?: string;
  code: string;
  under_ledger?: string | { _id: string; name: string };
  gst?: string;
  registration_date?: string;
  [key: string]: any;
}

const VendorReport = () => {
  // --- STATE MANAGEMENT ---
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Form Control States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Vendor | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllVendors();
      setVendors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Vendor Report Load Error:", err);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  // --- ACTION HANDLERS ---
  const handleEditClick = (row: Vendor) => {
    setEditingRow(row);
    setIsFormOpen(true);
  };

  const handleDelete = async (row: Vendor) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete Vendor: ${row.vend_name}?`,
    );

    if (!confirmDelete) return;

    try {
      await deleteVendor(row._id);
      // Immediate local state update
      setVendors((prev) => prev.filter((v) => v._id !== row._id));
      alert("Vendor record deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete vendor. Please try again.");
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRow(null);
  };

  const handleFormSuccess = () => {
    fetchData();
    handleCloseForm();
  };

  // --- SEARCH & STABLE PAGINATION LOGIC ---
  const filteredData = useMemo(() => {
    return vendors.filter((v) =>
      [v.vend_name, v.code, v.gst_no, v.identification].some((val) =>
        String(val || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    );
  }, [vendors, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Sync page if search reduces record count
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  // --- UI COMPONENTS ---
  const TableHeader = ({ label }: { label: string }) => (
    <th className="px-3 py-2 text-[11px] font-bold uppercase text-gray-500 tracking-tight border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10">
      {label}
    </th>
  );

  // --- RENDERING ---

  if (isFormOpen) {
    return (
      <div className="bg-transparent rounded-xl">
        <CrudVendor
          onClose={handleCloseForm}
          initialData={editingRow}
          onSuccess={handleFormSuccess}
        />
      </div>
    );
  }

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-2">
        <Loader2 className="animate-spin text-[#0c5888]" size={32} />
        <span className="text-sm text-gray-500 font-medium">
          Compiling Vendor Audit...
        </span>
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col h-full">
      {/* --- TOOLBAR --- */}
      <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <FileText className="text-[#0c5888] size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800 dark:text-white leading-none">
              Vendor Master Report
            </h2>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-1 block">
              Internal Audit Only
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search code, name, GST..."
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-[#0c5888] outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button
            onClick={() => handlePrint("report-table", "Vendor Report")}
            className="p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-sm"
            title="Print Report"
          >
            <Printer size={16} className="text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() =>
              handleExport(filteredData, ReportColumns, "Vendor_Report")
            }
            className="p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-sm"
            title="Export to Excel"
          >
            <Download size={16} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* --- HIGH-DENSITY TABLE --- */}
      <div className="overflow-x-auto flex-1 max-h-[650px]">
        <table className="w-full border-collapse text-left" id="report-table">
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr>
              <TableHeader label="Code" />
              <TableHeader label="Vendor Name" />
              <TableHeader label="GSTIN / ID" />
              <TableHeader label="GST Type" />
              <TableHeader label="Ledger" />
              <TableHeader label="Reg. Date" />
              <th className="px-3 py-2 text-right border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-[11px] font-bold text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr
                  key={row._id || Math.random()}
                  className="hover:bg-blue-50/30 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <td className="px-3 py-2 text-sm font-mono text-[#0c5888] font-bold">
                    {row.code || "---"}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {row.vend_name || "N/A"}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-500 font-mono">
                    {row.gst_no || row.identification || "N/A"}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${
                        row.gst === "Regular"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {row.gst || "UNREGISTERED"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-500 italic">
                    {row.under_ledger && typeof row.under_ledger === "object"
                      ? row.under_ledger.name
                      : row.under_ledger || "Sundry Creditors"}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-500">
                    {row.registration_date
                      ? new Date(row.registration_date).toLocaleDateString(
                          "en-GB",
                        )
                      : "---"}
                  </td>
                  <td className="px-3 py-2 text-right flex justify-end gap-1">
                    <button
                      onClick={() => handleEditClick(row)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all"
                      title="Edit"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(row)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-20 text-center text-gray-400 text-sm"
                >
                  No vendors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER --- */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <div className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
          Total Records:{" "}
          <span className="text-gray-800 dark:text-gray-200">
            {filteredData.length}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="p-1 rounded-md border bg-white disabled:opacity-30 shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border rounded-md shadow-sm text-xs font-bold">
              <span className="text-[#0c5888]">{currentPage}</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-600 dark:text-gray-400">
                {totalPages || 1}
              </span>
            </div>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="p-1 rounded-md border bg-white disabled:opacity-30 shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="text-[11px] font-bold border rounded-md px-2 py-1 bg-white outline-none shadow-sm cursor-pointer"
          >
            {[10, 25, 50, 100].map((val) => (
              <option key={val} value={val}>
                Show {val}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default VendorReport;
