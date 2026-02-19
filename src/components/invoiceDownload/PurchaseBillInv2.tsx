import React from "react";
// import { PrintIcon } from "../function/functions";

import Logo from "./image.svg";

// --- Types for Dynamic Data ---

interface AddressDetails {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  cityStateZip: string;
  phone?: string;
  email?: string;
  gstin?: string;
  pan?: string;
}

interface LineItem {
  sNo: number;
  description: string;
  unit: string;
  qty: number;
  itemRate: number;
  itemValue: number;
  taxPercent: number;
  taxAmount: number;
  netAmount: number;
}

interface LogisticsInfo {
  destination: string;
  shippingMode: string;
  documentThrough: string;
  portOfLoading: string;
  portOfDischarge: string;
  vehicleNo: string;
  noOfPackets: string;
  weight: string;
  shippingCompany?: string;
  trackingNo?: string;
  shippingDate?: string;
  chargesPaid?: string;
  docExtraInfo?: string;
}

interface ReferenceInfo {
  refNumber: string;
  refDate: string;
  agRefNumber: string;
  agRefDate: string;
  taxPreference: string;
}

interface PurchaseBillData {
  header: {
    companyName: string;
    addressLine1: string;
    addressLine2: string;
    cityStateZip: string;
    phone: string;
    email: string;
    gstNo: string;
    panNo: string;
    logoUrl: string;
    voucherNo: string;
    date: string;
  };
  vendor: AddressDetails;
  deliveryAddress: {
    addressLine1: string;
    addressLine2?: string;
  };
  references: ReferenceInfo;
  logistics: LogisticsInfo;
  items: LineItem[];
  narration: string;
  totals: {
    subTotal: number;
    taxableAmount: number;
    taxAmount: number;
    billTotal: number;
  };
}

// --- Component ---

const PurchaseBillInv2: React.FC<{ data?: PurchaseBillData }> = ({ data }) => {
  const invoice = data || defaultPurchaseBillData;

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Matching the light cyan/blue from the image
  const headerColorClass = "bg-[#bae6fd]";

  return (
    <div className="min-h-screen bg-bg-white flex flex-col items-center print:p-0 print:bg-white print:block">
      {/* --- Print Button --- */}
      {/* <div className="w-full max-w-[210mm] flex justify-end mb-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700 transition-colors"
        >
          <PrintIcon />
          <span>Print Bill</span>
        </button>
      </div> */}

      {/* --- Bill Sheet (A4) --- */}
      <div className="max-w-[210mm] w-full bg-white text-black font-sans text-[10px] leading-tight print:w-full mx-auto flex flex-col min-h-[297mm] p-8">
        {/* ================= HEADER SECTION (Outside Border) ================= */}
        <div className="pb-1">
          <div className="text-[10px] mb-2 font-bold">Page: 1/1</div>

          <div className="flex justify-between items-start">
            {/* Company Info */}
            <div className="w-2/3">
              <h1 className="text-base font-bold text-black mb-[2px]">
                {invoice.header.companyName}
              </h1>
              <p className="mb-[1px]">{invoice.header.addressLine1}</p>
              <p className="mb-[1px]">{invoice.header.addressLine2}</p>
              <p className="mb-[1px]">{invoice.header.cityStateZip}</p>
              <p className="mb-[1px]">
                Phone No: {invoice.header.phone} | Email: {invoice.header.email}
              </p>
              <p className="font-bold mt-1 mb-[1px]">
                GST No : {invoice.header.gstNo}
              </p>
              <p className="mb-[1px]">PAN No: {invoice.header.panNo}</p>
            </div>

            {/* Logo */}
            <div className="w-1/3 flex justify-end items-start">
              <img
                src={Logo}
                alt="Logo"
                className="w-32 h-auto object-contain"
              />
            </div>
          </div>

          <div className="text-center mt-3">
            <h2 className="text-sm font-bold">Purchase Bill</h2>
          </div>
        </div>

        {/* ================= MAIN CONTENT (Main Black Border) ================= */}
        <div className="border border-black flex flex-col flex-grow">
          {/* --- Strip 1: Vendor Name / Voucher No --- */}
          <div
            className={`flex border-b border-black font-bold ${headerColorClass}`}
          >
            <div className="w-1/2 border-r border-black px-1 py-[3px]">
              Vendor Name & Address
            </div>
            <div className="w-1/2 flex px-1 py-[3px] justify-between">
              <span>
                Voucher No.{" "}
                <span className="font-normal">{invoice.header.voucherNo}</span>
              </span>
              <span className="mr-4">
                Date <span className="font-normal">{invoice.header.date}</span>
              </span>
            </div>
          </div>

          {/* --- Section: Vendor Details & Delivery Address --- */}
          <div className="flex border-b border-black h-20 text-[9px]">
            {/* Vendor (Left) */}
            <div className="w-1/2 border-r border-black p-1 flex flex-col">
              <div className="font-bold uppercase text-blue-900 mb-0.5 text-[10px]">
                {invoice.vendor.name}
              </div>
              <div>{invoice.vendor.addressLine1}</div>
              <div>{invoice.vendor.addressLine2}</div>
              <div>{invoice.vendor.cityStateZip}</div>
              <div className="mt-1">GST No : {invoice.vendor.gstin}</div>
              <div>PAN No: {invoice.vendor.pan}</div>
            </div>
            {/* Delivery (Right) */}
            <div className="w-1/2 p-1">
              <div className="font-bold mb-0.5">Delivery Address</div>
              <div>{invoice.deliveryAddress.addressLine1}</div>
              <div>{invoice.deliveryAddress.addressLine2}</div>
            </div>
          </div>

          {/* --- Section: Logistics & References --- */}
          <div className="flex border-b border-black text-[9px]">
            {/* Left Col */}
            <div className="w-1/2 border-r border-black p-1 grid grid-cols-[85px_1fr] gap-y-[1px]">
              <span>Destination</span>
              <span>: {invoice.logistics.destination}</span>
              <span>Shipping Mode</span>
              <span>: {invoice.logistics.shippingMode}</span>
              <span>Document</span>
              <span>: {invoice.logistics.documentThrough}</span>
              <span>Through</span>
              <span></span>
              <span>Port of Loading</span>
              <span>: {invoice.logistics.portOfLoading}</span>
              <span>Port of Discharge</span>
              <span>: {invoice.logistics.portOfDischarge}</span>
            </div>
            {/* Right Col */}
            <div className="w-1/2 p-1 grid grid-cols-[85px_1fr] gap-y-[1px]">
              <span>Ref Number</span>
              <span>: {invoice.references.refNumber}</span>
              <span>Ref Date</span>
              <span>: {invoice.references.refDate}</span>
              <span>Ag Ref Number</span>
              <span>: {invoice.references.agRefNumber}</span>
              <span>AG Ref Date</span>
              <span>: {invoice.references.agRefDate}</span>
              <span>Tax Preference</span>
              <span>: {invoice.references.taxPreference}</span>
            </div>
          </div>

          {/* --- TABLE SECTION (Strict Flexbox Grid) --- */}
          {/* Header */}
          <div
            className={`flex border-b border-black font-bold text-center text-[9px] ${headerColorClass}`}
          >
            <div className="w-8 border-r border-black py-1">S.No</div>
            <div className="flex-1 border-r border-black py-1 px-1 text-left">
              Description
            </div>
            <div className="w-10 border-r border-black py-1">Unit</div>
            <div className="w-10 border-r border-black py-1">Qty</div>
            <div className="w-20 border-r border-black py-1">Item Rate</div>
            <div className="w-20 border-r border-black py-1">Item Value</div>
            <div className="w-10 border-r border-black py-1">Tax %</div>
            <div className="w-20 border-r border-black py-1">Tax Amt</div>
            <div className="w-20 py-1">Net Amt</div>
          </div>

          {/* Body (Stretch to fill) */}
          <div className="relative flex-grow min-h-[400px] text-[9px]">
            {/* Background Grid Lines (Absolute to fill entire height) */}
            <div className="absolute inset-0 flex pointer-events-none">
              <div className="w-8 border-r border-black h-full"></div>
              <div className="flex-1 border-r border-black h-full"></div>
              <div className="w-10 border-r border-black h-full"></div>
              <div className="w-10 border-r border-black h-full"></div>
              <div className="w-20 border-r border-black h-full"></div>
              <div className="w-20 border-r border-black h-full"></div>
              <div className="w-10 border-r border-black h-full"></div>
              <div className="w-20 border-r border-black h-full"></div>
              <div className="w-20 h-full"></div>
            </div>

            {/* Content Rows */}
            <div className="absolute inset-0 z-10">
              {invoice.items.map((item, index) => (
                <div key={index} className="flex text-center">
                  <div className="w-8 py-[2px]">{item.sNo}</div>
                  <div className="flex-1 py-[2px] px-1 text-left font-medium">
                    {item.description}
                  </div>
                  <div className="w-10 py-[2px]">{item.unit}</div>
                  <div className="w-10 py-[2px]">{item.qty}</div>
                  <div className="w-20 py-[2px] text-right px-1">
                    {formatCurrency(item.itemRate)}
                  </div>
                  <div className="w-20 py-[2px] text-right px-1">
                    {formatCurrency(item.itemValue)}
                  </div>
                  <div className="w-10 py-[2px]">
                    {item.taxPercent.toFixed(2)}
                  </div>
                  <div className="w-20 py-[2px] text-right px-1">
                    {formatCurrency(item.taxAmount)}
                  </div>
                  <div className="w-20 py-[2px] text-right px-1 font-bold">
                    {formatCurrency(item.netAmount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table Totals Row (Inside Border, Blue Strip) */}
          <div
            className={`flex border-t border-black font-bold text-right text-[9px] ${headerColorClass}`}
          >
            <div className="w-8 border-r border-black py-[2px]"></div>
            <div className="flex-1 border-r border-black py-[2px]"></div>
            <div className="w-10 border-r border-black py-[2px]"></div>
            {/* Total Qty */}
            <div className="w-10 border-r border-black py-[2px] text-center">
              {invoice.items.reduce((acc, i) => acc + i.qty, 0)}
            </div>
            <div className="w-20 border-r border-black py-[2px]"></div>
            {/* Total Item Value */}
            <div className="w-20 border-r border-black py-[2px] text-right px-1">
              {formatCurrency(
                invoice.items.reduce((acc, i) => acc + i.itemValue, 0),
              )}
            </div>
            <div className="w-10 border-r border-black py-[2px]"></div>
            {/* Total Tax */}
            <div className="w-20 border-r border-black py-[2px] text-right px-1">
              {formatCurrency(
                invoice.items.reduce((acc, i) => acc + i.taxAmount, 0),
              )}
            </div>
            {/* Total Net */}
            <div className="w-20 py-[2px] text-right px-1">
              {formatCurrency(
                invoice.items.reduce((acc, i) => acc + i.netAmount, 0),
              )}
            </div>
          </div>

          {/* --- Bottom Section --- */}
          <div className="flex border-t border-black h-40 text-[9px]">
            {/* Left Side: Narration & Logistics */}
            <div className="w-[70%] border-r border-black flex flex-col">
              <div className="border-b border-black px-1 py-[2px] font-bold flex">
                <span className="w-14">Narration</span>
                <span className="font-normal">: {invoice.narration}</span>
              </div>

              <div className="p-1 flex-grow">
                <div className="font-bold mb-1 flex">
                  <span className="w-16">Logistics Info</span>
                  <span>:</span>
                </div>

                <div className="flex mt-1">
                  <div className="w-1/2 pr-2 space-y-[1px]">
                    <div className="flex justify-between">
                      <span>Shipping Company</span>
                      <span></span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tracking No</span>
                      <span>{invoice.logistics.trackingNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vehicle/Vessel No.</span>
                      <span>{invoice.logistics.vehicleNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>No of Packets</span>
                      <span>{invoice.logistics.noOfPackets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Document extra info</span>
                      <span>: {invoice.logistics.docExtraInfo}</span>
                    </div>
                  </div>
                  <div className="w-1/2 pl-8 space-y-[1px]">
                    <div className="flex justify-between">
                      <span>Shipping Date</span>
                      <span>{invoice.logistics.shippingDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Charges Paid</span>
                      <span>{invoice.logistics.chargesPaid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weight</span>
                      <span>{invoice.logistics.weight}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Totals Summary */}
            <div className="w-[30%] flex flex-col justify-start text-[9px]">
              <div className="flex justify-between px-1 py-[1px]">
                <span className="font-bold">Sub Total</span>
                <span className="font-bold">
                  {formatCurrency(invoice.totals.subTotal)}
                </span>
              </div>
              <div className="flex justify-between px-1 py-[1px]">
                <span>Taxable Amount</span>
                <span>{formatCurrency(invoice.totals.taxableAmount)}</span>
              </div>
              <div className="flex justify-between px-1 py-[1px]">
                <span>Tax Amount</span>
                <span>{formatCurrency(invoice.totals.taxAmount)}</span>
              </div>
              <div className="flex justify-between px-1 py-[2px] border-t border-black mt-1">
                <span className="font-bold text-[10px]">Bill Total</span>
                <span className="font-bold text-[10px]">
                  {formatCurrency(invoice.totals.billTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* --- Signatories --- */}
          <div className="h-24 border-t border-black relative">
            <div className="absolute bottom-2 right-2 text-right">
              <div className="font-bold text-[9px] mb-8">
                For {invoice.header.companyName}
              </div>
              <div className="font-bold text-[9px]">Authorized Signatory</div>
            </div>
          </div>
        </div>
        {/* End of Main Bordered Box */}

        {/* ================= PAGE FOOTER (Separate Box) ================= */}
        <div className="mt-1 border border-black p-[2px] text-center text-[9px] font-bold">
          {invoice.header.addressLine1}, {invoice.header.addressLine2},{" "}
          {invoice.header.cityStateZip} | {invoice.header.phone} |{" "}
          {invoice.header.email}
        </div>
      </div>
    </div>
  );
};

// --- Default Data ---

const defaultPurchaseBillData: PurchaseBillData = {
  header: {
    companyName: "Sample Company - Automobile",
    addressLine1: "1209-1212, R.G. Trade Tower, 12th Floor, Netaji u000d",
    addressLine2: "Subhash Place,",
    cityStateZip: "New Delhi, Delhi - 110034, India",
    phone: "9169171616",
    email: "support@inventory.com",
    gstNo: "07AAPPK4961R1ZR",
    panNo: "AAPPK4961R",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/55/55283.png",
    voucherNo: "000003/22-23",
    date: "28/10/2022",
  },
  vendor: {
    name: "VINOD TRADING COMPANY",
    addressLine1: "E-213, PHASE IV FOCAL POINT",
    addressLine2: "Ludhiana, Punjab, India",
    cityStateZip: "",
    gstin: "03AAAF18854N3ZZ",
    pan: "AAAF18854N",
  },
  deliveryAddress: {
    addressLine1: "Ludhiana, Punjab India",
  },
  references: {
    refNumber: "VTC/00648/22-23",
    refDate: "28/10/2022",
    agRefNumber: ":",
    agRefDate: ":",
    taxPreference: "Exclusive",
  },
  logistics: {
    destination: "Ludhiana",
    shippingMode: "Road",
    documentThrough: ":",
    portOfLoading: ":",
    portOfDischarge: ":",
    vehicleNo: "PB11AK7674",
    noOfPackets: "0.00",
    weight: "0.00",
    shippingDate: "28/10/2022",
    chargesPaid: "0.00",
    docExtraInfo: "",
  },
  items: [
    {
      sNo: 1,
      description: "HEX BOLT",
      unit: "BAG",
      qty: 90,
      itemRate: 3500.0,
      itemValue: 315000.0,
      taxPercent: 18.0,
      taxAmount: 56700.0,
      netAmount: 371700.0,
    },
  ],
  narration: "Being Goods Purchase From VINOD TRADING COMPANY",
  totals: {
    subTotal: 315000.0,
    taxableAmount: 315000.0,
    taxAmount: 56700.0,
    billTotal: 371700.0,
  },
};

export default PurchaseBillInv2;
