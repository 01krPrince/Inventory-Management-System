import React from "react";
// import { PrintIcon } from "../function/functions";
import Logo from "./image.svg";

// --- Types for Dynamic Data ---

interface AddressDetails {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  cityStateZip: string;
  gstin?: string;
  pan?: string;
  phone?: string;
  email?: string;
}

interface LineItem {
  sNo: number;
  description: string;
  hsnSac: string;
  packQty: number;
  qty: number;
  uom: string;
  rate: number;
  discountPercent: number;
  amount: number;
}

interface TaxBreakdown {
  rate: string;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
}

interface InvoiceData {
  header: {
    title: string;
    subTitle: string;
    originalFor: string;
    logoUrl: string;
  };
  seller: AddressDetails;
  invoiceDetails: {
    invoiceNo: string;
    invoiceDate: string;
    reverseCharge: string;
    placeOfSupply: string;
    station: string;
    ewayBillNo?: string;
    vehicleNo?: string;
    grRrNo?: string;
    distance?: string;
    shippingCompany?: string;
  };
  billing: AddressDetails;
  shipping: AddressDetails;
  items: LineItem[];
  totals: {
    subTotal: number;
    discount: number;
    taxableAmount: number;
    cgst: number;
    sgst: number;
    cess: number;
    roundOff: number;
    grandTotal: number;
    amountInWords: string;
    taxAmountInWords: string;
  };
  taxTable: TaxBreakdown[];
  logistics: {
    mode: string;
    weight: string;
    bundles: string; // "No of Packets"
    chargesPaid: string;
    docExtraInfo: string;
    remarks: string; // Narration
  };
  signatory: {
    companyName: string;
  };
}

// --- Component ---

const PurchaseBillInvoice: React.FC<{ data?: InvoiceData }> = ({ data }) => {
  const invoice = data || defaultAutomobileData;

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="h-auto bg-white print:p-0 print:bg-white print:block">
      <div className="bg-white flex flex-col items-center m-8">
        {/* --- Invoice Sheet (A4) --- */}
        <div className="max-w-[210mm] w-full text-black font-sans text-[10px] leading-tight print:w-full mx-auto border border-black box-border">
          {/* --- Header Section --- */}
          {/* Increased padding from p-2 to p-4 */}
          <div className="p-4 border-b border-black">
            {/* Top Row: GSTIN - Title - Original For */}
            <div className="flex justify-between items-start mb-2">
              <div className="font-bold w-1/4">
                GSTIN : {invoice.seller.gstin}
              </div>
              <div className="font-bold underline uppercase text-sm w-1/2 text-center">
                {invoice.header.title}
              </div>
              <div className="font-bold w-1/4 text-right text-[9px]">
                {invoice.header.originalFor}
              </div>
            </div>

            {/* Main Header Info (Logo + Address) */}
            <div className="relative min-h-[80px]">
              <div className="absolute top-0 left-0 w-36 h-full flex flex-col items-center justify-center">
                <img
                  src={invoice.header.logoUrl || Logo}
                  alt="Logo"
                  className="w-16 h-12 object-contain mb-1"
                />
                <div className="font-bold text-red-600 uppercase text-[9px] tracking-tighter text-center leading-none">
                  {invoice.header.subTitle}
                </div>
              </div>

              <div className="w-full text-center px-24">
                <h1 className="text-xl font-bold text-black mb-1">
                  {invoice.seller.name}
                </h1>
                <p>{invoice.seller.addressLine1}</p>
                <p>{invoice.seller.addressLine2}</p>
                <p>{invoice.seller.cityStateZip}</p>
                <div className="mt-1 font-bold">
                  Phone No: {invoice.seller.phone} | Email:{" "}
                  {invoice.seller.email}
                </div>
                <div className="font-bold">PAN No: {invoice.seller.pan}</div>
              </div>
            </div>
          </div>

          {/* --- Invoice Details Grid --- */}
          {/* Increased padding in cells (px-2 py-1) */}
          <div className="grid grid-cols-2 border-b border-black text-[10px]">
            {/* Left Column */}
            <div className="border-r border-black">
              <div className="flex px-2 py-1">
                <span className="w-28 font-bold">Invoice No.</span>
                <span>: {invoice.invoiceDetails.invoiceNo}</span>
              </div>
              <div className="flex px-2 py-1">
                <span className="w-28 font-bold">Invoice Date</span>
                <span>: {invoice.invoiceDetails.invoiceDate}</span>
              </div>
              <div className="flex px-2 py-1">
                <span className="w-28 font-bold">Reverse Charge</span>
                <span>: {invoice.invoiceDetails.reverseCharge}</span>
              </div>
              <div className="flex px-2 py-1">
                <span className="w-28 font-bold">Eway Bill No & Date</span>
                <span>: {invoice.invoiceDetails.ewayBillNo}</span>
              </div>
              <div className="flex px-2 py-1">
                <span className="w-28 font-bold">Distance</span>
                <span>: {invoice.invoiceDetails.distance}</span>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="flex px-2 py-1">
                <span className="w-28 font-bold">Shipping Company</span>
                <span>: {invoice.invoiceDetails.shippingCompany}</span>
              </div>
              <div className="flex px-2 py-1">
                <span className="w-28 font-bold">Vehicle No</span>
                <span>: {invoice.invoiceDetails.vehicleNo}</span>
              </div>
              <div className="flex px-2 py-1">
                <span className="w-28 font-bold">Place of Supply</span>
                <span>: {invoice.invoiceDetails.placeOfSupply}</span>
              </div>
              <div className="flex px-2 py-1">
                <span className="w-28 font-bold">GR /RR.No</span>
                <span>: {invoice.invoiceDetails.grRrNo}</span>
              </div>
              <div className="flex px-2 py-1">
                <span className="w-28 font-bold">Station</span>
                <span>: {invoice.invoiceDetails.station}</span>
              </div>
            </div>
          </div>

          {/* --- Addresses --- */}
          <div className="flex border-b border-black min-h-[140px]">
            {/* Billing */}
            <div className="w-1/2 border-r border-black flex flex-col">
              <div className="font-bold border-b border-black px-2 py-1">
                Vendor Name & Billing Address
              </div>
              {/* Increased padding to p-3 */}
              <div className="p-3 flex-grow">
                <div className="font-bold uppercase">
                  {invoice.billing.name}
                </div>
                <div>{invoice.billing.addressLine1}</div>
                <div>{invoice.billing.addressLine2}</div>
                <div>{invoice.billing.cityStateZip}</div>
                <div className="mt-1">
                  GSTIN / UIN : {invoice.billing.gstin}
                </div>
                <div className="mt-4">Party PAN : {invoice.billing.pan}</div>
              </div>
            </div>
            {/* Shipping */}
            <div className="w-1/2 flex flex-col">
              <div className="font-bold border-b border-black px-2 py-1">
                Shipping Address
              </div>
              {/* Increased padding to p-3 */}
              <div className="p-3 flex-grow">
                <div className="whitespace-pre-wrap">
                  {invoice.shipping.name} , {invoice.shipping.addressLine1} ,
                  {invoice.shipping.addressLine2}
                  {invoice.shipping.cityStateZip}
                </div>

                <div className="mt-4">Phone : {invoice.shipping.phone}</div>
                <div className="mt-4">Ref: HS/29652</div>
              </div>
            </div>
          </div>

          {/* --- Items Table --- */}
          <div className="w-full">
            <table className="w-full border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-black font-bold text-center h-8">
                  <th className="border-r border-black w-8">S No</th>
                  <th className="border-r border-black text-center w-64">
                    Description
                  </th>
                  <th className="border-r border-black w-16">HSN / SAC</th>
                  <th className="border-r border-black w-12">Pack Qty</th>
                  <th className="border-r border-black w-10">Qty</th>
                  <th className="border-r border-black w-10">UOM</th>
                  <th className="border-r border-black w-20">Item Rate</th>
                  <th className="border-r border-black w-12">Discount</th>
                  <th className="w-24 px-2 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="h-8 align-top text-center">
                    {/* Increased padding in all TDs */}
                    <td className="border-r border-black py-2 px-1">
                      {item.sNo}
                    </td>
                    <td className="border-r border-black text-left px-2 py-2">
                      {item.description}
                    </td>
                    <td className="border-r border-black py-2">
                      {item.hsnSac}
                    </td>
                    <td className="border-r border-black py-2">
                      {item.packQty}
                    </td>
                    <td className="border-r border-black py-2">{item.qty}</td>
                    <td className="border-r border-black py-2">{item.uom}</td>
                    <td className="border-r border-black py-2 text-right px-2">
                      {formatCurrency(item.rate)}
                    </td>
                    <td className="border-r border-black py-2 text-right px-2">
                      {item.discountPercent.toFixed(2)} %
                    </td>
                    <td className="py-2 text-right px-2 font-bold">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}

                {/* Filler Rows */}
                <tr className="h-48 border-b border-black">
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td></td>
                </tr>

                {/* Table Totals Row */}
                <tr className="font-bold border-b border-black text-center h-8">
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black text-right px-2 py-1">
                    Total
                  </td>
                  <td className="border-r border-black text-center py-1">
                    {invoice.items
                      .reduce((a, b) => a + b.packQty, 0)
                      .toFixed(2)}
                  </td>
                  <td className="border-r border-black text-center py-1">
                    {invoice.items.reduce((a, b) => a + b.qty, 0).toFixed(2)}
                  </td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td className="text-right px-2 py-1">
                    {formatCurrency(invoice.totals.subTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* --- Footer Section --- */}
          <div className="flex border-b border-black">
            {/* LEFT SIDE */}
            <div className="w-[65%] border-r border-black flex flex-col justify-between">
              {/* Narration Row */}
              <div className="border-b border-black px-2 py-2 flex">
                <span className="font-bold w-16">Narration</span>
                <span>: {invoice.logistics.remarks}</span>
              </div>

              {/* Logistics Info Row */}
              <div className="border-b border-black px-2 py-2 flex h-auto min-h-[64px]">
                <div className="w-1/2">
                  <div className="flex">
                    <span className="font-bold w-24">Logistics Info</span>
                    <span>:</span>
                  </div>
                  <div className="flex">
                    <span className="w-24">Charges Paid</span>
                    <span>: {invoice.logistics.chargesPaid}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24">No of Packets</span>
                    <span>: {invoice.logistics.bundles}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24">Doc extra info</span>
                    <span>: {invoice.logistics.docExtraInfo}</span>
                  </div>
                </div>
                <div className="w-1/2 pl-4">
                  <div className="flex">
                    <span className="w-12">Mode</span>
                    <span>: {invoice.logistics.mode}</span>
                  </div>
                  <div className="flex">
                    <span className="w-12">Weight</span>
                    <span>: {invoice.logistics.weight}</span>
                  </div>
                </div>
              </div>

              {/* Tax Table (Nested) */}
              <div className="flex-grow">
                <table className="w-full text-center border-collapse text-[9px]">
                  <thead>
                    <tr className="border-b border-black font-bold">
                      <th className="border-r border-black py-1 px-2 text-left">
                        Tax Rate
                      </th>
                      <th className="border-r border-black py-1">
                        Taxable Value
                      </th>
                      <th className="border-r border-black py-1">
                        CGST Amount
                      </th>
                      <th className="border-r border-black py-1">
                        SGST Amount
                      </th>
                      <th className="border-r border-black py-1">
                        IGST Amount
                      </th>
                      <th className="py-1">Total Tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.taxTable.map((tax, i) => (
                      <tr key={i} className="font-bold">
                        <td className="border-r border-black py-1 px-2 text-left">
                          {tax.rate}
                        </td>
                        <td className="border-r border-black py-1 text-right px-2">
                          {formatCurrency(tax.taxableValue)}
                        </td>
                        <td className="border-r border-black py-1 text-right px-2">
                          {formatCurrency(tax.cgst)}
                        </td>
                        <td className="border-r border-black py-1 text-right px-2">
                          {formatCurrency(tax.sgst)}
                        </td>
                        <td className="border-r border-black py-1 text-right px-2">
                          {formatCurrency(tax.igst)}
                        </td>
                        <td className="py-1 text-right px-2">
                          {formatCurrency(tax.totalTax)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tax Words */}
              <div className="border-t border-black px-2 py-1 font-bold">
                Tax Amount : {invoice.totals.taxAmountInWords}
              </div>
              {/* Bill Amount Words */}
              <div className="border-t border-black px-2 py-1 font-bold">
                Bill Amount : {invoice.totals.amountInWords}
              </div>
            </div>

            {/* RIGHT SIDE: Totals List */}
            <div className="w-[35%] text-[10px]">
              <div className="flex justify-between px-2 py-1">
                <span className="font-bold">Sub Total</span>
                <span className="font-bold">
                  {formatCurrency(invoice.totals.subTotal)}
                </span>
              </div>
              <div className="flex justify-between px-2 py-1">
                <span>Discount</span>
                <span>
                  {invoice.totals.discount < 0 ? "" : "-"}
                  {formatCurrency(Math.abs(invoice.totals.discount))}
                </span>
              </div>
              <div className="flex justify-between px-2 py-1">
                <span className="font-bold">Taxable Amount</span>
                <span className="font-bold">
                  {formatCurrency(invoice.totals.taxableAmount)}
                </span>
              </div>
              <div className="flex justify-between px-2 py-1">
                <span>CGST</span>
                <span>{formatCurrency(invoice.totals.cgst)}</span>
              </div>
              <div className="flex justify-between px-2 py-1">
                <span>SGST/UTGST</span>
                <span>{formatCurrency(invoice.totals.sgst)}</span>
              </div>
              <div className="flex justify-between px-2 py-1">
                <span>CESS</span>
                <span>{formatCurrency(invoice.totals.cess)}</span>
              </div>
              <div className="flex justify-between px-2 py-1">
                <span>Round Off</span>
                <span>{invoice.totals.roundOff}</span>
              </div>

              <div className="border-t border-black mt-1 px-2 py-2 flex justify-between items-center text-sm font-bold">
                <span>Bill Total</span>
                <span>{formatCurrency(invoice.totals.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* --- Bottom Footer (Signatories) --- */}
          <div className="flex h-24">
            <div className="w-1/2 border-r border-black">
              {/* Empty space */}
            </div>
            <div className="w-1/2 p-4 flex flex-col justify-between items-end relative">
              <div className="font-bold text-[10px] w-full text-left border-b border-black mb-1 pb-1">
                Receiver's Signature
              </div>

              <div className="text-center w-full mt-4">
                <div className="font-bold text-[10px] mb-8">
                  For {invoice.signatory.companyName}
                </div>
                <div className="font-bold text-[10px]">
                  Authorised Signatory
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[210mm] w-full text-right text-[9px] px-2 py-1 print:w-full mx-auto">
          Page : 1/1
        </div>
      </div>
    </div>
  );
};

// --- Default Data ---

const defaultAutomobileData: InvoiceData = {
  header: {
    title: "PURCHASE INVOICE",
    subTitle: "",
    originalFor: "Original For Recipient",
    logoUrl: Logo,
  },
  seller: {
    name: "Sample Company - Automobile",
    addressLine1:
      "1209-1212, R.G. Trade Tower, 12th Floor, Netaji Subhash Place,",
    addressLine2: "New Delhi, Delhi - 110034, India",
    cityStateZip: "",
    phone: "9169171616",
    email: "support@alignbooks.com",
    gstin: "07AAPPK4961R1ZR",
    pan: "AAPPK4961R",
  },
  invoiceDetails: {
    invoiceNo: "01305/22-23",
    invoiceDate: "31/03/2023",
    reverseCharge: "No",
    placeOfSupply: "Maharashtra",
    station: "PUNE",
    ewayBillNo: "",
    vehicleNo: "",
    grRrNo: "",
    distance: "",
    shippingCompany: "",
  },
  billing: {
    name: "R M ENTERPRISES (PANVEL)",
    addressLine1: "SHIVJI MARKET VASHI NAVI MUMBAI SECTOR-19D OFFICE NO-",
    addressLine2: "103/104",
    cityStateZip: "Maharashtra 400705\nNAVIMUMBAI, Maharashtra - 400705, India",
    gstin: "27AABPR7755E1ZH",
    pan: "AABPR7755E",
  },
  shipping: {
    name: "Samsung Smart Cafe , Shop No-1,2 ,Sai Shanti Bhawan ,",
    addressLine1: "Sector-19 , Plot No-17, New Panvel",
    addressLine2: "NAVIMUMBAI, Maharashtra - 410206",
    cityStateZip: "India",
    phone: "9226978000",
  },
  items: [
    {
      sNo: 1,
      description: "SAMSUNG S21 PHANTOM GRAY 8/128 GB",
      hsnSac: "85171211",
      packQty: 1,
      qty: 1,
      uom: "NOS",
      rate: 58473.7,
      discountPercent: 3.0,
      amount: 58473.7,
    },
    {
      sNo: 2,
      description: "SAMSUNG S21 PHANTOM VIOLET 8/128 GB",
      hsnSac: "85171211",
      packQty: 2,
      qty: 2,
      uom: "NOS",
      rate: 58473.7,
      discountPercent: 3.0,
      amount: 116947.4,
    },
    {
      sNo: 3,
      description: "SAMSUNG S21 PLUS (8/128) VOILET",
      hsnSac: "85171211",
      packQty: 1,
      qty: 1,
      uom: "NOS",
      rate: 68643.2,
      discountPercent: 3.0,
      amount: 68643.2,
    },
    {
      sNo: 4,
      description: "SAMSUNG S21 ULTRA 12/256 PHANTOM BLACK",
      hsnSac: "85171211",
      packQty: 3,
      qty: 3,
      uom: "NOS",
      rate: 80507.6,
      discountPercent: 3.0,
      amount: 241522.8,
    },
  ],
  totals: {
    subTotal: 485587.1,
    discount: -14567.61,
    taxableAmount: 471019.49,
    cgst: 42391.76,
    sgst: 42391.76,
    cess: 0.0,
    roundOff: -0.01,
    grandTotal: 555803.0,
    amountInWords: "INR Five Lakh Fifty Five Thousand Eight Hundred Three Only",
    taxAmountInWords:
      "INR Eighty Four Thousand Seven Hundred Eighty Three and Fifty Two Paisa Only",
  },
  taxTable: [
    {
      rate: "TAX@18%",
      taxableValue: 471019.49,
      cgst: 42391.76,
      sgst: 42391.76,
      igst: 0.0,
      totalTax: 84783.52,
    },
  ],
  logistics: {
    mode: "Road",
    weight: "0.00",
    bundles: "0.00",
    chargesPaid: "0.00",
    docExtraInfo: "",
    remarks:
      "Being Goods Purchase From R M ENTERPRISES (PANVEL) Ref No :: HS/29652 Ref Date :: 31/03/2023",
  },
  signatory: {
    companyName: "Sample Company - Automobile",
  },
};

export default PurchaseBillInvoice;
