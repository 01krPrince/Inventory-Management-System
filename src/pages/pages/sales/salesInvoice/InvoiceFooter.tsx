import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  useState,
  useEffect,
} from "react";
import { EditIcon } from "lucide-react";
import { COLORS } from "../../../../constants/colors";
import Attachment from "../../../../components/Attachment";
import GenerateEMIModal from "./GenerateEMIModal";
import ChartOfAccounts from "../../../../components/ChartOfAccount";
import Dropdown, { ColumnDef } from "../../../../components/Dropdown";
import {
  fetchSalesAndPurchaseGL,
  SalesAndPurchaseGL,
} from "../../../../components/addItemMaster/api/saleAndPurchaseGL";

// --- Interfaces ---
export interface InvoiceFooterRef {
  getFooterData: () => {
    remarks: string;
    receivedAmount: number;
    cashBankLedger: string;
    emiData: any;
  };
}

type InvoiceFooterProps = {
  amount?: number;
};

const glColumns: ColumnDef<SalesAndPurchaseGL>[] = [
  { header: "Code", key: "code", width: "w-1/4" },
  { header: "Name", key: "name", width: "w-3/4" },
];

const InvoiceFooter = forwardRef<InvoiceFooterRef, InvoiceFooterProps>(
  ({ amount = -8500 }, ref) => {
    // --- Refs ---
    const remarksRef = useRef<HTMLTextAreaElement>(null);
    const receivedAmountRef = useRef<HTMLInputElement>(null);

    // --- State ---
    const [isOpenGenerateEmi, setIsOpenGenerateEmi] = useState<boolean>(false);
    const [emiData, setEmiData] = useState<any>(null);

    // Ledger States
    const [glOptions, setGlOptions] = useState<SalesAndPurchaseGL[]>([]);
    const [selectedLedger, setSelectedLedger] =
      useState<string>("Cash In Hand");
    const [showChartOfAccounts, setShowChartOfAccounts] = useState(false);
    const [coaFormData, setCoaFormData] = useState<SalesAndPurchaseGL | null>(
      null,
    );

    // --- Load Ledgers ---
    const loadLedgers = async () => {
      try {
        const glData = await fetchSalesAndPurchaseGL();
        if (Array.isArray(glData)) {
          const mappedData = glData.map((item) => ({
            ...item,
            label: item.name,
            value: item._id,
          }));
          setGlOptions(mappedData);
        }
      } catch (error) {
        console.error("Error loading ledgers:", error);
      }
    };

    useEffect(() => {
      loadLedgers();
    }, []);

    // --- Expose Data to Parent ---
    useImperativeHandle(ref, () => ({
      getFooterData: () => ({
        remarks: remarksRef.current?.value || "",
        receivedAmount: Number(receivedAmountRef.current?.value || 0),
        cashBankLedger: selectedLedger,
        emiData: emiData,
      }),
    }));

    // --- Handlers ---
    const handleSaveEMI = (data: any) => {
      setEmiData(data);
    };

    const handleOpenCOA = () => {
      const selectedItem = glOptions.find(
        (item) => item.name === selectedLedger,
      );
      setCoaFormData(
        selectedItem || ({ name: selectedLedger } as SalesAndPurchaseGL),
      );
      setShowChartOfAccounts(true);
    };

    const handleSaveCOA = (savedData: SalesAndPurchaseGL) => {
      if (savedData?.name) {
        setSelectedLedger(savedData.name);
        loadLedgers(); // Refresh list
      }
      setShowChartOfAccounts(false);
    };

    const isAdvance = amount > 0;
    const isDue = amount < 0;
    const statusText = isAdvance
      ? "Advance Paid"
      : isDue
        ? "Due Amount"
        : "Fully Paid";
    const statusColor = isAdvance
      ? "text-green-600 bg-green-100"
      : isDue
        ? "text-red-600 bg-red-100"
        : "text-gray-600 bg-gray-100";

    return (
      <div
        className="w-full p-4 font-sans text-sm relative"
        style={{ backgroundColor: COLORS.white }}
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- LEFT SECTION --- */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Remarks */}
            <div className="flex flex-col sm:flex-row gap-4">
              <label
                className="w-32 mt-1"
                style={{ color: COLORS.textPrimary }}
              >
                Remarks
              </label>
              <div className="flex-1 relative">
                <textarea
                  ref={remarksRef}
                  className="w-full border rounded-sm p-2 h-20 outline-none resize-none text-xs custom-input"
                  style={{
                    borderColor: COLORS.borderDark,
                    color: COLORS.textPrimary,
                  }}
                />
              </div>
            </div>

            {/* Received Amount */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <label className="w-32" style={{ color: COLORS.textPrimary }}>
                Received Amount
              </label>
              <div className="w-40 relative">
                <span
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: COLORS.textMuted }}
                >
                  ₹
                </span>
                <input
                  ref={receivedAmountRef}
                  type="text"
                  defaultValue="0.00"
                  className="w-full border rounded-sm py-1 pl-6 pr-2 text-right outline-none text-xs custom-input"
                  style={{
                    borderColor: COLORS.borderDark,
                    color: COLORS.textPrimary,
                  }}
                />
              </div>
            </div>

            {/* Dynamic Cash/Bank Ledger */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <label className="w-32" style={{ color: COLORS.textPrimary }}>
                Cash/Bank Ledger
              </label>
              <div className="flex-1 flex items-center gap-1">
                <div className="relative flex-1">
                  <Dropdown
                    data={glOptions}
                    columns={glColumns}
                    value={selectedLedger}
                    valueKey="name"
                    onChange={(item) => setSelectedLedger(item?.name || "")}
                    placeholder="Select Ledger"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleOpenCOA}
                  className="custom-btn-primary text-white p-1.5 rounded-sm flex items-center justify-center"
                >
                  <EditIcon size={12} />
                </button>
              </div>
            </div>

            {/* Attachment */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <label
                className="w-32 pt-2"
                style={{ color: COLORS.textPrimary }}
              >
                Attachment
              </label>
              <div className="flex-1">
                <Attachment />
              </div>
            </div>
          </div>

          {/* --- RIGHT SECTION (Totals) --- */}
          <div className="w-full lg:w-[400px] flex flex-col gap-2">
            {/* ... existing TotalRow components remain same ... */}
            <TotalRow label="Item Value" value="0.00" />
            <div className="grid grid-cols-[1fr_160px] gap-2 items-center mt-1">
              <label className="text-xs font-bold text-gray-800">
                Payment Status
              </label>
              <div
                className={`flex items-center justify-between px-2 py-1 rounded text-xs font-bold ${statusColor}`}
              >
                <span>{statusText}</span>
                <span>
                  {isAdvance && "+"}
                  {isDue && "-"} ₹{Math.abs(amount).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <button
                onClick={() => setIsOpenGenerateEmi(true)}
                className="custom-btn-primary text-xs font-medium px-4 py-1.5 rounded-sm shadow-sm text-white"
              >
                Generate EMI
              </button>
            </div>
          </div>
        </div>

        <style>{`
          .custom-btn-primary { background-color: ${COLORS.primary}; transition: background-color 0.2s; }
          .custom-btn-primary:hover { background-color: ${COLORS.primaryHover}; }
          .custom-input:focus { border-color: ${COLORS.info} !important; }
        `}</style>

        {/* --- MODALS --- */}
        <GenerateEMIModal
          isOpen={isOpenGenerateEmi}
          onClose={() => setIsOpenGenerateEmi(false)}
          billAmount={Math.abs(amount)}
          onSave={handleSaveEMI}
        />

        {showChartOfAccounts && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
            style={{ zIndex: 9999 }}
          >
            <div className="bg-white rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
              <ChartOfAccounts
                isOpen={showChartOfAccounts}
                onClose={() => setShowChartOfAccounts(false)}
                initialData={coaFormData}
                onSave={handleSaveCOA}
              />
            </div>
          </div>
        )}
      </div>
    );
  },
);

type TotalRowProps = { label: string; value: string };
const TotalRow: React.FC<TotalRowProps> = ({ label, value }) => (
  <div className="grid grid-cols-[1fr_120px] gap-2 items-center">
    <label className="text-xs" style={{ color: COLORS.textSecondary }}>
      {label}
    </label>
    <div className="relative">
      <span
        className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
        style={{ color: COLORS.textMuted }}
      >
        ₹
      </span>
      <input
        type="text"
        defaultValue={value}
        readOnly
        className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs outline-none"
        style={{
          backgroundColor: COLORS.background,
          borderColor: COLORS.borderDark,
          color: COLORS.textPrimary,
        }}
      />
    </div>
  </div>
);

export default InvoiceFooter;
