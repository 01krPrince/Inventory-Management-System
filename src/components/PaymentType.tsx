import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  Wallet,
  Star,
  Banknote,
  FileText,
  IndianRupee,
  X,
} from "lucide-react";
import { COLORS } from "../constants/colors";

interface PaymentTypeProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  zIndex?: number;
}

interface RowData {
  id: string;
  description: string;
  icon: React.ReactNode;
}

const PaymentType: React.FC<PaymentTypeProps> = ({
  isOpen,
  onClose,
  totalAmount,
  zIndex = 1000,
}) => {
  const [activeRow, setActiveRow] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleRow = (id: string) => {
    setActiveRow(activeRow === id ? null : id);
  };

  const rows: RowData[] = [
    { id: "upi", description: "UPI / CARD", icon: <CreditCard size={18} /> },
    {
      id: "paytm",
      description: "PayTM UPI / CARD",
      icon: <Wallet size={18} />,
    },
    { id: "loyalty", description: "Loyalty Point", icon: <Star size={18} /> },
    { id: "cash", description: "Cash", icon: <Banknote size={18} /> },
    {
      id: "advance",
      description: "Advance Amount",
      icon: <FileText size={18} />,
    },
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      style={{ zIndex }}
    >
      {/* MODAL */}
      <div className="bg-white w-full max-w-xl h-[70vh] rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div
          className="custom-btn-primary p-4 flex justify-between items-center"
          style={{ color: COLORS.white }}
        >
          <div>
            <h2 className="font-bold text-lg">Tender Detail</h2>
            <p className="text-gray-200 text-[10px] uppercase font-bold">
              Payable Amount: ₹{totalAmount.toFixed(2)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 bg-gray-100 border-b border-gray-300">
            <div className="p-3 pl-10 font-bold text-gray-700 uppercase text-[10px] tracking-widest">
              Description
            </div>
            <div className="p-3 pr-10 font-bold text-gray-700 uppercase text-[10px] tracking-widest text-right">
              Net
            </div>
          </div>

          {rows.map((row) => (
            <div key={row.id} className="border-b last:border-b-0">
              <div
                onClick={() => toggleRow(row.id)}
                className={`grid grid-cols-2 items-center cursor-pointer transition-all hover:bg-gray-50 ${
                  activeRow === row.id ? "bg-blue-50/50" : ""
                }`}
              >
                <div className="p-4 pl-10 flex items-center gap-3">
                  {activeRow === row.id ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                  <span className="text-gray-500">{row.icon}</span>
                  <span className="text-sm font-bold text-gray-800">
                    {row.description}
                  </span>
                </div>
                <div className="p-4 pr-10 text-right flex justify-end items-center gap-1 font-mono font-bold">
                  <IndianRupee size={14} /> 0.00
                </div>
              </div>

              {activeRow === row.id && (
                <div className="px-10 py-6 bg-gray-50 border-t shadow-inner">
                  {row.id === "upi" && (
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Pending Amount" />
                      <InputField label="Net Amount" />
                      <div className="col-span-2">
                        <InputField label="Approval Code" />
                      </div>
                    </div>
                  )}

                  {row.id === "paytm" && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="Pending Amount" />
                        <InputField label="Net Amount" />
                        <div className="col-span-2">
                          <InputField label="Approval Code" />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4 border-t">
                        {[
                          "Generate Link",
                          "Generate QRCode",
                          "Verify Payment",
                        ].map((btn) => (
                          <button
                            key={btn}
                            className="custom-btn-primary flex-1 py-2 rounded text-[10px] font-extrabold uppercase"
                            style={{ color: COLORS.white }}
                          >
                            {btn}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {row.id === "loyalty" && (
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Redeem Points" />
                      <InputField label="Points Rate" />
                      <InputField label="Pending Amount" />
                      <InputField label="Net Amount" />
                    </div>
                  )}

                  {row.id === "cash" && (
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Pending Amount" />
                      <InputField label="Amount Paid" />
                      <InputField
                        label="Amount to Refund"
                        className="text-red-600 bg-red-50 font-bold"
                      />
                      <InputField label="Net Amount" />
                    </div>
                  )}

                  {row.id === "advance" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <InputField label="Doc No" />
                      </div>
                      <InputField label="Pending Amount" />
                      <InputField label="Net Amount" />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FOOTER (ALWAYS BOTTOM) */}
        <div className="p-4 bg-gray-100 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border rounded font-bold text-gray-600 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            className="custom-btn-primary flex-[2] py-2 rounded font-bold shadow-md"
            style={{ color: COLORS.white }}
          >
            Finish Payment
          </button>
        </div>
      </div>

      <style>{`
        .custom-btn-primary {
          background-color: ${COLORS.primary};
        }
        .custom-btn-primary:hover {
          background-color: ${COLORS.primaryHover};
        }
        .custom-input:focus {
          border-color: ${COLORS.info} !important;
          box-shadow: 0 0 0 2px ${COLORS.info}20;
        }
      `}</style>
    </div>
  );
};

const InputField: React.FC<{
  label: string;
  placeholder?: string;
  className?: string;
}> = ({ label, placeholder = "0.00", className }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">
      {label}
    </label>
    <input
      type="text"
      placeholder={placeholder}
      className={`w-full border border-gray-300 rounded py-2 px-3 text-sm outline-none transition-all custom-input ${className}`}
    />
  </div>
);

export default PaymentType;
