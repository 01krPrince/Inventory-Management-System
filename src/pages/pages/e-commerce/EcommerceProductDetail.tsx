import { useState, useEffect, useMemo } from 'react';
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
} from 'lucide-react';

import { fetchItems } from '../inventory/itemMaster/api/itemService';

const getDisplayValue = (value: any): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return value.item_name || value.name || '';
  return String(value);
};

export default function EcomProductDetail() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [currentPage] = useState(1);
  const pageSize = 15;

  const [ecoData, setEcoData] = useState({
    webTitle: '',
    webDesc: '',
    colors: '',
    sizes: '',
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
        webDesc: '',
        colors: '',
        sizes: '',
        images: Array(6).fill(null),
      });
    }
  };

  const handleUpdate = (field: string, val: any) =>
    setEcoData((prev) => ({ ...prev, [field]: val }));

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const name = getDisplayValue(item.name || item.item_name).toLowerCase();
      const code = String(item.code || '').toLowerCase();
      return name.includes(searchTerm.toLowerCase()) || code.includes(searchTerm.toLowerCase());
    });
  }, [items, searchTerm]);

  const paginatedData = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading)
    return (
      <div className="flex h-[90vh] w-full items-center justify-center bg-white">
        <RefreshCw className="animate-spin text-[#0f3c63]" size={32} />
      </div>
    );

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#f4f7f9] font-sans">
      <div className="flex shrink-0 items-center justify-between border-b bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#0f3c63] p-2 text-white">
            <ShoppingBag size={20} />
          </div>
          <h1 className="text-lg font-black tracking-tight text-[#0f3c63]">Inventory Mapping</h1>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#0f3c63]/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto max-w-6xl space-y-2">
          {paginatedData.map((item) => {
            const isExpanded = expandedItemId === item.code;
            return (
              <div
                key={item.code}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all">
                <div
                  onClick={() => toggleExpand(item)}
                  className={`flex cursor-pointer items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50 ${
                    isExpanded ? 'border-b bg-blue-50/30' : ''
                  }`}>
                  <div className="flex items-center gap-10">
                    <div className="w-48">
                      <p className="truncate text-sm font-bold text-gray-800">
                        {getDisplayValue(item.name || item.item_name)}
                      </p>
                      <p className="font-mono text-[10px] text-gray-400">{item.code}</p>
                    </div>
                    <div className="w-32">
                      <p className="text-[10px] font-black uppercase text-gray-400">Category</p>
                      <p className="truncate text-xs font-bold text-gray-600">
                        {getDisplayValue(item.category)}
                      </p>
                    </div>
                    <div className="w-24 text-right">
                      <p className="text-[10px] font-black uppercase text-gray-400">Rate</p>
                      <p className="text-sm font-black text-[#0f3c63]">₹{item.sales_rate || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded px-3 py-1 text-[10px] font-black ${
                        Number(item.closing_stock) > 0
                          ? 'bg-green-50 text-green-600'
                          : 'bg-red-50 text-red-500'
                      }`}>
                      {item.closing_stock || 0} IN STOCK
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={18} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="animate-in slide-in-from-top-2 grid grid-cols-12 gap-6 bg-white p-6 duration-200">
                    <div className="col-span-8 space-y-4">
                      <div>
                        <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-400">
                          Web Title
                        </label>
                        <input
                          className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm"
                          value={ecoData.webTitle}
                          onChange={(e) => handleUpdate('webTitle', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <Palette size={12} /> Colors
                          </label>
                          <input
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm"
                            placeholder="Red, Blue..."
                            value={ecoData.colors}
                            onChange={(e) => handleUpdate('colors', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="mb-1 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <Maximize size={12} /> Sizes
                          </label>
                          <input
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm"
                            placeholder="S, M, L..."
                            value={ecoData.sizes}
                            onChange={(e) => handleUpdate('sizes', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-400">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm"
                          value={ecoData.webDesc}
                          onChange={(e) => handleUpdate('webDesc', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-span-4 space-y-4">
                      <div className="rounded-xl bg-[#0f3c63] p-4 text-white">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-blue-200">
                            Projected Margin
                          </span>
                          <Wallet size={14} className="text-yellow-400" />
                        </div>
                        <p className="text-2xl font-black text-yellow-400">
                          ₹
                          {(
                            Number(item.sales_rate) - Number(item.cost_price || 0)
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {ecoData.images.map((_, i) => (
                          <div
                            key={i}
                            className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-gray-300 transition-colors hover:text-[#0f3c63]">
                            <ImageIcon size={16} />
                          </div>
                        ))}
                      </div>

                      <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#facc15] py-3 text-xs font-black uppercase text-[#0f3c63] shadow-sm transition-all hover:bg-yellow-300 active:scale-95">
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
