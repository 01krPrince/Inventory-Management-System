import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Globe,
  Edit,
  X,
  Save,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Search,
  Plus,
} from "lucide-react";

import Attachment from "../Attachment";
import UnderGroup from "./UnderGroup";
import StockUnit from "./StockUnit";

// --- Types ---

interface SuggestedItem {
  id: number;
  itemId: string;
}

interface FormData {
  // --- Basic Details ---
  itemMode: string;
  itemName: string;
  itemCode: string;
  underGroup: string;
  stockUnit: string;
  gstClassification: string;
  profileImage: string | null;

  // --- Advance Info ---
  category: string;
  brand: string;
  type: string;
  unitOption: string;
  barCode: string;
  autoBarcodePrefix: string;
  gstInputNotApplicable: boolean;
  printBarcode: boolean;

  // --- Sales Config ---
  salesDescription: string;
  salesGL: string;
  mrp: string;
  minPrice: string;
  salesRate: string;
  wholesaleRate: string;
  dealerRate: string;
  rateFactor: string;
  salesDiscount: string;
  salesDiscountPercent: string;

  // --- Purchase Config ---
  purchaseDescription: string;
  purchaseGL: string;
  purchaseRate: string;
  purchaseRateFactor: string;
  purchaseDiscount1: string;
  purchaseDiscount2: string;

  // --- Attributes Config ---
  itemWorkflow: string;
  procurementType: string;
  minLevel: string;
  maxLevel: string;
  weighscaleMappingCode: string;
  rackBinNo: string;
  itemSetTemplate: string;
  batchWiseInventory: boolean;
  batchWiseRate: boolean;
  drugType: string;
  salt: string;
  skipLoyaltyPoints: boolean;
  excludeInCvss: boolean;

  // --- UDF And Attributes ---
  askUdfInDocument: boolean;

  // --- Suggested Category Items ---
  suggestedItems: SuggestedItem[];
}

const INITIAL_DATA: FormData = {
  // --- Basic Details ---
  itemMode: "Inventory",
  itemName: "",
  itemCode: "0001639",
  underGroup: "",
  stockUnit: "",
  gstClassification: "",
  profileImage: null,

  // --- Advance Info ---
  category: "",
  brand: "",
  type: "FinishProduct",
  unitOption: "StockUnit",
  barCode: "",
  autoBarcodePrefix: "",
  gstInputNotApplicable: false,
  printBarcode: true,

  // --- Sales ---
  salesDescription: "",
  salesGL: "",
  mrp: "",
  minPrice: "",
  salesRate: "",
  wholesaleRate: "",
  dealerRate: "",
  rateFactor: "",
  salesDiscount: "",
  salesDiscountPercent: "",

  // --- Purchase ---
  purchaseDescription: "",
  purchaseGL: "Purchases - Traded Goods",
  purchaseRate: "0",
  purchaseRateFactor: "0",
  purchaseDiscount1: "0",
  purchaseDiscount2: "0",

  // --- Attributes ---
  itemWorkflow: "Regular",
  procurementType: "Purchase",
  minLevel: "0",
  maxLevel: "0",
  weighscaleMappingCode: "",
  rackBinNo: "",
  itemSetTemplate: "",
  batchWiseInventory: false,
  batchWiseRate: false,
  drugType: "Regular",
  salt: "",
  skipLoyaltyPoints: false,
  excludeInCvss: false,

  // --- UDF ---
  askUdfInDocument: false,

  // --- Suggested Items ---
  suggestedItems: [{ id: 1, itemId: "" }],
};

const STEPS = [
  { id: 0, label: "Basic Details" },
  { id: 1, label: "Advance Info" },
  { id: 2, label: "Sales Config" },
  { id: 3, label: "Purchase Config" },
  { id: 4, label: "Attributes Config" },
  { id: 5, label: "UDF And Attributes" },
  { id: 6, label: "Suggested Category Items" },
  { id: 7, label: "Attachments" },
];

// --- Reusable UI Components ---

const FormLabel = ({
  required,
  children,
  className = "",
}: {
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) => (
  <label className={`block text-xs font-medium text-gray-700 ${className}`}>
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const ToggleSwitch = ({
  checked,
  onChange,
  name,
}: {
  checked: boolean;
  onChange: any;
  name: string;
}) => (
  <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
    <input
      type="checkbox"
      name={name}
      id={name}
      className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300"
      style={{
        right: checked ? "0" : "auto",
        left: checked ? "auto" : "0",
        borderColor: checked ? "#1e40af" : "#d1d5db",
      }}
      checked={checked}
      onChange={onChange}
    />
    <label
      htmlFor={name}
      className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${
        checked ? "bg-[#0c5888]" : "bg-gray-300"
      }`}
    ></label>
  </div>
);

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  className = "",
  placeholder = "",
}: any) => (
  <div className={`mb-3 ${className}`}>
    <FormLabel required={required}>{label}</FormLabel>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#0c5888]"
    />
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  className = "",
}: any) => (
  <div className={`mb-3 ${className}`}>
    <FormLabel required={required}>{label}</FormLabel>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#0c5888]"
    >
      {options.map((opt: string) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

// --- Main Component ---

interface AddNewItemProps {
  onClose: () => void;
  initialData?: any;
  onSuccess?: (data?: any) => void;
}

const AddNewItem: React.FC<AddNewItemProps> = ({
  onClose,
  initialData,
  onSuccess,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showItemGroupModal, setShowItemGroupModal] = useState(false);
  const [showStockUnit, setShowStockUnit] = useState(false);

  const isEditMode = !!initialData && !!initialData._id;

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        itemName: initialData.name || prev.itemName,
        itemCode: initialData.code || prev.itemCode,
        category: initialData.category_name || prev.category,
        barCode: initialData.bar_code || prev.barCode,
        gstClassification: initialData.hsn_code || prev.gstClassification,
        underGroup: initialData.group || prev.underGroup,
        rackBinNo: initialData.rack_box || prev.rackBinNo,
      }));
    } else {
      setFormData(INITIAL_DATA);
    }
  }, [initialData]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFormData((prev) => ({ ...prev, profileImage: url }));
    }
  };

  // --- Logic to Open Item Group Modal ---
  const handleUnderGroupForm = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent accidental form submission
    setShowItemGroupModal(true);
  };

  // --- Logic to Open Item Group Modal ---
  const handleStockUnit = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent accidental form submission
    setShowStockUnit(true);
  };

  const handleNext = async () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      setIsSubmitting(true);
      try {
        console.log(isEditMode ? "Updating:" : "Creating:", formData);
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (onSuccess) onSuccess(formData);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    } else {
      onClose();
    }
  };

  // --- 0. Basic Details ---
  const renderBasicDetails = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-9 space-y-3">
          {/* Item Mode */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel>Item Mode</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9">
              <select
                name="itemMode"
                value={formData.itemMode}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#0c5888]"
              >
                <option value="Inventory">Inventory</option>
                <option value="Non Inventory">Non Inventory</option>
                <option value="Service">Service</option>
                <option value="Bundle">Bundle</option>
              </select>
            </div>
          </div>

          {/* Name */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel required>Name</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9 flex">
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm focus:outline-none focus:border-[#0c5888]"
              />
              <button className="bg-[#0c5888] text-white px-2 rounded-r hover:bg-[#0a4a70]">
                <Globe className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Code */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel required>Code</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9 flex">
              <input
                type="text"
                name="itemCode"
                value={formData.itemCode}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm focus:outline-none focus:border-[#0c5888]"
              />
              <button className="bg-[#0c5888] text-white px-2 rounded-r hover:bg-[#0a4a70]">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Under Group - UPDATED WITH CLICK HANDLER */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel required>Under Group</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9 flex">
              <select
                name="underGroup"
                value={formData.underGroup}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#0c5888]"
              >
                <option value="">Select...</option>
                <option value="Group 1">Group 1</option>
                <option value="Group 2">Group 2</option>
                <option value="Accessories">Accessories</option>
                <option value="Cables">Cables</option>
                <option value="Hand Tools">Hand Tools</option>
              </select>
              <button
                className="bg-[#0c5888] text-white px-2 rounded-r hover:bg-[#0a4a70]"
                onClick={handleUnderGroupForm} // Trigger modal open
                type="button" // Important to prevent form submission
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stock Unit */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel required>Stock Unit</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9 flex">
              <select
                name="stockUnit"
                value={formData.stockUnit}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#0c5888]"
              >
                <option value="">Select...</option>
                <option value="Unit 1">Nos</option>
                <option value="Unit 2">Kg</option>
              </select>
              <button
                className="bg-[#0c5888] text-white px-2 rounded-r hover:bg-[#0a4a70]"
                type="button" // <--- Add this line to prevent form submit
              >
                <Edit className="w-4 h-4" onClick={handleStockUnit} />
              </button>
            </div>
          </div>

          {/* GST Classification */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel>GST Classification</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9 flex">
              <select
                name="gstClassification"
                value={formData.gstClassification}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#0c5888]"
              >
                <option value="">Select...</option>
                <option value="8504">8504 (Chargers)</option>
                <option value="8205">8205 (Tools)</option>
                <option value="8544">8544 (Cables)</option>
              </select>
              <button className="bg-[#0c5888] text-white px-2 border-r border-white/20 hover:bg-[#0a4a70]">
                <Edit className="w-4 h-4" />
              </button>
              <button className="bg-[#0c5888] text-white px-2 rounded-r hover:bg-[#0a4a70]">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Image Upload */}
        <div className="col-span-12 md:col-span-3 flex flex-col items-center">
          <div className="w-full max-w-[180px] h-[180px] bg-gray-100 border border-dashed border-gray-400 rounded relative flex flex-col items-center justify-center overflow-hidden mb-2">
            {formData.profileImage ? (
              <>
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, profileImage: null }))
                  }
                  className="absolute top-0 right-0 bg-[#0c5888] text-white p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full text-blue-500">
                <div className="w-20 h-20 bg-[#3b82f6] rounded-full mb-[-10px] z-10"></div>
                <div className="w-28 h-14 bg-[#3b82f6] rounded-t-full"></div>
                <button className="absolute top-0 right-0 bg-[#0c5888] text-white p-1">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <label className="w-full max-w-[180px] cursor-pointer bg-[#0c5888] hover:bg-[#0a4a70] text-white text-sm font-medium py-2 px-4 rounded text-center">
            Browse
            <input
              type="file"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </label>
        </div>
      </div>
    </div>
  );

  // --- 1. Advance Info ---
  const renderAdvanceInfo = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-1 md:col-span-2 space-y-4 max-w-4xl">
          {/* Category */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel>Category</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9 flex">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#0c5888]"
              >
                <option value="">Select...</option>
                <option value="Electronics">Electronics</option>
                <option value="Grocery">Grocery</option>
                <option value="Tools">Tools</option>
                <option value="Safety">Safety</option>
              </select>
              <button className="bg-[#0c5888] text-white px-2 rounded-r hover:bg-[#0a4a70]">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Brand */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel>Brand</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9 flex">
              <select
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#0c5888]"
              >
                <option value="">Select...</option>
                <option value="Dell">Dell</option>
                <option value="Samsung">Samsung</option>
                <option value="Apple">Apple</option>
                <option value="Stanley">Stanley</option>
                <option value="Sony">Sony</option>
                <option value="3M">3M</option>
                <option value="LG">LG</option>
              </select>
              <button className="bg-[#0c5888] text-white px-2 rounded-r hover:bg-[#0a4a70]">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Type */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel>type</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9">
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#0c5888]"
              >
                <option value="FinishProduct">FinishProduct</option>
                <option value="RawMaterial">RawMaterial</option>
                <option value="Power">Power</option>
                <option value="Kit">Kit</option>
                <option value="Video">Video</option>
                <option value="Wearable">Wearable</option>
                <option value="Display">Display</option>
              </select>
            </div>
          </div>

          {/* Unit Option */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel>Unit Option</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9">
              <select
                name="unitOption"
                value={formData.unitOption}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#0c5888]"
              >
                <option value="StockUnit">StockUnit</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* BarCode */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel>BarCode</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9">
              <input
                type="text"
                name="barCode"
                value={formData.barCode}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#0c5888]"
              />
            </div>
          </div>

          {/* Auto Barcode/Serial Prefix */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel>Auto Barcode/Serial Prefix</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9">
              <input
                type="text"
                name="autoBarcodePrefix"
                value={formData.autoBarcodePrefix}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#0c5888]"
              />
            </div>
          </div>

          {/* Gst Input Not Applicable */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel>Gst Input Not Applicable</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9 flex justify-end">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-600">
                  {formData.gstInputNotApplicable ? "ON" : "OFF"}
                </span>
                <ToggleSwitch
                  name="gstInputNotApplicable"
                  checked={formData.gstInputNotApplicable}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Print Barcode */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel>Print Barcode</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9 flex justify-end">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-600">
                  {formData.printBarcode ? "ON" : "OFF"}
                </span>
                <ToggleSwitch
                  name="printBarcode"
                  checked={formData.printBarcode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- 2. Sales Config ---
  const saleConfig = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div>
            <FormLabel>Description</FormLabel>
            <textarea
              name="salesDescription"
              value={formData.salesDescription}
              onChange={handleInputChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm resize-none focus:outline-none focus:border-[#0c5888]"
            />
          </div>
          <InputField
            label="Sales GL ★"
            name="salesGL"
            value={formData.salesGL}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="MRP"
              name="mrp"
              value={formData.mrp}
              onChange={handleInputChange}
            />
            <InputField
              label="Minimum Price"
              name="minPrice"
              value={formData.minPrice}
              onChange={handleInputChange}
            />
          </div>
          <InputField
            label="Sales Rate"
            name="salesRate"
            value={formData.salesRate}
            onChange={handleInputChange}
          />
          <InputField
            label="Wholesale Rate"
            name="wholesaleRate"
            value={formData.wholesaleRate}
            onChange={handleInputChange}
          />
          <InputField
            label="Dealer Rate"
            name="dealerRate"
            value={formData.dealerRate}
            onChange={handleInputChange}
          />
          <InputField
            label="Rate Factor"
            name="rateFactor"
            value={formData.rateFactor}
            onChange={handleInputChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Discount"
              name="salesDiscount"
              value={formData.salesDiscount}
              onChange={handleInputChange}
            />
            <InputField
              label="Discount %"
              name="salesDiscountPercent"
              value={formData.salesDiscountPercent}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // --- 3. Purchase Config ---
  const purchageConfig = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-7 space-y-6">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 md:col-span-3 pt-2">
              <FormLabel>Description</FormLabel>
            </div>
            <div className="col-span-12 md:col-span-9">
              <textarea
                name="purchaseDescription"
                value={formData.purchaseDescription}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm resize-none focus:outline-none focus:border-[#0c5888]"
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-12 md:col-span-3">
              <FormLabel required>Purchase GL</FormLabel>
            </div>
            <div className="col-span-12 md:col-span-9 flex">
              <select
                name="purchaseGL"
                value={formData.purchaseGL}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#0c5888]"
              >
                <option value="Purchases - Traded Goods">
                  Purchases - Traded Goods
                </option>
                <option value="Purchases - Raw Material">
                  Purchases - Raw Material
                </option>
              </select>
              <button className="bg-[#0c5888] text-white px-2 rounded-r hover:bg-[#0a4a70]">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-5 space-y-3">
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-5">
              <FormLabel>Purchase Rate</FormLabel>
            </div>
            <div className="col-span-7">
              <input
                type="text"
                name="purchaseRate"
                value={formData.purchaseRate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:border-[#0c5888]"
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-5">
              <FormLabel>Purchase Rate F...</FormLabel>
            </div>
            <div className="col-span-7">
              <input
                type="text"
                name="purchaseRateFactor"
                value={formData.purchaseRateFactor}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:border-[#0c5888]"
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-5">
              <FormLabel>Discount</FormLabel>
            </div>
            <div className="col-span-7">
              <input
                type="text"
                name="purchaseDiscount1"
                value={formData.purchaseDiscount1}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:border-[#0c5888]"
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-5">
              <FormLabel>Discount</FormLabel>
            </div>
            <div className="col-span-7">
              <input
                type="text"
                name="purchaseDiscount2"
                value={formData.purchaseDiscount2}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:border-[#0c5888]"
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center h-8">
            <div className="col-span-5"></div>
            <div className="col-span-7 border-b border-gray-100"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- 4. Attributes Config ---
  const attributesConfig = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
        <div className="space-y-4">
          <SelectField
            label="Item Workflow"
            name="itemWorkflow"
            value={formData.itemWorkflow}
            onChange={handleInputChange}
            options={["Regular", "Non-Inventory", "Service"]}
          />
          <SelectField
            label="Procurement Type"
            name="procurementType"
            value={formData.procurementType}
            onChange={handleInputChange}
            options={["Purchase", "Manufacture", "Both"]}
          />
          <InputField
            label="Minimum Level"
            name="minLevel"
            type="number"
            value={formData.minLevel}
            onChange={handleInputChange}
          />
          <InputField
            label="Maximum Level"
            name="maxLevel"
            type="number"
            value={formData.maxLevel}
            onChange={handleInputChange}
          />
          <InputField
            label="Weighscale Mapping Code"
            name="weighscaleMappingCode"
            value={formData.weighscaleMappingCode}
            onChange={handleInputChange}
          />
          <InputField
            label="Rack-Bin No"
            name="rackBinNo"
            value={formData.rackBinNo}
            onChange={handleInputChange}
          />
          <SelectField
            label="Add in Item Set template"
            name="itemSetTemplate"
            value={formData.itemSetTemplate}
            onChange={handleInputChange}
            options={["Select", "Template A", "Template B"]}
          />
        </div>

        <div className="space-y-5">
          <div className="flex justify-between items-center h-9">
            <span className="text-sm text-gray-700">Batch wise Inventory</span>
            <ToggleSwitch
              name="batchWiseInventory"
              checked={formData.batchWiseInventory}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-between items-center h-9">
            <span className="text-sm text-gray-700">Batch Wise Rate</span>
            <ToggleSwitch
              name="batchWiseRate"
              checked={formData.batchWiseRate}
              onChange={handleInputChange}
            />
          </div>

          <SelectField
            label="Drug Type"
            name="drugType"
            value={formData.drugType}
            onChange={handleInputChange}
            options={["Regular", "Schedule H", "Schedule X"]}
          />

          <InputField
            label="Salt"
            name="salt"
            value={formData.salt}
            onChange={handleInputChange}
          />

          <div className="flex items-center pt-2 pb-2">
            <input
              type="checkbox"
              id="skipLoyaltyPoints"
              name="skipLoyaltyPoints"
              checked={formData.skipLoyaltyPoints}
              onChange={handleInputChange}
              className="w-4 h-4 text-[#0c5888] border-gray-300 rounded focus:ring-[#0c5888]"
            />
            <label
              htmlFor="skipLoyaltyPoints"
              className="ml-2 text-sm text-gray-700"
            >
              Skip this Item from Loyalty P...
            </label>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-gray-700">
              Exclude in CVSS App list
            </span>
            <ToggleSwitch
              name="excludeInCvss"
              checked={formData.excludeInCvss}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // --- 5. UDF And Attributes ---
  const udfAndAttributes = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4 min-h-[300px]">
      <div className="text-right text-sm font-medium text-gray-700 mb-8 border-b pb-2">
        Financial Posting (Ledger) Attributes - Select if applicable
      </div>

      <div className="flex items-center justify-between max-w-md">
        <span className="text-sm text-gray-700">Ask UDF In Document</span>
        <ToggleSwitch
          name="askUdfInDocument"
          checked={formData.askUdfInDocument}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );

  // --- 6. Suggested Category Items ---
  const handleAddSuggestedItem = () => {
    const newId =
      formData.suggestedItems.length > 0
        ? Math.max(...formData.suggestedItems.map((i) => i.id)) + 1
        : 1;
    setFormData((prev) => ({
      ...prev,
      suggestedItems: [...prev.suggestedItems, { id: newId, itemId: "" }],
    }));
  };

  const handleRemoveSuggestedItem = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      suggestedItems: prev.suggestedItems.filter((item) => item.id !== id),
    }));
  };

  const handleSuggestedItemChange = (id: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      suggestedItems: prev.suggestedItems.map((item) =>
        item.id === id ? { ...item, itemId: value } : item
      ),
    }));
  };

  const suggestedCategoryItems = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4 min-h-[400px]">
      <div className="flex justify-end mb-4">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-gray-300 rounded pl-8 pr-4 py-1.5 text-sm focus:outline-none focus:border-[#0c5888]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-2 top-2" />
        </div>
      </div>

      <div className="border border-gray-300 rounded overflow-hidden">
        <div className="bg-[#0c5888] text-white flex text-sm font-semibold">
          <div className="w-10 py-2 border-r border-blue-800"></div>
          <div className="w-10 py-2 border-r border-blue-800"></div>
          <div className="flex-1 py-2 px-3">Item</div>
        </div>

        {formData.suggestedItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center border-b border-gray-200 last:border-0 bg-white"
          >
            <div className="w-10 flex justify-center py-1 border-r border-gray-200">
              <button
                onClick={handleAddSuggestedItem}
                className="text-green-600 hover:text-green-800"
              >
                <Plus className="w-5 h-5 font-bold" strokeWidth={3} />
              </button>
            </div>
            <div className="w-10 flex justify-center py-1 border-r border-gray-200">
              <button
                onClick={() => handleRemoveSuggestedItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-5 h-5 font-bold" strokeWidth={3} />
              </button>
            </div>
            <div className="flex-1 p-1">
              <select
                value={item.itemId}
                onChange={(e) =>
                  handleSuggestedItemChange(item.id, e.target.value)
                }
                className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#0c5888]"
              >
                <option value="">Select...</option>
                <option value="Item A">Item A</option>
                <option value="Item B">Item B</option>
              </select>
            </div>
          </div>
        ))}
        {formData.suggestedItems.length === 0 && (
          <div className="flex items-center border-b border-gray-200 bg-white">
            <div className="w-10 flex justify-center py-1 border-r border-gray-200">
              <button
                onClick={handleAddSuggestedItem}
                className="text-green-600 hover:text-green-800"
              >
                <Plus className="w-5 h-5 font-bold" strokeWidth={3} />
              </button>
            </div>
            <div className="w-10 border-r border-gray-200"></div>
            <div className="flex-1 p-1"></div>
          </div>
        )}
      </div>
    </div>
  );

  const Attachments = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <Attachment />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#0c5888] px-6 py-4 text-white flex justify-between items-center">
          <h1 className="text-xl font-semibold tracking-wide">
            {isEditMode ? "EDIT ITEM" : "ADD NEW ITEM"}
          </h1>
          <div className="text-sm opacity-80">
            Step {activeStep + 1} of {STEPS.length}
          </div>
        </div>

        {/* Timeline / Progress Bar */}
        <div className="bg-gray-100 border-b overflow-x-auto">
          <div className="flex min-w-max px-4">
            {STEPS.map((step, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;
              const isPending = index > activeStep;

              return (
                <div
                  key={step.id}
                  className={`
                      relative py-3 px-4 text-sm font-medium cursor-pointer transition-colors duration-200 flex items-center
                      ${
                        isActive
                          ? "text-[#0c5888] border-b-2 border-[#0c5888] bg-white"
                          : ""
                      }
                      ${isCompleted ? "text-green-600" : ""}
                      ${isPending ? "text-gray-400 hover:text-gray-600" : ""}
                    `}
                  onClick={() => setActiveStep(index)}
                >
                  <span
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 border
                      ${
                        isActive
                          ? "bg-[#0c5888] text-white border-[#0c5888]"
                          : ""
                      }
                      ${
                        isCompleted
                          ? "bg-green-100 text-green-600 border-green-600"
                          : ""
                      }
                      ${isPending ? "bg-gray-100 border-gray-300" : ""}
                    `}
                  >
                    {index + 1}
                  </span>
                  {step.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 bg-white min-h-[500px]">
          {activeStep === 0 && renderBasicDetails()}
          {activeStep === 1 && renderAdvanceInfo()}
          {activeStep === 2 && saleConfig()}
          {activeStep === 3 && purchageConfig()}
          {activeStep === 4 && attributesConfig()}
          {activeStep === 5 && udfAndAttributes()}
          {activeStep === 6 && suggestedCategoryItems()}
          {activeStep === 7 && Attachments()}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={handleBack}
            className="flex items-center px-4 py-2 rounded border font-medium transition-colors text-gray-700 border-gray-300 hover:bg-gray-100 bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className={`flex items-center px-6 py-2 bg-[#0c5888] text-white rounded hover:bg-[#0a4a70] font-medium shadow-sm ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {activeStep === STEPS.length - 1 ? (
              <>
                <Save className="w-4 h-4 mr-2" />{" "}
                {isSubmitting
                  ? "Processing..."
                  : isEditMode
                  ? "Update"
                  : "Submit"}
              </>
            ) : (
              <>
                Save & Next <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ITEM GROUP MODAL OVERLAY */}
      {showItemGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm p-4">
          <div className="w-full max-w-6xl h-auto bg-white rounded-lg shadow-2xl overflow-hidden relative">
            <UnderGroup onClose={() => setShowItemGroupModal(false)} />
          </div>
        </div>
      )}

      {/* ITEM GROUP MODAL OVERLAY */}
      {showStockUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm p-4">
          <div className=" w-auto h-auto bg-white rounded-lg shadow-2xl overflow-hidden relative">
            <StockUnit onClose={() => setShowStockUnit(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewItem;
