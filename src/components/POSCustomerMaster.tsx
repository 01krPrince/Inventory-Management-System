import React, { useState } from 'react';
import { X, Globe, Phone, Mail, Edit, MapPin, Save, LogOut } from 'lucide-react';

// --- Imports ---
import State from './State';
import City from './City';
import NameAndCodeMaster, { NameAndCodeData } from './NameAndCodeComponent';
import LoyaltyCardMaster, { LoyaltyCardData } from './LoyaltyCardMaster';
import Dropdown, { ColumnDef } from './Dropdown';

// --- API Integration ---
import { PosCustomerService } from '../services/pos/posCustomer';

// --- Types ---
interface POSCustomerFormData {
  gstNo: string;
  name: string;
  phone: string;
  email: string;
  gender: string;
  dob: string;
  loyaltyCard: string;
  loyaltyCardOpeningPoint: string;
  cardNo: string;
  status: string;
  anniversary: string;
  spouseName: string;
  gstNoB2B: string;
  territory: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pinCode: string;
  longitude: string;
  latitude: string;
}

interface POSCustomerMasterProps {
  onClose: () => void;
  index?: number;
}

// --- Static Data ---
const mockData = {
  genders: ['Male', 'Female', 'Other'],
  statuses: ['Active', 'Inactive'],
  countries: ['India', 'USA', 'UK'],
  territories: [
    { name: 'North Zone', code: 'NZ01', _id: 't1' },
    { name: 'South Zone', code: 'SZ01', _id: 't2' },
    { name: 'East Zone', code: 'EZ01', _id: 't3' },
  ],
  loyaltyCards: [
    { name: 'Gold', description: 'Gold Tier', perAmount: '100', _id: 'l1' },
    { name: 'Silver', description: 'Silver Tier', perAmount: '100', _id: 'l2' },
  ],
  states: [
    { name: 'Bihar', code: 'BR', _id: 's1' },
    { name: 'Delhi', code: 'DL', _id: 's2' },
    { name: 'Maharashtra', code: 'MH', _id: 's3' },
  ],
  cities: [
    { name: 'Darbhanga', code: 'DBG', _id: 'c1' },
    { name: 'Patna', code: 'PAT', _id: 'c2' },
    { name: 'Mumbai', code: 'MUM', _id: 'c3' },
  ],
};

// --- Helper Components (Moved OUTSIDE to prevent focus loss) ---
const FormLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="whitespace-nowrap text-[13px] font-medium text-gray-700">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const FormRow = ({
  label,
  required,
  icon,
  children,
  className = '',
}: {
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`mb-2 grid grid-cols-12 items-center gap-2 ${className}`}>
    <div className="col-span-4 flex items-center justify-between pr-2">
      <FormLabel required={required}>{label}</FormLabel>
      {icon && <div className="text-[#0f3c63]">{icon}</div>}
    </div>
    <div className="col-span-8">{children}</div>
  </div>
);

const ActionBtn = ({ icon, onClick }: { icon: React.ReactNode; onClick?: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-r-sm bg-[#0f3c63] text-white hover:bg-[#0a2a4a]">
    {icon}
  </button>
);

const inputClass =
  'w-full h-[30px] border border-gray-300 rounded-sm px-2 text-[13px] focus:outline-none focus:border-[#0f3c63]';

const POSCustomerMaster: React.FC<POSCustomerMasterProps> = ({ onClose, index = 50 }) => {
  const overlayZIndex = index + 10;
  const nestedModalZIndex = overlayZIndex + 30;
  const dropdownZIndex = overlayZIndex + 100;
  const themeColor = '#0f3c63';

  const [isBasicInfoOpen] = useState(true);
  const [isTerritoryOpen, setIsTerritoryOpen] = useState(false);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);

  const [selectedTerritoryData] = useState<NameAndCodeData | null>(null);
  const [selectedLoyaltyData] = useState<LoyaltyCardData | null>(null);
  const [selectedStateData] = useState<any | null>(null);
  const [selectedCityData] = useState<any | null>(null);

  const [formData, setFormData] = useState<POSCustomerFormData>({
    gstNo: '',
    name: '',
    phone: '',
    email: '',
    gender: 'Male',
    dob: '',
    loyaltyCard: '',
    loyaltyCardOpeningPoint: '0',
    cardNo: '',
    status: 'Active',
    anniversary: '',
    spouseName: '',
    gstNoB2B: '',
    territory: '',
    address: '',
    country: 'India',
    state: '',
    city: '',
    pinCode: '',
    longitude: '',
    latitude: '',
  });

  const toOptions = (arr: string[]) => arr.map((s) => ({ name: s }));
  const simpleColumns: ColumnDef<{ name: string }>[] = [{ header: 'Name', key: 'name' }];
  const territoryColumns: ColumnDef<any>[] = [
    { header: 'Name', key: 'name' },
    { header: 'Code', key: 'code', width: 'w-20' },
  ];
  const loyaltyColumns: ColumnDef<any>[] = [
    { header: 'Card', key: 'name' },
    { header: 'Desc', key: 'description' },
  ];
  const stateCityColumns: ColumnDef<any>[] = [
    { header: 'Name', key: 'name' },
    { header: 'Code', key: 'code', width: 'w-16' },
  ];

  const handleChange = (field: keyof POSCustomerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, gstNoIfB: formData.gstNoB2B, latitiude: formData.latitude };
      await PosCustomerService.createPosCustomer(payload as any);
      alert('Customer saved successfully!');
      onClose();
    } catch (error) {
      alert('Failed to save customer.');
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      style={{ zIndex: overlayZIndex }}>
      <div className="flex h-auto max-h-[95vh] w-full max-w-[1000px] flex-col">
        <div
          className="flex items-center justify-between px-4 py-2 text-white"
          style={{ backgroundColor: themeColor }}>
          <span className="text-sm font-semibold tracking-wide">POS Customer Master</span>
          <button onClick={onClose} className="rounded p-0.5 transition-colors hover:bg-white/20">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#f8f9fa] p-2">
          <div className="mb-2 overflow-visible  bg-white shadow-sm">
            {isBasicInfoOpen && (
              <div className="overflow-visible p-4">
                <div className="flex gap-6 overflow-visible">
                  <div className="flex-1">
                    <div className="mb-2 grid grid-cols-12 items-center gap-2">
                      <div className="col-span-4">
                        <FormLabel>GST No</FormLabel>
                      </div>
                      <div className="col-span-8 flex gap-2">
                        <input
                          type="text"
                          className={inputClass}
                          value={formData.gstNo}
                          onChange={(e) => handleChange('gstNo', e.target.value)}
                        />
                        <button className="h-[30px] whitespace-nowrap rounded-sm bg-[#0f3c63] px-3 text-xs text-white hover:bg-[#0a2a4a]">
                          Fetch-Info
                        </button>
                      </div>
                    </div>

                    <FormRow label="Name" required>
                      <div className="flex">
                        <input
                          type="text"
                          className={`${inputClass} rounded-r-none`}
                          placeholder="Name"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                        />
                        <ActionBtn icon={<Globe size={14} />} />
                      </div>
                    </FormRow>

                    <FormRow label="Phone" required icon={<Phone size={14} />}>
                      <input
                        type="text"
                        className={inputClass}
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                      />
                    </FormRow>

                    <FormRow label="Email" icon={<Mail size={14} />}>
                      <input
                        type="email"
                        className={inputClass}
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                      />
                    </FormRow>

                    <FormRow label="Gender">
                      <Dropdown
                        data={toOptions(mockData.genders)}
                        columns={simpleColumns}
                        value={formData.gender}
                        valueKey="name"
                        onChange={(item) => handleChange('gender', item?.name || '')}
                        placeholder="Select Gender"
                        zIndex={dropdownZIndex}
                      />
                    </FormRow>

                    <FormRow label="DOB">
                      <input
                        type="date"
                        className={inputClass}
                        value={formData.dob}
                        onChange={(e) => handleChange('dob', e.target.value)}
                      />
                    </FormRow>

                    <FormRow label="Loyalty Card">
                      <div className="flex w-full items-center">
                        <div className="flex-grow">
                          <Dropdown
                            data={mockData.loyaltyCards}
                            columns={loyaltyColumns}
                            value={formData.loyaltyCard}
                            valueKey="name"
                            onChange={(item) => handleChange('loyaltyCard', item?.name || '')}
                            placeholder="Select Card"
                            className="w-full rounded-r-none"
                            zIndex={dropdownZIndex}
                          />
                        </div>
                        <ActionBtn
                          icon={<Edit size={14} />}
                          onClick={() => setIsLoyaltyOpen(true)}
                        />
                      </div>
                    </FormRow>

                    <FormRow label="Card No">
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="Card No"
                        value={formData.cardNo}
                        onChange={(e) => handleChange('cardNo', e.target.value)}
                      />
                    </FormRow>

                    <FormRow label="Status">
                      <Dropdown
                        data={toOptions(mockData.statuses)}
                        columns={simpleColumns}
                        value={formData.status}
                        valueKey="name"
                        onChange={(item) => handleChange('status', item?.name || '')}
                        placeholder="Select Status"
                        zIndex={dropdownZIndex}
                      />
                    </FormRow>

                    <FormRow label="Territory">
                      <div className="flex w-full items-center">
                        <div className="flex-grow">
                          <Dropdown
                            data={mockData.territories}
                            columns={territoryColumns}
                            value={formData.territory}
                            valueKey="name"
                            onChange={(item) => handleChange('territory', item?.name || '')}
                            placeholder="Select Territory"
                            zIndex={dropdownZIndex}
                          />
                        </div>
                        <ActionBtn
                          icon={<Edit size={14} />}
                          onClick={() => setIsTerritoryOpen(true)}
                        />
                      </div>
                    </FormRow>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="flex-1 overflow-visible">
                    <div className="mb-2 grid grid-cols-12 gap-2">
                      <div className="col-span-3 pt-1">
                        <FormLabel>Address</FormLabel>
                      </div>
                      <div className="col-span-9">
                        <textarea
                          className="h-[80px] w-full resize-none rounded-sm border border-gray-300 p-2 text-[13px]"
                          value={formData.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                        />
                      </div>
                    </div>

                    <FormRow label="Country">
                      <Dropdown
                        data={toOptions(mockData.countries)}
                        columns={simpleColumns}
                        value={formData.country}
                        valueKey="name"
                        onChange={(item) => handleChange('country', item?.name || '')}
                        placeholder="Select Country"
                        zIndex={dropdownZIndex}
                      />
                    </FormRow>

                    <FormRow label="State" required>
                      <div className="flex w-full items-center">
                        <div className="flex-grow">
                          <Dropdown
                            data={mockData.states}
                            columns={stateCityColumns}
                            value={formData.state}
                            valueKey="name"
                            onChange={(item) => handleChange('state', item?.name || '')}
                            placeholder="Select State"
                            zIndex={dropdownZIndex}
                          />
                        </div>
                        <ActionBtn icon={<Edit size={14} onClick={() => setIsStateOpen(true)} />} />
                      </div>
                    </FormRow>

                    <FormRow label="City" required>
                      <div className="flex w-full items-center">
                        <div className="flex-grow">
                          <Dropdown
                            data={mockData.cities}
                            columns={stateCityColumns}
                            value={formData.city}
                            valueKey="name"
                            onChange={(item) => handleChange('city', item?.name || '')}
                            placeholder="Select City"
                            zIndex={dropdownZIndex}
                          />
                        </div>
                        <ActionBtn icon={<Edit size={14} onClick={() => setIsCityOpen(true)} />} />
                      </div>
                    </FormRow>

                    <FormRow label="Pin Code" icon={<MapPin size={14} />}>
                      <input
                        type="text"
                        className={inputClass}
                        value={formData.pinCode}
                        onChange={(e) => handleChange('pinCode', e.target.value)}
                      />
                    </FormRow>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between border-t border-gray-300 p-2"
          style={{ backgroundColor: themeColor }}>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 rounded-sm border border-white px-4 py-1 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-[#0f3c63]">
              <Save size={14} /> Save
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1 rounded-sm border border-white px-4 py-1 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-[#0f3c63]">
              <LogOut size={14} /> Exit
            </button>
          </div>
        </div>
      </div>

      {/* Nested Modals */}
      {isTerritoryOpen && (
        <NameAndCodeMaster
          title="Territory"
          onClose={() => setIsTerritoryOpen(false)}
          initialData={selectedTerritoryData}
          index={nestedModalZIndex}
        />
      )}
      {isLoyaltyOpen && (
        <LoyaltyCardMaster
          onClose={() => setIsLoyaltyOpen(false)}
          initialData={selectedLoyaltyData}
          index={nestedModalZIndex}
        />
      )}
      {isStateOpen && (
        <State
          onClose={() => setIsStateOpen(false)}
          initialData={selectedStateData}
          index={nestedModalZIndex}
        />
      )}
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
