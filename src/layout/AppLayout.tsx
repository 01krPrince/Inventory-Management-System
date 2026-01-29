import React from 'react';
import { TabProvider, useTabs } from '../context/TabContext';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import { TabBar } from './TabBar';
import { AppSidebar } from './AppSidebar';
import Welcome from '../pages/pages/Welcome';
import PriceList from '../pages/pages/sales/salesPriceList/PriceList';
import PartySalesDiscountRate from '../pages/pages/sales/salesPriceList/PartySalesDiscountRate';
import BrandwiseDiscountCharges from '../pages/pages/sales/salesPriceList/BrandwiseDiscountCharges';
import PartyBrandwiseDiscountCharges from '../pages/pages/sales/salesPriceList/PartyBrandwiseDiscountCharges';
import UpdateListForEachItems from '../pages/pages/sales/salesPriceList/UpdateListForEachItems';
import UpdateBarcodeRate from '../pages/pages/sales/salesPriceList/UpdateBarcodeRate';
import SalesInvoice from '../pages/pages/sales/salesInvoice/SalseInvoice';
import ItemMaster from '../pages/pages/inventory/itemMaster/pages/ItemMaster';
import StockAdjustment from '../pages/pages/inventory/stockAdjustment/StockAdjustment';
import InterBranchTransfer from '../pages/pages/inventory/interBranchTransfer/InterBranchTransfer.tsx';
import MaterialIssueForJobWork from '../pages/pages/inventory/JobWorkOutward/MaterialIssueForJobWork/MaterialIssueForJobWork.tsx';
import ParentTableComponent from '../components/ParentTableComponent.tsx';
import POSOrder from '../pages/pages/pointOfSale/POSOrder/POSOrder.tsx';
import POSCustomer from '../pages/pages/pointOfSale/POSMaster/POSCustomer/POSCustomer.tsx';
import POSCoupon from '../pages/pages/pointOfSale/POSMaster/POSCoupon/POSCoupon.tsx';
import Counter from '../pages/pages/pointOfSale/POSMaster/Counter/Counter.tsx';
import TenderType from '../pages/pages/pointOfSale/POSMaster/TenderType/TenderType.tsx';
import LoyaltyCard from '../pages/pages/pointOfSale/POSMaster/LoyelityCard/LoyelityCard.tsx';
import Promotions from '../pages/pages/pointOfSale/POSMaster/Promotions/Promotions.tsx';
import POSInvoice from '../pages/pages/pointOfSale/POSInvoice/POSInvoice.tsx';
import CustomerRecieptPayment from '../pages/pages/pointOfSale/CustomerRecieptPayment/CustomerRecieptPayment.tsx';
import VendorDirectory from '../pages/pages/purchase/vendor/pages/Vendor.tsx';
import PurchaseRequisition from '../pages/pages/purchase/purchaseRequisition/PurchaseRequisition.tsx';
import PurchaseOrder from '../pages/pages/purchase/purchaseOrder/PurchaseOrder.tsx';
import PurchaseBill from '../pages/pages/purchase/purchaseBill/PurchaseBill.tsx';
import GoodsRecieptNote from '../pages/pages/purchase/goodsRecieptNote/GoodsRecieptNote.tsx';
import PurchaseCreditNote from '../pages/pages/purchase/purchaseCreditNote/PurchaseCreditNote.tsx';
import PurchaseDebitNote from '../pages/pages/purchase/purchaseDebitNote/PurchaseDebitNote.tsx';
import BillPayment from '../pages/pages/purchase/billPayment/BillPayment.tsx';
import PurchaseReturn from '../pages/pages/purchase/purchaseReturn/PurchaseReturn.tsx';
import PurchaseReturnChallan from '../pages/pages/purchase/purchaseReturnChallan/PurchaseReturnChallan.tsx';
import SalseOrder from '../pages/pages/sales/salesOrder/SalseOrder.tsx';
import Dispatch from '../pages/pages/sales/dispatch/Dispatch.tsx';
import Estimate from '../pages/pages/sales/estimate/Estimate.tsx';
import SaleReturnChallan from '../pages/pages/sales/saleReturnChallan/SaleReturnChallan.tsx';
import OpeningStock from '../pages/pages/header/openingTransaction/OpeningStock.tsx';
import CustomerDirectory from '../pages/pages/sales/customer/Customer.tsx';
import EcomProductDetail from '../pages/pages/e-commerce/EcommerceProductDetail.tsx';
import WishlistStockManager from '../pages/pages/e-commerce/WishlistManager.tsx';
import ReportDashboard from '../pages/pages/report/ReportDashboard.tsx';

import PlaceholderPage from '../pages/pages/report/PlaceholderPage';
import CustomerReport from '../pages/pages/report/reportPages/CustomerReport.tsx';
import VendorReport from '../pages/pages/report/reportPages/VendorReport.tsx';
import PurchaseBillReport from '../pages/pages/report/reportPages/PurchaseBillReport.tsx';
import ItemReport from '../pages/pages/report/reportPages/ItemReport.tsx';
import GstMasterReport from '../pages/pages/report/reportPages/GstMasterReport.tsx';
import SalesInvoiceReport from '../pages/pages/report/reportPages/SalesInvoiceReport.tsx';
import StockSummary from '../pages/pages/report/reportPages/StockSummary.tsx';

const useSidebar = () => ({
  isExpanded: false,
  isHovered: false,
  isMobileOpen: false,
});
const Backdrop = () => null;

const ReportPageRoutes: { [key: string]: React.FC } = {
  // --- MIS Reports ---
  '/report/financial-statements': () => <PlaceholderPage title="Financial Statements" />,
  '/report/financial-analysis': () => <PlaceholderPage title="Financial Analysis" />,
  '/report/stock-analysis': () => <PlaceholderPage title="Stock Analysis" />,
  '/report/sales-analysis': () => <PlaceholderPage title="Sales Analysis" />,
  '/report/purchase-analysis': () => <PlaceholderPage title="Purchase Analysis" />,
  '/report/enterprise-analysis': () => <PlaceholderPage title="Enterprise Analysis" />,
  '/report/business-insight': () => <PlaceholderPage title="Business Insight" />,

  // --- Finance ---
  '/report/primary-books': () => <PlaceholderPage title="Primary Books" />,
  '/report/ledgers': () => <PlaceholderPage title="Ledgers" />,
  '/report/trial-balance-finance': () => <PlaceholderPage title="Trial Balance" />,
  '/report/attribute-reports': () => <PlaceholderPage title="Attribute Reports" />,
  '/report/loan-bank-interest': () => <PlaceholderPage title="Loan-Bank Interest" />,

  // --- Customer/Sales ---
  '/report/customers': CustomerReport,
  '/report/sales-report': SalesInvoiceReport,
  '/report/ledgers-trials': () => <PlaceholderPage title="Sales Ledgers & Trials" />,
  '/report/bills-os-ageing': () => <PlaceholderPage title="Sales Bills O/S" />,
  // Note: Linkage reports path is used in both Sales and Purchase
  '/report/linkage-reports': () => <PlaceholderPage title="Linkage Reports" />,

  // --- Vendor/Purchase ---
  '/report/vendors': VendorReport,
  '/report/purchase-bill': PurchaseBillReport,
  '/report/purchase-registers': () => <PlaceholderPage title="Purchase Registers" />,
  '/report/trial-ledgers': () => <PlaceholderPage title="Purchase Trial/Ledgers" />,
  '/report/vendor-bills-os-ageing': () => <PlaceholderPage title="Vendor Bills O/S" />,

  // --- Inventory ---
  '/report/item-master': ItemReport,
  '/report/stock-analysis/stock-summary': StockSummary,
  '/report/primary-stock': () => <PlaceholderPage title="Primary Stock Reports" />,
  '/report/stock-adjustment': () => <PlaceholderPage title="Stock Adjustment" />,
  '/report/store-transfer': () => <PlaceholderPage title="Store Transfer" />,
  '/report/job-card-work-inward-outward': () => <PlaceholderPage title="JobWork Inward/Outward" />,
  '/report/serial-imei-tag': () => <PlaceholderPage title="Serial/IMEI/Tag Reports" />,
  '/report/attribute-barcode-reports': () => <PlaceholderPage title="Attribute/Barcode Reports" />,
  '/report/pharma-batch': () => <PlaceholderPage title="Pharma/Batch Reports" />,
  '/report/imitation-jewellery-rental': () => (
    <PlaceholderPage title="Imitation/Jewellery/Rental" />
  ),
  '/report/material-requisition-planning': () => (
    <PlaceholderPage title="Material Requisition Planning" />
  ),

  // --- GST/VAT ---
  '/report/gst-master': GstMasterReport,
  '/report/gst-returns': () => <PlaceholderPage title="GST Returns" />,
  '/report/gstr-reco': () => <PlaceholderPage title="GSTR 2A/2B Reconciliation" />,
  '/report/uae-vat': () => <PlaceholderPage title="UAE VAT Returns" />,
  '/report/tax-register-sales': () => <PlaceholderPage title="Tax Register Sales" />,
  '/report/tax-register-purchase': () => <PlaceholderPage title="Tax Register Purchase" />,
  '/report/tax-summary': () => <PlaceholderPage title="Tax Summary" />,
  '/report/gst-itc-reversal-register': () => <PlaceholderPage title="GST ITC Reversal" />,
  '/report/hsn-tax-rate-vs-invoice-tax-rate-mismatch': () => (
    <PlaceholderPage title="HSN vs Invoice Tax Mismatch" />
  ),

  // --- Employee ---
  '/report/employee-register': () => <PlaceholderPage title="Employee Register" />,
  '/report/attendance-leave': () => <PlaceholderPage title="Attendance/Leave" />,
  '/report/salary-timesheet-expense-claim': () => (
    <PlaceholderPage title="Salary/Timesheet/Expense" />
  ),
  '/report/esi-pf': () => <PlaceholderPage title="ESI/PF" />,

  // --- Point of Sales (POS) ---
  '/report/pos-customer-list': () => <PlaceholderPage title="POS Customer List" />,
  '/report/pos-order-register': () => <PlaceholderPage title="POS Order Register" />,
  '/report/pos-sales-register': () => <PlaceholderPage title="POS Sales Register" />,
  '/report/pos-sales-summary': () => <PlaceholderPage title="POS Sales Summary" />,
  '/report/pos-tender-wise': () => <PlaceholderPage title="POS Sales Tender Wise" />,
  '/report/pos-tender-wise-with-item': () => (
    <PlaceholderPage title="POS Sales Tender Wise (Item)" />
  ),
  '/report/tender-settlement-report': () => <PlaceholderPage title="Tender Settlement Report" />,
  '/report/pos-daywise-tender-summary': () => (
    <PlaceholderPage title="POS Day Wise Tender Summary" />
  ),
  '/report/tender-wise-summary': () => <PlaceholderPage title="Tender Wise Summary" />,
  '/report/pos-sales-analysis': () => <PlaceholderPage title="POS Sales Analysis" />,
  '/report/pos-party-trial': () => <PlaceholderPage title="POS Party Trial" />,
  '/report/pos-party-ledger': () => <PlaceholderPage title="POS Party Ledger" />,
  '/report/pos-party-ledger-with-item-detail': () => (
    <PlaceholderPage title="POS Party Ledger (Item Detail)" />
  ),
  '/report/pos-day-start-close-register': () => <PlaceholderPage title="POS Day Start/Close" />,
  '/report/loyalty-point-ledger': () => <PlaceholderPage title="Loyalty Point Ledger" />,
  '/report/loyalty-point-summary': () => <PlaceholderPage title="Loyalty Point Summary" />,
  '/report/pos-order-vs-invoice': () => <PlaceholderPage title="POS Order vs Invoice" />,
  '/report/pos-customer-receipt-payment-register': () => (
    <PlaceholderPage title="POS Customer Receipt/Payment" />
  ),

  // --- Production ---
  '/report/production-register': () => <PlaceholderPage title="Production Register" />,
  '/report/bom-register': () => <PlaceholderPage title="Bill of Material Register" />,
  '/report/de-assembling': () => <PlaceholderPage title="Production De-Assembling" />,
  '/report/issue-request': () => <PlaceholderPage title="Material Issue Request" />,
  '/report/issue-summary': () => <PlaceholderPage title="Material Issue Summary" />,
  '/report/material-issue-to-production': () => (
    <PlaceholderPage title="Material Issue To Production" />
  ),
  '/report/material-received-from-production': () => (
    <PlaceholderPage title="Material Received From Production" />
  ),
  '/report/issue-to-production-floor-vs-receipt-linkage-based': () => (
    <PlaceholderPage title="Issue vs Receipt (Linkage)" />
  ),
  '/report/issue-to-production-floor-vs-receipt-voucher-based': () => (
    <PlaceholderPage title="Issue vs Receipt (Voucher)" />
  ),
  '/report/wip-stock-balance': () => <PlaceholderPage title="WIP Stock Balance" />,
  '/report/cashew-production': () => <PlaceholderPage title="Cashew Production" />,

  // --- Assets ---
  '/report/asset-register': () => <PlaceholderPage title="Asset Register" />,
  '/report/asset-transfer': () => <PlaceholderPage title="Asset Transfer Register" />,
  '/report/asset-depreciation': () => <PlaceholderPage title="Asset Depreciation" />,
  '/report/asset-on-hand': () => <PlaceholderPage title="Asset On Hand" />,

  // --- Audit / Logs ---
  '/report/price-list-change': () => <PlaceholderPage title="Price List Change Track" />,
  '/report/physical-stock': () => <PlaceholderPage title="Physical Stock vs Actual" />,
  '/report/mismatch-report': () => <PlaceholderPage title="Mismatch Report" />,
  '/report/user-geo': () => <PlaceholderPage title="User Geo Tracking" />,
  '/report/payment-link-status': () => <PlaceholderPage title="Payment Link Status" />,
  '/report/document-change-track': () => <PlaceholderPage title="Document Change Track" />,
  '/report/attachment-register': () => <PlaceholderPage title="Attachment Register" />,
  '/report/zero-sales-analyses': () => <PlaceholderPage title="Zero Sales Analyses" />,
  '/report/authorization-status': () => <PlaceholderPage title="Authorization Status" />,
  '/report/force-close-log': () => <PlaceholderPage title="Force Close Log" />,
  '/report/sms-log': () => <PlaceholderPage title="SMS Log" />,
  '/report/notification-template-register': () => (
    <PlaceholderPage title="Notification Template Register" />
  ),
  '/report/authorization-matrix-register': () => (
    <PlaceholderPage title="Authorization Matrix Register" />
  ),

  // --- CRM Reports ---
  '/report/prospect-master': () => <PlaceholderPage title="Prospect Master" />,

  // --- Project Management ---
  '/project/project-trials-analyses': () => <PlaceholderPage title="Project Trials & Analyses" />,
  '/project/project-based-ledgers-os': () => <PlaceholderPage title="Project Ledgers / OS" />,
  '/project/stock-issue-receipts': () => <PlaceholderPage title="Stock Issue/Receipts" />,
  '/project/project-material-requisition': () => (
    <PlaceholderPage title="Project Material Requisition" />
  ),
  '/project/costsheet-project-contract': () => (
    <PlaceholderPage title="Cost Sheet Project Contract" />
  ),

  // --- Country Specification ---
  '/report/nepal': () => <PlaceholderPage title="Nepal Reports" />,
};

const ComponentMap: { [key: string]: React.FC } = {
  '/welcome': Welcome,
  '/customer': CustomerDirectory,
  '/price-list': PriceList,
  '/party-sale-discount-rate': PartySalesDiscountRate,
  '/brandwise-discount-charges': BrandwiseDiscountCharges,
  '/party-brandwise-discount-charges': PartyBrandwiseDiscountCharges,
  '/update-price-for-single-item': UpdateListForEachItems,
  '/update-barcode-rate': UpdateBarcodeRate,
  '/sale-invoice': SalesInvoice,
  '/item-master': ItemMaster,
  '/stock-adjustment': StockAdjustment,
  '/inter-branch-transfer': InterBranchTransfer,
  '/material-issue-for-job-work': MaterialIssueForJobWork,
  '/job-work-outward-rate': ParentTableComponent,
  '/pos-order': POSOrder,
  '/pos-customer-master': POSCustomer,
  '/attendance': () => <></>,
  '/pos-coupon-master': POSCoupon,
  '/counter': Counter,
  '/tender-type': TenderType,
  '/loyalty-card': LoyaltyCard,
  '/promotions': Promotions,
  '/pos-invoice': POSInvoice,
  '/customer-receipt-payment': CustomerRecieptPayment,
  '/vendor': VendorDirectory,
  '/purchase-requisition': PurchaseRequisition,
  '/purchase-order': PurchaseOrder,
  '/purchase-bill': PurchaseBill,
  '/goods-receipt-note': GoodsRecieptNote,
  '/purchase-credit-note': PurchaseCreditNote,
  '/purchase-debit-note': PurchaseDebitNote,
  '/bill-payment': BillPayment,
  '/purchase-return': PurchaseReturn,
  '/purchase-return-challan': PurchaseReturnChallan,
  '/sales-order': SalseOrder,
  '/dispatch': Dispatch,
  '/estimate': Estimate,
  '/sales-return-challan': SaleReturnChallan,
  //
  '/wishlist': WishlistStockManager,
  '/ecom-products': EcomProductDetail,
  //
  '/opening-stock': OpeningStock,
  '/opening-outstanding-customer': () => (
    <div className="p-10 text-center">
      <h1 className="mb-4 text-3xl font-bold text-[#003f6b] dark:text-white">
        Opening Outstanding Bills - Customer
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        This opening transaction page is under development.
      </p>
    </div>
  ),
  '/opening-outstanding-vendor': () => (
    <div className="p-10 text-center">
      <h1 className="mb-4 text-3xl font-bold text-[#003f6b] dark:text-white">
        Opening Outstanding Bills - Vendor
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        This opening transaction page is under development.
      </p>
    </div>
  ),
  '/opening-financials': () => (
    <div className="p-10 text-center">
      <h1 className="mb-4 text-3xl font-bold text-[#003f6b] dark:text-white">Opening Financials</h1>
      <p className="text-gray-600 dark:text-gray-400">
        This opening transaction page is under development.
      </p>
    </div>
  ),
  '/opening-leaves': () => (
    <div className="p-10 text-center">
      <h1 className="mb-4 text-3xl font-bold text-[#003f6b] dark:text-white">Opening Leaves</h1>
      <p className="text-gray-600 dark:text-gray-400">
        This opening transaction page is under development.
      </p>
    </div>
  ),
  '/opening-stock-barcode': () => (
    <div className="p-10 text-center">
      <h1 className="mb-4 text-3xl font-bold text-[#003f6b] dark:text-white">
        Opening Stock - Barcode
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        This opening transaction page is under development.
      </p>
    </div>
  ),
  '/opening-stock-fixed-asset': () => (
    <div className="p-10 text-center">
      <h1 className="mb-4 text-3xl font-bold text-[#003f6b] dark:text-white">
        Opening Stock - Fixed Asset
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        This opening transaction page is under development.
      </p>
    </div>
  ),
  '/opening-pos-customer': () => (
    <div className="p-10 text-center">
      <h1 className="mb-4 text-3xl font-bold text-[#003f6b] dark:text-white">
        Opening POS Customer
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        This opening transaction page is under development.
      </p>
    </div>
  ),
  //
  '/all-report': ReportDashboard,
  // "/place-holder-page": PlaceholderPage,

  // SPREAD ROUTES HERE:
  ...ReportPageRoutes,

  //
  '/fallback': () => (
    <div className="mt-6 rounded-lg bg-gray-100 p-6 text-center shadow dark:bg-gray-800">
      <p className="font-medium text-gray-600 dark:text-gray-300">
        This page is currently not available.
      </p>
    </div>
  ),
};

const LayoutContent: React.FC = () => {
  const { isMobileOpen } = useSidebar();
  const { openTabs, activeTabPath, addTab } = useTabs();

  const fixedSidebarWidthClass = 'lg:ml-[80px]';

  return (
    <>
      <style>
        {`
            .hidden-scrollbar::-webkit-scrollbar {
                display: none;
            }
            .hidden-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `}
      </style>

      <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
        <div className="z-40">
          <AppSidebar addTab={addTab as (item: any) => void} activeTabPath={activeTabPath} />
          <Backdrop />
        </div>

        <div
          className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ease-in-out ${fixedSidebarWidthClass} ${
            isMobileOpen ? 'ml-0' : ''
          }`}>
          <AppHeader />
          <div className="sticky top-0 z-30 flex-shrink-0 bg-gray-100 dark:bg-gray-900">
            <TabBar />
          </div>

          {/* MAIN CONTENT AREA */}
          <main className="hidden-scrollbar flex-grow overflow-y-auto px-5">
            <div className="mx-auto w-full max-w-[1600px] pb-10 pt-0">
              {openTabs.map((tab) => {
                const TabComponent = ComponentMap[tab.path] || ComponentMap['/fallback'];
                return (
                  <div key={tab.path} className={tab.path === activeTabPath ? 'block' : 'hidden'}>
                    <TabComponent />
                  </div>
                );
              })}
            </div>
          </main>

          <footer className="flex-shrink-0">
            <div className="w-full">
              <AppFooter />
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

const AppLayout: React.FC = () => {
  return (
    <TabProvider>
      <LayoutContent />
    </TabProvider>
  );
};

export default AppLayout;
