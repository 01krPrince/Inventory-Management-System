import React, { useState, ChangeEvent, useEffect } from "react";
import { Edit, Save, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import Brand from "./Brand";
import ItemCategory from "./ItemCategory";

import Attachment from "../Attachment";
import UnderGroup from "./UnderGroup";
import StockUnit from "./StockUnit";

import {
  createItem,
  updateItem,
  fetchCategories,
  fetchBrands,
  fetchStockUnits,
  fetchGstClassifications,
  CategoryData,
  BrandData,
  StockUnitData,
  GstClassificationData,
} from "./api/itemService";

import {
  fetchSalesAndPurchaseGL,
  SalesAndPurchaseGL,
} from "./api/saleAndPurchaseGL";

import { ItemFormData, ItemApiData } from "./models/ItemModel";
import ChartOfAccounts from "../ChartOfAccount";

const INITIAL_DATA: ItemFormData = {
  // Basic Details
  itemMode: "Inventory",
  itemName: "",
  underGroup: "",
  stockUnit: "",
  gstClassification: "",
  profileImage: null,

  // Advance Info
  category: "",
  brand: "",
  type: "FinishProduct",
  unitOption: "StockUnit",
  barCode: "",
  autoBarcodePrefix: "",
  gstInputNotApplicable: false,
  printBarcode: true,

  // Sales
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

  // Purchase
  purchaseDescription: "",
  purchaseGL: "Purchases - Traded Goods",
  purchaseRate: "0",
  purchaseRateFactor: "0",
  purchaseDiscount1: "0",
  purchaseDiscount2: "0",

  // Attributes
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
  askUdfInDocument: false,

  // Suggested Items
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
  required = false,
  placeholder = "",
}: any) => (
  <div className="mb-3">
    <FormLabel required={required}>{label}</FormLabel>
    <input
      type="text"
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
}: any) => (
  <div className="mb-3">
    <FormLabel required={required}>{label}</FormLabel>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#0c5888]"
    >
      <option value="">Select...</option>
      {options.map((opt: string) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

interface AddNewItemProps {
  onClose: () => void;
  initialData?: ItemApiData;
  onSuccess?: (data?: any) => void;
}

const AddNewItem: React.FC<AddNewItemProps> = ({
  onClose,
  initialData,
  onSuccess,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<ItemFormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showItemGroupModal, setShowItemGroupModal] = useState(false);
  const [showStockUnit, setShowStockUnit] = useState(false);

  // States for the new modals
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isItemCategory, setIsItemCategory] = useState(false);

  // --- CHART OF ACCOUNTS STATE ---
  const [showChartOfAccounts, setShowChartOfAccounts] = useState(false);
  const [coaFormData, setCoaFormData] = useState<SalesAndPurchaseGL | null>(
    null
  );
  const [activeGLType, setActiveGLType] = useState<"sales" | "purchase" | null>(
    null
  );

  // --- GL DATA STATE ---
  const [glDataFull, setGlDataFull] = useState<SalesAndPurchaseGL[]>([]);

  const [salesGLList, setSalesGLList] = useState<string[]>([]);
  const [purchaseGLList, setPurchaseGLList] = useState<string[]>([]);

  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [stockUnitList, setStockUnitList] = useState<StockUnitData[]>([]);
  const [gstList, setGstList] = useState<GstClassificationData[]>([]);

  const isEditMode = !!initialData && !!initialData._id;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, brnds, units, gsts, glData] = await Promise.all([
          fetchCategories(),
          fetchBrands(),
          fetchStockUnits(),
          fetchGstClassifications(),
          fetchSalesAndPurchaseGL(),
        ]);

        setCategories(cats || []);
        setBrands(brnds || []);
        setStockUnitList(units || []);
        setGstList(gsts || []);

        if (glData && Array.isArray(glData)) {
          setGlDataFull(glData);

          const glNames = glData
            .filter((item) => item.name && item.name.trim() !== "")
            .map((item) => item.name);

          setSalesGLList(glNames);
          setPurchaseGLList(glNames);
        }
      } catch (error) {
        console.error("Failed to load dropdown data", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prev) => ({
        ...prev,
        itemMode: initialData.item_mode || prev.itemMode,
        itemName: initialData.name || prev.itemName,
        underGroup: initialData.under_group || prev.underGroup,
        stockUnit: initialData.stock_unit || prev.stockUnit,
        gstClassification:
          initialData.gst_classfication || prev.gstClassification,

        category: initialData.category || prev.category,
        brand: initialData.brand || prev.brand,
        type: initialData.type || prev.type,
        unitOption: initialData.unit_option || prev.unitOption,
        barCode: initialData.barcode || prev.barCode,
        autoBarcodePrefix: initialData.auto_barcode || prev.autoBarcodePrefix,

        gstInputNotApplicable: initialData.gst_applicable === false,
        printBarcode: initialData.print_barcode,

        salesDescription: initialData.sale_desc || prev.salesDescription,
        salesGL: initialData.sales_gl || prev.salesGL,
        mrp: initialData.mrp || prev.mrp,
        minPrice: initialData.minimum_price || prev.minPrice,
        salesRate: initialData.sales_rate || prev.salesRate,
        wholesaleRate: initialData.wholesale_rate || prev.wholesaleRate,
        dealerRate: initialData.dealer_factor || prev.dealerRate,
        rateFactor: initialData.rate_factor || prev.rateFactor,
        salesDiscount: initialData.sale_discount || prev.salesDiscount,
        salesDiscountPercent:
          initialData.sale_discount_percent || prev.salesDiscountPercent,

        purchaseDescription: initialData.purch_desc || prev.purchaseDescription,
        purchaseGL: initialData.purchase_gl || prev.purchaseGL,
        purchaseRate: initialData.purchase_rate || prev.purchaseRate,
        purchaseRateFactor:
          initialData.purchase_ratefactor || prev.purchaseRateFactor,
        purchaseDiscount1:
          initialData.purchase_discount || prev.purchaseDiscount1,
        purchaseDiscount2:
          initialData.purchase_discount_percent || prev.purchaseDiscount2,

        itemWorkflow: initialData.item_workflow || prev.itemWorkflow,
        procurementType: initialData.procurement_type || prev.procurementType,
        minLevel: initialData.minimum_level || prev.minLevel,
        maxLevel: initialData.maximum_level || prev.maxLevel,
        weighscaleMappingCode:
          initialData.weighscale_mapping_code || prev.weighscaleMappingCode,
        rackBinNo: initialData.rackbin_no || prev.rackBinNo,
        itemSetTemplate:
          initialData.add_in_item_set_template || prev.itemSetTemplate,

        batchWiseInventory: initialData.batch_wise_inventory,
        batchWiseRate: initialData.batch_wise_rate,
        drugType: initialData.drug_type || prev.drugType,
        salt: initialData.salt || prev.salt,
        skipLoyaltyPoints: initialData.skip_item_from_loyalty === "Yes",
        excludeInCvss: initialData.exclude_cvss_applist,
        askUdfInDocument: initialData.ask_udf_in_document === "Y",

        profileImage: initialData.attachment || prev.profileImage,
        suggestedItems: prev.suggestedItems,
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

  const handleNext = async () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      setIsSubmitting(true);
      try {
        let response;
        if (isEditMode && initialData?._id) {
          response = await updateItem(initialData._id, formData);
        } else {
          response = await createItem(formData);
        }

        if (response.success) {
          alert(
            isEditMode
              ? "Item Updated Successfully!"
              : "Item Created Successfully!"
          );
          if (onSuccess) onSuccess(response.data);
          onClose();
        } else {
          alert(`Failed: ${response.message}`);
        }
      } catch (error) {
        alert("An error occurred. Please check console.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleOpenCOA = (type: "sales" | "purchase", currentValue: string) => {
    setActiveGLType(type);

    if (currentValue && currentValue.trim() !== "") {
      const selectedItem = glDataFull.find(
        (item) => item.name === currentValue
      );

      if (selectedItem) {
        setCoaFormData(selectedItem);
      } else {
        setCoaFormData({ name: currentValue } as SalesAndPurchaseGL);
      }
    } else {
      setCoaFormData(null);
    }

    setShowChartOfAccounts(true);
  };

  const handleSaveCOA = (savedData: SalesAndPurchaseGL) => {
    const savedName = savedData?.name;

    if (savedName) {
      setGlDataFull((prev) => {
        const exists = prev.find((item) => item.name === savedName);
        if (exists) {
          return prev.map((item) =>
            item.name === savedName ? savedData : item
          );
        }
        return [...prev, savedData];
      });

      if (activeGLType === "sales") {
        setSalesGLList((prev) =>
          prev.includes(savedName) ? prev : [...prev, savedName]
        );
        setFormData((prev) => ({ ...prev, salesGL: savedName }));
      } else if (activeGLType === "purchase") {
        setPurchaseGLList((prev) =>
          prev.includes(savedName) ? prev : [...prev, savedName]
        );
        setFormData((prev) => ({ ...prev, purchaseGL: savedName }));
      }
    }
    setShowChartOfAccounts(false);
  };

  const renderBasicDetails = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-9 space-y-3">
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel>Item Mode</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9">
              <select
                name="itemMode"
                value={formData.itemMode}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white outline-none"
              >
                <option value="Inventory">Inventory</option>
                <option value="Non-Inventory">Non-Inventory</option>
                <option value="Service">Service</option>
                <option value="Bundle">Bundle</option>
              </select>
            </div>
          </div>

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
                className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel required>Under Group</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9 flex">
              <select
                name="underGroup"
                value={formData.underGroup}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm outline-none"
              >
                <option value="">Select...</option>
                <option value="Grocery">Grocery</option>
                <option value="Electronics">Electronics</option>
                {categories
                  .filter((cat) => cat.name && cat.name.trim() !== "")
                  .map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
              </select>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowItemGroupModal(true);
                }}
                className="bg-[#0c5888] text-white px-2 rounded-r"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel required>Stock Unit</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9 flex">
              <select
                name="stockUnit"
                value={formData.stockUnit}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm outline-none"
              >
                <option value="">Select...</option>
                {stockUnitList
                  .filter((unit) => unit.name && unit.name.trim() !== "")
                  .map((unit) => (
                    <option key={unit._id} value={unit.name}>
                      {unit.name}
                    </option>
                  ))}
              </select>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowStockUnit(true);
                }}
                className="bg-[#0c5888] text-white px-2 rounded-r"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel>GST Classification(HSN/SAC)</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9 flex">
              <select
                name="gstClassification"
                value={formData.gstClassification}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm outline-none"
              >
                <option value="">Select...</option>
                {gstList.length > 0 ? (
                  gstList
                    .filter(
                      (gst) =>
                        gst.hsn_description && gst.hsn_description.trim() !== ""
                    )
                    .map((gst) => (
                      <option key={gst._id} value={gst.hsn_description}>
                        {gst.hsn_description}
                      </option>
                    ))
                ) : (
                  <>
                    <option value="Non-Medical">Non-Medical</option>
                    <option value="General">General</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-3 flex flex-col items-center">
          <div className="w-full h-[180px] bg-gray-100 border border-dashed rounded flex flex-col items-center justify-center mb-2 overflow-hidden relative">
            {formData.profileImage ? (
              <img
                src={formData.profileImage}
                className="w-full h-full object-cover"
                alt="Profile"
              />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>
          <label className="bg-[#0c5888] text-white px-4 py-2 rounded cursor-pointer text-sm">
            Browse
            <input
              type="file"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderAdvanceInfo = () => {
    const categoryOptions = categories
      .filter((c) => c.name && c.name.trim() !== "")
      .map((c) => c.name);

    const brandOptions = brands
      .filter((b) => b.name && b.name.trim() !== "")
      .map((b) => b.name);

    return (
      <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4 max-w-4xl">
            <div className="mb-3">
              <FormLabel>Category</FormLabel>
              <div className="flex w-full">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#0c5888]"
                >
                  <option value="">Select...</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsItemCategory(true);
                  }}
                  className="bg-[#0c5888] text-white px-2 rounded-r hover:bg-[#0a4a70] transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-3">
              <FormLabel>Brand</FormLabel>
              <div className="flex w-full">
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#0c5888]"
                >
                  <option value="">Select...</option>
                  {brandOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsBrandOpen(true);
                  }}
                  className="bg-[#0c5888] text-white px-2 rounded-r hover:bg-[#0a4a70] transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>

            <SelectField
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              options={["Pack", "FinishProduct", "RawMaterial"]}
            />
            <SelectField
              label="Unit Option"
              name="unitOption"
              value={formData.unitOption}
              onChange={handleInputChange}
              options={["Packet", "StockUnit", "Other"]}
            />
            <InputField
              label="BarCode"
              name="barCode"
              value={formData.barCode}
              onChange={handleInputChange}
            />
            <InputField
              label="Auto Barcode Prefix"
              name="autoBarcodePrefix"
              value={formData.autoBarcodePrefix}
              onChange={handleInputChange}
            />

            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4 md:col-span-3">
                <FormLabel>Gst Input Not Applicable</FormLabel>
              </div>
              <div className="col-span-8 md:col-span-9 flex justify-end">
                <ToggleSwitch
                  name="gstInputNotApplicable"
                  checked={formData.gstInputNotApplicable}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4 md:col-span-3">
                <FormLabel>Print Barcode</FormLabel>
              </div>
              <div className="col-span-8 md:col-span-9 flex justify-end">
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
    );
  };

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
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none"
              rows={3}
            />
          </div>
          <div className="mb-3">
            <FormLabel required>Sales GL</FormLabel>
            <div className="flex w-full">
              <select
                name="salesGL"
                value={formData.salesGL}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#0c5888]"
              >
                <option value="">Select...</option>
                {salesGLList.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenCOA("sales", formData.salesGL);
                }}
                className="bg-[#0c5888] text-white px-2 rounded-r hover:bg-[#0a4a70] transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
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
              label="Min Price"
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

  const purchageConfig = () => {
    return (
      <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-7 space-y-6">
            <div>
              <FormLabel>Description</FormLabel>
              <textarea
                name="purchaseDescription"
                value={formData.purchaseDescription}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none"
                rows={3}
              />
            </div>

            <div className="mb-3">
              <FormLabel required>Purchase GL</FormLabel>
              <div className="flex w-full">
                <select
                  name="purchaseGL"
                  value={formData.purchaseGL}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#0c5888]"
                >
                  <option value="">Select...</option>
                  {purchaseGLList.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenCOA("purchase", formData.purchaseGL);
                  }}
                  className="bg-[#0c5888] text-white px-2 rounded-r hover:bg-[#0a4a70] transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 space-y-3">
            <InputField
              label="Purchase Rate"
              name="purchaseRate"
              value={formData.purchaseRate}
              onChange={handleInputChange}
            />
            <InputField
              label="Rate Factor"
              name="purchaseRateFactor"
              value={formData.purchaseRateFactor}
              onChange={handleInputChange}
            />
            <InputField
              label="Discount 1"
              name="purchaseDiscount1"
              value={formData.purchaseDiscount1}
              onChange={handleInputChange}
            />
            <InputField
              label="Discount %"
              name="purchaseDiscount2"
              value={formData.purchaseDiscount2}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    );
  };

  const attributesConfig = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
        <div className="space-y-4">
          <SelectField
            label="Item Workflow"
            name="itemWorkflow"
            value={formData.itemWorkflow}
            onChange={handleInputChange}
            options={["Standard", "Regular"]}
          />
          <SelectField
            label="Procurement Type"
            name="procurementType"
            value={formData.procurementType}
            onChange={handleInputChange}
            options={["Purchase", "Manufacture"]}
          />
          <InputField
            label="Min Level"
            name="minLevel"
            value={formData.minLevel}
            onChange={handleInputChange}
          />
          <InputField
            label="Max Level"
            name="maxLevel"
            value={formData.maxLevel}
            onChange={handleInputChange}
          />
          <InputField
            label="Weighscale Code"
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
            label="Add in Set Template"
            name="itemSetTemplate"
            value={formData.itemSetTemplate}
            onChange={handleInputChange}
            options={["No", "Select"]}
          />
        </div>
        <div className="space-y-5">
          <div className="flex justify-between items-center h-9">
            <span className="text-sm">Batch Wise Inventory</span>
            <ToggleSwitch
              name="batchWiseInventory"
              checked={formData.batchWiseInventory}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex justify-between items-center h-9">
            <span className="text-sm">Batch Wise Rate</span>
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
            options={["Regular", "Schedule H"]}
          />
          <InputField
            label="Salt"
            name="salt"
            value={formData.salt}
            onChange={handleInputChange}
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              name="skipLoyaltyPoints"
              checked={formData.skipLoyaltyPoints}
              onChange={handleInputChange}
              className="mr-2"
            />{" "}
            <span className="text-sm">Skip Loyalty Points</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Exclude in CVSS</span>
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

  const udfAndAttributes = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4 min-h-[200px]">
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-[#0c5888] px-6 py-4 text-white flex justify-between items-center">
          <h1 className="text-xl font-semibold tracking-wide">
            {isEditMode ? "EDIT ITEM" : "ADD NEW ITEM"}
          </h1>
          <div className="text-sm opacity-80">
            Step {activeStep + 1} of {STEPS.length}
          </div>
        </div>

        <div className="bg-gray-100 border-b overflow-x-auto">
          <div className="flex min-w-max px-4">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`relative py-3 px-4 text-sm font-medium cursor-pointer flex items-center ${
                  index === activeStep
                    ? "text-[#0c5888] border-b-2 border-[#0c5888] bg-white"
                    : ""
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 border ${
                    index === activeStep
                      ? "bg-[#0c5888] text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {index + 1}
                </span>{" "}
                {step.label}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white min-h-[500px]">
          {activeStep === 0 && renderBasicDetails()}
          {activeStep === 1 && renderAdvanceInfo()}
          {activeStep === 2 && saleConfig()}
          {activeStep === 3 && purchageConfig()}
          {activeStep === 4 && attributesConfig()}
          {activeStep === 5 && udfAndAttributes()}
          {activeStep === 6 && (
            <div className="p-4 text-center text-gray-500">
              Suggested Items Placeholder
            </div>
          )}
          {activeStep === 7 && (
            <div className="p-4 text-center text-gray-500">
              <Attachment />
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={() =>
              activeStep > 0 ? setActiveStep((prev) => prev - 1) : onClose()
            }
            className="flex items-center px-4 py-2 rounded border hover:bg-gray-100 bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center px-6 py-2 bg-[#0c5888] text-white rounded hover:bg-[#0a4a70]"
          >
            {activeStep === STEPS.length - 1 ? (
              isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Processing
                </>
              ) : (
                <>
                  <Save className="mr-2" />
                  {isEditMode ? "Update" : "Submit"}
                </>
              )
            ) : (
              <>
                Save & Next <ArrowRight className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>

      {showItemGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded shadow-lg">
            <UnderGroup onClose={() => setShowItemGroupModal(false)} />
          </div>
        </div>
      )}
      {showStockUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded shadow-lg">
            <StockUnit onClose={() => setShowStockUnit(false)} />
          </div>
        </div>
      )}

      {isItemCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded shadow-lg">
            <ItemCategory onClose={() => setIsItemCategory(false)} />
          </div>
        </div>
      )}

      {isBrandOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded shadow-lg">
            <Brand onClose={() => setIsBrandOpen(false)} />
          </div>
        </div>
      )}

      {showChartOfAccounts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <ChartOfAccounts
              isOpen={showChartOfAccounts}
              onClose={() => setShowChartOfAccounts(false)}
              initialData={coaFormData}
              onSave={handleSaveCOA}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewItem;
