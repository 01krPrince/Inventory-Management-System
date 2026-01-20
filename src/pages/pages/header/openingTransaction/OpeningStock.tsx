import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Save,
  Plus,
  Loader2,
  Lock,
  Layers,
  CheckCircle2,
} from "lucide-react";
import Dropdown from "../../../../components/Dropdown";
import { LocationMaster } from "../../../../components/LocationMaster";
import {
  fetchAllLocations,
  LocationMaster as LocationMasterType,
} from "../../inventory/stockAdjustment/api/LocationMaster";
import {
  openingStockService,
  OpeningStockPayload,
} from "../../../../services/header/openingTransaction/openingStockService";
import { fetchItems } from "../../inventory/itemMaster/api/itemService";

const OpeningStock: React.FC = () => {
  const [formData, setFormData] = useState({
    storeName: "",
    storeId: "",
    voucherDate: new Date().toISOString().split("T")[0],
    remarks: "Initial stock entry",
  });

  const [storeList, setStoreList] = useState<LocationMasterType[]>([]);
  const [isLocationMasterOpen, setIsLocationMasterOpen] = useState(false);
  const [tableItems, setTableItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tableSearch, setTableSearch] = useState("");
  const [isAlreadyCreated, setIsAlreadyCreated] = useState(false);

  // --- Statistics Calculation ---
  const stats = useMemo(() => {
    const filtered = tableItems.filter(
      (i) =>
        i.item_name.toLowerCase().includes(tableSearch.toLowerCase()) ||
        i.code.toLowerCase().includes(tableSearch.toLowerCase()),
    );
    const totalQty = filtered.reduce(
      (acc, curr) => acc + Number(curr.quantity || 0),
      0,
    );
    const totalValue = filtered.reduce(
      (acc, curr) => acc + Number(curr.amount || 0),
      0,
    );
    return { count: filtered.length, totalQty, totalValue };
  }, [tableItems, tableSearch]);

  // --- Data Loading ---
  const loadStoreData = async () => {
    try {
      const stores = (await fetchAllLocations()) as any;
      setStoreList(Array.isArray(stores) ? stores : stores?.data || []);
    } catch (e) {
      console.error("Store Load Error:", e);
    }
  };

  useEffect(() => {
    loadStoreData();
  }, [isLocationMasterOpen]);

  const handleLoadItems = async () => {
    if (!formData.storeId)
      return alert("Please select a store location first.");
    setIsLoading(true);
    try {
      const res = await openingStockService.getOpeningStockByStore(
        formData.storeId,
      );

      if (res.success && res.items?.length > 0) {
        setIsAlreadyCreated(true);
        setTableItems(
          res.items.map((apiItem: any) => ({
            _id: apiItem.item?._id,
            item_name: apiItem.item?.name || apiItem.description,
            sub_item: "NA",
            code: apiItem.itemcode || apiItem.item?.code,
            barcode: apiItem.item?.barcode || "NA",
            unit: apiItem.item?.stock_unit?.name || "Unit",
            batch_no: apiItem.batchNo || "NA",
            pack_qty: apiItem.packQty || 1,
            quantity: apiItem.quantity || 0,
            rate: apiItem.rate || 0,
            amount: apiItem.amount || 0,
            category_name: apiItem.item?.category?.name || "General",
            mrp: apiItem.mrp || 0,
            sale_rate: apiItem.sale_rate || 0,
            wholesale_rate: "NA",
            dealer_rate: "NA",
          })),
        );
      } else {
        setIsAlreadyCreated(false);
        const masterItems = await fetchItems();
        setTableItems(
          masterItems.map((item: any) => ({
            _id: item._id,
            item_name: item.name,
            sub_item: "NA",
            code: item.code,
            barcode: item.barcode || "NA",
            unit: item.stock_unit?.name || "Unit",
            batch_no: "NA",
            pack_qty: item.pack_qty || 1,
            quantity: 0,
            rate: item.purchase_rate || 0,
            amount: 0,
            category_name: item.category?.name || "General",
            mrp: item.mrp || 0,
            sale_rate: item.sales_rate || 0,
            wholesale_rate: item.wholesale_rate || "NA",
            dealer_rate: item.dealer_rate || "NA",
          })),
        );
      }
    } catch (e) {
      alert("Failed to fetch store data.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handlers ---
  const handleRowChange = (code: string, field: string, value: any) => {
    if (isAlreadyCreated) return;
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
      }),
    );
  };

  const handleSave = async () => {
    const activeItems = tableItems.filter((i) => Number(i.quantity) > 0);
    if (activeItems.length === 0) return alert("No items to save.");
    if (!formData.storeId) return alert("Store information missing.");

    const payload: OpeningStockPayload = {
      store: formData.storeId,
      voucherDate: formData.voucherDate,
      remarks: formData.remarks,
      items: activeItems.map((i) => ({
        item: i._id,
        itemcode: i.code,
        description: i.item_name,
        batchNo: i.batch_no || "NA",
        packQty: Number(i.pack_qty) || 1,
        quantity: Number(i.quantity),
        rate: Number(i.rate),
        amount: Number(i.amount),
        itemBalance: Number(i.quantity),
        mrp: i.mrp,
        sale_rate: i.sale_rate,
      })),
    };

    setIsLoading(true);
    try {
      const res = await openingStockService.createOpeningStock(payload);
      if (res.success || res._id) {
        alert("Success! Opening stock has been recorded.");
        await handleLoadItems();
      }
    } catch (error: any) {
      alert("Server Error while saving stock.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = tableItems.filter(
    (i) =>
      i.item_name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      i.code.toLowerCase().includes(tableSearch.toLowerCase()),
  );

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] flex flex-col font-sans relative">
      <div className="bg-[#0f3c63] shadow-xl sticky top-0 z-20">
        {/* Header Content */}
        <div className="px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 gap-4">
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <h1 className="text-white font-black text-xl md:text-2xl tracking-tighter uppercase">
              Opening Stock
            </h1>
            <div
              className={`px-4 py-1.5 rounded-full text-[10px] font-black flex items-center gap-2 shadow-inner ${
                isAlreadyCreated
                  ? "bg-red-500/20 text-red-300 border border-red-500/50"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
              }`}
            >
              {isAlreadyCreated ? (
                <Lock size={12} />
              ) : (
                <CheckCircle2 size={12} />
              )}
              {isAlreadyCreated
                ? "LOCKED (ENTRY EXISTS)"
                : "DRAFT (READY TO CREATE)"}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            {/* Stats */}
            <div className="flex items-center justify-between md:justify-start gap-4 md:gap-10 bg-black/30 px-6 py-2.5 rounded-2xl border border-white/5 shadow-2xl overflow-x-auto">
              <div className="text-center border-r border-white/10 pr-4 md:pr-10">
                <p className="text-[9px] text-sky-300 font-bold uppercase tracking-[0.2em] mb-1">
                  Items Found
                </p>
                <p className="text-lg md:text-xl font-black text-white leading-none">
                  {stats.count}
                </p>
              </div>
              <div className="text-center border-r border-white/10 pr-4 md:pr-10">
                <p className="text-[9px] text-sky-300 font-bold uppercase tracking-[0.2em] mb-1">
                  Total Qty
                </p>
                <p className="text-lg md:text-xl font-black text-white leading-none">
                  {stats.totalQty}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-[0.2em] mb-1">
                  Total Value
                </p>
                <p className="text-lg md:text-xl font-black text-emerald-400 leading-none">
                  ₹{stats.totalValue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Save Button */}
            {!isAlreadyCreated && tableItems.length > 0 && (
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 md:px-8 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95 disabled:opacity-50 uppercase"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                Save
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-4 md:px-6 py-3 bg-[#164e7d] flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="w-full lg:w-80">
              <Dropdown<LocationMasterType>
                data={storeList}
                columns={[
                  { header: "Store Name", key: "name", width: "w-full" },
                ]}
                value={formData.storeName}
                valueKey="name"
                onChange={(item) =>
                  setFormData((p) => ({
                    ...p,
                    storeName: item?.name || "",
                    storeId: (item as any)?._id || "",
                  }))
                }
                placeholder="Select Warehouse / Store"
              />
            </div>
            <button
              onClick={() => setIsLocationMasterOpen(true)}
              className="bg-sky-500 hover:bg-sky-400 text-white p-2.5 rounded-xl shadow-lg transition-all active:scale-90 flex-shrink-0"
              title="Add New Store"
            >
              <Plus size={20} strokeWidth={3} />
            </button>
          </div>

          <div className="flex-1 relative w-full">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              placeholder="Quick search by name or code..."
              className="w-full bg-white/10 border border-white/10 rounded-xl px-12 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:bg-white focus:text-gray-900 transition-all"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
            />
          </div>
          <button
            onClick={handleLoadItems}
            disabled={isLoading || !formData.storeId}
            className="bg-white text-[#0f3c63] px-8 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-sky-50 transition-all disabled:opacity-50 w-full lg:w-auto"
          >
            {isLoading ? "Fetching..." : "Fetch Records"}
          </button>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="p-4 md:p-6 flex-1 overflow-hidden flex flex-col">
        {tableItems.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-250px)]">
            <div className="overflow-x-auto overflow-y-auto w-full">
              <table className="w-full text-left border-collapse min-w-[1500px]">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black border-b sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-4 py-4 w-12 text-center whitespace-nowrap">
                      #
                    </th>
                    {/* Increased Item Name Width */}
                    <th className="px-4 py-4 min-w-[300px] whitespace-nowrap">
                      Item Name
                    </th>
                    <th className="px-4 py-4 w-24 whitespace-nowrap">
                      Sub Item
                    </th>
                    <th className="px-4 py-4 w-24 whitespace-nowrap">Code</th>
                    <th className="px-4 py-4 w-32 whitespace-nowrap">
                      Barcode
                    </th>
                    <th className="px-4 py-4 w-32 whitespace-nowrap">Unit</th>
                    <th className="px-4 py-4 w-32 whitespace-nowrap">
                      Batch No.
                    </th>
                    <th className="px-4 py-4 w-24 whitespace-nowrap">
                      Pack Qty
                    </th>
                    {/* Fixed Quantity Width with min-w */}
                    <th className="px-4 py-4 min-w-[120px] text-center whitespace-nowrap">
                      Quantity
                    </th>
                    {/* Fixed Rate Width with min-w */}
                    <th className="px-4 py-4 min-w-[120px] text-right whitespace-nowrap">
                      Rate
                    </th>
                    <th className="px-4 py-4 min-w-[140px] text-right bg-slate-100/50 whitespace-nowrap">
                      Amount
                    </th>
                    <th className="px-4 py-4 w-28 text-right whitespace-nowrap">
                      Sales Rate
                    </th>
                    <th className="px-4 py-4 w-28 text-right whitespace-nowrap">
                      Wholesale
                    </th>
                    <th className="px-4 py-4 w-28 text-right whitespace-nowrap">
                      Dealer Rate
                    </th>
                    <th className="px-4 py-4 w-28 text-right whitespace-nowrap">
                      MRP
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.map((item, idx) => (
                    <tr
                      key={item.code}
                      className={`group transition-all ${
                        isAlreadyCreated
                          ? "bg-gray-50/40"
                          : "hover:bg-blue-50/50"
                      }`}
                    >
                      <td className="px-4 py-2 text-center text-gray-300 text-[10px] font-bold italic whitespace-nowrap">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-2">
                        <div className="font-bold text-gray-800 text-sm leading-tight uppercase min-w-[250px]">
                          {item.item_name}
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold mt-1 tracking-tighter">
                          CAT: {item.category_name}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-xs font-medium text-gray-500 whitespace-nowrap">
                        {item.sub_item}
                      </td>
                      <td className="px-4 py-2 text-xs font-bold text-gray-600 whitespace-nowrap">
                        {item.code}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">
                        {item.barcode}
                      </td>
                      {/* Unit Column - Added max-w and truncate */}
                      <td className="px-4 py-2 text-xs font-bold text-gray-500 whitespace-nowrap">
                        <div
                          className="max-w-[120px] truncate"
                          title={item.unit}
                        >
                          <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                            {item.unit}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          className="w-full bg-transparent border-b border-transparent group-hover:border-gray-300 py-1 text-xs font-medium outline-none focus:border-blue-400 disabled:text-gray-400"
                          value={item.batch_no}
                          disabled={isAlreadyCreated}
                          onChange={(e) =>
                            handleRowChange(
                              item.code,
                              "batch_no",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="px-4 py-2 text-xs text-center text-gray-600 whitespace-nowrap">
                        {item.pack_qty}
                      </td>
                      {/* Quantity Input - Guaranteed Width */}
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="number"
                          className={`w-full text-center py-1.5 rounded-lg text-sm font-black border outline-none transition-all ${
                            isAlreadyCreated
                              ? "bg-transparent border-transparent"
                              : "border-gray-200 bg-white focus:border-blue-500"
                          } ${
                            Number(item.quantity) > 0 && !isAlreadyCreated
                              ? "text-blue-600 border-blue-400 bg-blue-50"
                              : "text-gray-600"
                          }`}
                          value={item.quantity}
                          disabled={isAlreadyCreated}
                          onChange={(e) =>
                            handleRowChange(
                              item.code,
                              "quantity",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      {/* Rate Input - Guaranteed Width */}
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="number"
                          className="w-full text-right bg-transparent border-b border-transparent group-hover:border-gray-300 py-1 text-xs font-bold outline-none focus:border-blue-400 disabled:text-gray-400"
                          value={item.rate}
                          disabled={isAlreadyCreated}
                          onChange={(e) =>
                            handleRowChange(item.code, "rate", e.target.value)
                          }
                        />
                      </td>
                      <td className="px-4 py-2 text-right bg-slate-50/30 whitespace-nowrap">
                        <span className="text-sm font-black text-slate-700">
                          ₹
                          {Number(item.amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right text-xs text-gray-500 whitespace-nowrap">
                        {Number(item.sale_rate).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-right text-xs text-gray-400 whitespace-nowrap">
                        {item.wholesale_rate}
                      </td>
                      <td className="px-4 py-2 text-right text-xs text-gray-400 whitespace-nowrap">
                        {item.dealer_rate}
                      </td>
                      <td className="px-4 py-2 text-right text-xs font-bold text-gray-600 whitespace-nowrap">
                        {Number(item.mrp).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="h-[60vh] flex flex-col items-center justify-center text-gray-300 border-4 border-dashed border-gray-100 rounded-[3rem]">
            <Layers
              size={80}
              strokeWidth={1}
              className="mb-6 opacity-10 animate-pulse"
            />
            <p className="font-black uppercase tracking-[0.3em] text-xs">
              Awaiting Store Selection
            </p>
          </div>
        )}
      </div>

      {isLocationMasterOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className=" rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <LocationMaster
              onClose={() => setIsLocationMasterOpen(false)}
              onSuccess={() => {
                setIsLocationMasterOpen(false);
                loadStoreData();
              }}
              index={100}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OpeningStock;
