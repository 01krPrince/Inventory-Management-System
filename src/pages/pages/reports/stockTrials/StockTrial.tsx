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
  Package,
  Loader2,
} from 'lucide-react';
import stockTrialService, { IStockTrialParams } from '../../../../services/reports/stockTrial';
// import StockLedger from './StockLedger';
import { fetchAllLocations } from '../../inventory/stockAdjustment/api/LocationMaster';
import { useTabs } from '../../../../context/TabContext';

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

// Type for the Store Dropdown options
type StoreOption = {
  name: string;
  id: string;
  code: string;
};

export default function StockTrial() {
  // --- STATE MANAGEMENT ---
  const [items, setItems] = useState<StockTrialItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const { addTab } = useTabs();

  const getToday = () => new Date().toISOString().split('T')[0];

  // Store Dropdown State
  const [storeOptions, setStoreOptions] = useState<StoreOption[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);

  const [filters, setFilters] = useState<IStockTrialParams>({
    storeCode: '',
    fromDate: getToday(), // Default to Today
    toDate: getToday(), // Default to Today
  });

  const [isPrinting, setIsPrinting] = useState(false);
  const [prePrintRows, setPrePrintRows] = useState(25);

  const handleViewLedger = (item: StockTrialItem) => {
    console.log(item.code + '  ' + filters.storeCode);
    addTab({
      name: `StockTrial: ${item.code}`,
      // Unique path ensures the TabBar creates a new tab for each item
      path: `/report/stock-trial/ledger/${item.code}`,
      // componentKey tells AppLayout to render the 'StockLedger' component
      componentKey: '/report/stock-trial/ledger',
      // data carries the dynamic parameter
      data: { itemCode: item.code, storeCode: filters.storeCode },
    });
  };

  // --- FETCH STORES (DROPDOWN) ---
  useEffect(() => {
    const loadDropdownData = async () => {
      setLoadingStores(true);
      try {
        const storesData = await fetchAllLocations();

        const mappedStores: StoreOption[] = storesData.map((item: any) => ({
          name: item.name || item.storeName,
          id: item._id,
          code: item.code || item.storeCode || '',
        }));

        setStoreOptions(mappedStores);

        // Auto-select the first store if available and no store is currently selected
        if (mappedStores.length > 0 && !filters.storeCode) {
          const firstStore = mappedStores[0];
          setFilters((prev) => ({
            ...prev,
            storeCode: firstStore.code,
          }));
        }
      } catch (error) {
        console.error('Error loading store dropdown', error);
      } finally {
        setLoadingStores(false);
      }
    };

    loadDropdownData();
  }, []); // Run once on mount

  // --- FETCH REPORT DATA ---
  const fetchData = async () => {
    // If we have stores loaded but no store code selected, don't fetch yet or warn user
    if (storeOptions.length > 0 && !filters.storeCode) {
      // Optional: Alert user to select a store
    }

    setLoading(true);
    try {
      const cleanParams: IStockTrialParams = {};
      if (filters.storeCode?.trim()) cleanParams.storeCode = filters.storeCode;
      if (filters.fromDate) cleanParams.fromDate = filters.fromDate;
      if (filters.toDate) cleanParams.toDate = filters.toDate;

      const response = await stockTrialService.getAllStockTrials(cleanParams);

      const mappedData: StockTrialItem[] = (response.data || []).map((raw) => ({
        group: raw.group || 'General',
        item: raw.itemName || 'Unnamed Item',
        brand: raw.brand || 'Default',
        barcode: raw.barcode || 'N/A',
        sales_rate: raw.saleRate ?? 0,
        category_name: raw.category || 'Default',
        item_type: raw.itemType || 'N/A',
        rate_per: 1,
        mrp: raw.mrp ?? 0,
        purchase_rate: raw.purchaseRate ?? 0,
        code: raw.itemCode || 'N/A',
        closing: raw.closing_qty ?? 0,
        opening: raw.opening_qty ?? 0,
        received: raw.inward_qty ?? 0,
        issue: raw.outward_qty ?? 0,
      }));

      setItems(mappedData);
    } catch (error) {
      console.error('Failed to fetch stock trials:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when storeCode is populated (optional, or wait for user to click Apply)
  useEffect(() => {
    if (filters.storeCode) {
      fetchData();
    }
  }, [filters.storeCode]); // Triggers fetch when store dropdown changes automatically

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
    return paginatedData.reduce((acc: Record<string, StockTrialItem[]>, cur) => {
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
  }: {
    label: string;
    colSpan?: number;
    className?: string;
    isSubHeader?: boolean;
  }) => (
    <th
      colSpan={colSpan}
      className={`sticky ${isSubHeader ? 'top-6' : 'top-0'} z-20 border-r border-white/10 bg-[#0c5888] px-2 py-1 text-[10px] font-bold uppercase tracking-tight text-white ${className}`}>
      {label}
    </th>
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f8fafc] font-sans">
      <div className="no-print flex flex-col border-b bg-white shadow-sm">
        <div className="flex items-center justify-between p-2">
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
              placeholder="Search visible data..."
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
          {/* STORE DROPDOWN */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-gray-500">Store:</span>
            <div className="relative">
              <select
                className="w-40 rounded border border-gray-300 bg-white px-2 py-1 text-xs outline-none focus:border-blue-500"
                value={filters.storeCode || ''}
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

          {/* <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-gray-500">From:</span>
            <input
              type="date"
              className="rounded border border-gray-300 px-2 py-1 text-xs"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            />
          </div> */}
          {/* <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-gray-500">To:</span>
            <input
              type="date"
              className="rounded border border-gray-300 px-2 py-1 text-xs"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            />
          </div> */}
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
                Loading Stock Data...
              </span>
            </div>
          </div>
        )}

        <table className="w-full border-collapse text-left" id="stock-trial-table">
          <thead className="sticky top-0 z-30">
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
            <tr>
              <th className="no-print sticky top-6 z-20 h-7 border-r border-white/10 bg-[#0c5888]"></th>
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
                <TableHeader key={i} label={h} isSubHeader={true} className="px-2 py-1.5" />
              ))}
            </tr>
          </thead>

          <tbody className="text-[11px]">
            {Object.keys(groupedData).length > 0
              ? Object.keys(groupedData).map((groupName) => (
                  <React.Fragment key={groupName}>
                    <tr
                      className="sticky top-[53px] z-10 cursor-pointer select-none border-b bg-blue-50/50"
                      onClick={() =>
                        setCollapsed((p) => ({
                          ...p,
                          [groupName]: !p[groupName],
                        }))
                      }>
                      <td className="no-print border-r p-1.5 text-center">
                        {collapsed[groupName] ? (
                          <ChevronRight size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </td>
                      <td
                        colSpan={14}
                        className="px-2 py-1 font-bold uppercase tracking-wider text-[#0c5888]">
                        Group: {groupName} ({groupedData[groupName].length} Items)
                      </td>
                    </tr>

                    {!collapsed[groupName] &&
                      groupedData[groupName].map((r, i) => (
                        <tr key={i} className="h-7 border-b transition-colors hover:bg-gray-50">
                          <td className="no-print border-r text-center">
                            <button onClick={() => handleViewLedger(r)}>
                              <Eye size={12} className="mx-auto cursor-pointer text-blue-500" />
                            </button>
                          </td>
                          <td className="border-r px-2 font-medium text-gray-700">{r.item}</td>
                          <td className="border-r px-2 text-gray-500">{r.brand}</td>
                          <td className="border-r px-2 font-mono text-gray-400">{r.barcode}</td>
                          <td className="border-r px-2 text-right font-mono">
                            ₹{r.sales_rate.toLocaleString()}
                          </td>
                          <td className="border-r px-2 text-gray-500">{r.category_name}</td>
                          <td className="border-r px-2 italic text-gray-400">{r.item_type}</td>
                          <td className="border-r px-2 text-center">{r.rate_per}</td>
                          <td className="border-r px-2 text-right font-mono">
                            ₹{r.mrp.toLocaleString()}
                          </td>
                          <td className="border-r px-2 text-right font-mono">
                            ₹{r.purchase_rate.toLocaleString()}
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
                ))
              : !loading && (
                  <tr>
                    <td colSpan={15} className="py-10 text-center italic text-gray-400">
                      No records found for the selected filters.
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>

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
