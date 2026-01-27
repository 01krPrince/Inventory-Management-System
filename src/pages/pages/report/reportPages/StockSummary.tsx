import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Printer,
  Mail,
  Settings,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Download,
  Eye,
  Loader2,
} from "lucide-react";
import stockSummaryService, {
  StockItem,
} from "../../../../services/sales/report/salesExecutive";
import { COLORS } from "../../../../constants/colors";
import StockSummaryFilter from "./StockSummaryFilter"; // Assuming it's in the same directory

type SortConfig = { key: keyof StockItem; direction: "asc" | "desc" } | null;

const StockSummary: React.FC = () => {
  const [data, setData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  // NEW: State to manage Filter Modal visibility
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: "asc",
  });
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});

  // Fetch data on mount or when filter is applied
  const fetchStockData = async (filters: any = {}) => {
    try {
      setLoading(true);
      const response = await stockSummaryService.getStockSummary(filters);
      if (response.success) {
        setData(response.data);
        setIsFilterOpen(false); // Close modal on success
      } else {
        setError("Failed to load stock data");
      }
    } catch (err) {
      setError("An error occurred while fetching data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  // Deep search logic + Sorting + Grouping
  const processedGroups = useMemo(() => {
    let filtered = data.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      return Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchLower),
      );
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key] ?? "";
        const bVal = b[sortConfig.key] ?? "";
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    const groups: Record<string, StockItem[]> = {};
    filtered.forEach((item) => {
      const groupName = item.group || "General";
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(item);
    });

    return Object.keys(groups)
      .sort((a, b) =>
        sortConfig?.direction === "desc"
          ? b.localeCompare(a)
          : a.localeCompare(b),
      )
      .reduce(
        (obj, key) => {
          obj[key] = groups[key];
          return obj;
        },
        {} as Record<string, StockItem[]>,
      );
  }, [data, searchTerm, sortConfig]);

  const toggleSort = (key: keyof StockItem) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getGroupTotals = (items: StockItem[]) => {
    return items.reduce(
      (acc, curr) => ({
        opening: acc.opening + (curr.opening_qty || 0),
        closing: acc.closing + (curr.closing_qty || 0),
        value: acc.value + (curr.closing_value || 0),
        received: acc.received + (curr.inward_qty || 0),
        issue: acc.issue + (curr.outward_qty || 0),
      }),
      { opening: 0, closing: 0, value: 0, received: 0, issue: 0 },
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500 font-bold">
        {error}
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-screen overflow-hidden border rounded-sm"
      style={{ borderColor: COLORS.border, backgroundColor: COLORS.background }}
    >
      {/* Action Bar */}
      <div
        className="flex items-center justify-between p-2 border-b bg-white"
        style={{ borderColor: COLORS.border }}
      >
        <div className="flex items-center gap-1">
          <div
            className="border rounded-sm flex items-center px-2 py-1 bg-white min-w-[140px]"
            style={{ borderColor: COLORS.border }}
          >
            <span className="text-gray-400 mr-2 text-xs">•••</span>
            <span className="text-xs" style={{ color: COLORS.textPrimary }}>
              Default
            </span>
            <ChevronDown
              size={14}
              className="ml-auto"
              style={{ color: COLORS.textSecondary }}
            />
          </div>
          <button className="custom-primary-btn px-3 py-1 rounded-sm text-[10px] font-bold text-white uppercase shadow-sm">
            View
          </button>

          {/* UPDATED: Added onClick to trigger the Filter Modal */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="custom-primary-btn px-3 py-1 rounded-sm text-[10px] font-bold text-white uppercase flex items-center gap-1"
          >
            <Filter size={12} /> Filter
          </button>

          <button className="custom-primary-btn px-3 py-1 rounded-sm text-[10px] font-bold text-white uppercase flex items-center gap-1">
            <Printer size={12} /> Print
          </button>
          <div className="flex rounded-sm overflow-hidden shadow-sm">
            <button className="custom-primary-btn px-3 py-1 text-[10px] font-bold text-white uppercase flex items-center gap-1 border-r border-black/10">
              <Mail size={12} /> Mail
            </button>
            <button className="custom-primary-btn px-1 py-1 text-white">
              <ChevronDown size={12} />
            </button>
          </div>
          <button className="custom-primary-btn p-1.5 rounded-sm text-white">
            <Settings size={14} />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2 text-gray-400" size={13} />
          <input
            type="text"
            placeholder="Search all fields (HSN, Code, Name...)"
            className="pl-8 pr-3 py-1.5 border rounded-sm w-72 text-xs focus:ring-1 focus:ring-blue-400 outline-none transition-all"
            style={{ borderColor: COLORS.border, color: COLORS.textPrimary }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-grow overflow-auto bg-white">
        <table className="w-full border-collapse">
          <thead
            className="sticky top-0 z-20 text-white"
            style={{ backgroundColor: COLORS.primary }}
          >
            <tr className="text-[10px] h-6 italic opacity-85">
              <th
                colSpan={7}
                className="text-left pl-3 border-r"
                style={{ borderColor: COLORS.primaryHover }}
              >
                Zo...
              </th>
              <th
                colSpan={3}
                className="border-r"
                style={{ borderColor: COLORS.primaryHover }}
              ></th>
              <th
                colSpan={3}
                className="text-center border-r bg-black/10"
                style={{ borderColor: COLORS.primaryHover }}
              >
                Average
              </th>
              <th colSpan={2} className="text-center bg-black/10">
                During
              </th>
            </tr>
            <tr className="uppercase text-[10px] h-7 font-semibold">
              <th
                className="w-8 border-r text-center"
                style={{ borderColor: COLORS.primaryHover }}
              >
                <Download size={10} />
              </th>
              {[
                { label: "Item", key: "name" },
                { label: "Code", key: "itemcode" },
                { label: "Unit", key: "unit" },
                { label: "HSN/SAC", key: "hsn_code" },
                { label: "Category", key: "tax_category" },
                { label: "Tax Name", key: "tax_category" },
                { label: "Opening", key: "opening_qty" },
                { label: "Closing", key: "closing_qty" },
                { label: "Closing Val", key: "closing_value" },
                { label: "Sales Rate", key: "standard_sales_rate" },
                { label: "MRP", key: "mrp" },
                { label: "Purchase", key: "purchase_rate" },
                { label: "Received", key: "inward_qty" },
                { label: "Issue", key: "outward_qty" },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key as keyof StockItem)}
                  className="px-2 border-r text-left cursor-pointer hover:bg-black/10 transition-colors select-none"
                  style={{ borderColor: COLORS.primaryHover }}
                >
                  <div className="flex items-center justify-between">
                    <span>{col.label}</span>
                    {sortConfig?.key === col.key ? (
                      sortConfig.direction === "asc" ? (
                        <ArrowUp size={10} />
                      ) : (
                        <ArrowDown size={10} />
                      )
                    ) : (
                      <Filter size={8} className="opacity-40" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-[11px]">
            {Object.entries(processedGroups).map(([groupName, items]) => {
              const totals = getGroupTotals(items);
              return (
                <React.Fragment key={groupName}>
                  <tr
                    className="cursor-pointer select-none sticky top-13 z-10 border-b"
                    style={{
                      backgroundColor: COLORS.background,
                      borderColor: COLORS.border,
                    }}
                    onClick={() =>
                      setCollapsedGroups((prev) => ({
                        ...prev,
                        [groupName]: !prev[groupName],
                      }))
                    }
                  >
                    <td
                      className="p-2 border-r text-center"
                      style={{ borderColor: COLORS.border }}
                    >
                      {collapsedGroups[groupName] ? (
                        <ChevronRight
                          size={14}
                          style={{ color: COLORS.textSecondary }}
                        />
                      ) : (
                        <ChevronDown
                          size={14}
                          style={{ color: COLORS.textSecondary }}
                        />
                      )}
                    </td>
                    <td
                      colSpan={14}
                      className="p-2 font-bold uppercase"
                      style={{ color: COLORS.textPrimary }}
                    >
                      Group Name: {groupName}
                    </td>
                  </tr>

                  {!collapsedGroups[groupName] && (
                    <>
                      {items.map((row) => (
                        <tr
                          key={row._id}
                          className="custom-row border-b group h-7 transition-colors"
                          style={{ borderColor: COLORS.background }}
                        >
                          <td
                            className="border-r text-center"
                            style={{ borderColor: COLORS.border }}
                          >
                            <Eye
                              size={12}
                              className="mx-auto text-blue-500 opacity-0 group-hover:opacity-100 cursor-pointer"
                            />
                          </td>
                          <td
                            className="px-2 border-r"
                            style={{ borderColor: COLORS.border }}
                          >
                            {row.name || row.description}
                          </td>
                          <td
                            className="px-2 border-r text-gray-400"
                            style={{ borderColor: COLORS.border }}
                          >
                            {row.itemcode}
                          </td>
                          <td
                            className="px-2 border-r"
                            style={{ borderColor: COLORS.border }}
                          >
                            {row.unit}
                          </td>
                          <td
                            className="px-2 border-r"
                            style={{ borderColor: COLORS.border }}
                          >
                            {row.hsn_code}
                          </td>
                          <td
                            className="px-2 border-r"
                            style={{ borderColor: COLORS.border }}
                          >
                            {row.tax_category}
                          </td>
                          <td
                            className="px-2 border-r"
                            style={{ borderColor: COLORS.border }}
                          >
                            {row.tax_category}
                          </td>
                          <td
                            className="px-2 border-r text-right"
                            style={{ borderColor: COLORS.border }}
                          >
                            {(row.opening_qty || 0).toFixed(3)}
                          </td>
                          <td
                            className="px-2 border-r text-right font-bold"
                            style={{ borderColor: COLORS.border }}
                          >
                            {(row.closing_qty || 0).toFixed(3)}
                          </td>
                          <td
                            className="px-2 border-r text-right"
                            style={{ borderColor: COLORS.border }}
                          >
                            ₹
                            {(row.closing_value || 0).toLocaleString(
                              undefined,
                              { minimumFractionDigits: 2 },
                            )}
                          </td>
                          <td
                            className="px-2 border-r text-right"
                            style={{ borderColor: COLORS.border }}
                          >
                            ₹{(row.standard_sales_rate || 0).toFixed(2)}
                          </td>
                          <td
                            className="px-2 border-r text-right"
                            style={{ borderColor: COLORS.border }}
                          >
                            ₹{(row.mrp || 0).toFixed(2)}
                          </td>
                          <td
                            className="px-2 border-r text-right"
                            style={{ borderColor: COLORS.border }}
                          >
                            ₹{(row.purchase_rate || 0).toFixed(2)}
                          </td>
                          <td
                            className="px-2 border-r text-right font-bold"
                            style={{ borderColor: COLORS.border }}
                          >
                            {(row.inward_qty || 0).toFixed(3)}
                          </td>
                          <td className="px-2 text-right font-bold">
                            {(row.outward_qty || 0).toFixed(3)}
                          </td>
                        </tr>
                      ))}

                      <tr
                        className="bg-white font-bold h-8 border-b-2"
                        style={{ borderColor: COLORS.border }}
                      >
                        <td
                          colSpan={7}
                          className="border-r text-right pr-4 italic text-gray-500"
                          style={{ borderColor: COLORS.border }}
                        >
                          Category Totals:
                        </td>
                        <td
                          className="px-2 border-r text-right"
                          style={{ borderColor: COLORS.border }}
                        >
                          {totals.opening.toFixed(3)}
                        </td>
                        <td
                          className="px-2 border-r text-right"
                          style={{ borderColor: COLORS.border }}
                        >
                          {totals.closing.toFixed(3)}
                        </td>
                        <td
                          className="px-2 border-r text-right"
                          style={{ borderColor: COLORS.border }}
                        >
                          ₹
                          {totals.value.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td
                          colSpan={3}
                          className="border-r"
                          style={{ borderColor: COLORS.border }}
                        ></td>
                        <td
                          className="px-2 border-r text-right"
                          style={{ borderColor: COLORS.border }}
                        >
                          {totals.received.toFixed(3)}
                        </td>
                        <td className="px-2 text-right">
                          {totals.issue.toFixed(3)}
                        </td>
                      </tr>
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* NEW: Component rendered at the end to manage its own modal overlay */}
      <StockSummaryFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onView={(filters) => fetchStockData(filters)}
      />

      <style>{`
        .custom-primary-btn { background-color: ${COLORS.primary}; transition: background-color 0.2s; }
        .custom-primary-btn:hover { background-color: ${COLORS.primaryHover}; }
        .custom-row:hover { background-color: ${COLORS.background} !important; }
      `}</style>
    </div>
  );
};

export default StockSummary;
