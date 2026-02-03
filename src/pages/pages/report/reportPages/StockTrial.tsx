import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Search,
  Eye,
  Filter,
  Printer,
  Download,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Package,
} from 'lucide-react';

// --- TYPES ---
type StockTrialItem = {
  group: string;
  item: string;
  brand: string;
  barcode: string;
  sales_rate: number;
  category_name: string;
  item_type: string;
  rate_per: number;
  mrp: number;
  purchase_rate: number;
  code: string;
  closing: number;
  opening: number;
  received: number;
  issue: number;
};

// --- SAMPLE DATA ---
const DATA: StockTrialItem[] = [
  {
    group: 'SHOES',
    item: 'EDGE No.10',
    brand: 'SEGA',
    barcode: '12926-10',
    sales_rate: 500,
    category_name: 'Default',
    item_type: 'FinishProduct',
    rate_per: 1,
    mrp: 0,
    purchase_rate: 367.92,
    code: '00001351',
    closing: 9,
    opening: 9,
    received: 0,
    issue: 0,
  },
  {
    group: 'SHOES',
    item: 'EDGE No.11',
    brand: 'SEGA',
    barcode: '12926-11',
    sales_rate: 500,
    category_name: 'Default',
    item_type: 'FinishProduct',
    rate_per: 1,
    mrp: 0,
    purchase_rate: 367.92,
    code: '00001352',
    closing: 2,
    opening: 2,
    received: 0,
    issue: 0,
  },
  {
    group: 'GARMENTS',
    item: 'SPORT T-SHIRT',
    brand: 'NIKE',
    barcode: 'TS-101',
    sales_rate: 1200,
    category_name: 'CLOTHING',
    item_type: 'FinishProduct',
    rate_per: 1,
    mrp: 0,
    purchase_rate: 850,
    code: '00004512',
    closing: 12,
    opening: 12,
    received: 0,
    issue: 0,
  },
  {
    group: 'FITNESS',
    item: 'DUMBBELL 10KG',
    brand: 'PRO',
    barcode: 'DB-10',
    sales_rate: 2200,
    category_name: 'GYM',
    item_type: 'FinishProduct',
    rate_per: 1,
    mrp: 0,
    purchase_rate: 1700,
    code: '00007811',
    closing: 5,
    opening: 5,
    received: 0,
    issue: 0,
  },
];

export default function StockTrial() {
  // --- STATE MANAGEMENT ---
  const [items] = useState<StockTrialItem[]>(DATA);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Printing Logic States
  const [isPrinting, setIsPrinting] = useState(false);
  const [prePrintRows, setPrePrintRows] = useState(25);

  // --- LOGIC (Declared before useEffect to fix Hoisting) ---
  const filteredData = useMemo(() => {
    return items.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [items, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  // Grouping logic for the visible (paginated) data
  const groupedData = useMemo(() => {
    return paginatedData.reduce((acc: Record<string, StockTrialItem[]>, cur) => {
      if (!acc[cur.group]) acc[cur.group] = [];
      acc[cur.group].push(cur);
      return acc;
    }, {});
  }, [paginatedData]);

  // --- AUTOMATIC PRINT ALL LOGIC ---
  useEffect(() => {
    if (isPrinting && paginatedData.length === filteredData.length) {
      const timer = setTimeout(() => {
        window.print();
        setIsPrinting(false);
        setRowsPerPage(prePrintRows);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPrinting, paginatedData.length, filteredData.length, prePrintRows]);

  const handlePrintRequest = () => {
    setPrePrintRows(rowsPerPage);
    setRowsPerPage(filteredData.length); // Render All
    setIsPrinting(true);
  };

  // --- UI HELPERS ---
  const TableHeader = ({
    label,
    colSpan = 1,
    className = '',
  }: {
    label: string;
    colSpan?: number;
    className?: string;
  }) => (
    <th
      colSpan={colSpan}
      className={`sticky top-0 z-20 border-r border-white/10 bg-[#0c5888] px-2 py-1 text-[10px] font-bold uppercase tracking-tight text-white ${className}`}>
      {label}
    </th>
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f8fafc] font-sans">
      {/* --- TOOLBAR --- */}
      <div className="no-print flex items-center justify-between border-b bg-white p-2 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="rounded bg-blue-50 p-1.5">
            <Package className="size-4 text-[#0c5888]" />
          </div>
          <div>
            <h2 className="text-sm font-bold leading-none text-gray-800">Stock Trial Balance</h2>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-tighter text-gray-400">
              Inventory Audit Report
            </p>
          </div>

          <div className="mx-2 h-6 w-[1px] bg-gray-200" />

          <button
            onClick={handlePrintRequest}
            className="flex items-center gap-1.5 rounded bg-[#0c5888] px-3 py-1.5 text-[10px] font-bold uppercase text-white shadow-sm hover:bg-[#09466d]">
            <Printer size={12} /> Print All
          </button>

          <button className="flex items-center gap-1.5 rounded border border-gray-200 px-3 py-1.5 text-[10px] font-bold uppercase text-gray-600 hover:bg-gray-50">
            <Download size={12} /> Export
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2 text-gray-400" size={13} />
          <input
            type="text"
            placeholder="Search all columns..."
            className="w-72 rounded border border-gray-200 py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="shadow-inner m-2 flex-grow overflow-auto rounded border border-gray-200 bg-white">
        <table className="w-full border-collapse text-left" id="stock-trial-table">
          <thead>
            {/* HEADER ROW 1 */}
            <tr className="bg-[#084164] text-[9px] uppercase tracking-widest text-white">
              <TableHeader label="Zoom" className="no-print" />
              <TableHeader
                label="Item Information"
                colSpan={9}
                className="bg-black/10 text-center"
              />
              <TableHeader label="-" />
              <TableHeader label="During Audit" colSpan={4} className="bg-black/20 text-center" />
            </tr>
            {/* HEADER ROW 2 */}
            <tr>
              <th className="no-print border-r border-white/10 bg-[#0c5888]"></th>
              {[
                'Item',
                'Brand',
                'Barcode',
                'Sales Rate(₹)',
                'Category',
                'Type',
                'Rate Per',
                'MRP(₹)',
                'Purchase(₹)',
                'Code',
                'Closing',
                'Opening',
                'Received',
                'Issue',
              ].map((h, i) => (
                <th
                  key={i}
                  className="sticky top-0 z-20 border-r border-white/10 bg-[#0c5888] px-2 py-1.5 text-[10px] font-bold uppercase text-white">
                  <div className="flex items-center justify-between gap-1">
                    {h} <Filter size={8} className="opacity-50" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-[11px]">
            {Object.keys(groupedData).map((groupName) => (
              <React.Fragment key={groupName}>
                {/* Group Header */}
                <tr
                  className="cursor-pointer select-none border-b bg-blue-50/50"
                  onClick={() => setCollapsed((p) => ({ ...p, [groupName]: !p[groupName] }))}>
                  <td className="no-print border-r p-1.5 text-center">
                    {collapsed[groupName] ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                  </td>
                  <td
                    colSpan={14}
                    className="px-2 py-1 font-bold uppercase tracking-wider text-[#0c5888]">
                    Group: {groupName} ({groupedData[groupName].length} Items)
                  </td>
                </tr>

                {/* Group Items */}
                {!collapsed[groupName] &&
                  groupedData[groupName].map((r, i) => (
                    <tr key={i} className="h-7 border-b transition-colors hover:bg-gray-50">
                      <td className="no-print border-r text-center">
                        <Eye size={12} className="mx-auto cursor-pointer text-blue-500" />
                      </td>
                      <td className="border-r px-2 font-medium text-gray-700">{r.item}</td>
                      <td className="border-r px-2 text-gray-500">{r.brand}</td>
                      <td className="border-r px-2 font-mono text-gray-400">{r.barcode}</td>
                      <td className="border-r px-2 text-right font-mono">
                        ₹{r.sales_rate.toFixed(2)}
                      </td>
                      <td className="border-r px-2 text-gray-500">{r.category_name}</td>
                      <td className="border-r px-2 italic text-gray-400">{r.item_type}</td>
                      <td className="border-r px-2 text-center">{r.rate_per}</td>
                      <td className="border-r px-2 text-right font-mono">₹{r.mrp.toFixed(2)}</td>
                      <td className="border-r px-2 text-right font-mono">
                        ₹{r.purchase_rate.toFixed(2)}
                      </td>
                      <td className="border-r px-2 font-mono text-gray-400">{r.code}</td>
                      <td className="border-r bg-blue-50/30 px-2 text-right font-bold text-[#0c5888]">
                        {r.closing}
                      </td>
                      <td className="border-r px-2 text-right text-gray-400">{r.opening}</td>
                      <td className="border-r px-2 text-right font-bold text-green-600">
                        {r.received}
                      </td>
                      <td className="px-2 text-right font-bold text-red-600">{r.issue}</td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER --- */}
      <div className="no-print flex items-center justify-between border-t bg-white p-2 shadow-sm">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Audit Records: <span className="text-[#0c5888]">{filteredData.length}</span>
        </span>

        <div className="flex items-center gap-2">
          <div className="mr-4 flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="rounded p-1 hover:bg-gray-100 disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            <div className="px-2 text-[11px] font-bold">
              {currentPage} / {totalPages || 1}
            </div>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="rounded p-1 hover:bg-gray-100 disabled:opacity-30">
              <ChevronRightIcon size={16} />
            </button>
          </div>

          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="cursor-pointer rounded border bg-white px-2 py-1 text-[10px] font-bold outline-none">
            {[10, 25, 50, 100].map((v) => (
              <option key={v} value={v}>
                Show {v}
              </option>
            ))}
            <option value={filteredData.length}>Show All</option>
          </select>
        </div>
      </div>

      {/* PRINT STYLES */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          #stock-trial-table { width: 100% !important; border: 1px solid #eee !important; }
          th { background-color: #0c5888 !important; color: white !important; -webkit-print-color-adjust: exact; }
          .bg-blue-50\\/30 { background-color: transparent !important; }
          tr { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
