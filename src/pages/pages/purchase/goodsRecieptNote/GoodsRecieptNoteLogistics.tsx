import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, FileText, EditIcon, ExternalLink, Minimize2 } from 'lucide-react';

import Dropdown, { ColumnDef } from '../../../../components/Dropdown';
import Transporter from '../../../../components/Transporter';
import DateInput from '../../../../components/DateInput';
import chartOfAccountService from '../../../../services/chartOfAccountService';

export interface LogisticsData {
  destination: string;
  shippingMode: string;
  shippingCompany: string;
  shippingCompanyAddress: string;
  shippingTrackingNo: string;
  shippingDate: string;
  shippingCharges: string;
  vehicleNo: string;
  chargeType: string;
  documentThrough: string;

  portOfLanding: string;
  portOfDischarge: string;
  portAddressForEway?: string;
  portStateForEway?: string;
  noOfPackets: string;
  weight: string;
  distance?: string;
  ewayInvoiceNo?: string;
  ewayInvoiceDate?: string;
  ewayCancelDate?: string;
  irnNo?: string;
  qrCode?: string;
  irnCancelDate?: string;
  irnCancelReason?: string;
  ackNo?: string;
  ackDate?: string;
  billOfEntryNum?: string;
  billOfEntryDate?: string;

  custDuty: string;
  custDutyAccount: string;

  chaPayment: string;
  chaPaymentAccount: string;

  freight: string;
  freightAccount: string;

  insurance: string;
  insuranceAccount: string;

  handling: string;
  handlingAccount: string;

  docCharges: string;
  docChargesAccount: string;

  bankCharges: string;
  bankChargesAccount: string;

  custExp: string;
  custExpAccount: string;

  loadingUnloading: string;
  loadingUnloadingAccount: string;

  otherCharges: string;
  otherChargesAccount: string;
}

interface LogisticsProps {
  data: LogisticsData;
  onChange: (data: LogisticsData) => void;
  themeColor?: string;
}

interface GlOption {
  _id: string;
  name: string;
  code: string;
  type?: string;
  underGroup: string;
  nature: string;
  label: string;
  value: string;
  underGroupCode?: string;
}

const STATIC_TRANSPORTERS = [
  { code: 'T001', name: 'FedEx Logistics' },
  { code: 'T002', name: 'DHL Express' },
  { code: 'T003', name: 'Blue Dart' },
  { code: 'T004', name: 'DTDC' },
];

const GL_COLUMNS: ColumnDef<any>[] = [
  { header: 'Code', key: 'code', width: 'w-1/5' },
  { header: 'Name', key: 'name', width: 'w-2/5' },
  { header: 'Group', key: 'underGroup', width: 'auto' },
];

const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({
  children,
  required,
}) => (
  <label className="flex h-[30px] items-center whitespace-nowrap text-[13px] font-medium text-gray-700">
    {children} {required && <span className="ml-1 text-red-500">*</span>}
  </label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    className={`h-[30px] w-full rounded-sm border border-gray-300 bg-white px-2 text-[13px] text-gray-700 focus:border-[var(--theme-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-focus)] disabled:bg-gray-50 ${
      props.className || ''
    }`}
    {...props}
  />
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    className={`w-full resize-none rounded-sm border border-gray-300 bg-white px-2 py-1 text-[13px] text-gray-700 focus:border-[var(--theme-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-focus)] ${
      props.className || ''
    }`}
    {...props}
  />
);

const Select: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: string[];
    placeholder?: string;
  }
> = ({ options, placeholder, ...props }) => (
  <div className="relative w-full">
    <select
      className={`h-[30px] w-full appearance-none rounded-sm border border-gray-300 bg-white px-2 text-[13px] text-gray-700 focus:border-[var(--theme-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-focus)] ${
        props.className || ''
      }`}
      {...props}>
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
      <svg width="8" height="6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 10l5 5 5-5z" />
      </svg>
    </div>
  </div>
);

const ActionBtn: React.FC<{
  icon: React.ReactNode;
  onClick?: () => void;
  title?: string;
}> = ({ icon, onClick, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-sm border border-[var(--theme-primary)] bg-[var(--theme-primary)] text-white shadow-sm transition-opacity hover:opacity-90">
    {icon}
  </button>
);

const ExpenseRow: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  tenderValue: string;
  onTenderChange: (val: string) => void;
  glOptions: GlOption[];
  highlight?: boolean;
}> = ({ label, value, onChange, tenderValue, onTenderChange, glOptions, highlight }) => {
  return (
    <div
      className={`flex h-[30px] items-center border-b border-gray-100 last:border-0 ${
        highlight ? 'bg-blue-50/50' : ''
      }`}>
      <div className="flex-1 pl-2">
        <span className={`text-[13px] text-gray-700 ${highlight ? 'font-medium' : ''}`}>
          {label}
        </span>
      </div>

      <div className="h-full w-[100px] border-l border-gray-200">
        <div className="flex h-full w-full cursor-pointer items-center justify-between px-2 transition-colors hover:bg-gray-50">
          <Dropdown
            data={glOptions}
            columns={GL_COLUMNS}
            value={tenderValue}
            valueKey="code"
            placeholder="Select..."
            onChange={(item) => onTenderChange(item?.code || '')}
            disabled={false}
          />
        </div>
      </div>

      <div className="h-full w-[100px] border-l border-gray-200">
        <input
          type="number"
          className="h-full w-full bg-transparent px-2 text-right text-[13px] outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="₹0.00"
        />
      </div>
    </div>
  );
};

const SummaryInputGroup: React.FC<{
  label: string;
  amount: string;
  setAmount: (val: string) => void;
  tender: string;
  setTender: (val: string) => void;
  glOptions: GlOption[];
}> = ({ label, amount, setAmount, tender, setTender, glOptions }) => {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <div className="flex h-[30px]">
        <div className="relative w-[110px] rounded-l-sm border border-r-0 border-gray-300 bg-white">
          <div className="flex h-full w-full cursor-pointer items-center justify-between px-1 transition-colors hover:bg-gray-50">
            <Dropdown
              data={glOptions}
              columns={GL_COLUMNS}
              value={tender}
              valueKey="code"
              placeholder="Ledger..."
              onChange={(item) => setTender(item?.code || '')}
            />
          </div>
        </div>

        <input
          type="number"
          placeholder="0.00"
          className="h-full w-full min-w-0 flex-1 rounded-r-sm border border-gray-300 bg-white px-2 text-[13px] text-gray-700 focus:border-[var(--theme-focus)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-focus)]"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
    </div>
  );
};

const GoodsRecieptNoteLogistics: React.FC<LogisticsProps> = ({
  data,
  onChange,
  themeColor = '#0f3c63',
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [transporterModalOpen, setTransporterModalOpen] = useState(false);

  const [glOptions, setGlOptions] = useState<GlOption[]>([]);

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
            nature: item.nature || 'N/A',
            label: item.name,
            value: item._id,
            type: item.type,
          }));

          const filtered = mappedOptions.filter(
            (item: GlOption) => item.type === 'Bank' || item.type === 'Cash'
          );

          setGlOptions(filtered);
        }
      } catch (error) {
        console.error('❌ Failed to load chart of accounts:', error);
      }
    };
    loadData();
  }, []);

  const themeStyles = {
    '--theme-primary': themeColor,
    '--theme-focus': '#60a5fa',
  } as React.CSSProperties;

  const shippingModes = ['Road', 'Air', 'Sea', 'Rail'];
  const chargeTypes = ['Paid', 'To Pay', 'Free'];

  const transporterColumns: ColumnDef<any>[] = [
    { header: 'Code', key: 'code', width: 'w-20' },
    { header: 'Name', key: 'name', width: 'flex-1' },
  ];

  const handleChange = (field: keyof LogisticsData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleTransporterSelect = (item: any) => {
    onChange({
      ...data,
      shippingCompany: item?.name || '',
    });
  };

  return (
    <div style={themeStyles} className="w-full">
      <div className="mb-4 overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm transition-all duration-300">
        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => setIsOpen(!isOpen)}>
            <FileText className="text-[var(--theme-primary)]" size={18} />
            <h3 className="text-sm font-semibold text-[var(--theme-primary)]">Logistics</h3>
          </div>

          <div className="flex items-center gap-4">
            {isOpen && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-xs font-medium text-gray-700 transition-colors hover:text-gray-800">
                {isExpanded ? (
                  <>
                    <Minimize2 size={12} /> Collapse View
                  </>
                ) : (
                  <>
                    <ExternalLink size={12} /> Expand / View Details
                  </>
                )}
              </button>
            )}

            <div className="cursor-pointer text-gray-500" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="p-5">
            {!isExpanded && (
              <div className="animate-in fade-in grid grid-cols-1 gap-6 rounded-md border border-gray-100 bg-gray-50 p-4 duration-300 md:grid-cols-3">
                <SummaryInputGroup
                  label="Freight Charge"
                  amount={data.freight}
                  setAmount={(v) => handleChange('freight', v)}
                  tender={data.freightAccount}
                  setTender={(v) => handleChange('freightAccount', v)}
                  glOptions={glOptions}
                />
                <SummaryInputGroup
                  label="Loading/Unloading"
                  amount={data.loadingUnloading}
                  setAmount={(v) => handleChange('loadingUnloading', v)}
                  tender={data.loadingUnloadingAccount}
                  setTender={(v) => handleChange('loadingUnloadingAccount', v)}
                  glOptions={glOptions}
                />
                <SummaryInputGroup
                  label="Other Charges"
                  amount={data.otherCharges}
                  setAmount={(v) => handleChange('otherCharges', v)}
                  tender={data.otherChargesAccount}
                  setTender={(v) => handleChange('otherChargesAccount', v)}
                  glOptions={glOptions}
                />
              </div>
            )}

            {isExpanded && (
              <div className="animate-in fade-in slide-in-from-top-2 grid grid-cols-1 gap-6 duration-300 lg:grid-cols-3">
                <div className="space-y-1">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Destination</Label>
                    </div>
                    <div className="col-span-8">
                      <Input
                        value={data.destination}
                        onChange={(e) => handleChange('destination', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Shipping Mode</Label>
                    </div>
                    <div className="col-span-8">
                      <Select
                        options={shippingModes}
                        value={data.shippingMode}
                        onChange={(e) => handleChange('shippingMode', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Shipping Company</Label>
                    </div>
                    <div className="col-span-8 flex gap-1">
                      <Dropdown
                        data={STATIC_TRANSPORTERS}
                        columns={transporterColumns}
                        value={data.shippingCompany}
                        valueKey="name"
                        onChange={handleTransporterSelect}
                        placeholder="Select..."
                      />
                      <ActionBtn
                        icon={<EditIcon size={14} />}
                        onClick={() => setTransporterModalOpen(true)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Address/Ph...</Label>
                    </div>
                    <div className="col-span-8">
                      <TextArea
                        rows={3}
                        value={data.shippingCompanyAddress}
                        onChange={(e) => handleChange('shippingCompanyAddress', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Tracking No</Label>
                    </div>
                    <div className="col-span-8">
                      <Input
                        value={data.shippingTrackingNo}
                        onChange={(e) => handleChange('shippingTrackingNo', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Shipping Date</Label>
                    </div>
                    <div className="col-span-8">
                      <DateInput
                        value={data.shippingDate}
                        onChange={(e) => handleChange('shippingDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Shipping Charges</Label>
                    </div>
                    <div className="col-span-8">
                      <Input
                        type="number"
                        value={data.shippingCharges}
                        onChange={(e) => handleChange('shippingCharges', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Vehicle/Vessel No</Label>
                    </div>
                    <div className="col-span-8">
                      <Input
                        value={data.vehicleNo}
                        onChange={(e) => handleChange('vehicleNo', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Charge Type</Label>
                    </div>
                    <div className="col-span-8">
                      <Select
                        options={chargeTypes}
                        value={data.chargeType}
                        onChange={(e) => handleChange('chargeType', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Document Through</Label>
                    </div>
                    <div className="col-span-8">
                      <Input
                        value={data.documentThrough}
                        onChange={(e) => handleChange('documentThrough', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Port of Landing</Label>
                    </div>
                    <div className="col-span-8">
                      <Input
                        value={data.portOfLanding}
                        onChange={(e) => handleChange('portOfLanding', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Port of Discharge</Label>
                    </div>
                    <div className="col-span-8">
                      <Input
                        value={data.portOfDischarge}
                        onChange={(e) => handleChange('portOfDischarge', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>No of Packets</Label>
                    </div>
                    <div className="col-span-8">
                      <Input
                        type="number"
                        value={data.noOfPackets}
                        onChange={(e) => handleChange('noOfPackets', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Weight</Label>
                    </div>
                    <div className="col-span-8">
                      <Input
                        value={data.weight}
                        onChange={(e) => handleChange('weight', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="my-2 border-t border-gray-100 pt-2"></div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Distance</Label>
                    </div>
                    <div className="col-span-8">
                      <Input
                        value={data.distance || ''}
                        onChange={(e) => handleChange('distance', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>eWay Inv No</Label>
                    </div>
                    <div className="col-span-8">
                      <Input
                        value={data.ewayInvoiceNo || ''}
                        onChange={(e) => handleChange('ewayInvoiceNo', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>eWay Inv Date</Label>
                    </div>
                    <div className="col-span-8">
                      <DateInput
                        value={data.ewayInvoiceDate || ''}
                        onChange={(e) => handleChange('ewayInvoiceDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>IRN No</Label>
                    </div>
                    <div className="col-span-8">
                      <Input
                        value={data.irnNo || ''}
                        onChange={(e) => handleChange('irnNo', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>QR Code</Label>
                    </div>
                    <div className="col-span-8">
                      <Input
                        value={data.qrCode || ''}
                        onChange={(e) => handleChange('qrCode', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Ack No</Label>
                    </div>
                    <div className="col-span-8">
                      <Input
                        value={data.ackNo || ''}
                        onChange={(e) => handleChange('ackNo', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Ack Date</Label>
                    </div>
                    <div className="col-span-8">
                      <DateInput
                        value={data.ackDate || ''}
                        onChange={(e) => handleChange('ackDate', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Bill Entry No</Label>
                    </div>
                    <div className="col-span-8">
                      <Input
                        value={data.billOfEntryNum || ''}
                        onChange={(e) => handleChange('billOfEntryNum', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Label>Bill Entry Date</Label>
                    </div>
                    <div className="col-span-8">
                      <DateInput
                        value={data.billOfEntryDate || ''}
                        onChange={(e) => handleChange('billOfEntryDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-0">
                  <div className="overflow-hidden rounded-sm border border-gray-300 shadow-sm">
                    <div className="flex justify-between bg-slate-400/80 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white">
                      <span className="flex-1 text-left">Expense</span>
                      <span className="w-[100px] text-center">Tender</span>
                      <span className="w-[100px] text-right">Amount</span>
                    </div>

                    <div className="bg-white">
                      <ExpenseRow
                        label="Custom Duty"
                        value={data.custDuty}
                        onChange={(v) => handleChange('custDuty', v)}
                        tenderValue={data.custDutyAccount}
                        onTenderChange={(v) => handleChange('custDutyAccount', v)}
                        glOptions={glOptions}
                      />
                      <ExpenseRow
                        label="CHA Payment"
                        value={data.chaPayment}
                        onChange={(v) => handleChange('chaPayment', v)}
                        tenderValue={data.chaPaymentAccount}
                        onTenderChange={(v) => handleChange('chaPaymentAccount', v)}
                        glOptions={glOptions}
                      />
                      <ExpenseRow
                        label="Freight"
                        value={data.freight}
                        onChange={(v) => handleChange('freight', v)}
                        tenderValue={data.freightAccount}
                        onTenderChange={(v) => handleChange('freightAccount', v)}
                        glOptions={glOptions}
                        highlight
                      />
                      <ExpenseRow
                        label="Insurance"
                        value={data.insurance}
                        onChange={(v) => handleChange('insurance', v)}
                        tenderValue={data.insuranceAccount}
                        onTenderChange={(v) => handleChange('insuranceAccount', v)}
                        glOptions={glOptions}
                      />
                      <ExpenseRow
                        label="Handling"
                        value={data.handling}
                        onChange={(v) => handleChange('handling', v)}
                        tenderValue={data.handlingAccount}
                        onTenderChange={(v) => handleChange('handlingAccount', v)}
                        glOptions={glOptions}
                      />
                      <ExpenseRow
                        label="Doc Charges"
                        value={data.docCharges}
                        onChange={(v) => handleChange('docCharges', v)}
                        tenderValue={data.docChargesAccount}
                        onTenderChange={(v) => handleChange('docChargesAccount', v)}
                        glOptions={glOptions}
                      />
                      <ExpenseRow
                        label="Bank Charges"
                        value={data.bankCharges}
                        onChange={(v) => handleChange('bankCharges', v)}
                        tenderValue={data.bankChargesAccount}
                        onTenderChange={(v) => handleChange('bankChargesAccount', v)}
                        glOptions={glOptions}
                      />
                      <ExpenseRow
                        label="Custom Exp"
                        value={data.custExp}
                        onChange={(v) => handleChange('custExp', v)}
                        tenderValue={data.custExpAccount}
                        onTenderChange={(v) => handleChange('custExpAccount', v)}
                        glOptions={glOptions}
                      />
                      <ExpenseRow
                        label="Load/Unload"
                        value={data.loadingUnloading}
                        onChange={(v) => handleChange('loadingUnloading', v)}
                        tenderValue={data.loadingUnloadingAccount}
                        onTenderChange={(v) => handleChange('loadingUnloadingAccount', v)}
                        glOptions={glOptions}
                        highlight
                      />
                      <ExpenseRow
                        label="Other Charges"
                        value={data.otherCharges}
                        onChange={(v) => handleChange('otherCharges', v)}
                        tenderValue={data.otherChargesAccount}
                        onTenderChange={(v) => handleChange('otherChargesAccount', v)}
                        glOptions={glOptions}
                        highlight
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {transporterModalOpen && (
          <Transporter
            isOpen={transporterModalOpen}
            onClose={() => setTransporterModalOpen(false)}
            initialData={null}
            onSuccess={() => setTransporterModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default GoodsRecieptNoteLogistics;
