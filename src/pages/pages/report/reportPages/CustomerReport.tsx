import { useState, useEffect, useMemo } from "react";
import {
  FileText,
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

interface Customer {
  _id: string;
  cust_name: string;
  code: string;
  gst_no?: string | null;
  under_ledger?: any;
  gst?: string | null;
  registration_date?: string | null;
  [key: string]: any;
}

const ReportColumns = [
  { key: "code", label: "Customer Code" },
  { key: "cust_name", label: "Customer Name" },
  { key: "gst_no", label: "GSTIN" },
  { key: "gst", label: "GST Type" },
  { key: "under_ledger", label: "Ledger Group" },
  { key: "registration_date", label: "Reg. Date" },
];

const CustomerReport = () => {
  const [customers, setCustomers] = useState<Customer[]>([]); // Typed fix
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isPrinting, setIsPrinting] = useState(false);
  const [prePrintRows, setPrePrintRows] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Customer | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllCustomers();
      setCustomers(Array.isArray(data) ? (data as Customer[]) : []);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (isPrinting && paginatedData.length === filteredData.length) {
      setTimeout(() => {
        handlePrint("customer-report-table", "Customer Master Report");
        setIsPrinting(false);
        setRowsPerPage(prePrintRows);
      }, 500);
    }
  }, [isPrinting, paginatedData.length, filteredData.length, prePrintRows]);

  const handlePrintRequest = () => {
    setPrePrintRows(rowsPerPage);
    setRowsPerPage(filteredData.length);
    setIsPrinting(true);
  };

  const TableHeader = ({
    label,
    className = "",
  }: {
    label: string;
    className?: string;
  }) => (
    <th
      className={`px-3 py-2 text-[11px] font-bold uppercase text-gray-500 border-b bg-gray-50 sticky top-0 z-10 ${className}`}
    >
      {label}
    </th>
  );

  if (isFormOpen)
    return (
      <CrudCustomer
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
      <div className="flex justify-center h-64 items-center">
        <Loader2 className="animate-spin text-[#0c5888]" />
      </div>
    );

  return (
    <div className="bg-white shadow-sm border rounded-lg overflow-hidden flex flex-col h-full">
      <div className="p-3 border-b flex justify-between items-center">
        <h2 className="text-base font-bold flex items-center gap-2">
          <FileText className="text-[#0c5888]" /> Customer Report
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            className="border rounded px-3 py-1.5 text-sm"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handlePrintRequest}
            className="p-2 border rounded flex items-center gap-1 text-xs font-semibold"
          >
            <Printer size={16} /> Print All
          </button>
          <button
            onClick={() =>
              handleExport(filteredData, ReportColumns, "Customer_Report")
            }
            className="p-2 border rounded hover:bg-gray-50"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto flex-1">
        <table
          className="w-full border-collapse text-left"
          id="customer-report-table"
        >
          <thead>
            <tr>
              <TableHeader label="Code" />
              <TableHeader label="Name" />
              <TableHeader label="GSTIN" />
              <TableHeader label="Ledger" />
              <TableHeader label="Date" />
              <TableHeader label="Actions" className="no-print text-right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.map((row) => (
              <tr
                key={row._id}
                className="hover:bg-blue-50/30 transition-colors"
              >
                <td className="px-3 py-2 text-sm font-mono font-bold text-[#0c5888]">
                  {row.code || "---"}
                </td>
                <td className="px-3 py-2 text-sm font-medium">
                  {row.cust_name}
                </td>
                <td className="px-3 py-2 text-sm text-gray-500">
                  {row.gst_no || "N/A"}
                </td>
                <td className="px-3 py-2 text-sm italic">
                  {row.under_ledger?.name ||
                    row.under_ledger ||
                    "Sundry Debtors"}
                </td>
                <td className="px-3 py-2 text-sm">
                  {row.registration_date
                    ? new Date(row.registration_date).toLocaleDateString(
                        "en-GB",
                      )
                    : "---"}
                </td>
                <td className="px-3 py-2 text-right flex justify-end gap-1 no-print">
                  <button
                    onClick={() => {
                      setEditingRow(row);
                      setIsFormOpen(true);
                    }}
                    className="p-1.5 text-gray-400 hover:text-blue-600"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm("Delete?")) {
                        await customerDeleteApi(row._id);
                        fetchData();
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-gray-50 border-t flex justify-between items-center text-xs">
        <span>Records: {filteredData.length}</span>
        <div className="flex gap-2 items-center">
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
            className="ml-2 border rounded px-1 py-1 font-bold"
          >
            {[10, 25, 50, 100].map((v) => (
              <option key={v} value={v}>
                Show {v}
              </option>
            ))}
            <option value={filteredData.length}>Show All</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CustomerReport;
