import React, { useRef } from "react";

// --- Types for Dynamic Data ---
interface InvoiceItem {
  id: string | number;
  description: string;
  qty: number;
  uom: string; // e.g., PCS, KG
  rate: number;
  amount: number;
}

interface Address {
  name: string;
  addressLine: string;
  cityStateZip: string;
  stateCode?: string;
  gstin?: string; // Added GSTIN to interface just in case
}

interface InvoiceData {
  invoiceNo: string;
  date: string;
  billType: string;
  placeOfSupply: string;
  customer: Address;
  shipping?: Address; // Optional
  items: InvoiceItem[];
  amountInWords: string;
  destination: string;
  grlrNo: string;
  stateCode: string;
  bankDetails?: {
    bankName: string;
    ifsc: string;
    accountNo: string;
  };
  terms?: string[];
}

interface InvoiceProps {
  data?: InvoiceData; // Optional to allow defaults for preview
}

const InvoiceA4: React.FC<InvoiceProps> = ({ data }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  // --- Default/Fallback Data ---
  const defaultData: InvoiceData = {
    invoiceNo: "00043/25-26",
    date: "14/11/2025",
    billType: "Credit",
    placeOfSupply: "Bihar",
    grlrNo: "",
    destination: "",
    stateCode: "BR",
    customer: {
      name: "Ashutosh Kumar",
      addressLine: "Vill+p.o+p s.-brahmpur, Dist-buxar",
      cityStateZip: "Bihar, Pin-802112",
      stateCode: "10",
      gstin: "Unregistered", // Placeholder
    },
    items: [
      {
        id: 1,
        description: "HERCULES HYPER EXTENSION",
        qty: 1.0,
        uom: "PCS",
        rate: 20500.0,
        amount: 20500.0,
      },
    ],
    amountInWords: "Twenty Thousand Five Hundred Only",
    bankDetails: {
      bankName: "BANK OF BARODA",
      ifsc: "BARBOPANDAS",
      accountNo: "5086 0500 0001 11",
    },
    terms: [
      "1. NO MONEY REFUND.",
      "2. Exchange within 7 days with BILL & TAGS After 2PM.",
      "3. FOR Service- WHATSAPP on 9852380932 With INVOICE COPY, ADDRESS & MACHINE PHOTO.",
    ],
  };

  const activeData = data || defaultData;
  const shippingAddress = activeData.shipping || activeData.customer;

  // Calculate Totals
  const totalAmount = activeData.items.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <div className="w-auto bg-gray-100 flex flex-col items-center min-h-screen font-sans">
      {/* --- A4 Page Start --- */}
      <div
        ref={componentRef}
        className="w-[210mm] min-h-[297mm] bg-white text-black text-sm relative shadow-lg print:shadow-none print:w-full print:h-full print:m-0"
        style={{ padding: "10mm" }}
      >
        {/* Top Row: GSTIN and Title */}
        <div className="flex justify-between items-start p-2">
          <div>
            <span className="font-bold">GSTIN: 10HACPS7876F1ZF</span>
          </div>
          <div className="font-bold text-lg uppercase underline decoration-1 underline-offset-2">
            Bill of Supply
          </div>
          <div className="text-xs text-right">Original For Recipient</div>
        </div>

        {/* Store Branding (YOUR COMPLETED SECTION) */}
        <div className="relative text-center py-2">
          {/* Main Centered Content */}
          <div className="px-24">
            <h1 className="text-3xl font-bold uppercase tracking-wide">
              Chandan Khel Ghar
            </h1>{" "}
            <p className="text-[14px] font-extrabold">
              (Registered under CHANDAN KHEL GHAR)
            </p>{" "}
            <p className="text-[14px] font-medium">
              VIP ROAD, Laheriasarai, Darbhanga, Bihar 846001
            </p>{" "}
            <p className="text-[14px] mt-1 font-extrabold">
              Sports Fitness * Trophy & Awards * Garments
            </p>{" "}
            <p className="text-[14px] mt-1 font-extrabold">
              Phone No: 9852380932 | Email: CHANDANKHELGHAR@GMAIL.COM{" "}
            </p>
          </div>

          {/* Dynamic QR Code - Positioned Absolute Right */}
          <div className="absolute right-2 top-[4vh] transform -translate-y-1/2 flex flex-col items-end">
            <div className="text-xs text-right mb-2 font-semibold">
              Scan for Payment
            </div>

            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${activeData.invoiceNo}`}
              alt="QR Code"
              className="w-20 h-20 object-contain"
            />
          </div>
        </div>

        <div className="flex w-full justify-end -mt-5 mb-1">
          <div className="font-semibold mr-1">State Code:</div>
          <div className="">{activeData.stateCode}</div>
        </div>

        <div className="border border-black">
          {/* Invoice Meta Data Grid */}
          <div className="grid grid-cols-4 text-sm">
            {/* Row 1 */}
            <div className="pl-2 font-semibold">Invoice No.</div>
            <div className="pl-2 font-semibold">{activeData.invoiceNo}</div>
            <div className="pl-2 font-semibold">Invoice Date</div>
            <div className="pl-2 font-semibold">{activeData.date}</div>

            {/* Row 2 */}
            <div className="pl-2 font-semibold">Bill Type</div>
            <div className="pl-2">{activeData.billType}</div>
            <div className="pl-2 font-semibold">GR / LR No</div>
            <div className="pl-2">{activeData.grlrNo || "-"}</div>

            {/* Row 3 - Corrected border-b classes */}
            <div className="pl-2 font-semibold border-b border-black pb-1">
              Place of Supply
            </div>
            <div className="pl-2 border-b border-black">
              {activeData.placeOfSupply}
            </div>
            <div className="pl-2 font-semibold border-b border-black">
              Destination
            </div>
            <div className="pl-2 border-b border-black">
              {activeData.destination || "-"}
            </div>
          </div>

          {/* Addresses Section */}
          <div className="text-sm border-b border-black">
            {/* Header Row */}
            <div className="flex w-full border-b border-black">
              <p className="w-1/2 p-2 font-bold border-r border-black">
                Customer Name & Billing Address
              </p>
              <p className="w-1/2 p-2 font-bold">Shipping Address</p>
            </div>

            <div className="flex">
              {/* Billing Address */}
              <div className="w-1/2 p-2 border-r border-black">
                <p className="uppercase font-semibold">
                  {activeData.customer.name}
                </p>
                <p>{activeData.customer.addressLine}</p>
                <p>{activeData.customer.cityStateZip}</p>
                <div className="flex">
                  <p className="w-1/2 mt-1">
                    <span className="font-semibold">State Code:</span>{" "}
                    {activeData.customer.stateCode}
                  </p>
                  <p className="mt-1">
                    {/* Fixed: Was displaying stateCode for GSTIN */}
                    <span className="font-semibold">GSTIN:</span>{" "}
                    {activeData.customer.gstin || "N/A"}
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="w-1/2 p-2">
                <p className="uppercase font-semibold">
                  {shippingAddress.name}
                </p>
                <p>{shippingAddress.addressLine}</p>
                <p>{shippingAddress.cityStateZip}</p>
                <p className="mt-1">
                  <span className="font-semibold">State Code:</span>{" "}
                  {shippingAddress.stateCode}
                </p>
              </div>
            </div>
          </div>

          {/* Item Table */}
          <div className="w-full">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-100 border-b border-black text-center">
                  <th className="border-r border-black p-1 w-[5%]">S No</th>
                  <th className="border-r border-black p-1 w-[45%] text-left">
                    Description
                  </th>
                  <th className="border-r border-black p-1 w-[10%]">Qty</th>
                  <th className="border-r border-black p-1 w-[10%]">UOM</th>
                  <th className="border-r border-black p-1 w-[15%] text-right">
                    Item Rate
                  </th>
                  <th className="p-1 w-[15%] text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                {activeData.items.map((item, index) => (
                  <tr key={index} className="">
                    <td className="border-r border-black p-1 text-center">
                      {index + 1}
                    </td>
                    <td className="border-r border-black p-1 font-medium">
                      {item.description}
                    </td>
                    <td className="border-r border-black p-1 text-center">
                      {item.qty.toFixed(2)}
                    </td>
                    <td className="border-r border-black p-1 text-center">
                      {item.uom}
                    </td>
                    <td className="border-r border-black p-1 text-right">
                      {item.rate.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="p-1 text-right font-bold">
                      {item.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
                {/* Empty rows filler */}
                {activeData.items.length < 15 &&
                  Array.from({ length: 15 - activeData.items.length }).map(
                    (_, i) => (
                      <tr key={`empty-${i}`} className=" h-6">
                        <td className="border-r border-black"></td>
                        <td className="border-r border-black"></td>
                        <td className="border-r border-black"></td>
                        <td className="border-r border-black"></td>
                        <td className="border-r border-black"></td>
                        <td></td>
                      </tr>
                    )
                  )}
                <tr>
                  <td className="border-t border-r border-black p-1 text-center"></td>
                  <td className="border-t border-r border-black p-1 font-bold">
                    Total
                  </td>
                  <td className="border-t border-r border-black p-1 text-center">
                    {/* Sum of Qty if needed, otherwise hardcoded 1 */}
                    {activeData.items.reduce((acc, item) => acc + item.qty, 0)}
                  </td>
                  <td className="border-t border-r border-black p-1 text-center"></td>
                  <td className="border-t border-r border-black p-1 text-right"></td>
                  <td className="border-t border-black p-1 text-right font-bold">
                    {totalAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="border-t border-black flex">
            <div className="flex-grow border-r border-black p-2">
              <p className="text-xs font-bold">Amount In Words:</p>
              <p className="italic uppercase text-sm">
                {activeData.amountInWords}
              </p>
            </div>
            <div className="w-[30%]">
              <div className="flex justify-between border-b border-black p-1 font-bold bg-gray-50">
                <span>Sub Total</span>
                <span>
                  {totalAmount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between p-1 font-bold text-lg">
                <span>Bill Total</span>
                <span>
                  {totalAmount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Footer / Bank / Terms */}
          <div className="border-t border-black grid grid-cols-2">
            {/* Left: Bank & Terms */}
            <div className="border-r border-black p-2 text-xs">
              {activeData.bankDetails && (
                <div className="mb-2">
                  <p className="font-bold underline">Bank Details:</p>{" "}
                  <p>{activeData.bankDetails.bankName}</p>
                  <p>IFSC: {activeData.bankDetails.ifsc}</p>
                  <p>A/C: {activeData.bankDetails.accountNo}</p>
                </div>
              )}

              <div className="mt-2">
                <p className="font-bold underline">Terms and Conditions:</p>{" "}
                <ul className="list-none pl-0 mt-1 space-y-1">
                  {activeData.terms?.map((term, i) => (
                    <li key={i}>{term}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Signature */}
            <div className="p-2 flex flex-col justify-between text-center min-h-[150px]">
              <div className="text-xs font-bold text-center border-b border-black pb-1 mb-2">
                Composition taxable person, not eligible to collect tax on
                supplies.
              </div>

              <div>
                <p className="text-xs mb-8">For CHANDAN KHEL GHAR</p>{" "}
                {/* Placeholder for Stamp/Sign */}
                <div className="h-10"></div>
                <p className="text-xs font-bold border-t border-black/50 inline-block px-8 pt-1">
                  Authorized Signatory
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] mt-2 text-gray-500">
          THANKS VISIT AGAIN
        </div>
      </div>
    </div>
  );
};

export default InvoiceA4;
