import { useState, useEffect, useMemo } from "react";
import { FileText, Printer, Download, Loader2 } from "lucide-react";
import React from "react";
import purchaseBillService, {
  PurchaseBillData,
} from "../../../../services/purchase/purchaseBill";
import {
  handleExport,
  handlePrint,
} from "../../../../components/function/functions";

// Columns for Export
const ReportColumns = [
  { key: "billNo", label: "Bill No" },
  { key: "billDate", label: "Date" },
  { key: "vendor", label: "Vendor" },
  { key: "store", label: "Store" },
  { key: "description", label: "Item" },
  { key: "quantity", label: "Qty" },
  { key: "amount", label: "Amount" },
];

const PurchaseBillReport = () => {
  const [bills, setBills] = useState<PurchaseBillData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
      const response = await purchaseBillService.getAllPurchaseBills();
      setBills(
        response && response.success && Array.isArray(response.data)
          ? response.data
          : [],
      );
    } catch {
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  // --- FILTER LOGIC ---
  const filteredData = useMemo(() => {
    return bills.filter((b) => {
      const basicMatch = [b.billNo, b.vendor, b.store].some((val) =>
        String(val || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      );
      const itemMatch = b.items.some((item) =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      return basicMatch || itemMatch;
    });
  }, [bills, searchTerm]);

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
        handlePrint("purchase-report-table", "Purchase Bill Master Report");
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
    const flatData = filteredData.flatMap((bill) =>
      bill.items.map((item) => ({
        billNo: bill.billNo,
        billDate: new Date(bill.billDate).toLocaleDateString("en-GB"),
        vendor: bill.vendor,
        store: bill.store,
        description: item.description,
        quantity: item.quantity,
        amount: item.amount,
      })),
    );
    handleExport(flatData, ReportColumns, "Purchase_Bill_Report");
  };

  const TableHeader = ({
    label,
    align = "left",
    width,
  }: {
    label: string;
    align?: "left" | "right" | "center";
    width?: string;
  }) => (
    <th
      className={`px-3 py-2 text-[11px] font-bold uppercase text-gray-500 border-b bg-gray-50 sticky top-0 z-10 text-${align} ${width}`}
    >
      {label}
    </th>
  );

  if (loading)
    return (
      <div className="flex justify-center h-64 items-center">
        <Loader2 className="animate-spin text-[#0c5888]" />
      </div>
    );

  return (
    <div className="bg-white shadow-sm border rounded-lg overflow-hidden flex flex-col h-full">
      {/* Header Section */}
      <div className="p-3 border-b flex justify-between items-center bg-white">
        <h2 className="text-base font-bold flex items-center gap-2">
          <FileText className="text-[#0c5888]" /> Purchase Bill Report
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
            className="p-2 border rounded hover:bg-gray-50 flex items-center gap-1 text-xs font-semibold"
          >
            <Printer size={16} /> Print All
          </button>
          <button
            onClick={handleExportRequest}
            className="p-2 border rounded hover:bg-gray-50"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto flex-1">
        <table
          className="w-full border-collapse text-left"
          id="purchase-report-table"
        >
          <thead>
            <tr>
              <TableHeader label="Bill No" width="w-[10%]" />
              <TableHeader label="Date" width="w-[10%]" />
              <TableHeader label="Vendor" width="w-[15%]" />
              <TableHeader label="Store" width="w-[15%]" />
              <TableHeader label="Item Description" width="w-[30%]" />
              <TableHeader label="Qty" align="right" width="w-[10%]" />
              <TableHeader label="Amount" align="right" width="w-[10%]" />
            </tr>
          </thead>
          <tbody className="text-sm">
            {paginatedData.map((bill, billIndex) => {
              // Calculate Totals for this Bill
              const billTotalQty = bill.items.reduce(
                (sum, item) => sum + item.quantity,
                0,
              );
              const billTotalAmount = bill.items.reduce(
                (sum, item) => sum + item.amount,
                0,
              );

              return (
                <React.Fragment key={bill._id || billIndex}>
                  {/* --- Items Loop --- */}
                  {bill.items.map((item, itemIndex) => {
                    const isFirstItem = itemIndex === 0;

                    return (
                      <tr
                        key={`${bill._id}-${item.itemcode}-${itemIndex}`}
                        className="hover:bg-blue-50/30 transition-colors border-none"
                      >
                        {/* Basic Details (Only on first row) */}
                        <td className="px-3 py-2 font-mono font-bold text-[#0c5888] align-top">
                          {isFirstItem ? bill.billNo : ""}
                        </td>
                        <td className="px-3 py-2 text-gray-500 align-top">
                          {isFirstItem
                            ? new Date(bill.billDate).toLocaleDateString(
                                "en-GB",
                              )
                            : ""}
                        </td>
                        <td className="px-3 py-2 font-medium align-top">
                          {isFirstItem ? bill.vendor : ""}
                        </td>
                        <td className="px-3 py-2 text-gray-500 align-top">
                          {isFirstItem ? bill.store : ""}
                        </td>

                        {/* Item Details */}
                        <td className="px-3 py-2 text-gray-600 border-l border-dashed border-gray-100">
                          {item.description}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="px-3 py-2 font-medium text-gray-700 text-right">
                          {item.amount.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}

                  {/* --- Total Row for Bill --- */}
                  <tr className="bg-gray-100 border-t border-b border-gray-300 font-bold text-xs">
                    {/* Empty Cells for Basic Details */}
                    <td colSpan={4}></td>

                    {/* Total Label */}
                    <td className="px-3 py-2 text-right text-gray-600 uppercase tracking-wide">
                      Total:
                    </td>

                    {/* Total Values */}
                    <td className="px-3 py-2 text-right text-gray-800">
                      {billTotalQty}
                    </td>
                    <td className="px-3 py-2 text-right text-green-700">
                      {billTotalAmount.toFixed(2)}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="p-3 bg-gray-50 border-t flex justify-between items-center text-xs">
        <span className="font-bold uppercase">
          Total Bills: {filteredData.length}
        </span>
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
            className="ml-2 text-[11px] font-bold border rounded px-1 py-1 outline-none cursor-pointer"
          >
            {[10, 25, 50, 100].map((val) => (
              <option key={val} value={val}>
                Show {val} Bills
              </option>
            ))}
            <option value={filteredData.length}>Show All</option>
          </select>

          <div className="flex gap-1 ml-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-2 py-1 border rounded bg-white disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="px-2 py-1 border rounded bg-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseBillReport;
