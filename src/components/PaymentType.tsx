import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  Wallet,
  Banknote,
  FileText,
  IndianRupee,
  X,
} from 'lucide-react';
import { COLORS } from '../constants/colors';

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
    { id: 'upi', description: 'UPI / CARD', icon: <CreditCard size={18} /> },
    {
      id: 'paytm',
      description: 'PayTM UPI / CARD',
      icon: <Wallet size={18} />,
    },
    // { id: "loyalty", description: "Loyalty Point", icon: <Star size={18} /> },
    { id: 'cash', description: 'Cash', icon: <Banknote size={18} /> },
    {
      id: 'advance',
      description: 'Advance Amount',
      icon: <FileText size={18} />,
    },
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      style={{ zIndex }}>
      {/* MODAL */}
      <div className="animate-in zoom-in-95 flex h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl duration-200">
        {/* HEADER */}
        <div
          className="custom-btn-primary flex items-center justify-between p-4"
          style={{ color: COLORS.white }}>
          <div>
            <h2 className="text-lg font-bold">Tender Detail</h2>
            <p className="text-[10px] font-bold uppercase text-gray-200">
              Payable Amount: ₹{totalAmount.toFixed(2)}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-300 transition hover:text-white">
            <X size={22} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 border-b border-gray-300 bg-gray-100">
            <div className="p-3 pl-10 text-[10px] font-bold uppercase tracking-widest text-gray-700">
              Description
            </div>
            <div className="p-3 pr-10 text-right text-[10px] font-bold uppercase tracking-widest text-gray-700">
              Net
            </div>
          </div>

          {rows.map((row) => (
            <div key={row.id} className="border-b last:border-b-0">
              <div
                onClick={() => toggleRow(row.id)}
                className={`grid cursor-pointer grid-cols-2 items-center transition-all hover:bg-gray-50 ${
                  activeRow === row.id ? 'bg-blue-50/50' : ''
                }`}>
                <div className="flex items-center gap-3 p-4 pl-10">
                  {activeRow === row.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  <span className="text-gray-500">{row.icon}</span>
                  <span className="text-sm font-bold text-gray-800">{row.description}</span>
                </div>
                <div className="flex items-center justify-end gap-1 p-4 pr-10 text-right font-mono font-bold">
                  <IndianRupee size={14} /> 0.00
                </div>
              </div>

              {activeRow === row.id && (
                <div className="shadow-inner border-t bg-gray-50 px-10 py-6">
                  {row.id === 'upi' && (
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Pending Amount" />
                      <InputField label="Net Amount" />
                      <div className="col-span-2">
                        <InputField label="Approval Code" />
                      </div>
                    </div>
                  )}

                  {row.id === 'paytm' && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="Pending Amount" />
                        <InputField label="Net Amount" />
                        <div className="col-span-2">
                          <InputField label="Approval Code" />
                        </div>
                      </div>
                      <div className="flex gap-2 border-t pt-4">
                        {['Generate Link', 'Generate QRCode', 'Verify Payment'].map((btn) => (
                          <button
                            key={btn}
                            className="custom-btn-primary flex-1 rounded py-2 text-[10px] font-extrabold uppercase"
                            style={{ color: COLORS.white }}>
                            {btn}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* {row.id === "loyalty" && (
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Redeem Points" />
                      <InputField label="Points Rate" />
                      <InputField label="Pending Amount" />
                      <InputField label="Net Amount" />
                    </div>
                  )} */}

                  {row.id === 'cash' && (
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Pending Amount" />
                      <InputField label="Amount Paid" />
                      <InputField
                        label="Amount to Refund"
                        className="bg-red-50 font-bold text-red-600"
                      />
                      <InputField label="Net Amount" />
                    </div>
                  )}

                  {row.id === 'advance' && (
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
        <div className="flex gap-3 border-t bg-gray-100 p-4">
          <button
            onClick={onClose}
            className="flex-1 rounded border bg-white py-2 font-bold text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button
            className="custom-btn-primary flex-[2] rounded py-2 font-bold shadow-md"
            style={{ color: COLORS.white }}>
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
}> = ({ label, placeholder = '0.00', className }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
      {label}
    </label>
    <input
      type="text"
      placeholder={placeholder}
      className={`custom-input w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none transition-all ${className}`}
    />
  </div>
);

export default PaymentType;
