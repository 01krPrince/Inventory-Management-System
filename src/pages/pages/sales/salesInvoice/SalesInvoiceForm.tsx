import React, { useState } from "react";
import {
  ChartIcon,
  CalenderIcon,
  DocumentIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "../../../../components/icons"; // Adjust path based on your project structure
import { MdModeEdit } from "react-icons/md";

// --- Types & Interfaces ---

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

// --- Helper Component Props ---

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

interface InputProps {
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
}

interface DateFieldProps {
  value: string;
}

interface ActionBtnProps {
  icon: React.ReactNode;
}

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

interface SalesInvoiceFormProps {
  // New Prop for Theme
  themeColor?: string;
}

// --- Helper Components ---

const Label: React.FC<LabelProps> = ({ children, required }) => (
  <label className="text-[13px] text-gray-700 font-medium flex items-center h-[30px]">
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

const Input: React.FC<InputProps> = ({ value, placeholder, readOnly }) => (
  <input
    type="text"
    className={`w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)] ${
      readOnly ? "bg-gray-50" : ""
    }`}
    defaultValue={value}
    placeholder={placeholder}
    readOnly={readOnly}
  />
);

const DateField: React.FC<DateFieldProps> = ({ value }) => (
  <div className="relative w-full">
    <input
      type="text"
      className="w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)]"
      defaultValue={value}
    />
    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
      <CalenderIcon className="w-4 h-4" />
    </div>
  </div>
);

const ActionBtn: React.FC<ActionBtnProps> = ({ icon }) => (
  <button className="h-[30px] w-[30px] bg-[var(--theme-primary)] text-white flex items-center justify-center rounded-sm border border-[var(--theme-primary)] hover:opacity-90 transition-opacity ml-[-1px] z-10">
    <span className="w-3 h-3">{icon}</span>
  </button>
);

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className="mb-2 border border-gray-200 rounded bg-white">
      {/* Header */}
      <div
        onClick={onToggle}
        className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors select-none border-b border-transparent"
      >
        <div className="flex items-center gap-2 text-[var(--theme-secondary)] font-bold text-sm">
          <DocumentIcon className="w-5 h-5" />
          <span>{title}</span>
        </div>
        <div className="text-[var(--theme-secondary)]">
          {isOpen ? (
            <ChevronUpIcon className="w-5 h-5" />
          ) : (
            <ChevronDownIcon className="w-5 h-5" />
          )}
        </div>
      </div>

      {/* Content */}
      {isOpen && <div className="p-3 border-t border-gray-100">{children}</div>}
    </div>
  );
};

// --- Main Form Component ---

const SalesInvoiceForm: React.FC<SalesInvoiceFormProps> = ({
  themeColor = "#0f3c63",
}) => {
  const [isBillToOpen, setBillToOpen] = useState<boolean>(false);
  const [isShipToOpen, setShipToOpen] = useState<boolean>(false);

  // Define dynamic styles based on the theme prop
  const themeStyles = {
    "--theme-primary": themeColor,
    // For secondary text, we use the same color but you could make this lighter logic if needed
    "--theme-secondary": themeColor,
    // A lighter version for focus rings (using a hardcoded fallback or simple opacity logic if you want complex color math)
    // For now, I'll default the focus ring to a standard blue, or you can pass a specific focus color prop.
    "--theme-focus": "#60a5fa",
  } as React.CSSProperties;

  return (
    <div
      style={themeStyles}
      className="bg-white rounded border border-gray-200 p-5"
    >
      <div className="grid grid-cols-12 gap-8">
        {/* === LEFT COLUMN (General Info) === */}
        <div className="col-span-4 space-y-1">
          {/* Row 1: GST Type */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>GST Type</Label>
            </div>
            <div className="col-span-8">
              <Select options={mockData.gstTypes} value="BillOfSupply" />
            </div>
          </div>

          {/* Row 2: Cash/Credit */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Cash/Credit</Label>
            </div>
            <div className="col-span-8">
              <Select options={mockData.creditTypes} value="Credit" />
            </div>
          </div>

          {/* Row 3: Store */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label required>Store</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Select options={mockData.stores} value="SPORTS HUB" />
                <ActionBtn icon={<MdModeEdit />} />
              </InputGroup>
            </div>
          </div>

          {/* Row 4: Customer */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label required>Customer</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Select options={mockData.customers} />
                <ActionBtn icon={<MdModeEdit />} />
                <ActionBtn icon={<ChartIcon />} />
              </InputGroup>
            </div>
          </div>

          {/* Row 5: Email */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Email</Label>
            </div>
            <div className="col-span-8">
              <Input />
            </div>
          </div>

          {/* Row 6: Price Category */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Price Category</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Select options={mockData.priceCategories} />
                <ActionBtn icon={<MdModeEdit />} />
              </InputGroup>
            </div>
          </div>
        </div>

        {/* === MIDDLE COLUMN (Details) === */}
        <div className="col-span-4 space-y-1">
          {/* Row 1: Date */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label required>Date</Label>
            </div>
            <div className="col-span-8">
              <DateField value="20/11/2025" />
            </div>
          </div>

          {/* Row 2: Invoice No */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Invoice No</Label>
            </div>
            <div className="col-span-8">
              <Input value="00046" readOnly />
            </div>
          </div>

          {/* Row 3: Ref No */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Ref No</Label>
            </div>
            <div className="col-span-8">
              <Input />
            </div>
          </div>

          {/* Row 4: Ref Date */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Ref.Date</Label>
            </div>
            <div className="col-span-8">
              <DateField value="20/11/2025" />
            </div>
          </div>

          {/* Row 5: Salesman */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Salesman</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Select options={mockData.salesmen} />
                <ActionBtn icon={<MdModeEdit />} />
              </InputGroup>
            </div>
          </div>

          {/* Row 6: Tax */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Tax</Label>
            </div>
            <div className="col-span-8">
              <Select options={mockData.taxOptions} value="Inclusive" />
            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN (Address & Payment) === */}
        {/* Note: min-h-full ensures this column stretches but can also expand */}
        <div className="col-span-4 flex flex-col min-h-full">
          {/* 1. Bill To Accordion */}
          <AccordionSection
            title="Bill To"
            isOpen={isBillToOpen}
            onToggle={() => setBillToOpen(!isBillToOpen)}
          >
            <div className="flex items-center mb-2">
              <span className="w-16 text-[13px] text-gray-600">Bill To</span>
              <div className="flex-grow">
                <Select options={mockData.customers} />
              </div>
            </div>
            <textarea className="w-full h-20 border border-gray-300 rounded text-[13px] p-2 resize-none focus:ring-1 focus:border-[var(--theme-focus)] focus:ring-[var(--theme-focus)] outline-none" />
          </AccordionSection>

          {/* 2. Ship To Accordion */}
          <AccordionSection
            title="Ship To"
            isOpen={isShipToOpen}
            onToggle={() => setShipToOpen(!isShipToOpen)}
          >
            <div className="flex items-center mb-2">
              <span className="w-16 text-[13px] text-gray-600 font-medium">
                Ship To
              </span>
              <div className="flex-grow flex">
                <Select options={mockData.shipToOptions} />
                <ActionBtn icon={<MdModeEdit />} />
              </div>
            </div>
            <div className="relative">
              <textarea className="w-full h-24 border border-gray-300 rounded text-[13px] p-2 resize-none focus:ring-1 focus:border-[var(--theme-focus)] focus:ring-[var(--theme-focus)] outline-none"></textarea>
              <span className="absolute bottom-1 right-2 text-[10px] text-gray-400">
                0/200
              </span>
            </div>
          </AccordionSection>

          {/* Spacer to push payment to bottom if height allows */}
          <div className="mt-auto pt-4 space-y-1">
            {/* Payment Terms */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4">
                <Label>Payment Terms</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Select options={mockData.paymentTerms} />
                  <ActionBtn icon={<MdModeEdit />} />
                </InputGroup>
              </div>
            </div>

            {/* Due Date */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4">
                <Label>Due Date</Label>
              </div>
              <div className="col-span-8">
                <DateField value="20/11/2025" />
              </div>
            </div>

            {/* Payment Link */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4">
                <Label>Payment Link</Label>
              </div>
              <div className="col-span-8">
                <Select options={mockData.paymentLinks} value="PayTM" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesInvoiceForm;
