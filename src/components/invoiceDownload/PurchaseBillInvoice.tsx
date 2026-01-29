import React, { useMemo } from "react";
// import { PrintIcon } from "../function/functions";
import Logo from "./image.svg";

// --- 1. Interface for YOUR API Response ---
interface VendorDetails {
  vend_name: string;
  address?: string;
  city: string;
  state: string;
  country: string;
  gst_no: string;
  payment_term?: string;
  phone?: string;
  email?: string;
  pan?: string;
}

interface ApiItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  itemcode?: string;
  hsn?: string;
}

interface LogisticsData {
  freight: number;
  loadingUnloading: number;
  insurance: number;
  otherCharges: number;
}

export interface ApiResponse {
  billNo: string;
  billDate: string;
  storeName: string;
  vendorDetails: VendorDetails;
  items: ApiItem[];
  logistics: LogisticsData;
  itemValue: number;
  taxableAmount: number;
  taxAmount: number;
  billDiscount: number;
  billDiscountPercent: number;
  roundOff: number;
  docAmount: number;
  remarks?: string;
  transport?: number | string;
}

// --- 2. Interfaces for the UI ---

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
  billDiscount?: number;
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
    billDiscount: number;
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
    bundles: string;
    chargesPaid: string;
    docExtraInfo: string;
    remarks: string;
  };
  signatory: {
    companyName: string;
  };
}

// --- 3. Utilities ---

const numberToWords = (num: number): string => {
  const a = [
    "",
    "One ",
    "Two ",
    "Three ",
    "Four ",
    "Five ",
    "Six ",
    "Seven ",
    "Eight ",
    "Nine ",
    "Ten ",
    "Eleven ",
    "Twelve ",
    "Thirteen ",
    "Fourteen ",
    "Fifteen ",
    "Sixteen ",
    "Seventeen ",
    "Eighteen ",
    "Nineteen ",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if ((num = num.toString().length > 9 ? parseFloat("overflow") : num))
    return "overflow";
  const n = ("000000000" + num.toFixed(2))
    .substr(-11)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return "";
  let str = "";
  str +=
    Number(n[1]) !== 0
      ? (a[Number(n[1])] || b[n[1][0] as any] + " " + a[n[1][1] as any]) +
        "Crore "
      : "";
  str +=
    Number(n[2]) !== 0
      ? (a[Number(n[2])] || b[n[2][0] as any] + " " + a[n[2][1] as any]) +
        "Lakh "
      : "";
  str +=
    Number(n[3]) !== 0
      ? (a[Number(n[3])] || b[n[3][0] as any] + " " + a[n[3][1] as any]) +
        "Thousand "
      : "";
  str +=
    Number(n[4]) !== 0
      ? (a[Number(n[4])] || b[n[4][0] as any] + " " + a[n[4][1] as any]) +
        "Hundred "
      : "";
  str +=
    Number(n[5]) !== 0
      ? (str !== "" ? "and " : "") +
        (a[Number(n[5])] || b[n[5][0] as any] + " " + a[n[5][1] as any]) +
        "Only "
      : "";
  return str;
};

// --- Component ---

const PurchaseBillInvoice: React.FC<{ data?: ApiResponse }> = ({ data }) => {
  // DEBUG: Print API response to console
  if (data) {
    console.log("🧾 Invoice Response Data:", data);
  }

  // --- Mapper: Convert API JSON -> Invoice UI Format ---
  const invoice: InvoiceData = useMemo(() => {
    if (!data) return defaultAutomobileData;

    const billDateFormatted = new Date(data.billDate).toLocaleDateString(
      "en-GB",
    );

    // Helpers to fix "null" issues
    const safeStr = (val: any) =>
      val && val !== "null" && val !== null ? String(val) : "";

    const joinAddress = (parts: any[], separator: string = ", ") =>
      parts
        .filter((p) => p && String(p).trim() !== "" && String(p) !== "null")
        .join(separator);

    // Tax Split Logic
    const totalTax = data.taxAmount || 0;
    const cgst = totalTax / 2;
    const sgst = totalTax / 2;

    return {
      header: {
        title: "PURCHASE INVOICE",
        subTitle: "",
        originalFor: "Original For Recipient",
        logoUrl: Logo,
      },
      // Seller = Vendor (Address Logic Updated)
      seller: {
        name: safeStr(data.vendorDetails.vend_name),
        addressLine1:
          safeStr(data.vendorDetails.address) ||
          joinAddress(
            [data.vendorDetails.city, data.vendorDetails.state],
            ", ",
          ),
        addressLine2: safeStr(data.vendorDetails.country),
        cityStateZip: joinAddress(
          [data.vendorDetails.city, data.vendorDetails.state],
          " - ",
        ),
        gstin: safeStr(data.vendorDetails.gst_no),
        phone: safeStr(data.vendorDetails.phone),
        email: safeStr(data.vendorDetails.email),
        pan: safeStr(data.vendorDetails.pan),
      },
      invoiceDetails: {
        invoiceNo: safeStr(data.billNo),
        invoiceDate: billDateFormatted,
        reverseCharge: "No",
        placeOfSupply: safeStr(data.vendorDetails.state),
        station: safeStr(data.vendorDetails.city),
        ewayBillNo: "",
        vehicleNo: String(data.transport || ""),
        grRrNo: "",
        distance: "",
        shippingCompany: "",
      },
      // Billing = My Store (API missing address, using empty strings to avoid 'null')
      billing: {
        name: safeStr(data.storeName),
        addressLine1: "",
        addressLine2: "",
        cityStateZip: "",
        gstin: "",
        pan: "",
      },
      // Shipping = My Store
      shipping: {
        name: safeStr(data.storeName),
        addressLine1: "",
        addressLine2: "",
        cityStateZip: "",
      },
      items: data.items.map((item, index) => ({
        sNo: index + 1,
        description: safeStr(item.description),
        hsnSac: safeStr(item.hsn),
        packQty: 0,
        qty: item.quantity,
        uom: "NOS",
        rate: item.rate,
        discountPercent: data.billDiscountPercent || 0,
        amount: item.amount,
        billDiscount: 0,
      })),
      totals: {
        subTotal: data.itemValue,
        billDiscount: data.billDiscount || 0,
        taxableAmount: data.taxableAmount,
        cgst: cgst,
        sgst: sgst,
        cess: 0,
        roundOff: data.roundOff,
        grandTotal: data.docAmount,
        amountInWords: `INR ${numberToWords(Math.round(data.docAmount))}`,
        taxAmountInWords: `INR ${numberToWords(Math.round(data.taxAmount))}`,
      },
      taxTable: [
        {
          rate: "Tax (Derived)",
          taxableValue: data.taxableAmount,
          cgst: cgst,
          sgst: sgst,
          igst: 0,
          totalTax: totalTax,
        },
      ],
      logistics: {
        mode: "Road",
        weight: "0.00",
        bundles: "0.00",
        chargesPaid: String(data.logistics?.freight || "0.00"),
        docExtraInfo: "",
        remarks: safeStr(data.remarks),
      },
      signatory: {
        companyName: safeStr(data.storeName),
      },
    };
  }, [data]);

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* --- PRINT STYLES: Isolates the invoice during print --- */}
      <style>
        {`
          @media print {
            /* Hide everything in the body */
            body * {
              visibility: hidden;
            }
            
            /* Make the invoice container visible */
            #printable-invoice-area, #printable-invoice-area * {
              visibility: visible;
            }

            /* Position the invoice at the very top-left of the page */
            #printable-invoice-area {
              position: fixed;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              background-color: white;
              z-index: 99999;
            }

            /* Remove default browser headers/footers margin if supported */
            @page {
              margin: 5mm; 
              size: auto;
            }
            
            /* Hide the Print Button in the UI if it isn't already hidden */
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      {/* Wrapper ID for targeting in print CSS */}
      <div id="printable-invoice-area" className="h-auto bg-white">
        {/* --- Print Button Section (Hidden during print via Tailwind & CSS) --- */}
        <div className="w-full flex justify-center py-6 print:hidden no-print bg-gray-50 border-b">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-full shadow-lg transition-all flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
              />
            </svg>
            Print Invoice
          </button>
        </div>

        <div className="bg-white flex flex-col items-center m-8 print:m-0">
          {/* --- Invoice Sheet (A4) --- */}
          <div className="max-w-[210mm] w-full text-black font-sans text-[10px] leading-tight print:w-full mx-auto border border-black box-border">
            {/* --- Header Section --- */}
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
                    {/* <th className="border-r border-black w-12">Discount</th> */}
                    <th className="w-24 px-2 text-right">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="h-8 align-top text-center">
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
                      {/* <td className="border-r border-black py-2 text-right px-2">
                        {item.billDiscount}
                      </td> */}
                      <td className="py-2 text-right px-2 font-bold">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}

                  {/* Filler Rows to maintain height */}
                  <tr className="h-[300px] border-b border-black">
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    {/* <td className="border-r border-black"></td> */}
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
                    {/* <td className="border-r border-black"></td> */}
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
                    {invoice.totals.billDiscount > 0 ? "-" : ""}
                    {formatCurrency(Math.abs(invoice.totals.billDiscount))}
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
    </>
  );
};

// --- Default Data for Fallback (Mock) ---
const defaultAutomobileData: InvoiceData = {
  header: {
    title: "PURCHASE INVOICE",
    subTitle: "",
    originalFor: "Original For Recipient",
    logoUrl: Logo,
  },
  seller: {
    name: "Sample Vendor",
    addressLine1: "123 Market Street",
    addressLine2: "",
    cityStateZip: "New Delhi - 110034",
    gstin: "07AAPPK4961R1ZR",
    pan: "AAPPK4961R",
  },
  invoiceDetails: {
    invoiceNo: "00000",
    invoiceDate: "01/01/2026",
    reverseCharge: "No",
    placeOfSupply: "Delhi",
    station: "Delhi",
  },
  billing: {
    name: "My Store",
    addressLine1: "Store Address",
    addressLine2: "",
    cityStateZip: "State - Zip",
  },
  shipping: {
    name: "My Store",
    addressLine1: "Store Address",
    addressLine2: "",
    cityStateZip: "State - Zip",
  },
  items: [],
  totals: {
    subTotal: 0,
    billDiscount: 0,
    taxableAmount: 0,
    cgst: 0,
    sgst: 0,
    cess: 0,
    roundOff: 0,
    grandTotal: 0,
    amountInWords: "Zero Only",
    taxAmountInWords: "Zero Only",
  },
  taxTable: [],
  logistics: {
    mode: "",
    weight: "",
    bundles: "",
    chargesPaid: "",
    docExtraInfo: "",
    remarks: "",
  },
  signatory: {
    companyName: "My Store",
  },
};

export default PurchaseBillInvoice;
