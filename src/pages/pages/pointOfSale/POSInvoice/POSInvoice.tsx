import React, { useState } from 'react';
import POSInvoiceHeader, { InvoiceTab } from './POSInvoiceHeader';
import POSInvoideForm from './POSInvoiceForm';
import OrderTable from './OrderTable';
import POSInvoiceFooter from './POSInvoiceFooter';
import { COLORS } from '../../../../constants/colors';
import { v4 as uuidv4 } from 'uuid';
import LedgerAttributes from '../../../../components/LedgerAttributes';

interface RowData {
  [key: string]: string | number;
}

const POSInvoice: React.FC = () => {
  const [tabs, setTabs] = useState<InvoiceTab[]>([
    {
      id: '1',
      name: 'Invoice #1',
      data: { rows: [], tableData: {} },
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('1');
  const [lastClosedTab, setLastClosedTab] = useState<InvoiceTab | null>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) ||
    tabs[0] || {
      id: 'fallback',
      name: 'Fallback',
      data: { rows: [], tableData: {} },
    };

  const updateActiveTabData = (
    updater: (prevData: { rows: string[]; tableData: Record<string, RowData> }) => {
      rows: string[];
      tableData: Record<string, RowData>;
    }
  ) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTabId) {
          return { ...tab, data: updater(tab.data) };
        }
        return tab;
      })
    );
  };

  const handleNewTab = () => {
    const newId = uuidv4();
    const newTab: InvoiceTab = {
      id: newId,
      name: `Invoice #${tabs.length + 1}`,
      data: { rows: [], tableData: {} },
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };

  const handleCopyTab = () => {
    if (!activeTab) return;
    const newId = uuidv4();
    const newTab: InvoiceTab = {
      id: newId,
      name: `${activeTab.name} (Copy)`,
      data: JSON.parse(JSON.stringify(activeTab.data)),
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };

  const handleResetTab = () => {
    if (window.confirm('Are you sure you want to clear the current invoice?')) {
      updateActiveTabData(() => ({ rows: [], tableData: {} }));
    }
  };

  const handleDeleteTab = () => {
    handleCloseSpecificTab(null, activeTabId);
  };

  const handleCloseSpecificTab = (e: React.MouseEvent | null, idToClose: string) => {
    if (e) e.stopPropagation();

    if (tabs.length === 1) {
      const resetTab = { ...tabs[0], data: { rows: [], tableData: {} } };
      setTabs([resetTab]);
      return;
    }

    const tabToClose = tabs.find((t) => t.id === idToClose);
    if (tabToClose) setLastClosedTab(tabToClose);

    const newTabs = tabs.filter((t) => t.id !== idToClose);
    setTabs(newTabs);

    if (idToClose === activeTabId) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const handleRestoreTab = () => {
    if (!lastClosedTab) return;
    setTabs([...tabs, lastClosedTab]);
    setActiveTabId(lastClosedTab.id);
    setLastClosedTab(null);
  };

  const setRowsWrapper = (val: string[] | ((prev: string[]) => string[])) => {
    updateActiveTabData((prevData) => {
      const newRows = typeof val === 'function' ? val(prevData.rows) : val;
      return { ...prevData, rows: newRows };
    });
  };

  const setTableDataWrapper = (
    val: Record<string, RowData> | ((prev: Record<string, RowData>) => Record<string, RowData>)
  ) => {
    updateActiveTabData((prevData) => {
      const newData = typeof val === 'function' ? val(prevData.tableData) : val;
      return { ...prevData, tableData: newData };
    });
  };

  return (
    <div
      style={{ backgroundColor: COLORS.background }}
      className="flex min-h-screen flex-col overflow-hidden">
      <POSInvoiceHeader
        tabs={tabs}
        activeTabId={activeTabId}
        onNewTab={handleNewTab}
        onCopyTab={handleCopyTab}
        onDeleteTab={handleDeleteTab}
        onRestoreTab={handleRestoreTab}
        onResetTab={handleResetTab}
        onSwitchTab={setActiveTabId}
        onCloseSpecificTab={handleCloseSpecificTab}
      />

      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
          <POSInvoideForm />

          <OrderTable
            rows={activeTab.data.rows}
            setRows={setRowsWrapper}
            tableData={activeTab.data.tableData}
            setTableData={setTableDataWrapper}
          />

          <POSInvoiceFooter />

          <LedgerAttributes />
        </div>
      </div>
    </div>
  );
};

export default POSInvoice;
