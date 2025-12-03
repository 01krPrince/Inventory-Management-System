import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";

const UPDATES = [
  {
    id: 1,
    version: "v2.5.1",
    date: "Dec 01, 2025",
    title: "Android 16KB Page Alignment",
    status: "Stable",
  },
  {
    id: 2,
    version: "v2.5.0",
    date: "Nov 28, 2025",
    title: "React 19.2 Core Integration",
    status: "Live",
  },
  {
    id: 3,
    version: "v2.4.9",
    date: "Nov 20, 2025",
    title: "AI Predictive Stock Analysis",
    status: "Beta",
  },
  {
    id: 4,
    version: "v2.4.8",
    date: "Nov 15, 2025",
    title: "Cross-Platform Sync Optimization",
    status: "Stable",
  },
];

const METRICS = [
  {
    label: "System Uptime",
    value: "99.99%",
    trend: "+0.01%",
    color: "text-green-400",
  },
  {
    label: "Active Nodes",
    value: "8,432",
    trend: "+124",
    color: "text-blue-400",
  },
  {
    label: "Sync Latency",
    value: "12ms",
    trend: "-2ms",
    color: "text-purple-400",
  },
];

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close login on click outside
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Background Mesh Grid Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>
        <div className="absolute right-0 bottom-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-cyan-500 opacity-10 blur-[100px]"></div>
      </div>

      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-slate-950/80 backdrop-blur-md border-slate-800 py-3"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo Area */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              <Box className="text-white w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                NEXUS<span className="text-indigo-500">INVENTORY</span>
              </h1>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase">
                Enterprise V2.5
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">
              Platform
            </a>
            <a href="#analytics" className="hover:text-white transition-colors">
              Analytics
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

          {/* Login Action Area */}
          <div
            className="hidden md:flex items-center gap-4 relative"
            ref={loginRef}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Systems Operational
            </div>

            {/* Login Button */}
            <button
              onClick={() => setIsLoginOpen(!isLoginOpen)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-300 border font-semibold ${
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

            {/* Complex Login Dropdown */}
            <div
              className={`absolute top-full right-0 mt-4 w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl transition-all duration-300 origin-top-right overflow-hidden ${
                isLoginOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
              }`}
            >
              {/* Dropdown Header */}
              <div className="p-5 border-b border-slate-800 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  Authenticate
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your encrypted credentials to access the dashboard.
                </p>
              </div>

              {/* Login Form */}
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Workspace ID / Email
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="email"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="user@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Password Key
                    </label>
                    <a
                      href="#"
                      className="text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      Recover Key?
                    </a>
                  </div>
                  <div className="relative group">
                    <Key className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="password"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>

                {/* 2FA Visual */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                  <span className="text-xs text-indigo-200">
                    256-bit SSL connection secure
                  </span>
                </div>

                <button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-500/20 transform transition-all active:scale-[0.98] flex justify-center items-center gap-2">
                  <span>Initialize Session</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                <span>v2.5.1 Build 8942</span>
                <span>SSO Available</span>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto z-10">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-mono text-cyan-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              NEXUS CORE ACTIVE
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1]">
              Inventory <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                Intelligence
              </span>{" "}
              <br />
              Redefined.
            </h1>

            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Orchestrate your entire supply chain with military-grade
              precision. Real-time synchronization across mobile and web
              interfaces powered by a React-Flutter hybrid core.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-white text-slate-950 rounded-lg font-bold hover:bg-slate-200 transition-colors flex items-center gap-2">
                Request Demo
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-8 py-4 bg-transparent border border-slate-700 text-white rounded-lg font-bold hover:border-slate-500 transition-colors">
                View Documentation
              </button>
            </div>

            {/* Metrics Ticker */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800">
              {METRICS.map((metric, idx) => (
                <div key={idx}>
                  <p className="text-2xl font-mono font-bold text-white">
                    {metric.value}
                  </p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">
                    {metric.label}
                  </p>
                  <p className={`text-xs mt-1 ${metric.color}`}>
                    {metric.trend}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Complex Visual Representation */}
          <div className="relative">
            {/* Abstract UI representation */}
            <div className="relative z-10 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 backdrop-blur-sm">
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
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 h-32 bg-slate-800/50 rounded border border-slate-700/50 relative overflow-hidden group">
                    <div className="absolute inset-0 flex items-end justify-between px-2 pb-2 opacity-50">
                      {[40, 70, 45, 90, 65, 85, 40].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h}%` }}
                          className="w-1/12 bg-indigo-500/40 rounded-t transition-all duration-500 group-hover:bg-indigo-400/60"
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="w-1/3 space-y-2">
                    <div className="h-8 bg-slate-800/50 rounded w-full"></div>
                    <div className="h-8 bg-slate-800/50 rounded w-3/4"></div>
                    <div className="h-8 bg-slate-800/50 rounded w-full"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/30 rounded border border-slate-700/30">
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                      INBOUND
                    </div>
                    <div className="text-xl text-white font-mono">1,204</div>
                    <div className="w-full bg-slate-700 h-1 mt-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 w-[70%] h-full"></div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded border border-slate-700/30">
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                      OUTBOUND
                    </div>
                    <div className="text-xl text-white font-mono">892</div>
                    <div className="w-full bg-slate-700 h-1 mt-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 w-[45%] h-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decor elements */}
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl -z-10"></div>
            </div>

            {/* Floating Card 1 */}
            <div className="absolute -left-12 top-20 bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-xl max-w-[200px] hidden lg:block animate-[float_4s_ease-in-out_infinite]">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-500/10 rounded text-green-400">
                  <Database size={16} />
                </div>
                <span className="text-sm font-bold">Sync Complete</span>
              </div>
              <div className="text-xs text-slate-400">
                Database shards optimized. Latency reduced by 14%.
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="absolute -right-8 bottom-20 bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-xl max-w-[200px] hidden lg:block animate-[float_5s_ease-in-out_infinite_1s]">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/10 rounded text-purple-400">
                  <Cpu size={16} />
                </div>
                <span className="text-sm font-bold">AI Analysis</span>
              </div>
              <div className="text-xs text-slate-400">
                Predictive stock depletion algorithm active.
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Features */}
        <div id="features" className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Architecture & Capabilities
            </h2>
            <p className="text-slate-400">
              Engineered for high-throughput inventory environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Globe size={120} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 mb-6">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Cross-Platform Unified Core
                </h3>
                <p className="text-slate-400 mb-6 max-w-md">
                  Seamlessly transition between our React-based command
                  dashboard and the Flutter mobile field application. State
                  persists instantly across devices using WebSockets.
                </p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20">
                    React 19.2
                  </span>
                  <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded border border-cyan-500/20">
                    Flutter 3.38
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/50 transition-all">
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center text-pink-400 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Real-Time Events
              </h3>
              <p className="text-slate-400 text-sm">
                Event-driven architecture ensures that when stock leaves the
                warehouse, your dashboard reflects it in milliseconds.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/50 transition-all">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Field Operations
              </h3>
              <p className="text-slate-400 text-sm">
                Native Android & iOS support with offline-first capabilities.
                Scan barcodes, audit stock, and sign off deliveries without
                signal.
              </p>
            </div>

            <div className="col-span-1 md:col-span-2 bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/50 transition-all flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Security First Protocol
                </h3>
                <p className="text-slate-400 text-sm max-w-md">
                  End-to-end encryption for all transaction data. Role-based
                  access control (RBAC) granular to the field level.
                </p>
              </div>
              <div className="hidden md:block">
                <ShieldCheck className="w-24 h-24 text-slate-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Live Updates Feed */}
        <div id="updates" className="mt-32 border-t border-slate-800 pt-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-2xl font-bold text-white">
                System Changelog
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Live feed from the development pipeline.
              </p>
            </div>
            <button className="mt-4 md:mt-0 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm text-slate-300 transition-colors">
              View All Commits
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 bg-slate-950/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-2">Version</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-6">Module / Feature</div>
              <div className="col-span-2 text-right">Status</div>
            </div>
            <div className="divide-y divide-slate-800">
              {UPDATES.map((update) => (
                <div
                  key={update.id}
                  className="grid grid-cols-12 gap-4 p-4 hover:bg-slate-800/50 transition-colors items-center group"
                >
                  <div className="col-span-2 font-mono text-indigo-400 text-sm">
                    {update.version}
                  </div>
                  <div className="col-span-2 text-slate-400 text-sm">
                    {update.date}
                  </div>
                  <div className="col-span-6 text-slate-200 font-medium group-hover:text-white transition-colors">
                    {update.title}
                  </div>
                  <div className="col-span-2 text-right">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                        update.status === "Stable"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : update.status === "Live"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
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
      <footer className="border-t border-slate-800 bg-slate-950 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Box className="text-indigo-500 w-6 h-6" />
              <span className="font-bold text-white text-lg">
                NEXUS INVENTORY
              </span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm">
              The next generation of inventory management systems. Built for
              scale, security, and speed.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <a href="#" className="hover:text-indigo-400">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400">
                  Mobile App
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <a href="#" className="hover:text-indigo-400">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400">
                  SLA
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-900 text-center text-slate-600 text-sm">
          &copy; 2025 Nexus Inventory Systems. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
