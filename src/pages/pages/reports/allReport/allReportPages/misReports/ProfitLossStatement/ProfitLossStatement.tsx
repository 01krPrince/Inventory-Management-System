import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Search,
  Eye,
  Printer,
  Download,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  TrendingUp,
  Loader2,
  Filter,
} from 'lucide-react';

const mockService = {
  getProfitLoss: async (params: any) => {
    console.log(params);
    return new Promise<{ data: any[] }>((resolve) => {
      setTimeout(() => {
        resolve({
          data: Array.from({ length: 40 }).map((_, i) => {
            const isIncome = i % 3 === 0;
            const group = isIncome
              ? 'Direct Incomes'
              : i % 2 === 0
                ? 'Indirect Expenses'
                : 'Direct Expenses';

            return {
              group: group,
              name: isIncome ? `Sales Account - Region ${i}` : `Expense Ledger - ${i}`,
              code: isIncome ? `INC-${1000 + i}` : `EXP-${2000 + i}`,
              closing_amount: Math.floor(Math.random() * 100000),
              type: isIncome ? 'Cr' : 'Dr',
            };
          }),
        });
      }, 800);
    });
  },
};

type ProfitLossItem = {
  group: string;
  name: string;
  code: string;
  closing_amount: number;
  type: string;
};

interface IProfitLossParams {
  storeCode?: string;
  fromDate?: string;
  toDate?: string;
}

export default function ProfitLossStatement() {
  const [items, setItems] = useState<ProfitLossItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [filters, setFilters] = useState<IProfitLossParams>({
    storeCode: '',
    fromDate: '',
    toDate: '',
  });

  const [isPrinting, setIsPrinting] = useState(false);
  const [prePrintRows, setPrePrintRows] = useState(25);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cleanParams: IProfitLossParams = {};
      if (filters.storeCode?.trim()) cleanParams.storeCode = filters.storeCode;
      if (filters.fromDate) cleanParams.fromDate = filters.fromDate;
      if (filters.toDate) cleanParams.toDate = filters.toDate;

      const response = await mockService.getProfitLoss(cleanParams);

      const mappedData: ProfitLossItem[] = (response.data || []).map((raw) => ({
        group: raw.group || 'General',
        name: raw.name || 'Unnamed Account',
        code: raw.code || 'N/A',
        closing_amount: raw.closing_amount ?? 0,
        type: raw.type || 'Dr',
      }));

      setItems(mappedData);
    } catch (error) {
      console.error('Failed to fetch P&L:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return items.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [items, searchTerm]);

  const totalClosing = useMemo(() => {
    return filteredData.reduce((acc, curr) => {
      return acc + curr.closing_amount;
    }, 0);
  }, [filteredData]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const groupedData = useMemo(() => {
    return paginatedData.reduce((acc: Record<string, ProfitLossItem[]>, cur) => {
      if (!acc[cur.group]) acc[cur.group] = [];
      acc[cur.group].push(cur);
      return acc;
    }, {});
  }, [paginatedData]);

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
    setRowsPerPage(filteredData.length);
    setIsPrinting(true);
  };

  const TableHeader = ({
    label,
    colSpan = 1,
    className = '',
    isSubHeader = false,
    showFilterIcon = false,
    align = 'center', // "left" | "center" | "right"
  }: {
    label: string;
    colSpan?: number;
    className?: string;
    isSubHeader?: boolean;
    showFilterIcon?: boolean;
    align?: string;
  }) => (
    <th
      colSpan={colSpan}
      className={`sticky ${isSubHeader ? 'top-6' : 'top-0'} z-20 border-r border-white/10 bg-[#0c5888] px-2 py-1 text-[10px] font-bold uppercase tracking-tight text-white ${className}`}>
      <div
        className={`flex items-center ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-between'} gap-1`}>
        <span>{label}</span>
        {showFilterIcon && <Filter size={8} className="text-white/50" />}
      </div>
    </th>
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f8fafc] font-sans">
      <div className="no-print flex flex-col border-b bg-white shadow-sm">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <div className="rounded bg-blue-50 p-1.5">
              <TrendingUp className="size-4 text-[#0c5888]" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-none text-gray-800">
                Profit & Loss Statement
              </h2>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-tighter text-gray-400">
                Financial Performance Report
              </p>
            </div>
            <div className="mx-2 h-6 w-[1px] bg-gray-200" />
            <button
              onClick={handlePrintRequest}
              className="flex items-center gap-1.5 rounded bg-[#0c5888] px-3 py-1.5 text-[10px] font-bold uppercase text-white shadow-sm hover:bg-[#09466d]">
              <Printer size={12} /> Print Report
            </button>
            <button className="flex items-center gap-1.5 rounded border border-gray-200 px-3 py-1.5 text-[10px] font-bold uppercase text-gray-600 hover:bg-gray-50">
              <Download size={12} /> Export
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2 text-gray-400" size={13} />
            <input
              type="text"
              placeholder="Search accounts..."
              className="w-72 rounded border border-gray-200 py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3 border-t bg-gray-50/50 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-gray-500">Store:</span>
            <input
              type="text"
              placeholder="Optional (e.g. 00002)"
              className="rounded border border-gray-300 px-2 py-1 text-xs"
              value={filters.storeCode || '00002'}
              onChange={(e) => setFilters({ ...filters, storeCode: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-gray-500">From:</span>
            <input
              type="date"
              className="rounded border border-gray-300 px-2 py-1 text-xs"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-gray-500">To:</span>
            <input
              type="date"
              className="rounded border border-gray-300 px-2 py-1 text-xs"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            />
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="rounded bg-gray-800 px-4 py-1 text-[10px] font-bold uppercase text-white hover:bg-black disabled:opacity-50">
            {loading ? <Loader2 size={12} className="animate-spin" /> : 'Apply Filter'}
          </button>
        </div>
      </div>

      <div className="shadow-inner relative m-2 flex-grow overflow-auto rounded border border-gray-200 bg-white">
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-[#0c5888]" size={32} />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
                Loading P&L Data...
              </span>
            </div>
          </div>
        )}

        <table className="w-full border-collapse text-left" id="pl-table">
          <thead className="sticky top-0 z-30">
            {/* Top Header Row - Matching Screenshot */}
            <tr className="bg-[#084164] text-[9px] uppercase tracking-widest text-white">
              <TableHeader label="Zoom" className="no-print w-10" />
              <TableHeader
                label="Detail"
                colSpan={3}
                className="bg-black/10 pl-2 text-left"
                align="left"
              />
              {/* Filler column for the blue space on right side of screenshot */}
              <TableHeader label="" className="bg-[#0c5888]" />
            </tr>

            {/* Sub Header Row */}
            <tr>
              <th className="no-print sticky top-6 z-20 h-7 border-r border-white/10 bg-[#0c5888]"></th>

              {/* Detail Columns */}
              <TableHeader
                label="Name"
                isSubHeader
                showFilterIcon
                align="left"
                className="w-[40%] pl-2"
              />
              <TableHeader
                label="Code"
                isSubHeader
                showFilterIcon
                align="left"
                className="w-[15%] pl-2"
              />
              <TableHeader
                label="Closing(₹)"
                isSubHeader
                showFilterIcon
                align="right"
                className="w-[20%] pr-2"
              />

              {/* Spacer Column */}
              <th className="sticky top-6 z-20 border-r border-white/10 bg-[#0c5888]"></th>
            </tr>
          </thead>

          <tbody className="text-[11px]">
            {Object.keys(groupedData).length > 0
              ? Object.keys(groupedData).map((groupName) => (
                  <React.Fragment key={groupName}>
                    {/* Group Header Row */}
                    <tr
                      className="sticky top-[53px] z-10 cursor-pointer select-none border-b bg-blue-50/50"
                      onClick={() => setCollapsed((p) => ({ ...p, [groupName]: !p[groupName] }))}>
                      <td className="no-print border-r p-1.5 text-center">
                        {collapsed[groupName] ? (
                          <ChevronRight size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </td>
                      <td
                        colSpan={4}
                        className="px-2 py-1 font-bold uppercase tracking-wider text-[#0c5888]">
                        {groupName}
                      </td>
                    </tr>

                    {/* Data Rows */}
                    {!collapsed[groupName] &&
                      groupedData[groupName].map((r, i) => (
                        <tr key={i} className="h-7 border-b transition-colors hover:bg-gray-50">
                          {/* Zoom/Action Icon */}
                          <td className="no-print border-r text-center">
                            <Eye size={12} className="mx-auto cursor-pointer text-blue-500" />
                          </td>

                          {/* Detail Data */}
                          <td className="border-r px-2 font-medium text-gray-700">{r.name}</td>
                          <td className="border-r px-2 font-mono text-gray-500">{r.code}</td>
                          <td className="border-r bg-blue-50/20 px-2 text-right font-mono font-bold text-gray-800">
                            {r.closing_amount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}{' '}
                            {r.type}
                          </td>
                          <td className="border-r"></td>
                        </tr>
                      ))}

                    {/* Group Total */}
                    {!collapsed[groupName] && (
                      <tr className="h-6 border-b bg-gray-100/80 font-bold text-gray-600">
                        <td className="no-print border-r"></td>
                        <td className="border-r px-2 text-right text-[9px] uppercase tracking-wider">
                          Total {groupName}:
                        </td>
                        <td className="border-r"></td>
                        <td className="border-r px-2 text-right text-[#0c5888]">
                          ₹
                          {groupedData[groupName]
                            .reduce((s, c) => s + c.closing_amount, 0)
                            .toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td></td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              : !loading && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center italic text-gray-400">
                      No records found.
                    </td>
                  </tr>
                )}
          </tbody>
          {/* Grand Total Footer */}
          {items.length > 0 && (
            <tfoot className="sticky bottom-0 z-20 border-t-2 border-white/20 bg-[#0c5888] text-[11px] font-bold text-white shadow-lg">
              <tr>
                <td className="no-print"></td>
                <td
                  colSpan={2}
                  className="border-r border-white/10 px-4 py-2 text-right uppercase tracking-wider">
                  Net Closing Balance:
                </td>
                <td className="border-r border-white/10 px-2 text-right font-extrabold text-yellow-300">
                  ₹{totalClosing.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <div className="no-print flex items-center justify-between border-t bg-white p-2 shadow-sm">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Total Records: <span className="text-[#0c5888]">{filteredData.length}</span>
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

      <style>{`
        @media print {
          .no-print { display: none !important; }
          #pl-table { width: 100% !important; border: 1px solid #eee !important; }
          th { background-color: #0c5888 !important; color: white !important; -webkit-print-color-adjust: exact; }
          tfoot { background-color: #0c5888 !important; color: white !important; -webkit-print-color-adjust: exact; }
          .bg-blue-50\\/20 { background-color: transparent !important; }
          tr { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
