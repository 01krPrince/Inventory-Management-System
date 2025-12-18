import React, { useState } from "react";
import {
  X,
  ChevronDown,
  ChevronUp,
  Globe,
  Phone,
  Mail,
  Edit,
  MapPin,
  Download,
  Save,
  Trash2,
  RotateCcw,
  LogOut,
} from "lucide-react";

// --- Imported Components ---
import State from "./State";
import City from "./City";
import NameAndCodeMaster, { NameAndCodeData } from "./NameAndCodeComponent"; // Used for Territory
import LoyaltyCardMaster, { LoyaltyCardData } from "./LoyaltyCardMaster";

// --- Types ---
interface POSCustomerFormData {
  gstNo: string;
  name: string;
  phone: string;
  email: string;
  gender: string;
  dob: string;
  loyaltyCard: string;
  cardNo: string;
  status: string;
  anniversary: string;
  spouseName: string;
  gstNoB2B: string;
  territory: string;
  // Right Column
  address: string;
  country: string;
  state: string;
  city: string;
  pinCode: string;
  longitude: string;
  latitude: string;
}

interface POSCustomerMasterProps {
  onClose: () => boolean;
  index?: number;
}

// --- Static Data for Dropdowns ---
const mockData = {
  genders: ["Male", "Female", "Other"],
  statuses: ["Married", "Single"],
  countries: ["India", "USA", "UK"],
  territories: [
    { name: "North Zone", code: "NZ01", _id: "t1" },
    { name: "South Zone", code: "SZ01", _id: "t2" },
    { name: "East Zone", code: "EZ01", _id: "t3" },
  ],
  loyaltyCards: [
    {
      name: "Gold", // Mapping 'name' for dropdown display
      description: "Gold Tier",
      perAmount: "100",
      calculateOn: "Total",
      noOfPoints: "10",
      redeemAmountPerPoint: "1",
      minRedeemPoints: "500",
      birthdayDiscount: "5",
      anniversaryDiscount: "5",
      _id: "l1",
    },
    {
      name: "Silver",
      description: "Silver Tier",
      perAmount: "100",
      calculateOn: "Total",
      noOfPoints: "5",
      redeemAmountPerPoint: "0.5",
      minRedeemPoints: "200",
      birthdayDiscount: "2",
      anniversaryDiscount: "2",
      _id: "l2",
    },
  ],
  states: [
    { name: "Bihar", code: "BR", _id: "s1" },
    { name: "Delhi", code: "DL", _id: "s2" },
    { name: "Maharashtra", code: "MH", _id: "s3" },
  ],
  cities: [
    { name: "Darbhanga", code: "DBG", _id: "c1" },
    { name: "Patna", code: "PAT", _id: "c2" },
    { name: "Mumbai", code: "MUM", _id: "c3" },
  ],
};

const POSCustomerMaster: React.FC<POSCustomerMasterProps> = ({
  onClose,
  index = 50,
}) => {
  // --- Z-Index & Theme ---
  const overlayZIndex = index + 10;
  const nestedModalZIndex = overlayZIndex + 20;
  const themeColor = "#0f3c63";

  // --- UI State ---
  const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(true);
  const [isCustomFieldsOpen, setIsCustomFieldsOpen] = useState(false);

  // --- Modal Visibility States ---
  const [isTerritoryOpen, setIsTerritoryOpen] = useState(false);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);

  // --- Selected Data for Editing (Dual Functionality) ---
  const [selectedTerritoryData, setSelectedTerritoryData] =
    useState<NameAndCodeData | null>(null);
  const [selectedLoyaltyData, setSelectedLoyaltyData] =
    useState<LoyaltyCardData | null>(null);
  // Assuming State/City components accept similar data structures or generic objects
  const [selectedStateData, setSelectedStateData] = useState<any | null>(null);
  const [selectedCityData, setSelectedCityData] = useState<any | null>(null);

  // --- Form Data State ---
  const [formData, setFormData] = useState<POSCustomerFormData>({
    gstNo: "",
    name: "",
    phone: "",
    email: "",
    gender: "Male",
    dob: "",
    loyaltyCard: "",
    cardNo: "",
    status: "Married",
    anniversary: "",
    spouseName: "",
    gstNoB2B: "",
    territory: "",
    address: "",
    country: "India",
    state: "",
    city: "",
    pinCode: "",
    longitude: "",
    latitude: "",
  });

  // --- Handlers ---
  const handleChange = (field: keyof POSCustomerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- Dual Functionality Logic Handlers ---

  const handleTerritoryMaster = () => {
    if (formData.territory) {
      // Edit Mode
      const found = mockData.territories.find(
        (t) => t.name === formData.territory
      );
      setSelectedTerritoryData(
        found ? { name: found.name, code: found.code, _id: found._id } : null
      );
    } else {
      // Create Mode
      setSelectedTerritoryData(null);
    }
    setIsTerritoryOpen(true);
  };

  const handleLoyaltyMaster = () => {
    if (formData.loyaltyCard) {
      // Edit Mode
      const found = mockData.loyaltyCards.find(
        (l) => l.name === formData.loyaltyCard
      );
      setSelectedLoyaltyData(
        found ? (found as unknown as LoyaltyCardData) : null
      );
    } else {
      // Create Mode
      setSelectedLoyaltyData(null);
    }
    setIsLoyaltyOpen(true);
  };

  const handleStateMaster = () => {
    if (formData.state) {
      const found = mockData.states.find((s) => s.name === formData.state);
      setSelectedStateData(found || null);
    } else {
      setSelectedStateData(null);
    }
    setIsStateOpen(true);
  };

  const handleCityMaster = () => {
    if (formData.city) {
      const found = mockData.cities.find((c) => c.name === formData.city);
      setSelectedCityData(found || null);
    } else {
      setSelectedCityData(null);
    }
    setIsCityOpen(true);
  };

  // --- Helper Components (Internal) ---

  const FormLabel = ({
    children,
    required,
  }: {
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <label className="text-[13px] text-gray-700 font-medium whitespace-nowrap">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );

  const FormRow = ({
    label,
    required,
    icon,
    children,
    className = "",
  }: {
    label: string;
    required?: boolean;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={`grid grid-cols-12 gap-2 items-center mb-2 ${className}`}>
      <div className="col-span-4 flex items-center justify-between pr-2">
        <FormLabel required={required}>{label}</FormLabel>
        {icon && <div className="text-[#0f3c63]">{icon}</div>}
      </div>
      <div className="col-span-8">{children}</div>
    </div>
  );

  const inputClass =
    "w-full h-[28px] border border-gray-300 rounded-sm px-2 text-[13px] focus:outline-none focus:border-[#0f3c63]";
  const selectClass =
    "w-full h-[28px] border border-gray-300 rounded-sm px-1 text-[13px] bg-white focus:outline-none focus:border-[#0f3c63]";

  const ActionBtn = ({
    icon,
    onClick,
  }: {
    icon: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="h-[28px] w-[28px] bg-[#0f3c63] text-white flex items-center justify-center rounded-r-sm hover:bg-[#0a2a4a]"
    >
      {icon}
    </button>
  );

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      style={{ zIndex: overlayZIndex }}
    >
      <div className="w-full max-w-[1000px] bg-white rounded-sm shadow-2xl flex flex-col max-h-[95vh] border border-gray-400">
        {/* --- Header --- */}
        <div
          className="flex justify-between items-center px-4 py-2 text-white"
          style={{ backgroundColor: themeColor }}
        >
          <span className="font-semibold tracking-wide text-sm">
            POS Customer Master
          </span>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded p-0.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* --- Scrollable Content --- */}
        <div className="flex-1 overflow-y-auto p-2 bg-[#f8f9fa]">
          {/* Section 1: Basic Information */}
          <div className="mb-2 bg-white border border-gray-200 shadow-sm">
            {/* Section Header */}
            <button
              onClick={() => setIsBasicInfoOpen(!isBasicInfoOpen)}
              className="w-full flex justify-between items-center px-3 py-2 bg-white hover:bg-gray-50 border-b"
            >
              <div className="flex items-center gap-2 text-[#0f3c63] font-bold text-sm">
                <div className="w-4">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                  </svg>
                </div>
                <span>Basic Information</span>
              </div>
              {isBasicInfoOpen ? (
                <div className="bg-gray-700 text-white rounded-full p-0.5">
                  <ChevronUp size={14} />
                </div>
              ) : (
                <div className="bg-gray-700 text-white rounded-full p-0.5">
                  <ChevronDown size={14} />
                </div>
              )}
            </button>

            {/* Form Body */}
            {isBasicInfoOpen && (
              <div className="p-4">
                <div className="flex gap-6">
                  {/* --- LEFT COLUMN --- */}
                  <div className="flex-1">
                    {/* GST No Row */}
                    <div className="grid grid-cols-12 gap-2 items-center mb-2">
                      <div className="col-span-4">
                        <FormLabel>GST No</FormLabel>
                      </div>
                      <div className="col-span-8 flex gap-2">
                        <input
                          type="text"
                          className={inputClass}
                          value={formData.gstNo}
                          onChange={(e) =>
                            handleChange("gstNo", e.target.value)
                          }
                        />
                        <button className="bg-[#0f3c63] text-white text-xs px-3 py-1 rounded-sm whitespace-nowrap hover:bg-[#0a2a4a]">
                          Fetch-Info
                        </button>
                      </div>
                    </div>

                    {/* Name */}
                    <FormRow label="Name" required>
                      <div className="flex">
                        <input
                          type="text"
                          className={`${inputClass} rounded-r-none`}
                          placeholder="Name"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                        />
                        <ActionBtn icon={<Globe size={14} />} />
                      </div>
                    </FormRow>

                    {/* Phone */}
                    <FormRow label="Phone" required icon={<Phone size={14} />}>
                      <input
                        type="text"
                        className={inputClass}
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                      />
                    </FormRow>

                    {/* Email */}
                    <FormRow label="Email" icon={<Mail size={14} />}>
                      <input
                        type="email"
                        className={inputClass}
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                    </FormRow>

                    {/* Gender */}
                    <FormRow label="Gender">
                      <select
                        className={selectClass}
                        value={formData.gender}
                        onChange={(e) => handleChange("gender", e.target.value)}
                      >
                        {mockData.genders.map((g) => (
                          <option key={g}>{g}</option>
                        ))}
                      </select>
                    </FormRow>

                    {/* DOB */}
                    <FormRow label="DOB">
                      <div className="relative">
                        <input
                          type="date"
                          className={inputClass}
                          value={formData.dob}
                          onChange={(e) => handleChange("dob", e.target.value)}
                        />
                      </div>
                    </FormRow>

                    {/* Loyalty Card (Nested Component Trigger) */}
                    <FormRow label="Loyalty Card">
                      <div className="flex">
                        <select
                          className={`${selectClass} rounded-r-none`}
                          value={formData.loyaltyCard}
                          onChange={(e) =>
                            handleChange("loyaltyCard", e.target.value)
                          }
                        >
                          <option value="">Select...</option>
                          {mockData.loyaltyCards.map((card) => (
                            <option key={card.name} value={card.name}>
                              {card.name}
                            </option>
                          ))}
                        </select>
                        <ActionBtn
                          icon={<Edit size={14} />}
                          onClick={handleLoyaltyMaster}
                        />
                      </div>
                    </FormRow>

                    {/* Card No */}
                    <FormRow label="Card No">
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="Card No"
                        value={formData.cardNo}
                        onChange={(e) => handleChange("cardNo", e.target.value)}
                      />
                    </FormRow>

                    {/* Status */}
                    <FormRow label="Status">
                      <select
                        className={selectClass}
                        value={formData.status}
                        onChange={(e) => handleChange("status", e.target.value)}
                      >
                        {mockData.statuses.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </FormRow>

                    {/* Anniversary */}
                    <FormRow label="Anniversary">
                      <input
                        type="date"
                        className={inputClass}
                        value={formData.anniversary}
                        onChange={(e) =>
                          handleChange("anniversary", e.target.value)
                        }
                      />
                    </FormRow>

                    {/* Spouse Name */}
                    <FormRow label="Spouse Name">
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="Spouse Name"
                        value={formData.spouseName}
                        onChange={(e) =>
                          handleChange("spouseName", e.target.value)
                        }
                      />
                    </FormRow>

                    {/* GST No (B2B) */}
                    <FormRow label="GST No (If B2B)">
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="GST No"
                        value={formData.gstNoB2B}
                        onChange={(e) =>
                          handleChange("gstNoB2B", e.target.value)
                        }
                      />
                    </FormRow>

                    {/* Territory (Nested Component Trigger) */}
                    <FormRow label="Territory">
                      <div className="flex">
                        <select
                          className={`${selectClass} rounded-r-none`}
                          value={formData.territory}
                          onChange={(e) =>
                            handleChange("territory", e.target.value)
                          }
                        >
                          <option value="">Select...</option>
                          {mockData.territories.map((t) => (
                            <option key={t.code} value={t.name}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                        <ActionBtn
                          icon={<Edit size={14} />}
                          onClick={handleTerritoryMaster}
                        />
                      </div>
                    </FormRow>
                  </div>

                  {/* --- RIGHT COLUMN --- */}
                  <div className="flex-1">
                    {/* Address Row */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                      <div className="col-span-3 pt-1">
                        <FormLabel>Address</FormLabel>
                      </div>
                      <div className="col-span-9">
                        <div className="relative">
                          <textarea
                            className="w-full border border-gray-300 rounded-sm p-2 text-[13px] focus:outline-none focus:border-[#0f3c63] h-[100px] resize-none"
                            value={formData.address}
                            onChange={(e) =>
                              handleChange("address", e.target.value)
                            }
                          ></textarea>
                          <span className="absolute bottom-1 right-2 text-[10px] text-gray-400">
                            0/200
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Country */}
                    <div className="grid grid-cols-12 gap-2 items-center mb-2">
                      <div className="col-span-3">
                        <FormLabel>Country</FormLabel>
                      </div>
                      <div className="col-span-9">
                        <select
                          className={selectClass}
                          value={formData.country}
                          onChange={(e) =>
                            handleChange("country", e.target.value)
                          }
                        >
                          {mockData.countries.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* State (Nested Component Trigger) */}
                    <div className="grid grid-cols-12 gap-2 items-center mb-2">
                      <div className="col-span-3">
                        <FormLabel required>State</FormLabel>
                      </div>
                      <div className="col-span-9 flex">
                        <select
                          className={`${selectClass} rounded-r-none`}
                          value={formData.state}
                          onChange={(e) =>
                            handleChange("state", e.target.value)
                          }
                        >
                          <option value="">Select...</option>
                          {mockData.states.map((s) => (
                            <option key={s.code} value={s.name}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                        <ActionBtn
                          icon={<Edit size={14} />}
                          onClick={handleStateMaster}
                        />
                      </div>
                    </div>

                    {/* City (Nested Component Trigger) */}
                    <div className="grid grid-cols-12 gap-2 items-center mb-2">
                      <div className="col-span-3">
                        <FormLabel required>City</FormLabel>
                      </div>
                      <div className="col-span-9 flex">
                        <select
                          className={`${selectClass} rounded-r-none`}
                          value={formData.city}
                          onChange={(e) => handleChange("city", e.target.value)}
                        >
                          <option value="">Select...</option>
                          {mockData.cities.map((c) => (
                            <option key={c.code} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <ActionBtn
                          icon={<Edit size={14} />}
                          onClick={handleCityMaster}
                        />
                      </div>
                    </div>

                    {/* Pin Code */}
                    <div className="grid grid-cols-12 gap-2 items-center mb-2">
                      <div className="col-span-3 flex items-center justify-between pr-2">
                        <FormLabel>Pin Code</FormLabel>
                        <div className="text-[#0f3c63]">
                          <MapPin size={14} />
                        </div>
                      </div>
                      <div className="col-span-9">
                        <input
                          type="text"
                          className={inputClass}
                          value={formData.pinCode}
                          onChange={(e) =>
                            handleChange("pinCode", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Longitude */}
                    <div className="grid grid-cols-12 gap-2 items-center mb-2">
                      <div className="col-span-3">
                        <FormLabel>Longitude</FormLabel>
                      </div>
                      <div className="col-span-9">
                        <input
                          type="text"
                          className={inputClass}
                          value={formData.longitude}
                          onChange={(e) =>
                            handleChange("longitude", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Latitude */}
                    <div className="grid grid-cols-12 gap-2 items-center mb-2">
                      <div className="col-span-3">
                        <FormLabel>Latitude</FormLabel>
                      </div>
                      <div className="col-span-9">
                        <input
                          type="text"
                          className={inputClass}
                          value={formData.latitude}
                          onChange={(e) =>
                            handleChange("latitude", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Custom Fields */}
          <div className="bg-white border border-gray-200 shadow-sm">
            <button
              onClick={() => setIsCustomFieldsOpen(!isCustomFieldsOpen)}
              className="w-full flex justify-between items-center px-3 py-2 bg-white hover:bg-gray-50 border-b"
            >
              <div className="flex items-center gap-2 text-[#0f3c63] font-bold text-sm">
                <div className="w-4">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                  </svg>
                </div>
                <span>Custom Fields</span>
              </div>
              {isCustomFieldsOpen ? (
                <div className="bg-gray-700 text-white rounded-full p-0.5">
                  <ChevronUp size={14} />
                </div>
              ) : (
                <div className="bg-gray-700 text-white rounded-full p-0.5">
                  <ChevronDown size={14} />
                </div>
              )}
            </button>
            {isCustomFieldsOpen && (
              <div className="p-4 h-20 text-sm text-gray-500 text-center flex items-center justify-center">
                No custom fields configured.
              </div>
            )}
          </div>
        </div>

        {/* --- Footer --- */}
        <div
          className="p-2 flex justify-between items-center border-t border-gray-300"
          style={{ backgroundColor: themeColor }}
        >
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-4 py-1 border border-white text-white text-xs font-semibold rounded-sm hover:bg-white hover:text-[#0f3c63] transition-colors">
              <Save size={14} /> Save
            </button>
            <button className="flex items-center gap-1 px-4 py-1 border border-white text-white text-xs font-semibold rounded-sm hover:bg-white hover:text-[#0f3c63] transition-colors">
              <RotateCcw size={14} /> Clear
            </button>
            <button className="flex items-center gap-1 px-4 py-1 border border-white text-white text-xs font-semibold rounded-sm hover:bg-white hover:text-[#0f3c63] transition-colors">
              <Trash2 size={14} /> Delete
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-4 py-1 border border-white text-white text-xs font-semibold rounded-sm hover:bg-white hover:text-[#0f3c63] transition-colors"
            >
              <LogOut size={14} /> Exit
            </button>
          </div>

          <div>
            <div className="relative group">
              <button className="flex items-center gap-1 px-4 py-1 border border-white text-white text-xs font-semibold rounded-sm hover:bg-white hover:text-[#0f3c63] transition-colors">
                <Download size={14} /> Import{" "}
                <ChevronDown size={12} className="ml-1" />
              </button>
              {/* Simulated Dropdown content for Import */}
            </div>
          </div>
        </div>
      </div>

      {/* --- Nested Modals --- */}

      {/* Territory Master */}
      {isTerritoryOpen && (
        <NameAndCodeMaster
          title="Territory"
          onClose={() => setIsTerritoryOpen(false)}
          initialData={selectedTerritoryData}
          index={nestedModalZIndex}
        />
      )}

      {/* Loyalty Card Master */}
      {isLoyaltyOpen && (
        <LoyaltyCardMaster
          onClose={() => setIsLoyaltyOpen(false)}
          initialData={selectedLoyaltyData}
          index={nestedModalZIndex}
        />
      )}

      {/* State Master (Assuming similar interface to others) */}
      {isStateOpen && (
        <State
          onClose={() => setIsStateOpen(false)}
          initialData={selectedStateData}
          index={nestedModalZIndex}
        />
      )}

      {/* City Master (Assuming similar interface to others) */}
      {isCityOpen && (
        <City
          onClose={() => setIsCityOpen(false)}
          initialData={selectedCityData}
          index={nestedModalZIndex}
        />
      )}
    </div>
  );
};

export default POSCustomerMaster;
