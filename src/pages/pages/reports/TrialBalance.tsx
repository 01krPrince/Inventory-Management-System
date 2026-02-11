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
  Scale, // Used Scale icon for Trial Balance
  Loader2,
  Filter,
} from 'lucide-react';

// --- MOCK SERVICE (Remove this when integrating real API) ---
const mockService = {
  getTrialBalance: async (params: any) => {
    confirm;
    console.log(params);
    return new Promise<{ data: any[] }>((resolve) => {
      setTimeout(() => {
        resolve({
          data: Array.from({ length: 50 }).map((_, i) => ({
            group: i % 5 === 0 ? 'Current Assets' : 'Indirect Expenses',
            code: `ACC-${1000 + i}`,
            identification: `ID-${500 + i}`,
            name: `Ledger Account ${i + 1}`,
            type: 'Dr', // The ":" column data
            closing_debit: Math.random() > 0.5 ? Math.floor(Math.random() * 50000) : 0,
            closing_credit: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 50000),
            opening_debit: Math.floor(Math.random() * 10000),
            opening_credit: 0,
            during_debit: Math.floor(Math.random() * 20000),
            during_credit: Math.floor(Math.random() * 15000),
          })),
        });
      }, 800);
    });
  },
};
// -----------------------------------------------------------

type TrialBalanceItem = {
  group: string;
  code: string;
  identification: string;
  name: string;
  type: string;
  closing_debit: number;
  closing_credit: number;
  opening_debit: number;
  opening_credit: number;
  during_debit: number;
  during_credit: number;
};

interface ITrialBalanceParams {
  storeCode?: string;
  fromDate?: string;
  toDate?: string;
}

export default function TrialBalance() {
  // --- STATE MANAGEMENT ---
  const [items, setItems] = useState<TrialBalanceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [filters, setFilters] = useState<ITrialBalanceParams>({
    storeCode: '',
    fromDate: '',
    toDate: '',
  });

  const [isPrinting, setIsPrinting] = useState(false);
  const [prePrintRows, setPrePrintRows] = useState(25);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cleanParams: ITrialBalanceParams = {};
      if (filters.storeCode?.trim()) cleanParams.storeCode = filters.storeCode;
      if (filters.fromDate) cleanParams.fromDate = filters.fromDate;
      if (filters.toDate) cleanParams.toDate = filters.toDate;

      const response = await mockService.getTrialBalance(cleanParams);

      const mappedData: TrialBalanceItem[] = (response.data || []).map((raw) => ({
        group: raw.group || 'General',
        code: raw.code || 'N/A',
        identification: raw.identification || '-',
        name: raw.name || 'Unnamed Account',
        type: raw.type || '',
        closing_debit: raw.closing_debit ?? 0,
        closing_credit: raw.closing_credit ?? 0,
        opening_debit: raw.opening_debit ?? 0,
        opening_credit: raw.opening_credit ?? 0,
        during_debit: raw.during_debit ?? 0,
        during_credit: raw.during_credit ?? 0,
      }));

      setItems(mappedData);
    } catch (error) {
      console.error('Failed to fetch trial balance:', error);
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

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const groupedData = useMemo(() => {
    return paginatedData.reduce((acc: Record<string, TrialBalanceItem[]>, cur) => {
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
  }: {
    label: string;
    colSpan?: number;
    className?: string;
    isSubHeader?: boolean;
    showFilterIcon?: boolean;
  }) => (
    <th
      colSpan={colSpan}
      className={`sticky ${isSubHeader ? 'top-6' : 'top-0'} z-20 border-r border-white/10 bg-[#0c5888] px-2 py-1 text-[10px] font-bold uppercase tracking-tight text-white ${className}`}>
      <div className="flex items-center justify-between gap-1">
        <span className="w-full text-center">{label}</span>
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
              <Scale className="size-4 text-[#0c5888]" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-none text-gray-800">Trial Balance</h2>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-tighter text-gray-400">
                Financial Audit Report
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

        <div className="flex items-center gap-3 border-t bg-gray-50/50 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-gray-500">Store:</span>
            <input
              type="text"
              placeholder="Optional"
              className="rounded border border-gray-300 px-2 py-1 text-xs"
              value={filters.storeCode}
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
                Loading Financial Data...
              </span>
            </div>
          </div>
        )}

        <table className="w-full border-collapse text-left" id="trial-balance-table">
          <thead className="sticky top-0 z-30">
            {/* Top Header Row based on screenshot */}
            <tr className="bg-[#084164] text-[9px] uppercase tracking-widest text-white">
              <TableHeader label="Zoom" className="no-print" />
              <TableHeader label="Particulars" colSpan={2} className="bg-black/10 text-center" />
              <TableHeader label="-" colSpan={2} className="bg-black/20 text-center" />
              <TableHeader label="Closing" colSpan={2} className="bg-black/10 text-center" />
              <TableHeader label="Opening" colSpan={2} className="bg-black/20 text-center" />
              <TableHeader label="During" colSpan={2} className="bg-black/10 text-center" />
            </tr>

            {/* Sub Header Row */}
            <tr>
              <th className="no-print sticky top-6 z-20 h-7 border-r border-white/10 bg-[#0c5888]"></th>

              {/* Particulars Group */}
              <TableHeader label="Code" isSubHeader={true} showFilterIcon />
              <TableHeader label="Identification" isSubHeader={true} showFilterIcon />

              {/* "-" Group */}
              <TableHeader label="Name" isSubHeader={true} showFilterIcon />
              <TableHeader label=":" isSubHeader={true} showFilterIcon />

              {/* Closing Group */}
              <TableHeader label="Debit(₹)" isSubHeader={true} className="bg-[#0a4d78]" />
              <TableHeader label="Credit(₹)" isSubHeader={true} className="bg-[#0a4d78]" />

              {/* Opening Group */}
              <TableHeader label="Debit(₹)" isSubHeader={true} />
              <TableHeader label="Credit(₹)" isSubHeader={true} />

              {/* During Group */}
              <TableHeader label="Debit(₹)" isSubHeader={true} className="bg-[#0a4d78]" />
              <TableHeader label="Credit(₹)" isSubHeader={true} className="bg-[#0a4d78]" />
            </tr>
          </thead>

          <tbody className="text-[11px]">
            {Object.keys(groupedData).length > 0
              ? Object.keys(groupedData).map((groupName) => (
                  <React.Fragment key={groupName}>
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
                        colSpan={10}
                        className="px-2 py-1 font-bold uppercase tracking-wider text-[#0c5888]">
                        Group: {groupName}
                      </td>
                    </tr>

                    {!collapsed[groupName] &&
                      groupedData[groupName].map((r, i) => (
                        <tr key={i} className="h-7 border-b transition-colors hover:bg-gray-50">
                          <td className="no-print border-r text-center">
                            <Eye size={12} className="mx-auto cursor-pointer text-blue-500" />
                          </td>
                          <td className="border-r px-2 font-mono text-gray-500">{r.code}</td>
                          <td className="border-r px-2 font-mono text-gray-400">
                            {r.identification}
                          </td>
                          <td className="border-r px-2 font-medium text-gray-700">{r.name}</td>
                          <td className="border-r px-2 text-center text-gray-400">{r.type}</td>

                          {/* Closing */}
                          <td className="border-r bg-blue-50/20 px-2 text-right font-mono text-gray-800">
                            {r.closing_debit > 0 ? `₹${r.closing_debit.toLocaleString()}` : '-'}
                          </td>
                          <td className="border-r bg-blue-50/20 px-2 text-right font-mono text-gray-800">
                            {r.closing_credit > 0 ? `₹${r.closing_credit.toLocaleString()}` : '-'}
                          </td>

                          {/* Opening */}
                          <td className="border-r px-2 text-right font-mono text-gray-500">
                            {r.opening_debit > 0 ? `₹${r.opening_debit.toLocaleString()}` : '-'}
                          </td>
                          <td className="border-r px-2 text-right font-mono text-gray-500">
                            {r.opening_credit > 0 ? `₹${r.opening_credit.toLocaleString()}` : '-'}
                          </td>

                          {/* During */}
                          <td className="border-r px-2 text-right font-mono text-gray-500">
                            {r.during_debit > 0 ? `₹${r.during_debit.toLocaleString()}` : '-'}
                          </td>
                          <td className="px-2 text-right font-mono text-gray-500">
                            {r.during_credit > 0 ? `₹${r.during_credit.toLocaleString()}` : '-'}
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                ))
              : !loading && (
                  <tr>
                    <td colSpan={11} className="py-10 text-center italic text-gray-400">
                      No records found.
                    </td>
                  </tr>
                )}
          </tbody>
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
          #trial-balance-table { width: 100% !important; border: 1px solid #eee !important; }
          th { background-color: #0c5888 !important; color: white !important; -webkit-print-color-adjust: exact; }
          .bg-blue-50\\/20 { background-color: transparent !important; }
          tr { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
