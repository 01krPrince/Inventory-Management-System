import { useState } from "react";
import { X, Save, Calculator } from "lucide-react";
import { COLORS } from "../../../../constants/colors";

interface GenerateEMIModalProps {
  isOpen: boolean;
  onClose: () => void;
  billAmount: number; // Passed from parent
  onSave: (emiData: any) => void;
}

export default function GenerateEMIModal({
  isOpen,
  onClose,
  billAmount,
  onSave,
}: GenerateEMIModalProps) {
  if (!isOpen) return null;

  // State for Inputs
  const [downPayment, setDownPayment] = useState<number>(0);
  const [noOfEMI, setNoOfEMI] = useState<number>(0);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  
  // State for Generated Table Data
  const [schedule, setSchedule] = useState<{ dueDate: string; amount: number }[]>([]);

  // Simple Logic to Generate EMI Rows
  const handleGenerate = () => {
    if (noOfEMI <= 0) return;
    
    const remainingAmount = billAmount - downPayment;
    const emiAmount = remainingAmount / noOfEMI;
    
    const newSchedule = [];
    let currentDate = new Date(startDate);

    for (let i = 0; i < noOfEMI; i++) {
      // Add 1 month logic
      currentDate.setMonth(currentDate.getMonth() + 1);
      
      newSchedule.push({
        dueDate: currentDate.toISOString().split("T")[0],
        amount: parseFloat(emiAmount.toFixed(2)),
      });
    }
    setSchedule(newSchedule);
  };

  const handleSave = () => {
    // Return data to parent or call API here
    const payload = {
        totalAmount: billAmount,
        downPayment,
        noOfEMI,
        startDate,
        schedule
    };
    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 bg-[var(--theme-primary)] text-white" style={{backgroundColor: COLORS.primary}}>
          <h3 className="font-bold text-sm">Generate EMI</h3>
          <button onClick={onClose} className="hover:bg-white/20 rounded p-1">
            <X size={18} />
          </button>
        </div>

        {/* Form Section */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-b bg-gray-50">
           <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Bill Amount</label>
              <input 
                type="number" 
                value={billAmount} 
                disabled 
                className="w-full border p-1.5 rounded text-sm bg-gray-200"
              />
           </div>
           <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Down Payment</label>
              <input 
                type="number" 
                value={downPayment} 
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full border p-1.5 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              />
           </div>
           <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">No of EMI</label>
              <input 
                type="number" 
                value={noOfEMI} 
                onChange={(e) => setNoOfEMI(Number(e.target.value))}
                className="w-full border p-1.5 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              />
           </div>
           <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Start Date</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border p-1.5 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              />
           </div>
           
           <div className="md:col-span-2">
             <button 
                onClick={handleGenerate}
                className="w-full bg-[var(--theme-primary)] text-white py-2 rounded text-sm font-bold hover:opacity-90 flex justify-center items-center gap-2"
                style={{backgroundColor: COLORS.primary}}
             >
                <Calculator size={16}/> Generate Schedule
             </button>
           </div>
        </div>

        {/* Table Section */}
        <div className="flex h-64">
           {/* Sidebar / List */}
           <div className="w-1/3 border-r bg-gray-50 p-2">
              <div className="flex bg-blue-900 text-white text-xs font-bold p-2 mb-2">
                 <span className="flex-1">Due Date</span>
                 <span className="w-20 text-right">Amount</span>
              </div>
              <div className="overflow-y-auto h-48 space-y-1">
                 {schedule.length === 0 ? (
                    <div className="text-center text-gray-400 text-xs mt-10">No data generated</div>
                 ) : (
                    schedule.map((row, i) => (
                        <div key={i} className="flex justify-between text-xs p-2 border bg-white shadow-sm">
                            <span>{row.dueDate}</span>
                            <span className="font-bold">₹{row.amount}</span>
                        </div>
                    ))
                 )}
              </div>
           </div>

           {/* Right Side - Empty in screenshot, but we can put the SAVE button here */}
           <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white">
                <div className="text-center space-y-4">
                    <p className="text-sm text-gray-500">
                        Review the schedule on the left. <br/> Click save to attach this EMI plan to the invoice.
                    </p>
                    <button 
                        onClick={handleSave}
                        disabled={schedule.length === 0}
                        className="px-6 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                    >
                        <Save size={18} /> Save & Close
                    </button>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
}