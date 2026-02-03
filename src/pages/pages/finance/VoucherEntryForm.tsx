import React, { useState, useEffect } from 'react';
import {
  EditIcon,
  PlusIcon,
  XIcon,
  Settings,
  FileSpreadsheet,
  DollarSign,
  Save,
} from 'lucide-react';

import { fetchAllLocations, LocationMaster } from '../inventory/stockAdjustment/api/LocationMaster';
import Dropdown, { ColumnDef } from '../../../components/Dropdown';
import chartOfAccountService from '../../../services/chartOfAccountService';
import Attachment from '../../../components/Attachment';

// --- Exported Sub-Components for Reuse ---

export const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({
  children,
  required,
}) => (
  <label className="flex h-[30px] items-center whitespace-nowrap text-[13px] font-medium text-gray-700">
    {children} {required && <span className="ml-1 text-red-500">*</span>}
  </label>
);

export const Input: React.FC<{
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, placeholder, readOnly, onChange, className }) => (
  <input
    type="text"
    className={`h-[30px] w-full rounded-sm border border-gray-300 bg-white px-2 text-[13px] text-gray-700 focus:border-[#0f3c63] focus:outline-none focus:ring-1 focus:ring-[#0f3c63] ${
      readOnly ? 'bg-gray-50' : ''
    } ${className}`}
    value={value || ''}
    onChange={onChange}
    placeholder={placeholder}
    readOnly={readOnly}
  />
);

export const ActionBtn: React.FC<{
  icon: React.ReactElement;
  onClick?: () => void;
  className?: string;
}> = ({ icon, onClick, className }) => (
  <button
    onClick={onClick}
    type="button"
    className={`flex h-[30px] w-[32px] shrink-0 items-center justify-center rounded-sm bg-[#0f3c63] text-white shadow-sm transition-opacity hover:opacity-90 ${className}`}>
    {icon}
  </button>
);

// --- Interfaces ---

interface SimpleOption {
  name: string;
  code?: string;
  id?: string;
}

interface VoucherRow {
  id: number;
  ledger: string;
  party: string;
  paymentMode: 'Debit' | 'Credit';
  amount: string;
  remark: string;
  checkNo: string;
}

interface VoucherHeaderData {
  category: string;
  receiptMode: string;
  store: string;
  storeCode: string;
  cashBankPosting: string;
  cashBankAc: string;
  voucherDate: string;
  voucherNo: string;
  refNo: string;
  remarks: string;
}

interface RecieptPaymentVoucherProps {
  voucherId?: string;
  isComponent?: boolean; // Removes outer shadows/borders
  onClose?: () => void; // Triggers "Modal Mode" UI
}

// --- Main Component ---

const RecieptPaymentVoucher: React.FC<RecieptPaymentVoucherProps> = ({
  isComponent = false,
  onClose,
}) => {
  const [storeOptions, setStoreOptions] = useState<SimpleOption[]>([]);
  const [glOptions, setGlOptions] = useState<any[]>([]);
  const [headerGlOptions, setHeaderGlOptions] = useState<any[]>([]);

  const [formData, setFormData] = useState<VoucherHeaderData>({
    category: 'Default',
    receiptMode: 'CommonVoucher',
    store: '',
    storeCode: '',
    cashBankPosting: 'LineWise',
    cashBankAc: '',
    voucherDate: new Date().toISOString().split('T')[0],
    voucherNo: '00075',
    refNo: '',
    remarks: '',
  });

  const [rows, setRows] = useState<VoucherRow[]>(
    Array.from({ length: 5 }).map((_, i) => ({
      id: i + 1,
      ledger: '',
      party: '',
      paymentMode: 'Debit',
      amount: '0.00',
      remark: '',
      checkNo: '',
    }))
  );

  const glColumns: ColumnDef<any>[] = [
    { header: 'Code', key: 'code', width: 'w-1/5' },
    { header: 'Name', key: 'name', width: 'w-2/5' },
    { header: 'Group', key: 'underGroup', width: 'w-2/5' },
  ];

  const nameColumns: ColumnDef<SimpleOption>[] = [{ header: 'Name', key: 'name', width: 'flex-1' }];
  const storeColumns: ColumnDef<SimpleOption>[] = [
    { header: 'Code', key: 'code', width: 'w-20' },
    { header: 'Name', key: 'name', width: 'flex-1' },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const coaResponse = await chartOfAccountService.getAllChartOfAccounts();
        const rawData = coaResponse.data;
        if (Array.isArray(rawData)) {
          const mappedOptions = rawData.map((item: any) => ({
            ...item,
            name: item.name || '',
            code: item.code || item.identification || 'N/A',
            underGroup:
              typeof item.underGroup === 'object' ? item.underGroup?.name : item.underGroup || '',
            underGroupCode: item.underGroupCode || '',
            nature: item.nature || 'N/A',
            label: item.name,
            value: item._id,
          }));
          setGlOptions(mappedOptions);
          const filtered = mappedOptions.filter(
            (item) =>
              item.underGroupCode === '23400000' ||
              item.underGroupCode === '23100000' ||
              item.underGroupCode === '13330000' ||
              item.name === 'Advance Income - Tax Paid'
          );
          setHeaderGlOptions(filtered);
        }
      } catch (error) {
        console.error('Failed to load dropdown data', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadStores = async () => {
      try {
        const locations = await fetchAllLocations();
        const mappedStores: SimpleOption[] = locations.map((loc: LocationMaster) => ({
          name: loc.name,
          code: loc.code,
          id: loc._id,
        }));
        setStoreOptions(mappedStores);
        if (mappedStores.length > 0 && !formData.store) {
          setFormData((prev) => ({
            ...prev,
            store: mappedStores[0].name,
            storeCode: mappedStores[0].code || '',
          }));
        }
      } catch (error) {
        console.error('Failed to load stores', error);
      }
    };
    loadStores();
  }, [formData.store]);

  const handleHeaderChange = (field: keyof VoucherHeaderData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDropdownChange = (field: keyof VoucherHeaderData, item: SimpleOption | null) => {
    if (!item) return;
    setFormData((prev) => ({
      ...prev,
      [field]: item.name,
      ...(field === 'store' ? { storeCode: item.code || '' } : {}),
    }));
  };

  const handleRowChange = (id: number, field: keyof VoucherRow, value: string) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        ledger: '',
        party: '',
        paymentMode: 'Debit',
        amount: '0.00',
        remark: '',
        checkNo: '',
      },
    ]);
  };

  const removeRow = (id: number) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const totalDebit = rows
    .filter((r) => r.paymentMode === 'Debit')
    .reduce((sum, r) => sum + parseFloat(r.amount || '0'), 0);
  const totalCredit = rows
    .filter((r) => r.paymentMode === 'Credit')
    .reduce((sum, r) => sum + parseFloat(r.amount || '0'), 0);

  return (
    <div
      className={`w-full rounded-md border border-gray-200 bg-white p-2 font-sans text-sm md:p-4 ${isComponent ? 'border-0' : 'shadow-sm'}`}>
      {/* Title Bar - Only visible in Modal mode */}
      {onClose && (
        <div className="mb-4 flex items-center justify-between rounded bg-[#0c4a75] px-4 py-2 text-white">
          <h3 className="text-md font-bold">Voucher Details</h3>
          <button onClick={onClose} className="rounded p-1 transition-colors hover:bg-white/20">
            <XIcon size={20} />
          </button>
        </div>
      )}

      {/* --- Responsive Header Grid --- */}
      <div className="mb-6 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
            <div className="w-full sm:w-32">
              <Label>Category</Label>
            </div>
            <div className="flex flex-1 gap-1">
              <div className="w-full">
                <Dropdown
                  data={[{ name: 'Default' }]}
                  columns={nameColumns}
                  value={formData.category}
                  valueKey="name"
                  onChange={(i) => handleHeaderChange('category', i?.name || '')}
                />
              </div>
              <ActionBtn icon={<EditIcon size={14} />} />
            </div>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
            <div className="w-full sm:w-32">
              <Label>Receipt Mode</Label>
            </div>
            <div className="w-full sm:flex-1">
              <Dropdown
                data={[{ name: 'CommonVoucher' }]}
                columns={nameColumns}
                value={formData.receiptMode}
                valueKey="name"
                onChange={(i) => handleHeaderChange('receiptMode', i?.name || '')}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
            <div className="w-full sm:w-32">
              <Label required>Store</Label>
            </div>
            <div className="flex flex-1 gap-1">
              <div className="w-full">
                <Dropdown
                  data={storeOptions}
                  columns={storeColumns}
                  value={formData.store}
                  valueKey="name"
                  onChange={(i) => handleDropdownChange('store', i)}
                  placeholder="Select Store..."
                />
              </div>
              <ActionBtn icon={<EditIcon size={14} />} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
            <div className="w-full sm:w-40">
              <Label required>Cash Bank Posting</Label>
            </div>
            <div className="w-full sm:flex-1">
              <Dropdown
                data={[{ name: 'LineWise' }, { name: 'Single' }]}
                columns={nameColumns}
                value={formData.cashBankPosting}
                valueKey="name"
                onChange={(i) => handleHeaderChange('cashBankPosting', i?.name || '')}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
            <div className="w-full sm:w-40">
              <Label required>Cash/Bank A/c</Label>
            </div>
            <div className="flex flex-1 gap-1">
              <div className="w-full">
                <Dropdown
                  data={headerGlOptions}
                  columns={glColumns}
                  value={formData.cashBankAc}
                  valueKey="name"
                  onChange={(i) => handleHeaderChange('cashBankAc', i?.name || '')}
                  placeholder="Select Account..."
                />
              </div>
              <ActionBtn icon={<EditIcon size={14} />} />
            </div>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
            <div className="w-full sm:w-40">
              <Label>Voucher Date</Label>
            </div>
            <input
              type="date"
              className="h-[30px] w-full rounded-sm border border-gray-300 px-2 text-[13px] focus:border-[#0f3c63] focus:outline-none"
              value={formData.voucherDate}
              onChange={(e) => handleHeaderChange('voucherDate', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
            <div className="w-full sm:w-24">
              <Label>Voucher No</Label>
            </div>
            <div className="w-full sm:flex-1">
              <Input value={formData.voucherNo} readOnly />
            </div>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
            <div className="w-full sm:w-24">
              <Label>Ref No</Label>
            </div>
            <div className="w-full sm:flex-1">
              <Input
                value={formData.refNo}
                onChange={(e) => handleHeaderChange('refNo', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="mb-6 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-end gap-1 border-b border-gray-200 p-1">
          <button className="rounded p-1 text-[#0f3c63] hover:bg-gray-100">
            <FileSpreadsheet size={18} />
          </button>
          <button className="rounded p-1 text-green-600 hover:bg-gray-100">
            <DollarSign size={18} />
          </button>
          <button className="rounded p-1 text-[#0f3c63] hover:bg-gray-100">
            <Settings size={18} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="flex h-8 items-center bg-[#0c4a75] text-[12px] font-semibold text-white">
              <div className="w-[50px] border-r border-[#2c5375] text-center">S No</div>
              <div className="w-[40px] border-r border-[#2c5375] text-center">+</div>
              <div className="w-[40px] border-r border-[#2c5375] text-center">x</div>
              <div className="flex-1 border-r border-[#2c5375] px-2 text-left">Ledger</div>
              <div className="w-[150px] border-r border-[#2c5375] px-2 text-left">Payment Mode</div>
              <div className="w-[150px] border-r border-[#2c5375] px-2 text-right">Amount(₹)</div>
              <div className="w-[250px] px-2 text-left">Remark</div>
            </div>

            <div className="custom-scrollbar max-h-[350px] overflow-y-auto">
              {rows.map((row, index) => (
                <div
                  key={row.id}
                  className="flex h-[32px] items-center border-b border-gray-100 text-[13px] hover:bg-gray-50">
                  <div className="w-[50px] border-r border-gray-100 text-center text-gray-500">
                    {index + 1}
                  </div>
                  <div className="flex w-[40px] justify-center border-r border-gray-100">
                    <button onClick={addRow} className="text-green-600">
                      <PlusIcon size={14} />
                    </button>
                  </div>
                  <div className="flex w-[40px] justify-center border-r border-gray-100">
                    <button onClick={() => removeRow(row.id)} className="text-red-500">
                      <XIcon size={14} />
                    </button>
                  </div>
                  <div className="h-full flex-1 border-r border-gray-100">
                    <Dropdown
                      data={glOptions}
                      columns={glColumns}
                      value={row.ledger}
                      valueKey="name"
                      onChange={(i) => handleRowChange(row.id, 'ledger', i?.name || '')}
                      placeholder="Select Ledger"
                      className="h-full border-none bg-transparent"
                    />
                  </div>
                  <div className="h-full w-[150px] border-r border-gray-100 px-1">
                    <select
                      className="h-full w-full bg-transparent text-xs outline-none"
                      value={row.paymentMode}
                      onChange={(e) =>
                        handleRowChange(row.id, 'paymentMode', e.target.value as any)
                      }>
                      <option value="Debit">Debit</option>
                      <option value="Credit">Credit</option>
                    </select>
                  </div>
                  <div className="relative flex h-full w-[150px] items-center border-r border-gray-100 px-1">
                    <span className="absolute left-2 text-[10px] text-gray-400">₹</span>
                    <input
                      className="h-full w-full bg-transparent pr-1 text-right outline-none"
                      value={row.amount}
                      onChange={(e) => handleRowChange(row.id, 'amount', e.target.value)}
                    />
                  </div>
                  <div className="h-full w-[250px] px-1">
                    <input
                      className="h-full w-full bg-transparent px-1 font-medium outline-none"
                      value={row.remark}
                      onChange={(e) => handleRowChange(row.id, 'remark', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col border-t border-gray-200 bg-[#0c4a75] p-2 px-4 text-[13px] font-bold text-white sm:h-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span>
              Current Balance : <span className="underline">{formData.cashBankAc || 'None'}</span> :
            </span>
            <span className="text-white">-60,339.00</span>
          </div>
          <div className="flex gap-x-6">
            <span>Debit: {totalDebit.toFixed(2)}</span>
            <span>Credit: {totalCredit.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="shadow-inner rounded-md border border-gray-200 bg-gray-50/30 p-3">
          <div className="mb-2 text-[13px] font-bold text-[#0c4a75]">Voucher Attachments</div>
          <Attachment />
        </div>
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <Label>General Remarks</Label>
            <div className="relative">
              <textarea
                className="h-24 w-full rounded-sm border border-gray-300 p-2 text-xs focus:border-[#0f3c63] focus:outline-none"
                value={formData.remarks}
                onChange={(e) => handleHeaderChange('remarks', e.target.value)}
                placeholder="Enter voucher notes..."
              />
              <span className="absolute bottom-2 right-2 text-[10px] text-gray-400">
                {formData.remarks.length}/250
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            {onClose && (
              <button
                onClick={onClose}
                className="rounded-sm border border-gray-300 px-6 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
                Cancel
              </button>
            )}
            <button className="flex transform items-center gap-2 rounded-sm bg-[#0c4a75] px-10 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0f3c63] active:scale-95">
              <Save size={16} /> Save Voucher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecieptPaymentVoucher;
