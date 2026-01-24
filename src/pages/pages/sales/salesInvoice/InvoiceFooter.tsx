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
import { SalesAndPurchaseGL } from "../../../../components/addItemMaster/api/saleAndPurchaseGL";
import chartOfAccountService from "../../../../services/chartOfAccountService";

// --- Interfaces ---
export interface InvoiceFooterRef {
  getFooterData: () => {
    remarks: string;
    receivedAmount: number;
    cashBankLedger: string;
    emiData: any;

    // New Specific Footer Fields
    itemValue: number;
    promoDiscount: number;
    promoDiscount2: number;
    couponDiscount: number;
    discount1: number;
    discount2: number;
    taxable: number;
    taxAmount: number;

    // Split Fields
    splitDiscountVal: number;
    splitDiscountAmt: number;
    splitDiscountPercentVal: number;
    splitDiscountPercentAmt: number;

    roundOff: number;
    docAmount: number;
  };
}

type InvoiceFooterProps = {
  amount?: number;
  cashCredit?: string;
};

// Updated columns to match mapped data
const glColumns: ColumnDef<any>[] = [
  { header: "Code", key: "code", width: "w-1/4" },
  { header: "Name", key: "name", width: "w-3/4" },
];

const InvoiceFooter = forwardRef<InvoiceFooterRef, InvoiceFooterProps>(
  ({ amount = 0, cashCredit }, ref) => {
    // --- Refs for Basic Fields ---
    const remarksRef = useRef<HTMLTextAreaElement>(null);
    const receivedAmountRef = useRef<HTMLInputElement>(null);

    // --- Refs for Calculation Fields (Right Side) ---
    const itemValueRef = useRef<HTMLInputElement>(null);
    const promoDiscountRef = useRef<HTMLInputElement>(null);
    const promoDiscount2Ref = useRef<HTMLInputElement>(null);
    const couponDiscountRef = useRef<HTMLInputElement>(null);
    const discount1Ref = useRef<HTMLInputElement>(null);
    const discount2Ref = useRef<HTMLInputElement>(null);
    const taxableRef = useRef<HTMLInputElement>(null);
    const taxAmountRef = useRef<HTMLInputElement>(null);

    // Split Fields (Value + Amount)
    const splitDiscountValRef = useRef<HTMLInputElement>(null);
    const splitDiscountAmtRef = useRef<HTMLInputElement>(null);
    const splitDiscountPercentValRef = useRef<HTMLInputElement>(null);
    const splitDiscountPercentAmtRef = useRef<HTMLInputElement>(null);

    const roundOffRef = useRef<HTMLInputElement>(null);
    const docAmountRef = useRef<HTMLInputElement>(null);

    // --- State ---
    const [isOpenGenerateEmi, setIsOpenGenerateEmi] = useState<boolean>(false);
    const [emiData, setEmiData] = useState<any>(null);

    // Ledger States
    const [glOptions, setGlOptions] = useState<any[]>([]);
    const [selectedLedger, setSelectedLedger] =
      useState<string>("Cash In Hand");
    const [showChartOfAccounts, setShowChartOfAccounts] = useState(false);
    const [coaFormData, setCoaFormData] = useState<SalesAndPurchaseGL | null>(
      null,
    );

    // --- Load Ledgers (Chart of Accounts) ---
    useEffect(() => {
      const loadData = async () => {
        try {
          const coaResponse =
            await chartOfAccountService.getAllChartOfAccounts();

          if (coaResponse.data && coaResponse.data.success) {
            const rawData = coaResponse.data.data;

            // Map data for Dropdown
            const mappedOptions = rawData.map((item: any) => ({
              ...item,
              name: item.name,
              code: item.code || item.accountCode || "",
              label: item.name, // Required for some dropdowns
              value: item._id, // Required for some dropdowns
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
        emiData: emiData,

        // Right Section Data
        itemValue: Number(itemValueRef.current?.value || 0),
        promoDiscount: Number(promoDiscountRef.current?.value || 0),
        promoDiscount2: Number(promoDiscount2Ref.current?.value || 0),
        couponDiscount: Number(couponDiscountRef.current?.value || 0),
        discount1: Number(discount1Ref.current?.value || 0),
        discount2: Number(discount2Ref.current?.value || 0),
        taxable: Number(taxableRef.current?.value || 0),
        taxAmount: Number(taxAmountRef.current?.value || 0),

        splitDiscountVal: Number(splitDiscountValRef.current?.value || 0),
        splitDiscountAmt: Number(splitDiscountAmtRef.current?.value || 0),
        splitDiscountPercentVal: Number(
          splitDiscountPercentValRef.current?.value || 0,
        ),
        splitDiscountPercentAmt: Number(
          splitDiscountPercentAmtRef.current?.value || 0,
        ),

        roundOff: Number(roundOffRef.current?.value || 0),
        docAmount: Number(docAmountRef.current?.value || 0),
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
      // Cast to SalesAndPurchaseGL to satisfy type requirements if strictly typed
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

            {/* Dynamic Cash/Bank Ledger - VISIBLE ONLY IF CASH */}
            {cashCredit === "Credit" && (
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
            )}

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
          <div className="w-full lg:w-[400px] flex flex-col gap-1">
            <TotalRow
              label="Item Value"
              inputRef={itemValueRef}
              defaultValue="0.00"
            />
            <TotalRow
              label="Promo Discount"
              inputRef={promoDiscountRef}
              defaultValue="0.00"
            />
            <TotalRow
              label="Promo Discount 2"
              inputRef={promoDiscount2Ref}
              defaultValue="0.00"
            />
            <TotalRow
              label="Coupon Discount"
              inputRef={couponDiscountRef}
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
            <TotalRow
              label="Taxable"
              inputRef={taxableRef}
              defaultValue="0.00"
            />
            <TotalRow
              label="Tax Amount"
              inputRef={taxAmountRef}
              defaultValue="0.00"
            />

            {/* Split Rows (Input + Total) */}
            <SplitTotalRow
              label="DISCOUNT"
              valRef={splitDiscountValRef}
              amtRef={splitDiscountAmtRef}
            />
            <SplitTotalRow
              label="DISCOUNT %"
              valRef={splitDiscountPercentValRef}
              amtRef={splitDiscountPercentAmtRef}
            />

            <TotalRow
              label="Round Off"
              inputRef={roundOffRef}
              defaultValue="0.00"
            />
            <TotalRow
              label="Doc Amount"
              inputRef={docAmountRef}
              defaultValue="0.00"
              isBold
            />

            <div className="flex justify-end mt-4">
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

/* --- Sub-Components --- */

type TotalRowProps = {
  label: string;
  defaultValue?: string;
  readOnly?: boolean;
  isBold?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
};

const TotalRow: React.FC<TotalRowProps> = ({
  label,
  defaultValue,
  readOnly,
  isBold,
  inputRef,
}) => (
  <div className="grid grid-cols-[1fr_120px] gap-2 items-center">
    <label
      className={`text-xs ${isBold ? "font-bold text-black" : ""}`}
      style={{ color: isBold ? "#000" : COLORS.textSecondary }}
    >
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
        readOnly={readOnly}
        className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs outline-none"
        style={{
          backgroundColor: readOnly ? "#f9fafb" : COLORS.background,
          borderColor: COLORS.borderDark,
          color: COLORS.textPrimary,
          fontWeight: isBold ? "bold" : "normal",
        }}
      />
    </div>
  </div>
);

type SplitTotalRowProps = {
  label: string;
  valRef: React.Ref<HTMLInputElement>;
  amtRef: React.Ref<HTMLInputElement>;
};

const SplitTotalRow: React.FC<SplitTotalRowProps> = ({
  label,
  valRef,
  amtRef,
}) => (
  <div className="grid grid-cols-[1fr_50px_120px] gap-2 items-center">
    <label className="text-xs" style={{ color: COLORS.textSecondary }}>
      {label}
    </label>

    {/* Small Input Box (e.g. rate or count) */}
    <input
      ref={valRef}
      type="text"
      defaultValue="0"
      className="w-full border rounded-sm py-1 px-1 text-center text-xs outline-none"
      style={{
        borderColor: COLORS.borderDark,
        color: COLORS.textPrimary,
      }}
    />

    {/* Amount Box */}
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
        style={{
          borderColor: COLORS.borderDark,
          color: COLORS.textPrimary,
        }}
      />
    </div>
  </div>
);

export default InvoiceFooter;
