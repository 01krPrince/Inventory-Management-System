import React, { useState } from "react";
import {
  ChartIcon,
  CalenderIcon,
  DocumentIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "../../../../components/icons";
import { EditIcon } from "lucide-react";

// --- IMPORT YOUR CUSTOM DROPDOWN ---
// Assuming the file path is correct based on your previous messages
import Dropdown, { ColumnDef } from "../../../../components/Dropdown";

// --- Types & Interfaces ---

// 1. Define a generic option type for your dropdown data
interface SimpleOption {
  name: string;
}

// 2. Define the Mock Data structure using the Option type
interface MockData {
  gstTypes: SimpleOption[];
  creditTypes: SimpleOption[];
  stores: SimpleOption[];
  customers: SimpleOption[];
  priceCategories: SimpleOption[];
  salesmen: SimpleOption[];
  taxOptions: SimpleOption[];
  shipToOptions: SimpleOption[];
  paymentTerms: SimpleOption[];
  paymentLinks: SimpleOption[];
  placeOfSupply: SimpleOption[];
}

// 3. Helper to convert string arrays into object arrays { name: "X" }
const toOptions = (arr: string[]): SimpleOption[] =>
  arr.map((s) => ({ name: s }));

const mockData: MockData = {
  gstTypes: toOptions(["BillOfSupply", "GST Invoice", "Export"]),
  creditTypes: toOptions(["Credit", "Cash"]),
  stores: toOptions(["SPORTS HUB", "TECH WORLD", "FASHION POINT"]),
  customers: toOptions(["John Doe", "Jane Smith", "Acme Corp"]),
  priceCategories: toOptions(["Retail", "Wholesale", "Dealer"]),
  salesmen: toOptions(["Alice", "Bob", "Charlie"]),
  taxOptions: toOptions(["Inclusive", "Exclusive"]),
  shipToOptions: toOptions(["Warehouse A", "Warehouse B", "Store Front"]),
  paymentTerms: toOptions(["Immediate", "Net 15", "Net 30"]),
  paymentLinks: toOptions(["PayTM", "Razorpay", "Stripe", "Direct Transfer"]),
  placeOfSupply: toOptions(["Bihar", "Delhi", "Maharashtra", "Uttar Pradesh"]),
};

// --- Helper Component Props ---

interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
}

interface InputGroupProps {
  children: React.ReactNode;
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
  themeColor?: string;
}

// --- Helper Components ---

const Label: React.FC<LabelProps> = ({ children, required }) => (
  <label className="text-[13px] text-gray-700 font-medium flex items-center h-[30px] whitespace-nowrap">
    {children} {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const InputGroup: React.FC<InputGroupProps> = ({ children }) => (
  <div className="flex items-center w-full relative gap-1">{children}</div>
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
      type="text" // In real app, use type="date" or a picker
      className="w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)]"
      defaultValue={value}
    />
    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
      <CalenderIcon className="w-4 h-4" />
    </div>
  </div>
);

const ActionBtn: React.FC<ActionBtnProps> = ({ icon }) => (
  <button className="h-[30px] w-[30px] bg-[var(--theme-primary)] text-white flex items-center justify-center rounded-sm border border-[var(--theme-primary)] hover:opacity-90 transition-opacity ml-[-1px] z-10 shadow-sm">
    <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
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

  // Define dynamic styles
  const themeStyles = {
    "--theme-primary": themeColor,
    "--theme-secondary": themeColor,
    "--theme-focus": "#60a5fa",
  } as React.CSSProperties;

  // --- COLUMN DEFINITION ---
  // This matches ColumnDef<T> required by your Dropdown
  const simpleColumns: ColumnDef<SimpleOption>[] = [
    { header: "Name", key: "name", width: "flex-1" },
  ];

  // --- DUMMY HANDLER ---
  // In a real app, you would set state here.
  // Your Dropdown onChange returns (item: T | null).
  const handleDropdownChange = (item: SimpleOption | null) => {
    console.log("Selected:", item);
  };

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
              <Dropdown<SimpleOption>
                data={mockData.gstTypes}
                columns={simpleColumns}
                value="BillOfSupply" // Matching valueKey
                valueKey="name"
                onChange={handleDropdownChange}
                placeholder="Select..."
              />
            </div>
          </div>

          {/* Row 2: Cash/Credit */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Cash/Credit</Label>
            </div>
            <div className="col-span-8">
              <Dropdown<SimpleOption>
                data={mockData.creditTypes}
                columns={simpleColumns}
                value="Credit"
                valueKey="name"
                onChange={handleDropdownChange}
                placeholder="Select..."
              />
            </div>
          </div>

          {/* Row 3: Store */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label required>Store</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Dropdown<SimpleOption>
                  data={mockData.stores}
                  columns={simpleColumns}
                  value="SPORTS HUB"
                  valueKey="name"
                  onChange={handleDropdownChange}
                  placeholder="Select..."
                />
                <ActionBtn icon={<EditIcon size={14} />} />
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
                <Dropdown<SimpleOption>
                  data={mockData.customers}
                  columns={simpleColumns}
                  value=""
                  valueKey="name"
                  onChange={handleDropdownChange}
                  placeholder="Select Customer..."
                />
                <ActionBtn icon={<EditIcon size={14} />} />
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
                <Dropdown<SimpleOption>
                  data={mockData.priceCategories}
                  columns={simpleColumns}
                  value=""
                  valueKey="name"
                  onChange={handleDropdownChange}
                  placeholder="Select..."
                />
                <ActionBtn icon={<EditIcon size={14} />} />
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
                <Dropdown<SimpleOption>
                  data={mockData.salesmen}
                  columns={simpleColumns}
                  value=""
                  valueKey="name"
                  onChange={handleDropdownChange}
                  placeholder="Select..."
                />
                <ActionBtn icon={<EditIcon size={14} />} />
              </InputGroup>
            </div>
          </div>

          {/* Row 6: Tax */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Tax</Label>
            </div>
            <div className="col-span-8">
              <Dropdown<SimpleOption>
                data={mockData.taxOptions}
                columns={simpleColumns}
                value="Inclusive"
                valueKey="name"
                onChange={handleDropdownChange}
                placeholder="Select..."
              />
            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN (Address & Payment) === */}
        <div className="col-span-4 flex flex-col min-h-full">
          {/* 1. Bill To Accordion */}
          <AccordionSection
            title="Bill To"
            isOpen={isBillToOpen}
            onToggle={() => setBillToOpen(!isBillToOpen)}
          >
            <div className="space-y-2">
              {/* Address Area */}
              <div className="relative">
                <textarea
                  className="w-full h-20 border border-gray-300 rounded text-[13px] p-2 resize-none focus:ring-1 focus:border-[var(--theme-focus)] focus:ring-[var(--theme-focus)] outline-none"
                  placeholder=""
                />
                <span className="absolute bottom-1 right-2 text-[10px] text-gray-400">
                  0/200
                </span>
              </div>

              {/* GST No */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label>GST No</Label>
                </div>
                <div className="col-span-8">
                  <Input />
                </div>
              </div>

              {/* Contact Person */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label>Contact Person</Label>
                </div>
                <div className="col-span-8">
                  <Input />
                </div>
              </div>

              {/* Place of Supply */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label>Place of Supply</Label>
                </div>
                <div className="col-span-8">
                  <InputGroup>
                    <Dropdown<SimpleOption>
                      data={mockData.placeOfSupply}
                      columns={simpleColumns}
                      value=""
                      valueKey="name"
                      onChange={handleDropdownChange}
                      placeholder="Select..."
                    />
                    <ActionBtn icon={<EditIcon size={14} />} />
                  </InputGroup>
                </div>
              </div>

              {/* RCM Applicable */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-9">
                  <Label>RCM Applicable on this Invoice</Label>
                </div>
                <div className="col-span-3 flex justify-end">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[var(--theme-primary)] border-gray-300 rounded focus:ring-[var(--theme-focus)]"
                  />
                </div>
              </div>

              {/* eCommerce Inv No */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label>eCommerce Inv No</Label>
                </div>
                <div className="col-span-8">
                  <Input />
                </div>
              </div>
            </div>
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
              <div className="flex-grow flex w-full relative">
                <InputGroup>
                  <Dropdown<SimpleOption>
                    data={mockData.shipToOptions}
                    columns={simpleColumns}
                    value=""
                    valueKey="name"
                    onChange={handleDropdownChange}
                    placeholder="Select..."
                  />
                  <ActionBtn icon={<EditIcon size={14} />} />
                </InputGroup>
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
                  <Dropdown<SimpleOption>
                    data={mockData.paymentTerms}
                    columns={simpleColumns}
                    value=""
                    valueKey="name"
                    onChange={handleDropdownChange}
                    placeholder="Select..."
                  />
                  <ActionBtn icon={<EditIcon size={14} />} />
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
                <Dropdown<SimpleOption>
                  data={mockData.paymentLinks}
                  columns={simpleColumns}
                  value="PayTM"
                  valueKey="name"
                  onChange={handleDropdownChange}
                  placeholder="Select..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesInvoiceForm;
