import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Save,
  Image as ImageIcon,
  RefreshCw,
  ShoppingBag,
  Wallet,
  Maximize,
  Palette,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { fetchItems } from "../inventory/itemMaster/api/itemService";

const getDisplayValue = (value: any): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return value.item_name || value.name || "";
  return String(value);
};

export default function EcomProductDetail() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // Track the ID or Code of the currently expanded item
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [currentPage] = useState(1);
  const pageSize = 15;

  const [ecoData, setEcoData] = useState({
    webTitle: "",
    webDesc: "",
    colors: "",
    sizes: "",
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

  const toggleExpand = (item: any) => {
    if (expandedItemId === item.code) {
      setExpandedItemId(null);
    } else {
      setExpandedItemId(item.code);
      setEcoData({
        webTitle: getDisplayValue(item.name || item.item_name),
        webDesc: "",
        colors: "",
        sizes: "",
        images: Array(6).fill(null),
      });
    }
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

  if (loading)
    return (
      <div className="h-[90vh] w-full flex items-center justify-center bg-white">
        <RefreshCw className="animate-spin text-[#0f3c63]" size={32} />
      </div>
    );

  return (
    <div className="h-screen w-full bg-[#f4f7f9] flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between bg-white border-b shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-[#0f3c63] p-2 rounded-lg text-white">
            <ShoppingBag size={20} />
          </div>
          <h1 className="text-lg font-black text-[#0f3c63] tracking-tight">
            Inventory Mapping
          </h1>
        </div>
        <div className="relative w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#0f3c63]/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main List Area */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-6xl mx-auto space-y-2">
          {paginatedData.map((item) => {
            const isExpanded = expandedItemId === item.code;
            return (
              <div
                key={item.code}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleExpand(item)}
                  className={`px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${
                    isExpanded ? "bg-blue-50/30 border-b" : ""
                  }`}
                >
                  <div className="flex gap-10 items-center">
                    <div className="w-48">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {getDisplayValue(item.name || item.item_name)}
                      </p>
                      <p className="text-[10px] font-mono text-gray-400">
                        {item.code}
                      </p>
                    </div>
                    <div className="w-32">
                      <p className="text-[10px] uppercase font-black text-gray-400">
                        Category
                      </p>
                      <p className="text-xs font-bold text-gray-600 truncate">
                        {getDisplayValue(item.category)}
                      </p>
                    </div>
                    <div className="w-24 text-right">
                      <p className="text-[10px] uppercase font-black text-gray-400">
                        Rate
                      </p>
                      <p className="text-sm font-black text-[#0f3c63]">
                        ₹{item.sales_rate || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded text-[10px] font-black ${
                        Number(item.closing_stock) > 0
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {item.closing_stock || 0} IN STOCK
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={18} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Accordion Body (The "Popup" details moved here) */}
                {isExpanded && (
                  <div className="p-6 bg-white grid grid-cols-12 gap-6 animate-in slide-in-from-top-2 duration-200">
                    {/* Left: Form */}
                    <div className="col-span-8 space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                          Web Title
                        </label>
                        <input
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                          value={ecoData.webTitle}
                          onChange={(e) =>
                            handleUpdate("webTitle", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                            <Palette size={12} /> Colors
                          </label>
                          <input
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                            placeholder="Red, Blue..."
                            value={ecoData.colors}
                            onChange={(e) =>
                              handleUpdate("colors", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                            <Maximize size={12} /> Sizes
                          </label>
                          <input
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                            placeholder="S, M, L..."
                            value={ecoData.sizes}
                            onChange={(e) =>
                              handleUpdate("sizes", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none"
                          value={ecoData.webDesc}
                          onChange={(e) =>
                            handleUpdate("webDesc", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Right: Gallery & Action */}
                    <div className="col-span-4 space-y-4">
                      <div className="bg-[#0f3c63] p-4 rounded-xl text-white">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold text-blue-200">
                            Projected Margin
                          </span>
                          <Wallet size={14} className="text-yellow-400" />
                        </div>
                        <p className="text-2xl font-black text-yellow-400">
                          ₹
                          {(
                            Number(item.sales_rate) -
                            Number(item.cost_price || 0)
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {ecoData.images.map((_, i) => (
                          <div
                            key={i}
                            className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300 hover:text-[#0f3c63] cursor-pointer transition-colors"
                          >
                            <ImageIcon size={16} />
                          </div>
                        ))}
                      </div>

                      <button className="w-full bg-[#facc15] text-[#0f3c63] py-3 rounded-lg text-xs font-black uppercase flex items-center justify-center gap-2 shadow-sm hover:bg-yellow-300 active:scale-95 transition-all">
                        <Save size={16} /> Save & Sync
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
