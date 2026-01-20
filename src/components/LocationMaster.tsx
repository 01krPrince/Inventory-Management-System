import React, { useState, ChangeEvent, useEffect } from "react";
import {
  X,
  Save,
  ArrowRight,
  ArrowLeft,
  Trash2,
  EditIcon,
  Plus,
} from "lucide-react";
import Dropdown, { ColumnDef } from "./Dropdown";
import {
  Customer,
  getAllCustomers,
} from "../services/sales/customer/customerService";

import CrudCustomer from "../pages/pages/sales/customer/AddNewCustomer";

import {
  createLocation,
  updateLocation,
  deleteLocation,
  LocationMaster as LocationMasterType,
  LocationMasterInput,
} from "../pages/pages/inventory/stockAdjustment/api/LocationMaster";

interface ActionBtnProps {
  icon: React.ReactElement;
  onClick?: () => void;
  title?: string;
}

const INITIAL_LOCATION_DATA = {
  name: "",
  code: "",
  party: "",
  profileImage: "",
  gstNo: "",
  defaultParty: "",
  ewayUsername: "",
  ewayPassword: "",
  gstnUsername: "",
  gstnPassword: "",
  otherLicense1: "",
  otherLicense2: "",
  bankDetails: "",
  address: "",
  country: "India",
  state: "",
  city: "",
  pinCode: "",
  phone: "",
  email: "",
  longitude: "",
  latitude: "",
};

const STEPS = [
  { id: 0, label: "Basic Details" },
  { id: 1, label: "Compliance" },
  { id: 2, label: "Address" },
];

const FormLabel = ({ required, children, className = "" }: any) => (
  <label className={`block text-xs font-medium text-gray-700 ${className}`}>
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}: any) => (
  <div className="mb-3">
    <FormLabel required={required}>{label}</FormLabel>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onClick={(e) => e.stopPropagation()}
      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#104a7d]"
    />
  </div>
);

interface LocationMasterProps {
  onClose: () => void;
  onSuccess?: (data?: any) => void;
  onSelect?: (locationName: string) => void;
  initialData?: LocationMasterType | null;
  index?: number;
}

const partyColumns: ColumnDef<Customer>[] = [
  { header: "Code", key: "code", width: "w-16" },
  { header: "Name", key: "cust_name", width: "flex-1" },
  { header: "Phone", key: "phone", width: "w-24" },
  { header: "GST", key: "gst_no", width: "w-28" },
];

export const LocationMaster: React.FC<LocationMasterProps> = ({
  onClose,
  onSuccess,
  onSelect,
  initialData,
  index = 50,
}) => {
  const overlayZIndex = index + 10;
  const nestedModalZIndex = overlayZIndex + 20;

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<any>(INITIAL_LOCATION_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [editingRow, setEditingRow] = useState<Customer | null>(null);
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);

  const loadCustomers = async () => {
    try {
      const result = await getAllCustomers();
      if (Array.isArray(result)) {
        setCustomerList(result);
      } else if (result && (result as any).data) {
        setCustomerList((result as any).data);
      }
    } catch (error) {
      console.error("Failed to load customers for Party dropdown", error);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        code: initialData.code || "",
        party: initialData.party || "",
        profileImage: initialData.profilePic || "",
        gstNo: initialData.gstNo || "",
        defaultParty: (initialData as any).defaultParty || "",
        ewayUsername: initialData.ewayUsername || "",
        ewayPassword: initialData.ewayPassword || "",
        gstnUsername: initialData.gstInUsername || "",
        gstnPassword: initialData.gstInPassword || "",
        otherLicense1: initialData.othelicense1 || "",
        otherLicense2: initialData.othelicense2 || "",
        bankDetails: initialData.bankDetails || "",
        address: initialData.address || "",
        country: initialData.country || "India",
        state: initialData.state || "",
        city: initialData.city || "",
        pinCode: initialData.pinCode || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        longitude: (initialData as any).longitude || "",
        latitude: (initialData as any).latitude || "",
      });
    } else {
      setFormData(INITIAL_LOCATION_DATA);
    }
  }, [initialData]);

  const ActionBtn: React.FC<ActionBtnProps> = ({ icon, onClick, title }) => (
    <button
      onClick={onClick}
      type="button"
      title={title}
      className="h-[32px] w-[32px] bg-[#104a7d] text-white flex items-center justify-center rounded-sm border border-[#104a7d] hover:opacity-90 transition-opacity ml-[-1px] z-10 shadow-sm"
    >
      {icon}
    </button>
  );

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "address" && value.length > 200) return;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCustomerActionClick = () => {
    if (formData.party) {
      const selectedCustomer = customerList.find(
        (cust) => cust._id === formData.party,
      );
      if (selectedCustomer) {
        setEditingRow(selectedCustomer);
      } else {
        setEditingRow(null);
      }
    } else {
      setEditingRow(null);
    }
    setIsCustomerFormOpen(true);
  };

  const handleCustomerFormClose = () => {
    setIsCustomerFormOpen(false);
    setEditingRow(null);
  };

  const handleCustomerFormSuccess = async () => {
    await loadCustomers();
    setIsCustomerFormOpen(false);
    setEditingRow(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload: LocationMasterInput = {
        name: formData.name,
        code: formData.code,
        party: formData.party,
        profilePic: formData.profileImage,
        gstNo: formData.gstNo,
        ewayUsername: formData.ewayUsername,
        ewayPassword: formData.ewayPassword,
        gstInUsername: formData.gstnUsername,
        gstInPassword: formData.gstnPassword,
        othelicense1: formData.otherLicense1,
        othelicense2: formData.otherLicense2,
        bankDetails: formData.bankDetails,
        address: formData.address,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        pinCode: formData.pinCode,
        phone: formData.phone,
        email: formData.email,
        // @ts-ignore
        longitude: formData.longitude,
        // @ts-ignore
        latitude: formData.latitude,
      };

      console.log("Location master " + payload.party);
      console.log(
        "Location master payload:\n",
        JSON.stringify(payload, null, 2),
      );

      if (initialData && initialData._id) {
        await updateLocation(initialData._id, payload);
        alert("Location updated successfully!");
      } else {
        await createLocation(payload);
        alert("Location created successfully!");
      }

      if (onSuccess) onSuccess(formData);
      if (onSelect) onSelect(formData.name);

      onClose();
    } catch (error) {
      console.error("Operation failed", error);
      alert("Failed to save location.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?._id) return;
    if (confirm("Are you sure you want to delete this location?")) {
      setIsSubmitting(true);
      try {
        await deleteLocation(initialData._id);
        alert("Location deleted successfully!");
        if (onSuccess) onSuccess();
        onClose();
      } catch (error) {
        console.error("Delete failed", error);
        alert("Failed to delete location.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const renderBasicDetails = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-9 space-y-3">
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel required>Name</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9 flex">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onClick={(e) => e.stopPropagation()}
                className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm focus:outline-none focus:border-[#104a7d]"
              />
            </div>
          </div>

          {/* <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel required>Code</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9 flex">
              <input
                disabled
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                onClick={(e) => e.stopPropagation()}
                className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm focus:outline-none focus:border-[#104a7d]"
              />
            </div>
          </div> */}

          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel>Party</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9 flex gap-1">
              <div className="flex-1">
                <Dropdown<Customer>
                  data={customerList}
                  columns={partyColumns}
                  value={formData.party}
                  valueKey="_id"
                  placeholder="Select Party..."
                  onChange={(item) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      party: item ? item._id : "",
                    }))
                  }
                />
              </div>
              <ActionBtn
                icon={
                  formData.party ? <EditIcon size={16} /> : <Plus size={16} />
                }
                title={
                  formData.party ? "Edit Selected Party" : "Create New Party"
                }
                onClick={handleCustomerActionClick}
              />
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-3 flex flex-col items-center">
          <div className="w-full max-w-[150px] h-[150px] bg-gray-100 border border-dashed border-gray-400 rounded relative flex flex-col items-center justify-center overflow-hidden mb-2">
            {formData.profileImage ? (
              <img
                src={formData.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-blue-100 rounded-full mb-2"></div>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFormData((p: any) => ({ ...p, profileImage: null }));
              }}
              className="absolute top-0 right-0 bg-[#104a7d] text-white p-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <label
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[150px] cursor-pointer bg-[#104a7d] text-white text-sm font-medium py-1.5 px-4 rounded text-center"
          >
            Browse
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0])
                  setFormData((p: any) => ({
                    ...p,
                    profileImage: URL.createObjectURL(e.target.files![0]),
                  }));
              }}
              accept="image/*"
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InputField
            label="GST No"
            name="gstNo"
            value={formData.gstNo}
            onChange={handleInputChange}
          />
          <div className="mb-3">
            <FormLabel>Default Party</FormLabel>
            <select
              name="defaultParty"
              value={formData.defaultParty}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#104a7d]"
            >
              <option value="">Select...</option>
              <option value="Self">Self</option>
            </select>
          </div>
          <InputField
            label="E-way Username"
            name="ewayUsername"
            value={formData.ewayUsername}
            onChange={handleInputChange}
          />
          <InputField
            label="E-way Password"
            name="ewayPassword"
            type="password"
            value={formData.ewayPassword}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-4">
          <InputField
            label="GSTN Username"
            name="gstnUsername"
            value={formData.gstnUsername}
            onChange={handleInputChange}
          />
          <InputField
            label="GSTN Password"
            name="gstnPassword"
            type="password"
            value={formData.gstnPassword}
            onChange={handleInputChange}
          />
          <InputField
            label="Other License 1"
            name="otherLicense1"
            value={formData.otherLicense1}
            onChange={handleInputChange}
          />
          <InputField
            label="Other License 2"
            name="otherLicense2"
            value={formData.otherLicense2}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="mt-4">
        <FormLabel>Bank Detail</FormLabel>
        <textarea
          name="bankDetails"
          value={formData.bankDetails}
          onChange={handleInputChange}
          rows={5}
          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm resize-none focus:outline-none focus:border-[#104a7d]"
        />
      </div>
    </div>
  );

  const renderAddress = () => (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
      <div className="mb-4 flex justify-between items-center">
        <FormLabel>Address</FormLabel>
        <span className="text-xs text-gray-400">
          {formData.address.length}/200
        </span>
      </div>
      <textarea
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        rows={3}
        maxLength={200}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm resize-none focus:outline-none focus:border-[#104a7d]"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
            />
            <InputField
              label="State"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
            <InputField
              label="Pin Code"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
            />
            <InputField
              label="Latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="w-[40vw] flex flex-col bg-white h-[70vh]">
        <div className="bg-[#104a7d] px-6 py-4 text-white flex justify-between items-center shrink-0">
          <h1 className="text-xl font-semibold tracking-wide">
            {initialData ? "EDIT LOCATION" : "NEW LOCATION"}
          </h1>
          {/* Close button only in Header now */}
          <button
            onClick={onClose}
            className="hover:text-[#cccaca] transition-colors focus:outline-none"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-gray-100 border-b overflow-x-auto shrink-0">
          <div className="flex min-w-max px-4">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`relative py-3 px-4 text-sm font-medium cursor-pointer flex items-center ${
                  index === activeStep
                    ? "text-[#104a7d] border-b-2 border-[#104a7d] bg-white"
                    : "text-gray-400"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveStep(index);
                }}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 border ${
                    index === activeStep
                      ? "bg-[#104a7d] text-white border-[#104a7d]"
                      : "bg-gray-100 border-gray-300"
                  }`}
                >
                  {index + 1}
                </span>
                {step.label}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {activeStep === 0 && renderBasicDetails()}
          {activeStep === 1 && renderCompliance()}
          {activeStep === 2 && renderAddress()}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            {/* Step Counter moved here (Bottom Left) */}
            <div className="text-sm font-medium text-gray-500">
              Step {activeStep + 1} of {STEPS.length}
            </div>

            {/* Delete button (if visible) */}
            {initialData && initialData._id && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 rounded border border-red-300 text-red-600 hover:bg-red-50 bg-white transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (activeStep > 0) setActiveStep((p) => p - 1);
                else onClose();
              }}
              className="flex items-center px-4 py-2 rounded border font-medium text-gray-700 border-gray-300 hover:bg-gray-100 bg-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-[#104a7d] text-white rounded hover:bg-[#0c3b63] font-medium shadow-sm disabled:opacity-50"
            >
              {activeStep === STEPS.length - 1 ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting
                    ? "Saving..."
                    : initialData
                      ? "Update"
                      : "Submit"}
                </>
              ) : (
                <>
                  <span className="mr-2">Save & Next</span>{" "}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {isCustomerFormOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm p-4"
          style={{ zIndex: nestedModalZIndex }}
        >
          <div className="overflow-hidden flex flex-col p-4">
            <div className="flex-1 overflow-hidden relative">
              <CrudCustomer
                onClose={handleCustomerFormClose}
                initialData={editingRow}
                onSuccess={handleCustomerFormSuccess}
                index={nestedModalZIndex}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
