import { useState, useEffect, useRef, FormEvent } from "react";
import {
  Box,
  Layers,
  Zap,
  ShieldCheck,
  Globe,
  Smartphone,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Database,
  BarChart3,
  Activity,
  Cpu,
  Lock,
  User,
  Key,
  Loader2,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Package,
  Truck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../constants/colors";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const UPDATES = [
  { id: 1, version: "v2.5.1", date: "Dec 01, 2025", title: "Android 16KB Page Alignment", status: "Stable", module: "Core Kernel" },
  { id: 2, version: "v2.5.0", date: "Nov 28, 2025", title: "React 19.2 Core Integration", status: "Live", module: "Frontend" },
  { id: 3, version: "v2.4.9", date: "Nov 20, 2025", title: "AI Predictive Stock Analysis", status: "Beta", module: "Analytics" },
  { id: 4, version: "v2.4.8", date: "Nov 15, 2025", title: "Cross-Platform Sync Optimization", status: "Stable", module: "Sync Engine" },
  { id: 5, version: "v2.4.7", date: "Nov 10, 2025", title: "Legacy DB Migration Tool", status: "Deprecated", module: "Database" },
  { id: 6, version: "v2.4.6", date: "Nov 05, 2025", title: "Warehouse Heatmap Visualization", status: "Live", module: "UI/UX" },
];

const LANDING_METRICS = [
  { label: "System Uptime", value: "99.999%", trend: "+0.001%", positive: true },
  { label: "Active Nodes", value: "12,842", trend: "+342 this week", positive: true },
  { label: "Sync Latency", value: "8ms", trend: "↓ 4ms improved", positive: true },
  { label: "Transactions", value: "4.2M", trend: "per day", positive: true },
];

const FEATURES = [
  {
    icon: Package,
    title: "Real-Time Inventory",
    desc: "Track stock levels across all warehouses with sub-second sync. Automatic reorder alerts and predictive restocking powered by ML.",
  },
  {
    icon: Truck,
    title: "Logistics & Supply Chain",
    desc: "End-to-end shipment tracking, carrier integrations, and automated dispatch routing to optimize delivery performance.",
  },
  {
    icon: TrendingUp,
    title: "Business Intelligence",
    desc: "Interactive dashboards with drill-down analytics. Export reports, schedule digests, and share insights across teams.",
  },
];

const LandingPage = () => {
  const { login } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);
  const tourDriverRef = useRef<ReturnType<typeof driver> | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(event.target as Node)) {
        setIsLoginOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("inv_onboarding_done")) return;

    const tourDriver = driver({
      overlayColor: "rgba(14, 74, 123, 0.55)",
      overlayOpacity: 1,
      popoverClass: "inv-tour-popover",
      showProgress: true,
      progressText: "{{current}} / {{total}}",
      nextBtnText: "Next →",
      prevBtnText: "← Back",
      doneBtnText: "✓ Got it",
      animate: true,
      smoothScroll: true,
      allowClose: true,
      steps: [
        {
          element: "#tour-secure-access",
          popover: {
            title: "🔐 Secure Access",
            description: "Click here to login and access the management console.",
            side: "bottom" as const,
            align: "end" as const,
            onNextClick: () => {
              setIsLoginOpen(true);
              setEmail("test@inv.com");
              setPassword("12345");
              setTimeout(() => tourDriver.moveNext(), 400);
            },
          },
        },
        {
          element: "#tour-init-session",
          popover: {
            title: "🚀 Initialize Session",
            description: "Your credentials are pre-filled. Click here to continue.",
            side: "top" as const,
            align: "center" as const,
            onPrevClick: () => {
              setIsLoginOpen(false);
              setEmail("");
              setPassword("");
              setTimeout(() => tourDriver.movePrevious(), 400);
            },
          },
        },
      ],
      onDestroyStarted: () => {
        localStorage.setItem("inv_onboarding_done", "1");
        tourDriver.destroy();
      },
    });

    tourDriverRef.current = tourDriver;
    const startTimer = setTimeout(() => tourDriver.drive(), 900);
    return () => clearTimeout(startTimer);
  }, []);


  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      if (email === "test@inv.com" && password === "12345") {
        setIsLoading(false);
        login("");
      } else {
        setIsLoading(false);
        setError("Invalid credentials. Please try the demo credentials below.");
        alert("Demo Access:\nEmail: test@inv.com\nPassword: 12345");
      }
    }, 1200);
  };

  return (
    <div
      className="min-h-screen font-sans overflow-x-hidden"
      style={{ backgroundColor: COLORS.background, color: COLORS.textPrimary }}
    >
      {/* Subtle background pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${COLORS.border} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.border} 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            opacity: 0.5,
          }}
        />
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${COLORS.primary}18 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${COLORS.info}14 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* ── NAVBAR ── */}
      <nav
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? `${COLORS.white}f0` : COLORS.white,
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: `1px solid ${scrolled ? COLORS.border : "transparent"}`,
          boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
          padding: scrolled ? "12px 0" : "20px 0",
          transition: "all 0.3s ease",
        }}
      >
        <div className="w-full px-6 lg:px-12 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="relative w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, #1565a8)`,
                boxShadow: `0 4px 14px ${COLORS.primary}44`,
              }}
            >
              <Box className="w-5 h-5" style={{ color: COLORS.white }} />
              <span
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2"
                style={{
                  backgroundColor: COLORS.success,
                  borderColor: COLORS.white,
                  animation: "pulse 2s infinite",
                }}
              />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight" style={{ color: COLORS.textPrimary }}>
                INVENTORY<span style={{ color: COLORS.primary }}>PRO</span>
              </h1>
              <p className="text-[10px] tracking-widest uppercase" style={{ color: COLORS.textMuted }}>
                Enterprise V2.5
              </p>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {["Platform", "Intelligence", "Changelog", "Enterprise"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="transition-colors duration-200"
                style={{ color: COLORS.textSecondary }}
                onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.textSecondary)}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right: status + login */}
          <div className="hidden lg:flex items-center gap-3 relative" ref={loginRef}>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                border: `1px solid ${COLORS.border}`,
                backgroundColor: COLORS.primaryLight,
                color: COLORS.success,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS.success, animation: "pulse 2s infinite" }}
              />
              All Systems Operational
            </div>

            <button
            id="tour-secure-access"
              onClick={() => setIsLoginOpen(!isLoginOpen)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{
                backgroundColor: isLoginOpen ? COLORS.primaryHover : COLORS.primary,
                color: COLORS.white,
                boxShadow: `0 4px 14px ${COLORS.primary}40`,
              }}
              onMouseEnter={(e) => {
                if (!isLoginOpen) e.currentTarget.style.backgroundColor = COLORS.primaryHover;
              }}
              onMouseLeave={(e) => {
                if (!isLoginOpen) e.currentTarget.style.backgroundColor = COLORS.primary;
              }}
            >
              <Lock className="w-4 h-4" />
              Secure Access
              <ChevronDown
                className="w-4 h-4 transition-transform duration-300"
                style={{ transform: isLoginOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {/* Login dropdown */}
            <div
              className="absolute top-full right-0 mt-3 w-96 rounded-2xl overflow-hidden z-[60] transition-all duration-250 origin-top-right"
              style={{
                backgroundColor: COLORS.white,
                border: `1px solid ${COLORS.border}`,
                boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
                opacity: isLoginOpen ? 1 : 0,
                transform: isLoginOpen ? "scale(1) translateY(0)" : "scale(0.96) translateY(-8px)",
                pointerEvents: isLoginOpen ? "all" : "none",
              }}
            >
              {/* Header */}
              <div
                className="px-6 py-5 relative"
                style={{
                  borderBottom: `1px solid ${COLORS.border}`,
                  backgroundColor: COLORS.primaryLight,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.info})` }}
                />
                <h3 className="font-bold flex items-center gap-2" style={{ color: COLORS.textPrimary }}>
                  <ShieldCheck className="w-5 h-5" style={{ color: COLORS.primary }} />
                  Secure Authentication
                </h3>
                <p className="text-xs mt-1" style={{ color: COLORS.textMuted }}>
                  Enter your credentials to access the management console.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
                {error && (
                  <div
                    className="p-3 rounded-lg flex items-center gap-2 text-xs"
                    style={{
                      backgroundColor: "#fef2f2",
                      border: `1px solid #fecaca`,
                      color: COLORS.danger,
                    }}
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textSecondary }}>
                    Workspace ID
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: COLORS.textMuted }}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg py-2.5 pl-10 pr-4 text-sm transition-all outline-none"
                      placeholder="test@inv.com"
                      style={{
                        border: `1px solid ${COLORS.border}`,
                        backgroundColor: COLORS.background,
                        color: COLORS.textPrimary,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = COLORS.primary;
                        e.target.style.boxShadow = `0 0 0 3px ${COLORS.primary}18`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = COLORS.border;
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.textSecondary }}>
                    Access Key
                  </label>
                  <div className="relative">
                    <Key
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: COLORS.textMuted }}
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg py-2.5 pl-10 pr-4 text-sm transition-all outline-none"
                      placeholder="••••••••••"
                      style={{
                        border: `1px solid ${COLORS.border}`,
                        backgroundColor: COLORS.background,
                        color: COLORS.textPrimary,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = COLORS.primary;
                        e.target.style.boxShadow = `0 0 0 3px ${COLORS.primary}18`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = COLORS.border;
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Hint */}
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs"
                  style={{
                    backgroundColor: COLORS.primaryLight,
                    border: `1px solid ${COLORS.primary}30`,
                    color: COLORS.primary,
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: COLORS.primary, animation: "pulse 2s infinite" }}
                  />
                  End-to-end encrypted · Demo: test@inv.com / 12345
                </div>

                <button
                  type="submit"
                  id="tour-init-session"
                  disabled={isLoading}
                  className="w-full font-bold py-3 rounded-xl flex justify-center items-center gap-2 text-sm transition-all duration-200"
                  style={{
                    backgroundColor: isLoading ? COLORS.textMuted : COLORS.primary,
                    color: COLORS.white,
                    boxShadow: isLoading ? "none" : `0 4px 14px ${COLORS.primary}40`,
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) e.currentTarget.style.backgroundColor = COLORS.primaryHover;
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) e.currentTarget.style.backgroundColor = COLORS.primary;
                  }}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  {isLoading ? "Verifying..." : "Initialize Session"}
                </button>
              </form>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: COLORS.textSecondary, backgroundColor: COLORS.neutralHover }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden px-6 pt-4 pb-6 space-y-2 border-t mt-3"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}
          >
            {["Platform", "Intelligence", "Changelog", "Enterprise"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
                style={{ color: COLORS.textSecondary }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <button
              onClick={() => { setIsMobileMenuOpen(false); setIsLoginOpen(true); }}
              className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
              style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
            >
              <Lock className="w-4 h-4" /> Secure Access
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <main className="relative z-10 pt-32 pb-16 w-full px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="space-y-8">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: COLORS.primaryLight,
                border: `1px solid ${COLORS.primary}30`,
                color: COLORS.primary,
              }}
            >
              <span
                className="relative flex h-2 w-2"
              >
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: COLORS.primary }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: COLORS.primary }}
                />
              </span>
              CORE v2.5 — ACTIVE & OPERATIONAL
            </div>

            <h1
  className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight"
  style={{ color: COLORS.textPrimary }}
>
              Inventory{" "}
              <span
                className="inline-block"
                style={{
                  color: COLORS.primary,
                  backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, #1a73c8)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Intelligence
              </span>{" "}
              Redefined.
            </h1>

            <p className="text-lg leading-relaxed max-w-xl" style={{ color: COLORS.textSecondary }}>
              Orchestrate your global supply chain with precision. Real-time synchronization across
              mobile and web powered by a hybrid distributed core — built for businesses that can't
              afford downtime.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { document.documentElement.scrollTop = 0; setIsLoginOpen(true); }}
                className="px-7 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-200"
                style={{
                  backgroundColor: COLORS.primary,
                  color: COLORS.white,
                  boxShadow: `0 6px 20px ${COLORS.primary}40`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.primaryHover;
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.primary;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Launch Console <ArrowRight className="w-4 h-4" />
              </button>
              <button
                className="px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200"
                style={{
                  border: `1.5px solid ${COLORS.border}`,
                  color: COLORS.textSecondary,
                  backgroundColor: COLORS.white,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLORS.primary;
                  e.currentTarget.style.color = COLORS.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = COLORS.border;
                  e.currentTarget.style.color = COLORS.textSecondary;
                }}
              >
                View Architecture Docs
              </button>
            </div>

            {/* Metrics */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-0 pt-8 mt-2 rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.white }}
            >
              {LANDING_METRICS.map((m, i) => (
                <div
                  key={i}
                  className="px-5 py-4"
                  style={{
                    borderRight: i < 3 ? `1px solid ${COLORS.border}` : "none",
                    borderBottom: i < 2 ? `1px solid ${COLORS.border}` : "none",
                  }}
                >
                  <p className="text-2xl font-bold font-mono" style={{ color: COLORS.primary }}>{m.value}</p>
                  <p className="text-[11px] uppercase tracking-wider mt-0.5" style={{ color: COLORS.textMuted }}>{m.label}</p>
                  <p className="text-[11px] mt-1 font-medium" style={{ color: COLORS.success }}>{m.trend}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: dashboard preview */}
          <div className="relative hidden lg:block">
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{
                backgroundColor: COLORS.white,
                border: `1px solid ${COLORS.border}`,
                boxShadow: `0 24px 80px rgba(14,74,123,0.12), 0 4px 20px rgba(0,0,0,0.06)`,
              }}
            >
              {/* Window chrome */}
              <div
                className="flex items-center justify-between px-5 py-3.5"
                style={{ borderBottom: `1px solid ${COLORS.border}`, backgroundColor: COLORS.background }}
              >
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#fc5858" }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#fdbc40" }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#34c84a" }} />
                </div>
                <div
                  className="text-xs font-mono px-3 py-1 rounded-md"
                  style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }}
                >
                  dashboard_main.tsx
                </div>
                <div className="flex gap-2">
                  <Activity className="w-4 h-4" style={{ color: COLORS.primary }} />
                  <BarChart3 className="w-4 h-4" style={{ color: COLORS.textMuted }} />
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Chart area */}
                <div
                  className="h-44 rounded-xl relative overflow-hidden"
                  style={{ backgroundColor: COLORS.primaryLight, border: `1px solid ${COLORS.primary}20` }}
                >
                  <div className="absolute inset-0 flex items-end justify-between px-5 pb-0">
                    {[38, 62, 48, 85, 70, 90, 55, 72, 80, 65].map((h, i) => (
                      <div
                        key={i}
                        className="rounded-t transition-all duration-500"
                        style={{
                          height: `${h}%`,
                          width: "8%",
                          background: `linear-gradient(180deg, ${COLORS.primary}, ${COLORS.primary}88)`,
                          opacity: 0.75,
                        }}
                      />
                    ))}
                  </div>
                  <div className="absolute top-3 left-4 text-[11px] font-semibold" style={{ color: COLORS.primary }}>
                    Stock Movement — Last 10 Days
                  </div>
                </div>

                {/* KPI cards */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "INBOUND VELOCITY", value: "1,204", pct: "70%", color: COLORS.success },
                    { label: "OUTBOUND LOAD", value: "892", pct: "45%", color: COLORS.info },
                  ].map((kpi) => (
                    <div
                      key={kpi.label}
                      className="p-4 rounded-xl"
                      style={{ backgroundColor: COLORS.background, border: `1px solid ${COLORS.border}` }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
                        {kpi.label}
                      </p>
                      <p className="text-2xl font-mono font-bold mt-1" style={{ color: COLORS.textPrimary }}>
                        {kpi.value}
                      </p>
                      <div
                        className="w-full h-1.5 rounded-full mt-3 overflow-hidden"
                        style={{ backgroundColor: COLORS.neutralHover }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{ width: kpi.pct, backgroundColor: kpi.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mini table row */}
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ border: `1px solid ${COLORS.border}` }}
                >
                  {[
                    { sku: "SKU-1042", name: "Industrial Valve", qty: 240, status: "In Stock" },
                    { sku: "SKU-2093", name: "Circuit Board v2", qty: 18, status: "Low Stock" },
                    { sku: "SKU-3311", name: "Steel Coupling", qty: 0, status: "Out of Stock" },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-2.5 text-xs"
                      style={{
                        borderBottom: i < 2 ? `1px solid ${COLORS.borderTrack}` : "none",
                        backgroundColor: i % 2 === 0 ? COLORS.white : COLORS.background,
                      }}
                    >
                      <span className="font-mono" style={{ color: COLORS.primary }}>{row.sku}</span>
                      <span className="flex-1 mx-4 truncate" style={{ color: COLORS.textSecondary }}>{row.name}</span>
                      <span
                        className="px-2 py-0.5 rounded-full font-semibold text-[10px]"
                        style={{
                          backgroundColor:
                            row.qty === 0 ? "#fef2f2" : row.qty < 30 ? "#fffbeb" : COLORS.primaryLight,
                          color:
                            row.qty === 0 ? COLORS.danger : row.qty < 30 ? COLORS.warning : COLORS.success,
                        }}
                      >
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div
              className="absolute -left-10 top-20 p-4 rounded-xl shadow-lg hidden xl:block"
              style={{
                backgroundColor: COLORS.white,
                border: `1px solid ${COLORS.border}`,
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                animation: "float 4s ease-in-out infinite",
              }}
            >
              <div className="flex items-center gap-3 mb-1">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: COLORS.primaryLight }}
                >
                  <Database size={14} style={{ color: COLORS.primary }} />
                </div>
                <span className="text-sm font-bold" style={{ color: COLORS.textPrimary }}>Sync Complete</span>
              </div>
              <p className="text-xs" style={{ color: COLORS.textMuted }}>All shards optimized</p>
            </div>

            <div
              className="absolute -right-8 bottom-24 p-4 rounded-xl shadow-lg hidden xl:block"
              style={{
                backgroundColor: COLORS.white,
                border: `1px solid ${COLORS.border}`,
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                animation: "float 5s ease-in-out infinite 1s",
              }}
            >
              <div className="flex items-center gap-3 mb-1">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: "#faf5ff" }}
                >
                  <Cpu size={14} style={{ color: "#7c3aed" }} />
                </div>
                <span className="text-sm font-bold" style={{ color: COLORS.textPrimary }}>AI Analysis</span>
              </div>
              <p className="text-xs" style={{ color: COLORS.textMuted }}>Predictive model active</p>
            </div>
          </div>
        </div>

        {/* ── COMPANY TICKER ── */}
        <div
          className="mt-24 py-8 rounded-2xl max-w-[1400px] mx-auto"
          style={{ border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.white }}
        >
          <p className="text-center text-xs font-bold uppercase tracking-widest mb-6" style={{ color: COLORS.textMuted }}>
            Powering Logistics For
          </p>
          <div className="flex flex-wrap justify-center gap-10 lg:gap-20">
            {["ACME Corp", "Globex", "Soylent", "Initech", "Umbrella", "Cyberdyne"].map((co) => (
              <span key={co} className="text-xl font-bold" style={{ color: COLORS.textMuted, opacity: 0.5 }}>
                {co}
              </span>
            ))}
          </div>
        </div>

        {/* ── FEATURES ── */}
        <div id="platform" className="mt-28 max-w-[1400px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: COLORS.textPrimary }}>
              Architecture & Capabilities
            </h2>
            <p className="max-w-2xl mx-auto text-lg" style={{ color: COLORS.textSecondary }}>
              Engineered for high-throughput inventory environments — combining edge speed with cloud reliability.
            </p>
          </div>

          {/* Feature cards top row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-2xl transition-all duration-200 group cursor-default"
                  style={{
                    backgroundColor: COLORS.white,
                    border: `1px solid ${COLORS.border}`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = COLORS.primary;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 30px ${COLORS.primary}14`;
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = COLORS.border;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: COLORS.primaryLight }}
                  >
                    <Icon className="w-6 h-6" style={{ color: COLORS.primary }} />
                  </div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: COLORS.textPrimary }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: COLORS.textSecondary }}>{f.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Wide cards bottom row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Unified Core — spans 2 */}
            <div
              className="md:col-span-2 p-10 rounded-2xl relative overflow-hidden transition-all duration-200"
              style={{
                backgroundColor: COLORS.white,
                border: `1px solid ${COLORS.border}`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = COLORS.primary;
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 30px ${COLORS.primary}12`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = COLORS.border;
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <div
                className="absolute top-0 right-0 p-10 opacity-5"
                style={{ color: COLORS.primary }}
              >
                <Globe size={180} />
              </div>
              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: COLORS.primaryLight }}
                >
                  <Layers className="w-6 h-6" style={{ color: COLORS.primary }} />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: COLORS.textPrimary }}>Unified Hybrid Core</h3>
                <p className="leading-relaxed mb-6 max-w-lg" style={{ color: COLORS.textSecondary }}>
                  Seamlessly transition between our React command dashboard and Flutter mobile app. State persists
                  instantly using WebSockets and conflict-free replicated data types (CRDTs).
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "React 19.2", bg: COLORS.primaryLight, color: COLORS.primary },
                    { label: "Flutter 3.38", bg: "#ecfeff", color: "#0891b2" },
                    { label: "Go 1.22", bg: "#f0fdf4", color: COLORS.success },
                  ].map((tag) => (
                    <span
                      key={tag.label}
                      className="px-3 py-1 rounded-lg text-xs font-semibold font-mono"
                      style={{ backgroundColor: tag.bg, color: tag.color, border: `1px solid ${tag.color}30` }}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Offline First */}
            <div
              className="p-10 rounded-2xl transition-all duration-200"
              style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.border}` }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = COLORS.primary;
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 30px ${COLORS.primary}12`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = COLORS.border;
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: "#f0fdf4" }}
              >
                <Smartphone className="w-6 h-6" style={{ color: COLORS.success }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: COLORS.textPrimary }}>Offline First</h3>
              <p className="text-sm leading-relaxed" style={{ color: COLORS.textSecondary }}>
                Native Android & iOS support with offline-first SQLite sync. Scan barcodes, audit stock, and sign off
                deliveries without signal.
              </p>
            </div>
          </div>

          {/* Zero Trust banner */}
          <div
            className="mt-6 p-10 rounded-2xl flex items-center justify-between transition-all duration-200"
            style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.border}` }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = COLORS.primary;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = COLORS.border;
            }}
          >
            <div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: COLORS.textPrimary }}>Zero-Trust Security</h3>
              <p className="text-sm max-w-2xl leading-relaxed mb-5" style={{ color: COLORS.textSecondary }}>
                End-to-end encryption for all transaction data. Role-based access control (RBAC) granular to the field
                level with biometrics and multi-factor authentication.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-semibold">
                {["SOC2 TYPE II", "GDPR READY", "ISO 27001", "HIPAA COMPLIANT"].map((badge) => (
                  <span key={badge} className="flex items-center gap-1.5" style={{ color: COLORS.success }}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden md:block flex-shrink-0">
              <ShieldCheck className="w-24 h-24" style={{ color: COLORS.primaryLight }} strokeWidth={1} />
            </div>
          </div>
        </div>

        {/* ── CHANGELOG ── */}
        <div id="updates" className="mt-28 max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>System Changelog</h2>
              <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>Live feed from the CI/CD pipeline.</p>
            </div>
            <button
              className="mt-4 md:mt-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{
                border: `1.5px solid ${COLORS.border}`,
                color: COLORS.textSecondary,
                backgroundColor: COLORS.white,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = COLORS.primary;
                e.currentTarget.style.color = COLORS.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = COLORS.border;
                e.currentTarget.style.color = COLORS.textSecondary;
              }}
            >
              View All Commits
            </button>
          </div>

          <div
            className="rounded-2xl overflow-hidden shadow-sm"
            style={{ border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.white }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-12 gap-4 px-5 py-3.5 text-xs font-bold uppercase tracking-wider"
              style={{
                backgroundColor: COLORS.background,
                borderBottom: `1px solid ${COLORS.border}`,
                color: COLORS.textMuted,
              }}
            >
              <div className="col-span-2">Version</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Module</div>
              <div className="col-span-4">Feature / Fix</div>
              <div className="col-span-2 text-right">Status</div>
            </div>

            <div>
              {UPDATES.map((update, i) => (
                <div
                  key={update.id}
                  className="grid grid-cols-12 gap-4 px-5 py-4 items-center transition-colors cursor-default"
                  style={{
                    borderBottom: i < UPDATES.length - 1 ? `1px solid ${COLORS.borderTrack}` : "none",
                    backgroundColor: COLORS.white,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = COLORS.rowHover;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = COLORS.white;
                  }}
                >
                  <div className="col-span-2 font-mono text-sm font-bold" style={{ color: COLORS.primary }}>
                    {update.version}
                  </div>
                  <div className="col-span-2 text-sm" style={{ color: COLORS.textSecondary }}>
                    {update.date}
                  </div>
                  <div
                    className="col-span-2 text-xs font-mono px-2 py-1 rounded-lg w-fit"
                    style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }}
                  >
                    {update.module}
                  </div>
                  <div className="col-span-4 text-sm font-medium" style={{ color: COLORS.textPrimary }}>
                    {update.title}
                  </div>
                  <div className="col-span-2 text-right">
                    <span
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase"
                      style={{
                        backgroundColor:
                          update.status === "Stable" ? "#f0fdf4"
                          : update.status === "Live" ? COLORS.primaryLight
                          : update.status === "Beta" ? "#fffbeb"
                          : "#fef2f2",
                        color:
                          update.status === "Stable" ? COLORS.success
                          : update.status === "Live" ? COLORS.primary
                          : update.status === "Beta" ? COLORS.warning
                          : COLORS.danger,
                        border: `1px solid ${
                          update.status === "Stable" ? `${COLORS.success}30`
                          : update.status === "Live" ? `${COLORS.primary}30`
                          : update.status === "Beta" ? `${COLORS.warning}30`
                          : `${COLORS.danger}30`
                        }`,
                      }}
                    >
                      {update.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer
        className="mt-24 relative z-10"
        style={{ borderTop: `1px solid ${COLORS.border}`, backgroundColor: COLORS.white }}
      >
        <div className="w-full px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 max-w-[1400px] mx-auto">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.primary }}
              >
                <Box className="w-4 h-4" style={{ color: COLORS.white }} />
              </div>
              <span className="font-bold text-xl" style={{ color: COLORS.textPrimary }}>
                Inventory<span style={{ color: COLORS.primary }}>Pro</span>
              </span>
            </div>
            <p className="text-sm max-w-sm leading-relaxed mb-6" style={{ color: COLORS.textSecondary }}>
              The next generation of inventory management. Built for scale, security, and speed — trusted by enterprise
              logistics teams worldwide.
            </p>
            <div className="flex gap-3">
              {[Globe, Zap].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                  style={{ border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.background }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.primaryLight;
                    e.currentTarget.style.borderColor = COLORS.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.background;
                    e.currentTarget.style.borderColor = COLORS.border;
                  }}
                >
                  <Icon size={15} style={{ color: COLORS.textMuted }} />
                </button>
              ))}
            </div>
          </div>

          {[
            {
              title: "Product",
              links: ["Features", "Mobile App", "Integrations", "API Documentation"],
            },
            {
              title: "Legal & Security",
              links: ["Privacy Policy", "Terms of Service", "Security Whitepaper", "GDPR Compliance"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-bold mb-5 text-sm" style={{ color: COLORS.textPrimary }}>{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm transition-colors"
                      style={{ color: COLORS.textMuted }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.textMuted)}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="px-6 lg:px-12 py-5 text-center text-sm"
          style={{ borderTop: `1px solid ${COLORS.border}`, color: COLORS.textMuted }}
        >
          © 2025 Inventory Systems. All rights reserved. System Status:{" "}
          <span className="font-semibold" style={{ color: COLORS.success }}>Operational</span>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
          .inv-tour-popover.driver-popover {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 24px 64px rgba(14,74,123,0.18), 0 4px 16px rgba(0,0,0,0.08);
    padding: 0;
    overflow: hidden;
    font-family: inherit;
    max-width: 340px;
    min-width: 300px;
    animation: inv-tour-in 0.25s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes inv-tour-in {
    from { opacity: 0; transform: scale(0.92) translateY(6px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);   }
  }
  .inv-tour-popover.driver-popover::before {
    content: "";
    display: block;
    height: 3px;
    background: linear-gradient(90deg, #1a6fbf, #2196f3);
  }
  .inv-tour-popover .driver-popover-title {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    padding: 18px 20px 4px;
    margin: 0;
  }
  .inv-tour-popover .driver-popover-description {
    font-size: 13px;
    color: #475569;
    line-height: 1.6;
    padding: 0 20px 16px;
    margin: 0;
  }
  .inv-tour-popover .driver-popover-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px 16px;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    gap: 8px;
  }
  .inv-tour-popover .driver-popover-progress-text {
    font-size: 11px;
    font-weight: 600;
    color: #94a3b8;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    flex: 1;
  }
  .inv-tour-popover .driver-popover-footer button {
    border: none;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    padding: 7px 14px;
    transition: all 0.15s ease;
  }
  .inv-tour-popover .driver-popover-close-btn {
    position: absolute;
    top: 12px; right: 14px;
    width: 26px; height: 26px;
    border-radius: 6px !important;
    padding: 0 !important;
    font-size: 14px !important;
    background: #f1f5f9 !important;
    color: #64748b !important;
  }
  .inv-tour-popover .driver-popover-close-btn:hover {
    background: #e2e8f0 !important;
    color: #1e293b !important;
  }
  .inv-tour-popover .driver-popover-prev-btn {
    background: #f1f5f9;
    color: #475569;
  }
  .inv-tour-popover .driver-popover-prev-btn:hover:not(:disabled) {
    background: #e2e8f0;
    color: #0f172a;
  }
  .inv-tour-popover .driver-popover-prev-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  .inv-tour-popover .driver-popover-next-btn {
    background: #1a6fbf;
    color: #ffffff;
    box-shadow: 0 4px 10px rgba(26,111,191,0.35);
  }
  .inv-tour-popover .driver-popover-next-btn:hover {
    background: #155fa0;
    transform: translateY(-1px);
  }
  .driver-active-element {
    border-radius: 10px !important;
    box-shadow: 0 0 0 3px #1a6fbf, 0 0 0 6px rgba(26,111,191,0.22) !important;
    transition: box-shadow 0.3s ease !important;
  }
      `}</style>
    </div>
  );
};

export default LandingPage;