import React, { useState, useEffect } from "react";
import { X, Save, Trash2, EditIcon, Loader2 } from "lucide-react";
import Dropdown, { ColumnDef } from "./Dropdown";
import {
  createSalesExecutive,
  updateSalesExecutive,
  deleteSalesExecutive,
  SalesExecutiveData,
  CreateSalesExecutivePayload,
} from "./addItemMaster/api/salesExecutiveService";
import { LocationMaster } from "./LocationMaster";
import {
  fetchAllLocations,
  LocationMaster as LocationMasterType,
} from "../pages/pages/inventory/stockAdjustment/api/LocationMaster";

// --- Types ---

interface SalesExecutiveFormData {
  _id?: string;
  code: string;
  name: string;
  reportingTo: string;
  underStore: string;
  commissionRate: string; // Internal state spelling
  rateOn: string;
  amountType: string;
  email: string;
  phone: string;
  inactive: boolean;
}

interface SalesExecutiveMasterProps {
  onClose: () => void;
  initialData?: SalesExecutiveData;
  onSuccess?: () => void;
  index?: number;
}

interface DropdownItem {
  name: string;
  code?: string;
  [key: string]: any;
}

// --- Mock Data ---
const mockOptions = {
  employees: [{ name: "Default", code: "E001" }],
  stores: [
    { name: "Main Store", code: "MAIN" },
    { name: "Branch A", code: "BR_A" },
  ],
  rateOnOptions: [
    { name: "Qty", code: "QTY" },
    { name: "Invoice Amount", code: "INV" },
  ],
  amountTypes: [
    { name: "Taxable", code: "TAX" },
    { name: "Bill Amount", code: "BILL" },
    { name: "Percentage", code: "PERC" },
  ],
};

// --- Helper Component DEFINED OUTSIDE ---
const FormRow = ({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <div className="grid grid-cols-12 gap-2 items-center mb-2">
    <div className="col-span-4 text-gray-800 font-medium text-[13px]">
      {label}
      {required && <span className="text-red-500 ml-1">★</span>}
    </div>
    <div className="col-span-8 flex items-center">{children}</div>
  </div>
);

// --- Sub Component ---
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

const SalesExecutiveMaster: React.FC<SalesExecutiveMasterProps> = ({
  onClose,
  initialData,
  onSuccess,
  index = 50, // 2. Default Index
}) => {
  // 3. Logic: Modal layer + Dropdown layer
  const overlayZIndex = index + 10;
  // This ensures dropdowns are 50 points higher than the modal they live in
  const dropdownZIndex = overlayZIndex + 50;
  // This ensures the LocationMaster modal is on top of this current modal
  const nestedModalZIndex = overlayZIndex + 20;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState<SalesExecutiveFormData>({
    code: "0001",
    name: "",
    reportingTo: "",
    underStore: "",
    commissionRate: "0",
    rateOn: "Qty",
    amountType: "Percentage",
    email: "",
    phone: "",
    inactive: false,
  });
  const [storeList, setStoreList] = useState<LocationMasterType[]>([]);
  const [isLocationMasterOpen, setIsLocationMasterOpen] =
    useState<boolean>(false);

  // --- API: Fetch Stores ---
  const loadStores = async () => {
    try {
      const result = await fetchAllLocations();
      if (Array.isArray(result)) {
        setStoreList(result as LocationMasterType[]);
      } else if (result && (result as any).data) {
        setStoreList((result as any).data as LocationMasterType[]);
      }
    } catch (error) {
      console.error("Failed to load stores/locations", error);
    }
  };

  // --- FIX: Fetch Stores on Mount ---
  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        _id: initialData._id,
        code: initialData.code || "0001",
        name: initialData.name || "",
        reportingTo: "",
        underStore: "",
        commissionRate: initialData.commisionRate || "0",
        rateOn: initialData.rateOn || "Qty",
        amountType: initialData.amountType || "Percentage",
        email: initialData.email || "",
        phone: initialData.phone || "",
        inactive: false,
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof SalesExecutiveFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }
    setIsSubmitting(true);
    const payload: CreateSalesExecutivePayload = {
      name: formData.name,
      commisionRate: formData.commissionRate,
      rateOn: formData.rateOn,
      amountType: formData.amountType,
      email: formData.email,
      phone: formData.phone,
    };

    try {
      let response;
      if (formData._id) {
        response = await updateSalesExecutive(formData._id, payload);
      } else {
        response = await createSalesExecutive(payload);
      }

      if (response.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert("Operation failed: " + response.message);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!formData._id) return;
    if (!confirm("Are you sure you want to delete this Sales Executive?"))
      return;

    setIsDeleting(true);
    try {
      const response = await deleteSalesExecutive(formData._id);
      if (response.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert("Delete failed: " + response.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLocationSelect = (locationName: string) => {
    handleChange("underStore", locationName);
  };

  const themeColor = "#0f3c63";

  // --- Dropdown Config ---
  const defaultColumns: ColumnDef<DropdownItem>[] = [
    { header: "Code", key: "code", width: "w-1/3" },
    { header: "Name", key: "name", width: "w-full" },
  ];

  // --- Helper to get selected Store Object ---
  const getSelectedStoreData = (): LocationMasterType | null => {
    if (!formData.underStore) return null;
    return storeList.find((s) => s.name === formData.underStore) || null;
  };

  const handleLocationSuccess = async () => {
    await loadStores();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      // 4. Apply Z-Index to the Modal Wrapper
      style={{ zIndex: overlayZIndex }}
    >
      <div className="w-full max-w-xl bg-white border border-gray-300 shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div
          className="flex justify-between items-center px-4 py-2 text-white"
          style={{ backgroundColor: themeColor }}
        >
          <span className="font-semibold tracking-wide text-sm">
            {formData._id ? "Edit Sales Executive" : "Create Sales Executive"}
          </span>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded p-0.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          <FormRow label="Code">
            <input
              type="text"
              readOnly
              className="w-full h-[30px] border border-gray-300 bg-gray-50 text-gray-600 px-2 outline-none focus:border-[#0f3c63] rounded-sm text-sm"
              value={formData.code}
            />
          </FormRow>

          <FormRow label="Name" required>
            <input
              type="text"
              className="w-full h-[30px] border border-gray-300 px-2 outline-none focus:border-[#0f3c63] rounded-sm text-sm"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </FormRow>

          <FormRow label="Reporting To">
            <div className="w-full flex">
              <Dropdown
                data={mockOptions.employees}
                columns={defaultColumns}
                value={formData.reportingTo}
                valueKey="name"
                onChange={(item) =>
                  handleChange("reportingTo", item?.name || "")
                }
                placeholder="Select..."
                zIndex={dropdownZIndex}
              />
              <ActionBtn icon={<EditIcon size={14} />} />
            </div>
          </FormRow>

          <FormRow label="Under Store">
            <div className="w-full flex">
              <Dropdown<LocationMasterType>
                data={storeList}
                columns={defaultColumns}
                value={formData.underStore}
                valueKey="name"
                onChange={(item) =>
                  handleChange("underStore", item ? item.name : "")
                }
                placeholder="Select Store..."
                zIndex={dropdownZIndex}
              />
              <ActionBtn
                icon={<EditIcon size={16} />}
                onClick={() => setIsLocationMasterOpen(true)}
              />
            </div>
          </FormRow>
          <FormRow label="Commission Rate">
            <input
              type="number"
              className="w-full h-[30px] border border-gray-300 px-2 outline-none focus:border-[#0f3c63] rounded-sm text-sm text-right"
              value={formData.commissionRate}
              onChange={(e) => handleChange("commissionRate", e.target.value)}
            />
          </FormRow>

          <FormRow label="Rate On">
            <Dropdown
              data={mockOptions.rateOnOptions}
              columns={defaultColumns}
              value={formData.rateOn}
              valueKey="name"
              onChange={(item) => handleChange("rateOn", item?.name || "")}
              placeholder="Select..."
              zIndex={dropdownZIndex}
            />
          </FormRow>

          <FormRow label="Amount Type">
            <Dropdown
              data={mockOptions.amountTypes}
              columns={defaultColumns}
              value={formData.amountType}
              valueKey="name"
              onChange={(item) => handleChange("amountType", item?.name || "")}
              placeholder="Select..."
              zIndex={dropdownZIndex}
            />
          </FormRow>

          <FormRow label="Email">
            <input
              type="email"
              className="w-full h-[30px] border border-gray-300 px-2 outline-none focus:border-[#0f3c63] rounded-sm text-sm"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </FormRow>

          <FormRow label="Phone">
            <input
              type="text"
              className="w-full h-[30px] border border-gray-300 px-2 outline-none focus:border-[#0f3c63] rounded-sm text-sm"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </FormRow>

          <FormRow label="Inactive">
            <div className="w-full flex justify-end">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.inactive}
                  onChange={(e) => handleChange("inactive", e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f3c63]"></div>
                <span className="ml-2 text-sm font-medium text-gray-600">
                  {formData.inactive ? "ON" : "OFF"}
                </span>
              </label>
            </div>
          </FormRow>
        </div>

        {/* Footer */}
        <div
          className="p-3 flex gap-3 border-t border-gray-300 mt-auto"
          style={{ backgroundColor: themeColor }}
        >
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-1.5 border border-white text-white text-sm font-semibold rounded-sm hover:bg-white hover:text-[#0f3c63] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isSubmitting ? "Saving..." : "Save"}
          </button>

          {formData._id && (
            <button
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
              className="flex items-center gap-2 px-4 py-1.5 border border-transparent bg-red-500/10 text-white text-sm font-semibold rounded-sm hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      </div>

      {/* --- Location Master Popup (Stacked ON TOP of Counter Form) --- */}
      {isLocationMasterOpen && (
        // Use Dynamic Indexing
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          style={{ zIndex: nestedModalZIndex }}
        >
          <div className="shadow-lg overflow-hidden relative">
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

export default SalesExecutiveMaster;
