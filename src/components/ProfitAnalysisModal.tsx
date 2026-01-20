import React from "react";
import { X, CheckCircle, Info } from "lucide-react";

interface ProfitItem {
  item: string;
  quantity: number;
  sellingPrice: number; // API sends UNIT Price here
  costPrice: number;    // API sends TOTAL Cost here
  profitBeforeGST: number; // Added this
  profitAfterGST: number;
  margin: string;
  itemName?: string; 
  itemCode?: string;
}

interface ProfitAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    items: ProfitItem[];
    totalProfitBeforeGST: number; // Added this
    totalProfitAfterGST: number;
  } | null;
}

const ProfitAnalysisModal: React.FC<ProfitAnalysisModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  // Calculate totals for the footer
  // Note: API costPrice is Total, but sellingPrice is Unit. We must multiply sellingPrice by Qty for Total Revenue.
  const totalCost = data.items.reduce((sum, item) => sum + item.costPrice, 0);
  const totalRevenue = data.items.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="bg-[#0f3c63] text-white px-6 py-4 flex justify-between items-center">
          <div>
             <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="bg-white/20 p-1.5 rounded"><CheckCircle size={16}/></span> 
                ITEM PROFIT ANALYSIS
             </h2>
             <div className="flex gap-4 mt-1 text-xs text-blue-200">
                <p>Reviewing Profit Margins before finalizing.</p>
                <p className="flex items-center gap-1"><Info size={10}/> Gross Profit: ₹{data.totalProfitBeforeGST.toLocaleString()}</p>
             </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* TABLE HEADER */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b text-[11px] font-bold text-gray-500 uppercase tracking-wider">
           <div className="col-span-4">Product Information</div>
           <div className="col-span-1 text-center">Qty</div>
           <div className="col-span-1 text-right">Unit Cost</div>
           <div className="col-span-1 text-right">Unit Rate</div>
           <div className="col-span-2 text-right">Total Cost</div>
           <div className="col-span-1 text-right">Total Revenue</div>
           <div className="col-span-2 text-right">Est. Profit</div>
        </div>

        {/* SCROLLABLE LIST */}
        <div className="overflow-y-auto flex-1 p-0 custom-scrollbar">
           {data.items.map((item, idx) => {
              // --- FIXING THE MATH HERE ---
              
              // 1. Cost is Total, so Unit Cost = Total / Qty
              const unitCost = item.costPrice / item.quantity;
              
              // 2. Selling Price is Unit (based on your API JSON), so we use it directly
              const unitRate = item.sellingPrice; 
              
              // 3. Total Revenue = Unit Rate * Qty
              const itemTotalRevenue = item.sellingPrice * item.quantity;

              return (
                <div key={idx} className="grid grid-cols-12 gap-4 px-6 py-4 border-b items-center hover:bg-blue-50/50 transition-colors">
                    {/* Product Info */}
                    <div className="col-span-4">
                        <div className="font-bold text-sm text-gray-800">{item.itemName || "Unknown Item"}</div>
                        <div className="text-xs text-gray-400">{item.itemCode || "N/A"}</div>
                    </div>

                    {/* Qty */}
                    <div className="col-span-1 text-center font-bold text-gray-700">{item.quantity}</div>

                    {/* Unit Cost */}
                    <div className="col-span-1 text-right text-sm text-gray-600">₹{unitCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>

                    {/* Unit Rate */}
                    <div className="col-span-1 text-right text-sm text-gray-600">₹{unitRate.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>

                    {/* Total Cost (Direct from API) */}
                    <div className="col-span-2 text-right text-sm font-medium text-gray-700">₹{item.costPrice.toLocaleString()}</div>

                    {/* Total Revenue (Calculated) */}
                    <div className="col-span-1 text-right font-bold text-gray-800">₹{itemTotalRevenue.toLocaleString()}</div>

                    {/* Profit */}
                    <div className="col-span-2 text-right">
                        <div className="text-green-600 font-bold text-sm">₹{item.profitAfterGST.toLocaleString()}</div>
                        
                        {/* Tooltip for Gross Profit */}
                        <div className="text-[10px] text-gray-400" title={`Gross: ₹${item.profitBeforeGST}`}>
                            Before Tax: ₹{item.profitBeforeGST.toLocaleString()}
                        </div>
                        
                        <div className={`text-[10px] font-bold ${Number(item.margin) < 15 ? 'text-red-500' : 'text-green-500'}`}>
                            {item.margin}% MARGIN
                        </div>
                    </div>
                </div>
              );
           })}
        </div>

        {/* FOOTER SUMMARY */}
        <div className="bg-[#0f3c63] text-white px-8 py-5 flex justify-between items-center">
            <div className="flex gap-12">
                <div>
                    <div className="text-xs text-blue-300 uppercase font-bold">Total Cost</div>
                    <div className="text-xl font-bold">₹ {totalCost.toLocaleString()}</div>
                </div>
                <div>
                    <div className="text-xs text-blue-300 uppercase font-bold">Total Revenue</div>
                    <div className="text-xl font-bold">₹ {totalRevenue.toLocaleString()}</div>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                 <div className="text-right">
                    <div className="text-xs text-yellow-400 uppercase font-bold">Net Profit (Post Tax)</div>
                    <div className="text-2xl font-black text-yellow-400">₹ {data.totalProfitAfterGST.toLocaleString()}</div>
                    <div className="text-[10px] text-blue-300">Gross: ₹{data.totalProfitBeforeGST.toLocaleString()}</div>
                 </div>
                 <button onClick={onClose} className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-2 rounded shadow-lg transition-transform active:scale-95 ml-4">
                    DONE
                 </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProfitAnalysisModal;