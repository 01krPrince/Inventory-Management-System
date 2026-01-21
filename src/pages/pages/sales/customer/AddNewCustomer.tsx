import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Globe,
  Edit,
  ChevronRight,
  X,
  Save,
  ArrowRight,
  ArrowLeft,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  Trash2,
  Plus,
  MessageCircle,
  Landmark,
} from "lucide-react";
import {
  addCustomer,
  fetchBankDetailsApi,
  customerUpdateApi,
} from "../../../../services/sales/customer/customerService";
import Attachment from "../../../../components/Attachment";
import { FormData } from "../../../../services/sales/customer/AddCustomerPayload";
import Dropdown, { ColumnDef } from "../../../../components/Dropdown";
import chartOfAccountService, {
  ChartOfAccount,
} from "../../../../services/chartOfAccountService";
import ChartOfAccounts from "../../../../components/ChartOfAccount";

// --- UPDATED IMPORTS ---
import {
  fetchSalesExecutives,
  SalesExecutiveData,
} from "../../../../components/addItemMaster/api/salesExecutiveService";
import SalesExecutiveMaster from "../../../../components/SalesExecutiveMaster";

interface ContactData {
  name: string;
  email: string;
  phone: string;
  designation: string;
}

const INITIAL_DATA: FormData = {
  // Basic Details
  gst_no: "",
  cust_name: "",
  print_name: "",
  identification: "",
  under_ledger: "",
  cust_comman: false,
  is_sub_customer: false,
  under_customer: false,
  profileImage: null,

  // Statutory
  gst: "",
  registration_date: "",
  cin: "",
  pan: "",
  goods_service: "Goods",
  gst_category: "Registered",
  gst_suspend: false,
  distance: 12,
  tds_on_gst_applicable: false,

  // Communication
  address: "",
  country: "",
  state: "",
  city: "",
  pin_code: "",
  phone: "",
  email: "",
  longitude: "",
  latitude: "",
  route_map: "https://maps.google.com",

  address_ship: "",
  country_ship: "",
  state_ship: "",
  city_ship: "",
  pin_code_ship: "",
  phone_ship: "",
  email_ship: "",
  longitude_ship: "",
  latitude_ship: "",
  route_map_ship: "https://maps.google.com",

  // Social Profile
  website: "",
  facebook: "",
  skype: "",
  twitter: "",
  linkedin: "",

  // Defaults
  payment_term: "",
  price_category: "",
  batch_rate_category: "",
  sales_executive: "",
  transporter: "",
  credit_limit: "",
  max_credit_days: "",
  interest_rate_yearly: "",
  customer_on_watch: false,
  firm_status: "Active",
  territory: "",
  customer_category: "",

  // Bank Detail
  ifsc_code: "",
  account_number: "",
  bank_name: "",
  branch: "",

  // Contact Persons
  contact_person: "",
  contact: [],
};

const STEPS = [
  { id: 0, label: "Basic Details" },
  { id: 1, label: "Statutory" },
  { id: 2, label: "Communication" },
  { id: 3, label: "Social Profile" },
  { id: 4, label: "Defaults" },
  { id: 5, label: "Bank Detail" },
  { id: 6, label: "Contact Person" },
  { id: 7, label: "Attachments" },
];

// --- Components ---

const FormLabel = ({
  required,
  children,
}: {
  required?: boolean;
  children: React.ReactNode;
}) => (
  <label className="block text-xs font-medium text-gray-700 mb-1">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const ToggleSwitch = ({
  checked,
  onChange,
  name,
}: {
  checked: boolean;
  onChange: any;
  name: string;
}) => (
  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
    <input
      type="checkbox"
      name={name}
      id={name}
      className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300"
      style={{
        right: checked ? "0" : "auto",
        left: checked ? "auto" : "0",
        borderColor: checked ? "#1e40af" : "#d1d5db",
      }}
      checked={checked}
      onChange={onChange}
    />
    <label
      htmlFor={name}
      className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${
        checked ? "bg-[#0c5888]" : "bg-gray-300"
      }`}
    ></label>
  </div>
);

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  className = "",
  placeholder = "",
}: any) => (
  <div className={`mb-3 ${className}`}>
    <FormLabel required={required}>{label}</FormLabel>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#0c5888]"
    />
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  className = "",
}: any) => (
  <div className={`mb-3 ${className}`}>
    <FormLabel required={required}>{label}</FormLabel>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#0c5888]"
    >
      <option value="">Select...</option>
      {options.map((opt: string) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const SocialInput = ({
  icon: Icon,
  name,
  value,
  placeholder,
  onChange,
}: any) => (
  <div className="flex items-center mb-4">
    <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-l border-y border-l border-gray-300">
      <Icon className="w-5 h-5 text-gray-600" />
    </div>
    <div className="flex-1">
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-r px-3 py-2 text-sm focus:outline-none focus:border-[#0c5888]"
      />
    </div>
  </div>
);

// --- Column Definitions ---

const underLedger: ColumnDef<ChartOfAccount>[] = [
  { header: "Code", key: "code", width: "w-24" },
  { header: "Name", key: "name", width: "w-full" },
];

const salesExecutiveColumns: ColumnDef<SalesExecutiveData>[] = [
  { header: "Code", key: "code", width: "w-24" },
  { header: "Name", key: "name", width: "w-48" },
  { header: "Type", key: "amountType", width: "w-24" },
];

interface AddNewCustomerProps {
  onClose: (isBack?: boolean) => void;
  initialData?: any;
  onSuccess?: () => void;
  index?: number;
}

const CrudCustomer: React.FC<AddNewCustomerProps> = ({
  onClose,
  initialData,
  onSuccess,
  index = 50,
}) => {
  const overlayZIndex = index + 10;
  const dropdownZIndex = overlayZIndex + 20;
  const nestedModalZIndex = overlayZIndex + 30;

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ledger/COA States
  const [coaFormData, setCoaFormData] = useState<ChartOfAccount | null>(null);
  const [glDataFull, setGlDataFull] = useState<ChartOfAccount[]>([]);
  const [showChartOfAccounts, setShowChartOfAccounts] = useState(false);

  // Sales Executive States
  const [salesExecutiveList, setSalesExecutiveList] = useState<
    SalesExecutiveData[]
  >([]);
  const [showSalesExecutiveModal, setShowSalesExecutiveModal] = useState(false);
  const [selectedExecutiveObj, setSelectedExecutiveObj] =
    useState<SalesExecutiveData | null>(null);

  // Contact Modal States
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContactIndex, setEditingContactIndex] = useState<number | null>(
    null,
  );
  const [contactForm, setContactForm] = useState<ContactData>({
    name: "",
    email: "",
    phone: "",
    designation: "",
  });

  const isEditMode = !!initialData && !!initialData._id;

  // --- API Loaders ---

  const loadSalesExecutives = async () => {
    try {
      const data = await fetchSalesExecutives();
      if (data && Array.isArray(data)) {
        setSalesExecutiveList(data);
      }
    } catch (error) {
      console.error("Failed to load sales executives", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load Chart of Accounts
        const coaResponse = await chartOfAccountService.getAllChartOfAccounts();
        if (coaResponse.data && coaResponse.data.success) {
          setGlDataFull(coaResponse.data.data);
        }

        // Load Sales Executives using new Service
        await loadSalesExecutives();
      } catch (error) {
        console.error("Failed to load dropdown data", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (initialData) {
      const val = (v: any) => (v !== null && v !== undefined ? String(v) : "");

      // Handle Ledger mapping
      let ledgerName = val(initialData.under_ledger);
      let selectedLedgerObj = null;

      if (glDataFull.length > 0) {
        const found = glDataFull.find(
          (g) => g._id === ledgerName || g.name === ledgerName,
        );
        if (found) {
          ledgerName = found.name;
          selectedLedgerObj = found;
        }
      }
      if (selectedLedgerObj) setCoaFormData(selectedLedgerObj);

      // Handle Sales Executive mapping
      let executiveName = val(initialData.sales_executive);
      // We don't strictly need to find the object for the Form Data (string name),
      // but if we wanted to pre-select for editing, we could do it here.

      setFormData({
        ...INITIAL_DATA,
        gst_no: val(initialData.gst_no),
        cust_name: val(initialData.cust_name || initialData.name),
        print_name: val(initialData.print_name),
        identification: val(initialData.identification),
        under_ledger: ledgerName,
        cust_comman: !!initialData.cust_comman,
        is_sub_customer: !!initialData.is_sub_customer,
        under_customer:
          typeof initialData.under_customer === "string"
            ? initialData.under_customer
            : !!initialData.under_customer,
        profileImage: initialData.profile_photo || null,

        gst: val(initialData.gst || initialData.gst_no),
        registration_date: val(initialData.registration_date),
        cin: val(initialData.cin),
        pan: val(initialData.pan),
        goods_service: val(initialData.goods_service),
        gst_category: val(initialData.gst_category),
        gst_suspend: !!initialData.gst_suspend,
        distance: Number(initialData.distance) || 0,
        tds_on_gst_applicable: !!initialData.tds_on_gst_applicable,

        address: val(initialData.address),
        country: val(initialData.country || "India"),
        state: val(initialData.state),
        city: val(initialData.city),
        pin_code: val(initialData.pin_code),
        phone: val(initialData.phone),
        email: val(initialData.email),
        longitude: val(initialData.longitude),
        latitude: val(initialData.latitude),
        route_map: val(initialData.route_map),

        address_ship: val(initialData.address_ship),
        country_ship: val(initialData.country_ship || "India"),
        state_ship: val(initialData.state_ship),
        city_ship: val(initialData.city_ship),
        pin_code_ship: val(initialData.pin_code_ship),
        phone_ship: val(initialData.phone_ship),
        email_ship: val(initialData.email_ship),
        longitude_ship: val(initialData.longitude_ship),
        latitude_ship: val(initialData.latitude_ship),
        route_map_ship: val(initialData.route_map_ship),

        website: val(initialData.website),
        facebook: val(initialData.facebook),
        skype: val(initialData.skype),
        twitter: val(initialData.twitter),
        linkedin: val(initialData.linkedin),

        payment_term: val(initialData.payment_term),
        price_category: val(initialData.price_category),
        batch_rate_category: val(initialData.batch_rate_category) || "Standard",
        sales_executive: executiveName,
        transporter: val(initialData.transporter),
        credit_limit: val(initialData.credit_limit),
        max_credit_days: val(initialData.max_credit_days),
        interest_rate_yearly: val(initialData.interest_rate_yearly),
        customer_on_watch:
          initialData.customer_on_watch === "Yes" ||
          !!initialData.customer_on_watch,
        firm_status: val(initialData.firm_status || "Active"),
        territory: val(initialData.territory),
        customer_category: val(initialData.customer_category),

        ifsc_code: val(initialData.ifsc_code),
        account_number: val(initialData.account_number),
        bank_name: val(initialData.bank_name),
        branch: val(initialData.branch),

        contact_person: val(initialData.contact_person),
        contact: Array.isArray(initialData.contact) ? initialData.contact : [],
      });
    }
  }, [initialData, glDataFull, salesExecutiveList]);

  // --- Handlers ---

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDropdownChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    if (fieldName === "under_ledger") {
      const selected = glDataFull.find((item) => item.name === value);
      setCoaFormData(selected || null);
    }

    if (fieldName === "sales_executive") {
      const selected = salesExecutiveList.find((item) => item.name === value);
      setSelectedExecutiveObj(selected || null);
    }
  };

  const handleEditSalesExecutive = () => {
    // Determine if we are editing an existing selection or creating new
    if (formData.sales_executive) {
      const found = salesExecutiveList.find(
        (x) => x.name === formData.sales_executive,
      );
      setSelectedExecutiveObj(found || null);
    } else {
      setSelectedExecutiveObj(null); // Create mode
    }
    setShowSalesExecutiveModal(true);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFormData((prev) => ({ ...prev, profileImage: url }));
    }
  };

  const copyBillingToShipping = () => {
    setFormData((prev) => ({
      ...prev,
      address_ship: prev.address,
      country_ship: prev.country,
      state_ship: prev.state,
      city_ship: prev.city,
      pin_code_ship: prev.pin_code,
      phone_ship: prev.phone,
      email_ship: prev.email,
    }));
  };

  const fetchBankDetails = async () => {
    try {
      const bankData = await fetchBankDetailsApi(formData.ifsc_code);
      setFormData((prev) => ({
        ...prev,
        ...bankData,
      }));
    } catch (error) {
      alert("Failed to fetch bank details");
    }
  };

  const openAddContact = () => {
    setContactForm({ name: "", email: "", phone: "", designation: "" });
    setEditingContactIndex(null);
    setShowContactModal(true);
  };

  const openEditContact = (index: number) => {
    const contact = formData.contact[index];
    setContactForm({ ...contact });
    setEditingContactIndex(index);
    setShowContactModal(true);
  };

  const saveContact = () => {
    if (!contactForm.name) {
      alert("Contact Name is required");
      return;
    }

    setFormData((prev) => {
      const updatedContacts = [...prev.contact];
      if (editingContactIndex !== null) {
        updatedContacts[editingContactIndex] = contactForm;
      } else {
        updatedContacts.push(contactForm);
      }
      return { ...prev, contact: updatedContacts };
    });

    setShowContactModal(false);
  };

  const deleteContact = (index: number) => {
    if (window.confirm("Delete this contact?")) {
      setFormData((prev) => ({
        ...prev,
        contact: prev.contact.filter((_, i) => i !== index),
      }));
    }
  };

  const handleNext = async () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Resolve Ledger ID or set to NULL
      let underLedgerId: string | null = null;

      if (formData.under_ledger) {
        const foundLedger = glDataFull.find(
          (gl) => gl.name === formData.under_ledger,
        );
        if (foundLedger) {
          underLedgerId = foundLedger._id!;
        } else {
          // Check if it looks like a MongoID (24 hex chars)
          const isMongoId = /^[0-9a-fA-F]{24}$/.test(formData.under_ledger);
          underLedgerId = isMongoId ? formData.under_ledger : null;
        }
      }

      const val = (v: any) => (v === undefined || v === null ? "" : String(v));

      const payload = {
        ...formData,
        // Replace name with ID or NULL
        under_ledger: underLedgerId,

        // Ensure bools and numbers are correct types
        cust_comman: !!formData.cust_comman,
        is_sub_customer: !!formData.is_sub_customer,
        gst_suspend: !!formData.gst_suspend,
        tds_on_gst_applicable: !!formData.tds_on_gst_applicable,
        distance: Number(formData.distance),
        customer_on_watch: formData.customer_on_watch ? "Yes" : "No",

        // Ensure strings
        gst_no: val(formData.gst_no),
        cust_name: val(formData.cust_name),
      };

      const finalPayload = { ...payload, profile_photo: formData.profileImage };

      // TS Fix: Cast to any to allow 'null' in under_ledger
      const apiPayload = finalPayload as any;

      let response;
      if (isEditMode) {
        response = await customerUpdateApi(initialData._id, apiPayload);
      } else {
        response = await addCustomer(apiPayload);
      }

      if (response.success) {
        alert(
          response.message ||
            (isEditMode ? "Updated successfully!" : "Created successfully!"),
        );
        if (onSuccess) onSuccess();
        onClose(false);
      } else {
        alert("Operation failed: " + (response.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveCOA = (savedData: ChartOfAccount) => {
    if (savedData?.name) {
      setGlDataFull((prev) => {
        const exists = prev.find((item) => item.name === savedData.name);
        if (exists) {
          return prev.map((item) =>
            item.name === savedData.name ? savedData : item,
          );
        }
        return [...prev, savedData];
      });
      setFormData((prev) => ({ ...prev, under_ledger: savedData.name }));
    }
    setShowChartOfAccounts(false);
  };

  // --- Render Steps ---

  const renderBasicDetails = () => (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 md:col-span-8 space-y-3">
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-3">
            <FormLabel>GST No</FormLabel>
          </div>
          <div className="col-span-7">
            <input
              type="text"
              name="gst_no"
              value={formData.gst_no}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="col-span-2">
            <button className="bg-[#0c5888] text-white text-xs px-3 py-1.5 rounded hover:bg-[#0a4a70] w-full">
              Fetch
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-3">
            <FormLabel required>Name</FormLabel>
          </div>
          <div className="col-span-9">
            <input
              type="text"
              name="cust_name"
              value={formData.cust_name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-3">
            <FormLabel required>Print Name</FormLabel>
          </div>
          <div className="col-span-9">
            <input
              type="text"
              name="print_name"
              value={formData.print_name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-3">
            <FormLabel>Identification</FormLabel>
          </div>
          <div className="col-span-9">
            <input
              type="text"
              name="identification"
              value={formData.identification}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
        </div>

        <div className="mb-3">
          <FormLabel required>Under Ledger</FormLabel>
          <div className="flex w-full">
            <div className="flex-1 min-w-0">
              <Dropdown
                data={glDataFull}
                columns={underLedger}
                value={formData.under_ledger}
                valueKey="name"
                onChange={(item) =>
                  handleDropdownChange("under_ledger", item?.name || "")
                }
                placeholder="Select..."
                zIndex={dropdownZIndex}
              />
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowChartOfAccounts(true);
              }}
              className="bg-[#0c5888] text-white px-2 rounded-r hover:bg-[#0a4a70] ml-[1px]"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-3">
            <FormLabel>Customer Common</FormLabel>
          </div>
          <div className="col-span-9 flex items-center justify-end">
            <ToggleSwitch
              name="cust_comman"
              checked={formData.cust_comman}
              onChange={handleInputChange}
            />
            <span className="text-xs font-bold text-gray-600">
              {formData.cust_comman ? "ON" : "OFF"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-3">
            <FormLabel>Is Sub Customer</FormLabel>
          </div>
          <div className="col-span-9 flex items-center justify-end">
            <ToggleSwitch
              name="is_sub_customer"
              checked={formData.is_sub_customer}
              onChange={handleInputChange}
            />
            <span className="text-xs font-bold text-gray-600">
              {formData.is_sub_customer ? "ON" : "OFF"}
            </span>
          </div>
        </div>

        {formData.is_sub_customer && (
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-3">
              <FormLabel required>Under Customer</FormLabel>
            </div>
            <div className="col-span-9 relative">
              <select
                name="under_customer"
                value={
                  typeof formData.under_customer === "boolean"
                    ? ""
                    : formData.under_customer
                }
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white"
              >
                <option value="">Select...</option>
              </select>
              <ChevronRight className="w-4 h-4 absolute right-2 top-1.5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      <div className="col-span-12 md:col-span-4 flex flex-col items-center justify-start mt-2">
        <div className="w-56 h-56 bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
          {formData.profileImage ? (
            <>
              <img
                src={formData.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() =>
                  setFormData((prev) => ({ ...prev, profileImage: null }))
                }
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <div className="text-gray-400">No Image</div>
          )}
        </div>
        <div className="mt-4 w-56">
          <label className="cursor-pointer bg-[#0c5888] hover:bg-[#0a4a70] text-white text-xs font-bold py-2 px-4 rounded shadow block text-center">
            Browse
            <input
              type="file"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderStatutory = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div className="space-y-4">
          <InputField
            label="GST"
            name="gst"
            value={formData.gst}
            onChange={handleInputChange}
          />
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <FormLabel>Registration Date</FormLabel>
            </div>
            <div className="col-span-8">
              <input
                type="date"
                name="registration_date"
                value={formData.registration_date}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              />
            </div>
          </div>
          <InputField
            label="CIN"
            name="cin"
            value={formData.cin}
            onChange={handleInputChange}
          />
          <InputField
            label="PAN"
            name="pan"
            value={formData.pan}
            onChange={handleInputChange}
          />
          <SelectField
            label="Goods Service"
            name="goods_service"
            value={formData.goods_service}
            onChange={handleInputChange}
            options={["Goods", "Service"]}
          />
        </div>
        <div className="space-y-4">
          <SelectField
            label="GST Category"
            name="gst_category"
            value={formData.gst_category}
            onChange={handleInputChange}
            options={["Registered", "Unregistered", "Composite"]}
          />
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <FormLabel>GST Suspend</FormLabel>
            </div>
            <div className="col-span-8 flex justify-end">
              <input
                type="checkbox"
                name="gst_suspend"
                checked={formData.gst_suspend}
                onChange={handleInputChange}
                className="w-5 h-5"
              />
            </div>
          </div>
          <InputField
            label="Distance"
            name="distance"
            type="number"
            value={formData.distance}
            onChange={handleInputChange}
          />
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <FormLabel>TDS Applicable</FormLabel>
            </div>
            <div className="col-span-8 flex justify-end">
              <input
                type="checkbox"
                name="tds_on_gst_applicable"
                checked={formData.tds_on_gst_applicable}
                onChange={handleInputChange}
                className="w-5 h-5"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCommunication = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-bold text-[#0c5888] mb-4 border-b pb-2">
            Billing Information
          </h3>
          <div className="space-y-3">
            <div>
              <FormLabel>Address</FormLabel>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              />
            </div>
            <InputField
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="State"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
              />
              <InputField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            <InputField
              label="Pin Code"
              name="pin_code"
              value={formData.pin_code}
              onChange={handleInputChange}
            />
            <InputField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <InputField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-sm font-bold text-[#0c5888]">
              Shipping Address
            </h3>
            <button
              onClick={copyBillingToShipping}
              className="flex items-center text-xs text-[#0c5888] border border-[#0c5888] rounded px-2 py-1"
            >
              <Copy className="w-3 h-3 mr-1" /> Copy Billing
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <FormLabel>Address</FormLabel>
              <textarea
                name="address_ship"
                value={formData.address_ship}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              />
            </div>
            <InputField
              label="Country"
              name="country_ship"
              value={formData.country_ship}
              onChange={handleInputChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="State_ship"
                name="state_ship"
                value={formData.state_ship}
                onChange={handleInputChange}
              />
              <InputField
                label="City_ship"
                name="city_ship"
                value={formData.city_ship}
                onChange={handleInputChange}
              />
            </div>
            <InputField
              label="Pin Code_ship"
              name="pin_code_ship"
              value={formData.pin_code_ship}
              onChange={handleInputChange}
            />
            <InputField
              label="Phone_ship"
              name="phone_ship"
              value={formData.phone_ship}
              onChange={handleInputChange}
            />
            <InputField
              label="Email_ship"
              name="email_ship"
              value={formData.email_ship}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSocialProfile = () => (
    <div className="bg-white border rounded-lg p-8 shadow-sm mt-4 max-w-3xl mx-auto">
      <div className="space-y-2">
        <SocialInput
          icon={Globe}
          label="Website"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
        />
        <SocialInput
          icon={Facebook}
          label="Facebook"
          name="facebook"
          value={formData.facebook}
          onChange={handleInputChange}
        />
        <SocialInput
          icon={MessageCircle}
          label="Skype"
          name="skype"
          value={formData.skype}
          onChange={handleInputChange}
        />
        <SocialInput
          icon={Twitter}
          label="Twitter"
          name="twitter"
          value={formData.twitter}
          onChange={handleInputChange}
        />
        <SocialInput
          icon={Linkedin}
          label="LinkedIn"
          name="linkedin"
          value={formData.linkedin}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );

  const renderDefaults = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SelectField
          label="Payment Terms"
          name="payment_term"
          value={formData.payment_term}
          onChange={handleInputChange}
          options={["Due on Receipt", "Net 15", "Net 30", "Net 60"]}
        />
        <SelectField
          label="Price Category"
          name="price_category"
          value={formData.price_category}
          onChange={handleInputChange}
          options={["Retail", "Wholesale", "Distributor"]}
        />

        {/* Dynamic Sales Executive Dropdown with Edit Button */}
        <div className="mb-3">
          <FormLabel>Sales Executive</FormLabel>
          <div className="flex w-full">
            <div className="flex-1 min-w-0">
              <Dropdown
                data={salesExecutiveList}
                columns={salesExecutiveColumns}
                value={formData.sales_executive}
                valueKey="name"
                onChange={(item) =>
                  handleDropdownChange("sales_executive", item?.name || "")
                }
                placeholder="Select..."
                zIndex={dropdownZIndex}
              />
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleEditSalesExecutive();
              }}
              className="bg-[#0c5888] text-white px-2 rounded-r hover:bg-[#0a4a70] ml-[1px]"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>

        <SelectField
          label="Transporter"
          name="transporter"
          value={formData.transporter}
          onChange={handleInputChange}
          options={["Select...", "DHL", "FedEx", "Local"]}
        />
        <InputField
          label="Credit Limit"
          name="credit_limit"
          type="number"
          value={formData.credit_limit}
          onChange={handleInputChange}
        />
        <InputField
          label="Max Credit Days"
          name="max_credit_days"
          type="number"
          value={formData.max_credit_days}
          onChange={handleInputChange}
        />
        <InputField
          label="Interest Rate Yearly (%)"
          name="interest_rate_yearly"
          type="number"
          value={formData.interest_rate_yearly}
          onChange={handleInputChange}
        />
        <div className="flex items-center h-full pt-4">
          <input
            type="checkbox"
            name="customer_on_watch"
            checked={
              typeof formData.customer_on_watch === "boolean"
                ? formData.customer_on_watch
                : formData.customer_on_watch === "Yes"
            }
            onChange={handleInputChange}
            className="w-5 h-5 mr-2"
          />
          <span className="text-sm font-medium">Customer On Watch</span>
        </div>
        <SelectField
          label="Firm Status"
          name="firm_status"
          value={formData.firm_status}
          onChange={handleInputChange}
          options={["Active", "Inactive", "Suspended"]}
        />
        <SelectField
          label="Territory"
          name="territory"
          value={formData.territory}
          onChange={handleInputChange}
          options={["Default", "North", "South"]}
        />
        <SelectField
          label="Customer Category"
          name="customer_category"
          value={formData.customer_category}
          onChange={handleInputChange}
          options={["General", "VIP", "Reseller"]}
        />
      </div>
    </div>
  );

  const renderBankDetail = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <div className="flex items-center mb-6 pb-2 border-b">
        <Landmark className="w-5 h-5 text-[#0c5888] mr-2" />
        <h3 className="text-lg font-medium text-gray-800">
          Banking Information
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mb-3">
          <FormLabel>RTGS/IFSC Code</FormLabel>
          <div className="flex">
            <input
              type="text"
              name="ifsc_code"
              value={formData.ifsc_code}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm"
            />
            <button
              onClick={fetchBankDetails}
              className="bg-[#0c5888] text-white text-xs px-4 rounded-r"
            >
              Fetch
            </button>
          </div>
        </div>
        <InputField
          label="Account No."
          name="account_number"
          value={formData.account_number}
          onChange={handleInputChange}
        />
        <InputField
          label="Bank Name"
          name="bank_name"
          value={formData.bank_name}
          onChange={handleInputChange}
        />
        <InputField
          label="Branch"
          name="branch"
          value={formData.branch}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );

  const renderContactPerson = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">Contact Persons</h3>
        <button
          onClick={openAddContact}
          className="flex items-center bg-[#0c5888] text-white px-3 py-2 rounded text-sm hover:bg-[#0a4a70]"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Contact
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Designation
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Mobile
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Email
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {formData.contact.map((contact, idx) => (
              <tr key={idx} className="hover:bg-blue-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <div className="font-medium">{contact.name}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {contact.designation}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {contact.phone}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {contact.email}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    onClick={() => openEditContact(idx)}
                    className="text-[#0c5888] hover:text-[#0a4a70] mr-3"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteContact(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {formData.contact.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-gray-500 text-sm"
                >
                  No contact persons added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm p-4 font-sans text-gray-800"
      style={{ zIndex: overlayZIndex }}
    >
      <div className="max-w-6xl w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-[70vh]">
        {/* Header */}
        <div className="bg-[#0c5888] px-6 py-4 text-white flex justify-between items-center shrink-0">
          <h1 className="text-xl font-semibold tracking-wide">
            {isEditMode ? "EDIT CUSTOMER" : "ADD NEW CUSTOMER"}
          </h1>
          <button
            onClick={() => onClose(false)}
            className="text-white hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Steps */}
        <div className="bg-gray-100 border-b overflow-x-auto shrink-0">
          <div className="flex min-w-max px-4">
            {STEPS.map((step, index) => {
              const isActive = index === activeStep;
              return (
                <div
                  key={step.id}
                  className={`relative py-3 px-4 text-sm font-medium cursor-pointer flex items-center ${
                    isActive
                      ? "text-[#0c5888] border-b-2 border-[#0c5888] bg-white"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 border ${
                      isActive
                        ? "bg-[#0c5888] text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {index + 1}
                  </span>
                  {step.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="px-6 py-2 bg-white overflow-y-auto flex-1">
          {activeStep === 0 && renderBasicDetails()}
          {activeStep === 1 && renderStatutory()}
          {activeStep === 2 && renderCommunication()}
          {activeStep === 3 && renderSocialProfile()}
          {activeStep === 4 && renderDefaults()}
          {activeStep === 5 && renderBankDetail()}
          {activeStep === 6 && renderContactPerson()}
          {activeStep === 7 && <Attachment />}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center shrink-0">
          <div className="text-sm text-gray-600">
            Step {activeStep + 1} of {STEPS.length}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() =>
                activeStep > 0 ? setActiveStep((p) => p - 1) : onClose(false)
              }
              className="px-4 py-2 border rounded bg-white hover:bg-gray-100 flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {activeStep > 0 ? "Back" : "Close"}
            </button>
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#0c5888] text-white rounded hover:bg-[#0a4a70] disabled:opacity-50 flex items-center"
            >
              {activeStep === STEPS.length - 1 ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Submit"}
                </>
              ) : (
                <span className="flex items-center">
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {showChartOfAccounts && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
          style={{ zIndex: nestedModalZIndex }}
        >
          <div className="bg-white rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <ChartOfAccounts
              isOpen={showChartOfAccounts}
              onClose={() => setShowChartOfAccounts(false)}
              initialData={coaFormData}
              onSave={handleSaveCOA}
              index={nestedModalZIndex}
            />
          </div>
        </div>
      )}

      {/* SALES EXECUTIVE MODAL */}
      {showSalesExecutiveModal && (
        <SalesExecutiveMaster
          onClose={() => setShowSalesExecutiveModal(false)}
          initialData={selectedExecutiveObj || undefined}
          onSuccess={() => {
            loadSalesExecutives(); // Refresh the dropdown
          }}
          index={nestedModalZIndex}
        />
      )}

      {showContactModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
          style={{ zIndex: nestedModalZIndex }}
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">
              {editingContactIndex !== null ? "Edit Contact" : "Add Contact"}
            </h3>
            <div className="space-y-3">
              <div>
                <FormLabel required>Name</FormLabel>
                <input
                  className="w-full border p-2 rounded"
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, name: e.target.value })
                  }
                />
              </div>
              <div>
                <FormLabel>Designation</FormLabel>
                <input
                  className="w-full border p-2 rounded"
                  value={contactForm.designation}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      designation: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <FormLabel>Email</FormLabel>
                <input
                  className="w-full border p-2 rounded"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                />
              </div>
              <div>
                <FormLabel>Phone</FormLabel>
                <input
                  className="w-full border p-2 rounded"
                  value={contactForm.phone}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveContact}
                className="px-4 py-2 bg-[#0c5888] text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudCustomer;
