import React, { useState, useEffect } from 'react';
import Dropdown, { ColumnDef } from '../../../../components/Dropdown';
import DateInput from '../../../../components/DateInput';
import { EditIcon } from 'lucide-react';
import { LocationMaster } from '../../../../components/LocationMaster';
import CrudVendor from '../vendor/pages/AddNewVendor';

import {
  fetchAllLocations,
  LocationMaster as LocationMasterType,
} from '../../inventory/stockAdjustment/api/LocationMaster';

interface DropdownItem {
  name: string;
  code?: string;
  [key: string]: any;
}

interface MockData {
  vendors: DropdownItem[];
  cashBankAccounts: DropdownItem[];
}

const mockData: MockData = {
  vendors: [
    { name: 'Adidas India', code: 'V001' },
    { name: 'Nike Corp', code: 'V002' },
    { name: 'Puma Sports', code: 'V003' },
  ],
  cashBankAccounts: [
    { name: 'Cash', code: 'CASH' },
    { name: 'HDFC Bank - 1234', code: 'HDFC' },
    { name: 'SBI Bank - 5678', code: 'SBI' },
  ],
};

const defaultColumns: ColumnDef<DropdownItem>[] = [
  { header: 'Code', key: 'code', width: 'w-20' },
  { header: 'Name', key: 'name', width: 'w-[50px]' },
];

const locationColumns: ColumnDef<LocationMasterType>[] = [
  { header: 'Code', key: 'code', width: 'w-20' },
  { header: 'Name', key: 'name', width: 'flex-1' },
];

const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({
  children,
  required,
}) => (
  <label className="flex h-[30px] items-center whitespace-nowrap text-[13px] font-medium text-gray-700">
    {children} {required && <span className="ml-1 text-red-500">*</span>}
  </label>
);

const InputGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative flex w-full items-center gap-1">{children}</div>
);

interface InputProps {
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  value,
  placeholder,
  readOnly,
  onChange,
  className = '',
}) => (
  <input
    type="text"
    readOnly={readOnly}
    onChange={onChange}
    className={`h-[30px] w-full rounded-sm border border-gray-300 px-2 text-[13px] text-gray-700 focus:border-[var(--theme-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-focus)] ${
      readOnly ? 'cursor-not-allowed bg-gray-100 text-gray-500' : 'bg-white'
    } ${className}`}
    value={value || ''}
    placeholder={placeholder}
  />
);

const ActionBtn: React.FC<{
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ icon, onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={`z-10 ml-[-1px] flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-sm border border-[var(--theme-primary)] bg-[var(--theme-primary)] text-white transition-opacity hover:opacity-90 ${className}`}>
    <span className="flex items-center justify-center">{icon}</span>
  </button>
);

interface BillPaymentFormProps {
  themeColor?: string;
}

const BillPaymentForm: React.FC<BillPaymentFormProps> = ({ themeColor = '#0f3c63' }) => {
  const [isLocationMasterOpen, setIsLocationMasterOpen] = useState<boolean>(false);
  const [isVendorFormOpen, setIsVendorFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<DropdownItem | null>(null);

  // Data State
  const [locationList, setLocationList] = useState<LocationMasterType[]>([]);

  // Form Data State matching screenshot fields
  const [formData, setFormData] = useState({
    store: 'SPORTS HUB',
    date: '31/12/2025',
    voucherNo: '00073',
    vendor: '',
    email: '',
    cashBankAc: '',
    amount: '₹0.00',
    chequeNo: '',
    dated: '31/12/2025',
  });

  const nestedModalZIndex = 1200;

  // --- Effects ---
  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const result = await fetchAllLocations();
      setLocationList(result || []);
    } catch (err) {
      console.error(err);
      setLocationList([
        { code: 'ST01', name: 'SPORTS HUB' },
        { code: 'ST02', name: 'WAREHOUSE A' },
      ] as any);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- Handlers ---
  const getSelectedStoreData = (): LocationMasterType | null => {
    if (!formData.store) return null;
    return locationList.find((s) => s.name === formData.store) || null;
  };

  const handleLocationSelect = (locationName: string) => {
    handleFieldChange('store', locationName);
    setIsLocationMasterOpen(false);
  };

  const handleVendorAction = () => {
    const selectedVendorName = formData.vendor;
    if (selectedVendorName) {
      const vendorData = mockData.vendors.find((v) => v.name === selectedVendorName);
      setEditingVendor(vendorData || null);
    } else {
      setEditingVendor(null);
    }
    setIsVendorFormOpen(true);
  };

  const themeStyles = {
    '--theme-primary': themeColor,
    '--theme-secondary': themeColor,
    '--theme-focus': '#60a5fa',
  } as React.CSSProperties;

  return (
    <div style={themeStyles} className="relative rounded border border-gray-200 bg-white p-5">
      <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
        {/* === LEFT COLUMN === */}
        <div className="space-y-2">
          {/* Store */}
          <div className="grid grid-cols-12 items-center gap-2">
            <div className="col-span-4">
              <Label required>Store</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Dropdown
                  data={locationList}
                  columns={locationColumns}
                  value={formData.store}
                  valueKey="name"
                  onChange={(item) => handleFieldChange('store', item?.name || '')}
                />
                <ActionBtn
                  icon={<EditIcon size={16} />}
                  onClick={() => setIsLocationMasterOpen(true)}
                />
              </InputGroup>
            </div>
          </div>

          {/* Date */}
          <div className="grid grid-cols-12 items-center gap-2">
            <div className="col-span-4">
              <Label required>Date</Label>
            </div>
            <div className="col-span-8">
              <DateInput
                value={formData.date}
                onChange={(e) => handleFieldChange('date', e.target.value)}
              />
            </div>
          </div>

          {/* Voucher No */}
          <div className="grid grid-cols-12 items-center gap-2">
            <div className="col-span-4">
              <Label required>Voucher No</Label>
            </div>
            <div className="col-span-8">
              <Input
                value={formData.voucherNo}
                onChange={(e) => handleFieldChange('voucherNo', e.target.value)}
              />
            </div>
          </div>

          {/* Vendor */}
          <div className="grid grid-cols-12 items-center gap-2">
            <div className="col-span-4">
              <Label required>Vendor</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Dropdown
                  data={mockData.vendors}
                  columns={defaultColumns}
                  value={formData.vendor}
                  valueKey="name"
                  placeholder="Select..."
                  onChange={(item) => handleFieldChange('vendor', item?.name || '')}
                />
                <ActionBtn icon={<EditIcon size={14} />} onClick={handleVendorAction} />
              </InputGroup>
            </div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-12 items-center gap-2">
            <div className="col-span-4">
              <Label>Email</Label>
            </div>
            <div className="col-span-8">
              <Input
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN === */}
        <div className="space-y-2">
          {/* Cash/Bank A/c */}
          <div className="grid grid-cols-12 items-center gap-2">
            <div className="col-span-4">
              <Label>Cash/Bank A/c</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Dropdown
                  data={mockData.cashBankAccounts}
                  columns={defaultColumns}
                  value={formData.cashBankAc}
                  valueKey="name"
                  placeholder="Select..."
                  onChange={(item) => handleFieldChange('cashBankAc', item?.name || '')}
                />
                <ActionBtn icon={<EditIcon size={14} />} />
              </InputGroup>
            </div>
          </div>

          {/* Amount */}
          <div className="grid grid-cols-12 items-center gap-2">
            <div className="col-span-4">
              <Label>Amount</Label>
            </div>
            <div className="col-span-8">
              <Input
                value={formData.amount}
                className="text-right" // Align text to right as per screenshot
                onChange={(e) => handleFieldChange('amount', e.target.value)}
              />
            </div>
          </div>

          {/* Cheque No */}
          <div className="grid grid-cols-12 items-center gap-2">
            <div className="col-span-4">
              <Label>Cheque No</Label>
            </div>
            <div className="col-span-8">
              <Input
                value={formData.chequeNo}
                onChange={(e) => handleFieldChange('chequeNo', e.target.value)}
              />
            </div>
          </div>

          {/* Dated */}
          <div className="grid grid-cols-12 items-center gap-2">
            <div className="col-span-4">
              <Label required>Dated</Label>
            </div>
            <div className="col-span-8">
              <DateInput
                value={formData.dated}
                onChange={(e) => handleFieldChange('dated', e.target.value)}
              />
            </div>
          </div>

          {/* Auto Adjust Button */}
          <div className="grid grid-cols-12 items-center gap-2 pt-2">
            <div className="col-span-4"></div>
            <div className="col-span-8">
              <button
                type="button"
                className="rounded bg-[var(--theme-primary)] px-4 py-1.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90">
                Auto Adjust
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modals (Location & Vendor) --- */}
      {isLocationMasterOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          style={{ zIndex: nestedModalZIndex }}>
          <div className="relative overflow-hidden shadow-lg">
            <LocationMaster
              onClose={() => setIsLocationMasterOpen(false)}
              initialData={getSelectedStoreData()}
              onSuccess={loadLocations}
              onSelect={handleLocationSelect}
              index={nestedModalZIndex}
            />
          </div>
        </div>
      )}

      {isVendorFormOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          style={{ zIndex: nestedModalZIndex }}>
          <div className="relative h-[90vh] w-full max-w-6xl overflow-hidden rounded-xl">
            <CrudVendor
              onClose={() => setIsVendorFormOpen(false)}
              initialData={editingVendor}
              onSuccess={() => setIsVendorFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BillPaymentForm;
