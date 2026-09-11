import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Save,
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import {
  AnalysisOutput,
  ComparativeDrugRow,
  PatientData,
} from "../types";
import { RESISTANCE_TREND_DATA, PATHOGEN_BREAKDOWN } from "../data/mockData";
import { ReportModal } from "./ReportModal";

interface AnalyticsExportSectionProps {
  analysis: AnalysisOutput | null;
  rows: ComparativeDrugRow[];
  patient1: PatientData;
  patient2: PatientData;
  onSaveRecord: () => Promise<void>;
  isSaving: boolean;
  saveSuccess: boolean;
}

export const AnalyticsExportSection: React.FC<AnalyticsExportSectionProps> = ({
  analysis,
  rows,
  patient1,
  patient2,
  onSaveRecord,
  isSaving,
  saveSuccess,
}) => {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [activeLines, setActiveLines] = useState<Record<string, boolean>>({
    Carbapenems: true,
    Fluoroquinolones: true,
    Cephalosporins: true,
    Aminoglycosides: true,
    Glycopeptides: false,
  });

  const toggleLine = (key: string) => {
    setActiveLines((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // CSV Export handler
  const handleExportCSV = () => {
    if (!analysis) return;

    const headers = [
      "Antibiotic Drug",
      "Drug Class",
      `Person 1 (${patient1.name}) Status`,
      "Person 1 MIC",
      `Person 2 (${patient2.name}) Status`,
      "Person 2 MIC",
      "Cross Compatibility Flag",
      "Clinical Note",
    ];

    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        [
          `"${row.drug}"`,
          `"${row.drugClass}"`,
          `"${row.p1Status}"`,
          `"${row.p1Mic || "N/A"}"`,
          `"${row.p2Status}"`,
          `"${row.p2Mic || "N/A"}"`,
          `"${row.crossCompatibility}"`,
          `"${(row.clinicalNote || "").replace(/"/g, '""')}"`,
        ].join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Antimicrobial_Comparison_${patient1.id}_vs_${patient2.id}_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Custom Recharts Dark Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl glass-panel p-3 border border-slate-700 shadow-xl text-xs font-mono">
          <p className="font-sans font-bold text-white mb-2">{label} - Hospital Network AST</p>
          {payload.map((item: any) => (
            <div key={item.name} className="flex items-center justify-between space-x-4 py-0.5">
              <span className="flex items-center space-x-1.5" style={{ color: item.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}:</span>
              </span>
              <span className="font-bold text-white">{item.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section id="analytics-export-section" className="relative py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-teal-400" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Longitudinal Antimicrobial Resistance Surveillance
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Multi-month institutional resistance trajectory across key antibiotic classes (Oct 2025 – Sep 2026)
            </p>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Download PDF Summary Report */}
            <button
              id="download-pdf-summary-button"
              onClick={() => setReportModalOpen(true)}
              disabled={!analysis}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-semibold text-xs shadow-[0_0_15px_rgba(13,148,136,0.25)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-4 h-4" />
              <span>Download PDF Summary Report</span>
            </button>

            {/* Export CSV */}
            <button
              id="export-csv-button"
              onClick={handleExportCSV}
              disabled={!analysis}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            {/* Save to Patient File */}
            <button
              id="save-to-patient-file-button"
              onClick={onSaveRecord}
              disabled={!analysis || isSaving}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                saveSuccess
                  ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300"
                  : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Saved to Patient File!</span>
                </>
              ) : isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                  <span>Archiving Record...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-cyan-400" />
                  <span>Save to Patient File</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Interactive Recharts Graph Panel */}
        <div className="glass-panel-glow rounded-2xl p-5 sm:p-6 border border-slate-700/80 shadow-xl">
          {/* Drug Class Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-medium text-slate-300">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Toggle Tracked Drug Classes:</span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => toggleLine("Carbapenems")}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border transition-all ${
                  activeLines.Carbapenems
                    ? "bg-teal-950/70 text-teal-300 border-teal-500/50"
                    : "bg-slate-800/50 text-slate-500 border-slate-700"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
                <span>Carbapenems</span>
              </button>

              <button
                onClick={() => toggleLine("Fluoroquinolones")}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border transition-all ${
                  activeLines.Fluoroquinolones
                    ? "bg-cyan-950/70 text-cyan-300 border-cyan-500/50"
                    : "bg-slate-800/50 text-slate-500 border-slate-700"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                <span>Fluoroquinolones</span>
              </button>

              <button
                onClick={() => toggleLine("Cephalosporins")}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border transition-all ${
                  activeLines.Cephalosporins
                    ? "bg-rose-950/70 text-rose-300 border-rose-500/50"
                    : "bg-slate-800/50 text-slate-500 border-slate-700"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#F43F5E]" />
                <span>Cephalosporins</span>
              </button>

              <button
                onClick={() => toggleLine("Aminoglycosides")}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border transition-all ${
                  activeLines.Aminoglycosides
                    ? "bg-amber-950/70 text-amber-300 border-amber-500/50"
                    : "bg-slate-800/50 text-slate-500 border-slate-700"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span>Aminoglycosides</span>
              </button>
            </div>
          </div>

          {/* Line Chart */}
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={RESISTANCE_TREND_DATA}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  unit="%"
                  domain={[0, 80]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12, paddingBottom: 10 }}
                />

                {activeLines.Carbapenems && (
                  <Line
                    type="monotone"
                    dataKey="Carbapenems"
                    name="Carbapenems (CRE)"
                    stroke="#0D9488"
                    strokeWidth={3}
                    dot={{ r: 3, fill: "#0D9488" }}
                    activeDot={{ r: 6, stroke: "#14B8A6", strokeWidth: 2 }}
                  />
                )}

                {activeLines.Fluoroquinolones && (
                  <Line
                    type="monotone"
                    dataKey="Fluoroquinolones"
                    name="Fluoroquinolones"
                    stroke="#06B6D4"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#06B6D4" }}
                    activeDot={{ r: 6 }}
                  />
                )}

                {activeLines.Cephalosporins && (
                  <Line
                    type="monotone"
                    dataKey="Cephalosporins"
                    name="3rd/4th Gen Cephalosporins"
                    stroke="#F43F5E"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#F43F5E" }}
                    activeDot={{ r: 6 }}
                  />
                )}

                {activeLines.Aminoglycosides && (
                  <Line
                    type="monotone"
                    dataKey="Aminoglycosides"
                    name="Aminoglycosides"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#F59E0B" }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pathogen Resistance Distribution Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PATHOGEN_BREAKDOWN.map((p) => (
            <div
              key={p.pathogen}
              className="rounded-xl glass-panel p-3.5 border border-slate-800 hover:border-slate-700 transition-colors text-xs"
            >
              <span className="text-[11px] font-semibold text-slate-300 block truncate">
                {p.pathogen}
              </span>
              <div className="mt-1.5 flex items-baseline space-x-1">
                <span className="text-lg font-bold font-mono text-white">
                  {p.mdrRate}%
                </span>
                <span className="text-[10px] text-slate-400">MDR</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1 mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${p.mdrRate}%`,
                    backgroundColor: p.riskColor,
                  }}
                />
              </div>
              <span className="text-[10px] text-slate-400 block mt-1.5">
                {p.isolates.toLocaleString()} isolates
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Printable / Downloadable PDF Report Modal */}
      {analysis && (
        <ReportModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          analysis={analysis}
          rows={rows}
          patient1={patient1}
          patient2={patient2}
        />
      )}
    </section>
  );
};
