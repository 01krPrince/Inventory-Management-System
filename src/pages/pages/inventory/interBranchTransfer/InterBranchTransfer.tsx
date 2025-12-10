import React, { useState } from "react";
import InterBranchTransferHeader from "./InterBranchTransferHeader";
import InterBranchTransferForm, {
  InterBranchTransferData,
} from "./InterBranchTransferForm";
import OrderTable from "./OrderTable";
import AttachmentSection from "../../../../components/AttachmentSection";
import { COLORS } from "../../../../constants/colors";
// Import Logistics and its Type
import Logistics, { LogisticsData } from "./Logistics";
import { LocationMaster } from "../../../../components/LocationMaster";
import { ArrowLeft } from "lucide-react";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}
interface FooterData {
  remarks: string;
}
interface RowData {
  [key: string]: string | number;
}

const InterBranchTransfer: React.FC<ModalProps> = ({
  isOpen = true,
  onClose = () => {},
}) => {
  if (!isOpen) return null;

  // --- 1. FORM HEADER STATE ---
  const [formData, setFormData] = useState<InterBranchTransferData>({
    category: "",
    store: "",
    toStore: "",
    transferDate: new Date().toISOString().split("T")[0],
    transferNo: "",
    postingGL: "",
  });

  // --- 2. LOGISTICS STATE (New) ---
  const [logisticsData, setLogisticsData] = useState<LogisticsData>({
    destination: "",
    shippingMode: "Road",
    shippingCompany: "",
    // shippingCompanyAddress: "",
    shippingTrackingNo: "",
    shippingDate: new Date().toISOString().split("T")[0],
    shippingCharges: "0",
    vehicleNo: "",
    chargeType: "Paid",
    documentThrough: "",
    noOfPackets: "0",
    weight: "0",
    distance: "0",
    eWayInvoiceNo: "",
    eWayInvoiceDate: "",
    eWayCancelDate: "",
    irnNo: "",
    qrCode: "",
    irnCancelDate: "",
    irnCancelReason: "",
    acknowledgementNo: "",
    acknowledgementDate: "",
  });

  // --- 3. OTHER STATES ---
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [showLocationMaster, setShowLocationMaster] = useState(false);
  const [rows, setRows] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Record<string, RowData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [footerData, setFooterData] = useState<FooterData>({
    remarks: "",
  });

  // --- 4. FINAL SUBMIT HANDLER ---
  const handleSave = async () => {
    setIsSubmitting(true);

    // Combine all data into one payload
    const finalPayload = {
      header: formData,
      items: tableData, // Assuming rows are keys in tableData
      logistics: logisticsData,
      attachments: footerData,
    };

    console.log("FINAL SUBMISSION PAYLOAD:", finalPayload);

    // Simulate API call
    setTimeout(() => {
      alert("Data collected! Check Console for full payload.");
      setIsSubmitting(false);
    }, 1000);
  };

  // --- View 2: Location Master Form ---
  if (showLocationMaster) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-5xl bg-white shadow-xl rounded-sm overflow-hidden flex flex-col h-[650px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b flex items-center gap-2 bg-gray-50">
            <button
              onClick={() => setShowLocationMaster(false)}
              className="flex items-center text-sm text-gray-600 hover:text-[#104a7d] transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Inventory
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <LocationMaster
              onClose={() => setShowLocationMaster(false)}
              onSuccess={() => setShowLocationMaster(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex flex-col h-screen bg-gray-100 overflow-hidden"
    >
      {/* Header (Fixed at top) */}
      {!isOverlayOpen && (
        <>
          <InterBranchTransferHeader />
        </>
      )}

      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          {/* Header Form */}
          <InterBranchTransferForm
            themeColor="#0f3c63"
            onOverlayChange={(isOpen) => setIsOverlayOpen(isOpen)}
            data={formData}
            onDataChange={setFormData}
          />

          {!isOverlayOpen && (
            <>
              {/* Item Table */}
              <OrderTable
                rows={rows}
                setRows={setRows}
                tableData={tableData}
                setTableData={setTableData}
              />

              {/* Remarks / Footer */}
              <AttachmentSection
                data={footerData}
                onDataChange={setFooterData}
              />

              {/* Logistics Form - Controlled by Parent */}
              <Logistics
                themeColor="#0f3c63"
                data={logisticsData}
                onChange={setLogisticsData}
              />

              {/* Submit Button */}
              <div className="flex justify-end pb-4">
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="px-8 py-2 text-white font-semibold rounded shadow-md transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  {isSubmitting ? "Saving..." : "Submit Adjustment"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterBranchTransfer;
