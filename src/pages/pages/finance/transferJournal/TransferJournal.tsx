import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { EditIcon, Save } from 'lucide-react';
import Dropdown, { ColumnDef } from '../../../../components/Dropdown';
import { LocationMaster } from '../../../../components/LocationMaster';
import DateInput from '../../../../components/DateInput';
import { fetchAllLocations } from '../../inventory/stockAdjustment/api/LocationMaster';
import Attachment from '../../../../components/Attachment';
import chartOfAccountService from '../../../../services/chartOfAccountService';
// import ChartOfAccounts from '../../../../components/ChartOfAccount';

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

  fromCashBankAc?: string;
  toCashBankAc?: string;
  bankChargesGl?: string;
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
  resetForm: () => void;
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

const glColumns: ColumnDef<any>[] = [
  { header: 'Code', key: 'code', width: 'w-1/5' },
  { header: 'Name', key: 'name', width: 'w-2/5' },
  { header: 'Group', key: 'underGroup', width: 'w-2/5' },
];

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

const TransferJournal = forwardRef<PurchaseBillFormRef, PurchaseBillFormProps>(
  ({ themeColor = '#0f3c63', onSubmit, onFormChange }, ref) => {
    const [storeOptions, setStoreOptions] = useState<SimpleOption[]>([]);

    const [rawVendors] = useState<any[]>([]);
    const [rawStores, setRawStores] = useState<any[]>([]);

    const [, setBillToOpen] = useState<boolean>(false);
    const [, setShipToOpen] = useState<boolean>(false);
    // const [showChartOfAccounts, setShowChartOfAccounts] = useState(false);

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
      fromCashBankAc: '',
      toCashBankAc: '',
      bankChargesGl: '',
    });

    const simpleColumns: ColumnDef<SimpleOption>[] = [
      { header: 'Name', key: 'name', width: 'flex-1' },
    ];

    const [headerGlOptions, setHeaderGlOptions] = useState<any[]>([]);
    const [glOptions, setGlOptions] = useState<any[]>([]);

    useEffect(() => {
      loadDropdownData();
    }, []);

    // New useEffect for GL Options data
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

    const loadDropdownData = async () => {
      try {
        const storesData = await fetchAllLocations();
        setRawStores(storesData);
        const mappedStores = storesData.map((item: any) => ({
          name: item.name || item.storeName,
          id: item._id,
          code: item.storeCode || item.code || '',
        }));
        setStoreOptions(mappedStores);

        if (mappedStores.length > 0) {
          const firstStore = storesData[0];
          updateFormState({
            store: mappedStores[0].name,
            storeId: mappedStores[0].id,
            storeCode: (firstStore as any).code || (firstStore as any).storeCode || '',
          });
        }
      } catch (error) {
        console.error('Error loading dropdowns', error);
      }
    };

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

    const handleDropdownChange = (field: keyof PurchaseBillFormData, item: SimpleOption | null) => {
      const value = item?.name || '';
      let updates: Partial<PurchaseBillFormData> = { [field]: value };

      if (field === 'vendor' && item) {
        const fullVendor = rawVendors.find((v) => v._id === item.id);
        if (fullVendor) {
          updates = {
            ...updates,
            contactNo: fullVendor.phone || '',
            gstNo: fullVendor.gst_no || '',
            ecommerceInvoiceNo: '',
          };
        }
      }

      if (field === 'store' && item) {
        const fullStore = rawStores.find((s) => s._id === item.id);
        const sCode = fullStore?.code || fullStore?.storeCode || '';
        updates = {
          ...updates,
          store: value,
          storeCode: sCode,
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
        const defaultStore = storeOptions.length > 0 ? storeOptions[0] : null;
        const defaultStoreData = rawStores.length > 0 ? rawStores[0] : null;

        const resetData: PurchaseBillFormData = {
          gstType: 'TaxInvoice',
          cashCredit: 'Credit',
          store: defaultStore ? defaultStore.name : '',
          storeId: defaultStore ? (defaultStore.id as string) : '',
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
          fromCashBankAc: '',
          toCashBankAc: '',
          bankChargesGl: '',
        };

        updateFormState(resetData);
        setBillToOpen(false);
        setShipToOpen(false);
      },
    }));

    return (
      <div
        style={themeStyles}
        className="relative flex h-full flex-col rounded border border-gray-200 bg-white p-5">
        {/* Main Form Area */}
        <div className="grid flex-1 grid-cols-12 gap-8">
          <div className="col-span-4 space-y-1">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Category</Label>
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
                <Label required>Date</Label>
              </div>
              <div className="col-span-8">
                <DateInput
                  value={formData.orderDate}
                  onChange={(e) => handleInputChange('orderDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-1">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Voucher No</Label>
              </div>
              <div className="col-span-8">
                <Input
                  readOnly
                  value="N/A"
                  onChange={(e) => handleInputChange('orderNo', e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
              <div className="w-full sm:w-40">
                <Label required>From Cash or Bank</Label>
              </div>
              <div className="flex flex-1 gap-1">
                <div className="w-full">
                  <Dropdown
                    data={headerGlOptions}
                    columns={glColumns}
                    value={formData.fromCashBankAc}
                    valueKey="name"
                    onChange={(i) => handleInputChange('fromCashBankAc', i?.name || '')}
                    placeholder="Select Account..."
                  />
                </div>
                <ActionBtn icon={<EditIcon size={14} />} />
              </div>
            </div>

            <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
              <div className="w-full sm:w-40">
                <Label required>To Cash or Bank</Label>
              </div>
              <div className="flex flex-1 gap-1">
                <div className="w-full">
                  <Dropdown
                    data={headerGlOptions}
                    columns={glColumns}
                    value={formData.toCashBankAc}
                    valueKey="name"
                    onChange={(i) => handleInputChange('toCashBankAc', i?.name || '')}
                    placeholder="Select Account..."
                  />
                </div>
                <ActionBtn icon={<EditIcon size={14} />} />
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-1">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Amount</Label>
              </div>
              <div className="col-span-8">
                <Input
                  readOnly
                  value="N/A"
                  onChange={(e) => handleInputChange('orderNo', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Check No</Label>
              </div>
              <div className="col-span-8">
                <Input
                  value={formData.refNo}
                  onChange={(e) => handleInputChange('refNo', e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
              <div className="w-full sm:w-40">
                <Label required>Bank Charges GL</Label>
              </div>
              <div className="flex flex-1 gap-1">
                <div className="w-full">
                  <Dropdown
                    data={glOptions}
                    columns={glColumns}
                    value={formData.bankChargesGl}
                    valueKey="name"
                    onChange={(i) => handleInputChange('bankChargesGl', i?.name || '')}
                    placeholder="Select Ledger"
                    className="h-full border-none bg-transparent"
                  />
                </div>
                <ActionBtn icon={<EditIcon size={14} />} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Attachment />
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <Label>General Remarks</Label>
              <div className="relative">
                <textarea
                  className="h-24 w-full rounded-sm border border-gray-300 p-2 text-xs focus:border-[#0f3c63] focus:outline-none"
                  value={''}
                  // onChange={(e) => handleHeaderChange('remarks', e.target.value)}
                  placeholder="Enter voucher notes..."
                />
                <span className="absolute bottom-2 right-2 text-[10px] text-gray-400">
                  {''}/250
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button className="flex transform items-center gap-2 rounded-sm bg-[#0c4a75] px-10 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0f3c63] active:scale-95">
                <Save size={16} /> Save
              </button>
            </div>
          </div>
        </div>

        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4 backdrop-blur-[2px]">
            <div className="p-8">
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
            </div>
          </div>
        )}

        {/* {showChartOfAccounts && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
            style={{ zIndex: 1000 }}>
            <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded bg-white shadow-lg">
              <ChartOfAccounts
                isOpen={showChartOfAccounts}
                onClose={() => setShowChartOfAccounts(false)}
                initialData={coaFormData}
                onSave={handleSaveCOA}
              />
            </div>
          </div>
        )} */}
      </div>
    );
  }
);

export default TransferJournal;
