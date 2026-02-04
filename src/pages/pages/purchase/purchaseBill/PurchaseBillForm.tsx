import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DocumentIcon, ChevronDownIcon, ChevronUpIcon } from '../../../../components/icons';
import { EditIcon } from 'lucide-react';
import Dropdown, { ColumnDef } from '../../../../components/Dropdown';
import { LocationMaster } from '../../../../components/LocationMaster';
import CrudVendor from '../vendor/pages/AddNewVendor';
import NameAndCodeMaster from '../../../../components/NameAndCodeComponent';
import { getAllVendors } from '../vendor/api/vendorService';
import { fetchAllLocations } from '../../inventory/stockAdjustment/api/LocationMaster';
import DateInput from '../../../../components/DateInput';

export interface PurchaseBillFormData {
  gstType: string;
  cashCredit: string;

  ecommerceInvoiceNo?: string;
  contactNo?: string;

  store: string;
  storeId?: string;
  storeCode?: string;

  vendor: string;
  vendorId?: string;
  vendorCode?: string;

  priceCategory: string;
  tax: string;
  placeOfSupply: string;
  shipTo: string;
  paymentTerms: string;
  email?: string;
  orderNo?: string;
  refNo?: string;

  orderDate: string;
  refDate: string;
  dueDate: string;

  billToText?: string;
  shipToText?: string;
  gstNo?: string;
  contactPerson?: string;
}

interface SimpleOption {
  name: string;
  id?: string;
  code?: string;
}

interface ActionBtnProps {
  icon: React.ReactElement;
  onClick?: () => void;
}

interface PurchaseBillFormProps {
  themeColor?: string;
  onSubmit?: (data: PurchaseBillFormData) => void;
  onFormChange?: (data: PurchaseBillFormData) => void;
}

export interface PurchaseBillFormRef {
  triggerSubmit: () => void;
  getFormData: () => PurchaseBillFormData;
  resetForm: () => void; // <--- Added resetForm to interface
}

const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({
  children,
  required,
}) => (
  <label className="flex h-[30px] items-center whitespace-nowrap text-[13px] font-medium text-gray-700">
    {children} {required && <span className="ml-1 text-red-500">*</span>}
  </label>
);

const toOptions = (arr: string[]): SimpleOption[] => arr.map((s) => ({ name: s }));

const mockData = {
  gstTypes: toOptions([
    'TaxInvoice',
    'Import',
    'ReverseCharges',
    'BillOfSupply_Compounding',
    'BillOfSupply_UnRegistered',
    'BillOfSupply_Exempted',
    'BillOfSupply_NilRated',
    'BillOfSupply_NonGST',
    'BranchTransfer',
  ]),
  cashCredit: toOptions(['Cash', 'Credit']),
  priceCategories: toOptions(['Wholesale', 'Retail', 'Distributor']),
  taxOptions: toOptions(['Inclusive', 'Exclusive']),
  paymentTerms: toOptions(['Net 30', 'Immediate', 'Cash on Delivery']),
};

const InputGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative flex w-full items-center gap-1">{children}</div>
);

const Input: React.FC<{
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, placeholder, readOnly, onChange }) => (
  <input
    type="text"
    className={`h-[30px] w-full rounded-sm border border-gray-300 bg-white px-2 text-[13px] text-gray-700 focus:border-[var(--theme-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-focus)] ${
      readOnly ? 'bg-gray-50' : ''
    }`}
    value={value || ''}
    onChange={onChange}
    placeholder={placeholder}
    readOnly={readOnly}
  />
);

const ActionBtn: React.FC<ActionBtnProps> = ({ icon, onClick }) => (
  <button
    onClick={onClick}
    type="button"
    className="z-10 ml-[-1px] flex h-[32px] w-[32px] items-center justify-center rounded-sm border border-[var(--theme-primary)] bg-[var(--theme-primary)] text-white shadow-sm transition-opacity hover:opacity-90">
    {icon}
  </button>
);

const AccordionSection: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, isOpen, onToggle, children }) => (
  <div className="mb-2 rounded border border-gray-200 bg-white">
    <div
      onClick={onToggle}
      className="flex cursor-pointer select-none items-center justify-between border-b border-transparent px-3 py-2 transition-colors hover:bg-gray-50">
      <div className="flex items-center gap-2 text-sm font-bold text-[var(--theme-secondary)]">
        <DocumentIcon className="h-5 w-5" />
        <span>{title}</span>
      </div>
      <div className="text-[var(--theme-secondary)]">
        {isOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
      </div>
    </div>
    {isOpen && <div className="border-t border-gray-100 p-3">{children}</div>}
  </div>
);

const PurchaseBillForm = forwardRef<PurchaseBillFormRef, PurchaseBillFormProps>(
  ({ themeColor = '#0f3c63', onSubmit, onFormChange }, ref) => {
    const [storeOptions, setStoreOptions] = useState<SimpleOption[]>([]);
    const [vendorOptions, setVendorOptions] = useState<SimpleOption[]>([]);

    const [rawVendors, setRawVendors] = useState<any[]>([]);
    const [rawStores, setRawStores] = useState<any[]>([]);

    const [isBillToOpen, setBillToOpen] = useState<boolean>(false);
    const [isShipToOpen, setShipToOpen] = useState<boolean>(false);
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const getToday = () => new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState<PurchaseBillFormData>({
      gstType: 'TaxInvoice',
      cashCredit: 'Credit',
      store: '',
      storeId: '',
      storeCode: '',
      vendor: '',
      vendorId: '',
      vendorCode: '',
      priceCategory: 'Wholesale',
      tax: 'Inclusive',
      placeOfSupply: '',
      shipTo: '',
      paymentTerms: '',
      email: '',
      orderNo: '',
      refNo: '',
      orderDate: getToday(),
      refDate: getToday(),
      dueDate: getToday(),
      billToText: '',
      shipToText: '',
      gstNo: '',
      contactPerson: '',
    });

    const simpleColumns: ColumnDef<SimpleOption>[] = [
      { header: 'Name', key: 'name', width: 'flex-1' },
    ];

    const themeStyles = {
      '--theme-primary': themeColor,
      '--theme-secondary': themeColor,
      '--theme-focus': '#60a5fa',
    } as React.CSSProperties;

    const updateFormState = (updates: Partial<PurchaseBillFormData>) => {
      setFormData((prev) => {
        const newData = { ...prev, ...updates };
        if (onFormChange) {
          onFormChange(newData);
        }
        return newData;
      });
    };

    useEffect(() => {
      loadDropdownData();
    }, []);

    const loadDropdownData = async () => {
      try {
        const storesData = await fetchAllLocations();
        setRawStores(storesData);
        const mappedStores = storesData.map((item: any) => ({
          name: item.name || item.storeName,
          id: item._id,
        }));
        setStoreOptions(mappedStores);

        if (mappedStores.length > 0) {
          const firstStore = storesData[0];
          updateFormState({
            store: mappedStores[0].name,
            storeId: mappedStores[0].id,
            storeCode: firstStore.code || '',
          });
        }

        const vendorsData = await getAllVendors();
        setRawVendors(vendorsData);
        const mappedVendors = vendorsData.map((item: any) => ({
          name: item.vend_name || item.name,
          id: item._id,
        }));
        setVendorOptions(mappedVendors);
      } catch (error) {
        console.error('Error loading dropdowns', error);
      }
    };

    const handleDropdownChange = (field: keyof PurchaseBillFormData, item: SimpleOption | null) => {
      const value = item?.name || '';
      let updates: Partial<PurchaseBillFormData> = { [field]: value };

      if (field === 'vendor' && item) {
        const fullVendor = rawVendors.find((v) => v._id === item.id);
        updates = {
          ...updates,
          contactNo: fullVendor.phone || '',
          gstNo: fullVendor.gst_no || '',
          ecommerceInvoiceNo: '',
        };
      }

      if (field === 'vendor' && item) {
        const fullVendor = rawVendors.find((v) => v._id === item.id);
        if (fullVendor) {
          const vCode = fullVendor.code || fullVendor.vend_code || '';

          const billTo = `${fullVendor.vend_name || fullVendor.name || ''}\n${fullVendor.address || ''}\n${fullVendor.city || ''}, ${fullVendor.state || ''} - ${fullVendor.pin_code || ''}\nPhone: ${fullVendor.phone || ''}`;
          const shipToAddress = `${fullVendor.vend_name || fullVendor.name || ''}\n${fullVendor.address_ship || fullVendor.address || ''}\n${fullVendor.city_ship || fullVendor.city || ''}, ${fullVendor.state_ship || fullVendor.state || ''} - ${fullVendor.pin_code_ship || fullVendor.pin_code || ''}\nPhone: ${fullVendor.phone_ship || fullVendor.phone || ''}`;

          updates = {
            ...updates,
            vendorId: item.id,
            vendorCode: vCode,
            email: fullVendor.email || '',
            priceCategory: fullVendor.price_category || formData.priceCategory,
            paymentTerms: fullVendor.payment_term || formData.paymentTerms,
            placeOfSupply: fullVendor.state || '',
            billToText: billTo,
            shipToText: shipToAddress,
            gstNo: fullVendor.gst_no || '',
            contactPerson: fullVendor.contact_person || '',
          };
        }
      }

      updateFormState(updates);
    };

    const handleInputChange = (field: keyof PurchaseBillFormData, value: string) => {
      updateFormState({ [field]: value });
    };

    useImperativeHandle(ref, () => ({
      triggerSubmit: () => {
        if (onSubmit) {
          if (!formData.vendor) {
            alert('Please select a vendor');
            return;
          }
          onSubmit(formData);
        }
      },
      getFormData: () => formData,
      resetForm: () => {
        // Reset Logic
        // We preserve the first store logic if available
        const defaultStore = storeOptions.length > 0 ? storeOptions[0] : null;
        const defaultStoreData = rawStores.length > 0 ? rawStores[0] : null;

        const resetData: PurchaseBillFormData = {
          gstType: 'TaxInvoice',
          cashCredit: 'Credit',
          store: defaultStore ? defaultStore.name : '',
          storeId: defaultStore ? defaultStore.id : '',
          storeCode: defaultStoreData ? defaultStoreData.code || '' : '',
          vendor: '',
          vendorId: '',
          vendorCode: '',
          priceCategory: 'Wholesale',
          tax: 'Inclusive',
          placeOfSupply: '',
          shipTo: '',
          paymentTerms: '',
          email: '',
          orderNo: '',
          refNo: '',
          orderDate: getToday(),
          refDate: getToday(),
          dueDate: getToday(),
          billToText: '',
          shipToText: '',
          gstNo: '',
          contactPerson: '',
        };

        updateFormState(resetData);
        setBillToOpen(false);
        setShipToOpen(false);
      },
    }));

    return (
      <div style={themeStyles} className="relative rounded border border-gray-200 bg-white p-5">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4 space-y-1">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>GST Type</Label>
              </div>
              <div className="col-span-8">
                <Dropdown
                  data={mockData.gstTypes}
                  columns={simpleColumns}
                  value={formData.gstType}
                  valueKey="name"
                  onChange={(i) => handleDropdownChange('gstType', i)}
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Cash/Credit</Label>
              </div>
              <div className="col-span-8">
                <Dropdown
                  data={mockData.cashCredit}
                  columns={simpleColumns}
                  value={formData.cashCredit}
                  valueKey="name"
                  onChange={(i) => handleDropdownChange('cashCredit', i)}
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label required>Store</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Dropdown
                    data={storeOptions}
                    columns={simpleColumns}
                    value={formData.store}
                    valueKey="name"
                    onChange={(item) => handleDropdownChange('store', item)}
                  />
                  <ActionBtn
                    icon={<EditIcon size={14} />}
                    onClick={() => setActiveModal('store')}
                  />
                </InputGroup>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label required>Vendor</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Dropdown
                    data={vendorOptions}
                    columns={simpleColumns}
                    value={formData.vendor}
                    valueKey="name"
                    placeholder="Select Vendor..."
                    onChange={(item) => handleDropdownChange('vendor', item)}
                  />
                  <ActionBtn
                    icon={<EditIcon size={16} />}
                    onClick={() => setActiveModal('vendor')}
                  />
                  {/* <ActionBtn icon={<BarChart2 size={14} />} /> */}
                </InputGroup>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Email</Label>
              </div>
              <div className="col-span-8">
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Price Category</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Dropdown
                    data={mockData.priceCategories}
                    columns={simpleColumns}
                    value={formData.priceCategory}
                    valueKey="name"
                    onChange={(item) => handleDropdownChange('priceCategory', item)}
                  />
                  <ActionBtn
                    icon={<EditIcon size={16} />}
                    onClick={() => setActiveModal('priceCategory')}
                  />
                </InputGroup>
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-1">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label required>Date</Label>
              </div>
              <div className="col-span-8">
                <DateInput
                  value={formData.orderDate}
                  onChange={(e) => handleInputChange('orderDate', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Invoice No</Label>
              </div>
              <div className="col-span-8">
                <Input
                  readOnly
                  // value={formData.orderNo}
                  value="N/A"
                  onChange={(e) => handleInputChange('orderNo', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Supplier Inv No</Label>
              </div>
              <div className="col-span-8">
                <Input
                  value={formData.refNo}
                  onChange={(e) => handleInputChange('refNo', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Supplier Inv Date</Label>
              </div>
              <div className="col-span-8">
                <DateInput
                  value={formData.refDate}
                  onChange={(e) => handleInputChange('refDate', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Tax</Label>
              </div>
              <div className="col-span-8">
                <Dropdown
                  data={mockData.taxOptions}
                  columns={simpleColumns}
                  value={formData.tax}
                  valueKey="name"
                  onChange={(i) => handleDropdownChange('tax', i)}
                />
              </div>
            </div>
          </div>

          <div className="col-span-4 flex min-h-full flex-col">
            <AccordionSection
              title="Billing Address"
              isOpen={isBillToOpen}
              onToggle={() => setBillToOpen(!isBillToOpen)}>
              <div className="space-y-2">
                <textarea
                  className="h-20 w-full resize-none rounded border border-gray-300 p-2 text-[13px] focus:outline-none"
                  value={formData.billToText}
                  onChange={(e) => handleInputChange('billToText', e.target.value)}
                />
                <div className="grid grid-cols-12 items-center gap-2">
                  <div className="col-span-4">
                    <Label>GST No</Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={formData.gstNo}
                      onChange={(e) => handleInputChange('gstNo', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 items-center gap-2">
                  <div className="col-span-4">
                    <Label>Place of Supply</Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={formData.placeOfSupply}
                      onChange={(e) => handleInputChange('placeOfSupply', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </AccordionSection>

            <AccordionSection
              title="Delivery At"
              isOpen={isShipToOpen}
              onToggle={() => setShipToOpen(!isShipToOpen)}>
              <div className="mb-2 flex items-center">
                <span className="w-16 whitespace-nowrap text-[13px] font-medium text-gray-600">
                  Delivery At
                </span>
                <Dropdown
                  data={storeOptions}
                  columns={simpleColumns}
                  value={formData.shipTo}
                  valueKey="name"
                  onChange={(item) => handleDropdownChange('shipTo', item)}
                />
              </div>
              <textarea
                className="h-24 w-full resize-none rounded border border-gray-300 p-2 text-[13px] focus:outline-none"
                value={formData.shipToText}
                onChange={(e) => handleInputChange('shipToText', e.target.value)}
              />
            </AccordionSection>

            <div className="mt-auto space-y-1 pt-4">
              <div className="grid grid-cols-12 items-center gap-2">
                <div className="col-span-4">
                  <Label>Payment Terms</Label>
                </div>
                <div className="col-span-8">
                  <Dropdown
                    data={mockData.paymentTerms}
                    columns={simpleColumns}
                    value={formData.paymentTerms}
                    valueKey="name"
                    onChange={(item) => handleDropdownChange('paymentTerms', item)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 items-center gap-2">
                <div className="col-span-4">
                  <Label>Due Date</Label>
                </div>
                <div className="col-span-8">
                  <DateInput
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4 backdrop-blur-[2px]">
            <div className="p-8">
              {activeModal === 'vendor' && (
                <CrudVendor
                  onClose={() => setActiveModal(null)}
                  onSuccess={() => {
                    setActiveModal(null);
                    loadDropdownData();
                  }}
                  initialData={null}
                />
              )}
              {activeModal === 'store' && (
                <LocationMaster
                  onClose={() => setActiveModal(null)}
                  onSuccess={() => {
                    setActiveModal(null);
                    loadDropdownData();
                  }}
                  initialData={null}
                />
              )}
              {activeModal === 'priceCategory' && (
                <NameAndCodeMaster
                  title="Price Category"
                  onClose={() => setActiveModal(null)}
                  index={1200}
                />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default PurchaseBillForm;
