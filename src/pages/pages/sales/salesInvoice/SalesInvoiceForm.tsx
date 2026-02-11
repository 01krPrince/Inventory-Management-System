import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DocumentIcon, ChevronDownIcon, ChevronUpIcon } from '../../../../components/icons';
import { EditIcon } from 'lucide-react';
import Dropdown, { ColumnDef } from '../../../../components/Dropdown';
import CrudCustomer from '../customer/AddNewCustomer';
import { LocationMaster } from '../../../../components/LocationMaster';
import SalesExecutiveMaster from '../../../../components/SalesExecutiveMaster';

// --- Services ---
import { getAllCustomers } from '../../../../services/sales/customer/customerService';
import { fetchAllLocations } from '../../inventory/stockAdjustment/api/LocationMaster';
import { fetchSalesExecutives } from '../../../../components/addItemMaster/api/salesExecutiveService';
import DateInput from '../../../../components/DateInput';

// --- Types ---
export interface InvoiceFormData {
  gstType: string;
  cashCredit: string;

  // Store Info
  store: string; // Display Name
  storeCode?: string; // Internal Code

  // Customer Info
  customerId?: string; // Database ID
  customer?: string; // Display Name (FIXED)
  customerCode?: string; // Internal Code (NEW ADDITION)

  date: string;
  priceCategory: string;
  salesman: string;
  tax: string;
  placeOfSupply: string;
  shipTo: string;
  paymentTerms: string;
  paymentLink: string;
  email?: string;
  invoiceNo?: string;
  refNo?: string;

  // Auto-fill fields
  billToText?: string;
  shipToText?: string;
  gstNo?: string;
  contactPerson?: string;
}

interface SimpleOption {
  name: string;
  code?: string;
  id?: string;
}

interface ActionBtnProps {
  icon: React.ReactElement;
  onClick?: () => void;
}

interface SalesInvoiceFormProps {
  themeColor?: string;
  onSubmit?: (data: InvoiceFormData) => void;
  onFormChange?: (data: InvoiceFormData) => void;
}

export interface SalesInvoiceFormRef {
  triggerSubmit: () => void;
  getFormData: () => InvoiceFormData;
  resetForm: () => void;
}

// --- Helper Components ---
const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({
  children,
  required,
}) => (
  <label className="flex h-[30px] items-center whitespace-nowrap text-[13px] font-medium text-gray-700">
    {children} {required && <span className="ml-1 text-red-500">*</span>}
  </label>
);

const toOptions = (arr: string[]): SimpleOption[] => arr.map((s) => ({ name: s, code: '' }));

const mockData = {
  paymentTerms: toOptions(['Immediate', 'Net 15', 'Net 30']),
  paymentLinks: toOptions(['PayTM', 'Razorpay', 'Stripe', 'Direct Transfer']),
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

// --- MAIN COMPONENT ---
const SalesInvoiceForm = forwardRef<SalesInvoiceFormRef, SalesInvoiceFormProps>(
  ({ themeColor = '#0f3c63', onSubmit, onFormChange }, ref) => {
    // --- State ---
    const [storeOptions, setStoreOptions] = useState<SimpleOption[]>([]);
    const [customerOptions, setCustomerOptions] = useState<SimpleOption[]>([]);
    const [salesmanOptions, setSalesmanOptions] = useState<SimpleOption[]>([]);

    const [rawCustomers, setRawCustomers] = useState<any[]>([]);
    const [rawStores, setRawStores] = useState<any[]>([]);

    const [isBillToOpen, setBillToOpen] = useState<boolean>(false);
    const [isShipToOpen, setShipToOpen] = useState<boolean>(false);
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const getToday = () => new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState<InvoiceFormData>({
      gstType: 'BillOfSupply',
      cashCredit: 'Credit',
      store: '',
      storeCode: '',
      customer: '',
      customerCode: '', // Initialize new field
      customerId: '',
      date: getToday(),
      priceCategory: 'Default',
      salesman: '',
      tax: 'Inclusive',
      placeOfSupply: '',
      shipTo: '',
      paymentTerms: '',
      paymentLink: 'PayTM',
      email: '',
      invoiceNo: 'N/A',
      refNo: '',
      billToText: '',
      shipToText: '',
      gstNo: '',
      contactPerson: '',
    });

    // --- Column Definitions ---

    // 1. For Store & Customer (Show Code + Name)
    const codeColumns: ColumnDef<SimpleOption>[] = [
      { header: 'Code', key: 'code', width: 'w-24' },
      { header: 'Name', key: 'name', width: 'flex-1' },
    ];

    // 2. For everything else (Name Only)
    const nameColumns: ColumnDef<SimpleOption>[] = [
      { header: 'Name', key: 'name', width: 'flex-1' },
    ];

    const themeStyles = {
      '--theme-primary': themeColor,
      '--theme-secondary': themeColor,
      '--theme-focus': '#60a5fa',
    } as React.CSSProperties;

    // --- Load Data ---
    useEffect(() => {
      loadDropdownData();
    }, []);

    const loadDropdownData = async () => {
      try {
        // 1. STORES
        const storesData = await fetchAllLocations();
        setRawStores(storesData);

        const mappedStores = storesData.map((item: any) => ({
          name: item.name || item.storeName,
          id: item._id,
          code: item.code || item.storeCode || '',
        }));
        setStoreOptions(mappedStores);

        if (mappedStores.length > 0) {
          const firstStore = storesData[0];
          updateFormState({
            store: mappedStores[0].name,
            storeCode: (firstStore as any).code || (firstStore as any).storeCode || '',
          });
        }

        // 2. CUSTOMERS
        const customersData = await getAllCustomers();
        setRawCustomers(customersData);

        const mappedCustomers = customersData.map((item: any) => {
          const codeVal = item.code || item.cust_code || item.customer || item.identification || '';

          return {
            name: item.cust_name || item.name,
            id: item._id,
            code: codeVal,
          };
        });
        setCustomerOptions(mappedCustomers);

        // 3. SALESMEN
        const salesData = await fetchSalesExecutives();
        const mappedSalesmen = salesData.map((item: any) => ({
          name: item.name,
          id: item._id,
          code: item.code || '',
        }));
        setSalesmanOptions(mappedSalesmen);
      } catch (error) {
        console.error('Error loading dropdowns', error);
      }
    };

    // Helper to update state AND notify parent
    const updateFormState = (updates: Partial<InvoiceFormData>) => {
      setFormData((prev) => {
        const newData = { ...prev, ...updates };
        if (onFormChange) {
          onFormChange(newData);
        }
        return newData;
      });
    };

    // --- Dynamic Handler ---
    const handleDropdownChange = (field: keyof InvoiceFormData, item: SimpleOption | null) => {
      const value = item?.name || '';
      let extraUpdates: Partial<InvoiceFormData> = {};

      // === STORE SELECTION ===
      if (field === 'store' && item) {
        const fullStore = rawStores.find((s) => s._id === item.id);
        const sCode = fullStore?.code || fullStore?.storeCode || '';

        extraUpdates = {
          store: value, // Name (for UI)
          storeCode: sCode, // Code (for API)
        };
      }

      // === CUSTOMER SELECTION ===
      if (field === 'customer' && item) {
        const fullCustomer = rawCustomers.find(
          (c) => c._id === item.id || c.cust_name === item.name
        );

        if (fullCustomer) {
          const cCode =
            fullCustomer.code ||
            fullCustomer.cust_code ||
            fullCustomer.customer ||
            fullCustomer.identification ||
            '';

          const billTo = `${fullCustomer.cust_name}\n${fullCustomer.address || ''}\n${fullCustomer.city || ''}, ${fullCustomer.state || ''} - ${fullCustomer.pin_code || ''}\nPhone: ${fullCustomer.phone || ''}`;
          const shipTo = `${fullCustomer.cust_name}\n${fullCustomer.address_ship || fullCustomer.address || ''}\n${fullCustomer.city_ship || fullCustomer.city || ''}, ${fullCustomer.state_ship || fullCustomer.state || ''} - ${fullCustomer.pin_code_ship || fullCustomer.pin_code || ''}\nPhone: ${fullCustomer.phone_ship || fullCustomer.phone || ''}`;

          extraUpdates = {
            customerId: item.id,
            customer: value, // <--- FIXED: Set to Name (value), not code
            customerCode: cCode, // <--- FIXED: Save Code separately
            email: fullCustomer.email || '',
            priceCategory: fullCustomer.price_category || formData.priceCategory,
            salesman: fullCustomer.sales_executive || formData.salesman,
            placeOfSupply: fullCustomer.state || '',
            billToText: billTo,
            shipToText: shipTo,
            gstNo: fullCustomer.gst_no || '',
            contactPerson: fullCustomer.contact_person || '',
          };
        } else {
          extraUpdates = { customerId: item.id };
        }
      }

      updateFormState({ [field]: value, ...extraUpdates });
    };

    const handleInputChange = (field: keyof InvoiceFormData, value: string) => {
      updateFormState({ [field]: value });
    };

    useImperativeHandle(ref, () => ({
      triggerSubmit: () => {
        if (onSubmit) {
          if (!formData.customer) {
            alert('Please select a customer');
            return;
          }
          onSubmit(formData);
        }
      },
      getFormData: () => formData,

      resetForm: () => {
        setFormData((prev) => ({
          ...prev,
          // Clear Customer & Specific Details
          customer: '',
          customerCode: '',
          customerId: '',
          email: '',
          refNo: '',
          billToText: '',
          shipToText: '',
          gstNo: '',
          contactPerson: '',
          invoiceNo: '',
          paymentLink: 'PayTM',
          shipTo: '',

          /// keeping store, salesman, date
        }));
      },
    }));

    return (
      <div style={themeStyles} className="relative rounded border border-gray-200 bg-white p-5">
        <div className="grid grid-cols-12 gap-8">
          {/* LEFT COLUMN */}
          <div className="col-span-4 space-y-1">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>GST Type</Label>
              </div>
              <div className="col-span-8">
                <Dropdown
                  data={[
                    { name: 'BillOfSupply', code: '' },
                    { name: 'GST Invoice', code: '' },
                    { name: 'Intra', code: '' },
                    { name: 'Inter', code: '' },
                  ]}
                  columns={nameColumns}
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
                  data={[
                    { name: 'Credit', code: 'CR' },
                    { name: 'Cash', code: 'CS' },
                  ]}
                  columns={nameColumns}
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
                    columns={codeColumns}
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
                <Label required>Customer</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Dropdown
                    data={customerOptions}
                    columns={codeColumns}
                    value={formData.customer}
                    valueKey="name"
                    placeholder="Select Customer..."
                    onChange={(item) => handleDropdownChange('customer', item)}
                  />
                  <ActionBtn
                    icon={<EditIcon size={16} />}
                    onClick={() => setActiveModal('customer')}
                  />
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
                    data={[
                      { name: 'Wholesale', code: '' },
                      { name: 'Retail', code: '' },
                      { name: 'Default', code: '' },
                    ]}
                    columns={nameColumns}
                    value={formData.priceCategory}
                    valueKey="name"
                    onChange={(item) => handleDropdownChange('priceCategory', item)}
                  />
                </InputGroup>
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN */}
          <div className="col-span-4 space-y-1">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label required>Date</Label>
              </div>
              <div className="col-span-8">
                <DateInput
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Invoice No</Label>
              </div>
              <div className="col-span-8">
                <Input value={formData.invoiceNo} readOnly />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Ref No</Label>
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
                <Label>Salesman</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Dropdown
                    data={salesmanOptions}
                    columns={nameColumns}
                    value={formData.salesman}
                    valueKey="name"
                    onChange={(item) => handleDropdownChange('salesman', item)}
                  />
                  <ActionBtn
                    icon={<EditIcon size={14} />}
                    onClick={() => setActiveModal('salesman')}
                  />
                </InputGroup>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Tax</Label>
              </div>
              <div className="col-span-8">
                <Dropdown
                  data={[
                    { name: 'Inclusive', code: '' },
                    { name: 'Exclusive', code: '' },
                  ]}
                  columns={nameColumns}
                  value={formData.tax}
                  valueKey="name"
                  onChange={(i) => handleDropdownChange('tax', i)}
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-span-4 flex min-h-full flex-col">
            <AccordionSection
              title="Bill To"
              isOpen={isBillToOpen}
              onToggle={() => setBillToOpen(!isBillToOpen)}>
              <div className="space-y-2">
                <div className="relative">
                  <textarea
                    className="h-20 w-full resize-none rounded border border-gray-300 p-2 text-[13px] focus:outline-none"
                    value={formData.billToText}
                    onChange={(e) => handleInputChange('billToText', e.target.value)}
                  />
                  <span className="absolute bottom-1 right-2 text-[10px] text-gray-400">0/200</span>
                </div>
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
                    <Label>Contact Person</Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 items-center gap-2">
                  <div className="col-span-4">
                    <Label>Place of Supply</Label>
                  </div>
                  <div className="col-span-8">
                    <InputGroup>
                      <Input
                        value={formData.placeOfSupply}
                        onChange={(e) => handleInputChange('placeOfSupply', e.target.value)}
                      />
                    </InputGroup>
                  </div>
                </div>
              </div>
            </AccordionSection>

            <AccordionSection
              title="Ship To"
              isOpen={isShipToOpen}
              onToggle={() => setShipToOpen(!isShipToOpen)}>
              <div className="mb-2 flex items-center">
                <span className="w-16 whitespace-nowrap text-[13px] font-medium text-gray-600">
                  Ship To
                </span>
                <div className="relative flex w-full flex-grow">
                  <InputGroup>
                    <Dropdown
                      data={[
                        { name: 'Warehouse', code: '' },
                        { name: 'Store Front', code: '' },
                      ]}
                      columns={nameColumns}
                      value={formData.shipTo}
                      valueKey="name"
                      onChange={(item) => handleDropdownChange('shipTo', item)}
                    />
                    <ActionBtn
                      icon={<EditIcon size={14} />}
                      onClick={() => setActiveModal('shipto')}
                    />
                  </InputGroup>
                </div>
              </div>
              <textarea
                className="h-24 w-full resize-none rounded border border-gray-300 p-2 text-[13px] focus:outline-none"
                value={formData.shipToText}
                onChange={(e) => handleInputChange('shipToText', e.target.value)}></textarea>
            </AccordionSection>

            <div className="mt-auto space-y-1 pt-4">
              <div className="grid grid-cols-12 items-center gap-2">
                <div className="col-span-4">
                  <Label>Payment Terms</Label>
                </div>
                <div className="col-span-8">
                  <InputGroup>
                    <Dropdown
                      data={mockData.paymentTerms}
                      columns={nameColumns}
                      value={formData.paymentTerms}
                      valueKey="name"
                      onChange={(item) => handleDropdownChange('paymentTerms', item)}
                    />
                  </InputGroup>
                </div>
              </div>

              <div className="grid grid-cols-12 items-center gap-2">
                <div className="col-span-4">
                  <Label>Payment Link</Label>
                </div>
                <div className="col-span-8">
                  <Dropdown
                    data={mockData.paymentLinks}
                    columns={nameColumns}
                    value={formData.paymentLink}
                    valueKey="name"
                    onChange={(item) => handleDropdownChange('paymentLink', item)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* OVERLAY SYSTEM */}
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4 backdrop-blur-[2px]">
            <div>
              <div className="p-8">
                {activeModal === 'customer' && (
                  <CrudCustomer
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
                {activeModal === 'salesman' && (
                  <SalesExecutiveMaster
                    onClose={() => setActiveModal(null)}
                    onSuccess={() => {
                      setActiveModal(null);
                      loadDropdownData();
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default SalesInvoiceForm;
