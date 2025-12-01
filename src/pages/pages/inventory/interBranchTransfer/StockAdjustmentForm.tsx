import React, { useState } from "react";
import { CalenderIcon } from "../../../../components/icons";
import DocumentInventoryModal from "../../../../components/DocumentCategoryInventory";
import CrudCustomer from "../../sales/customer/pages/AddNewCustomer";
import { EditIcon, ArrowLeft } from "lucide-react";

// --- Types ---
interface MockData {
  gstTypes: string[];
  creditTypes: string[];
  stores: string[];
  customers: string[];
  priceCategories: string[];
  salesmen: string[];
  taxOptions: string[];
  shipToOptions: string[];
  paymentTerms: string[];
  paymentLinks: string[];
}

interface ActionBtnProps {
  icon: React.ReactElement;
}

// 1. UPDATE THE INTERFACE to accept the new prop
export interface SalesInvoiceFormProps {
  themeColor?: string;
  onOverlayChange?: (isOpen: boolean) => void;
}

interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
}

interface InputGroupProps {
  children: React.ReactNode;
}

interface SelectProps {
  options: string[];
  placeholder?: string;
  value?: string;
}

// --- Mock Data ---
const mockData: MockData = {
  gstTypes: ["BillOfSupply", "GST Invoice", "Export"],
  creditTypes: ["Credit", "Cash"],
  stores: ["SPORTS HUB", "TECH WORLD", "FASHION POINT"],
  customers: ["John Doe", "Jane Smith", "Acme Corp"],
  priceCategories: ["Retail", "Wholesale", "Dealer"],
  salesmen: ["Alice", "Bob", "Charlie"],
  taxOptions: ["Inclusive", "Exclusive"],
  shipToOptions: ["Warehouse A", "Warehouse B", "Store Front"],
  paymentTerms: ["Immediate", "Net 15", "Net 30"],
  paymentLinks: ["PayTM", "Razorpay", "Stripe", "Direct Transfer"],
};

// --- UI Components ---
const Label: React.FC<LabelProps> = ({ children, required }) => (
  <label className="text-[13px] text-gray-700 font-medium flex items-center h-[30px] whitespace-nowrap">
    {children} {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const InputGroup: React.FC<InputGroupProps> = ({ children }) => (
  <div className="flex items-center w-full relative gap-1">{children}</div>
);

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select...",
  value,
}) => (
  <div className="relative w-full">
    <select
      className="w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)] appearance-none"
      defaultValue={value}
    >
      <option value="" disabled>
        {placeholder}
      </option>

      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
      <svg width="8" height="6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 10l5 5 5-5z" />
      </svg>
    </div>
  </div>
);

const ActionBtn: React.FC<ActionBtnProps> = ({ icon }) => (
  <button className="h-[30px] w-[30px] bg-[var(--theme-primary)] text-white flex items-center justify-center rounded-sm border border-[var(--theme-primary)] hover:opacity-90 transition-opacity ml-[-1px] z-10">
    {icon}
  </button>
);

const VoucherDateInput: React.FC<{ value: string }> = ({ value }) => (
  <div className="relative w-full h-[30px]">
    <input
      type="text"
      defaultValue={value}
      readOnly
      className="w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)] pr-8"
    />
    <button className="absolute right-0 top-0 h-full w-8 flex items-center justify-center bg-gray-100 rounded-r-sm border-l border-gray-300 hover:bg-gray-200 transition-colors">
      <CalenderIcon />
    </button>
  </div>
);

const VoucherNoInput: React.FC<{ value: string }> = ({ value }) => (
  <div className="w-full">
    <input
      type="text"
      defaultValue={value}
      readOnly
      className="w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)]"
    />
  </div>
);

// --- Main Component ---
const StockAdjustmentForm: React.FC<SalesInvoiceFormProps> = ({
  themeColor = "#0f3c63",
  onOverlayChange, // 2. Receive the prop
}) => {
  const themeStyles = {
    "--theme-primary": themeColor,
    "--theme-focus": "#60a5fa",
  } as React.CSSProperties;

  const [documentInventoryModal, setDocumentInventoryModal] = useState(false);
  const [editingRow, setEditingRow] = useState<null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleDocumentInventoryModal = () => {
    setDocumentInventoryModal(true);
  };

  const handleAddNew = () => {
    setEditingRow(null);
    setIsFormOpen(true);
    // 3. Notify Parent to HIDE Table/Footer
    if (onOverlayChange) onOverlayChange(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRow(null);
    // 4. Notify Parent to SHOW Table/Footer
    if (onOverlayChange) onOverlayChange(false);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
  };

  // If the form is open, we can just return the CRUD form immediately
  // This replaces the StockAdjustment Inputs with the Customer Inputs
  if (isFormOpen) {
    return (
      <div
        className="w-full bg-white rounded-xl shadow-md border border-gray-200 p-6 animate-in fade-in zoom-in-95 duration-200"
        style={themeStyles}
      >
        <div className="mb-4 border-b pb-4">
          <button
            onClick={handleCloseForm}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-[var(--theme-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stock Adjustment
          </button>
        </div>

        <CrudCustomer
          onClose={handleCloseForm}
          initialData={editingRow}
          onSuccess={handleFormSuccess}
        />
      </div>
    );
  }

  // Otherwise, return the normal StockAdjustment inputs
  return (
    <>
      <div
        style={themeStyles}
        className="bg-white rounded-lg shadow-md border border-gray-200 p-5 w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
          {/* LEFT COLUMN */}
          <div className="space-y-1">
            {/* Category */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label required>Category</Label>
              </div>

              <div className="col-span-8">
                <InputGroup>
                  <Select
                    options={mockData.priceCategories}
                    placeholder="Select..."
                  />
                  <button onClick={handleDocumentInventoryModal}>
                    <ActionBtn icon={<EditIcon size={16} />} />
                  </button>
                </InputGroup>
              </div>
            </div>

            {/* Store */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label required>Store</Label>
              </div>

              <div className="col-span-8">
                <InputGroup>
                  <Select options={mockData.stores} value="SPORTS HUB" />
                  <ActionBtn icon={<EditIcon size={16} />} />
                </InputGroup>
              </div>
            </div>

            {/* To Store */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>To Store</Label>
              </div>

              <div className="col-span-8">
                <InputGroup>
                  <Select
                    options={mockData.customers}
                    placeholder="Select..."
                  />
                  {/* Triggers The Logic */}
                  <button onClick={handleAddNew}>
                    <ActionBtn icon={<EditIcon size={16} />} />
                  </button>
                </InputGroup>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-1">
            {/* Transfer Date */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Transfer Date</Label>
              </div>

              <div className="col-span-8">
                <VoucherDateInput value="25/11/2025" />
              </div>
            </div>

            {/* Transfer No */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Transfer No</Label>
              </div>

              <div className="col-span-8">
                <VoucherNoInput value="0005" />
              </div>
            </div>
            {/* PostingGL  */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>PostingGL </Label>
              </div>

              <div className="col-span-8">
                <InputGroup>
                  <Select
                    options={mockData.customers}
                    placeholder="Select..."
                  />
                  {/* Triggers The Logic */}
                  <button onClick={handleAddNew}>
                    <ActionBtn icon={<EditIcon size={16} />} />
                  </button>
                </InputGroup>
              </div>
            </div>
          </div>
        </div>

        {/* ITEM GROUP MODAL OVERLAY */}
        {documentInventoryModal && (
          <div className="fixed inset-0 z-[30] flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm p-4">
            <div className=" w-auto h-auto bg-white rounded-lg shadow-2xl overflow-hidden relative">
              <DocumentInventoryModal
                isOpen={documentInventoryModal}
                onClose={() => setDocumentInventoryModal(false)}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StockAdjustmentForm;
