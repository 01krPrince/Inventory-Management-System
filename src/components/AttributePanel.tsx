import React, { useState, useEffect } from "react";
import { FileText, X } from "lucide-react";
import ReactDOM from "react-dom";

interface AttributePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData: any; // Data from the selected item
}

const AttributePanel: React.FC<AttributePanelProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  // State for form management
  const [description, setDescription] = useState("");
  const [formData, setFormData] = useState({
    mrp: 0,
    markup: 0,
    saleRate: 0,
    wsMarkup: 0,
    wsRate: 0,
    dealerMarkup: 0,
    dealerRate: 0,
    barcode: "",
  });

  // Load initial data when component opens or data changes
  useEffect(() => {
    if (initialData) {
      setDescription(initialData.name || "");
      setFormData({
        mrp: parseFloat(initialData.mrp) || 0,
        markup: 0,
        saleRate: parseFloat(initialData.sales_rate) || 0,
        wsMarkup: 0,
        wsRate: parseFloat(initialData.wholesale_rate) || 0,
        dealerMarkup: 0,
        dealerRate: 0,
        barcode: initialData.barcode || "",
      });
    }
  }, [initialData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Construct the object to send back to OrderTable
    const finalData = {
      printdesc: description,
      rate: formData.saleRate, // Mapping saleRate to Rate
      netrate: formData.saleRate,
      rateper: formData.saleRate,
      itembarcode: formData.barcode,
      // Preserve other calculations if you add columns for them later
      ...formData,
    };
    onSave(finalData);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-3xl mx-auto border border-gray-400 bg-gray-50 font-sans text-sm shadow-2xl relative">
        {/* --- Header --- */}
        <div className="bg-[#1e5b8f] text-white px-4 py-2 font-semibold flex justify-between items-center">
          <span>Attribute Panel</span>
          <button onClick={onClose} className="hover:bg-[#3e6185] p-1 rounded">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* --- Section 1: Description --- */}
          <div className="flex gap-4">
            <label className="w-32 pt-2 text-gray-700 font-medium">
              Print Description
            </label>
            <div className="flex-1 relative">
              <textarea
                className="w-full border border-gray-300 p-2 h-24 resize-none focus:outline-none focus:border-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
              />
              <span className="absolute bottom-2 right-2 text-xs text-gray-500">
                {description.length}/1000
              </span>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-300" />

          {/* --- Section 2: MRP/Sales Rate --- */}
          <div>
            <h3 className="flex items-center text-[#1e5b8f] font-bold mb-4">
              <FileText size={18} className="mr-2" />
              MRP/Sales Rate
            </h3>

            <div className="pl-4 pr-2">
              {/* Grid Container for the form */}
              <div className="grid grid-cols-12 gap-y-2 gap-x-0 items-center">
                {/* Row 1: MRP */}
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

                {/* Row 2: Markup & Sale Rate */}
                <div className="col-span-3 text-gray-700">Markup %</div>
                <div className="col-span-3 pr-4">
                  <input
                    type="number"
                    className="w-full border border-gray-300 p-1.5 focus:outline-none"
                    name="markup"
                    value={formData.markup}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-span-2 text-gray-700">Sale Rate</div>
                <div className="col-span-4">
                  <div className="flex items-center border border-gray-300 bg-gray-50">
                    <span className="px-2 text-gray-500">₹</span>
                    <input
                      type="number"
                      className="w-full p-1.5 bg-gray-50 focus:outline-none"
                      name="saleRate"
                      value={formData.saleRate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Row 3: WS Markup & Rate */}
                <div className="col-span-3 text-gray-700">WS Markup %</div>
                <div className="col-span-3 pr-4">
                  <input
                    type="number"
                    className="w-full border border-gray-300 p-1.5 focus:outline-none"
                    name="wsMarkup"
                    value={formData.wsMarkup}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-span-2 text-gray-700">Wholesale Rate</div>
                <div className="col-span-4">
                  <div className="flex items-center border border-gray-300 bg-white">
                    <span className="px-2 text-gray-500">₹</span>
                    <input
                      type="number"
                      className="w-full p-1.5 focus:outline-none"
                      value={formData.wsRate}
                      readOnly
                    />
                  </div>
                </div>

                {/* Row 4: Dealer Markup & Rate */}
                <div className="col-span-3 text-gray-700">Dealer Markup %</div>
                <div className="col-span-3 pr-4">
                  <input
                    type="number"
                    className="w-full border border-gray-300 p-1.5 focus:outline-none"
                    name="dealerMarkup"
                    value={formData.dealerMarkup}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-span-2 text-gray-700">Dealer Rate</div>
                <div className="col-span-4">
                  <div className="flex items-center border border-gray-300 bg-white">
                    <span className="px-2 text-gray-500">₹</span>
                    <input
                      type="number"
                      className="w-full p-1.5 focus:outline-none"
                      value={formData.dealerRate}
                      readOnly
                    />
                  </div>
                </div>

                {/* Row 5: Barcode */}
                <div className="col-span-3 text-gray-700 pt-2">
                  Line Barcode
                </div>
                <div className="col-span-9 flex pt-2">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 p-1.5 border-r-0 focus:outline-none"
                    value={formData.barcode}
                    onChange={(e) =>
                      setFormData({ ...formData, barcode: e.target.value })
                    }
                  />
                  <button className="bg-[#1a4b7c] text-white px-4 py-1 text-sm font-medium hover:bg-[#3e6185] transition-colors">
                    Auto Generate
                  </button>
                </div>
              </div>

              {/* Warning Text */}
              <div className="mt-4 text-red-500 text-xs leading-relaxed">
                ****Note : Sale Rate/WS Rate/ Dealer Rate will not be calculated
                on % change immediately as many input will be captured later, it
                will auto calculate when all inputs available
              </div>
            </div>
          </div>
        </div>

        {/* --- Footer Buttons --- */}
        <div className="bg-[#1a4b7c] p-2 flex gap-3 mt-4">
          <button
            onClick={handleSave}
            className="flex items-center border border-white text-white px-6 py-1 hover:bg-[#3e6185] text-sm font-bold"
          >
            OK
          </button>
          <button
            onClick={onClose}
            className="flex items-center border border-white text-white px-6 py-1 hover:bg-[#3e6185] text-sm font-bold"
          >
            Exit
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AttributePanel;
