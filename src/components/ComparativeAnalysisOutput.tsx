import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Cpu,
  Copy,
  Check,
  Dna,
  Filter,
  Search,
  Pill,
  ArrowRight,
  Info,
  Sparkles,
  Volume2,
  VolumeX,
  KeyRound,
  ExternalLink,
  Droplets,
  HeartPulse,
  Activity,
  Shield,
  BookOpen,
  HelpCircle,
  UserCheck,
  Stethoscope,
} from "lucide-react";
import {
  AnalysisOutput,
  ComparativeDrugRow,
  PatientData,
  RiskLevel,
} from "../types";
import {
  STANDARD_MODE_OF_ACTION_CATALOG,
  STANDARD_RISK_REDUCTION_GUIDE,
} from "../data/mockData";

interface ComparativeAnalysisOutputProps {
  analysis: AnalysisOutput;
  rows: ComparativeDrugRow[];
  patient1: PatientData;
  patient2: PatientData;
  onOpenCodePortal?: (code: string) => void;
}

export const ComparativeAnalysisOutput: React.FC<ComparativeAnalysisOutputProps> = ({
  analysis,
  rows,
  patient1,
  patient2,
  onOpenCodePortal,
}) => {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeMoaCategory, setActiveMoaCategory] = useState<string>("all");

  const uniqueCode = analysis.uniqueAccessCode || "PRP-9021-8842-8801";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(uniqueCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Copy AI Insights to clipboard
  const handleCopyInsights = () => {
    const textToCopy = `[Pharma Resist Pro - Comparative Antimicrobial Resistance Report]
Analyzed: ${patient1.name} (${patient1.id}) vs ${patient2.name} (${patient2.id})
Risk Level: ${analysis.riskLevel} (${analysis.riskScore}/100)
Compatibility Match: ${analysis.compatibilityPercentage}%

CRITICAL RESISTANCE OVERLAPS:
${analysis.criticalOverlaps.map((o) => `• ${o}`).join("\n")}

MUTATED STRAIN FLAGS:
${analysis.mutatedStrainFlags.map((m) => `• ${m}`).join("\n")}

SUGGESTED CLINICAL ALTERNATIVES:
${analysis.suggestedAlternatives.map((s) => `• ${s}`).join("\n")}

CLINICAL SUMMARY:
${analysis.clinicalSummary}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Browser Speech Synthesis for clinical accessibility
  const handleToggleSpeech = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(analysis.clinicalSummary);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Filter rows based on tab & search
  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      row.drug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.drugClass.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === "shared") {
      return row.crossCompatibility === "Shared Resistance";
    }
    if (filterType === "sensitive") {
      return row.crossCompatibility === "Sensitive to Both";
    }
    if (filterType === "divergent") {
      return row.crossCompatibility === "Divergent";
    }
    return true;
  });

  // Calculate Gauge stroke dasharray (circumference = 2 * PI * r)
  // r = 68 -> circumference ~ 427.25
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (analysis.compatibilityPercentage / 100) * circumference;

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case "Critical Risk":
      case "High Risk":
        return {
          bg: "bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]",
          icon: ShieldAlert,
          color: "text-rose-400",
          gaugeStroke: "#F43F5E",
        };
      case "Moderate Risk":
        return {
          bg: "bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]",
          icon: AlertTriangle,
          color: "text-amber-400",
          gaugeStroke: "#F59E0B",
        };
      case "Low Risk":
      default:
        return {
          bg: "bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
          icon: ShieldCheck,
          color: "text-emerald-400",
          gaugeStroke: "#10B981",
        };
    }
  };

  const riskBadge = getRiskBadge(analysis.riskLevel);
  const RiskIcon = riskBadge.icon;

  const sharedCount = rows.filter((r) => r.crossCompatibility === "Shared Resistance").length;
  const sensitiveCount = rows.filter((r) => r.crossCompatibility === "Sensitive to Both").length;
  const divergentCount = rows.filter((r) => r.crossCompatibility === "Divergent").length;

  const riskReductionGuide = analysis.riskReductionGuide && analysis.riskReductionGuide.length > 0
    ? analysis.riskReductionGuide
    : STANDARD_RISK_REDUCTION_GUIDE;

  const modeOfActionList = analysis.modeOfActionList && analysis.modeOfActionList.length > 0
    ? analysis.modeOfActionList
    : STANDARD_MODE_OF_ACTION_CATALOG;

  return (
    <div
      id="comparative-analysis-output"
      className="mt-10 space-y-8 animate-in fade-in duration-300"
    >
      {/* 0. Unique Access Code & Official Verification Bar */}
      <div
        id="unique-access-code-banner"
        className="rounded-2xl p-5 border border-teal-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
                Official Report Verification Key
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Active Verification Code
              </span>
            </div>
            <div className="flex items-center space-x-2.5 mt-1">
              <span className="text-lg sm:text-2xl font-mono font-extrabold text-white tracking-wider">
                {uniqueCode}
              </span>
              <button
                type="button"
                id="copy-unique-code-btn"
                onClick={handleCopyCode}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700 transition-colors"
                title="Copy unique code"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-teal-400" />
                    <span className="text-teal-300">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Share this code with attending clinicians or the patient for dual-mode secure verification.
            </p>
          </div>
        </div>

        {/* Action Button: Open Verification Portal */}
        <div className="flex items-center space-x-3 shrink-0 self-stretch md:self-auto">
          {onOpenCodePortal && (
            <button
              type="button"
              id="open-verification-portal-btn"
              onClick={() => onOpenCodePortal(uniqueCode)}
              className="w-full md:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:brightness-110 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-slate-950" />
              <span>Open Doctor / Patient Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Compatibility & Risk Gauge Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radial Compatibility Gauge Card */}
        <div className="glass-panel-glow rounded-2xl p-6 border border-slate-700/80 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Resistance Profile Overlap</span>
          </div>

          {/* Circular SVG Gauge */}
          <div className="relative w-44 h-44 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                stroke="#1E293B"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Progress stroke */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                stroke={riskBadge.gaugeStroke}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Centered Gauge Value */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                {analysis.compatibilityPercentage}%
              </span>
              <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                Overlap Match
              </span>
            </div>
          </div>

          {/* Risk Badge with Glowing Effect */}
          <div className="mt-2 flex items-center space-x-2">
            <span
              id="risk-status-badge"
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold tracking-wide ${riskBadge.bg}`}
            >
              <RiskIcon className="w-4 h-4" />
              <span>{analysis.riskLevel}</span>
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-2.5 max-w-xs">
            Risk Severity Score:{" "}
            <span className="font-mono font-bold text-white">
              {analysis.riskScore}/100
            </span>{" "}
            (Based on concurrent Carbapenem &amp; Beta-lactam invalidation)
          </p>
        </div>

        {/* Breakdown Metric Summary Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 content-center">
          <div className="rounded-xl glass-panel p-5 border border-rose-500/30 bg-rose-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-rose-300">
                Shared Resistance
              </span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="mt-3 text-3xl font-bold font-mono text-white">
              {sharedCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Antibiotics resistant in both patient isolates. Avoid for cohort.
            </p>
          </div>

          <div className="rounded-xl glass-panel p-5 border border-cyan-500/30 bg-cyan-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-cyan-300">
                Both Sensitive
              </span>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-3 text-3xl font-bold font-mono text-white">
              {sensitiveCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Agents retaining sensitivity in both isolates. Ideal candidates.
            </p>
          </div>

          <div className="rounded-xl glass-panel p-5 border border-amber-500/30 bg-amber-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-300">
                Divergent Susceptibility
              </span>
              <Pill className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-3 text-3xl font-bold font-mono text-white">
              {divergentCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Differential efficacy. Requires tailored individualized dosing.
            </p>
          </div>

          {/* Cohort Comparison Bar */}
          <div className="sm:col-span-3 rounded-xl glass-panel p-4 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-teal-400 font-semibold">
                {patient1.name} ({patient1.pathogen})
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-mono text-cyan-400 font-semibold">
                {patient2.name} ({patient2.pathogen})
              </span>
            </div>
            <span className="text-slate-400 text-[11px]">
              Surveillance Standard: EUCAST Breakpoints v14.0 &amp; CLSI M100-Ed34
            </span>
          </div>
        </div>
      </div>

      {/* 2. Side-By-Side Comparison Table */}
      <div
        id="side-by-side-comparison-table-container"
        className="glass-panel rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl"
      >
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">
              Antimicrobial Susceptibility Comparison Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Side-by-side evaluation of Minimum Inhibitory Concentrations (MIC) and clinical interpretations
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search antibiotic or class..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700 rounded-lg p-1">
              <button
                onClick={() => setFilterType("all")}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  filterType === "all"
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All ({rows.length})
              </button>
              <button
                onClick={() => setFilterType("shared")}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  filterType === "shared"
                    ? "bg-rose-900/60 text-rose-300"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Shared Resistance ({sharedCount})
              </button>
              <button
                onClick={() => setFilterType("sensitive")}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  filterType === "sensitive"
                    ? "bg-cyan-900/60 text-cyan-300"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Both Sensitive ({sensitiveCount})
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Antibiotic / Drug Name</th>
                <th className="px-4 py-3">Drug Class</th>
                <th className="px-4 py-3">
                  <span className="text-teal-400 font-bold">{patient1.name}</span> (P1)
                </th>
                <th className="px-4 py-3">
                  <span className="text-cyan-400 font-bold">{patient2.name}</span> (P2)
                </th>
                <th className="px-4 py-3">Cross-Compatibility Flag</th>
                <th className="px-4 py-3">Clinical Stewardship Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredRows.map((row) => {
                const renderStatusBadge = (status: string, mic?: string) => {
                  let badgeStyle = "bg-slate-800 text-slate-300 border-slate-700";
                  if (status === "Resistant") {
                    badgeStyle = "bg-rose-950/80 text-rose-300 border-rose-800/60";
                  } else if (status === "Sensitive") {
                    badgeStyle = "bg-emerald-950/80 text-emerald-300 border-emerald-800/60";
                  } else if (status === "Intermediate") {
                    badgeStyle = "bg-amber-950/80 text-amber-300 border-amber-800/60";
                  }

                  return (
                    <div className="inline-flex items-center space-x-1.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badgeStyle}`}>
                        {status}
                      </span>
                      {mic && (
                        <span className="text-[10px] font-mono text-slate-400">
                          {mic}
                        </span>
                      )}
                    </div>
                  );
                };

                const renderCrossBadge = (cross: string) => {
                  if (cross === "Shared Resistance") {
                    return (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-rose-950/90 text-rose-300 border border-rose-600/60 font-semibold text-[10px]">
                        <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                        <span>Shared Resistance</span>
                      </span>
                    );
                  }
                  if (cross === "Sensitive to Both") {
                    return (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-600/60 font-semibold text-[10px]">
                        <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>Sensitive to Both</span>
                      </span>
                    );
                  }
                  if (cross === "Intermediate Overlap") {
                    return (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-950/90 text-amber-300 border border-amber-600/60 font-semibold text-[10px]">
                        <Info className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>Intermediate Shift</span>
                      </span>
                    );
                  }
                  return (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                      <span>Divergent</span>
                    </span>
                  );
                };

                return (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-white">
                      {row.drug}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {row.drugClass}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {renderStatusBadge(row.p1Status, row.p1Mic)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {renderStatusBadge(row.p2Status, row.p2Mic)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {renderCrossBadge(row.crossCompatibility)}
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-[11px] max-w-xs">
                      {row.clinicalNote}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. AI Insights Box */}
      <div
        id="ai-insights-box"
        className="glass-panel-glow rounded-2xl p-6 sm:p-7 border border-teal-500/40 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-[#0A1628]/95 shadow-2xl relative overflow-hidden"
      >
        {/* Glowing Watermark / Icon */}
        <div className="absolute top-4 right-6 opacity-10 pointer-events-none">
          <Dna className="w-40 h-40 text-teal-400" />
        </div>

        {/* Box Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  AI Clinical Stewardship Insights
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-500/40">
                  {analysis.source === "gemini-3.8-flash"
                    ? "Gemini 3.8-Flash Live"
                    : "CLSI / EUCAST AI Engine"}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated molecular mutational correlation and infectious disease salvage strategies
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={handleToggleSpeech}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Read AI Insights Aloud"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Audio Brief</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyInsights}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-teal-400" />
                  <span className="text-teal-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Structured Insights Content */}
        <div className="mt-5 space-y-5">
          {/* Critical Resistance Overlaps */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Critical Drug Resistance Overlaps</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {analysis.criticalOverlaps.map((overlap, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-rose-950/30 border border-rose-500/30 p-3 flex items-start space-x-2.5 text-xs text-rose-200"
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>{overlap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mutated Strain Flags */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              <Dna className="w-4 h-4" />
              <span>Mutated Strain &amp; Genotype Surveillance Flags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.mutatedStrainFlags.map((flag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-xs font-mono text-amber-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{flag}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Suggested Clinical Alternatives */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal-400 mb-2">
              <Pill className="w-4 h-4" />
              <span>Recommended Clinical Alternatives &amp; Salvage Regimens</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {analysis.suggestedAlternatives.map((alt, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-teal-950/30 border border-teal-500/30 p-3 flex items-start space-x-2.5 text-xs text-teal-200"
                >
                  <Check className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                  <span>{alt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Narrative Summary */}
          <div className="rounded-xl bg-slate-950/80 border border-slate-700/80 p-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <span className="font-bold text-white block mb-1">
              Microbiology Laboratory Assessment:
            </span>
            <p className="whitespace-pre-line">{analysis.clinicalSummary}</p>
          </div>
        </div>
      </div>

      {/* 4. Verified Patient Clinical Parameters Comparison Panel */}
      <div
        id="clinical-biomarkers-comparison-section"
        className="glass-panel rounded-2xl border border-slate-700/80 p-6 shadow-xl space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Verified Patient Clinical Biomarkers &amp; Vulnerability Assessment
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Host characteristics calibrated from verified medical records to evaluate nephrotoxicity risks, clearance kinetics, and immune defense.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-teal-300 border border-slate-700 self-start sm:self-auto">
            Host Risk Factors Active
          </span>
        </div>

        {/* Side-by-Side Biomarkers Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient 1 Biomarker Profile */}
          <div className="bg-slate-950/70 border border-teal-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-teal-400">
                PATIENT 1 &bull; {patient1.id}
              </span>
              <span className="text-xs text-white font-semibold">{patient1.name} ({patient1.age} y/o)</span>
            </div>

            {patient1.clinicalParams ? (
              <div className="space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Blood Group:</span>
                    <span className="text-sm font-bold text-white font-mono">{patient1.clinicalParams.bloodGroup}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Anemia Severity:</span>
                    <span className={`text-sm font-bold font-mono ${patient1.clinicalParams.anemia.hasAnemia ? "text-rose-400" : "text-emerald-400"}`}>
                      {patient1.clinicalParams.anemia.hemoglobin} g/dL
                    </span>
                    <span className="text-[10px] text-slate-400 block">{patient1.clinicalParams.anemia.severity}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Weight &amp; Height:</span>
                    <span className="text-xs text-white font-mono">
                      {patient1.clinicalParams.vitals.weightKg} kg &bull; {patient1.clinicalParams.vitals.heightCm} cm
                    </span>
                    <span className="text-[10px] text-cyan-300 block">BMI: {patient1.clinicalParams.vitals.bmi} kg/m²</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Renal Clearance:</span>
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      eGFR {patient1.clinicalParams.bloodReport.eGfr} mL/min
                    </span>
                    <span className="text-[10px] text-slate-400 block">Cr: {patient1.clinicalParams.bloodReport.serumCreatinine} mg/dL</span>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Prior Antibiotic Misuse History:</span>
                  <span className="text-xs text-slate-200">{patient1.clinicalParams.priorAntibioticMisuse || "None reported"}</span>
                </div>

                <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px]">
                  <span>Virulence: <strong className="text-purple-300">{patient1.clinicalParams.pathogenVirulenceIndex}</strong></span>
                  <span>Immunity: <strong className="text-teal-300">{patient1.clinicalParams.immunityCapacity}</strong></span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No clinical biomarkers recorded for Patient 1.</p>
            )}
          </div>

          {/* Patient 2 Biomarker Profile */}
          <div className="bg-slate-950/70 border border-cyan-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-cyan-400">
                PATIENT 2 &bull; {patient2.id}
              </span>
              <span className="text-xs text-white font-semibold">{patient2.name} ({patient2.age} y/o)</span>
            </div>

            {patient2.clinicalParams ? (
              <div className="space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Blood Group:</span>
                    <span className="text-sm font-bold text-white font-mono">{patient2.clinicalParams.bloodGroup}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Anemia Severity:</span>
                    <span className={`text-sm font-bold font-mono ${patient2.clinicalParams.anemia.hasAnemia ? "text-rose-400" : "text-emerald-400"}`}>
                      {patient2.clinicalParams.anemia.hemoglobin} g/dL
                    </span>
                    <span className="text-[10px] text-slate-400 block">{patient2.clinicalParams.anemia.severity}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Weight &amp; Height:</span>
                    <span className="text-xs text-white font-mono">
                      {patient2.clinicalParams.vitals.weightKg} kg &bull; {patient2.clinicalParams.vitals.heightCm} cm
                    </span>
                    <span className="text-[10px] text-cyan-300 block">BMI: {patient2.clinicalParams.vitals.bmi} kg/m²</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Renal Clearance:</span>
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      eGFR {patient2.clinicalParams.bloodReport.eGfr} mL/min
                    </span>
                    <span className="text-[10px] text-slate-400 block">Cr: {patient2.clinicalParams.bloodReport.serumCreatinine} mg/dL</span>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Prior Antibiotic Misuse History:</span>
                  <span className="text-xs text-slate-200">{patient2.clinicalParams.priorAntibioticMisuse || "None reported"}</span>
                </div>

                <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px]">
                  <span>Virulence: <strong className="text-purple-300">{patient2.clinicalParams.pathogenVirulenceIndex}</strong></span>
                  <span>Immunity: <strong className="text-teal-300">{patient2.clinicalParams.immunityCapacity}</strong></span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No clinical biomarkers recorded for Patient 2.</p>
            )}
          </div>
        </div>
      </div>

      {/* 5. How to Reduce Risk: Actionable Clinical Protocols */}
      <div
        id="how-to-reduce-risk-section"
        className="glass-panel rounded-2xl border border-amber-500/40 p-6 shadow-xl space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {analysis.riskLevel} Mitigation &bull; How to Reduce Risk
              </h3>
              <p className="text-xs text-slate-400">
                Actionable infection barrier steps, PK/PD renal adaptations, and antimicrobial stewardship de-escalations.
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-amber-950/80 text-amber-300 border border-amber-500/50 self-start sm:self-auto">
            {riskReductionGuide.length} Active Protocols
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {riskReductionGuide.map((item, idx) => {
            const isImmediate = item.priority === "Immediate";
            const isHigh = item.priority === "High";
            return (
              <div
                key={idx}
                className="bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4.5 space-y-2 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">
                    {item.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      isImmediate
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : isHigh
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.action}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Pharmacological Mode of Action (MoA) & Resistance Counter-Strategies */}
      <div
        id="mode-of-action-section"
        className="glass-panel rounded-2xl border border-slate-700/80 p-6 shadow-xl space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Pharmacological Mode of Action (MoA) &amp; Resistance Counter-Mechanisms
              </h3>
              <p className="text-xs text-slate-400">
                Detailed biochemical target organelles, enzymatic mutation pathways, and clinical salvage strategies.
              </p>
            </div>
          </div>

          {/* Filter MoA classes */}
          <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveMoaCategory("all")}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                activeMoaCategory === "all" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              All Drug Classes
            </button>
            {modeOfActionList.slice(0, 3).map((m) => (
              <button
                key={m.drugClass}
                onClick={() => setActiveMoaCategory(m.drugClass)}
                className={`px-2 py-1 rounded text-xs font-semibold transition-colors hidden sm:inline ${
                  activeMoaCategory === m.drugClass ? "bg-teal-500/20 text-teal-300" : "text-slate-400 hover:text-white"
                }`}
              >
                {m.drugClass}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {modeOfActionList
            .filter((m) => activeMoaCategory === "all" || m.drugClass === activeMoaCategory)
            .map((moa, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800 hover:border-teal-500/40 rounded-xl p-5 space-y-3 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white">{moa.drugClass}</span>
                    <span className="text-xs font-mono text-teal-300">({moa.representativeDrug})</span>
                  </div>
                  <span className="text-xs font-mono text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 self-start sm:self-auto">
                    Target: {moa.targetOrganelle}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-teal-400 block">
                      Pharmacological Action:
                    </span>
                    <p className="text-slate-300 leading-relaxed">{moa.pharmacologicalAction}</p>
                  </div>

                  <div className="bg-rose-950/20 p-3 rounded-lg border border-rose-500/20 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-rose-400 block">
                      Bacterial Resistance Mechanism:
                    </span>
                    <p className="text-rose-200 leading-relaxed">{moa.bacterialResistanceMechanism}</p>
                  </div>

                  <div className="bg-cyan-950/20 p-3 rounded-lg border border-cyan-500/20 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 block">
                      Clinical Counter-Strategy:
                    </span>
                    <p className="text-cyan-200 leading-relaxed">{moa.clinicalCounterStrategy}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 7. Patient & Family Accessible Care Guide */}
      <div
        id="patient-care-guide-section"
        className="rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-950/30 via-slate-900 to-slate-950 p-6 shadow-xl space-y-4"
      >
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Patient &amp; Family Plain-Language Care Summary
            </h3>
            <p className="text-xs text-slate-400">
              Clear, accessible explanation formatted for discharge instructions and patient education.
            </p>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-200 leading-relaxed">
          {analysis.patientFriendlySummary ||
            `Dear patient, your laboratory report has detected bacterial resistance to common antibiotics. This means standard oral pills will not effectively eradicate the infection. Your clinical medical team has reviewed your kidney functions and blood reports and selected safe, targeted alternative treatments designed specifically to cure this strain. Please do not take leftover or unprescribed pills.`}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-1">
          <span className="font-mono">
            Unique Verification Code: <strong className="text-teal-300">{uniqueCode}</strong>
          </span>
          {onOpenCodePortal && (
            <button
              onClick={() => onOpenCodePortal(uniqueCode)}
              className="text-cyan-400 hover:text-cyan-300 underline font-medium"
            >
              Click here to view in dedicated Patient Portal Mode
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
