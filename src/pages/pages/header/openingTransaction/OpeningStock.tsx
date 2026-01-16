import React, { useState, useEffect } from "react";
import { Search, Save, Check, Plus } from "lucide-react";
import Dropdown from "../../../../components/Dropdown";
import { LocationMaster } from "../../../../components/LocationMaster";
import {
  fetchAllLocations,
  LocationMaster as LocationMasterType,
} from "../../inventory/stockAdjustment/api/LocationMaster";
import { openingStockService } from "../../../../services/header/openingTransaction/openingStockService";
import { ItemApiData } from "../../inventory/itemMaster/models/ItemModel";
import { fetchItems } from "../../inventory/itemMaster/api/itemService";

// --- Interfaces ---
interface OpeningStockFormData {
  storeName: string;
  storeId: string;
  voucherDate: string;
  remarks: string;
}

interface ItemRow {
  _id: string;
  item_name: string;
  code: string;
  barcode: string;
  unit: string;
  batch_no: string;
  quantity: number;
  rate: number;
  amount: number;
  sale_rate: number;
  mrp: number;
  category_name: string;
}

const OpeningStock: React.FC = () => {
  const dropdownZIndex = 1000;
  const modalZIndex = 1010;

  // --- State ---
  const [formData, setFormData] = useState<OpeningStockFormData>({
    storeName: "",
    storeId: "",
    voucherDate: new Date().toISOString().split("T")[0],
    remarks: "Initial stock entry for new financial year",
  });

  const [storeList, setStoreList] = useState<LocationMasterType[]>([]);
  const [isLocationMasterOpen, setIsLocationMasterOpen] = useState(false);

  const [availableItems, setAvailableItems] = useState<ItemApiData[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [tableItems, setTableItems] = useState<ItemRow[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- Initial Store Load ---
  useEffect(() => {
    const init = async () => {
      try {
        const stores = (await fetchAllLocations()) as any;
        setStoreList(Array.isArray(stores) ? stores : stores?.data || []);
      } catch (e) {
        console.error("Error fetching stores:", e);
      }
    };
    init();
  }, []);

  // --- Core Logic: Load existing OR provide selection ---
  const handleLoadItems = async () => {
    if (!formData.storeId) {
      alert("Please select a store first");
      return;
    }

    setIsLoading(true);
    setIsSelectionMode(false);
    setTableItems([]);

    try {
      let existingItems = [];

      try {
        // 1. Try to get existing stock for the selected store
        const res = await openingStockService.getStockByStore(formData.storeId);
        if (res.success && (res.data?.items || res.items)) {
          existingItems = res.data?.items || res.items || [];
        }
      } catch (err: any) {
        // 2. Handle 404 (No record exists) gracefully
        if (err.response?.status === 404) {
          console.log(
            "No existing record for this store. Loading master items."
          );
        } else {
          throw err;
        }
      }

      if (existingItems.length > 0) {
        // Load existing items into the entry table
        const mappedItems: ItemRow[] = existingItems.map((apiItem: any) => ({
          _id: apiItem.item?._id || apiItem.item || "",
          item_name:
            apiItem.description || apiItem.item?.name || "Unknown Item",
          code: apiItem.itemcode || apiItem.item?.code || "",
          barcode: apiItem.barcode || "",
          unit: "Unit",
          batch_no: apiItem.batchNo || "",
          quantity: apiItem.quantity || 0,
          rate: apiItem.rate || 0,
          amount: apiItem.amount || 0,
          sale_rate: apiItem.sale_rate || 0,
          mrp: apiItem.mrp || 0,
          category_name: apiItem.item?.category?.name || "General",
        }));
        setTableItems(mappedItems);
      } else {
        // 3. If no record, fetch all items from Master for manual selection
        const masterItems = await fetchItems();
        setAvailableItems(masterItems);
        setIsSelectionMode(true);
      }
    } catch (error) {
      console.error("Error in handleLoadItems:", error);
      alert("Failed to load data. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const addSelectedToTable = () => {
    const newRows: ItemRow[] = availableItems
      .filter((item) => selectedItemIds.includes(item._id))
      .map((item) => ({
        _id: item._id,
        item_name: item.name,
        code: item.code,
        barcode: item.barcode || "",
        unit: (item.stock_unit as any)?.name || "Unit",
        batch_no: "",
        quantity: 0,
        rate: item.purchase_rate || 0,
        amount: 0,
        sale_rate: item.sales_rate || 0,
        mrp: item.mrp || 0,
        category_name: (item.category as any)?.name || "General",
      }));

    setTableItems(newRows);
    setIsSelectionMode(false);
    setSelectedItemIds([]);
  };

  const handleRowChange = (code: string, field: keyof ItemRow, value: any) => {
    setTableItems((prev) =>
      prev.map((item) => {
        if (item.code === code) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "rate") {
            updated.amount =
              Number(updated.quantity || 0) * Number(updated.rate || 0);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleSave = async () => {
    const activeItems = tableItems.filter((i) => Number(i.quantity) > 0);

    if (!activeItems.length) {
      return alert("Please enter quantity for at least one item.");
    }

    // Mapping payload to match Postman exactly
    const payload = {
      store: formData.storeId,
      voucherDate: formData.voucherDate,
      remarks: formData.remarks,
      items: activeItems.map((i) => ({
        item: i._id,
        itemcode: i.code,
        description: i.item_name,
        batchNo: i.batch_no || "NA",
        packQty: 1,
        quantity: Number(i.quantity),
        rate: Number(i.rate),
        amount: Number(i.amount),
        itemBalance: Number(i.quantity), // Required by backend based on Postman success
      })),
    };

    try {
      const res = await openingStockService.createOpeningStock(payload as any);
      if (res.success) {
        alert("Opening Stock saved successfully!");
        setTableItems([]);
      } else {
        alert(`Server Error: ${res.message}`);
      }
    } catch (e: any) {
      console.error("Save Error:", e.response?.data || e.message);
      alert("Failed to save stock. Check console for details.");
    }
  };

  const filteredMaster = availableItems.filter(
    (i) =>
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-6 py-4 bg-white min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-6 border-b pb-6">
        <div className="flex gap-8 w-3/4">
          <div className="w-1/3">
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              STORE ★
            </label>
            <div className="flex gap-1">
              <Dropdown<LocationMasterType>
                data={storeList}
                columns={[{ header: "Name", key: "name", width: "w-full" }]}
                value={formData.storeName}
                valueKey="name"
                onChange={(item) =>
                  setFormData((p) => ({
                    ...p,
                    storeName: item?.name || "",
                    storeId: (item as any)?._id || "",
                  }))
                }
                placeholder="Select Store"
                zIndex={dropdownZIndex}
              />
              <ActionBtn
                icon={<Plus size={16} />}
                onClick={() => setIsLocationMasterOpen(true)}
              />
            </div>
          </div>
          <div className="w-1/2">
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              REMARKS
            </label>
            <input
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:ring-1 focus:ring-[#0f3c63]"
              value={formData.remarks}
              onChange={(e) =>
                setFormData((p) => ({ ...p, remarks: e.target.value }))
              }
            />
          </div>
        </div>
        <button
          onClick={handleLoadItems}
          disabled={!formData.storeId || isLoading}
          className="bg-[#0f3c63] text-white px-8 py-2 rounded font-medium disabled:opacity-50 hover:bg-[#1a4b75]"
        >
          {isLoading ? "Loading..." : "Load Items"}
        </button>
      </div>

      {/* SELECTION MODE: Checkbox List */}
      {isSelectionMode && (
        <div className="bg-gray-50 p-4 rounded-lg border border-blue-100 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[#0f3c63]">Pick Items from Master</h3>
            <div className="flex gap-3">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  placeholder="Search Master..."
                  className="pl-9 pr-4 py-1 border rounded text-sm w-64 focus:ring-1 focus:ring-blue-400 outline-none"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={addSelectedToTable}
                className="bg-green-600 text-white px-4 py-1 rounded text-sm flex items-center gap-2 hover:bg-green-700"
              >
                <Check size={16} /> Add Selected ({selectedItemIds.length})
              </button>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto bg-white border rounded">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50 border-b">
                <tr>
                  <th className="p-2 w-10"></th>
                  <th className="p-2 text-left text-gray-500">Code</th>
                  <th className="p-2 text-left text-gray-500">Item Name</th>
                  <th className="p-2 text-left text-gray-500">Category</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaster.map((item) => (
                  <tr
                    key={item._id}
                    className={`border-b hover:bg-blue-50 cursor-pointer ${
                      selectedItemIds.includes(item._id) ? "bg-blue-50/50" : ""
                    }`}
                    onClick={() => toggleItemSelection(item._id)}
                  >
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedItemIds.includes(item._id)}
                        onChange={() => {}}
                      />
                    </td>
                    <td className="p-2">{item.code}</td>
                    <td className="p-2 font-medium">{item.name}</td>
                    <td className="p-2 text-gray-500">
                      {(item.category as any)?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ENTRY LIST: The Editable Grid */}
      {tableItems.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold text-[#0f3c63] uppercase tracking-wide">
              Opening Entry List
            </h2>
            <button
              onClick={handleSave}
              className="bg-green-700 text-white px-6 py-2 rounded flex items-center gap-2 shadow hover:bg-green-800 transition-colors"
            >
              <Save size={18} /> Save Opening Stock
            </button>
          </div>
          <div className="border rounded shadow-sm overflow-hidden bg-white">
            <table className="w-full text-[13px]">
              <thead className="bg-[#003f6b] text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Item Details</th>
                  <th className="px-4 py-3 text-left w-32">Batch No</th>
                  <th className="px-4 py-3 text-left w-24">Qty</th>
                  <th className="px-4 py-3 text-left w-28">Rate</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left w-28">Sale Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tableItems.map((item) => (
                  <tr key={item.code} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <div className="font-bold text-gray-800">
                        {item.item_name}
                      </div>
                      <div className="text-[11px] text-gray-400 font-medium">
                        {item.code} | {item.category_name}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <input
                        className="w-full border rounded px-2 py-1 focus:border-blue-400 outline-none"
                        value={item.batch_no}
                        onChange={(e) =>
                          handleRowChange(item.code, "batch_no", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        className="w-full border border-blue-200 rounded px-2 py-1 font-bold text-blue-800 bg-blue-50/30"
                        value={item.quantity}
                        onChange={(e) =>
                          handleRowChange(item.code, "quantity", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        className="w-full border rounded px-2 py-1"
                        value={item.rate}
                        onChange={(e) =>
                          handleRowChange(item.code, "rate", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-4 py-2 font-bold text-gray-700">
                      ₹{item.amount.toLocaleString()}
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        className="w-full border rounded px-2 py-1"
                        value={item.sale_rate}
                        onChange={(e) =>
                          handleRowChange(
                            item.code,
                            "sale_rate",
                            e.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LOCATION MASTER MODAL */}
      {isLocationMasterOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[2000]">
          <LocationMaster
            onClose={() => setIsLocationMasterOpen(false)}
            onSuccess={async () => {
              const res = (await fetchAllLocations()) as any;
              setStoreList(Array.isArray(res) ? res : res?.data || []);
            }}
            index={modalZIndex}
          />
        </div>
      )}
    </div>
  );
};

const ActionBtn = ({
  icon,
  onClick,
}: {
  icon: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="h-[34px] w-[34px] bg-[#0f3c63] text-white flex items-center justify-center rounded hover:bg-[#1a4b75] transition-colors shadow-sm"
  >
    {icon}
  </button>
);

export default OpeningStock;
