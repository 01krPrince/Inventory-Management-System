import React, { useState } from "react";
import Dropdown, { ColumnDef } from "../../../../components/Dropdown";
import DateInput from "../../../../components/DateInput";
import { DocumentIcon } from "../../../../components/icons";
import { Search, EditIcon, Save, Printer, MessageSquare } from "lucide-react";
import TenderTypeMaster from "../../../../components/TenderTypeMaster";

// Components & Constants
import CounterMaster from "../../../../components/CounterMaster";
import { COLORS } from "../../../../constants/colors";
import PaymentType from "../../../../components/PaymentType";

// --- Types & Interfaces ---
interface CustomerItem {
  id: string;
  name: string;
  phone: string;
  outstanding: string;
}

const TYPE_COLUMNS: ColumnDef<any>[] = [
  { header: "Type", key: "name", width: "flex-1" },
];
const COUNTER_COLUMNS: ColumnDef<any>[] = [
  { header: "Code", key: "code", width: "w-20" },
  { header: "Counter Name", key: "name", width: "flex-1" },
];
const CUSTOMER_COLUMNS: ColumnDef<CustomerItem>[] = [
  { header: "Customer Name", key: "name", width: "flex-1" },
  { header: "Phone", key: "phone", width: "w-32" },
  { header: "O/S Balance", key: "outstanding", width: "w-28" },
];
const TENDER_COLUMNS: ColumnDef<any>[] = [
  { header: "Type", key: "name", width: "flex-1" },
];

const mockData = {
  types: [{ name: "Receipt" }, { name: "Payment" }],
  counters: [
    { name: "Main Counter", code: "C01" },
    { name: "Back Office", code: "C02" },
    { name: "Showroom 01", code: "S01" },
  ],
  customers: [
    {
      id: "1",
      name: "AMIT KUMAR",
      phone: "9140712317",
      outstanding: "2450.00",
    },
    { id: "2", name: "SUMIT SINGH", phone: "9876543210", outstanding: "0.00" },
    {
      id: "3",
      name: "ACME CORP",
      phone: "8887776665",
      outstanding: "15400.00",
    },
  ],
  tenderAgainst: [
    { name: "Sales Invoice" },
    { name: "Opening Balance" },
    { name: "Advance" },
  ],
};

const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({
  children,
  required,
}) => (
  <label
    className="text-[12px] font-semibold flex items-center h-[30px] whitespace-nowrap"
    style={{ color: COLORS.textSecondary }}
  >
    {children}{" "}
    {required && (
      <span style={{ color: COLORS.danger }} className="ml-1">
        *
      </span>
    )}
  </label>
);

const ActionBtn: React.FC<{ icon: React.ReactNode; onClick?: () => void }> = ({
  icon,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="h-[30px] w-[30px] flex items-center justify-center rounded-sm border transition-all ml-1 z-10 shrink-0 shadow-sm"
    style={{
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
      color: COLORS.white,
    }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.backgroundColor = COLORS.primaryHover)
    }
    onMouseLeave={(e) =>
      (e.currentTarget.style.backgroundColor = COLORS.primary)
    }
  >
    {icon}
  </button>
);

const CustomerRecieptPayment: React.FC = () => {
  const nestedModalZIndex = 40;
  const [isCounterMasterOpen, setIsCounterMasterOpen] = useState(false);
  const [isTenderTypeOpen, setIsTenderTypeOpen] = useState(false);
  const [isPaymentTypeOpen, setIsPaymentTypeOpen] = useState(false);

  const [formData, setFormData] = useState({
    type: "Receipt",
    counter: "Main Counter",
    customer: "",
    customerId: "",
    tenderAgainst: "Sales Invoice",
    date: new Date().toISOString().split("T")[0],
    amount: "0.00",
    remarks: "",
  });

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: COLORS.background }}
    >
      {isCounterMasterOpen && (
        <CounterMaster onClose={() => setIsCounterMasterOpen(false)} />
      )}

      {isTenderTypeOpen && (
        <TenderTypeMaster
          onClose={() => setIsTenderTypeOpen(false)}
          index={nestedModalZIndex}
        />
      )}

      {isPaymentTypeOpen && (
        <PaymentType
          isOpen={isPaymentTypeOpen}
          onClose={() => setIsPaymentTypeOpen(false)}
          totalAmount={parseFloat(formData.amount)}
          zIndex={1000}
        />
      )}

      <div
        className="max-w-7xl mx-auto shadow-xl rounded-md border"
        style={{ backgroundColor: COLORS.white, borderColor: COLORS.border }}
      >
        <div
          className="p-3 px-5 flex justify-between items-center text-white rounded-t-md shadow-md"
          style={{ backgroundColor: COLORS.primary }}
        >
          <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight">
            <DocumentIcon className="w-5 h-5 opacity-80" />
            Voucher Entry: {formData.type}
          </h2>
          <span
            className="text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            VCH No: 10025
          </span>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-12 gap-x-10 gap-y-6">
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label required>Vch Type</Label>
                </div>
                <div className="col-span-8">
                  <Dropdown
                    data={mockData.types}
                    columns={TYPE_COLUMNS}
                    value={formData.type}
                    valueKey="name"
                    onChange={(item) =>
                      setFormData({
                        ...formData,
                        type: item?.name || "Receipt",
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label>Counter</Label>
                </div>
                <div className="col-span-8 flex">
                  <Dropdown
                    data={mockData.counters}
                    columns={COUNTER_COLUMNS}
                    value={formData.counter}
                    valueKey="name"
                    onChange={(item) =>
                      setFormData({ ...formData, counter: item?.name || "" })
                    }
                  />
                  <ActionBtn
                    icon={<EditIcon size={14} />}
                    onClick={() => setIsCounterMasterOpen(true)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label>Voucher No</Label>
                </div>
                <div className="col-span-8 font-mono">
                  <input
                    disabled
                    className="w-full h-[30px] rounded-sm px-2 text-[13px] font-bold border outline-none"
                    style={{
                      backgroundColor: COLORS.primaryLight,
                      borderColor: COLORS.border,
                      color: COLORS.primary,
                    }}
                    value="VCH-10025"
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label>Date</Label>
                </div>
                <div className="col-span-8">
                  <DateInput
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-4">
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label required>Customer</Label>
                </div>
                <div className="col-span-8">
                  <Dropdown
                    data={mockData.customers}
                    columns={CUSTOMER_COLUMNS}
                    value={formData.customerId}
                    valueKey="id"
                    onChange={(item) =>
                      setFormData({
                        ...formData,
                        customerId: item?.id || "",
                        customer: item?.name || "",
                      })
                    }
                    placeholder="Search Name/Phone..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label>Tender Against</Label>
                </div>
                <div className="col-span-8 flex">
                  <Dropdown
                    data={mockData.tenderAgainst}
                    columns={TENDER_COLUMNS}
                    value={formData.tenderAgainst}
                    valueKey="name"
                    onChange={(item) =>
                      setFormData({
                        ...formData,
                        tenderAgainst: item?.name || "",
                      })
                    }
                  />
                  <ActionBtn
                    icon={<EditIcon size={14} />}
                    onClick={() => setIsTenderTypeOpen(true)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <Label required>Amount</Label>
                </div>
                <div className="col-span-8 relative">
                  <span
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold"
                    style={{ color: COLORS.textMuted }}
                  >
                    ₹
                  </span>
                  <input
                    type="number"
                    className="w-full h-[30px] border rounded-sm pl-6 pr-2 text-right text-sm font-bold outline-none focus:ring-1 transition-all"
                    style={{
                      borderColor: COLORS.borderDark,
                      color: COLORS.success,
                    }}
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsPaymentTypeOpen(true)}
                  className="px-4 py-2 rounded text-[11px] font-bold shadow-md transition-all active:scale-95"
                  style={{
                    backgroundColor: COLORS.primary,
                    color: COLORS.white,
                  }}
                >
                  SELECT TENDER DETAILS
                </button>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <div
                className="border rounded p-4 h-[170px] overflow-y-auto shadow-inner"
                style={{
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.border,
                }}
              >
                <h3
                  className="text-[11px] font-bold uppercase mb-3 tracking-widest flex items-center gap-2"
                  style={{ color: COLORS.textMuted }}
                >
                  <Search size={14} /> Account Summary
                </h3>
                {formData.customerId ? (
                  <div className="space-y-3">
                    <div
                      className="flex justify-between border-b pb-1"
                      style={{ borderColor: COLORS.border }}
                    >
                      <span
                        className="text-xs"
                        style={{ color: COLORS.textSecondary }}
                      >
                        A/C Name:
                      </span>
                      <span
                        className="text-xs font-bold"
                        style={{ color: COLORS.textPrimary }}
                      >
                        {formData.customer}
                      </span>
                    </div>
                    <div
                      className="flex justify-between border-b pb-1"
                      style={{ borderColor: COLORS.border }}
                    >
                      <span
                        className="text-xs"
                        style={{ color: COLORS.textSecondary }}
                      >
                        Balance O/S:
                      </span>
                      <span
                        className="text-xs font-bold"
                        style={{ color: COLORS.danger }}
                      >
                        ₹{" "}
                        {
                          mockData.customers.find(
                            (c) => c.id === formData.customerId
                          )?.outstanding
                        }
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
                    <Search size={24} className="mb-2" />
                    <p className="text-[10px] text-center italic">
                      Select a customer account to view balance details
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8">
              <div className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-2">
                  <Label>Remarks</Label>
                </div>
                <div className="col-span-10">
                  <div className="relative">
                    <MessageSquare
                      size={14}
                      className="absolute left-2 top-2"
                      style={{ color: COLORS.textMuted }}
                    />
                    <textarea
                      className="w-full border rounded-sm pl-8 pr-2 py-2 text-xs outline-none resize-none min-h-[60px] transition-all focus:ring-1"
                      style={{
                        borderColor: COLORS.border,
                        color: COLORS.textPrimary,
                        backgroundColor: COLORS.white,
                      }}
                      placeholder="Add narration or internal notes here..."
                      value={formData.remarks}
                      onChange={(e) =>
                        setFormData({ ...formData, remarks: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="p-4 px-8 border-t flex justify-end items-center rounded-b-md"
          style={{
            backgroundColor: COLORS.scrollbarTrack,
            borderColor: COLORS.border,
          }}
        >
          <div className="flex gap-4">
            <button
              className="flex items-center gap-2 px-5 py-2 bg-white border rounded text-xs font-bold shadow-sm transition-all"
              style={{
                borderColor: COLORS.borderDark,
                color: COLORS.textPrimary,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.neutralHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.white)
              }
            >
              <Printer size={16} /> Print Voucher
            </button>
            <button
              className="flex items-center gap-2 px-8 py-2 rounded text-xs font-bold shadow-lg transition-all active:scale-95"
              style={{
                backgroundColor: COLORS.primary,
                color: COLORS.white,
                boxShadow: `0 4px 6px -1px ${COLORS.primary}4D`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.primaryHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.primary)
              }
            >
              <Save size={16} /> Save {formData.type}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerRecieptPayment;
