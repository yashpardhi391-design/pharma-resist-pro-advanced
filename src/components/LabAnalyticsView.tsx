import React, { useState } from "react";
import {
  FileSpreadsheet,
  Activity,
  Biohazard,
  TrendingUp,
  AlertCircle,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { RESISTANCE_TREND_DATA, PATHOGEN_BREAKDOWN } from "../data/mockData";

export const LabAnalyticsView: React.FC = () => {
  const [selectedQuarter, setSelectedQuarter] = useState("2026-Q3");

  const pathogenBarData = PATHOGEN_BREAKDOWN.map((p) => ({
    name: p.pathogen,
    mdrRate: p.mdrRate,
    susceptibleRate: Number((100 - p.mdrRate).toFixed(1)),
    isolates: p.isolates,
  }));

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Institutional Antibiogram &amp; Surveillance Analytics
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Clinical microbiology aggregate AST data, multidrug-resistant organism (MDRO) infection control rates
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="2026-Q3">Q3 2026 (Current Active)</option>
              <option value="2026-Q2">Q2 2026 (Historical)</option>
              <option value="2026-Q1">Q1 2026 (Historical)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl glass-panel p-5 border border-teal-500/30">
          <span className="text-xs text-slate-400 font-medium">Antibiogram Compliance</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono text-white">96.8%</span>
            <span className="text-xs font-mono text-teal-400 font-semibold">+2.1%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">EUCAST standard breakpoint alignment</p>
        </div>

        <div className="rounded-xl glass-panel p-5 border border-rose-500/30">
          <span className="text-xs text-slate-400 font-medium">Carbapenem Sparing Rate</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono text-rose-400">71.4%</span>
            <span className="text-xs font-mono text-rose-400 font-semibold">+4.8% stewardship</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Preservation protocol adherence</p>
        </div>

        <div className="rounded-xl glass-panel p-5 border border-amber-500/30">
          <span className="text-xs text-slate-400 font-medium">Mean Turnaround Time</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono text-amber-400">14.2h</span>
            <span className="text-xs font-mono text-teal-400 font-semibold">-3.6h vs 2025</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">From specimen to AST result</p>
        </div>

        <div className="rounded-xl glass-panel p-5 border border-cyan-500/30">
          <span className="text-xs text-slate-400 font-medium">Isolation Containment</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-bold font-mono text-cyan-400">98.1%</span>
            <span className="text-xs font-mono text-teal-400 font-semibold">0 nosocomial bursts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Contact precaution enforcement</p>
        </div>
      </div>

      {/* Pathogen Resistance Distribution Bar Chart */}
      <div className="glass-panel-glow rounded-2xl p-6 border border-slate-700/80">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">
              Priority Pathogen Multidrug Resistance (MDR) Ratio
            </h3>
            <p className="text-xs text-slate-400">
              Proportion of resistant vs sensitive isolates across 21,330 annual specimens
            </p>
          </div>
          <span className="text-xs font-mono text-teal-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            CLSI M100-Ed34
          </span>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={pathogenBarData}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  borderColor: "#334155",
                  borderRadius: 12,
                  fontSize: 12,
                  color: "#F8FAFC",
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="mdrRate" name="MDR Resistance %" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="susceptibleRate" name="Wildtype / Susceptible %" fill="#0D9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Clinical Guidance Box */}
      <div className="rounded-2xl glass-panel p-6 border border-slate-700/80 bg-slate-900/60">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
          <Biohazard className="w-4 h-4 text-amber-400" />
          <span>Active Antimicrobial Stewardship Directives (September 2026)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 mt-3">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="font-bold text-rose-400 block mb-1">Carbapenem Restriction</span>
            <p className="text-slate-400">
              Meropenem and Imipenem require infectious disease pre-authorization for non-ICU patients. Prioritize Cefepime/Zidebactam under protocol #12.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="font-bold text-amber-400 block mb-1">Fluoroquinolone Black Box</span>
            <p className="text-slate-400">
              Avoid empiric ciprofloxacin monotherapy for hospital-acquired urinary tract infections due to local E. coli resistance exceeding 58%.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="font-bold text-teal-400 block mb-1">Colistin Renal Safeguards</span>
            <p className="text-slate-400">
              Polymyxin B and Colistin reserved exclusively for documented Pan-Drug-Resistant (PDR) Acinetobacter baumannii with daily creatinine clearance monitoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
