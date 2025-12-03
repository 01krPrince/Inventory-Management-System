import React, { useState } from "react";
import { CalenderIcon } from "../../../../components/icons";
import DocumentInventoryModal from "../../../../components/DocumentCategoryInventory";
import { LocationMaster } from "../../../../components/LocationMaster";
// Added Plus icon for the "Create" button
import { EditIcon, ArrowLeft, Plus } from "lucide-react";
import ChartOfAccounts, {
  AccountFormData,
} from "../../../../components/ChartOfAccount";

// --- Types ---
interface MockData {
  gstTypes: string[];
  creditTypes: string[];
  stores: string[];
  customers: { name: string; underGroup: string; code: string }[];
  priceCategories: string[];
  salesmen: string[];
  taxOptions: string[];
  shipToOptions: string[];
  paymentTerms: string[];
  paymentLinks: string[];
}

interface ActionBtnProps {
  icon: React.ReactElement;
  onClick?: () => void; // Added onClick to interface
  className?: string; // Added className for styling flexibility
}

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
  options: { label: string; value: string }[] | string[]; // Updated to support object array
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Added onChange
}

// --- Mock Data ---
const mockData: MockData = {
  gstTypes: ["BillOfSupply", "GST Invoice", "Export"],
  creditTypes: ["Credit", "Cash"],
  stores: ["SPORTS HUB", "TECH WORLD", "FASHION POINT"],
  customers: [
    {
      name: "John Doe",
      underGroup: "Retail",
      code: "CUST001",
    },
    {
      name: "Jane Smith",
      underGroup: "Wholesale",
      code: "CUST002",
    },
    {
      name: "Acme Corp",
      underGroup: "Corporate",
      code: "CUST003",
    },
  ],
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

// Updated Select to handle objects, strings, and onChange events
const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select...",
  value,
  onChange,
}) => (
  <div className="relative w-full">
    <select
      className="w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)] appearance-none"
      value={value}
      onChange={onChange}
      defaultValue={!value ? "" : undefined} // handle default if controlled
    >
      <option value="" disabled>
        {placeholder}
      </option>

      {options.map((opt) => {
        const isString = typeof opt === "string";
        const val = isString ? opt : opt.value;
        const lab = isString ? opt : opt.label;
        return (
          <option key={val} value={val}>
            {lab}
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
    className={`h-[30px] w-[30px] bg-[var(--theme-primary)] text-white flex items-center justify-center rounded-sm border border-[var(--theme-primary)] hover:opacity-90 transition-opacity z-10 ${className}`}
  >
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
  onOverlayChange,
}) => {
  const themeStyles = {
    "--theme-primary": themeColor,
    "--theme-focus": "#60a5fa",
  } as React.CSSProperties;

  // --- States ---
  const [documentInventoryModalCompo, setDocumentInventoryModalCompo] =
    useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false); // Used for LocationMaster

  // Chart of Accounts States
  const [showChartOfAccounts, setShowChartOfAccounts] = useState(false);
  const [coaFormData, setCoaFormData] = useState<AccountFormData | null>(null);
  const [selectedGL, setSelectedGL] = useState<string>("");

  // --- Handlers ---

  const handleDocumentInventoryModal = () => {
    setDocumentInventoryModalCompo(true);
  };

  const handleAddNewLocation = () => {
    setIsFormOpen(true);
    if (onOverlayChange) onOverlayChange(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    if (onOverlayChange) onOverlayChange(false);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
  };

  // 1. Create New GL Account
  const handleCreateGL = () => {
    setCoaFormData(null); // Ensure data is null for "Create" mode
    setShowChartOfAccounts(true);
  };

  // 2. Edit Selected GL Account
  const handleEditGL = () => {
    if (!selectedGL) {
      alert("Please select an account to edit first.");
      return;
    }

    // Find the mock data object
    const account = mockData.customers.find((c) => c.code === selectedGL);

    if (account) {
      // Map mock data to the AccountFormData structure required by the component
      const dataToEdit: AccountFormData = {
        id: account.code,
        name: account.name,
        code: account.code,
        underGroup: account.underGroup,
        // Defaulting other required fields since mock data is simple
        identification: "",
        isSubledger: false,
        type: "General",
        accountNo: "",
        rtgsIfsc: "",
        classification: "",
        isLoanAccount: false,
        tdsApplicable: false,
        address: "",
        pan: "",
        attrEmployee: false,
        attrGroup: false,
      };
      setCoaFormData(dataToEdit);
      setShowChartOfAccounts(true);
    }
  };

  const handleSaveGL = (data: AccountFormData) => {
    console.log("Saved GL Data:", data);
    // Here you would typically update your state/backend
    setShowChartOfAccounts(false);
  };

  // If LocationMaster form is open
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
        <LocationMaster
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      </div>
    );
  }

  const customerOptions = mockData.customers.map((customer) => ({
    label: `${customer.name} | ${customer.underGroup} | ${customer.code}`,
    value: customer.code,
  }));

  // --- Render ---
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
                  <ActionBtn
                    icon={<EditIcon size={16} />}
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
                  <Select options={customerOptions} placeholder="Select..." />
                  <ActionBtn
                    icon={<EditIcon size={16} />}
                    onClick={handleAddNewLocation}
                  />
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

            {/* PostingGL (UPDATED SECTION) */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>PostingGL </Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Select
                    options={customerOptions}
                    placeholder="Select customer..."
                    value={selectedGL}
                    onChange={(e) => setSelectedGL(e.target.value)}
                  />

                  {/* Button 1: Create New */}
                  <ActionBtn
                    icon={<Plus size={16} />}
                    onClick={handleCreateGL}
                    className="mr-0"
                  />

                  {/* Button 2: Edit Selected */}
                  <ActionBtn
                    icon={<EditIcon size={16} />}
                    onClick={handleEditGL}
                  />
                </InputGroup>
              </div>
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

        {/* CHART OF ACCOUNTS MODAL (NEW) */}
        <ChartOfAccounts
          isOpen={showChartOfAccounts}
          onClose={() => setShowChartOfAccounts(false)}
          initialData={coaFormData}
          onSave={handleSaveGL}
        />
      </div>
    </>
  );
};

export default StockAdjustmentForm;
