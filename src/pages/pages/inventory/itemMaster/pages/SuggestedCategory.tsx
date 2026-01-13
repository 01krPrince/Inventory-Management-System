import React, { useEffect, useState, useMemo } from "react";
import { fetchItems } from "../api/itemService";
import { ItemApiData } from "../models/ItemModel";

interface SuggestedCategoryProps {
  onSelectionChange: (selectedIds: string[]) => void;
  selectedItemIds: string[];
}

const SuggestedCategory: React.FC<SuggestedCategoryProps> = ({
  onSelectionChange,
  selectedItemIds,
}) => {
  const [items, setItems] = useState<ItemApiData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchItems();
        setItems(data);
      } catch (err) {
        setError("Failed to load items.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Admin Search Logic
  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const handleToggle = (itemId: string) => {
    const updatedIds = selectedItemIds.includes(itemId)
      ? selectedItemIds.filter((id) => id !== itemId)
      : [...selectedItemIds, itemId];
    onSelectionChange(updatedIds);
  };

  if (loading)
    return (
      <div className="p-4 text-center text-xs text-gray-500 italic">
        Fetching inventory...
      </div>
    );
  if (error)
    return (
      <div className="p-4 text-center text-xs text-red-500 font-medium">
        {error}
      </div>
    );

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden mt-2">
      {/* Search Header */}
      <div className="p-2 bg-gray-50 border-b flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by name or code..."
          className="flex-grow px-3 py-1 text-sm border border-gray-300 rounded focus:border-[#0c5888] outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="text-[10px] font-bold text-[#0c5888] bg-blue-50 px-2 py-1 rounded border border-[#0c5888]/20">
          {selectedItemIds.length} SELECTED
        </div>
      </div>

      {/* Admin Compact Table */}
      <div className="max-h-[250px] overflow-y-auto">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="sticky top-0 bg-[#0c5888] text-white text-[11px] uppercase z-10">
            <tr>
              <th className="p-2 w-10 text-center">Set</th>
              <th className="p-2 w-1/2">Item Detail</th>
              <th className="p-2">Category</th>
              <th className="p-2 text-right">Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredItems.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-4 text-center text-gray-400 text-xs"
                >
                  No matching items found.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const isSelected = selectedItemIds.includes(item._id || "");
                const categoryName =
                  typeof item.category === "object"
                    ? item.category?.name
                    : item.category;

                return (
                  <tr
                    key={item._id}
                    onClick={() => handleToggle(item._id || "")}
                    className={`group cursor-pointer transition-colors hover:bg-gray-50 ${
                      isSelected ? "bg-blue-50/40" : ""
                    }`}
                  >
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 accent-[#0c5888] cursor-pointer"
                        checked={isSelected}
                        readOnly
                      />
                    </td>
                    <td className="p-2 overflow-hidden">
                      <div
                        className="font-medium text-gray-800 text-xs truncate"
                        title={item.name || ""}
                      >
                        {item.name}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono italic">
                        {item.code || "No Code"}
                      </div>
                    </td>
                    <td className="p-2 text-[10px] text-gray-500 truncate">
                      {categoryName || "—"}
                    </td>
                    <td className="p-2 text-right">
                      <div className="text-xs font-bold text-gray-700">
                        ₹{item.sales_rate}
                      </div>
                      <div className="text-[9px] text-gray-400 uppercase">
                        {item.unit_option}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Action Footer */}
      <div className="p-2 border-t bg-gray-50 flex justify-end gap-2">
        <button
          onClick={() => onSelectionChange([])}
          className="px-3 py-1 text-[10px] font-bold text-gray-500 hover:text-red-600 transition-colors"
        >
          CLEAR ALL
        </button>
        <button
          className="bg-[#0c5888] text-white text-[11px] font-bold px-4 py-1 rounded hover:bg-[#0a4a70] transition-colors shadow-sm"
          disabled={selectedItemIds.length === 0}
        >
          CONFIRM SELECTION ({selectedItemIds.length})
        </button>
      </div>
    </div>
  );
};

export default SuggestedCategory;
