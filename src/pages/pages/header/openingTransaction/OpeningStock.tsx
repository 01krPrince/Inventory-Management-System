import React, { useState, useEffect, useMemo } from "react";
import { Edit as EditIcon, Search } from "lucide-react";
import Dropdown from "../../../../components/Dropdown";
import { LocationMaster } from "../../../../components/LocationMaster";
import {
  fetchAllLocations,
  LocationMaster as LocationMasterType,
} from "../../inventory/stockAdjustment/api/LocationMaster";

// --- Interfaces ---
interface OpeningStockFormData {
  store: string;
}

interface ItemRow {
  item_name: string;
  code: string;
  barcode: string;
  unit: string;
  batch_no: string;
  pack_qty: string;
  quantity: number;
  rate: number;
  amount: number;
  sale_rate: number;
  wholesale_rate: number;
  dealer_rate: number;
  mrp: number;
  category: string;
}

const OpeningStock: React.FC = () => {
  const dropdownZIndex = 1000;
  const nestedModalZIndex = 1010;

  // --- Static Data (shown after clicking Load) ---
  const staticItems: ItemRow[] = [
    {
      item_name: "Paracetamol 500mg Tablet",
      code: "PARA001",
      barcode: "8901234567890",
      unit: "Strip",
      batch_no: "",
      pack_qty: "10",
      quantity: 0,
      rate: 15.0,
      amount: 0,
      sale_rate: 20.0,
      wholesale_rate: 18.0,
      dealer_rate: 16.0,
      mrp: 25.0,
      category: "Medicines",
    },
    {
      item_name: "Aspirin 100mg",
      code: "ASP002",
      barcode: "8909876543210",
      unit: "Tablet",
      batch_no: "",
      pack_qty: "1",
      quantity: 0,
      rate: 8.0,
      amount: 0,
      sale_rate: 12.0,
      wholesale_rate: 10.0,
      dealer_rate: 9.0,
      mrp: 15.0,
      category: "Medicines",
    },
    {
      item_name: "Vitamin C Syrup 100ml",
      code: "VITC003",
      barcode: "8904567891234",
      unit: "Bottle",
      batch_no: "",
      pack_qty: "1",
      quantity: 0,
      rate: 220.0,
      amount: 0,
      sale_rate: 280.0,
      wholesale_rate: 250.0,
      dealer_rate: 230.0,
      mrp: 300.0,
      category: "Supplements",
    },
    {
      item_name: "Surgical Mask",
      code: "MASK004",
      barcode: "8905556667778",
      unit: "Piece",
      batch_no: "",
      pack_qty: "50",
      quantity: 0,
      rate: 2.5,
      amount: 0,
      sale_rate: 5.0,
      wholesale_rate: 4.0,
      dealer_rate: 3.5,
      mrp: 6.0,
      category: "Surgical",
    },
  ];

  // --- State ---
  const [formData, setFormData] = useState<OpeningStockFormData>({
    store: "",
  });
  const [storeList, setStoreList] = useState<LocationMasterType[]>([]);
  const [isLocationMasterOpen, setIsLocationMasterOpen] = useState(false);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // --- API Calls ---
  const loadStores = async () => {
    try {
      const result = await fetchAllLocations();
      if (Array.isArray(result)) {
        setStoreList(result as LocationMasterType[]);
      } else if (result && (result as any).data) {
        setStoreList((result as any).data as LocationMasterType[]);
      }
    } catch (error) {
      console.error("Failed to load stores", error);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  // --- Handlers ---
  const handleChange = (field: keyof OpeningStockFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getSelectedStoreData = (): LocationMasterType | null => {
    if (!formData.store) return null;
    return storeList.find((s) => s.name === formData.store) || null;
  };

  const handleLocationSuccess = async () => {
    await loadStores();
  };

  const handleLocationSelect = (locationName: string) => {
    handleChange("store", locationName);
  };

  const handleLoad = () => {
    if (formData.store) {
      // Reset opening-specific fields for fresh entry
      const freshItems = staticItems.map((item) => ({
        ...item,
        quantity: 0,
        batch_no: "",
        amount: 0,
      }));
      setItems(freshItems);
      setSelectedCategory("All");
      setSearchTerm("");
    }
  };

  const handleItemChange = (
    code: string,
    field: keyof ItemRow,
    value: string | number
  ) => {
    setItems((prev) =>
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

  // --- Filtering ---
  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((i) => i.category))).sort();
    return ["All", ...unique];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory]);

  // --- Helper Components ---
  const ActionBtn: React.FC<{
    icon: React.ReactNode;
    onClick?: () => void;
  }> = ({ icon, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="h-[30px] w-[30px] bg-[#0f3c63] text-white flex items-center justify-center rounded-r-sm border border-[#0f3c63] hover:opacity-90 transition-opacity z-10 shrink-0"
    >
      {icon}
    </button>
  );

  const FormRow = ({
    label,
    children,
    required,
  }: {
    label: string;
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <div className="grid grid-cols-12 gap-4 items-center mb-4">
      <div className="col-span-3 text-gray-700 font-medium text-[13px]">
        {label}
        {required && <span className="text-red-500 ml-1">★</span>}
      </div>
      <div className="col-span-9 flex items-center gap-3">{children}</div>
    </div>
  );

  return (
    <div className="px-6 max-w-full mx-auto bg-white">
      <div>
        <div className="p-6 w-1/3">
          <FormRow label="Store" required>
            <div className="flex gap-2 flex-1">
              <Dropdown<LocationMasterType>
                data={storeList}
                columns={[
                  { header: "Code", key: "code", width: "w-1/3" },
                  { header: "Name", key: "name", width: "w-full" },
                ]}
                value={formData.store}
                valueKey="name"
                onChange={(item) =>
                  handleChange("store", item ? item.name : "")
                }
                placeholder="Select Store..."
                zIndex={dropdownZIndex}
              />
              <ActionBtn
                icon={<EditIcon size={16} />}
                onClick={() => setIsLocationMasterOpen(true)}
              />
            </div>
            <button
              onClick={handleLoad}
              disabled={!formData.store}
              className="px-8 py-2 bg-[#0f3c63] text-white rounded-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Load
            </button>
          </FormRow>
        </div>
      </div>

      {items.length > 0 && (
        <div className="overflow-hidden">
          <div className="px-4 flex justify-between items-center mb-1">
            <div>
              <label className="mr-3 font-medium text-sm text-gray-700">
                Category:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-[#0f3c63]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-[#0f3c63] w-80"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-[#003f6b] text-white text-sm">
                <tr>
                  <th className="px-4 py-3 text-left">Item name</th>
                  <th className="px-4 py-3 text-left">Code</th>
                  <th className="px-4 py-3 text-left">Barcode</th>
                  <th className="px-4 py-3 text-left">Unit</th>
                  <th className="px-4 py-3 text-left">Batch No</th>
                  <th className="px-4 py-3 text-left">Pack Qty</th>
                  <th className="px-4 py-3 text-left">Quantity</th>
                  <th className="px-4 py-3 text-left">Rate</th>
                  <th className="px-4 py-3 text-left">Amount (₹)</th>
                  <th className="px-4 py-3 text-left">Sale Rate (₹)</th>
                  <th className="px-4 py-3 text-left">Wholesale Rate (₹)</th>
                  <th className="px-4 py-3 text-left text-red-400">
                    Dealer Rate (₹)
                  </th>
                  <th className="px-4 py-3 text-left">MRP (₹)</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.code} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{item.item_name}</td>
                    <td className="px-4 py-3">{item.code}</td>
                    <td className="px-4 py-3">{item.barcode}</td>
                    <td className="px-4 py-3">{item.unit}</td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.batch_no}
                        onChange={(e) =>
                          handleItemChange(
                            item.code,
                            "batch_no",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#0f3c63]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.pack_qty}
                        onChange={(e) =>
                          handleItemChange(
                            item.code,
                            "pack_qty",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#0f3c63]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            item.code,
                            "quantity",
                            Number(e.target.value) || 0
                          )
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#0f3c63]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(
                            item.code,
                            "rate",
                            Number(e.target.value) || 0
                          )
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#0f3c63]"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {item.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.sale_rate}
                        onChange={(e) =>
                          handleItemChange(
                            item.code,
                            "sale_rate",
                            Number(e.target.value) || 0
                          )
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#0f3c63]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.wholesale_rate}
                        onChange={(e) =>
                          handleItemChange(
                            item.code,
                            "wholesale_rate",
                            Number(e.target.value) || 0
                          )
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#0f3c63]"
                      />
                    </td>
                    <td className="px-4 py-3 text-red-600">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.dealer_rate}
                        onChange={(e) =>
                          handleItemChange(
                            item.code,
                            "dealer_rate",
                            Number(e.target.value) || 0
                          )
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#0f3c63] text-red-600"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.mrp}
                        onChange={(e) =>
                          handleItemChange(
                            item.code,
                            "mrp",
                            Number(e.target.value) || 0
                          )
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#0f3c63]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No items found matching the current filters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nested Location Master Modal */}
      {isLocationMasterOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          style={{ zIndex: nestedModalZIndex }}
        >
          <div className="shadow-2xl overflow-hidden relative bg-white">
            <LocationMaster
              onClose={() => setIsLocationMasterOpen(false)}
              initialData={getSelectedStoreData()}
              onSuccess={handleLocationSuccess}
              onSelect={handleLocationSelect}
              index={nestedModalZIndex}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OpeningStock;
