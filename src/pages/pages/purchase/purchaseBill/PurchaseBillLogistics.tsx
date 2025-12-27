import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileText, EditIcon } from "lucide-react";
import Dropdown, { ColumnDef } from "../../../../components/Dropdown";
import Transporter from "../../../../components/Transporter";
import DateInput from "../../../../components/DateInput";

export interface LogisticsData {
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

  portOfLanding: string;
  portOfDischarge: string;
  portAddressForEway: string;
  portStateForEway: string;
  noOfPackets: string;
  weight: string;

  customDuty: string;
  chaPayment: string;
  freight: string;
  insurance: string;
  handling: string;
  documentationCharges: string;
  bankCharges: string;
  customExpenses: string;
  loadingUnloading: string;
  otherCharges: string;
}

interface LogisticsProps {
  themeColor?: string;
  data: LogisticsData;
  onChange: (data: LogisticsData) => void;
}

const STATIC_TRANSPORTERS = [
  { code: "T001", name: "FedEx Logistics" },
  { code: "T002", name: "DHL Express" },
  { code: "T003", name: "Blue Dart" },
  { code: "T004", name: "DTDC" },
];

const STATIC_STATES = [
  { code: "MH", name: "Maharashtra" },
  { code: "DL", name: "Delhi" },
  { code: "KA", name: "Karnataka" },
  { code: "TN", name: "Tamil Nadu" },
];

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

// --- Helper for Expense Rows ---
const ExpenseRow: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
}> = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between border-b border-gray-100 last:border-0 h-[30px]">
    <span className="text-[13px] text-gray-700 pl-2">{label}</span>
    <div className="w-[120px] h-full border-l border-gray-200">
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

// --- Main Component ---

const PurchaseBillLogistics: React.FC<LogisticsProps> = ({
  data,
  onChange,
  themeColor = "#0f3c63",
}) => {
  const [isOpen, setIsOpen] = useState(true);
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

  const handleStateSelect = (item: any) => {
    onChange({
      ...data,
      portStateForEway: item?.name || "",
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
      <div
        className="flex items-center justify-between px-4 py-3 bg-white cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <FileText className="text-[var(--theme-primary)]" size={18} />
          <h3 className="text-[var(--theme-primary)] font-semibold text-sm">
            Logistics
          </h3>
        </div>
        <div className="text-gray-500">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-5 border-t border-gray-100">
          {/* 3 Column Layout to match Screenshot */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* === LEFT COLUMN: Shipping Details === */}
            <div className="space-y-1">
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
                    onChange={(e) => handleChange("vehicleNo", e.target.value)}
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
                    onChange={(e) => handleChange("chargeType", e.target.value)}
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

              {/* Port Address For Eway (TextArea) */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Port Address For Eway</Label>
                </div>
                <div className="col-span-8">
                  <TextArea
                    rows={4}
                    value={data.portAddressForEway}
                    onChange={(e) =>
                      handleChange("portAddressForEway", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Port State For Eway */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Port State For Eway</Label>
                </div>
                <div className="col-span-8 flex gap-1">
                  <Dropdown
                    data={STATIC_STATES}
                    columns={nameColumns}
                    value={data.portStateForEway}
                    valueKey="name"
                    onChange={handleStateSelect}
                    placeholder="Select..."
                  />
                  <ActionBtn icon={<EditIcon size={14} />} />
                </div>
              </div>

              {/* No of Packets */}
              <div className="grid grid-cols-12 gap-2 mt-4">
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
            </div>

            {/* === RIGHT COLUMN: Overhead Expense Table === */}
            <div className="space-y-0">
              <div className="border border-gray-300 rounded-sm overflow-hidden">
                {/* Table Header */}
                <div className="bg-slate-400/80 text-white text-xs font-semibold px-3 py-2 text-center uppercase tracking-wide">
                  OverHead Expense
                </div>

                {/* Expense Rows */}
                <div className="bg-white">
                  <ExpenseRow
                    label="Custom Duty"
                    value={data.customDuty}
                    onChange={(v) => handleChange("customDuty", v)}
                  />
                  <ExpenseRow
                    label="CHA Payment"
                    value={data.chaPayment}
                    onChange={(v) => handleChange("chaPayment", v)}
                  />
                  <ExpenseRow
                    label="Freight"
                    value={data.freight}
                    onChange={(v) => handleChange("freight", v)}
                  />
                  <ExpenseRow
                    label="Insurance"
                    value={data.insurance}
                    onChange={(v) => handleChange("insurance", v)}
                  />
                  <ExpenseRow
                    label="Handelling"
                    value={data.handling}
                    onChange={(v) => handleChange("handling", v)}
                  />
                  <ExpenseRow
                    label="Documentation Charges"
                    value={data.documentationCharges}
                    onChange={(v) => handleChange("documentationCharges", v)}
                  />
                  <ExpenseRow
                    label="Bank Charges"
                    value={data.bankCharges}
                    onChange={(v) => handleChange("bankCharges", v)}
                  />
                  <ExpenseRow
                    label="Custom Expenses"
                    value={data.customExpenses}
                    onChange={(v) => handleChange("customExpenses", v)}
                  />
                  <ExpenseRow
                    label="Loading/Unloading"
                    value={data.loadingUnloading}
                    onChange={(v) => handleChange("loadingUnloading", v)}
                  />
                  <ExpenseRow
                    label="Other Charges"
                    value={data.otherCharges}
                    onChange={(v) => handleChange("otherCharges", v)}
                  />
                </div>
              </div>
            </div>
          </div>
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

export default PurchaseBillLogistics;
