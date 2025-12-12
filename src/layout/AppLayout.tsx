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
// import { CustomCalculator } from "../components/CustomCalculator";

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

  //   Type 'FC<ModalProps>' is not assignable to type 'FC<{}>'.
  //   Property 'onClose' is missing in type '{}' but required in type 'ModalProps'.ts(2322)
  // InterBranchTransfer.tsx(12, 3): 'onClose' is declared here.
  // AppLayout.tsx(30, 23): The expected type comes from this index signature.
  // (property) "/inter-branch-transfer": React.FC<ModalProps>

  "/attendance": () => <></>,
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

  const fixedSidebarWidthClass = "lg:ml-[110px]";

  return (
    <>
      <style>
        {`
            /* ... your hidden-scrollbar CSS ... */
            .hidden-scrollbar::-webkit-scrollbar {
                display: none;
            }
            .hidden-scrollbar {
                -ms-overflow-style: none; /* IE and Edge */
                scrollbar-width: none; /* Firefox */
            }
        `}
      </style>

      <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 xl:flex">
        <div>
          <AppSidebar
            addTab={addTab as (item: any) => void}
            activeTabPath={activeTabPath}
          />
          <Backdrop />
        </div>

        <div
          className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${fixedSidebarWidthClass} ${
            isMobileOpen ? "ml-0" : ""
          }`}
        >
          <AppHeader />
          <TabBar />

          <main className="flex-1 overflow-y-auto hidden-scrollbar px-5">
            <div className="">
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

          <AppFooter />
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
