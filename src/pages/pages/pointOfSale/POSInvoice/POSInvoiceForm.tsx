import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DocumentIcon, ChevronDownIcon, ChevronUpIcon } from '../../../../components/icons';
import {
  EditIcon,
  FileText,
  Minimize2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  PlusCircle,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import PosCustomerService from '../../../../services/pos/posCustomer';
import { fetchAllLocations } from '../../inventory/stockAdjustment/api/LocationMaster';
import PriceCategoryService from '../../../../services/price-category.service';
import Dropdown, { ColumnDef } from '../../../../components/Dropdown';
import DateInput from '../../../../components/DateInput';
import CounterMaster from '../../../../components/CounterMaster';
import SalesExecutiveMaster from '../../../../components/SalesExecutiveMaster';
import TenderTypeMaster from '../../../../components/TenderTypeMaster';
import State from '../../../../components/State';
import POSCustomerMaster from '../../../../components/POSCustomerMaster';

// --- Types ---
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

interface InputProps {
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

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

// --- Static / Shared Logic ---

const codeNameColumns: ColumnDef<DropdownItem>[] = [
  { header: 'Code', key: 'code', width: 'w-20' },
  { header: 'Name', key: 'name', width: 'w-full' },
];

const simpleColumns: ColumnDef<SimpleOption>[] = [
  { header: 'Code', key: 'code', width: 'w-20' },
  { header: 'Name', key: 'name', width: 'flex-1' },
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

// --- Customer Selector Component ---

interface CustomerSelectorProps {
  customers: any[];
  selected: any | null;
  onSelect: (item: any | null) => void;
  placeholder: string;
  withSearchButton?: boolean;
}

const CustomerSelector: React.FC<CustomerSelectorProps> = ({
  customers,
  selected,
  onSelect,
  placeholder,
  withSearchButton = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const triggerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(
    null
  );
  const [isPOSCustoemerOpen, setIsPOSCustoemerOpen] = useState<boolean>(false);

  const getDisplayName = (item: any) => {
    return item?.print_name || item?.cust_name || item?.name || '';
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        portalRef.current &&
        !portalRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const recalculatePosition = () => {
      if (open && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const gap = 4;
        const estimatedHeight = 320;
        const spaceBelow = window.innerHeight - rect.bottom;
        let top =
          spaceBelow < estimatedHeight && rect.top > estimatedHeight
            ? rect.top + window.pageYOffset - estimatedHeight - gap
            : rect.bottom + window.pageYOffset + gap;

        setPosition({ top, left: rect.left + window.pageXOffset, width: rect.width });
      }
    };

    if (open) {
      recalculatePosition();
      window.addEventListener('resize', recalculatePosition);
      window.addEventListener('scroll', recalculatePosition);
      return () => {
        window.removeEventListener('resize', recalculatePosition);
        window.removeEventListener('scroll', recalculatePosition);
      };
    }
  }, [open]);

  const filteredCustomers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    let list = customers;
    if (term) {
      list = customers.filter((item) => {
        const nameMatch = getDisplayName(item).toLowerCase().includes(term);
        const phoneMatch = (item.phone || '').includes(term);
        return nameMatch || phoneMatch;
      });
    }
    return [...list].sort((a, b) => getDisplayName(a).localeCompare(getDisplayName(b)));
  }, [customers, searchTerm]);

  return (
    <div className="w-full">
      <div ref={triggerRef} className="relative w-full">
        <div className="flex w-full items-center">
          <input
            type="text"
            readOnly
            value={getDisplayName(selected)}
            placeholder={placeholder}
            onClick={() => setOpen(true)}
            className="h-[30px] w-full cursor-pointer rounded-sm border border-gray-300 bg-white px-2 text-[13px] text-gray-700 focus:border-[var(--theme-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-focus)]"
          />
          {withSearchButton && (
            <ActionBtn
              icon={<PlusCircle size={14} />}
              onClick={() => setIsPOSCustoemerOpen(true)}
            />
          )}
          {!withSearchButton && (
            <ChevronDown
              size={16}
              className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
            />
          )}
        </div>
      </div>

      {open &&
        position &&
        createPortal(
          <div
            ref={portalRef}
            className="fixed z-[10000] max-h-[320px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-2xl"
            style={{ top: position.top, left: position.left, width: position.width }}>
            <div className="sticky top-0 border-b border-gray-100 bg-gray-50 px-1 py-1">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-[28px] w-full rounded border border-gray-300 px-2 text-[12px] focus:border-[var(--theme-focus)] focus:ring-1"
              />
            </div>
            <div className="max-h-[260px] w-full overflow-y-auto text-[12px]">
              {selected && (
                <button
                  type="button"
                  onClick={() => {
                    onSelect(null);
                    setOpen(false);
                    setSearchTerm('');
                  }}
                  className="flex w-full items-center gap-2 px-2 py-1 text-[12px] text-red-500 hover:bg-red-50">
                  <span className="flex-1 text-left italic">-- Clear selection --</span>
                </button>
              )}
              {filteredCustomers.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">No customers found</div>
              ) : (
                filteredCustomers.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelect(item);
                      setOpen(false);
                      setSearchTerm('');
                    }}
                    className="flex cursor-pointer items-center gap-2 px-2 py-1 text-[12px] transition-colors hover:bg-blue-50 hover:text-[var(--theme-primary)]">
                    <div className="w-20 shrink-0 truncate font-medium">{item.code}</div>
                    <div className="flex-1 truncate">{getDisplayName(item)}</div>
                    <div className="w-24 shrink-0 text-right text-gray-500">
                      {item.phone || '-'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>,
          document.body
        )}

      {isPOSCustoemerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <POSCustomerMaster onClose={() => setIsPOSCustoemerOpen(false)} index={20} />
        </div>
      )}
    </div>
  );
};

// --- Main Form Component ---

const POSInvoiceForm: React.FC<POSInvoiceFormProps> = ({
  data,
  onChange,
  themeColor = '#0f3c63',
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBillToOpen, setBillToOpen] = useState<boolean>(true);
  // const [isShipToOpen, setShipToOpen] = useState<boolean>(false);
  const [isCustomerOpen, setIsCustomerOpen] = useState<boolean>(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(true);

  const [isCounterMasterOpen, setIsCounterMasterOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isSalesExecutiveMasterOpen, setIsSalesExecutiveMasterOpen] = useState(false);
  const [isTenderTypeOpen, setIsTenderTypeOpen] = useState(false);

  const [storeOptions, setStoreOptions] = useState<SimpleOption[]>([]);
  const [, setPriceCategoryOptions] = useState<SimpleOption[]>([]);
  const [posCustomerOptions, setPosCustomerOptions] = useState<any[]>([]);
  const [selectedCustomerUI, setSelectedCustomerUI] = useState<any>(null);

  const nestedModalZIndex = 30;

  const themeStyles = {
    '--theme-primary': themeColor,
    '--theme-secondary': themeColor,
    '--theme-focus': '#60a5fa',
  } as React.CSSProperties;

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const storeData = await fetchAllLocations();
        setStoreOptions(
          storeData.map((loc: any) => ({ name: loc.name, code: loc.code, id: loc._id }))
        );

        const priceCategoryRes = await PriceCategoryService.getAllPriceCategories();
        setPriceCategoryOptions(
          priceCategoryRes.data.map((cat) => ({ name: cat.name, code: cat.code, id: cat._id }))
        );

        const posCustomerRes = await PosCustomerService.getAllCustomers();
        setPosCustomerOptions(
          posCustomerRes.data.map((cust) => ({
            id: cust._id,
            print_name: cust.print_name,
            cust_name: cust.cust_name,
            name: cust.name,
            code: cust.code,
            phone: cust.phone,
            address: cust.address,
            city: cust.city,
            state: cust.state,
            pin: cust.pin,
            gst_category: cust.gst_category,
          }))
        );
      } catch (error) {
        console.error('Error loading initial form data:', error);
      }
    };
    loadInitialData();
  }, [isCustomerOpen]);

  useEffect(() => {
    if (!data.customerName) {
      setSelectedCustomerUI(null);
    } else {
      const matchingCustomer = posCustomerOptions.find(
        (cust) =>
          (cust.print_name || cust.cust_name || cust.name) === data.customerName ||
          cust.code === data.customerCode
      );
      setSelectedCustomerUI(matchingCustomer || null);
    }
  }, [data.customerName, data.customerCode, posCustomerOptions]);

  const handleCustomerChange = (item: any | null) => {
    if (!item) {
      ['customerName', 'customerCode', 'customerPhone', 'gstNo', 'billingAddress'].forEach((k) =>
        onChange(k, '')
      );
      setSelectedCustomerUI(null);
      return;
    }
    const name = item.print_name || item.cust_name || item.name || '';
    onChange('customerName', name);
    onChange('customerCode', item.code);
    onChange('customerPhone', item.phone);
    onChange('gstNo', item.gst_category === 'Unregistered' ? '' : item.gst_no || '');
    onChange(
      'billingAddress',
      [item.address, item.city, item.state, item.pin].filter(Boolean).join(', ')
    );
    setSelectedCustomerUI(item);
  };

  const selectedStoreName =
    storeOptions.find((loc) => loc.code === data.store)?.name || data.store || '';

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
                className="flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-gray-800">
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
              <div className="animate-in fade-in grid grid-cols-1 gap-3 rounded-md border border-gray-100 bg-gray-50 p-2 md:grid-cols-3">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-3">
                    <Label required>Customer</Label>
                  </div>
                  <div className="col-span-9">
                    <CustomerSelector
                      customers={posCustomerOptions}
                      selected={selectedCustomerUI}
                      onSelect={handleCustomerChange}
                      placeholder="Search by name or phone..."
                      withSearchButton={true}
                    />
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
              <div className="animate-in fade-in slide-in-from-top-2 grid grid-cols-12 gap-8">
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
                          value={selectedStoreName} // Pass the derived NAME for the UI display
                          valueKey="name"
                          onChange={(item) => onChange('store', item?.code || '')} // Send the CODE to your payload
                          placeholder="Select Store..."
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
                      <Label>Ref No</Label>
                    </div>
                    <div className="col-span-8">
                      <Input
                        value={data.refNo}
                        onChange={(e) => onChange('refNo', e.target.value)}
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
                          <Label required>Customer</Label>
                        </div>
                        <div className="col-span-8">
                          <CustomerSelector
                            customers={posCustomerOptions}
                            selected={selectedCustomerUI}
                            onSelect={handleCustomerChange}
                            placeholder="Select Customer..."
                            withSearchButton={true}
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
                        <span className="truncate">
                          {selectedCustomerUI?.print_name ||
                            selectedCustomerUI?.cust_name ||
                            selectedCustomerUI?.name ||
                            data.customerName ||
                            'N/A'}
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
                      className="h-24 w-full resize-none rounded border border-gray-300 p-2 text-[13px] outline-none focus:ring-1"
                    />
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
