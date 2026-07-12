import React, { useState } from "react";
import {
  ChartIcon,
  CalenderIcon,
  DocumentIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "../../../../components/icons";
import { EditIcon } from "lucide-react";

import Dropdown, { ColumnDef } from "../../../../components/Dropdown";

interface SimpleOption {
  name: string;
}

interface MockData {
  gstTypes: SimpleOption[];
  stores: SimpleOption[];
  customers: SimpleOption[];
  priceCategories: SimpleOption[];
  salesmen: SimpleOption[];
  taxOptions: SimpleOption[];
  shipToOptions: SimpleOption[];
  paymentTerms: SimpleOption[];
  placeOfSupply: SimpleOption[];
}

const toOptions = (arr: string[]): SimpleOption[] =>
  arr.map((s) => ({ name: s }));

const mockData: MockData = {
  gstTypes: toOptions(["BillOfSupply", "GST Invoice", "Export"]),
  stores: toOptions(["SPORTS HUB", "TECH WORLD", "FASHION POINT"]),
  customers: toOptions(["John Doe", "Jane Smith", "Acme Corp"]),
  priceCategories: toOptions(["Retail", "Wholesale", "Dealer"]),
  salesmen: toOptions(["Alice", "Bob", "Charlie"]),
  taxOptions: toOptions(["Inclusive", "Exclusive"]),
  shipToOptions: toOptions(["Warehouse A", "Warehouse B", "Store Front"]),
  paymentTerms: toOptions(["Immediate", "Net 15", "Net 30"]),
  placeOfSupply: toOptions(["Bihar", "Delhi", "Maharashtra", "Uttar Pradesh"]),
};

interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
}

interface InputGroupProps {
  children: React.ReactNode;
}

interface InputProps {
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
}

interface DateFieldProps {
  value: string;
}

interface ActionBtnProps {
  icon: React.ReactNode;
}

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

interface SalesInvoiceFormProps {
  themeColor?: string;
}

const Label: React.FC<LabelProps> = ({ children, required }) => (
  <label className="text-[13px] text-gray-700 font-medium flex items-center h-[30px] whitespace-nowrap">
    {children} {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const InputGroup: React.FC<InputGroupProps> = ({ children }) => (
  <div className="flex items-center w-full relative gap-1">{children}</div>
);

const Input: React.FC<InputProps> = ({ value, placeholder, readOnly }) => (
  <input
    type="text"
    className={`w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)] ${
      readOnly ? "bg-gray-50" : ""
    }`}
    defaultValue={value}
    placeholder={placeholder}
    readOnly={readOnly}
  />
);

const DateField: React.FC<DateFieldProps> = ({ value }) => (
  <div className="relative w-full">
    <input
      type="text"
      className="w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)]"
      defaultValue={value}
    />
    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
      <CalenderIcon className="w-4 h-4" />
    </div>
  </div>
);

const ActionBtn: React.FC<ActionBtnProps> = ({ icon }) => (
  <button className="h-[30px] w-[30px] bg-[var(--theme-primary)] text-white flex items-center justify-center rounded-sm border border-[var(--theme-primary)] hover:opacity-90 transition-opacity ml-[-1px] z-10 shadow-sm">
    <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
  </button>
);

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className="mb-2 border border-gray-200 rounded bg-white">
      <div
        onClick={onToggle}
        className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors select-none border-b border-transparent"
      >
        <div className="flex items-center gap-2 text-[var(--theme-secondary)] font-bold text-sm">
          <DocumentIcon className="w-5 h-5" />
          <span>{title}</span>
        </div>
        <div className="text-[var(--theme-secondary)]">
          {isOpen ? (
            <ChevronUpIcon className="w-5 h-5" />
          ) : (
            <ChevronDownIcon className="w-5 h-5" />
          )}
        </div>
      </div>

      {isOpen && <div className="p-3 border-t border-gray-100">{children}</div>}
    </div>
  );
};

const DispatchForm: React.FC<SalesInvoiceFormProps> = ({
  themeColor = "#0f3c63",
}) => {
  const [isBillToOpen, setBillToOpen] = useState<boolean>(false);
  const [isShipToOpen, setShipToOpen] = useState<boolean>(false);

  const themeStyles = {
    "--theme-primary": themeColor,
    "--theme-secondary": themeColor,
    "--theme-focus": "#60a5fa",
  } as React.CSSProperties;

  const simpleColumns: ColumnDef<SimpleOption>[] = [
    { header: "Name", key: "name", width: "flex-1" },
  ];

  const handleDropdownChange = (item: SimpleOption | null) => {
    console.log("Selected:", item);
  };

  return (
    <div
      style={themeStyles}
      className="bg-white rounded border border-gray-200 p-5"
    >
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-4 space-y-1">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>GST Type</Label>
            </div>
            <div className="col-span-8">
              <Dropdown<SimpleOption>
                data={mockData.gstTypes}
                columns={simpleColumns}
                value="BillOfSupply"
                valueKey="name"
                onChange={handleDropdownChange}
                placeholder="Select..."
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label required>Store</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Dropdown<SimpleOption>
                  data={mockData.stores}
                  columns={simpleColumns}
                  value="SPORTS HUB"
                  valueKey="name"
                  onChange={handleDropdownChange}
                  placeholder="Select..."
                />
                <ActionBtn icon={<EditIcon size={14} />} />
              </InputGroup>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label required>Customer</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Dropdown<SimpleOption>
                  data={mockData.customers}
                  columns={simpleColumns}
                  value=""
                  valueKey="name"
                  onChange={handleDropdownChange}
                  placeholder="Select..."
                />
                <ActionBtn icon={<EditIcon size={14} />} />
                <ActionBtn icon={<ChartIcon />} />
              </InputGroup>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Email</Label>
            </div>
            <div className="col-span-8">
              <Input />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Salesman</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Dropdown<SimpleOption>
                  data={mockData.salesmen}
                  columns={simpleColumns}
                  value=""
                  valueKey="name"
                  onChange={handleDropdownChange}
                  placeholder="Select..."
                />
                <ActionBtn icon={<EditIcon size={14} />} />
              </InputGroup>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Price Category</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Dropdown<SimpleOption>
                  data={mockData.priceCategories}
                  columns={simpleColumns}
                  value=""
                  valueKey="name"
                  onChange={handleDropdownChange}
                  placeholder="Select..."
                />
                <ActionBtn icon={<EditIcon size={14} />} />
              </InputGroup>
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-1">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label required>Return Date</Label>
            </div>
            <div className="col-span-8">
              <DateField value="05/01/2026" />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label required>Return No</Label>
            </div>
            <div className="col-span-8">
              <Input value="00001" />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Ref No</Label>
            </div>
            <div className="col-span-8">
              <Input />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label required>Ref.Date</Label>
            </div>
            <div className="col-span-8">
              <DateField value="05/01/2026" />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4">
              <Label>Tax</Label>
            </div>
            <div className="col-span-8">
              <Dropdown<SimpleOption>
                data={mockData.taxOptions}
                columns={simpleColumns}
                value="Inclusive"
                valueKey="name"
                onChange={handleDropdownChange}
                placeholder="Select..."
              />
            </div>
          </div>
        </div>

        <div className="col-span-4 flex flex-col min-h-full">
          <AccordionSection
            title="Bill To"
            isOpen={isBillToOpen}
            onToggle={() => setBillToOpen(!isBillToOpen)}
          >
            <div className="space-y-2">
              <div className="relative">
                <textarea
                  className="w-full h-20 border border-gray-300 rounded text-[13px] p-2 resize-none focus:ring-1 focus:border-[var(--theme-focus)] focus:ring-[var(--theme-focus)] outline-none"
                  placeholder=""
                />
                <span className="absolute bottom-1 right-2 text-[10px] text-gray-400">
                  0/200
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label>GST No</Label>
                </div>
                <div className="col-span-8">
                  <Input />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label>Contact Person</Label>
                </div>
                <div className="col-span-8">
                  <Input />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label>Place of Supply</Label>
                </div>
                <div className="col-span-8">
                  <InputGroup>
                    <Dropdown<SimpleOption>
                      data={mockData.placeOfSupply}
                      columns={simpleColumns}
                      value=""
                      valueKey="name"
                      onChange={handleDropdownChange}
                      placeholder="Select..."
                    />
                    <ActionBtn icon={<EditIcon size={14} />} />
                  </InputGroup>
                </div>
              </div>
            </div>
          </AccordionSection>

          <AccordionSection
            title="Ship To"
            isOpen={isShipToOpen}
            onToggle={() => setShipToOpen(!isShipToOpen)}
          >
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label>Ship To</Label>
                </div>
                <div className="col-span-8">
                  <InputGroup>
                    <Dropdown<SimpleOption>
                      data={mockData.shipToOptions}
                      columns={simpleColumns}
                      value=""
                      valueKey="name"
                      onChange={handleDropdownChange}
                      placeholder="Select..."
                    />
                    <ActionBtn icon={<EditIcon size={14} />} />
                  </InputGroup>
                </div>
              </div>

              <div className="relative">
                <textarea className="w-full h-20 border border-gray-300 rounded text-[13px] p-2 resize-none focus:ring-1 focus:border-[var(--theme-focus)] focus:ring-[var(--theme-focus)] outline-none"></textarea>
                <span className="absolute bottom-1 right-2 text-[10px] text-gray-400">
                  0/200
                </span>
              </div>
            </div>
          </AccordionSection>
        </div>
      </div>
    </div>
  );
};

export default DispatchForm;
