import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  DocumentIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "../../../../components/icons";
import { EditIcon, BarChart2 } from "lucide-react";
import Dropdown, { ColumnDef } from "../../../../components/Dropdown";
import { LocationMaster } from "../../../../components/LocationMaster";
import CrudVendor from "../vendor/pages/AddNewVendor";
import NameAndCodeMaster from "../../../../components/NameAndCodeComponent";

import { getAllVendors } from "../vendor/api/vendorService";
import { fetchAllLocations } from "../../inventory/stockAdjustment/api/LocationMaster";

// --- Types & Interfaces ---

export interface PurchaseBillFormData {
  gstType: string;
  cashCredit: string;

  // Store Info
  store: string;
  storeId?: string;
  storeCode?: string;

  // Vendor Info
  vendor: string;
  vendorId?: string;
  vendorCode?: string;

  priceCategory: string;
  tax: string;
  placeOfSupply: string;
  shipTo: string;
  paymentTerms: string;
  email?: string;
  orderNo?: string;
  refNo?: string;

  // Dates (YYYY-MM-DD)
  orderDate: string;
  refDate: string;
  dueDate: string;

  // Auto-fill fields
  billToText?: string;
  shipToText?: string;
  gstNo?: string;
  contactPerson?: string;
}

interface SimpleOption {
  name: string;
  id?: string;
  code?: string;
}

interface ActionBtnProps {
  icon: React.ReactElement;
  onClick?: () => void;
}

interface PurchaseBillFormProps {
  themeColor?: string;
  onSubmit?: (data: PurchaseBillFormData) => void;
  // Callback to notify parent of changes for real-time sync
  onFormChange?: (data: PurchaseBillFormData) => void;
}

export interface PurchaseBillFormRef {
  triggerSubmit: () => void;
  getFormData: () => PurchaseBillFormData;
}

// --- Helper Components ---

const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({
  children,
  required,
}) => (
  <label className="text-[13px] text-gray-700 font-medium flex items-center h-[30px] whitespace-nowrap">
    {children} {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const toOptions = (arr: string[]): SimpleOption[] =>
  arr.map((s) => ({ name: s }));

const mockData = {
  gstTypes: toOptions([
    "TaxInvoice",
    "Import",
    "ReverseCharges",
    "BillOfSupply_Compounding",
    "BillOfSupply_UnRegistered",
    "BillOfSupply_Exempted",
    "BillOfSupply_NilRated",
    "BillOfSupply_NonGST",
    "BranchTransfer",
  ]),
  cashCredit: toOptions(["Cash", "Credit"]),
  priceCategories: toOptions(["Wholesale", "Retail", "Distributor"]),
  taxOptions: toOptions(["Inclusive", "Exclusive"]),
  paymentTerms: toOptions(["Net 30", "Immediate", "Cash on Delivery"]),
};

const InputGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center w-full relative gap-1">{children}</div>
);

const Input: React.FC<{
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, placeholder, readOnly, onChange }) => (
  <input
    type="text"
    className={`w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)] ${
      readOnly ? "bg-gray-50" : ""
    }`}
    value={value || ""}
    onChange={onChange}
    placeholder={placeholder}
    readOnly={readOnly}
  />
);

const DateField: React.FC<{
  value: string;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => (
  <div className="relative w-full">
    <input
      type="date"
      className="w-full h-[30px] bg-white border border-gray-300 rounded-sm px-2 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)] uppercase"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const ActionBtn: React.FC<ActionBtnProps> = ({ icon, onClick }) => (
  <button
    onClick={onClick}
    type="button"
    className="h-[32px] w-[32px] bg-[var(--theme-primary)] text-white flex items-center justify-center rounded-sm border border-[var(--theme-primary)] hover:opacity-90 transition-opacity ml-[-1px] z-10 shadow-sm"
  >
    {icon}
  </button>
);

const AccordionSection: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, isOpen, onToggle, children }) => (
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

// --- MAIN COMPONENT ---
const PurchaseBillForm = forwardRef<PurchaseBillFormRef, PurchaseBillFormProps>(
  ({ themeColor = "#0f3c63", onSubmit, onFormChange }, ref) => {
    // --- State ---
    const [storeOptions, setStoreOptions] = useState<SimpleOption[]>([]);
    const [vendorOptions, setVendorOptions] = useState<SimpleOption[]>([]);

    const [rawVendors, setRawVendors] = useState<any[]>([]);
    const [rawStores, setRawStores] = useState<any[]>([]);

    const [isBillToOpen, setBillToOpen] = useState<boolean>(false);
    const [isShipToOpen, setShipToOpen] = useState<boolean>(false);
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const getToday = () => new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState<PurchaseBillFormData>({
      gstType: "TaxInvoice",
      cashCredit: "Credit",
      store: "",
      storeId: "",
      storeCode: "",
      vendor: "",
      vendorId: "",
      vendorCode: "",
      priceCategory: "Wholesale",
      tax: "Inclusive",
      placeOfSupply: "",
      shipTo: "",
      paymentTerms: "",
      email: "",
      orderNo: "",
      refNo: "",
      orderDate: getToday(),
      refDate: getToday(),
      dueDate: getToday(),
      billToText: "",
      shipToText: "",
      gstNo: "",
      contactPerson: "",
    });

    const simpleColumns: ColumnDef<SimpleOption>[] = [
      { header: "Name", key: "name", width: "flex-1" },
    ];

    const themeStyles = {
      "--theme-primary": themeColor,
      "--theme-secondary": themeColor,
      "--theme-focus": "#60a5fa",
    } as React.CSSProperties;

    // --- Master update handler for real-time sync ---
    const updateFormState = (updates: Partial<PurchaseBillFormData>) => {
      setFormData((prev) => {
        const newData = { ...prev, ...updates };
        // This notifies the parent (PurchaseBill.tsx) on every single change
        if (onFormChange) {
          onFormChange(newData);
        }
        return newData;
      });
    };

    useEffect(() => {
      loadDropdownData();
    }, []);

    const loadDropdownData = async () => {
      try {
        // 1. Stores
        const storesData = await fetchAllLocations();
        setRawStores(storesData);
        const mappedStores = storesData.map((item: any) => ({
          name: item.name || item.storeName,
          id: item._id,
        }));
        setStoreOptions(mappedStores);

        // Auto-select first store and sync with parent
        if (mappedStores.length > 0) {
          const firstStore = storesData[0];
          updateFormState({
            store: mappedStores[0].name,
            storeId: mappedStores[0].id,
            storeCode: firstStore.code || "",
          });
        }

        // 2. Vendors
        const vendorsData = await getAllVendors();
        setRawVendors(vendorsData);
        const mappedVendors = vendorsData.map((item: any) => ({
          name: item.vend_name || item.name,
          id: item._id,
        }));
        setVendorOptions(mappedVendors);
      } catch (error) {
        console.error("Error loading dropdowns", error);
      }
    };

    const handleDropdownChange = (
      field: keyof PurchaseBillFormData,
      item: SimpleOption | null,
    ) => {
      const value = item?.name || "";
      let updates: Partial<PurchaseBillFormData> = { [field]: value };

      if (field === "store" && item) {
        const fullStore = rawStores.find((s) => s._id === item.id);
        updates = {
          ...updates,
          storeId: item.id,
          storeCode: fullStore?.code || fullStore?.storeCode || "",
        };
      }

      if (field === "vendor" && item) {
        const fullVendor = rawVendors.find((v) => v._id === item.id);
        if (fullVendor) {
          // Extract vendorCode for syncing with OrderTable
          const vCode = fullVendor.code || fullVendor.vend_code || "";

          const billTo = `${fullVendor.vend_name || fullVendor.name || ""}\n${fullVendor.address || ""}\n${fullVendor.city || ""}, ${fullVendor.state || ""} - ${fullVendor.pin_code || ""}\nPhone: ${fullVendor.phone || ""}`;
          const shipToAddress = `${fullVendor.vend_name || fullVendor.name || ""}\n${fullVendor.address_ship || fullVendor.address || ""}\n${fullVendor.city_ship || fullVendor.city || ""}, ${fullVendor.state_ship || fullVendor.state || ""} - ${fullVendor.pin_code_ship || fullVendor.pin_code || ""}\nPhone: ${fullVendor.phone_ship || fullVendor.phone || ""}`;

          updates = {
            ...updates,
            vendorId: item.id,
            vendorCode: vCode,
            email: fullVendor.email || "",
            priceCategory: fullVendor.price_category || formData.priceCategory,
            paymentTerms: fullVendor.payment_term || formData.paymentTerms,
            placeOfSupply: fullVendor.state || "",
            billToText: billTo,
            shipToText: shipToAddress,
            gstNo: fullVendor.gst_no || "",
            contactPerson: fullVendor.contact_person || "",
          };
        }
      }

      updateFormState(updates);
    };

    const handleInputChange = (
      field: keyof PurchaseBillFormData,
      value: string,
    ) => {
      updateFormState({ [field]: value });
    };

    useImperativeHandle(ref, () => ({
      triggerSubmit: () => {
        if (onSubmit) {
          if (!formData.vendor) {
            alert("Please select a vendor");
            return;
          }
          onSubmit(formData);
        }
      },
      getFormData: () => formData,
    }));

    return (
      <div
        style={themeStyles}
        className="bg-white rounded border border-gray-200 p-5 relative"
      >
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4 space-y-1">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>GST Type</Label>
              </div>
              <div className="col-span-8">
                <Dropdown
                  data={mockData.gstTypes}
                  columns={simpleColumns}
                  value={formData.gstType}
                  valueKey="name"
                  onChange={(i) => handleDropdownChange("gstType", i)}
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Cash/Credit</Label>
              </div>
              <div className="col-span-8">
                <Dropdown
                  data={mockData.cashCredit}
                  columns={simpleColumns}
                  value={formData.cashCredit}
                  valueKey="name"
                  onChange={(i) => handleDropdownChange("cashCredit", i)}
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
                    columns={simpleColumns}
                    value={formData.store}
                    valueKey="name"
                    onChange={(item) => handleDropdownChange("store", item)}
                  />
                  <ActionBtn
                    icon={<EditIcon size={14} />}
                    onClick={() => setActiveModal("store")}
                  />
                </InputGroup>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label required>Vendor</Label>
              </div>
              <div className="col-span-8">
                <InputGroup>
                  <Dropdown
                    data={vendorOptions}
                    columns={simpleColumns}
                    value={formData.vendor}
                    valueKey="name"
                    placeholder="Select Vendor..."
                    onChange={(item) => handleDropdownChange("vendor", item)}
                  />
                  <ActionBtn
                    icon={<EditIcon size={16} />}
                    onClick={() => setActiveModal("vendor")}
                  />
                  <ActionBtn icon={<BarChart2 size={14} />} />
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
                  onChange={(e) => handleInputChange("email", e.target.value)}
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
                    data={mockData.priceCategories}
                    columns={simpleColumns}
                    value={formData.priceCategory}
                    valueKey="name"
                    onChange={(item) =>
                      handleDropdownChange("priceCategory", item)
                    }
                  />
                  <ActionBtn
                    icon={<EditIcon size={16} />}
                    onClick={() => setActiveModal("priceCategory")}
                  />
                </InputGroup>
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-1">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label required>Date</Label>
              </div>
              <div className="col-span-8">
                <DateField
                  value={formData.orderDate}
                  onChange={(val) => handleInputChange("orderDate", val)}
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Invoice No</Label>
              </div>
              <div className="col-span-8">
                <Input
                  value={formData.orderNo}
                  onChange={(e) => handleInputChange("orderNo", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Supplier Inv No</Label>
              </div>
              <div className="col-span-8">
                <Input
                  value={formData.refNo}
                  onChange={(e) => handleInputChange("refNo", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Supplier Inv Date</Label>
              </div>
              <div className="col-span-8">
                <DateField
                  value={formData.refDate}
                  onChange={(val) => handleInputChange("refDate", val)}
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <Label>Tax</Label>
              </div>
              <div className="col-span-8">
                <Dropdown
                  data={mockData.taxOptions}
                  columns={simpleColumns}
                  value={formData.tax}
                  valueKey="name"
                  onChange={(i) => handleDropdownChange("tax", i)}
                />
              </div>
            </div>
          </div>

          <div className="col-span-4 flex flex-col min-h-full">
            <AccordionSection
              title="Billing Address"
              isOpen={isBillToOpen}
              onToggle={() => setBillToOpen(!isBillToOpen)}
            >
              <div className="space-y-2">
                <textarea
                  className="w-full h-20 border border-gray-300 rounded text-[13px] p-2 resize-none focus:outline-none"
                  value={formData.billToText}
                  onChange={(e) =>
                    handleInputChange("billToText", e.target.value)
                  }
                />
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <Label>GST No</Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={formData.gstNo}
                      onChange={(e) =>
                        handleInputChange("gstNo", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <Label>Place of Supply</Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={formData.placeOfSupply}
                      onChange={(e) =>
                        handleInputChange("placeOfSupply", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </AccordionSection>

            <AccordionSection
              title="Delivery At"
              isOpen={isShipToOpen}
              onToggle={() => setShipToOpen(!isShipToOpen)}
            >
              <div className="flex items-center mb-2">
                <span className="w-16 text-[13px] text-gray-600 font-medium whitespace-nowrap">
                  Delivery At
                </span>
                <Dropdown
                  data={storeOptions}
                  columns={simpleColumns}
                  value={formData.shipTo}
                  valueKey="name"
                  onChange={(item) => handleDropdownChange("shipTo", item)}
                />
              </div>
              <textarea
                className="w-full h-24 border border-gray-300 rounded text-[13px] p-2 resize-none focus:outline-none"
                value={formData.shipToText}
                onChange={(e) =>
                  handleInputChange("shipToText", e.target.value)
                }
              />
            </AccordionSection>

            <div className="mt-auto pt-4 space-y-1">
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label>Payment Terms</Label>
                </div>
                <div className="col-span-8">
                  <Dropdown
                    data={mockData.paymentTerms}
                    columns={simpleColumns}
                    value={formData.paymentTerms}
                    valueKey="name"
                    onChange={(item) =>
                      handleDropdownChange("paymentTerms", item)
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label>Due Date</Label>
                </div>
                <div className="col-span-8">
                  <DateField
                    value={formData.dueDate}
                    onChange={(val) => handleInputChange("dueDate", val)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
            <div className="p-8">
              {activeModal === "vendor" && (
                <CrudVendor
                  onClose={() => setActiveModal(null)}
                  onSuccess={() => {
                    setActiveModal(null);
                    loadDropdownData();
                  }}
                  initialData={null}
                />
              )}
              {activeModal === "store" && (
                <LocationMaster
                  onClose={() => setActiveModal(null)}
                  onSuccess={() => {
                    setActiveModal(null);
                    loadDropdownData();
                  }}
                  initialData={null}
                />
              )}
              {activeModal === "priceCategory" && (
                <NameAndCodeMaster
                  title="Price Category"
                  onClose={() => setActiveModal(null)}
                  index={1200}
                />
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

export default PurchaseBillForm;
