import React, { useState } from "react";
import PurchaseOrderHeader from "./PurchaseOrderHeader";
import PurchaseOrderForm from "./PurchaseOrderForm";
import OrderTable from "./OrderTable";
import PurchaseOrderFooter from "./PurchaseOrderFooter";
import { COLORS } from "../../../../constants/colors";
// Import the Type along with the component
import PurchaseOrderLogistics, {
  LogisticsData,
} from "./PurchaseOrderLogistics";

interface RowData {
  [key: string]: string | number;
}

const PurchaseOrder: React.FC = () => {
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
    shippingDate: new Date().toISOString().split("T")[0], // Default to today
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
      <PurchaseOrderHeader />

      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          <PurchaseOrderForm />

          <OrderTable
            rows={rows}
            setRows={setRows}
            tableData={tableData}
            setTableData={setTableData}
          />

          <PurchaseOrderFooter />

          <PurchaseOrderLogistics
            data={logisticsData}
            onChange={handleLogisticsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrder;
