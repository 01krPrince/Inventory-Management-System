import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  FileText,
  Edit2,
} from "lucide-react";

// Import your custom Dropdown and ColumnDef
import Dropdown, { ColumnDef } from "../../../../components/Dropdown";

// Import Transporter Modal (Default export only)
import Transporter from "../../../../components/Transporter";

// Import the Service and Type
// Note: Ensure this path points to where you saved the 'transporterService.ts' file I gave you earlier.
// If you saved it in 'services/transporterService.ts', update the path below.
import TransporterService, {
  Transporter as TransporterType,
} from "../../../../components/api/transporter";
// --- 1. Define Data Interfaces ---

export interface LogisticsData {
  destination: string;
  shippingMode: string;
  shippingCompany: string; // Stores the Name of selected company
  shippingTrackingNo: string;
  shippingDate: string;
  shippingCharges: string;
  vehicleNo: string;
  chargeType: string;
  documentThrough: string;
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
}

// --- 2. Props ---
interface LogisticsProps {
  themeColor?: string;
  data: LogisticsData;
  onChange: (data: LogisticsData) => void;
}

// --- Reusable UI Components (Themed) ---
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

const DateInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => (
  <div className="relative w-full h-[30px]">
    <input
      type="date"
      className="w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)] pr-8"
      {...props}
    />
    <button
      type="button"
      className="absolute right-0 top-0 h-full w-8 flex items-center justify-center bg-gray-100 rounded-r-sm border-l border-gray-300 text-gray-600 pointer-events-none"
    >
      <Calendar size={14} />
    </button>
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

// --- Main Component ---

const Logistics: React.FC<LogisticsProps> = ({
  data,
  onChange,
  themeColor = "#0f3c63",
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // Modal State
  const [transporterModalOpen, setTransporterModalOpen] = useState(false);

  // FIX: Use TransporterType (from service) instead of TransporterMaster
  const [editingTransporter, setEditingTransporter] =
    useState<TransporterType | null>(null);

  // --- API Data State ---
  const [transporterList, setTransporterList] = useState<TransporterType[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  // Define CSS variables
  const themeStyles = {
    "--theme-primary": themeColor,
    "--theme-focus": "#60a5fa",
  } as React.CSSProperties;

  const shippingModes = ["Road", "Air", "Sea", "Rail"];
  const chargeTypes = ["Paid", "To Pay", "Free"];

  // --- Columns for Dropdown ---
  const transporterColumns: ColumnDef<TransporterType>[] = [
    { header: "Code", key: "code", width: "w-20" },
    { header: "Name", key: "name", width: "flex-1" },
  ];

  // --- API: Fetch Transporters ---
  const fetchTransporters = async () => {
    try {
      setIsLoadingList(true);
      const response = await TransporterService.getAllTransporters();
      if (response.success) {
        setTransporterList(response.data);
      }
    } catch (error) {
      console.error("Error fetching transporters:", error);
    } finally {
      setIsLoadingList(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchTransporters();
  }, []);

  // --- Handlers ---

  const handleChange = (field: keyof LogisticsData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  // Called when User selects from Dropdown
  const handleTransporterSelect = (item: TransporterType | null) => {
    handleChange("shippingCompany", item?.name || "");
  };

  // Called when User clicks the Edit/Add Icon
  const handleEditOrAddTransporter = () => {
    if (data.shippingCompany) {
      // 1. EDIT MODE: Try to find the selected transporter in our list
      const selected = transporterList.find(
        (t) => t.name === data.shippingCompany
      );

      if (selected) {
        // FIX: No need to cast to TransporterMaster anymore, types match now
        setEditingTransporter(selected);
      } else {
        setEditingTransporter(null);
      }
    } else {
      // 2. CREATE MODE: Nothing selected
      setEditingTransporter(null);
    }
    setTransporterModalOpen(true);
  };

  // Called when the Transporter Modal successfully creates/updates data
  const handleTransporterSuccess = () => {
    setTransporterModalOpen(false);
    fetchTransporters(); // Refresh the list from API
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {/* LEFT COLUMN */}
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

              {/* Shipping Company (DROPDOWN + EDIT BUTTON) */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Shipping Company</Label>
                </div>
                <div className="col-span-8 flex gap-1">
                  {/* Integrated API Data here */}
                  <Dropdown
                    data={transporterList}
                    columns={transporterColumns}
                    value={data.shippingCompany} // Shows Name
                    valueKey="name"
                    onChange={handleTransporterSelect}
                    placeholder={
                      isLoadingList ? "Loading..." : "Select Transporter..."
                    }
                  />
                  <ActionBtn
                    icon={<Edit2 size={14} />}
                    onClick={handleEditOrAddTransporter}
                    title={data.shippingCompany ? "Edit Selected" : "Add New"}
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

              {/* Vehicle No */}
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

            {/* RIGHT COLUMN */}
            <div className="space-y-1">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>No of Packts</Label>
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

              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Weight</Label>
                </div>
                <div className="col-span-8">
                  <Input
                    type="number"
                    value={data.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Distance</Label>
                </div>
                <div className="col-span-8">
                  <Input
                    type="number"
                    value={data.distance}
                    onChange={(e) => handleChange("distance", e.target.value)}
                  />
                </div>
              </div>

              {/* eWay Fields */}
              <div className="grid grid-cols-12 gap-2">
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

              {/* IRN Fields */}
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

              {/* Acknowledgement Fields */}
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
          </div>
        </div>
      )}

      {/* Modal for Transporter (Create/Edit) */}
      {transporterModalOpen && (
        <Transporter
          isOpen={transporterModalOpen}
          onClose={() => setTransporterModalOpen(false)}
          initialData={editingTransporter}
          // IMPORTANT: You need to pass a callback here to refresh the list
          // when a new transporter is created/edited successfully.
          onSuccess={handleTransporterSuccess}
        />
      )}
    </div>
  );
};

export default Logistics;
