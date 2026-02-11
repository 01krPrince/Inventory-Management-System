import React, { useState, useEffect, useRef } from 'react';
import { CalenderIcon } from '../../../../components/icons';
import CrudCustomer from '../../sales/customer/AddNewCustomer';
import { EditIcon, ArrowLeft } from 'lucide-react';

import DocumentInventoryModal from '../../../../components/DocumentCategoryInventory';
import {
  fetchDocumentCategoryInventory,
  DocumentCategoryInventory,
} from './api/DocumentCategoryInventory';

import { fetchAllLocations, LocationMaster as LocationMasterType } from './api/LocationMaster';
import { LocationMaster } from '../../../../components/LocationMaster';

import { getAllCustomers, Customer } from '../../../../services/sales/customer/customerService';

import Dropdown, { ColumnDef } from '../../../../components/Dropdown';

export interface StockAdjustmentHeaderData {
  voucherDate: string;
  voucherNo: string;
  category: string;
  store: string;
  party: string;
}

interface ActionBtnProps {
  icon: React.ReactElement;
  onClick?: () => void;
}

export interface SalesInvoiceFormProps {
  themeColor?: string;
  onOverlayChange?: (isOpen: boolean) => void;
  data: StockAdjustmentHeaderData;
  onDataChange: (data: StockAdjustmentHeaderData) => void;
  zIndex?: number;
}

interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
}

interface InputGroupProps {
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ children, required }) => (
  <label className="flex h-[32px] items-center whitespace-nowrap text-[13px] font-medium text-gray-700">
    {children} {required && <span className="ml-1 text-red-500">*</span>}
  </label>
);

const InputGroup: React.FC<InputGroupProps> = ({ children }) => (
  <div className="relative flex w-full items-center gap-1">{children}</div>
);

const ActionBtn: React.FC<ActionBtnProps> = ({ icon, onClick }) => (
  <button
    onClick={onClick}
    type="button"
    className="z-10 ml-[-1px] flex h-[32px] w-[32px] items-center justify-center rounded-sm border border-[var(--theme-primary)] bg-[var(--theme-primary)] text-white shadow-sm transition-opacity hover:opacity-90">
    {icon}
  </button>
);

const VoucherDateInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative h-[32px] w-full">
      <input
        ref={inputRef}
        type="date"
        value={value || ''}
        onChange={onChange}
        className="h-[32px] w-full rounded-sm border border-gray-300 bg-white px-3 pr-8 text-[13px] uppercase text-gray-700 focus:border-[var(--theme-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-focus)]"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.showPicker()}
        className="absolute right-0 top-0 flex h-full w-8 items-center justify-center rounded-r-sm border-l border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100">
        <CalenderIcon />
      </button>
    </div>
  );
};

const StockAdjustmentForm: React.FC<SalesInvoiceFormProps> = ({
  themeColor = '#0f3c63',
  onOverlayChange,
  data,
  onDataChange,
}) => {
  const themeStyles = {
    '--theme-primary': themeColor,
    '--theme-focus': '#60a5fa',
  } as React.CSSProperties;

  const [documentInventoryModal, setDocumentInventoryModal] = useState(false);
  const [locationMasterModal, setLocationMasterModal] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Customer | null>(null);

  const [categoryList, setCategoryList] = useState<DocumentCategoryInventory[]>([]);
  // Use 'any' here temporarily to handle the populated 'party' object flexible structure
  const [locationList, setLocationList] = useState<any[]>([]);
  const [customerList, setCustomerList] = useState<Customer[]>([]);

  const categoryColumns: ColumnDef<DocumentCategoryInventory>[] = [
    { header: 'Code', key: 'code', width: 'w-20' },
    { header: 'Name', key: 'name', width: 'flex-1' },
  ];

  const locationColumns: ColumnDef<LocationMasterType>[] = [
    { header: 'Code', key: 'code', width: 'w-20' },
    { header: 'Name', key: 'name', width: 'flex-1' },
  ];

  const partyColumns: ColumnDef<Customer>[] = [
    { header: 'Code', key: 'code', width: 'w-16' },
    { header: 'Name', key: 'cust_name', width: 'flex-1' },
    { header: 'Phone', key: 'phone', width: 'w-24' },
    { header: 'GST', key: 'gst_no', width: 'w-28' },
  ];

  useEffect(() => {
    loadCategories();
    loadLocations();
    loadCustomers();
  }, []);

  const loadCategories = async () => {
    try {
      const result = await fetchDocumentCategoryInventory();
      setCategoryList(result);
    } catch (error) {
      console.error(error);
    }
  };

  const loadLocations = async () => {
    try {
      const result = await fetchAllLocations();
      setLocationList(result);
    } catch (error) {
      console.error(error);
    }
  };

  const loadCustomers = async () => {
    try {
      const result = await getAllCustomers();
      setCustomerList(result);
    } catch (error) {
      console.error(error);
    }
  };

  // --- HELPER: Update Parent State ---
  const handleFieldChange = (field: keyof StockAdjustmentHeaderData, value: string) => {
    onDataChange({
      ...data,
      [field]: value,
    });
  };

  // --- SELECTION HELPERS (Updated to find by _id) ---
  const getSelectedCategoryObject = () =>
    categoryList.find((cat) => cat._id === data.category) || null;

  // IMPORTANT: This function now flattens the 'party' object if it exists
  const getSelectedLocationObject = () => {
    const selected = locationList.find((loc) => loc._id === data.store);
    if (!selected) return null;

    // Check if 'party' is a populated object (containing keys like cust_name, etc.)
    // If so, we replace it with just the _id string to prevent React "Object invalid child" errors
    if (selected.party && typeof selected.party === 'object') {
      return {
        ...selected,
        party: selected.party.code || '', // Flatten object to ID string
      };
    }

    return selected;
  };

  const getSelectedCustomerObject = () =>
    customerList.find((cust) => cust._id === data.party) || null;

  // --- HANDLERS ---
  const handleEditCategoryClick = () => setDocumentInventoryModal(true);
  const handleEditLocationClick = () => setLocationMasterModal(true);

  const handleEditCustomerClick = () => {
    const selectedCustomer = getSelectedCustomerObject();
    setEditingRow(selectedCustomer);
    setIsFormOpen(true);
    if (onOverlayChange) onOverlayChange(true);
  };

  const handleCustomerFormClose = () => {
    setIsFormOpen(false);
    setEditingRow(null);
    if (onOverlayChange) onOverlayChange(false);
  };

  const handleCustomerFormSuccess = () => {
    handleCustomerFormClose();
    loadCustomers();
  };

  // --- RENDER CUSTOMER FORM ---
  if (isFormOpen) {
    return (
      <div
        className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-md"
        style={themeStyles}>
        <div className="mb-4 border-b pb-4">
          <button
            onClick={handleCustomerFormClose}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-[var(--theme-primary)]">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </button>
        </div>
        <CrudCustomer
          onClose={handleCustomerFormClose}
          initialData={editingRow}
          onSuccess={handleCustomerFormSuccess}
        />
      </div>
    );
  }

  // --- RENDER MAIN FORM ---
  return (
    <>
      <div style={themeStyles} className="w-full rounded-lg border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            {/* CATEGORY */}
            <div className="grid grid-cols-12 items-center gap-3">
              <div className="col-span-4">
                <Label required>Category</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Dropdown
                    data={categoryList}
                    columns={categoryColumns}
                    value={data.category}
                    valueKey="code"
                    onChange={(item) => handleFieldChange('category', item?.code || '')}
                    placeholder="Select Category..."
                  />
                  <ActionBtn icon={<EditIcon size={16} />} onClick={handleEditCategoryClick} />
                </InputGroup>
              </div>
            </div>

            {/* STORE */}
            <div className="grid grid-cols-12 items-center gap-3">
              <div className="col-span-4">
                <Label required>Store</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Dropdown
                    data={locationList}
                    columns={locationColumns}
                    value={data.store}
                    valueKey="code"
                    onChange={(item) => handleFieldChange('store', item?.code || '')}
                    placeholder="Select Store..."
                  />
                  <ActionBtn icon={<EditIcon size={16} />} onClick={handleEditLocationClick} />
                </InputGroup>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            {/* PARTY (Customer) */}
            <div className="grid grid-cols-12 items-center gap-3">
              <div className="col-span-4">
                <Label>Party</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Dropdown
                    data={customerList}
                    columns={partyColumns}
                    value={data.party}
                    valueKey="code"
                    onChange={(item) => handleFieldChange('party', item?.code || '')}
                    placeholder="Select Party..."
                  />
                  <ActionBtn icon={<EditIcon size={16} />} onClick={handleEditCustomerClick} />
                </InputGroup>
              </div>
            </div>
            <div className="grid grid-cols-12 items-center gap-3">
              <div className="col-span-4">
                <Label>Voucher Date</Label>
              </div>
              <div className="col-span-8">
                <VoucherDateInput
                  value={data.voucherDate}
                  onChange={(e) => handleFieldChange('voucherDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* MODALS */}
        {documentInventoryModal && (
          <div className="fixed inset-0 z-[30] flex items-center justify-center bg-transparent bg-opacity-50 p-4 backdrop-blur-sm">
            <div className="relative h-auto w-auto overflow-hidden rounded-lg bg-white shadow-2xl">
              <DocumentInventoryModal
                isOpen={documentInventoryModal}
                onClose={() => setDocumentInventoryModal(false)}
                initialData={getSelectedCategoryObject()}
                onSuccess={() => loadCategories()}
              />
            </div>
          </div>
        )}

        {locationMasterModal && (
          <div className="fixed inset-0 z-[30] flex items-center justify-center bg-transparent bg-opacity-50 p-4 backdrop-blur-sm">
            <div className="relative overflow-hidden shadow-lg">
              <LocationMaster
                onClose={() => setLocationMasterModal(false)}
                // Updated: using the flattened data here
                initialData={getSelectedLocationObject()}
                onSuccess={() => loadLocations()}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StockAdjustmentForm;
