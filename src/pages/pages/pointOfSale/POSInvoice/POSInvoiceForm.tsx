import React, { useState, useEffect } from 'react';
import { DocumentIcon, ChevronDownIcon, ChevronUpIcon } from '../../../../components/icons';
import {
  Search,
  EditIcon,
  FileText,
  Minimize2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import CustomerService, { PosCustomer } from '../../../../services/posCustomerService';
import { fetchAllLocations } from '../../inventory/stockAdjustment/api/LocationMaster';
import PriceCategoryService from '../../../../services/price-category.service';
import Dropdown, { ColumnDef } from '../../../../components/Dropdown';
import DateInput from '../../../../components/DateInput';
import CounterMaster from '../../../../components/CounterMaster';
import SalesExecutiveMaster from '../../../../components/SalesExecutiveMaster';
import TenderTypeMaster from '../../../../components/TenderTypeMaster';
import State from '../../../../components/State';

interface DropdownItem {
  name: string;
  code?: string;
  [key: string]: any;
}

interface SimpleOption {
  name: string;
  id?: string;
  code?: string;
}

interface POSInvoiceFormProps {
  data: any;
  onChange: (field: string, value: any) => void;
  themeColor?: string;
}

interface MockData {
  salesmen: DropdownItem[];
  states: DropdownItem[];
}

const codeNameColumns: ColumnDef<DropdownItem>[] = [
  { header: 'Code', key: 'code', width: 'w-20' },
  { header: 'Name', key: 'name', width: 'w-full' },
];

const mockData: MockData = {
  salesmen: [
    { name: 'Alice', code: 'SM01' },
    { name: 'Bob', code: 'SM02' },
    { name: 'Charlie', code: 'SM03' },
  ],
  states: [
    { name: 'Delhi', code: 'DL' },
    { name: 'Haryana', code: 'HR' },
    { name: 'Uttar Pradesh', code: 'UP' },
    { name: 'Maharashtra', code: 'MH' },
  ],
};

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

const Input: React.FC<InputProps> = ({ value, placeholder, readOnly, onChange, className }) => (
  <input
    type="text"
    readOnly={readOnly}
    onChange={onChange}
    className={`h-[30px] w-full rounded-sm border border-gray-300 px-2 text-[13px] text-gray-700 focus:border-[var(--theme-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-focus)] ${
      readOnly ? 'cursor-not-allowed bg-gray-100 text-gray-500' : 'bg-white'
    } ${className || ''}`}
    value={value}
    placeholder={placeholder}
  />
);

const ActionBtn: React.FC<{ icon: React.ReactNode; onClick?: () => void }> = ({
  icon,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="z-10 ml-[-1px] flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-sm border border-[var(--theme-primary)] bg-[var(--theme-primary)] text-white transition-opacity hover:opacity-90">
    <span className="flex h-3 w-3 items-center justify-center">{icon}</span>
  </button>
);

const AccordionSection: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, isOpen, onToggle, children }) => {
  return (
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
};

const POSInvoiceForm: React.FC<POSInvoiceFormProps> = ({
  data,
  onChange,
  themeColor = '#0f3c63',
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const [isBillToOpen, setBillToOpen] = useState<boolean>(true);
  const [isShipToOpen, setShipToOpen] = useState<boolean>(false);
  const [isCustomerOpen, setIsCustomerOpen] = useState<boolean>(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(true);

  const [isCounterMasterOpen, setIsCounterMasterOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isSalesExecutiveMasterOpen, setIsSalesExecutiveMasterOpen] = useState(false);
  const [isTenderTypeOpen, setIsTenderTypeOpen] = useState(false);

  const [storeOptions, setStoreOptions] = useState<SimpleOption[]>([]);
  const [priceCategoryOptions, setPriceCategoryOptions] = useState<SimpleOption[]>([]);
  const [posCustomerOptions, setPosCustomerOptions] = useState<any[]>([]);

  const [selectedCustomerUI, setSelectedCustomerUI] = useState<any>(null);

  const nestedModalZIndex = 30;

  const themeStyles = {
    '--theme-primary': themeColor,
    '--theme-secondary': themeColor,
    '--theme-focus': '#60a5fa',
  } as React.CSSProperties;

  const simpleColumns: ColumnDef<SimpleOption>[] = [
    { header: 'Name', key: 'name', width: 'flex-1' },
  ];

  const posCustomerDropdown: ColumnDef<PosCustomer>[] = [
    { header: 'Phone', key: 'phone', width: 'w-32' },
    { header: 'Name', key: 'print_name', width: 'flex-1' },
  ];

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const storeData = await fetchAllLocations();
        const mappedStores = storeData.map((loc: any) => ({
          name: loc.name,
          code: loc.code,
          id: loc._id,
        }));
        setStoreOptions(mappedStores);

        const priceCategoryRes = await PriceCategoryService.getAllPriceCategories();
        const mappedPriceCategories = priceCategoryRes.data.map((cat) => ({
          name: cat.name,
          code: cat.code,
          id: cat._id,
        }));
        setPriceCategoryOptions(mappedPriceCategories);

        const posCustomerRes = await CustomerService.getAllCustomers();
        const mappedPosCustomers = posCustomerRes.data.map((cust) => ({
          id: cust._id,
          print_name: cust.print_name || cust.cust_name,
          name: cust.cust_name,
          code: cust.code,
          phone: cust.phone,
          address: cust.address,
          city: cust.city,
          state: cust.state,
          pin: cust.pin,
          gst_category: cust.gst_category,
        }));
        setPosCustomerOptions(mappedPosCustomers);
      } catch (error) {
        console.error('Error loading initial form data:', error);
      }
    };

    loadInitialData();
  }, []);

  const handleCustomerChange = (item: any | null) => {
    if (!item) {
      onChange('customerName', '');
      onChange('customerCode', '');
      onChange('customerPhone', '');
      onChange('gstNo', '');
      onChange('billingAddress', '');
      setSelectedCustomerUI(null);
      return;
    }

    onChange('customerName', item.print_name);
    onChange('customerCode', item.code);
    onChange('customerPhone', item.phone);
    onChange('gstNo', item.gst_category === 'Unregistered' ? '' : item.gst_no || '');

    const fullAddress = [item.address, item.city, item.state, item.pin].filter(Boolean).join(', ');
    onChange('billingAddress', fullAddress);

    setSelectedCustomerUI(item);
  };

  const handleStoreChange = (item: SimpleOption | null) => {
    onChange('store', item?.name || '');
  };

  return (
    <div style={themeStyles} className="w-full">
      {isCounterMasterOpen && <CounterMaster onClose={() => setIsCounterMasterOpen(false)} />}
      {isStateOpen && <State onClose={() => setIsStateOpen(false)} />}
      {isSalesExecutiveMasterOpen && (
        <SalesExecutiveMaster onClose={() => setIsSalesExecutiveMasterOpen(false)} />
      )}
      {isTenderTypeOpen && (
        <TenderTypeMaster onClose={() => setIsTenderTypeOpen(false)} index={nestedModalZIndex} />
      )}

      <div className="my-0 overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm transition-all duration-300">
        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-1">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => setIsOpen(!isOpen)}>
            <FileText className="text-[var(--theme-primary)]" size={16} />
            <h3 className="text-sm font-semibold text-[var(--theme-primary)]">POS Order</h3>
          </div>

          <div className="flex items-center gap-4">
            {isOpen && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-xs font-medium text-gray-700 transition-colors hover:text-gray-800">
                {isExpanded ? (
                  <>
                    <Minimize2 size={12} /> Collapse
                  </>
                ) : (
                  <>
                    <ExternalLink size={12} /> Expand
                  </>
                )}
              </button>
            )}

            <div className="cursor-pointer text-gray-500" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>
        </div>

        {isOpen && (
          <div className={isExpanded ? 'p-5' : 'p-2'}>
            {!isExpanded && (
              <div className="animate-in fade-in grid grid-cols-1 gap-3 rounded-md border border-gray-100 bg-gray-50 p-2 duration-300 md:grid-cols-3">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Label required>Customer</Label>
                  </div>
                  <div className="col-span-8">
                    <InputGroup>
                      <Dropdown
                        data={posCustomerOptions}
                        columns={posCustomerDropdown}
                        value={data.customerName}
                        valueKey="print_name"
                        onChange={handleCustomerChange}
                        placeholder="Search by name or phone..."
                      />
                      <ActionBtn icon={<Search size={16} />} />
                    </InputGroup>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-[80px] shrink-0">
                    <Label>Voucher No</Label>
                  </div>
                  <div className="flex-grow">
                    <Input
                      readOnly
                      value={data.voucherNo}
                      placeholder="N/A"
                      onChange={(e) => onChange('voucherNo', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-[40px] shrink-0">
                    <Label>Date</Label>
                  </div>
                  <div className="flex-grow">
                    <DateInput
                      value={data.billDate}
                      onChange={(e) => onChange('billDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {isExpanded && (
              <div className="animate-in fade-in slide-in-from-top-2 grid grid-cols-12 gap-8 duration-300">
                <div className="col-span-4 space-y-1">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Store</Label>
                    </div>
                    <div className="col-span-8">
                      <InputGroup>
                        <Dropdown
                          data={storeOptions}
                          columns={simpleColumns}
                          value={data.store}
                          valueKey="name"
                          onChange={handleStoreChange}
                          placeholder="Select Store/Counter..."
                        />
                        <ActionBtn
                          icon={<EditIcon size={14} />}
                          onClick={() => setIsCounterMasterOpen(true)}
                        />
                      </InputGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Salesman</Label>
                    </div>
                    <div className="col-span-8">
                      <InputGroup>
                        <Dropdown
                          data={mockData.salesmen}
                          columns={codeNameColumns}
                          value={data.salesman}
                          valueKey="name"
                          onChange={(item) => onChange('salesman', item?.name || '')}
                          placeholder="Select Salesman..."
                        />
                        <ActionBtn
                          icon={<EditIcon size={16} />}
                          onClick={() => setIsSalesExecutiveMasterOpen(true)}
                        />
                      </InputGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Price Category</Label>
                    </div>
                    <div className="col-span-8">
                      <InputGroup>
                        <Dropdown
                          data={priceCategoryOptions}
                          columns={codeNameColumns}
                          value={data.priceCategory}
                          valueKey="name"
                          onChange={(item) => onChange('priceCategory', item?.name || '')}
                          placeholder="Select Price Category..."
                        />
                      </InputGroup>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Ref No</Label>
                    </div>
                    <div className="col-span-8">
                      <Input
                        value={data.refNo}
                        onChange={(e) => onChange('refNo', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>GST No (If B2B)</Label>
                    </div>
                    <div className="col-span-8">
                      <Input
                        value={data.gstNo}
                        onChange={(e) => onChange('gstNo', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Delivery Type</Label>
                    </div>
                    <div className="col-span-8">
                      <Input
                        value={data.deliveryType}
                        onChange={(e) => onChange('deliveryType', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Ref.Date</Label>
                    </div>
                    <div className="col-span-8">
                      <DateInput
                        value={data.refDate}
                        onChange={(e) => onChange('refDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-4 space-y-1">
                  <AccordionSection
                    title="Order Details"
                    isOpen={isDetailsOpen}
                    onToggle={() => setIsDetailsOpen(!isDetailsOpen)}>
                    <div className="space-y-1">
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-4">
                          <Label>Voucher No</Label>
                        </div>
                        <div className="col-span-8">
                          <Input
                            readOnly
                            value={data.voucherNo}
                            placeholder="N/A"
                            onChange={(e) => onChange('voucherNo', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-4">
                          <Label>Date</Label>
                        </div>
                        <div className="col-span-8">
                          <DateInput
                            value={data.billDate}
                            onChange={(e) => onChange('billDate', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-4">
                          <Label required>Customer</Label>
                        </div>
                        <div className="col-span-8">
                          <Dropdown
                            data={posCustomerOptions}
                            columns={posCustomerDropdown}
                            value={data.customerName}
                            valueKey="print_name"
                            onChange={handleCustomerChange}
                            placeholder="Select Customer..."
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionSection>
                </div>

                <div className="col-span-4 flex min-h-full flex-col">
                  <AccordionSection
                    title="Customer"
                    isOpen={isCustomerOpen}
                    onToggle={() => setIsCustomerOpen(!isCustomerOpen)}>
                    <div className="grid grid-cols-1 gap-x-10 gap-y-3 text-sm text-gray-700 md:grid-cols-2">
                      <div className="flex gap-2">
                        <span className="font-medium">Name:</span>
                        <span className="truncate" title={selectedCustomerUI?.print_name || 'N/A'}>
                          {selectedCustomerUI?.print_name || data.customerName || 'N/A'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-medium">Phone:</span>
                        <span>{selectedCustomerUI?.phone || data.customerPhone || 'N/A'}</span>
                      </div>

                      <div className="col-span-2 flex gap-2">
                        <span className="font-medium">Address:</span>
                        <span className="truncate">
                          {selectedCustomerUI?.address || data.billingAddress || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </AccordionSection>

                  <AccordionSection
                    title="Bill To"
                    isOpen={isBillToOpen}
                    onToggle={() => setBillToOpen(!isBillToOpen)}>
                    <textarea
                      placeholder="Billing Address..."
                      value={data.billingAddress || ''}
                      onChange={(e) => onChange('billingAddress', e.target.value)}
                      className="h-24 w-full resize-none rounded border border-gray-300 p-2 text-[13px] outline-none focus:border-[var(--theme-focus)] focus:ring-1"
                    />
                  </AccordionSection>

                  <AccordionSection
                    title="Ship To"
                    isOpen={isShipToOpen}
                    onToggle={() => setShipToOpen(!isShipToOpen)}>
                    <div className="relative mb-2">
                      <textarea
                        placeholder="Shipping Address..."
                        value={data.shippingAddress?.fullAddress || ''}
                        onChange={(e) => {
                          const updatedShip = {
                            ...data.shippingAddress,
                            fullAddress: e.target.value,
                          };
                          onChange('shippingAddress', updatedShip);
                        }}
                        className="h-24 w-full resize-none rounded border border-gray-300 p-2 text-[13px] outline-none focus:border-[var(--theme-focus)] focus:ring-1"
                      />
                    </div>
                  </AccordionSection>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default POSInvoiceForm;
