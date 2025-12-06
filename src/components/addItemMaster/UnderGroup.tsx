import React, { useState } from "react";
import { X, ChevronDown, Edit, Search, User, FileText } from "lucide-react";
import StockUnit from "./StockUnit";

interface UnderGroupProps {
  onClose: () => void;
}

const Label = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="block text-xs font-medium text-gray-700 mb-0.5">
    {children} {required && <span className="text-red-600">*</span>}
  </label>
);

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 py-1 px-2 mb-3 mt-1">
    <div className="flex items-center text-[#004d7a] font-bold text-sm">
      <FileText className="w-4 h-4 mr-1.5" /> {title}
    </div>
    <ChevronDown className="w-4 h-4 text-gray-500 cursor-pointer" />
  </div>
);

const CustomToggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) => (
  <div
    className="flex items-center gap-2 cursor-pointer"
    onClick={() => onChange(!checked)}
  >
    <div
      className={`w-10 h-5 flex items-center border rounded-sm transition-colors duration-200 ${
        checked ? "bg-[#004d7a] border-[#004d7a]" : "bg-white border-gray-400"
      }`}
    >
      <div
        className={`w-4 h-4 bg-white border border-gray-300 shadow-sm transform transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </div>
    <span className="text-xs font-bold text-gray-600 border border-gray-300 px-1 rounded-sm bg-gray-50">
      {checked ? "ON" : "OFF"}
    </span>
  </div>
);

export default function UnderGroup({ onClose }: UnderGroupProps) {
  const [showStockUnit, setShowStockUnit] = useState(false);

  const [formData, setFormData] = useState({
    UnderGroupMode: "Inventory",
    name: "",
    underGroup: "",
    code: "0007",
    description: "",
    type: "FinishProduct",
    unitOption: "StockUnit",
    stockUnit: "",
    gstClassification: "",
    salesGL: "Sales Accounts",
    purchaseGL: "Purchases - Traded Goods",
    minimumLevel: 0,
    rateFactor: 0,
    itemType: "Regular",
    drugType: "Regular",
    purchaseRateFactor: 0,
    batchWiseInventory: false,
    batchWiseRate: false,
    excludeCvss: false,
    image: null as string | null,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      handleChange("image", url);
    }
  };

  const handleStockUnit = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowStockUnit(true);
  };

  return (
    <div className="flex flex-col bg-gray-100 text-sm">
      {/* HEADER */}
      <div className="bg-[#0c4a75] px-3 py-2 flex justify-between items-center text-white shadow-sm shrink-0">
        <h1 className="text-sm font-semibold tracking-wide">Item Group</h1>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-0.5 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 min-h-auto">
        <div className="bg-white p-3 rounded-sm shadow-sm border border-gray-300 min-h-auto relative">
          <SectionHeader title="Basic Information" />
          <div className="grid grid-cols-12 gap-4 mb-2">
            <div className="col-span-12 md:col-span-9 space-y-2 pr-2">
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-3 text-right md:text-left">
                  <Label>Item Group Mode</Label>
                </div>
                <div className="col-span-9">
                  <select
                    className="w-full border border-gray-300 rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-[#0c4a75]"
                    value={formData.UnderGroupMode}
                    onChange={(e) =>
                      handleChange("UnderGroupMode", e.target.value)
                    }
                  >
                    <option value="Inventory">Inventory</option>
                    <option value="Service">Service</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-3 text-right md:text-left">
                  <Label required>Name</Label>
                </div>
                <div className="col-span-9">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-[#0c4a75]"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-3 text-right md:text-left">
                  <Label required>Under Group</Label>
                </div>
                <div className="col-span-9 flex">
                  <select
                    className="w-full border border-gray-300 border-r-0 rounded-l-sm px-2 py-1 text-xs bg-white focus:outline-none focus:border-[#0c4a75]"
                    value={formData.underGroup}
                    onChange={(e) => handleChange("underGroup", e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="Primary">Primary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-3 text-right md:text-left">
                  <Label required>Code</Label>
                </div>
                <div className="col-span-9">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-[#0c4a75]"
                    value={formData.code}
                    onChange={(e) => handleChange("code", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-3 text-right md:text-left pt-1">
                  <Label>Description</Label>
                </div>
                <div className="col-span-9">
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-sm px-2 py-1 text-xs resize-none focus:outline-none focus:border-[#0c4a75]"
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-3 flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-100 border border-dashed border-gray-400 relative flex items-center justify-center mb-2">
                {formData.image ? (
                  <>
                    <img
                      src={formData.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleChange("image", null)}
                      className="absolute top-0 right-0 bg-[#0c4a75] text-white p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center w-full h-full relative">
                    <button className="absolute top-0 right-0 bg-[#0c4a75] text-white p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                    <User className="w-16 h-16 text-[#3b82f6]" fill="#3b82f6" />
                  </div>
                )}
              </div>
              <label className="bg-[#0c4a75] text-white text-xs font-medium py-1 px-4 rounded-sm cursor-pointer hover:bg-[#093859]">
                Browse
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          <SectionHeader title="Item Default" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label>type</Label>
                </div>
                <div className="col-span-8">
                  <select
                    className="w-full border border-gray-300 rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-[#0c4a75]"
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                  >
                    <option value="FinishProduct">FinishProduct</option>
                    <option value="RawMaterial">RawMaterial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label>Unit Option</Label>
                </div>
                <div className="col-span-8">
                  <select
                    className="w-full border border-gray-300 rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-[#0c4a75]"
                    value={formData.unitOption}
                    onChange={(e) => handleChange("unitOption", e.target.value)}
                  >
                    <option value="StockUnit">StockUnit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label required>Stock Unit</Label>
                </div>
                <div className="col-span-8 flex">
                  <select
                    className="w-full border border-gray-300 border-r-0 rounded-l-sm px-2 py-1 text-xs bg-white focus:outline-none focus:border-[#0c4a75]"
                    value={formData.stockUnit}
                    onClick={handleStockUnit}
                  >
                    <option value="">Select...</option>
                    <option value="Nos">Nos</option>
                  </select>
                  <button
                    className="bg-[#0c4a75] text-white px-2 rounded-r-sm hover:bg-[#093859]"
                    onClick={handleStockUnit}
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-4 pt-1">
                  <Label>GST Classification(HSN...)</Label>
                </div>
                <div className="col-span-8 space-y-1">
                  <div className="flex">
                    <select
                      className="w-full border border-gray-300 border-r-0 rounded-l-sm px-2 py-1 text-xs bg-white focus:outline-none focus:border-[#0c4a75]"
                      value={formData.gstClassification}
                      onChange={(e) =>
                        handleChange("gstClassification", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                    </select>
                    <button className="bg-[#0c4a75] text-white px-2 rounded-r-sm hover:bg-[#093859]">
                      <Edit className="w-3 h-3" />
                    </button>
                  </div>
                  <button className="bg-[#0c4a75] text-white p-1 rounded-sm hover:bg-[#093859]">
                    <Search className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center mt-2">
                <div className="col-span-4">
                  <Label required>Sales GL</Label>
                </div>
                <div className="col-span-8 flex">
                  <select
                    className="w-full border border-gray-300 border-r-0 rounded-l-sm px-2 py-1 text-xs bg-white focus:outline-none focus:border-[#0c4a75]"
                    value={formData.salesGL}
                    onChange={(e) => handleChange("salesGL", e.target.value)}
                  >
                    <option value="Sales Accounts">Sales Accounts</option>
                  </select>
                  <button className="bg-[#0c4a75] text-white px-2 rounded-r-sm hover:bg-[#093859]">
                    <Edit className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label required>Purchase GL</Label>
                </div>
                <div className="col-span-8 flex">
                  <select
                    className="w-full border border-gray-300 border-r-0 rounded-l-sm px-2 py-1 text-xs bg-white focus:outline-none focus:border-[#0c4a75]"
                    value={formData.purchaseGL}
                    onChange={(e) => handleChange("purchaseGL", e.target.value)}
                  >
                    <option value="Purchases - Traded Goods">
                      Purchases - Traded Goods
                    </option>
                  </select>
                  <button className="bg-[#0c4a75] text-white px-2 rounded-r-sm hover:bg-[#093859]">
                    <Edit className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label>Minimum Level</Label>
                </div>
                <div className="col-span-8">
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-sm px-2 py-1 text-xs text-right focus:outline-none focus:border-[#0c4a75]"
                    value={formData.minimumLevel}
                    onChange={(e) =>
                      handleChange("minimumLevel", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <Label>Rate Factor</Label>
                </div>
                <div className="col-span-7">
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-sm px-2 py-1 text-xs text-right focus:outline-none focus:border-[#0c4a75]"
                    value={formData.rateFactor}
                    onChange={(e) => handleChange("rateFactor", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <Label>Item Type</Label>
                </div>
                <div className="col-span-7">
                  <select
                    className="w-full border border-gray-300 rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-[#0c4a75]"
                    value={formData.itemType}
                    onChange={(e) => handleChange("itemType", e.target.value)}
                  >
                    <option value="Regular">Regular</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <Label>Drug Type</Label>
                </div>
                <div className="col-span-7">
                  <select
                    className="w-full border border-gray-300 rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-[#0c4a75]"
                    value={formData.drugType}
                    onChange={(e) => handleChange("drugType", e.target.value)}
                  >
                    <option value="Regular">Regular</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <Label>Purchase Rate Factor</Label>
                </div>
                <div className="col-span-7">
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-sm px-2 py-1 text-xs text-right focus:outline-none focus:border-[#0c4a75]"
                    value={formData.purchaseRateFactor}
                    onChange={(e) =>
                      handleChange("purchaseRateFactor", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center h-7 mt-2">
                <div className="col-span-5 text-xs text-gray-700">
                  Batch wise Inventory
                </div>
                <div className="col-span-7 flex justify-end">
                  <CustomToggle
                    checked={formData.batchWiseInventory}
                    onChange={(val) => handleChange("batchWiseInventory", val)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center h-7">
                <div className="col-span-5 text-xs text-gray-700">
                  Batch Wise Rate
                </div>
                <div className="col-span-7 flex justify-end">
                  <CustomToggle
                    checked={formData.batchWiseRate}
                    onChange={(val) => handleChange("batchWiseRate", val)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center h-7">
                <div className="col-span-5 text-xs text-gray-700">
                  Exclude From CVSS App...
                </div>
                <div className="col-span-7 flex justify-end">
                  <CustomToggle
                    checked={formData.excludeCvss}
                    onChange={(val) => handleChange("excludeCvss", val)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0c4a75] px-3 py-2 flex gap-2 shrink-0 border-t border-blue-800">
        <button className="flex items-center px-3 py-1 border border-white text-white rounded-sm hover:bg-[#093859] text-xs font-medium">
          Save
        </button>
        <button className="flex items-center px-3 py-1 border border-white text-white rounded-sm hover:bg-[#093859] text-xs font-medium">
          Clear
        </button>
        <button className="flex items-center px-3 py-1 border border-white text-white rounded-sm hover:bg-[#093859] text-xs font-medium">
          Delete
        </button>
      </div>

      {showStockUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm p-4">
          <div className="w-auto h-auto bg-white rounded-lg shadow-2xl overflow-hidden relative">
            <StockUnit onClose={() => setShowStockUnit(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
