import {
  SaleIcon,
  PurchaseIcon,
  FinanceIcon,
  InventoryIcon,
  PosIcon,
  ProductionIcon,
  AssetIcon,
  EmployeeIcon,
  ReportIcon,
} from "../components/icons";

export const navItems = [
  {
    icon: <SaleIcon className="w-5 h-5" />,
    name: "Sale",
    subItems: [
      { name: "Customer", path: "/customer", pro: false },
      {
        name: "Sale Price List",
        path: "/sale-price-list-parent",
        pro: false,
        nestedItems: [
          { name: "Price List", path: "/price-list" },
          {
            name: "Party-Sale Discount Rate",
            path: "/party-sale-discount-rate",
          },
          {
            name: "Brandwise Discount/Charges",
            path: "/brandwise-discount-charges",
          },
          {
            name: "Party-Brandwise Discount/Charges",
            path: "/party-brandwise-discount-charges",
          },
          {
            name: "Update Price For Single Item",
            path: "/update-price-for-single-item",
          },
          {
            name: "Update Barcode Rate",
            path: "/update-barcode-rate",
          },
          {
            name: "Update Barcode Discount",
            path: "/update-barcode-discount",
          },
        ],
      },
      { name: "Estimate", path: "/estimate", pro: false },
      { name: "Sales Order", path: "/sales-order", pro: false },
      { name: "Dispatch", path: "/dispatch", pro: false },
      {
        name: "Sales Return Challan",
        path: "/sales-return-challan",
        pro: false,
      },
      { name: "Sale Invoice", path: "/sale-invoice", pro: false },
      { name: "Sales Credit Note", path: "/sales-credit-note", pro: false },
      { name: "Sales Debit Note", path: "/sales-debit-note", pro: false },
      { name: "Sales Return", path: "/sales-return", pro: false },
      { name: "Payment Receipt", path: "/payment-receipt", pro: false },
      { name: "Cheque Return", path: "/cheque-return", pro: false },
      { name: "Update Logistic", path: "/update-logistic", pro: false },
      {
        name: "Bulk Dispatch/Invoice",
        path: "/bulk-dispatch-invoice",
        pro: false,
        nestedItems: [
          {
            name: "Bulk Dispatch From Order",
            path: "/bulk-dispatch-from-order",
          },
          {
            name: "Bulk Sales Invoice From Order",
            path: "/bulk-sales-invoice-from-order",
          },
          {
            name: "Bulk Sales Invoice From Dispatch",
            path: "/bulk-sales-invoice-from-dispatch",
          },
          {
            name: "Timesheet Based Billing",
            path: "/timesheet-based-billing",
          },
          {
            name: "Pull PO from Other Company as SO",
            path: "/pull-po-from-other-company-as-so",
          },
        ],
      },
      {
        name: "E-Commerce",
        path: "/e-commerce",
        pro: false,
        nestedItems: [
          { name: "Shopify Order", path: "/shopify-order" },
          { name: "Market Place Payment", path: "/market-place-payment" },
        ],
      },
    ],
  },
  {
    icon: <PurchaseIcon className="w-5 h-5" />,
    name: "Purchase",
    subItems: [
      { name: "Vendor", path: "/vendor", pro: false },
      {
        name: "Purchase Price List",
        path: "/purchase-price-list",
        pro: false,
        nestedItems: [
          { name: "Purchase Price List", path: "/purchase-price-list" },
          {
            name: "Party-Purchase Discount Rate",
            path: "/party-purchase-discount-rate",
          },
          {
            name: "Brandwise Purchase Charges",
            path: "/brandwise-purchase-charges",
          },
          {
            name: "Price-Brandwise Purchase Charges",
            path: "/price-brandwise-purchase-charges",
          },
        ],
      },
      {
        name: "Purchase Requisition",
        path: "/purchase-requisition",
        pro: false,
      },
      {
        name: "Process Purchase Requisition",
        path: "/process-purchase-requisition",
        pro: false,
      },
      { name: "Purchase Order", path: "/purchase-order", pro: false },
      { name: "Goods Receipt Note", path: "/goods-receipt-note", pro: false },
      {
        name: "Purchase Return Challan",
        path: "/purchase-return-challan",
        pro: false,
      },
      { name: "Purchase Bill", path: "/purchase-bill", pro: false },
      {
        name: "Purchase Credit Note",
        path: "/purchase-credit-note",
        pro: false,
      },
      { name: "Purchase Debit Note", path: "/purchase-debit-note", pro: false },
      { name: "Purchase Return", path: "/purchase-return", pro: false },
      {
        name: "Bulk GRN/Purchase",
        path: "/bulk-grn-purchase",
        pro: false,
        nestedItems: [
          {
            name: "Bulk Purchase Invoice From Order",
            path: "/bulk-purchase-invoice-from-order",
            pro: false,
          },
          {
            name: "Bulk GRN From Order",
            path: "/bulk-grn-from-order",
            pro: false,
          },
          {
            name: "Bulk Purchase Invoice From GRN",
            path: "/bulk-purchase-invoice-from-grn",
            pro: false,
          },
          {
            name: "Pull SI From Other Company as PI",
            path: "/pull-si-from-other-company-as-pi",
            pro: false,
          },
        ],
      },
      { name: "Bill Payment", path: "/bill-payment", pro: false },
      { name: "Payment Duned", path: "/payment-duned", pro: false },
      { name: "Online Payment", path: "/online-payment", pro: false },
    ],
  },
  {
    icon: <FinanceIcon className="w-5 h-5" />,
    name: "Finance",
    path: "/finance",
    subItems: [
      { name: "Chart Of Accounts", path: "/chart-of-accounts", pro: false },
      {
        name: "Receipt Payment Voucher",
        path: "/receipt-payment-voucher",
        pro: false,
      },
      { name: "Transfer Journal", path: "/transfer-journal", pro: false },
      { name: "Reversal Journal", path: "/reversal-journal", pro: false },
      { name: "Journal Voucher", path: "/journal-voucher", pro: false },
      { name: "Expenses Journal", path: "/expenses-journal", pro: false },
      {
        name: "GST Adjustment Voucher",
        path: "/gst-adjustment-voucher",
        pro: false,
      },
      { name: "GST ITC Reversal", path: "/gst-itc-reversal", pro: false },
      { name: "Bank Reconciliation", path: "/bank-reconciliation", pro: false },
      {
        name: "Post Dated Cheque Receipt",
        path: "/post-dated-cheque-receipt",
        pro: false,
      },
      {
        name: "Post Dated Cheque Issued",
        path: "/post-dated-cheque-issued",
        pro: false,
      },
      {
        name: "Adhoc Adjustment with Bill",
        path: "/adhoc-adjustment-with-bill",
        pro: false,
      },
      {
        name: "G&A Budget Allocation",
        path: "/gna-budget-allocation",
        pro: false,
      },
    ],
  },
  {
    name: "Inventory",
    icon: <InventoryIcon className="w-5 h-5" />,
    subItems: [
      { name: "Item Master", path: "/item-master", pro: false },
      { name: "Stock Adjustment", path: "/stock-adjustment", pro: false },
      // { name: "Material Issue", path: "/material-issue", pro: false },
      // { name: "Material Receipt", path: "/material-receipt", pro: false },
      // {
      //   name: "Returnable Delivery Challan",
      //   path: "/returnable-delivery-challan",
      //   pro: false,
      // },
      // {
      //   name: "Inter Branch",
      //   path: "/inter-branch",
      //   pro: false,
      //   nestedItems: [
      //     {
      //       name: "Inter Branch Issue Request",
      //       path: "/inter-branch-issue-request",
      //       pro: false,
      //     },
      //     {
      //       name: "Inter Branch Issue",
      //       path: "/inter-branch-issue",
      //       pro: false,
      //     },
      //     {
      //       name: "Inter Branch Receipt",
      //       path: "/inter-branch-receipt",
      //       pro: false,
      //     },
      //     {
      //       name: "Inter Branch Transfer",
      //       path: "/inter-branch-transfer",
      //       pro: false,
      //     },
      //     {
      //       name: "Process IB Request For Promotion",
      //       path: "/process-ib-request-for-promotion",
      //       pro: false,
      //     },
      //   ],
      // },
      {
        name: "Inter Branch Transfer",
        path: "/inter-branch-transfer",
        pro: false,
      },
      {
        name: "Job Work Outward",
        path: "/job-work-outward",
        pro: false,
        nestedItems: [
          {
            name: "Job Work Outward Rate",
            path: "/job-work-outward-rate",
            pro: false,
          },
          {
            name: "Material Issue For Job Work",
            path: "/material-issue-for-job-work",
            pro: false,
          },
          {
            name: "Material Received After Job Work",
            path: "/material-received-after-job-work",
            pro: false,
          },
          {
            name: "Job Work Outward Invoice",
            path: "/job-work-outward-invoice",
            pro: false,
          },
        ],
      },
      {
        name: "Job Work Inward",
        path: "/job-work-inward",
        pro: false,
        nestedItems: [
          {
            name: "Job Work Inward Rate",
            path: "/job-work-inward-rate",
            pro: false,
          },
          {
            name: "Material Received For Job Work",
            path: "/material-received-for-job-work",
            pro: false,
          },
          {
            name: "Material Issue After Job Work",
            path: "/material-issue-after-job-work",
            pro: false,
          },
          {
            name: "Job Work Inward Invoice",
            path: "/job-work-inward-invoice",
            pro: false,
          },
        ],
      },
    ],
  },
  {
    name: "Point Of Sale",
    icon: <PosIcon className="w-5 h-5" />,
    subItems: [
      {
        name: "POS Masters",
        path: "/pos-masters",
        pro: false,
        nestedItems: [
          {
            name: "POS Customer Master",
            path: "/pos-customer-master",
            pro: false,
          },
          { name: "POS Coupon Master", path: "/pos-coupon-master", pro: false },
          {
            name: "Counter",
            path: "/counter",
            pro: false,
          },
          {
            name: "Tender Type",
            path: "/tender-type",
            pro: false,
          },
          {
            name: "Loyalty Card",
            path: "/loyalty-card",
            pro: false,
          },
          {
            name: "Promotions",
            path: "/promotions",
            pro: false,
          },
          {
            name: "Item Set Template",
            path: "/item-set-template",
            pro: false,
          },
        ],
      },
      { name: "POS Order", path: "/pos-order", pro: false },
      { name: "Process POS Orders", path: "/process-pos-orders", pro: false },
      { name: "Alteration Order", path: "/alteration-order", pro: false },
      { name: "Item Weighment", path: "/item-weighment", pro: false },
      { name: "POS Invoice", path: "/pos-invoice", pro: false },
      { name: "Touch POS", path: "/touch-pos", pro: false },
      {
        name: "Customer Receipt Payment",
        path: "/customer-receipt-payment",
        pro: false,
      },
      {
        name: "Process Shop in Shop invoice",
        path: "/process-shop-in-shop-invoice",
        pro: false,
      },
    ],
  },
  {
    name: "Production",
    icon: <ProductionIcon className="w-5 h-5" />,
    subItems: [
      { name: "Bill Of Material", path: "/bill-of-material", pro: false },
      {
        name: "Production Assembling",
        path: "/production-assembling",
        pro: false,
      },
      { name: "Dis Assembling", path: "/dis-assembling", pro: false },
      {
        name: "Issue Request From Production Floor",
        path: "/issue-request-from-production-floor",
        pro: false,
      },
      {
        name: "Material Issue To Production Floor",
        path: "/material-issue-to-production-floor",
        pro: false,
      },
      {
        name: "Material Received From Production Floor",
        path: "/material-received-from-production-floor",
        pro: false,
      },
    ],
  },
  {
    name: "Asset",
    icon: <AssetIcon className="w-5 h-5" />,
    subItems: [
      { name: "Asset Item", path: "/asset-item", pro: false },
      {
        name: "Inventory To Asset",
        path: "/inventory-to-asset",
        pro: false,
      },
      {
        name: "Inventory To Inventory",
        path: "/inventory-to-inventory",
        pro: false,
      },
      { name: "Asset Transfer", path: "/asset-transfer", pro: false },
    ],
  },
  {
    name: "Employee",
    icon: <EmployeeIcon className="w-5 h-5" />,
    subItems: [
      { name: "Employee Master", path: "/employee-master", pro: false },
      {
        name: "Attendance",
        path: "/attendance",
        pro: false,
      },
      { name: "Attendance Approval", path: "/attendance-approval", pro: false },
      {
        name: "Attendance Correction",
        path: "/attendance-correction",
        pro: false,
      },
      {
        name: "Manage Leave",
        path: "/manage-leave",
        pro: false,
        nestedItems: [
          {
            name: "Employee Leave Master",
            path: "/employee-leave-master",
            pro: false,
          },
          {
            name: "Leave Application",
            path: "/leave-application",
            pro: false,
          },
          {
            name: "Leave Adjustment",
            path: "/leave-adjustment",
            pro: false,
          },
          {
            name: "Leave Encashment",
            path: "/leave-encashment",
            pro: false,
          },
        ],
      },
      {
        name: "Time Sheet",
        path: "/time-sheet",
        pro: false,
      },
      { name: "Expense Claim", path: "/expense-claim", pro: false },
      {
        name: "Expense Claim Process",
        path: "/expense-claim-process",
        pro: false,
      },
      {
        name: "Payroll",
        path: "/payroll",
        pro: false,
        nestedItems: [
          {
            name: "Salary Appraisal",
            path: "/salary-appraisal",
            pro: false,
          },
          {
            name: "Monthly Attendance Process",
            path: "/monthly-attendance-process",
            pro: false,
          },
          {
            name: "Salary Process",
            path: "/salary-process",
            pro: false,
          },
          {
            name: "Perquisite Process",
            path: "/perquisite-process",
            pro: false,
          },
          {
            name: "Post Salary in Finance",
            path: "/post-salary-in-finance",
            pro: false,
          },
          {
            name: "Generate Pay Slip",
            path: "/generate-pay-slip",
            pro: false,
          },
        ],
      },
      {
        name: "End Of Service",
        path: "/end-of-service",
        pro: false,
      },
      {
        name: "Employee Remark",
        path: "/employee-remark",
        pro: false,
      },
    ],
  },
  {
    name: "Report",
    icon: <ReportIcon className="w-5 h-5" />,
    subItems: [
      { name: "All Report", path: "/all-report", pro: false },
      {
        name: "Trial Balance",
        path: "/trial-balance",
        pro: false,
      },
      { name: "Customer Trial", path: "/customer-trial", pro: false },
      { name: "Vendor Trial", path: "/vendor-trial", pro: false },
      { name: "Stock Trial", path: "/stock-trial", pro: false },
    ],
  },
];

export const allItems = [...navItems];
