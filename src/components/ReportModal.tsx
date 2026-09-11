import React from "react";
import { X, Printer, Download, Shield, Dna, CheckCircle } from "lucide-react";
import { AnalysisOutput, ComparativeDrugRow, PatientData } from "../types";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisOutput;
  rows: ComparativeDrugRow[];
  patient1: PatientData;
  patient2: PatientData;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  analysis,
  rows,
  patient1,
  patient2,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl glass-panel-glow border border-slate-700 p-6 sm:p-8 bg-slate-900 shadow-2xl text-slate-100">
        {/* Modal Action Bar (No Print) */}
        <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-mono text-teal-400">
            <Shield className="w-4 h-4" />
            <span>CONFIDENTIAL MEDICAL ANTIMICROBIAL DOSSIER</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-semibold text-xs transition-all cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Laboratory Header */}
        <div className="border-b-2 border-slate-700 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                  <Dna className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold font-mono tracking-tight text-white">
                  PHARMA<span className="text-teal-400">RESIST</span> PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Hospital Clinical Microbiology &amp; Antimicrobial Stewardship Division
              </p>
            </div>

            <div className="text-right text-xs font-mono space-y-0.5 text-slate-400">
              <p>Report ID: <span className="text-white font-bold">AST-CMP-{Date.now().toString().slice(-6)}</span></p>
              <p>Date: <span className="text-slate-200">{new Date().toLocaleDateString()}</span></p>
              <p>Standard: <span className="text-teal-400 font-semibold">EUCAST / CLSI M100</span></p>
            </div>
          </div>
        </div>

        {/* Dual Patient Profiles Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 text-xs space-y-1">
            <span className="text-[10px] font-mono text-teal-400 uppercase font-bold tracking-wider">
              Patient 1 Profile
            </span>
            <p className="text-sm font-bold text-white">{patient1.name} (ID: {patient1.id})</p>
            <p className="text-slate-400">Age/Ward: {patient1.age} y/o • {patient1.ward}</p>
            <p className="text-teal-300 font-medium">Pathogen: {patient1.pathogen}</p>
            <p className="text-slate-400">Specimen: {patient1.specimen}</p>
          </div>

          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 text-xs space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
              Patient 2 Profile
            </span>
            <p className="text-sm font-bold text-white">{patient2.name} (ID: {patient2.id})</p>
            <p className="text-slate-400">Age/Ward: {patient2.age} y/o • {patient2.ward}</p>
            <p className="text-cyan-300 font-medium">Pathogen: {patient2.pathogen}</p>
            <p className="text-slate-400">Specimen: {patient2.specimen}</p>
          </div>
        </div>

        {/* Risk & Compatibility Status Summary */}
        <div className="rounded-xl bg-slate-800/40 border border-slate-700/60 p-4 mb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Cross-Resistance Risk Level</span>
            <span className="text-base font-bold text-white font-mono">{analysis.riskLevel}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Resistance Profile Overlap</span>
            <span className="text-base font-bold text-teal-400 font-mono">{analysis.compatibilityPercentage}%</span>
          </div>
          <div>
            <span className="text-slate-400 block">Risk Severity Index</span>
            <span className="text-base font-bold text-rose-400 font-mono">{analysis.riskScore}/100</span>
          </div>
        </div>

        {/* Antibiogram Matrix Table */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            Comparative Antibiogram Susceptibility Matrix
          </h4>
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-2.5">Antibiotic</th>
                  <th className="p-2.5">Class</th>
                  <th className="p-2.5">{patient1.name}</th>
                  <th className="p-2.5">{patient2.name}</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="p-2.5 font-sans font-medium text-white">{row.drug}</td>
                    <td className="p-2.5 font-sans text-slate-400">{row.drugClass}</td>
                    <td className="p-2.5">{row.p1Status} ({row.p1Mic || "N/A"})</td>
                    <td className="p-2.5">{row.p2Status} ({row.p2Mic || "N/A"})</td>
                    <td className="p-2.5 font-sans text-xs">{row.crossCompatibility}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Directives */}
        <div className="space-y-4 mb-6 text-xs">
          <div>
            <h5 className="font-bold text-rose-400 mb-1">Critical Overlaps</h5>
            <ul className="list-disc list-inside space-y-0.5 text-slate-300">
              {analysis.criticalOverlaps.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-amber-400 mb-1">Mutational Resistance Markers</h5>
            <div className="flex flex-wrap gap-1.5">
              {analysis.mutatedStrainFlags.map((m, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-800 font-mono text-amber-300 border border-slate-700">
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-bold text-teal-400 mb-1">Recommended Alternative Therapies</h5>
            <ul className="list-disc list-inside space-y-0.5 text-slate-300">
              {analysis.suggestedAlternatives.map((alt, i) => (
                <li key={i}>{alt}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stewardship Signatures */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between text-xs text-slate-400 gap-4">
          <div>
            <p className="font-semibold text-white">Elena Vance, MD, FACP</p>
            <p>Lead Clinical Microbiologist, Antimicrobial Stewardship</p>
            <p className="text-[10px] text-teal-400 mt-0.5">Electronically Verified • EUCAST Protocol 2026</p>
          </div>
          <div className="text-right sm:text-right">
            <p className="text-[10px]">Pharma Resist Pro Clinical Engine</p>
            <p className="font-mono text-slate-500">HASH: 9a7b-88e2-c441-2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};
