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

import CrudCustomer from "../../sales/customer/AddNewCustomer.tsx";
import {
  getAllCustomers,
  customerDeleteApi,
} from "../../../../services/sales/customer/customerService.ts";
import {
  handlePrint,
  handleExport,
} from "../../../../components/function/functions.tsx";

// --- EXPORT COLUMN DEFINITIONS ---
const ReportColumns = [
  { key: "code", label: "Customer Code" },
  { key: "cust_name", label: "Customer Name" },
  { key: "gst_no", label: "GSTIN" },
  { key: "gst", label: "GST Type" },
  { key: "under_ledger", label: "Ledger Group" },
  { key: "registration_date", label: "Reg. Date" },
];

interface Customer {
  _id: string;
  cust_name: string;
  code: string;
  gst_no?: string;
  identification?: string;
  under_ledger?: any;
  gst?: string;
  registration_date?: string;
  [key: string]: any;
}

const CustomerReport = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // View Control States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Customer | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Report Load Error:", err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // --- ACTION HANDLERS ---
  const handleEditClick = (row: Customer) => {
    setEditingRow(row);
    setIsFormOpen(true);
  };

  const handleDelete = async (row: Customer) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete Customer: ${row.cust_name}?`,
    );

    if (!confirmDelete) return;

    try {
      await customerDeleteApi(row._id);
      // Optimistic UI update: Remove from local state immediately
      setCustomers((prev) => prev.filter((c) => c._id !== row._id));
      alert("Customer record deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete customer. Please try again.");
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

  // --- SEARCH & PAGINATION ---
  const filteredData = useMemo(() => {
    return customers.filter((c) =>
      [c.cust_name, c.code, c.gst_no].some((val) =>
        String(val || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    );
  }, [customers, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const TableHeader = ({ label }: { label: string }) => (
    <th className="px-3 py-2 text-[11px] font-bold uppercase text-gray-500 tracking-tight border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10">
      {label}
    </th>
  );

  if (isFormOpen) {
    return (
      <CrudCustomer
        onClose={handleCloseForm}
        initialData={editingRow}
        onSuccess={handleFormSuccess}
      />
    );
  }

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#0c5888]" size={32} />
        <span className="text-xs text-gray-400 mt-2">
          Loading Report Data...
        </span>
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col h-full">
      {/* TOOLBAR */}
      <div className="p-3 border-b flex flex-col md:flex-row justify-between items-center gap-3 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <FileText className="text-[#0c5888] size-5" />
          <div>
            <h2 className="text-base font-bold text-gray-800 dark:text-white leading-tight">
              Customer Report
            </h2>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
              Master Audit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-md outline-none focus:ring-1 focus:ring-[#0c5888]"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button
            onClick={() => handlePrint("report-table", "Customer Report")}
            className="p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800"
            title="Print"
          >
            <Printer size={16} className="text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() =>
              handleExport(filteredData, ReportColumns, "Customer_Report")
            }
            className="p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800"
            title="Export to Excel"
          >
            <Download size={16} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto flex-1 max-h-[600px]">
        <table className="w-full border-collapse text-left" id="report-table">
          <thead>
            <tr>
              <TableHeader label="Code" />
              <TableHeader label="Customer Name" />
              <TableHeader label="GSTIN / ID" />
              <TableHeader label="Ledger" />
              <TableHeader label="Reg. Date" />
              <th className="px-3 py-2 text-right border-b border-gray-200 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr
                  key={row._id}
                  className="hover:bg-blue-50/30 dark:hover:bg-gray-800/40 transition-colors group"
                >
                  <td className="px-3 py-2 text-sm font-mono text-[#0c5888] font-bold">
                    {row.code || "---"}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {row.cust_name}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-500 font-mono">
                    {row.gst_no || "N/A"}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-500">
                    {row.under_ledger?.name ||
                      row.under_ledger ||
                      "Sundry Debtors"}
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
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
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
                  colSpan={6}
                  className="py-20 text-center text-gray-400 text-sm italic"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border-t flex justify-between items-center">
        <span className="text-[11px] text-gray-500 font-bold uppercase">
          Total Records: {filteredData.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="p-1 border rounded bg-white disabled:opacity-30 shadow-sm"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="text-xs font-bold px-3 text-gray-600">
            {currentPage} / {totalPages || 1}
          </div>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="p-1 border rounded bg-white disabled:opacity-30 shadow-sm"
          >
            <ChevronRight size={16} />
          </button>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="ml-2 text-[11px] font-bold border rounded px-1 py-1 outline-none"
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

export default CustomerReport;
