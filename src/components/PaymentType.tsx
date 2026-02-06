import React, { useState, useEffect } from 'react';
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
  onConfirm?: (payments: any[]) => void;
  zIndex?: number;
}

interface RowData {
  id: string;
  description: string;
  icon: React.ReactNode;
}

interface PaymentEntry {
  mode: string;
  netAmount: number;
  pendingAmount: number;
  approvalCode?: string;
  givenByCustomer?: number;
  docNo?: string;
}

const PaymentType: React.FC<PaymentTypeProps> = ({
  isOpen,
  onClose,
  totalAmount,
  onConfirm,
  zIndex = 1000,
}) => {
  const [activeRow, setActiveRow] = useState<string | null>('cash'); // Default open 'cash'

  const [payments, setPayments] = useState<Record<string, PaymentEntry>>({});

  useEffect(() => {
    if (isOpen) {
      setPayments({});
      setActiveRow('cash');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getTotalEntered = () => {
    return Object.values(payments).reduce((sum, p) => sum + (p.netAmount || 0), 0);
  };

  const getPendingBalance = () => {
    const entered = getTotalEntered();
    const pending = totalAmount - entered;
    return pending > 0 ? pending : 0;
  };

  const getPaymentData = (modeId: string) => {
    return payments[modeId] || { mode: modeId, netAmount: 0, pendingAmount: 0 };
  };

  const toggleRow = (id: string) => {
    if (activeRow === id) {
      setActiveRow(null);
    } else {
      setActiveRow(id);
      const currentVal = getPaymentData(id).netAmount;
      if (currentVal === 0) {
        const remaining = getPendingBalance();
        if (remaining > 0) {
          handleInputChange(id, 'netAmount', String(remaining));
        }
      }
    }
  };

  const handleInputChange = (modeId: string, field: keyof PaymentEntry, value: string) => {
    const numVal = parseFloat(value) || 0;

    setPayments((prev) => {
      const currentModeData = prev[modeId] || { mode: modeId, netAmount: 0, pendingAmount: 0 };

      const updatedModeData = {
        ...currentModeData,
        [field]: field === 'approvalCode' || field === 'docNo' ? value : numVal,
      };

      return { ...prev, [modeId]: updatedModeData };
    });
  };

  const handleCashPaidChange = (val: string) => {
    handleInputChange('cash', 'givenByCustomer', val);
  };

  const handleFinish = () => {
    const paymentArray = Object.values(payments).filter((p) => p.netAmount > 0);

    if (onConfirm) {
      onConfirm(paymentArray);
    }
    onClose();
  };

  const rows: RowData[] = [
    { id: 'upi', description: 'UPI / CARD', icon: <CreditCard size={18} /> },
    { id: 'paytm', description: 'PayTM UPI / CARD', icon: <Wallet size={18} /> },
    { id: 'cash', description: 'Cash', icon: <Banknote size={18} /> },
    { id: 'advance', description: 'Advance / Credit Note', icon: <FileText size={18} /> },
  ];

  const totalEntered = getTotalEntered();
  const balanceDue = totalAmount - totalEntered;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      style={{ zIndex }}>
      <div className="animate-in zoom-in-95 flex h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl duration-200">
        <div
          className="custom-btn-primary flex items-center justify-between p-4"
          style={{ color: COLORS.white }}>
          <div>
            <h2 className="text-lg font-bold">Payment Details</h2>
            <div className="mt-1 flex gap-4 text-[11px] font-bold uppercase text-blue-100">
              <span>Total: ₹{totalAmount}</span>
              <span> | </span>
              <span>Paid: ₹{totalEntered}</span>
              <span> | </span>
              <span className={balanceDue > 0.01 ? 'text-yellow-300' : 'text-white'}>
                Bal: ₹{balanceDue > 0 ? balanceDue : '0.00'}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-blue-200 transition hover:text-white">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-10 grid grid-cols-2 border-b border-gray-300 bg-gray-100">
            <div className="p-3 pl-10 text-[10px] font-bold uppercase tracking-widest text-gray-700">
              Payment Mode
            </div>
            <div className="p-3 pr-10 text-right text-[10px] font-bold uppercase tracking-widest text-gray-700">
              Amount Entered
            </div>
          </div>

          {rows.map((row) => {
            const data = getPaymentData(row.id);
            const isRowActive = activeRow === row.id;

            return (
              <div key={row.id} className="border-b last:border-b-0">
                <div
                  onClick={() => toggleRow(row.id)}
                  className={`grid cursor-pointer grid-cols-2 items-center transition-all hover:bg-gray-50 ${
                    isRowActive ? 'bg-blue-50/50' : ''
                  }`}>
                  <div className="flex items-center gap-3 p-4 pl-10">
                    {isRowActive ? (
                      <ChevronUp size={14} className="text-blue-500" />
                    ) : (
                      <ChevronDown size={14} className="text-gray-400" />
                    )}
                    <span className={isRowActive ? 'text-blue-600' : 'text-gray-500'}>
                      {row.icon}
                    </span>
                    <span
                      className={`text-sm font-bold ${isRowActive ? 'text-blue-700' : 'text-gray-800'}`}>
                      {row.description}
                    </span>
                  </div>
                  <div
                    className={`flex items-center justify-end gap-1 p-4 pr-10 text-right font-mono font-bold ${data.netAmount > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                    <IndianRupee size={14} /> {data.netAmount}
                  </div>
                </div>

                {isRowActive && (
                  <div className="shadow-inner animate-in slide-in-from-top-2 border-t bg-gray-50 px-10 py-6 duration-200">
                    {row.id === 'upi' && (
                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="Net Amount"
                          value={data.netAmount}
                          onChange={(val) => handleInputChange('upi', 'netAmount', val)}
                          autoFocus
                        />
                        <InputField
                          label="Approval Code / Ref"
                          value={data.approvalCode}
                          onChange={(val) => handleInputChange('upi', 'approvalCode', val)}
                          placeholder="txn_123456"
                        />
                      </div>
                    )}

                    {row.id === 'paytm' && (
                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                          <InputField
                            label="Net Amount"
                            value={data.netAmount}
                            onChange={(val) => handleInputChange('paytm', 'netAmount', val)}
                            autoFocus
                          />
                          <div className="col-span-1">
                            <InputField
                              label="Transaction ID"
                              value={data.approvalCode}
                              onChange={(val) => handleInputChange('paytm', 'approvalCode', val)}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 border-t pt-4">
                          {['Generate Link', 'Show QR', 'Verify'].map((btn) => (
                            <button
                              key={btn}
                              type="button"
                              className="custom-btn-primary flex-1 rounded py-2 text-[10px] font-extrabold uppercase opacity-90 shadow-sm hover:opacity-100"
                              style={{ color: COLORS.white }}>
                              {btn}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {row.id === 'cash' && (
                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="Amount Paid (Given)"
                          value={data.givenByCustomer}
                          onChange={handleCashPaidChange}
                          placeholder="e.g. 2000"
                          autoFocus
                        />
                        <InputField
                          label="Bill Amount (Net)"
                          value={data.netAmount}
                          onChange={(val) => handleInputChange('cash', 'netAmount', val)}
                        />

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
                            To Refund
                          </label>
                          <div className="w-full rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-600">
                            {(data.givenByCustomer || 0) - (data.netAmount || 0)}
                          </div>
                        </div>
                      </div>
                    )}

                    {row.id === 'advance' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <InputField
                            label="Document No / CN No"
                            value={data.docNo}
                            onChange={(val) => handleInputChange('advance', 'docNo', val)}
                            placeholder="CN-2025-XXXX"
                            autoFocus
                          />
                        </div>
                        <InputField
                          label="Amount to Adjust"
                          value={data.netAmount}
                          onChange={(val) => handleInputChange('advance', 'netAmount', val)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 border-t bg-gray-100 p-4">
          <button
            onClick={onClose}
            className="flex-1 rounded border border-gray-300 bg-white py-2 font-bold text-gray-600 transition-colors hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleFinish}
            disabled={balanceDue > 0.99}
            className="custom-btn-primary flex-[2] rounded py-2 font-bold shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            style={{ color: COLORS.white }}>
            {balanceDue > 0.99 ? `Pay Balance (₹${balanceDue})` : 'Confirm Payment'}
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
          border-color: ${COLORS.primary} !important;
          box-shadow: 0 0 0 2px ${COLORS.primary}20;
        }
      `}</style>
    </div>
  );
};

const InputField: React.FC<{
  label: string;
  value?: string | number;
  onChange?: (val: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}> = ({ label, value, onChange, placeholder = '0.00', className, autoFocus }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
        ₹
      </span>
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`custom-input w-full rounded border border-gray-300 px-3 py-2 pl-7 text-sm font-bold text-gray-800 outline-none transition-all ${className}`}
      />
    </div>
  </div>
);

export default PaymentType;
