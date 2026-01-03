import React, { useState } from "react";
import PurchaseBillHeader from "./PurchaseBillHeader";
import PurchaseCreditNoteForm from "./PurchaseCreditNoteForm";
import OrderTable from "../purchaseOrder/OrderTable";
import PurchaseBillFooter from "./PurchaseBillFooter";
import { COLORS } from "../../../../constants/colors";
import LedgerAttributes from "../../../../components/LedgerAttributes";

import GoodsRecieptNoteLogistics, {
  LogisticsData,
} from "../goodsRecieptNote/GoodsRecieptNoteLogistics";

interface RowData {
  [key: string]: string | number;
}

const PurchaseCreditNote: React.FC = () => {
  const [rows, setRows] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Record<string, RowData>>({});

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

    // Middle Column (Continued)
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

    // Right Column (Overhead Expenses) - Missing Tender Fields Added Below
    customDuty: "0.00",
    customDutyTender: "", // Added this

    chaPayment: "0.00",
    chaPaymentTender: "", // Added this

    freight: "0.00",
    freightTender: "", // Added this

    insurance: "0.00",
    insuranceTender: "", // Added this

    handling: "0.00",
    handlingTender: "", // Added this

    documentationCharges: "0.00",
    documentationChargesTender: "", // Added this

    bankCharges: "0.00",
    bankChargesTender: "", // Added this

    customExpenses: "0.00",
    customExpensesTender: "", // Added this

    loadingUnloading: "0.00",
    loadingUnloadingTender: "", // Added this

    otherCharges: "0.00",
    otherChargesTender: "", // Added this
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
          <PurchaseCreditNoteForm />

          <OrderTable
            rows={rows}
            setRows={setRows}
            tableData={tableData}
            setTableData={setTableData}
          />

          <PurchaseBillFooter />

          <LedgerAttributes />

          <GoodsRecieptNoteLogistics
            data={logisticsData}
            onChange={handleLogisticsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PurchaseCreditNote;
