import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Search,
  Eye,
  Printer,
  Download,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Users,
  Loader2,
  Filter,
} from "lucide-react";
import vendorTrialService, {
  IVendorTrialParams,
} from "../../../../services/reports/vendorTrail";
import { fetchAllLocations } from "../../inventory/stockAdjustment/api/LocationMaster";
import { useTabs } from "../../../../context/TabContext";

type VendorTrialItem = {
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

type StoreOption = {
  name: string;
  id: string;
  code: string;
};

export default function VendorTrial() {
  const [items, setItems] = useState<VendorTrialItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const { addTab } = useTabs();

  const [storeOptions, setStoreOptions] = useState<StoreOption[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);

  const [filters, setFilters] = useState<IVendorTrialParams>({
    storeCode: "",
    fromDate: "",
    toDate: "",
  });

  const [isPrinting, setIsPrinting] = useState(false);
  const [prePrintRows, setPrePrintRows] = useState(25);

  // --- NAVIGATION TO LEDGER ---
  const handleViewLedger = (vendor: VendorTrialItem) => {
    addTab({
      name: `Ledger: ${vendor.name}`,
      path: `/report/vendor-trial/ledger/${vendor.code}`,
      componentKey: "/report/vendor-trial/ledger",
      data: { vendorCode: vendor.code, storeCode: filters.storeCode },
    });
  };

  useEffect(() => {
    const loadStores = async () => {
      setLoadingStores(true);
      try {
        const storesData = await fetchAllLocations();
        const mappedStores: StoreOption[] = storesData.map((item: any) => ({
          name: item.name || item.storeName,
          id: item._id,
          code: item.code || item.storeCode || "",
        }));
        setStoreOptions(mappedStores);
        if (mappedStores.length > 0 && !filters.storeCode) {
          setFilters((p) => ({ ...p, storeCode: mappedStores[0].code }));
        }
      } catch (error) {
        console.error("Error loading stores", error);
      } finally {
        setLoadingStores(false);
      }
    };
    loadStores();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cleanParams: IVendorTrialParams = {};
      if (filters.storeCode?.trim()) cleanParams.storeCode = filters.storeCode;
      if (filters.fromDate) cleanParams.fromDate = filters.fromDate;
      if (filters.toDate) cleanParams.toDate = filters.toDate;

      const response = await vendorTrialService.getAllVendorTrials(cleanParams);

      const mappedData: VendorTrialItem[] = (response.data || []).map(
        (raw) => ({
          group: raw.ledger || "General Suppliers",
          name: raw.name || "Unknown Vendor",
          code: raw.code || "N/A",
          contactPerson: raw.contactPerson || "-",
          cellNo: raw.cellNo || "-",
          email: raw.email || "-",
          closing_debit: raw.closingDebit ?? 0,
          closing_credit: raw.closingCredit ?? 0,
          opening_debit: raw.openingDebit ?? 0,
          opening_credit: raw.openingCredit ?? 0,
          during_debit: raw.duringDebit ?? 0,
          during_credit: raw.duringCredit ?? 0,
        }),
      );

      setItems(mappedData);
    } catch (error) {
      console.error("Failed to fetch vendor trials:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters.storeCode) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.storeCode]);

  const filteredData = useMemo(() => {
    return items.filter((r) =>
      Object.values(r).some((v) =>
        String(v).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [items, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const groupedData = useMemo(() => {
    return paginatedData.reduce(
      (acc: Record<string, VendorTrialItem[]>, cur) => {
        if (!acc[cur.group]) acc[cur.group] = [];
        acc[cur.group].push(cur);
        return acc;
      },
      {},
    );
  }, [paginatedData]);

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

  const TableHeader = ({
    label,
    colSpan = 1,
    className = "",
    isSubHeader = false,
    showFilterIcon = false,
  }: any) => (
    <th
      colSpan={colSpan}
      className={`sticky ${
        isSubHeader ? "top-6" : "top-0"
      } z-20 border-r border-white/10 bg-[#0c5888] px-2 py-1 text-[10px] font-bold uppercase tracking-tight text-white ${className}`}
    >
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
              <Users className="size-4 text-[#0c5888]" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-none text-gray-800">
                Vendor Trial Balance
              </h2>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-tighter text-gray-400">
                Supplier Ledger Report
              </p>
            </div>
            <div className="mx-2 h-6 w-[1px] bg-gray-200" />
            <button
              onClick={handlePrintRequest}
              className="flex items-center gap-1.5 rounded bg-[#0c5888] px-3 py-1.5 text-[10px] font-bold uppercase text-white shadow-sm hover:bg-[#09466d]"
            >
              <Printer size={12} /> Print All
            </button>
            <button className="flex items-center gap-1.5 rounded border border-gray-200 px-3 py-1.5 text-[10px] font-bold uppercase text-gray-600 hover:bg-gray-50">
              <Download size={12} /> Export
            </button>
          </div>

          <div className="relative">
            <Search
              className="absolute left-2.5 top-2 text-gray-400"
              size={13}
            />
            <input
              type="text"
              placeholder="Search suppliers..."
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
            <span className="text-[10px] font-bold uppercase text-gray-500">
              Store:
            </span>
            <div className="relative">
              <select
                className="w-40 rounded border border-gray-300 bg-white px-2 py-1 text-xs outline-none focus:border-blue-500"
                value={filters.storeCode}
                onChange={(e) =>
                  setFilters({ ...filters, storeCode: e.target.value })
                }
                disabled={loadingStores}
              >
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
            <span className="text-[10px] font-bold uppercase text-gray-500">
              From:
            </span>
            <input
              type="date"
              className="rounded border border-gray-300 px-2 py-1 text-xs"
              value={filters.fromDate}
              onChange={(e) =>
                setFilters({ ...filters, fromDate: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-gray-500">
              To:
            </span>
            <input
              type="date"
              className="rounded border border-gray-300 px-2 py-1 text-xs"
              value={filters.toDate}
              onChange={(e) =>
                setFilters({ ...filters, toDate: e.target.value })
              }
            />
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="rounded bg-gray-800 px-4 py-1 text-[10px] font-bold uppercase text-white hover:bg-black disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              "Apply Filter"
            )}
          </button>
        </div>
      </div>

      <div className="shadow-inner relative m-2 flex-grow overflow-auto rounded border border-gray-200 bg-white">
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-[#0c5888]" size={32} />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
                Loading Vendor Data...
              </span>
            </div>
          </div>
        )}

        <table
          className="w-full border-collapse text-left"
          id="vendor-trial-table"
        >
          <thead className="sticky top-0 z-30">
            <tr className="bg-[#084164] text-[9px] uppercase tracking-widest text-white">
              <TableHeader label="Zoom" className="no-print" />
              <TableHeader
                label="Supplier Detail"
                colSpan={5}
                className="bg-black/10 text-center"
              />
              <TableHeader
                label="Closing"
                colSpan={2}
                className="bg-black/20 text-center"
              />
              <TableHeader
                label="Opening"
                colSpan={2}
                className="bg-black/10 text-center"
              />
              <TableHeader
                label="During"
                colSpan={2}
                className="bg-black/20 text-center"
              />
            </tr>
            <tr>
              <th className="no-print sticky top-6 z-20 h-7 border-r border-white/10 bg-[#0c5888]"></th>
              <TableHeader label="Name" isSubHeader={true} showFilterIcon />
              <TableHeader label="Code" isSubHeader={true} showFilterIcon />
              <TableHeader
                label="Contact Person"
                isSubHeader={true}
                showFilterIcon
              />
              <TableHeader label="CellNo" isSubHeader={true} showFilterIcon />
              <TableHeader label="Email" isSubHeader={true} showFilterIcon />
              <TableHeader
                label="Debit(₹)"
                isSubHeader={true}
                className="bg-[#0a4d78]"
              />
              <TableHeader
                label="Credit(₹)"
                isSubHeader={true}
                className="bg-[#0a4d78]"
              />
              <TableHeader label="Debit(₹)" isSubHeader={true} />
              <TableHeader label="Credit(₹)" isSubHeader={true} />
              <TableHeader
                label="Debit(₹)"
                isSubHeader={true}
                className="bg-[#0a4d78]"
              />
              <TableHeader
                label="Credit(₹)"
                isSubHeader={true}
                className="bg-[#0a4d78]"
              />
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
                      }
                    >
                      <td className="no-print border-r p-1.5 text-center">
                        {collapsed[groupName] ? (
                          <ChevronRight size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </td>
                      <td
                        colSpan={11}
                        className="px-2 py-1 font-bold uppercase tracking-wider text-[#0c5888]"
                      >
                        Group: {groupName} ({groupedData[groupName].length}{" "}
                        Records)
                      </td>
                    </tr>

                    {!collapsed[groupName] &&
                      groupedData[groupName].map((r, i) => (
                        <tr
                          key={i}
                          className="h-7 border-b transition-colors hover:bg-gray-50"
                        >
                          <td className="no-print border-r text-center">
                            <button onClick={() => handleViewLedger(r)}>
                              <Eye
                                size={12}
                                className="mx-auto cursor-pointer text-blue-500"
                              />
                            </button>
                          </td>
                          <td className="border-r px-2 font-medium text-gray-700">
                            {r.name}
                          </td>
                          <td className="border-r px-2 font-mono text-gray-500">
                            {r.code}
                          </td>
                          <td className="border-r px-2 text-gray-600">
                            {r.contactPerson}
                          </td>
                          <td className="border-r px-2 font-mono text-gray-500">
                            {r.cellNo}
                          </td>
                          <td
                            className="max-w-[150px] truncate border-r px-2 text-gray-500"
                            title={r.email}
                          >
                            {r.email}
                          </td>
                          <td className="border-r bg-blue-50/20 px-2 text-right font-mono text-gray-700">
                            {r.closing_debit > 0
                              ? `₹${r.closing_debit.toLocaleString()}`
                              : "-"}
                          </td>
                          <td className="border-r bg-blue-50/20 px-2 text-right font-mono text-gray-700">
                            {r.closing_credit > 0
                              ? `₹${r.closing_credit.toLocaleString()}`
                              : "-"}
                          </td>
                          <td className="border-r px-2 text-right font-mono text-gray-500">
                            {r.opening_debit > 0
                              ? `₹${r.opening_debit.toLocaleString()}`
                              : "-"}
                          </td>
                          <td className="border-r px-2 text-right font-mono text-gray-500">
                            {r.opening_credit > 0
                              ? `₹${r.opening_credit.toLocaleString()}`
                              : "-"}
                          </td>
                          <td className="border-r px-2 text-right font-mono text-gray-500">
                            {r.during_debit > 0
                              ? `₹${r.during_debit.toLocaleString()}`
                              : "-"}
                          </td>
                          <td className="px-2 text-right font-mono text-gray-500">
                            {r.during_credit > 0
                              ? `₹${r.during_credit.toLocaleString()}`
                              : "-"}
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                ))
              : !loading && (
                  <tr>
                    <td
                      colSpan={12}
                      className="py-10 text-center italic text-gray-400"
                    >
                      No vendor records found for the selected filters.
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>

      <div className="no-print flex items-center justify-between border-t bg-white p-2 shadow-sm">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Total Records:{" "}
          <span className="text-[#0c5888]">{filteredData.length}</span>
        </span>

        <div className="flex items-center gap-2">
          <div className="mr-4 flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="rounded p-1 hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="px-2 text-[11px] font-bold">
              {currentPage} / {totalPages || 1}
            </div>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="rounded p-1 hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronRightIcon size={16} />
            </button>
          </div>

          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="cursor-pointer rounded border bg-white px-2 py-1 text-[10px] font-bold outline-none"
          >
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
          #vendor-trial-table { width: 100% !important; border: 1px solid #eee !important; }
          th { background-color: #0c5888 !important; color: white !important; -webkit-print-color-adjust: exact; }
          .bg-blue-50\\/20 { background-color: transparent !important; }
          tr { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
