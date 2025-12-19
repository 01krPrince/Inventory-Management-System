import React, { useRef } from "react";
import logoImg from "./image.svg";

// --- Types tailored for POS ---
interface ReceiptItem {
  id: string | number;
  description: string;
  qty: number;
  mrp?: number;
  rate: number;
  amount: number;
}

interface ReceiptData {
  invoiceNo: string;
  date: string;
  customerName: string;
  customerPhone?: string;
  items: ReceiptItem[];
  subTotal: number;
  promoDiscount?: number;
  discount?: number;
  taxableAmount: number;
  billTotal: number;
  amountInWords: string;
  tenderMode: string;
  tenderAmount: number;
  bankDetails?: {
    bankName: string;
    ifsc: string;
    accountNo: string;
  };
  terms?: string[];
}

interface PosReceiptProps {
  data?: ReceiptData;
}

const PosReceipt: React.FC<PosReceiptProps> = ({ data }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  // --- Default Data ---
  const defaultData: ReceiptData = {
    invoiceNo: "03992/25-26",
    date: "16/12/2025",
    customerName: "RAHUL",
    customerPhone: "7008411312",
    items: [
      {
        id: 1,
        description: "YOGA MAT FOLDABLE",
        qty: 1.0,
        mrp: 0,
        rate: 1100.0,
        amount: 1100.0,
      },
      {
        id: 1,
        description: "YOGA MAT FOLDABLE",
        qty: 1.0,
        mrp: 0,
        rate: 1100.0,
        amount: 1100.0,
      },
    ],
    subTotal: 1100.0,
    promoDiscount: 0,
    discount: -110.0,
    taxableAmount: 990.0,
    billTotal: 990.0,
    amountInWords: "INR Nine Hundred Ninety Only",
    tenderMode: "UPI/CARD",
    tenderAmount: 990.0,
    bankDetails: {
      bankName: "BANK OF BARODA",
      ifsc: "BARB0PANDAS",
      accountNo: "5086 0500 0001 11",
    },
    terms: [
      "1. NO MONEY REFUND.",
      "2. Exchange within 7 days with BILL & TAGS After 2PM.",
      "3. FOR Service- WHATSAPP on 9852380932 With INVOICE COPY, ADDRESS & MACHINE PHOTO.",
      "4. No Exchange & Refund on FITNESS Section.",
      "5. Sports Goods Are NOT GUARANTEED E. & O .E",
    ],
  };

  const activeData = data || defaultData;

  // const handlePrint = () => {
  //   window.print();
  // };

  return (
    <div className="w-auto flex flex-col items-center bg-gray-100 min-h-screen p-4 font-sans">
      {/* Print Button */}
      {/* <button
        onClick={handlePrint}
        className="mb-4 px-4 py-2 bg-purple-700 text-white rounded shadow hover:bg-purple-800 print:hidden"
      >
        Print Receipt
      </button> */}

      {/* --- Thermal Receipt Container --- */}
      <div
        ref={componentRef}
        className="bg-white text-black text-[11px] leading-tight shadow-md p-2 print:shadow-none print:m-0"
        // Fixed 78mm width for standard 80mm paper
        style={{ width: "78mm", minHeight: "100mm" }}
      >
        {/* --- Header --- */}
        <div className="text-center mb-2">
          {/* Logo Section */}
          <div className="flex justify-center mb-1">
            {/* Logo container tailored for the shield look */}
            <div className="w-14 h-14 flex items-center justify-center">
              <img
                src={logoImg}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <h1 className="text-xl font-black uppercase mt-1 tracking-wide">
            Chandan Khel Ghar
          </h1>
          <p className="text-[11px] font-medium">VIP Road, Laheriasarai</p>
          <p className="text-[11px] font-medium">
            Phone : 9852380932, 9905020748
          </p>
          <p className="text-[11px] font-medium">GST No: 10HACPS7876F1ZF</p>
        </div>

        {/* --- Bill Title --- */}
        <div className="text-center font-black border-b-2 border-black pb-1 mb-1 text-[13px]">
          BILL OF SUPPLY
        </div>

        {/* --- Invoice Details Box (Thicker Borders) --- */}
        <div className="border-[1.5px] border-black p-1 mb-2 text-[11px]">
          <div className="flex justify-between">
            <span className="font-bold">Invoice No</span>
            <span className="font-bold">{activeData.invoiceNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Invoice Date</span>
            <span className="font-bold">{activeData.date}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-bold">Customer Name</span>
            <span className="font-bold uppercase">
              {activeData.customerName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] pl-1">
              Phone : {activeData.customerPhone}
            </span>
          </div>
        </div>

        {/* --- Items Table --- */}
        <div className="border-b-[1.5px] border-black mb-1">
          {/* Table Header - FIXED WIDTHS & STACKING */}
          <div className="flex font-bold border-y-[1.5px] border-black py-1 mb-1 items-end">
            <div className="w-[35%]">Description</div>
            <div className="w-[10%] text-center">Qty</div>
            <div className="w-[10%] text-center">MRP</div>
            {/* Split Rate Header to avoid collision */}
            <div className="w-[20%] text-right leading-none">Rate</div>
            <div className="w-[25%] text-right">Amount</div>
          </div>

          {/* Items List */}
          {activeData.items.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-wrap border-b border-black py-1 last:border-0"
            >
              {/* Row 1: Description takes full width */}
              <div className="w-full font-bold uppercase text-[11px] mb-1">
                {item.description}
              </div>
              {/* Row 2: Values - Perfectly aligned with Header */}
              <div className="w-[35%]"></div> {/* Spacer */}
              <div className="w-[10%] text-center font-medium">
                {item.qty.toFixed(2)}
              </div>
              <div className="w-[10%] text-center font-medium">{item.mrp}</div>
              <div className="w-[20%] text-right font-medium">
                {item.rate.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <div className="w-[25%] text-right font-bold">
                {item.amount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
          ))}

          {/* Total Qty Row */}
          <div className="flex font-bold border-t-[1.5px] border-black py-1 mt-1">
            <div className="w-[35%] text-right pr-2">Total</div>
            <div className="w-[10%] text-center">
              {activeData.items.reduce((acc, i) => acc + i.qty, 0).toFixed(2)}
            </div>
            <div className="w-full text-right">
              {activeData.items
                .reduce((acc, i) => acc + i.amount, 0)
                .toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* --- Calculation Summary --- */}
        <div className="border-b-[1.5px] border-black pb-1 mb-1 text-right text-[11px]">
          <div className="flex justify-between font-bold">
            <span>Sub Total</span>
            <span>
              {activeData.subTotal.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Promo Discount</span>
            <span>{activeData.promoDiscount}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Discount</span>
            <span>{activeData.discount?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Taxable Amount</span>
            <span>
              {activeData.taxableAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between font-black text-[14px] mt-1">
            <span>Bill Total</span>
            <span>
              {activeData.billTotal.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* --- Amount in Words --- */}
        <div className="border-b-[1.5px] border-black pb-2 mb-2 font-bold text-[11px]">
          {activeData.amountInWords}
        </div>

        {/* --- Payment & Bank Details --- */}
        <div className="mb-2 text-[11px]">
          <div className="font-bold mb-1">
            Tender Name : {activeData.tenderMode}:{" "}
            {activeData.tenderAmount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </div>

          {activeData.bankDetails && (
            <div className="mt-2 font-medium">
              <p className="uppercase font-bold">
                {activeData.bankDetails.bankName}
              </p>
              <p>IFSC No. {activeData.bankDetails.ifsc}</p>
              <p>Accounnt No. {activeData.bankDetails.accountNo}</p>
            </div>
          )}
        </div>

        {/* --- Footer Tags --- */}
        <div className="text-center text-[10px] mt-2 mb-2 font-bold border-b border-black pb-2">
          Sports * Fitness * Trophy & Awards * Garments
        </div>

        {/* --- Terms & Conditions --- */}
        <div className="text-[9px] leading-tight font-medium">
          {activeData.terms?.map((term, index) => (
            <p key={index} className="mb-1">
              {term}
            </p>
          ))}
        </div>

        {/* Cut line */}
        <div className="mt-4 border-t-2 border-dashed border-gray-400 text-center text-[10px] text-gray-400 print:hidden">
          --- Cut Here ---
        </div>
      </div>
    </div>
  );
};

export default PosReceipt;
