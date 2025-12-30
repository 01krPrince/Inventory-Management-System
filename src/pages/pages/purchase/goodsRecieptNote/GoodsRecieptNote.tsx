import React, { useState } from "react";
import GoodsRecieptNoteHeader from "./GoodsRecieptNoteHeader";
import GoodsRecieptNoteForm from "./GoodsRecieptNoteForm";
import OrderTable from "../purchaseOrder/OrderTable";
import GoodsRecieptNoteFooter from "./GoodsRecieptNoteFooter";
import { COLORS } from "../../../../constants/colors";

// FIX: Import the Component AND the Interface from the file we just fixed
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
    portAddressForEway: "", // Keep these, they exist in the interface as optional
    portStateForEway: "", // Keep these, they exist in the interface as optional
    noOfPackets: "0",
    weight: "0",

    // Note: We DO NOT need to initialize fields like irnNo, ackNo, etc.
    // because they are marked as optional (?) in the interface and
    // are not used on this specific page.

    // Right Column (Overhead Expenses)
    customDuty: "0.00",
    chaPayment: "0.00",
    freight: "0.00",
    insurance: "0.00",
    handling: "0.00",
    documentationCharges: "0.00",
    bankCharges: "0.00",
    customExpenses: "0.00",
    loadingUnloading: "0.00",
    otherCharges: "0.00",
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
