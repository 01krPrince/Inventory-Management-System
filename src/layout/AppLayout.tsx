import React from "react";
import { TabProvider, useTabs } from "../context/TabContext";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

import { TabBar } from "./TabBar";
import { AppSidebar } from "./AppSidebar";
import Welcome from "../pages/pages/Welcome";
import Customer from "../pages/pages/sales/customer/pages/Customer.tsx";
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

const useSidebar = () => ({
  isExpanded: false,
  isHovered: false,
  isMobileOpen: false,
});
const Backdrop = () => null;

const ComponentMap: { [key: string]: React.FC } = {
  "/welcome": Welcome,
  "/customer": Customer,
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
            <div className="mx-auto max-w-[1600px] w-full pb-10 pt-2">
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
