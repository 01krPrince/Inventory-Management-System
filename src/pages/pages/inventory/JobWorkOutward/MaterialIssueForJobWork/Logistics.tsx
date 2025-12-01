import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  FileText,
  Edit2,
} from "lucide-react";

// --- Reusable UI Components (Local for self-containment) ---

interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
}

const Label: React.FC<LabelProps> = ({ children, required }) => (
  <label className="text-[13px] text-gray-700 font-medium flex items-center h-[30px] whitespace-nowrap">
    {children} {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input: React.FC<InputProps> = ({ className = "", ...props }) => (
  <input
    className={`w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 disabled:bg-gray-50 ${className}`}
    {...props}
  />
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (
  props
) => (
  <textarea
    className="w-full bg-white border border-gray-300 rounded-sm px-2 py-1 text-[13px] text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
    rows={3}
    {...props}
  />
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder,
  className = "",
  ...props
}) => (
  <div className="relative w-full">
    <select
      className={`w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 appearance-none ${className}`}
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
    {/* Dropdown Icon */}
    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
      <svg width="8" height="6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 10l5 5 5-5z" />
      </svg>
    </div>
  </div>
);

const DateInput: React.FC<{ value?: string }> = ({ value }) => (
  <div className="relative w-full h-[30px]">
    <input
      type="text"
      defaultValue={value}
      className="w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 pr-8"
    />
    <button className="absolute right-0 top-0 h-full w-8 flex items-center justify-center bg-gray-100 rounded-r-sm border-l border-gray-300 hover:bg-gray-200 transition-colors text-gray-600">
      <Calendar size={14} />
    </button>
  </div>
);

const ActionBtn: React.FC<{ icon: React.ReactNode; onClick?: () => void }> = ({
  icon,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="h-[30px] w-[30px] bg-[#0f3c63] text-white flex items-center justify-center rounded-sm hover:opacity-90 transition-opacity flex-shrink-0"
  >
    {icon}
  </button>
);

// --- Main Component ---

const Logistics: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  // Mock data for dropdowns
  const shippingModes = ["Road", "Air", "Sea", "Rail"];
  const chargeTypes = ["Paid", "To Pay", "Free"];
  const shippingCompanies = ["DHL", "FedEx", "BlueDart", "Delhivery"];

  return (
    <div className="w-full bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden mb-4">
      {/* Accordion Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-white cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <FileText className="text-[#0f3c63]" size={18} />
          <h3 className="text-[#0f3c63] font-semibold text-sm">Logistics</h3>
        </div>
        <div className="text-gray-500">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-5 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {/* LEFT COLUMN */}
            <div className="space-y-1">
              {/* Destination */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Destination</Label>
                </div>
                <div className="col-span-8">
                  <Input />
                </div>
              </div>

              {/* Shipping Mode */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Shipping Mode</Label>
                </div>
                <div className="col-span-8">
                  <Select options={shippingModes} defaultValue="Road" />
                </div>
              </div>

              {/* Shipping Company */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Shipping Company</Label>
                </div>
                <div className="col-span-8 flex gap-1">
                  <Select options={shippingCompanies} placeholder="Select..." />
                  <ActionBtn icon={<Edit2 size={14} />} />
                </div>
              </div>

              {/* Shipping Company Address */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Shipping Company Address/P...</Label>
                </div>
                <div className="col-span-8">
                  <TextArea />
                </div>
              </div>

              {/* Shipping Tracking No */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Shipping Tracking No</Label>
                </div>
                <div className="col-span-8">
                  <Input />
                </div>
              </div>

              {/* Shipping Date */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Shipping Date</Label>
                </div>
                <div className="col-span-8">
                  <DateInput value="01/12/2025" />
                </div>
              </div>

              {/* Shipping Charges */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Shipping Charges</Label>
                </div>
                <div className="col-span-8">
                  <Input defaultValue="0" />
                </div>
              </div>

              {/* Vehicle/Vessel No */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Vehicle/Vessel No</Label>
                </div>
                <div className="col-span-8">
                  <Input />
                </div>
              </div>

              {/* Charge Type */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Charge Type</Label>
                </div>
                <div className="col-span-8">
                  <Select options={chargeTypes} defaultValue="Paid" />
                </div>
              </div>

              {/* Document Through */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Document Through</Label>
                </div>
                <div className="col-span-8">
                  <Input />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-1">
              {/* No of Packts */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>No of Packts</Label>
                </div>
                <div className="col-span-8">
                  <Input defaultValue="0" />
                </div>
              </div>

              {/* Weight */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Weight</Label>
                </div>
                <div className="col-span-8">
                  <Input defaultValue="0" />
                </div>
              </div>

              {/* Distance */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Distance</Label>
                </div>
                <div className="col-span-8">
                  <Input defaultValue="0" />
                </div>
              </div>

              {/* eWay Invoice No */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>eWay Invoice No</Label>
                </div>
                <div className="col-span-8">
                  <Input />
                </div>
              </div>

              {/* eWay Invoice Date */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>eWay Invoice Date</Label>
                </div>
                <div className="col-span-8">
                  <DateInput value="01/12/2025" />
                </div>
              </div>

              {/* eWay Cancel Date */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>eWay Cancel Date</Label>
                </div>
                <div className="col-span-8">
                  <DateInput />
                </div>
              </div>

              {/* IRN No */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>IRN No</Label>
                </div>
                <div className="col-span-8">
                  <Input />
                </div>
              </div>

              {/* QR Code */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>QR Code</Label>
                </div>
                <div className="col-span-8">
                  <Input />
                </div>
              </div>

              {/* IRN Cancel Date */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>IRN Cancel Date</Label>
                </div>
                <div className="col-span-8">
                  <DateInput />
                </div>
              </div>

              {/* IRN Cancel Reason */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>IRN Cancel Reason</Label>
                </div>
                <div className="col-span-8">
                  <Input />
                </div>
              </div>

              {/* Acknowledgement No */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Acknowledgement No</Label>
                </div>
                <div className="col-span-8">
                  <Input />
                </div>
              </div>

              {/* Acknowledgement Date */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Acknowledgement Date</Label>
                </div>
                <div className="col-span-8">
                  <DateInput />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logistics;
