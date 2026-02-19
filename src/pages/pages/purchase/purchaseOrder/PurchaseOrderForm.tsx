import React, { useState, useEffect } from "react";
import {
  DocumentIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "../../../../components/icons";
import Dropdown, { ColumnDef } from "../../../../components/Dropdown";
import DateInput from "../../../../components/DateInput";
import { EditIcon, BarChart2 } from "lucide-react";
import { LocationMaster } from "../../../../components/LocationMaster";
import CounterMaster from "../../../../components/CounterMaster";
import State from "../../../../components/State";
import CrudVendor from "../vendor/pages/AddNewVendor";
import NameAndCodeMaster, {
  NameAndCodeData,
} from "../../../../components/NameAndCodeComponent";

import {
  fetchAllLocations,
  LocationMaster as LocationMasterType,
} from "../../inventory/stockAdjustment/api/LocationMaster";

interface DropdownItem {
  name: string;
  code?: string;
  [key: string]: any;
}

interface MockData {
  gstTypes: DropdownItem[];
  stores: LocationMasterType[];
  vendors: DropdownItem[];
  priceCategories: DropdownItem[];
  taxes: DropdownItem[];
  paymentTerms: DropdownItem[];
  states: DropdownItem[];
  shipToLocations: DropdownItem[];
}

const mockData: MockData = {
  gstTypes: [
    { name: "TaxInvoice", code: "TAX" },
    { name: "BillOfSupply", code: "BOS" },
    { name: "Export", code: "EXP" },
  ],
  stores: [],
  vendors: [
    { name: "Adidas India", code: "V001" },
    { name: "Nike Corp", code: "V002" },
    { name: "Puma Sports", code: "V003" },
  ],
  priceCategories: [
    { name: "Wholesale", code: "WS" },
    { name: "Retail", code: "RT" },
    { name: "Distributor", code: "DB" },
  ],
  taxes: [
    { name: "Inclusive", code: "INC" },
    { name: "Exclusive", code: "EXC" },
  ],
  paymentTerms: [
    { name: "Net 30", code: "30" },
    { name: "Immediate", code: "0" },
    { name: "Cash on Delivery", code: "COD" },
  ],
  states: [
    { name: "Delhi", code: "DL" },
    { name: "Maharashtra", code: "MH" },
    { name: "Bihar", code: "BR" },
  ],
  shipToLocations: [
    { name: "Warehouse A", code: "WH01" },
    { name: "Store Branch 2", code: "BR02" },
  ],
};

const defaultColumns: ColumnDef<DropdownItem>[] = [
  { header: "Code", key: "code", width: "w-20" },
  { header: "Name", key: "name", width: "w-[50px]" },
];

const locationColumns: ColumnDef<LocationMasterType>[] = [
  { header: "Code", key: "code", width: "w-20" },
  { header: "Name", key: "name", width: "flex-1" },
];

const codeNameColumns: ColumnDef<DropdownItem>[] = [
  { header: "Code", key: "code", width: "w-20" },
  { header: "Name", key: "name", width: "w-full" },
];

const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({
  children,
  required,
}) => (
  <label className="text-[13px] text-gray-700 font-medium flex items-center h-[30px] whitespace-nowrap">
    {children} {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const InputGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center w-full relative gap-1">{children}</div>
);

interface InputProps {
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  value,
  placeholder,
  readOnly,
  onChange,
}) => (
  <input
    type="text"
    readOnly={readOnly}
    onChange={onChange}
    className={`w-full h-[30px] border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)] ${
      readOnly ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"
    }`}
    value={value || ""}
    placeholder={placeholder}
  />
);

const ActionBtn: React.FC<{
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ icon, onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={`h-[30px] w-[30px] bg-[var(--theme-primary)] text-white flex items-center justify-center rounded-sm border border-[var(--theme-primary)] hover:opacity-90 transition-opacity ml-[-1px] z-10 shrink-0 ${className}`}
  >
    <span className="flex items-center justify-center">{icon}</span>
  </button>
);

const AccordionSection: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="mb-2 border border-gray-200 rounded bg-white shadow-sm">
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

interface POSOrderFormProps {
  themeColor?: string;
}

const PurchaseOrderForm: React.FC<POSOrderFormProps> = ({
  themeColor = "#0f3c63",
}) => {

  const [isBillToOpen, setBillToOpen] = useState<boolean>(false);
  const [isShipToOpen, setShipToOpen] = useState<boolean>(false);

  const [isCounterMasterOpen, setIsCounterMasterOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isLocationMasterOpen, setIsLocationMasterOpen] =
    useState<boolean>(false);

  const [isVendorFormOpen, setIsVendorFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<DropdownItem | null>(null);

  const nestedModalZIndex = 1200;

  const [locationList, setLocationList] = useState<LocationMasterType[]>([]);

  const [formData, setFormData] = useState({
    gstType: "TaxInvoice",
    store: "INVENTORY",
    vendor: "",
    email: "",
    deliveryDate: "26/12/2025",
    priceCategory: "",
    orderDate: "26/12/2025",
    orderNo: "00002",
    refNo: "",
    refDate: "26/12/2025",
    tax: "Inclusive",
    paymentTerms: "",
    // Billing Address Section
    billingAddress: "",
    gstNo: "",
    contactPerson: "",
    placeOfSupply: "",
    // Delivery Address Section
    shipTo: "",
    deliveryAddress: "",
  });

  const [isLegderOpen, setIsLedgerOpen] = useState<boolean>(false);
  const [ledgerEditingRow, setLedgerEditingRow] =
    useState<NameAndCodeData | null>(null);

    useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const result = await fetchAllLocations();
      setLocationList(result || []);
    } catch (err) {
      console.error(err);
      setLocationList([
        { code: "ST01", name: "INVENTORY" },
        { code: "ST02", name: "WAREHOUSE A" },
      ] as any);
    }
  };

  const handleState = () => {
    setIsStateOpen(true);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getSelectedStoreData = (): LocationMasterType | null => {
    if (!formData.store) return null;
    return locationList.find((s) => s.name === formData.store) || null;
  };

  const handleLocationSuccess = async () => {
    await loadLocations(); // Reload the dropdown data
  };

  const handleLocationSelect = (locationName: string) => {
    handleFieldChange("store", locationName);
    setIsLocationMasterOpen(false);
  };

  const handleVendorAction = () => {
    const selectedVendorName = formData.vendor;

    if (selectedVendorName) {
      // 1. EDIT MODE: Find the vendor object from the list based on name
      const vendorData = mockData.vendors.find(
        (v) => v.name === selectedVendorName
      );
      // Pass the found object, or null if not found (fallback to create)
      setEditingVendor(vendorData || null);
    } else {
      // 2. CREATE MODE: No vendor selected
      setEditingVendor(null);
    }

    // Open the modal
    setIsVendorFormOpen(true);
  };

  const handleVendorSaveSuccess = () => {
    // Logic to reload vendors list would go here
    setIsVendorFormOpen(false);
  };

  const themeStyles = {
    "--theme-primary": themeColor,
    "--theme-secondary": themeColor,
    "--theme-focus": "#60a5fa",
  } as React.CSSProperties;

  const handleLedgerClose = () => {
    setIsLedgerOpen(false);
    setLedgerEditingRow(null);
  };

  return (
    <div
      style={themeStyles}
      className="bg-white rounded border border-gray-200 p-5 relative"
    >
      {isCounterMasterOpen && (
        <CounterMaster onClose={() => setIsCounterMasterOpen(false)} />
      )}
      {isStateOpen && <State onClose={() => setIsStateOpen(false)} />}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4 space-y-2">
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <Label>GST Type</Label>
            </div>
            <div className="col-span-8">
              <Dropdown
                data={mockData.gstTypes}
                columns={defaultColumns}
                value={formData.gstType}
                valueKey="name"
                onChange={(item) =>
                  handleFieldChange("gstType", item?.name || "")
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <Label required>Store</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Dropdown
                  data={locationList}
                  columns={locationColumns}
                  value={formData.store}
                  valueKey="name"
                  onChange={(item) =>
                    handleFieldChange("store", item?.name || "")
                  }
                />
                <ActionBtn
                  icon={<EditIcon size={16} />}
                  onClick={() => setIsLocationMasterOpen(true)}
                />
              </InputGroup>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <Label required>Vendor</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Dropdown
                  data={mockData.vendors}
                  columns={defaultColumns}
                  value={formData.vendor}
                  valueKey="name"
                  placeholder="Select..."
                  onChange={(item) =>
                    handleFieldChange("vendor", item?.name || "")
                  }
                />
                <ActionBtn
                  icon={<EditIcon size={14} />}
                  onClick={handleVendorAction}
                />
                <ActionBtn icon={<BarChart2 className="z-0" size={14} />} />
              </InputGroup>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <Label>Email</Label>
            </div>
            <div className="col-span-8">
              <Input
                value={formData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <Label required>Delivery Date</Label>
            </div>
            <div className="col-span-8">
              <DateInput
                value={formData.deliveryDate}
                onChange={(e) =>
                  handleFieldChange("deliveryDate", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <Label>Price Category</Label>
            </div>
            <div className="col-span-8">
              <InputGroup>
                <Dropdown
                  data={mockData.priceCategories}
                  columns={defaultColumns}
                  value={formData.priceCategory}
                  valueKey="name"
                  placeholder="Select..."
                  onChange={(item) =>
                    handleFieldChange("priceCategory", item?.name || "")
                  }
                />
                <ActionBtn
                  icon={<EditIcon size={16} />}
                  onClick={() => {
                    setIsLedgerOpen(true);
                  }}
                />
              </InputGroup>
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-2">
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <Label required>Order Date</Label>
            </div>
            <div className="col-span-8">
              <DateInput
                value={formData.orderDate}
                onChange={(e) => handleFieldChange("orderDate", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <Label required>Order No</Label>
            </div>
            <div className="col-span-8">
              <Input
                value={formData.orderNo}
                onChange={(e) => handleFieldChange("orderNo", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <Label>Ref No</Label>
            </div>
            <div className="col-span-8">
              <Input
                value={formData.refNo}
                onChange={(e) => handleFieldChange("refNo", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <Label required>Ref.Date</Label>
            </div>
            <div className="col-span-8">
              <DateInput
                value={formData.refDate}
                onChange={(e) => handleFieldChange("refDate", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <Label>Tax</Label>
            </div>
            <div className="col-span-8">
              <Dropdown
                data={mockData.taxes}
                columns={defaultColumns}
                value={formData.tax}
                valueKey="name"
                onChange={(item) => handleFieldChange("tax", item?.name || "")}
              />
            </div>
          </div>
        </div>

        <div className="col-span-4 flex flex-col h-full justify-between">
          <div className="space-y-4">
            <AccordionSection
              title="Billing Address"
              isOpen={isBillToOpen}
              onToggle={() => setBillToOpen(!isBillToOpen)}
            >
              <div className="relative mb-2">
                <textarea
                  value={formData.billingAddress}
                  onChange={(e) =>
                    handleFieldChange("billingAddress", e.target.value)
                  }
                  className="w-full h-24 border border-gray-300 rounded text-[13px] p-2 resize-none focus:ring-1 focus:border-[var(--theme-focus)] focus:ring-[var(--theme-focus)] outline-none"
                />
                <span className="absolute bottom-1 right-2 text-[10px] text-gray-400">
                  {formData.billingAddress.length}/200
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="w-24 text-[13px] text-gray-700 shrink-0">
                  GST No
                </span>
                <div className="w-full">
                  <Input
                    value={formData.gstNo}
                    onChange={(e) => handleFieldChange("gstNo", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="w-24 text-[13px] text-gray-700 shrink-0">
                  Contact Person
                </span>
                <div className="w-full">
                  <Input
                    value={formData.contactPerson}
                    onChange={(e) =>
                      handleFieldChange("contactPerson", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-24 text-[13px] text-gray-700 shrink-0">
                  Place of Supply
                </span>
                <div className="w-full">
                  <InputGroup>
                    <Dropdown
                      data={mockData.states}
                      columns={codeNameColumns}
                      value={formData.placeOfSupply}
                      valueKey="name"
                      placeholder="Select..."
                      onChange={(item) =>
                        handleFieldChange("placeOfSupply", item?.name || "")
                      }
                    />
                    <button onClick={handleState}>
                      <ActionBtn icon={<EditIcon size={16} />} />
                    </button>
                  </InputGroup>
                </div>
              </div>
            </AccordionSection>

            <AccordionSection
              title="Delivery At"
              isOpen={isShipToOpen}
              onToggle={() => setShipToOpen(!isShipToOpen)}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-16 text-[13px] text-gray-700 shrink-0 font-medium">
                  Ship To
                </span>
                <div className="w-full">
                  <InputGroup>
                    <Dropdown
                      data={mockData.shipToLocations}
                      columns={codeNameColumns}
                      value={formData.shipTo}
                      valueKey="name"
                      placeholder="Select..."
                      onChange={(item) =>
                        handleFieldChange("shipTo", item?.name || "")
                      }
                    />
                    <ActionBtn icon={<EditIcon size={16} />} />
                  </InputGroup>
                </div>
              </div>

              <div className="relative">
                <textarea
                  value={formData.deliveryAddress}
                  onChange={(e) =>
                    handleFieldChange("deliveryAddress", e.target.value)
                  }
                  className="w-full h-24 border border-gray-300 rounded text-[13px] p-2 resize-none focus:ring-1 focus:border-[var(--theme-focus)] focus:ring-[var(--theme-focus)] outline-none"
                />
                <span className="absolute bottom-1 right-2 text-[10px] text-gray-400">
                  {formData.deliveryAddress.length}/200
                </span>
              </div>
            </AccordionSection>
          </div>

          <div className="mt-4 pt-4">
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4 flex items-center gap-1">
                <Label>Payment Terms</Label>
              </div>
              <div className="col-span-7">
                <InputGroup>
                  <Dropdown
                    data={mockData.paymentTerms}
                    columns={defaultColumns}
                    value={formData.paymentTerms}
                    valueKey="name"
                    placeholder="Select..."
                    onChange={(item) =>
                      handleFieldChange("paymentTerms", item?.name || "")
                    }
                  />
                  <ActionBtn icon={<EditIcon size={14} />} />
                </InputGroup>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLocationMasterOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          style={{ zIndex: nestedModalZIndex }}
        >
          <div className="shadow-lg overflow-hidden relative">
            <LocationMaster
              onClose={() => setIsLocationMasterOpen(false)}
              initialData={getSelectedStoreData()}
              onSuccess={handleLocationSuccess}
              onSelect={handleLocationSelect}
              index={nestedModalZIndex}
            />
          </div>
        </div>
      )}

      {isVendorFormOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          style={{ zIndex: nestedModalZIndex }}
        >
          <div className="w-full max-w-6xl h-[90vh] rounded-xl overflow-hidden relative">
            <CrudVendor
              onClose={() => setIsVendorFormOpen(false)}
              initialData={editingVendor}
              onSuccess={handleVendorSaveSuccess}
            />
          </div>
        </div>
      )}

      {isLegderOpen && (
        <NameAndCodeMaster
          title="Price Category"
          onClose={handleLedgerClose}
          initialData={ledgerEditingRow}
          index={nestedModalZIndex}
        />
      )}
    </div>
  );
};

export default PurchaseOrderForm;
