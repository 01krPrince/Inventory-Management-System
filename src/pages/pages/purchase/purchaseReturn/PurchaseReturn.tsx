import React, { useState } from "react";
import PurchaseReturnHeader from "./PurchaseReturnHeader";
import PurchaseReturnForm from "./PurchaseReturnForm";
import OrderTable from "./OrderTable";
import PurchaseOrderFooter from "./PurchaseReturnFooter";
import { COLORS } from "../../../../constants/colors";

import PurchaseReturnLogistics, {
  LogisticsData,
} from "./PurchaseReturnLogistic";
import LedgerAttributes from "../../../../components/LedgerAttributes";

const PurchaseReturn: React.FC = () => {
  const [logisticsData, setLogisticsData] = useState<LogisticsData>({
    // Left Column
    dispatchFrom: "",
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
      className="flex flex-col bg-gray-100 overflow-hidden"
    >
      <PurchaseReturnHeader />

      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          <PurchaseReturnForm />

          <OrderTable />

          <PurchaseOrderFooter />

          <LedgerAttributes />

          <PurchaseReturnLogistics
            data={logisticsData}
            onChange={handleLogisticsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PurchaseReturn;
