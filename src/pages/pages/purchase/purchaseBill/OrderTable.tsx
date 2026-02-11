import React, {
  useState,
  useRef,
  MouseEvent,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import ReactDOM from 'react-dom';
import {
  Plus,
  X,
  Search,
  Copy,
  FileText,
  BarChart2,
  ScanLine,
  Table,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Settings,
  Check,
  ShieldCheck,
  DollarSign,
  Clock,
  RotateCcw,
  List,
  SlidersHorizontal,
  ChevronsRight,
} from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import ItemWithBalance from '../../../../components/ItemBalance';

import AddNewItem from '../../../../components/addItemMaster/AddNewItem';

import {
  fetchItemsByVendorCode,
  getItemByCodeAndBarcode,
} from '../../inventory/itemMaster/api/itemService';
import { StockUnitData } from '../../../../components/addItemMaster/api/types';
import { fetchStockUnits } from '../../../../components/addItemMaster/api/stockunitservice';
import AttributePanel from '../../../../components/AttributePanel';
import { ItemApiData, NestedObject } from '../../inventory/itemMaster/models/ItemModel';
import PullFromOrderModal from '../../../../components/PullFromOrderModal';

interface Column {
  id: string;
  label: string;
  width: number;
  align: 'left' | 'center' | 'right';
  sticky?: 'left';
  resizable?: boolean;
  visible: boolean;
}

interface OrderTableProps {
  onAnalyze?: (items: any[]) => void;
  vendorCode: string;
  storeCode: string;
  onItemsChange?: (items: RowData[]) => void;
  totalExpense?: number;
}

interface RowData {
  [key: string]: string | number | undefined | null;
}

interface WarrantyOption {
  id: string;
  label: string;
  price: number;
}

export interface OrderTableRef {
  getTableData: () => {
    rows: string[];
    tableData: Record<string, RowData>;
    visibleRows: Array<{ id: string; data: RowData }>;
    vendorCode: string;
  };
  clearTable: () => void;
  // calculateNetRates: (totalExpense: number) => void;
}

const DEFAULT_COLUMNS: Column[] = [
  {
    id: 'sno',
    label: 'SNo',
    width: 40,
    sticky: 'left',
    align: 'center',
    resizable: true,
    visible: true,
  },
  {
    id: 'add',
    label: '',
    width: 35,
    sticky: 'left',
    align: 'center',
    resizable: true,
    visible: true,
  },
  {
    id: 'del',
    label: '',
    width: 35,
    sticky: 'left',
    align: 'center',
    resizable: true,
    visible: true,
  },
  {
    id: 'srch',
    label: '',
    width: 35,
    sticky: 'left',
    align: 'center',
    resizable: true,
    visible: true,
  },
  {
    id: 'copy',
    label: '',
    width: 35,
    sticky: 'left',
    align: 'center',
    resizable: true,
    visible: true,
  },
  {
    id: 'select',
    label: 'Select Item',
    width: 110,
    sticky: 'left',
    align: 'left',
    resizable: true,
    visible: true,
  },
  {
    id: 'desc',
    label: 'Item Name',
    width: 180,
    sticky: 'left',
    align: 'left',
    resizable: true,
    visible: true,
  },
  {
    id: 'warranty',
    label: 'Warranty',
    width: 130,
    align: 'left',
    resizable: true,
    visible: true,
  },
  {
    id: 'attr',
    label: 'Attribute',
    width: 40,
    align: 'center',
    resizable: true,
    visible: true,
  },
  {
    id: 'widg',
    label: 'Widget',
    width: 40,
    align: 'center',
    resizable: true,
    visible: true,
  },
  {
    id: 'batch',
    label: 'Batch',
    width: 45,
    align: 'center',
    resizable: true,
    visible: true,
  },
  {
    id: 'unit',
    label: 'Unit',
    width: 70,
    align: 'left',
    resizable: true,
    visible: true,
  },
  {
    id: 'qty',
    label: 'Quantity',
    width: 80,
    align: 'right',
    resizable: true,
    visible: true,
  },
  {
    id: 'rate',
    label: 'Rate',
    width: 80,
    align: 'right',
    resizable: true,
    visible: true,
  },
  {
    id: 'amount',
    label: 'Amount',
    width: 90,
    align: 'right',
    resizable: true,
    visible: true,
  },
  {
    id: 'taxable',
    label: 'Taxable',
    width: 80,
    align: 'right',
    resizable: true,
    visible: true,
  },
  {
    id: 'taxAmt',
    label: 'Tax Amount',
    width: 80,
    align: 'right',
    resizable: true,
    visible: true,
  },
  {
    id: 'netRate',
    label: 'Net Rate',
    width: 80,
    align: 'left',
    resizable: true,
    visible: true,
  },
  {
    id: 'mrp',
    label: 'MRP',
    width: 80,
    align: 'right',
    resizable: true,
    visible: true,
  },
  {
    id: 'taxCode',
    label: 'Tax Code',
    width: 120,
    align: 'left',
    resizable: true,
    visible: true,
  },
  {
    id: 'taxRate',
    label: 'Tax Rate',
    width: 120,
    align: 'left',
    resizable: true,
    visible: true,
  },
  {
    id: 'remark',
    label: 'Remark',
    width: 120,
    align: 'left',
    resizable: true,
    visible: true,
  },
  {
    id: 'printdesc',
    label: 'Description',
    width: 150,
    align: 'left',
    resizable: true,
    visible: true,
  },
  {
    id: 'barcode',
    label: 'Barcode',
    width: 100,
    align: 'left',
    resizable: true,
    visible: true,
  },
  {
    id: 'brand',
    label: 'Brand',
    width: 100,
    align: 'left',
    resizable: true,
    visible: true,
  },
  {
    id: 'punit',
    label: 'Pack Unit',
    width: 70,
    align: 'left',
    resizable: true,
    visible: false,
  },
  {
    id: 'pqty',
    label: 'Pack Qty',
    width: 70,
    align: 'right',
    resizable: true,
    visible: false,
  },
  // {
  //   id: 'rateper',
  //   label: 'Rate Per',
  //   width: 80,
  //   align: 'left',
  //   resizable: true,
  //   visible: false,
  // },

  {
    id: 'minrate',
    label: 'Min Rate',
    width: 80,
    align: 'right',
    resizable: true,
    visible: false,
  },
  {
    id: 'service',
    label: 'Service Loc',
    width: 100,
    align: 'center',
    resizable: true,
    visible: false,
  },
  {
    id: 'itembarcode',
    label: 'Item Barcode',
    width: 100,
    align: 'left',
    resizable: true,
    visible: false,
  },
  {
    id: 'bdbatchno',
    label: 'BD Batch No',
    width: 90,
    align: 'left',
    resizable: false,
    visible: false,
  },
  {
    id: 'bdexpdate',
    label: 'BD Exp.Date',
    width: 90,
    align: 'left',
    resizable: false,
    visible: false,
  },
  {
    id: 'bdsalerate',
    label: 'BD Sale Rate',
    width: 90,
    align: 'right',
    resizable: false,
    visible: false,
  },
  {
    id: 'itembalance',
    label: 'Item Balance',
    width: 80,
    align: 'right',
    resizable: false,
    visible: false,
  },
  {
    id: 'linelevel',
    label: 'Line Lvl Barcode',
    width: 110,
    align: 'left',
    resizable: false,
    visible: false,
  },
];

const getStandardWarranties = (itemText: string): WarrantyOption[] => {
  if (!itemText) return [];
  const text = itemText.toLowerCase();

  if (text.includes('bat') || text.includes('elec') || text.includes('laptop')) {
    return [
      { id: 'w1', label: '6 Months', price: 0 },
      { id: 'w2', label: '1 Year', price: 500 },
      { id: 'w3', label: '2 Years', price: 1200 },
    ];
  }
  if (text.includes('pad') || text.includes('glove')) {
    return [{ id: 'w4', label: '3 Months Repair', price: 0 }];
  }
  return [];
};

// 1. Calculate Taxable Value (Base)
const calculateRowTaxable = (qty: any, rate: any, gstRate: any): string => {
  const q = parseFloat(String(qty || 0));
  const r = parseFloat(String(rate || 0));
  const g = parseFloat(String(gstRate || 0));
  if (isNaN(q) || isNaN(r)) return '0.00';
  const totalInclusive = q * r;
  return (totalInclusive / (1 + g / 100)).toFixed(2);
};

// 2. Calculate Tax Amount (GST Portion)
const calculateRowTaxAmount = (qty: any, rate: any, gstRate: any): string => {
  const q = parseFloat(String(qty || 0));
  const r = parseFloat(String(rate || 0));
  const g = parseFloat(String(gstRate || 0));
  if (isNaN(q) || isNaN(r)) return '0.00';

  const totalInclusive = q * r;
  const taxable = totalInclusive / (1 + g / 100);

  // Tax = Total - Taxable
  return (totalInclusive - taxable).toFixed(2);
};

const OrderTable = forwardRef<OrderTableRef, OrderTableProps>((props, ref) => {
  // const { vendorCode, storeCode } = props;
  const generateRowId = () => `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const [rows, setRows] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Record<string, RowData>>({});

  const [items, setItems] = useState<ItemApiData[]>([]);
  const [, setStockUnits] = useState<StockUnitData[]>([]);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const [configOpen, setConfigOpen] = useState(false);
  const [isItemBalListOpen, setItemBalListOpen] = useState(false);

  const [configSearch, setConfigSearch] = useState('');

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [popupState, setPopupState] = useState<{
    visible: boolean;
    top: number;
    left: number;
    activeRowId: string | null;
  }>({ visible: false, top: 0, left: 0, activeRowId: null });

  const [warrantyPopup, setWarrantyPopup] = useState<{
    visible: boolean;
    top: number;
    left: number;
    activeRowId: string | null;
    options: WarrantyOption[];
  }>({ visible: false, top: 0, left: 0, activeRowId: null, options: [] });

  const [newWarranty, setNewWarranty] = useState({ duration: '', price: '' });
  const [scanQuery, setScanQuery] = useState('');

  const [attributePanelState, setAttributePanelState] = useState<{
    visible: boolean;
    activeRowId: string | null;
    tempItemData: ItemApiData | null;
  }>({ visible: false, activeRowId: null, tempItemData: null });

  const [addNewItemForm, setAddNewItemForm] = useState(false);

  const handleScanKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && scanQuery.trim()) {
      try {
        const response = await getItemByCodeAndBarcode(scanQuery.trim());
        const data = response?.data;

        let scannedItem: ItemApiData | null = null;

        if (Array.isArray(data)) {
          if (data.length > 0) scannedItem = data[0] as unknown as ItemApiData;
        } else if (data && typeof data === 'object') {
          scannedItem = data as unknown as ItemApiData;
        }

        if (scannedItem) {
          const masterItem = items.find((i) => {
            const codesMatch = i.code === scannedItem!.code;
            const barcodesMatch =
              i.barcode && scannedItem!.barcode && i.barcode === scannedItem!.barcode;

            return codesMatch || barcodesMatch;
          });

          const itemToUse = masterItem || scannedItem;

          addScannedItemToTable(itemToUse);
          setScanQuery('');
        } else {
          alert('Item not found!');
        }
      } catch (err) {
        console.error('Scan error:', err);
        alert('Error fetching item by scan');
      }
    }
  };

  const getStringValue = (val: any): string => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') {
      return val.name || val.item_name || val.code || '';
    }
    return String(val);
  };

  const addScannedItemToTable = (item: ItemApiData) => {
    const rate = parseFloat(String((item.last_purchase_rate || item.purchase_rate) ?? 0));
    const qty = 1;
    const gstRate = item.gstRate || 0;

    const baseData: RowData = {
      reciss: 'Receipt',
      select: item.code ?? '',
      desc: item.name ?? '',
      unit: getName(item.stock_unit),
      itemId: item._id || '',
      hsn: item.gst_classification ?? '',
      taxCode: item.hsn_code,

      qty: String(qty),
      rate: String(rate),
      mrp: String(item.mrp ?? 0),
      amount: (qty * rate).toFixed(2),

      taxable: calculateRowTaxable(qty, rate, gstRate),
      taxAmt: calculateRowTaxAmount(qty, rate, gstRate),

      barcode: item.barcode ?? '',
      printdesc: item.name ?? '',
      brand: getStringValue(item.brand),
      group: getStringValue(item.group),
      netRate: item.netRate || '0',
      gstRate: String(gstRate),
      taxRate: item.hsn_description || '',

      // sale_rate: item.sale_rate || item.last_sales_rate || 0,
      wholesale_rate: item.wholesale_rate || 0,
      dealer_rate: item.dealer_rate || 0,
    };

    let targetRowId: string | null = null;
    for (const rId of rows) {
      const rData = tableData[rId];
      if (!rData || !rData.select) {
        targetRowId = rId;
        break;
      }
    }

    if (targetRowId) {
      setTableData((prev) => ({
        ...prev,
        [targetRowId!]: { ...prev[targetRowId!], ...baseData },
      }));
    } else {
      const newId = generateRowId();
      setRows((prev) => [...prev, newId]);
      setTableData((prev) => ({ ...prev, [newId]: baseData }));
    }
  };

  const { vendorCode, storeCode, totalExpense = 0 } = props; // Destructure totalExpense

  useEffect(() => {
    // Agar table khali hai to kuch mat karo
    if (Object.keys(tableData).length === 0) return;

    // 1. Total Item Value Nikalo
    let totalTableValue = 0;
    Object.values(tableData).forEach((row) => {
      if (row.select) {
        totalTableValue += parseFloat(String(row.amount || 0));
      }
    });

    console.log('🔄 OrderTable Calculation Debug:');
    console.log('Total Expense from Parent:', totalExpense);
    console.log('Total Item Value in Table:', totalTableValue);

    // 2. Expense Ratio Nikalo
    const expenseRatio = totalTableValue > 0 ? totalExpense / totalTableValue : 0;
    console.log('Expense Ratio:', expenseRatio);

    // 3. Sab rows update karo (Par infinite loop se bachne ke liye check lagao)
    let hasChanges = false;
    const nextData = { ...tableData };

    Object.keys(nextData).forEach((key) => {
      const row = nextData[key];
      if (row.select) {
        const currentRate = parseFloat(String(row.rate || 0));

        // FORMULA: Rate + (Rate * Ratio)
        const addedVal = currentRate * expenseRatio;
        const newNetRate = (currentRate + addedVal).toFixed(2);

        // Sirf tab update karo jab value purani value se alag ho
        if (row.netRate !== newNetRate) {
          nextData[key] = {
            ...row,
            netRate: newNetRate,
          };
          hasChanges = true;
        }
      }
    });

    // Agar koi change hua hai to hi state update karo
    if (hasChanges) {
      setTableData(nextData);
    }
  }, [totalExpense, tableData]); // Jab Expense ya Table Data change ho, ye chalega

  useEffect(() => {
    if (rows.length === 0) {
      const initialRows = Array.from({ length: 15 }, () => generateRowId());
      setRows(initialRows);
      const initialData: Record<string, RowData> = {};
      initialRows.forEach((id) => {
        initialData[id] = {
          reciss: 'Receipt',
          qty: 0,
          rate: 0,
          amount: 0,
          warranty: '',
          taxable: 0,
          taxAmount: 0,
        };
      });
      setTableData(initialData);
    }
  }, [rows.length]);

  useEffect(() => {
    loadMasterData();
    console.log('Updating on change, Vendor Id: ' + vendorCode);
  }, [vendorCode]);

  useEffect(() => {
    if (props.onItemsChange) {
      const validItems = rows
        .map((id) => tableData[id])
        .filter((d) => d && d.select && d.select !== '');

      props.onItemsChange(validItems);
    }
  }, [rows, tableData, props.onItemsChange]);

  const loadMasterData = async () => {
    try {
      const itemsData = await fetchItemsByVendorCode(vendorCode);
      if (Array.isArray(itemsData)) {
        setItems(itemsData);

        setTableData((prevData) => {
          const updatedTableData = { ...prevData };
          let hasUpdates = false;

          Object.keys(updatedTableData).forEach((rowId) => {
            const row = updatedTableData[rowId];
            if (row && row.select) {
              const matchedItem = itemsData.find(
                (i) => i.code === row.select || i.barcode === row.barcode
              );

              if (matchedItem) {
                const newRate = String(
                  (matchedItem.last_purchase_rate || matchedItem.purchase_rate) ?? 0
                );
                const newNetRate = matchedItem.netRate || '0';
                const newGstRate = matchedItem.gstRate || '0';
                const currentQty = parseFloat(String(row.qty || 0));

                const newAmount =
                  !isNaN(currentQty) && !isNaN(parseFloat(newRate))
                    ? (currentQty * parseFloat(newRate)).toFixed(2)
                    : '0.00';

                const newTaxable = calculateRowTaxable(currentQty, newRate, newGstRate);
                const newTaxAmt = calculateRowTaxAmount(currentQty, newRate, newGstRate);
                updatedTableData[rowId] = {
                  ...row,
                  rate: newRate,
                  netRate: newNetRate,
                  gstRate: newGstRate,
                  amount: newAmount,
                  taxable: newTaxable,
                  taxAmount: newTaxAmt,
                };
                hasUpdates = true;
              }
            }
          });

          return hasUpdates ? updatedTableData : prevData;
        });
      }
      const unitsData = await fetchStockUnits();
      if (Array.isArray(unitsData)) setStockUnits(unitsData);
    } catch (error) {
      console.error('Failed to load table master data', error);
    }
  };

  const [columns, setColumns] = useState<Column[]>(JSON.parse(JSON.stringify(DEFAULT_COLUMNS)));

  const visibleColumns = useMemo(() => columns.filter((c) => c.visible), [columns]);

  // const getTableData = () => {
  //   const visibleRows = rows
  //     .filter((id) => {
  //       const d = tableData[id];
  //       return d && (d.select || d.desc || Number(d.qty) > 0);
  //     })
  //     .map((id) => ({ id, data: tableData[id] || {} }));

  //   return {
  //     rows,
  //     tableData,
  //     visibleRows,
  //   };
  // };

  useImperativeHandle(ref, () => ({
    getTableData: () => {
      const visibleRows = rows
        .filter((id) => {
          const d = tableData[id];
          return d && (d.select || d.desc || Number(d.qty) > 0);
        })
        .map((id) => ({ id, data: tableData[id] || {} }));

      return {
        rows,
        tableData,
        visibleRows,
        vendorCode: vendorCode,
      };
    },
    clearTable: () => {
      setRows([]);
    },

    // calculateNetRates: (totalExpense: number) => {
    //   setTableData((prev) => {
    //     const newData = { ...prev };

    //     // 1. Calculate Total Item Value (Sum of Taxable Amounts)
    //     let totalItemValue = 0;
    //     Object.values(newData).forEach((row) => {
    //       // Ensure we ignore empty rows
    //       if (row.select) {
    //         totalItemValue += parseFloat(String(row.amount || 0)); // Using Amount (Taxable/Base)
    //       }
    //     });

    //     // 2. Avoid division by zero
    //     if (totalItemValue === 0) return prev;

    //     // 3. Calculate Expense Percentage factor
    //     // Formula: (Expense / TotalValue)
    //     // We don't need *100 here if we multiply directly.
    //     // Example: 1500 / 3540 = 0.4237
    //     const expenseFactor = totalExpense / totalItemValue;

    //     // 4. Update Each Row
    //     Object.keys(newData).forEach((key) => {
    //       const row = newData[key];
    //       if (row.select) {
    //         const currentRate = parseFloat(String(row.rate || 0));

    //         // Logic: Net Rate = Rate + (Rate * Factor)
    //         // Example: 2500 + (2500 * 0.4237) = 3559.25
    //         const addedValue = currentRate * expenseFactor;
    //         const netRate = currentRate + addedValue;

    //         // Update the row
    //         newData[key] = {
    //           ...row,
    //           netRate: netRate.toFixed(2), // Save to netRate column
    //         };
    //       }
    //     });

    //     return newData;
    //   });
    // },
  }));

  const handleResetDefault = () => {
    setColumns(JSON.parse(JSON.stringify(DEFAULT_COLUMNS)));
    setConfigSearch('');
  };

  const handleCloseForm = () => setAddNewItemForm(false);

  const handleFormSuccess = async () => {
    await loadMasterData();
    setAddNewItemForm(false);
  };

  const handleInputChange = (rowId: string, columnId: string, value: string) => {
    setTableData((prev) => {
      const row = prev[rowId] || {};
      const newData = { ...row, [columnId]: value };

      // Get current numbers
      const qty = parseFloat(columnId === 'qty' ? value : String(row.qty || 0));
      const rate = parseFloat(columnId === 'rate' ? value : String(row.rate || 0));
      const amount = parseFloat(columnId === 'amount' ? value : String(row.amount || 0));
      const gst = parseFloat(String(row.gstRate || 0));

      if (columnId === 'qty' || columnId === 'rate') {
        // Standard flow: Qty/Rate change updates Amount
        newData.amount = !isNaN(qty) && !isNaN(rate) ? (qty * rate).toFixed(2) : '0.00';

        const currentRate = columnId === 'rate' ? rate : rate;
        newData.taxable = calculateRowTaxable(qty, currentRate, gst);
        newData.taxAmt = calculateRowTaxAmount(qty, currentRate, gst);
      } else if (columnId === 'amount') {
        // Reverse flow: Amount change updates Rate
        if (!isNaN(amount) && !isNaN(qty) && qty !== 0) {
          const calculatedRate = amount / qty;
          newData.rate = calculatedRate.toFixed(2);

          // Recalculate Taxes based on the new implied rate
          newData.taxable = calculateRowTaxable(qty, calculatedRate, gst);
          newData.taxAmt = calculateRowTaxAmount(qty, calculatedRate, gst);
        }
      } else if (columnId === 'taxable') {
        const newTaxable = parseFloat(value || '0');

        // 1. Calculate Tax Amount based on new Taxable value
        const newTaxAmt = newTaxable * (gst / 100);
        newData.taxAmt = newTaxAmt.toFixed(2);

        // 2. Calculate Total Amount (Taxable + TaxAmt)
        const newTotalAmount = newTaxable + newTaxAmt;
        newData.amount = newTotalAmount.toFixed(2);

        // 3. Back-calculate Rate if Qty exists
        if (!isNaN(qty) && qty !== 0) {
          newData.rate = (newTotalAmount / qty).toFixed(2);
        }
      }

      return { ...prev, [rowId]: newData };
    });
  };

  const handleDeleteRow = (rowIdToDelete: string) => {
    if (rows.length > 15) {
      setRows((prev) => prev.filter((id) => id !== rowIdToDelete));
      setTableData((prev) => {
        const next = { ...prev };
        delete next[rowIdToDelete];
        return next;
      });
    } else {
      setTableData((prev) => ({
        ...prev,
        [rowIdToDelete]: {
          reciss: 'Receipt',
          qty: 0,
          rate: 0,
          amount: 0,
          warranty: '',
          taxable: 0,
          taxamount: 0,
        },
      }));
    }
  };

  const handleAddRow = (afterRowId: string) => {
    const newId = generateRowId();
    const index = rows.indexOf(afterRowId);
    if (index !== -1) {
      const newRows = [...rows];
      newRows.splice(index + 1, 0, newId);
      setRows(newRows);
      setTableData((prev) => ({
        ...prev,
        [newId]: {
          reciss: 'Receipt',
          qty: 0,
          rate: 0,
          amount: 0,
          warranty: '',
          taxable: 0,
          taxamount: 0,
        },
      }));
    }
  };

  const handleCopyRow = (sourceRowId: string) => {
    const sourceData = tableData[sourceRowId];
    if (!sourceData) return;
    let targetRowId: string | null = null;
    const sourceIndex = rows.indexOf(sourceRowId);
    for (let i = sourceIndex + 1; i < rows.length; i++) {
      const rId = rows[i];
      if (!tableData[rId]?.select) {
        targetRowId = rId;
        break;
      }
    }
    if (!targetRowId) {
      targetRowId = generateRowId();
      setRows((prev) => [...prev, targetRowId!]);
    }
    setTableData((prev) => ({ ...prev, [targetRowId!]: { ...sourceData } }));
  };

  const toggleColumnVisibility = (colId: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === colId ? { ...col, visible: !col.visible } : col))
    );
  };

  const handleSelectClick = (e: React.MouseEvent<HTMLDivElement>, rowId: string) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setPopupState({
      visible: true,
      top: rect.bottom,
      left: rect.left,
      activeRowId: rowId,
    });
  };

  const closePopup = () => {
    setPopupState((prev) => ({ ...prev, visible: false, activeRowId: null }));
  };

  const handleItemSelect = (item: ItemApiData) => {
    if (popupState.activeRowId) {
      setAttributePanelState({
        visible: true,
        activeRowId: popupState.activeRowId,
        tempItemData: item,
      });
      setPopupState((prev) => ({ ...prev, visible: false, activeRowId: null }));
    }
  };

  const handleWarrantyClick = (e: React.MouseEvent<HTMLDivElement>, rowId: string) => {
    e.stopPropagation();
    const rowData = tableData[rowId];
    const itemCode = String(rowData?.select || '');
    const selectedItem = items.find((i) => i.code === itemCode);
    let options: WarrantyOption[] = [];

    if (selectedItem && selectedItem.warranty) {
      if (selectedItem.firstyearwarranty) {
        options.push({
          id: 'fw',
          label: selectedItem.firstyearwarranty,
          price: 0,
        });
      }
      if (selectedItem.customWarranty && Array.isArray(selectedItem.customWarranty)) {
        selectedItem.customWarranty.forEach((cw: any, index: number) => {
          options.push({
            id: `cw${index}`,
            label: `${cw.duration} Years`,
            price: parseFloat(cw.price) || 0,
          });
        });
      }
    } else {
      options = getStandardWarranties(String(rowData?.desc || ''));
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setWarrantyPopup({
      visible: true,
      top: rect.bottom,
      left: rect.left,
      activeRowId: rowId,
      options,
    });
    setNewWarranty({ duration: '', price: '' });
  };

  const closeWarrantyPopup = () => {
    setWarrantyPopup((prev) => ({
      ...prev,
      visible: false,
      activeRowId: null,
    }));
  };

  const handleWarrantySelect = (w: WarrantyOption) => {
    if (warrantyPopup.activeRowId) {
      const displayString = w.price > 0 ? `${w.label} (+₹${w.price})` : w.label;
      handleInputChange(warrantyPopup.activeRowId, 'warranty', displayString);
      closeWarrantyPopup();
    }
  };

  const handleAddCustomWarranty = () => {
    if (!newWarranty.duration) return;
    if (warrantyPopup.activeRowId) {
      const price = parseFloat(newWarranty.price) || 0;
      const label = newWarranty.duration;
      const displayString = price > 0 ? `${label} (+₹${price})` : label;
      handleInputChange(warrantyPopup.activeRowId, 'warranty', displayString);
      closeWarrantyPopup();
    }
  };

  const handleAttributeClick = (rowId: string) => {
    const data = tableData[rowId];
    if (data && data.select) {
      const reconstructedItem: any = {
        _id: data.itemId,
        code: data.select,
        name: data.desc,
        stock_unit: data.unit,
        gst_classification: data.hsn,
        brand: data.brand,
        purchase_rate: data.purchase_rate || data.last_purchase_rate,
        mrp: data.mrp,
        barcode: data.barcode,
        hsn_description: data.taxRate,
        gstRate: data.gstRate,
        netRate: data.netRate,
        hsn_code: data.taxCode,
      };
      setAttributePanelState({
        visible: true,
        activeRowId: rowId,
        tempItemData: reconstructedItem,
      });
    }
  };

  const getName = (val?: NestedObject | string | null): string => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val.name || val.item_name || '';
  };

  const handleAttributeSave = (attributeData: Partial<RowData>) => {
    const { activeRowId, tempItemData } = attributePanelState;

    if (!activeRowId || !tempItemData) {
      setAttributePanelState({
        visible: false,
        activeRowId: null,
        tempItemData: null,
      });
      return;
    }

    // Ensure we prioritize the Purchase Rate exactly like the scan method does
    const purchaseRate = parseFloat(
      String((tempItemData.last_purchase_rate || tempItemData.purchase_rate) ?? 0)
    );

    const qty = 1;

    const baseData: RowData = {
      reciss: 'Receipt',
      select: tempItemData.code ?? '',
      desc: tempItemData.name ?? '',
      unit: getName(tempItemData.stock_unit),
      itemId: tempItemData._id || '',
      hsn: tempItemData.gst_classification ?? '',
      taxCode: tempItemData.hsn_code,
      taxRate: tempItemData.hsn_description || '',
      qty: String(qty),
      mrp: String(tempItemData.mrp ?? 0),
      barcode: tempItemData.barcode ?? '',
      printdesc: tempItemData.name ?? '',
      brand: getStringValue(tempItemData.brand),
      netRate: tempItemData.netRate || '0',
      gstRate: tempItemData.gstRate || '0',
      // FORCE the purchase rate here
      rate: String(purchaseRate),
      amount: (qty * purchaseRate).toFixed(2),
      wholesale_rate: tempItemData.wholesale_rate || 0,
      dealer_rate: tempItemData.dealer_rate || 0,
    };

    setTableData((prev) => {
      const existingRow = (prev[activeRowId] ?? {}) as Partial<RowData>;

      // We merge attributeData BUT ensure rate remains the purchaseRate
      // unless you specifically want the user to override it in the panel
      const mergedRow: RowData = {
        ...existingRow,
        ...baseData,
        ...attributeData,
        rate: attributeData.rate || baseData.rate, // Fallback to purchase rate
      };

      const newQty = Number(mergedRow.qty) || 0;
      const newRate = Number(mergedRow.rate) || 0;
      const gst = Number(mergedRow.gstRate) || 0;

      mergedRow.amount = (newQty * newRate).toFixed(2);
      mergedRow.taxable = calculateRowTaxable(newQty, newRate, gst);
      mergedRow.taxAmt = calculateRowTaxAmount(newQty, newRate, gst);

      return { ...prev, [activeRowId]: mergedRow };
    });

    setAttributePanelState({
      visible: false,
      activeRowId: null,
      tempItemData: null,
    });
  };

  const resizingRef = useRef<number | null>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const handleHeaderClick = (columnId: string) => {
    if (
      ['sno', 'add', 'del', 'srch', 'copy', 'attr', 'widg', 'batch', 'reciss'].includes(
        //'warranty'
        columnId
      )
    )
      return;
    setSortConfig((curr) => ({
      key: columnId,
      direction: curr?.key === columnId && curr.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedRowIds = useMemo(() => {
    let sortable = [...rows];
    if (sortConfig) {
      sortable.sort((a, b) => {
        const rowA = tableData[a],
          rowB = tableData[b];
        if (!rowA && !rowB) return 0;
        if (!rowA) return 1;
        if (!rowB) return -1;
        const valA = rowA[sortConfig.key] || '',
          valB = rowB[sortConfig.key] || '';
        return typeof valA === 'string' && typeof valB === 'string'
          ? sortConfig.direction === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA)
          : sortConfig.direction === 'asc'
            ? Number(valA) - Number(valB) || valA < valB
              ? -1
              : 1
            : Number(valB) - Number(valA) || valA > valB
              ? -1
              : 1;
      });
    }
    return sortable;
  }, [rows, tableData, sortConfig]);

  const handleMouseDown = (e: MouseEvent, index: number) => {
    if (!visibleColumns[index].resizable) return;
    e.preventDefault();
    e.stopPropagation();
    resizingRef.current = index;
    startXRef.current = e.clientX;
    startWidthRef.current = visibleColumns[index].width;
    document.addEventListener('mousemove', handleMouseMove as any);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent | globalThis.MouseEvent) => {
    if (resizingRef.current === null) return;
    const colId = visibleColumns[resizingRef.current!].id;
    setColumns((prev) => {
      return prev.map((col) => {
        if (col.id === colId) {
          return {
            ...col,
            width: Math.max(30, startWidthRef.current + (e.clientX - startXRef.current)),
          };
        }
        return col;
      });
    });
  };

  const handleMouseUp = () => {
    resizingRef.current = null;
    document.removeEventListener('mousemove', handleMouseMove as any);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const getStickyLeft = (idx: number) =>
    visibleColumns
      .slice(0, idx)
      .reduce((acc, col) => (col.sticky === 'left' ? acc + col.width : acc), 0);

  const totals = useMemo(() => {
    const sums: Record<string, number> = { qty: 0, amount: 0, mrp: 0 };
    rows.forEach((rowId) => {
      const row = tableData[rowId];
      if (row) {
        const addVal = (field: string) => {
          const val = parseFloat(String(row[field] || '0'));
          if (!isNaN(val)) sums[field] += val;
        };
        addVal('qty');
        addVal('amount');
        addVal('mrp');
      }
    });
    return {
      qty: sums.qty.toFixed(2),
      amount: sums.amount.toFixed(2),
      mrp: sums.mrp.toFixed(2),
    };
  }, [rows, tableData]);

  if (addNewItemForm) {
    return (
      <div className="w-full">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <AddNewItem
            onClose={handleCloseForm}
            onSuccess={handleFormSuccess}
            initialData={undefined}
          />
        </div>
      </div>
    );
  }

  const addMultipleItemsToTable = (newItems: any[]) => {
    setTableData((prevTableData) => {
      const updatedTableData = { ...prevTableData };
      const updatedRows = [...rows];

      // Track which rows are already filled in this specific update cycle
      let currentEmptyRowIdx = 0;

      newItems.forEach((item) => {
        const rate = parseFloat(String(item.last_purchase_rate || item.purchase_rate || 0));
        const qty = item.qty || 1;
        const gstRate = item.gstRate || 0;

        const baseData: RowData = {
          reciss: 'Receipt',
          select: item.code ?? '',
          desc: item.name ?? '',
          unit: getName(item.stock_unit),
          itemId: item._id || '',
          hsn: item.gst_classification ?? '',
          taxCode: item.hsn_code,
          qty: String(qty),
          rate: String(rate),
          mrp: String(item.mrp ?? 0),
          amount: (qty * rate).toFixed(2),
          taxable: calculateRowTaxable(qty, rate, gstRate),
          taxAmt: calculateRowTaxAmount(qty, rate, gstRate),
          barcode: item.barcode ?? '',
          printdesc: item.name ?? '',
          brand: getStringValue(item.brand),
          group: getStringValue(item.group),
          netRate: item.netRate || '0',
          gstRate: String(gstRate),
          taxRate: item.hsn_description || '',

          // sale_rate: item.sale_rate || item.sales_rate || 0,
          wholesale_rate: item.wholesale_rate || 0,
          dealer_rate: item.dealer_rate || 0,
        };

        // Find the next empty row starting from our last known index
        let targetRowId: string | null = null;
        for (let i = currentEmptyRowIdx; i < updatedRows.length; i++) {
          const rId = updatedRows[i];
          if (!updatedTableData[rId] || !updatedTableData[rId].select) {
            targetRowId = rId;
            currentEmptyRowIdx = i + 1; // Move pointer for next item
            break;
          }
        }

        if (targetRowId) {
          updatedTableData[targetRowId] = {
            ...updatedTableData[targetRowId],
            ...baseData,
          };
        } else {
          // No empty rows left? Create a new one
          const newId = generateRowId();
          updatedRows.push(newId);
          updatedTableData[newId] = baseData;
        }
      });

      // Update the row order state
      setRows(updatedRows);

      return updatedTableData;
    });
  };

  const handleItemBalConfirm = (selectedItems: any[]) => {
    // Map the items to the structure expected by the table
    const itemsToAdd = selectedItems.map((item) => ({
      _id: item.code,
      code: item.code,
      name: item.name,
      netRate: item.netRate ?? 0,
      gstRate: item.gstRate ?? 0,
      taxCode: item.taxCode ?? '',
      hsn_description: item.hsn_description ?? '',
      last_purchase_rate: item.last_purchase_rate ?? item.purchase_rate ?? 0,
      stock_unit: item.unit ?? null,
      brand: item.brand ?? null,
      category: item.category ?? null,
      gst_classification: item.hsn_code ?? '',
      // sales_rate: item.last_sales_rate ?? 0,
      purchase_rate: item.last_purchase_rate ?? item.purchase_rate ?? 0,
      mrp: item.mrp ?? 0,
      barcode: item.barcode ?? '',
      qty: item.quantity || 1, // Pass the user-typed quantity
      warranty: false,
      firstyearwarranty: '',
      customWarranty: [],
    }));

    // Call the new bulk add function
    addMultipleItemsToTable(itemsToAdd);

    setItemBalListOpen(false);
  };

  return (
    <div
      className="relative z-0 flex h-auto flex-col overflow-hidden font-sans text-sm"
      style={{ backgroundColor: COLORS.background }}>
      <div
        className="relative z-10 flex flex-none items-center justify-between border-b bg-white p-2"
        style={{ borderColor: COLORS.border }}>
        <div className="flex items-center gap-4">
          <div
            className="flex h-9 w-72 items-center rounded-sm border bg-white"
            style={{ borderColor: COLORS.borderDark }}>
            <div className="flex h-full items-center justify-center border-r bg-gray-50 px-2">
              <ScanLine className="h-6 w-6 text-orange-500" />
            </div>
            <input
              type="text"
              placeholder="Scan"
              className="w-full px-2 text-sm outline-none"
              value={scanQuery}
              onChange={(e) => setScanQuery(e.target.value)}
              onKeyDown={handleScanKeyDown}
              autoFocus
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setItemBalListOpen(true)}
            className="rounded border border-transparent p-1.5 text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-100"
            title="Select multiple items from list for fast billing">
            <List size={18} />
          </button>
          <button
            // onClick={() => setConfigOpen(true)}
            className="rounded border border-transparent p-1.5 text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-100"
            // title="Configure Table Columns"
          >
            <SlidersHorizontal size={18} />
          </button>
          <button
            // onClick={() => setConfigOpen(true)}
            className="rounded border border-transparent p-1.5 text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-100"
            // title="Configure Table Columns"
          >
            <ChevronsRight size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setConfigOpen(true)}
            className="rounded border border-transparent p-1.5 text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-100"
            title="Configure Table Columns">
            <Settings size={18} />
          </button>
          {/* 
          {props.onAnalyze && (
            <button
              className="flex items-center gap-2 rounded px-6 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:brightness-110"
              style={{ backgroundColor: COLORS.primary }}
              onClick={() => {
                const currentData = getTableData();
                props.onAnalyze!(currentData.visibleRows);
              }}>
              <BarChart2 size={14} />
              Analyze Profit
            </button>
          )} */}
        </div>
      </div>

      <div className="relative z-0 flex flex-1 flex-col p-2">
        <div
          className="relative w-full overflow-hidden border bg-white shadow-sm"
          style={{ borderColor: COLORS.borderDark }}>
          <div className="custom-scrollbar w-full overflow-auto" style={{ height: '400px' }}>
            <div style={{ width: visibleColumns.reduce((a, c) => a + c.width, 0) }}>
              <table className="w-full table-fixed border-collapse">
                <thead className="sticky top-0 z-20">
                  <tr className="h-6">
                    {visibleColumns.map((col, idx) => (
                      <th
                        key={col.id}
                        style={{
                          width: col.width,
                          left: col.sticky === 'left' ? getStickyLeft(idx) : undefined,
                          position: col.sticky === 'left' ? 'sticky' : 'relative',
                          zIndex: col.sticky === 'left' ? 30 : 20,
                          backgroundColor: COLORS.primary,
                          color: 'white',
                          borderColor: COLORS.primaryHover,
                        }}
                        className="group relative cursor-pointer border-r px-1 text-xs font-normal"
                        onClick={() => handleHeaderClick(col.id)}>
                        <div
                          className={`flex h-full w-full items-center ${
                            col.align === 'center' ? 'justify-center' : 'justify-between px-1'
                          }`}>
                          <span className="truncate">{col.label}</span>
                          {sortConfig?.key === col.id &&
                            (sortConfig.direction === 'asc' ? (
                              <ArrowUp size={10} />
                            ) : (
                              <ArrowDown size={10} />
                            ))}
                        </div>
                        {col.resizable && (
                          <div
                            className="absolute bottom-0 right-0 top-0 w-1 cursor-col-resize opacity-0 hover:bg-blue-400 group-hover:opacity-100"
                            onMouseDown={(e) => handleMouseDown(e, idx)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedRowIds.map((rowId, vIdx) => {
                    const rowData = tableData[rowId] || {};
                    return (
                      <tr
                        key={rowId}
                        className="h-6 border-b hover:bg-blue-50"
                        style={{ borderColor: COLORS.border }}>
                        {visibleColumns.map((col, cIdx) => {
                          const isLeft = col.sticky === 'left';
                          let content: React.ReactNode = null;

                          if (col.id === 'sno')
                            content = <span className="text-gray-500">{vIdx + 1}</span>;
                          else if (col.id === 'add')
                            content = (
                              <Plus
                                size={12}
                                className="mx-auto cursor-pointer text-green-600"
                                onClick={() => handleAddRow(rowId)}
                              />
                            );
                          else if (col.id === 'del')
                            content = (
                              <X
                                size={12}
                                className="mx-auto cursor-pointer text-red-500"
                                onClick={() => handleDeleteRow(rowId)}
                              />
                            );
                          else if (col.id === 'srch')
                            content = (
                              <Search size={12} className="mx-auto cursor-pointer text-blue-500" />
                            );
                          else if (col.id === 'copy')
                            content = (
                              <Copy
                                size={12}
                                className="mx-auto cursor-pointer text-orange-400"
                                onClick={() => handleCopyRow(rowId)}
                              />
                            );
                          else if (col.id === 'attr')
                            content = (
                              <FileText
                                size={12}
                                className="mx-auto cursor-pointer text-blue-400"
                                onClick={() => handleAttributeClick(rowId)}
                              />
                            );
                          else if (col.id === 'widg')
                            content = <BarChart2 size={12} className="mx-auto text-blue-400" />;
                          else if (col.id === 'batch')
                            content = <Table size={12} className="mx-auto text-blue-600" />;
                          else if (col.id === 'select') {
                            content = (
                              <div
                                className="flex h-full cursor-pointer items-center justify-between px-1 text-[10px] italic text-gray-400 hover:bg-gray-100"
                                onClick={(e) => handleSelectClick(e, rowId)}>
                                {rowData.select || 'Select...'} <span>▶</span>
                              </div>
                            );
                          } else if (col.id === 'warranty') {
                            const displayValue = rowData.warranty || 'Select';
                            const hasSelection = !!rowData.warranty;
                            content = (
                              <div
                                className="flex h-full w-full cursor-pointer items-center justify-between px-1 text-[10px] text-gray-700 hover:bg-gray-100"
                                onClick={(e) => handleWarrantyClick(e, rowId)}>
                                <span
                                  className={
                                    hasSelection
                                      ? 'font-medium text-blue-700'
                                      : 'italic text-gray-400'
                                  }>
                                  {displayValue}
                                </span>
                                <ChevronDown size={10} className="text-gray-400" />
                              </div>
                            );
                          } else if (col.id === 'amount') {
                            content = (
                              <input
                                type="text"
                                className="h-full w-full bg-transparent px-1 text-right font-medium outline-none"
                                value={rowData[col.id] || ''}
                                onChange={(e) => handleInputChange(rowId, col.id, e.target.value)}
                              />
                            );
                          } else if (
                            [
                              'qty',
                              'rate',
                              'mrp',
                              'pqty',
                              'minrate',
                              'netRate',
                              'bdsalerate',
                              'taxable',
                              'taxamount',
                              'taxAmt',
                            ].includes(col.id)
                          ) {
                            content = (
                              <input
                                type="text"
                                className="h-full w-full bg-transparent px-1 text-right outline-none"
                                value={rowData[col.id] || ''}
                                readOnly={
                                  col.id === 'taxAmt' ||
                                  col.id === 'taxamount' ||
                                  col.id === 'netRate'
                                }
                                onChange={(e) => handleInputChange(rowId, col.id, e.target.value)}
                              />
                            );
                          } else {
                            content = (
                              <input
                                type="text"
                                className="h-full w-full bg-transparent px-1 outline-none"
                                value={rowData[col.id] || ''}
                                onChange={(e) => handleInputChange(rowId, col.id, e.target.value)}
                              />
                            );
                          }

                          const isReadOnly =
                            !col.resizable &&
                            !col.sticky &&
                            col.id !== 'warranty' &&
                            col.id !== 'amount' &&
                            col.id !== 'qty' &&
                            col.id !== 'rate';

                          return (
                            <td
                              key={col.id}
                              style={{
                                width: col.width,
                                left: isLeft ? getStickyLeft(cIdx) : undefined,
                                position: isLeft ? 'sticky' : 'static',
                                zIndex: isLeft ? 10 : 'auto',
                                backgroundColor: isReadOnly ? '#FAFAFA' : 'white',
                                borderColor: COLORS.border,
                              }}
                              className={`overflow-hidden whitespace-nowrap border-r px-1 text-xs ${
                                col.align === 'center'
                                  ? 'text-center'
                                  : col.align === 'right'
                                    ? 'text-right'
                                    : 'text-left'
                              } ${isReadOnly ? 'text-gray-500' : ''}`}>
                              {content}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="sticky bottom-0 z-20 bg-gray-50">
                  <tr className="h-9 font-bold">
                    {visibleColumns.map((col, idx) => {
                      let content: React.ReactNode = '';
                      if (col.id === 'desc') content = 'TOTAL';
                      else if (col.id === 'qty') content = totals.qty;
                      else if (col.id === 'amount') content = totals.amount;
                      return (
                        <td
                          key={col.id}
                          style={{
                            left: col.sticky === 'left' ? getStickyLeft(idx) : undefined,
                            position: col.sticky === 'left' ? 'sticky' : 'static',
                            zIndex: col.sticky === 'left' ? 30 : 20,
                            backgroundColor: COLORS.background,
                          }}
                          className="border-r border-t-2 px-1 text-right text-xs">
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>

      {configOpen &&
        ReactDOM.createPortal(
          <div className="animate-in fade-in fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200">
            <div className="absolute inset-0" onClick={() => setConfigOpen(false)} />
            <div
              className="relative flex h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border shadow-2xl"
              style={{
                backgroundColor: COLORS.white,
                borderColor: COLORS.border,
                maxHeight: '85vh',
              }}>
              <div
                className="flex items-center justify-between border-b px-6 py-4"
                style={{ borderColor: COLORS.border }}>
                <h3
                  className="flex items-center gap-2 text-xl font-bold"
                  style={{ color: COLORS.textPrimary }}>
                  <Settings size={20} style={{ color: COLORS.primary }} />
                  Table Configuration
                </h3>
                <button
                  onClick={() => setConfigOpen(false)}
                  className="rounded-full p-1 transition-colors hover:bg-gray-100">
                  <X size={22} style={{ color: COLORS.textSecondary }} />
                </button>
              </div>

              <div
                className="border-b px-6 py-4"
                style={{
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.border,
                }}>
                <div className="group relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search columns to show/hide..."
                    className="w-full rounded-lg border py-3 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2"
                    style={{ borderColor: COLORS.border }}
                    value={configSearch}
                    onChange={(e) => setConfigSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {columns
                    .filter((c) => !['sno', 'add', 'del', 'srch', 'copy'].includes(c.id))
                    .filter((c) => c.label.toLowerCase().includes(configSearch.toLowerCase()))
                    .map((col) => (
                      <div
                        key={col.id}
                        onClick={() => toggleColumnVisibility(col.id)}
                        className="flex cursor-pointer select-none items-center gap-3 rounded-lg border p-3 transition-all hover:shadow-sm"
                        style={{
                          backgroundColor: col.visible ? `${COLORS.primary}10` : COLORS.white,
                          borderColor: col.visible ? COLORS.primary : COLORS.border,
                        }}>
                        <div
                          className="flex h-5 w-5 items-center justify-center rounded border transition-colors"
                          style={{
                            backgroundColor: col.visible ? COLORS.primary : COLORS.white,
                            borderColor: col.visible ? COLORS.primary : '#e5e7eb',
                          }}>
                          <Check
                            size={14}
                            className="transition-opacity"
                            style={{
                              color: COLORS.white,
                              opacity: col.visible ? 1 : 0,
                            }}
                          />
                        </div>
                        <span
                          className="truncate text-sm font-medium"
                          style={{
                            color: col.visible ? COLORS.textPrimary : COLORS.textSecondary,
                          }}>
                          {col.label}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div
                className="flex items-center justify-between border-t bg-gray-50 px-6 py-4"
                style={{ borderColor: COLORS.border }}>
                <button
                  onClick={handleResetDefault}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200"
                  style={{ color: COLORS.textSecondary }}>
                  <RotateCcw size={16} /> Reset to Default
                </button>

                <div className="text-xs text-gray-400">
                  {columns.filter((c) => c.visible).length} columns visible
                </div>

                <button
                  className="flex items-center gap-2 rounded px-6 py-1.5 text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: COLORS.primary }}
                  onClick={() => setConfigOpen(false)}>
                  Apply
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      <AttributePanel
        isOpen={attributePanelState.visible}
        onClose={() => setAttributePanelState({ ...attributePanelState, visible: false })}
        onSave={handleAttributeSave}
        billType="PURCHASE"
        initialData={attributePanelState.tempItemData}
      />

      {popupState.visible &&
        ReactDOM.createPortal(
          <>
            <div
              className="fixed inset-0 z-[9998] cursor-default bg-transparent"
              onClick={closePopup}
            />
            <div
              className="fixed z-[9999] flex flex-col rounded border bg-white shadow-xl"
              style={{
                top: popupState.top,
                left: popupState.left,
                borderColor: COLORS.borderDark,
                width: '600px',
                maxHeight: '300px',
                transform: popupState.top + 300 > window.innerHeight ? 'translateY(-100%)' : 'none',
              }}>
              <div
                className="flex h-8 items-center justify-between border-b p-2"
                style={{ backgroundColor: COLORS.primary, color: COLORS.white }}>
                <span className="pl-1 text-xs font-bold">Select Item (Vendor: {vendorCode})</span>
                <button onClick={closePopup}>
                  <X size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-0">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="sticky top-0 z-10 bg-gray-100">
                    <tr>
                      <th className="border p-1.5">Code</th>
                      <th className="border p-1.5">Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr
                        key={item._id || idx}
                        className="cursor-pointer border-b hover:bg-blue-50"
                        onClick={() => handleItemSelect(item)}>
                        <td className="border p-1.5">{item.code}</td>
                        <td className="border p-1.5 font-medium">{item.name}</td>
                        <td className="border p-1.5 text-right font-bold text-blue-600">
                          {item.purchase_rate || item.last_purchase_rate || '0.00'}
                        </td>
                        <td className="border p-1.5 text-right">{item.gstRate || '0'}%</td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-4 text-center italic text-gray-400">
                          No items found for this vendor.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>,
          document.body
        )}

      {warrantyPopup.visible &&
        ReactDOM.createPortal(
          <>
            <div
              className="fixed inset-0 z-[9998] cursor-default bg-transparent"
              onClick={closeWarrantyPopup}
            />
            <div
              className="fixed z-[9999] flex flex-col overflow-hidden rounded border bg-white shadow-xl"
              style={{
                top: warrantyPopup.top,
                left: warrantyPopup.left,
                borderColor: COLORS.borderDark,
                width: '300px',
                transform:
                  warrantyPopup.top + 350 > window.innerHeight ? 'translateY(-100%)' : 'none',
              }}>
              <div className="flex items-center justify-between border-b bg-gray-50 px-3 py-2">
                <span className="flex items-center gap-1 text-xs font-bold text-gray-700">
                  <ShieldCheck size={14} className="text-blue-600" /> Select Warranty
                </span>
                <button onClick={closeWarrantyPopup} className="text-gray-400 hover:text-red-500">
                  <X size={16} />
                </button>
              </div>

              <div className="max-h-[150px] overflow-y-auto">
                {warrantyPopup.options.length > 0 ? (
                  warrantyPopup.options.map((opt) => (
                    <div
                      key={opt.id}
                      className="group flex cursor-pointer items-center justify-between border-b px-3 py-2 text-xs hover:bg-blue-50"
                      onClick={() => handleWarrantySelect(opt)}>
                      <span className="font-medium text-gray-700">{opt.label}</span>
                      {opt.price > 0 && (
                        <span className="rounded bg-green-50 px-1.5 py-0.5 font-bold text-green-600">
                          +₹{opt.price}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs italic text-gray-400">
                    No standard plans available for this item.
                  </div>
                )}
              </div>

              <div className="border-t bg-gray-50 p-3">
                <div className="mb-2 text-[10px] font-bold uppercase text-gray-500">
                  Add Custom Plan
                </div>
                <div className="space-y-2">
                  <div className="flex h-8 items-center overflow-hidden rounded border bg-white">
                    <div className="flex h-full items-center border-r bg-gray-100 px-2">
                      <Clock size={12} className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Duration (e.g. 3 Years)"
                      className="h-full w-full px-2 text-xs outline-none"
                      value={newWarranty.duration}
                      onChange={(e) =>
                        setNewWarranty((prev) => ({
                          ...prev,
                          duration: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex h-8 items-center overflow-hidden rounded border bg-white">
                    <div className="flex h-full items-center border-r bg-gray-100 px-2">
                      <DollarSign size={12} className="text-gray-500" />
                    </div>
                    <input
                      type="number"
                      placeholder="Price (Optional)"
                      className="h-full w-full px-2 text-xs outline-none"
                      value={newWarranty.price}
                      onChange={(e) =>
                        setNewWarranty((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <button
                    className="w-full rounded bg-blue-600 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                    onClick={handleAddCustomWarranty}
                    disabled={!newWarranty.duration}>
                    Add & Apply
                  </button>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}

      {isImportModalOpen &&
        ReactDOM.createPortal(
          <PullFromOrderModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
          />,
          document.body
        )}

      {isItemBalListOpen &&
        ReactDOM.createPortal(
          <div className="animate-in fade-in fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200">
            {/* Clickable overlay to close */}
            <div className="absolute inset-0" onClick={() => setItemBalListOpen(false)} />

            {/* Component Container */}
            <div className="relative w-full max-w-7xl shadow-2xl">
              <ItemWithBalance
                isOpen={isItemBalListOpen}
                onClose={() => setItemBalListOpen(false)}
                storeCode={storeCode}
                onConfirm={handleItemBalConfirm}
              />
            </div>
          </div>,
          document.body
        )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 14px; height: 14px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: ${COLORS.scrollbarThumb}; border: 3px solid transparent; background-clip: content-box; border-radius: 99px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: ${COLORS.scrollbarTrack}; }
      `}</style>
    </div>
  );
});

export default OrderTable;
