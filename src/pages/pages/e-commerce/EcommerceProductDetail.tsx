import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Save,
  Image as ImageIcon,
  Info,
  ArrowLeft,
  RefreshCw,
  ShoppingBag,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  Layers,
  Maximize,
  Palette,
  FileText,
  Package,
  Globe,
  Tag,
  ChevronRight,
} from "lucide-react";

import { fetchItems } from "../inventory/itemMaster/api/itemService";

// Theme Constants from Modal reference
const THEME_BLUE = "#0f3c63";
const THEME_YELLOW = "#facc15"; // Vivid Yellow for high-contrast actions

const getDisplayValue = (value: any): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return value.item_name || value.name || "";
  return String(value);
};

export default function EcomProductDetail() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showExtendedForm, setShowExtendedForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [ecoData, setEcoData] = useState({
    webTitle: "",
    slug: "",
    brandLabel: "",
    webDesc: "",
    colors: "",
    sizes: "",
    category: "",
    tags: "",
    images: Array(6).fill(null),
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchItems();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (item: any) => {
    setSelectedItem(item);
    setEcoData({
      webTitle: getDisplayValue(item.name || item.item_name),
      slug: String(item.code || "")
        .toLowerCase()
        .replace(/\s+/g, "-"),
      brandLabel: getDisplayValue(item.brand),
      webDesc: "",
      colors: "",
      sizes: "",
      category: getDisplayValue(item.category),
      tags: "",
      images: Array(6).fill(null),
    });
    setShowExtendedForm(true);
  };

  const handleUpdate = (field: string, val: any) =>
    setEcoData((prev) => ({ ...prev, [field]: val }));

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const name = getDisplayValue(item.name || item.item_name).toLowerCase();
      const code = String(item.code || "").toLowerCase();
      return (
        name.includes(searchTerm.toLowerCase()) ||
        code.includes(searchTerm.toLowerCase())
      );
    });
  }, [items, searchTerm]);

  const paginatedData = filteredItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filteredItems.length) || 1;

  if (loading)
    return (
      <div className="h-[90vh] w-full flex items-center justify-center bg-white border rounded-xl">
        <RefreshCw className="animate-spin text-[#0f3c63]" size={40} />
      </div>
    );

  return (
    <div className="relative h-screen w-full bg-[#f4f7f9] flex flex-col overflow-hidden font-sans">
      {/* --- LIST VIEW --- */}
      <div
        className={`flex flex-col flex-1 min-h-0 transition-all duration-300 ${
          showExtendedForm
            ? "opacity-0 scale-95 pointer-events-none"
            : "opacity-100"
        }`}
      >
        <div className="px-8 py-6 flex items-center justify-between shrink-0 bg-white border-b shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-[#0f3c63] p-2.5 rounded-lg text-white">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#0f3c63] tracking-tight">
                E-Commerce Inventory Mapping
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Sync Items to Digital Storefront
              </p>
            </div>
          </div>
          <div className="relative w-96">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search SKU or Name..."
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0f3c63]/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                <tr>
                  <th className="px-8 py-5">Product Information</th>
                  <th className="px-6 py-5">Brand/Category</th>
                  <th className="px-6 py-5 text-right">Price (MRP/Rate)</th>
                  <th className="px-6 py-5 text-center">Stock</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-blue-50/20 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="font-bold text-gray-800 group-hover:text-[#0f3c63]">
                        {getDisplayValue(item.name || item.item_name)}
                      </div>
                      <div className="text-[10px] font-mono text-gray-400">
                        {item.code}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-xs font-bold text-gray-600 uppercase tracking-tight">
                        {getDisplayValue(item.brand)}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {getDisplayValue(item.category)}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="text-[10px] text-gray-300 line-through">
                        ₹{Number(item.sales_rate || 0) + 500}
                      </div>
                      <div className="text-sm font-black text-[#0f3c63]">
                        ₹{item.sales_rate || 0}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="bg-red-50 text-red-500 px-3 py-1 rounded-md text-[10px] font-black uppercase">
                        {item.closing_stock || 0} QTY
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => openDetail(item)}
                        className="p-2.5 text-gray-400 hover:text-[#0f3c63] hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                      >
                        <Plus size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- DETAIL PANEL (SLIDE IN) --- */}
      {showExtendedForm && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-right duration-500">
          {/* Header Bar */}
          <div className="px-8 py-4 flex items-center justify-between shrink-0 bg-[#0f3c63] text-white">
            <button
              onClick={() => setShowExtendedForm(false)}
              className="flex items-center gap-2 font-black text-[11px] uppercase tracking-[0.2em] hover:text-yellow-400 transition-colors"
            >
              <ArrowLeft size={20} /> Back
            </button>
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">
                Editing SKU:{" "}
                <span className="text-white">{selectedItem?.code}</span>
              </span>
              <button className="bg-[#facc15] text-[#0f3c63] px-8 py-2.5 rounded-lg text-xs font-black uppercase flex items-center gap-2 shadow-lg hover:bg-yellow-300 active:scale-95 transition-all">
                <Save size={16} /> Sync Item
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-10">
            <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
              {/* Left Column: Form Details */}
              <div className="col-span-12 lg:col-span-8 space-y-8">
                {/* 1. Web Presentation Section */}
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#0f3c63]" />
                  <h4 className="text-[11px] font-black text-[#0f3c63] uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <Globe size={16} className="text-blue-400" /> Web
                    Presentation
                  </h4>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="col-span-2 flex flex-col gap-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Product Display Title
                      </label>
                      <input
                        className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#0f3c63]/10 outline-none transition-all"
                        value={ecoData.webTitle}
                        onChange={(e) =>
                          handleUpdate("webTitle", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-2 flex flex-col gap-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Store Description
                      </label>
                      <textarea
                        rows={5}
                        className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0f3c63]/10 outline-none transition-all resize-none"
                        placeholder="Web marketing text..."
                        value={ecoData.webDesc}
                        onChange={(e) =>
                          handleUpdate("webDesc", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Technical Specs Section */}
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#0f3c63]" />
                  <h4 className="text-[11px] font-black text-[#0f3c63] uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <Layers size={16} className="text-blue-400" /> Technical
                    Specs
                  </h4>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Palette size={14} /> Colors
                      </label>
                      <input
                        className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        value={ecoData.colors}
                        onChange={(e) => handleUpdate("colors", e.target.value)}
                        placeholder="e.g. Red, Blue, Black"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Maximize size={14} /> Sizes
                      </label>
                      <input
                        className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        value={ecoData.sizes}
                        onChange={(e) => handleUpdate("sizes", e.target.value)}
                        placeholder="e.g. S, M, L, XL"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Cards */}
              <div className="col-span-12 lg:col-span-4 space-y-8">
                {/* Commercials Card */}
                <div className="bg-[#0f3c63] p-8 rounded-3xl shadow-2xl relative overflow-hidden text-white">
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                  <h4 className="text-[10px] font-black uppercase text-blue-300 mb-6 tracking-[0.2em] flex items-center gap-2">
                    <Wallet size={16} /> Commercials
                  </h4>
                  <div className="space-y-6">
                    <div className="flex justify-between items-end border-b border-white/10 pb-4">
                      <span className="text-xs text-blue-200 font-medium">
                        Inventory Rate:
                      </span>
                      <span className="text-xl font-black">
                        ₹{selectedItem?.sales_rate?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-blue-200 font-medium">
                        Current Margin:
                      </span>
                      <div className="text-right">
                        <span className="text-3xl font-black text-yellow-400">
                          ₹
                          {(
                            (selectedItem?.sales_rate || 0) -
                            (selectedItem?.cost_price || 0)
                          ).toLocaleString()}
                        </span>
                        <div className="text-[9px] font-black text-green-400 uppercase tracking-tighter">
                          Profit Projected
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gallery Card */}
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex justify-between items-center">
                    Gallery Assets
                    <span className="text-[9px] bg-gray-100 px-2 py-1 rounded text-gray-500">
                      MAX 6
                    </span>
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {ecoData.images.map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300 hover:border-[#0f3c63] hover:text-[#0f3c63] cursor-pointer transition-all group"
                      >
                        <ImageIcon
                          size={20}
                          className="group-hover:scale-110 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Classification Card */}
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6">
                    Classification
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <Tag size={16} className="text-[#0f3c63]" />
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase">
                          Brand
                        </p>
                        <p className="text-xs font-bold text-gray-700">
                          {getDisplayValue(selectedItem?.brand) || "Unbranded"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <Package size={16} className="text-[#0f3c63]" />
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase">
                          Category
                        </p>
                        <p className="text-xs font-bold text-gray-700">
                          {getDisplayValue(selectedItem?.category) || "General"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
