// // utils/invoiceAdapter.ts
// import { InvoiceFormData } from "./SalesInvoiceForm";

// export const prepareInvoicePayload = (
//   formData: InvoiceFormData,
//   tableRows: any[],
//   footerData: any
// ) => {
//   const cleanItems = tableRows.map((row) => ({
//     itemCode: row.data.select,
//     quantity: Number(row.data.qty),
//     rate: Number(row.data.rate)
//   }));

//   // === DEBUGGING LOG ===
//   // Check if IDs are missing before sending
//   if (!formData.storeId || !formData.customerId) {
//      console.error("CRITICAL ERROR: Store ID or Customer ID is missing!", formData);
//      alert("Error: Please re-select the Store and Customer to ensure data is loaded.");
//      throw new Error("Missing IDs");
//   }

//   return {
//     store: formData.storeId,       // <--- SEND ID (e.g. "69661a...")
//     customer: formData.customerId, // <--- SEND ID (e.g. "6965fa...")
//     date: new Date().toISOString().split('T')[0],
//     gstType: formData.gstType,
//     cashCredit: formData.cashCredit,
//     receivedAmount: footerData.receivedAmount,
//     cashBankLedger: footerData.cashBankLedger,
//     remarks: footerData.remarks,
//     items: cleanItems
//   };
// };