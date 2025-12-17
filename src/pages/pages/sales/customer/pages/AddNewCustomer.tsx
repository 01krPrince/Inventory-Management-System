import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Globe,
  Clock,
  Edit,
  ChevronRight,
  X,
  Upload,
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
// Make sure customerUpdateApi is exported from your service
import {
  addCustomer,
  fetchBankDetailsApi,
  customerUpdateApi,
} from "../api/customerService";
import Attachment from "../../../../../components/Attachment";
import { CustomerPayload } from "../models/AddCustomerPayload";
import Dropdown, { ColumnDef } from "../../../../../components/Dropdown";
import {
  SalesAndPurchaseGL,
  fetchSalesAndPurchaseGL, // Added import
} from "../../../../../components/addItemMaster/api/saleAndPurchaseGL";
import ChartOfAccounts from "../../../../../components/ChartOfAccount";

// --- Types ---

interface FormData {
  // Basic Details
  gstNo: string;
  name: string;
  printName: string;
  identification: string;
  code: string;
  underLedger: string;
  isCustomerCommon: boolean;
  isSubCustomer: boolean;
  underCustomer: string;
  profileImage: string | null;

  // Statutory (Tab 1)
  gstRegDate: string;
  cin: string;
  pan: string;
  goodsService: string;
  gstCategory: string;
  gstSuspend: boolean;
  distance: string;
  tdsApplicable: boolean;

  // Communication (Tab 2)
  billingAddress: string;
  billingCountry: string;
  billingState: string;
  billingCity: string;
  billingPin: string;
  billingPhone: string;
  billingEmail: string;
  shippingAddress: string;
  shippingCountry: string;
  shippingState: string;
  shippingCity: string;
  shippingPin: string;
  shippingPhone: string;
  shippingEmail: string;

  // Social Profile (Tab 3)
  website: string;
  facebook: string;
  skype: string;
  twitter: string;
  linkedin: string;

  // Defaults (Tab 4)
  paymentTerms: string;
  priceCategory: string;
  salesExecutive: string;
  transporter: string;
  creditLimit: string;
  maxCreditLimit: string; // Added missing field to interface
  maxCreditDays: string;
  interestRateYearly: string;
  customerOnWatch: boolean;
  firmStatus: string;
  territory: string;
  customerCategory: string;

  // Bank Detail (Tab 5)
  ifscCode: string;
  accountNo: string;
  bankName: string;
  branch: string;

  // Contact Person placeholder
  contactPersonName: string;
}

const INITIAL_DATA: FormData = {
  // Basic
  gstNo: "",
  name: "",
  printName: "",
  identification: "",
  code: "",
  underLedger: "",
  isCustomerCommon: false,
  isSubCustomer: false, // Changed default to false
  underCustomer: "",
  profileImage: null,
  // Statutory
  gstRegDate: "",
  cin: "",
  pan: "",
  goodsService: "",
  gstCategory: "",
  gstSuspend: false,
  distance: "0",
  tdsApplicable: false,
  // Communication
  billingAddress: "",
  billingCountry: "India",
  billingState: "",
  billingCity: "",
  billingPin: "",
  billingPhone: "",
  billingEmail: "",
  shippingAddress: "",
  shippingCountry: "India",
  shippingState: "",
  shippingCity: "",
  shippingPin: "",
  shippingPhone: "",
  shippingEmail: "",
  // Social
  website: "",
  facebook: "",
  skype: "",
  twitter: "",
  linkedin: "",
  // Defaults
  paymentTerms: "",
  priceCategory: "",
  salesExecutive: "Select...",
  transporter: "Select...",
  creditLimit: "0.00",
  maxCreditLimit: "0.00",
  maxCreditDays: "0",
  interestRateYearly: "0",
  customerOnWatch: false,
  firmStatus: "Active",
  territory: "Default",
  customerCategory: "General",
  // Bank
  ifscCode: "",
  accountNo: "",
  bankName: "",
  branch: "",
  contactPersonName: "",
};

const contacts = [
  {
    id: 1,
    salutation: "Mr.",
    firstName: "Rajesh",
    lastName: "Sharma",
    designation: "Purchase Manager",
    mobile: "9876543210",
    email: "rajesh.s@example.com",
  },
  {
    id: 2,
    salutation: "Ms.",
    firstName: "Priya",
    lastName: "Verma",
    designation: "Accounts Head",
    mobile: "8899776655",
    email: "priya.v@example.com",
  },
];

const STEPS = [
  { id: 0, label: "Basic Details" },
  { id: 1, label: "Statutory" },
  { id: 2, label: "Communication" },
  { id: 3, label: "Social Profile" },
  { id: 4, label: "Defaults" },
  { id: 5, label: "Bank Detail" },
  { id: 6, label: "Custom Fields" },
  { id: 7, label: "Contact Person" },
  { id: 8, label: "Attachments" },
];

// --- Reusable UI Components ---

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

interface AddNewCustomerProps {
  onClose: () => void;
  initialData?: any; // The raw data from API (usually snake_case)
  onSuccess?: () => void;
}

const underLedger: ColumnDef<SalesAndPurchaseGL>[] = [
  { header: "Code", key: "code", width: "w-24" },
  { header: "Name", key: "name", width: "w-full" },
];
const CrudCustomer: React.FC<AddNewCustomerProps> = ({
  onClose,
  initialData,
  onSuccess,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coaFormData, setCoaFormData] = useState<SalesAndPurchaseGL | null>(
    null
  );
  const [glDataFull, setGlDataFull] = useState<SalesAndPurchaseGL[]>([]);

  const [showChartOfAccounts, setShowChartOfAccounts] = useState(false);

  // --- COA (Sales/Purchase GL) Logic ---
  const handleOpenCOA = () => {
    setShowChartOfAccounts(true);
  };

  // Check if we are in Edit Mode
  const isEditMode = !!initialData && !!initialData._id;

  // --- Effect: Load Dropdown Data ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const glDataResult = await fetchSalesAndPurchaseGL();
        if (glDataResult && Array.isArray(glDataResult)) {
          setGlDataFull(glDataResult);
        }
      } catch (error) {
        console.error("Failed to load dropdown data", error);
      }
    };
    loadData();
  }, []);

  // --- Effect: Populate Form on Edit ---
  useEffect(() => {
    if (initialData) {
      // Helper to safely parse strings to numbers/booleans for form state
      const val = (v: any) => (v !== null && v !== undefined ? String(v) : "");

      setFormData({
        // ... (your existing form data mappings) ...
        gstNo: initialData.gst_no || "",
        name: initialData.cust_name || "",
        printName: initialData.print_name || "",
        identification: initialData.identification || "",
        code: initialData.code || "",
        underLedger: initialData.under_ledger || "",
        isCustomerCommon: initialData.cust_comman || false,
        isSubCustomer: initialData.is_sub_customer || false,
        underCustomer:
          typeof initialData.under_customer === "string"
            ? initialData.under_customer
            : "",
        profileImage: initialData.profile_photo || null,
        gstRegDate: initialData.registration_date || "",
        cin: initialData.cin || "",
        pan: initialData.pan || "",
        goodsService: initialData.goods_service || "",
        gstCategory: initialData.gst_category || "",
        gstSuspend: initialData.gst_suspend || false,
        distance: val(initialData.distance),
        tdsApplicable: initialData.tds_on_gst_applicable || false,
        billingAddress: initialData.address || "",
        billingCountry: initialData.country || "India",
        billingState: initialData.state || "",
        billingCity: initialData.city || "",
        billingPin: initialData.pin_code || "",
        billingPhone: initialData.phone || "",
        billingEmail: initialData.email || "",
        shippingAddress: initialData.address_ship || "",
        shippingCountry: initialData.country_ship || "India",
        shippingState: initialData.state_ship || "",
        shippingCity: initialData.city_ship || "",
        shippingPin: initialData.pin_code_ship || "",
        shippingPhone: initialData.phone_ship || "",
        shippingEmail: initialData.email_ship || "",
        website: initialData.website || "",
        facebook: initialData.facebook || "",
        skype: initialData.skype || "",
        twitter: initialData.twitter || "",
        linkedin: initialData.linkedin || "",
        paymentTerms: initialData.payment_term || "",
        priceCategory: initialData.price_category || "",
        salesExecutive: initialData.sales_executive || "Select...",
        transporter: initialData.transporter || "Select...",
        creditLimit: val(initialData.credit_limit),
        maxCreditLimit: val(initialData.max_credit_limit),
        maxCreditDays: val(initialData.max_credit_days),
        interestRateYearly: val(initialData.interest_rate_yearly),
        customerOnWatch: initialData.customer_on_watch === "Yes",
        firmStatus: initialData.firm_status || "Active",
        territory: initialData.territory || "Default",
        customerCategory: initialData.customer_category || "General",
        ifscCode: initialData.ifsc_code || "",
        accountNo: initialData.account_number || "",
        bankName: initialData.bank_name || "",
        branch: initialData.branch || "",
        contactPersonName: initialData.contact_person || "",
      });

      // --- LOGIC ADDED: Initialize COA Form Data based on Loaded GL Data ---
      if (
        glDataFull &&
        Array.isArray(glDataFull) &&
        glDataFull.length > 0 &&
        initialData.under_ledger
      ) {
        const selectedLedger = glDataFull.find(
          (item) => item.name === initialData.under_ledger
        );
        if (selectedLedger) {
          setCoaFormData(selectedLedger);
        }
      }
    }
  }, [initialData, glDataFull]);

  const fetchBankDetails = async () => {
    try {
      const bankData = await fetchBankDetailsApi(formData.ifscCode);

      setFormData((prev) => ({
        ...prev,
        ...bankData,
      }));
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Failed to fetch bank details");
      }
      console.error(error);
    }
  };

  // --- Handlers ---
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

    // Logic: If UnderLedger changes, update the Data passed to the Edit Modal
    if (fieldName === "underLedger") {
      const selected = glDataFull.find((item) => item.name === value);
      setCoaFormData(selected || null);
    }
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
      shippingAddress: prev.billingAddress,
      shippingCountry: prev.billingCountry,
      shippingState: prev.billingState,
      shippingCity: prev.billingCity,
      shippingPin: prev.billingPin,
      shippingPhone: prev.billingPhone,
      shippingEmail: prev.billingEmail,
    }));
  };

  const handleNext = async () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      // --- FINAL SUBMIT / UPDATE LOGIC ---
      setIsSubmitting(true);

      const val = (v: string | null | undefined) =>
        v && v.trim() !== "" ? v : "N/A";

      try {
        const payload: CustomerPayload = {
          // Basic
          gst_no: val(formData.gstNo),
          cust_name: val(formData.name),
          print_name: val(formData.printName),
          identification: val(formData.identification),
          code: val(formData.code),
          under_ledger: val(formData.underLedger),
          cust_comman: formData.isCustomerCommon,
          is_sub_customer: formData.isSubCustomer,
          under_customer: formData.underCustomer || false,
          profile_photo: formData.profileImage,

          // Statutory
          gst: val(formData.gstNo),
          registration_date: val(formData.gstRegDate),
          cin: val(formData.cin),
          pan: val(formData.pan),
          goods_service: val(formData.goodsService),
          gst_category: val(formData.gstCategory),
          gst_suspend: formData.gstSuspend,
          distance: Number(formData.distance) || 0,
          tds_on_gst_applicable: formData.tdsApplicable,

          // Billing Address
          address: val(formData.billingAddress),
          country: val(formData.billingCountry),
          state: val(formData.billingState),
          city: val(formData.billingCity),
          pin_code: val(formData.billingPin),
          phone: val(formData.billingPhone),
          email: val(formData.billingEmail),
          longitude: "0",
          latitude: "0",
          route_map: "N/A",

          // Shipping Address
          address_ship: val(formData.shippingAddress),
          country_ship: val(formData.shippingCountry),
          state_ship: val(formData.shippingState),
          city_ship: val(formData.shippingCity),
          pin_code_ship: val(formData.shippingPin),
          phone_ship: val(formData.shippingPhone),
          email_ship: val(formData.shippingEmail),
          longitude_ship: "0",
          latitude_ship: "0",
          route_map_ship: "N/A",

          // Social
          website: val(formData.website),
          facebook: val(formData.facebook),
          skype: val(formData.skype),
          twitter: val(formData.twitter),
          linkedin: val(formData.linkedin),

          // Defaults
          payment_term: val(formData.paymentTerms),
          price_category: val(formData.priceCategory),
          batch_rate_category: "N/A",
          sales_executive: val(formData.salesExecutive),
          transporter: val(formData.transporter),
          credit_limit: val(formData.creditLimit),
          // max_credit_limit: val(formData.maxCreditLimit),
          max_credit_days: val(formData.maxCreditDays),
          interest_rate_yearly: val(formData.interestRateYearly),
          customer_on_watch: formData.customerOnWatch ? "Yes" : "No",
          firm_status: val(formData.firmStatus),
          territory: val(formData.territory),
          customer_category: val(formData.customerCategory),
          contact_person: val(formData.contactPersonName),

          // Bank
          ifsc_code: val(formData.ifscCode),
          account_number: val(formData.accountNo),
          bank_name: val(formData.bankName),
          branch: val(formData.branch),

          attachment: null,
        };

        let response;
        if (isEditMode) {
          // --- UPDATE ---
          // Assuming customerUpdateApi takes (id, payload)
          response = await customerUpdateApi(initialData._id, payload);
        } else {
          // --- CREATE ---
          response = await addCustomer(payload);
        }

        if (response.success) {
          alert(
            response.message ||
              (isEditMode
                ? "Customer Updated Successfully!"
                : "Customer Added Successfully!")
          );
          if (onSuccess) onSuccess();
        } else {
          alert("Operation failed: " + (response.message || "Unknown error"));
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("An error occurred while saving the customer.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    } else {
      onClose();
    }
  };

  const handleSaveCOA = (savedData: SalesAndPurchaseGL) => {
    const savedName = savedData?.name;

    if (savedName) {
      setGlDataFull((prev) => {
        const exists = prev.find((item) => item.name === savedName);
        if (exists) {
          return prev.map((item) =>
            item.name === savedName ? savedData : item
          );
        }
        return [...prev, savedData];
      });
    }
    setShowChartOfAccounts(false);
  };

  // --- Step Renders ---

  const renderBasicDetails = () => (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 md:col-span-8 space-y-3">
        {/* GST */}
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-3">
            <FormLabel>GST No</FormLabel>
          </div>
          <div className="col-span-7">
            <input
              type="text"
              name="gstNo"
              value={formData.gstNo}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="col-span-2">
            <button className="bg-[#0c5888] text-white text-xs px-3 py-1.5 rounded hover:bg-[#0a4a70] w-full">
              Fetch-Info
            </button>
          </div>
        </div>
        {/* Name */}
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-3">
            <FormLabel required>Name</FormLabel>
          </div>
          <div className="col-span-9 relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
        {/* Print Name */}
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-3">
            <FormLabel required>Print Name</FormLabel>
          </div>
          <div className="col-span-9">
            <input
              type="text"
              name="printName"
              value={formData.printName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
        {/* Identification */}
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
        {/* Code */}
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-3">
            <FormLabel>Code</FormLabel>
          </div>
          <div className="col-span-9 relative">
            <input
              disabled
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
            <Clock className="w-4 h-4 text-[#0c5888] absolute right-2 top-1.5" />
          </div>
        </div>
        {/* Under Ledger */}
        <div className="mb-3">
          <FormLabel required>Under Ledger</FormLabel>
          <div className="flex w-full">
            <div className="flex-1 min-w-0">
              <Dropdown
                data={glDataFull}
                columns={underLedger}
                value={formData.underLedger}
                valueKey="name"
                onChange={(item) =>
                  handleDropdownChange("underLedger", item?.name || "")
                }
                placeholder="Select..."
              />
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleOpenCOA();
              }}
              className="bg-[#0c5888] text-white px-2 rounded-r hover:bg-[#0a4a70] transition-colors ml-[1px]"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Common */}
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-3">
            <FormLabel>Customer Common for Sales Purchase</FormLabel>
          </div>
          <div className="col-span-9 flex items-center justify-end">
            <ToggleSwitch
              name="isCustomerCommon"
              checked={formData.isCustomerCommon}
              onChange={handleInputChange}
            />
            <span className="text-xs font-bold text-gray-600">
              {formData.isCustomerCommon ? "ON" : "OFF"}
            </span>
          </div>
        </div>
        {/* Sub Customer */}
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-3">
            <FormLabel>Is Sub Customer</FormLabel>
          </div>
          <div className="col-span-9 flex items-center justify-end">
            <ToggleSwitch
              name="isSubCustomer"
              checked={formData.isSubCustomer}
              onChange={handleInputChange}
            />
            <span className="text-xs font-bold text-gray-600">
              {formData.isSubCustomer ? "ON" : "OFF"}
            </span>
          </div>
        </div>
        {formData.isSubCustomer ? (
          <>
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-3">
                <FormLabel required>Under Customer</FormLabel>
              </div>
              <div className="col-span-9 relative">
                <select
                  name="underCustomer"
                  value={formData.underCustomer}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-500 appearance-none bg-white"
                >
                  <option>Select...</option>
                </select>
                <ChevronRight className="w-4 h-4 absolute right-2 top-1.5 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      {/* Right Column: Image Upload */}
      <div className="col-span-12 md:col-span-4 flex flex-col items-center justify-start mt-2">
        <div className="w-56 h-56 bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center relative overflow-hidden group">
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
            <div className="flex flex-col items-center text-blue-500">
              <div className="w-32 h-32 bg-blue-400 rounded-full flex items-center justify-center mb-2">
                <div className="w-20 h-20 bg-[#0c5888] rounded-full mt-[-10px]"></div>
                <div className="absolute w-28 h-16 bg-[#0c5888] rounded-t-full bottom-10"></div>
              </div>
            </div>
          )}
          <div className="absolute top-0 right-0 bg-[#0c5888] text-white p-1 cursor-pointer">
            <X className="w-3 h-3" />
          </div>
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
            name="gstNo"
            value={formData.gstNo} // Used gstNo here as per common usage, mapped to gst payload later
            onChange={handleInputChange}
          />
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <FormLabel>Registration Date</FormLabel>
            </div>
            <div className="col-span-8 relative">
              <input
                type="date"
                name="gstRegDate"
                value={formData.gstRegDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              />
            </div>
          </div>
          <InputField
            type="text"
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
            name="goodsService"
            value={formData.goodsService}
            onChange={handleInputChange}
            options={["Goods", "Service"]}
          />
        </div>
        <div className="space-y-4">
          <SelectField
            label="GST Category"
            name="gstCategory"
            value={formData.gstCategory}
            onChange={handleInputChange}
            options={["Registered", "Unregistered", "Composite"]}
          />
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <FormLabel>GST Suspend</FormLabel>
            </div>
            <div className="col-span-8 flex items-center justify-end">
              <input
                type="checkbox"
                name="gstSuspend"
                checked={formData.gstSuspend}
                onChange={handleInputChange}
                className="w-5 h-5 border-gray-300 rounded text-[#0c5888]"
              />
            </div>
          </div>
          <div className="h-8 hidden md:block"></div>
          <InputField
            label="Distance"
            name="distance"
            type="number"
            value={formData.distance}
            onChange={handleInputChange}
            className="text-right"
          />
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <FormLabel>TDS On GST Applicable</FormLabel>
            </div>
            <div className="col-span-8 flex items-center justify-end">
              <input
                type="checkbox"
                name="tdsApplicable"
                checked={formData.tdsApplicable}
                onChange={handleInputChange}
                className="w-5 h-5 border-gray-300 rounded text-[#0c5888]"
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
        {/* Billing Info */}
        <div>
          <h3 className="text-sm font-bold text-[#0c5888] mb-4 border-b pb-2">
            Billing Information
          </h3>
          <div className="space-y-3">
            <div>
              <FormLabel>Address</FormLabel>
              <textarea
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm resize-none focus:outline-none focus:border-[#0c5888]"
              />
            </div>
            <InputField
              label="Country"
              name="billingCountry"
              value={formData.billingCountry}
              onChange={handleInputChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="State"
                name="billingState"
                value={formData.billingState}
                onChange={handleInputChange}
              />
              <InputField
                label="City"
                name="billingCity"
                value={formData.billingCity}
                onChange={handleInputChange}
              />
            </div>
            <InputField
              label="Pin Code"
              name="billingPin"
              value={formData.billingPin}
              onChange={handleInputChange}
            />
            <InputField
              label="Phone"
              name="billingPhone"
              value={formData.billingPhone}
              onChange={handleInputChange}
            />
            <InputField
              label="Email"
              name="billingEmail"
              value={formData.billingEmail}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Shipping Info */}
        <div>
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-sm font-bold text-[#0c5888]">
              Shipping Address
            </h3>
            <button
              onClick={copyBillingToShipping}
              className="flex items-center text-xs text-[#0c5888] hover:text-[#0a4a70] border border-[#0c5888] rounded px-2 py-1"
            >
              <Copy className="w-3 h-3 mr-1" /> Copy Billing
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <FormLabel>Address</FormLabel>
              <textarea
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm resize-none focus:outline-none focus:border-[#0c5888]"
              />
            </div>
            <InputField
              label="Country"
              name="shippingCountry"
              value={formData.shippingCountry}
              onChange={handleInputChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="State"
                name="shippingState"
                value={formData.shippingState}
                onChange={handleInputChange}
              />
              <InputField
                label="City"
                name="shippingCity"
                value={formData.shippingCity}
                onChange={handleInputChange}
              />
            </div>
            <InputField
              label="Pin Code"
              name="shippingPin"
              value={formData.shippingPin}
              onChange={handleInputChange}
            />
            <InputField
              label="Phone"
              name="shippingPhone"
              value={formData.shippingPhone}
              onChange={handleInputChange}
            />
            <InputField
              label="Email"
              name="shippingEmail"
              value={formData.shippingEmail}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSocialProfile = () => {
    return (
      <div className="bg-white border rounded-lg p-8 shadow-sm mt-4 max-w-3xl mx-auto">
        <h3 className="text-lg font-medium text-gray-700 mb-6">
          Social Media Links
        </h3>
        <div className="space-y-2">
          <SocialInput
            icon={Globe}
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="https://www.yourwebsite.com"
          />
          <SocialInput
            icon={Facebook}
            label="Facebook"
            name="facebook"
            value={formData.facebook}
            onChange={handleInputChange}
            placeholder="https://facebook.com/username"
          />
          <SocialInput
            icon={MessageCircle}
            label="Skype"
            name="skype"
            value={formData.skype}
            onChange={handleInputChange}
            placeholder="Skype ID / Link"
          />
          <SocialInput
            icon={Twitter}
            label="Twitter"
            name="twitter"
            value={formData.twitter}
            onChange={handleInputChange}
            placeholder="https://twitter.com/username"
          />
          <SocialInput
            icon={Linkedin}
            label="LinkedIn"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
      </div>
    );
  };

  const renderDefaults = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SelectField
          label="Payment Terms"
          name="paymentTerms"
          value={formData.paymentTerms}
          onChange={handleInputChange}
          options={["Due on Receipt", "Net 15", "Net 30", "Net 60"]}
        />
        <SelectField
          label="Price Category"
          name="priceCategory"
          value={formData.priceCategory}
          onChange={handleInputChange}
          options={["Retail", "Wholesale", "Distributor"]}
        />
        <SelectField
          label="Sales Executive"
          name="salesExecutive"
          value={formData.salesExecutive}
          onChange={handleInputChange}
          options={["Select...", "John Doe", "Jane Smith"]}
        />
        <SelectField
          label="Transporter"
          name="transporter"
          value={formData.transporter}
          onChange={handleInputChange}
          options={["Select...", "DHL", "FedEx", "Local"]}
        />
        <InputField
          label="Credit Limit"
          name="creditLimit"
          type="number"
          value={formData.creditLimit}
          onChange={handleInputChange}
        />
        <InputField
          label="Max Credit Limit"
          name="maxCreditLimit"
          type="number"
          value={formData.maxCreditLimit}
          onChange={handleInputChange}
        />
        <InputField
          label="Max Credit Days"
          name="maxCreditDays"
          type="number"
          value={formData.maxCreditDays}
          onChange={handleInputChange}
        />
        <InputField
          label="Interest Rate Yearly (%)"
          name="interestRateYearly"
          type="number"
          value={formData.interestRateYearly}
          onChange={handleInputChange}
        />

        {/* Checkbox for Watch */}
        <div className="flex items-center h-full pt-4">
          <input
            type="checkbox"
            id="customerOnWatch"
            name="customerOnWatch"
            checked={formData.customerOnWatch}
            onChange={handleInputChange}
            className="w-5 h-5 mr-2 text-[#0c5888] rounded border-gray-300 focus:ring-[#0c5888]"
          />
          <label
            htmlFor="customerOnWatch"
            className="text-sm font-medium text-gray-700"
          >
            Customer On Watch
          </label>
        </div>

        <SelectField
          label="Firm Status"
          name="firmStatus"
          value={formData.firmStatus}
          onChange={handleInputChange}
          options={["Active", "Inactive", "Suspended"]}
        />
        <SelectField
          label="Territory"
          name="territory"
          value={formData.territory}
          onChange={handleInputChange}
          options={["Default", "North", "South", "East", "West"]}
        />
        <SelectField
          label="Customer Category"
          name="customerCategory"
          value={formData.customerCategory}
          onChange={handleInputChange}
          options={["General", "VIP", "Reseller"]}
        />
      </div>
    </div>
  );

  const renderBankDetail = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6 pb-2 border-b">
          <Landmark className="w-5 h-5 text-[#0c5888] mr-2" />
          <h3 className="text-lg font-medium text-gray-800">
            Banking Information
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Custom Input Field for IFSC with Fetch Button */}
          <div className="mb-3">
            <FormLabel>RTGS/IFSC Code</FormLabel>
            <div className="flex relative">
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleInputChange}
                placeholder="e.g., HDFC0001234"
                className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm focus:outline-none focus:border-[#0c5888]"
              />
              <button
                type="button"
                onClick={fetchBankDetails}
                className="bg-[#0c5888] text-white text-xs px-4 rounded-r hover:bg-[#0a4a70] font-medium transition-colors"
              >
                Fetch
              </button>
            </div>
          </div>

          <InputField
            label="Account No."
            name="accountNo"
            value={formData.accountNo}
            onChange={handleInputChange}
            type="number"
          />
          <InputField
            label="Bank Name"
            name="bankName"
            value={formData.bankName}
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
    </div>
  );

  const contactPerson = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">Contact Persons</h3>
        <button className="flex items-center bg-[#0c5888] text-white px-3 py-2 rounded text-sm hover:bg-[#0a4a70] transition-colors">
          <Plus className="w-4 h-4 mr-1" /> Add Contact
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Designation
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Mobile
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts.map((contact) => (
              <tr
                key={contact.id}
                className="hover:bg-blue-50 transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-[#0c5888]/10 text-[#0c5888] flex items-center justify-center text-xs font-bold mr-3">
                      {contact.firstName[0]}
                      {contact.lastName[0]}
                    </div>
                    <div>
                      <div className="font-medium">
                        {contact.salutation} {contact.firstName}{" "}
                        {contact.lastName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {contact.designation}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {contact.mobile}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {contact.email}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                  <button className="text-[#0c5888] hover:text-[#0a4a70] mr-3 p-1 rounded hover:bg-blue-100">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-gray-500 text-sm"
                >
                  No contact persons added yet. Click "Add Contact" to start.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const Attachments = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <Attachment />
    </div>
  );

  const renderPlaceholderTab = (tabName: string) => (
    <div className="bg-white border rounded-lg p-12 shadow-sm mt-4 flex flex-col items-center justify-center text-gray-400">
      <Upload className="w-12 h-12 mb-2 opacity-20" />
      <h3 className="text-lg font-medium">Configuration for {tabName}</h3>
      <p className="text-sm">
        Complete the previous steps to configure this section.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#0c5888] px-6 py-4 text-white flex justify-between items-center">
          <h1 className="text-xl font-semibold tracking-wide">
            {isEditMode ? "EDIT CUSTOMER" : "ADD NEW CUSTOMER"}
          </h1>
          <div className="text-sm opacity-80">
            Step {activeStep + 1} of {STEPS.length}
          </div>
        </div>

        {/* Timeline / Progress Bar */}
        <div className="bg-gray-100 border-b overflow-x-auto">
          <div className="flex min-w-max px-4">
            {STEPS.map((step, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;
              const isPending = index > activeStep;

              return (
                <div
                  key={step.id}
                  className={`
                      relative py-3 px-4 text-sm font-medium cursor-pointer transition-colors duration-200 flex items-center
                      ${
                        isActive
                          ? "text-[#0c5888] border-b-2 border-[#0c5888] bg-white"
                          : ""
                      }
                      ${isCompleted ? "text-green-600" : ""}
                      ${isPending ? "text-gray-400 hover:text-gray-600" : ""}
                    `}
                  onClick={() => setActiveStep(index)}
                >
                  <span
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 border
                      ${
                        isActive
                          ? "bg-[#0c5888] text-white border-[#0c5888]"
                          : ""
                      }
                      ${
                        isCompleted
                          ? "bg-green-100 text-green-600 border-green-600"
                          : ""
                      }
                      ${isPending ? "bg-gray-100 border-gray-300" : ""}
                    `}
                  >
                    {index + 1}
                  </span>
                  {step.label}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 bg-white min-h-[500px]">
          {activeStep === 0 && renderBasicDetails()}
          {activeStep === 1 && renderStatutory()}
          {activeStep === 2 && renderCommunication()}
          {activeStep === 3 && renderSocialProfile()}
          {activeStep === 4 && renderDefaults()}
          {activeStep === 5 && renderBankDetail()}
          {activeStep === 6 && renderPlaceholderTab("Custom Fields")}
          {activeStep === 7 && contactPerson()}
          {activeStep === 8 && Attachments()}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={handleBack}
            className="flex items-center px-4 py-2 rounded border font-medium transition-colors text-gray-700 border-gray-300 hover:bg-gray-100 bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className={`flex items-center px-6 py-2 bg-[#0c5888] text-white rounded hover:bg-[#0a4a70] font-medium shadow-sm ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {activeStep === STEPS.length - 1 ? (
              <>
                <Save className="w-4 h-4 mr-2" />{" "}
                {isSubmitting
                  ? "Processing..."
                  : isEditMode
                  ? "Update"
                  : "Submit"}
              </>
            ) : (
              <>
                Save & Next <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
      {showChartOfAccounts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <ChartOfAccounts
              isOpen={showChartOfAccounts}
              onClose={() => setShowChartOfAccounts(false)}
              initialData={coaFormData}
              onSave={handleSaveCOA}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudCustomer;
