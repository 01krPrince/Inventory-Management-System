import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Printer, Download, Loader2 } from 'lucide-react';
import {
  getAllSalesInvoices,
  SalesInvoiceData,
} from '../../../sales/salesInvoice/salesInvoiceService';
import { handleExport, handlePrint } from '../../../../../components/function/functions'; // Adjust path as needed

// Columns for Export
const ReportColumns = [
  { key: 'invoiceNo', label: 'Invoice No' },
  { key: 'date', label: 'Date' },
  { key: 'customer', label: 'Customer' },
  { key: 'store', label: 'Store' },
  { key: 'description', label: 'Item' },
  { key: 'quantity', label: 'Qty' },
  { key: 'rate', label: 'Rate' },
  { key: 'amount', label: 'Amount' },
];

const SalesInvoiceReport = () => {
  const [invoices, setInvoices] = useState<SalesInvoiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isPrinting, setIsPrinting] = useState(false);
  const [prePrintRows, setPrePrintRows] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Direct call since we imported the function directly
      const response = await getAllSalesInvoices();
      setInvoices(
        response && response.success && Array.isArray(response.data) ? response.data : []
      );
    } catch {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  // --- FILTER LOGIC ---
  const filteredData = useMemo(() => {
    return invoices.filter((inv) => {
      const basicMatch = [inv.invoiceNo, inv.customer, inv.store].some((val) =>
        String(val || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      const itemMatch = inv.items.some((item) =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return basicMatch || itemMatch;
    });
  }, [invoices, searchTerm]);

  // --- PAGINATION ---
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  // --- PRINT LOGIC ---
  useEffect(() => {
    if (isPrinting && paginatedData.length === filteredData.length) {
      const timer = setTimeout(() => {
        handlePrint('sales-report-table', 'Sales Invoice Master Report');
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

  // --- EXPORT LOGIC ---
  const handleExportRequest = () => {
    const flatData = filteredData.flatMap((inv) =>
      inv.items.map((item) => ({
        invoiceNo: inv.invoiceNo,
        date: new Date(inv.date).toLocaleDateString('en-GB'),
        customer: inv.customer,
        store: inv.store,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
      }))
    );
    handleExport(flatData, ReportColumns, 'Sales_Invoice_Report');
  };

  const TableHeader = ({
    label,
    align = 'left',
    width,
  }: {
    label: string;
    align?: 'left' | 'right' | 'center';
    width?: string;
  }) => (
    <th
      className={`sticky top-0 z-10 border-b bg-gray-50 px-3 py-2 text-[11px] font-bold uppercase text-gray-500 text-${align} ${width}`}>
      {label}
    </th>
  );

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-[#0c5888]" />
      </div>
    );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b bg-white p-3">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <FileText className="text-[#0c5888]" /> Sales Invoice Report
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            className="rounded border px-3 py-1.5 text-sm"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handlePrintRequest}
            className="flex items-center gap-1 rounded border p-2 text-xs font-semibold hover:bg-gray-50">
            <Printer size={16} /> Print All
          </button>
          <button onClick={handleExportRequest} className="rounded border p-2 hover:bg-gray-50">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full border-collapse text-left" id="sales-report-table">
          <thead>
            <tr>
              <TableHeader label="Invoice No" width="w-[10%]" />
              <TableHeader label="Date" width="w-[10%]" />
              <TableHeader label="Customer" width="w-[15%]" />
              <TableHeader label="Store" width="w-[10%]" />
              <TableHeader label="Item" width="w-[30%]" />
              <TableHeader label="Qty" align="right" width="w-[8%]" />
              <TableHeader label="Rate" align="right" width="w-[8%]" />
              <TableHeader label="Amount" align="right" width="w-[9%]" />
            </tr>
          </thead>
          <tbody className="text-sm">
            {paginatedData.map((inv, invIndex) => {
              // Calculate Total Qty for this Invoice
              const invoiceTotalQty = inv.items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <React.Fragment key={inv._id || invIndex}>
                  {/* --- Items Loop --- */}
                  {inv.items.map((item, itemIndex) => {
                    const isFirstItem = itemIndex === 0;

                    return (
                      <tr
                        key={`${inv._id}-${item.itemCode}-${itemIndex}`}
                        className="border-none transition-colors hover:bg-blue-50/30">
                        {/* Basic Details (Only on first row) */}
                        <td className="px-3 py-2 align-top font-mono font-bold text-[#0c5888]">
                          {isFirstItem ? inv.invoiceNo : ''}
                        </td>
                        <td className="px-3 py-2 align-top text-gray-500">
                          {isFirstItem ? new Date(inv.date).toLocaleDateString('en-GB') : ''}
                        </td>
                        <td className="px-3 py-2 align-top font-medium">
                          {isFirstItem ? inv.customer : ''}
                        </td>
                        <td className="px-3 py-2 align-top text-gray-500">
                          {isFirstItem ? inv.store : ''}
                        </td>

                        {/* Item Details */}
                        <td className="border-l border-dashed border-gray-100 px-3 py-2 text-gray-600">
                          {item.description}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {item.quantity} {item.unit || ''}
                        </td>
                        <td className="px-3 py-2 text-right text-xs text-gray-500">
                          {item.rate.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right font-medium text-gray-700">
                          {item.amount.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}

                  {/* --- Total Row for Invoice --- */}
                  <tr className="border-b border-t border-gray-300 bg-gray-100 text-xs font-bold">
                    {/* Empty Cells for Basic Details */}
                    <td colSpan={5}></td>

                    {/* Total Label */}
                    <td className="px-3 py-2 text-right uppercase tracking-wide text-gray-600">
                      Total:
                    </td>

                    {/* Total Values */}
                    <td className="px-3 py-2 text-right text-gray-800">{invoiceTotalQty}</td>
                    <td className="px-3 py-2 text-right text-sm text-green-700">
                      {/* Using grandTotal from invoice object for accuracy including taxes */}
                      {inv.grandTotal?.toFixed(2)}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between border-t bg-gray-50 p-3 text-xs">
        <span className="font-bold uppercase">Total Invoices: {filteredData.length}</span>
        <div className="flex items-center gap-3">
          <div className="font-bold">
            Page {currentPage} of {totalPages || 1}
          </div>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="ml-2 cursor-pointer rounded border px-1 py-1 text-[11px] font-bold outline-none">
            {[10, 25, 50, 100].map((val) => (
              <option key={val} value={val}>
                Show {val} Invoices
              </option>
            ))}
            <option value={filteredData.length}>Show All</option>
          </select>

          <div className="ml-2 flex gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="rounded border bg-white px-2 py-1 disabled:opacity-50">
              Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="rounded border bg-white px-2 py-1 disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesInvoiceReport;
