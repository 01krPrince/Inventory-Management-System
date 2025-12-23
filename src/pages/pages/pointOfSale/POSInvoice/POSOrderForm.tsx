import React, { useState } from "react";
import {
  DocumentIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "../../../../components/icons";
import Dropdown, { ColumnDef } from "../../../../components/Dropdown";
import DateInput from "../../../../components/DateInput";
import { Search, EditIcon } from "lucide-react";

import CounterMaster from "../../../../components/CounterMaster";
import SalesExecutiveMaster from "../../../../components/SalesExecutiveMaster";
import TenderTypeMaster from "../../../../components/TenderTypeMaster";
import State from "../../../../components/State";
// --- Import the generic NameAndCodeMaster component ---
import NameAndCodeMaster from "../../../../components/NameAndCodeComponent";

// --- 1. Types & Interfaces ---

interface DropdownItem {
  name: string;
  code?: string;
  [key: string]: any;
}

interface MockData {
  gstTypes: DropdownItem[];
  salesmen: DropdownItem[];
  priceCategories: DropdownItem[]; // Added specific type for price categories
  paymentModes: DropdownItem[];
  tenderAccounts: DropdownItem[];
  states: DropdownItem[];
  creditTypes: string[];
  stores: string[];
  customers: string[];
  paymentLinks: string[];
  shipToOptions: string[];
}

const mockData: MockData = {
  gstTypes: [
    { name: "BillOfSupply", code: "BOS" },
    { name: "GST Invoice", code: "GST" },
    { name: "Export", code: "EXP" },
  ],
  salesmen: [
    { name: "Alice", code: "SM01" },
    { name: "Bob", code: "SM02" },
    { name: "Charlie", code: "SM03" },
  ],
  priceCategories: [
    { name: "Retail Price", code: "RP" },
    { name: "Wholesale Price", code: "WP" },
    { name: "Online Price", code: "OP" },
  ],
  paymentModes: [
    { name: "Cash", code: "CASH" },
    { name: "Card", code: "CARD" },
    { name: "UPI", code: "UPI" },
  ],
  tenderAccounts: [
    { name: "Main Cash", code: "AC01" },
    { name: "Petty Cash", code: "AC02" },
    { name: "Bank HDFC", code: "BK01" },
  ],
  states: [
    { name: "Delhi", code: "DL" },
    { name: "Haryana", code: "HR" },
    { name: "Uttar Pradesh", code: "UP" },
    { name: "Maharashtra", code: "MH" },
  ],
  creditTypes: ["Credit", "Cash"],
  stores: ["SPORTS HUB", "TECH WORLD", "FASHION POINT"],
  customers: ["John Doe", "Jane Smith", "Acme Corp"],
  paymentLinks: ["PayTM", "Razorpay", "Stripe", "Direct Transfer"],
  shipToOptions: ["Warehouse A", "Warehouse B", "Store Front"],
};

// --- 2. Helper Components ---

const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({
  children,
  required,
}) => (
  <label className="text-[13px] text-gray-700 font-medium flex items-center h-[30px] whitespace-nowrap">
    {children} {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const InputGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center w-full relative gap-1">{children}</div>
);

interface InputProps {
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  value,
  placeholder,
  readOnly,
  onChange,
}) => (
  <input
    type="text"
    readOnly={readOnly}
    onChange={onChange}
    className={`w-full h-[30px] border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)] ${
      readOnly ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"
    }`}
    value={value}
    placeholder={placeholder}
  />
);

const ActionBtn: React.FC<{ icon: React.ReactNode; onClick?: () => void }> = ({
  icon,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="h-[30px] w-[30px] bg-[var(--theme-primary)] text-white flex items-center justify-center rounded-sm border border-[var(--theme-primary)] hover:opacity-90 transition-opacity ml-[-1px] z-10 shrink-0"
  >
    <span className="w-3 h-3 flex items-center justify-center">{icon}</span>
  </button>
);

const AccordionSection: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="mb-2 border border-gray-200 rounded bg-white">
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
      {isOpen && <div className="p-3 border-t border-gray-100">{children}</div>}
    </div>
  );
};

// --- 3. Main Form Component ---

interface SalesInvoiceFormProps {
  themeColor?: string;
}

const POSOrderForm: React.FC<SalesInvoiceFormProps> = ({
  themeColor = "#0f3c63",
}) => {
  const [isBillToOpen, setBillToOpen] = useState<boolean>(true);
  const [isShipToOpen, setShipToOpen] = useState<boolean>(false);
  const [isCustomerOpen, setIsCustomerOpen] = useState<boolean>(false);

  // --- Modal States ---
  const [isCounterMasterOpen, setIsCounterMasterOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isSalesExecutiveMasterOpen, setIsSalesExecutiveMasterOpen] =
    useState(false);
  const [isTenderTypeOpen, setIsTenderTypeOpen] = useState(false);

  // --- NEW: Price Category Modal State ---
  const [isPriceCategoryOpen, setIsPriceCategoryOpen] = useState(false);

  const overlayZIndex = 10;
  const nestedModalZIndex = overlayZIndex + 20;

  const [formData, setFormData] = useState({
    counter: "BillOfSupply",
    salesman: "",
    priceCategory: "", // Corrected key for state
    paymentMode: "",
    advanceTender: "",
    state: "",
    city: "",
    orderDate: "",
    deliveryDate: "",
    refDate: "",
    refNo: "",
    gstNo: "",
    deliveryType: "",
    voucherNo: "",
  });

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const themeStyles = {
    "--theme-primary": themeColor,
    "--theme-secondary": themeColor,
    "--theme-focus": "#60a5fa",
  } as React.CSSProperties;

  const defaultColumns: ColumnDef<DropdownItem>[] = [
    { header: "Name", key: "name", width: "w-full" },
  ];
  const codeNameColumns: ColumnDef<DropdownItem>[] = [
    { header: "Code", key: "code", width: "w-20" },
    { header: "Name", key: "name", width: "w-full" },
  ];

  return (
    <div
      style={themeStyles}
      className="bg-white rounded border border-gray-200 p-5 relative"
    >
      {/* --- Modals / Popups --- */}
      {isCounterMasterOpen && (
        <CounterMaster onClose={() => setIsCounterMasterOpen(false)} />
      )}

      {isStateOpen && <State onClose={() => setIsStateOpen(false)} />}

      {isSalesExecutiveMasterOpen && (
        <SalesExecutiveMaster
          onClose={() => setIsSalesExecutiveMasterOpen(false)}
        />
      )}

      {isTenderTypeOpen && (
        <TenderTypeMaster
          onClose={() => setIsTenderTypeOpen(false)}
          index={nestedModalZIndex}
        />
      )}

      {/* --- Generic Name and Code Master used for Price Category --- */}
      {isPriceCategoryOpen && (
        <NameAndCodeMaster
          title="Price Category"
          onClose={() => setIsPriceCategoryOpen(false)}
          index={nestedModalZIndex}
          onSuccess={() => {
            console.log("Price Category refreshed");
            // Here you would typically re-fetch your price categories from API
          }}
        />
      )}

      <div className="grid grid-cols-12 gap-8">
        {/* === LEFT COLUMN (General Info) === */}
        <div className="col-span-4 space-y-1">
          {/* 1. COUNTER */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Counter</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Dropdown
                  data={mockData.gstTypes}
                  columns={defaultColumns}
                  value={formData.counter}
                  valueKey="name"
                  onChange={(item) =>
                    handleFieldChange("counter", item?.name || "")
                  }
                  placeholder="Select Counter..."
                />
                <ActionBtn
                  icon={<EditIcon size={16} />}
                  onClick={() => setIsCounterMasterOpen(true)}
                />
              </InputGroup>
            </div>
          </div>

          {/* 2. SALESMAN */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Salesman</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Dropdown
                  data={mockData.salesmen}
                  columns={codeNameColumns}
                  value={formData.salesman}
                  valueKey="name"
                  onChange={(item) =>
                    handleFieldChange("salesman", item?.name || "")
                  }
                  placeholder="Select Salesman..."
                />
                <ActionBtn
                  icon={<EditIcon size={16} />}
                  onClick={() => setIsSalesExecutiveMasterOpen(true)}
                />
              </InputGroup>
            </div>
          </div>

          {/* 3. PRICE CATEGORY (Now using NameAndCodeMaster) */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Price Category</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Dropdown
                  data={mockData.priceCategories}
                  columns={codeNameColumns}
                  value={formData.priceCategory}
                  valueKey="name"
                  onChange={(item) =>
                    handleFieldChange("priceCategory", item?.name || "")
                  }
                  placeholder="Select Price Category..."
                />
                {/* Updated onClick to trigger Price Category Modal */}
                <ActionBtn
                  icon={<EditIcon size={16} />}
                  onClick={() => setIsPriceCategoryOpen(true)}
                />
              </InputGroup>
            </div>
          </div>

          {/* Ref No */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Ref No</Label>
            </div>
            <div className="col-span-8">
              <Input
                value={formData.refNo}
                onChange={(e) => handleFieldChange("refNo", e.target.value)}
              />
            </div>
          </div>

          {/* GST No */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>GST No (If B2B)</Label>
            </div>
            <div className="col-span-8">
              <Input
                value={formData.gstNo}
                onChange={(e) => handleFieldChange("gstNo", e.target.value)}
              />
            </div>
          </div>

          {/* Delivery Type */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Delivery Type</Label>
            </div>
            <div className="col-span-8">
              <Input
                value={formData.deliveryType}
                onChange={(e) =>
                  handleFieldChange("deliveryType", e.target.value)
                }
              />
            </div>
          </div>

          {/* Ref Date */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Ref.Date</Label>
            </div>
            <div className="col-span-8">
              <DateInput
                value={formData.refDate}
                onChange={(e) => handleFieldChange("refDate", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* === MIDDLE COLUMN (Details) === */}
        <div className="col-span-4 space-y-1">
          {/* Voucher No */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Voucher No</Label>
            </div>
            <div className="col-span-8">
              <Input
                value={formData.voucherNo}
                onChange={(e) => handleFieldChange("voucherNo", e.target.value)}
              />
            </div>
          </div>

          {/* Date */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Date</Label>
            </div>
            <div className="col-span-8">
              <DateInput
                value={formData.orderDate}
                onChange={(e) => handleFieldChange("orderDate", e.target.value)}
              />
            </div>
          </div>

          {/* Customer */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label required>Customer</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Input value="" placeholder="Find by name/email/phone" />
                <ActionBtn icon={<Search size={16} />} />
              </InputGroup>
            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN (Address & Details) === */}
        <div className="col-span-4 flex flex-col min-h-full">
          {/* Customer Accordion */}
          <AccordionSection
            title="Customer"
            isOpen={isCustomerOpen}
            onToggle={() => setIsCustomerOpen(!isCustomerOpen)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-sm text-gray-700">
              <div className="flex gap-2">
                <span className="font-medium">Name:</span>
                <span>AMIT</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium">Last Visit:</span>
                <span>12-07-2025</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium">Bill Amount:</span>
                <span>258</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium">Phone:</span>
                <span>9140712317</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium">O/S:</span>
                <span>₹0.00</span>
              </div>
            </div>
          </AccordionSection>

          {/* Bill To Accordion */}
          <AccordionSection
            title="Bill To"
            isOpen={isBillToOpen}
            onToggle={() => setBillToOpen(!isBillToOpen)}
          >
            <textarea
              placeholder="Billing Address..."
              className="w-full h-24 border border-gray-300 rounded text-[13px] p-2 resize-none focus:ring-1 focus:border-[var(--theme-focus)] outline-none"
            />
          </AccordionSection>

          {/* Ship To Accordion */}
          <AccordionSection
            title="Ship To"
            isOpen={isShipToOpen}
            onToggle={() => setShipToOpen(!isShipToOpen)}
          >
            <div className="relative mb-2">
              <textarea
                placeholder="Shipping Address..."
                className="w-full h-24 border border-gray-300 rounded text-[13px] p-2 resize-none focus:ring-1 focus:border-[var(--theme-focus)] outline-none"
              />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-16 text-[13px] text-gray-600 shrink-0">
                State
              </span>
              <div className="w-full">
                <InputGroup>
                  <Dropdown
                    data={mockData.states}
                    columns={codeNameColumns}
                    value={formData.state}
                    valueKey="name"
                    onChange={(item) =>
                      handleFieldChange("state", item?.name || "")
                    }
                    placeholder="Select State..."
                  />
                  <ActionBtn
                    icon={<EditIcon size={16} />}
                    onClick={() => setIsStateOpen(true)}
                  />
                </InputGroup>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-16 text-[13px] text-gray-600 shrink-0">
                City
              </span>
              <div className="flex-grow w-full">
                <Input
                  value={formData.city}
                  onChange={(e) => handleFieldChange("city", e.target.value)}
                  placeholder="Enter City"
                />
              </div>
            </div>
          </AccordionSection>
        </div>
      </div>
    </div>
  );
};

export default POSOrderForm;
