import React, { useState } from "react";
import PurchaseBillHeader from "./PurchaseBillHeader";
import BillPaymentForm from "./BillPaymentForm";
import BillPaymentTable, { BillPaymentRow } from "./BillPaymentTable";
import PurchaseBillFooter from "./PurchaseBillFooter";
import { COLORS } from "../../../../constants/colors";
import LedgerAttributes from "../../../../components/LedgerAttributes";

const BillPayment: React.FC = () => {
  const [rows, setRows] = useState<BillPaymentRow[]>([]);

  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex flex-col bg-gray-100 overflow-hidden"
    >
      <PurchaseBillHeader />

      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          <BillPaymentForm />

          <BillPaymentTable rows={rows} setRows={setRows} />

          <PurchaseBillFooter />

          <LedgerAttributes />
        </div>
      </div>
    </div>
  );
};

export default BillPayment;
