import React from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import { COLORS } from "../constants/colors"; // Adjust path as needed
import { SalesAndPurchaseGL } from "./addItemMaster/api/saleAndPurchaseGL";

interface PostingGLPopupProps {
  visible: boolean;
  top: number;
  left: number;
  data: SalesAndPurchaseGL[];
  onClose: () => void;
  onSelect: (item: SalesAndPurchaseGL) => void;
}

const PostingGLPopup: React.FC<PostingGLPopupProps> = ({
  visible,
  top,
  left,
  data,
  onClose,
  onSelect,
}) => {
  if (!visible) return null;

  return ReactDOM.createPortal(
    <>
      <div
        className="fixed inset-0 z-[9998] cursor-default bg-transparent"
        onClick={onClose}
      />
      <div
        className="fixed z-[9999] bg-white border shadow-xl flex flex-col rounded"
        style={{
          top: top,
          left: left,
          borderColor: COLORS.borderDark,
          width: "400px",
          maxHeight: "300px",
          transform:
            top + 300 > window.innerHeight ? "translateY(-100%)" : "none",
        }}
      >
        {/* HEADER */}
        <div
          className="flex justify-between items-center p-2 border-b h-8"
          style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
        >
          <span className="font-bold text-xs pl-1">Select Posting GL</span>
          <button
            onClick={onClose}
            className="hover:bg-red-500 hover:text-white p-0.5 rounded transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* TABLE */}
        <div className="flex-1 overflow-auto p-0 custom-scrollbar">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="sticky top-0 bg-gray-100 z-10 shadow-sm">
              <tr>
                <th className="p-1.5 border font-semibold text-gray-700 w-24">
                  Code
                </th>
                <th className="p-1.5 border font-semibold text-gray-700">
                  Name
                </th>
                <th className="p-1.5 border font-semibold text-gray-700 w-32">
                  Under Group
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <tr
                    key={item._id || idx}
                    className="border-b hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => onSelect(item)}
                  >
                    <td className="p-1.5 border">{item.code}</td>
                    <td className="p-1.5 border">{item.name}</td>
                    <td className="p-1.5 border">{item.salesGlUnderGroup}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No GL Accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>,
    document.body
  );
};

export default PostingGLPopup;
