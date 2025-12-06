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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Expanded Updates for Landing Page
const UPDATES = [
  {
    id: 1,
    version: "v2.5.1",
    date: "Dec 01, 2025",
    title: "Android 16KB Page Alignment",
    status: "Stable",
    module: "Core Kernel",
  },
  {
    id: 2,
    version: "v2.5.0",
    date: "Nov 28, 2025",
    title: "React 19.2 Core Integration",
    status: "Live",
    module: "Frontend",
  },
  {
    id: 3,
    version: "v2.4.9",
    date: "Nov 20, 2025",
    title: "AI Predictive Stock Analysis",
    status: "Beta",
    module: "Analytics",
  },
  {
    id: 4,
    version: "v2.4.8",
    date: "Nov 15, 2025",
    title: "Cross-Platform Sync Optimization",
    status: "Stable",
    module: "Sync Engine",
  },
  {
    id: 5,
    version: "v2.4.7",
    date: "Nov 10, 2025",
    title: "Legacy DB Migration Tool",
    status: "Deprecated",
    module: "Database",
  },
  {
    id: 6,
    version: "v2.4.6",
    date: "Nov 05, 2025",
    title: "Warehouse Heatmap Visualization",
    status: "Live",
    module: "UI/UX",
  },
];

const LANDING_METRICS = [
  {
    label: "System Uptime",
    value: "99.999%",
    trend: "+0.001%",
    color: "text-green-400",
  },
  {
    label: "Active Nodes",
    value: "12,842",
    trend: "+342",
    color: "text-blue-400",
  },
  {
    label: "Sync Latency",
    value: "8ms",
    trend: "-4ms",
    color: "text-purple-400",
  },
  {
    label: "Transactions",
    value: "4.2M",
    trend: "/day",
    color: "text-cyan-400",
  },
];

// FIX: Use the interface in the component definition
const LandingPage = () => {
  const { login } = useAuth();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const loginRef = useRef<HTMLDivElement>(null);

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
      if (
        loginRef.current &&
        !loginRef.current.contains(event.target as Node)
      ) {
        setIsLoginOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (email === "admin@example.com" && password === "12345") {
        setIsLoading(false);
        login();
      } else {
        setIsLoading(false);
        setError("Invalid credentials. Please enter correct credentials");
        alert(
          "This is for Testing Purpose please try\nUserName :- admin@example.com\nPassword :- 12345"
        );
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-indigo-500 opacity-10 blur-[120px]"></div>
        <div className="absolute right-0 bottom-0 -z-10 m-auto h-[400px] w-[400px] rounded-full bg-cyan-500 opacity-5 blur-[100px]"></div>
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-slate-950/80 backdrop-blur-md border-slate-800 py-3"
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="w-full px-6 lg:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              <Box className="text-white w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                INFO<span className="text-indigo-500">ERA</span>
              </h1>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase">
                Enterprise V2.5
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-sm font-medium text-slate-400">
            <a href="#platform" className="hover:text-white transition-colors">
              Platform
            </a>
            <a href="#analytics" className="hover:text-white transition-colors">
              Intelligence
            </a>
            <a href="#updates" className="hover:text-white transition-colors">
              Changelog
            </a>
            <a
              href="#enterprise"
              className="hover:text-white transition-colors"
            >
              Enterprise
            </a>
          </div>

          <div
            className="hidden lg:flex items-center gap-4 relative"
            ref={loginRef}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Systems Operational
            </div>

            <button
              onClick={() => setIsLoginOpen(!isLoginOpen)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-300 border font-semibold ${
                isLoginOpen
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                  : "bg-slate-900 border-slate-700 hover:border-indigo-500 text-slate-200"
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Secure Access</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isLoginOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Logic */}
            <div
              className={`absolute top-full right-0 mt-4 w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl transition-all duration-300 origin-top-right overflow-hidden z-[60] ${
                isLoginOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
              }`}
            >
              <div className="p-5 border-b border-slate-800 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  Authenticate
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter admin credentials to access the Info-Era.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="p-6 space-y-5">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Workspace ID
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="admin@gmail.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Access Key
                    </label>
                  </div>
                  <div className="relative group">
                    <Key className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                  <span className="text-xs text-indigo-200">
                    End-to-end encrypted channel
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-500/20 transform transition-all active:scale-[0.98] flex justify-center items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  {isLoading ? "Verifying..." : "Initialize Session"}
                </button>
              </form>
            </div>
          </div>

          <button
            className="lg:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 w-full px-6 lg:px-12 z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-[1920px] mx-auto">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-mono text-cyan-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              CORE v2.5 ACTIVE
            </div>

            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] tracking-tight">
              Inventory <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                Intelligence
              </span>{" "}
              <br />
              Redefined.
            </h1>

            <p className="text-lg lg:text-xl text-slate-400 max-w-2xl leading-relaxed">
              Orchestrate your global supply chain with military-grade
              precision. Real-time synchronization across mobile and web
              interfaces powered by a hybrid distributed core.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  document.documentElement.scrollTop = 0;
                  setIsLoginOpen(true);
                }}
                className="px-8 py-4 bg-white text-slate-950 rounded-lg font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                Launch Console
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-8 py-4 bg-transparent border border-slate-700 text-white rounded-lg font-bold hover:border-slate-500 transition-colors">
                Read Architecture Docs
              </button>
            </div>

            {/* Expanded Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-800">
              {LANDING_METRICS.map((metric, idx) => (
                <div key={idx} className="border-l border-slate-800 pl-4">
                  <p className="text-3xl font-mono font-bold text-white">
                    {metric.value}
                  </p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">
                    {metric.label}
                  </p>
                  <p className={`text-xs mt-1 ${metric.color} font-mono`}>
                    {metric.trend}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Visual */}
          <div className="relative hidden lg:block h-full">
            <div className="relative z-10 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 backdrop-blur-sm w-full max-w-2xl ml-auto">
              <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                  <div className="h-6 w-px bg-slate-800"></div>
                  <div className="text-xs text-slate-400 font-mono">
                    dashboard_main.tsx
                  </div>
                </div>
                <div className="flex gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <BarChart3 className="w-4 h-4 text-slate-600" />
                </div>
              </div>

              {/* Fake Chart Content */}
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-1 h-48 bg-slate-800/50 rounded border border-slate-700/50 relative overflow-hidden group">
                    {/* Bars */}
                    <div className="absolute inset-0 flex items-end justify-between px-4 pb-0 opacity-80">
                      {[40, 70, 45, 90, 65, 85, 40, 60, 75, 50].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h}%` }}
                          className="w-[8%] bg-indigo-500/40 rounded-t transition-all duration-500 group-hover:bg-indigo-400/60"
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="w-1/3 space-y-3">
                    <div className="h-10 bg-slate-800/50 rounded w-full animate-pulse"></div>
                    <div className="h-10 bg-slate-800/50 rounded w-3/4 animate-pulse"></div>
                    <div className="h-10 bg-slate-800/50 rounded w-full animate-pulse"></div>
                    <div className="h-10 bg-slate-800/50 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/30 rounded border border-slate-700/30">
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                      INBOUND VELOCITY
                    </div>
                    <div className="text-2xl text-white font-mono">1,204</div>
                    <div className="w-full bg-slate-700 h-1 mt-3 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 w-[70%] h-full"></div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded border border-slate-700/30">
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                      OUTBOUND LOAD
                    </div>
                    <div className="text-2xl text-white font-mono">892</div>
                    <div className="w-full bg-slate-700 h-1 mt-3 rounded-full overflow-hidden">
                      <div className="bg-blue-500 w-[45%] h-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute left-10 top-32 bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-xl hidden xl:block animate-[float_4s_ease-in-out_infinite]">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-500/10 rounded text-green-400">
                  <Database size={16} />
                </div>
                <span className="text-sm font-bold text-white">
                  Sync Complete
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Database shards optimized.
              </div>
            </div>

            <div className="absolute right-0 bottom-32 bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-xl hidden xl:block animate-[float_5s_ease-in-out_infinite_1s]">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/10 rounded text-purple-400">
                  <Cpu size={16} />
                </div>
                <span className="text-sm font-bold text-white">
                  AI Analysis
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Predictive model active.
              </div>
            </div>
          </div>
        </div>

        {/* Company Ticker - New Filler Content */}
        <div className="mt-24 border-y border-slate-800/50 py-8 bg-slate-900/20">
          <div className="max-w-[1920px] mx-auto text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
              Powering Logistics For
            </p>
            <div className="flex flex-wrap justify-center gap-12 lg:gap-20 opacity-50 grayscale mix-blend-screen">
              {/* Simple text logos for demo */}
              <span className="text-xl font-bold font-serif text-white">
                ACME Corp
              </span>
              <span className="text-xl font-bold font-mono text-white">
                Globex
              </span>
              <span className="text-xl font-bold font-sans text-white">
                Soylent
              </span>
              <span className="text-xl font-bold font-serif text-white">
                Initech
              </span>
              <span className="text-xl font-bold font-mono text-white">
                Umbrella
              </span>
              <span className="text-xl font-bold font-sans text-white">
                Cyberdyne
              </span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div id="platform" className="mt-32 max-w-[1920px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Architecture & Capabilities
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Engineered for high-throughput inventory environments. Combining
              the speed of edge computing with the reliability of cloud
              infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-2 bg-slate-900/50 border border-slate-800 p-10 rounded-3xl hover:border-indigo-500/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                <Globe size={200} />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-8">
                  <Layers className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Unified Hybrid Core
                </h3>
                <p className="text-slate-400 mb-8 max-w-lg text-lg leading-relaxed">
                  Seamlessly transition between our React-based command
                  dashboard and the Flutter mobile field application. State
                  persists instantly across devices using WebSockets and
                  conflict-free replicated data types (CRDTs).
                </p>
                <div className="flex gap-3">
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-mono rounded border border-blue-500/20">
                    React 19.2
                  </span>
                  <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-mono rounded border border-cyan-500/20">
                    Flutter 3.38
                  </span>
                  <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-mono rounded border border-purple-500/20">
                    Go 1.22
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-3xl hover:border-indigo-500/50 transition-all">
              <div className="w-14 h-14 bg-pink-500/20 rounded-xl flex items-center justify-center text-pink-400 mb-8">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Event-Driven
              </h3>
              <p className="text-slate-400 text-base leading-relaxed">
                Architecture ensures that when stock leaves the warehouse, your
                dashboard reflects it in milliseconds via gRPC streams.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-3xl hover:border-indigo-500/50 transition-all">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-8">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Offline First
              </h3>
              <p className="text-slate-400 text-base leading-relaxed">
                Native Android & iOS support with offline-first SQLite sync.
                Scan barcodes, audit stock, and sign off deliveries without
                signal.
              </p>
            </div>

            <div className="col-span-1 md:col-span-2 bg-slate-900/50 border border-slate-800 p-10 rounded-3xl hover:border-indigo-500/50 transition-all flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Zero-Trust Security
                </h3>
                <p className="text-slate-400 text-base max-w-lg leading-relaxed mb-6">
                  End-to-end encryption for all transaction data. Role-based
                  access control (RBAC) granular to the field level with
                  biometrics.
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500" /> SOC2
                    TYPE II
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500" /> GDPR
                    READY
                  </span>
                </div>
              </div>
              <div className="hidden md:block">
                <ShieldCheck className="w-32 h-32 text-slate-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Updates Feed - Expanded */}
        <div
          id="updates"
          className="mt-32 border-t border-slate-800 pt-16 max-w-[1920px] mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-2xl font-bold text-white">
                System Changelog
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Live feed from the CI/CD pipeline.
              </p>
            </div>
            <button className="mt-4 md:mt-0 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm text-slate-300 transition-colors">
              View All Commits
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 bg-slate-950/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-2">Version</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Module</div>
              <div className="col-span-4">Feature / Fix</div>
              <div className="col-span-2 text-right">Status</div>
            </div>
            <div className="divide-y divide-slate-800">
              {UPDATES.map((update) => (
                <div
                  key={update.id}
                  className="grid grid-cols-12 gap-4 p-4 hover:bg-slate-800/50 transition-colors items-center group"
                >
                  <div className="col-span-2 font-mono text-indigo-400 text-sm font-bold">
                    {update.version}
                  </div>
                  <div className="col-span-2 text-slate-400 text-sm">
                    {update.date}
                  </div>
                  <div className="col-span-2 text-slate-400 text-sm font-mono bg-slate-800/50 rounded px-2 py-1 w-fit">
                    {update.module}
                  </div>
                  <div className="col-span-4 text-slate-200 font-medium group-hover:text-white transition-colors">
                    {update.title}
                  </div>
                  <div className="col-span-2 text-right">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                        update.status === "Stable"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : update.status === "Live"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : update.status === "Beta"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
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

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-16 relative z-10">
        <div className="w-full px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 max-w-[1920px] mx-auto">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Box className="text-indigo-500 w-8 h-8" />
              <span className="font-bold text-white text-2xl">
                Info<span className="text-indigo-500">Era</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-6">
              The next generation of inventory management systems. Built for
              scale, security, and speed. Trusted by Fortune 500 logistics
              companies worldwide.
            </p>
            <div className="flex gap-4 text-slate-400">
              {/* Social placeholders */}
              <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">
                <Globe size={16} />
              </div>
              <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Mobile App
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Legal & Security</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Security Whitepaper
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  GDPR Compliance
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full px-6 lg:px-12 mt-16 pt-8 border-t border-slate-900 text-center text-slate-600 text-sm">
          &copy; 2025 Info-Era Inventory Systems. All rights reserved. System
          Status: <span className="text-emerald-500">Operational</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
