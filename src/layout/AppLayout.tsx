import React from "react";
import { TabProvider, useTabs } from "../context/TabContext";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

import { TabBar } from "./TabBar";
import { AppSidebar } from "./AppSidebar";
import Welcome from "../pages/pages/Welcome";
import Customer from "../pages/pages/sales/Customer";
import PriceList from "../pages/pages/sales/salePriceList/PriceList";
import PartySalesDiscountRate from "../pages/pages/sales/salePriceList/PartySalesDiscountRate";
import BrandwiseDiscountCharges from "../pages/pages/sales/salePriceList/BrandwiseDiscountCharges";
import PartyBrandwiseDiscountCharges from "../pages/pages/sales/salePriceList/PartyBrandwiseDiscountCharges";
import UpdateListForEachItems from "../pages/pages/sales/salePriceList/UpdateListForEachItems";

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
  "/estimate": () => (
    <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
      🧾 Estimate Generator
    </div>
  ),
  "/calendar": () => (
    <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
      📅 Calendar View Component
    </div>
  ),
  "/profile": () => (
    <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
      ⚙️ User Profile Settings
    </div>
  ),
  "/form-elements": () => (
    <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
      📄 Form Elements View
    </div>
  ),
  "/basic-tables": () => (
    <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
      📊 Basic Tables View
    </div>
  ),
  "/blank": () => (
    <div className="p-6 mt-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
      🔲 Blank Page View
    </div>
  ),
  "/error-404": () => (
    <div className="p-6 mt-6 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-lg">
      ⚠️ 404 Error Page
    </div>
  ),
  "/fallback": () => (
    <div className="p-6 mt-6 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-lg">
      ❗ Component not found for this tab path.
    </div>
  ),
};

const LayoutContent: React.FC = () => {
  const { isMobileOpen } = useSidebar();
  const { openTabs, activeTabPath, addTab } = useTabs();

  // The sidebar width class remains for desktop margin
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

      {/* 1. Main container: full height, flex column for header/tab/footer/content stacking */}
      <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 xl:flex">
        {/* Sidebar and Backdrop are likely already positioned correctly (fixed/absolute) 
            to overlay content, but keeping them here for structural reference. */}
        <div>
          <AppSidebar addTab={addTab} activeTabPath={activeTabPath} />
          <Backdrop />
        </div>

        {/* 2. Content wrapper for main area (header/tabs/scrollable-body/footer) */}
        <div
          className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${fixedSidebarWidthClass} ${
            isMobileOpen ? "ml-0" : ""
          }`}
        >
          {/* Header and TabBar are now fixed at the top of this content wrapper */}
          <AppHeader />
          <TabBar />

          {/* 3. SCROLLABLE CONTENT AREA: 
             - flex-1 ensures it takes up all remaining vertical space.
             - overflow-y-auto enables vertical scrolling for this section only.
             - hidden-scrollbar class applied.
          */}
          <main className="flex-1 overflow-y-auto hidden-scrollbar">
            {/* The padding/margins are inside the scrollable area */}
            <div className="p-4 mx-auto md:p-6">
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

          {/* Footer is fixed at the bottom of the main content wrapper */}
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
