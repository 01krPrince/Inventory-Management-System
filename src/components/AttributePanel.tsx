import React, { useState, useEffect } from 'react';
import { FileText, X } from 'lucide-react';
import ReactDOM from 'react-dom';

interface AttributePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  billType: 'PURCHASE' | 'SALE'; // Dynamic bill type
  initialData: any;
}

const AttributePanel: React.FC<AttributePanelProps> = ({
  isOpen,
  onClose,
  onSave,
  billType,
  initialData,
}) => {
  const [description, setDescription] = useState('');
  const [formData, setFormData] = useState({
    mrp: 0,
    purchaseRate: 0,
    markup: 0,
    saleRate: 0,
    wsMarkup: 0,
    wsRate: 0,
    dealerMarkup: 0,
    dealerRate: 0,
    barcode: '',
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setDescription(initialData.name || '');

      // Extract both rates from initialData
      const pRate = parseFloat(initialData.last_purchase_rate || initialData.purchase_rate) || 0;
      const sRate = parseFloat(initialData.sales_rate) || 0;

      setFormData({
        mrp: parseFloat(initialData.mrp) || 0,
        purchaseRate: pRate,
        markup: 0,
        saleRate: sRate,
        wsMarkup: 0,
        wsRate: parseFloat(initialData.wholesale_rate) || 0,
        dealerMarkup: 0,
        dealerRate: 0,
        barcode: initialData.barcode || '',
      });
    }
  }, [initialData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Determine which rate to send back based on billType
    const finalRate = billType === 'PURCHASE' ? formData.purchaseRate : formData.saleRate;

    const finalData = {
      printdesc: description,
      rate: finalRate, // Correct rate based on billType
      netrate: finalRate,
      rateper: finalRate,
      itembarcode: formData.barcode,
      ...formData,
    };
    onSave(finalData);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm">
      <div className="relative mx-auto w-full max-w-3xl border border-gray-400 bg-gray-50 font-sans text-sm shadow-2xl">
        {/* --- Header --- */}
        <div className="flex items-center justify-between bg-[#1e5b8f] px-4 py-2 font-semibold text-white">
          <span>Attribute Panel ({billType})</span>
          <button onClick={onClose} className="rounded p-1 hover:bg-[#3e6185]">
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[80vh] space-y-6 overflow-y-auto p-4">
          {/* --- Section 1: Description --- */}
          <div className="flex gap-4">
            <label className="w-32 pt-2 font-medium text-gray-700">Print Description</label>
            <div className="relative flex-1">
              <textarea
                className="h-24 w-full resize-none border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
              />
            </div>
          </div>

          <hr className="border-gray-300" />

          <div>
            <h3 className="mb-4 flex items-center font-bold text-[#1e5b8f]">
              <FileText size={18} className="mr-2" />
              Pricing & Inventory Details
            </h3>

            <div className="pl-4 pr-2">
              <div className="grid grid-cols-12 items-center gap-x-0 gap-y-2">
                {/* Purchase Rate - Highlighted if in PURCHASE mode */}
                <div className="col-span-3 text-gray-700">Purchase Rate</div>
                <div className="col-span-9">
                  <div
                    className={`flex items-center border border-gray-300 ${billType === 'PURCHASE' ? 'bg-yellow-50' : 'bg-white'}`}>
                    <span className="px-2 text-gray-500">₹</span>
                    <input
                      type="number"
                      className="w-full bg-transparent p-1.5 focus:outline-none"
                      name="purchaseRate"
                      value={formData.purchaseRate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* MRP */}
                <div className="col-span-3 text-gray-700">MRP</div>
                <div className="col-span-9">
                  <div className="flex items-center border border-gray-300 bg-white">
                    <span className="px-2 text-gray-500">₹</span>
                    <input
                      type="number"
                      className="w-full p-1.5 focus:outline-none"
                      name="mrp"
                      value={formData.mrp}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Sale Rate - Highlighted if in SALE mode */}
                <div className="col-span-3 text-gray-700">Sale Rate</div>
                <div className="col-span-9">
                  <div
                    className={`flex items-center border border-gray-300 ${billType === 'SALE' ? 'bg-yellow-50' : 'bg-white'}`}>
                    <span className="px-2 text-gray-500">₹</span>
                    <input
                      type="number"
                      className="w-full bg-transparent p-1.5 focus:outline-none"
                      name="saleRate"
                      value={formData.saleRate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Barcode */}
                <div className="col-span-3 pt-2 text-gray-700">Line Barcode</div>
                <div className="col-span-9 flex pt-2">
                  <input
                    type="text"
                    className="flex-1 border border-r-0 border-gray-300 p-1.5 focus:outline-none"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  />
                  <button className="bg-[#1a4b7c] px-4 py-1 text-sm font-medium text-white">
                    Auto Generate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Footer Buttons --- */}
        <div className="mt-4 flex gap-3 bg-[#1a4b7c] p-2">
          <button
            onClick={handleSave}
            className="border border-white px-6 py-1 font-bold text-white hover:bg-[#3e6185]">
            OK
          </button>
          <button
            onClick={onClose}
            className="border border-white px-6 py-1 font-bold text-white hover:bg-[#3e6185]">
            Exit
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AttributePanel;
