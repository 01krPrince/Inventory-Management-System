// import React, { useState, ChangeEvent } from "react";
// import {
//   Globe,
//   Clock,
//   Edit,
//   ChevronRight,
//   X,
//   Upload,
//   Save,
//   ArrowRight,
//   ArrowLeft,
//   Copy,
//   Facebook,
//   Twitter,
//   Linkedin,
//   MessageCircle, // Using as placeholder for Skype
//   Landmark, // For Bank
// } from "lucide-react";

// // --- Types & Interfaces ---
// interface FormData {
//   // Basic Details
//   gstNo: string;
//   name: string;
//   printName: string;
//   identification: string;
//   code: string;
//   underLedger: string;
//   isCustomerCommon: boolean;
//   isSubCustomer: boolean;
//   underCustomer: string;
//   profileImage: string | null;

//   // Statutory (Tab 1)
//   gstRegDate: string;
//   cin: string;
//   pan: string;
//   goodsService: string;
//   gstCategory: string;
//   gstSuspend: boolean;
//   distance: string;
//   tdsApplicable: boolean;

//   // Communication (Tab 2)
//   billingAddress: string;
//   billingCountry: string;
//   billingState: string;
//   billingCity: string;
//   billingPin: string;
//   billingPhone: string;
//   billingEmail: string;
//   shippingAddress: string;
//   shippingCountry: string;
//   shippingState: string;
//   shippingCity: string;
//   shippingPin: string;
//   shippingPhone: string;
//   shippingEmail: string;

//   // Social Profile (Tab 3)
//   website: string;
//   facebook: string;
//   skype: string;
//   twitter: string;
//   linkedin: string;

//   // Defaults (Tab 4)
//   paymentTerms: string;
//   priceCategory: string;
//   salesExecutive: string;
//   transporter: string;
//   creditLimit: string;
//   maxCreditLimit: string;
//   maxCreditDays: string;
//   interestRateYearly: string;
//   customerOnWatch: boolean;
//   firmStatus: string;
//   territory: string;
//   customerCategory: string;

//   // Bank Detail (Tab 5)
//   ifscCode: string;
//   accountNo: string;
//   bankName: string;
//   branch: string;

//   // Contact Person placeholder
//   contactPersonName: string;
// }

// const INITIAL_DATA: FormData = {
//   // Basic
//   gstNo: "",
//   name: "",
//   printName: "",
//   identification: "",
//   code: "000048",
//   underLedger: "Sundry Debtors",
//   isCustomerCommon: false,
//   isSubCustomer: true,
//   underCustomer: "",
//   profileImage: null,
//   // Statutory
//   gstRegDate: "2017-07-01",
//   cin: "",
//   pan: "",
//   goodsService: "Goods",
//   gstCategory: "Registered",
//   gstSuspend: false,
//   distance: "0",
//   tdsApplicable: false,
//   // Communication
//   billingAddress: "",
//   billingCountry: "India",
//   billingState: "",
//   billingCity: "",
//   billingPin: "",
//   billingPhone: "",
//   billingEmail: "",
//   shippingAddress: "",
//   shippingCountry: "India",
//   shippingState: "",
//   shippingCity: "",
//   shippingPin: "",
//   shippingPhone: "",
//   shippingEmail: "",
//   // Social
//   website: "",
//   facebook: "",
//   skype: "",
//   twitter: "",
//   linkedin: "",
//   // Defaults
//   paymentTerms: "Due on Receipt",
//   priceCategory: "Retail",
//   salesExecutive: "Select...",
//   transporter: "Select...",
//   creditLimit: "0.00",
//   maxCreditLimit: "0.00",
//   maxCreditDays: "0",
//   interestRateYearly: "0",
//   customerOnWatch: false,
//   firmStatus: "Active",
//   territory: "Default",
//   customerCategory: "General",
//   // Bank
//   ifscCode: "",
//   accountNo: "",
//   bankName: "",
//   branch: "",
//   contactPersonName: "",
// };

// const STEPS = [
//   { id: 0, label: "Basic Details" },
//   { id: 1, label: "Statutory" },
//   { id: 2, label: "Communication" },
//   { id: 3, label: "Social Profile" },
//   { id: 4, label: "Defaults" },
//   { id: 5, label: "Bank Detail" },
//   { id: 6, label: "Custom Fields" },
//   { id: 7, label: "Contact Person" },
//   { id: 8, label: "Attachments" },
// ];

// interface AddNewCustomerProps {
//   onClose: () => void;
// }

// const AddNewCustomer: React.FC<AddNewCustomerProps> = ({ onClose }) => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState<FormData>(INITIAL_DATA);

//   // --- Handlers ---
//   const handleInputChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, type } = e.target;
//     const checked = (e.target as HTMLInputElement).checked;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const url = URL.createObjectURL(e.target.files[0]);
//       setFormData((prev) => ({ ...prev, profileImage: url }));
//     }
//   };

//   const copyBillingToShipping = () => {
//     setFormData((prev) => ({
//       ...prev,
//       shippingAddress: prev.billingAddress,
//       shippingCountry: prev.billingCountry,
//       shippingState: prev.billingState,
//       shippingCity: prev.billingCity,
//       shippingPin: prev.billingPin,
//       shippingPhone: prev.billingPhone,
//       shippingEmail: prev.billingEmail,
//     }));
//   };

//   const handleNext = () => {
//     if (activeStep < STEPS.length - 1) {
//       setActiveStep((prev) => prev + 1);
//     } else {
//       // 2. Handle the Final Submit
//       alert("Form Submitted Successfully!");
//       onClose(); // Call the prop to return to the directory
//     }
//   };

//   const handleBack = () => {
//     if (activeStep > 0) {
//       setActiveStep((prev) => prev - 1);
//     } else {
//       // 3. Handle "Extreme Back" (Step 0)
//       onClose(); // Call the prop to return to the directory
//     }
//   };

//   // --- Reusable UI Components ---

//   const FormLabel = ({
//     required,
//     children,
//   }: {
//     required?: boolean;
//     children: React.ReactNode;
//   }) => (
//     <label className="block text-xs font-medium text-gray-700 mb-1">
//       {children} {required && <span className="text-red-500">*</span>}
//     </label>
//   );

//   const ToggleSwitch = ({
//     checked,
//     onChange,
//     name,
//   }: {
//     checked: boolean;
//     onChange: any;
//     name: string;
//   }) => (
//     <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
//       <input
//         type="checkbox"
//         name={name}
//         id={name}
//         className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300"
//         style={{
//           right: checked ? "0" : "auto",
//           left: checked ? "auto" : "0",
//           borderColor: checked ? "#1e40af" : "#d1d5db",
//         }}
//         checked={checked}
//         onChange={onChange}
//       />
//       <label
//         htmlFor={name}
//         className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${
//           checked ? "bg-[#0c5888]" : "bg-gray-300"
//         }`}
//       ></label>
//     </div>
//   );

//   const InputField = ({
//     label,
//     name,
//     value,
//     onChange,
//     type = "text",
//     required = false,
//     className = "",
//     placeholder = "",
//   }: any) => (
//     <div className={`mb-3 ${className}`}>
//       <FormLabel required={required}>{label}</FormLabel>
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#0c5888]"
//       />
//     </div>
//   );

//   const SelectField = ({
//     label,
//     name,
//     value,
//     onChange,
//     options,
//     required = false,
//     className = "",
//   }: any) => (
//     <div className={`mb-3 ${className}`}>
//       <FormLabel required={required}>{label}</FormLabel>
//       <select
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-[#0c5888]"
//       >
//         {options.map((opt: string) => (
//           <option key={opt} value={opt}>
//             {opt}
//           </option>
//         ))}
//       </select>
//     </div>
//   );

//   // --- Step Renders ---

//   const renderBasicDetails = () => (
//     <div className="grid grid-cols-12 gap-6">
//       <div className="col-span-12 md:col-span-8 space-y-3">
//         {/* GST */}
//         <div className="grid grid-cols-12 gap-4 items-center">
//           <div className="col-span-3">
//             <FormLabel>GST No</FormLabel>
//           </div>
//           <div className="col-span-7">
//             <input
//               type="text"
//               name="gstNo"
//               value={formData.gstNo}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
//             />
//           </div>
//           <div className="col-span-2">
//             <button className="bg-[#0c5888] text-white text-xs px-3 py-1.5 rounded hover:bg-[#0a4a70] w-full">
//               Fetch-Info
//             </button>
//           </div>
//         </div>
//         {/* Name */}
//         <div className="grid grid-cols-12 gap-4 items-center">
//           <div className="col-span-3">
//             <FormLabel required>Name</FormLabel>
//           </div>
//           <div className="col-span-9 relative">
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
//             />
//           </div>
//         </div>
//         {/* Print Name */}
//         <div className="grid grid-cols-12 gap-4 items-center">
//           <div className="col-span-3">
//             <FormLabel required>Print Name</FormLabel>
//           </div>
//           <div className="col-span-9">
//             <input
//               type="text"
//               name="printName"
//               value={formData.printName}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
//             />
//           </div>
//         </div>
//         {/* Identification */}
//         <div className="grid grid-cols-12 gap-4 items-center">
//           <div className="col-span-3">
//             <FormLabel>Identification</FormLabel>
//           </div>
//           <div className="col-span-9">
//             <input
//               type="text"
//               name="identification"
//               value={formData.identification}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
//             />
//           </div>
//         </div>
//         {/* Code */}
//         <div className="grid grid-cols-12 gap-4 items-center">
//           <div className="col-span-3">
//             <FormLabel required>Code</FormLabel>
//           </div>
//           <div className="col-span-9 relative">
//             <input
//               type="text"
//               name="code"
//               value={formData.code}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
//             />
//             <Clock className="w-4 h-4 text-[#0c5888] absolute right-2 top-1.5" />
//           </div>
//         </div>
//         {/* Under Ledger */}
//         <div className="grid grid-cols-12 gap-4 items-center">
//           <div className="col-span-3">
//             <FormLabel required>Under Ledger</FormLabel>
//           </div>
//           <div className="col-span-9 relative flex">
//             <select
//               name="underLedger"
//               value={formData.underLedger}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded-l px-2 py-1 text-sm appearance-none bg-white"
//             >
//               <option>Sundry Debtors</option>
//               <option>Sundry Creditors</option>
//             </select>
//             <div className="bg-[#0c5888] text-white px-2 flex items-center justify-center rounded-r cursor-pointer">
//               <Edit className="w-3 h-3" />
//             </div>
//             <ChevronRight className="w-4 h-4 absolute right-10 top-1.5 text-gray-500 pointer-events-none" />
//           </div>
//         </div>
//         {/* Common */}
//         <div className="grid grid-cols-12 gap-4 items-center">
//           <div className="col-span-3">
//             <FormLabel>Customer Common for Sales Purchase</FormLabel>
//           </div>
//           <div className="col-span-9 flex items-center justify-end">
//             <ToggleSwitch
//               name="isCustomerCommon"
//               checked={formData.isCustomerCommon}
//               onChange={handleInputChange}
//             />
//             <span className="text-xs font-bold text-gray-600">
//               {formData.isCustomerCommon ? "ON" : "OFF"}
//             </span>
//           </div>
//         </div>
//         {/* Sub Customer */}
//         <div className="grid grid-cols-12 gap-4 items-center">
//           <div className="col-span-3">
//             <FormLabel>Is Sub Customer</FormLabel>
//           </div>
//           <div className="col-span-9 flex items-center justify-end">
//             <ToggleSwitch
//               name="isSubCustomer"
//               checked={formData.isSubCustomer}
//               onChange={handleInputChange}
//             />
//             <span className="text-xs font-bold text-gray-600">
//               {formData.isSubCustomer ? "ON" : "OFF"}
//             </span>
//           </div>
//         </div>
//         {formData.isSubCustomer ? (
//           <>
//             <div className="grid grid-cols-12 gap-4 items-center">
//               <div className="col-span-3">
//                 <FormLabel required>Under Customer</FormLabel>
//               </div>
//               <div className="col-span-9 relative">
//                 <select
//                   name="underCustomer"
//                   className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-500 appearance-none bg-white"
//                 >
//                   <option>Select...</option>
//                 </select>
//                 <ChevronRight className="w-4 h-4 absolute right-2 top-1.5 text-gray-500 pointer-events-none" />
//               </div>
//             </div>
//           </>
//         ) : (
//           <></>
//         )}
//       </div>

//       {/* Right Column: Image Upload */}
//       <div className="col-span-12 md:col-span-4 flex flex-col items-center justify-start mt-2">
//         <div className="w-56 h-56 bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center relative overflow-hidden group">
//           {formData.profileImage ? (
//             <>
//               <img
//                 src={formData.profileImage}
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//               <button
//                 onClick={() =>
//                   setFormData((prev) => ({ ...prev, profileImage: null }))
//                 }
//                 className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
//               >
//                 <X className="w-3 h-3" />
//               </button>
//             </>
//           ) : (
//             <div className="flex flex-col items-center text-blue-500">
//               <div className="w-32 h-32 bg-blue-400 rounded-full flex items-center justify-center mb-2">
//                 <div className="w-20 h-20 bg-[#0c5888] rounded-full mt-[-10px]"></div>
//                 <div className="absolute w-28 h-16 bg-[#0c5888] rounded-t-full bottom-10"></div>
//               </div>
//             </div>
//           )}
//           <div className="absolute top-0 right-0 bg-[#0c5888] text-white p-1 cursor-pointer">
//             <X className="w-3 h-3" />
//           </div>
//         </div>
//         <div className="mt-4 w-56">
//           <label className="cursor-pointer bg-[#0c5888] hover:bg-[#0a4a70] text-white text-xs font-bold py-2 px-4 rounded shadow block text-center">
//             Browse
//             <input
//               type="file"
//               className="hidden"
//               onChange={handleImageUpload}
//               accept="image/*"
//             />
//           </label>
//         </div>
//       </div>
//     </div>
//   );

//   const renderStatutory = () => (
//     <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
//         <div className="space-y-4">
//           <InputField label="GST" name="gst" />
//           <div className="grid grid-cols-12 gap-2 items-center">
//             <div className="col-span-4">
//               <FormLabel>Registration Date</FormLabel>
//             </div>
//             <div className="col-span-8 relative">
//               <input
//                 type="date"
//                 name="gstRegDate"
//                 value={formData.gstRegDate}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
//               />
//             </div>
//           </div>
//           <InputField
//             label="CIN"
//             name="cin"
//             value={formData.cin}
//             onChange={handleInputChange}
//           />
//           <InputField
//             label="PAN"
//             name="pan"
//             value={formData.pan}
//             onChange={handleInputChange}
//           />
//           <SelectField
//             label="Goods Service"
//             name="goodsService"
//             value={formData.goodsService}
//             onChange={handleInputChange}
//             options={["Goods", "Service"]}
//           />
//         </div>
//         <div className="space-y-4">
//           <SelectField
//             label="GST Category"
//             name="gstCategory"
//             value={formData.gstCategory}
//             onChange={handleInputChange}
//             options={["Registered", "Unregistered", "Composite"]}
//           />
//           <div className="grid grid-cols-12 gap-2 items-center">
//             <div className="col-span-4">
//               <FormLabel>GST Suspend</FormLabel>
//             </div>
//             <div className="col-span-8 flex items-center justify-end">
//               <input
//                 type="checkbox"
//                 name="gstSuspend"
//                 checked={formData.gstSuspend}
//                 onChange={handleInputChange}
//                 className="w-5 h-5 border-gray-300 rounded text-[#0c5888]"
//               />
//             </div>
//           </div>
//           <div className="h-8 hidden md:block"></div>
//           <InputField
//             label="Distance"
//             name="distance"
//             type="number"
//             value={formData.distance}
//             onChange={handleInputChange}
//             className="text-right"
//           />
//           <div className="grid grid-cols-12 gap-2 items-center">
//             <div className="col-span-4">
//               <FormLabel>TDS On GST Applicable</FormLabel>
//             </div>
//             <div className="col-span-8 flex items-center justify-end">
//               <input
//                 type="checkbox"
//                 name="tdsApplicable"
//                 checked={formData.tdsApplicable}
//                 onChange={handleInputChange}
//                 className="w-5 h-5 border-gray-300 rounded text-[#0c5888]"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderCommunication = () => (
//     <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Billing Info */}
//         <div>
//           <h3 className="text-sm font-bold text-[#0c5888] mb-4 border-b pb-2">
//             Billing Information
//           </h3>
//           <div className="space-y-3">
//             <div>
//               <FormLabel>Address</FormLabel>
//               <textarea
//                 name="billingAddress"
//                 value={formData.billingAddress}
//                 onChange={handleInputChange}
//                 rows={3}
//                 className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm resize-none focus:outline-none focus:border-[#0c5888]"
//               />
//             </div>
//             <InputField
//               label="Country"
//               name="billingCountry"
//               value={formData.billingCountry}
//               onChange={handleInputChange}
//             />
//             <div className="grid grid-cols-2 gap-4">
//               <InputField
//                 label="State"
//                 name="billingState"
//                 value={formData.billingState}
//                 onChange={handleInputChange}
//               />
//               <InputField
//                 label="City"
//                 name="billingCity"
//                 value={formData.billingCity}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <InputField
//               label="Pin Code"
//               name="billingPin"
//               value={formData.billingPin}
//               onChange={handleInputChange}
//             />
//             <InputField
//               label="Phone"
//               name="billingPhone"
//               value={formData.billingPhone}
//               onChange={handleInputChange}
//             />
//             <InputField
//               label="Email"
//               name="billingEmail"
//               value={formData.billingEmail}
//               onChange={handleInputChange}
//             />
//           </div>
//         </div>

//         {/* Shipping Info */}
//         <div>
//           <div className="flex justify-between items-center mb-4 border-b pb-2">
//             <h3 className="text-sm font-bold text-[#0c5888]">
//               Shipping Address
//             </h3>
//             <button
//               onClick={copyBillingToShipping}
//               className="flex items-center text-xs text-[#0c5888] hover:text-[#0a4a70] border border-[#0c5888] rounded px-2 py-1"
//             >
//               <Copy className="w-3 h-3 mr-1" /> Copy Billing
//             </button>
//           </div>
//           <div className="space-y-3">
//             <div>
//               <FormLabel>Address</FormLabel>
//               <textarea
//                 name="shippingAddress"
//                 value={formData.shippingAddress}
//                 onChange={handleInputChange}
//                 rows={3}
//                 className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm resize-none focus:outline-none focus:border-[#0c5888]"
//               />
//             </div>
//             <InputField
//               label="Country"
//               name="shippingCountry"
//               value={formData.shippingCountry}
//               onChange={handleInputChange}
//             />
//             <div className="grid grid-cols-2 gap-4">
//               <InputField
//                 label="State"
//                 name="shippingState"
//                 value={formData.shippingState}
//                 onChange={handleInputChange}
//               />
//               <InputField
//                 label="City"
//                 name="shippingCity"
//                 value={formData.shippingCity}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <InputField
//               label="Pin Code"
//               name="shippingPin"
//               value={formData.shippingPin}
//               onChange={handleInputChange}
//             />
//             <InputField
//               label="Phone"
//               name="shippingPhone"
//               value={formData.shippingPhone}
//               onChange={handleInputChange}
//             />
//             <InputField
//               label="Email"
//               name="shippingEmail"
//               value={formData.shippingEmail}
//               onChange={handleInputChange}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderSocialProfile = () => {
//     const SocialInput = ({ icon: Icon, name, value, placeholder }: any) => (
//       <div className="flex items-center mb-4">
//         <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-l border-y border-l border-gray-300">
//           <Icon className="w-5 h-5 text-gray-600" />
//         </div>
//         <div className="flex-1">
//           <input
//             type="text"
//             name={name}
//             value={value}
//             onChange={handleInputChange}
//             placeholder={placeholder}
//             className="w-full border border-gray-300 rounded-r px-3 py-2 text-sm focus:outline-none focus:border-[#0c5888]"
//           />
//         </div>
//       </div>
//     );

//     return (
//       <div className="bg-white border rounded-lg p-8 shadow-sm mt-4 max-w-3xl mx-auto">
//         <h3 className="text-lg font-medium text-gray-700 mb-6">
//           Social Media Links
//         </h3>
//         <div className="space-y-2">
//           <SocialInput
//             icon={Globe}
//             label="Website"
//             name="website"
//             value={formData.website}
//             placeholder="https://www.yourwebsite.com"
//           />
//           <SocialInput
//             icon={Facebook}
//             label="Facebook"
//             name="facebook"
//             value={formData.facebook}
//             placeholder="https://facebook.com/username"
//           />
//           <SocialInput
//             icon={MessageCircle}
//             label="Skype"
//             name="skype"
//             value={formData.skype}
//             placeholder="Skype ID / Link"
//           />
//           <SocialInput
//             icon={Twitter}
//             label="Twitter"
//             name="twitter"
//             value={formData.twitter}
//             placeholder="https://twitter.com/username"
//           />
//           <SocialInput
//             icon={Linkedin}
//             label="LinkedIn"
//             name="linkedin"
//             value={formData.linkedin}
//             placeholder="https://linkedin.com/in/username"
//           />
//         </div>
//       </div>
//     );
//   };

//   const renderDefaults = () => (
//     <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <SelectField
//           label="Payment Terms"
//           name="paymentTerms"
//           value={formData.paymentTerms}
//           onChange={handleInputChange}
//           options={["Due on Receipt", "Net 15", "Net 30", "Net 60"]}
//         />
//         <SelectField
//           label="Price Category"
//           name="priceCategory"
//           value={formData.priceCategory}
//           onChange={handleInputChange}
//           options={["Retail", "Wholesale", "Distributor"]}
//         />
//         <SelectField
//           label="Sales Executive"
//           name="salesExecutive"
//           value={formData.salesExecutive}
//           onChange={handleInputChange}
//           options={["Select...", "John Doe", "Jane Smith"]}
//         />
//         <SelectField
//           label="Transporter"
//           name="transporter"
//           value={formData.transporter}
//           onChange={handleInputChange}
//           options={["Select...", "DHL", "FedEx", "Local"]}
//         />
//         <InputField
//           label="Credit Limit"
//           name="creditLimit"
//           type="number"
//           value={formData.creditLimit}
//           onChange={handleInputChange}
//         />
//         <InputField
//           label="Max Credit Limit"
//           name="maxCreditLimit"
//           type="number"
//           value={formData.maxCreditLimit}
//           onChange={handleInputChange}
//         />
//         <InputField
//           label="Max Credit Days"
//           name="maxCreditDays"
//           type="number"
//           value={formData.maxCreditDays}
//           onChange={handleInputChange}
//         />
//         <InputField
//           label="Interest Rate Yearly (%)"
//           name="interestRateYearly"
//           type="number"
//           value={formData.interestRateYearly}
//           onChange={handleInputChange}
//         />

//         {/* Checkbox for Watch */}
//         <div className="flex items-center h-full pt-4">
//           <input
//             type="checkbox"
//             id="customerOnWatch"
//             name="customerOnWatch"
//             checked={formData.customerOnWatch}
//             onChange={handleInputChange}
//             className="w-5 h-5 mr-2 text-[#0c5888] rounded border-gray-300 focus:ring-[#0c5888]"
//           />
//           <label
//             htmlFor="customerOnWatch"
//             className="text-sm font-medium text-gray-700"
//           >
//             Customer On Watch
//           </label>
//         </div>

//         <SelectField
//           label="Firm Status"
//           name="firmStatus"
//           value={formData.firmStatus}
//           onChange={handleInputChange}
//           options={["Active", "Inactive", "Suspended"]}
//         />
//         <SelectField
//           label="Territory"
//           name="territory"
//           value={formData.territory}
//           onChange={handleInputChange}
//           options={["Default", "North", "South", "East", "West"]}
//         />
//         <SelectField
//           label="Customer Category"
//           name="customerCategory"
//           value={formData.customerCategory}
//           onChange={handleInputChange}
//           options={["General", "VIP", "Reseller"]}
//         />
//       </div>
//     </div>
//   );

//   const renderBankDetail = () => (
//     <div className="bg-white border rounded-lg p-6 shadow-sm mt-4">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex items-center mb-6 pb-2 border-b">
//           <Landmark className="w-5 h-5 text-[#0c5888] mr-2" />
//           <h3 className="text-lg font-medium text-gray-800">
//             Banking Information
//           </h3>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <InputField
//             label="RTGS/IFSC Code"
//             name="ifscCode"
//             value={formData.ifscCode}
//             onChange={handleInputChange}
//             placeholder="e.g., HDFC0001234"
//           />
//           <InputField
//             label="Account No."
//             name="accountNo"
//             value={formData.accountNo}
//             onChange={handleInputChange}
//             type="number"
//           />
//           <InputField
//             label="Bank Name"
//             name="bankName"
//             value={formData.bankName}
//             onChange={handleInputChange}
//           />
//           <InputField
//             label="Branch"
//             name="branch"
//             value={formData.branch}
//             onChange={handleInputChange}
//           />
//         </div>
//       </div>
//     </div>
//   );

//   const renderPlaceholderTab = (tabName: string) => (
//     <div className="bg-white border rounded-lg p-12 shadow-sm mt-4 flex flex-col items-center justify-center text-gray-400">
//       <Upload className="w-12 h-12 mb-2 opacity-20" />
//       <h3 className="text-lg font-medium">Configuration for {tabName}</h3>
//       <p className="text-sm">
//         Complete the previous steps to configure this section.
//       </p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-800">
//       <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
//         {/* Header */}
//         <div className="bg-[#0c5888] px-6 py-4 text-white flex justify-between items-center">
//           <h1 className="text-xl font-semibold tracking-wide">
//             ADD NEW CUSTOMER
//           </h1>
//           <div className="text-sm opacity-80">
//             Step {activeStep + 1} of {STEPS.length}
//           </div>
//         </div>

//         {/* Timeline / Progress Bar */}
//         <div className="bg-gray-100 border-b overflow-x-auto">
//           <div className="flex min-w-max px-4">
//             {STEPS.map((step, index) => {
//               const isActive = index === activeStep;
//               const isCompleted = index < activeStep;
//               const isPending = index > activeStep;

//               return (
//                 <div
//                   key={step.id}
//                   className={`
//                       relative py-3 px-4 text-sm font-medium cursor-pointer transition-colors duration-200 flex items-center
//                       ${
//                         isActive
//                           ? "text-[#0c5888] border-b-2 border-[#0c5888] bg-white"
//                           : ""
//                       }
//                       ${isCompleted ? "text-green-600" : ""}
//                       ${isPending ? "text-gray-400 hover:text-gray-600" : ""}
//                     `}
//                   onClick={() => setActiveStep(index)}
//                 >
//                   <span
//                     className={`
//                       w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 border
//                       ${
//                         isActive
//                           ? "bg-[#0c5888] text-white border-[#0c5888]"
//                           : ""
//                       }
//                       ${
//                         isCompleted
//                           ? "bg-green-100 text-green-600 border-green-600"
//                           : ""
//                       }
//                       ${isPending ? "bg-gray-100 border-gray-300" : ""}
//                     `}
//                   >
//                     {index + 1}
//                   </span>
//                   {step.label}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="p-6 bg-white min-h-[500px]">
//           {activeStep === 0 && renderBasicDetails()}
//           {activeStep === 1 && renderStatutory()}
//           {activeStep === 2 && renderCommunication()}
//           {activeStep === 3 && renderSocialProfile()}
//           {activeStep === 4 && renderDefaults()}
//           {activeStep === 5 && renderBankDetail()}
//           {activeStep === 6 && renderPlaceholderTab("Custom Fields")}
//           {activeStep === 7 && renderPlaceholderTab("Contact Person")}
//           {activeStep === 8 && renderPlaceholderTab("Attachments")}
//         </div>

//         {/* Footer Actions */}
//         <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
//           <button
//             onClick={handleBack}
//             className="flex items-center px-4 py-2 rounded border font-medium transition-colors text-gray-700 border-gray-300 hover:bg-gray-100 bg-white"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" /> Back
//           </button>

//           <button
//             onClick={handleNext}
//             className="flex items-center px-6 py-2 bg-[#0c5888] text-white rounded hover:bg-[#0a4a70] font-medium shadow-sm"
//           >
//             {activeStep === STEPS.length - 1 ? (
//               <>
//                 <Save className="w-4 h-4 mr-2" /> Submit
//               </>
//             ) : (
//               <>
//                 Save & Next <ArrowRight className="w-4 h-4 ml-2" />
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddNewCustomer;

import React, { useState, ChangeEvent } from "react";
import {
  Globe,
  Clock,
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
  MessageCircle,
} from "lucide-react";

// --- Types & Interfaces ---
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
}

const INITIAL_DATA: FormData = {
  // Basic
  gstNo: "",
  name: "",
  printName: "",
  identification: "",
  code: "000048",
  underLedger: "Sundry Debtors",
  isCustomerCommon: false,
  isSubCustomer: true,
  underCustomer: "",
  profileImage: null,
  // Statutory
  gstRegDate: "2017-07-01",
  cin: "",
  pan: "",
  goodsService: "Goods",
  gstCategory: "Registered",
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
};

// Only keeping the first 4 steps as requested
const STEPS = [
  { id: 0, label: "Basic Details" },
  { id: 1, label: "Statutory" },
  { id: 2, label: "Communication" },
  { id: 3, label: "Social Profile" },
];

interface AddNewCustomerProps {
  onClose?: () => void; // Made optional for standalone preview
}

const AddNewCustomer: React.FC<AddNewCustomerProps> = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);

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

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      // Final Submit
      alert("Form Submitted Successfully!");
      if (onClose) onClose();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    } else {
      // Exit
      if (onClose) onClose();
    }
  };

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
            <FormLabel required>Code</FormLabel>
          </div>
          <div className="col-span-9 relative">
            <input
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
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-3">
            <FormLabel required>Under Ledger</FormLabel>
          </div>
          <div className="col-span-9 relative flex">
            <select
              name="underLedger"
              value={formData.underLedger}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-l px-2 py-1 text-sm appearance-none bg-white"
            >
              <option>Sundry Debtors</option>
              <option>Sundry Creditors</option>
            </select>
            <div className="bg-[#0c5888] text-white px-2 flex items-center justify-center rounded-r cursor-pointer">
              <Edit className="w-3 h-3" />
            </div>
            <ChevronRight className="w-4 h-4 absolute right-10 top-1.5 text-gray-500 pointer-events-none" />
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
          <InputField label="GST" name="gst" />
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
    const SocialInput = ({ icon: Icon, name, value, placeholder }: any) => (
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-l border-y border-l border-gray-300">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex-1">
          <input
            type="text"
            name={name}
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full border border-gray-300 rounded-r px-3 py-2 text-sm focus:outline-none focus:border-[#0c5888]"
          />
        </div>
      </div>
    );

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
            placeholder="https://www.yourwebsite.com"
          />
          <SocialInput
            icon={Facebook}
            label="Facebook"
            name="facebook"
            value={formData.facebook}
            placeholder="https://facebook.com/username"
          />
          <SocialInput
            icon={MessageCircle}
            label="Skype"
            name="skype"
            value={formData.skype}
            placeholder="Skype ID / Link"
          />
          <SocialInput
            icon={Twitter}
            label="Twitter"
            name="twitter"
            value={formData.twitter}
            placeholder="https://twitter.com/username"
          />
          <SocialInput
            icon={Linkedin}
            label="LinkedIn"
            name="linkedin"
            value={formData.linkedin}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#0c5888] px-6 py-4 text-white flex justify-between items-center">
          <h1 className="text-xl font-semibold tracking-wide">
            ADD NEW CUSTOMER
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
            className="flex items-center px-6 py-2 bg-[#0c5888] text-white rounded hover:bg-[#0a4a70] font-medium shadow-sm"
          >
            {activeStep === STEPS.length - 1 ? (
              <>
                <Save className="w-4 h-4 mr-2" /> Submit
              </>
            ) : (
              <>
                Save & Next <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewCustomer;
