import React, { useState } from "react";
import {
  Shield,
  Dna,
  Cpu,
  ChevronDown,
  User,
  Activity,
  FileSpreadsheet,
  ScanLine,
  Menu,
  X,
  Database,
  Sliders,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

interface NavbarProps {
  activeTab: "overview" | "scanner" | "analytics" | "records";
  onSelectTab: (tab: "overview" | "scanner" | "analytics" | "records") => void;
  savedRecordsCount: number;
  aiOnline: boolean;
  onOpenCodePortal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  savedRecordsCount,
  aiOnline,
  onOpenCodePortal,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "overview" as const, label: "Overview", icon: Activity },
    { id: "scanner" as const, label: "Dual Scanner", icon: ScanLine, highlight: true },
    { id: "analytics" as const, label: "Lab Analytics", icon: FileSpreadsheet },
    { id: "records" as const, label: "Patient Records", icon: Database, badge: savedRecordsCount },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0B1120]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => onSelectTab("overview")}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/40 text-teal-400 group-hover:border-teal-400 group-hover:shadow-[0_0_15px_rgba(13,148,136,0.4)] transition-all">
              <Shield className="w-6 h-6 text-teal-400" />
              <Dna className="w-3.5 h-3.5 text-cyan-300 absolute" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-bold tracking-tight text-white font-mono">
                  PHARMA<span className="text-teal-400">RESIST</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">
                  PRO
                </span>
              </div>
              <span className="text-[10px] tracking-wider text-slate-400 font-medium">
                Antimicrobial Surveillance Suite
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-white bg-slate-800/90 border border-teal-500/40 shadow-[0_0_12px_rgba(13,148,136,0.2)]"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-teal-400" : "text-slate-400 group-hover:text-slate-300"
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1.5 text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-slate-700 text-cyan-300 border border-slate-600">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Area: Status Badge & User Profile */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Quick Access Code Lookup Button */}
            {onOpenCodePortal && (
              <button
                type="button"
                id="navbar-code-lookup-btn"
                onClick={onOpenCodePortal}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-mono font-medium transition-all shadow-[0_0_10px_rgba(13,148,136,0.15)]"
                title="Enter Unique Verification Code to load official report"
              >
                <KeyRound className="w-3.5 h-3.5 text-teal-400" />
                <span>Verify Code</span>
              </button>
            )}

            {/* AI Engine Status Badge */}
            <div
              id="ai-engine-status-badge"
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-teal-950/50 border border-teal-500/30 text-xs text-teal-300 shadow-[0_0_12px_rgba(13,148,136,0.15)]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <Cpu className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-medium tracking-wide">
                {aiOnline ? "AI Engine Online" : "Clinical Engine Ready"}
              </span>
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                id="user-profile-button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2.5 p-1.5 pl-2 rounded-xl bg-slate-800/70 border border-slate-700 hover:border-slate-600 transition-colors"
                aria-expanded={profileOpen}
              >
                <div className="w-7 h-7 rounded-lg bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-300 font-semibold text-xs font-mono">
                  EV
                </div>
                <div className="text-left hidden lg:block pr-1">
                  <div className="text-xs font-semibold text-slate-200 leading-tight">
                    Dr. Elena Vance, MD
                  </div>
                  <div className="text-[10px] text-slate-400">Chief Microbiologist</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileOpen && (
                <div
                  id="profile-dropdown-menu"
                  className="absolute right-0 mt-2 w-64 rounded-xl glass-panel border border-slate-700/80 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-2 border-b border-slate-700/60 mb-1">
                    <p className="text-xs font-semibold text-white">Elena Vance, MD, FACP</p>
                    <p className="text-[11px] text-slate-400">Hospital Antimicrobial Stewardship</p>
                    <div className="mt-1 flex items-center space-x-1 text-[10px] text-teal-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Certified EUCAST/CLSI Verifier</span>
                    </div>
                  </div>
                  <div className="space-y-0.5 text-xs text-slate-300">
                    <button
                      onClick={() => {
                        onSelectTab("scanner");
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-700/60 transition-colors text-left"
                    >
                      <ScanLine className="w-3.5 h-3.5 text-teal-400" />
                      <span>New Comparative Scan</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectTab("records");
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-700/60 transition-colors text-left"
                    >
                      <Database className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Saved Records Archive</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectTab("analytics");
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-700/60 transition-colors text-left"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Antibiogram Reports</span>
                    </button>
                  </div>
                  <div className="pt-2 mt-1 border-t border-slate-700/60 text-[11px] text-slate-500 px-3 py-1 flex justify-between items-center">
                    <span>Build 2.8.4-PRO</span>
                    <span className="text-teal-400/80">Active Session</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-teal-950/60 border border-teal-500/30 text-[10px] text-teal-300">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping mr-1" />
              <span>AI Online</span>
            </div>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0F172A] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-slate-800 text-white border border-teal-500/40"
                    : "text-slate-300 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-teal-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-cyan-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {onOpenCodePortal && (
            <button
              onClick={() => {
                onOpenCodePortal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-teal-300 bg-teal-950/40 border border-teal-500/40 mt-2"
            >
              <KeyRound className="w-4 h-4 text-teal-400" />
              <span>Verify by Report Code</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
