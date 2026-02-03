import React from 'react';
import { X } from 'lucide-react';
import RecieptPaymentVoucher from './VoucherEntryForm';

interface VoucherPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoucherPopup: React.FC<VoucherPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4 backdrop-blur-sm">
      {/* Container to control max-width on large screens */}
      <div className="relative w-full max-w-6xl transform transition-all">
        {/* The Card / Dialog Box */}
        <div className="relative rounded-lg bg-white shadow-2xl">
          {/* Header (Optional if the main component already has one, 
              but usually good for consistency) */}
          <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-[#0c4a75] px-6 py-3">
            <h2 className="text-lg font-bold text-white">New Voucher Entry</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="max-h-[85vh] overflow-y-auto p-2">
            <RecieptPaymentVoucher isComponent={true} onClose={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherPopup;
