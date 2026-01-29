// import React, {
//   useImperativeHandle,
//   forwardRef,
//   useRef,
//   useState,
//   useEffect,
// } from "react";
// import { EditIcon } from "lucide-react";
// import { COLORS } from "../../../../constants/colors";
// import Attachment from "../../../../components/Attachment";
// import GenerateEMIModal from "./GenerateEMIModal";
// import ChartOfAccounts from "../../../../components/ChartOfAccount";
// import Dropdown, { ColumnDef } from "../../../../components/Dropdown";
// import { SalesAndPurchaseGL } from "../../../../components/addItemMaster/api/saleAndPurchaseGL";
// import chartOfAccountService from "../../../../services/chartOfAccountService";

// // --- Interfaces ---
// export interface InvoiceFooterRef {
//   getFooterData: () => {
//     remarks: string;
//     receivedAmount: number;
//     cashBankLedger: string;
//     emiData: any;
//     itemValue: number;
//     promoDiscount: number;
//     promoDiscount2: number;
//     couponDiscount: number;
//     billDiscount: number;
//     billDiscountPercent: number;
//     adjustment: number;
//     taxable: number;
//     taxAmount: number;
//     roundOff: number;
//     totalFinalBill: number;
//   };
// }

// type InvoiceFooterProps = {
//   amount?: number;
//   cashCredit?: string;
//   onItemsChange?: (items: RowData[]) => void;
//   currentItems?: any[];
// };

// interface RowData {
//   [key: string]: string | number | undefined | null;
// }

// const glColumns: ColumnDef<any>[] = [
//   { header: "Code", key: "code", width: "w-1/4" },
//   { header: "Name", key: "name", width: "w-3/4" },
// ];

// const InvoiceFooter = forwardRef<InvoiceFooterRef, InvoiceFooterProps>(
//   ({ amount = 0, cashCredit, currentItems = [] }, ref) => {
//     const remarksRef = useRef<HTMLTextAreaElement>(null);
//     const receivedAmountRef = useRef<HTMLInputElement>(null);

//     const itemValueRef = useRef<HTMLInputElement>(null);
//     const promoDiscountRef = useRef<HTMLInputElement>(null);
//     const promoDiscount2Ref = useRef<HTMLInputElement>(null);
//     const couponDiscountRef = useRef<HTMLInputElement>(null);

//     const billDiscountPercentRef = useRef<HTMLInputElement>(null);
//     const billDiscountAmtRef = useRef<HTMLInputElement>(null);

//     const adjustmentRef = useRef<HTMLInputElement>(null);
//     const taxableRef = useRef<HTMLInputElement>(null);
//     const taxAmountRef = useRef<HTMLInputElement>(null);
//     const roundOffRef = useRef<HTMLInputElement>(null);
//     const docAmountRef = useRef<HTMLInputElement>(null);

//     const [isOpenGenerateEmi, setIsOpenGenerateEmi] = useState<boolean>(false);
//     const [emiData, setEmiData] = useState<any>(null);
//     const [glOptions, setGlOptions] = useState<any[]>([]);
//     const [selectedLedger, setSelectedLedger] =
//       useState<string>("Cash In Hand");
//     const [showChartOfAccounts, setShowChartOfAccounts] = useState(false);
//     const [coaFormData, setCoaFormData] = useState<SalesAndPurchaseGL | null>(
//       null,
//     );

//     // ✅ NEW: Store the Gross Total (Inclusive) so percentage calc can use it
//     const totalItemValueRef = useRef<number>(0);

//     // --- 1. REVERSE CALCULATION LOGIC ---
//     const calculateFinances = () => {
//       console.group("💰 INVOICE CALCULATION (Discount on Doc Amount)");

//       const getVal = (r: React.RefObject<HTMLInputElement | null>) =>
//         parseFloat(r.current?.value || "0") || 0;

//       // STEP A: Calculate GROSS Values (Total Bill before Discount)
//       let grossItemValue = 0;

//       // 1. Sum up all items (Qty * Rate)
//       const processedItems = currentItems.map((item: any) => {
//         const rowData = item.data || item;
//         const qty = Number(rowData.qty || 0);
//         const rate = Number(rowData.rate || 0);
//         const amt = qty * rate; // Inclusive Amount

//         const rawGst = rowData.gstRate || rowData.taxRate || "0";
//         const gstRate = parseFloat(String(rawGst)) || 0;

//         grossItemValue += amt;

//         return { amount: amt, gstRate: gstRate };
//       });

//       // ✅ Store Gross Value for the Percentage Handler
//       totalItemValueRef.current = grossItemValue;
//       console.log(`   ➤ Gross Item Value (Basis for %): ${grossItemValue}`);

//       // STEP B: Gather Discounts
//       const promo1 = getVal(promoDiscountRef);
//       const promo2 = getVal(promoDiscount2Ref);
//       const coupon = getVal(couponDiscountRef);
//       const billDisc = getVal(billDiscountAmtRef);

//       const totalDiscount = promo1 + promo2 + coupon + billDisc;
//       console.log(`   ➤ Total Discount Applied: ${totalDiscount}`);

//       // STEP C: Determine "Net" Values
//       // Logic: If Total is 100 and Discount is 10, Net is 90.
//       // We reduce the Taxable and Tax by the same ratio.

//       let netTaxable = 0;
//       let netTax = 0;

//       if (grossItemValue > 0) {
//         // Calculate the "Paying Ratio"
//         const netItemValue = Math.max(0, grossItemValue - totalDiscount);
//         const ratio = netItemValue / grossItemValue;

//         console.log(`   ➤ Reduction Ratio: ${ratio.toFixed(4)}`);

//         // Apply this ratio to calculate Net Taxable & Net Tax
//         processedItems.forEach((item) => {
//           // 1. Reduce Item Value by the Ratio (Pro-rata discount)
//           const netItemAmount = item.amount * ratio;

//           // 2. Extract Tax from the reduced amount (Reverse Tax)
//           const itemNetTaxable = netItemAmount / (1 + item.gstRate / 100);
//           const itemNetTax = netItemAmount - itemNetTaxable;

//           netTaxable += itemNetTaxable;
//           netTax += itemNetTax;
//         });
//       }

//       // STEP D: Finals
//       const adjustment = getVal(adjustmentRef);

//       // Final Bill = (Gross - Discount) + Adjustment
//       const preRoundOffTotal = grossItemValue - totalDiscount + adjustment;
//       const roundedTotal = Math.round(preRoundOffTotal);
//       const roundOffVal = roundedTotal - preRoundOffTotal;

//       console.log("   ➤ Final Numbers:", {
//         "Net Taxable": netTaxable.toFixed(2),
//         "Net Tax": netTax.toFixed(2),
//         "Doc Amount": roundedTotal.toFixed(2),
//       });
//       console.groupEnd();

//       // STEP E: Update UI
//       if (itemValueRef.current)
//         itemValueRef.current.value = grossItemValue.toFixed(2);

//       // ✅ Show NET values (Reduced by discount)
//       if (taxableRef.current) taxableRef.current.value = netTaxable.toFixed(2);
//       if (taxAmountRef.current) taxAmountRef.current.value = netTax.toFixed(2);

//       if (roundOffRef.current)
//         roundOffRef.current.value = roundOffVal.toFixed(2);
//       if (docAmountRef.current)
//         docAmountRef.current.value = roundedTotal.toFixed(2);
//     };

//     // --- 2. EFFECT: Trigger on Item Change ---
//     useEffect(() => {
//       calculateFinances();
//     }, [currentItems]);

//     // --- 3. Handlers ---
//     const handleBillDiscPercentChange = (
//       e: React.ChangeEvent<HTMLInputElement>,
//     ) => {
//       const percent = parseFloat(e.target.value) || 0;

//       // ✅ FIX: Calculate 10% of TOTAL ITEM VALUE (24256), not Taxable (20555)
//       const grossTotal = totalItemValueRef.current; // Access the stored gross value
//       const discountAmt = (grossTotal * percent) / 100;

//       console.log(
//         `% Change Detected: ${percent}% of ${grossTotal} = ${discountAmt}`,
//       );

//       if (billDiscountAmtRef.current) {
//         billDiscountAmtRef.current.value = discountAmt.toFixed(2);
//       }

//       // Trigger Recalculation with new amount
//       calculateFinances();
//     };

//     const handleBillDiscAmtChange = () => {
//       calculateFinances();
//     };

//     // --- Standard Setup ---
//     useEffect(() => {
//       const loadData = async () => {
//         try {
//           const coaResponse =
//             await chartOfAccountService.getAllChartOfAccounts();
//           if (coaResponse.data && coaResponse.data.success) {
//             const rawData = coaResponse.data.data;
//             const mappedOptions = rawData.map((item: any) => ({
//               ...item,
//               name: item.name,
//               code: item.code || item.accountCode || "",
//               label: item.name,
//               value: item._id,
//             }));
//             setGlOptions(mappedOptions);
//           }
//         } catch (error) {
//           console.error("Failed to load dropdown data", error);
//         }
//       };
//       loadData();
//     }, []);

//     useImperativeHandle(ref, () => ({
//       getFooterData: () => ({
//         remarks: remarksRef.current?.value || "",
//         receivedAmount: Number(receivedAmountRef.current?.value || 0),
//         cashBankLedger: selectedLedger,
//         emiData: emiData,
//         itemValue: Number(itemValueRef.current?.value || 0),
//         promoDiscount: Number(promoDiscountRef.current?.value || 0),
//         promoDiscount2: Number(promoDiscount2Ref.current?.value || 0),
//         couponDiscount: Number(couponDiscountRef.current?.value || 0),
//         billDiscount: Number(billDiscountAmtRef.current?.value || 0),
//         billDiscountPercent: Number(billDiscountPercentRef.current?.value || 0),
//         adjustment: Number(adjustmentRef.current?.value || 0),
//         taxable: Number(taxableRef.current?.value || 0),
//         taxAmount: Number(taxAmountRef.current?.value || 0),
//         roundOff: Number(roundOffRef.current?.value || 0),
//         totalFinalBill: Number(docAmountRef.current?.value || 0),
//       }),
//     }));

//     const handleSaveEMI = (data: any) => setEmiData(data);
//     const handleOpenCOA = () => {
//       const selectedItem = glOptions.find(
//         (item) => item.name === selectedLedger,
//       );
//       setCoaFormData(
//         selectedItem || ({ name: selectedLedger } as SalesAndPurchaseGL),
//       );
//       setShowChartOfAccounts(true);
//     };
//     const handleSaveCOA = (savedData: SalesAndPurchaseGL) => {
//       if (savedData?.name) {
//         setSelectedLedger(savedData.name);
//         window.location.reload();
//       }
//       setShowChartOfAccounts(false);
//     };

//     return (
//       <div
//         className="w-full p-4 font-sans text-sm relative"
//         style={{ backgroundColor: COLORS.white }}
//       >
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Left Section */}
//           <div className="flex-1 flex flex-col gap-4">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <label
//                 className="w-32 mt-1"
//                 style={{ color: COLORS.textPrimary }}
//               >
//                 Remarks
//               </label>
//               <div className="flex-1 relative">
//                 <textarea
//                   ref={remarksRef}
//                   className="w-full border rounded-sm p-2 h-20 outline-none resize-none text-xs custom-input"
//                   style={{
//                     borderColor: COLORS.borderDark,
//                     color: COLORS.textPrimary,
//                   }}
//                 />
//               </div>
//             </div>
//             <div className="flex flex-col sm:flex-row gap-4 items-center">
//               <label className="w-32" style={{ color: COLORS.textPrimary }}>
//                 Received Amount
//               </label>
//               <div className="w-40 relative">
//                 <span
//                   className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
//                   style={{ color: COLORS.textMuted }}
//                 >
//                   ₹
//                 </span>
//                 <input
//                   ref={receivedAmountRef}
//                   type="text"
//                   defaultValue="0.00"
//                   className="w-full border rounded-sm py-1 pl-6 pr-2 text-right outline-none text-xs custom-input"
//                   style={{
//                     borderColor: COLORS.borderDark,
//                     color: COLORS.textPrimary,
//                   }}
//                 />
//               </div>
//             </div>
//             {cashCredit !== "Credit" && (
//               <div className="flex flex-col sm:flex-row gap-4 items-center">
//                 <label className="w-32" style={{ color: COLORS.textPrimary }}>
//                   Cash/Bank Ledger
//                 </label>
//                 <div className="flex-1 flex items-center gap-1">
//                   <div className="relative flex-1">
//                     <Dropdown
//                       data={glOptions}
//                       columns={glColumns}
//                       value={selectedLedger}
//                       valueKey="name"
//                       onChange={(item) => setSelectedLedger(item?.name || "")}
//                       placeholder="Select Ledger"
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={handleOpenCOA}
//                     className="custom-btn-primary text-white p-1.5 rounded-sm flex items-center justify-center"
//                   >
//                     <EditIcon size={12} />
//                   </button>
//                 </div>
//               </div>
//             )}
//             <div className="flex flex-col sm:flex-row gap-4 mt-2">
//               <label
//                 className="w-32 pt-2"
//                 style={{ color: COLORS.textPrimary }}
//               >
//                 Attachment
//               </label>
//               <div className="flex-1">
//                 <Attachment />
//               </div>
//             </div>
//           </div>

//           {/* Right Section */}
//           <div className="w-full lg:w-[400px] flex flex-col gap-1">
//             <TotalRow
//               label="Item Value"
//               inputRef={itemValueRef}
//               defaultValue="0.00"
//               readOnly
//             />
//             <TotalRow
//               label="Promo Discount"
//               inputRef={promoDiscountRef}
//               defaultValue="0.00"
//               onChange={calculateFinances}
//             />
//             <TotalRow
//               label="Promo Discount 2"
//               inputRef={promoDiscount2Ref}
//               defaultValue="0.00"
//               onChange={calculateFinances}
//             />
//             <TotalRow
//               label="Coupon Discount"
//               inputRef={couponDiscountRef}
//               defaultValue="0.00"
//               onChange={calculateFinances}
//             />

//             {/* Bill Discount */}
//             <SplitTotalRow
//               label="Bill Discount"
//               valRef={billDiscountPercentRef}
//               amtRef={billDiscountAmtRef}
//               onPercentChange={handleBillDiscPercentChange}
//               onAmountChange={handleBillDiscAmtChange}
//             />

//             <TotalRow
//               label="Adjustment"
//               inputRef={adjustmentRef}
//               defaultValue="0.00"
//               onChange={calculateFinances}
//             />
//             <TotalRow
//               label="Taxable"
//               inputRef={taxableRef}
//               defaultValue="0.00"
//               readOnly
//             />
//             <TotalRow
//               label="Tax Amount"
//               inputRef={taxAmountRef}
//               defaultValue="0.00"
//               readOnly
//             />
//             <TotalRow
//               label="Round Off"
//               inputRef={roundOffRef}
//               defaultValue="0.00"
//               readOnly
//             />
//             <TotalRow
//               label="Doc Amount"
//               inputRef={docAmountRef}
//               defaultValue="0.00"
//               isBold
//               readOnly
//             />

//             <div className="flex justify-end mt-4">
//               <button
//                 onClick={() => setIsOpenGenerateEmi(true)}
//                 className="custom-btn-primary text-xs font-medium px-4 py-1.5 rounded-sm shadow-sm text-white"
//               >
//                 Generate EMI
//               </button>
//             </div>
//           </div>
//         </div>

//         <style>{`
//           .custom-btn-primary { background-color: ${COLORS.primary}; transition: background-color 0.2s; }
//           .custom-btn-primary:hover { background-color: ${COLORS.primaryHover}; }
//           .custom-input:focus { border-color: ${COLORS.info} !important; }
//         `}</style>

//         <GenerateEMIModal
//           isOpen={isOpenGenerateEmi}
//           onClose={() => setIsOpenGenerateEmi(false)}
//           billAmount={Math.abs(amount)}
//           onSave={handleSaveEMI}
//         />

//         {showChartOfAccounts && (
//           <div
//             className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
//             style={{ zIndex: 9999 }}
//           >
//             <div className="bg-white rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
//               <ChartOfAccounts
//                 isOpen={showChartOfAccounts}
//                 onClose={() => setShowChartOfAccounts(false)}
//                 initialData={coaFormData}
//                 onSave={handleSaveCOA}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   },
// );

// /* Sub-Components */
// type TotalRowProps = {
//   label: string;
//   defaultValue?: string;
//   readOnly?: boolean;
//   isBold?: boolean;
//   inputRef?: React.Ref<HTMLInputElement>;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
// };
// const TotalRow: React.FC<TotalRowProps> = ({
//   label,
//   defaultValue,
//   readOnly,
//   isBold,
//   inputRef,
//   onChange,
// }) => (
//   <div className="grid grid-cols-[1fr_120px] gap-2 items-center">
//     <label
//       className={`text-xs ${isBold ? "font-bold text-black" : ""}`}
//       style={{ color: isBold ? "#000" : COLORS.textSecondary }}
//     >
//       {label}
//     </label>
//     <div className="relative">
//       <span
//         className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
//         style={{ color: COLORS.textMuted }}
//       >
//         ₹
//       </span>
//       <input
//         ref={inputRef}
//         type="text"
//         defaultValue={defaultValue}
//         readOnly={readOnly}
//         onChange={onChange}
//         className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs outline-none"
//         style={{
//           backgroundColor: readOnly ? "#f9fafb" : COLORS.background,
//           borderColor: COLORS.borderDark,
//           color: COLORS.textPrimary,
//           fontWeight: isBold ? "bold" : "normal",
//         }}
//       />
//     </div>
//   </div>
// );

// type SplitTotalRowProps = {
//   label: string;
//   valRef: React.Ref<HTMLInputElement>;
//   amtRef: React.Ref<HTMLInputElement>;
//   onPercentChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onAmountChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
// };
// const SplitTotalRow: React.FC<SplitTotalRowProps> = ({
//   label,
//   valRef,
//   amtRef,
//   onPercentChange,
//   onAmountChange,
// }) => (
//   <div className="grid grid-cols-[1fr_50px_120px] gap-2 items-center">
//     <label className="text-xs" style={{ color: COLORS.textSecondary }}>
//       {label}
//     </label>
//     <div className="relative">
//       <input
//         ref={valRef}
//         type="text"
//         defaultValue="0"
//         onChange={onPercentChange}
//         className="w-full border rounded-sm py-1 px-1 pr-3 text-center text-xs outline-none"
//         style={{ borderColor: COLORS.borderDark, color: COLORS.textPrimary }}
//       />
//       <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
//         %
//       </span>
//     </div>
//     <div className="relative">
//       <span
//         className="absolute left-2 top-1/2 -translate-y-1/2 text-xs"
//         style={{ color: COLORS.textMuted }}
//       >
//         ₹
//       </span>
//       <input
//         ref={amtRef}
//         type="text"
//         defaultValue="0.00"
//         onChange={onAmountChange}
//         className="w-full border rounded-sm py-1 pl-5 pr-2 text-right text-xs outline-none"
//         style={{ borderColor: COLORS.borderDark, color: COLORS.textPrimary }}
//       />
//     </div>
//   </div>
// );

// export default InvoiceFooter;
