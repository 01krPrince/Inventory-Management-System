import React, { useMemo, useEffect } from 'react';
import { Printer } from 'lucide-react';
import Logo from './image.svg';

interface ApiItem {
  item: string;
  itemcode: string;
  description: string;
  batchNo: string;
  quantity: number;
  rate: number;
  amount: number;
  netRate: number;
  netAmount: number;
  mrp: number;
  sale_rate: number;
  wholesale_rate: number;
  dealer_rate: number;
  taxable: number;
  taxAmount: number;
  taxRate: string;
  itemBarCode: string;
  brand: string;
  _id: string;
  hsn?: string;
}

interface LogisticsValue {
  amount: number;
  accountCode: string | null;
}

interface LogisticsData {
  freight?: LogisticsValue;
  loadingUnloading?: LogisticsValue;
  insurance?: LogisticsValue;
  otherCharges?: LogisticsValue;
  custDuty?: LogisticsValue;
  chaPayment?: LogisticsValue;
  handling?: LogisticsValue;
  docCharges?: LogisticsValue;
  bankCharges?: LogisticsValue;
  custExp?: LogisticsValue;
}

interface BillingInfo {
  contactNo?: string;
  gstNo?: string;
  placeOfSupply?: string;
  ecommerceInvoiceNo?: string;
  fullAddress?: string;
}

interface ShippingInfo {
  fullAddress?: string;
}

interface PaymentInfo {
  ledger: string;
  ledgerName: string;
  amount: number;
  remarks: string;
}

export interface ApiResponse {
  billNo: string;
  billDate: string;
  store: string;
  vendor: string;
  items: ApiItem[];
  type: string;
  logistics: LogisticsData;
  gstType: string;
  billingFrom?: BillingInfo;
  shippingFrom?: ShippingInfo;
  supplierInvoiceNo?: string;
  supplierInvoiceDate?: string;
  tax: string;
  dueDate?: string;
  paymentTerms?: string;
  email?: string;
  priceCategory?: string;
  payments?: PaymentInfo[];
  itemValue: number;
  taxableAmount: number;
  taxAmount: number;
  promoDiscount?: number;
  promoDiscount2?: number;
  couponDiscount?: number;
  billDiscount: number;
  billDiscountPercent: number;
  adjustment?: number;
  roundOff: number;
  docAmount: number;
  transport?: number;
  remarks?: string;
  paidAmount?: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  storeName?: string;
  vendorName?: string;
  netAmount?: number;
  totalLogistics?: number;
}

interface PurchaseBillInvoiceProps {
  data?: ApiResponse;
}

interface AddressDetails {
  name: string;
  addressLine1: string;
  addressLine2: string;
  cityStateZip: string;
  gstin: string;
  pan: string;
  phone: string;
  email: string;
}

interface LineItem {
  sNo: number;
  description: string;
  hsnSac: string;
  packQty: string;
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
  storeName: string;
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
    ewayBillNo: string;
    vehicleNo: string;
    grRrNo: string;
    distance: string;
    shippingCompany: string;
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

  if (num.toString().length > 9) return 'overflow';

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

  return str || 'Zero Only';
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-GB');
  } catch (e) {
    return dateString;
  }
};

const safeStr = (val: any) =>
  val !== undefined && val !== null && val !== '' ? String(val) : 'N/A';
const currency = (amt: number) =>
  amt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Now it defaults to your static data automatically
const PurchaseBillInvoice: React.FC<PurchaseBillInvoiceProps> = ({ data }) => {
  useEffect(() => {
    if (data) console.log('🧾 Rendering Invoice for:', data.billNo);
  }, [data]);

  const invoice: InvoiceData = useMemo(() => {
    if (!data) return defaultInvoiceData;

    const totalTax = data.taxAmount || 0;
    const cgst = totalTax / 2;
    const sgst = totalTax / 2;

    const totalDiscount =
      (data.billDiscount || 0) +
      (data.promoDiscount || 0) +
      (data.couponDiscount || 0) +
      (data.promoDiscount2 || 0);

    return {
      storeName: safeStr(data.storeName),
      header: {
        title: 'PURCHASE INVOICE',
        subTitle: '',
        originalFor: 'Original For Recipient',
        logoUrl: Logo,
      },
      seller: {
        name: safeStr(data.vendorName || data.vendor),
        addressLine1: safeStr(data.billingFrom?.fullAddress),
        addressLine2: '',
        cityStateZip: safeStr(data.billingFrom?.placeOfSupply),
        gstin: safeStr(data.billingFrom?.gstNo),
        phone: safeStr(data.billingFrom?.contactNo),
        email: safeStr(data.email),
        pan: 'N/A', // Not in JSON
      },
      invoiceDetails: {
        invoiceNo: safeStr(data.billNo), // Internal Bill No
        invoiceDate: formatDate(data.billDate),
        reverseCharge: 'No',
        placeOfSupply: safeStr(data.billingFrom?.placeOfSupply),
        station: 'N/A',
        ewayBillNo: 'N/A',
        vehicleNo: 'N/A', // data.transport is likely cost (300), not vehicle number
        grRrNo: 'N/A',
        distance: 'N/A',
        shippingCompany: 'N/A',
      },
      billing: {
        name: safeStr(data.storeName),
        addressLine1: 'N/A', // Store address not in JSON
        addressLine2: '',
        cityStateZip: '',
        gstin: 'N/A',
        pan: 'N/A',
        phone: 'N/A',
        email: 'N/A',
      },
      shipping: {
        name: safeStr(data.storeName),
        addressLine1: safeStr(data.shippingFrom?.fullAddress), // Using Warehouse address if available
        addressLine2: '',
        cityStateZip: '',
        gstin: 'N/A',
        pan: 'N/A',
        phone: 'N/A',
        email: 'N/A',
      },
      items: (data.items || []).map((item, index) => ({
        sNo: index + 1,
        description: safeStr(item.description),
        hsnSac: safeStr(item.hsn),
        packQty: 'N/A',
        qty: item.quantity,
        uom: 'NOS',
        rate: item.rate,
        discountPercent: data.billDiscountPercent || 0,
        amount: item.amount,
      })),
      totals: {
        subTotal: data.itemValue,
        billDiscount: totalDiscount,
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
          rate: 'Tax Split',
          taxableValue: data.taxableAmount,
          cgst: cgst,
          sgst: sgst,
          igst: 0,
          totalTax: totalTax,
        },
      ],
      logistics: {
        mode: 'Road',
        weight: 'N/A',
        bundles: 'N/A',
        chargesPaid: currency(data.totalLogistics || 0),
        docExtraInfo: '',
        remarks: safeStr(data.remarks),
      },
      signatory: {
        companyName: safeStr(data.storeName),
      },
    };
  }, [data]);

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

      <div id="printable-invoice-area" className="h-auto bg-white font-sans text-black">
        {/* --- ACTION BAR --- */}
        <div className="no-print mb-4 flex w-full justify-center gap-4 border-b bg-gray-100 py-4 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded bg-gray-700 px-4 py-2 font-medium text-white shadow transition-colors hover:bg-gray-800">
            <Printer size={16} /> Print
          </button>
        </div>

        {/* Invoice Content */}
        <div className="m-8 flex flex-col items-center bg-white print:m-0">
          <div className="mx-auto box-border w-full max-w-[210mm] border border-black text-[10px] leading-tight print:w-full">
            {/* 1. Header Section */}
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
                {/* Logo Area */}
                <div className="absolute left-0 top-0 flex h-full w-36 flex-col items-center justify-center">
                  <img
                    src={invoice.header.logoUrl}
                    alt="Logo"
                    className="mb-1 h-12 w-16 object-contain"
                  />
                  <div className="text-center text-[9px] font-bold uppercase leading-none tracking-tighter text-red-600">
                    {invoice.header.subTitle}
                  </div>
                </div>

                {/* Seller Name Area */}
                <div className="w-full px-24 text-center">
                  <h1 className="mb-1 text-xl font-bold text-black">{invoice.storeName}</h1>
                  <p>{invoice.seller.addressLine1}</p>
                  <p>{invoice.seller.addressLine2}</p>
                  <p>{invoice.seller.cityStateZip}</p>
                  <div className="mt-1 font-bold">
                    Phone No: {invoice.seller.phone} | Email: {invoice.seller.email}
                  </div>
                  {/* PAN is N/A in data, displayed if available */}
                  <div className="font-bold">PAN No: {invoice.seller.pan}</div>
                </div>
              </div>
            </div>

            {/* 2. Invoice Details Grid */}
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
                  <span className="w-28 font-bold">Eway Bill No</span>
                  <span>: {invoice.invoiceDetails.ewayBillNo}</span>
                </div>
                <div className="flex px-2 py-1">
                  <span className="w-28 font-bold">Distance</span>
                  <span>: {invoice.invoiceDetails.distance}</span>
                </div>
                {/* Optional: Add Supplier Invoice No if different */}
                <div className="flex px-2 py-1">
                  <span className="w-28 font-bold">Supplier Ref</span>
                  <span>: {data?.supplierInvoiceNo || 'N/A'}</span>
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
                  <span className="w-28 font-bold">GR / RR.No</span>
                  <span>: {invoice.invoiceDetails.grRrNo}</span>
                </div>
                <div className="flex px-2 py-1">
                  <span className="w-28 font-bold">Station</span>
                  <span>: {invoice.invoiceDetails.station}</span>
                </div>
              </div>
            </div>

            {/* 3. Address Section (Billing & Shipping) */}
            <div className="flex min-h-[120px] border-b border-black">
              {/* Billing To */}
              <div className="flex w-1/2 flex-col border-r border-black">
                <div className="border-b border-black px-2 py-1 font-bold">Billed To</div>
                <div className="flex-grow p-3">
                  <div className="font-bold uppercase">{invoice.billing.name}</div>
                  <div>{invoice.billing.addressLine1}</div>
                  <div>{invoice.billing.cityStateZip}</div>
                  <div className="mt-1">GSTIN : {invoice.billing.gstin}</div>
                  <div className="mt-1">PAN : {invoice.billing.pan}</div>
                </div>
              </div>

              {/* Shipping To */}
              <div className="flex w-1/2 flex-col">
                <div className="border-b border-black px-2 py-1 font-bold">Shipped To</div>
                <div className="flex-grow p-3">
                  <div className="font-bold uppercase">{invoice.shipping.name}</div>
                  <div className="whitespace-pre-wrap">{invoice.shipping.addressLine1}</div>
                  <div>{invoice.shipping.cityStateZip}</div>
                </div>
              </div>
            </div>

            {/* 4. Items Table */}
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
                        {currency(item.rate)}
                      </td>
                      <td className="px-2 py-2 text-right font-bold">{currency(item.amount)}</td>
                    </tr>
                  ))}
                  {/* Minimum Height Spacer */}
                  <tr className="h-[250px] border-b border-black">
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td></td>
                  </tr>

                  {/* Total Line */}
                  <tr className="h-8 border-b border-black text-center font-bold">
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black px-2 text-right">Total Qty</td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black py-1 text-center">
                      {invoice.items.reduce((a, b) => a + b.qty, 0)}
                    </td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="px-2 py-1 text-right">{currency(invoice.totals.subTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 5. Footer / Totals Section */}
            <div className="flex border-b border-black">
              {/* Left Side: Remarks, Tax Table, Words */}
              <div className="flex w-[65%] flex-col justify-between border-r border-black">
                <div className="flex border-b border-black px-2 py-2">
                  <span className="w-16 font-bold">Narration</span>
                  <span>: {invoice.logistics.remarks}</span>
                </div>

                {/* Logistics Info Block */}
                <div className="flex h-auto min-h-[64px] border-b border-black px-2 py-2 text-[9px]">
                  <div className="w-1/2">
                    <div className="mb-1 font-bold underline">Logistics Info</div>
                    <div className="flex w-3/4 justify-between">
                      <span>Charges Paid:</span>
                      <span>{invoice.logistics.chargesPaid}</span>
                    </div>
                  </div>
                  <div className="w-1/2 pl-4">
                    <div className="flex w-3/4 justify-between">
                      <span>Mode:</span>
                      <span>{invoice.logistics.mode}</span>
                    </div>
                    <div className="flex w-3/4 justify-between">
                      <span>Weight:</span>
                      <span>{invoice.logistics.weight}</span>
                    </div>
                  </div>
                </div>

                {/* Tax Table */}
                <div className="flex-grow">
                  <table className="w-full border-collapse text-center text-[9px]">
                    <thead>
                      <tr className="border-b border-black font-bold">
                        <th className="border-r border-black px-2 py-1 text-left">Tax Rate</th>
                        <th className="border-r border-black py-1">Taxable</th>
                        <th className="border-r border-black py-1">CGST</th>
                        <th className="border-r border-black py-1">SGST</th>
                        <th className="border-r border-black py-1">IGST</th>
                        <th className="py-1">Total Tax</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.taxTable.map((tax, i) => (
                        <tr key={i} className="font-bold">
                          <td className="border-r border-black px-2 py-1 text-left">{tax.rate}</td>
                          <td className="border-r border-black px-2 py-1 text-right">
                            {currency(tax.taxableValue)}
                          </td>
                          <td className="border-r border-black px-2 py-1 text-right">
                            {currency(tax.cgst)}
                          </td>
                          <td className="border-r border-black px-2 py-1 text-right">
                            {currency(tax.sgst)}
                          </td>
                          <td className="border-r border-black px-2 py-1 text-right">
                            {currency(tax.igst)}
                          </td>
                          <td className="px-2 py-1 text-right">{currency(tax.totalTax)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Amount in Words */}
                <div className="border-t border-black px-2 py-1 text-[9px] font-bold">
                  Tax Amount : {invoice.totals.taxAmountInWords}
                </div>
                <div className="border-t border-black px-2 py-1 text-[9px] font-bold">
                  Bill Amount : {invoice.totals.amountInWords}
                </div>
              </div>

              {/* Right Side: Calculation Block */}
              <div className="w-[35%] text-[10px]">
                <div className="flex justify-between px-2 py-1">
                  <span className="font-bold">Sub Total</span>
                  <span className="font-bold">{currency(invoice.totals.subTotal)}</span>
                </div>
                <div className="flex justify-between px-2 py-1">
                  <span>Discount</span>
                  <span>
                    {invoice.totals.billDiscount > 0 ? '-' : ''}
                    {currency(Math.abs(invoice.totals.billDiscount))}
                  </span>
                </div>
                <div className="flex justify-between px-2 py-1">
                  <span className="font-bold">Taxable Amount</span>
                  <span className="font-bold">{currency(invoice.totals.taxableAmount)}</span>
                </div>
                <div className="flex justify-between px-2 py-1">
                  <span>CGST</span>
                  <span>{currency(invoice.totals.cgst)}</span>
                </div>
                <div className="flex justify-between px-2 py-1">
                  <span>SGST/UTGST</span>
                  <span>{currency(invoice.totals.sgst)}</span>
                </div>
                <div className="flex justify-between px-2 py-1">
                  <span>CESS</span>
                  <span>{currency(invoice.totals.cess)}</span>
                </div>
                <div className="flex justify-between px-2 py-1">
                  <span>Round Off</span>
                  <span>{invoice.totals.roundOff}</span>
                </div>
                <div className="mt-1 flex items-center justify-between border-t border-black bg-gray-50 px-2 py-2 text-sm font-bold">
                  <span>Bill Total</span>
                  <span>{currency(invoice.totals.grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* 6. Signature Section */}
            <div className="flex h-24">
              <div className="w-1/2 border-r border-black">
                <div className="p-2 font-bold underline">Terms & Conditions:</div>
                <div className="px-2 text-[8px] italic">
                  1. Goods once sold will not be taken back.
                  <br />
                  2. Interest @18% p.a. will be charged if payment is not made within due date.
                  <br />
                  3. Subject to local jurisdiction.
                </div>
              </div>
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

const defaultInvoiceData: InvoiceData = {
  storeName: 'SPORTS HUB',
  header: {
    title: 'PURCHASE INVOICE',
    subTitle: '',
    originalFor: 'Original For Recipient',
    logoUrl: Logo,
  },
  seller: {
    name: 'N/A',
    addressLine1: '',
    addressLine2: '',
    cityStateZip: '',
    gstin: '',
    pan: '',
    phone: '',
    email: '',
  },
  invoiceDetails: {
    invoiceNo: '',
    invoiceDate: '',
    reverseCharge: 'No',
    placeOfSupply: '',
    station: '',
    ewayBillNo: '',
    vehicleNo: '',
    grRrNo: '',
    distance: '',
    shippingCompany: '',
  },
  billing: {
    name: 'N/A',
    addressLine1: '',
    addressLine2: '',
    cityStateZip: '',
    gstin: '',
    pan: '',
    phone: '',
    email: '',
  },
  shipping: {
    name: 'N/A',
    addressLine1: '',
    addressLine2: '',
    cityStateZip: '',
    gstin: '',
    pan: '',
    phone: '',
    email: '',
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
    amountInWords: '',
    taxAmountInWords: '',
  },
  taxTable: [],
  logistics: { mode: '', weight: '', bundles: '', chargesPaid: '', docExtraInfo: '', remarks: '' },
  signatory: { companyName: '' },
};

export default PurchaseBillInvoice;
