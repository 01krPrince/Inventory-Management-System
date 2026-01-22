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

// --- 1. UPDATED INTERFACE (Fixes mismatch errors in Image 4 and 7) ---
interface Vendor {
  _id: string;
  vend_name: string;
  print_name?: string;
  gst_no?: string | null; // Fixed: Allows null to match API return
  identification?: string | null;
  code: string;
  under_ledger?: string | { _id: string; name: string } | null;
  gst?: string | null; // Fixed: Matches API return
  registration_date?: string | null;
  [key: string]: any;
}

const ReportColumns = [
  { key: "code", label: "Vendor Code" },
  { key: "vend_name", label: "Vendor Name" },
  { key: "gst_no", label: "GSTIN" },
  { key: "gst", label: "GST Type" },
  { key: "under_ledger", label: "Ledger Group" },
  { key: "registration_date", label: "Reg. Date" },
];

const VendorReport = () => {
  // --- 2. FIXED TYPED STATE (Resolves 'never[]' error in Image 3) ---
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isPrinting, setIsPrinting] = useState(false);
  const [prePrintRows, setPrePrintRows] = useState(10);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Vendor | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllVendors();
      // FIXED: Properly typed cast to resolve Image 8 error
      setVendors(Array.isArray(data) ? (data as Vendor[]) : []);
    } catch (err) {
      console.error("Vendor Report Load Error:", err);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. SEARCH & STABLE PAGINATION LOGIC ---
  const filteredData = useMemo(() => {
    return vendors.filter((v) =>
      [v.vend_name, v.code, v.gst_no].some((val) =>
        String(val || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    );
  }, [vendors, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    if (rowsPerPage === -1) return filteredData;
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  // --- 4. PRINT ALL LOGIC (Fixed: Moved AFTER paginatedData declaration to resolve Image 9) ---
  useEffect(() => {
    if (isPrinting && paginatedData.length === filteredData.length) {
      const timer = setTimeout(() => {
        handlePrint("vendor-report-table", "Vendor Master Report");
        setIsPrinting(false);
        setRowsPerPage(prePrintRows);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPrinting, paginatedData.length, filteredData.length, prePrintRows]);

  const handlePrintRequest = () => {
    setPrePrintRows(rowsPerPage);
    setRowsPerPage(filteredData.length);
    setIsPrinting(true);
  };

  // --- ACTIONS ---
  const handleEditClick = (row: Vendor) => {
    setEditingRow(row);
    setIsFormOpen(true);
  };

  const handleDelete = async (row: Vendor) => {
    if (window.confirm(`Permanently delete Vendor: ${row.vend_name}?`)) {
      try {
        await deleteVendor(row._id);
        setVendors((prev) => prev.filter((v) => v._id !== row._id));
      } catch (error) {
        alert("Delete failed.");
      }
    }
  };

  const TableHeader = ({
    label,
    className = "",
  }: {
    label: string;
    className?: string;
  }) => (
    <th
      className={`px-3 py-2 text-[11px] font-bold uppercase text-gray-500 tracking-tight border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10 ${className}`}
    >
      {label}
    </th>
  );

  if (isFormOpen)
    return (
      <CrudVendor
        onClose={() => setIsFormOpen(false)}
        initialData={editingRow}
        onSuccess={() => {
          fetchData();
          setIsFormOpen(false);
        }}
      />
    );

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[#0c5888]" size={32} />
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col h-full">
      <div className="p-3 border-b flex flex-col md:flex-row justify-between items-center gap-3 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <FileText className="text-[#0c5888] size-5" />
          <h2 className="text-base font-bold text-gray-800 dark:text-white leading-tight">
            Vendor Master Report
          </h2>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-md"
              placeholder="Search code, name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button
            onClick={handlePrintRequest}
            className="p-2 border rounded hover:bg-gray-50 flex items-center gap-2 text-xs font-semibold text-gray-600"
          >
            <Printer size={16} /> Print All
          </button>
          <button
            onClick={() =>
              handleExport(filteredData, ReportColumns, "Vendor_Report")
            }
            className="p-2 border rounded hover:bg-gray-50 transition"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto flex-1 max-h-[600px]">
        <table
          className="w-full border-collapse text-left"
          id="vendor-report-table"
        >
          <thead>
            <tr>
              <TableHeader label="Code" />
              <TableHeader label="Vendor Name" />
              <TableHeader label="GSTIN" />
              <TableHeader label="Type" />
              <TableHeader label="Ledger" />
              <TableHeader label="Date" />
              {/* FIXED: Hides Actions in PDF */}
              <TableHeader label="Actions" className="no-print text-right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedData.map((row) => (
              <tr
                key={row._id || Math.random()}
                className="hover:bg-blue-50/30 transition-colors"
              >
                <td className="px-3 py-2 text-sm font-mono text-[#0c5888] font-bold">
                  {row.code || "---"}
                </td>
                <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {row.vend_name || "N/A"}
                </td>
                <td className="px-3 py-2 text-sm text-gray-500 font-mono">
                  {row.gst_no || "N/A"}
                </td>
                <td className="px-3 py-2 text-xs uppercase font-bold text-gray-400">
                  {row.gst || "---"}
                </td>
                <td className="px-3 py-2 text-sm text-gray-500 italic truncate max-w-[150px]">
                  {/* 5. DEFENSIVE RENDERING (Fixes Blank Page crash in Image 2) */}
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
                {/* FIXED: Hides Action buttons in PDF */}
                <td className="px-3 py-2 text-right flex justify-end gap-1 no-print">
                  <button
                    onClick={() => handleEditClick(row)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 transition-all"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(row)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION FOOTER */}
      <div className="p-3 bg-gray-50 border-t flex justify-between items-center text-xs">
        <span className="text-gray-500 font-bold uppercase">
          Records: {filteredData.length}
        </span>
        <div className="flex items-center gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-1 border rounded bg-white"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="font-bold">
            {currentPage} / {totalPages || 1}
          </div>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-1 border rounded bg-white"
          >
            <ChevronRight size={16} />
          </button>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="ml-2 text-[11px] font-bold border rounded px-1 py-1 outline-none cursor-pointer"
          >
            {[10, 25, 50, 100].map((val) => (
              <option key={val} value={val}>
                Show {val}
              </option>
            ))}
            <option value={filteredData.length}>Show All</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default VendorReport;
