import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Search,
  Eye,
  Printer,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  UserCircle,
  Loader2,
} from 'lucide-react';
import customerTrialService, {
  ICustomerTrialParams,
} from '../../../../services/reports/customerTrail';
import { fetchAllLocations } from '../../inventory/stockAdjustment/api/LocationMaster';
import { useTabs } from '../../../../context/TabContext';

type CustomerTrialItem = {
  group: string;
  name: string;
  code: string;
  contactPerson: string;
  cellNo: string;
  email: string;
  closing_debit: number;
  closing_credit: number;
  opening_debit: number;
  opening_credit: number;
  during_debit: number;
  during_credit: number;
};

type StoreOption = { name: string; id: string; code: string };

export default function CustomerTrial() {
  const [items, setItems] = useState<CustomerTrialItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const { addTab } = useTabs();

  const [storeOptions, setStoreOptions] = useState<StoreOption[]>([]);
  const [, setLoadingStores] = useState(false);

  const getToday = () => new Date().toISOString().split('T')[0];

  const [filters, setFilters] = useState<ICustomerTrialParams>({
    storeCode: '',
    fromDate: getToday(),
    toDate: getToday(),
  });

  const [isPrinting, setIsPrinting] = useState(false);
  const [prePrintRows, setPrePrintRows] = useState(25);

  useEffect(() => {
    const loadStores = async () => {
      setLoadingStores(true);
      try {
        const storesData = await fetchAllLocations();
        const mapped = storesData.map((s: any) => ({
          name: s.name || s.storeName,
          id: s._id,
          code: s.code || s.storeCode || '',
        }));
        setStoreOptions(mapped);
        if (mapped.length > 0 && !filters.storeCode) {
          setFilters((prev) => ({ ...prev, storeCode: mapped[0].code }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingStores(false);
      }
    };
    loadStores();
  }, []);

  const fetchData = async () => {
    if (!filters.storeCode) return;
    setLoading(true);
    try {
      const response = await customerTrialService.getAllCustomerTrials(filters);

      const mappedData: CustomerTrialItem[] = (response.data || []).map((raw) => ({
        group: raw.state || 'General',
        name: raw.name || 'N/A',
        code: raw.code || 'N/A',
        contactPerson: raw.print_name || 'N/A',
        cellNo: raw.phone || 'N/A',
        email: raw.email || 'N/A',
        closing_debit: raw.closingDebit ?? 0,
        closing_credit: raw.closingCredit ?? 0,
        opening_debit: raw.openingDebit ?? 0,
        opening_credit: raw.openingCredit ?? 0,
        during_debit: raw.duringDebit ?? 0,
        during_credit: raw.duringCredit ?? 0,
      }));

      setItems(mappedData);
    } catch (error) {
      console.error('Failed to fetch:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters.storeCode) fetchData();
  }, [filters.storeCode]);

  const handleViewLedger = (e: CustomerTrialItem) => {
    console.log('Item and Store code ' + e.code + '\t' + filters.storeCode);
    addTab({
      name: `Ledger: ${e.name}`,
      path: `/report/customer-trial/ledger/${e.code}`,
      componentKey: '/report/customer-trial/ledger',
      data: { customerCode: e.code, storeCode: filters.storeCode },
    });
  };

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
    return paginatedData.reduce((acc: Record<string, CustomerTrialItem[]>, cur) => {
      if (!acc[cur.group]) acc[cur.group] = [];
      acc[cur.group].push(cur);
      return acc;
    }, {});
  }, [paginatedData]);

  useEffect(() => {
    if (isPrinting && paginatedData.length === filteredData.length) {
      setTimeout(() => {
        window.print();
        setIsPrinting(false);
        setRowsPerPage(prePrintRows);
      }, 500);
    }
  }, [isPrinting, paginatedData.length]);

  const handlePrintRequest = () => {
    setPrePrintRows(rowsPerPage);
    setRowsPerPage(filteredData.length);
    setIsPrinting(true);
  };

  const TableHeader = ({ label, colSpan = 1, className = '', isSubHeader = false }: any) => (
    <th
      colSpan={colSpan}
      className={`sticky ${isSubHeader ? 'top-6' : 'top-0'} z-20 border-r border-white/10 bg-[#0c5888] px-2 py-1 text-[10px] font-bold uppercase text-white ${className}`}>
      {label}
    </th>
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f8fafc] font-sans">
      <div className="no-print flex flex-col border-b bg-white shadow-sm">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <div className="rounded bg-blue-50 p-1.5">
              <UserCircle className="size-4 text-[#0c5888]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800">Customer Trial Balance</h2>
              <p className="text-[9px] font-bold uppercase text-gray-400">
                Receivable Ledger Report
              </p>
            </div>
            <button
              onClick={handlePrintRequest}
              className="ml-4 flex items-center gap-1.5 rounded bg-[#0c5888] px-3 py-1.5 text-[10px] font-bold uppercase text-white">
              <Printer size={12} /> Print
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 text-gray-400" size={13} />
            <input
              type="text"
              placeholder="Search..."
              className="w-72 rounded border py-1.5 pl-8 text-xs outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 border-t bg-gray-50/50 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-gray-500">Store:</span>
            <select
              className="w-40 rounded border border-gray-300 bg-white px-2 py-1 text-xs outline-none"
              value={filters.storeCode}
              onChange={(e) => setFilters({ ...filters, storeCode: e.target.value })}>
              {storeOptions.map((s) => (
                <option key={s.id} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-gray-500">From:</span>
            <input
              type="date"
              className="rounded border px-2 py-1 text-xs"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-gray-500">To:</span>
            <input
              type="date"
              className="rounded border px-2 py-1 text-xs"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            />
          </div>
          <button
            onClick={fetchData}
            className="rounded bg-gray-800 px-4 py-1 text-[10px] font-bold uppercase text-white hover:bg-black">
            {loading ? <Loader2 size={12} className="animate-spin" /> : 'Apply Filter'}
          </button>
        </div>
      </div>

      <div className="shadow-inner relative m-2 flex-grow overflow-auto rounded border bg-white">
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <Loader2 className="animate-spin text-[#0c5888]" size={32} />
            <span className="mt-2 text-[10px] font-bold uppercase text-gray-500">
              Loading Customers...
            </span>
          </div>
        )}

        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 z-30">
            <tr className="bg-[#084164] text-[9px] uppercase text-white">
              <TableHeader label="Zoom" className="no-print" />
              <TableHeader
                label="Customer Detail"
                colSpan={5}
                className="bg-black/10 text-center"
              />
              <TableHeader label="Closing" colSpan={2} className="bg-black/20 text-center" />
              <TableHeader label="Opening" colSpan={2} className="bg-black/10 text-center" />
              <TableHeader label="During" colSpan={2} className="bg-black/20 text-center" />
            </tr>
            <tr className="text-white">
              <th className="no-print sticky top-6 z-20 h-7 border-r border-white/10 bg-[#0c5888]"></th>
              {[
                'Name',
                'Code',
                'Print Name',
                'Phone',
                'Email',
                'Debit',
                'Credit',
                'Debit',
                'Credit',
                'Debit',
                'Credit',
              ].map((h, i) => (
                <TableHeader key={i} label={h} isSubHeader={true} />
              ))}
            </tr>
          </thead>
          <tbody className="text-[11px]">
            {Object.keys(groupedData).map((groupName) => (
              <React.Fragment key={groupName}>
                <tr
                  className="sticky top-[53px] z-10 cursor-pointer bg-blue-50/50"
                  onClick={() => setCollapsed((p) => ({ ...p, [groupName]: !p[groupName] }))}>
                  <td className="no-print border-r p-1 text-center">
                    {collapsed[groupName] ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                  </td>
                  <td colSpan={11} className="px-2 py-1 font-bold uppercase text-[#0c5888]">
                    Group: {groupName}
                  </td>
                </tr>
                {!collapsed[groupName] &&
                  groupedData[groupName].map((r, i) => (
                    <tr key={i} className="h-7 border-b hover:bg-gray-50">
                      <td className="no-print border-r text-center">
                        <button onClick={() => handleViewLedger(r)}>
                          <Eye size={12} className="mx-auto cursor-pointer text-blue-500" />
                        </button>
                      </td>
                      <td className="border-r px-2 font-medium">{r.name}</td>
                      <td className="border-r px-2 font-mono text-gray-500">{r.code}</td>
                      <td className="border-r px-2 text-gray-600">{r.contactPerson}</td>
                      <td className="border-r px-2 font-mono">{r.cellNo}</td>
                      <td className="max-w-[120px] truncate border-r px-2">{r.email}</td>
                      <td className="border-r bg-blue-50/20 px-2 text-right font-mono">
                        ₹{r.closing_debit.toLocaleString()}
                      </td>
                      <td className="border-r bg-blue-50/20 px-2 text-right font-mono">
                        ₹{r.closing_credit.toLocaleString()}
                      </td>
                      <td className="border-r px-2 text-right font-mono text-gray-500">
                        ₹{r.opening_debit.toLocaleString()}
                      </td>
                      <td className="border-r px-2 text-right font-mono text-gray-500">
                        ₹{r.opening_credit.toLocaleString()}
                      </td>
                      <td className="border-r px-2 text-right font-mono">
                        ₹{r.during_debit.toLocaleString()}
                      </td>
                      <td className="px-2 text-right font-mono">
                        ₹{r.during_credit.toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="no-print flex items-center justify-between border-t bg-white p-2 text-[10px] font-bold">
        <span className="uppercase text-gray-500">
          Total: <span className="text-[#0c5888]">{filteredData.length}</span>
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
              <ChevronLeft size={16} />
            </button>
            <span>
              {currentPage} / {totalPages || 1}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}>
              <ChevronRightIcon size={16} />
            </button>
          </div>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded border">
            {[10, 25, 50].map((v) => (
              <option key={v} value={v}>
                Show {v}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
