import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Search,
  Eye,
  Printer,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Package,
  Loader2,
  Filter,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import stockTrialService, { IStockLedgerParams } from '../../../../services/reports/stockTrial';
import { fetchAllLocations } from '../../inventory/stockAdjustment/api/LocationMaster';

// --- INTERFACES ---
interface StockLedgerProps {
  itemCode?: string;
  storeCode?: string;
  data?: { itemCode?: string; storeCode?: string };
  tabData?: { itemCode?: string; storeCode?: string };
}

type StockLedgerItem = {
  itemName: string;
  groupName: string;
  category: string;
  unit: string;
  brand: string;
  itemCode: string;
  voucherDate: string;
  voucherNo: string;
  docRef: string;
  receiptQty: number;
  receiptRate: number;
  receiptAmount: number;
  issueQty: number;
  issueRate: number;
  issueAmount: number;
  balanceQty: number;
  balanceAmount: number;
  remark: string;
};

type StoreOption = {
  name: string;
  id: string;
  code: string;
};

// --- HELPER: Safe Floating Point Math ---
const safeFloat = (num: number) => parseFloat(num.toFixed(2));

export default function StockLedger(props: StockLedgerProps) {
  const [searchParams] = useSearchParams();

  // --- INITIALIZATION ---
  const getPropItemCode = () =>
    props.itemCode ||
    props.data?.itemCode ||
    props.tabData?.itemCode ||
    searchParams.get('code') ||
    '';

  const getPropStoreCode = () =>
    props.storeCode ||
    props.data?.storeCode ||
    props.tabData?.storeCode ||
    searchParams.get('store') ||
    '';

  // --- STATE ---
  const [targetItemCode, setTargetItemCode] = useState(getPropItemCode());
  const [filters, setFilters] = useState<IStockLedgerParams>({
    storeCode: getPropStoreCode(),
    fromDate: '2025-02-25',
    toDate: '2026-02-28',
  });

  const [items, setItems] = useState<StockLedgerItem[]>([]);
  const [loading, setLoading] = useState(false);

  // UI State
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [storeOptions, setStoreOptions] = useState<StoreOption[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);

  const [isPrinting, setIsPrinting] = useState(false);
  const [prePrintRows, setPrePrintRows] = useState(25);

  // --- SYNC PROPS ---
  useEffect(() => {
    const incomingItem = getPropItemCode();
    const incomingStore = getPropStoreCode();
    if (incomingItem && incomingItem !== targetItemCode) setTargetItemCode(incomingItem);
    if (incomingStore && incomingStore !== filters.storeCode)
      setFilters((p) => ({ ...p, storeCode: incomingStore }));
  }, [props.itemCode, props.storeCode, props.data, props.tabData, searchParams]);

  // --- FETCH STORES ---
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

  // --- FETCH LEDGER DATA ---
  const fetchData = async () => {
    if (!targetItemCode) return;
    setLoading(true);
    try {
      const apiParams: IStockLedgerParams = {
        storeCode: filters.storeCode,
        itemCode: targetItemCode,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      };

      const response = await stockTrialService.getStockLedger(apiParams);

      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        const validRows = response.data.filter(
          (row) => row._id !== 'OPENING' && row.voucherNo !== 'OPENING'
        );

        if (validRows.length === 0) {
          setItems([]);
          return;
        }

        const itemInfoRow = validRows.find((row) => row.itemName) || validRows[0];
        const fallbackDetails = {
          itemName: itemInfoRow.itemName || 'Unknown Item',
          itemGroup: itemInfoRow.itemGroup || 'N/A',
          category: itemInfoRow.category || 'N/A',
          unit: itemInfoRow.unit || 'N/A',
          itemCode: itemInfoRow.itemCode || 'N/A',
          brand: (itemInfoRow as any).brand || 'N/A',
        };

        const mappedData: StockLedgerItem[] = validRows.map((apiItem: any) => {
          const isReceipt = apiItem.direction === 'IN';
          const isIssue = apiItem.direction === 'OUT';
          const formattedDate = apiItem.date
            ? new Date(apiItem.date).toISOString().split('T')[0]
            : 'N/A';

          return {
            itemName: apiItem.itemName || fallbackDetails.itemName,
            groupName: apiItem.itemGroup || fallbackDetails.itemGroup,
            category: apiItem.category || fallbackDetails.category,
            unit: apiItem.unit || fallbackDetails.unit,
            itemCode: apiItem.itemCode || fallbackDetails.itemCode,
            brand: apiItem.brand || fallbackDetails.brand,
            voucherDate: formattedDate,
            voucherNo: apiItem.voucherNo || '-',
            docRef: apiItem.ref_no || 'N/A',
            receiptQty: isReceipt ? safeFloat(Number(apiItem.quantity)) : 0,
            receiptRate: isReceipt ? safeFloat(Number(apiItem.rate)) : 0,
            receiptAmount: isReceipt ? safeFloat(Number(apiItem.amount || 0)) : 0,
            issueQty: isIssue ? safeFloat(Number(apiItem.quantity)) : 0,
            issueRate: isIssue ? safeFloat(Number(apiItem.rate)) : 0,
            issueAmount: isIssue ? safeFloat(Number(apiItem.amount || 0)) : 0,
            balanceQty: safeFloat(Number(apiItem.balance_qty)),
            balanceAmount: safeFloat(Number(apiItem.balance_amount || 0)),
            remark: apiItem.partyName || '',
          };
        });
        setItems(mappedData);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to fetch stock ledger:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetItemCode) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetItemCode, filters.storeCode, filters.fromDate, filters.toDate]);

  // --- CALCULATION LOGIC ---
  const filteredData = useMemo(() => {
    return items.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [items, searchTerm]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, curr) => ({
        receiptQty: safeFloat(acc.receiptQty + curr.receiptQty),
        receiptAmount: safeFloat(acc.receiptAmount + curr.receiptAmount),
        issueQty: safeFloat(acc.issueQty + curr.issueQty),
        issueAmount: safeFloat(acc.issueAmount + curr.issueAmount),
      }),
      { receiptQty: 0, receiptAmount: 0, issueQty: 0, issueAmount: 0 }
    );
  }, [filteredData]);

  const closingBalance = useMemo(() => {
    if (filteredData.length === 0) return { qty: 0, amount: 0 };
    const lastItem = filteredData[filteredData.length - 1];
    return { qty: lastItem.balanceQty, amount: lastItem.balanceAmount };
  }, [filteredData]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const groupedData = useMemo(() => {
    return paginatedData.reduce((acc: Record<string, StockLedgerItem[]>, cur) => {
      if (!acc[cur.itemName]) acc[cur.itemName] = [];
      acc[cur.itemName].push(cur);
      return acc;
    }, {});
  }, [paginatedData]);

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

  // --- HEADER COMPONENT ---
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
      className={`sticky ${
        isSubHeader ? 'top-6' : 'top-0'
      } z-20 border-r border-white/10 bg-[#0c5888] px-2 py-1 text-[10px] font-bold uppercase tracking-tight text-white ${className}`}>
      <div className="flex items-center justify-between gap-1">
        <span className="w-full text-center">{label}</span>
        {showFilterIcon && <Filter size={8} className="text-white/50" />}
      </div>
    </th>
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f8fafc] font-sans">
      {/* HEADER SECTION */}
      <div className="no-print flex flex-col border-b bg-white shadow-sm">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <div className="rounded bg-blue-50 p-1.5">
              <Package className="size-4 text-[#0c5888]" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-none text-gray-800">Stock Ledger</h2>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-tighter text-gray-400">
                Item: {targetItemCode || 'Select Item'}
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

        <table className="w-full border-collapse text-left" id="stock-ledger-table">
          <thead className="sticky top-0 z-30">
            {/* Top Header Row (Groups) */}
            <tr className="bg-[#084164] text-[9px] uppercase tracking-widest text-white">
              <TableHeader label="Zoom" className="no-print" />
              <TableHeader label="Item Details" colSpan={5} className="bg-black/10 text-center" />
              <TableHeader
                label="Voucher Details"
                colSpan={3}
                className="bg-black/20 text-center"
              />
              <TableHeader label="Receipt" colSpan={3} className="bg-black/10 text-center" />
              <TableHeader label="Issue" colSpan={3} className="bg-black/20 text-center" />
              <TableHeader label="Balance" colSpan={2} className="bg-black/10 text-center" />
              <TableHeader label="-" className="bg-black/20" />
            </tr>

            {/* Sub Header Row (Columns) */}
            <tr>
              <th className="no-print sticky top-6 z-20 h-7 border-r border-white/10 bg-[#0c5888]"></th>

              {/* Item Details */}
              <TableHeader label="Group" isSubHeader showFilterIcon />
              <TableHeader label="Category" isSubHeader showFilterIcon />
              <TableHeader label="Unit" isSubHeader showFilterIcon />
              <TableHeader label="Brand" isSubHeader showFilterIcon />
              <TableHeader label="Code" isSubHeader showFilterIcon />

              {/* Voucher Details */}
              <TableHeader label="Date" isSubHeader showFilterIcon />
              <TableHeader label="VNo" isSubHeader showFilterIcon />
              <TableHeader label="Ref" isSubHeader showFilterIcon />

              {/* Receipt */}
              <TableHeader label="Qty" isSubHeader className="bg-[#0a4d78]" />
              <TableHeader label="Rate" isSubHeader className="bg-[#0a4d78]" />
              <TableHeader label="Amt" isSubHeader className="bg-[#0a4d78]" />

              {/* Issue */}
              <TableHeader label="Qty" isSubHeader />
              <TableHeader label="Rate" isSubHeader />
              <TableHeader label="Amt" isSubHeader />

              {/* Balance */}
              <TableHeader label="Qty" isSubHeader className="bg-[#0a4d78]" />
              <TableHeader label="Amt" isSubHeader className="bg-[#0a4d78]" />

              {/* Remark */}
              <TableHeader label="Remark" isSubHeader />
            </tr>
          </thead>

          <tbody className="text-[11px]">
            {Object.keys(groupedData).length > 0
              ? Object.keys(groupedData).map((itemName) => (
                  <React.Fragment key={itemName}>
                    <tr
                      className="sticky top-[53px] z-10 cursor-pointer select-none border-b bg-blue-50/50"
                      onClick={() =>
                        setCollapsed((p) => ({
                          ...p,
                          [itemName]: !p[itemName],
                        }))
                      }>
                      <td className="no-print border-r p-1.5 text-center">
                        {collapsed[itemName] ? (
                          <ChevronRight size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </td>
                      <td
                        colSpan={17}
                        className="px-2 py-1 font-bold uppercase tracking-wider text-[#0c5888]">
                        Item: {itemName}
                      </td>
                    </tr>

                    {!collapsed[itemName] &&
                      groupedData[itemName].map((row, i) => (
                        <tr key={i} className="h-7 border-b transition-colors hover:bg-gray-50">
                          <td className="no-print border-r text-center">
                            <Eye size={12} className="mx-auto cursor-pointer text-blue-500" />
                          </td>
                          {/* Item Details */}
                          <td className="border-r px-2 text-gray-600">{row.groupName}</td>
                          <td className="border-r px-2 text-gray-500">{row.category}</td>
                          <td className="border-r px-2 text-center text-gray-500">{row.unit}</td>
                          <td className="border-r px-2 text-gray-500">{row.brand}</td>
                          <td className="border-r px-2 font-mono text-gray-500">{row.itemCode}</td>

                          {/* Voucher Details */}
                          <td className="whitespace-nowrap border-r px-2 text-gray-700">
                            {row.voucherDate}
                          </td>
                          <td className="cursor-pointer border-r px-2 font-medium text-blue-600 hover:underline">
                            {row.voucherNo}
                          </td>
                          <td className="border-r px-2 text-gray-400">{row.docRef}</td>

                          {/* Receipt */}
                          <td className="border-r bg-blue-50/20 px-2 text-right font-medium text-gray-700">
                            {row.receiptQty > 0 ? row.receiptQty : '-'}
                          </td>
                          <td className="border-r bg-blue-50/20 px-2 text-right text-gray-500">
                            {row.receiptRate > 0
                              ? row.receiptRate.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : '-'}
                          </td>
                          <td className="border-r bg-blue-50/20 px-2 text-right font-mono text-gray-700">
                            {row.receiptAmount > 0
                              ? row.receiptAmount.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : '-'}
                          </td>

                          {/* Issue */}
                          <td className="border-r px-2 text-right font-medium text-gray-700">
                            {row.issueQty > 0 ? row.issueQty : '-'}
                          </td>
                          <td className="border-r px-2 text-right text-gray-500">
                            {row.issueRate > 0
                              ? row.issueRate.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : '-'}
                          </td>
                          <td className="border-r px-2 text-right font-mono text-gray-700">
                            {row.issueAmount > 0
                              ? row.issueAmount.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : '-'}
                          </td>

                          {/* Balance */}
                          <td className="border-r bg-blue-50/30 px-2 text-right font-bold text-[#0c5888]">
                            {row.balanceQty}
                          </td>
                          <td className="border-r bg-blue-50/30 px-2 text-right font-bold text-[#0c5888]">
                            {row.balanceAmount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="max-w-[150px] truncate px-2 text-[10px] italic text-gray-500">
                            {row.remark}
                          </td>
                        </tr>
                      ))}

                    {/* --- ITEM TOTAL ROW --- */}
                    {!collapsed[itemName] && (
                      <tr className="border-b bg-gray-100 text-[10px] font-bold text-gray-700 shadow-sm">
                        <td className="no-print"></td>
                        <td
                          colSpan={8}
                          className="border-r px-4 py-1.5 text-right font-bold uppercase text-gray-500">
                          Sub Total:
                        </td>
                        <td className="border-r bg-gray-200/50 px-2 text-right font-bold text-gray-800">
                          {groupedData[itemName].reduce((s, c) => safeFloat(s + c.receiptQty), 0)}
                        </td>
                        <td className="border-r bg-gray-200/50 px-2"></td>
                        <td className="border-r bg-gray-200/50 px-2 text-right font-bold text-gray-800">
                          {groupedData[itemName]
                            .reduce((s, c) => safeFloat(s + c.receiptAmount), 0)
                            .toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                        </td>
                        <td className="border-r bg-gray-200/50 px-2 text-right font-bold text-gray-800">
                          {groupedData[itemName].reduce((s, c) => safeFloat(s + c.issueQty), 0)}
                        </td>
                        <td className="border-r bg-gray-200/50 px-2"></td>
                        <td className="border-r bg-gray-200/50 px-2 text-right font-bold text-gray-800">
                          {groupedData[itemName]
                            .reduce((s, c) => safeFloat(s + c.issueAmount), 0)
                            .toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                        </td>
                        <td className="border-r bg-gray-50 px-2"></td>
                        <td className="border-r bg-gray-50 px-2"></td>
                        <td className="px-2"></td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              : !loading && (
                  <tr>
                    <td colSpan={18} className="py-10 text-center italic text-gray-400">
                      No ledger records found.
                    </td>
                  </tr>
                )}
          </tbody>

          {/* --- GRAND TOTAL FOOTER (STICKY BOTTOM) --- */}
          {items.length > 0 && (
            <tfoot className="sticky bottom-0 z-20 border-t-2 border-white/20 bg-[#0c5888] text-[11px] font-bold text-white shadow-lg">
              <tr>
                <td className="no-print"></td>
                <td colSpan={8} className="px-4 py-2 text-right uppercase tracking-wider">
                  Grand Total:
                </td>

                {/* Receipt Totals */}
                <td className="border-l border-white/10 px-2 text-right">{totals.receiptQty}</td>
                <td className="border-l border-white/10 px-2 text-right opacity-50">-</td>
                <td className="border-l border-white/10 px-2 text-right">
                  ₹
                  {totals.receiptAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>

                {/* Issue Totals */}
                <td className="border-l border-white/10 px-2 text-right">{totals.issueQty}</td>
                <td className="border-l border-white/10 px-2 text-right opacity-50">-</td>
                <td className="border-l border-white/10 px-2 text-right">
                  ₹
                  {totals.issueAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>

                {/* Closing Balance */}
                <td className="border-l border-white/10 bg-[#0a4e7a] px-2 text-right text-yellow-300">
                  {closingBalance.qty}
                </td>
                <td className="border-l border-white/10 bg-[#0a4e7a] px-2 text-right text-yellow-300">
                  ₹
                  {closingBalance.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="border-l border-white/10 px-2 text-center text-[9px] uppercase tracking-wide opacity-50">
                  Closed
                </td>
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
          #stock-ledger-table { width: 100% !important; border: 1px solid #eee !important; font-size: 8px !important; }
          th { background-color: #0c5888 !important; color: white !important; -webkit-print-color-adjust: exact; }
          tfoot { display: table-row-group; page-break-inside: avoid; background-color: #0c5888 !important; color: white !important; }
          .bg-blue-50\\/20 { background-color: transparent !important; }
          tr { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
