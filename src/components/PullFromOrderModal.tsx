import React, { useState } from "react";
import { X, Calculator, CheckCircle, AlertCircle, Save } from "lucide-react";

// --- Types ---
interface OrderItem {
  id: string;
  itemName: string;
  sku: string;
  quantity: number;
  rate: number;
  taxCode: string;
  taxRate: number;
  existingDiscount: number;
  extraDiscount: number;
}

interface CustomerInfo {
  name: string;
  code: string;
  paymentStatus: "Paid" | "Pending" | "Overdue" | "Partial";
  orderNo: string;
  orderDate: string;
}

interface PullFromOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport?: (items: OrderItem[]) => void;
  index?: number; // CHANGED: Matches NameAndCodeMaster logic
}

const PullFromOrderModal: React.FC<PullFromOrderModalProps> = ({
  isOpen,
  onClose,
  onImport = () => {},
  index = 50, // Default index per your reference
}) => {
  // --- Theme & Index Logic ---
  const overlayZIndex = index + 10;
  const themeColor = "#0f3c63";

  // --- State ---
  const [customer] = useState<CustomerInfo>({
    name: "SPORTS HUB ENTERPRISES",
    code: "VEND-0024",
    paymentStatus: "Pending",
    orderNo: "PO-2025-882",
    orderDate: "2025-12-28",
  });

  const [items, setItems] = useState<OrderItem[]>([
    {
      id: "1",
      itemName: "Cricket Bat (English Willow)",
      sku: "BAT-EW-01",
      quantity: 10,
      rate: 4500,
      taxCode: "GST 12%",
      taxRate: 12,
      existingDiscount: 100,
      extraDiscount: 0,
    },
    {
      id: "2",
      itemName: "Leather Ball (Red)",
      sku: "BALL-RD-55",
      quantity: 50,
      rate: 400,
      taxCode: "GST 12%",
      taxRate: 12,
      existingDiscount: 0,
      extraDiscount: 0,
    },
    {
      id: "3",
      itemName: "Batting Pads (Pro)",
      sku: "PAD-PRO-99",
      quantity: 5,
      rate: 1200,
      taxCode: "GST 18%",
      taxRate: 18,
      existingDiscount: 50,
      extraDiscount: 0,
    },
  ]);

  // --- Handlers ---
  const handleExtraDiscountChange = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, extraDiscount: numValue } : item
      )
    );
  };

  const calculateRow = (item: OrderItem) => {
    const baseAmount = item.rate * item.quantity;
    const totalDiscount = item.existingDiscount + item.extraDiscount;
    const taxableValue = Math.max(0, baseAmount - totalDiscount);
    const taxAmount = taxableValue * (item.taxRate / 100);
    const netAmount = taxableValue + taxAmount;

    return { baseAmount, taxableValue, taxAmount, netAmount };
  };

  const grandTotal = items.reduce(
    (acc, item) => {
      const { netAmount, taxAmount } = calculateRow(item);
      return {
        totalNet: acc.totalNet + netAmount,
        totalTax: acc.totalTax + taxAmount,
      };
    },
    { totalNet: 0, totalTax: 0 }
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      style={{ zIndex: overlayZIndex }}
    >
      <div className="w-full max-w-5xl bg-white border border-gray-300 shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
        {/* --- Header (Themed) --- */}
        <div
          className="flex justify-between items-center px-4 py-3 text-white"
          style={{ backgroundColor: themeColor }}
        >
          <div>
            <span className="font-semibold tracking-wide text-sm flex items-center gap-2">
              <Calculator size={18} className="text-white" />
              Pull Items from Order
            </span>
            <p className="text-xs text-blue-100 opacity-80 mt-0.5">
              Review items and apply additional discounts before importing.
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="hover:bg-white/20 rounded p-0.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* --- Info Section --- */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 border-b border-gray-200">
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Vendor Name
            </span>
            <div className="text-sm font-medium text-gray-800">
              {customer.name}
            </div>
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Vendor Code
            </span>
            <div className="text-sm font-medium text-gray-800">
              {customer.code}
            </div>
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Order Ref
            </span>
            <div className="text-sm font-medium text-gray-800">
              {customer.orderNo}{" "}
              <span className="text-xs text-gray-500 font-normal">
                ({customer.orderDate})
              </span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Payment Status
            </span>
            <div className="mt-1">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border
                ${
                  customer.paymentStatus === "Paid"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : customer.paymentStatus === "Pending"
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {customer.paymentStatus === "Paid" ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                {customer.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* --- Table Body --- */}
        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-[11px] text-gray-600 uppercase bg-gray-100 sticky top-0 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 font-semibold">Item Details</th>
                <th className="px-4 py-2 text-right font-semibold">Qty</th>
                <th className="px-4 py-2 text-right font-semibold">Rate</th>
                <th className="px-4 py-2 text-right font-semibold">Base Amt</th>
                <th className="px-4 py-2 text-right font-semibold">Tax (%)</th>
                <th className="px-4 py-2 text-right font-semibold text-gray-400">
                  Old Disc
                </th>
                <th className="px-4 py-2 w-28 text-center font-semibold text-[#0f3c63]">
                  Extra Disc.
                </th>
                <th className="px-4 py-2 text-right font-semibold text-gray-800">
                  Net Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => {
                const calculations = calculateRow(item);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-gray-800 text-[13px]">
                        {item.itemName}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        SKU: {item.sku}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-700 text-[13px]">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-700 text-[13px]">
                      {item.rate.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-500 text-[13px]">
                      {calculations.baseAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="text-[12px] text-gray-700">
                        {item.taxCode}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {calculations.taxAmount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-400 text-[12px] line-through decoration-red-300">
                      {item.existingDiscount > 0 ? item.existingDiscount : "-"}
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="number"
                        min="0"
                        className="w-full h-[26px] px-2 text-right text-[#0f3c63] border border-gray-300 rounded-sm focus:border-[#0f3c63] focus:outline-none bg-white text-[13px]"
                        value={item.extraDiscount || ""}
                        placeholder="0"
                        onChange={(e) =>
                          handleExtraDiscountChange(item.id, e.target.value)
                        }
                      />
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-gray-800 text-[13px]">
                      {calculations.netAmount.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* --- Footer (Themed) --- */}
        <div
          className="p-3 flex items-center justify-between border-t border-gray-300 mt-auto"
          style={{ backgroundColor: themeColor }}
        >
          <div className="flex gap-6 text-white">
            <div className="text-right flex items-center gap-2">
              <span className="text-[11px] opacity-70 uppercase tracking-wide">
                Total Tax:
              </span>
              <span className="font-semibold text-sm">
                ₹ {grandTotal.totalTax.toFixed(2)}
              </span>
            </div>
            <div className="h-5 w-px bg-white/20"></div>
            <div className="text-right flex items-center gap-2">
              <span className="text-[11px] opacity-70 uppercase tracking-wide">
                Grand Total:
              </span>
              <span className="font-bold text-lg text-yellow-400">
                ₹ {grandTotal.totalNet.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 border border-white/40 text-white text-sm font-semibold rounded-sm hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onImport(items)}
              className="flex items-center gap-2 px-4 py-1.5 border border-white bg-white text-[#0f3c63] text-sm font-bold rounded-sm hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Save size={16} />
              Import Items
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PullFromOrderModal;
