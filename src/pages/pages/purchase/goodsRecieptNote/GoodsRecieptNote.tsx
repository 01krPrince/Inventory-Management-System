import React, { useState } from "react";
import GoodsRecieptNoteHeader from "./GoodsRecieptNoteHeader";
import GoodsRecieptNoteForm from "./GoodsRecieptNoteForm";
import OrderTable from "../purchaseOrder/OrderTable";
import GoodsRecieptNoteFooter from "./GoodsRecieptNoteFooter";
import { COLORS } from "../../../../constants/colors";

// FIX: Import the Component AND the Interface
import GoodsRecieptNoteLogistics, {
  LogisticsData,
} from "./GoodsRecieptNoteLogistics";

interface RowData {
  [key: string]: string | number;
}

const GoodsRecieptNote: React.FC = () => {
  const [rows, setRows] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Record<string, RowData>>({});

  // --- 1. Initialize Logistics State ---
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

    // Middle Column
    portOfLanding: "",
    portOfDischarge: "",
    portAddressForEway: "",
    portStateForEway: "",
    noOfPackets: "0",
    weight: "0",

    // Note: Skipped optional fields like irnNo, ackNo as per your existing code logic.

    // Right Column (Overhead Expenses with Tenders)
    customDuty: "0.00",
    customDutyTender: "", // Added

    chaPayment: "0.00",
    chaPaymentTender: "", // Added

    freight: "0.00",
    freightTender: "", // Added

    insurance: "0.00",
    insuranceTender: "", // Added

    handling: "0.00",
    handlingTender: "", // Added

    documentationCharges: "0.00",
    documentationChargesTender: "", // Added

    bankCharges: "0.00",
    bankChargesTender: "", // Added

    customExpenses: "0.00",
    customExpensesTender: "", // Added

    loadingUnloading: "0.00",
    loadingUnloadingTender: "", // Added

    otherCharges: "0.00",
    otherChargesTender: "", // Added
  });

  // --- 2. Handler for Logistics Updates ---
  const handleLogisticsChange = (newData: LogisticsData) => {
    setLogisticsData(newData);
  };

  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex flex-col bg-gray-100 overflow-hidden"
    >
      <GoodsRecieptNoteHeader />

      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          <GoodsRecieptNoteForm />

          <OrderTable
            rows={rows}
            setRows={setRows}
            tableData={tableData}
            setTableData={setTableData}
          />

          <GoodsRecieptNoteFooter />

          <GoodsRecieptNoteLogistics
            data={logisticsData}
            onChange={handleLogisticsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default GoodsRecieptNote;
