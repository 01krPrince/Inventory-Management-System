import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { createPortal } from 'react-dom';
import CustomerService from '../../../../services/posCustomerService';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(
    null
  );

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        portalRef.current &&
        !portalRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        // Optional: clear search when closing
        // setSearchTerm('');
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  // Focus search input when opened
  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  // Calculate position
  useEffect(() => {
    const recalculatePosition = () => {
      if (open && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const gap = 4;
        const estimatedHeight = 400; // approx max height of dropdown
        const spaceBelow = window.innerHeight - rect.bottom;

        let top;
        if (spaceBelow < estimatedHeight && rect.top > estimatedHeight) {
          top = rect.top + window.pageYOffset - estimatedHeight - gap;
        } else {
          top = rect.bottom + window.pageYOffset + gap;
        }

        setPosition({
          top,
          left: rect.left + window.pageXOffset,
          width: rect.width,
        });
      } else {
        setPosition(null);
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

  const lowerTerm = searchTerm.toLowerCase().trim();

  const getMatchScore = (item: any, term: string): number => {
    if (!term) return 0;
    const nameLower = (item.print_name || '').toLowerCase();
    const phoneStr = item.phone || '';
    let score = 0;
    if (nameLower === term) score += 100;
    if (nameLower.startsWith(term)) score += 50;
    if (nameLower.includes(term)) score += 10;
    if (phoneStr === searchTerm) score += 95;
    if (phoneStr.startsWith(searchTerm)) score += 45;
    if (phoneStr.includes(searchTerm)) score += 5;
    return score;
  };

  const filteredCustomers = useMemo(() => {
    let list = customers;
    if (lowerTerm || searchTerm) {
      list = customers.filter((item) => {
        const nameMatch = (item.print_name || '').toLowerCase().includes(lowerTerm);
        const phoneMatch = (item.phone || '').includes(searchTerm);
        return nameMatch || phoneMatch;
      });
    }
    return [...list].sort((a, b) => {
      const scoreA = getMatchScore(a, lowerTerm);
      const scoreB = getMatchScore(b, lowerTerm);
      if (scoreA !== scoreB) return scoreB - scoreA;
      return (a.print_name || '').localeCompare(b.print_name || '');
    });
  }, [customers, lowerTerm, searchTerm]);

  const displayInput = (
    <input
      type="text"
      readOnly
      value={selected?.print_name || ''}
      placeholder={placeholder}
      onClick={() => setOpen(true)}
      className="h-[30px] w-full cursor-pointer rounded-sm border border-gray-300 bg-white px-2 text-[13px] text-gray-700 focus:border-[var(--theme-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-focus)]"
    />
  );

  return (
    <div ref={containerRef} className="w-full">
      <div ref={triggerRef} className="relative w-full">
        {withSearchButton ? (
          <div className="flex w-full items-center">
            {displayInput}
            <ActionBtn icon={<Search size={16} />} onClick={() => setOpen(true)} />
          </div>
        ) : (
          <>
            {displayInput}
            <ChevronDown
              size={16}
              className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </>
        )}
      </div>

      {open &&
        position &&
        createPortal(
          <div
            ref={portalRef}
            className="fixed z-[10000] max-h-96 w-auto overflow-y-auto rounded-md border border-gray-300 bg-white shadow-xl"
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
            }}>
            <div className="sticky top-0 border-b border-gray-200 bg-white">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-[30px] w-full px-3 text-[13px] outline-none"
              />
            </div>
            <div className="max-h-[352px] overflow-y-auto">
              {selected && (
                <div
                  onClick={() => {
                    onSelect(null);
                    setOpen(false);
                    setSearchTerm('');
                  }}
                  className="flex cursor-pointer items-center px-3 py-2 text-[13px] text-red-600 hover:bg-red-50">
                  <div className="w-32 shrink-0"></div>
                  <div className="flex-1 italic">-- Clear selection --</div>
                </div>
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
                    className="flex cursor-pointer items-center px-3 py-1.5 text-[13px] hover:bg-gray-100">
                    <div className="w-28 shrink-0 text-gray-600">{item.phone || '-'}</div>
                    <div className="flex-1 truncate">{item.print_name}</div>
                  </div>
                ))
              )}
            </div>
          </div>,
          document.body
        )}
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
          // gst_no: cust.gst_no,
        }));
        setPosCustomerOptions(mappedPosCustomers);
      } catch (error) {
        console.error('Error loading initial form data:', error);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (!data.customerName) {
      setSelectedCustomerUI(null);
    } else {
      const matchingCustomer = posCustomerOptions.find(
        (cust) => cust.print_name === data.customerName || cust.code === data.customerCode
      );

      if (matchingCustomer) {
        setSelectedCustomerUI(matchingCustomer);
      } else {
        setSelectedCustomerUI(null);
      }
    }
  }, [data.customerName, data.customerCode, posCustomerOptions]);

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
                          <CustomerSelector
                            customers={posCustomerOptions}
                            selected={selectedCustomerUI}
                            onSelect={handleCustomerChange}
                            placeholder="Select Customer..."
                            withSearchButton={false}
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
