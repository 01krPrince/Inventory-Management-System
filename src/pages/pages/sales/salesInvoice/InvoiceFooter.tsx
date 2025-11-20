import React, { useState, useRef } from "react";
import { Edit2, Upload, Trash2, Eye, Download, FileText } from "lucide-react";

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string; // Blob URL for preview/download
}

const InvoiceFooter: React.FC = () => {
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation: 2MB Limit
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      alert("File size exceeds 2MB limit.");
      return;
    }

    // Create a new attachment object
    const newFile: AttachedFile = {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file), // Create a temporary blob URL
    };

    setAttachments((prev) => [...prev, newFile]);

    // Reset input so the same file can be selected again if needed
    e.target.value = "";
  };

  const handleRemoveFile = (id: string) => {
    // 1. Confirmation Alert
    if (window.confirm("Are you sure you want to remove this attachment?")) {
      setAttachments((prev) => {
        const fileToRemove = prev.find((f) => f.id === id);

        // 2. Clean up memory (blob URL)
        if (fileToRemove) {
          URL.revokeObjectURL(fileToRemove.url);
        }

        // 3. Remove from state
        return prev.filter((file) => file.id !== id);
      });
    }
  };
  const handleDownload = (file: AttachedFile) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpen = (file: AttachedFile) => {
    window.open(file.url, "_blank");
  };

  return (
    <div className="w-full bg-white p-4 font-sans text-sm">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* --- LEFT SECTION (Inputs & Attachments) --- */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Remarks */}
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="w-32 text-gray-700 mt-1">Remarks</label>
            <div className="flex-1 relative">
              <textarea
                className="w-full border border-gray-300 rounded-sm p-2 h-20 outline-none focus:border-blue-500 resize-none text-xs"
                placeholder=""
              />
              <span className="absolute bottom-2 right-2 text-xs text-gray-400">
                0/250
              </span>
            </div>
          </div>

          {/* Received Amount */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label className="w-32 text-gray-700">Received Amount</label>
            <div className="w-40 relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                ₹
              </span>
              <input
                type="text"
                defaultValue="0.00"
                className="w-full border border-gray-300 rounded-sm py-1 pl-6 pr-2 text-right outline-none focus:border-blue-500 text-xs"
              />
            </div>
          </div>

          {/* Cash/Bank Ledger */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label className="w-32 text-gray-700">Cash/Bank Ledger</label>
            <div className="flex-1 flex items-center gap-1">
              <div className="relative flex-1">
                <select className="w-full border border-gray-300 rounded-sm py-1 px-2 appearance-none outline-none focus:border-blue-500 text-xs bg-white">
                  <option>Cash In Hand</option>
                </select>
              </div>
              <button className="bg-[#0e4a7b] text-white p-1.5 rounded-sm hover:bg-blue-800">
                <Edit2 size={12} />
              </button>
            </div>
          </div>

          {/* --- Attachment Section (UPDATED) --- */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <label className="w-32 text-gray-700 pt-2">Attachment</label>

            <div className="flex-1 border border-gray-200 bg-[#f8fafc] p-0 rounded-sm flex flex-col sm:flex-row overflow-hidden h-32">
              {/* 1. File Upload Area */}
              <div className="w-full sm:w-48 border-r border-gray-200 p-3 flex flex-col justify-center items-start bg-white">
                <span className="font-semibold text-gray-700 mb-1">
                  Attachment
                </span>
                <span className="text-[10px] text-red-500 mb-3">
                  Attachment Size should Not Exceed 2MB
                </span>
                <div className="border border-dashed border-gray-300 rounded w-full h-full flex items-center justify-center bg-gray-50">
                  {/* Hidden Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    onClick={handleButtonClick}
                    className="bg-[#0e4a7b] text-white text-xs px-3 py-1 rounded-sm hover:bg-blue-900 flex items-center gap-1"
                  >
                    <Upload size={12} /> Select file
                  </button>
                </div>
              </div>

              {/* 2. File Table Area (UPDATED) */}
              <div className="flex-1 bg-white flex flex-col min-w-0">
                {/* Table Header */}
                <div className="bg-[#0e4a7b] text-white text-xs flex h-7 items-center">
                  {/* Col 1: Download */}
                  <div className="w-8 border-r border-blue-800 h-full flex items-center justify-center">
                    <Download size={10} />
                  </div>
                  {/* Col 2: Open */}
                  <div className="w-8 border-r border-blue-800 h-full flex items-center justify-center">
                    <Eye size={10} />
                  </div>
                  {/* Col 3: Remove */}
                  <div className="w-8 border-r border-blue-800 h-full flex items-center justify-center">
                    <Trash2 size={10} />
                  </div>
                  {/* Col 4: Filename */}
                  <div className="flex-1 px-2 font-medium flex items-center h-full overflow-hidden">
                    FileName
                  </div>
                </div>

                {/* Table Body (Scrollable) */}
                <div className="flex-1 bg-white overflow-y-auto">
                  {attachments.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400 text-xs italic">
                      No files attached
                    </div>
                  ) : (
                    attachments.map((file) => (
                      <div
                        key={file.id}
                        className="flex h-7 items-center border-b border-gray-100 text-xs hover:bg-gray-50"
                      >
                        {/* Download Action */}
                        <div className="w-8 border-r border-gray-200 h-full flex items-center justify-center">
                          <button
                            onClick={() => handleDownload(file)}
                            className="text-gray-600 hover:text-blue-600"
                            title="Download"
                          >
                            <Download size={12} />
                          </button>
                        </div>

                        {/* Open Action */}
                        <div className="w-8 border-r border-gray-200 h-full flex items-center justify-center">
                          <button
                            onClick={() => handleOpen(file)}
                            className="text-gray-600 hover:text-blue-600"
                            title="Open"
                          >
                            <Eye size={12} />
                          </button>
                        </div>

                        {/* Remove Action */}
                        <div className="w-8 border-r border-gray-200 h-full flex items-center justify-center">
                          <button
                            onClick={() => handleRemoveFile(file.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Remove"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        {/* Filename Display */}
                        <div className="flex-1 px-2 flex items-center gap-2 truncate text-gray-700 h-full">
                          <FileText
                            size={12}
                            className="flex-shrink-0 text-gray-400"
                          />
                          <span className="truncate" title={file.name}>
                            {file.name}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SECTION (Totals) --- */}
        <div className="w-full lg:w-[400px] flex flex-col gap-2">
          <TotalRow label="Item Value" value="0.00" />
          <TotalRow label="Promo Discount" value="0.00" />
          <TotalRow label="Promo Discount 2" value="0.00" />
          <TotalRow label="Coupon Discount" value="0.00" />
          <TotalRow label="Discount" value="0.00" />
          <TotalRow label="Discount %" value="0.00" />
          <TotalRow label="Taxable" value="0.00" />
          <TotalRow label="Tax Amount" value="0.00" />

          {/* Special Rows with Dual Inputs */}
          <div className="grid grid-cols-[1fr_60px_120px] gap-2 items-center">
            <label className="text-gray-600 text-xs uppercase">DISCOUNT</label>
            <input
              type="text"
              defaultValue="0"
              className="border border-gray-300 rounded-sm px-2 py-1 text-right text-xs outline-none focus:border-blue-500"
            />
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                ₹
              </span>
              <input
                type="text"
                defaultValue="0.00"
                readOnly
                className="w-full bg-gray-50 border border-gray-300 rounded-sm py-1 pl-5 pr-2 text-right text-xs outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-[1fr_60px_120px] gap-2 items-center">
            <label className="text-gray-600 text-xs uppercase">
              DISCOUNT %
            </label>
            <input
              type="text"
              defaultValue="0"
              className="border border-gray-300 rounded-sm px-2 py-1 text-right text-xs outline-none focus:border-blue-500"
            />
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                ₹
              </span>
              <input
                type="text"
                defaultValue="0.00"
                readOnly
                className="w-full bg-gray-50 border border-gray-300 rounded-sm py-1 pl-5 pr-2 text-right text-xs outline-none"
              />
            </div>
          </div>

          <TotalRow label="Round Off" value="0.00" />

          {/* Doc Amount (Bold) */}
          <div className="grid grid-cols-[1fr_120px] gap-2 items-center mt-1">
            <label className="text-gray-800 text-xs font-bold">
              Doc Amount
            </label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-800 text-xs font-bold">
                ₹
              </span>
              <input
                type="text"
                defaultValue="0.00"
                readOnly
                className="w-full bg-gray-50 border border-gray-300 rounded-sm py-1 pl-5 pr-2 text-right text-xs font-bold text-gray-800 outline-none"
              />
            </div>
          </div>

          {/* Generate EMI Button */}
          <div className="flex justify-end mt-2">
            <button className="bg-[#0e4a7b] text-white text-xs font-medium px-4 py-1.5 rounded-sm hover:bg-blue-900 shadow-sm">
              Generate EMI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub Component for simple rows ---
const TotalRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  return (
    <div className="grid grid-cols-[1fr_120px] gap-2 items-center">
      <label className="text-gray-600 text-xs">{label}</label>
      <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
          ₹
        </span>
        <input
          type="text"
          defaultValue={value}
          readOnly
          className="w-full bg-gray-50 border border-gray-300 rounded-sm py-1 pl-5 pr-2 text-right text-xs outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default InvoiceFooter;
