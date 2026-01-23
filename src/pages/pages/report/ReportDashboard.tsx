import React, { useState } from "react";
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
  Search,
  Star,
  Filter,
  GripVertical,
} from "lucide-react";
import { useTabs } from "../../../context/TabContext";

interface ReportItem {
  label: string;
  type: "folder" | "link";
  date?: string;
  path?: string;
}

interface ReportSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: ReportItem[];
  isFavourite?: boolean;
}

const INITIAL_DATA: ReportSection[] = [
  {
    id: "fav",
    title: "Favourite Report",
    icon: <Star size={18} className="text-white fill-current" />,
    isFavourite: true,
    items: [],
  },
  {
    id: "mis",
    title: "MIS Reports",
    icon: <PieChart size={18} className="text-white" />,
    items: [
      {
        label: "Financial Statements",
        type: "folder",
        path: "/report/financial-statements",
      },
      {
        label: "Financial Analysis",
        type: "folder",
        path: "/report/financial-analysis",
      },
      {
        label: "Stock Analysis",
        type: "folder",
        path: "/report/stock-analysis",
      },
      {
        label: "Sales Analysis",
        type: "folder",
        path: "/report/sales-analysis",
      },
      {
        label: "Purchase Analysis",
        type: "folder",
        path: "/report/purchase-analysis",
      },
      {
        label: "Enterprise Analysis",
        type: "folder",
        path: "/report/enterprise-analysis",
      },
      {
        label: "Buisness Insight",
        type: "folder",
        path: "/report/business-insight",
      },
    ],
  },
  {
    id: "finance",
    title: "Finance",
    icon: <BarChart3 size={18} className="text-white" />,
    items: [
      { label: "Primary Books", type: "folder", path: "/report/primary-books" },
      { label: "Ledgers", type: "folder", path: "/report/ledgers" },
      {
        label: "Trial Balance",
        type: "folder",
        path: "/report/trial-balance-finance",
      },
      {
        label: "Attribute Reports",
        type: "folder",
        path: "/report/attribute-reports",
      },
      {
        label: "Loan-Bank Interest, A/C Confirmations, Investments",
        type: "folder",
        path: "/report/loan-bank-interest",
      },
    ],
  },
  {
    id: "sales",
    title: "Customer/Sales",
    icon: <Users size={18} className="text-white" />,
    items: [
      { label: "Customers Report", type: "folder", path: "/report/customers" },
      { label: "Sales Report", type: "folder", path: "/report/sales-report" },
      {
        label: "Ledgers & Trials",
        type: "folder",
        path: "/report/ledgers-trials",
      },
      {
        label: "Bills O/S and Ageing",
        type: "folder",
        path: "/report/bills-os-ageing",
      },
      {
        label: "Linkage reports",
        type: "folder",
        path: "/report/linkage-reports",
      },
    ],
  },
  {
    id: "purchase",
    title: "Vendor/Purchase",
    icon: <ShoppingCart size={18} className="text-white" />,
    items: [
      { label: "Vendors Report", type: "folder", path: "/report/vendors" },
      {
        label: "Purchase Bill Report",
        type: "folder",
        path: "/report/purchase-bill",
      },
      {
        label: "Purchase Registers",
        type: "folder",
        path: "/report/purchase-registers",
      },
      {
        label: "Trial/Ledgers",
        type: "folder",
        path: "/report/trial-ledgers",
      },
      {
        label: "Vendor Bills O/S and Ageing",
        type: "folder",
        path: "/report/vendor-bills-os-ageing",
      },
      {
        label: "Linkage Reports",
        type: "folder",
        path: "/report/linkage-reports",
      },
    ],
  },
  {
    id: "inventory",
    title: "Inventory Reports",
    icon: <Package size={18} className="text-white" />,
    items: [
      {
        label: "Item Master",
        type: "folder",
        path: "/report/item-master",
      },
      {
        label: "Primary Stock Reports",
        type: "folder",
        path: "/report/primary-stock",
      },
      {
        label: "Stock Adjustment",
        type: "folder",
        path: "/report/stock-adjustment",
      },
      {
        label: "Store Transfer",
        type: "folder",
        path: "/report/store-transfer",
      },
      {
        label: "JobCard/JobWork Inward and outward",
        type: "folder",
        path: "/report/job-card-work-inward-outward",
      },
      {
        label: " Serial/IMEI/Tag Based Reports",
        type: "folder",
        path: "/report/serial-imei-tag",
      },
      {
        label: "Attributes/Barcode Reports",
        type: "folder",
        path: "/report/attribute-barcode-reports",
      },
      {
        label: "Pharma/Batch Reports",
        type: "folder",
        path: "/report/pharma-batch",
      },
      {
        label: "Imention/Jwellery/Rental",
        type: "folder",
        path: "/report/imitation-jewellery-rental",
      },
      {
        label: "Matrial Requisition Planning",
        type: "folder",
        path: "/report/material-requisition-planning",
      },
    ],
  },
  {
    id: "gst",
    title: "GST/VAT Reports",
    icon: <FileText size={18} className="text-white" />,
    items: [
      { label: "GST Master", type: "folder", path: "/report/gst-master" },
      { label: "GST Returns", type: "folder", path: "/report/gst-returns" },
      {
        label: "GSTR 2A/2B Reconciliation",
        type: "folder",
        path: "/report/gstr-reco",
      },
      { label: "UAE VAT Returns", type: "folder", path: "/report/uae-vat" },
      {
        label: "Tax Register Sales",
        type: "link",
        path: "/report/tax-register-sales",
      },
      {
        label: "Tax Register Purchase",
        type: "link",
        path: "/report/tax-register-purchase",
      },
      {
        label: "Tax Summary",
        type: "link",
        path: "/report/tax-summary",
      },
      {
        label: "GST ITC Reversal Register",
        type: "link",
        path: "/report/gst-itc-reversal-register",
      },
      {
        label: "HSN Tax Rate Vs Invoice Tax Rate Mismatch",
        type: "link",
        path: "/report/hsn-tax-rate-vs-invoice-tax-rate-mismatch",
      },
    ],
  },
  {
    id: "employee",
    title: "Employee",
    icon: <Briefcase size={18} className="text-white" />,
    items: [
      {
        label: "Employee Register",
        type: "link",
        path: "/report/employee-register",
      },
      {
        label: "Attendance/Leave",
        type: "folder",
        path: "/report/attendance-leave",
      },
      {
        label: "Salary/TimeSheet/Expence Claim",
        type: "folder",
        path: "/report/salary-timesheet-expense-claim",
      },
      { label: "ESI/PF", type: "folder", path: "/report/esi-pf" },
    ],
  },
  {
    id: "pos",
    title: "Point of Sales",
    icon: <CreditCard size={18} className="text-white" />,
    items: [
      {
        label: "POS Customer List",
        type: "link",
        path: "/report/pos-customer-list",
      },
      {
        label: "POS Order Register",
        type: "link",
        path: "/report/pos-order-register",
      },
      {
        label: "POS Sales Register",
        type: "link",
        path: "/report/pos-sales-register",
      },
      {
        label: "POS Sales Summary",
        type: "link",
        path: "/report/pos-sales-summary",
      },
      {
        label: "POS Sales Tender Wise",
        type: "link",
        path: "/report/pos-tender-wise",
      },
      {
        label: "POS Sales Tender Wise With Item",
        type: "link",
        path: "/report/pos-tender-wise-with-item",
      },
      {
        label: "Tender Settelment Report",
        type: "link",
        path: "/report/tender-settlement-report",
      },
      {
        label: "POS Day Wise Tender Summary",
        type: "link",
        path: "/report/pos-daywise-tender-summary",
      },
      {
        label: "Tender wise summary",
        type: "link",
        path: "/report/tender-wise-summary",
      },
      {
        label: "POS Sales Analysis",
        type: "link",
        path: "/report/pos-sales-analysis",
      },
      {
        label: "POS Party Trial",
        type: "link",
        path: "/report/pos-party-trial",
      },
      {
        label: "POS Party Ledger",
        type: "link",
        path: "/report/pos-party-ledger",
      },
      {
        label: "POS Party Ledger With Item detail",
        type: "link",
        path: "/report/pos-party-ledger-with-item-detail",
      },
      {
        label: "POS Day Start/Close Register",
        type: "link",
        path: "/report/pos-day-start-close-register",
      },
      {
        label: "Loyality Point Ledger",
        type: "link",
        path: "/report/loyalty-point-ledger",
      },
      {
        label: "Loyality Point Summary",
        type: "link",
        path: "/report/loyalty-point-summary",
      },
      {
        label: "POS Order v/s Invoice",
        type: "link",
        path: "/report/pos-order-vs-invoice",
      },
      {
        label: "POS Customer Reciept/Payment Register",
        type: "link",
        path: "/report/pos-customer-receipt-payment-register",
      },
    ],
  },
  {
    id: "production",
    title: "Production",
    icon: <Settings size={18} className="text-white" />,
    items: [
      {
        label: "Production Register",
        type: "link",
        path: "/report/production-register",
      },
      {
        label: "Bill of Material Register",
        type: "link",
        path: "/report/bom-register",
      },
      {
        label: "Production De-Assembling Register",
        type: "link",
        path: "/report/de-assembling",
      },
      {
        label: "Material Issue Request Register",
        type: "link",
        path: "/report/issue-request",
      },
      {
        label: "Material Issue Request Summary",
        type: "link",
        path: "/report/issue-summary",
      },
      {
        label: "Material Issue To Production",
        type: "link",
        path: "/report/material-issue-to-production",
      },
      {
        label: "Material Received From Production",
        type: "link",
        path: "/report/material-received-from-production",
      },
      {
        label: "Issue To Production Floor v/s Reciept - Linkage Based",
        type: "link",
        path: "/report/issue-to-production-floor-vs-receipt-linkage-based",
      },
      {
        label: "Issue To Production Floor v/s Reciept - Voucher Based",
        type: "link",
        path: "/report/issue-to-production-floor-vs-receipt-voucher-based",
      },
      {
        label: "WIP Stock Balance",
        type: "link",
        path: "/report/wip-stock-balance",
      },
      {
        label: "Cashew Production",
        type: "link",
        path: "/report/cashew-production",
      },
    ],
  },
  {
    id: "assets",
    title: "Assets",
    icon: <Box size={18} className="text-white" />,
    items: [
      { label: "Asset Register", type: "link", path: "/report/asset-register" },
      {
        label: "Asset Transfer Register",
        type: "link",
        path: "/report/asset-transfer",
      },
      {
        label: "Asset Depreciation Register",
        type: "link",
        path: "/report/asset-depreciation",
      },
      { label: "Asset On Hand", type: "link", path: "/report/asset-on-hand" },
    ],
  },
  {
    id: "audit",
    title: "Audit / Logs",
    icon: <FileSearch size={18} className="text-white" />,
    items: [
      {
        label: "Price List Change Track",
        type: "link",
        path: "/report/price-list-change",
      },
      {
        label: "Physical Stock vs Actual",
        type: "link",
        path: "/report/physical-stock",
      },
      {
        label: "Mismatch Report",
        type: "link",
        path: "/report/mismatch-report",
      },
      { label: "User Geo Tracking", type: "link", path: "/report/user-geo" },
      {
        label: "Payment Link Status",
        type: "folder",
        path: "/report/payment-link-status",
      },
      {
        label: "Document Change Track",
        type: "folder",
        path: "/report/document-change-track",
      },
      {
        label: "Attachment Register",
        type: "folder",
        path: "/report/attachment-register",
      },
      {
        label: "Zero Sales Analyses",
        type: "folder",
        path: "/report/zero-sales-analyses",
      },
      {
        label: "Authorization Status",
        type: "folder",
        path: "/report/authorization-status",
      },
      {
        label: "Force Close Log",
        type: "folder",
        path: "/report/force-close-log",
      },
      {
        label: "SMS Log",
        type: "folder",
        path: "/report/sms-log",
      },
      {
        label: "Notification Template Register",
        type: "folder",
        path: "/report/notification-template-register",
      },
      {
        label: "Authorization Matrix Register",
        type: "folder",
        path: "/report/authorization-matrix-register",
      },
    ],
  },
  {
    id: "crm-reports",
    title: "CRM Reports",
    icon: <FileSearch size={18} className="text-white" />,
    items: [
      {
        label: "Prospect Master",
        type: "link",
        path: "/report/prospect-master",
      },
    ],
  },
  {
    id: "project-management",
    title: "Project Management",
    icon: <FileSearch size={18} className="text-white" />,
    items: [
      {
        label: "Project Trials and Analyses",
        type: "link",
        path: "/project/project-trials-analyses",
      },
      {
        label: "Project Based Ledgers / OS",
        type: "link",
        path: "/project/project-based-ledgers-os",
      },
      {
        label: "Stock-Issue-Receipts",
        type: "link",
        path: "/project/stock-issue-receipts",
      },
      {
        label: "Project Material Requisition",
        type: "link",
        path: "/project/project-material-requisition",
      },
      {
        label: "CostSheet-Project-Contract",
        type: "link",
        path: "/project/costsheet-project-contract",
      },
    ],
  },

  {
    id: "country-specification-reports",
    title: "Country Specification Reports",
    icon: <FileSearch size={18} className="text-white" />,
    items: [
      {
        label: "Nepal",
        type: "link",
        path: "/report/nepal",
      },
    ],
  },
  {
    id: "custom-report",
    title: "Custom Report",
    icon: <FileSearch size={18} className="text-white" />,
    items: [],
  },
];

const ReportDashboard: React.FC = () => {
  const { addTab } = useTabs();
  const [reportsData, setReportsData] = useState<ReportSection[]>(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDragOverFav, setIsDragOverFav] = useState(false);

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

  const handleDragStart = (e: React.DragEvent, item: ReportItem) => {
    e.dataTransfer.setData("reportItem", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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
      const favIndex = prevData.findIndex((section) => section.id === "fav");
      if (favIndex === -1) return prevData;

      const favSection = prevData[favIndex];
      const exists = favSection.items.some(
        (item) => item.label === droppedItem.label,
      );

      if (exists) return prevData;

      const updatedFavItems = [...favSection.items, droppedItem];
      const newData = [...prevData];
      newData[favIndex] = { ...favSection, items: updatedFavItems };

      return newData;
    });
  };

  const filteredData = reportsData
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        return item.label.toLowerCase().includes(searchTerm.toLowerCase());
      }),
    }))
    .filter((section) => section.items.length > 0 || section.isFavourite);

  const handleReportClick = (item: ReportItem) => {
    if (item.path) {
      addTab({ name: item.label, path: item.path });
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 font-sans">
      <div className="bg-gray-100 p-3 rounded-md mb-6 flex flex-wrap items-center gap-4 text-sm border border-gray-200">
        <div className="flex items-center gap-2 font-medium text-slate-700">
          <Filter size={16} />
          <span>Filter By Date:</span>
        </div>

        <select
          value={datePreset}
          onChange={handlePresetChange}
          className="px-3 py-1.5 rounded border border-gray-300 bg-white text-slate-700 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
          <option value="this_year">This Year</option>
          <option value="custom">Custom Range</option>
        </select>

        {datePreset === "custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1.5 rounded border border-gray-300 focus:outline-none"
            />
            <span>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1.5 rounded border border-gray-300 focus:outline-none"
            />
          </div>
        )}

        <div className="relative w-full lg:w-96 ml-auto">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search reports..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-gray-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((section) => {
          const dropZoneProps = section.isFavourite
            ? {
                onDragOver: handleDragOver,
                onDragLeave: handleDragLeave,
                onDrop: handleDrop,
              }
            : {};

          return (
            <div
              key={section.id}
              {...dropZoneProps}
              className={`rounded-lg overflow-hidden flex flex-col shadow-sm border border-slate-200 bg-white ${
                section.isFavourite && isDragOverFav
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
            >
              <div className="bg-[#2c4c70] px-3 py-2 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1 rounded-full">
                    {section.icon}
                  </div>
                  <h3 className="font-semibold text-sm tracking-wide">
                    {section.title}
                  </h3>
                  {!section.isFavourite && (
                    <div className="w-3 h-3 bg-red-600 rounded-sm ml-1 shadow-sm"></div>
                  )}
                  {section.isFavourite && (
                    <div className="w-3 h-3 bg-red-600 rounded-sm ml-1 shadow-sm opacity-0"></div>
                  )}
                </div>
              </div>

              <div className="h-[250px] overflow-y-auto custom-scrollbar p-1 relative bg-white">
                {section.isFavourite && (
                  <div
                    className={`m-2 p-3 border-2 border-dashed rounded flex flex-col items-center justify-center text-xs font-medium cursor-pointer transition-colors ${
                      isDragOverFav
                        ? "bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-[#e2e8f0] border-slate-300 text-slate-500"
                    }`}
                  >
                    <PlusCircle size={16} className="mb-1 text-red-500" />
                    {isDragOverFav
                      ? "Drop Report Here!"
                      : "Drop Here To Add To Favourite"}
                  </div>
                )}

                <ul className="space-y-0.5">
                  {section.items.map((item, idx) => (
                    <li
                      key={idx}
                      draggable={!section.isFavourite}
                      onDragStart={(e) => handleDragStart(e, item)}
                      onClick={() => handleReportClick(item)}
                      className={`flex items-start gap-2 px-2 py-1.5 rounded hover:bg-blue-50 text-slate-700 cursor-pointer group/item text-[13px] ${
                        !section.isFavourite
                          ? "cursor-grab active:cursor-grabbing"
                          : ""
                      }`}
                    >
                      {!section.isFavourite && (
                        <GripVertical
                          size={14}
                          className="text-slate-300 opacity-0 group-hover/item:opacity-100 mt-0.5"
                        />
                      )}

                      <div className="mt-0.5 text-[#2c4c70]">
                        <Folder size={16} strokeWidth={1.5} />
                      </div>

                      <span className="leading-5">{item.label}</span>
                    </li>
                  ))}

                  {section.items.length === 0 && !section.isFavourite && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs mt-10">
                      <Search size={20} className="mb-1 opacity-20" />
                      No reports found
                    </div>
                  )}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #94a3b8; }
      `}</style>
    </div>
  );
};

export default ReportDashboard;
