import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Search,
  Printer,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
  //   Eye,
  // X,
} from "lucide-react";

// --- API IMPORTS ---
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
  // --- STATE MANAGEMENT ---
  const [bills, setBills] = useState<PurchaseBillReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Preview Modal State
  //   const [selectedBill, setSelectedBill] =
  //     useState<PurchaseBillReportItem | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await purchaseBillService.getPurchaseBillReport();
      if (response && response.success && Array.isArray(response.data)) {
        setBills(response.data);
      } else {
        setBills([]);
      }
    } catch (err) {
      console.error("Purchase Bill Report Load Error:", err);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS ---
  //   const handlePreview = (row: PurchaseBillReportItem) => {
  //     setSelectedBill(row);
  //   };

  //   const closePreview = () => {
  //     setSelectedBill(null);
  //   };

  // --- SEARCH & PAGINATION ---
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

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  // --- COMPONENTS ---
  const TableHeader = ({
    label,
    align = "left",
  }: {
    label: string;
    align?: "left" | "right";
  }) => (
    <th
      className={`px-3 py-2 text-[11px] font-bold uppercase text-gray-500 tracking-tight border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10 text-${align}`}
    >
      {label}
    </th>
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-2">
        <Loader2 className="animate-spin text-[#0c5888]" size={32} />
        <span className="text-sm text-gray-500 font-medium">
          Compiling Purchase Data...
        </span>
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col h-full relative">
      {/* --- PREVIEW MODAL --- */}
      {/* {selectedBill && (
        <InvoicePreviewModal bill={selectedBill} onClose={closePreview} />
      )} */}

      {/* --- TOOLBAR --- */}
      <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <FileText className="text-[#0c5888] size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800 dark:text-white leading-none">
              Purchase Bill Report
            </h2>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-1 block">
              Logistics & Item Details
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Bill, Vendor, Item..."
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-[#0c5888] outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button
            onClick={() =>
              handlePrint("purchase-report-table", "Purchase Bill Report")
            }
            className="p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-sm"
            title="Print List"
          >
            <Printer size={16} className="text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() =>
              handleExport(filteredData, ReportColumns, "Purchase_Bill_Report")
            }
            className="p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-sm"
            title="Export to Excel"
          >
            <Download size={16} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="overflow-x-auto flex-1 max-h-[650px]">
        <table
          className="w-full border-collapse text-left"
          id="purchase-report-table"
        >
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr>
              <TableHeader label="Bill No" />
              <TableHeader label="Date" />
              <TableHeader label="Vendor" />
              <TableHeader label="Store" />
              <TableHeader label="Item" />
              <TableHeader label="Qty" align="right" />
              <TableHeader label="Rate" align="right" />
              <TableHeader label="Logistics" align="right" />
              <TableHeader label="Net Total" align="right" />
              {/* <th className="px-3 py-2 text-right border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-[11px] font-bold text-gray-500 uppercase">
                View
              </th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-blue-50/30 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <td className="px-3 py-2 text-sm font-mono text-[#0c5888] font-bold">
                    {row.billNo}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-500">
                    {new Date(row.billDate).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {row.vendorName}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-500">
                    {row.storeName}
                  </td>
                  <td
                    className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 max-w-[150px] truncate"
                    title={row.itemName}
                  >
                    {row.itemName}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-700 text-right font-mono">
                    {row.quantity}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-700 text-right font-mono">
                    {row.rate.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500 text-right font-mono">
                    {row.logisticsTotal.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-sm text-green-700 font-bold text-right font-mono">
                    {row.netTotal.toFixed(2)}
                  </td>
                  {/* <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => handlePreview(row)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all"
                      title="Preview Bill PDF"
                    >
                      <Eye size={16} />
                    </button>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="py-20 text-center text-gray-400 text-sm"
                >
                  No purchase bills found.
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

// --- PREVIEW MODAL COMPONENT ---
// const InvoicePreviewModal = ({
//   bill,
//   onClose,
// }: {
//   bill: PurchaseBillReportItem;
//   onClose: () => void;
// }) => {
//   const printRef = useRef<HTMLDivElement>(null);

//   const handlePrintSingle = () => {
//     if (!printRef.current) return;
//     const content = printRef.current.innerHTML;
//     const printWindow = window.open("", "", "height=600,width=800");
//     if (printWindow) {
//       printWindow.document.write("<html><head><title>Print Bill</title>");
//       printWindow.document.write(
//         "<style>body{font-family: sans-serif; padding: 20px;} table{width: 100%; border-collapse: collapse; margin-top: 20px;} th, td{border: 1px solid #ddd; padding: 8px; text-align: left;} th{background-color: #f2f2f2;} .text-right{text-align: right;} .header{margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px;} .total-row{font-weight: bold; background-color: #f9f9f9;}</style>",
//       );
//       printWindow.document.write("</head><body>");
//       printWindow.document.write(content);
//       printWindow.document.write("</body></html>");
//       printWindow.document.close();
//       printWindow.focus();
//       printWindow.print();
//     }
//   };

//   return (
//     <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
//       <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
//         {/* Header */}
//         <div className="flex justify-between items-center p-4 border-b border-gray-100">
//           <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
//             <FileText size={20} className="text-[#0c5888]" />
//             Bill Preview: {bill.billNo}
//           </h3>
//           <div className="flex gap-2">
//             <button
//               onClick={handlePrintSingle}
//               className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
//             >
//               <Printer size={14} /> Print / PDF
//             </button>
//             <button
//               onClick={onClose}
//               className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500"
//             >
//               <X size={20} />
//             </button>
//           </div>
//         </div>

//         {/* Printable Content Area */}
//         <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
//           <div
//             ref={printRef}
//             className="bg-white p-8 shadow-sm border border-gray-200 min-h-[500px]"
//           >
//             {/* Print Header */}
//             <div className="header flex justify-between items-start mb-6">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-800">
//                   PURCHASE BILL
//                 </h1>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Store: {bill.storeName} ({bill.storeCode})
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm font-bold">Bill #: {bill.billNo}</p>
//                 <p className="text-sm text-gray-600">
//                   Date: {new Date(bill.billDate).toLocaleDateString("en-GB")}
//                 </p>
//               </div>
//             </div>

//             {/* Vendor Details */}
//             <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-100">
//               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
//                 Vendor Details
//               </p>
//               <p className="font-bold text-lg text-gray-800">
//                 {bill.vendorName}
//               </p>
//               <p className="text-sm text-gray-600">Code: {bill.vendorCode}</p>
//             </div>

//             {/* Item Table */}
//             <table className="w-full text-sm mb-6">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="border p-2 text-left">Item</th>
//                   <th className="border p-2 text-right">Rate</th>
//                   <th className="border p-2 text-right">Qty</th>
//                   <th className="border p-2 text-right">Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td className="border p-2">
//                     {bill.itemName} <br />
//                     <span className="text-xs text-gray-400">
//                       {bill.itemCode}
//                     </span>
//                   </td>
//                   <td className="border p-2 text-right">
//                     {bill.rate.toFixed(2)}
//                   </td>
//                   <td className="border p-2 text-right">{bill.quantity}</td>
//                   <td className="border p-2 text-right">
//                     {bill.amount.toFixed(2)}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>

//             {/* Logistics & Totals */}
//             <div className="flex justify-end">
//               <div className="w-1/2">
//                 <div className="flex justify-between py-1 text-sm border-b border-dashed">
//                   <span className="text-gray-600">Sub Total:</span>
//                   <span>{bill.billTotal.toFixed(2)}</span>
//                 </div>
//                 {bill.logisticsTotal > 0 && (
//                   <>
//                     <div className="flex justify-between py-1 text-xs text-gray-500">
//                       <span>Freight:</span>
//                       <span>{bill.freight}</span>
//                     </div>
//                     <div className="flex justify-between py-1 text-xs text-gray-500">
//                       <span>Loading/Unloading:</span>
//                       <span>{bill.loadingUnloading}</span>
//                     </div>
//                     <div className="flex justify-between py-1 text-xs text-gray-500">
//                       <span>Insurance:</span>
//                       <span>{bill.insurance}</span>
//                     </div>
//                     <div className="flex justify-between py-1 text-xs text-gray-500 border-b border-dashed">
//                       <span>Other Charges:</span>
//                       <span>{bill.otherCharges}</span>
//                     </div>
//                   </>
//                 )}
//                 <div className="flex justify-between py-2 text-base font-bold text-gray-900 mt-1">
//                   <span>Net Total:</span>
//                   <span>{bill.netTotal.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>

//             {bill.remarks && (
//               <div className="mt-8 pt-4 border-t border-gray-100">
//                 <p className="text-xs font-bold text-gray-400">Remarks:</p>
//                 <p className="text-sm italic text-gray-600">{bill.remarks}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

export default PurchaseBillReport;
