import React, { useRef } from 'react';
import { PrintIcon } from '../function/functions'; // Assuming this is a custom icon component
import { Share2 } from 'lucide-react';

// --- Types ---
interface InvoiceItem {
  id: string | number;
  description: string;
  qty: number;
  uom: string;
  rate: number;
  amount: number;
  warranty?: string;
}

interface Address {
  name: string;
  addressLine: string;
  cityStateZip: string;
  stateCode?: string;
  gstin?: string;
}

interface InvoiceData {
  storeName?: string;
  remarks?: string;
  invoiceNo: string;
  date: string;
  billType: string;
  placeOfSupply: string;
  customer: Address;
  shipping?: Address;
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
  data?: InvoiceData;
}

const InvoiceA4: React.FC<InvoiceProps> = ({ data }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = componentRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'height=800,width=900');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print Invoice</title>');

      // Append all stylesheet links
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      links.forEach((link) => {
        const newLink = printWindow.document.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = (link as HTMLLinkElement).href;
        printWindow.document.head.appendChild(newLink);
      });

      // Append all inline styles
      const styles = document.querySelectorAll('style');
      styles.forEach((style) => {
        printWindow.document.head.appendChild(style.cloneNode(true));
      });

      // Custom print styles for perfect A4 sizing
      const customStyle = printWindow.document.createElement('style');
      customStyle.innerHTML = `
        @page { size: A4 portrait; margin: 0; }
        body { margin: 0; padding: 0; background-color: white; -webkit-print-color-adjust: exact; color-adjust: exact; }
        html { margin: 0; padding: 0; }
      `;
      printWindow.document.head.appendChild(customStyle);

      printWindow.document.write('</head><body>');
      printWindow.document.write(printContent.outerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();

      // Wait for content to load before printing
      printWindow.onload = () => {
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          // Optionally close the window after print, but better to let user handle
          // printWindow.close();
        }, 500);
      };
    }
  };

  const handleShare = async () => {
    const activeData = data || defaultData;
    const totalAmount = activeData.items.reduce((sum, item) => sum + item.amount, 0);

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice ${activeData.invoiceNo}`,
          text: `Invoice from ${activeData.storeName || 'Store'}. Total: ₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          url: window.location.href, // Consider generating a shareable PDF URL if possible
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Browser sharing not supported. Please use the Print button to Save as PDF.');
    }
  };

  const defaultData: InvoiceData = {
    storeName: 'CHANDAN KHEL GHAR',
    remarks: '',
    invoiceNo: '00043/25-26',
    date: '14/11/2025',
    billType: 'Credit',
    placeOfSupply: 'Bihar',
    grlrNo: '',
    destination: '',
    stateCode: 'BR',
    customer: {
      name: 'Ashutosh Kumar',
      addressLine: 'Vill+p.o+p s.-brahmpur, Dist-buxar',
      cityStateZip: 'Bihar, Pin-802112',
      stateCode: '10',
      gstin: 'Unregistered',
    },
    items: [],
    amountInWords: 'Zero Only',
    bankDetails: {
      bankName: 'BANK OF BARODA',
      ifsc: 'BARBOPANDAS',
      accountNo: '5086 0500 0001 11',
    },
    terms: ['1. NO MONEY REFUND.'],
  };

  const activeData = data || defaultData;
  const shippingAddress = activeData.shipping || activeData.customer;
  const totalAmount = activeData.items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="flex min-h-screen w-auto flex-col items-center bg-gray-100 pb-7 font-sans">
      {/* Buttons for Print and Share */}
      <div className="mb-4 mt-4 flex gap-2">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-lg border border-gray-300 p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          title="Print Invoice">
          <PrintIcon className="size-5" /> Print / Save PDF
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 rounded-lg border border-blue-300 p-2 text-blue-600 transition hover:bg-blue-50"
          title="Share">
          <Share2 className="size-5" /> Share
        </button>
      </div>

      {/* Invoice Content - Sized exactly for A4 */}
      <div
        ref={componentRef}
        className="relative box-border min-h-[297mm] w-[210mm] overflow-hidden bg-white text-sm text-black shadow-lg print:m-0 print:h-auto print:w-auto print:p-0 print:shadow-none"
        style={{ padding: '10mm', boxSizing: 'border-box' }} // Internal padding acts as margin
      >
        {/* Header */}
        <div className="flex items-start justify-between p-2">
          <div>
            <span className="font-bold">GSTIN: 10HACPS7876F1ZF</span>
          </div>
          <div className="text-lg font-bold uppercase underline decoration-1 underline-offset-2">
            Bill of Supply
          </div>
          <div className="text-right text-xs">Original For Recipient</div>
        </div>

        {/* Branding */}
        <div className="relative py-2 text-center">
          <div className="px-24">
            <h1 className="text-3xl font-bold uppercase tracking-wide">{activeData.storeName}</h1>
            <p className="text-[14px] font-extrabold">
              {/* Registered under {activeData.storeName} */}
              Registered Under Chandan Khel Ghar
            </p>
            <p className="text-[14px] font-medium">
              VIP ROAD, Laheriasarai, Darbhanga, Bihar 846001
            </p>
            <p className="mt-1 text-[14px] font-extrabold">
              Sports Fitness * Trophy & Awards * Garments
            </p>
            <p className="mt-1 text-[14px] font-extrabold">
              Phone No: 9852380932 | Email: INFO@SPORTS.COM
            </p>
          </div>
          <div className="absolute right-2 top-[4vh] flex -translate-y-1/2 transform flex-col items-end">
            <div className="mb-2 text-right text-xs font-semibold">Scan for Payment</div>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(activeData.invoiceNo)}`} // Encoded for safety
              alt="QR Code"
              className="h-20 w-20 object-contain"
            />
          </div>
        </div>

        {/* State Code */}
        <div className="-mt-5 mb-1 flex w-full justify-end">
          <div className="mr-1 font-semibold">State Code:</div>
          <div>{activeData.stateCode}</div>
        </div>

        {/* Invoice Details Border */}
        <div className="border border-black">
          {/* Invoice Info Grid */}
          <div className="grid grid-cols-4 text-sm">
            <div className="pl-2 font-semibold">Invoice No.</div>
            <div className="pl-2">{activeData.invoiceNo}</div>
            <div className="pl-2 font-semibold">Invoice Date</div>
            <div className="pl-2">{activeData.date}</div>
            <div className="pl-2 font-semibold">Bill Type</div>
            <div className="pl-2">{activeData.billType}</div>
            <div className="pl-2 font-semibold">GR / LR No</div>
            <div className="pl-2">{activeData.grlrNo || '-'}</div>
            <div className="border-b border-black pb-1 pl-2 font-semibold">Place of Supply</div>
            <div className="border-b border-black pl-2">{activeData.placeOfSupply}</div>
            <div className="border-b border-black pl-2 font-semibold">Destination</div>
            <div className="border-b border-black pl-2">{activeData.destination || '-'}</div>
          </div>

          {/* Addresses */}
          <div className="border-b border-black text-sm">
            <div className="flex w-full border-b border-black">
              <p className="w-1/2 border-r border-black p-2 font-bold">
                Customer Name & Billing Address
              </p>
              <p className="w-1/2 p-2 font-bold">Shipping Address</p>
            </div>
            <div className="flex">
              <div className="w-1/2 border-r border-black p-2">
                <p className="font-semibold uppercase">{activeData.customer.name}</p>
                <p>{activeData.customer.addressLine}</p>
                <p>{activeData.customer.cityStateZip}</p>
                <div className="flex">
                  <p className="mt-1 w-1/2">
                    <span className="font-semibold">State Code:</span>{' '}
                    {activeData.customer.stateCode}
                  </p>
                  <p className="mt-1">
                    <span className="font-semibold">GSTIN:</span>{' '}
                    {activeData.customer.gstin || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="w-1/2 p-2">
                <p className="font-semibold uppercase">{shippingAddress.name}</p>
                <p>{shippingAddress.addressLine}</p>
                <p>{shippingAddress.cityStateZip}</p>
                <p className="mt-1">
                  <span className="font-semibold">State Code:</span> {shippingAddress.stateCode}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="w-full">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-black bg-gray-100 text-center">
                  <th className="w-[5%] border-r border-black p-1">S No</th>
                  <th className="w-[45%] border-r border-black p-1 text-left">Description</th>
                  <th className="w-[10%] border-r border-black p-1">Qty</th>
                  <th className="w-[10%] border-r border-black p-1">UOM</th>
                  <th className="w-[15%] border-r border-black p-1 text-right">Item Rate</th>
                  <th className="w-[15%] p-1 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                {activeData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border-r border-black p-1 text-center">{index + 1}</td>
                    <td className="border-r border-black p-1 font-medium">
                      <div>{item.description}</div>
                      {item.warranty && (
                        <div className="mt-0.5 text-[10px] font-normal text-gray-600">
                          ({item.warranty})
                        </div>
                      )}
                    </td>
                    <td className="border-r border-black p-1 text-center">{item.qty}</td>
                    <td className="border-r border-black p-1 text-center">{item.uom}</td>
                    <td className="border-r border-black p-1 text-right">
                      {item.rate.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="p-1 text-right font-bold">
                      {item.amount.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
                {/* Empty rows to maintain consistent height (up to 15 items) */}
                {activeData.items.length < 15 &&
                  Array.from({ length: 15 - activeData.items.length }).map((_, i) => (
                    <tr key={`empty-${i}`} className="h-6">
                      <td className="border-r border-black"></td>
                      <td className="border-r border-black"></td>
                      <td className="border-r border-black"></td>
                      <td className="border-r border-black"></td>
                      <td className="border-r border-black"></td>
                      <td></td>
                    </tr>
                  ))}
                {/* Total Row */}
                <tr className="border-t border-black">
                  <td className="border-r border-black p-1 text-center"></td>
                  <td className="border-r border-black p-1 font-bold">Total</td>
                  <td className="border-r border-black p-1 text-center">
                    {activeData.items.reduce((acc, item) => acc + item.qty, 0)}
                  </td>
                  <td className="border-r border-black p-1 text-center"></td>
                  <td className="border-r border-black p-1 text-right"></td>
                  <td className="p-1 text-right font-bold">
                    {totalAmount.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amount in Words and Totals */}
          <div className="flex border-t border-black">
            <div className="flex-grow border-r border-black p-2">
              <p className="text-xs font-bold">Amount In Words:</p>
              <p className="text-sm uppercase italic">{activeData.amountInWords}</p>
              {/* Remarks */}
              {activeData.remarks && (
                <div className="mt-2">
                  <p className="text-xs font-bold">Remarks:</p>
                  <p className="text-xs text-gray-700">{activeData.remarks}</p>
                </div>
              )}
            </div>
            <div className="w-[30%]">
              <div className="flex justify-between border-b border-black bg-gray-50 p-1 font-bold">
                <span>Sub Total</span>
                <span>
                  {totalAmount.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between p-1 text-lg font-bold">
                <span>Bill Total</span>
                <span>
                  {totalAmount.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Bank Details, Terms, and Signatory */}
          <div className="grid grid-cols-2 border-t border-black">
            <div className="border-r border-black p-2 text-xs">
              {activeData.bankDetails && (
                <div className="mb-2">
                  <p className="font-bold underline">Bank Details:</p>
                  <p>{activeData.bankDetails.bankName}</p>
                  <p>IFSC: {activeData.bankDetails.ifsc}</p>
                  <p>A/C: {activeData.bankDetails.accountNo}</p>
                </div>
              )}
              <div className="mt-2">
                <p className="font-bold underline">Terms and Conditions:</p>
                <ul className="mt-1 list-none space-y-1 pl-0">
                  {activeData.terms?.map((term, i) => <li key={i}>{term}</li>)}
                </ul>
              </div>
            </div>
            <div className="flex min-h-[150px] flex-col justify-between p-2 text-center">
              <div className="mb-2 border-b border-black pb-1 text-center text-xs font-bold">
                Composition taxable person, not eligible to collect tax on supplies.
              </div>
              <div>
                <p className="mb-8 text-xs">For {activeData.storeName}</p>
                <div className="h-10"></div> {/* Space for signature */}
                <p className="inline-block border-t border-black/50 px-8 pt-1 text-xs font-bold">
                  Authorized Signatory
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="text-center text-[10px] mt-2 text-gray-500">
          THANKS VISIT AGAIN
        </div> */}
      </div>
    </div>
  );
};

export default InvoiceA4;
