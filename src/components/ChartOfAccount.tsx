import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Globe, EditIcon, Loader2 } from 'lucide-react';
import Dropdown, { ColumnDef } from './Dropdown';
// --- Imports from the new Service ---
import {
  createChartOfAccount,
  updateChartOfAccountById,
  ChartOfAccount,
} from '../services/chartOfAccountService';

import { fetchCoaGroups, CoaGroup } from './addItemMaster/api/chartOfAccount';
import COAGroupsModal, { COAGroupData } from './COAGroupsModal';

// --- Types ---
export interface AccountFormData {
  _id?: string;
  name: string;
  identification: string;
  isSubledger: boolean;
  salesGlUnderGroup: string; // This will now store the Group ID
  inactive: boolean;
  type: string;
  accountNo: string;
  rtgsIfscCode: string;
  classification: string;

  // Loan Details
  isLoanAccount: boolean;
  intrestRate: string;
  calculationOn: string;

  // TDS Details
  tdsApplicable: boolean;
  tdsSection: string;

  address: string;
  pan: string;

  // Attributes
  employee: boolean;
  group: boolean;
}

interface ChartOfAccountsProps {
  initialData?: AccountFormData | any | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete?: (id: string) => void;
  index?: number;
}

// --- Default State ---
const defaultState: AccountFormData = {
  name: '',
  identification: '',
  isSubledger: false,
  salesGlUnderGroup: '',
  inactive: false,
  type: 'General',
  accountNo: '',
  rtgsIfscCode: '',
  classification: '',
  isLoanAccount: false,
  intrestRate: '',
  calculationOn: '',
  tdsApplicable: false,
  tdsSection: '',
  address: '',
  pan: '',
  employee: false,
  group: false,
};

// --- Helper Components ---
const ToggleSwitch = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (val: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!value)}
    className={`relative flex h-6 w-16 items-center rounded-sm border transition-colors ${
      value ? 'border-blue-900 bg-blue-900' : 'border-gray-300 bg-gray-200'
    }`}>
    <div
      className={`flex h-full w-1/2 items-center justify-center text-[10px] font-bold ${
        value ? 'text-white' : 'text-transparent'
      }`}>
      ON
    </div>
    <div
      className={`flex h-full w-1/2 items-center justify-center text-[10px] font-bold ${
        !value ? 'text-gray-600' : 'text-transparent'
      }`}>
      OFF
    </div>
    <div
      className={`absolute left-[-1px] top-[-1px] h-6 w-8 transform rounded-sm border border-gray-300 bg-white shadow-sm transition-transform ${
        value ? 'translate-x-8' : 'translate-x-0'
      }`}
    />
  </button>
);

const FormRow = ({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="mb-2 grid grid-cols-12 items-center gap-4">
    <label className="col-span-4 text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="col-span-8">{children}</div>
  </div>
);

const salesGlUnderGroupColumns: ColumnDef<any>[] = [
  { header: 'Code', key: 'code', width: 'w-1/4' },
  { header: 'Name', key: 'name', width: 'w-3/4' },
];

// --- Main Component ---
const ChartOfAccounts: React.FC<ChartOfAccountsProps> = ({
  initialData,
  isOpen,
  onClose,
  onSave,
  onDelete,
  index = 50,
}) => {
  const overlayZIndex = index + 10;
  const nestedModalZIndex = overlayZIndex + 20;

  const [formData, setFormData] = useState<AccountFormData>(defaultState);
  const [sections, setSections] = useState({ basic: true, attribute: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for Dynamic COA Groups
  const [coaGroupOptions, setCoaGroupOptions] = useState<CoaGroup[]>([]);
  const [isCoaGroupModalOpen, setIsCoaGroupModalOpen] = useState(false);
  const [selectedCoaGroup, setSelectedCoaGroup] = useState<COAGroupData | null>(null);

  const isEditMode = !!initialData && !!initialData._id;

  // --- 1. Fetch COA Groups on Mount ---
  useEffect(() => {
    if (isOpen) {
      loadGroups();
    }
  }, [isOpen]);

  const loadGroups = async () => {
    const groups = await fetchCoaGroups();
    if (groups) {
      setCoaGroupOptions(groups);
    }
  };

  // --- 2. Initialize Form Data ---
  useEffect(() => {
    if (initialData) {
      // FIX: Extract ID if underGroup is an object, otherwise use the string
      let groupId = '';
      if (initialData.underGroup && typeof initialData.underGroup === 'object') {
        groupId = initialData.underGroup._id || '';
      } else {
        groupId = initialData.underGroup || initialData.salesGlUnderGroup || '';
      }

      setFormData({
        ...defaultState,
        ...initialData,
        salesGlUnderGroup: groupId, // Store ID here

        rtgsIfscCode: initialData.ifscRtgs || initialData.rtgsIfscCode || '',

        isSubledger: initialData.isSubleder || initialData.isSubledger || false,
        calculationOn: initialData.calcultaionOn || initialData.calculationOn || '',

        employee: Boolean(initialData.employee),
        group: Boolean(initialData.group),
        intrestRate: initialData.intrestRate ? String(initialData.intrestRate) : '',
      });
    } else {
      setFormData(defaultState);
    }
  }, [initialData, isOpen]);

  // --- 3. Update Selected COA Group (Find by ID now) ---
  useEffect(() => {
    if (formData.salesGlUnderGroup && coaGroupOptions.length > 0) {
      // FIX: Find group by _id instead of name
      const foundGroup = coaGroupOptions.find((g) => g._id === formData.salesGlUnderGroup);
      if (foundGroup) {
        setSelectedCoaGroup({
          _id: foundGroup._id,
          name: foundGroup.name,
          inactive: foundGroup.inactive,
          underGroup: foundGroup.underGroup || '',
          nature: foundGroup.nature,
        });
      } else {
        setSelectedCoaGroup(null);
      }
    } else {
      setSelectedCoaGroup(null);
    }
  }, [formData.salesGlUnderGroup, coaGroupOptions]);

  if (!isOpen) return null;

  const handleChange = (field: keyof AccountFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSection = (section: 'basic' | 'attribute') => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.salesGlUnderGroup) {
      alert('Please fill required fields (Name, Under Group)');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: ChartOfAccount = {
        name: formData.name,
        identification: formData.identification,
        isSubleder: formData.isSubledger,
        underLedger: formData.salesGlUnderGroup,
        underGroup: formData.salesGlUnderGroup,
        type: formData.type,
        accountNo: formData.accountNo,
        ifscRtgs: formData.rtgsIfscCode,
        classification: formData.classification,
        isLoanAccount: formData.isLoanAccount,
        intrestRate: parseFloat(String(formData.intrestRate).replace('%', '')) || 0,
        calcultaionOn: formData.calculationOn,
        tdsApplicable: formData.tdsApplicable,
        tdsSection: formData.tdsSection,
        address: formData.address,
        pan: formData.pan,
        employee: formData.employee,
        group: formData.group,
        inactive: formData.inactive || false,
      };

      let response;

      if (isEditMode && formData._id) {
        response = await updateChartOfAccountById(formData._id, payload);
      } else {
        response = await createChartOfAccount(payload);
      }

      if (response && response.data && response.data.success) {
        onSave(response.data.data);
      } else {
        alert(
          `Failed to ${isEditMode ? 'update' : 'create'} Chart of Account: ` +
            (response?.data?.message || 'Unknown Error')
        );
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      alert('An error occurred while saving: ' + (error?.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData(defaultState);
  };

  const handleCoaGroupSave = (savedGroup: CoaGroup) => {
    loadGroups();
    // FIX: Set the ID of the newly created group
    handleChange('salesGlUnderGroup', savedGroup._id);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
      style={{ zIndex: overlayZIndex }}>
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-sm bg-white shadow-xl">
        {/* --- Header --- */}
        <div className="flex items-center justify-between rounded-t-sm bg-[#1e4e79] px-4 py-2 text-white">
          <h2 className="text-sm font-semibold">Chart of Accounts</h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-blue-800">
            <X size={16} />
          </button>
        </div>

        {/* --- Scrollable Content --- */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Section: Basic */}
          <div className="mb-4">
            <div
              className="mb-3 flex cursor-pointer items-center justify-between border-b border-gray-200 pb-1"
              onClick={() => toggleSection('basic')}>
              <div className="flex items-center gap-2 text-sm font-bold text-[#1e4e79]">
                <span className="text-lg">📄</span> Basic
              </div>
              {sections.basic ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </div>

            {sections.basic && (
              <div className="space-y-1">
                <FormRow label="Name" required>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                    />
                    <button className="ml-1 rounded-sm bg-[#1e4e79] p-1 text-white">
                      <Globe size={14} />
                    </button>
                  </div>
                </FormRow>

                <FormRow label="Identification">
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    value={formData.identification}
                    onChange={(e) => handleChange('identification', e.target.value)}
                  />
                </FormRow>

                <FormRow label="Is Subledger">
                  <ToggleSwitch
                    value={formData.isSubledger}
                    onChange={(val) => handleChange('isSubledger', val)}
                  />
                </FormRow>

                {/* --- Under Group (Mapped from API) --- */}
                <FormRow label="Under Group" required>
                  <div className="relative flex w-full">
                    <Dropdown
                      data={coaGroupOptions}
                      columns={salesGlUnderGroupColumns}
                      value={formData.salesGlUnderGroup}
                      valueKey="_id"
                      placeholder="Select Ledger..."
                      onChange={(item) => handleChange('salesGlUnderGroup', item?._id || '')}
                    />
                    {/* Edit Button for COA Groups */}
                    <button
                      onClick={() => setIsCoaGroupModalOpen(true)}
                      className="ml-1 flex w-8 items-center justify-center rounded-sm bg-[#1e4e79] p-1 text-white">
                      <EditIcon size={12} />
                    </button>
                  </div>
                </FormRow>

                <FormRow label="Inactive">
                  <ToggleSwitch
                    value={formData.inactive}
                    onChange={(val) => handleChange('inactive', val)}
                  />
                </FormRow>

                <FormRow label="Type">
                  <select
                    className="w-full border border-gray-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}>
                    <option value="General">General</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                  </select>
                </FormRow>

                <FormRow label="AccountNo">
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    value={formData.accountNo}
                    onChange={(e) => handleChange('accountNo', e.target.value)}
                  />
                </FormRow>

                <FormRow label="RTGS/IFSC Code">
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    value={formData.rtgsIfscCode}
                    onChange={(e) => handleChange('rtgsIfscCode', e.target.value)}
                  />
                </FormRow>

                <FormRow label="Classification">
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    value={formData.classification}
                    onChange={(e) => handleChange('classification', e.target.value)}
                  />
                </FormRow>

                <FormRow label="Is Loan Account">
                  <ToggleSwitch
                    value={formData.isLoanAccount}
                    onChange={(val) => handleChange('isLoanAccount', val)}
                  />
                </FormRow>

                {formData.isLoanAccount && (
                  <>
                    <FormRow label="Interest Rate">
                      <input
                        type="text"
                        placeholder="e.g. 9.5%"
                        className="w-full border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                        value={formData.intrestRate}
                        onChange={(e) => handleChange('intrestRate', e.target.value)}
                      />
                    </FormRow>
                    <FormRow label="Calculation On">
                      <select
                        className="w-full border border-gray-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                        value={formData.calculationOn}
                        onChange={(e) => handleChange('calculationOn', e.target.value)}>
                        <option value="">Select...</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                    </FormRow>
                  </>
                )}

                <FormRow label="TDS Applicable">
                  <ToggleSwitch
                    value={formData.tdsApplicable}
                    onChange={(val) => handleChange('tdsApplicable', val)}
                  />
                </FormRow>

                {formData.tdsApplicable && (
                  <FormRow label="TDS Section">
                    <input
                      type="text"
                      className="w-full border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                      value={formData.tdsSection}
                      onChange={(e) => handleChange('tdsSection', e.target.value)}
                    />
                  </FormRow>
                )}

                <FormRow label="Address">
                  <textarea
                    rows={3}
                    className="w-full resize-none border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                  />
                </FormRow>

                <FormRow label="PAN">
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    value={formData.pan}
                    onChange={(e) => handleChange('pan', e.target.value)}
                  />
                </FormRow>
              </div>
            )}
          </div>

          {/* Section: Attribute Applicable */}
          <div className="mb-4">
            <div
              className="mb-3 flex cursor-pointer items-center justify-between border-b border-gray-200 pb-1"
              onClick={() => toggleSection('attribute')}>
              <div className="flex items-center gap-2 text-sm font-bold text-[#1e4e79]">
                <span className="text-lg">📄</span> Attribute Applicable
              </div>
              {sections.attribute ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </div>

            {sections.attribute && (
              <div className="space-y-1">
                <FormRow label="Employee">
                  <ToggleSwitch
                    value={formData.employee}
                    onChange={(val) => handleChange('employee', val)}
                  />
                </FormRow>
                <FormRow label="Group">
                  <ToggleSwitch
                    value={formData.group}
                    onChange={(val) => handleChange('group', val)}
                  />
                </FormRow>
              </div>
            )}
          </div>
        </div>

        {/* --- Footer --- */}
        <div className="flex gap-2 rounded-b-sm bg-[#1e4e79] px-4 py-2">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex items-center rounded border border-white px-4 py-1 text-sm text-white transition-colors ${
              isSubmitting ? 'cursor-not-allowed bg-blue-800 opacity-70' : 'hover:bg-blue-800'
            }`}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Saving...
              </>
            ) : (
              'Save'
            )}
          </button>

          <button
            onClick={handleClear}
            disabled={isSubmitting}
            className="rounded border border-white px-4 py-1 text-sm text-white transition-colors hover:bg-blue-800">
            Clear
          </button>

          {isEditMode && onDelete && formData._id && (
            <button
              onClick={() => onDelete(formData._id!)}
              disabled={isSubmitting}
              className="ml-auto rounded border border-white px-4 py-1 text-sm text-white transition-colors hover:bg-red-600">
              Delete
            </button>
          )}

          {!isEditMode && (
            <button className="rounded border border-white px-4 py-1 text-sm text-white transition-colors hover:bg-blue-800">
              Delete
            </button>
          )}
        </div>
      </div>

      {isCoaGroupModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-transparent p-4 backdrop-blur-sm"
          // Use Dynamic Z-Index for Nested Modal
          style={{ zIndex: nestedModalZIndex }}>
          <COAGroupsModal
            isOpen={isCoaGroupModalOpen}
            onClose={() => setIsCoaGroupModalOpen(false)}
            initialData={selectedCoaGroup}
            onSave={handleCoaGroupSave}
            index={nestedModalZIndex}
          />
        </div>
      )}
    </div>
  );
};

export default ChartOfAccounts;
