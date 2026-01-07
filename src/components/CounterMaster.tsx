import React, { useState, useEffect } from "react";
import { X, FileText, EditIcon } from "lucide-react";
import Dropdown, { ColumnDef } from "./Dropdown";

import { LocationMaster } from "./LocationMaster";
import CrudCustomer from "../pages/pages/sales/customer/pages/AddNewCustomer";
import NameAndCodeMaster, { NameAndCodeData } from "./NameAndCodeComponent";
import POSCustomerMaster from "./POSCustomerMaster";
import TenderTypeMaster from "./TenderTypeMaster";

import {
  fetchAllLocations,
  LocationMaster as LocationMasterType,
} from "../pages/pages/inventory/stockAdjustment/api/LocationMaster";

import {
  Customer,
  getAllCustomers,
} from "../pages/pages/sales/customer/api/customerService";

// --- Interfaces ---

interface CounterFormData {
  counterNo: string;
  store: string;
  taxStyle: string;
  exchangeReturn: string;
  customer: string;
  maxDiscount: string;
  printFormat: string;
  employee: string;
  group: string;
  defaultPosCustomer: string;
  allowTenderTypes: string;
  defaultTender: string;
  hideAttributePanel: boolean;
  manageDayStart: boolean;
  hideTaxDiscPanel: boolean;
}

interface CounterMasterProps {
  onClose: () => void;
  index?: number;
}

const partyColumns: ColumnDef<Customer>[] = [
  { header: "Code", key: "code", width: "w-16" },
  { header: "Name", key: "cust_name", width: "flex-1" },
  { header: "Phone", key: "phone", width: "w-24" },
  { header: "GST", key: "gst_no", width: "w-28" },
];

// --- Mock Data ---
const mockOptions = {
  taxStyles: [
    { name: "Exclusive", code: "EXC" },
    { name: "Inclusive", code: "INC" },
  ],
  exchangeReturns: [
    { name: "NegativeWithCashRefund", code: "NEG_REF" },
    { name: "StoreCredit", code: "CREDIT" },
  ],
  customers: [{ name: "Cash Customer", code: "CASH_CUST" }],
  printFormats: [
    { name: "A4 Laser", code: "A4" },
    { name: "Thermal 3 Inch", code: "THERMAL" },
  ],
  employees: [
    { name: "John Doe", code: "E001" },
    { name: "Jane Smith", code: "E002" },
  ],
  groups: [
    { name: "General", code: "GRP1" },
    { name: "VIP", code: "GRP2" },
  ],
  posCustomers: [{ name: "Walk-in", code: "WALK" }],
  tenderTypes: [
    { name: "Cash", code: "CASH" },
    { name: "Card", code: "CARD" },
    { name: "UPI", code: "UPI" },
  ],
  defaultTenders: [{ name: "Cash", code: "CASH" }],
};

const CounterMaster: React.FC<CounterMasterProps> = ({
  onClose,
  index = 50,
}) => {
  const overlayZIndex = index + 10; // For this modal wrapper
  const dropdownZIndex = overlayZIndex + 10; // For dropdowns inside this modal
  const nestedModalZIndex = overlayZIndex + 20; // For nested modals (Location, Customer, Ledger, POSCustomer)

  const themeColor = "#0f3c63";

  // --- State ---
  const [formData, setFormData] = useState<CounterFormData>({
    counterNo: "",
    store: "",
    taxStyle: "Exclusive",
    exchangeReturn: "NegativeWithCashRefund",
    customer: "Cash Customer",
    maxDiscount: "0.00",
    printFormat: "",
    employee: "",
    group: "",
    defaultPosCustomer: "",
    allowTenderTypes: "",
    defaultTender: "",
    hideAttributePanel: false,
    manageDayStart: false,
    hideTaxDiscPanel: false,
  });

  // Location Master State
  const [isLocationMasterOpen, setIsLocationMasterOpen] =
    useState<boolean>(false);
  const [storeList, setStoreList] = useState<LocationMasterType[]>([]);

  // Customer State
  const [isOpenCustomer, setIsOpenCustomer] = useState(false);
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [editingRow, setEditingRow] = useState<Customer | null>(null);

  // Group / Ledger Attribute State
  const [isLegderOpen, setIsLedgerOpen] = useState<boolean>(false);
  const [ledgerEditingRow, setLedgerEditingRow] =
    useState<NameAndCodeData | null>(null);

  // POS Customer Master State
  const [isPOSCustomerMasterOpen, setIsPOSCustomerMasterOpen] =
    useState<boolean>(false);

  const [isTenderTypeOpen, setIsTenderTypeOpen] = useState<boolean>(false);

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

  const loadCustomers = async () => {
    try {
      const result = await getAllCustomers();
      if (Array.isArray(result)) {
        setCustomerList(result);
      } else if (result && (result as any).data) {
        setCustomerList((result as any).data);
      }
    } catch (error) {
      console.error("Failed to load customers", error);
    }
  };

  useEffect(() => {
    loadStores();
    loadCustomers();
  }, []);

  // --- Handlers ---
  const handleChange = (
    field: keyof CounterFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Helper to get selected Store
  const getSelectedStoreData = (): LocationMasterType | null => {
    if (!formData.store) return null;
    return storeList.find((s) => s.name === formData.store) || null;
  };

  // --- Location Handlers ---
  const handleLocationSuccess = async () => {
    await loadStores();
  };

  const handleLocationSelect = (locationName: string) => {
    handleChange("store", locationName);
  };

  // --- Customer Handlers ---
  const handleCustomerFormClose = (isBack?: boolean) => {
    setIsOpenCustomer(false);
    setEditingRow(null);
    isBack;
  };

  const handleCustomerFormSuccess = async () => {
    await loadCustomers();
    setIsOpenCustomer(false);
    setEditingRow(null);
  };

  // --- Ledger / Group Handler ---
  const handleLedgerForm = () => {
    if (formData.group) {
      // Edit Mode
      const selectedGroup = mockOptions.groups.find(
        (g) => g.name === formData.group
      );
      if (selectedGroup) {
        setLedgerEditingRow({
          code: selectedGroup.code || "0000",
          name: selectedGroup.name,
          _id: "mock_id",
        });
      }
    } else {
      // Create Mode
      setLedgerEditingRow(null);
    }
    setIsLedgerOpen(true);
  };

  const handleLedgerClose = () => {
    setIsLedgerOpen(false);
    setLedgerEditingRow(null);
  };

  // --- Sub-components ---
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
    <div className="grid grid-cols-12 gap-2 items-center">
      <div className="col-span-4 text-gray-700 font-medium text-[13px]">
        {label}
        {required && <span className="text-red-500 ml-1">★</span>}
      </div>
      <div className="col-span-8 flex items-center">{children}</div>
    </div>
  );

  const CheckboxRow = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (val: boolean) => void;
  }) => (
    <div className="grid grid-cols-12 gap-2 items-center">
      <div className="col-span-4 text-gray-700 font-medium text-[13px]">
        {label}
      </div>
      <div className="col-span-8 flex justify-end">
        <input
          type="checkbox"
          className="h-4 w-4 border-gray-300 rounded cursor-pointer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      </div>
    </div>
  );

  const FooterBtn = ({
    label,
    onClick,
  }: {
    label: string;
    onClick?: () => void;
  }) => (
    <button
      onClick={onClick}
      className="px-6 py-1 border border-white text-white text-sm font-semibold rounded-sm hover:bg-white hover:text-[#0f3c63] transition-colors"
    >
      {label}
    </button>
  );

  const handlePOSCustomerClose = () => {
    setIsPOSCustomerMasterOpen(false);
    return false;
  };

  return (
    // Main Overlay
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      style={{ zIndex: overlayZIndex }}
    >
      {/* Main Counter Form Container */}
      <div className="w-full max-w-2xl bg-white border border-gray-300 shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
        {/* --- Header --- */}
        <div
          className="flex justify-between items-center px-3 py-1.5 text-white"
          style={{ backgroundColor: themeColor }}
        >
          <span className="font-semibold tracking-wide text-sm">Counter</span>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded p-0.5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* --- Sub Header --- */}
        <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b border-gray-200 text-[var(--theme-color)]">
          <div
            className="flex items-center gap-2 font-bold text-sm"
            style={{ color: themeColor }}
          >
            <FileText size={16} />
            <span>Basic Information</span>
          </div>
        </div>

        {/* --- Form Content --- */}
        <div className="p-4 space-y-2 overflow-y-auto">
          {/* Counter No */}
          <FormRow label="Counter No" required>
            <input
              type="text"
              className="w-full h-[30px] border border-gray-300 px-2 outline-none focus:border-[#194d81] rounded-sm text-sm"
              value={formData.counterNo}
              onChange={(e) => handleChange("counterNo", e.target.value)}
            />
          </FormRow>

          {/* Store */}
          <FormRow label="Store">
            <div className="w-full flex">
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
          </FormRow>

          {/* Tax Style */}
          <FormRow label="Tax Style">
            <div className="w-full">
              <Dropdown
                data={mockOptions.taxStyles}
                columns={[
                  { header: "Code", key: "code", width: "w-1/3" },
                  { header: "Name", key: "name", width: "w-full" },
                ]}
                value={formData.taxStyle}
                valueKey="name"
                onChange={(item) => handleChange("taxStyle", item?.name || "")}
                placeholder="Select Tax Style..."
                zIndex={dropdownZIndex}
              />
            </div>
          </FormRow>

          {/* Exchange/Return */}
          <FormRow label="Exchange/Return">
            <div className="w-full">
              <Dropdown
                data={mockOptions.exchangeReturns}
                columns={[
                  { header: "Code", key: "code", width: "w-1/3" },
                  { header: "Name", key: "name", width: "w-full" },
                ]}
                value={formData.exchangeReturn}
                valueKey="name"
                onChange={(item) =>
                  handleChange("exchangeReturn", item?.name || "")
                }
                placeholder="Select Exchange Policy..."
                zIndex={dropdownZIndex}
              />
            </div>
          </FormRow>

          {/* Customer */}
          <FormRow label="Customer" required>
            <div className="w-full flex">
              <Dropdown<Customer>
                data={customerList}
                columns={partyColumns}
                value={formData.customer}
                valueKey="cust_name"
                placeholder="Select Party..."
                onChange={(item) =>
                  handleChange("customer", item ? item.cust_name : "")
                }
                zIndex={dropdownZIndex}
              />
              <ActionBtn
                icon={<EditIcon size={16} />}
                onClick={() => setIsOpenCustomer(true)}
              />
            </div>
          </FormRow>

          {/* Max Discount */}
          <FormRow label="Max Discount Allowed (Percentage)">
            <input
              type="number"
              className="w-full h-[30px] border border-gray-300 px-2 outline-none focus:border-blue-500 rounded-sm text-sm"
              value={formData.maxDiscount}
              onChange={(e) => handleChange("maxDiscount", e.target.value)}
            />
          </FormRow>

          {/* Print Format */}
          <FormRow label="Default Invoice Print Format">
            <div className="w-full">
              <Dropdown
                data={mockOptions.printFormats}
                columns={[
                  { header: "Code", key: "code", width: "w-1/3" },
                  { header: "Name", key: "name", width: "w-full" },
                ]}
                value={formData.printFormat}
                valueKey="name"
                onChange={(item) =>
                  handleChange("printFormat", item?.name || "")
                }
                placeholder="Select Format..."
                zIndex={dropdownZIndex}
              />
            </div>
          </FormRow>

          <div className="pt-2 pb-1">
            <h3 className="font-semibold text-gray-800 text-[13px]">
              Financial Posting (Ledger) Attributes - Select if applicable
            </h3>
          </div>

          {/* Employee */}
          <FormRow label="Employee">
            <div className="w-full flex">
              <Dropdown
                data={mockOptions.employees}
                columns={[
                  { header: "Code", key: "code", width: "w-1/3" },
                  { header: "Name", key: "name", width: "w-full" },
                ]}
                value={formData.employee}
                valueKey="name"
                onChange={(item) => handleChange("employee", item?.name || "")}
                placeholder="Select Employee..."
                zIndex={dropdownZIndex}
              />
              <ActionBtn icon={<EditIcon size={16} />} />
            </div>
          </FormRow>

          {/* Group */}
          <FormRow label="Group">
            <div className="w-full flex">
              <Dropdown
                data={mockOptions.groups}
                columns={[
                  { header: "Code", key: "code", width: "w-1/3" },
                  { header: "Name", key: "name", width: "w-full" },
                ]}
                value={formData.group}
                valueKey="name"
                onChange={(item) => handleChange("group", item?.name || "")}
                placeholder="Select Group..."
                zIndex={dropdownZIndex}
              />
              <ActionBtn
                icon={<EditIcon size={16} />}
                onClick={handleLedgerForm}
              />
            </div>
          </FormRow>

          {/* Default POS Customer */}
          <FormRow label="Default POS Customer">
            <div className="w-full flex">
              <Dropdown
                data={mockOptions.posCustomers}
                columns={[
                  { header: "Code", key: "code", width: "w-1/3" },
                  { header: "Name", key: "name", width: "w-full" },
                ]}
                value={formData.defaultPosCustomer}
                valueKey="name"
                onChange={(item) =>
                  handleChange("defaultPosCustomer", item?.name || "")
                }
                placeholder="Select POS Customer..."
                zIndex={dropdownZIndex}
              />
              <ActionBtn
                icon={<EditIcon size={16} />}
                onClick={() => setIsPOSCustomerMasterOpen(true)}
              />
            </div>
          </FormRow>

          {/* Allow Tender Types */}
          <FormRow label="Allow Tender Types">
            <div className="w-full">
              <Dropdown
                data={mockOptions.tenderTypes}
                columns={[
                  { header: "Code", key: "code", width: "w-1/3" },
                  { header: "Name", key: "name", width: "w-full" },
                ]}
                value={formData.allowTenderTypes}
                valueKey="name"
                onChange={(item) =>
                  handleChange("allowTenderTypes", item?.name || "")
                }
                placeholder="Select Types..."
                zIndex={dropdownZIndex}
              />
            </div>
          </FormRow>

          {/* Default Tender */}
          <FormRow label="Default Tender">
            <div className="w-full flex">
              <Dropdown
                data={mockOptions.defaultTenders}
                columns={[
                  { header: "Code", key: "code", width: "w-1/3" },
                  { header: "Name", key: "name", width: "w-full" },
                ]}
                value={formData.defaultTender}
                valueKey="name"
                onChange={(item) =>
                  handleChange("defaultTender", item?.name || "")
                }
                placeholder="Select Default Tender..."
                zIndex={dropdownZIndex}
              />
              <button onClick={() => setIsTenderTypeOpen(true)}>
                <ActionBtn icon={<EditIcon size={16} />} />
              </button>
            </div>
          </FormRow>

          {/* Checkboxes */}
          <div className="pt-2 space-y-2">
            <CheckboxRow
              label="Hide Attribute Panel"
              checked={formData.hideAttributePanel}
              onChange={(val) => handleChange("hideAttributePanel", val)}
            />
            <CheckboxRow
              label="Manage DayStart/Day Close"
              checked={formData.manageDayStart}
              onChange={(val) => handleChange("manageDayStart", val)}
            />
            <CheckboxRow
              label="Hide Tax Disc Panel"
              checked={formData.hideTaxDiscPanel}
              onChange={(val) => handleChange("hideTaxDiscPanel", val)}
            />
          </div>
        </div>

        {/* --- Footer Buttons --- */}
        <div
          className="p-3 flex gap-2 border-t border-gray-300 mt-auto"
          style={{ backgroundColor: themeColor }}
        >
          <FooterBtn label="Save" />
          <FooterBtn label="Clear" />
          <FooterBtn label="Delete" />
          <FooterBtn label="Exit" onClick={onClose} />
        </div>
      </div>

      {/* 1. Location Master Popup */}
      {isLocationMasterOpen && (
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

      {/* 2. Customer Form */}
      {isOpenCustomer && (
        <CrudCustomer
          onClose={handleCustomerFormClose}
          initialData={editingRow}
          onSuccess={handleCustomerFormSuccess}
          index={nestedModalZIndex}
        />
      )}

      {/* 3. Ledger Attribute Form (Group) */}
      {isLegderOpen && (
        <NameAndCodeMaster
          title="Ledger Attribute"
          onClose={handleLedgerClose}
          initialData={ledgerEditingRow}
          index={nestedModalZIndex}
        />
      )}

      {/* 4. POS Customer Master Form */}
      {isPOSCustomerMasterOpen && (
        <POSCustomerMaster
          onClose={handlePOSCustomerClose}
          index={nestedModalZIndex}
        />
      )}

      {/* 5. Tender Type Master Form */}
      {isTenderTypeOpen && (
        <TenderTypeMaster
          onClose={() => setIsTenderTypeOpen(false)}
          index={nestedModalZIndex}
        />
      )}
    </div>
  );
};

export default CounterMaster;
