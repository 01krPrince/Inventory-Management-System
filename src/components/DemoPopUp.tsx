import { useEffect, useRef, useState } from "react";
import {
  X, Mail, Linkedin, ArrowUpRight,
  BarChart3, Rocket, GraduationCap, Calculator,
  ShoppingCart, Building2, Stethoscope, Utensils,
  ChevronLeft, ChevronRight, Smartphone, Monitor
} from "lucide-react";

// 1. Defined COLORS at the top so the SOLUTIONS array can reference them immediately.
export const COLORS = {
  // Main Brand Colors
  primary: "#0e4a7b",
  primaryHover: "#0a365a",
  primaryLight: "#f0f9ff",

  // Functional Colors
  success: "#16a34a",
  danger: "#dc2626",
  dangerLight: "#f87171",
  warning: "#f97316",
  info: "#60a5fa",

  // Neutrals
  white: "#ffffff",
  background: "#f9fafb", // gray-50
  neutralHover: "#e5e7eb", // gray-200
  
  // Borders & Text
  border: "#e5e7eb",
  borderDark: "#d1d5db",
  textPrimary: "#374151",
  textSecondary: "#4b5563",
  textMuted: "#9ca3af",
  
  // UI Specific
  rowHover: "#f0f9ff",
  scrollbarTrack: "#f1f5f9",
  scrollbarThumb: "#0e4a7b",
  scrollbarThumbHover: "#0c3b62",
  borderTrack: "#f3f4f6",
} as const;

// 2. Updated Solutions to include "Client Side" specific chips
const SOLUTIONS = [
  {
    id: "erp",
    icon: BarChart3,
    label: "ERP System",
    color: COLORS.primary,
    // Using RGBA for transparencies based on your hex
    colorLight: "rgba(14, 74, 123, 0.1)", 
    tagline: "Enterprise & Resource Planning",
    desc: "End-to-end ERP with real-time inventory, supply chain, HR, finance, and analytics. Includes executive dashboards and employee self-service portals.",
    chips: ["Admin Dashboard", "Employee Portal", "Live Analytics", "Multi-Warehouse"],
  },
  {
    id: "startup",
    icon: Rocket,
    label: "Startups",
    color: COLORS.warning,
    colorLight: "rgba(249, 115, 22, 0.1)",
    tagline: "Scale Your Business Online",
    desc: "Launch fast with a complete digital stack. We build the powerful backend for you, plus the sleek mobile apps and web front-ends your customers interact with.",
    chips: ["Customer Mobile App", "Admin Panel", "Billing System", "CRM Integration"],
  },
  {
    id: "school",
    icon: GraduationCap,
    label: "Schools",
    color: COLORS.info,
    colorLight: "rgba(96, 165, 250, 0.1)",
    tagline: "School Management Ecosystem",
    desc: "Comprehensive platform for education. Admins manage fees and exams, while parents and students use a dedicated mobile app for homework and tracking.",
    chips: ["Student/Parent App", "Teacher Portal", "Fee Management", "Exam Results"],
  },
  {
    id: "accounting",
    icon: Calculator,
    label: "Accounting",
    color: COLORS.success,
    colorLight: "rgba(22, 163, 74, 0.1)",
    tagline: "Smart Accounting Software",
    desc: "GST-ready accounting with double-entry ledger. Automate your tax filing and give your clients a view-only portal to download their own invoices.",
    chips: ["GST/VAT Ready", "Client Portal", "Bank Reconciliation", "Tax Automation"],
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    label: "E-Commerce",
    color: "#ec4899",
    colorLight: "rgba(236, 72, 153, 0.1)",
    tagline: "Online Store & App",
    desc: "A complete shopping experience. We build your inventory dashboard and a blazing fast customer-facing website and mobile app (iOS/Android).",
    chips: ["Customer Website", "Shopping App", "Order Tracking", "Campaign Manager"],
  },
  {
    id: "realestate",
    icon: Building2,
    label: "Real Estate",
    color: "#f59e0b",
    colorLight: "rgba(245, 158, 11, 0.1)",
    tagline: "Property Management Suite",
    desc: "Track properties and leases easily. Includes a Tenant App for paying rent and raising maintenance requests directly from their phone.",
    chips: ["Tenant App", "Owner Dashboard", "Lease Management", "Rent Collection"],
  },
  {
    id: "clinic",
    icon: Stethoscope,
    label: "Clinics / Hospitals",
    color: COLORS.danger,
    colorLight: "rgba(220, 38, 38, 0.1)",
    tagline: "Healthcare Management",
    desc: "Digital OPD and patient records. Patients can book appointments via a user-friendly app, while doctors manage prescriptions on a tablet interface.",
    chips: ["Patient Booking App", "Doctor Dashboard", "Pharmacy Module", "Lab Reports"],
  },
  {
    id: "restaurant",
    icon: Utensils,
    label: "Restaurants",
    color: "#84cc16",
    colorLight: "rgba(132, 204, 22, 0.1)",
    tagline: "Restaurant & POS System",
    desc: "Manage tables and KOTs efficiently. Includes a QR-code ordering web-app for diners and a delivery fleet management app for your drivers.",
    chips: ["QR Ordering Web", "POS System", "Kitchen Display", "Delivery App"],
  },
];

interface DemoPopupProps {
  show: boolean;
  onClose: () => void;
}

export default function DemoPopup({ show, onClose }: DemoPopupProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [animDir, setAnimDir] = useState<"left" | "right">("right");
  const [animating, setAnimating] = useState(false);
  const [displayIdx, setDisplayIdx] = useState(0);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const t = setTimeout(() => setMounted(true), 10);
      document.body.style.overflow = "hidden";
      return () => clearTimeout(t);
    } else {
      setMounted(false);
      const timer = setTimeout(() => setIsVisible(false), 400);
      document.body.style.overflow = "";
      return () => clearTimeout(timer);
    }
  }, [show]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && show) onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [show, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const goTo = (idx: number, dir: "left" | "right") => {
    if (animating || idx === activeIdx) return;
    setAnimDir(dir);
    setAnimating(true);
    setTimeout(() => {
      setDisplayIdx(idx);
      setActiveIdx(idx);
      setAnimating(false);
    }, 210);
  };

  const prev = () => goTo((activeIdx - 1 + SOLUTIONS.length) % SOLUTIONS.length, "left");
  const next = () => goTo((activeIdx + 1) % SOLUTIONS.length, "right");

  if (!isVisible) return null;

  const sol = SOLUTIONS[displayIdx];
  const Icon = sol.icon;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        .dp-root { font-family: 'Outfit', sans-serif; }
        .dp-mono { font-family: 'DM Mono', monospace; }

        .dp-backdrop {
          transition: background-color 0.35s ease, backdrop-filter 0.35s ease;
        }

        .dp-card {
          transition: opacity 0.42s cubic-bezier(0.34, 1.3, 0.64, 1),
                      transform 0.42s cubic-bezier(0.34, 1.3, 0.64, 1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }

        /* Animated border gradient */
        @keyframes dp-spin {
          to { transform: rotate(360deg); }
        }
        .dp-border-spin {
          animation: dp-spin 8s linear infinite;
          transform-origin: center;
          will-change: transform;
        }

        /* Panel slide animation */
        .dp-panel {
          transition: opacity 0.21s ease, transform 0.21s cubic-bezier(0.4,0,0.2,1);
        }
        .dp-panel-exit-l { opacity: 0 !important; transform: translateX(-16px) !important; }
        .dp-panel-exit-r { opacity: 0 !important; transform: translateX(16px) !important; }

        /* Sidebar tab */
        .dp-tab {
          transition: background 0.17s ease, border-color 0.17s ease, color 0.17s ease;
          cursor: pointer;
          border: 1px solid transparent;
          text-align: left;
          width: 100%;
        }
        .dp-tab:not(.dp-tab-active):hover {
          background: ${COLORS.neutralHover} !important;
          color: ${COLORS.primary} !important;
        }

        /* Chips */
        .dp-chip {
          transition: transform 0.14s ease, box-shadow 0.14s ease;
        }
        .dp-chip:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        /* Primary CTA Button */
        .dp-btn-primary {
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .dp-btn-primary::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(115deg, rgba(255,255,255,0.2) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .dp-btn-primary:hover::before { opacity: 1; }
        .dp-btn-primary:hover { 
          transform: translateY(-2px); 
          background: ${COLORS.primaryHover};
        }
        .dp-btn-primary:active { transform: scale(0.98); }

        /* Secondary button */
        .dp-btn-sec {
          transition: all 0.2s ease;
        }
        .dp-btn-sec:hover {
          background: ${COLORS.background} !important;
          border-color: ${COLORS.borderDark} !important;
          color: ${COLORS.primary} !important;
          transform: translateY(-1px);
        }
        .dp-btn-sec:active { transform: scale(0.98); }

        /* Nav arrows */
        .dp-nav {
          transition: all 0.18s ease;
        }
        .dp-nav:hover {
          background: ${COLORS.primaryLight} !important;
          border-color: ${COLORS.primary} !important;
          color: ${COLORS.primary} !important;
          transform: scale(1.07);
        }
        .dp-nav:active { transform: scale(0.93); }

        /* Close Button */
        .dp-close {
          transition: all 0.18s ease;
        }
        .dp-close:hover {
          transform: rotate(90deg);
          background: ${COLORS.dangerLight}22 !important;
          color: ${COLORS.danger} !important;
          border-color: ${COLORS.dangerLight} !important;
        }

        /* Live dot animation */
        @keyframes dp-live {
          0%,100% { opacity:1; box-shadow: 0 0 0 0 ${COLORS.success}55; }
          50% { opacity:0.65; box-shadow: 0 0 0 5px rgba(22, 163, 74, 0); }
        }
        .dp-live { animation: dp-live 2.2s ease infinite; }

        /* Pagination Dot */
        .dp-dot {
          transition: width 0.28s cubic-bezier(0.4,0,0.2,1), background 0.28s ease;
          cursor: pointer;
          border-radius: 99px;
          height: 5px;
          border: none;
          padding: 0;
        }
        .dp-dot:hover { opacity: 0.85; }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        className="dp-root dp-backdrop fixed inset-0 z-[9999] flex items-center justify-center px-4"
        style={{
          backgroundColor: mounted ? "rgba(15, 23, 42, 0.65)" : "rgba(0,0,0,0)",
          backdropFilter: mounted ? "blur(8px)" : "blur(0px)",
        }}
        onClick={handleBackdropClick}
      >
        {/* ── Modal card ── */}
        <div
          ref={modalRef}
          className="dp-card"
          style={{
            width: "100%",
            maxWidth: "840px",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0) scale(1)" : "translateY(28px) scale(0.96)",
          }}
        >
          {/* Subtle spinning border wrapper */}
          <div
            className="relative rounded-[28px] overflow-hidden"
            style={{ padding: "1px", background: COLORS.border }}
          >
            {/* Spinning Gradient - made subtle for light theme */}
            <div
              className="dp-border-spin absolute"
              style={{
                inset: "-120%",
                background: `conic-gradient(from 0deg, ${sol.color}, ${COLORS.primary}, ${COLORS.white}, ${COLORS.info}, ${sol.color})`,
                opacity: 0.6,
                transition: "background 0.55s ease",
              }}
            />

            {/* Inner card surface */}
            <div
              className="relative rounded-[27px] overflow-hidden flex flex-col md:flex-row"
              style={{ background: COLORS.white }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="dp-close absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-lg"
                style={{
                  background: COLORS.background,
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.textMuted,
                }}
              >
                <X size={16} strokeWidth={2.5} />
              </button>

              {/* ── LEFT SIDEBAR ── */}
              <div
                className="flex-shrink-0 py-5 px-3 flex flex-col gap-0.5"
                style={{
                  width: "185px",
                  borderRight: `1px solid ${COLORS.border}`,
                  background: COLORS.background,
                }}
              >
                {/* Live Badge */}
                <div className="flex items-center gap-2 px-3 mb-4">
                  <span
                    className="dp-live inline-block w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS.success }}
                  />
                  <span
                    className="dp-mono text-[11px] font-bold tracking-widest uppercase"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Solutions
                  </span>
                </div>

                {/* Nav items */}
                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                  {SOLUTIONS.map((s, i) => {
                    const SIcon = s.icon;
                    const isActive = i === activeIdx;
                    return (
                      <button
                        key={s.id}
                        onClick={() => goTo(i, i > activeIdx ? "right" : "left")}
                        className={`dp-tab flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-1 ${isActive ? "dp-tab-active" : ""}`}
                        style={{
                          background: isActive ? COLORS.white : "transparent",
                          // Subtle shadow for active tab
                          boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.05)" : "none", 
                          color: isActive ? COLORS.primary : COLORS.textSecondary,
                          fontWeight: isActive ? 600 : 500,
                        }}
                      >
                        <SIcon
                          size={15}
                          strokeWidth={isActive ? 2.5 : 2}
                          style={{ flexShrink: 0, color: isActive ? s.color : COLORS.textMuted }}
                        />
                        <span className="text-[13px] leading-tight">{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── RIGHT PANEL ── */}
              <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
                {/* Content Area */}
                <div className="flex-1 px-8 py-8 flex flex-col relative overflow-hidden">
                  
                  {/* Decorative background blob for active solution color */}
                  <div 
                    className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none opacity-10"
                    style={{ background: sol.color, filter: "blur(60px)", transition: "background 0.5s ease" }}
                  />

                  {/* Sliding content */}
                  <div
                    className={`dp-panel flex-1 flex flex-col z-10 ${
                      animating
                        ? animDir === "right" ? "dp-panel-exit-l" : "dp-panel-exit-r"
                        : ""
                    }`}
                  >
                    {/* Solution Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-gray-100"
                        style={{
                          background: `linear-gradient(135deg, ${sol.color}, ${COLORS.white})`,
                          border: `1px solid ${sol.color}33`
                        }}
                      >
                        <Icon size={24} color={COLORS.white} strokeWidth={2.5} />
                      </div>
                      <div>
                        <div
                          className="dp-mono text-[11px] font-bold tracking-widest uppercase mb-1"
                          style={{ color: sol.color, transition: "color 0.4s ease" }}
                        >
                          {sol.tagline}
                        </div>
                        <h2 className="text-[22px] font-bold tracking-tight leading-tight" style={{ color: COLORS.primary }}>
                          {sol.label} Solution
                        </h2>
                      </div>
                    </div>

                    {/* Description */}
                    <p
                      className="text-[14px] leading-relaxed mb-6"
                      style={{ color: COLORS.textSecondary }}
                    >
                      {sol.desc}
                    </p>

                    {/* Feature Chips */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {sol.chips.map((chip, idx) => (
                        <span
                          key={chip}
                          className="dp-chip text-[12px] font-medium px-3 py-1.5 rounded-full border"
                          style={{
                            background: sol.colorLight,
                            borderColor: `${sol.color}33`,
                            color: COLORS.textPrimary,
                          }}
                        >
                           {/* Add icons based on text logic to emphasize client/admin separation */}
                          {chip.includes("App") || chip.includes("Mobile") ? 
                            <Smartphone size={10} className="inline mr-1.5 -mt-0.5 opacity-60"/> : 
                            <Monitor size={10} className="inline mr-1.5 -mt-0.5 opacity-60"/> 
                          }
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ── CTA section ── */}
                  <div className="mt-auto space-y-3 z-10">
                    
                    {/* Primary Action */}
                    <a
                      href={`mailto:princekr3006@gmail.com?subject=Inquiry%20about%20${encodeURIComponent(sol.label)}%20Solution`}
                      className="dp-btn-primary flex items-center justify-between w-full px-6 py-3.5 rounded-xl font-semibold shadow-md shadow-blue-900/10"
                      style={{
                        background: COLORS.primary,
                        color: COLORS.white,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Mail size={18} strokeWidth={2} />
                        <div>
                          <div className="text-[14px] leading-tight">Get this built for me</div>
                          <div className="dp-mono text-[10px] font-normal opacity-80">
                            Includes Admin + User Side
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight size={18} strokeWidth={2.5} className="opacity-80" />
                    </a>

                    {/* Secondary Actions Row */}
                    <div className="flex gap-3">
                      <a
                        href="https://www.linkedin.com/in/01krprince/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dp-btn-sec flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-[13px]"
                        style={{
                          border: `1px solid ${COLORS.border}`,
                          background: COLORS.white,
                          color: COLORS.textSecondary,
                        }}
                      >
                        <Linkedin size={15} strokeWidth={2} style={{ color: "#0077b5" }} />
                        LinkedIn
                      </a>

                      {/* Navigation Buttons */}
                      <button
                        onClick={prev}
                        className="dp-nav w-11 h-11 flex items-center justify-center rounded-xl"
                        style={{
                          background: COLORS.white,
                          border: `1px solid ${COLORS.border}`,
                          color: COLORS.textSecondary,
                        }}
                      >
                        <ChevronLeft size={18} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={next}
                        className="dp-nav w-11 h-11 flex items-center justify-center rounded-xl"
                        style={{
                          background: COLORS.white,
                          border: `1px solid ${COLORS.border}`,
                          color: COLORS.textSecondary,
                        }}
                      >
                        <ChevronRight size={18} strokeWidth={2.5} />
                      </button>
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex items-center justify-center gap-1.5 pt-2">
                      {SOLUTIONS.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => goTo(i, i > activeIdx ? "right" : "left")}
                          className="dp-dot"
                          style={{
                            width: i === activeIdx ? "24px" : "6px",
                            background: i === activeIdx ? sol.color : COLORS.borderDark,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Strip */}
                <div
                  className="flex items-center justify-between px-6 py-2.5"
                  style={{
                    borderTop: `1px solid ${COLORS.border}`,
                    background: COLORS.rowHover, // using the light blue row hover color
                  }}
                >
                  <span className="dp-mono text-[10px]" style={{ color: COLORS.textMuted }}>
                    {activeIdx + 1} / {SOLUTIONS.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: COLORS.success }}
                    />
                    <span className="text-[10px] font-medium" style={{ color: COLORS.textSecondary }}>
                      Available for hire
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}