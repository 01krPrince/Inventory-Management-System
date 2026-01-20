import React from "react";
import { ArrowLeft, Construction } from "lucide-react";

export interface PlaceholderPageProps {
  title?: string;
  onBack?: () => void;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title = "Report Details",
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col font-sans animate-in fade-in duration-300">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-8 w-fit group"
        >
          <div className="p-2 bg-white rounded-lg border border-slate-200 group-hover:border-blue-200 shadow-sm">
            <ArrowLeft size={18} />
          </div>
          <span className="font-medium">Back</span>
        </button>
      )}

      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <Construction size={40} className="text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{title}</h1>
        <p className="text-slate-500 max-w-md">
          This is a placeholder page for the <strong>{title}</strong> report.
          Real data visualization and tables would be rendered here.
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
