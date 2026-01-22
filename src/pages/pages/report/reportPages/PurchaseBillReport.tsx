import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Search,
  Printer,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import purchaseBillService, {
  PurchaseBillReportItem,
} from "../../../../services/purchase/purchaseBill";
import {
  handleExport,
  handlePrint,
} from "../../../../components/function/functions";

const ReportColumns = [
  { key: "billNo", label: "Bill No" },
  { key: "billDate", label: "Date" },
  { key: "vendorName", label: "Vendor" },
  { key: "storeName", label: "Store" },
  { key: "itemName", label: "Item" },
  { key: "quantity", label: "Qty" },
  { key: "netTotal", label: "Net Amount" },
];

const PurchaseBillReport = () => {
  const [bills, setBills] = useState<PurchaseBillReportItem[]>([]); // Typed state
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
      const response = await purchaseBillService.getPurchaseBillReport();
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

  // --- LOGIC DECLARED BEFORE USEEFFECT (Fixes Hoisting) ---
  const filteredData = useMemo(() => {
    return bills.filter((b) =>
      [b.billNo, b.vendorName, b.storeName, b.itemName].some((val) =>
        String(val || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    );
  }, [bills, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

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
    setRowsPerPage(filteredData.length); // Switch to All
    setIsPrinting(true);
  };

  const TableHeader = ({
    label,
    align = "left",
  }: {
    label: string;
    align?: "left" | "right";
  }) => (
    <th
      className={`px-3 py-2 text-[11px] font-bold uppercase text-gray-500 border-b bg-gray-50 sticky top-0 z-10 text-${align}`}
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
            onClick={() =>
              handleExport(filteredData, ReportColumns, "Purchase_Bill_Report")
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
          id="purchase-report-table"
        >
          <thead>
            <tr>
              <TableHeader label="Bill No" />
              <TableHeader label="Date" />
              <TableHeader label="Vendor" />
              <TableHeader label="Store" />
              <TableHeader label="Item" />
              <TableHeader label="Qty" align="right" />
              <TableHeader label="Net Total" align="right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.map((row, idx) => (
              <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-3 py-2 text-sm font-mono font-bold text-[#0c5888]">
                  {row.billNo}
                </td>
                <td className="px-3 py-2 text-sm text-gray-500">
                  {new Date(row.billDate).toLocaleDateString("en-GB")}
                </td>
                <td className="px-3 py-2 text-sm font-medium">
                  {row.vendorName}
                </td>
                <td className="px-3 py-2 text-sm text-gray-500">
                  {row.storeName}
                </td>
                <td className="px-3 py-2 text-sm text-gray-600 truncate max-w-[150px]">
                  {row.itemName}
                </td>
                <td className="px-3 py-2 text-sm text-right">{row.quantity}</td>
                <td className="px-3 py-2 text-sm font-bold text-green-700 text-right">
                  {row.netTotal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-gray-50 border-t flex justify-between items-center text-xs">
        <span className="font-bold uppercase">
          Total Records: {filteredData.length}
        </span>
        <div className="flex items-center gap-3">
          <div className="font-bold">
            {currentPage} / {totalPages || 1}
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

export default PurchaseBillReport;
