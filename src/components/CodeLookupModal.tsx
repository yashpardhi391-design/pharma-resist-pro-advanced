import React, { useState } from "react";
import {
  X,
  Search,
  KeyRound,
  Stethoscope,
  User,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Printer,
  FileText,
  Dna,
  HeartPulse,
  Droplets,
  Activity,
  ArrowRight,
  Share2,
} from "lucide-react";
import { SavedComparativeRecord, AnalysisOutput, PatientData } from "../types";

interface CodeLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedRecords: SavedComparativeRecord[];
  currentAnalysis: AnalysisOutput | null;
  patient1: PatientData;
  patient2: PatientData;
}

export const CodeLookupModal: React.FC<CodeLookupModalProps> = ({
  isOpen,
  onClose,
  savedRecords,
  currentAnalysis,
  patient1,
  patient2,
}) => {
  const [inputCode, setInputCode] = useState<string>("");
  const [activeRole, setActiveRole] = useState<"doctor" | "patient">("doctor");
  const [matchedRecord, setMatchedRecord] = useState<SavedComparativeRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Available codes in system
  const currentCode = currentAnalysis?.uniqueAccessCode || "PRP-9021-8842-8801";
  const allAvailableCodes = [
    currentCode,
    ...savedRecords.map((r) => r.uniqueAccessCode || r.id),
  ].filter(Boolean);

  const handleSearch = (codeToSearch?: string) => {
    const code = (codeToSearch || inputCode).trim().toUpperCase();
    if (!code) return;

    setHasSearched(true);

    // 1. Check saved records
    const found = savedRecords.find(
      (r) =>
        (r.uniqueAccessCode && r.uniqueAccessCode.toUpperCase() === code) ||
        r.id.toUpperCase() === code
    );

    if (found) {
      setMatchedRecord(found);
    } else if (
      currentAnalysis &&
      (currentAnalysis.uniqueAccessCode.toUpperCase() === code ||
        code.includes("PRP-") ||
        code.includes("CURRENT"))
    ) {
      // Build virtual record from current analysis
      const virtualRecord: SavedComparativeRecord = {
        id: "REC-CURRENT",
        uniqueAccessCode: currentAnalysis.uniqueAccessCode,
        timestamp: currentAnalysis.analyzedAt,
        patient1: {
          id: patient1.id,
          name: patient1.name,
          age: patient1.age,
          ward: patient1.ward,
          pathogen: patient1.pathogen,
          specimen: patient1.specimen,
          fileName: patient1.file?.name,
          clinicalParams: patient1.clinicalParams,
        },
        patient2: {
          id: patient2.id,
          name: patient2.name,
          age: patient2.age,
          ward: patient2.ward,
          pathogen: patient2.pathogen,
          specimen: patient2.specimen,
          fileName: patient2.file?.name,
          clinicalParams: patient2.clinicalParams,
        },
        compatibilityScore: currentAnalysis.compatibilityPercentage,
        riskLevel: currentAnalysis.riskLevel,
        criticalOverlaps: currentAnalysis.criticalOverlaps,
        mutatedStrainFlags: currentAnalysis.mutatedStrainFlags,
        recommendedAlternatives: currentAnalysis.suggestedAlternatives,
        clinicalSummary: currentAnalysis.clinicalSummary,
        patientFriendlySummary: currentAnalysis.patientFriendlySummary,
        riskReductionGuide: currentAnalysis.riskReductionGuide,
        modeOfActionList: currentAnalysis.modeOfActionList,
      };
      setMatchedRecord(virtualRecord);
    } else {
      setMatchedRecord(null);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="code-lookup-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-teal-500/40 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/40 text-teal-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                <span>Universal Medical Report Verification Portal</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Doctor & Patient Access
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Enter your unique generated Access Code to securely review clinical reports and stewardship recommendations.
              </p>
            </div>
          </div>
          <button
            id="close-code-portal-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Code Input */}
        <div className="p-6 bg-slate-950/40 border-b border-slate-800/80 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <KeyRound className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="unique-code-input"
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter Unique Access Code (e.g. PRP-9021-8842-8801 or REC-2026-8801)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
              />
            </div>
            <button
              id="search-code-btn"
              onClick={() => handleSearch()}
              className="flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-teal-500/20 transition-all shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Retrieve Report</span>
            </button>
          </div>

          {/* Quick Code suggestions */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 text-[11px] font-mono">Active Verification Codes:</span>
            {allAvailableCodes.slice(0, 4).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setInputCode(code);
                  handleSearch(code);
                }}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700/80 font-mono text-xs transition-colors"
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* View Selection Toggle (Doctor vs Patient) */}
        {matchedRecord && (
          <div className="flex items-center justify-between px-6 py-3 bg-slate-950/60 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium">Viewing Portal Mode:</span>
              <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                <button
                  id="toggle-doctor-view-btn"
                  onClick={() => setActiveRole("doctor")}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeRole === "doctor"
                      ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Doctor / Clinician View</span>
                </button>
                <button
                  id="toggle-patient-view-btn"
                  onClick={() => setActiveRole("patient")}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeRole === "patient"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Patient / Family View</span>
                </button>
              </div>
            </div>

            {/* Quick Share Code */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCopyCode(matchedRecord.uniqueAccessCode || matchedRecord.id)}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700 transition-colors"
                title="Copy Unique Code to share"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : matchedRecord.uniqueAccessCode || matchedRecord.id}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                title="Print Report"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {!hasSearched ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <KeyRound className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-200">Enter a Medical Access Code</h4>
              <p className="text-xs text-slate-400 max-w-md">
                Every comparative antibiotic susceptibility analysis is assigned a cryptographically distinct, verified verification code. Click one of the active codes above to test.
              </p>
            </div>
          ) : !matchedRecord ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-rose-300">Code Not Found in Active Registry</h4>
              <p className="text-xs text-slate-400 max-w-md">
                No archived or live report matches code &quot;{inputCode}&quot;. Please verify the code on your printed receipt or discharge paperwork.
              </p>
            </div>
          ) : activeRole === "doctor" ? (
            /* ================= DOCTOR VIEW ================= */
            <div className="space-y-6">
              {/* Doctor View Badge & Summary Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-950/80 border border-teal-500/30 rounded-xl gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-teal-400">CLINICAL AST REPORT:</span>
                    <span className="text-sm font-bold text-white">
                      {matchedRecord.patient1.name} vs {matchedRecord.patient2.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Isolated Pathogens: {matchedRecord.patient1.pathogen} &bull; {matchedRecord.patient2.pathogen}
                  </p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${
                      matchedRecord.riskLevel === "High Risk" || matchedRecord.riskLevel === "Critical Risk"
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                        : matchedRecord.riskLevel === "Moderate Risk"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        : "bg-teal-500/20 text-teal-300 border-teal-500/30"
                    }`}
                  >
                    {matchedRecord.riskLevel} ({matchedRecord.compatibilityScore}% Compatibility)
                  </span>
                </div>
              </div>

              {/* Patient Vitals & Blood Parameters Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Patient 1 Card */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-300 font-mono">
                      PATIENT 1 &bull; {matchedRecord.patient1.id}
                    </span>
                    <span className="text-xs text-slate-400">{matchedRecord.patient1.ward}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{matchedRecord.patient1.name} ({matchedRecord.patient1.age} y/o)</h4>
                  
                  {matchedRecord.patient1.clinicalParams && (
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                      <div className="bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Blood & Hb:</span>
                        <span className="text-white font-bold">{matchedRecord.patient1.clinicalParams.bloodGroup}</span> &bull;{" "}
                        <span className="text-rose-300">{matchedRecord.patient1.clinicalParams.anemia.hemoglobin} g/dL</span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Weight & BMI:</span>
                        <span className="text-white">{matchedRecord.patient1.clinicalParams.vitals.weightKg} kg</span> &bull;{" "}
                        <span className="text-cyan-300">{matchedRecord.patient1.clinicalParams.vitals.bmi}</span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">eGFR & Creatinine:</span>
                        <span className="text-amber-300 font-bold">{matchedRecord.patient1.clinicalParams.bloodReport.eGfr} mL/min</span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Virulence & Immunity:</span>
                        <span className="text-purple-300">{matchedRecord.patient1.clinicalParams.pathogenVirulenceIndex}</span> &bull;{" "}
                        <span className="text-teal-300">{matchedRecord.patient1.clinicalParams.immunityCapacity.split(" ")[0]}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Patient 2 Card */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 font-mono">
                      PATIENT 2 &bull; {matchedRecord.patient2.id}
                    </span>
                    <span className="text-xs text-slate-400">{matchedRecord.patient2.ward}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{matchedRecord.patient2.name} ({matchedRecord.patient2.age} y/o)</h4>

                  {matchedRecord.patient2.clinicalParams && (
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                      <div className="bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Blood & Hb:</span>
                        <span className="text-white font-bold">{matchedRecord.patient2.clinicalParams.bloodGroup}</span> &bull;{" "}
                        <span className="text-rose-300">{matchedRecord.patient2.clinicalParams.anemia.hemoglobin} g/dL</span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Weight & BMI:</span>
                        <span className="text-white">{matchedRecord.patient2.clinicalParams.vitals.weightKg} kg</span> &bull;{" "}
                        <span className="text-cyan-300">{matchedRecord.patient2.clinicalParams.vitals.bmi}</span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">eGFR & Creatinine:</span>
                        <span className="text-amber-300 font-bold">{matchedRecord.patient2.clinicalParams.bloodReport.eGfr} mL/min</span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Virulence & Immunity:</span>
                        <span className="text-purple-300">{matchedRecord.patient2.clinicalParams.pathogenVirulenceIndex}</span> &bull;{" "}
                        <span className="text-teal-300">{matchedRecord.patient2.clinicalParams.immunityCapacity.split(" ")[0]}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Critical Shared Overlaps & Resistance Mechanisms */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Concurrent Resistance Pathways & Genotypes
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-rose-950/20 border border-rose-500/30 rounded-lg p-3 space-y-1.5">
                    <span className="text-[11px] font-bold text-rose-300 uppercase font-mono block">
                      Critical Invalidation Hazards:
                    </span>
                    <ul className="space-y-1 text-xs text-rose-200">
                      {matchedRecord.criticalOverlaps.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <span className="text-rose-400 mt-0.5">&bull;</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-purple-950/20 border border-purple-500/30 rounded-lg p-3 space-y-1.5">
                    <span className="text-[11px] font-bold text-purple-300 uppercase font-mono block">
                      Molecular Mutation Flags:
                    </span>
                    <ul className="space-y-1 text-xs text-purple-200">
                      {matchedRecord.mutatedStrainFlags.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <span className="text-purple-400 mt-0.5">&bull;</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Recommended Second-Line Antimicrobial Alternatives */}
              <div className="bg-teal-950/20 border border-teal-500/30 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider font-mono">
                  Clinician Stewardship Alternatives & Salvage Regimens:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {matchedRecord.recommendedAlternatives.map((alt, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-2 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span>{alt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Analysis Text */}
              {matchedRecord.clinicalSummary && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase font-mono block">
                    Institutional Microbiologist Diagnostic Notes:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {matchedRecord.clinicalSummary}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* ================= PATIENT VIEW ================= */
            <div className="space-y-6">
              {/* Patient Welcome Header */}
              <div className="p-4 bg-gradient-to-r from-teal-950/50 via-cyan-950/40 to-slate-900 border border-cyan-500/30 rounded-xl space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-base font-bold text-white">
                    Patient & Family Health Guide &bull; Verified Test Result
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  This page explains your medical test in plain, easy-to-understand language. Your doctors have checked which antibiotics are strong enough to cure your infection safely.
                </p>
              </div>

              {/* Simple Risk Status & What It Means */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">
                    Treatment Difficulty Status
                  </span>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-base font-bold ${
                        matchedRecord.riskLevel.includes("High") || matchedRecord.riskLevel.includes("Critical")
                          ? "text-rose-400"
                          : matchedRecord.riskLevel.includes("Moderate")
                          ? "text-amber-400"
                          : "text-teal-400"
                      }`}
                    >
                      {matchedRecord.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {matchedRecord.riskLevel.includes("High")
                      ? "The bacteria found in the sample are resistant to several common medicines. Your doctor will use specialized targeted treatments."
                      : "Some standard medicines will not work, but several effective treatment choices are ready and safe."}
                  </p>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">
                    What You Need to Do
                  </span>
                  <div className="flex items-center space-x-2 text-teal-300 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Follow the Doctor&apos;s Full Course</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Never stop taking your medication early even if you feel completely healed. Stopping early lets resilient bacteria survive and grow back.
                  </p>
                </div>
              </div>

              {/* Patient-Friendly Summary Text */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-cyan-300 uppercase font-mono">
                  Personal Care Summary:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {matchedRecord.patientFriendlySummary ||
                    `Dear ${matchedRecord.patient1.name}, your laboratory culture shows that the bacteria causing your symptoms do not respond to common oral antibiotics. Your medical team has mapped out safe alternative medicines (such as targeted IV infusions) designed specifically to overcome this without harming your kidneys or liver. Please stay well hydrated and do not take any over-the-counter painkillers or leftover antibiotics without asking your hospital doctor.`}
                </p>
              </div>

              {/* Action Checklist for Patients */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Important Recovery Steps:
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start space-x-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Wash Hands Frequently with Soap & Warm Water</strong>
                      <span>Thorough hand hygiene stops the spread of resistant bacteria to family members at home or ward visitors.</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Strictly Avoid Self-Medicating with Old Antibiotics</strong>
                      <span>Taking unprescribed leftover pills gives bacteria the exact signals they need to become permanently immune to treatment.</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Ask Your Doctor About Kidney & Hydration Monitoring</strong>
                      <span>Certain strong antibiotics require drinking plenty of water and routine blood tests to protect kidney health.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-950/80">
          <div className="text-[11px] text-slate-400 font-mono">
            Unique Verification Key:{" "}
            <span className="text-teal-300 font-bold">
              {matchedRecord?.uniqueAccessCode || matchedRecord?.id || "N/A"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};
