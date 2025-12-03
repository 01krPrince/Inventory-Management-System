import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Edit2 as EditIcon,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  FileText,
  Plus,
} from "lucide-react";
import DocumentInventoryModal from "../../../../../components/DocumentCategoryInventory";
import CrudCustomer from "../../../sales/customer/pages/AddNewCustomer";
import AddNewItem from "../../../../../components/addItemMaster/AddNewItem";

// --- Types ---
export interface SalesInvoiceFormProps {
  onOverlayChange?: (isOpen: boolean) => void;
}

interface ActionBtnProps {
  icon: React.ReactElement;
  onClick?: () => void;
  className?: string;
}

interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
}

interface InputGroupProps {
  children: React.ReactNode;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: (string | { label: string; value: string | number })[];
  placeholder?: string;
}

// --- Mock Data ---
const mockData = {
  stores: ["SPORTS HUB", "TECH WORLD"],
  customers: [
    { id: 101, name: "John Doe", code: "C001" },
    { id: 102, name: "Jane Smith", code: "C002" },
    { id: 103, name: "Acme Corp", code: "C003" },
  ],
  categories: ["Retail", "Wholesale", "Raw Material"],
  processes: ["Cutting", "Stitching", "Packing"],
  freshRework: ["Fresh", "Rework", "Damaged"],
  shipTo: ["Warehouse A", "Factory B", "Store Front"],
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
  className = "",
  ...props
}) => (
  <div className="relative w-full">
    <select
      className={`w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[#0f3c63] focus:ring-1 focus:ring-[#0f3c63] appearance-none ${className}`}
      {...props}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((opt, index) => {
        const value = typeof opt === "object" ? opt.value : opt;
        const label = typeof opt === "object" ? opt.label : opt;
        return (
          <option key={`${value}-${index}`} value={value}>
            {label}
          </option>
        );
      })}
    </select>
    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
      <svg width="8" height="6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 10l5 5 5-5z" />
      </svg>
    </div>
  </div>
);

const ActionBtn: React.FC<ActionBtnProps> = ({ icon, onClick, className }) => (
  <button
    onClick={onClick}
    type="button"
    className={`h-[30px] w-[30px] bg-[#0f3c63] text-white flex items-center justify-center rounded-sm border border-[#0f3c63] hover:opacity-90 transition-opacity flex-shrink-0 ${className}`}
  >
    {icon}
  </button>
);

const DateInput: React.FC<{ value?: string }> = ({ value }) => (
  <div className="relative w-full h-[30px]">
    <input
      type="text"
      defaultValue={value}
      className="w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[#0f3c63] focus:ring-1 focus:ring-[#0f3c63] pr-8"
    />
    <button className="absolute right-0 top-0 h-full w-8 flex items-center justify-center bg-gray-100 rounded-r-sm border-l border-gray-300 hover:bg-gray-200 transition-colors text-gray-500">
      <CalendarIcon size={14} />
    </button>
  </div>
);

const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => (
  <input
    type="text"
    className="w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[#0f3c63] focus:ring-1 focus:ring-[#0f3c63] disabled:bg-gray-50"
    {...props}
  />
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (
  props
) => (
  <textarea
    className="w-full bg-white border border-gray-300 rounded-sm px-2 py-1 text-[13px] text-gray-700 focus:outline-none focus:border-[#0f3c63] focus:ring-1 focus:ring-[#0f3c63] resize-none"
    rows={4}
    {...props}
  />
);

// --- NEW COLLAPSIBLE COMPONENT ---
const CollapsibleCard: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-md bg-white shadow-sm">
      <div
        className="flex items-center justify-between px-3 py-2 bg-gray-50 cursor-pointer select-none border-b border-gray-100 rounded-t-md hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-[#0f3c63] font-semibold text-xs uppercase tracking-wide">
          {icon}
          <span>{title}</span>
        </div>
        <div className="text-gray-400">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {isOpen && (
        <div className="p-3 animate-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
const StockAdjustmentForm: React.FC<SalesInvoiceFormProps> = ({
  onOverlayChange,
}) => {
  const themeStyles = {
    "--theme-primary": "#0f3c63",
    "--theme-focus": "#60a5fa",
  } as React.CSSProperties;

  const [documentInventoryModalCompo, setDocumentInventoryModalCompo] =
    useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);

  // State for Customer/Vendor Form
  const [isFormOpen, setIsFormOpen] = useState(false);

  // State for Item/Process Form (Added for inline behavior)
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);

  const [selectedVendor, setSelectedVendor] = useState<string>("");

  const handleDocumentInventoryModal = () => {
    setDocumentInventoryModalCompo(true);
  };

  // --- Handlers for Item/Process Form ---
  const handleInventoryForm = () => {
    setIsItemFormOpen(true);
    if (onOverlayChange) onOverlayChange(true);
  };

  const handleCloseItemForm = () => {
    setIsItemFormOpen(false);
    if (onOverlayChange) onOverlayChange(false);
  };

  // --- Handlers for Vendor/Customer Form ---
  // 1. Create New Vendor (Pass null data)
  const handleAddNewVendor = () => {
    setEditingRow(null);
    setIsFormOpen(true);
    if (onOverlayChange) onOverlayChange(true);
  };

  // 2. Edit Selected Vendor (Pass selected object)
  const handleEditVendor = () => {
    if (!selectedVendor) {
      alert("Please select a vendor to edit.");
      return;
    }
    const vendorData = mockData.customers.find(
      (c) => c.id.toString() === selectedVendor
    );
    if (vendorData) {
      setEditingRow(vendorData);
      setIsFormOpen(true);
      if (onOverlayChange) onOverlayChange(true);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRow(null);
    if (onOverlayChange) onOverlayChange(false);
  };

  // Prepare Vendor Options for the Select component
  const vendorOptions = mockData.customers.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  // Render: Customer/Vendor Form (Inline)
  if (isFormOpen) {
    return (
      <div className="w-full bg-white rounded-xl shadow-md border border-gray-200 p-6 animate-in fade-in zoom-in-95 duration-200">
        <div style={themeStyles} className="mb-4 border-b pb-4">
          <button
            onClick={handleCloseForm}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-[#0f3c63] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stock Adjustment
          </button>
        </div>
        <CrudCustomer
          onClose={handleCloseForm}
          initialData={editingRow}
          onSuccess={handleCloseForm}
        />
      </div>
    );
  }

  // Render: Item/Process Form (Inline) - Matching style of Customer Form
  if (isItemFormOpen) {
    return (
      <div className="w-full bg-white rounded-xl shadow-md border border-gray-200 p-6 animate-in fade-in zoom-in-95 duration-200">
        <div style={themeStyles} className="mb-4 border-b pb-4">
          <button
            onClick={handleCloseItemForm}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-[#0f3c63] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stock Adjustment
          </button>
        </div>
        <AddNewItem
          onClose={handleCloseItemForm}
          onSuccess={handleCloseItemForm}
          initialData={null} // or pass data if editing
        />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- COLUMN 1: Basic Info --- */}
          <div className="space-y-1">
            {/* Category */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label required>Category</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Select options={mockData.categories} />
                  <ActionBtn
                    icon={<EditIcon size={14} />}
                    onClick={handleDocumentInventoryModal}
                  />
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
                  <Select options={mockData.stores} defaultValue="SPORTS HUB" />
                  <ActionBtn icon={<EditIcon size={14} />} />
                </InputGroup>
              </div>
            </div>

            {/* Vendor */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label required>Vendor</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Select
                    options={vendorOptions}
                    value={selectedVendor}
                    onChange={(e) => setSelectedVendor(e.target.value)}
                    placeholder="Select Vendor..."
                  />
                  {/* Create Button */}
                  <ActionBtn
                    icon={<Plus size={14} />}
                    onClick={handleAddNewVendor}
                  />
                  {/* Edit Button */}
                  <ActionBtn
                    icon={<EditIcon size={14} />}
                    onClick={handleEditVendor}
                  />
                </InputGroup>
              </div>
            </div>

            {/* Issue Date */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label required>Issue Date</Label>
              </div>
              <div className="col-span-8">
                <DateInput value="01/12/2025" />
              </div>
            </div>

            {/* Issue No */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Issue No</Label>
              </div>
              <div className="col-span-8">
                <TextInput defaultValue="00001" />
              </div>
            </div>
          </div>

          {/* --- COLUMN 2: Process Info --- */}
          <div className="space-y-1">
            {/* For Process */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>For Process</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Select options={mockData.processes} />
                  <button onClick={handleInventoryForm}>
                    <ActionBtn icon={<EditIcon size={14} />} />
                  </button>
                </InputGroup>
              </div>
            </div>

            {/* Process Rate */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Process Rate</Label>
              </div>
              <div className="col-span-8">
                <TextInput defaultValue="0" className="text-right" />
              </div>
            </div>

            {/* Fresh/Rework */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Fresh/Rework</Label>
              </div>
              <div className="col-span-8">
                <Select options={mockData.freshRework} defaultValue="Fresh" />
              </div>
            </div>

            {/* Ref No */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Ref No</Label>
              </div>
              <div className="col-span-8">
                <TextInput />
              </div>
            </div>

            {/* Ref Date */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Ref Date</Label>
              </div>
              <div className="col-span-8">
                <DateInput value="01/12/2025" />
              </div>
            </div>
          </div>

          {/* --- COLUMN 3: Addresses (Collapsible) --- */}
          <div className="space-y-4">
            {/* Party Address Panel */}
            <CollapsibleCard
              title="Party Address"
              icon={<FileText size={14} />}
            >
              <TextArea placeholder="Enter Party Address..." />
            </CollapsibleCard>

            {/* Shipping Address Panel */}
            <CollapsibleCard
              title="Shipping Address"
              icon={<FileText size={14} />}
              defaultOpen={false}
            >
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-3">
                    <Label>Ship To</Label>
                  </div>
                  <div className="col-span-9">
                    <InputGroup>
                      <Select options={mockData.shipTo} />
                      <ActionBtn icon={<EditIcon size={14} />} />
                    </InputGroup>
                  </div>
                </div>
                <TextArea placeholder="Enter Shipping Address..." />
              </div>
            </CollapsibleCard>
          </div>
        </div>
      </div>

      {/* ITEM GROUP MODAL OVERLAY */}
      {documentInventoryModalCompo && (
        <div className="fixed inset-0 z-[30] flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm p-4">
          <div className=" w-auto h-auto bg-white rounded-lg shadow-2xl overflow-hidden relative">
            <DocumentInventoryModal
              isOpen={documentInventoryModalCompo}
              onClose={() => setDocumentInventoryModalCompo(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StockAdjustmentForm;
