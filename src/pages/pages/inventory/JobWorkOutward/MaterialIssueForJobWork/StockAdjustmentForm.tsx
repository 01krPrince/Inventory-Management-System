import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Edit2 as EditIcon,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  FileText,
} from "lucide-react";

// --- Types ---
export interface SalesInvoiceFormProps {
  onOverlayChange?: (isOpen: boolean) => void;
}

interface ActionBtnProps {
  icon: React.ReactElement;
  onClick?: () => void;
}

interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
}

interface InputGroupProps {
  children: React.ReactNode;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
  placeholder?: string;
}

// --- MOCK COMPONENTS ---
const DocumentInventoryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="bg-white p-6 rounded-lg w-96 relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
      <h3 className="text-lg font-semibold mb-4 text-[#0f3c63]">
        Document Inventory
      </h3>
      <p className="text-gray-600 mb-4">
        This is a placeholder for the Document Inventory Modal.
      </p>
      <button
        onClick={onClose}
        className="w-full bg-[#0f3c63] text-white py-2 rounded hover:opacity-90"
      >
        Close
      </button>
    </div>
  );
};

const CrudCustomer: React.FC<{
  onClose: () => void;
  initialData: any;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  return (
    <div className="p-1">
      <h2 className="text-xl font-bold text-[#0f3c63] mb-4">
        Add New Customer
      </h2>
      <div className="bg-gray-50 border border-gray-200 rounded p-8 text-center text-gray-500 mb-6">
        [Customer CRUD Form Content]
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSuccess}
          className="px-4 py-2 bg-[#0f3c63] text-white rounded hover:opacity-90"
        >
          Save Customer
        </button>
      </div>
    </div>
  );
};

// --- Mock Data ---
const mockData = {
  stores: ["SPORTS HUB", "TECH WORLD"],
  customers: ["John Doe", "Jane Smith", "Acme Corp"],
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

const ActionBtn: React.FC<ActionBtnProps> = ({ icon, onClick }) => (
  <button
    onClick={onClick}
    className="h-[30px] w-[30px] bg-[#0f3c63] text-white flex items-center justify-center rounded-sm border border-[#0f3c63] hover:opacity-90 transition-opacity flex-shrink-0"
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
  const [documentInventoryModal, setDocumentInventoryModal] = useState(false);
  const [editingRow, setEditingRow] = useState<null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Overlay Handlers
  const handleAddNew = () => {
    setEditingRow(null);
    setIsFormOpen(true);
    if (onOverlayChange) onOverlayChange(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRow(null);
    if (onOverlayChange) onOverlayChange(false);
  };

  // If overlay is open (adding new vendor)
  if (isFormOpen) {
    return (
      <div className="w-full bg-white rounded-xl shadow-md border border-gray-200 p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="mb-4 border-b pb-4">
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
                    onClick={() => setDocumentInventoryModal(true)}
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
                  <Select options={mockData.customers} />
                  <ActionBtn
                    icon={<EditIcon size={14} />}
                    onClick={handleAddNew}
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
                  <ActionBtn icon={<EditIcon size={14} />} />
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

      {/* Item Group Modal (Overlay) */}
      {documentInventoryModal && (
        <div className="fixed inset-0 z-[30] flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm p-4">
          <div className="w-auto h-auto bg-white rounded-lg shadow-2xl overflow-hidden relative">
            <DocumentInventoryModal
              isOpen={documentInventoryModal}
              onClose={() => setDocumentInventoryModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StockAdjustmentForm;
