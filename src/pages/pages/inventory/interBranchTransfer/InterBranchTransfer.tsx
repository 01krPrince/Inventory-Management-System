import React, { useState } from "react";
import InterBranchTransferHeader from "./InterBranchTransferHeader";
import InterBranchTransferForm, {
  InterBranchTransferData,
} from "./InterBranchTransferForm";
import OrderTable from "../stockAdjustment/OrderTable";
import AttachmentSection from "../../../../components/AttachmentSection";
import { COLORS } from "../../../../constants/colors";
import Logistics, { LogisticsData } from "./Logistics";
import { LocationMaster } from "../../../../components/LocationMaster";
import { ArrowLeft } from "lucide-react";

import {
  interBranchService,
  CreateInterBranchPayload,
  InterBranchItem,
} from "./api/interBranchTransferService";

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

  const [logisticsData, setLogisticsData] = useState<LogisticsData>({
    destination: "",
    shippingMode: "Road",
    shippingCompany: "",
    shippingCompanyAbout: "",
    shippingTrackingNo: "",
    shippingDate: new Date().toISOString().split("T")[0],
    shippingCharges: "0",
    vehicleNo: "",
    chargesType: "Paid",
    documentThrough: "",
    noOfPackets: "0",
    weight: "0",
    distance: "0",
    eWayInvoiceNo: "",
    eWayInvoiceDate: "",
    eWayCancelDate: null,
    irnNo: "",
    qrCode: "",
    irnCancelDate: null,
    irnCancelReason: "",
    acknowledgementNo: "",
    acknowledgementDate: "",
  });

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [showLocationMaster, setShowLocationMaster] = useState(false);
  const [rows, setRows] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Record<string, RowData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [footerData, setFooterData] = useState<FooterData>({
    remarks: "",
  });

  const handleSave = async () => {
    if (!formData.transferNo || !formData.store || !formData.toStore) {
      alert(
        "Please fill in all required header fields (Transfer No, From Store, To Store)."
      );
      return;
    }

    if (Object.keys(tableData).length === 0) {
      alert("Please add at least one item to the transfer.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedItems: InterBranchItem[] = Object.values(tableData).map(
        (row: any) => ({
          itemcode: row.itemcode || "",
          description: row.description || "",
          packUnit: row.packUnit || "",
          packQuantity: Number(row.packQuantity) || 0,
          unit: row.unit || "",
          quantity: Number(row.quantity) || 0,
          ratePer: Number(row.ratePer) || 1,
          rate: Number(row.rate) || 0,
          amount: Number(row.amount) || 0,
          minRate: Number(row.minRate) || 0,
          mrp: Number(row.mrp) || 0,
          netRate: Number(row.netRate) || 0,
          remark: row.remark || "",
          printDesc: row.printDesc || row.description || "",
          serviceLocation: row.serviceLocation || formData.store,
          itemBarcode: row.itemBarcode || "",
          bdBatchNo: row.bdBatchNo || "",
          bdMfgDate: row.bdMfgDate || null,
          bdExpDate: row.bdExpDate || null,
          bdSaleRate: Number(row.bdSaleRate) || 0,
          itemBalance: Number(row.itemBalance) || 0,
          barcode: row.barcode || "",
          lineLevelBarcode: row.lineLevelBarcode || "",
          hsnCode: row.hsnCode || "",
          brand: row.brand || "",
        })
      );

      // 3. Construct the Payload
      const payload: CreateInterBranchPayload = {
        category: formData.category,
        store: formData.store,
        toStore: formData.toStore,
        transferNo: formData.transferNo,
        transferDate: formData.transferDate,
        postingGl: formData.postingGL,
        remarks: footerData.remarks,
        attachment: "",
        items: formattedItems,
        logistics: {
          ...logisticsData,
          // Explicit conversions if strictly needed, otherwise spread works
          eWayCancelDate: logisticsData.eWayCancelDate || null,
          irnCancelDate: logisticsData.irnCancelDate || null,
        },
      };

      console.log("Sending Payload:", payload);

      // 4. Call the Service
      const response = await interBranchService.createTransfer(payload);

      // 5. Success Handling
      if (response.success) {
        alert("Transfer Created Successfully!");
        if (onClose) onClose();
      } else {
        alert("Failed: " + response.message);
      }
    } catch (error: any) {
      console.error("Submission Error:", error);

      if (error.message && error.message.includes("E11000")) {
        alert(
          `Error: The Transfer Number "${formData.transferNo}" already exists. Please use a unique number.`
        );
      } else {
        alert("Error saving transfer: " + (error.message || "Unknown error"));
      }
    } finally {
      setIsSubmitting(false);
    }
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
      className="flex flex-col h-auto bg-gray-100 overflow-hidden"
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
