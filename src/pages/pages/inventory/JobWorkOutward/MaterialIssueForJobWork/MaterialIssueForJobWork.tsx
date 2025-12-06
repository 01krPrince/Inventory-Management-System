import React, { useState } from "react";
import MaterialIssueForJobWorkHeader from "./MaterialIssueForJobWorkHeader";
import MaterialIssueForJobWorkForm from "./MaterialIssueForJobWorkForm";
import OrderTable from "./OrderTable";
import MaterialIssueForJobWorkFooter from "./MaterialIssueForJobWorkFooter";
import { COLORS } from "../../../../../constants/colors";
import Logistics from "./Logistics";
import { ArrowLeft } from "lucide-react";
import AddNewItem from "../../../../../components/addItemMaster/AddNewItem";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const MaterialIssueForJobWork: React.FC<ModalProps> = ({
  isOpen = true,
  onClose = () => {},
}) => {
  if (isOpen) {
  }

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [showAddNew, setShowAddNew] = useState(false);

  if (showAddNew) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-5xl bg-white shadow-xl rounded-sm overflow-hidden flex flex-col h-[650px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b flex items-center gap-2 bg-gray-50">
            <button
              onClick={() => setShowAddNew(false)}
              className="flex items-center text-sm text-gray-600 hover:text-[#104a7d] transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Material Issue
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <AddNewItem
              onClose={() => setShowAddNew(false)}
              onSuccess={() => setShowAddNew(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex flex-col h-screen bg-gray-100 overflow-hidden"
    >
      {!isOverlayOpen && (
        <>
          <MaterialIssueForJobWorkHeader />
        </>
      )}

      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          <MaterialIssueForJobWorkForm
            onOverlayChange={(isOpen) => setIsOverlayOpen(isOpen)}
          />

          {!isOverlayOpen && (
            <>
              <OrderTable />
              <MaterialIssueForJobWorkFooter />
              <Logistics />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialIssueForJobWork;
