import {
  useImperativeHandle,
  forwardRef,
  useRef,
  useState,
  useEffect,
} from "react";
import { EditIcon } from "lucide-react";
import { COLORS } from "../../../../constants/colors";
import Attachment from "../../../../components/Attachment";
import Dropdown, { ColumnDef } from "../../../../components/Dropdown";
import ChartOfAccounts from "../../../../components/ChartOfAccount";
import { SalesAndPurchaseGL } from "../../../../components/addItemMaster/api/saleAndPurchaseGL";
import chartOfAccountService from "../../../../services/chartOfAccountService";

export interface PurchaseBillFooterRef {
  getFooterData: () => {
    remarks: string;
    receivedAmount: number;
    cashBankLedger: string;
    itemValue: number;
    discount1: number;
    discount2: number;
    taxable: number;
    taxAmount: number;
    transportVal: number;
    transportAmt: number;
    otherDiscVal: number;
    otherDiscAmt: number;
    adjustmentVal: number;
    adjustmentAmt: number;
    roundOff: number;
    docAmount: number;
  };
}

type InvoiceFooterProps = {
  amount?: number;
  cashCredit?: string;
};

const glColumns: ColumnDef<any>[] = [
  { header: "Code", key: "code", width: "w-1/4" },
  { header: "Name", key: "name", width: "w-3/4" },
];

const PurchaseBillFooter = forwardRef<
  PurchaseBillFooterRef,
  InvoiceFooterProps
>(({ cashCredit }, ref) => {
  const remarksRef = useRef<HTMLTextAreaElement>(null);
  const receivedAmountRef = useRef<HTMLInputElement>(null);

  // Right Section Calculation Refs
  const itemValueRef = useRef<HTMLInputElement>(null);
  const discount1Ref = useRef<HTMLInputElement>(null);
  const discount2Ref = useRef<HTMLInputElement>(null);
  const taxableRef = useRef<HTMLInputElement>(null);
  const taxAmountRef = useRef<HTMLInputElement>(null);
  const roundOffRef = useRef<HTMLInputElement>(null);
  const docAmountRef = useRef<HTMLInputElement>(null);

  // Split Fields Refs
  const transportValRef = useRef<HTMLInputElement>(null);
  const transportAmtRef = useRef<HTMLInputElement>(null);
  const otherDiscValRef = useRef<HTMLInputElement>(null);
  const otherDiscAmtRef = useRef<HTMLInputElement>(null);
  const adjustmentValRef = useRef<HTMLInputElement>(null);
  const adjustmentAmtRef = useRef<HTMLInputElement>(null);

  // --- State ---
  const [glOptions, setGlOptions] = useState<any[]>([]);
  const [selectedLedger, setSelectedLedger] = useState<string>("Cash In Hand");
  const [showChartOfAccounts, setShowChartOfAccounts] = useState(false);
  const [coaFormData, setCoaFormData] = useState<SalesAndPurchaseGL | null>(
    null,
  );

  // --- Load Ledgers ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const coaResponse = await chartOfAccountService.getAllChartOfAccounts();
        if (coaResponse.data && coaResponse.data.success) {
          const rawData = coaResponse.data.data;
          const mappedOptions = rawData.map((item: any) => ({
            ...item,
            name: item.name,
            code: item.code || item.accountCode || "",
            label: item.name,
            value: item._id,
          }));
          setGlOptions(mappedOptions);
        }
      } catch (error) {
        console.error("Failed to load dropdown data", error);
      }
    };
    loadData();
  }, []);

  // --- Expose Data to Parent ---
  useImperativeHandle(ref, () => ({
    getFooterData: () => ({
      remarks: remarksRef.current?.value || "",
      receivedAmount: Number(receivedAmountRef.current?.value || 0),
      cashBankLedger: selectedLedger,

      itemValue: Number(itemValueRef.current?.value || 0),
      discount1: Number(discount1Ref.current?.value || 0),
      discount2: Number(discount2Ref.current?.value || 0),
      taxable: Number(taxableRef.current?.value || 0),
      taxAmount: Number(taxAmountRef.current?.value || 0),

      transportVal: Number(transportValRef.current?.value || 0),
      transportAmt: Number(transportAmtRef.current?.value || 0),
      otherDiscVal: Number(otherDiscValRef.current?.value || 0),
      otherDiscAmt: Number(otherDiscAmtRef.current?.value || 0),
      adjustmentVal: Number(adjustmentValRef.current?.value || 0),
      adjustmentAmt: Number(adjustmentAmtRef.current?.value || 0),

      roundOff: Number(roundOffRef.current?.value || 0),
      docAmount: Number(docAmountRef.current?.value || 0),
    }),
  }));

  // --- Handlers ---
  const handleOpenCOA = () => {
    const selectedItem = glOptions.find((item) => item.name === selectedLedger);
    setCoaFormData(
      selectedItem || ({ name: selectedLedger } as SalesAndPurchaseGL),
    );
    setShowChartOfAccounts(true);
  };

  const handleSaveCOA = (savedData: SalesAndPurchaseGL) => {
    if (savedData?.name) {
      setSelectedLedger(savedData.name);
      window.location.reload();
    }
    setShowChartOfAccounts(false);
  };

  // Helper Components inside for cleaner render
  const ActionBtn = ({ onClick, icon }: any) => (
    <button
      type="button"
      onClick={onClick}
      className="h-[30px] w-[30px] text-white flex items-center justify-center rounded-sm hover:opacity-90 transition-opacity ml-[-1px] z-10 shrink-0"
      style={{ backgroundColor: COLORS.primary, borderColor: COLORS.primary }}
    >
      {icon}
    </button>
  );

  return (
    <div
      className="w-full p-4 font-sans text-sm border-t"
      style={{ backgroundColor: COLORS.white }}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* --- LEFT SECTION --- */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Remarks */}
          <div className="flex flex-col sm:flex-row gap-4">
            <label
              className="w-32 mt-1 text-xs font-medium"
              style={{ color: COLORS.textPrimary }}
            >
              Remarks
            </label>
            <div className="flex-1 relative">
              <textarea
                ref={remarksRef}
                className="w-full border rounded-sm p-2 h-20 outline-none resize-none text-xs custom-input"
                placeholder="Enter remarks here..."
                style={{
                  borderColor: COLORS.borderDark,
                  color: COLORS.textPrimary,
                }}
              />
            </div>
          </div>

          {/* Paid Amount */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label
              className="w-32 text-xs font-medium"
              style={{ color: COLORS.textPrimary }}
            >
              Paid Amount
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

          {/* Cash/Bank Ledger - CONDITIONALLY RENDERED */}
          {cashCredit === "Credit" && (
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-32">
                <label className="text-[13px] text-gray-700 font-medium">
                  Cash/Bank Ledger
                </label>
              </div>
              <div className="flex-1 flex items-center gap-0">
                <div className="flex-1">
                  <Dropdown
                    data={glOptions}
                    columns={glColumns}
                    value={selectedLedger}
                    valueKey="name"
                    placeholder="Select Ledger..."
                    onChange={(item) => setSelectedLedger(item?.name || "")}
                  />
                </div>
                <ActionBtn
                  icon={<EditIcon size={14} />}
                  onClick={handleOpenCOA}
                />
              </div>
            </div>
          )}

          {/* Attachment */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <label
              className="w-32 pt-2 text-xs font-medium"
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
          <TotalRow
            label="Item Value"
            inputRef={itemValueRef}
            defaultValue="0.00"
          />
          <TotalRow
            label="Discount"
            inputRef={discount1Ref}
            defaultValue="0.00"
          />
          <TotalRow
            label="Discount"
            inputRef={discount2Ref}
            defaultValue="0.00"
          />
          <TotalRow label="Taxable" inputRef={taxableRef} defaultValue="0.00" />
          <TotalRow
            label="Tax Amount"
            inputRef={taxAmountRef}
            defaultValue="0.00"
          />

          <SplitTotalRow
            label="Transport"
            valRef={transportValRef}
            amtRef={transportAmtRef}
          />
          <SplitTotalRow
            label="Discount"
            valRef={otherDiscValRef}
            amtRef={otherDiscAmtRef}
          />
          <SplitTotalRow
            label="Adjustment"
            valRef={adjustmentValRef}
            amtRef={adjustmentAmtRef}
          />

          <TotalRow
            label="Round Off"
            inputRef={roundOffRef}
            defaultValue="0.00"
          />

          {/* Doc Amount */}
          <div className="grid grid-cols-[1fr_120px] gap-2 items-center mt-1">
            <label
              className="text-xs font-bold"
              style={{ color: COLORS.textPrimary }}
            >
              Doc Amount
            </label>
            <div className="relative">
              <span
                className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold"
                style={{ color: COLORS.textPrimary }}
              >
                ₹
              </span>
              <input
                ref={docAmountRef}
                type="text"
                defaultValue="0.00"
                readOnly
                className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs font-bold outline-none"
                style={{
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.borderDark,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- Chart of Accounts Modal --- */}
      {showChartOfAccounts && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
          style={{ zIndex: 1000 }}
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
});

const TotalRow = ({ label, inputRef, defaultValue }: any) => (
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
        ref={inputRef}
        type="text"
        defaultValue={defaultValue}
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

const SplitTotalRow = ({ label, valRef, amtRef }: any) => (
  <div className="grid grid-cols-[1fr_50px_120px] gap-2 items-center">
    <label className="text-xs" style={{ color: COLORS.textSecondary }}>
      {label}
    </label>
    <input
      ref={valRef}
      type="text"
      defaultValue="0"
      className="w-full border rounded-sm py-1 px-1 text-center text-xs outline-none"
      style={{ borderColor: COLORS.borderDark, color: COLORS.textPrimary }}
    />
    <div className="relative">
      <span
        className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
        style={{ color: COLORS.textMuted }}
      >
        ₹
      </span>
      <input
        ref={amtRef}
        type="text"
        defaultValue="0.00"
        className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs outline-none"
        style={{ borderColor: COLORS.borderDark, color: COLORS.textPrimary }}
      />
    </div>
  </div>
);

export default PurchaseBillFooter;
