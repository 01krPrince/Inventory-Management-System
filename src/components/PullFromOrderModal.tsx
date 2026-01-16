import React, { useState } from "react";
import { X, Calculator, TrendingUp, ArrowUpRight, Wallet } from "lucide-react";

interface OrderItem {
  id: string;
  itemName: string;
  sku: string;
  quantity: number;
  rate: number;
  costPrice: number;
  taxCode: string;
  taxRate: number;
  existingDiscount: number;
  extraDiscount: number;
  extraDiscountType: "flat" | "percent";
}

// interface CustomerInfo {
//   name: string;
//   code: string;
//   paymentStatus: "Paid" | "Pending" | "Overdue" | "Partial";
//   orderNo: string;
//   orderDate: string;
// }

interface PullFromOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport?: (items: OrderItem[]) => void;
  index?: number;
}

const PullFromOrderModal: React.FC<PullFromOrderModalProps> = ({
  isOpen,
  onClose,
  index = 50,
}) => {
  const overlayZIndex = index + 10;
  const themeColor = "#0f3c63"; // Deep Blue

  const [items] = useState<OrderItem[]>([
    {
      id: "1",
      itemName: "Cricket Bat (English Willow)",
      sku: "BAT-EW-01",
      quantity: 10,
      rate: 4500,
      costPrice: 3200,
      taxCode: "GST 12%",
      taxRate: 12,
      existingDiscount: 100,
      extraDiscount: 0,
      extraDiscountType: "flat",
    },
    {
      id: "2",
      itemName: "Leather Ball (Red)",
      sku: "BALL-RD-55",
      quantity: 50,
      rate: 400,
      costPrice: 250,
      taxCode: "GST 12%",
      taxRate: 12,
      existingDiscount: 0,
      extraDiscount: 5,
      extraDiscountType: "percent",
    },
    {
      id: "3",
      itemName: "Batting Pads (Pro)",
      sku: "PAD-PRO-99",
      quantity: 5,
      rate: 1200,
      costPrice: 850,
      taxCode: "GST 18%",
      taxRate: 18,
      existingDiscount: 50,
      extraDiscount: 0,
      extraDiscountType: "flat",
    },
  ]);

  const calculateRow = (item: OrderItem) => {
    const totalSalesBase = item.rate * item.quantity;
    const totalCost = item.costPrice * item.quantity;

    let extraDiscountAmount = 0;
    if (item.extraDiscountType === "percent") {
      extraDiscountAmount = (totalSalesBase * item.extraDiscount) / 100;
    } else {
      extraDiscountAmount = item.extraDiscount;
    }

    const totalDiscount = item.existingDiscount + extraDiscountAmount;
    const taxableValue = Math.max(0, totalSalesBase - totalDiscount);
    const taxAmount = taxableValue * (item.taxRate / 100);
    const netSalesAmount = taxableValue + taxAmount;

    const profit = netSalesAmount - totalCost;
    const marginPercent =
      netSalesAmount > 0 ? (profit / netSalesAmount) * 100 : 0;

    return { totalCost, netSalesAmount, profit, marginPercent };
  };
  // Recalculate correctly for display
  const finalSales = items.reduce(
    (sum, item) => sum + calculateRow(item).netSalesAmount,
    0
  );
  const finalCost = items.reduce(
    (sum, item) => sum + calculateRow(item).totalCost,
    0
  );
  const finalProfit = finalSales - finalCost;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      style={{ zIndex: overlayZIndex }}
    >
      <div className="w-full max-w-6xl bg-white border border-gray-300 shadow-2xl rounded-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Same Color */}
        <div
          className="flex justify-between items-center px-5 py-4 text-white"
          style={{ backgroundColor: themeColor }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-md">
              <Calculator size={20} />
            </div>
            <div>
              <h2 className="font-bold tracking-tight text-sm uppercase">
                Item Profit Analysis
              </h2>
              <p className="text-[10px] text-blue-200">
                Reviewing PO-2026-882 • Sports Hub Enterprises
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-full p-1.5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-[10px] text-gray-500 uppercase bg-gray-50 sticky top-0 border-b border-gray-200 z-10">
              <tr>
                <th className="px-6 py-4 font-bold">Product Information</th>
                <th className="px-4 py-4 text-right font-bold">Qty</th>
                <th className="px-4 py-4 text-right font-bold">Unit Cost</th>
                <th className="px-4 py-4 text-right font-bold">Unit Rate</th>
                <th className="px-4 py-4 text-right font-bold">Total Cost</th>
                <th className="px-4 py-4 text-right font-bold">
                  Total Revenue
                </th>
                <th className="px-6 py-4 text-right font-bold bg-blue-50/50 text-blue-900">
                  Est. Profit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => {
                const row = calculateRow(item);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">
                        {item.itemName}
                      </div>
                      <div className="text-[10px] font-mono text-gray-400">
                        {item.sku}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-medium">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-4 text-right text-gray-500">
                      ₹{item.costPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right text-gray-500">
                      ₹{item.rate.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right text-gray-600 font-medium">
                      ₹{row.totalCost.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right text-gray-900 font-bold">
                      ₹{row.netSalesAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right bg-blue-50/30">
                      <div
                        className={`font-black text-sm ${
                          row.profit >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        ₹{row.profit.toLocaleString()}
                      </div>
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                        {row.marginPercent.toFixed(1)}% Margin
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer - Matched Header Color */}
        <div
          className="p-5 border-t border-white/10 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.1)]"
          style={{ backgroundColor: themeColor }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* Cost Summary */}
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Wallet size={12} /> Total Cost
                </span>
                <span className="text-xl font-bold text-white">
                  ₹ {finalCost.toLocaleString()}
                </span>
              </div>

              {/* Revenue Summary */}
              <div className="flex flex-col border-l border-white/10 pl-8">
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <ArrowUpRight size={12} /> Total Revenue
                </span>
                <span className="text-xl font-bold text-white">
                  ₹ {finalSales.toLocaleString()}
                </span>
              </div>

              {/* Profit Summary */}
              <div className="flex flex-col border-l border-white/10 pl-8">
                <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <TrendingUp size={12} /> Net Profit
                </span>
                <span className="text-2xl font-black text-yellow-400">
                  ₹ {finalProfit.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={onClose}
                className="flex-1 md:flex-none px-8 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-blue-950 text-xs font-black rounded shadow-lg shadow-black/20 transition-all active:scale-95 uppercase tracking-wider"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PullFromOrderModal;
