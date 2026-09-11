import React, { useState } from "react";
import {
  Database,
  Search,
  Filter,
  FileText,
  Trash2,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  User,
  Plus,
} from "lucide-react";
import { SavedComparativeRecord } from "../types";

interface PatientRecordsViewProps {
  records: SavedComparativeRecord[];
  onDeleteRecord: (id: string) => void;
  onNewScan: () => void;
  onViewRecord: (record: SavedComparativeRecord) => void;
}

export const PatientRecordsView: React.FC<PatientRecordsViewProps> = ({
  records,
  onDeleteRecord,
  onNewScan,
  onViewRecord,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.patient1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patient2.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patient1.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patient2.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patient1.pathogen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patient2.pathogen.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (riskFilter === "high") {
      return r.riskLevel === "High Risk" || r.riskLevel === "Critical Risk";
    }
    if (riskFilter === "moderate") {
      return r.riskLevel === "Moderate Risk";
    }
    if (riskFilter === "low") {
      return r.riskLevel === "Low Risk";
    }

    return true;
  });

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Patient Comparative Scan Records Archive
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Historical cross-resistance evaluations, clinical stewardship notes, and transmission isolation logs
          </p>
        </div>

        <button
          onClick={onNewScan}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-semibold text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Comparative Scan</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 glass-panel p-3.5 rounded-xl border border-slate-700/80">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name, ID, or pathogen..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-medium">Risk Filter:</span>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Records ({records.length})</option>
            <option value="high">High / Critical Risk</option>
            <option value="moderate">Moderate Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <div className="rounded-2xl glass-panel p-12 text-center border border-slate-800">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <Database className="w-6 h-6" />
          </div>
          <p className="text-base font-semibold text-white">No Patient Records Found</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {records.length === 0
              ? "Run a comparative scan and click 'Save to Patient File' to archive medical antibiograms."
              : "No records matched your search query. Try clearing the filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecords.map((rec) => {
            const isHigh = rec.riskLevel.includes("High") || rec.riskLevel.includes("Critical");
            const isMod = rec.riskLevel.includes("Moderate");

            return (
              <div
                key={rec.id}
                className="rounded-2xl glass-panel p-5 border border-slate-700/80 hover:border-slate-600 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Record Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-teal-400 font-bold">{rec.id}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {new Date(rec.timestamp).toLocaleDateString()} {new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        isHigh
                          ? "bg-rose-950/80 text-rose-300 border-rose-600/50"
                          : isMod
                          ? "bg-amber-950/80 text-amber-300 border-amber-600/50"
                          : "bg-emerald-950/80 text-emerald-300 border-emerald-600/50"
                      }`}
                    >
                      {rec.riskLevel}
                    </span>
                  </div>

                  {/* Dual Patients Comparative Row */}
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] uppercase tracking-wider text-teal-400 font-bold block mb-0.5">
                        Person 1
                      </span>
                      <p className="font-bold text-white truncate">{rec.patient1.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{rec.patient1.id}</p>
                      <p className="text-[11px] text-teal-300 truncate mt-1">{rec.patient1.pathogen}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold block mb-0.5">
                        Person 2
                      </span>
                      <p className="font-bold text-white truncate">{rec.patient2.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{rec.patient2.id}</p>
                      <p className="text-[11px] text-cyan-300 truncate mt-1">{rec.patient2.pathogen}</p>
                    </div>
                  </div>

                  {/* Critical Overlaps Preview */}
                  <div className="mt-3 space-y-1 text-xs">
                    <span className="text-[11px] font-semibold text-slate-400">Critical Overlaps:</span>
                    <ul className="text-[11px] text-rose-300 space-y-0.5 list-disc list-inside">
                      {rec.criticalOverlaps.slice(0, 2).map((o, i) => (
                        <li key={i} className="truncate">{o}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1 font-mono text-slate-300">
                    <span>Overlap:</span>
                    <span className="text-teal-400 font-bold">{rec.compatibilityScore}%</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewRecord(rec)}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-teal-400" />
                      <span>Review Details</span>
                    </button>
                    <button
                      onClick={() => onDeleteRecord(rec.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
