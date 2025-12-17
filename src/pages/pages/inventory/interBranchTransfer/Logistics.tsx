import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, FileText, EditIcon } from "lucide-react";
import Dropdown, { ColumnDef } from "../../../../components/Dropdown";
import Transporter from "../../../../components/Transporter";
import DateInput from "../../../../components/DateInput";
import TransporterService, {
  Transporter as TransporterType,
} from "../../../../components/api/transporter";

// --- 1. Define Data Interfaces (Matches JSON Payload) ---

export interface LogisticsData {
  destination: string;
  shippingMode: string;
  shippingCompany: string;
  shippingCompanyAbout: string; // Added field
  shippingTrackingNo: string;
  shippingDate: string;
  shippingCharges: string;
  vehicleNo: string;
  chargesType: string; // Renamed from chargeType to match JSON
  documentThrough: string;
  noOfPackets: string;
  weight: string;
  distance: string;
  eWayInvoiceNo: string;
  eWayInvoiceDate: string;
  eWayCancelDate: string | null; // Handle nulls from API
  irnNo: string;
  qrCode: string;
  irnCancelDate: string | null; // Handle nulls from API
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
  const [transporterModalOpen, setTransporterModalOpen] = useState(false);
  const [editingTransporter, setEditingTransporter] =
    useState<TransporterType | null>(null);

  const [transporterList, setTransporterList] = useState<TransporterType[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const themeStyles = {
    "--theme-primary": themeColor,
    "--theme-focus": "#60a5fa",
  } as React.CSSProperties;

  const shippingModes = ["Road", "Air", "Sea", "Rail"];
  const chargeTypes = ["Paid", "To Pay", "Free"];

  // Columns for Dropdown
  const transporterColumns: ColumnDef<TransporterType>[] = [
    { header: "Code", key: "code", width: "w-20" },
    { header: "Name", key: "name", width: "flex-1" },
  ];

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

  useEffect(() => {
    fetchTransporters();
  }, []);

  const handleChange = (field: keyof LogisticsData, value: string | null) => {
    // If value is null, we can keep it null or convert to empty string for inputs
    onChange({ ...data, [field]: value });
  };

  // Handle Transporter Selection
  const handleTransporterSelect = (item: TransporterType | null) => {
    // Automatically fill the "About" field if available in the transporter object
    // Assuming item.description maps to shippingCompanyAbout
    const aboutInfo =
      item && "description" in item ? (item as any).description : "";

    onChange({
      ...data,
      shippingCompany: item?.name || "",
      shippingCompanyAbout: aboutInfo || "",
    });
  };

  const handleEditOrAddTransporter = () => {
    if (data.shippingCompany) {
      const selected = transporterList.find(
        (t) => t.name === data.shippingCompany
      );
      setEditingTransporter(selected || null);
    } else {
      setEditingTransporter(null);
    }
    setTransporterModalOpen(true);
  };

  const handleTransporterSuccess = () => {
    setTransporterModalOpen(false);
    fetchTransporters();
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
                  <Label required>Destination</Label>
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
                  <Label required>Shipping Mode</Label>
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
                  <Label required>Shipping Company</Label>
                </div>
                <div className="col-span-8 flex gap-1">
                  <Dropdown
                    data={transporterList}
                    columns={transporterColumns}
                    value={data.shippingCompany}
                    valueKey="name"
                    onChange={handleTransporterSelect}
                    placeholder={
                      isLoadingList ? "Loading..." : "Select Transporter..."
                    }
                  />
                  <ActionBtn
                    icon={<EditIcon size={14} />}
                    onClick={handleEditOrAddTransporter}
                    title={data.shippingCompany ? "Edit Selected" : "Add New"}
                  />
                </div>
              </div>

              {/* Shipping Company About (New Field) */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label required>Transporter Details</Label>
                </div>
                <div className="col-span-8">
                  <Input
                    placeholder="About Transporter / Address"
                    value={data.shippingCompanyAbout}
                    onChange={(e) =>
                      handleChange("shippingCompanyAbout", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Shipping Tracking No */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label required>Tracking No</Label>
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
                  <Label required>Shipping Date</Label>
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
                  <Label required>Vehicle/Vessel No</Label>
                </div>
                <div className="col-span-8">
                  <Input
                    value={data.vehicleNo}
                    onChange={(e) => handleChange("vehicleNo", e.target.value)}
                  />
                </div>
              </div>

              {/* Charge Type (Renamed Prop) */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Charge Type</Label>
                </div>
                <div className="col-span-8">
                  <Select
                    options={chargeTypes}
                    value={data.chargesType}
                    onChange={(e) =>
                      handleChange("chargesType", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Document Through */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label required>Document Through</Label>
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

              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label>Weight</Label>
                </div>
                <div className="col-span-8">
                  <Input
                    value={data.weight} // Treated as string to allow "35KG"
                    onChange={(e) => handleChange("weight", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label required>Distance</Label>
                </div>
                <div className="col-span-8">
                  <Input
                    value={data.distance} // Treated as string to allow "380KM"
                    onChange={(e) => handleChange("distance", e.target.value)}
                  />
                </div>
              </div>

              {/* eWay Fields */}
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <Label required>eWay Invoice No</Label>
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
                  <Label required>eWay Invoice Date</Label>
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
                    value={data.eWayCancelDate || ""}
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
                    value={data.irnCancelDate || ""}
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
          onSuccess={handleTransporterSuccess}
        />
      )}
    </div>
  );
};

export default Logistics;
