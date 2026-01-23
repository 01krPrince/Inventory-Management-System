import React from "react";

import Logo from "./image.svg";
// --- Types for Dynamic Data ---

interface AddressDetails {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  cityStateZip: string;
  gstin: string;
  phone?: string;
  email?: string;
}

interface LineItem {
  sNo: number;
  description: string;
  hsnSac: string;
  qty: number;
  uom: string;
  rate: number;
  discount: number;
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
    originalFor: string;
    logoUrl: string;
  };
  seller: AddressDetails & { stateCode: string };
  billDetails: {
    billNo: string;
    billDate: string;
    supplierBillNo: string;
    supplierBillDate: string;
  };
  vendor: AddressDetails & { contactPerson?: string };
  shipping: AddressDetails;
  items: LineItem[];
  totals: {
    subTotal: number;
    transport: number;
    taxableAmount: number;
    igst: number;
    roundOff: number;
    grandTotal: number;
    amountInWords: string;
  };
  taxTable: TaxBreakdown[];
  bankDetails: {
    bankName: string;
    ifsc: string;
    accountNo: string;
  };
  terms: string[];
}

// --- Component ---

const PurchaseOrderInvoice: React.FC<{ data?: InvoiceData }> = ({ data }) => {
  const invoice = data || defaultInvoiceData;

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="max-w-[210mm] mx-auto bg-white text-black font-sans text-[11px]  leading-tight print:m-0 print:w-full">
      {/* --- Main Invoice Box (Bordered) --- */}
      <div className="border border-black box-border">
        {/* --- Top Info Row --- */}
        <div className="flex justify-between items-end px-2 pt-2 pb-1">
          <div className="font-bold w-1/3">GSTIN: {invoice.seller.gstin}</div>
          <div className="w-1/3 text-center">
            <h1 className="text-sm font-bold underline uppercase tracking-wide">
              {invoice.header.title}
            </h1>
          </div>
          <div className="font-bold w-1/3 text-right">
            {invoice.header.originalFor}
          </div>
        </div>

        {/* --- Header Section (Logo + Address) --- */}
        <div className="relative border-b border-black pb-2 px-2">
          {/* Logo Positioned Absolutely */}
          <div className="absolute top-0 left-2 w-20 h-20 flex items-center justify-center overflow-hidden">
            <img
              src={Logo}
              alt="Logo"
              className="object-contain w-full h-full"
            />
          </div>

          {/* Centered Address Text */}
          <div className="w-full text-center pl-24 pr-24">
            <h2 className="text-xl font-bold uppercase mb-1">
              {invoice.seller.name}
            </h2>
            <p>{invoice.seller.addressLine1}</p>
            <p>{invoice.seller.cityStateZip}</p>
            <p className="font-bold mt-1">
              Phone No: {invoice.seller.phone} | Email: {invoice.seller.email}
            </p>
            <p className="mt-1">State Code : {invoice.seller.stateCode}</p>
          </div>
        </div>

        {/* --- Bill Details Grid --- */}
        <div className="grid grid-cols-2 border-b border-black">
          {/* Left Column */}
          <div className="border-r border-black">
            <div className="flex border-b border-black">
              <span className="w-32 font-bold px-1 py-0.5 border-r border-black/0">
                Bill No
              </span>
              <span className="px-1 py-0.5 font-bold">
                : {invoice.billDetails.billNo}
              </span>
            </div>
            <div className="flex">
              <span className="w-32 font-bold px-1 py-0.5 border-r border-black/0">
                Bill Date
              </span>
              <span className="px-1 py-0.5 font-bold">
                : {invoice.billDetails.billDate}
              </span>
            </div>
          </div>
          {/* Right Column */}
          <div>
            <div className="flex border-b border-black">
              <span className="w-32 font-bold px-1 py-0.5">
                Supplier Bill No
              </span>
              <span className="px-1 py-0.5">
                : {invoice.billDetails.supplierBillNo}
              </span>
            </div>
            <div className="flex">
              <span className="w-32 font-bold px-1 py-0.5">
                Supplier Bill Date
              </span>
              <span className="px-1 py-0.5">
                : {invoice.billDetails.supplierBillDate}
              </span>
            </div>
          </div>
        </div>

        {/* --- Address Section --- */}
        <div className="flex border-b border-black">
          {/* Vendor/Billing */}
          <div className="w-1/2 border-r border-black flex flex-col">
            <div className="font-bold bg-[#eff6ff] border-b border-black px-1 py-0.5">
              Vendor Name & Billing Address
            </div>
            <div className="p-1 flex-grow">
              <div className="font-bold uppercase text-[#1a3c6e]">
                {invoice.vendor.name}
              </div>
              <div className="uppercase">{invoice.vendor.addressLine1}</div>
              <div className="uppercase">{invoice.vendor.addressLine2}</div>
              <div className="uppercase">{invoice.vendor.cityStateZip}</div>
              <div className="mt-1 uppercase">
                GSTIN / UIN : {invoice.vendor.gstin}
              </div>
            </div>
            <div className="border-t border-black px-1 py-0.5">
              Party Contact Person : {invoice.vendor.contactPerson}
            </div>
          </div>

          {/* Shipping */}
          <div className="w-1/2 flex flex-col">
            <div className="font-bold bg-[#eff6ff] border-b border-black px-1 py-0.5">
              Shipping Address
            </div>
            <div className="p-1 flex-grow">
              <div className="font-bold uppercase text-[#1a3c6e]">
                {invoice.shipping.name}
              </div>
              <div className="uppercase">{invoice.shipping.addressLine1}</div>
              <div className="uppercase">{invoice.shipping.cityStateZip}</div>
              <div className="mt-1 uppercase">
                GSTIN : {invoice.shipping.gstin}
              </div>
              <div>Phone : {invoice.shipping.phone}</div>
              <div>Email : {invoice.shipping.email}</div>
            </div>
          </div>
        </div>

        {/* --- Items Table --- */}
        <div className="w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-black text-center font-bold">
                <th className="border-r border-black w-8 py-1">S No</th>
                <th className="border-r border-black text-left px-2 py-1">
                  Description
                </th>
                <th className="border-r border-black w-20 py-1">HSN / SAC</th>
                <th className="border-r border-black w-12 py-1">Qty</th>
                <th className="border-r border-black w-10 py-1">UOM</th>
                <th className="border-r border-black w-16 py-1">Item Rate</th>
                <th className="border-r border-black w-10 py-1">Disc %</th>
                <th className="py-1 w-20 px-1 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              {/* Main Item Rows */}
              {invoice.items.map((item, index) => (
                <tr key={index} className="text-center align-top h-[300px]">
                  <td className="border-r border-black py-1">{item.sNo}</td>
                  <td className="border-r border-black text-left px-2 py-1 font-medium">
                    {item.description}
                  </td>
                  <td className="border-r border-black py-1">{item.hsnSac}</td>
                  <td className="border-r border-black py-1">
                    {formatCurrency(item.qty)}
                  </td>
                  <td className="border-r border-black py-1">{item.uom}</td>
                  <td className="border-r border-black py-1">
                    {formatCurrency(item.rate)}
                  </td>
                  <td className="border-r border-black py-1">
                    {item.discount}%
                  </td>
                  <td className="py-1 text-right px-1 font-bold">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}

              {/* Totals Row */}
              <tr className="border-t border-black font-bold h-6">
                <td className="border-r border-black"></td> {/* S No */}
                <td className="border-r border-black text-right px-2">
                  Total
                </td>{" "}
                {/* Description */}
                <td className="border-r border-black"></td> {/* HSN */}
                <td className="border-r border-black text-center">
                  {formatCurrency(invoice.items.reduce((a, b) => a + b.qty, 0))}
                </td>{" "}
                {/* Qty */}
                <td className="border-r border-black"></td> {/* UOM */}
                <td className="border-r border-black"></td> {/* Rate */}
                <td className="border-r border-black"></td> {/* Disc */}
                <td className="text-right px-1">
                  {formatCurrency(invoice.totals.subTotal)}
                </td>{" "}
                {/* Amount */}
              </tr>
            </tbody>
          </table>
        </div>

        {/* --- Footer / Totals Section --- */}
        <div className="flex border-t border-black items-stretch">
          {/* Left Side: Tax Table + Details */}
          <div className="w-[68%] border-r border-black flex flex-col">
            {/* Tax Table */}
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="border-b border-black font-bold text-[10px]">
                  <th className="border-r border-black py-1 w-16">Tax Rate</th>
                  <th className="border-r border-black py-1">Taxable Value</th>
                  <th className="border-r border-black py-1">CGST Amount</th>
                  <th className="border-r border-black py-1">SGST Amount</th>
                  <th className="border-r border-black py-1">IGST Amount</th>
                  <th className="py-1">Total Tax</th>
                </tr>
              </thead>
              <tbody>
                {invoice.taxTable.map((tax, i) => (
                  <tr key={i} className="border-b border-black last:border-b-0">
                    <td className="border-r border-black py-1 font-bold">
                      {tax.rate}
                    </td>
                    <td className="border-r border-black py-1 text-right px-1">
                      {formatCurrency(tax.taxableValue)}
                    </td>
                    <td className="border-r border-black py-1 text-right px-1">
                      {formatCurrency(tax.cgst)}
                    </td>
                    <td className="border-r border-black py-1 text-right px-1">
                      {formatCurrency(tax.sgst)}
                    </td>
                    <td className="border-r border-black py-1 text-right px-1">
                      {formatCurrency(tax.igst)}
                    </td>
                    <td className="py-1 text-right px-1 font-bold">
                      {formatCurrency(tax.totalTax)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Amount In Words & Details */}
            {/* Removed flex-grow/justify-end to prevent gap between table and details */}
            <div>
              <div className="border-t border-black p-1">
                <div className="flex mb-1 items-center">
                  <span className="font-bold w-24 text-[#1a3c6e]">
                    Tax Amount
                  </span>
                  <span className="font-bold text-[#1a3c6e]">
                    : INR {invoice.totals.amountInWords}
                  </span>
                </div>

                <div className="flex mt-2 mb-1 text-[10px] text-gray-600">
                  <span className="font-bold w-16 text-black">Remarks</span>
                  <span className="text-black">
                    : Being Goods Purchase From {invoice.vendor.name} Ref No ::{" "}
                    {invoice.billDetails.supplierBillNo}
                  </span>
                </div>

                <div className="border-t border-black pt-1 mt-1 font-bold">
                  <div className="uppercase">BANK OF BARODA</div>
                  <div className="uppercase">
                    IFSC No. {invoice.bankDetails.ifsc}
                  </div>
                  <div className="uppercase">
                    Account No. {invoice.bankDetails.accountNo}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Totals Summary */}
          <div className="w-[32%] flex flex-col h-full">
            <div className="flex-grow">
              <div className="flex justify-between px-2 py-1">
                <span className="font-bold">Sub Total</span>
                <span className="font-bold">
                  {formatCurrency(invoice.totals.subTotal)}
                </span>
              </div>
              <div className="flex justify-between px-2 py-1">
                <span>Transport</span>
                <span>{formatCurrency(invoice.totals.transport)}</span>
              </div>
              <div className="flex justify-between px-2 py-1">
                <span className="font-bold">Taxable Amount</span>
                <span className="font-bold">
                  {formatCurrency(invoice.totals.taxableAmount)}
                </span>
              </div>
              <div className="flex justify-between px-2 py-1">
                <span>IGST</span>
                <span>{formatCurrency(invoice.totals.igst)}</span>
              </div>
              <div className="flex justify-between px-2 py-1">
                <span>Transport</span>
                <span>{formatCurrency(invoice.totals.transport)}</span>
              </div>
              <div className="flex justify-between px-2 py-1">
                <span>Round Off</span>
                <span>{formatCurrency(invoice.totals.roundOff)}</span>
              </div>
            </div>

            <div className="border-t border-black mt-auto">
              <div className="flex justify-between px-2 py-2 text-sm font-bold">
                <span>Bill Total</span>
                <span>{formatCurrency(invoice.totals.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Bottom Footer (Terms & Signatory) --- */}
        <div className="border-t border-black flex">
          <div className="w-1/2 p-2 border-r border-black h-24">
            <div className="font-bold underline mb-1">Terms & Conditions:</div>
            <ul className="list-none pl-0">
              {invoice.terms.map((term, i) => (
                <li key={i}>{term}</li>
              ))}
            </ul>
          </div>
          <div className="w-1/2 p-2 flex flex-col justify-between items-end text-center h-24">
            <div className="font-bold">For {invoice.seller.name}</div>
            <div className="font-bold text-xs">Authorised Signatory</div>
          </div>
        </div>
      </div>
      {/* End of Main Border Box */}

      {/* Pagination (Outside the border) */}
      <div className="text-right text-[9px] px-2 py-1">Page : 1/1</div>
    </div>
  );
};

// --- Default Data ---

const defaultInvoiceData: InvoiceData = {
  header: {
    title: "PURCHASE ORDER",
    originalFor: "Original For Recipient",
    logoUrl:
      "https://img.freepik.com/free-vector/dragon-logo-template_23-2149021422.jpg?w=200",
  },
  seller: {
    name: "SPORTS HUB",
    addressLine1: "VIP Road, Laheriasarai",
    cityStateZip: "Darbhanga, Bihar - 846001, India",
    gstin: "10HACPS7876F1ZF",
    phone: "9852380932, 9905020748",
    email: "sinhasportshub@gmail.com",
    stateCode: "10",
  },
  billDetails: {
    billNo: "00063/25-26",
    billDate: "14/11/2025",
    supplierBillNo: "T/25-26/2292",
    supplierBillDate: "08/11/2025",
  },
  vendor: {
    name: "DELTA SOUVENIRS PRIVATE LIMITED",
    addressLine1: "DELTA SOUVENIRS PRIVATE LIMITED 111 JANTA COLONY",
    addressLine2: "G.T.ROAD NEAR MAQSUDAN",
    cityStateZip: "Punjab 144007, Punjab - 144007, India",
    gstin: "03AAHCD8027C1Z3",
    contactPerson: "DELTA SOUVENIRS PRIVATE LIMITED",
  },
  shipping: {
    name: "SPORTS HUB",
    addressLine1: "VIP Road, Laheriasarai",
    cityStateZip: "Darbhanga, Bihar - 846001,",
    gstin: "10HACPS7876F1ZF",
    phone: "9852380932, 9905020748",
    email: "sinhasportshub@gmail.com",
  },
  items: [
    {
      sNo: 1,
      description: "Printing",
      hsnSac: "NIL Rated",
      qty: 200.0,
      uom: "PCS",
      rate: 23.6,
      discount: 0,
      amount: 4720.0,
    },
  ],
  totals: {
    subTotal: 4720.0,
    transport: 280.0,
    taxableAmount: 4000.0,
    igst: 720.0,
    roundOff: 0.0,
    grandTotal: 5000.0,
    amountInWords: "Seven Hundred Twenty Only",
  },
  taxTable: [
    {
      rate: "TAX @ 18%",
      taxableValue: 4000.0,
      cgst: 0.0,
      sgst: 0.0,
      igst: 720.0,
      totalTax: 720.0,
    },
  ],
  bankDetails: {
    bankName: "BANK OF BARODA",
    ifsc: "BARB0PANDAS",
    accountNo: "5086 0500 0001 11",
  },
  terms: ["E & O.E."],
};

export default PurchaseOrderInvoice;
