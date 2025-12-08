import React, { useState, ChangeEvent, useEffect } from "react";
import {
  X,
  Save,
  ArrowRight,
  ArrowLeft,
  Globe,
  RotateCcw,
  Edit,
  Trash2, // Added Trash icon
} from "lucide-react";

// --- Import API Functions & Types ---
import {
  createLocation,
  updateLocation,
  deleteLocation,
  LocationMaster as LocationMasterType,
  LocationMasterInput,
} from "../pages/pages/inventory/stockAdjustment/api/LocationMaster";

// --- Initial State ---
const INITIAL_LOCATION_DATA = {
  name: "",
  code: "",
  party: "",
  profileImage: "", // UI uses 'profileImage', API uses 'profilePic'
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

// --- Sub-Components ---
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

// --- Props Interface ---
interface LocationMasterProps {
  onClose: () => void;
  onSuccess?: (data?: any) => void;
  onSelect?: (locationName: string) => void; // Optional: if you want to pass data back on click
  initialData?: LocationMasterType | null; // <--- Added initialData
}

export const LocationMaster: React.FC<LocationMasterProps> = ({
  onClose,
  onSuccess,
  onSelect,
  initialData,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<any>(INITIAL_LOCATION_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- EFFECT: Populate Form on Edit ---
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        code: initialData.code || "",
        party: initialData.party || "",
        profileImage: initialData.profilePic || "", // Map API 'profilePic' to UI 'profileImage'
        gstNo: initialData.gstNo || "",
        // Note: 'defaultParty' wasn't in your API Interface, mapping assuming it might exist or default empty
        defaultParty: (initialData as any).defaultParty || "",
        ewayUsername: initialData.ewayUsername || "",
        ewayPassword: initialData.ewayPassword || "",
        gstnUsername: initialData.gstInUsername || "", // Map API 'gstInUsername'
        gstnPassword: initialData.gstInPassword || "", // Map API 'gstInPassword'
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
        // Assuming longitude/latitude might be in API but missing from strict interface, or managed separately
        longitude: (initialData as any).longitude || "",
        latitude: (initialData as any).latitude || "",
      });
    } else {
      setFormData(INITIAL_LOCATION_DATA);
    }
  }, [initialData]);

  // --- Input Handler ---
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "address" && value.length > 200) return;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // --- SUBMIT HANDLER (Create / Update) ---
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 1. Prepare Payload (Map UI keys back to API keys)
      const payload: LocationMasterInput = {
        name: formData.name,
        code: formData.code,
        party: formData.party,
        profilePic: formData.profileImage, // UI 'profileImage' -> API 'profilePic'
        gstNo: formData.gstNo,
        ewayUsername: formData.ewayUsername,
        ewayPassword: formData.ewayPassword,
        gstInUsername: formData.gstnUsername, // UI 'gstn' -> API 'gstIn'
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
        // If your backend accepts extra fields like longitude/latitude/defaultParty, add them here
        // @ts-ignore
        longitude: formData.longitude,
        // @ts-ignore
        latitude: formData.latitude,
      };

      // 2. Determine Action
      if (initialData && initialData._id) {
        // >>> UPDATE <<<
        await updateLocation(initialData._id, payload);
        alert("Location updated successfully!");
      } else {
        // >>> CREATE <<<
        await createLocation(payload);
        alert("Location created successfully!");
      }

      // 3. Cleanup
      if (onSuccess) onSuccess(formData);
      // If used as a selector, pass name back
      if (onSelect) onSelect(formData.name);

      onClose();
    } catch (error) {
      console.error("Operation failed", error);
      alert("Failed to save location.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- DELETE HANDLER ---
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

  // --- Step Navigation ---
  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      // Final Step: Submit
      handleSubmit();
    }
  };

  // --- RENDERERS ---
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
              <button
                type="button"
                className="bg-[#104a7d] text-white px-2 rounded-r"
              >
                <Globe className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel required>Code</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9 flex">
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                onClick={(e) => e.stopPropagation()}
                className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm focus:outline-none focus:border-[#104a7d]"
              />
              <button
                type="button"
                className="bg-[#104a7d] text-white px-2 rounded-r"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4 md:col-span-3">
              <FormLabel>Party</FormLabel>
            </div>
            <div className="col-span-8 md:col-span-9 flex">
              <select
                name="party"
                value={formData.party}
                onChange={handleInputChange}
                onClick={(e) => e.stopPropagation()}
                className="w-full border border-gray-300 rounded-l px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#104a7d]"
              >
                <option value="">Select Party...</option>
                <option value="Party A">Party A</option>
                <option value="ABC Traders">ABC Traders</option>
              </select>
              <button
                type="button"
                className="bg-[#104a7d] text-white px-2 rounded-r"
              >
                <Edit className="w-4 h-4" />
              </button>
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
              onClick={(e) => e.stopPropagation()}
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
          onClick={(e) => e.stopPropagation()}
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
        onClick={(e) => e.stopPropagation()}
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
    <div className="h-full flex flex-col bg-white">
      {/* HEADER */}
      <div className="bg-[#104a7d] px-6 py-4 text-white flex justify-between items-center shrink-0">
        <h1 className="text-xl font-semibold tracking-wide">
          {initialData ? "EDIT LOCATION" : "NEW LOCATION"}
        </h1>
        <div className="text-sm opacity-80">
          Step {activeStep + 1} of {STEPS.length}
        </div>
      </div>

      {/* STEP NAV */}
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

      {/* BODY */}
      <div className="p-6 overflow-y-auto flex-1">
        {activeStep === 0 && renderBasicDetails()}
        {activeStep === 1 && renderCompliance()}
        {activeStep === 2 && renderAddress()}
      </div>

      {/* FOOTER */}
      <div className="bg-gray-50 px-6 py-4 border-t flex justify-between shrink-0">
        {/* Left Side: Delete or Empty */}
        <div>
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

        {/* Right Side: Navigation */}
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
                {isSubmitting ? "Saving..." : initialData ? "Update" : "Submit"}
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
  );
};
