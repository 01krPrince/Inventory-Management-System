import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Edit,
  Save,
  ArrowRight,
  ArrowLeft,
  Loader2,
  XIcon,
} from "lucide-react";
import Brand from "./Brand";
import ItemCategory from "./ItemCategory";
import SuggestedCategory from "../../pages/pages/inventory/itemMaster/pages/SuggestedCategory";
import Attachment from "../Attachment";
import UnderGroup from "./UnderGroup";
import StockUnit from "./StockUnit";

import { ItemFormData, CustomWarranty, ItemApiData } from "./models/ItemModel";

import {
  CategoryData,
  BrandData,
  StockUnitData,
  GstClassificationData,
} from "./api/types";
import { fetchCategories } from "./api/categoryservice";
import { fetchBrands } from "./api/brandservice";
import { fetchStockUnits } from "./api/stockunitservice";
import { fetchGstClassifications } from "./api/gstservice";
import { createItem, updateItem } from "./api/itemService";
import { fetchUnderGroup, UnderGroupData } from "./api/underGroupservice";

import { GstClassificationForm } from "../GstClassificationForm";
import Dropdown, { ColumnDef } from "../Dropdown";

const ITEM_MODES = [
  { label: "Inventory", value: "Inventory" },
  { label: "Non-Inventory", value: "Non-Inventory" },
  { label: "Service", value: "Service" },
  { label: "Bundle", value: "Bundle" },
  { label: "Product", value: "Product" },
];

const ITEM_TYPES = [
  { label: "Pack", value: "Pack" },
  { label: "FinishProduct", value: "FinishProduct" },
  { label: "RawMaterial", value: "RawMaterial" },
  { label: "Electrical", value: "Electrical" },
];

const UNIT_OPTIONS = [
  { label: "Packet", value: "Packet" },
  { label: "StockUnit", value: "StockUnit" },
  { label: "Box", value: "Box" },
  { label: "Other", value: "Other" },
];

const WORKFLOW_OPTIONS = [
  { label: "Standard", value: "Standard" },
  { label: "Regular", value: "Regular" },
];

const PROCUREMENT_TYPES = [
  { label: "Purchase", value: "Purchase" },
  { label: "Manufacture", value: "Manufacture" },
];

const SET_TEMPLATE_OPTIONS = [
  { label: "No", value: "No" },
  { label: "Select", value: "Select" },
];

const DRUG_TYPES = [
  { label: "Regular", value: "Regular" },
  { label: "Schedule H", value: "Schedule H" },
];

const simpleLabelColumns: ColumnDef<any>[] = [
  { header: "Option", key: "label", width: "w-full" },
];

const stockUnitColumns: ColumnDef<StockUnitData>[] = [
  { header: "Code", key: "code", width: "w-20" },
  { header: "Name", key: "name", width: "w-full" },
  { header: "UQC", key: "uqc", width: "w-24" },
];

const underGroupColumns: ColumnDef<UnderGroupData>[] = [
  { header: "Under Group", key: "under_group", width: "w-1/3" },
  { header: "Item Name", key: "item_name", width: "w-1/3" },
  { header: "Code", key: "code", width: "w-20" },
];

const gstColumns: ColumnDef<GstClassificationData>[] = [
  { header: "Type", key: "type", width: "w-24" },
  { header: "HSN/SAC", key: "hsn_sac_code", width: "w-32" },
  { header: "Code", key: "code", width: "w-20" },
];

const categoryColumns: ColumnDef<CategoryData>[] = [
  { header: "Code", key: "code", width: "w-24" },
  { header: "Name", key: "name", width: "w-full" },
];

const brandColumns: ColumnDef<BrandData>[] = [
  { header: "Code", key: "code", width: "w-1/3" },
  { header: "Name", key: "name", width: "w-1/3" },
  { header: "Salesman", key: "salesman", width: "w-1/3" },
];

const INITIAL_DATA: ItemFormData = {
  itemMode: "Inventory",
  item_name: "",
  underGroup: "",
  stockUnit: "",
  gstClassification: "",
  profileImage: null,
  warrantyEnabled: false,
  warranty1YearPrice: "",
  warranty2YearPrice: "",
  warranty3YearPrice: "",
  customWarranties: [],
  category: "",
  brand: "",
  type: "FinishProduct",
  unitOption: "StockUnit",
  barCode: "",
  autoBarcodePrefix: "",
  gstInputNotApplicable: false,
  printBarcode: true,
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
  purchaseDescription: "",
  purchaseGL: "Purchases - Traded Goods",
  purchaseRate: "0",
  purchaseRateFactor: "0",
  purchaseDiscount1: "0",
  purchaseDiscount2: "0",
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
  suggestedItems: [],
};

const STEPS = [
  { id: 0, label: "Basic Details" },
  { id: 1, label: "Advance Info" },
  { id: 2, label: "Sales Config" },
  { id: 3, label: "Purchase Config" },
  { id: 4, label: "Attributes Config" },
  { id: 5, label: "Suggested Category Items" },
  { id: 6, label: "Attachments" },
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

interface AddNewItemProps {
  onClose: () => void;
  initialData?: ItemApiData;
  onSuccess?: (data?: any) => void;
  index?: number;
}

const AddNewItem: React.FC<AddNewItemProps> = ({
  onClose,
  initialData,
  onSuccess,
  index = 50,
}) => {
  const overlayZIndex = index + 10;

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<ItemFormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const handleSelectionChange = (ids: string[]) => {
    setSelectedItemIds(ids);
  };

  const getObjectId = (obj: any) =>
    obj && typeof obj === "object" && obj._id ? obj._id : obj || "";

  const [showItemGroupModal, setShowItemGroupModal] = useState(false);
  const [showStockUnit, setShowStockUnit] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isItemCategory, setIsItemCategory] = useState(false);
  const [isGstModalOpen, setIsGstModalOpen] = useState(false);

  const [gstInitialData, setGstInitialData] = useState<any>(undefined);
  const [underGroupInitialData, setUnderGroupInitialData] = useState<
    UnderGroupData | undefined
  >(undefined);
  const [stockUnitInitialData, setStockUnitInitialData] = useState<
    StockUnitData | undefined
  >(undefined);

  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [underGroup, setUnderGroup] = useState<UnderGroupData[]>([]);
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [stockUnitList, setStockUnitList] = useState<StockUnitData[]>([]);
  const [gstList, setGstList] = useState<GstClassificationData[]>([]);

  const isEditMode = !!initialData && (!!initialData._id || !!initialData.id);
  const [brandToEdit, setBrandToEdit] = useState<BrandData | undefined>(
    undefined
  );

  const handleBrandEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (formData.brand) {
      const selectedBrand = brands.find((b) => b._id === formData.brand);
      setBrandToEdit(selectedBrand);
    } else {
      setBrandToEdit(undefined);
    }
    setIsBrandOpen(true);
  };

  const [categoryToEdit, setCategoryToEdit] = useState<
    CategoryData | undefined
  >(undefined);

  const handleCategoryEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (formData.category) {
      const selectedCategory = categories.find(
        (c) => c._id === formData.category
      );
      setCategoryToEdit(selectedCategory);
    } else {
      setCategoryToEdit(undefined);
    }
    setIsItemCategory(true);
  };

  // --- 1. LOAD DATA ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          underGroupData,
          categoriesData,
          brandsData,
          stockUnitsData,
          gstData,
        ] = await Promise.all([
          fetchUnderGroup(),
          fetchCategories(),
          fetchBrands(),
          fetchStockUnits(),
          fetchGstClassifications(),
        ]);

        setUnderGroup(underGroupData || []);
        setCategories(categoriesData || []);
        setBrands(brandsData || []);
        setStockUnitList(stockUnitsData || []);
        setGstList(gstData || []);
      } catch (error) {
        console.error("Failed to load dropdown data", error);
      }
    };
    loadData();
  }, [isBrandOpen, isGstModalOpen, isItemCategory, stockUnitList]);

  // --- 2. INITIALIZE FORM (Handle IDs from Object) ---
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const extractedBrandId = getObjectId(initialData.brand);
      console.log("DEBUG: Initial Data Received:", initialData);
      console.log("DEBUG: Extracted Brand ID for state:", extractedBrandId); // CHECK 2: Is the ID extracted correctly?

      setFormData((prev) => ({
        ...prev,
        itemMode:
          initialData.item_mode || initialData.item_mode || prev.itemMode,
        item_name: initialData.name || prev.item_name,

        underGroup: initialData.under_group?._id || "",
        stockUnit: initialData.stock_unit?._id || "",

        gstClassification:
          initialData.gst_classfication || prev.gstClassification,

        warrantyEnabled: initialData.warranty === true,
        warranty1YearPrice:
          initialData.firstyearwarranty || prev.warranty1YearPrice,
        warranty2YearPrice:
          initialData.secyearwarranty || prev.warranty2YearPrice,
        warranty3YearPrice:
          initialData.thirdyearwarranty || prev.warranty3YearPrice,
        customWarranties: initialData.customWarranty || prev.customWarranties,

        category: getObjectId(initialData.category),

        // Use the debugged extraction
        brand: extractedBrandId,

        type: initialData.type || prev.type,
        unitOption: initialData.unit_option || prev.unitOption,
        barCode: initialData.barcode || prev.barCode,
        autoBarcodePrefix: initialData.auto_barcode || prev.autoBarcodePrefix,
        gstInputNotApplicable: initialData.gst_applicable === false,
        printBarcode: initialData.print_barcode,

        salesDescription: initialData.sale_desc || prev.salesDescription,
        salesGL: initialData.sales_gl || prev.salesGL,
        mrp: initialData.mrp?.toString() || prev.mrp,
        minPrice: initialData.minimum_price?.toString() || prev.minPrice,
        salesRate: initialData.sales_rate?.toString() || prev.salesRate,
        wholesaleRate:
          initialData.wholesale_rate?.toString() || prev.wholesaleRate,
        dealerRate: initialData.dealer_factor?.toString() || prev.dealerRate,
        rateFactor: initialData.rate_factor?.toString() || prev.rateFactor,
        salesDiscount:
          initialData.sale_discount?.toString() || prev.salesDiscount,
        salesDiscountPercent:
          initialData.sale_discount_percent?.toString() ||
          prev.salesDiscountPercent,

        purchaseDescription: initialData.purch_desc || prev.purchaseDescription,
        purchaseGL: initialData.purchase_gl || prev.purchaseGL,
        purchaseRate:
          initialData.purchase_rate?.toString() || prev.purchaseRate,
        purchaseRateFactor:
          initialData.purchase_ratefactor?.toString() ||
          prev.purchaseRateFactor,
        purchaseDiscount1:
          initialData.purchase_discount?.toString() || prev.purchaseDiscount1,
        purchaseDiscount2:
          initialData.purchase_discount_percent?.toString() ||
          prev.purchaseDiscount2,

        itemWorkflow: initialData.item_workflow || prev.itemWorkflow,
        procurementType: initialData.procurement_type || prev.procurementType,
        minLevel: initialData.minimum_level?.toString() || prev.minLevel,
        maxLevel: initialData.maximum_level?.toString() || prev.maxLevel,
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
        profileImage: initialData.attachment || prev.profileImage,
      }));

      if (
        initialData.suggested_cat &&
        Array.isArray(initialData.suggested_cat)
      ) {
        const extractedIds = initialData.suggested_cat.map(
          (item: any) => item.itemId
        );
        setSelectedItemIds(extractedIds);
      }
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

  const handleDropdownChange = (fieldName: string, value: any) => {
    console.log(`DEBUG: handleDropdownChange for ${fieldName}`, value);
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // --- 3. SUBMIT LOGIC (Send IDs directly) ---
 const handleNext = async () => {
  if (activeStep < STEPS.length - 1) {
    setActiveStep((prev) => prev + 1);
  } else {
    setIsSubmitting(true);
    try {
      // Helper function to extract ID regardless of whether the state is an object or string
      const getID = (val: any) => (val && typeof val === "object" ? val._id : val || null);

      const payload = {
        item_mode: formData.itemMode,
        name: formData.item_name,

        // Ensure these send IDs, not objects or descriptions
        under_group: getID(formData.underGroup),
        stock_unit: getID(formData.stockUnit),
        category: getID(formData.category),
        brand: getID(formData.brand),
        
        // FIXED: Corrected spelling and ensured ID is sent
        gst_classification: getID(formData.gstClassification), 

        // Boolean and Numeric Logic
        gst_applicable: !formData.gstInputNotApplicable,
        warranty: formData.warrantyEnabled,
        firstyearwarranty: formData.warranty1YearPrice, // Ensure this is the string desc if required
        customWarranty: formData.customWarranties || [],

        unit_option: formData.unitOption,
        barcode: formData.barCode,
        print_barcode: formData.printBarcode,

        mrp: Number(formData.mrp) || 0,
        sales_rate: Number(formData.salesRate) || 0,
        purchase_rate: Number(formData.purchaseRate) || 0,

        minimum_level: Number(formData.minLevel) || 0,
        maximum_level: Number(formData.maxLevel) || 0,

        track_inventory: formData.itemMode === "Inventory" || formData.itemMode === "Product" || formData.itemMode === "Goods",
        batch_wise_inventory: !!formData.batchWiseInventory,
        batch_wise_rate: !!formData.batchWiseRate,

        rackbin_no: formData.rackBinNo,
        
        // Additional fields from your original code
        attachment: formData.profileImage,
        suggested_cat: selectedItemIds.map((id) => ({ itemId: id })),
      };

      console.log("DEBUG: Final Verified Payload:", JSON.stringify(payload, null, 2));

      let response;
      if (isEditMode && initialData?._id) {
        response = await updateItem(initialData._id, payload);
      } else {
        response = await createItem(payload);
      }

      if (response.success) {
        alert(isEditMode ? "Updated!" : "Created!");
        if (onSuccess) onSuccess(response.data);
        onClose();
      } else {
        alert(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  }
};

const handleGstEditClick = (e: React.MouseEvent) => {
  e.preventDefault();
  const currentId = formData.gstClassification; // Now holds the ID string
  
  const selectedItem = gstList.find((item) => item._id === currentId);

  if (selectedItem) {
    setGstInitialData({
      _id: selectedItem._id,
      type: selectedItem.type,
      code: selectedItem.code,
      hsn_sac_code: selectedItem.hsn_sac_code,
      hsnSacDescription: selectedItem.hsn_description,
      gstRate: selectedItem.gstRate,
      cgst: selectedItem.cgst,
      sgst: selectedItem.sgst,
      igst: selectedItem.igst,
    });
  } else {
    setGstInitialData(undefined);
  }
  setIsGstModalOpen(true);
};


const handleGstSave = (savedData: any) => {
  // 1. Extract the actual database ID
  const actualId = savedData._id || savedData.id;

  // 2. Save the ID to the main form state (required for handleNext API payload)
  setFormData((prev) => ({
    ...prev,
    gstClassification: actualId, 
  }));

  // 3. Update the list so the dropdown recognizes the new/edited record
  setGstList((prev) => {
    const existingIndex = prev.findIndex((item) => item._id === actualId);
    
    const updatedItem = {
      ...savedData,
      _id: actualId,
      // Normalize keys to match what your columns use
      hsn_description: savedData.hsn_description || savedData.hsnSacDescription,
      hsn_sac_code: savedData.hsn_sac_code || savedData.hsnSacCode,
      gstRate: Number(savedData.gstRate),
      cgst: Number(savedData.cgst),
      sgst: Number(savedData.sgst),
      igst: Number(savedData.igst),
    };

    if (existingIndex >= 0) {
      const newList = [...prev];
      newList[existingIndex] = updatedItem;
      return newList;
    } else {
      return [updatedItem, ...prev];
    }
  });

  setIsGstModalOpen(false);
};

  const handleUnderGroupEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Use ID to find
    const selectedItem = underGroup.find(
      (item) => item._id === formData.underGroup
    );
    setUnderGroupInitialData(selectedItem || undefined);
    setShowItemGroupModal(true);
  };

  const handleUnderGroupSave = (savedData: UnderGroupData) => {
    setFormData((prev) => ({
      ...prev,
      underGroup: savedData._id || "", // Save ID
    }));

    setUnderGroup((prev: UnderGroupData[]) => {
      const existingIndex = prev.findIndex(
        (item) => savedData._id && item._id === savedData._id
      );

      if (existingIndex >= 0) {
        const updatedList = [...prev];
        updatedList[existingIndex] = savedData;
        return updatedList;
      } else {
        return [...prev, savedData];
      }
    });

    setShowItemGroupModal(false);
  };

  const handleStockUnitEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Use ID to find
    const selectedItem = stockUnitList.find(
      (item) => item._id === formData.stockUnit
    );
    setStockUnitInitialData(selectedItem || undefined);
    setShowStockUnit(true);
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
              <Dropdown
                data={ITEM_MODES}
                columns={simpleLabelColumns}
                value={formData.itemMode}
                valueKey="value"
                onChange={(item) =>
                  handleDropdownChange("itemMode", item?.value || "")
                }
                placeholder="Select Mode"
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel required>Name</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9 flex">
              <input
                type="text"
                name="item_name"
                value={formData.item_name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm outline-none"
              />
            </div>
          </div>

          {/* ... inside renderBasicDetails function ... */}

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel required>Under Group</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9 flex">
              <div className="flex-1 min-w-0">
                <Dropdown
                  data={underGroup}
                  columns={underGroupColumns}
                  value={formData.underGroup}
                  valueKey="_id"
                  onChange={(item) =>
                    handleDropdownChange("underGroup", item?._id || "")
                  }
                  placeholder="Select..."
                />
              </div>
              <button
                type="button"
                onClick={handleUnderGroupEditClick}
                className="bg-[#0c5888] text-white px-2 rounded-r ml-[1px]"
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
              <div className="flex-1 min-w-0">
                {/* ValueKey changed to _id */}
                <Dropdown
                  data={stockUnitList}
                  columns={stockUnitColumns}
                  value={formData.stockUnit}
                  valueKey="_id"
                  onChange={(item) =>
                    handleDropdownChange("stockUnit", item?._id || "")
                  }
                  placeholder="Select..."
                />
              </div>
              <button
                type="button"
                onClick={handleStockUnitEditClick}
                className="bg-[#0c5888] text-white px-2 rounded-r ml-[1px]"
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
              <div className="flex-1 min-w-0">
                {/* GST usually uses description/code as value, keeping as is but ensuring mapping */}
               <Dropdown
  data={gstList}
  columns={gstColumns} // Ensure this column set uses "hsn_description" or "hsn_sac_code"
  value={formData.gstClassification}
  valueKey="_id" // This must match the property in your list
  onChange={(item) => handleDropdownChange("gstClassification", item?._id || "")}
  placeholder="Select..."
/>
              </div>
              <button
                type="button"
                onClick={handleGstEditClick}
                className="bg-[#0c5888] text-white px-2 rounded-r ml-[1px]"
              >
                <Edit className="w-4 h-4" />
              </button>
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

  const renderWarrantySection = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold">Warranty</h3>
        <ToggleSwitch
          name="warrantyEnabled"
          checked={formData.warrantyEnabled}
          onChange={handleInputChange}
        />
      </div>

      {formData.warrantyEnabled && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <InputField
              label="1 Year Warranty Price"
              name="warranty1YearPrice"
              value={formData.warranty1YearPrice}
              onChange={handleInputChange}
            />
            <InputField
              label="2 Year Warranty Price"
              name="warranty2YearPrice"
              value={formData.warranty2YearPrice}
              onChange={handleInputChange}
            />
            <InputField
              label="3 Year Warranty Price"
              name="warranty3YearPrice"
              value={formData.warranty3YearPrice}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <h4 className="text-xs font-semibold mb-2">Custom Warranties</h4>

            {formData.customWarranties.map(
              (cw: CustomWarranty, idx: number) => (
                <div key={idx} className="grid grid-cols-3 gap-3 mb-2">
                  <input
                    type="text"
                    placeholder="Duration (e.g. 18 Months)"
                    value={cw.duration}
                    onChange={(e) => {
                      const updated = [...formData.customWarranties];
                      updated[idx].duration = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        customWarranties: updated,
                      }));
                    }}
                    className="border rounded px-2 py-1 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Price"
                    value={cw.price}
                    onChange={(e) => {
                      const updated = [...formData.customWarranties];
                      updated[idx].price = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        customWarranties: updated,
                      }));
                    }}
                    className="border rounded px-2 py-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        customWarranties: prev.customWarranties.filter(
                          (_, i) => i !== idx
                        ),
                      }));
                    }}
                    className="text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              )
            )}

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  customWarranties: [
                    ...prev.customWarranties,
                    { duration: "", price: "" },
                  ],
                }))
              }
              className="text-[#0c5888] text-sm mt-2"
            >
              + Add Custom Warranty
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderAdvanceInfo = () => {
    return (
      <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4 max-w-4xl">
            <div className="mb-3">
              <FormLabel>Category</FormLabel>
              <div className="flex w-full">
                <div className="flex-1 min-w-0">
                  {/* ValueKey changed to _id */}
                  <Dropdown
                    data={categories}
                    columns={categoryColumns}
                    value={formData.category}
                    valueKey="_id"
                    onChange={(item) =>
                      handleDropdownChange("category", item?._id || "")
                    }
                    placeholder="Select..."
                  />
                </div>
                <button
                  onClick={handleCategoryEditClick}
                  className="bg-[#0c5888] text-white px-2 rounded-r hover:bg-[#0a4a70] transition-colors ml-[1px]"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-3">
              <FormLabel>Brand</FormLabel>
              <div className="flex w-full">
                <div className="flex-1 min-w-0">
                  {/* CRITICAL FIX HERE: Simplify Value to always be state */}
                  <Dropdown
                    data={brands}
                    columns={brandColumns}
                    value={formData.brand} // <--- FIXED: Just use state. It's an ID.
                    valueKey="_id"
                    onChange={(item) =>
                      handleDropdownChange("brand", item?._id || "")
                    }
                    placeholder="Select..."
                  />
                </div>
                <button
                  onClick={handleBrandEditClick}
                  className="bg-[#0c5888] text-white px-2 rounded-r hover:bg-[#0a4a70] transition-colors ml-[1px]"
                  title={
                    formData.brand ? "Edit Selected Brand" : "Create New Brand"
                  }
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-3">
              <FormLabel>Type</FormLabel>
              <Dropdown
                data={ITEM_TYPES}
                columns={simpleLabelColumns}
                value={formData.type}
                valueKey="value"
                onChange={(item) =>
                  handleDropdownChange("type", item?.value || "")
                }
                placeholder="Select..."
              />
            </div>

            <div className="mb-3">
              <FormLabel>Unit Option</FormLabel>
              <Dropdown
                data={UNIT_OPTIONS}
                columns={simpleLabelColumns}
                value={formData.unitOption}
                valueKey="value"
                onChange={(item) =>
                  handleDropdownChange("unitOption", item?.value || "")
                }
                placeholder="Select..."
              />
            </div>

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
        </div>
      </div>
    </div>
  );

  const purchageConfig = () => {
    return (
      <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
        <div className="grid grid-cols-12 gap-8">
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
          </div>
        </div>
      </div>
    );
  };

  const attributesConfig = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
        <div className="space-y-4">
          <div className="mb-3">
            <FormLabel>Item Workflow</FormLabel>
            <Dropdown
              data={WORKFLOW_OPTIONS}
              columns={simpleLabelColumns}
              value={formData.itemWorkflow}
              valueKey="value"
              onChange={(item) =>
                handleDropdownChange("itemWorkflow", item?.value || "")
              }
              placeholder="Select..."
            />
          </div>

          <div className="mb-3">
            <FormLabel>Procurement Type</FormLabel>
            <Dropdown
              data={PROCUREMENT_TYPES}
              columns={simpleLabelColumns}
              value={formData.procurementType}
              valueKey="value"
              onChange={(item) =>
                handleDropdownChange("procurementType", item?.value || "")
              }
              placeholder="Select..."
            />
          </div>

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

          <div className="mb-3">
            <FormLabel>Add in Set Template</FormLabel>
            <Dropdown
              data={SET_TEMPLATE_OPTIONS}
              columns={simpleLabelColumns}
              value={formData.itemSetTemplate}
              valueKey="value"
              onChange={(item) =>
                handleDropdownChange("itemSetTemplate", item?.value || "")
              }
              placeholder="Select..."
            />
          </div>
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

          <div className="mb-3">
            <FormLabel>Drug Type</FormLabel>
            <Dropdown
              data={DRUG_TYPES}
              columns={simpleLabelColumns}
              value={formData.drugType}
              valueKey="value"
              onChange={(item) =>
                handleDropdownChange("drugType", item?.value || "")
              }
              placeholder="Select..."
            />
          </div>

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

  return (
    <div className="h-auto bg-transparent p-4 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-[#0c5888] px-6 py-4 text-white flex justify-between items-center">
          <h1 className="text-xl font-semibold tracking-wide">
            {isEditMode ? "EDIT ITEM" : "ADD NEW ITEM"}
          </h1>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <XIcon className="w-6 h-6 cursor-pointer" />
          </button>
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

        <div className="p-6 bg-white h-[50vh] overflow-y-scroll">
          {activeStep === 0 && (
            <>
              {renderBasicDetails()}
              {renderWarrantySection()}
            </>
          )}
          {activeStep === 1 && renderAdvanceInfo()}
          {activeStep === 2 && saleConfig()}
          {activeStep === 3 && purchageConfig()}
          {activeStep === 4 && attributesConfig()}

          {activeStep === 5 && (
            <SuggestedCategory
              onSelectionChange={handleSelectionChange}
              selectedItemIds={selectedItemIds}
            />
          )}

          {activeStep === 6 && (
            <div className="p-4 text-center text-gray-500">
              <Attachment />
            </div>
          )}
        </div>

        {/* FOOTER SECTION */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
          <div className="text-sm text-gray-600 font-medium">
            Step {activeStep + 1} of {STEPS.length}
          </div>
          <div className="flex gap-3">
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
      </div>

      {showItemGroupModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
          style={{ zIndex: overlayZIndex }}
        >
          <div className="bg-white rounded shadow-lg">
            <UnderGroup
              onClose={() => setShowItemGroupModal(false)}
              initialData={underGroupInitialData}
              onSave={handleUnderGroupSave}
              zIndex={overlayZIndex}
            />
          </div>
        </div>
      )}

      {showStockUnit && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
          style={{ zIndex: overlayZIndex }}
        >
          <div className="bg-white rounded shadow-lg">
            <StockUnit
              onClose={() => setShowStockUnit(false)}
              initialData={stockUnitInitialData}
              zIndex={overlayZIndex}
            />
          </div>
        </div>
      )}

      {isItemCategory && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
          style={{ zIndex: overlayZIndex }}
        >
          <div className="bg-white rounded shadow-lg">
            <ItemCategory
              onClose={() => setIsItemCategory(false)}
              initialData={categoryToEdit}
            />
          </div>
        </div>
      )}
      {isBrandOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
          style={{ zIndex: overlayZIndex }}
        >
          <div className="bg-white rounded shadow-lg">
            <Brand
              onClose={() => setIsBrandOpen(false)}
              initialData={brandToEdit}
              index={overlayZIndex}
            />
          </div>
        </div>
      )}

      {isGstModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
          style={{ zIndex: overlayZIndex }}
        >
          <div className="w-auto">
            <GstClassificationForm
              initialData={gstInitialData}
              onSubmit={handleGstSave}
              onCancel={() => setIsGstModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewItem;
