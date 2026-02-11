import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Printer,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  User, // Changed icon to User for customers
  Loader2,
  Filter,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import customerTrialService, {
  ICustomerStatementParams,
  ICustomerStatementResponse,
  ICustomerTransaction,
} from '../../../../services/reports/customerTrail';

import { fetchAllLocations } from '../../inventory/stockAdjustment/api/LocationMaster';

// --- PROPS INTERFACE ---
interface CustomerLedgerProps {
  customerCode?: string;
  storeCode?: string;
  data?: {
    customerCode?: string;
    storeCode?: string;
  };
  tabData?: {
    customerCode?: string;
    storeCode?: string;
  };
}

// --- UI DATA TYPE ---
type LedgerRow = {
  id: string;
  date: string;
  voucherNo: string;
  type: string;
  particulars: string;
  debit: number;
  credit: number;
  balance: number;
  isOpening?: boolean; // Helper to style opening row differently
};

type StoreOption = {
  name: string;
  id: string;
  code: string;
};

// --- HELPER: Safe Math ---
const safeFloat = (num: number) => parseFloat((num || 0).toFixed(2));

export default function CustomerLedger(props: CustomerLedgerProps) {
  const [searchParams] = useSearchParams();

  // --- 1. INITIALIZATION HELPERS ---
  const getPropCustomerCode = () =>
    props.customerCode ||
    props.data?.customerCode ||
    props.tabData?.customerCode ||
    searchParams.get('code') ||
    '';

  const getPropStoreCode = () =>
    props.storeCode ||
    props.data?.storeCode ||
    props.tabData?.storeCode ||
    searchParams.get('store') ||
    '';

  // --- STATE ---
  const [targetCustomerCode, setTargetCustomerCode] = useState(getPropCustomerCode());
  const [filters, setFilters] = useState<ICustomerStatementParams>({
    storeCode: getPropStoreCode(),
    fromDate: '2025-02-01',
    toDate: '2026-02-10',
  });

  // Data State
  const [rows, setRows] = useState<LedgerRow[]>([]);
  const [metaData, setMetaData] = useState<ICustomerStatementResponse['meta'] | null>(null);
  const [loading, setLoading] = useState(false);

  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [storeOptions, setStoreOptions] = useState<StoreOption[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [prePrintRows, setPrePrintRows] = useState(25);

  // --- 2. SYNC PROPS ---
  useEffect(() => {
    const incomingCustomer = getPropCustomerCode();
    const incomingStore = getPropStoreCode();

    if (incomingCustomer && incomingCustomer !== targetCustomerCode) {
      setTargetCustomerCode(incomingCustomer);
    }
    if (incomingStore && incomingStore !== filters.storeCode) {
      setFilters((p) => ({ ...p, storeCode: incomingStore }));
    }
  }, [props.customerCode, props.storeCode, props.data, props.tabData, searchParams]);

  // --- 3. FETCH STORES ---
  useEffect(() => {
    const loadStoreData = async () => {
      setLoadingStores(true);
      try {
        const storesData = await fetchAllLocations();
        const mappedStores: StoreOption[] = storesData.map((item: any) => ({
          name: item.name || item.storeName,
          id: item._id,
          code: item.code || item.storeCode || '',
        }));
        setStoreOptions(mappedStores);
      } catch (error) {
        console.error('Error loading store dropdown', error);
      } finally {
        setLoadingStores(false);
      }
    };
    loadStoreData();
  }, []);

  // --- 4. FETCH LEDGER DATA ---
  const fetchData = async () => {
    if (!targetCustomerCode) return;

    setLoading(true);
    try {
      const apiParams: ICustomerStatementParams = {
        storeCode: filters.storeCode,
        customerCode: targetCustomerCode,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      };

      const response = await customerTrialService.getCustomerStatement(apiParams);

      if (response.success) {
        setMetaData(response.meta);

        // 1. Create Opening Balance Row
        const openingRow: LedgerRow = {
          id: 'OPENING',
          date: response.meta.fromDate,
          voucherNo: 'OPENING',
          type: 'OPENING',
          particulars: 'Opening Balance',
          debit: response.meta.openingBalance > 0 ? response.meta.openingBalance : 0,
          credit: response.meta.openingBalance < 0 ? Math.abs(response.meta.openingBalance) : 0, // Assuming negative is credit
          balance: response.meta.openingBalance,
          isOpening: true,
        };

        // 2. Map Transactions
        const txnRows: LedgerRow[] = response.data.map((txn: ICustomerTransaction) => ({
          id: txn._id || 'N/A',
          date: txn.date || 'N/A',
          voucherNo: txn.voucherNo || 'N/A',
          type: txn.txnType || 'N/A',
          particulars: txn.particulars || 'N/A',
          debit: safeFloat(txn.debit),
          credit: safeFloat(txn.credit),
          balance: safeFloat(txn.balance),
          isOpening: false,
        }));

        // Combine
        setRows([openingRow, ...txnRows]);
      } else {
        setRows([]);
        setMetaData(null);
      }
    } catch (error) {
      console.error('Failed to fetch customer ledger:', error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetCustomerCode) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetCustomerCode, filters.storeCode, filters.fromDate, filters.toDate]);

  // --- CALCULATION LOGIC ---
  const filteredData = useMemo(() => {
    return rows.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [rows, searchTerm]);

  // Calculate Running Totals for Footer (Debit/Credit)
  // Note: We use the META totals for accuracy if available, otherwise sum rows
  const footerTotals = useMemo(() => {
    if (!metaData) return { totalDebit: 0, totalCredit: 0, closingBalance: 0 };

    // You can stick to meta totals for the period
    return {
      totalDebit: metaData.totalDebitInPeriod,
      totalCredit: metaData.totalCreditInPeriod,
      closingBalance: metaData.currentBalance,
    };
  }, [metaData]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  // --- PRINT LOGIC ---
  const handlePrintRequest = () => {
    setPrePrintRows(rowsPerPage);
    setRowsPerPage(filteredData.length);
    setIsPrinting(true);
  };

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

  // --- RENDER HELPERS ---
  const TableHeader = ({ label, colSpan = 1, className = '', isSubHeader = false }: any) => (
    <th
      colSpan={colSpan}
      className={`sticky ${
        isSubHeader ? 'top-6' : 'top-0'
      } z-20 border-r border-white/10 bg-[#0c5888] px-2 py-1 text-[10px] font-bold uppercase tracking-tight text-white ${className}`}>
      {isSubHeader ? (
        <div className="flex flex-col items-center justify-center gap-1">
          <span>{label}</span>
          <Filter size={8} className="cursor-pointer text-white/50 hover:text-white" />
        </div>
      ) : (
        label
      )}
    </th>
  );

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f8fafc] font-sans">
      {/* HEADER SECTION */}
      <div className="no-print flex flex-col border-b bg-white shadow-sm">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <div className="rounded bg-blue-50 p-1.5">
              <User className="size-4 text-[#0c5888]" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-none text-gray-800">Customer Ledger</h2>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-tighter text-gray-400">
                {metaData?.customerName || targetCustomerCode || 'Select Customer'}
              </p>
            </div>
            <div className="mx-2 h-6 w-[1px] bg-gray-200" />
            <button
              onClick={handlePrintRequest}
              className="flex items-center gap-1.5 rounded bg-[#0c5888] px-3 py-1.5 text-[10px] font-bold uppercase text-white shadow-sm hover:bg-[#09466d]">
              <Printer size={12} /> Print
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2 text-gray-400" size={13} />
            <input
              type="text"
              placeholder="Search ledger..."
              className="w-72 rounded border border-gray-200 py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex items-center gap-3 border-t bg-gray-50/50 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-gray-500">Store:</span>
            <div className="relative">
              <select
                className="w-40 rounded border border-gray-300 bg-white px-2 py-1 text-xs outline-none focus:border-blue-500"
                value={filters.storeCode}
                onChange={(e) => setFilters({ ...filters, storeCode: e.target.value })}
                disabled={loadingStores}>
                <option value="">Select Store</option>
                {storeOptions.map((store) => (
                  <option key={store.id} value={store.code}>
                    {store.name}
                  </option>
                ))}
              </select>
              {loadingStores && (
                <div className="absolute right-6 top-1.5">
                  <Loader2 size={10} className="animate-spin text-gray-400" />
                </div>
              )}
            </div>
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
            {loading ? <Loader2 size={12} className="animate-spin" /> : 'View Report'}
          </button>
        </div>
      </div>

      {/* TABLE AREA */}
      <div className="shadow-inner relative m-2 flex-grow overflow-auto rounded border border-gray-200 bg-white">
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-[#0c5888]" size={32} />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
                Fetching Ledger...
              </span>
            </div>
          </div>
        )}

        <table className="w-full border-collapse text-left" id="customer-ledger-table">
          <thead className="sticky top-0 z-30">
            <tr className="bg-[#084164] text-[9px] uppercase tracking-widest text-white">
              <TableHeader label="Zoom" className="no-print" />
              <TableHeader
                label="Transaction Details"
                colSpan={4}
                className="bg-black/10 text-center"
              />
              <TableHeader label="Amount" colSpan={3} className="bg-black/20 text-center" />
            </tr>

            <tr>
              <th className="no-print sticky top-6 z-20 h-10 border-r border-white/10 bg-[#0c5888]"></th>
              {/* Transaction Columns */}
              <TableHeader label="Date" isSubHeader />
              <TableHeader label="Vch No" isSubHeader />
              <TableHeader label="Type" isSubHeader />
              <TableHeader label="Particulars" isSubHeader />

              {/* Amount Columns */}
              <TableHeader label="Debit (₹)" isSubHeader className="bg-[#0e6ba5]" />
              <TableHeader label="Credit (₹)" isSubHeader className="bg-[#0a4e7a]" />
              <TableHeader label="Balance (₹)" isSubHeader className="bg-[#084164]" />
            </tr>
          </thead>

          <tbody className="text-[11px]">
            {paginatedData.length > 0
              ? paginatedData.map((row, i) => (
                  <tr
                    key={row.id + i}
                    className={`h-7 border-b transition-colors hover:bg-gray-50 ${
                      row.isOpening ? 'bg-yellow-50/50 font-medium' : ''
                    }`}>
                    <td className="no-print border-r text-center">
                      {/* Only show view icon for real transactions */}
                      {!row.isOpening && (
                        <div className="flex justify-center">
                          {/* Placeholder for action, maybe view voucher details */}
                          <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                        </div>
                      )}
                    </td>

                    {/* Transaction Details */}
                    <td className="whitespace-nowrap border-r px-2 text-gray-700">
                      {formatDate(row.date)}
                    </td>
                    <td className="cursor-pointer border-r px-2 font-medium text-blue-600 hover:underline">
                      {row.voucherNo}
                    </td>
                    <td className="border-r px-2 text-gray-500">{row.type}</td>
                    <td
                      className="max-w-[300px] truncate border-r px-2 text-gray-600"
                      title={row.particulars}>
                      {row.particulars}
                    </td>

                    {/* Amounts */}
                    <td className="border-r bg-blue-50/10 px-2 text-right text-gray-700">
                      {row.debit > 0
                        ? row.debit.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })
                        : '-'}
                    </td>
                    <td className="border-r bg-blue-50/10 px-2 text-right text-gray-700">
                      {row.credit > 0
                        ? row.credit.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })
                        : '-'}
                    </td>
                    <td className="border-r bg-blue-100/30 px-2 text-right font-bold text-[#0c5888]">
                      {row.balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))
              : !loading && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center italic text-gray-400">
                      No ledger records found.
                    </td>
                  </tr>
                )}
          </tbody>

          {/* --- GRAND TOTAL FOOTER --- */}
          {rows.length > 0 && (
            <tfoot className="sticky bottom-0 z-20 border-t-2 border-white/20 bg-[#0c5888] text-[11px] font-bold text-white shadow-lg">
              <tr>
                <td className="no-print"></td>
                <td colSpan={4} className="px-4 py-2 text-right uppercase tracking-wider">
                  Period Total:
                </td>

                <td className="border-l border-white/10 px-2 text-right">
                  ₹
                  {footerTotals.totalDebit.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="border-l border-white/10 px-2 text-right">
                  ₹
                  {footerTotals.totalCredit.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>

                {/* Closing Balance */}
                <td className="border-l border-white/10 bg-[#0a4e7a] px-2 text-right font-extrabold text-yellow-300">
                  ₹
                  {footerTotals.closingBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* PAGINATION */}
      <div className="no-print flex items-center justify-between border-t bg-white p-2 shadow-sm">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Total Transactions: <span className="text-[#0c5888]">{filteredData.length}</span>
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
          #customer-ledger-table { width: 100% !important; border: 1px solid #eee !important; font-size: 8px !important; }
          th { background-color: #0c5888 !important; color: white !important; -webkit-print-color-adjust: exact; }
          tfoot { display: table-row-group; page-break-inside: avoid; background-color: #0c5888 !important; color: white !important; }
          tr { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
