import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  EditIcon,
  CreditCard,
  Minimize2,
  ExternalLink,
} from "lucide-react";

// Assuming these components exist in your project based on your code
import Dropdown, { ColumnDef } from "../../../../components/Dropdown";
import Transporter from "../../../../components/Transporter";
import DateInput from "../../../../components/DateInput";
import PaymentType from "../../../../components/PaymentType"; // Import the Modal

// --- 1. Define Updated Data Interface (Matches Screenshot) ---

export interface LogisticsData {
  // Left Column
  dispatchFrom: string;
  destination: string;
  shippingMode: string;
  shippingCompany: string;
  shippingCompanyAddress: string;
  shippingTrackingNo: string;
  shippingDate: string;
  shippingCharges: string;
  vehicleNo: string;
  chargeType: string;
  documentThrough: string;

  // Middle Column
  portOfLanding: string;
  portOfDischarge: string;
  noOfPackets: string;
  weight: string;
  distance: string;
  eWayInvoiceNo: string;
  eWayInvoiceDate: string;
  eWayCancelDate: string;
  irnNo: string;
  qrCode: string;
  irnCancelDate: string;
  irnCancelReason: string;
  acknowledgementNo: string;
  acknowledgementDate: string;

  // Right Column (OverHead Expenses)
  customDuty: string;
  customDutyTender: string;

  chaPayment: string;
  chaPaymentTender: string;

  freight: string;
  freightTender: string;

  insurance: string;
  insuranceTender: string;

  handling: string;
  handlingTender: string;

  documentationCharges: string;
  documentationChargesTender: string;

  bankCharges: string;
  bankChargesTender: string;

  customExpenses: string;
  customExpensesTender: string;

  loadingUnloading: string;
  loadingUnloadingTender: string;

  otherCharges: string;
  otherChargesTender: string;
}

// --- 2. Props ---
interface LogisticsProps {
  themeColor?: string;
  data: LogisticsData;
  onChange: (data: LogisticsData) => void;
}

// --- 3. Static Data (Replaces Service) ---
const STATIC_TRANSPORTERS = [
  { code: "T001", name: "FedEx Logistics" },
  { code: "T002", name: "DHL Express" },
  { code: "T003", name: "Blue Dart" },
  { code: "T004", name: "DTDC" },
];

const STATIC_LOCATIONS = [
  { code: "LOC1", name: "Mumbai Warehouse" },
  { code: "LOC2", name: "Delhi Hub" },
  { code: "LOC3", name: "Chennai Port" },
];

// --- Reusable UI Components ---

const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({
  children,
  required,
}) => (
  <label className="text-[13px] text-gray-700 font-medium flex items-center h-[30px] whitespace-nowrap">
    {children} {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => (
  <input
    className={`w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)] disabled:bg-gray-50 ${
      props.className || ""
    }`}
    {...props}
  />
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (
  props
) => (
  <textarea
    className={`w-full bg-white border border-gray-300 rounded-sm px-2 py-1 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)] resize-none ${
      props.className || ""
    }`}
    {...props}
  />
);

const Select: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: string[];
    placeholder?: string;
  }
> = ({ options, placeholder, ...props }) => (
  <div className="relative w-full">
    <select
      className={`w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)] appearance-none ${
        props.className || ""
      }`}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
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

const ActionBtn: React.FC<{
  icon: React.ReactNode;
  onClick?: () => void;
  title?: string;
}> = ({ icon, onClick, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className="h-[30px] w-[30px] bg-[var(--theme-primary)] text-white flex items-center justify-center rounded-sm border border-[var(--theme-primary)] hover:opacity-90 transition-opacity flex-shrink-0 shadow-sm"
  >
    {icon}
  </button>
);

// --- Updated Expense Row (Uses PaymentType Modal) ---
const ExpenseRow: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  tenderValue: string;
  onTenderChange: (val: string) => void;
  highlight?: boolean; // Added Highlight support
}> = ({ label, value, onChange, tenderValue, highlight }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className={`flex items-center border-b border-gray-100 last:border-0 h-[30px] ${
        highlight ? "bg-blue-50/50" : ""
      }`}
    >
      {/* Label */}
      <div className="flex-1 pl-2">
        <span
          className={`text-[13px] text-gray-700 ${
            highlight ? "font-medium" : ""
          }`}
        >
          {label}
        </span>
      </div>

      {/* Tender Type Trigger */}
      <div className="w-[100px] h-full border-l border-gray-200">
        <div
          className="w-full h-full flex items-center justify-between px-2 cursor-pointer hover:bg-gray-50 transition-colors group"
          onClick={() => setIsModalOpen(true)}
        >
          <span
            className={`text-[11px] truncate ${
              tenderValue ? "text-gray-700" : "text-gray-400"
            }`}
          >
            {tenderValue || "Select..."}
          </span>
          <CreditCard
            size={10}
            className="text-gray-400 group-hover:text-blue-500"
          />
        </div>

        {/* Payment Type Modal */}
        {isModalOpen && (
          <PaymentType
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            totalAmount={Number(value) || 0}
            zIndex={1050}
            // Add callback: onConfirm={(val) => { onTenderChange(val); setIsModalOpen(false); }}
          />
        )}
      </div>

      {/* Amount Input */}
      <div className="w-[100px] h-full border-l border-gray-200">
        <input
          type="text"
          className="w-full h-full px-2 text-right text-[13px] outline-none bg-transparent"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="₹0.00"
        />
      </div>
    </div>
  );
};

// --- Summary Input Group (For Summary View) with PaymentType Popup ---
const SummaryInputGroup: React.FC<{
  label: string;
  amount: string;
  setAmount: (val: string) => void;
  tender: string;
  setTender: (val: string) => void;
}> = ({ label, amount, setAmount, tender }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <div className="flex h-[30px]">
        {/* Tender Trigger */}
        <div className="relative w-[90px] bg-white border border-r-0 border-gray-300 rounded-l-sm">
          <div
            className="w-full h-full flex items-center justify-between px-2 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            <span
              className={`text-[11px] truncate ${
                tender ? "text-gray-700" : "text-gray-400"
              }`}
            >
              {tender || "Type..."}
            </span>
            <CreditCard size={10} className="text-gray-400" />
          </div>

          {/* PaymentType Popup */}
          {isModalOpen && (
            <PaymentType
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              totalAmount={Number(amount) || 0}
              zIndex={1050}
              // onConfirm={(val) => { setTender(val); setIsModalOpen(false); }}
            />
          )}
        </div>

        {/* Amount Input */}
        <input
          type="number"
          placeholder="0.00"
          className="flex-1 min-w-0 w-full h-full bg-white border border-gray-300 rounded-r-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)]"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
    </div>
  );
};

// --- Main Component ---

const PurchaseReturnLogistic: React.FC<LogisticsProps> = ({
  data,
  onChange,
  themeColor = "#0f3c63",
}) => {
  const [isOpen, setIsOpen] = useState(true);
  // View State: False = Summary (3 fields), True = Expanded (Full Form)
  const [isExpanded, setIsExpanded] = useState(false);
  const [transporterModalOpen, setTransporterModalOpen] = useState(false);

  // Theme styles
  const themeStyles = {
    "--theme-primary": themeColor,
    "--theme-focus": "#60a5fa",
  } as React.CSSProperties;

  const shippingModes = ["Road", "Air", "Sea", "Rail"];
  const chargeTypes = ["Paid", "To Pay", "Free"];

  // Column Definitions for Dropdowns
  const nameColumns: ColumnDef<any>[] = [
    { header: "Name", key: "name", width: "flex-1" },
  ];
  const transporterColumns: ColumnDef<any>[] = [
    { header: "Code", key: "code", width: "w-20" },
    { header: "Name", key: "name", width: "flex-1" },
  ];

  const handleChange = (field: keyof LogisticsData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleTransporterSelect = (item: any) => {
    onChange({
      ...data,
      shippingCompany: item?.name || "",
    });
  };

  const handleDispatchSelect = (item: any) => {
    onChange({
      ...data,
      dispatchFrom: item?.name || "",
    });
  };

  const handleEditTransporter = () => {
    setTransporterModalOpen(true);
  };

  return (
    <div
      style={themeStyles}
      className="w-full bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden mb-4"
    >
      {/* Accordion Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FileText className="text-[var(--theme-primary)]" size={18} />
          <h3 className="text-[var(--theme-primary)] font-semibold text-sm">
            Logistics
          </h3>
        </div>

        <div className="flex items-center gap-4">
          {/* View Toggle Button (Only visible if Accordion is Open) */}
          {isOpen && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              {isExpanded ? (
                <>
                  <Minimize2 size={12} /> Collapse View
                </>
              ) : (
                <>
                  <ExternalLink size={12} /> Expand / View Details
                </>
              )}
            </button>
          )}

          {/* Accordion Arrow */}
          <div
            className="text-gray-500 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-5 border-t border-gray-100">
          {/* === MODE 1: SUMMARY VIEW === */}
          {!isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-md border border-gray-100 animate-in fade-in duration-300">
              <SummaryInputGroup
                label="Freight Charge"
                amount={data.freight}
                setAmount={(v) => handleChange("freight", v)}
                tender={data.freightTender}
                setTender={(v) => handleChange("freightTender", v)}
              />
              <SummaryInputGroup
                label="Loading/Unloading"
                amount={data.loadingUnloading}
                setAmount={(v) => handleChange("loadingUnloading", v)}
                tender={data.loadingUnloadingTender}
                setTender={(v) => handleChange("loadingUnloadingTender", v)}
              />
              <SummaryInputGroup
                label="Other Charges"
                amount={data.otherCharges}
                setAmount={(v) => handleChange("otherCharges", v)}
                tender={data.otherChargesTender}
                setTender={(v) => handleChange("otherChargesTender", v)}
              />
            </div>
          )}

          {/* === MODE 2: EXPANDED VIEW === */}
          {isExpanded && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* === LEFT COLUMN: Shipping Details === */}
              <div className="space-y-1">
                {/* Dispatch From */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>Dispatch From</Label>
                  </div>
                  <div className="col-span-8 flex gap-1">
                    <Dropdown
                      data={STATIC_LOCATIONS}
                      columns={nameColumns}
                      value={data.dispatchFrom}
                      valueKey="name"
                      placeholder="Select..."
                      onChange={handleDispatchSelect}
                    />
                    <ActionBtn icon={<EditIcon size={14} />} />
                  </div>
                </div>

                {/* Destination */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>Destination</Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={data.destination}
                      onChange={(e) =>
                        handleChange("destination", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Shipping Mode */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>Shipping Mode</Label>
                  </div>
                  <div className="col-span-8">
                    <Select
                      options={shippingModes}
                      value={data.shippingMode}
                      onChange={(e) =>
                        handleChange("shippingMode", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Shipping Company */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>Shipping Company</Label>
                  </div>
                  <div className="col-span-8 flex gap-1">
                    <Dropdown
                      data={STATIC_TRANSPORTERS}
                      columns={transporterColumns}
                      value={data.shippingCompany}
                      valueKey="name"
                      onChange={handleTransporterSelect}
                      placeholder="Select..."
                    />
                    <ActionBtn
                      icon={<EditIcon size={14} />}
                      onClick={handleEditTransporter}
                    />
                  </div>
                </div>

                {/* Shipping Company Address (TextArea) */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>Shipping Company Address/Ph...</Label>
                  </div>
                  <div className="col-span-8">
                    <TextArea
                      rows={4}
                      value={data.shippingCompanyAddress}
                      onChange={(e) =>
                        handleChange("shippingCompanyAddress", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Shipping Tracking No */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>Shipping Tracking No</Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={data.shippingTrackingNo}
                      onChange={(e) =>
                        handleChange("shippingTrackingNo", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Shipping Date */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>Shipping Date</Label>
                  </div>
                  <div className="col-span-8">
                    <DateInput
                      value={data.shippingDate}
                      onChange={(e) =>
                        handleChange("shippingDate", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Shipping Charges */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>Shipping Charges</Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      type="number"
                      value={data.shippingCharges}
                      onChange={(e) =>
                        handleChange("shippingCharges", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Vehicle/Vessel No */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>Vehicle/Vessel No</Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={data.vehicleNo}
                      onChange={(e) =>
                        handleChange("vehicleNo", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Charge Type */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>Charge Type</Label>
                  </div>
                  <div className="col-span-8">
                    <Select
                      options={chargeTypes}
                      value={data.chargeType}
                      onChange={(e) =>
                        handleChange("chargeType", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Document Through */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>Document Through</Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={data.documentThrough}
                      onChange={(e) =>
                        handleChange("documentThrough", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* === MIDDLE COLUMN: Port & Packet Details === */}
              <div className="space-y-1">
                {/* Port of Landing */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>Port of Landing</Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={data.portOfLanding}
                      onChange={(e) =>
                        handleChange("portOfLanding", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Port of Discharge */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>Port of Discharge</Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={data.portOfDischarge}
                      onChange={(e) =>
                        handleChange("portOfDischarge", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* No of Packets */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>No of Packets</Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      type="number"
                      value={data.noOfPackets}
                      onChange={(e) =>
                        handleChange("noOfPackets", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Weight */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>Weight</Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={data.weight}
                      onChange={(e) => handleChange("weight", e.target.value)}
                    />
                  </div>
                </div>

                {/* Distance */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>Distance</Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={data.distance}
                      onChange={(e) => handleChange("distance", e.target.value)}
                    />
                  </div>
                </div>

                {/* eWay Invoice No */}
                <div className="grid grid-cols-12 gap-2 mt-2">
                  <div className="col-span-4">
                    <Label>eWay Invoice No</Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={data.eWayInvoiceNo}
                      onChange={(e) =>
                        handleChange("eWayInvoiceNo", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* eWay Invoice Date */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>eWay Invoice Date</Label>
                  </div>
                  <div className="col-span-8">
                    <DateInput
                      value={data.eWayInvoiceDate}
                      onChange={(e) =>
                        handleChange("eWayInvoiceDate", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* eWay Cancel Date */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>eWay Cancel Date</Label>
                  </div>
                  <div className="col-span-8">
                    <DateInput
                      value={data.eWayCancelDate}
                      onChange={(e) =>
                        handleChange("eWayCancelDate", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* IRN No */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>IRN No</Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={data.irnNo}
                      onChange={(e) => handleChange("irnNo", e.target.value)}
                    />
                  </div>
                </div>

                {/* QR Code */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>QR Code</Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={data.qrCode}
                      onChange={(e) => handleChange("qrCode", e.target.value)}
                    />
                  </div>
                </div>

                {/* IRN Cancel Date */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>IRN Cancel Date</Label>
                  </div>
                  <div className="col-span-8">
                    <DateInput
                      value={data.irnCancelDate}
                      onChange={(e) =>
                        handleChange("irnCancelDate", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* IRN Cancel Reason */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>IRN Cancel Reason</Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={data.irnCancelReason}
                      onChange={(e) =>
                        handleChange("irnCancelReason", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Acknowledgement No */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>Acknowledgement No</Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={data.acknowledgementNo}
                      onChange={(e) =>
                        handleChange("acknowledgementNo", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Acknowledgement Date */}
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label>Acknowledgement Date</Label>
                  </div>
                  <div className="col-span-8">
                    <DateInput
                      value={data.acknowledgementDate}
                      onChange={(e) =>
                        handleChange("acknowledgementDate", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* === RIGHT COLUMN: Overhead Expense Table === */}
              <div className="space-y-0">
                {/* Fetch From Last Bill Button */}
                <div className="flex justify-end mb-1">
                  <button
                    className="bg-[var(--theme-primary)] text-white text-[10px] px-2 py-1 rounded-sm"
                    onClick={() => {}}
                  >
                    FetchFromLastBill
                  </button>
                </div>

                <div className="border border-gray-300 rounded-sm overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-slate-400/80 text-white text-xs font-semibold px-3 py-2 text-center uppercase tracking-wide flex justify-between">
                    <span className="flex-1 text-left">Expense</span>
                    <span className="w-[100px] text-center">Tender</span>
                    <span className="w-[100px] text-right">Amount</span>
                  </div>

                  {/* Expense Rows */}
                  <div className="bg-white">
                    <ExpenseRow
                      label="Custom Duty"
                      value={data.customDuty}
                      onChange={(v) => handleChange("customDuty", v)}
                      tenderValue={data.customDutyTender}
                      onTenderChange={(v) =>
                        handleChange("customDutyTender", v)
                      }
                    />
                    <ExpenseRow
                      label="CHA Payment"
                      value={data.chaPayment}
                      onChange={(v) => handleChange("chaPayment", v)}
                      tenderValue={data.chaPaymentTender}
                      onTenderChange={(v) =>
                        handleChange("chaPaymentTender", v)
                      }
                    />
                    <ExpenseRow
                      label="Freight"
                      value={data.freight}
                      onChange={(v) => handleChange("freight", v)}
                      tenderValue={data.freightTender}
                      onTenderChange={(v) => handleChange("freightTender", v)}
                      highlight // Added Highlight
                    />
                    <ExpenseRow
                      label="Insurance"
                      value={data.insurance}
                      onChange={(v) => handleChange("insurance", v)}
                      tenderValue={data.insuranceTender}
                      onTenderChange={(v) => handleChange("insuranceTender", v)}
                    />
                    <ExpenseRow
                      label="Handelling"
                      value={data.handling}
                      onChange={(v) => handleChange("handling", v)}
                      tenderValue={data.handlingTender}
                      onTenderChange={(v) => handleChange("handlingTender", v)}
                    />
                    <ExpenseRow
                      label="Documentation Charges"
                      value={data.documentationCharges}
                      onChange={(v) => handleChange("documentationCharges", v)}
                      tenderValue={data.documentationChargesTender}
                      onTenderChange={(v) =>
                        handleChange("documentationChargesTender", v)
                      }
                    />
                    <ExpenseRow
                      label="Bank Charges"
                      value={data.bankCharges}
                      onChange={(v) => handleChange("bankCharges", v)}
                      tenderValue={data.bankChargesTender}
                      onTenderChange={(v) =>
                        handleChange("bankChargesTender", v)
                      }
                    />
                    <ExpenseRow
                      label="Custom Expenses"
                      value={data.customExpenses}
                      onChange={(v) => handleChange("customExpenses", v)}
                      tenderValue={data.customExpensesTender}
                      onTenderChange={(v) =>
                        handleChange("customExpensesTender", v)
                      }
                    />
                    <ExpenseRow
                      label="Loading/Unloading"
                      value={data.loadingUnloading}
                      onChange={(v) => handleChange("loadingUnloading", v)}
                      tenderValue={data.loadingUnloadingTender}
                      onTenderChange={(v) =>
                        handleChange("loadingUnloadingTender", v)
                      }
                      highlight // Added Highlight
                    />
                    <ExpenseRow
                      label="Other Charges"
                      value={data.otherCharges}
                      onChange={(v) => handleChange("otherCharges", v)}
                      tenderValue={data.otherChargesTender}
                      onTenderChange={(v) =>
                        handleChange("otherChargesTender", v)
                      }
                      highlight // Added Highlight
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal for Transporter (Static Dummy) */}
      {transporterModalOpen && (
        <Transporter
          isOpen={transporterModalOpen}
          onClose={() => setTransporterModalOpen(false)}
          initialData={null}
          onSuccess={() => setTransporterModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PurchaseReturnLogistic;
