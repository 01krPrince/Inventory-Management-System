import React, { useState } from "react";
import { X, Save, Trash2, LogOut, BookOpen, ChevronDown } from "lucide-react";
import SelectItemForPromotion from "./SelectItemForPromotion";
import Dropdown, { ColumnDef } from "./Dropdown";

// --- Types for Dropdown Data ---
interface SimpleOption {
  label: string;
  value: string;
}

interface CreateNewPromotionProps {
  onClose: () => void;
}

export const CreateNewPromotion: React.FC<CreateNewPromotionProps> = ({
  onClose,
}) => {
  // --- Form State ---
  const [formData, setFormData] = useState({
    description: "",
    type: "DiscountOnItems",
    fromPeriod: "2025-12-22",
    toPeriod: "2025-12-22",
    happyHourFrom: "00:12",
    happyHourTo: "00:12",
    discountOn: "ItemValue",
    calculation: "Rate",
    discountRate: 0,
    skipLocation: "",
    prioritySequence: 0,
    isAllItems: false,
  });

  // --- Popup State ---
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // --- Dropdown Configuration ---
  const simpleColumns: ColumnDef<SimpleOption>[] = [
    { header: "Select Option", key: "label" }, // Single column for simple lists
  ];

  // Data Lists
  const typeData: SimpleOption[] = [
    { label: "DiscountOnItems", value: "DiscountOnItems" },
    { label: "BOGO", value: "BOGO" },
  ];
  const discountOnData: SimpleOption[] = [
    { label: "ItemValue", value: "ItemValue" },
    { label: "ItemQty", value: "ItemQty" },
  ];
  const calculationData: SimpleOption[] = [
    { label: "Rate", value: "Rate" },
    { label: "Amount", value: "Amount" },
  ];
  const locationData: SimpleOption[] = [
    { label: "Warehouse A", value: "locA" },
    { label: "Warehouse B", value: "locB" },
  ];

  // --- Handlers ---
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDropdownChange = (field: string, item: SimpleOption | null) => {
    handleChange(field, item ? item.value : "");
  };

  const handleItemSubmit = (items: string[]) => {
    setSelectedItems(items);
    setShowItemSelector(false);
  };

  // --- Styles ---
  const labelStyle = "text-sm text-gray-700 font-medium py-2";
  const inputStyle =
    "w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500 h-[30px]"; // Added fixed height to match Dropdown
  const sectionHeaderStyle =
    "bg-white text-[#164e78] font-bold px-4 py-2 border-b border-gray-300 flex justify-between items-center cursor-pointer";

  return (
    <>
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose}></div>

      {/* Main Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] bg-white shadow-2xl z-50 rounded-sm flex flex-col font-sans">
        {/* Header */}
        <div className="bg-[#164e78] text-white px-4 py-2 flex justify-between items-center shrink-0">
          <h2 className="font-semibold text-lg">Promotions</h2>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto max-h-[80vh] bg-[#f8f9fa] pb-4">
          {/* Section: Basic Information */}
          <div className="bg-white m-2 border border-gray-200 shadow-sm">
            <div className={sectionHeaderStyle}>
              <div className="flex items-center gap-2">
                <BookOpen size={16} />
                <span>Basic Information</span>
              </div>
              <div className="bg-gray-200 rounded-full p-0.5">
                <ChevronDown size={14} className="text-gray-600" />
              </div>
            </div>

            <div className="p-6 flex gap-8">
              {/* Left Column: Form Fields */}
              <div className="flex-1 grid grid-cols-[140px_1fr] gap-y-3 items-center">
                <label className={labelStyle}>
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Description"
                  className={inputStyle}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />

                <label className={labelStyle}>type</label>
                <Dropdown<SimpleOption>
                  data={typeData}
                  columns={simpleColumns}
                  valueKey="value"
                  value={formData.type}
                  onChange={(item) => handleDropdownChange("type", item)}
                  placeholder="Select Type"
                  zIndex={9999}
                />

                <label className={labelStyle}>From Period</label>
                <input
                  type="date"
                  className={inputStyle}
                  value={formData.fromPeriod}
                  onChange={(e) => handleChange("fromPeriod", e.target.value)}
                />

                <label className={labelStyle}>To Period</label>
                <input
                  type="date"
                  className={inputStyle}
                  value={formData.toPeriod}
                  onChange={(e) => handleChange("toPeriod", e.target.value)}
                />

                <label className={labelStyle}>Happy Hour From</label>
                <input
                  type="time"
                  className={inputStyle}
                  value={formData.happyHourFrom}
                  onChange={(e) =>
                    handleChange("happyHourFrom", e.target.value)
                  }
                />

                <label className={labelStyle}>Happy Hour To</label>
                <input
                  type="time"
                  className={inputStyle}
                  value={formData.happyHourTo}
                  onChange={(e) => handleChange("happyHourTo", e.target.value)}
                />

                <label className={labelStyle}>Discount On</label>
                <Dropdown<SimpleOption>
                  data={discountOnData}
                  columns={simpleColumns}
                  valueKey="value"
                  value={formData.discountOn}
                  onChange={(item) => handleDropdownChange("discountOn", item)}
                  placeholder="Select Discount On"
                  zIndex={9999}
                />

                <label className={labelStyle}>Calculation</label>
                <Dropdown<SimpleOption>
                  data={calculationData}
                  columns={simpleColumns}
                  valueKey="value"
                  value={formData.calculation}
                  onChange={(item) => handleDropdownChange("calculation", item)}
                  placeholder="Select Calculation"
                  zIndex={9999}
                />

                <label className={labelStyle}>Discount Rate</label>
                <input
                  type="number"
                  className={`${inputStyle} text-right`}
                  value={formData.discountRate}
                  onChange={(e) => handleChange("discountRate", e.target.value)}
                />

                <label className={labelStyle}>Skip Location</label>
                <Dropdown<SimpleOption>
                  data={locationData}
                  columns={simpleColumns}
                  valueKey="value"
                  value={formData.skipLocation}
                  onChange={(item) =>
                    handleDropdownChange("skipLocation", item)
                  }
                  placeholder="Select Location"
                  zIndex={9999}
                />

                <label className={labelStyle}>Priority Sequence</label>
                <input
                  type="number"
                  className={`${inputStyle} text-right`}
                  value={formData.prioritySequence}
                  onChange={(e) =>
                    handleChange("prioritySequence", e.target.value)
                  }
                />
              </div>

              {/* Right Column: Item Selection */}
              <div className="w-1/3 pt-1">
                <button
                  onClick={() => setShowItemSelector(true)}
                  className="bg-[#164e78] text-white px-4 py-2 text-sm font-medium w-36 mb-4 hover:bg-blue-800 transition-colors"
                >
                  Select Item X
                </button>

                <div className="flex items-center gap-2 mb-4">
                  <label className="text-sm font-medium">All Item</label>
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={formData.isAllItems}
                    onChange={(e) =>
                      handleChange("isAllItems", e.target.checked)
                    }
                  />
                </div>

                <div className="text-xs text-gray-500">
                  {selectedItems.length > 0
                    ? `${selectedItems.length} items selected`
                    : "No specific items selected"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#164e78] p-3 flex gap-2 shrink-0">
          <button className="bg-[#164e78] border border-white text-white px-6 py-1 text-sm hover:bg-blue-800 flex items-center gap-2">
            <Save size={14} /> Save
          </button>
          <button className="bg-[#164e78] border border-white text-white px-6 py-1 text-sm hover:bg-blue-800 flex items-center gap-2">
            Clear
          </button>
          <button className="bg-[#164e78] border border-white text-white px-6 py-1 text-sm hover:bg-blue-800 flex items-center gap-2">
            <Trash2 size={14} /> Delete
          </button>
          <button
            onClick={onClose}
            className="bg-[#164e78] border border-white text-white px-6 py-1 text-sm hover:bg-blue-800 flex items-center gap-2 ml-auto"
          >
            <LogOut size={14} /> Exit
          </button>
        </div>
      </div>

      {/* --- Child Popup Integration --- */}
      {showItemSelector && (
        <SelectItemForPromotion
          onClose={() => setShowItemSelector(false)}
          onSubmit={handleItemSubmit}
          zIndex={100}
        />
      )}
    </>
  );
};

export default CreateNewPromotion;
