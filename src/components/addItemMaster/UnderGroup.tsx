import React, { useState, useEffect } from "react";
import {
  X,
  ChevronDown,
  Edit,
  Search,
  User,
  FileText,
  Save,
  Trash2,
  Loader2,
} from "lucide-react";
import StockUnit from "./StockUnit";

import {
  createUnderGroup,
  updateUnderGroup,
  deleteUnderGroup,
} from "./api/underGroupservice";
import { UnderGroupData } from "./api/types";
import { fetchGstClassifications } from "./api/gstservice";
import { StockUnitData } from "./api/types";
import { fetchStockUnits } from "./api/stockunitservice";
import { fetchSalesAndPurchaseGL } from "./api/saleAndPurchaseGL";
import Dropdown, { ColumnDef } from "../Dropdown";

// --- Static Data Constants ---

const GROUP_MODE_OPTIONS = [
  { label: "Inventory", value: "Inventory" },
  { label: "Non-Inventory", value: "Non-Inventory" },
  { label: "Service", value: "Service" },
  { label: "Bundle", value: "Bundle" },
];

const stockUnitColumns: ColumnDef<StockUnitData>[] = [
  { header: "Code", key: "code", width: "w-20" },
  { header: "Name", key: "name", width: "w-full" },
  { header: "UQC", key: "uqc", width: "w-24" },
];

const PRODUCT_TYPE_OPTIONS = [
  { label: "FinishProduct", value: "FinishProduct" },
  { label: "Consumable", value: "Consumable" },
  { label: "RawMaterial", value: "RawMaterial" },
  { label: "PackingMaterial", value: "PackingMaterial" },
  { label: "Scrap", value: "Scrap" },
  { label: "SemiFinish", value: "SemiFinish" },
  { label: "TradeGoods", value: "TradeGoods" },
  { label: "BOMBasedProduct", value: "BOMBasedProduct" },
  { label: "ImportedAsset", value: "ImportedAsset" },
];

const UNIT_OPTIONS_STATIC = [
  { label: "Stock Unit", value: "StockUnit" },
  { label: "Stock Pack Unit", value: "StockPackUnit" },
];

const FormLabel = ({
  required,
  children,
}: {
  required?: boolean;
  children: React.ReactNode;
}) => (
  <label className="block text-xs font-medium text-gray-700">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

export const ITEM_TYPES = [
  { label: "Regular", value: "Regular" },
  { label: "BarcodeFix", value: "BarcodeFix" },
  { label: "BarcodeLot", value: "BarcodeLot" },
  { label: "BarcodeUnique", value: "BarcodeUnique" },
  { label: "JwlMetalGold", value: "JwlMetalGold" },
  { label: "JwlMetalSilver", value: "JwlMetalSilver" },
  { label: "JwlPlainJewelleryGold", value: "JwlPlainJewelleryGold" },
  { label: "JwlPlainJewellerySilver", value: "JwlPlainJewellerySilver" },
  { label: "JwlStuddedJewelleryGold", value: "JwlStuddedJewelleryGold" },
  { label: "JwlPreciousStone", value: "JwlPreciousStone" },
  { label: "JwlNonPreciousStone", value: "JwlNonPreciousStone" },
  { label: "JwlAlloy", value: "JwlAlloy" },
  { label: "OpticalLenseItem", value: "OpticalLenseItem" },
  { label: "MachineInstallation", value: "MachineInstallation" },
  { label: "CashewRCN", value: "CashewRCN" },
  { label: "BarcodeUniquePerQty", value: "BarcodeUniquePerQty" },
];

export const DRUG_TYPES = [
  { label: "Regular", value: "Regular" },
  { label: "Schedule_H1", value: "Schedule_H1" },
  { label: "H1_Anti_TB", value: "H1_Anti_TB" },
  { label: "Schedule_H", value: "Schedule_H" },
  { label: "Schedule_G", value: "Schedule_G" },
  { label: "Schedule_J", value: "Schedule_J" },
  { label: "NRX", value: "NRX" },
];

// --- Interfaces ---

interface UnderGroupProps {
  onClose: () => void;
  initialData?: UnderGroupData;
  onSave?: (data: any) => void;
}

interface DropdownItem {
  name?: string;
  label?: string;
  value?: string;
  code?: string;
  [key: string]: any;
}

// --- Components ---
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

// --- Dropdown Column Definitions ---
const nameColumns: ColumnDef<DropdownItem>[] = [
  { header: "Name", key: "name", width: "w-full" },
];

const labelColumns: ColumnDef<DropdownItem>[] = [
  { header: "Select Option", key: "label", width: "w-full" },
];

const gstColumns: ColumnDef<DropdownItem>[] = [
  { header: "HSN/SAC", key: "name", width: "w-1/2" },
  { header: "Description", key: "description", width: "w-1/2" },
];

// --- Main Component ---
export default function UnderGroup({
  onClose,
  initialData,
  onSave,
}: UnderGroupProps) {
  const [showStockUnit, setShowStockUnit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Dynamic Options States
  const [stockUnitList, setStockUnitList] = useState<StockUnitData[]>([]);
  const [gstOptions, setGstOptions] = useState<DropdownItem[]>([]);
  const [glOptions, setGlOptions] = useState<DropdownItem[]>([]);

  // Edit State for Stock Unit
  const [selectedStockUnitForEdit, setSelectedStockUnitForEdit] = useState<
    StockUnitData | undefined
  >(undefined);

  const [formData, setFormData] = useState({
    _id: "",
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

  // Fetch Data on Mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const unitsData = await fetchStockUnits();
        if (unitsData) setStockUnitList(unitsData);

        const gstData = await fetchGstClassifications();
        if (gstData) setGstOptions(gstData);

        const glData = await fetchSalesAndPurchaseGL();
        if (Array.isArray(glData)) {
          setGlOptions(glData);
        } else {
          setGlOptions([]);
        }
      } catch (error) {
        console.error("Error loading dropdown data:", error);
      }
    };

    loadData();
  }, []);

  // Populate form when initialData is provided
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        _id: initialData._id || "",
        UnderGroupMode:
          initialData.item_mode || initialData.UnderGroupMode || "Inventory",
        name: initialData.item_name || initialData.name || "",
        underGroup: initialData.under_group || "",
        code: initialData.code || prev.code,
        description: initialData.description || "",
        type: initialData.type || "FinishProduct",
        unitOption: initialData.unit_option || "StockUnit",
        stockUnit: initialData.stock_unit || "",
        gstClassification: initialData.gst_classification || "",
        salesGL: initialData.sales_gl || "Sales Accounts",
        purchaseGL: initialData.purchase_gl || "Purchases - Traded Goods",
        minimumLevel: initialData.minimum_level || 0,
        rateFactor: initialData.rate_factor || 0,
        itemType: initialData.item_type || "Regular",
        drugType: initialData.drug_type || "Regular",
        purchaseRateFactor: initialData.purchase_rate_factor || 0,
        batchWiseInventory: !!initialData.batch_wise_inventory,
        batchWiseRate: !!initialData.batch_wise_rate,
        excludeCvss: !!(
          initialData.exclude_cvss || initialData.exclude_cvss_applist
        ),
        image: initialData.image || null,
      }));
    }
  }, [initialData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      handleChange("image", url);
    }
  };

  const handleSave = async () => {
    // Basic Validation
    if (!formData.name) {
      alert("Please enter a name.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      item_name: formData.name,
      code: formData.code,
      under_group: formData.underGroup,
      item_mode: formData.UnderGroupMode,
      description: formData.description,
      type: formData.type,
      unit_option: formData.unitOption,
      stock_unit: formData.stockUnit,
      gst_classification: formData.gstClassification,
      sales_gl: formData.salesGL,
      purchase_gl: formData.purchaseGL,
      minimum_level: formData.minimumLevel,
      rate_factor: formData.rateFactor,
      item_type: formData.itemType,
      drug_type: formData.drugType,
      purchase_rate_factor: formData.purchaseRateFactor,
      batch_wise_inventory: formData.batchWiseInventory,
      batch_wise_rate: formData.batchWiseRate,
      exclude_cvss: formData.excludeCvss,
      image: formData.image,
    };

    try {
      let response;
      if (formData._id) {
        // Update Existing
        response = await updateUnderGroup(formData._id, payload);
      } else {
        // Create New
        response = await createUnderGroup(payload);
      }
      if (response && response.success) {
        if (onSave) {
          onSave(response.data);
        } else {
          onClose(); // Default behavior
        }
      } else {
        alert("Operation failed: " + (response?.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!formData._id) return;

    if (!confirm("Are you sure you want to delete this Item Group?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await deleteUnderGroup(formData._id);
      if (response && response.success) {
        onClose();
      } else {
        alert("Delete failed: " + (response?.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditStockUnit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (formData.stockUnit) {
      const selectedItem = stockUnitList.find(
        (item) => item.name === formData.stockUnit
      );
      setSelectedStockUnitForEdit(selectedItem);
    } else {
      setSelectedStockUnitForEdit(undefined);
    }
    setShowStockUnit(true);
  };

  return (
    <div className="flex flex-col bg-gray-100 text-sm h-full">
      {/* HEADER */}
      <div className="bg-[#0c4a75] px-3 py-2 flex justify-between items-center text-white shadow-sm shrink-0">
        <h1 className="text-sm font-semibold tracking-wide">
          {initialData ? "Edit Item Group" : "Create Item Group"}
        </h1>
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
              {/* ITEM GROUP MODE */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-3 text-right md:text-left">
                  <Label>Item Group Mode</Label>
                </div>
                <div className="col-span-9">
                  <Dropdown
                    data={GROUP_MODE_OPTIONS}
                    columns={labelColumns}
                    value={formData.UnderGroupMode}
                    valueKey="value"
                    onChange={(item) =>
                      handleChange("UnderGroupMode", item?.value || "")
                    }
                    placeholder="Select Mode"
                  />
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
                  <Label required>Code</Label>
                </div>
                <div className="col-span-9">
                  <input
                    disabled={!!initialData}
                    type="text"
                    className={`w-full border border-gray-300 rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-[#0c4a75] ${
                      initialData ? "bg-gray-100" : ""
                    }`}
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
              {/* TYPE */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label>Type</Label>
                </div>
                <div className="col-span-8">
                  <Dropdown
                    data={PRODUCT_TYPE_OPTIONS}
                    columns={labelColumns}
                    value={formData.type}
                    valueKey="value"
                    onChange={(item) => handleChange("type", item?.value || "")}
                    placeholder="Select Type"
                  />
                </div>
              </div>

              {/* UNIT OPTION */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label>Unit Option</Label>
                </div>
                <div className="col-span-8">
                  <Dropdown
                    data={UNIT_OPTIONS_STATIC}
                    columns={labelColumns}
                    value={formData.unitOption}
                    valueKey="value"
                    onChange={(item) =>
                      handleChange("unitOption", item?.value || "")
                    }
                    placeholder="Select Unit Option"
                  />
                </div>
              </div>

              {/* Stock Unit */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4 md:col-span-3">
                  <FormLabel required>Stock Unit</FormLabel>
                </div>
                <div className="col-span-8 md:col-span-9 flex">
                  <div className="flex-1 min-w-0">
                    <Dropdown
                      data={stockUnitList}
                      columns={stockUnitColumns}
                      value={formData.stockUnit}
                      valueKey="name"
                      onChange={(item) =>
                        handleChange("stockUnit", item?.name || "")
                      }
                      placeholder="Select..."
                    />
                  </div>
                  <button
                    onClick={handleEditStockUnit}
                    className="bg-[#0c5888] text-white px-2 rounded-r ml-[1px]"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* GST DROPDOWN */}
              <div className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-4 pt-1">
                  <Label>GST Classification(HSN...)</Label>
                </div>
                <div className="col-span-8 space-y-1">
                  <div className="flex">
                    <div className="flex-1 min-w-0">
                      <Dropdown
                        data={gstOptions}
                        columns={gstColumns}
                        value={formData.gstClassification}
                        valueKey="name"
                        onChange={(item) =>
                          handleChange("gstClassification", item?.name || "")
                        }
                        placeholder="Select..."
                      />
                    </div>
                    <button className="bg-[#0c4a75] text-white px-2 rounded-r-sm hover:bg-[#093859] ml-[1px]">
                      <Edit className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <button className="bg-[#0c4a75] text-white p-1 rounded-sm hover:bg-[#093859]">
                      <Search className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* SALES GL DROPDOWN */}
              <div className="grid grid-cols-12 gap-2 items-center mt-2">
                <div className="col-span-4">
                  <Label required>Sales GL</Label>
                </div>
                <div className="col-span-8 flex">
                  <div className="flex-1 min-w-0">
                    <Dropdown
                      data={glOptions}
                      columns={nameColumns}
                      value={formData.salesGL}
                      valueKey="name"
                      onChange={(item) =>
                        handleChange("salesGL", item?.name || "")
                      }
                      placeholder="Select Sales Account"
                    />
                  </div>
                  <button className="bg-[#0c4a75] text-white px-2 rounded-r-sm hover:bg-[#093859] ml-[1px]">
                    <Edit className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* PURCHASE GL DROPDOWN */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label required>Purchase GL</Label>
                </div>
                <div className="col-span-8 flex">
                  <div className="flex-1 min-w-0">
                    <Dropdown
                      data={glOptions}
                      columns={nameColumns}
                      value={formData.purchaseGL}
                      valueKey="name"
                      onChange={(item) =>
                        handleChange("purchaseGL", item?.name || "")
                      }
                      placeholder="Select Purchase Account"
                    />
                  </div>
                  <button className="bg-[#0c4a75] text-white px-2 rounded-r-sm hover:bg-[#093859] ml-[1px]">
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

              {/* ITEM TYPE DROPDOWN */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <Label>Item Type</Label>
                </div>
                <div className="col-span-7">
                  <Dropdown
                    data={ITEM_TYPES}
                    columns={labelColumns}
                    value={formData.itemType}
                    valueKey="value"
                    onChange={(item) =>
                      handleChange("itemType", item?.value || "")
                    }
                    placeholder="Select Type"
                  />
                </div>
              </div>

              {/* DRUG TYPE DROPDOWN */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <Label>Drug Type</Label>
                </div>
                <div className="col-span-7">
                  <Dropdown
                    data={DRUG_TYPES}
                    columns={labelColumns}
                    value={formData.drugType}
                    valueKey="value"
                    onChange={(item) =>
                      handleChange("drugType", item?.value || "")
                    }
                    placeholder="Select Type"
                  />
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
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className="flex items-center px-3 py-1 border border-white text-white rounded-sm hover:bg-[#093859] text-xs font-medium disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          ) : (
            <Save className="w-3 h-3 mr-1" />
          )}
          {isSubmitting ? "Saving..." : initialData ? "Update" : "Save"}
        </button>
        <button
          onClick={() => {
            setFormData({
              _id: "",
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
              image: null,
            });
          }}
          disabled={isSubmitting}
          className="flex items-center px-3 py-1 border border-white text-white rounded-sm hover:bg-[#093859] text-xs font-medium"
        >
          Clear
        </button>
        {initialData && formData._id && (
          <button
            onClick={handleDelete}
            disabled={isDeleting || isSubmitting}
            className="flex items-center px-3 py-1 border border-white text-white rounded-sm hover:bg-[#c53030] text-xs font-medium disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <Trash2 className="w-3 h-3 mr-1" />
            )}
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>

      {showStockUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm p-4">
          <div className="w-auto h-auto bg-white rounded-lg shadow-2xl overflow-hidden relative">
            <StockUnit
              onClose={() => {
                setShowStockUnit(false);
                setSelectedStockUnitForEdit(undefined);
              }}
              initialData={selectedStockUnitForEdit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
