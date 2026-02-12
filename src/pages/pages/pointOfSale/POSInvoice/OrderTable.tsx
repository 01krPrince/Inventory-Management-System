import React, { useState, useRef, MouseEvent, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import {
  Plus,
  X,
  Search,
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
} from 'lucide-react';
import { COLORS } from '../../../../constants/colors';
import { PosInvoiceItem } from '../../../../services/pos/posInvoiceService';
import AddNewItem from '../../../../components/addItemMaster/AddNewItem';
import { getItemByCodeAndBarcode } from '../../inventory/itemMaster/api/itemService';
import { fetchItems } from '../../inventory/itemMaster/api/itemService';
import { StockUnitData } from '../../../../components/addItemMaster/api/types';
import { fetchStockUnits } from '../../../../components/addItemMaster/api/stockunitservice';
import AttributePanel from '../../../../components/AttributePanel';
import { ItemApiData } from '../../inventory/itemMaster/models/ItemModel';
import PullFromOrderModal from '../../../../components/PullFromOrderModal';

interface OrderTableProps {
  rows: string[];
  setRows: React.Dispatch<React.SetStateAction<string[]>>;
  tableData: Record<string, RowData>;
  setTableData: React.Dispatch<React.SetStateAction<Record<string, RowData>>>;
  onItemsUpdated?: (
    items: PosInvoiceItem[],
    totals: { qty: number; amount: number; tax: number; total: number }
  ) => void;
}

interface Column {
  id: string;
  label: string;
  width: number;
  align: 'left' | 'center' | 'right';
  sticky?: 'left';
  resizable?: boolean;
  visible: boolean;
}

interface RowData {
  [key: string]: string | number;
}

interface WarrantyOption {
  id: string;
  label: string;
  price: number;
}

const getStandardWarranties = (itemText: string): WarrantyOption[] => {
  if (!itemText) return [];
  const text = itemText.toLowerCase();

  if (text.includes('bat') || text.includes('elec')) {
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

interface OrderTableProps {
  rows: string[];
  setRows: React.Dispatch<React.SetStateAction<string[]>>;
  tableData: Record<string, RowData>;
  setTableData: React.Dispatch<React.SetStateAction<Record<string, RowData>>>;
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
    id: 'postype',
    label: 'POS Type',
    width: 80,
    align: 'center',
    sticky: 'left',
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
  { id: 'warranty', label: 'Warranty', width: 130, align: 'left', resizable: true, visible: true },
  { id: 'attr', label: 'Attribute', width: 40, align: 'center', resizable: true, visible: true },
  { id: 'widg', label: 'Widget', width: 40, align: 'center', resizable: true, visible: true },
  { id: 'batch', label: 'Batch', width: 45, align: 'center', resizable: true, visible: true },
  { id: 'unit', label: 'Unit', width: 70, align: 'left', resizable: true, visible: true },
  { id: 'qty', label: 'Quantity', width: 80, align: 'right', resizable: true, visible: true },
  { id: 'rate', label: 'Rate', width: 80, align: 'right', resizable: true, visible: true },
  { id: 'amount', label: 'Amount', width: 90, align: 'right', resizable: true, visible: true },
  { id: 'taxable', label: 'Taxable', width: 80, align: 'right', resizable: true, visible: true },
  { id: 'taxAmt', label: 'Tax Amount', width: 80, align: 'right', resizable: true, visible: true },
  { id: 'mrp', label: 'MRP', width: 80, align: 'right', resizable: true, visible: true },
  { id: 'taxCode', label: 'Tax Rate', width: 120, align: 'left', resizable: true, visible: true },
  // { id: 'taxRate', label: 'Tax Rate', width: 120, align: 'left', resizable: true, visible: true },
  { id: 'remark', label: 'Remark', width: 120, align: 'left', resizable: true, visible: true },
  {
    id: 'printdesc',
    label: 'Description',
    width: 150,
    align: 'left',
    resizable: true,
    visible: false,
  },
  { id: 'barcode', label: 'Barcode', width: 100, align: 'left', resizable: true, visible: true },
  { id: 'brand', label: 'Brand', width: 100, align: 'left', resizable: true, visible: true },
  { id: 'netRate', label: 'Net Rate', width: 80, align: 'left', resizable: true, visible: false },
];

const OrderTable: React.FC<OrderTableProps> = ({
  rows,
  setRows,
  tableData,
  setTableData,
  onItemsUpdated,
}) => {
  const generateRowId = () => `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const [items, setItems] = useState<ItemApiData[]>([]);
  const [, setStockUnits] = useState<StockUnitData[]>([]);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const [configOpen, setConfigOpen] = useState(false);
  const [configSearch, setConfigSearch] = useState('');
  const [popupSearch, setPopupSearch] = useState(''); // <--- ADD THIS
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [scanQuery, setScanQuery] = useState('');
  const [popupState, setPopupState] = useState<{
    visible: boolean;
    top: number;
    left: number;
    activeRowId: string | null;
  }>({ visible: false, top: 0, left: 0, activeRowId: null });

  const calculateRowTaxable = (qty: number, rate: number, gst: number) => {
    const total = qty * rate;
    const taxable = total / (1 + gst / 100);

    // Use .toFixed(2) and convert back to Number to keep it as a numeric type
    return isNaN(taxable) ? 0 : Number(taxable.toFixed(2));
  };

  const calculateRowTaxAmount = (qty: number, rate: number, gst: number) => {
    const total = qty * rate;
    const taxable = calculateRowTaxable(qty, rate, gst);

    const taxAmt = total - taxable;
    // Rounding to 2 decimal places
    return isNaN(taxAmt) ? 0 : Number(taxAmt.toFixed(2));
  };

  const [warrantyPopup, setWarrantyPopup] = useState<{
    visible: boolean;
    top: number;
    left: number;
    activeRowId: string | null;
    options: WarrantyOption[];
  }>({ visible: false, top: 0, left: 0, activeRowId: null, options: [] });

  const [newWarranty, setNewWarranty] = useState({ duration: '', price: '' });

  const [attributePanelState, setAttributePanelState] = useState<{
    visible: boolean;
    activeRowId: string | null;
    tempItemData: ItemApiData | null;
  }>({ visible: false, activeRowId: null, tempItemData: null });

  const [addNewItemForm, setAddNewItemForm] = useState(false);

  useEffect(() => {
    if (rows.length === 0) {
      const initialRows = Array.from({ length: 8 }, () => generateRowId());
      setRows(initialRows);
      const initialData: Record<string, RowData> = {};
      initialRows.forEach((id) => {
        initialData[id] = {
          postype: 'Sale',
          qty: '',
          rate: '',
          amount: '',
          warranty: '',
        };
      });
      setTableData(initialData);
    }
  }, [rows.length, setRows, setTableData]);

  useEffect(() => {
    loadMasterData();
  }, []);

  const loadMasterData = async () => {
    try {
      const itemsData = await fetchItems();

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
                const newRate = String((matchedItem.sales_rate || matchedItem.netRate) ?? 0);
                const newGstRate = parseFloat(String(matchedItem.gstRate || 0));
                const currentQty = parseFloat(String(row.qty || 0));

                const newAmount =
                  !isNaN(currentQty) && !isNaN(parseFloat(newRate))
                    ? (currentQty * parseFloat(newRate)).toFixed(2)
                    : '0.00';

                const newTaxable = calculateRowTaxable(currentQty, parseFloat(newRate), newGstRate);
                const newTaxAmt = calculateRowTaxAmount(
                  currentQty,
                  parseFloat(newRate),
                  newGstRate
                );

                updatedTableData[rowId] = {
                  ...row,
                  rate: newRate,
                  gstRate: String(newGstRate),
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

  const handleResetDefault = () => {
    setColumns(JSON.parse(JSON.stringify(DEFAULT_COLUMNS)));

    setConfigSearch('');
  };

  const handleCloseForm = () => {
    setAddNewItemForm(false);
  };

  const handleFormSuccess = async () => {
    await loadMasterData();
    setAddNewItemForm(false);
  };

  const cleanVal = (val: number) => {
    if (isNaN(val) || val === 0) return '';
    return String(Math.round(val * 100) / 100);
  };

  useEffect(() => {
    if (!onItemsUpdated) return;

    const validItems: PosInvoiceItem[] = [];
    const totals = { qty: 0, amount: 0, tax: 0, total: 0 };

    rows.forEach((rowId) => {
      const row = tableData[rowId];
      if (!row || !row.itemId) return;

      const qty = parseFloat(String(row.qty || 0));

      const uiRateInclusive = parseFloat(String(row.rate || 0));
      const uiAmountInclusive = parseFloat(String(row.amount || 0));
      const uiTaxableTotal = parseFloat(String(row.taxable || 0));
      const uiTaxAmount = parseFloat(String(row.taxAmt || 0));
      const uiGstPercent = parseFloat(String(row.gstRate || 0));

      const unitTaxable = qty > 0 ? uiTaxableTotal / qty : 0;

      const item: PosInvoiceItem = {
        item: String(row.itemId),
        itemCode: String(row.select),
        itemName: String(row.desc),
        posType: (row.postype as 'Sale' | 'Return') || 'Sale',

        warranty: parseWarrantyString(String(row.warranty || '')),

        quantity: qty,

        rate: unitTaxable,
        amount: uiTaxableTotal,
        group: String(row.group || ''),

        netRate: uiRateInclusive,
        netAmount: uiAmountInclusive,

        mrp: parseFloat(String(row.mrp || 0)),
        unit: String(row.unit || ''),
        brand: String(row.brand || ''),
        barCode: String(row.barcode || ''),
        hsn: String(row.hsn || ''),

        taxCode: String(row.taxRate || ''),
        taxRate: uiGstPercent,
        taxAmount: uiTaxAmount,

        batchNo: String(row.batch || ''),
        warehouse: 'Main Store',
      };

      validItems.push(item);

      totals.qty += qty;
      totals.amount += uiTaxableTotal;
      totals.tax += uiTaxAmount;
      totals.total += uiAmountInclusive;
    });

    onItemsUpdated(validItems, totals);
  }, [tableData, rows, onItemsUpdated]);

  const parseWarrantyString = (wStr: string) => {
    if (!wStr || wStr === 'Select') return undefined;
    const priceMatch = wStr.match(/\(\+₹?([\d.]+)\)/);
    if (priceMatch) {
      const price = parseFloat(priceMatch[1]);
      const label = wStr.split(' (+')[0].trim();
      return { duration: label, price };
    }
    return { duration: wStr, price: 0 };
  };

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

  const addScannedItemToTable = (item: ItemApiData) => {
    console.log('🔍 Scanned/Selected Item Raw Data:', item);
    console.log('👉 Stock Unit Type:', typeof item.stock_unit, 'Value:', item.stock_unit);
    console.log('👉 Brand Type:', typeof item.brand, 'Value:', item.brand);

    const rate = parseFloat(String(item.sales_rate || item.sale_rate || 0));
    const qty = 1;
    const gstRate = parseFloat(String(item.gstRate || item.taxRate || 0));

    const taxable = calculateRowTaxable(qty, rate, gstRate);
    const taxAmt = calculateRowTaxAmount(qty, rate, gstRate);
    const amount = cleanVal(qty * rate);

    const safeString = (val: any) => {
      if (!val) return '';
      if (typeof val === 'object') return val.name || val.item_name || '';
      return String(val);
    };

    const rowData: RowData = {
      postype: 'Sale',
      select: item.code ?? '',
      desc: item.name ?? '',
      itemId: item._id || '',

      unit: safeString(item.stock_unit),
      brand: safeString(item.brand),

      hsn: item.gst_classification ?? '',
      taxCode: item.taxRate || '',

      qty: String(qty),
      rate: cleanVal(rate),
      mrp: cleanVal(item.mrp ?? 0),
      group: item.group,
      amount: cleanVal(parseFloat(amount)),

      taxable: taxable,
      taxAmt: taxAmt,

      barcode: item.barcode ?? '',
      gstRate: String(gstRate),
      taxRate: item.hsn_description || String(gstRate),
      netRate: String(item.netRate || '0'),
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
      setTableData((prev) => ({ ...prev, [targetRowId!]: { ...prev[targetRowId!], ...rowData } }));
    } else {
      const newId = generateRowId();
      setRows((prev) => [...prev, newId]);
      setTableData((prev) => ({ ...prev, [newId]: rowData }));
    }
  };

  useEffect(() => {
    if (!onItemsUpdated) return;

    const validItems: PosInvoiceItem[] = [];
    let totalQty = 0;
    let totalAmount = 0;
    let totalTax = 0;
    let grandTotal = 0;

    rows.forEach((rowId) => {
      const row = tableData[rowId];
      if (!row || !row.itemId) return;

      const qty = parseFloat(String(row.qty || 0));
      const rate = parseFloat(String(row.rate || 0));
      const taxAmt = parseFloat(String(row.taxAmt || 0));
      const taxableVal = parseFloat(String(row.taxable || 0));
      const netAmount = parseFloat(String(row.amount || 0));

      const netRate = qty > 0 ? taxableVal / qty : 0;

      const item: PosInvoiceItem = {
        item: String(row.itemId),
        itemCode: String(row.select),
        itemName: String(row.desc),
        posType: (row.postype as 'Sale' | 'Return') || 'Sale',

        warranty: parseWarrantyString(String(row.warranty || '')),

        quantity: qty,
        rate: rate,
        amount: netAmount,

        mrp: parseFloat(String(row.mrp || 0)),
        unit: String(row.unit || ''),
        brand: String(row.brand || ''),
        barCode: String(row.barcode || ''),
        hsn: String(row.hsn || ''),
        group: String(row.group || ''),
        taxCode: String(row.taxRate || ''),
        taxRate: parseFloat(String(row.gstRate || 0)),
        taxAmount: taxAmt,

        netRate: netRate,
        netAmount: taxableVal,

        batchNo: String(row.batch || ''),
        warehouse: 'Main Store',
      };

      validItems.push(item);

      totalQty += qty;
      totalAmount += netAmount;
      totalTax += taxAmt;
      grandTotal += netAmount;
    });

    onItemsUpdated(validItems, {
      qty: totalQty,
      amount: totalAmount,
      tax: totalTax,
      total: grandTotal,
    });
  }, [tableData, rows, onItemsUpdated]);

  const handleInputChange = (rowId: string, columnId: string, value: string) => {
    setTableData((prev) => {
      const row = prev[rowId] || {};
      const newData = { ...row, [columnId]: value };

      const qty = parseFloat(columnId === 'qty' ? value : String(row.qty || 0));
      const gst = parseFloat(String(row.gstRate || 0));

      let newRate = parseFloat(columnId === 'rate' ? value : String(row.rate || 0));
      let newAmount = parseFloat(columnId === 'amount' ? value : String(row.amount || 0));
      let newTaxable = parseFloat(columnId === 'taxable' ? value : String(row.taxable || 0));
      let newTaxAmt = 0;

      if (columnId === 'qty' || columnId === 'rate') {
        newAmount = qty * newRate;

        newTaxable = newAmount / (1 + gst / 100);

        newTaxAmt = newAmount - newTaxable;
      } else if (columnId === 'amount') {
        newRate = qty > 0 ? newAmount / qty : 0;

        newTaxable = newAmount / (1 + gst / 100);

        newTaxAmt = newAmount - newTaxable;
      } else if (columnId === 'taxable') {
        newTaxAmt = newTaxable * (gst / 100);

        newAmount = newTaxable + newTaxAmt;

        newRate = qty > 0 ? newAmount / qty : 0;
      } else {
        newTaxAmt = parseFloat(String(row.taxAmt || 0));
      }

      newData.rate = isNaN(newRate) ? '0.00' : newRate.toFixed(2);
      newData.amount = isNaN(newAmount) ? '0.00' : newAmount.toFixed(2);
      newData.taxable = isNaN(newTaxable) ? '0.00' : newTaxable.toFixed(2);
      newData.taxAmt = isNaN(newTaxAmt) ? '0.00' : newTaxAmt.toFixed(2);

      return { ...prev, [rowId]: newData };
    });
  };

  const handleDeleteRow = (rowIdToDelete: string) => {
    if (rows.length > 8) {
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
          postype: 'Sale',
          qty: 0,
          rate: 0,
          amount: 0,
          warranty: '',
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
          postype: 'Sale',
          qty: 0,
          rate: 0,
          amount: 0,
          warranty: '',
        },
      }));
    }
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

  const handleItemSelect = (item: any) => {
    if (popupState.activeRowId) {
      setTableData((prev) => {
        const rowId = popupState.activeRowId!;
        const currentRow = prev[rowId] || {};

        const qty = 1;
        const rate = parseFloat(String(item.sales_rate || item.sale_rate || 0));
        const gstRate = parseFloat(String(item.taxRate || item.gstRate || 0));
        const mrp = parseFloat(String(item.mrp || 0));

        const taxableVal = rate / (1 + gstRate / 100);
        const taxAmt = rate - taxableVal;

        const totalAmount = qty * rate;

        const newData: RowData = {
          ...currentRow,
          itemId: item._id,
          select: item.code ?? '',
          desc: item.name ?? '',

          unit: item.stock_unit || '',
          brand: item.brand || '',
          hsn: item.gst_classification || '',
          taxCode: item.taxRate + '%' || '',

          qty: String(qty),
          rate: cleanVal(rate),
          mrp: cleanVal(mrp),
          amount: cleanVal(totalAmount),
          taxable: cleanVal(taxableVal * qty),
          taxAmount: cleanVal(taxAmt * qty),

          netRate: String(item.netRate || '0'),
          barcode: item.auto_barcode || item.code || '',
        };
        return { ...prev, [rowId]: newData };
      });

      setPopupState({ visible: false, top: 0, left: 0, activeRowId: null });
      setPopupSearch('');
    }
  };

  const handleWarrantyClick = (e: React.MouseEvent<HTMLDivElement>, rowId: string) => {
    e.stopPropagation();
    const rowData = tableData[rowId];

    // 1. Find the original item object from your master list to access hidden fields like customWarranty
    const originalItem = items.find((i) => i._id === rowData.itemId || i.code === rowData.select);

    let options: WarrantyOption[] = [];

    // 2. Check if the item has custom warranties
    // We cast to 'any' here just in case ItemApiData interface isn't updated in your file yet
    const customWarranties = (originalItem as any)?.customWarranty;

    if (Array.isArray(customWarranties) && customWarranties.length > 0) {
      // 3. Map your API response to the table's Option format
      options = customWarranties.map((w: any) => ({
        id: w._id,
        label: `${w.duration} Months`, // Added "Months" for clarity
        price: parseFloat(w.price) || 0,
      }));
    } else {
      // 4. Fallback: Use the old standard logic if no custom warranty exists
      options = getStandardWarranties(String(rowData?.select || ''));
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setWarrantyPopup({
      visible: true,
      top: rect.bottom,
      left: rect.left,
      activeRowId: rowId,
      options: options,
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
        code: data.select,
        name: data.desc,
        stock_unit: data.unit,
        gst_classfication: data.hsn,
        brand: data.brand,
        sales_rate: data.rate,
        mrp: data.mrp,
        barcode: data.barcode,
      };
      setAttributePanelState({
        visible: true,
        activeRowId: rowId,
        tempItemData: reconstructedItem,
      });
    }
  };

  const handleAttributeSave = (attributeData: any) => {
    const { activeRowId, tempItemData } = attributePanelState;
    if (activeRowId && tempItemData) {
      const baseData: RowData = {
        postype: 'Sale',
        select: tempItemData.code || '',
        desc: tempItemData.name || '',
        hsn: tempItemData.gst_classfication || '',
        qty: '1',
        mrp: tempItemData.mrp || '0',
        rate: tempItemData.sales_rate || '0',
        barcode: tempItemData.barcode || '',
        printdesc: tempItemData.name || '',
      };
      const qty = 1;
      const rate = parseFloat(String(tempItemData.sales_rate || 0));
      baseData.amount = (qty * rate).toFixed(2);

      setTableData((prev) => ({
        ...prev,
        [activeRowId]: { ...prev[activeRowId], ...baseData, ...attributeData },
      }));
    }
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
      ['sno', 'add', 'del', 'copy', 'attr', 'widg', 'batch', 'postype', 'warranty'].includes(
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
            ? valA < valB
              ? -1
              : 1
            : valA > valB
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
      qty: cleanVal(sums.qty),
      amount: cleanVal(sums.amount),
      mrp: cleanVal(sums.mrp),
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

  return (
    <div
      className="relative z-0 flex h-auto flex-col overflow-hidden font-sans text-sm"
      style={{ backgroundColor: COLORS.background }}>
      <div
        className="relative z-10 flex flex-none items-center justify-between border-b bg-white p-2"
        style={{ borderColor: COLORS.border }}>
        <div className="flex items-center gap-4">
          <div
            className="flex h-8 w-72 items-center rounded-sm border bg-white"
            style={{ borderColor: COLORS.borderDark }}>
            <div className="flex h-full items-center justify-center border-r bg-gray-50 px-2">
              <ScanLine className="h-5 w-6 text-orange-500" />
            </div>
            <input
              type="text"
              placeholder="Scan Barcode (Enter)"
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
            onClick={() => setConfigOpen(true)}
            className="rounded border border-transparent p-1.5 text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-100"
            title="Configure Table Columns">
            <Settings size={18} />
          </button>

          <button
            className="flex items-center gap-2 rounded px-6 py-1.5 text-xs font-bold text-white shadow-sm"
            style={{ backgroundColor: COLORS.primary }}
            onClick={() => setIsImportModalOpen(true)}>
            <BarChart2 size={14} />
            Analyze & Import
          </button>
        </div>
      </div>

      <div className="relative z-0 flex flex-1 flex-col p-0">
        <div
          className="relative w-full overflow-hidden border bg-white shadow-sm"
          style={{ borderColor: COLORS.borderDark }}>
          <div className="custom-scrollbar w-full overflow-auto" style={{ height: '250px' }}>
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
                          else if (col.id === 'postype') {
                            content = (
                              <div className="group relative h-full w-full">
                                <div className="flex h-full items-center justify-between px-1 text-[10px]">
                                  <span
                                    style={{
                                      color: rowData.postype === 'Sale' ? 'inherit' : 'red',
                                    }}>
                                    {rowData.postype || 'Return'}
                                  </span>
                                  <ChevronDown size={10} className="text-gray-400" />
                                </div>
                                <select
                                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                  value={rowData.postype || 'Sale'}
                                  onChange={(e) =>
                                    handleInputChange(rowId, 'postype', e.target.value)
                                  }>
                                  <option value="Sale">Sale</option>
                                  <option value="Return">Return</option>
                                </select>
                              </div>
                            );
                          } else if (col.id === 'select') {
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
                          } else if (col.id === 'taxAmt') {
                            content = (
                              <div className="flex h-full w-full items-center justify-end bg-gray-50 px-1 font-medium text-gray-700">
                                {rowData[col.id] || '0.00'}
                              </div>
                            );
                          } else if (
                            [
                              'qty',
                              'rate',
                              'mrp',
                              'pqty',
                              'minrate',
                              'amount',
                              'taxAmt',
                              'netrate',
                              'taxable',
                              'bdsalerate',
                            ].includes(col.id)
                          ) {
                            content = (
                              <input
                                type="text"
                                className="h-full w-full bg-transparent px-1 outline-none"
                                value={rowData[col.id] || ''}
                                onChange={(e) => handleInputChange(rowId, col.id, e.target.value)}
                              />
                            );
                          } else if (
                            [
                              'taxRate',
                              'barcode',
                              'brand',
                              'printdesc',
                              'remark',
                              'taxRate',
                              'mrp',
                              'unit',
                            ].includes(col.id)
                          ) {
                            content = (
                              <div className="flex h-full w-full items-center overflow-hidden text-ellipsis whitespace-nowrap bg-gray-50 px-1 text-gray-600">
                                {rowData[col.id] || ''}
                              </div>
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
                          const isReadOnly = !col.resizable && !col.sticky && col.id !== 'warranty';
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
                    style={{
                      borderColor: COLORS.border,
                    }}
                    value={configSearch}
                    onChange={(e) => setConfigSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {columns
                    .filter((c) => !['sno', 'add', 'del', 'copy'].includes(c.id))
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
        billType="SALE"
        isOpen={attributePanelState.visible}
        onClose={() => setAttributePanelState({ ...attributePanelState, visible: false })}
        onSave={handleAttributeSave}
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
                maxHeight: '400px',
                transform: popupState.top + 400 > window.innerHeight ? 'translateY(-100%)' : 'none',
              }}>
              <div
                className="flex items-center justify-between border-b p-2"
                style={{ backgroundColor: COLORS.primary, color: COLORS.white }}>
                <span className="pl-1 text-xs font-bold">Select Item</span>
                <button onClick={closePopup}>
                  <X size={14} />
                </button>
              </div>

              <div className="border-b bg-gray-50 p-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search by name or code..."
                  className="w-full rounded border px-2 py-1 text-xs outline-none focus:border-blue-500"
                  value={popupSearch}
                  onChange={(e) => setPopupSearch(e.target.value)}
                />
              </div>

              <div className="flex-1 overflow-auto p-0">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="sticky top-0 z-10 bg-gray-100 font-bold text-gray-600">
                    <tr>
                      <th className="w-24 border p-1.5">Code</th>
                      <th className="border p-1.5">Name</th>
                      <th className="w-20 border p-1.5 text-right">Rate</th>
                      <th className="w-12 border p-1.5 text-center">GST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items
                      .filter(
                        (i) =>
                          !popupSearch ||
                          (i.name && i.name.toLowerCase().includes(popupSearch.toLowerCase())) ||
                          (i.code && i.code.toLowerCase().includes(popupSearch.toLowerCase()))
                      )
                      .map((item, idx) => (
                        <tr
                          key={item._id || idx}
                          className="cursor-pointer border-b transition-colors hover:bg-blue-100"
                          onClick={() => handleItemSelect(item)}>
                          <td className="border p-1.5 text-gray-500">{item.code}</td>
                          <td className="border p-1.5 font-medium">{item.name}</td>
                          <td className="border p-1.5 text-right font-bold text-blue-600">
                            {item.sales_rate || item.netRate || 0}
                          </td>
                          <td className="border p-1.5 text-center">
                            {item.taxRate || item.gstRate || 0}%
                          </td>
                        </tr>
                      ))}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-4 text-center italic text-gray-400">
                          No items found.
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

      <style>{`
        .custom-btn-primary { background-color: ${COLORS.primary}; transition: background-color 0.2s; }
        .custom-btn-primary:hover { background-color: ${COLORS.primaryHover}; }
        .custom-row-hover:hover td { background-color: ${COLORS.primaryLight} !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 14px; height: 14px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: ${COLORS.scrollbarThumb}; border: 3px solid transparent; background-clip: content-box; border-radius: 99px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: ${COLORS.scrollbarTrack}; }
      `}</style>
    </div>
  );
};

export default OrderTable;
