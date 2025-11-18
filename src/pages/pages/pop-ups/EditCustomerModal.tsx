import React, { useState, useCallback, useMemo } from "react";
// Only import necessary Lucide icons
import { Search, ChevronDown, Edit3, Check, Loader2 } from "lucide-react";

// --- TYPE DEFINITIONS ---

interface RateEntry {
  id: number;
  rateListName: string;
  effectiveFrom: string;
  [key: string]: string | number | undefined; // For dynamic property access
}

interface SalesRateEntry extends RateEntry {
  rate: number;
  dealerRate: number;
  wholesaleRate: number;
  mrp: number;
}

interface PurchaseRateEntry extends RateEntry {
  rate: number;
  mrp: number;
  minPrice: number;
  discount: string;
}

interface ItemOption {
  label: string;
  value: string;
}

interface HeaderMap {
  label: string;
  // Using string here to satisfy dynamic key access in table.
  key: string;
  editable: boolean;
  isPrice: boolean;
}

interface RateListTableProps {
  title: string;
  headersMap: HeaderMap[];
  data: RateEntry[];
  isEditing: boolean;
  onRateChange: (rowIndex: number, key: string, value: number) => void;
}

// --- Static Data for Initial Seeding and Item Selection ---
const initialSalesData: SalesRateEntry[] = [
  {
    id: 1,
    rateListName: "Standard Sales Rate",
    effectiveFrom: "2024-01-01",
    rate: 150.0,
    dealerRate: 140.0,
    wholesaleRate: 130.0,
    mrp: 180.0,
  },
  {
    id: 2,
    rateListName: "Q3 Promotional Rate",
    effectiveFrom: "2024-07-01",
    rate: 145.0,
    dealerRate: 135.0,
    wholesaleRate: 125.0,
    mrp: 175.0,
  },
];

const initialPurchaseData: PurchaseRateEntry[] = [
  {
    id: 1,
    rateListName: "Standard Purchase Rate",
    effectiveFrom: "2023-12-01",
    rate: 100.0,
    mrp: 120.0,
    minPrice: 95.0,
    discount: "5%",
  },
  {
    id: 2,
    rateListName: "Bulk Vendor Rate A",
    effectiveFrom: "2024-06-01",
    rate: 98.0,
    mrp: 118.0,
    minPrice: 93.0,
    discount: "7%",
  },
];

const availableItems: ItemOption[] = [
  { label: "Product A - SKU101", value: "sku101" },
  { label: "Product B - SKU102", value: "sku102" },
  { label: "Product C - SKU103", value: "sku103" },
];

// Define headers and their corresponding data keys
const salesHeadersMap: HeaderMap[] = [
  { label: "SNo", key: "id", editable: false, isPrice: false },
  {
    label: "Rate List Name",
    key: "rateListName",
    editable: false,
    isPrice: false,
  },
  {
    label: "Effective From",
    key: "effectiveFrom",
    editable: false,
    isPrice: false,
  },
  { label: "Rate", key: "rate", editable: true, isPrice: true },
  { label: "Dealer Rate", key: "dealerRate", editable: true, isPrice: true },
  {
    label: "Wholesale Rate",
    key: "wholesaleRate",
    editable: true,
    isPrice: true,
  },
  { label: "MRP", key: "mrp", editable: true, isPrice: true },
];

const purchaseHeadersMap: HeaderMap[] = [
  { label: "SNo", key: "id", editable: false, isPrice: false },
  {
    label: "Rate List Name",
    key: "rateListName",
    editable: false,
    isPrice: false,
  },
  {
    label: "Effective From",
    key: "effectiveFrom",
    editable: false,
    isPrice: false,
  },
  { label: "Rate", key: "rate", editable: true, isPrice: true },
  { label: "MRP", key: "mrp", editable: true, isPrice: true },
  { label: "Min. Price", key: "minPrice", editable: true, isPrice: true },
  { label: "Discount", key: "discount", editable: false, isPrice: false },
];

const RateListTable: React.FC<RateListTableProps> = ({
  title,
  headersMap,
  data,
  isEditing,
  onRateChange,
}) => {
  const tableColor = "bg-[#0c5888]";
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerCaseSearch = searchTerm.toLowerCase();

    return data.filter((row) => {
      return Object.values(row).some((value) => {
        if (typeof value === "string" || typeof value === "number") {
          return String(value).toLowerCase().includes(lowerCaseSearch);
        }
        return false;
      });
    });
  }, [data, searchTerm]);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2 border-gray-300 dark:border-gray-700">
        {title}
      </h3>
      <div className="mb-4 flex justify-end">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search rates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 text-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto shadow-xl rounded-lg border dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={tableColor}>
            <tr>
              {headersMap.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((row, index) => {
                const originalIndex = data.findIndex((d) => d.id === row.id);

                return (
                  <tr
                    key={row.id || index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-100"
                  >
                    {headersMap.map((header, colIndex) => {
                      const key = header.key;
                      const value = row[key];
                      const isEditable = isEditing && header.editable;

                      return (
                        <td
                          key={colIndex}
                          className={`px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 ${
                            header.isPrice
                              ? "text-right"
                              : "text-left text-gray-900 dark:text-gray-200"
                          }`}
                        >
                          {isEditable ? (
                            <input
                              type="number"
                              step="0.01"
                              value={
                                typeof value === "number"
                                  ? value
                                  : value === ""
                                  ? ""
                                  : parseFloat(String(value)) || "" // Handle non-numeric strings
                              }
                              onChange={(e) => {
                                const numValue = parseFloat(e.target.value);
                                const rawValue = e.target.value;

                                if (originalIndex !== -1) {
                                  // Pass 0 if the input is cleared, otherwise pass the number
                                  onRateChange(
                                    originalIndex,
                                    key, // key is a string here, matching the prop type
                                    rawValue === "" ? 0 : numValue
                                  );
                                }
                              }}
                              className="w-24 p-1 border rounded-md text-right bg-blue-50 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <span
                              className={`${
                                header.isPrice ? "font-mono w-full block" : ""
                              }`}
                            >
                              {header.isPrice && typeof value === "number"
                                ? `$${value.toFixed(2)}`
                                : value}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={headersMap.length}
                  className="text-center py-12 text-lg text-gray-500 dark:text-gray-400"
                >
                  {searchTerm
                    ? `No results found for "${searchTerm}".`
                    : "No rate list data found for the selected item."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const UpdateListForEachItems: React.FC = () => {
  // --- Removed Firebase/Auth/DB State ---

  const [selectedItem, setSelectedItem] = useState<string>(
    availableItems[0]?.value || ""
  );
  const [salesRates, setSalesRates] =
    useState<SalesRateEntry[]>(initialSalesData);
  const [purchaseRates, setPurchaseRates] =
    useState<PurchaseRateEntry[]>(initialPurchaseData);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Removed isLoading state
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const actionButtonColor = isEditing
    ? "bg-green-600 hover:bg-green-700"
    : "bg-[#0c5888] hover:bg-blue-800";

  // 1. Rate Change Handler (Generic and type-safe for local state)
  const handleRateChange = useCallback(
    <T extends SalesRateEntry[] | PurchaseRateEntry[]>(
      setState: React.Dispatch<React.SetStateAction<T>>,
      rowIndex: number,
      key: string,
      value: number
    ) => {
      setState((prevRates) => {
        // Cast the array to RateEntry[] for generic array manipulation
        const newRates = [...(prevRates as RateEntry[])];
        if (newRates[rowIndex]) {
          newRates[rowIndex] = { ...newRates[rowIndex], [key]: value };
        }
        // Return the new array, cast back to T
        return newRates as T;
      });
    },
    []
  );

  const handleSalesRateChange = useCallback(
    (rowIndex: number, key: string, value: number) => {
      handleRateChange(setSalesRates, rowIndex, key, value);
    },
    [handleRateChange]
  );

  const handlePurchaseRateChange = useCallback(
    (rowIndex: number, key: string, value: number) => {
      handleRateChange(setPurchaseRates, rowIndex, key, value);
    },
    [handleRateChange]
  );

  // 2. Save Button Handler (Simulates save to local state)
  const handleSaveRates = async () => {
    setIsSaving(true);
    setMessage({ text: "Simulating save...", type: "info" });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // In a real app, API persistence would happen here.

      setIsEditing(false);
      setMessage({
        text: "Rates saved successfully (Local State)!",
        type: "success",
      });
    } catch (e) {
      console.error("Simulation error:", e);
      setMessage({
        text: "Failed to save rates (Simulation Error).",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // UI Rendering
  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-2xl min-h-screen">
      <h1 className="text-3xl font-extrabold text-[#0c5888] dark:text-indigo-400 mb-6 border-b pb-3">
        Item Rate List Editor 💾 (Local Mode)
      </h1>

      {/* Item Selection Dropdown */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
            Select Item:
          </label>
          <div className="relative inline-block text-left">
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="appearance-none block w-full bg-gray-50 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white text-sm px-4 py-2 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              disabled={isSaving || isEditing}
            >
              {availableItems.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {isEditing ? (
            <button
              onClick={handleSaveRates}
              className={`flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-md transition duration-200 ${actionButtonColor} ${
                isSaving ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className={`flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-md transition duration-200 ${actionButtonColor} ${
                isSaving ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isSaving}
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Rates
            </button>
          )}
        </div>
      </div>

      {/* Loading/Message Display */}
      {message && (
        <div
          className={`p-3 mb-4 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : message.type === "error"
              ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
              : "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Content Area */}
      {/* Removed loading check since data is instant */}
      <div className="space-y-10">
        {/* Sales Rate Table */}
        <RateListTable
          title="Sales Rate Lists"
          headersMap={salesHeadersMap}
          data={salesRates}
          isEditing={isEditing}
          onRateChange={handleSalesRateChange}
        />

        {/* Purchase Rate Table */}
        <RateListTable
          title="Purchase Rate Lists"
          headersMap={purchaseHeadersMap}
          data={purchaseRates}
          isEditing={isEditing}
          onRateChange={handlePurchaseRateChange}
        />
      </div>

      {/* Footer / Status */}
      <div className="mt-12 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        **Status:** Local State Only. Changes are **not persisted** outside this
        session.
      </div>
    </div>
  );
};

export default UpdateListForEachItems;
