import React, { useState, useEffect } from "react";
import { X, ChevronDown, ChevronUp, Globe, Edit2, Loader2 } from "lucide-react";
import {
  createSalesAndPurchaseGL,
  SalesAndPurchaseGLInput,
} from "./addItemMaster/api/saleAndPurchaseGL";
import { fetchCoaGroups, CoaGroup } from "./addItemMaster/api/chartOfAccount";
import COAGroupsModal, { COAGroupData } from "./COAGroupsModal"; // Import COAGroupData interface

// --- Types ---
export interface AccountFormData {
  _id?: string;
  name: string;
  code: string;
  identification: string;
  isSubledger: boolean;
  salesGlUnderGroup: string;
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
}

// --- Default State ---
const defaultState: AccountFormData = {
  name: "",
  code: "00000001",
  identification: "",
  isSubledger: false,
  salesGlUnderGroup: "",
  inactive: false,
  type: "General",
  accountNo: "",
  rtgsIfscCode: "",
  classification: "",
  isLoanAccount: false,
  intrestRate: "",
  calculationOn: "",
  tdsApplicable: false,
  tdsSection: "",
  address: "",
  pan: "",
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
    className={`relative flex items-center w-16 h-6 rounded-sm transition-colors border ${
      value ? "bg-blue-900 border-blue-900" : "bg-gray-200 border-gray-300"
    }`}
  >
    <div
      className={`flex items-center justify-center w-1/2 h-full text-[10px] font-bold ${
        value ? "text-white" : "text-transparent"
      }`}
    >
      ON
    </div>
    <div
      className={`flex items-center justify-center w-1/2 h-full text-[10px] font-bold ${
        !value ? "text-gray-600" : "text-transparent"
      }`}
    >
      OFF
    </div>
    <div
      className={`absolute top-[-1px] left-[-1px] w-8 h-6 bg-white shadow-sm border border-gray-300 rounded-sm transform transition-transform ${
        value ? "translate-x-8" : "translate-x-0"
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
  <div className="grid grid-cols-12 gap-4 items-center mb-2">
    <label className="col-span-4 text-sm text-gray-700 font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="col-span-8">{children}</div>
  </div>
);

// --- Main Component ---
const ChartOfAccounts: React.FC<ChartOfAccountsProps> = ({
  initialData,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<AccountFormData>(defaultState);
  const [sections, setSections] = useState({ basic: true, attribute: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for Dynamic COA Groups
  const [coaGroupOptions, setCoaGroupOptions] = useState<CoaGroup[]>([]);
  const [isCoaGroupModalOpen, setIsCoaGroupModalOpen] = useState(false);
  // NEW: State to hold the full object of the selected COA Group for editing
  const [selectedCoaGroup, setSelectedCoaGroup] = useState<COAGroupData | null>(
    null
  );

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
      setFormData({
        ...defaultState,
        ...initialData,
        salesGlUnderGroup:
          initialData.salesGlUnderGroup || initialData.underGroup || "",
        rtgsIfscCode: initialData.rtgsIfscCode || initialData.rtgsIfsc || "",
        employee:
          initialData.employee === "Yes" ||
          initialData.employee === true ||
          initialData.attrEmployee === true,
        group:
          initialData.group === "Yes" ||
          initialData.group === true ||
          initialData.attrGroup === true,
      });
    } else {
      setFormData(defaultState);
    }
  }, [initialData, isOpen]);

  // --- 3. Update Selected COA Group when options or form data changes ---
  useEffect(() => {
    if (formData.salesGlUnderGroup && coaGroupOptions.length > 0) {
      const foundGroup = coaGroupOptions.find(
        (g) => g.name === formData.salesGlUnderGroup
      );
      if (foundGroup) {
        // Map CoaGroup to COAGroupData (if they differ, otherwise just cast/pass)
        setSelectedCoaGroup({
          _id: foundGroup._id,
          name: foundGroup.name,
          code: foundGroup.code,
          inactive: foundGroup.inactive,
          underGroup: foundGroup.underGroup || "", // Handle optional fields
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

  const toggleSection = (section: "basic" | "attribute") => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.salesGlUnderGroup) {
      alert("Please fill required fields (Name, Under Group)");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        onSave(formData); // Implement update API logic here if needed
      } else {
        const apiPayload: SalesAndPurchaseGLInput = {
          name: formData.name,
          identification: formData.identification,
          isSubledger: formData.isSubledger,
          salesGlUnderGroup: formData.salesGlUnderGroup,
          inactive: formData.inactive,
          type: formData.type,
          accountNo: formData.accountNo,
          rtgsIfscCode: formData.rtgsIfscCode,
          classification: formData.classification,
          isLoanAccount: formData.isLoanAccount,
          intrestRate: formData.intrestRate,
          calculationOn: formData.calculationOn,
          tdsSection: formData.tdsSection,
          tdsApplicable: formData.tdsApplicable,
          address: formData.address,
          pan: formData.pan,
          attributeApplicable: formData.employee || formData.group,
          employee: formData.employee ? "Yes" : "No",
          group: formData.group ? "Yes" : "No",
        };

        const response = await createSalesAndPurchaseGL(apiPayload);

        if (response && response.success) {
          onSave(response.data);
        } else {
          alert("Failed to create GL Account.");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData(defaultState);
  };

  // Handler for COA Group Modal Save (Update/Create)
  const handleCoaGroupSave = (savedGroup: CoaGroup) => {
    // 1. Refresh list
    loadGroups();
    // 2. Select the updated/created group in the main form
    handleChange("salesGlUnderGroup", savedGroup.name);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-sm shadow-xl flex flex-col max-h-[90vh]">
        {/* --- Header --- */}
        <div className="bg-[#1e4e79] text-white px-4 py-2 flex justify-between items-center rounded-t-sm">
          <h2 className="font-semibold text-sm">Chart of Accounts</h2>
          <button onClick={onClose} className="hover:bg-blue-800 rounded p-1">
            <X size={16} />
          </button>
        </div>

        {/* --- Scrollable Content --- */}
        <div className="overflow-y-auto p-4 flex-1">
          {/* Section: Basic */}
          <div className="mb-4">
            <div
              className="flex justify-between items-center cursor-pointer border-b border-gray-200 pb-1 mb-3"
              onClick={() => toggleSection("basic")}
            >
              <div className="flex items-center gap-2 text-[#1e4e79] font-bold text-sm">
                <span className="text-lg">📄</span> Basic
              </div>
              {sections.basic ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronUp size={16} />
              )}
            </div>

            {sections.basic && (
              <div className="space-y-1">
                <FormRow label="Name" required>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                    <button className="bg-[#1e4e79] text-white p-1 ml-1 rounded-sm">
                      <Globe size={14} />
                    </button>
                  </div>
                </FormRow>

                <FormRow label="Code">
                  <input
                    type="text"
                    disabled={true}
                    className="w-full border border-gray-300 bg-gray-50 px-2 py-1 text-sm text-gray-600"
                    value={formData.code}
                    onChange={(e) => handleChange("code", e.target.value)}
                  />
                </FormRow>

                <FormRow label="Identification">
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                    value={formData.identification}
                    onChange={(e) =>
                      handleChange("identification", e.target.value)
                    }
                  />
                </FormRow>

                <FormRow label="Is Subledger">
                  <ToggleSwitch
                    value={formData.isSubledger}
                    onChange={(val) => handleChange("isSubledger", val)}
                  />
                </FormRow>

                {/* --- Under Group (Mapped from API) --- */}
                <FormRow label="Under Group" required>
                  <div className="flex relative">
                    <select
                      className="w-full border border-gray-300 px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-500 appearance-none"
                      value={formData.salesGlUnderGroup}
                      onChange={(e) =>
                        handleChange("salesGlUnderGroup", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      {/* Map dynamic options */}
                      {coaGroupOptions.map((group) => (
                        <option key={group._id} value={group.name}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                    {/* Edit Button for COA Groups */}
                    <button
                      onClick={() => setIsCoaGroupModalOpen(true)}
                      className="bg-[#1e4e79] text-white p-1 ml-1 rounded-sm absolute right-0 top-0 h-full w-7 flex items-center justify-center"
                    >
                      <Edit2 size={12} />
                    </button>
                  </div>
                </FormRow>

                <FormRow label="Inactive">
                  <ToggleSwitch
                    value={formData.inactive}
                    onChange={(val) => handleChange("inactive", val)}
                  />
                </FormRow>

                <FormRow label="Type">
                  <select
                    className="w-full border border-gray-300 px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-500"
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                  >
                    <option value="General">General</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                  </select>
                </FormRow>

                <FormRow label="AccountNo">
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                    value={formData.accountNo}
                    onChange={(e) => handleChange("accountNo", e.target.value)}
                  />
                </FormRow>

                <FormRow label="RTGS/IFSC Code">
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                    value={formData.rtgsIfscCode}
                    onChange={(e) =>
                      handleChange("rtgsIfscCode", e.target.value)
                    }
                  />
                </FormRow>

                <FormRow label="Classification">
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                    value={formData.classification}
                    onChange={(e) =>
                      handleChange("classification", e.target.value)
                    }
                  />
                </FormRow>

                <FormRow label="Is Loan Account">
                  <ToggleSwitch
                    value={formData.isLoanAccount}
                    onChange={(val) => handleChange("isLoanAccount", val)}
                  />
                </FormRow>

                {formData.isLoanAccount && (
                  <>
                    <FormRow label="Interest Rate">
                      <input
                        type="text"
                        placeholder="e.g. 9.5%"
                        className="w-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                        value={formData.intrestRate}
                        onChange={(e) =>
                          handleChange("intrestRate", e.target.value)
                        }
                      />
                    </FormRow>
                    <FormRow label="Calculation On">
                      <select
                        className="w-full border border-gray-300 px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-500"
                        value={formData.calculationOn}
                        onChange={(e) =>
                          handleChange("calculationOn", e.target.value)
                        }
                      >
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
                    onChange={(val) => handleChange("tdsApplicable", val)}
                  />
                </FormRow>

                {formData.tdsApplicable && (
                  <FormRow label="TDS Section">
                    <input
                      type="text"
                      className="w-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                      value={formData.tdsSection}
                      onChange={(e) =>
                        handleChange("tdsSection", e.target.value)
                      }
                    />
                  </FormRow>
                )}

                <FormRow label="Address">
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-500 resize-none"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </FormRow>

                <FormRow label="PAN">
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                    value={formData.pan}
                    onChange={(e) => handleChange("pan", e.target.value)}
                  />
                </FormRow>
              </div>
            )}
          </div>

          {/* Section: Attribute Applicable */}
          <div className="mb-4">
            <div
              className="flex justify-between items-center cursor-pointer border-b border-gray-200 pb-1 mb-3"
              onClick={() => toggleSection("attribute")}
            >
              <div className="flex items-center gap-2 text-[#1e4e79] font-bold text-sm">
                <span className="text-lg">📄</span> Attribute Applicable
              </div>
              {sections.attribute ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronUp size={16} />
              )}
            </div>

            {sections.attribute && (
              <div className="space-y-1">
                <FormRow label="Employee">
                  <ToggleSwitch
                    value={formData.employee}
                    onChange={(val) => handleChange("employee", val)}
                  />
                </FormRow>
                <FormRow label="Group">
                  <ToggleSwitch
                    value={formData.group}
                    onChange={(val) => handleChange("group", val)}
                  />
                </FormRow>
              </div>
            )}
          </div>
        </div>

        {/* --- Footer --- */}
        <div className="bg-[#1e4e79] px-4 py-2 flex gap-2 rounded-b-sm">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`border border-white text-white px-4 py-1 text-sm rounded transition-colors flex items-center ${
              isSubmitting
                ? "bg-blue-800 opacity-70 cursor-not-allowed"
                : "hover:bg-blue-800"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-3 h-3 mr-2" /> Saving...
              </>
            ) : (
              "Save"
            )}
          </button>

          <button
            onClick={handleClear}
            disabled={isSubmitting}
            className="border border-white text-white px-4 py-1 text-sm rounded hover:bg-blue-800 transition-colors"
          >
            Clear
          </button>

          {isEditMode && onDelete && formData._id && (
            <button
              onClick={() => onDelete(formData._id!)}
              disabled={isSubmitting}
              className="border border-white text-white px-4 py-1 text-sm rounded hover:bg-red-600 transition-colors ml-auto"
            >
              Delete
            </button>
          )}

          {!isEditMode && (
            <button className="border border-white text-white px-4 py-1 text-sm rounded hover:bg-blue-800 transition-colors">
              Delete
            </button>
          )}
        </div>
      </div>

      {/* --- COA GROUPS MODAL INTEGRATION --- */}
      {isCoaGroupModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <COAGroupsModal
            isOpen={isCoaGroupModalOpen}
            onClose={() => setIsCoaGroupModalOpen(false)}
            initialData={selectedCoaGroup} // Pass the FULL selected object here!
            onSave={handleCoaGroupSave} // Updates list after save
          />
        </div>
      )}
    </div>
  );
};

export default ChartOfAccounts;
