import React, { useState, useEffect, useMemo } from 'react';
import {
  Printer,
  Loader2,
  Search,
  ChevronDown,
  ChevronRight,
  Filter,
  Download as DownloadIcon,
} from 'lucide-react';
import purchaseBillService from '../../../../../services/purchase/purchaseBill';
import { handlePrint } from '../../../../../components/function/functions';
import { COLORS } from '../../../../../constants/colors';

// --- CONFIGURATION: UPDATE WIDTHS HERE ---
const COLUMN_WIDTHS = {
  index: 45,
  billNo: 90,
  date: 90,
  refNo: 90,
  refDate: 90,
  vendor: 200,
  partyCode: 100,
  billAmt: 90,
  itemName: 200,
  code: 90,
  subItem: 100,
  hsn: 90,
  packQty: 40,
  unit: 40,
  qty: 40,
  rate: 90,
  amount: 110,
  taxCode: 40,
  taxable: 100,
  taxRate: 50,
  taxAmt: 110,
  cgst: 40,
  sgst: 40,
  igst: 40,
  roundOff: 60,
};

const PurchaseBillReport = () => {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedStores, setCollapsedStores] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await purchaseBillService.getAllPurchaseBills();
      setBills(response && response.success && Array.isArray(response.data) ? response.data : []);
    } catch {
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  const groupedData = useMemo(() => {
    let filtered = bills.filter((b) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        [b.billNo, b.vendor, b.store, b.ref_no].some((val) =>
          String(val || '')
            .toLowerCase()
            .includes(searchLower)
        ) || b.items.some((item: any) => item.description.toLowerCase().includes(searchLower))
      );
    });
    const groups: Record<string, any[]> = {};
    filtered.forEach((bill) => {
      const storeName = bill.store || 'General Store';
      if (!groups[storeName]) groups[storeName] = [];
      groups[storeName].push(bill);
    });
    return groups;
  }, [bills, searchTerm]);

  const formatCurrency = (val: number) =>
    val !== undefined ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00';

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );

  return (
    <div
      className="flex flex-col overflow-hidden rounded-sm border shadow-lg"
      style={{ borderColor: COLORS.border, backgroundColor: COLORS.background }}>
      {/* Action Bar */}
      <div
        className="flex items-center justify-between border-b bg-white p-2"
        style={{ borderColor: COLORS.border }}>
        <div className="flex items-center gap-1">
          <div
            className="flex min-w-[140px] items-center rounded-sm border bg-white px-2 py-1"
            style={{ borderColor: COLORS.border }}>
            <span className="mr-2 text-xs text-gray-400">•••</span>
            <span className="text-xs" style={{ color: COLORS.textPrimary }}>
              Detailed Register
            </span>
            <ChevronDown size={14} className="ml-auto" style={{ color: COLORS.textSecondary }} />
          </div>
          <button
            onClick={fetchData}
            className="custom-primary-btn rounded-sm px-3 py-1 text-[10px] font-bold uppercase text-white shadow-sm">
            Refresh
          </button>
          <button className="custom-primary-btn flex items-center gap-1 rounded-sm px-3 py-1 text-[10px] font-bold uppercase text-white">
            <Filter size={12} /> Filter
          </button>
          <button
            onClick={() => handlePrint('purchase-report-table', 'Detailed Purchase Register')}
            className="custom-primary-btn flex items-center gap-1 rounded-sm px-3 py-1 text-[10px] font-bold uppercase text-white">
            <Printer size={12} /> Print
          </button>
          <div className="flex overflow-hidden rounded-sm shadow-sm">
            <button className="custom-primary-btn flex items-center gap-1 border-r border-black/10 px-3 py-1 text-[10px] font-bold uppercase text-white">
              <DownloadIcon size={12} /> Export
            </button>
            <button className="custom-primary-btn px-1 py-1 text-white">
              <ChevronDown size={12} />
            </button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2 text-gray-400" size={13} />
          <input
            type="text"
            placeholder="Search all fields..."
            className="shadow-inner w-80 rounded-sm border py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-blue-400"
            style={{ borderColor: COLORS.border, color: COLORS.textPrimary }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-auto bg-white" style={{ height: '75vh' }}>
        {/* Changed table-fixed to table-auto to allow minWidths to take effect */}
        <table
          className="w-full table-auto border-separate border-spacing-0"
          id="purchase-report-table">
          <thead
            className="sticky top-0 z-30 text-white"
            style={{ backgroundColor: COLORS.primary }}>
            {/* Category Row */}
            <tr className="h-6 text-[10px] uppercase italic tracking-wider opacity-85">
              <th
                className="sticky left-0 z-50 border-r"
                style={{
                  backgroundColor: COLORS.primary,
                  minWidth: COLUMN_WIDTHS.index,
                  width: COLUMN_WIDTHS.index,
                }}></th>
              <th
                className="sticky z-50 border-r"
                style={{
                  backgroundColor: COLORS.primary,
                  left: COLUMN_WIDTHS.index,
                  minWidth: COLUMN_WIDTHS.billNo,
                  width: COLUMN_WIDTHS.billNo,
                }}></th>
              <th colSpan={6} className="border-r pl-3 text-left">
                Voucher Info
              </th>
              <th colSpan={6} className="border-r pl-3 text-left">
                Item Details
              </th>
              <th colSpan={10} className="pl-3 text-left">
                Summary & Taxes
              </th>
            </tr>

            {/* Header Row */}
            <tr className="h-7 text-center text-[10px] font-semibold uppercase">
              <th
                className="sticky left-0 z-50 border-r"
                style={{ backgroundColor: COLORS.primary, minWidth: COLUMN_WIDTHS.index }}>
                #
              </th>
              <th
                className="sticky z-50 border-r px-2 text-left shadow-[1px_0_0_rgba(0,0,0,0.1)]"
                style={{
                  backgroundColor: COLORS.primary,
                  left: COLUMN_WIDTHS.index,
                  minWidth: COLUMN_WIDTHS.billNo,
                }}>
                Bill No
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.date }} className="border-r px-2 text-left">
                Date
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.refNo }} className="border-r px-2 text-left">
                Ref. No
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.refDate }} className="border-r px-2 text-left">
                Ref. Date
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.vendor }} className="border-r px-2 text-left">
                Vendor
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.partyCode }} className="border-r px-2 text-left">
                Party Code
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.billAmt }} className="border-r px-2 text-right">
                Bill Amt (₹)
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.itemName }} className="border-r px-2 text-left">
                Item Name
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.code }} className="border-r px-2 text-left">
                Code
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.subItem }} className="border-r px-2 text-left">
                Sub_Item
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.hsn }} className="border-r px-2 text-left">
                HSN Code
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.packQty }} className="border-r px-2 text-center">
                Pack Qty
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.unit }} className="border-r px-2 text-center">
                Unit
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.qty }} className="border-r px-2 text-right">
                Qty
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.rate }} className="border-r px-2 text-right">
                Rate
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.amount }} className="border-r px-2 text-right">
                Amount (₹)
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.taxCode }} className="border-r px-2 text-left">
                Tax Code
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.taxable }} className="border-r px-2 text-right">
                Taxable
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.taxRate }} className="border-r px-2 text-right">
                Tax %
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.taxAmt }} className="border-r px-2 text-right">
                Tax Amt
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.cgst }} className="border-r px-2 text-right">
                CGST
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.sgst }} className="border-r px-2 text-right">
                SGST
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.igst }} className="border-r px-2 text-right">
                IGST
              </th>
              <th style={{ minWidth: COLUMN_WIDTHS.roundOff }} className="px-2 text-right">
                Round Off
              </th>
            </tr>
          </thead>

          <tbody className="text-[11px]">
            {Object.entries(groupedData).map(([storeName, storeBills]) => {
              const isStoreCollapsed = collapsedStores[storeName];
              return (
                <React.Fragment key={storeName}>
                  <tr
                    className="sticky top-[33px] z-20 cursor-pointer"
                    style={{
                      backgroundColor: COLORS.background,
                      borderBottom: `1px solid ${COLORS.border}`,
                    }}
                    onClick={() =>
                      setCollapsedStores((prev) => ({ ...prev, [storeName]: !isStoreCollapsed }))
                    }>
                    <td
                      className="sticky left-0 z-20 border-r p-2 text-center"
                      style={{ backgroundColor: COLORS.background, borderColor: COLORS.border }}>
                      {isStoreCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                    </td>
                    <td colSpan={24} className="p-2 font-bold uppercase text-blue-900">
                      Store Name: {storeName}{' '}
                      <span className="ml-4 font-normal italic text-gray-500">
                        ({storeBills.length} Bills)
                      </span>
                    </td>
                  </tr>

                  {!isStoreCollapsed &&
                    storeBills.map((bill, bIdx) => (
                      <React.Fragment key={bill._id}>
                        {bill.items.map((item: any, iIdx: number) => (
                          <tr
                            key={`${bill._id}-${iIdx}`}
                            className="custom-row h-7 border-b text-[11px] hover:bg-gray-50">
                            <td
                              className="sticky left-0 z-10 border-r bg-white text-center font-mono text-gray-400"
                              style={{ borderColor: COLORS.border, minWidth: COLUMN_WIDTHS.index }}>
                              {bIdx + 1}.{iIdx + 1}
                            </td>
                            <td
                              className="sticky z-10 border-r bg-white px-2 font-bold text-blue-600 shadow-[1px_0_0_rgba(0,0,0,0.05)]"
                              style={{
                                borderColor: COLORS.border,
                                left: COLUMN_WIDTHS.index,
                                minWidth: COLUMN_WIDTHS.billNo,
                              }}>
                              {iIdx === 0 ? bill.billNo : ''}
                            </td>
                            <td
                              className="border-r px-2 text-gray-500"
                              style={{ minWidth: COLUMN_WIDTHS.date }}>
                              {iIdx === 0
                                ? new Date(bill.billDate).toLocaleDateString('en-GB')
                                : ''}
                            </td>
                            <td
                              className="border-r px-2 text-gray-400"
                              style={{ minWidth: COLUMN_WIDTHS.refNo }}>
                              {iIdx === 0 ? bill.ref_no || 'N/A' : ''}
                            </td>
                            <td
                              className="border-r px-2 text-gray-400"
                              style={{ minWidth: COLUMN_WIDTHS.refDate }}>
                              {iIdx === 0
                                ? bill.ref_date
                                  ? new Date(bill.ref_date).toLocaleDateString('en-GB')
                                  : 'N/A'
                                : ''}
                            </td>
                            <td
                              className="truncate border-r px-2"
                              style={{
                                minWidth: COLUMN_WIDTHS.vendor,
                                maxWidth: COLUMN_WIDTHS.vendor,
                              }}>
                              {iIdx === 0 ? bill.vendor : ''}
                            </td>
                            <td
                              className="border-r px-2 text-gray-400"
                              style={{ minWidth: COLUMN_WIDTHS.partyCode }}>
                              N/A
                            </td>
                            <td
                              className="border-r px-2 text-right font-bold text-gray-700"
                              style={{ minWidth: COLUMN_WIDTHS.billAmt }}>
                              {iIdx === 0 ? formatCurrency(bill.total_bill_amount) : ''}
                            </td>
                            <td
                              className="border-r px-2 font-medium"
                              style={{ minWidth: COLUMN_WIDTHS.itemName }}>
                              {item.description}
                            </td>
                            <td
                              className="border-r px-2 font-mono text-gray-500"
                              style={{ minWidth: COLUMN_WIDTHS.code }}>
                              {item.itemcode}
                            </td>
                            <td
                              className="border-r px-2 italic text-gray-400"
                              style={{ minWidth: COLUMN_WIDTHS.subItem }}>
                              N/A
                            </td>
                            <td
                              className="border-r px-2 font-mono"
                              style={{ minWidth: COLUMN_WIDTHS.hsn }}>
                              {item.hsn_code || 'N/A'}
                            </td>
                            <td
                              className="border-r px-2 text-center"
                              style={{ minWidth: COLUMN_WIDTHS.packQty }}>
                              {item.pack_qty || 0}
                            </td>
                            <td
                              className="border-r px-2 text-center font-bold text-gray-400"
                              style={{ minWidth: COLUMN_WIDTHS.unit }}>
                              {item.unit}
                            </td>
                            <td
                              className="border-r px-2 text-right font-bold"
                              style={{ minWidth: COLUMN_WIDTHS.qty }}>
                              {item.quantity}
                            </td>
                            <td
                              className="border-r px-2 text-right text-gray-500"
                              style={{ minWidth: COLUMN_WIDTHS.rate }}>
                              {formatCurrency(item.rate)}
                            </td>
                            <td
                              className="border-r px-2 text-right font-bold"
                              style={{ minWidth: COLUMN_WIDTHS.amount }}>
                              {formatCurrency(item.amount)}
                            </td>
                            <td
                              className="border-r px-2 text-[10px] text-gray-500"
                              style={{ minWidth: COLUMN_WIDTHS.taxCode }}>
                              {item.tax_code || 'N/A'}
                            </td>
                            <td
                              className="border-r px-2 text-right"
                              style={{ minWidth: COLUMN_WIDTHS.taxable }}>
                              {formatCurrency(item.taxable_amount)}
                            </td>
                            <td
                              className="border-r px-2 text-right font-bold text-gray-600"
                              style={{ minWidth: COLUMN_WIDTHS.taxRate }}>
                              {item.tax_rate}%
                            </td>
                            <td
                              className="border-r px-2 text-right font-bold text-red-600"
                              style={{ minWidth: COLUMN_WIDTHS.taxAmt }}>
                              {formatCurrency(item.tax_amount)}
                            </td>
                            <td
                              className="border-r px-2 text-right"
                              style={{ minWidth: COLUMN_WIDTHS.cgst }}>
                              {formatCurrency(item.cgst_amount)}
                            </td>
                            <td
                              className="border-r px-2 text-right"
                              style={{ minWidth: COLUMN_WIDTHS.sgst }}>
                              {formatCurrency(item.sgst_amount)}
                            </td>
                            <td
                              className="border-r px-2 text-right"
                              style={{ minWidth: COLUMN_WIDTHS.igst }}>
                              {formatCurrency(item.igst_amount)}
                            </td>
                            <td
                              className="px-2 text-right text-gray-400"
                              style={{ minWidth: COLUMN_WIDTHS.roundOff }}>
                              0.00
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between border-t bg-gray-50 px-3 py-2 text-[9px] font-bold uppercase"
        style={{ borderColor: COLORS.border }}>
        <div style={{ color: COLORS.textSecondary }}>Report: Detailed Purchase Register</div>
        <div className="font-bold text-blue-700"></div>
      </div>

      <style>{`
        .custom-primary-btn { background-color: ${COLORS.primary}; transition: all 0.2s; border: none; cursor: pointer; }
        .custom-primary-btn:hover { background-color: ${COLORS.primaryHover}; }
        .custom-row:hover { background-color: ${COLORS.background} !important; }
      `}</style>
    </div>
  );
};

export default PurchaseBillReport;
