import { useState, useEffect, useMemo } from 'react';
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
} from 'lucide-react';

// --- API & COMPONENT IMPORTS ---
import CrudVendor from '../../../purchase/vendor/pages/AddNewVendor';
import { getAllVendors, deleteVendor } from '../../../purchase/vendor/api/vendorService';

import { handleExport, handlePrint } from '../../../../../components/function/functions';

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
  { key: 'code', label: 'Vendor Code' },
  { key: 'vend_name', label: 'Vendor Name' },
  { key: 'gst_no', label: 'GSTIN' },
  { key: 'gst', label: 'GST Type' },
  { key: 'under_ledger', label: 'Ledger Group' },
  { key: 'registration_date', label: 'Reg. Date' },
];

const VendorReport = () => {
  // --- 2. FIXED TYPED STATE (Resolves 'never[]' error in Image 3) ---
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
      console.error('Vendor Report Load Error:', err);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. SEARCH & STABLE PAGINATION LOGIC ---
  const filteredData = useMemo(() => {
    return vendors.filter((v) =>
      [v.vend_name, v.code, v.gst_no].some((val) =>
        String(val || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
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
        handlePrint('vendor-report-table', 'Vendor Master Report');
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
        alert('Delete failed.');
      }
    }
  };

  const TableHeader = ({ label, className = '' }: { label: string; className?: string }) => (
    <th
      className={`sticky top-0 z-10 border-b border-gray-200 bg-gray-50 px-3 py-2 text-[11px] font-bold uppercase tracking-tight text-gray-500 dark:border-gray-700 dark:bg-gray-800/50 ${className}`}>
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
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-[#0c5888]" size={32} />
      </div>
    );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-between gap-3 border-b bg-white p-3 md:flex-row dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <FileText className="size-5 text-[#0c5888]" />
          <h2 className="text-base font-bold leading-tight text-gray-800 dark:text-white">
            Vendor Master Report
          </h2>
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="w-full rounded-md border py-1.5 pl-8 pr-3 text-sm"
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
            className="flex items-center gap-2 rounded border p-2 text-xs font-semibold text-gray-600 hover:bg-gray-50">
            <Printer size={16} /> Print All
          </button>
          <button
            onClick={() => handleExport(filteredData, ReportColumns, 'Vendor_Report')}
            className="rounded border p-2 transition hover:bg-gray-50">
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="max-h-[600px] flex-1 overflow-x-auto">
        <table className="w-full border-collapse text-left" id="vendor-report-table">
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
              <tr key={row._id || Math.random()} className="transition-colors hover:bg-blue-50/30">
                <td className="px-3 py-2 font-mono text-sm font-bold text-[#0c5888]">
                  {row.code || '---'}
                </td>
                <td className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {row.vend_name || 'N/A'}
                </td>
                <td className="px-3 py-2 font-mono text-sm text-gray-500">{row.gst_no || 'N/A'}</td>
                <td className="px-3 py-2 text-xs font-bold uppercase text-gray-400">
                  {row.gst || '---'}
                </td>
                <td className="max-w-[150px] truncate px-3 py-2 text-sm italic text-gray-500">
                  {/* 5. DEFENSIVE RENDERING (Fixes Blank Page crash in Image 2) */}
                  {row.under_ledger && typeof row.under_ledger === 'object'
                    ? row.under_ledger.name
                    : row.under_ledger || 'Sundry Creditors'}
                </td>
                <td className="px-3 py-2 text-sm text-gray-500">
                  {row.registration_date
                    ? new Date(row.registration_date).toLocaleDateString('en-GB')
                    : '---'}
                </td>
                {/* FIXED: Hides Action buttons in PDF */}
                <td className="no-print flex justify-end gap-1 px-3 py-2 text-right">
                  <button
                    onClick={() => handleEditClick(row)}
                    className="p-1.5 text-gray-400 transition-all hover:text-blue-600">
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(row)}
                    className="p-1.5 text-gray-400 transition-all hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION FOOTER */}
      <div className="flex items-center justify-between border-t bg-gray-50 p-3 text-xs">
        <span className="font-bold uppercase text-gray-500">Records: {filteredData.length}</span>
        <div className="flex items-center gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="rounded border bg-white p-1">
            <ChevronLeft size={16} />
          </button>
          <div className="font-bold">
            {currentPage} / {totalPages || 1}
          </div>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="rounded border bg-white p-1">
            <ChevronRight size={16} />
          </button>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="ml-2 cursor-pointer rounded border px-1 py-1 text-[11px] font-bold outline-none">
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
