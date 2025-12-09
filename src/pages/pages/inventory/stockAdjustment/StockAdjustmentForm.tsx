import React, { useState, useEffect, useRef } from "react";
import { CalenderIcon } from "../../../../components/icons";
import CrudCustomer from "../../sales/customer/pages/AddNewCustomer";
import { EditIcon, ArrowLeft, RefreshCw } from "lucide-react";

// --- IMPORTS ---
import DocumentInventoryModal from "../../../../components/DocumentCategoryInventory";
import {
  fetchDocumentCategoryInventory,
  DocumentCategoryInventory,
} from "./api/DocumentCategoryInventory";

import {
  fetchAllLocations,
  LocationMaster as LocationMasterType,
} from "./api/LocationMaster";
import { LocationMaster } from "../../../../components/LocationMaster";

import {
  getAllCustomers,
  Customer,
} from "../../sales/customer/api/customerService";

import Dropdown, { ColumnDef } from "./Dropdown";

// --- DATA INTERFACE ---
export interface StockAdjustmentHeaderData {
  voucherDate: string;
  voucherNo: string;
  category: string;
  store: string;
  party: string;
}

// --- Types ---
interface ActionBtnProps {
  icon: React.ReactElement;
  onClick?: () => void;
}

export interface SalesInvoiceFormProps {
  themeColor?: string;
  onOverlayChange?: (isOpen: boolean) => void;
  // --- LIFTED STATE PROPS ---
  data: StockAdjustmentHeaderData;
  onDataChange: (data: StockAdjustmentHeaderData) => void;
}

interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
}

interface InputGroupProps {
  children: React.ReactNode;
}

// --- HELPER: Random Voucher Generator (Uppercase + Numbers) ---
const generateVoucherNo = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const length = 10; // Length of the random ID
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// --- UI Components ---
const Label: React.FC<LabelProps> = ({ children, required }) => (
  <label className="text-[13px] text-gray-700 font-medium flex items-center h-[32px] whitespace-nowrap">
    {children} {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const InputGroup: React.FC<InputGroupProps> = ({ children }) => (
  <div className="flex items-center w-full relative gap-1">{children}</div>
);

const ActionBtn: React.FC<ActionBtnProps> = ({ icon, onClick }) => (
  <button
    onClick={onClick}
    type="button"
    className="h-[32px] w-[32px] bg-[var(--theme-primary)] text-white flex items-center justify-center rounded-sm border border-[var(--theme-primary)] hover:opacity-90 transition-opacity ml-[-1px] z-10 shadow-sm"
  >
    {icon}
  </button>
);

// --- FIXED VOUCHER DATE INPUT ---
const VoucherDateInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-full h-[32px]">
      <input
        ref={inputRef}
        type="date"
        value={value || ""} // Handle undefined/null gracefully
        onChange={onChange}
        className="w-full h-[32px] bg-white border border-gray-300 rounded-sm px-3 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)] pr-8 uppercase"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.showPicker()}
        className="absolute right-0 top-0 h-full w-8 flex items-center justify-center bg-gray-50 rounded-r-sm border-l border-gray-300 hover:bg-gray-100 transition-colors"
      >
        <CalenderIcon />
      </button>
    </div>
  );
};

const VoucherNoInput: React.FC<{ value: string }> = ({ value }) => (
  <div className="w-full">
    <input
      type="text"
      value={value || ""} // Ensure it is never uncontrolled
      readOnly
      placeholder="Click button to generate"
      className="w-full h-[32px] bg-white border border-gray-300 rounded-sm px-3 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)] bg-gray-50"
    />
  </div>
);

// --- Main Component ---
const StockAdjustmentForm: React.FC<SalesInvoiceFormProps> = ({
  themeColor = "#0f3c63",
  onOverlayChange,
  data, // Recieve Data
  onDataChange, // Receive Updater
}) => {
  const themeStyles = {
    "--theme-primary": themeColor,
    "--theme-focus": "#60a5fa",
  } as React.CSSProperties;

  const [documentInventoryModal, setDocumentInventoryModal] = useState(false);
  const [locationMasterModal, setLocationMasterModal] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Customer | null>(null);

  // --- DATA Lists ---
  const [categoryList, setCategoryList] = useState<DocumentCategoryInventory[]>(
    []
  );
  const [locationList, setLocationList] = useState<LocationMasterType[]>([]);
  const [customerList, setCustomerList] = useState<Customer[]>([]);

  // --- COLUMNS CONFIGURATION ---
  const categoryColumns: ColumnDef<DocumentCategoryInventory>[] = [
    { header: "Code", key: "code", width: "w-20" },
    { header: "Name", key: "name", width: "flex-1" },
  ];

  const locationColumns: ColumnDef<LocationMasterType>[] = [
    { header: "Code", key: "code", width: "w-20" },
    { header: "Name", key: "name", width: "flex-1" },
  ];

  const partyColumns: ColumnDef<Customer>[] = [
    { header: "Code", key: "code", width: "w-16" },
    { header: "Name", key: "cust_name", width: "flex-1" },
    { header: "Phone", key: "phone", width: "w-24" },
    { header: "GST", key: "gst_no", width: "w-28" },
  ];

  // --- LOAD DATA ---
  useEffect(() => {
    loadCategories();
    loadLocations();
    loadCustomers();
  }, []);

  // --- NOTE: Auto-generation useEffect removed so it stays empty initially ---

  const loadCategories = async () => {
    try {
      const result = await fetchDocumentCategoryInventory();
      setCategoryList(result);
    } catch (error) {
      console.error(error);
    }
  };

  const loadLocations = async () => {
    try {
      const result = await fetchAllLocations();
      setLocationList(result);
    } catch (error) {
      console.error(error);
    }
  };

  const loadCustomers = async () => {
    try {
      const result = await getAllCustomers();
      setCustomerList(result);
    } catch (error) {
      console.error(error);
    }
  };

  // --- HELPER: Update Parent State ---
  const handleFieldChange = (
    field: keyof StockAdjustmentHeaderData,
    value: string
  ) => {
    onDataChange({
      ...data,
      [field]: value,
    });
  };

  // --- HANDLER: Manual Generate Voucher ---
  const handleGenerateVoucher = () => {
    const newVoucher = generateVoucherNo();
    handleFieldChange("voucherNo", newVoucher);
  };

  // --- SELECTION HELPERS ---
  const getSelectedCategoryObject = () =>
    categoryList.find((cat) => cat.name === data.category) || null;

  const getSelectedLocationObject = () =>
    locationList.find((loc) => loc.name === data.store) || null;

  const getSelectedCustomerObject = () =>
    customerList.find((cust) => cust.cust_name === data.party) || null;

  // --- HANDLERS ---
  const handleEditCategoryClick = () => setDocumentInventoryModal(true);
  const handleEditLocationClick = () => setLocationMasterModal(true);

  const handleEditCustomerClick = () => {
    const selectedCustomer = getSelectedCustomerObject();
    setEditingRow(selectedCustomer);
    setIsFormOpen(true);
    if (onOverlayChange) onOverlayChange(true);
  };

  const handleCustomerFormClose = () => {
    setIsFormOpen(false);
    setEditingRow(null);
    if (onOverlayChange) onOverlayChange(false);
  };

  const handleCustomerFormSuccess = () => {
    handleCustomerFormClose();
    loadCustomers();
  };

  // --- RENDER CUSTOMER FORM ---
  if (isFormOpen) {
    return (
      <div
        className="w-full bg-white rounded-xl shadow-md border border-gray-200 p-6"
        style={themeStyles}
      >
        <div className="mb-4 border-b pb-4">
          <button
            onClick={handleCustomerFormClose}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-[var(--theme-primary)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
        </div>
        <CrudCustomer
          onClose={handleCustomerFormClose}
          initialData={editingRow}
          onSuccess={handleCustomerFormSuccess}
        />
      </div>
    );
  }

  // --- RENDER MAIN FORM ---
  return (
    <>
      <div
        style={themeStyles}
        className="bg-white rounded-lg shadow-md border border-gray-200 p-6 w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            {/* CATEGORY */}
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-4">
                <Label required>Category</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Dropdown
                    data={categoryList}
                    columns={categoryColumns}
                    value={data.category}
                    valueKey="name"
                    onChange={(item) =>
                      handleFieldChange("category", item?.name || "")
                    }
                    placeholder="Select Category..."
                  />
                  <ActionBtn
                    icon={<EditIcon size={16} />}
                    onClick={handleEditCategoryClick}
                  />
                </InputGroup>
              </div>
            </div>

            {/* STORE */}
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-4">
                <Label required>Store</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Dropdown
                    data={locationList}
                    columns={locationColumns}
                    value={data.store}
                    valueKey="name"
                    onChange={(item) =>
                      handleFieldChange("store", item?.name || "")
                    }
                    placeholder="Select Store..."
                  />
                  <ActionBtn
                    icon={<EditIcon size={16} />}
                    onClick={handleEditLocationClick}
                  />
                </InputGroup>
              </div>
            </div>

            {/* PARTY (Customer) */}
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-4">
                <Label>Party</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Dropdown
                    data={customerList}
                    columns={partyColumns}
                    value={data.party}
                    valueKey="cust_name"
                    onChange={(item) =>
                      handleFieldChange("party", item?.cust_name || "")
                    }
                    placeholder="Select Party..."
                  />
                  <ActionBtn
                    icon={<EditIcon size={16} />}
                    onClick={handleEditCustomerClick}
                  />
                </InputGroup>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-4">
                <Label>Voucher Date</Label>
              </div>
              <div className="col-span-8">
                <VoucherDateInput
                  value={data.voucherDate}
                  onChange={(e) =>
                    handleFieldChange("voucherDate", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-4">
                <Label>Voucher No</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <VoucherNoInput value={data.voucherNo} />
                  <ActionBtn
                    icon={<RefreshCw size={16} />}
                    onClick={handleGenerateVoucher}
                  />
                </InputGroup>
              </div>
            </div>
          </div>
        </div>

        {/* MODALS */}
        {documentInventoryModal && (
          <div className="fixed inset-0 z-[30] flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm p-4">
            <div className="w-auto h-auto bg-white rounded-lg shadow-2xl overflow-hidden relative">
              <DocumentInventoryModal
                isOpen={documentInventoryModal}
                onClose={() => setDocumentInventoryModal(false)}
                initialData={getSelectedCategoryObject()}
                onSuccess={() => loadCategories()}
              />
            </div>
          </div>
        )}

        {locationMasterModal && (
          <div className="fixed inset-0 z-[30] flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm p-4">
            <div className="w-auto h-auto bg-white rounded-lg shadow-2xl overflow-hidden relative">
              <LocationMaster
                onClose={() => setLocationMasterModal(false)}
                initialData={getSelectedLocationObject()}
                onSuccess={() => loadLocations()}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StockAdjustmentForm;
