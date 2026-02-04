import React, { useState, useEffect, useMemo } from 'react';
import { Search, RotateCw, FileText, ArrowUp, X } from 'lucide-react';
import itemBalanceService, {
  ItemBalance,
} from '../pages/pages/inventory/itemMaster/api/itemBalanceService';

interface ItemWithBalanceProps {
  storeCode: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedItems: (ItemBalance & { quantity: number })[]) => void;
}

const ItemWithBalance: React.FC<ItemWithBalanceProps> = ({
  storeCode,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [items, setItems] = useState<ItemBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // Filters
  const [selectedGroup, setSelectedGroup] = useState('Select...');
  const [selectedBrand, setSelectedBrand] = useState('Select...');
  const [selectedCategory, setSelectedCategory] = useState('Select...');

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ItemBalance;
    direction: 'asc' | 'desc';
  } | null>({
    key: 'name',
    direction: 'asc',
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
      setCurrentPage(1);
    }
  }, [isOpen, storeCode]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await itemBalanceService.getBalanceByStore(storeCode);
      if (response.success) setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch items', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = useMemo(() => {
    const groups = Array.from(new Set(items.map((i) => i.group)))
      .filter(Boolean)
      .sort();
    const brands = Array.from(new Set(items.map((i) => i.brand)))
      .filter(Boolean)
      .sort();
    const categories = Array.from(new Set(items.map((i) => i.category)))
      .filter(Boolean)
      .sort();
    return { groups, brands, categories };
  }, [items]);

  const filteredAndSortedItems = useMemo(() => {
    const filtered = items.filter((item) => {
      const isSelected = selectedIds.has(item.code);
      if (isSelected) return true;

      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.barcode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGroup = selectedGroup === 'Select...' || item.group === selectedGroup;
      const matchesBrand = selectedBrand === 'Select...' || item.brand === selectedBrand;
      const matchesCategory =
        selectedCategory === 'Select...' || item.category === selectedCategory;

      return matchesSearch && matchesGroup && matchesBrand && matchesCategory;
    });

    // 2. Multi-level Sort: Pinned (Selected) first, then User Sort
    return [...filtered].sort((a, b) => {
      const aSelected = selectedIds.has(a.code);
      const bSelected = selectedIds.has(b.code);

      // Rule 1: Selected items go to the top
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;

      // Rule 2: Follow user sorting preference for both groups
      if (sortConfig) {
        const { key, direction } = sortConfig;
        const aVal = a[key] ?? '';
        const bVal = b[key] ?? '';
        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [items, searchTerm, selectedGroup, selectedBrand, selectedCategory, sortConfig, selectedIds]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedItems, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);

  const toggleSelectItem = (code: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const handleQtyChange = (code: string, val: string) => {
    const num = parseFloat(val) || 0;
    setQuantities((prev) => ({ ...prev, [code]: num }));
    if (num > 0 && !selectedIds.has(code)) toggleSelectItem(code);
  };

  // --- FIX: SUBMIT ALL SELECTED ITEMS ---
  const handleConfirm = () => {
    const finalSelection = items
      .filter((item) => selectedIds.has(item.code))
      .map((item) => ({
        ...item,
        quantity: quantities[item.code] || 1,
      }));

    if (finalSelection.length > 0) {
      onConfirm(finalSelection);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 font-sans text-xs">
      <div className="flex h-[70vh] w-full max-w-7xl flex-col rounded bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-[#0f3c63] px-4 py-2 text-white">
          <span className="font-bold">Item With Balance</span>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4 grid grid-cols-12 items-end gap-3">
            <div className="col-span-3">
              <label className="mb-1 block font-bold text-gray-700">Item Group</label>
              <select
                className="w-full border p-1 outline-none"
                value={selectedGroup}
                onChange={(e) => {
                  setSelectedGroup(e.target.value);
                  setCurrentPage(1);
                }}>
                <option>Select...</option>
                {filterOptions.groups.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-3">
              <label className="mb-1 block font-bold text-gray-700">Brand</label>
              <select
                className="w-full border p-1 outline-none"
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setCurrentPage(1);
                }}>
                <option>Select...</option>
                {filterOptions.brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-3">
              <label className="mb-1 block font-bold text-gray-700">Category</label>
              <select
                className="w-full border p-1 outline-none"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}>
                <option>Select...</option>
                {filterOptions.categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-3 flex gap-1">
              <button className="bg-[#0f3c63] px-4 py-1.5 font-bold text-white">FilterList</button>
              <button
                className="bg-[#0f3c63] px-4 py-1.5 font-bold text-white"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGroup('Select...');
                  setSelectedBrand('Select...');
                  setSelectedCategory('Select...');
                  setCurrentPage(1);
                }}>
                Clear
              </button>
            </div>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={loadData}
                className="border border-[#0f3c63] p-1 text-[#0f3c63] hover:bg-gray-100">
                <RotateCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
              <button className="bg-[#0f3c63] p-1 text-white">
                <FileText size={16} />
              </button>
            </div>
            <div className="flex items-center border border-gray-300 px-2 py-1">
              <Search size={14} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="ml-2 w-64 outline-none"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="max-h-[400px] overflow-auto border border-gray-200">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-[#0f3c63] text-white">
                <tr className="text-left">
                  <th className="w-10 border-r border-white/20 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.size === filteredAndSortedItems.length && items.length > 0
                      }
                      onChange={() => {
                        if (selectedIds.size === filteredAndSortedItems.length)
                          setSelectedIds(new Set());
                        else setSelectedIds(new Set(filteredAndSortedItems.map((i) => i.code)));
                      }}
                    />
                  </th>
                  {['Code', 'Name', 'Barcode', 'Balance', 'Quantity', 'Rate'].map((h) => (
                    <th
                      key={h}
                      className="cursor-pointer border-r border-white/20 p-2 hover:bg-[#0c3150]"
                      onClick={() =>
                        setSortConfig({
                          key: h.toLowerCase() as any,
                          direction: sortConfig?.direction === 'asc' ? 'desc' : 'asc',
                        })
                      }>
                      <div className="flex items-center justify-between">
                        {h} <ArrowUp size={10} className="opacity-30" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedItems.map((item) => {
                  const isSelected = selectedIds.has(item.code);
                  return (
                    <tr
                      key={item.code}
                      className={`hover:bg-blue-50 ${isSelected ? 'bg-blue-100 font-bold' : ''}`}>
                      <td className="border-r p-2 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(item.code)}
                        />
                      </td>
                      <td className="border-r p-2">{item.code}</td>
                      <td className="border-r p-2 font-semibold text-gray-800">{item.name}</td>
                      <td className="border-r p-2">{item.barcode}</td>
                      <td className="border-r p-2 text-center font-bold text-blue-800">
                        {item.balance}
                      </td>
                      <td className="border-r p-1 text-center">
                        <input
                          type="number"
                          min={0}
                          step={1}
                          onWheel={(e) => e.currentTarget.blur()}
                          className="w-16 border border-gray-300 p-0.5 text-center outline-none"
                          value={quantities[item.code] ?? ''}
                          onChange={(e) => handleQtyChange(item.code, e.target.value)}
                          placeholder="0"
                        />
                      </td>
                      <td className="p-2 text-right">{item.last_sales_rate?.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={handleConfirm}
                className="bg-[#0f3c63] px-8 py-1.5 font-bold text-white hover:opacity-90">
                OK
              </button>
              <button
                onClick={onClose}
                className="bg-[#0f3c63] px-8 py-1.5 font-bold text-white hover:opacity-90">
                Exit
              </button>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`border px-3 py-1 ${currentPage === i + 1 ? 'bg-[#0f3c63] text-white' : 'bg-white text-gray-700'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemWithBalance;
