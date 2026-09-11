import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { HeroStats } from "./components/HeroStats";
import { DualPatientScanner } from "./components/DualPatientScanner";
import { ComparativeAnalysisOutput } from "./components/ComparativeAnalysisOutput";
import { AnalyticsExportSection } from "./components/AnalyticsExportSection";
import { PatientRecordsView } from "./components/PatientRecordsView";
import { LabAnalyticsView } from "./components/LabAnalyticsView";
import { ReportModal } from "./components/ReportModal";
import { CodeLookupModal } from "./components/CodeLookupModal";
import {
  DEFAULT_PATIENT_1,
  DEFAULT_PATIENT_2,
  buildComparativeRows,
  STANDARD_MODE_OF_ACTION_CATALOG,
  STANDARD_RISK_REDUCTION_GUIDE,
} from "./data/mockData";
import {
  PatientData,
  AnalysisOutput,
  ComparativeDrugRow,
  SavedComparativeRecord,
} from "./types";
import { Shield, HeartPulse, Dna, Info, Sparkles, GraduationCap } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"overview" | "scanner" | "analytics" | "records">("overview");

  const [patient1, setPatient1] = useState<PatientData>(DEFAULT_PATIENT_1);
  const [patient2, setPatient2] = useState<PatientData>(DEFAULT_PATIENT_2);

  const [comparativeRows, setComparativeRows] = useState<ComparativeDrugRow[]>(() =>
    buildComparativeRows(DEFAULT_PATIENT_1, DEFAULT_PATIENT_2)
  );

  const [analysis, setAnalysis] = useState<AnalysisOutput | null>(() => ({
    riskScore: 84,
    riskLevel: "High Risk",
    compatibilityPercentage: 28,
    uniqueAccessCode: "PRP-9021-8842-8801",
    criticalOverlaps: [
      "Concurrent Meropenem and Imipenem carbapenemase resistance",
      "Shared high-level fluoroquinolone resistance (Ciprofloxacin & Levofloxacin)",
      "Co-resistance across 3rd & 4th generation cephalosporins (Ceftriaxone, Cefepime)",
    ],
    mutatedStrainFlags: [
      "blaKPC-3 (Klebsiella pneumoniae Carbapenemase)",
      "Class D OXA-23/OXA-51 carbapenem-hydrolyzing oxacillinase",
      "GyrA Ser83Leu & ParC Ser80Ile topoisomerase mutations",
    ],
    suggestedAlternatives: [
      "Ceftazidime-Avibactam (Avycaz) 2.5g IV q8h extended 3-hour infusion",
      "Tigecycline 100mg loading dose then 50mg IV q12h",
      "Colistin (Polymyxin E) high-dose targeted salvage only under MIC guidance",
      "Immediate Contact Isolation Protocol 4B: dedicated nursing cohorting required",
    ],
    clinicalSummary: `Comparative AST cross-analysis between Marcus Vance (P-9021) and Arthur Pendelton (P-8842) establishes a High Risk antimicrobial resistance overlap. Both isolates demonstrate extensive pan-beta-lactam and fluoroquinolone invalidation driven by carbapenemase gene expression (blaKPC-3 and CRAB markers). 

Empiric monotherapy with beta-lactamase inhibitor combinations or carbapenems is strictly contraindicated. Both patients share susceptibility only to novel beta-lactamase inhibitor adjuncts (Ceftazidime-Avibactam) and membrane-active polymyxins. Strict spatial segregation is advised to prevent inter-ward clonal transmission.`,
    riskReductionGuide: STANDARD_RISK_REDUCTION_GUIDE,
    modeOfActionList: STANDARD_MODE_OF_ACTION_CATALOG,
    patientFriendlySummary: "Dear patient, this laboratory report shows bacterial resistance to regular antibiotics like Meropenem and Ciprofloxacin. Your medical team has calibrated your kidney clearance and blood parameters and prescribed targeted alternative therapy. Do not take self-medicated pills.",
    analyzedAt: new Date().toLocaleTimeString(),
    source: "clinical-engine",
  }));

  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedRecords, setSavedRecords] = useState<SavedComparativeRecord[]>([]);
  const [aiOnline, setAiOnline] = useState(true);

  // Universal Code Lookup Modal state
  const [codeLookupOpen, setCodeLookupOpen] = useState(false);
  const [initialLookupCode, setInitialLookupCode] = useState("");

  const handleOpenCodeLookup = (code?: string) => {
    setInitialLookupCode(code || "");
    setCodeLookupOpen(true);
  };

  // Review modal for records
  const [reviewRecord, setReviewRecord] = useState<SavedComparativeRecord | null>(null);

  // Check health and load patient records
  useEffect(() => {
    async function init() {
      try {
        const healthRes = await fetch("/api/health");
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          setAiOnline(Boolean(healthData.aiEngineOnline));
        }

        const recordsRes = await fetch("/api/patient-records");
        if (recordsRes.ok) {
          const recordsData = await recordsRes.json();
          if (recordsData.records) {
            setSavedRecords(recordsData.records);
          }
        }
      } catch (err) {
        console.warn("Backend API not reachable, using local state:", err);
      }
    }
    init();
  }, []);

  // Update comparative rows whenever patient antibiotics change
  useEffect(() => {
    setComparativeRows(buildComparativeRows(patient1, patient2));
  }, [patient1, patient2]);

  // Run Comparative Scan
  const handleRunScan = async () => {
    setIsScanning(true);
    const updatedRows = buildComparativeRows(patient1, patient2);
    setComparativeRows(updatedRows);

    try {
      const res = await fetch("/api/analyze-resistance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient1: {
            id: patient1.id,
            name: patient1.name,
            pathogen: patient1.pathogen,
            specimen: patient1.specimen,
            antibiotics: patient1.antibiotics,
            clinicalParams: patient1.clinicalParams,
          },
          patient2: {
            id: patient2.id,
            name: patient2.name,
            pathogen: patient2.pathogen,
            specimen: patient2.specimen,
            antibiotics: patient2.antibiotics,
            clinicalParams: patient2.clinicalParams,
          },
          antibioticList: updatedRows,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysis({
          riskScore: data.riskScore ?? 80,
          riskLevel: data.riskLevel ?? "High Risk",
          compatibilityPercentage: data.compatibilityPercentage ?? 30,
          uniqueAccessCode: data.uniqueAccessCode || `PRP-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
          criticalOverlaps: data.criticalOverlaps || [],
          mutatedStrainFlags: data.mutatedStrainFlags || [],
          suggestedAlternatives: data.suggestedAlternatives || [],
          clinicalSummary: data.clinicalSummary || "Analysis completed.",
          riskReductionGuide: data.riskReductionGuide || STANDARD_RISK_REDUCTION_GUIDE,
          modeOfActionList: data.modeOfActionList || STANDARD_MODE_OF_ACTION_CATALOG,
          patientFriendlySummary: data.patientFriendlySummary,
          hostVulnerabilityNotes: data.hostVulnerabilityNotes,
          analyzedAt: new Date().toLocaleTimeString(),
          source: data.source,
        });
      } else {
        throw new Error("Server analysis failed");
      }
    } catch (err) {
      console.warn("Using local rules engine for analysis:", err);
      // Deterministic fallback
      const sharedResistant = updatedRows.filter((r) => r.crossCompatibility === "Shared Resistance");
      const calculatedRisk = Math.min(95, 30 + sharedResistant.length * 15);
      const riskLevel = calculatedRisk >= 70 ? "High Risk" : calculatedRisk >= 45 ? "Moderate Risk" : "Low Risk";

      setAnalysis({
        riskScore: calculatedRisk,
        riskLevel,
        compatibilityPercentage: Math.max(15, 100 - calculatedRisk),
        uniqueAccessCode: `PRP-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        criticalOverlaps: sharedResistant.map((r) => `Shared non-susceptibility to ${r.drug}`),
        mutatedStrainFlags: [
          "Target site enzyme modification confirmed",
          "Carbapenemase resistance determinants active",
        ],
        suggestedAlternatives: [
          "Ceftazidime-Avibactam targeted infusion",
          "Synergy combination testing with Colistin/Tigecycline",
        ],
        clinicalSummary: `Comparative analysis completed for ${patient1.name} and ${patient2.name}. Significant cross-resistance identified across ${sharedResistant.length} evaluated antibiotic agents. Avoid shared empirical treatment lines.`,
        riskReductionGuide: STANDARD_RISK_REDUCTION_GUIDE,
        modeOfActionList: STANDARD_MODE_OF_ACTION_CATALOG,
        patientFriendlySummary: "Dear patient, bacterial resistance was detected. Your medical care team has adjusted your dosages according to your clinical parameters and selected effective alternative treatments.",
        analyzedAt: new Date().toLocaleTimeString(),
        source: "clinical-engine",
      });
    } finally {
      setIsScanning(false);
      // Smooth scroll to output
      setTimeout(() => {
        const el = document.getElementById("comparative-analysis-output");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
  };

  // Save Comparative Scan to Patient Records
  const handleSaveRecord = async () => {
    if (!analysis) return;
    setIsSaving(true);
    const newRecordPayload = {
      patient1: {
        id: patient1.id,
        name: patient1.name,
        age: patient1.age,
        ward: patient1.ward,
        pathogen: patient1.pathogen,
        specimen: patient1.specimen,
        fileName: patient1.file?.name,
      },
      patient2: {
        id: patient2.id,
        name: patient2.name,
        age: patient2.age,
        ward: patient2.ward,
        pathogen: patient2.pathogen,
        specimen: patient2.specimen,
        fileName: patient2.file?.name,
      },
      compatibilityScore: analysis.compatibilityPercentage,
      riskLevel: analysis.riskLevel,
      uniqueAccessCode: analysis.uniqueAccessCode || "PRP-9021-8842-8801",
      criticalOverlaps: analysis.criticalOverlaps,
      mutatedStrainFlags: analysis.mutatedStrainFlags,
      recommendedAlternatives: analysis.suggestedAlternatives,
      clinicalSummary: analysis.clinicalSummary,
    };

    try {
      const res = await fetch("/api/patient-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecordPayload),
      });
      if (res.ok) {
        const data = await res.json();
        setSavedRecords((prev) => [data.record, ...prev]);
      } else {
        // Fallback local append
        const localRecord: SavedComparativeRecord = {
          id: `REC-${Date.now().toString().slice(-6)}`,
          timestamp: new Date().toISOString(),
          ...newRecordPayload,
        };
        setSavedRecords((prev) => [localRecord, ...prev]);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.warn("Local record save fallback:", err);
      const localRecord: SavedComparativeRecord = {
        id: `REC-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toISOString(),
        ...newRecordPayload,
      };
      setSavedRecords((prev) => [localRecord, ...prev]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Record
  const handleDeleteRecord = async (id: string) => {
    try {
      await fetch(`/api/patient-records/${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Local deletion fallback:", err);
    }
    setSavedRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] text-slate-100 selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedRecordsCount={savedRecords.length}
        aiOnline={aiOnline}
        onOpenCodePortal={() => handleOpenCodeLookup()}
      />

      {/* University Prototype Notice & Fast Code Verification Strip */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-slate-300">
            <GraduationCap className="w-4 h-4 text-teal-400 shrink-0" />
            <span>
              <strong className="text-white">University Clinical Prototype</strong> &bull; Department of Medical Microbiology &amp; Antimicrobial Surveillance
            </span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] font-mono">
            <span className="text-slate-400">Official Report Verification:</span>
            <button
              onClick={() => handleOpenCodeLookup(analysis?.uniqueAccessCode || "PRP-9021-8842-8801")}
              className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-700/60 hover:border-teal-400 transition-colors font-bold"
            >
              Verify Code [{analysis?.uniqueAccessCode || "PRP-9021-8842-8801"}]
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Areas */}
      <main className="flex-1 pb-16">
        {activeTab === "overview" && (
          <>
            <HeroStats
              onLaunchScanner={() => {
                setActiveTab("scanner");
                setTimeout(() => {
                  document.getElementById("dual-scanner-section")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              onViewAnalytics={() => setActiveTab("analytics")}
            />

            <DualPatientScanner
              patient1={patient1}
              setPatient1={setPatient1}
              patient2={patient2}
              setPatient2={setPatient2}
              onRunScan={handleRunScan}
              isScanning={isScanning}
            />

            {analysis && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ComparativeAnalysisOutput
                  analysis={analysis}
                  rows={comparativeRows}
                  patient1={patient1}
                  patient2={patient2}
                  onOpenCodePortal={handleOpenCodeLookup}
                />
              </div>
            )}

            <AnalyticsExportSection
              analysis={analysis}
              rows={comparativeRows}
              patient1={patient1}
              patient2={patient2}
              onSaveRecord={handleSaveRecord}
              isSaving={isSaving}
              saveSuccess={saveSuccess}
            />
          </>
        )}

        {activeTab === "scanner" && (
          <div className="pt-4 space-y-6">
            <DualPatientScanner
              patient1={patient1}
              setPatient1={setPatient1}
              patient2={patient2}
              setPatient2={setPatient2}
              onRunScan={handleRunScan}
              isScanning={isScanning}
            />

            {analysis && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ComparativeAnalysisOutput
                  analysis={analysis}
                  rows={comparativeRows}
                  patient1={patient1}
                  patient2={patient2}
                  onOpenCodePortal={handleOpenCodeLookup}
                />
              </div>
            )}

            <AnalyticsExportSection
              analysis={analysis}
              rows={comparativeRows}
              patient1={patient1}
              patient2={patient2}
              onSaveRecord={handleSaveRecord}
              isSaving={isSaving}
              saveSuccess={saveSuccess}
            />
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="pt-4">
            <LabAnalyticsView />
          </div>
        )}

        {activeTab === "records" && (
          <div className="pt-4">
            <PatientRecordsView
              records={savedRecords}
              onDeleteRecord={handleDeleteRecord}
              onNewScan={() => setActiveTab("scanner")}
              onViewRecord={(rec) => setReviewRecord(rec)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-800/80 bg-[#070D18] py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono font-bold text-white tracking-wider">
              PHARMA<span className="text-teal-400">RESIST</span> PRO
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] text-slate-400">
              EUCAST Breakpoints v14.0 • CLSI M100 Performance Standards
            </span>
          </div>

          <div className="flex items-center space-x-6 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
              <span>Diagnostic Decision Support Suite</span>
            </span>
            <span className="text-slate-500">
              © {new Date().getFullYear()} Clinical Antimicrobial Stewardship
            </span>
          </div>
        </div>
      </footer>

      {/* Review Modal from Patient Records archive */}
      {reviewRecord && (
        <ReportModal
          isOpen={true}
          onClose={() => setReviewRecord(null)}
          analysis={{
            riskScore: reviewRecord.riskLevel.includes("High") ? 85 : 45,
            riskLevel: reviewRecord.riskLevel,
            compatibilityPercentage: reviewRecord.compatibilityScore,
            criticalOverlaps: reviewRecord.criticalOverlaps,
            mutatedStrainFlags: reviewRecord.mutatedStrainFlags,
            suggestedAlternatives: reviewRecord.recommendedAlternatives,
            clinicalSummary: reviewRecord.clinicalSummary || "Archived comparative analysis summary.",
            analyzedAt: new Date(reviewRecord.timestamp).toLocaleTimeString(),
          }}
          rows={comparativeRows}
          patient1={{
            ...patient1,
            id: reviewRecord.patient1.id,
            name: reviewRecord.patient1.name,
            ward: reviewRecord.patient1.ward,
            pathogen: reviewRecord.patient1.pathogen,
            specimen: reviewRecord.patient1.specimen,
          }}
          patient2={{
            ...patient2,
            id: reviewRecord.patient2.id,
            name: reviewRecord.patient2.name,
            ward: reviewRecord.patient2.ward,
            pathogen: reviewRecord.patient2.pathogen,
            specimen: reviewRecord.patient2.specimen,
          }}
        />
      )}

      {/* Universal Report Verification Modal (Dual Doctor & Patient Portal) */}
      <CodeLookupModal
        isOpen={codeLookupOpen}
        onClose={() => setCodeLookupOpen(false)}
        initialCode={initialLookupCode}
      />
    </div>
  );
}
