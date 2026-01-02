import React, { useState } from "react";
import PurchaseReturnChallanHeader from "./PurchaseReturnChallanHeader";
import PurchaseReturnChallanForm from "./PurchaseReturnChallanForm";
import OrderTable from "./OrderTable";
import PurchaseRetuenChallanFooter from "./PurchaseReturnChallanFooter";
import { COLORS } from "../../../../constants/colors";

import PurchaseReturnChallanLogistics, {
  LogisticsData,
} from "./PurchaseReturnChallanLogistic";

const PurchaseReturnChallan: React.FC = () => {
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
    noOfPackets: "0",
    weight: "0",
    distance: "0",
    eWayInvoiceNo: "",
    eWayInvoiceDate: new Date().toISOString().split("T")[0],
    eWayCancelDate: "",
    irnNo: "",
    qrCode: "",
    irnCancelDate: "",
    irnCancelReason: "",
    acknowledgementNo: "",
    acknowledgementDate: "",

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
      className="flex flex-col bg-gray-100 overflow-hidden h-full"
    >
      <PurchaseReturnChallanHeader />

      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <div className="flex flex-col gap-4">
          <PurchaseReturnChallanForm />

          <OrderTable />

          <PurchaseRetuenChallanFooter />

          <PurchaseReturnChallanLogistics
            data={logisticsData}
            onChange={handleLogisticsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PurchaseReturnChallan;
