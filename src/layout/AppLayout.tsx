import React from "react";
import { TabProvider, useTabs } from "../context/TabContext";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import { TabBar } from "./TabBar";
import { AppSidebar } from "./AppSidebar";
import Welcome from "../pages/pages/Welcome";
// ... (Keep all your existing imports) ...
import PriceList from "../pages/pages/sales/salesPriceList/PriceList";
import PartySalesDiscountRate from "../pages/pages/sales/salesPriceList/PartySalesDiscountRate";
import BrandwiseDiscountCharges from "../pages/pages/sales/salesPriceList/BrandwiseDiscountCharges";
import PartyBrandwiseDiscountCharges from "../pages/pages/sales/salesPriceList/PartyBrandwiseDiscountCharges";
import UpdateListForEachItems from "../pages/pages/sales/salesPriceList/UpdateListForEachItems";
import UpdateBarcodeRate from "../pages/pages/sales/salesPriceList/UpdateBarcodeRate";
import SalesInvoice from "../pages/pages/sales/salesInvoice/SalseInvoice";
import ItemMaster from "../pages/pages/inventory/itemMaster/pages/ItemMaster";
import StockAdjustment from "../pages/pages/inventory/stockAdjustment/StockAdjustment";
import InterBranchTransfer from "../pages/pages/inventory/interBranchTransfer/InterBranchTransfer.tsx";
import MaterialIssueForJobWork from "../pages/pages/inventory/JobWorkOutward/MaterialIssueForJobWork/MaterialIssueForJobWork.tsx";
import ParentTableComponent from "../components/ParentTableComponent.tsx";
import POSOrder from "../pages/pages/pointOfSale/POSOrder/POSOrder.tsx";
import POSCustomer from "../pages/pages/pointOfSale/POSMaster/POSCustomer/POSCustomer.tsx";
import POSCoupon from "../pages/pages/pointOfSale/POSMaster/POSCoupon/POSCoupon.tsx";
import Counter from "../pages/pages/pointOfSale/POSMaster/Counter/Counter.tsx";
import TenderType from "../pages/pages/pointOfSale/POSMaster/TenderType/TenderType.tsx";
import LoyaltyCard from "../pages/pages/pointOfSale/POSMaster/LoyelityCard/LoyelityCard.tsx";
import Promotions from "../pages/pages/pointOfSale/POSMaster/Promotions/Promotions.tsx";
import POSInvoice from "../pages/pages/pointOfSale/POSInvoice/POSInvoice.tsx";
import CustomerRecieptPayment from "../pages/pages/pointOfSale/CustomerRecieptPayment/CustomerRecieptPayment.tsx";
import VendorDirectory from "../pages/pages/purchase/vendor/pages/Vendor.tsx";
import PurchaseRequisition from "../pages/pages/purchase/purchaseRequisition/PurchaseRequisition.tsx";
import PurchaseOrder from "../pages/pages/purchase/purchaseOrder/PurchaseOrder.tsx";
import PurchaseBill from "../pages/pages/purchase/purchaseBill/PurchaseBill.tsx";
import GoodsRecieptNote from "../pages/pages/purchase/goodsRecieptNote/GoodsRecieptNote.tsx";
import PurchaseCreditNote from "../pages/pages/purchase/purchaseCreditNote/PurchaseCreditNote.tsx";
import PurchaseDebitNote from "../pages/pages/purchase/purchaseDebitNote/PurchaseDebitNote.tsx";
import BillPayment from "../pages/pages/purchase/billPayment/BillPayment.tsx";
import PurchaseReturn from "../pages/pages/purchase/purchaseReturn/PurchaseReturn.tsx";
import PurchaseReturnChallan from "../pages/pages/purchase/purchaseReturnChallan/PurchaseReturnChallan.tsx";
import SalseOrder from "../pages/pages/sales/salesOrder/SalseOrder.tsx";
import Dispatch from "../pages/pages/sales/dispatch/Dispatch.tsx";
import Estimate from "../pages/pages/sales/estimate/Estimate.tsx";
import SaleReturnChallan from "../pages/pages/sales/saleReturnChallan/SaleReturnChallan.tsx";
import OpeningStock from "../pages/pages/header/openingTransaction/OpeningStock.tsx";
import CustomerDirectory from "../pages/pages/sales/customer/Customer.tsx";
import EcomProductDetail from "../pages/pages/e-commerce/EcommerceProductDetail.tsx";
import WishlistStockManager from "../pages/pages/e-commerce/WishlistManager.tsx";
import ReportDashboard from "../pages/pages/report/ReportDashboard.tsx";

import PlaceholderPage from "../pages/pages/report/PlaceholderPage";
import CustomerReport from "../pages/pages/report/reportPages/CustomerReport.tsx";
import VendorReport from "../pages/pages/report/reportPages/VendorReport.tsx";
import PurchaseBillReport from "../pages/pages/report/reportPages/PurchaseBillReport.tsx";
import ItemReport from "../pages/pages/report/reportPages/ItemReport.tsx";
import GstMasterReport from "../pages/pages/report/reportPages/GstMasterReport.tsx";

const useSidebar = () => ({
  isExpanded: false,
  isHovered: false,
  isMobileOpen: false,
});
const Backdrop = () => null;

const ReportPageRoutes: { [key: string]: React.FC } = {
  // MIS
  "/report/financial-statements": () => (
    <PlaceholderPage title="Financial Statements" />
  ),
  "/report/financial-analysis": () => (
    <PlaceholderPage title="Financial Analysis" />
  ),
  "/report/stock-analysis": () => <PlaceholderPage title="Stock Analysis" />,
  "/report/sales-analysis": () => <PlaceholderPage title="Sales Analysis" />,
  "/report/purchase-analysis": () => (
    <PlaceholderPage title="Purchase Analysis" />
  ),
  "/report/enterprise-analysis": () => (
    <PlaceholderPage title="Enterprise Analysis" />
  ),

  // Finance
  "/report/primary-books": () => <PlaceholderPage title="Primary Books" />,
  "/report/ledgers": () => <PlaceholderPage title="Ledgers" />,
  "/report/trial-balance-finance": () => (
    <PlaceholderPage title="Trial Balance" />
  ),
  "/report/attribute-reports": () => (
    <PlaceholderPage title="Attribute Reports" />
  ),
  "/report/loan-bank-interest": () => (
    <PlaceholderPage title="Loan-Bank Interest" />
  ),

  // Sales
  "/report/customers": CustomerReport,
  "/report/sale-invoice": () => <PlaceholderPage title="Sale Invoice Report" />,
  "/report/sales-report": () => <PlaceholderPage title="Sales Report" />,
  "/report/sales-ledgers": () => (
    <PlaceholderPage title="Sales Ledgers & Trials" />
  ),
  "/report/sales-bills-os": () => <PlaceholderPage title="Sales Bills O/S" />,
  "/report/sales-linkage": () => (
    <PlaceholderPage title="Sales Linkage Reports" />
  ),

  // Purchase
  "/report/vendors": VendorReport,
  "/report/purchase-bill": PurchaseBillReport,
  "/report/purchase-registers": () => (
    <PlaceholderPage title="Purchase Registers" />
  ),
  "/report/purchase-trial-ledgers": () => (
    <PlaceholderPage title="Purchase Trial/Ledgers" />
  ),
  "/report/vendor-bills-os": () => <PlaceholderPage title="Vendor Bills O/S" />,
  "/report/purchase-linkage": () => (
    <PlaceholderPage title="Purchase Linkage Reports" />
  ),

  // Inventory
  "/report/available-item": ItemReport,
  "/report/stock-adjustment": () => (
    <PlaceholderPage title="Stock Adjustment Report" />
  ),
  "/report/primary-stock": () => (
    <PlaceholderPage title="Primary Stock Reports" />
  ),
  "/report/store-transfer": () => <PlaceholderPage title="Store Transfer" />,
  "/report/job-work-reports": () => (
    <PlaceholderPage title="Job Work Reports" />
  ),
  "/report/serial-imei": () => <PlaceholderPage title="Serial/IMEI Reports" />,
  "/report/barcode-reports": () => <PlaceholderPage title="Barcode Reports" />,
  "/report/pharma-batch": () => (
    <PlaceholderPage title="Pharma/Batch Reports" />
  ),

  // GST
  "/report/gst-master": GstMasterReport,
  "/report/gst-returns": () => <PlaceholderPage title="GST Returns" />,
  "/report/gstr-reco": () => (
    <PlaceholderPage title="GSTR 2A/2B Reconciliation" />
  ),
  "/report/uae-vat": () => <PlaceholderPage title="UAE VAT Returns" />,
  "/report/tax-register-sales": () => (
    <PlaceholderPage title="Tax Register Sales" />
  ),
  "/report/tax-register-purchase": () => (
    <PlaceholderPage title="Tax Register Purchase" />
  ),

  // Employee
  "/report/employee-register": () => (
    <PlaceholderPage title="Employee Register" />
  ),
  "/report/attendance-leave": () => (
    <PlaceholderPage title="Attendance/Leave Reports" />
  ),
  "/report/salary-timesheet": () => (
    <PlaceholderPage title="Salary/Timesheet Reports" />
  ),
  "/report/esi-pf": () => <PlaceholderPage title="ESI/PF Reports" />,

  // POS
  "/report/pos-customer-list": () => (
    <PlaceholderPage title="POS Customer List" />
  ),
  "/report/pos-order-register": () => (
    <PlaceholderPage title="POS Order Register" />
  ),
  "/report/pos-sales-register": () => (
    <PlaceholderPage title="POS Sales Register" />
  ),
  "/report/pos-sales-summary": () => (
    <PlaceholderPage title="POS Sales Summary" />
  ),
  "/report/pos-tender-wise": () => (
    <PlaceholderPage title="POS Sales Tender Wise" />
  ),

  // Production
  "/report/production-register": () => (
    <PlaceholderPage title="Production Register" />
  ),
  "/report/bom-register": () => (
    <PlaceholderPage title="Bill of Material Register" />
  ),
  "/report/de-assembling": () => (
    <PlaceholderPage title="Production De-Assembling" />
  ),
  "/report/issue-request": () => (
    <PlaceholderPage title="Material Issue Request" />
  ),
  "/report/issue-summary": () => (
    <PlaceholderPage title="Material Issue Summary" />
  ),

  // Assets
  "/report/asset-register": () => <PlaceholderPage title="Asset Register" />,
  "/report/asset-transfer": () => (
    <PlaceholderPage title="Asset Transfer Register" />
  ),
  "/report/asset-depreciation": () => (
    <PlaceholderPage title="Asset Depreciation" />
  ),
  "/report/asset-on-hand": () => <PlaceholderPage title="Asset On Hand" />,

  // Audit
  "/report/price-list-change": () => (
    <PlaceholderPage title="Price List Change Track" />
  ),
  "/report/physical-stock": () => (
    <PlaceholderPage title="Physical Stock vs Actual" />
  ),
  "/report/mismatch-report": () => <PlaceholderPage title="Mismatch Report" />,
  "/report/user-geo": () => <PlaceholderPage title="User Geo Tracking" />,
  "/report/logs": () => <PlaceholderPage title="System Logs" />,
};

const ComponentMap: { [key: string]: React.FC } = {
  "/welcome": Welcome,
  "/customer": CustomerDirectory,
  "/price-list": PriceList,
  "/party-sale-discount-rate": PartySalesDiscountRate,
  "/brandwise-discount-charges": BrandwiseDiscountCharges,
  "/party-brandwise-discount-charges": PartyBrandwiseDiscountCharges,
  "/update-price-for-single-item": UpdateListForEachItems,
  "/update-barcode-rate": UpdateBarcodeRate,
  "/sale-invoice": SalesInvoice,
  "/item-master": ItemMaster,
  "/stock-adjustment": StockAdjustment,
  "/inter-branch-transfer": InterBranchTransfer,
  "/material-issue-for-job-work": MaterialIssueForJobWork,
  "/job-work-outward-rate": ParentTableComponent,
  "/pos-order": POSOrder,
  "/pos-customer-master": POSCustomer,
  "/attendance": () => <></>,
  "/pos-coupon-master": POSCoupon,
  "/counter": Counter,
  "/tender-type": TenderType,
  "/loyalty-card": LoyaltyCard,
  "/promotions": Promotions,
  "/pos-invoice": POSInvoice,
  "/customer-receipt-payment": CustomerRecieptPayment,
  "/vendor": VendorDirectory,
  "/purchase-requisition": PurchaseRequisition,
  "/purchase-order": PurchaseOrder,
  "/purchase-bill": PurchaseBill,
  "/goods-receipt-note": GoodsRecieptNote,
  "/purchase-credit-note": PurchaseCreditNote,
  "/purchase-debit-note": PurchaseDebitNote,
  "/bill-payment": BillPayment,
  "/purchase-return": PurchaseReturn,
  "/purchase-return-challan": PurchaseReturnChallan,
  "/sales-order": SalseOrder,
  "/dispatch": Dispatch,
  "/estimate": Estimate,
  "/sales-return-challan": SaleReturnChallan,
  //
  "/wishlist": WishlistStockManager,
  "/ecom-products": EcomProductDetail,
  //
  "/opening-stock": OpeningStock,
  "/opening-outstanding-customer": () => (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-[#003f6b] dark:text-white mb-4">
        Opening Outstanding Bills - Customer
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        This opening transaction page is under development.
      </p>
    </div>
  ),
  "/opening-outstanding-vendor": () => (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-[#003f6b] dark:text-white mb-4">
        Opening Outstanding Bills - Vendor
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        This opening transaction page is under development.
      </p>
    </div>
  ),
  "/opening-financials": () => (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-[#003f6b] dark:text-white mb-4">
        Opening Financials
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        This opening transaction page is under development.
      </p>
    </div>
  ),
  "/opening-leaves": () => (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-[#003f6b] dark:text-white mb-4">
        Opening Leaves
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        This opening transaction page is under development.
      </p>
    </div>
  ),
  "/opening-stock-barcode": () => (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-[#003f6b] dark:text-white mb-4">
        Opening Stock - Barcode
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        This opening transaction page is under development.
      </p>
    </div>
  ),
  "/opening-stock-fixed-asset": () => (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-[#003f6b] dark:text-white mb-4">
        Opening Stock - Fixed Asset
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        This opening transaction page is under development.
      </p>
    </div>
  ),
  "/opening-pos-customer": () => (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-[#003f6b] dark:text-white mb-4">
        Opening POS Customer
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        This opening transaction page is under development.
      </p>
    </div>
  ),
  //
  "/all-report": ReportDashboard,
  // "/place-holder-page": PlaceholderPage,

  // SPREAD ROUTES HERE:
  ...ReportPageRoutes,

  //
  "/fallback": () => (
    <div className="p-6 mt-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow text-center">
      <p className="text-gray-600 dark:text-gray-300 font-medium">
        This page is currently not available.
      </p>
    </div>
  ),
};

const LayoutContent: React.FC = () => {
  const { isMobileOpen } = useSidebar();
  const { openTabs, activeTabPath, addTab } = useTabs();

  const fixedSidebarWidthClass = "lg:ml-[80px]";

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

      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <div className="z-40">
          <AppSidebar
            addTab={addTab as (item: any) => void}
            activeTabPath={activeTabPath}
          />
          <Backdrop />
        </div>

        <div
          className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out ${fixedSidebarWidthClass} ${
            isMobileOpen ? "ml-0" : ""
          }`}
        >
          <AppHeader />
          <div className="sticky top-0 z-30 flex-shrink-0 bg-gray-100 dark:bg-gray-900">
            <TabBar />
          </div>

          {/* MAIN CONTENT AREA */}
          <main className="flex-grow overflow-y-auto hidden-scrollbar px-5">
            <div className="mx-auto max-w-[1600px] w-full pb-10 pt-0">
              {openTabs.map((tab) => {
                const TabComponent =
                  ComponentMap[tab.path] || ComponentMap["/fallback"];
                return (
                  <div
                    key={tab.path}
                    className={tab.path === activeTabPath ? "block" : "hidden"}
                  >
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
