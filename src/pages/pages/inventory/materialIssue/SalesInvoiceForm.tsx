import React from "react";

// --- Custom Calendar Icon ---
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-500"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

// --- Custom Edit Icon ---
const EditIcon = ({ size = 16, color = "white" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

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

interface SalesInvoiceFormProps {
  themeColor?: string;
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

    {/* Dropdown Icon */}
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
      <CalendarIcon />
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
const SalesInvoiceForm: React.FC<SalesInvoiceFormProps> = ({
  themeColor = "#0f3c63",
}) => {
  const themeStyles = {
    "--theme-primary": themeColor,
    "--theme-focus": "#60a5fa",
  } as React.CSSProperties;

  return (
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
                <ActionBtn icon={<EditIcon size={16} />} />
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

          {/* Party */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Party</Label>
            </div>

            <div className="col-span-8">
              <InputGroup>
                <Select options={mockData.customers} placeholder="Select..." />
                <ActionBtn icon={<EditIcon size={16} />} />
              </InputGroup>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-1">
          {/* Voucher Date */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Voucher Date</Label>
            </div>

            <div className="col-span-8">
              <VoucherDateInput value="25/11/2025" />
            </div>
          </div>

          {/* Voucher No */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Voucher No</Label>
            </div>

            <div className="col-span-8">
              <VoucherNoInput value="0005" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesInvoiceForm;
