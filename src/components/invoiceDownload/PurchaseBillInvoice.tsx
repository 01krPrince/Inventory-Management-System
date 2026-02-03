import React, { useMemo, useEffect } from 'react';
import Logo from './image.svg';
import { Download, Printer, Mail, MessageCircle } from 'lucide-react'; // Make sure to import icons

// --- Interfaces ---
// (Keep your existing VendorDetails, ApiItem, LogisticsData interfaces here...)
// ... [Keep existing interfaces from your previous code] ...

interface VendorDetails {
  vend_name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  gst_no?: string;
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

interface LogisticsValue {
  amount: number;
  accountCode: string | null;
}

interface LogisticsData {
  freight?: LogisticsValue | number;
  loadingUnloading?: LogisticsValue | number;
  insurance?: LogisticsValue | number;
  otherCharges?: LogisticsValue | number;
  custDuty?: LogisticsValue | number;
  chaPayment?: LogisticsValue | number;
  handling?: LogisticsValue | number;
  docCharges?: LogisticsValue | number;
  bankCharges?: LogisticsValue | number;
  custExp?: LogisticsValue | number;
}

export interface ApiResponse {
  billNo: string;
  billDate: string;
  storeName: string;
  vendorDetails?: VendorDetails;
  vendor?: string;
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

// Add props for actions
interface PurchaseBillInvoiceProps {
  data?: ApiResponse;
  onDownload?: () => void;
  onShareWhatsApp?: () => void;
  onShareEmail?: () => void;
}

// ... [Keep AddressDetails, LineItem, etc. interfaces] ...
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

// ... [Keep utilities numberToWords and getLogisticsAmt] ...
const numberToWords = (num: number): string => {
  const a = [
    '',
    'One ',
    'Two ',
    'Three ',
    'Four ',
    'Five ',
    'Six ',
    'Seven ',
    'Eight ',
    'Nine ',
    'Ten ',
    'Eleven ',
    'Twelve ',
    'Thirteen ',
    'Fourteen ',
    'Fifteen ',
    'Sixteen ',
    'Seventeen ',
    'Eighteen ',
    'Nineteen ',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if ((num = num.toString().length > 9 ? parseFloat('overflow') : num)) return 'overflow';
  const n = ('000000000' + num.toFixed(2))
    .substr(-11)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str +=
    Number(n[1]) !== 0
      ? (a[Number(n[1])] || b[n[1][0] as any] + ' ' + a[n[1][1] as any]) + 'Crore '
      : '';
  str +=
    Number(n[2]) !== 0
      ? (a[Number(n[2])] || b[n[2][0] as any] + ' ' + a[n[2][1] as any]) + 'Lakh '
      : '';
  str +=
    Number(n[3]) !== 0
      ? (a[Number(n[3])] || b[n[3][0] as any] + ' ' + a[n[3][1] as any]) + 'Thousand '
      : '';
  str +=
    Number(n[4]) !== 0
      ? (a[Number(n[4])] || b[n[4][0] as any] + ' ' + a[n[4][1] as any]) + 'Hundred '
      : '';
  str +=
    Number(n[5]) !== 0
      ? (str !== '' ? 'and ' : '') +
        (a[Number(n[5])] || b[n[5][0] as any] + ' ' + a[n[5][1] as any]) +
        'Only '
      : '';
  return str;
};

const getLogisticsAmt = (val: LogisticsValue | number | undefined): number => {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'number') return val;
  if (typeof val === 'object' && 'amount' in val) return Number(val.amount) || 0;
  return 0;
};

// --- Component ---

const PurchaseBillInvoice: React.FC<PurchaseBillInvoiceProps> = ({
  data,
  onDownload,
  onShareWhatsApp,
  onShareEmail,
}) => {
  // Debug log
  useEffect(() => {
    if (data) console.log('🧾 Rendering Invoice for:', data.billNo);
  }, [data]);

  // --- Mapper: Convert API JSON -> Invoice UI Format ---
  const invoice: InvoiceData = useMemo(() => {
    if (!data) return defaultAutomobileData;

    const billDateFormatted = new Date(data.billDate).toLocaleDateString('en-GB');

    // Helpers
    const safeStr = (val: any) => (val && val !== 'null' && val !== null ? String(val) : '');
    const joinAddress = (parts: any[], separator: string = ', ') =>
      parts.filter((p) => p && String(p).trim() !== '' && String(p) !== 'null').join(separator);

    const totalTax = data.taxAmount || 0;
    const cgst = totalTax / 2;
    const sgst = totalTax / 2;

    const vDetails = data.vendorDetails || {};
    const vendorName = vDetails.vend_name || `Vendor ID: ${data.vendor || 'Unknown'}`;

    return {
      header: {
        title: 'PURCHASE INVOICE',
        subTitle: '',
        originalFor: 'Original For Recipient',
        logoUrl: Logo,
      },
      seller: {
        name: safeStr(vendorName),
        addressLine1:
          safeStr(vDetails.address) || joinAddress([vDetails.city, vDetails.state], ', '),
        addressLine2: safeStr(vDetails.country),
        cityStateZip: joinAddress([vDetails.city, vDetails.state], ' - '),
        gstin: safeStr(vDetails.gst_no),
        phone: safeStr(vDetails.phone),
        email: safeStr(vDetails.email),
        pan: safeStr(vDetails.pan),
      },
      invoiceDetails: {
        invoiceNo: safeStr(data.billNo),
        invoiceDate: billDateFormatted,
        reverseCharge: 'No',
        placeOfSupply: safeStr(vDetails.state),
        station: safeStr(vDetails.city),
        ewayBillNo: '',
        vehicleNo: String(data.transport || ''),
        grRrNo: '',
        distance: '',
        shippingCompany: '',
      },
      billing: {
        name: safeStr(data.storeName),
        addressLine1: '',
        addressLine2: '',
        cityStateZip: '',
        gstin: '',
        pan: '',
      },
      shipping: {
        name: safeStr(data.storeName),
        addressLine1: '',
        addressLine2: '',
        cityStateZip: '',
      },
      items: (data.items || []).map((item, index) => ({
        sNo: index + 1,
        description: safeStr(item.description),
        hsnSac: safeStr(item.hsn),
        packQty: 0,
        qty: item.quantity,
        uom: 'NOS',
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
          rate: 'Tax (Derived)',
          taxableValue: data.taxableAmount,
          cgst: cgst,
          sgst: sgst,
          igst: 0,
          totalTax: totalTax,
        },
      ],
      logistics: {
        mode: 'Road',
        weight: '0.00',
        bundles: '0.00',
        chargesPaid: String(getLogisticsAmt(data.logistics?.freight).toFixed(2)),
        docExtraInfo: '',
        remarks: safeStr(data.remarks),
      },
      signatory: {
        companyName: safeStr(data.storeName),
      },
    };
  }, [data]);

  const formatCurrency = (amount: number) =>
    amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            #printable-invoice-area, #printable-invoice-area * { visibility: visible; }
            #printable-invoice-area { position: fixed; left: 0; top: 0; width: 100%; height: 100%; margin: 0; padding: 0; background-color: white; z-index: 99999; }
            @page { margin: 5mm; size: auto; }
            .no-print { display: none !important; }
          }
        `}
      </style>

      <div id="printable-invoice-area" className="h-auto bg-white">
        {/* --- ACTION BAR (New) --- */}
        <div className="no-print mb-4 flex w-full flex-wrap justify-center gap-4 border-b bg-gray-100 py-4 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded bg-gray-700 px-4 py-2 font-medium text-white shadow transition-colors hover:bg-gray-800">
            <Printer size={16} /> Print
          </button>

          {onDownload && (
            <button
              onClick={onDownload}
              className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 font-medium text-white shadow transition-colors hover:bg-blue-700">
              <Download size={16} /> Download PDF
            </button>
          )}

          {onShareWhatsApp && (
            <button
              onClick={onShareWhatsApp}
              className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 font-medium text-white shadow transition-colors hover:bg-green-700">
              <MessageCircle size={16} /> WhatsApp
            </button>
          )}

          {onShareEmail && (
            <button
              onClick={onShareEmail}
              className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 font-medium text-white shadow transition-colors hover:bg-blue-600">
              <Mail size={16} /> Email
            </button>
          )}
        </div>

        {/* Invoice Content */}
        <div className="m-8 flex flex-col items-center bg-white print:m-0">
          <div className="mx-auto box-border w-full max-w-[210mm] border border-black font-sans text-[10px] leading-tight text-black print:w-full">
            {/* Header */}
            <div className="border-b border-black p-4">
              <div className="mb-2 flex items-start justify-between">
                <div className="w-1/4 font-bold">GSTIN : {invoice.seller.gstin}</div>
                <div className="w-1/2 text-center text-sm font-bold uppercase underline">
                  {invoice.header.title}
                </div>
                <div className="w-1/4 text-right text-[9px] font-bold">
                  {invoice.header.originalFor}
                </div>
              </div>

              <div className="relative min-h-[80px]">
                <div className="absolute left-0 top-0 flex h-full w-36 flex-col items-center justify-center">
                  <img
                    src={invoice.header.logoUrl || Logo}
                    alt="Logo"
                    className="mb-1 h-12 w-16 object-contain"
                  />
                  <div className="text-center text-[9px] font-bold uppercase leading-none tracking-tighter text-red-600">
                    {invoice.header.subTitle}
                  </div>
                </div>

                <div className="w-full px-24 text-center">
                  <h1 className="mb-1 text-xl font-bold text-black">{invoice.seller.name}</h1>
                  <p>{invoice.seller.addressLine1}</p>
                  <p>{invoice.seller.addressLine2}</p>
                  <p>{invoice.seller.cityStateZip}</p>
                  <div className="mt-1 font-bold">
                    Phone No: {invoice.seller.phone} | Email: {invoice.seller.email}
                  </div>
                  <div className="font-bold">PAN No: {invoice.seller.pan}</div>
                </div>
              </div>
            </div>

            {/* (Keep the rest of your Invoice Layout: Details, Items Table, Footer...) */}
            {/* Invoice Details */}
            <div className="grid grid-cols-2 border-b border-black text-[10px]">
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

            {/* Addresses */}
            <div className="flex min-h-[140px] border-b border-black">
              <div className="flex w-1/2 flex-col border-r border-black">
                <div className="border-b border-black px-2 py-1 font-bold">
                  Vendor Name & Billing Address
                </div>
                <div className="flex-grow p-3">
                  <div className="font-bold uppercase">{invoice.billing.name}</div>
                  <div>{invoice.billing.addressLine1}</div>
                  <div>{invoice.billing.addressLine2}</div>
                  <div>{invoice.billing.cityStateZip}</div>
                  <div className="mt-1">GSTIN / UIN : {invoice.billing.gstin}</div>
                  <div className="mt-4">Party PAN : {invoice.billing.pan}</div>
                </div>
              </div>
              <div className="flex w-1/2 flex-col">
                <div className="border-b border-black px-2 py-1 font-bold">Shipping Address</div>
                <div className="flex-grow p-3">
                  <div className="whitespace-pre-wrap">
                    {invoice.shipping.name} , {invoice.shipping.addressLine1} ,
                    {invoice.shipping.addressLine2}
                    {invoice.shipping.cityStateZip}
                  </div>
                  <div className="mt-4">Phone : {invoice.shipping.phone}</div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="w-full">
              <table className="w-full border-collapse text-[10px]">
                <thead>
                  <tr className="h-8 border-b border-black text-center font-bold">
                    <th className="w-8 border-r border-black">S No</th>
                    <th className="w-64 border-r border-black text-center">Description</th>
                    <th className="w-16 border-r border-black">HSN / SAC</th>
                    <th className="w-12 border-r border-black">Pack Qty</th>
                    <th className="w-10 border-r border-black">Qty</th>
                    <th className="w-10 border-r border-black">UOM</th>
                    <th className="w-20 border-r border-black">Item Rate</th>
                    <th className="w-24 px-2 text-right">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="h-8 text-center align-top">
                      <td className="border-r border-black px-1 py-2">{item.sNo}</td>
                      <td className="border-r border-black px-2 py-2 text-left">
                        {item.description}
                      </td>
                      <td className="border-r border-black py-2">{item.hsnSac}</td>
                      <td className="border-r border-black py-2">{item.packQty}</td>
                      <td className="border-r border-black py-2">{item.qty}</td>
                      <td className="border-r border-black py-2">{item.uom}</td>
                      <td className="border-r border-black px-2 py-2 text-right">
                        {formatCurrency(item.rate)}
                      </td>
                      <td className="px-2 py-2 text-right font-bold">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="h-[300px] border-b border-black">
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td></td>
                  </tr>
                  <tr className="h-8 border-b border-black text-center font-bold">
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black px-2 py-1 text-right">Total</td>
                    <td className="border-r border-black py-1 text-center">0.00</td>
                    <td className="border-r border-black py-1 text-center">
                      {invoice.items.reduce((a, b) => a + b.qty, 0).toFixed(2)}
                    </td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="px-2 py-1 text-right">
                      {formatCurrency(invoice.totals.subTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer Section */}
            <div className="flex border-b border-black">
              <div className="flex w-[65%] flex-col justify-between border-r border-black">
                <div className="flex border-b border-black px-2 py-2">
                  <span className="w-16 font-bold">Narration</span>
                  <span>: {invoice.logistics.remarks}</span>
                </div>
                <div className="flex h-auto min-h-[64px] border-b border-black px-2 py-2">
                  <div className="w-1/2">
                    <div className="flex">
                      <span className="w-24 font-bold">Logistics Info</span>
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
                <div className="flex-grow">
                  <table className="w-full border-collapse text-center text-[9px]">
                    <thead>
                      <tr className="border-b border-black font-bold">
                        <th className="border-r border-black px-2 py-1 text-left">Tax Rate</th>
                        <th className="border-r border-black py-1">Taxable Value</th>
                        <th className="border-r border-black py-1">CGST Amount</th>
                        <th className="border-r border-black py-1">SGST Amount</th>
                        <th className="border-r border-black py-1">IGST Amount</th>
                        <th className="py-1">Total Tax</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.taxTable.map((tax, i) => (
                        <tr key={i} className="font-bold">
                          <td className="border-r border-black px-2 py-1 text-left">{tax.rate}</td>
                          <td className="border-r border-black px-2 py-1 text-right">
                            {formatCurrency(tax.taxableValue)}
                          </td>
                          <td className="border-r border-black px-2 py-1 text-right">
                            {formatCurrency(tax.cgst)}
                          </td>
                          <td className="border-r border-black px-2 py-1 text-right">
                            {formatCurrency(tax.sgst)}
                          </td>
                          <td className="border-r border-black px-2 py-1 text-right">
                            {formatCurrency(tax.igst)}
                          </td>
                          <td className="px-2 py-1 text-right">{formatCurrency(tax.totalTax)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="border-t border-black px-2 py-1 font-bold">
                  Tax Amount : {invoice.totals.taxAmountInWords}
                </div>
                <div className="border-t border-black px-2 py-1 font-bold">
                  Bill Amount : {invoice.totals.amountInWords}
                </div>
              </div>

              <div className="w-[35%] text-[10px]">
                <div className="flex justify-between px-2 py-1">
                  <span className="font-bold">Sub Total</span>
                  <span className="font-bold">{formatCurrency(invoice.totals.subTotal)}</span>
                </div>
                <div className="flex justify-between px-2 py-1">
                  <span>Discount</span>
                  <span>
                    {invoice.totals.billDiscount > 0 ? '-' : ''}
                    {formatCurrency(Math.abs(invoice.totals.billDiscount))}
                  </span>
                </div>
                <div className="flex justify-between px-2 py-1">
                  <span className="font-bold">Taxable Amount</span>
                  <span className="font-bold">{formatCurrency(invoice.totals.taxableAmount)}</span>
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
                <div className="mt-1 flex items-center justify-between border-t border-black px-2 py-2 text-sm font-bold">
                  <span>Bill Total</span>
                  <span>{formatCurrency(invoice.totals.grandTotal)}</span>
                </div>
              </div>
            </div>

            <div className="flex h-24">
              <div className="w-1/2 border-r border-black"></div>
              <div className="relative flex w-1/2 flex-col items-end justify-between p-4">
                <div className="mb-1 w-full border-b border-black pb-1 text-left text-[10px] font-bold">
                  Receiver's Signature
                </div>
                <div className="mt-4 w-full text-center">
                  <div className="mb-8 text-[10px] font-bold">
                    For {invoice.signatory.companyName}
                  </div>
                  <div className="text-[10px] font-bold">Authorised Signatory</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[210mm] px-2 py-1 text-right text-[9px] print:w-full">
            Page : 1/1
          </div>
        </div>
      </div>
    </>
  );
};

// ... [Keep defaultAutomobileData] ...
const defaultAutomobileData: InvoiceData = {
  header: {
    title: 'PURCHASE INVOICE',
    subTitle: '',
    originalFor: 'Original For Recipient',
    logoUrl: Logo,
  },
  seller: {
    name: 'Sample Vendor',
    addressLine1: '',
    addressLine2: '',
    cityStateZip: '',
    gstin: '',
    pan: '',
  },
  invoiceDetails: {
    invoiceNo: '',
    invoiceDate: '',
    reverseCharge: 'No',
    placeOfSupply: '',
    station: '',
  },
  billing: { name: 'My Store', addressLine1: '', addressLine2: '', cityStateZip: '' },
  shipping: { name: 'My Store', addressLine1: '', addressLine2: '', cityStateZip: '' },
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
    amountInWords: 'Zero Only',
    taxAmountInWords: 'Zero Only',
  },
  taxTable: [],
  logistics: { mode: '', weight: '', bundles: '', chargesPaid: '', docExtraInfo: '', remarks: '' },
  signatory: { companyName: 'My Store' },
};

export default PurchaseBillInvoice;
