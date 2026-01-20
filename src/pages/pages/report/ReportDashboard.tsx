import React, { useState, useEffect } from "react";
import {
  PieChart,
  FileText,
  Users,
  ShoppingCart,
  Package,
  CreditCard,
  BarChart3,
  Settings,
  Briefcase,
  Box,
  FileSearch,
  PlusCircle,
  Folder,
  ChevronRight,
  Search,
  Star,
  ChevronDown,
  ChevronUp,
  Calendar,
  Filter,
  GripVertical,
} from "lucide-react";

// --- Types ---
interface ReportItem {
  label: string;
  type: "folder" | "link";
  date?: string;
}

interface ReportSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: ReportItem[];
  isFavourite?: boolean;
}

// --- Initial Data ---
const INITIAL_DATA: ReportSection[] = [
  {
    id: "fav",
    title: "Favourite Report",
    icon: <Star size={18} className="text-yellow-400 fill-current" />,
    isFavourite: true,
    items: [
      // We keep the logic to show the "Drop Here" placeholder in the UI code,
      // but strictly speaking, we store actual fav items here.
    ],
  },
  {
    id: "mis",
    title: "MIS Reports",
    icon: <PieChart size={18} />,
    items: [
      { label: "Financial Statements", type: "folder" },
      { label: "Financial Analysis", type: "folder" },
      { label: "Stock Analysis", type: "folder" },
      { label: "Sales Analysis", type: "folder" },
      { label: "Purchase Analysis", type: "folder" },
      { label: "Enterprise Analysis", type: "folder" },
    ],
  },
  {
    id: "finance",
    title: "Finance",
    icon: <BarChart3 size={18} />,
    items: [
      { label: "Primary Books", type: "folder" },
      { label: "Ledgers", type: "folder" },
      { label: "Trial Balance", type: "folder" },
      { label: "Attribute Reports", type: "folder" },
      { label: "Loan-Bank Interest, A/C Confirmations", type: "folder" },
    ],
  },
  {
    id: "sales",
    title: "Customer/Sales",
    icon: <Users size={18} />,
    items: [
      { label: "Sales Report", type: "folder" },
      { label: "Ledgers & Trials", type: "folder" },
      { label: "Bills O/S and Ageing", type: "folder" },
      { label: "Linkage Reports", type: "folder" },
    ],
  },
  {
    id: "purchase",
    title: "Vendor/Purchase",
    icon: <ShoppingCart size={18} />,
    items: [
      { label: "Purchase Registers", type: "folder" },
      { label: "Trial/Ledgers", type: "folder" },
      { label: "Vendor Bills O/S and Ageing", type: "folder" },
      { label: "Linkage Reports", type: "folder" },
    ],
  },
  {
    id: "inventory",
    title: "Inventory Reports",
    icon: <Package size={18} />,
    items: [
      { label: "Primary Stock Reports", type: "folder" },
      { label: "Store Transfer", type: "folder" },
      { label: "JobCard/JobWork Inward and outward", type: "folder" },
      { label: "Serial/IMEI/Tag Based Reports", type: "folder" },
      { label: "Attributes/Barcode Reports", type: "folder" },
      { label: "Pharma/Batch Reports", type: "folder" },
    ],
  },
  {
    id: "gst",
    title: "GST/VAT Reports",
    icon: <FileText size={18} />,
    items: [
      { label: "GST Returns", type: "folder" },
      { label: "GSTR 2A/2B Reconciliation", type: "folder" },
      { label: "UAE VAT Returns", type: "folder" },
      { label: "Tax Register Sales", type: "link" },
      { label: "Tax Register Purchase", type: "link" },
    ],
  },
  {
    id: "employee",
    title: "Employee",
    icon: <Briefcase size={18} />,
    items: [
      { label: "Employee Register", type: "link" },
      { label: "Attendance/Leave", type: "folder" },
      { label: "Salary/TimeSheet/Expense Claim", type: "folder" },
      { label: "ESI/PF", type: "folder" },
    ],
  },
  {
    id: "pos",
    title: "Point of Sales",
    icon: <CreditCard size={18} />,
    items: [
      { label: "POS Customer List", type: "link" },
      { label: "POS Order Register", type: "link" },
      { label: "POS Sales Register", type: "link" },
      { label: "POS Sales Summary", type: "link" },
      { label: "POS Sales Register Tender Wise", type: "link" },
    ],
  },
  {
    id: "production",
    title: "Production",
    icon: <Settings size={18} />,
    items: [
      { label: "Production Register", type: "link" },
      { label: "Bill of Material Register", type: "link" },
      { label: "Production De-Assembling Register", type: "link" },
      { label: "Material Issue Request Register", type: "link" },
      { label: "Material Issue Request Summary", type: "link" },
    ],
  },
  {
    id: "assets",
    title: "Assets",
    icon: <Box size={18} />,
    items: [
      { label: "Asset Register", type: "link" },
      { label: "Asset Transfer Register", type: "link" },
      { label: "Asset Depreciation Register", type: "link" },
      { label: "Asset On Hand Register", type: "link" },
    ],
  },
  {
    id: "audit",
    title: "Audit / Logs",
    icon: <FileSearch size={18} />,
    items: [
      { label: "Price List Sales - Change Track", type: "link" },
      { label: "Physical Stock Taking v/s Actual", type: "link" },
      { label: "Mismatch Report", type: "link" },
      { label: "User Geo Tracking", type: "link" },
      { label: "Logs", type: "folder" },
    ],
  },
];

// --- Hook to determine grid columns ---
const useGridColumns = () => {
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setColumns(1);
      else if (window.innerWidth < 1024) setColumns(2);
      else setColumns(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return columns;
};

const ReportDashboard: React.FC = () => {
  // Main State for Reports (allows adding to favs)
  const [reportsData, setReportsData] = useState<ReportSection[]>(INITIAL_DATA);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeRow, setActiveRow] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const columns = useGridColumns();
  const [isDragOverFav, setIsDragOverFav] = useState(false);

  // --- Date Filter States ---
  const [datePreset, setDatePreset] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = e.target.value;
    setDatePreset(preset);

    const today = new Date();
    let start = "";
    let end = "";

    switch (preset) {
      case "today":
        start = end = formatDate(today);
        break;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        start = end = formatDate(yesterday);
        break;
      case "this_week":
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - today.getDay());
        start = formatDate(firstDayOfWeek);
        end = formatDate(today);
        break;
      case "this_month":
        const firstDayOfMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          1,
        );
        start = formatDate(firstDayOfMonth);
        end = formatDate(today);
        break;
      case "this_year":
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        start = formatDate(firstDayOfYear);
        end = formatDate(today);
        break;
      case "custom":
        start = startDate;
        end = endDate;
        break;
      default:
        start = "";
        end = "";
        break;
    }
    setStartDate(start);
    setEndDate(end);
  };

  // --- DRAG AND DROP HANDLERS ---

  const handleDragStart = (e: React.DragEvent, item: ReportItem) => {
    // Store the item data in the drag event
    e.dataTransfer.setData("reportItem", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "copy";
    setIsDragOverFav(true);
  };

  const handleDragLeave = () => {
    setIsDragOverFav(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverFav(false);

    const data = e.dataTransfer.getData("reportItem");
    if (!data) return;

    const droppedItem: ReportItem = JSON.parse(data);

    setReportsData((prevData) => {
      // Find the Favourite section index
      const favIndex = prevData.findIndex((section) => section.id === "fav");
      if (favIndex === -1) return prevData;

      const favSection = prevData[favIndex];

      // Check for duplicates
      const exists = favSection.items.some(
        (item) => item.label === droppedItem.label,
      );

      if (exists) return prevData; // Item already in favorites

      // Create new favorites array
      const updatedFavItems = [...favSection.items, droppedItem];

      // Create new sections array
      const newData = [...prevData];
      newData[favIndex] = { ...favSection, items: updatedFavItems };

      return newData;
    });
  };

  // Logic to filter data
  const filteredData = reportsData
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        return item.label.toLowerCase().includes(searchTerm.toLowerCase());
      }),
    }))
    .filter((section) => section.items.length > 0 || section.isFavourite);

  const isSearching = searchTerm.length > 0 || datePreset !== "all";
  const VISIBLE_ROWS_COUNT = 2;
  const itemsToShow =
    showAll || isSearching
      ? filteredData
      : filteredData.slice(0, VISIBLE_ROWS_COUNT * columns);

  const handleCardClick = (index: number) => {
    setActiveRow(Math.floor(index / columns));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      {/* --- Top Header & Search --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Reports Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Access all your financial and operational reports.
          </p>
        </div>

        <div className="relative w-full lg:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search reports..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white shadow-sm text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- Date Filters Bar --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm min-w-fit">
          <Filter size={18} className="text-blue-600" />
          <span>Filter By Date:</span>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full">
          <div className="relative w-full md:w-48">
            <select
              value={datePreset}
              onChange={handlePresetChange}
              className="w-full pl-3 pr-8 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="this_year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Calendar size={14} />
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setDatePreset("custom");
                }}
                className="pl-9 pr-3 py-2 w-full md:w-40 rounded-lg border border-slate-300 text-slate-600 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            <span className="text-slate-400 text-sm">to</span>
            <div className="relative w-full md:w-auto">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Calendar size={14} />
              </div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setDatePreset("custom");
                }}
                className="pl-9 pr-3 py-2 w-full md:w-40 rounded-lg border border-slate-300 text-slate-600 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- Grid Layout --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {itemsToShow.map((section, index) => {
          const currentRow = Math.floor(index / columns);
          const isExpanded = isSearching ? true : currentRow === activeRow;

          // Props specifically for the Favorites Drop Zone
          const dropZoneProps = section.isFavourite
            ? {
                onDragOver: handleDragOver,
                onDragLeave: handleDragLeave,
                onDrop: handleDrop,
              }
            : {};

          // Styling based on drag state
          const cardBorderClass =
            section.isFavourite && isDragOverFav
              ? "ring-2 ring-blue-500 border-blue-500 shadow-xl scale-[1.02] z-10"
              : "border-slate-200";

          return (
            <div
              key={section.id}
              {...dropZoneProps}
              className={`bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col transition-all duration-300 ${cardBorderClass} ${
                isExpanded
                  ? "h-[320px] shadow-md ring-1 ring-blue-100"
                  : "h-[54px] hover:shadow"
              }`}
            >
              <div
                onClick={() => handleCardClick(index)}
                className="bg-[#3e5b7b] px-4 py-3 flex items-center justify-between text-white border-b border-[#344d68] cursor-pointer hover:bg-[#344d68] transition-colors shrink-0"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-white/10 rounded-lg">
                    {section.icon}
                  </div>
                  <h3 className="font-semibold text-sm tracking-wide">
                    {section.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {!isExpanded && (
                    <div className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]" />
                  )}
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-white/70" />
                  ) : (
                    <ChevronDown size={16} className="text-white/70" />
                  )}
                </div>
              </div>

              <div
                className={`p-2 overflow-y-auto flex-1 custom-scrollbar transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0 invisible"}`}
              >
                {/* Drop Here Placeholder (Only in Fav section) */}
                {section.isFavourite && (
                  <div
                    className={`mb-2 p-2 border-2 border-dashed rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer transition-all duration-300 ${
                      isDragOverFav
                        ? "bg-blue-100 border-blue-500 text-blue-700 scale-105"
                        : "border-blue-100 bg-blue-50/50 text-blue-400 hover:bg-blue-50 hover:border-blue-200"
                    }`}
                  >
                    <PlusCircle size={14} className="mr-2" />
                    {isDragOverFav
                      ? "Drop Report Here!"
                      : "Drop Here To Add To Favourite"}
                  </div>
                )}

                <ul className="space-y-0.5">
                  {section.items.map((item, idx) => (
                    <li
                      key={idx}
                      draggable={!section.isFavourite} // Only allow dragging FROM other sections, not OUT of Favs (optional choice)
                      onDragStart={(e) => handleDragStart(e, item)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-blue-700 cursor-pointer transition-colors group/item text-sm ${!section.isFavourite ? "cursor-grab active:cursor-grabbing" : ""}`}
                    >
                      {/* Drag Handle Indicator */}
                      {!section.isFavourite && (
                        <GripVertical
                          size={14}
                          className="text-slate-300 opacity-0 group-hover/item:opacity-100 transition-opacity"
                        />
                      )}

                      {item.type === "folder" ? (
                        <Folder
                          size={16}
                          className="text-amber-400 fill-amber-100 shrink-0"
                        />
                      ) : (
                        <ChevronRight
                          size={14}
                          className="text-slate-300 group-hover/item:text-blue-500 shrink-0"
                        />
                      )}
                      <span className="truncate flex-1">{item.label}</span>
                    </li>
                  ))}

                  {section.items.length === 0 && !section.isFavourite && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs pt-10">
                      <Search size={24} className="mb-2 opacity-20" />
                      No reports found
                    </div>
                  )}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- View More Button --- */}
      {!isSearching && filteredData.length > VISIBLE_ROWS_COUNT * columns && (
        <div className="flex justify-center pb-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-full font-medium text-sm shadow-sm hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp size={16} />
              </>
            ) : (
              <>
                View More Reports <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>
      )}

      {/* --- Styles --- */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #94a3b8; }
      `}</style>
    </div>
  );
};

export default ReportDashboard;
