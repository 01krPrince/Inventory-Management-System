import React, { useState } from 'react';
import { DocumentIcon, ChevronDownIcon, ChevronUpIcon } from '../../../../components/icons';
import Dropdown, { ColumnDef } from '../../../../components/Dropdown';
import DateInput from '../../../../components/DateInput';
import { Search, EditIcon } from 'lucide-react';

import CounterMaster from '../../../../components/CounterMaster';
import SalesExecutiveMaster from '../../../../components/SalesExecutiveMaster';
import TenderTypeMaster from '../../../../components/TenderTypeMaster';
import State from '../../../../components/State';

interface DropdownItem {
  name: string;
  code?: string;
  [key: string]: any;
}

interface MockData {
  gstTypes: DropdownItem[];
  salesmen: DropdownItem[];
  paymentModes: DropdownItem[];
  tenderAccounts: DropdownItem[];
  states: DropdownItem[];
  creditTypes: string[];
  stores: string[];
  customers: string[];
  paymentLinks: string[];
  shipToOptions: string[];
}

const mockData: MockData = {
  gstTypes: [
    { name: 'BillOfSupply', code: 'BOS' },
    { name: 'GST Invoice', code: 'GST' },
    { name: 'Export', code: 'EXP' },
  ],
  salesmen: [
    { name: 'Alice', code: 'SM01' },
    { name: 'Bob', code: 'SM02' },
    { name: 'Charlie', code: 'SM03' },
  ],
  paymentModes: [
    { name: 'Cash', code: 'CASH' },
    { name: 'Card', code: 'CARD' },
    { name: 'UPI', code: 'UPI' },
  ],
  tenderAccounts: [
    { name: 'Main Cash', code: 'AC01' },
    { name: 'Petty Cash', code: 'AC02' },
    { name: 'Bank HDFC', code: 'BK01' },
  ],
  states: [
    { name: 'Delhi', code: 'DL' },
    { name: 'Haryana', code: 'HR' },
    { name: 'Uttar Pradesh', code: 'UP' },
    { name: 'Maharashtra', code: 'MH' },
  ],
  creditTypes: ['Credit', 'Cash'],
  stores: ['SPORTS HUB', 'TECH WORLD', 'FASHION POINT'],
  customers: ['John Doe', 'Jane Smith', 'Acme Corp'],
  paymentLinks: ['PayTM', 'Razorpay', 'Stripe', 'Direct Transfer'],
  shipToOptions: ['Warehouse A', 'Warehouse B', 'Store Front'],
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
}

const Input: React.FC<InputProps> = ({ value, placeholder, readOnly, onChange }) => (
  <input
    type="text"
    readOnly={readOnly}
    onChange={onChange}
    className={`h-[30px] w-full rounded-sm border border-gray-300 px-2 text-[13px] text-gray-700 focus:border-[var(--theme-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-focus)] ${
      readOnly ? 'cursor-not-allowed bg-gray-100 text-gray-500' : 'bg-white'
    }`}
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

interface SalesInvoiceFormProps {
  themeColor?: string;
}

const POSOrderForm: React.FC<SalesInvoiceFormProps> = ({ themeColor = '#0f3c63' }) => {
  const [isBillToOpen, setBillToOpen] = useState<boolean>(true);
  const [isShipToOpen, setShipToOpen] = useState<boolean>(false);
  const [isCustomerOpen, setIsCustomerOpen] = useState<boolean>(false);

  const [isCounterMasterOpen, setIsCounterMasterOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);

  const [isSalesExecutiveMasterOpen, setIsSalesExecutiveMasterOpen] = useState(false);
  const [isTenderTypeOpen, setIsTenderTypeOpen] = useState(false);
  const overlayZIndex = 10;
  const nestedModalZIndex = overlayZIndex + 20;

  const [formData, setFormData] = useState({
    counter: 'BillOfSupply',
    salesman: '',
    paymentMode: '',
    advanceTender: '',
    state: '',
    city: '',
    orderDate: '',
    deliveryDate: '',
    refDate: '',
    refNo: '',
  });

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const themeStyles = {
    '--theme-primary': themeColor,
    '--theme-secondary': themeColor,
    '--theme-focus': '#60a5fa',
  } as React.CSSProperties;

  const defaultColumns: ColumnDef<DropdownItem>[] = [
    { header: 'Name', key: 'name', width: 'w-full' },
  ];
  const codeNameColumns: ColumnDef<DropdownItem>[] = [
    { header: 'Code', key: 'code', width: 'w-20' },
    { header: 'Name', key: 'name', width: 'w-full' },
  ];

  const handleState = () => {
    setIsStateOpen(true);
  };

  return (
    <div style={themeStyles} className="relative rounded border border-gray-200 bg-white p-5">
      {isCounterMasterOpen && <CounterMaster onClose={() => setIsCounterMasterOpen(false)} />}

      {isStateOpen && <State onClose={() => setIsStateOpen(false)} />}

      {isSalesExecutiveMasterOpen && (
        <SalesExecutiveMaster onClose={() => setIsSalesExecutiveMasterOpen(false)} />
      )}

      {isTenderTypeOpen && (
        <TenderTypeMaster onClose={() => setIsTenderTypeOpen(false)} index={nestedModalZIndex} />
      )}

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-4 space-y-1">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Counter</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Dropdown
                  data={mockData.gstTypes}
                  columns={defaultColumns}
                  value={formData.counter}
                  valueKey="name"
                  onChange={(item) => handleFieldChange('counter', item?.name || '')}
                  placeholder="Select Counter..."
                />
                <ActionBtn
                  icon={<EditIcon size={16} />}
                  onClick={() => setIsCounterMasterOpen(true)}
                />
              </InputGroup>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Order Date</Label>
            </div>
            <div className="col-span-8">
              <DateInput
                value={formData.orderDate}
                onChange={(e) => handleFieldChange('orderDate', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label required>Order No</Label>
            </div>
            <div className="col-span-8">
              <Input value="ORD-2025-0001" readOnly />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label required>Customer</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Input value="" placeholder="Find by name/email/phone" />
                <ActionBtn icon={<Search />} />
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
                  value={formData.salesman}
                  valueKey="name"
                  onChange={(item) => handleFieldChange('salesman', item?.name || '')}
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
              <Label>Payment Mode</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Dropdown
                  data={mockData.paymentModes}
                  columns={defaultColumns}
                  value={formData.paymentMode}
                  valueKey="name"
                  onChange={(item) => handleFieldChange('paymentMode', item?.name || '')}
                  placeholder="Select Mode..."
                />
              </InputGroup>
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-1">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label required>Delivery Date</Label>
            </div>
            <div className="col-span-8">
              <DateInput
                value={formData.deliveryDate}
                onChange={(e) => handleFieldChange('deliveryDate', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Ref No</Label>
            </div>
            <div className="col-span-8">
              <Input
                value={formData.refNo}
                onChange={(e) => handleFieldChange('refNo', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Ref.Date</Label>
            </div>
            <div className="col-span-8">
              <DateInput
                value={formData.refDate}
                onChange={(e) => handleFieldChange('refDate', e.target.value)}
              />
            </div>
          </div>

          <div className="mt-auto space-y-1 pt-4">
            <div className="grid grid-cols-12 items-center gap-2">
              <div className="col-span-4">
                <Label>Advance Tender A/c</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Dropdown
                    data={mockData.tenderAccounts}
                    columns={defaultColumns}
                    value={formData.advanceTender}
                    valueKey="name"
                    onChange={(item) => handleFieldChange('advanceTender', item?.name || '')}
                    placeholder="Select Account..."
                  />
                  <ActionBtn
                    icon={<EditIcon size={16} />}
                    onClick={() => setIsTenderTypeOpen(true)}
                  />
                </InputGroup>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2">
              <div className="col-span-4">
                <Label>Advance amount</Label>
              </div>
              <div className="col-span-8">
                <Input value="0.00" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-4 flex min-h-full flex-col">
          <AccordionSection
            title="Customer"
            isOpen={isCustomerOpen}
            onToggle={() => setIsCustomerOpen(!isCustomerOpen)}>
            <div className="grid grid-cols-1 gap-x-10 gap-y-3 text-sm text-gray-700 md:grid-cols-2">
              <div className="flex gap-2">
                <span className="font-medium">Name:</span>
                <span>AMIT</span>
              </div>

              <div className="flex gap-2">
                <span className="font-medium">Last Visit:</span>
                <span>12-07-2025</span>
              </div>

              <div className="flex gap-2">
                <span className="font-medium">Bill Amount:</span>
                <span>258</span>
              </div>

              <div className="flex gap-2">
                <span className="font-medium">Item:</span>
                <span>258</span>
              </div>

              <div className="flex gap-2">
                <span className="font-medium">Phone:</span>
                <span>9140712317</span>
              </div>

              <div className="flex gap-2">
                <span className="font-medium">Email:</span>
                <span>-</span>
              </div>

              <div className="flex gap-2">
                <span className="font-medium">DOB:</span>
                <span>-</span>
              </div>

              <div className="flex gap-2">
                <span className="font-medium">Anniversary:</span>
                <span>-</span>
              </div>

              <div className="flex gap-2">
                <span className="font-medium">Balance Point:</span>
                <span>0</span>
              </div>

              <div className="flex gap-2">
                <span className="font-medium">O/S:</span>
                <span>₹0.00</span>
              </div>
            </div>
          </AccordionSection>

          <AccordionSection
            title="Bill To"
            isOpen={isBillToOpen}
            onToggle={() => setBillToOpen(!isBillToOpen)}>
            <textarea
              placeholder="Billing Address..."
              className="h-24 w-full resize-none rounded border border-gray-300 p-2 text-[13px] outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)]"
            />
          </AccordionSection>

          <AccordionSection
            title="Ship To"
            isOpen={isShipToOpen}
            onToggle={() => setShipToOpen(!isShipToOpen)}>
            <div className="relative mb-2">
              <textarea
                placeholder="Shipping Address..."
                className="h-24 w-full resize-none rounded border border-gray-300 p-2 text-[13px] outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)]"
              />
              <span className="absolute bottom-1 right-2 text-[10px] text-gray-400">0/200</span>
            </div>
            <div className="mb-2 flex items-center gap-2">
              <span className="w-16 shrink-0 text-[13px] text-gray-600">State</span>
              <div className="col-span-12 w-full">
                <InputGroup>
                  <Dropdown
                    data={mockData.states}
                    columns={codeNameColumns}
                    value={formData.state}
                    valueKey="name"
                    onChange={(item) => handleFieldChange('state', item?.name || '')}
                    placeholder="Select State..."
                  />
                  <button onClick={handleState}>
                    <ActionBtn icon={<EditIcon size={16} />} />
                  </button>
                </InputGroup>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-[13px] text-gray-600">City</span>
              <div className="w-full min-w-0 flex-grow">
                <Input
                  value={formData.city}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  placeholder="Enter City"
                />
              </div>
            </div>
          </AccordionSection>
        </div>
      </div>
    </div>
  );
};

export default POSOrderForm;
