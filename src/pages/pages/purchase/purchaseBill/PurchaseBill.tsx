import React, { useState } from "react";
import PurchaseBillHeader from "./PurchaseBillHeader";
import PurchaseBillForm from "./PurchaseBillForm";
import OrderTable from "../purchaseOrder/OrderTable";
import PurchaseBillFooter from "./PurchaseBillFooter";
import { COLORS } from "../../../../constants/colors";

// Import LedgerAttributes and its Type
import LedgerAttributes, {
  LedgerData,
} from "../../../../components/LedgerAttributes";

import GoodsRecieptNoteLogistics, {
  LogisticsData,
} from "../goodsRecieptNote/GoodsRecieptNoteLogistics";

interface RowData {
  [key: string]: string | number;
}

const PurchaseBill: React.FC = () => {
  const [rows, setRows] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Record<string, RowData>>({});

  // --- 1. NEW STATE: Financial/Ledger Attributes ---
  const [ledgerData, setLedgerData] = useState<LedgerData>({
    employee: "",
    group: "",
  });

  // --- 2. EXISTING STATE: Logistics Data ---
  const [logisticsData, setLogisticsData] = useState<LogisticsData>({
    // Left Column
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

    // Middle Column (Common)
    portOfLanding: "",
    portOfDischarge: "",
    noOfPackets: "0",
    weight: "0",

    // Middle Column (Specific)
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

    // Right Column (Overhead Expenses)
    // IMPORTANT: Initialize both Amount and Tender fields
    customDuty: "0.00",
    customDutyTender: "", // New

    chaPayment: "0.00",
    chaPaymentTender: "", // New

    freight: "0.00",
    freightTender: "", // New

    insurance: "0.00",
    insuranceTender: "", // New

    handling: "0.00",
    handlingTender: "", // New

    documentationCharges: "0.00",
    documentationChargesTender: "", // New

    bankCharges: "0.00",
    bankChargesTender: "", // New

    customExpenses: "0.00",
    customExpensesTender: "", // New

    loadingUnloading: "0.00",
    loadingUnloadingTender: "", // New

    otherCharges: "0.00",
    otherChargesTender: "", // New
  });

  const handleLogisticsChange = (newData: LogisticsData) => {
    setLogisticsData(newData);
  };

  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex flex-col bg-gray-100 overflow-hidden"
    >
      <PurchaseBillHeader />

      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          <PurchaseBillForm />

          <OrderTable
            rows={rows}
            setRows={setRows}
            tableData={tableData}
            setTableData={setTableData}
          />

          <PurchaseBillFooter />

          {/* --- 3. Pass State and Handler to LedgerAttributes --- */}
          <LedgerAttributes data={ledgerData} onChange={setLedgerData} />

          <GoodsRecieptNoteLogistics
            data={logisticsData}
            onChange={handleLogisticsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PurchaseBill;
