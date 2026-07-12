import React, { useState, useRef } from "react";
import PurchaseBillHeader from "./PurchaseBillHeader";
import PurchaseBillForm, { PurchaseBillFormRef } from "./PurchaseBillForm";
import OrderTable, { OrderTableRef } from "../../sales/salesInvoice/OrderTable";
import PurchaseBillFooter from "./PurchaseBillFooter";
import { COLORS } from "../../../../constants/colors";

// Import the service
import purchaseBillService, { PurchaseBillPayload } from "../../../../services/purchase/purchaseBill";

import LedgerAttributes, {
  LedgerData,
} from "../../../../components/LedgerAttributes";

import GoodsRecieptNoteLogistics, {
  LogisticsData,
} from "../goodsRecieptNote/GoodsRecieptNoteLogistics";

const PurchaseBill: React.FC = () => {
  const orderTableRef = useRef<OrderTableRef>(null);
  const formRef = useRef<PurchaseBillFormRef>(null);

  // --- Lifted State: Remarks (From Footer) ---
  const [remarks, setRemarks] = useState("Testing logistics distribution");

  // --- Lifted State: Ledger ---
  const [ledgerData, setLedgerData] = useState<LedgerData>({
    employee: "",
    group: "",
  });

  // --- Lifted State: Logistics ---
  const [logisticsData, setLogisticsData] = useState<LogisticsData>({
    destination: "",
    shippingMode: "Road",
    shippingCompany: "",
    shippingCompanyAddress: "",
    shippingTrackingNo: "",
    shippingDate: new Date().toISOString().split("T")[0],
    shippingCharges: "0",
    vehicleNo: "",
    chargeType: "Paid",
    documentThrough: "",
    
    // Middle Column
    portOfLanding: "",
    portOfDischarge: "",
    noOfPackets: "0",
    weight: "0",
    portAddressForEway: "",
    portStateForEway: "",
    distance: "",
    ewayInvoiceNo: "",
    ewayInvoiceDate: "",
    ewayCancelDate: "",
    irnNo: "",
    qrCode: "",
    irnCancelDate: "",
    irnCancelReason: "",
    ackNo: "",
    ackDate: "",
    billOfEntryNum: "",
    billOfEntryDate: "",
    
    // Right Column (Values match your request)
    customDuty: "0.00",
    customDutyTender: "",
    chaPayment: "0.00",
    chaPaymentTender: "",
    
    freight: "100", 
    freightTender: "",
    
    insurance: "210", 
    insuranceTender: "",
    
    handling: "0.00",
    handlingTender: "",
    
    documentationCharges: "0.00",
    documentationChargesTender: "",
    
    bankCharges: "0.00",
    bankChargesTender: "",
    
    customExpenses: "0.00",
    customExpensesTender: "",
    
    loadingUnloading: "1000",
    loadingUnloadingTender: "",
    
    otherCharges: "1220", 
    otherChargesTender: "",
  });

  // --- UI State: Submit Modal ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      // 1. Get Form Data
      // Use logic: The Form returns { store: "Name", storeId: "ID" }
      const formData = formRef.current?.getFormData();

      if (!formData) {
        alert("Form data is missing");
        setIsSubmitting(false);
        return;
      }

      // 2. Validate IDs (Prevent Mismatch of Name vs ID)
      if (!formData.storeId) {
        alert("Store ID is missing. Please re-select the Store.");
        setIsSubmitting(false);
        return;
      }
      if (!formData.vendorId) {
        alert("Vendor ID is missing. Please re-select the Vendor.");
        setIsSubmitting(false);
        return;
      }

      // 3. Get Table Data
      const tableSource: any = orderTableRef.current?.getTableData?.();
      const rawRows = tableSource?.visibleRows || [];

      // 4. Map Items (Corrected for OrderTable Structure)
      const apiItems = rawRows.map((row: any) => {
        const item = row.data || row; 
        return {
          // --- UPDATED MAPPING HERE ---
          // OrderTable stores the Item Code in the 'select' key
          itemcode: item.select || item.itemId || "",
          
          quantity: Number(item.qty || 0),
          rate: Number(item.rate || 0),
          // Note: batchNo is removed to match your request
        };
      });

      // 5. Construct Payload 
      // STRICTLY matching: billDate, store, vendor, remarks, items, logistics
      const payload: PurchaseBillPayload = {
        // DATA MAPPING 1: orderDate -> billDate
        billDate: formData.orderDate || new Date().toISOString().split('T')[0],
        
        // DATA MAPPING 2: storeId -> store (Ensure we send ID, not Name)
        store: formData.storeId, 
        
        // DATA MAPPING 3: vendorId -> vendor (Ensure we send ID, not Name)
        vendor: formData.vendorId, 
        
        // DATA MAPPING 4: Lifted State -> remarks
        remarks: remarks, 
        
        items: apiItems,
        
        logistics: {
          freight: Number(logisticsData.freight) || 0,
          loadingUnloading: Number(logisticsData.loadingUnloading) || 0,
          insurance: Number(logisticsData.insurance) || 0,
          otherCharges: Number(logisticsData.otherCharges) || 0,
        },
      };

      console.log("SENDING EXACT PAYLOAD:", JSON.stringify(payload, null, 2));

      // 5b. Warning if itemcode is still missing
      if (apiItems.length > 0 && apiItems.some((i: any) => !i.itemcode)) {
         console.warn("Missing itemcode detected in items:", apiItems);
         alert("Warning: Some items do not have an Item Code (select). Please check the console.");
      }

      // 6. Call API
      const response = await purchaseBillService.createPurchaseBill(payload);
      console.log("API SUCCESS:", response);

      setShowSuccessModal(true);
    } catch (error) {
      console.error("API ERROR:", error);
      alert("Failed to save. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex flex-col bg-gray-100 overflow-hidden min-h-screen"
    >
      <PurchaseBillHeader />

      <div className="flex-1 overflow-auto p-4 space-y-4">
        <PurchaseBillForm ref={formRef} />

        {/* Ensure OrderTable exposes getTableData */}
        <OrderTable ref={orderTableRef} />

        {/* Pass Remarks props to Footer to bind the data */}
        <PurchaseBillFooter 
          remarks={remarks}
          onRemarksChange={setRemarks}
        />

        <LedgerAttributes data={ledgerData} onChange={setLedgerData} />

        <GoodsRecieptNoteLogistics
          data={logisticsData}
          onChange={setLogisticsData}
        />

        {/* Action Button Section */}
        <div className="flex justify-end gap-3 bg-white p-4 border rounded shadow-sm">
          <button 
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="px-10 py-2 bg-[#0f3c63] text-white rounded font-bold hover:bg-[#1a4a75] transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? "Saving..." : "Save Purchase Bill"}
          </button>
        </div>
      </div>

      {/* --- Success Modal --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
            <p className="text-gray-600 mb-6">
              Purchase Bill has been saved.
            </p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-[#0f3c63] text-white rounded-lg font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseBill;