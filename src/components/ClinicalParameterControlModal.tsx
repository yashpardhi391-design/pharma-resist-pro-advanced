import React, { useState } from "react";
import {
  Sliders,
  X,
  HeartPulse,
  Droplets,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Dna,
  Scale,
  Sparkles,
  Info,
  ChevronRight,
  Stethoscope,
} from "lucide-react";
import {
  PatientData,
  BloodGroup,
  AnemiaSeverity,
  VirulenceIndex,
  ImmunityCapacity,
  PatientClinicalParameters,
} from "../types";

interface ClinicalParameterControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient1: PatientData;
  setPatient1: React.Dispatch<React.SetStateAction<PatientData>>;
  patient2: PatientData;
  setPatient2: React.Dispatch<React.SetStateAction<PatientData>>;
  initialTarget?: "p1" | "p2";
}

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const VIRULENCE_OPTIONS: VirulenceIndex[] = ["Low", "Moderate", "High", "Hypervirulent"];
const IMMUNITY_OPTIONS: ImmunityCapacity[] = [
  "Normal (100%)",
  "Mildly Impaired (75%)",
  "Moderate (50%)",
  "Severely Compromised (25%)",
];

const COMMON_COMORBIDITIES = [
  "Type 2 Diabetes Mellitus",
  "Stage 3-4 CKD",
  "Essential Hypertension",
  "Immunosuppressed / Chemo",
  "Chronic Liver Disease",
  "COPD / Respiratory Failure",
  "Peripheral Vascular Disease",
  "Recent Prolonged ICU Ventilation",
];

const PRIOR_MISUSE_PRESETS = [
  "Frequent OTC Azithromycin & Ciprofloxacin in past 90 days",
  "Incomplete course of Fluoroquinolones (stopped at day 3)",
  "Self-medicated Amoxicillin-Clavulanate for viral symptoms",
  "Recurrent unprescribed Norfloxacin for dysuria",
  "None / Verified strictly prescribed inpatient regimens",
];

export const ClinicalParameterControlModal: React.FC<ClinicalParameterControlModalProps> = ({
  isOpen,
  onClose,
  patient1,
  setPatient1,
  patient2,
  setPatient2,
  initialTarget = "p1",
}) => {
  const [activeTarget, setActiveTarget] = useState<"p1" | "p2">(initialTarget);

  if (!isOpen) return null;

  const currentPatient = activeTarget === "p1" ? patient1 : patient2;
  const setCurrentPatient = activeTarget === "p1" ? setPatient1 : setPatient2;
  const params = currentPatient.clinicalParams;

  // Helpers to update params
  const updateParams = (updates: Partial<PatientClinicalParameters>) => {
    setCurrentPatient((prev) => {
      const updated = {
        ...prev.clinicalParams,
        ...updates,
      };
      return {
        ...prev,
        clinicalParams: updated,
      };
    });
  };

  // Live BMI & BSA computation
  const handleWeightHeightChange = (weightKg: number, heightCm: number) => {
    const heightM = heightCm / 100;
    const bmi = heightM > 0 ? parseFloat((weightKg / (heightM * heightM)).toFixed(1)) : 22.0;
    // Mosteller formula: BSA = sqrt((weight * height) / 3600)
    const bsa = parseFloat(Math.sqrt((weightKg * heightCm) / 3600).toFixed(2));

    updateParams({
      vitals: {
        weightKg,
        heightCm,
        bmi,
        bsa,
      },
    });
  };

  // Hemoglobin & Anemia classification
  const handleHemoglobinChange = (hb: number) => {
    let severity: AnemiaSeverity = "None";
    let hasAnemia = false;
    if (hb < 8.0) {
      severity = "Severe Anemia";
      hasAnemia = true;
    } else if (hb < 11.0) {
      severity = "Moderate Anemia";
      hasAnemia = true;
    } else if (hb < 13.0) {
      severity = "Mild Anemia";
      hasAnemia = true;
    } else {
      severity = "None";
      hasAnemia = false;
    }

    updateParams({
      anemia: {
        hasAnemia,
        hemoglobin: hb,
        severity,
      },
    });
  };

  // Serum creatinine and estimated eGFR (Cockcroft-Gault simplified approximation)
  const handleCreatinineChange = (creat: number) => {
    const age = currentPatient.age || 50;
    const weight = params.vitals.weightKg || 70;
    const isFemale = currentPatient.gender === "Female";
    // Cockcroft-Gault CrCl = ((140 - age) * weight) / (72 * creat) * (0.85 if female)
    let egfr = Math.round(((140 - age) * weight) / (72 * Math.max(0.4, creat)) * (isFemale ? 0.85 : 1.0));
    egfr = Math.max(10, Math.min(130, egfr));

    updateParams({
      bloodReport: {
        ...params.bloodReport,
        serumCreatinine: creat,
        eGfr: egfr,
      },
    });
  };

  // Comorbidity toggle
  const toggleComorbidity = (item: string) => {
    const exists = params.comorbidities.includes(item);
    const updated = exists
      ? params.comorbidities.filter((c) => c !== item)
      : [...params.comorbidities, item];
    updateParams({ comorbidities: updated });
  };

  // Preset loaders
  const applyPreset = (presetName: string) => {
    if (presetName === "icu") {
      updateParams({
        bloodGroup: "B+",
        anemia: { hasAnemia: true, hemoglobin: 9.4, severity: "Moderate Anemia" },
        comorbidities: ["Type 2 Diabetes Mellitus", "Stage 3-4 CKD", "Recent Prolonged ICU Ventilation"],
        vitals: { weightKg: 84, heightCm: 175, bmi: 27.4, bsa: 2.02 },
        bloodReport: { wbc: 19.5, platelets: 140, serumCreatinine: 2.1, eGfr: 38 },
        priorAntibioticMisuse: "Frequent OTC Azithromycin & Ciprofloxacin in past 90 days",
        pathogenVirulenceIndex: "Hypervirulent",
        immunityCapacity: "Moderate (50%)",
      });
    } else if (presetName === "surgical") {
      updateParams({
        bloodGroup: "A+",
        anemia: { hasAnemia: true, hemoglobin: 11.2, severity: "Mild Anemia" },
        comorbidities: ["Essential Hypertension"],
        vitals: { weightKg: 65, heightCm: 168, bmi: 23.0, bsa: 1.74 },
        bloodReport: { wbc: 11.2, platelets: 260, serumCreatinine: 0.9, eGfr: 85 },
        priorAntibioticMisuse: "Self-medicated Amoxicillin-Clavulanate for viral symptoms",
        pathogenVirulenceIndex: "Moderate",
        immunityCapacity: "Normal (100%)",
      });
    } else if (presetName === "renal") {
      updateParams({
        bloodGroup: "O+",
        anemia: { hasAnemia: true, hemoglobin: 8.2, severity: "Moderate Anemia" },
        comorbidities: ["Stage 3-4 CKD", "Type 2 Diabetes Mellitus", "Immunosuppressed / Chemo"],
        vitals: { weightKg: 72, heightCm: 172, bmi: 24.3, bsa: 1.85 },
        bloodReport: { wbc: 14.8, platelets: 190, serumCreatinine: 3.4, eGfr: 21 },
        priorAntibioticMisuse: "Recurrent unprescribed Norfloxacin for dysuria",
        pathogenVirulenceIndex: "High",
        immunityCapacity: "Severely Compromised (25%)",
      });
    }
  };

  return (
    <div
      id="clinical-parameter-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-teal-500/40 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Verified Clinical Parameters & Biomarker Controls
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  EUCAST & CLSI Aligned
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Calibrate patient physical metrics, hematological counts, prior antibiotic exposures, and pathogen virulence.
              </p>
            </div>
          </div>
          <button
            id="close-params-modal-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient Switcher Tabs */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-950/40 border-b border-slate-800/80">
          <div className="flex items-center space-x-2">
            <button
              id="switch-param-target-p1"
              onClick={() => setActiveTarget("p1")}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTarget === "p1"
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                  : "bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-teal-400" />
              <span>Patient 1: {patient1.name} ({patient1.id})</span>
            </button>
            <button
              id="switch-param-target-p2"
              onClick={() => setActiveTarget("p2")}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTarget === "p2"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Patient 2: {patient2.name} ({patient2.id})</span>
            </button>
          </div>

          {/* Quick clinical presets */}
          <div className="hidden sm:flex items-center space-x-1.5 text-xs">
            <span className="text-slate-400 mr-1 text-[11px]">Lab Presets:</span>
            <button
              onClick={() => applyPreset("icu")}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px]"
            >
              ICU CRE
            </button>
            <button
              onClick={() => applyPreset("surgical")}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px]"
            >
              Post-Op
            </button>
            <button
              onClick={() => applyPreset("renal")}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px]"
            >
              Renal CKD
            </button>
          </div>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Blood Group & Hematology / Anemia */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4.5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-rose-400" />
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
                  1. Blood Group & Anemia Profiling
                </h4>
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  params.anemia.severity === "Severe Anemia"
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                    : params.anemia.severity === "Moderate Anemia"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : params.anemia.severity === "Mild Anemia"
                    ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                    : "bg-teal-500/20 text-teal-300 border-teal-500/30"
                }`}
              >
                {params.anemia.severity === "None" ? "Normocytic / Non-Anemic" : params.anemia.severity}
              </span>
            </div>

            {/* Blood Group Picker */}
            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-medium">
                Verified Blood Group:
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {BLOOD_GROUPS.map((bg) => {
                  const isSelected = params.bloodGroup === bg;
                  return (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => updateParams({ bloodGroup: bg })}
                      className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all ${
                        isSelected
                          ? "bg-rose-500 text-white shadow-md shadow-rose-500/30 ring-1 ring-rose-300"
                          : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60"
                      }`}
                    >
                      {bg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hemoglobin Level Slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Hemoglobin (Hb):</span>
                <span className="font-mono text-white font-bold text-sm">
                  {params.anemia.hemoglobin.toFixed(1)} <span className="text-xs text-slate-400">g/dL</span>
                </span>
              </div>
              <input
                type="range"
                min="5.0"
                max="18.0"
                step="0.1"
                value={params.anemia.hemoglobin}
                onChange={(e) => handleHemoglobinChange(parseFloat(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>5.0 (Severe)</span>
                <span>8.0 (Moderate)</span>
                <span>11.0 (Mild)</span>
                <span>13.5+ (Normal Range)</span>
              </div>
            </div>
          </div>

          {/* Section 2: Vitals, Physical Anthropometry & Renal Function */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4.5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Scale className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
                  2. Anthropometry & Renal Clearance (Weight, Height, eGFR)
                </h4>
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  BMI: {params.vitals.bmi} kg/m²
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  BSA: {params.vitals.bsa} m²
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Weight */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
                <label className="text-[11px] text-slate-400 block mb-1">Weight (kg):</label>
                <input
                  type="number"
                  min="30"
                  max="200"
                  step="0.5"
                  value={params.vitals.weightKg}
                  onChange={(e) =>
                    handleWeightHeightChange(parseFloat(e.target.value) || 70, params.vitals.heightCm)
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Height */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
                <label className="text-[11px] text-slate-400 block mb-1">Height (cm):</label>
                <input
                  type="number"
                  min="100"
                  max="230"
                  step="1"
                  value={params.vitals.heightCm}
                  onChange={(e) =>
                    handleWeightHeightChange(params.vitals.weightKg, parseFloat(e.target.value) || 170)
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Serum Creatinine */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-slate-400">Creatinine (mg/dL):</label>
                  {params.bloodReport.serumCreatinine > 1.3 && (
                    <span className="text-[10px] text-amber-400 font-semibold">Elevated</span>
                  )}
                </div>
                <input
                  type="number"
                  min="0.3"
                  max="12.0"
                  step="0.05"
                  value={params.bloodReport.serumCreatinine}
                  onChange={(e) => handleCreatinineChange(parseFloat(e.target.value) || 1.0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Computed eGFR */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
                <label className="text-[11px] text-slate-400 block mb-1">Estimated eGFR:</label>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-lg font-mono font-bold ${
                      params.bloodReport.eGfr < 30
                        ? "text-rose-400"
                        : params.bloodReport.eGfr < 60
                        ? "text-amber-400"
                        : "text-teal-300"
                    }`}
                  >
                    {params.bloodReport.eGfr}{" "}
                    <span className="text-xs font-normal text-slate-400">mL/min</span>
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                      params.bloodReport.eGfr < 30
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                        : params.bloodReport.eGfr < 60
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        : "bg-teal-500/20 text-teal-300 border-teal-500/30"
                    }`}
                  >
                    {params.bloodReport.eGfr < 30
                      ? "Severe CKD"
                      : params.bloodReport.eGfr < 60
                      ? "Moderate CKD"
                      : "Preserved"}
                  </span>
                </div>
              </div>
            </div>

            {/* WBC & Platelets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center justify-between bg-slate-900/70 border border-slate-800 rounded-lg p-3">
                <div>
                  <span className="text-xs text-slate-300 font-medium block">
                    White Blood Cells (WBC):
                  </span>
                  <span className="text-[10px] text-slate-400">Normal range: 4.5 - 11.0 × 10³/µL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1.0"
                    max="60.0"
                    step="0.5"
                    value={params.bloodReport.wbc}
                    onChange={(e) =>
                      updateParams({
                        bloodReport: {
                          ...params.bloodReport,
                          wbc: parseFloat(e.target.value) || 10.0,
                        },
                      })
                    }
                    className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm font-mono text-white text-right"
                  />
                  <span className="text-xs text-slate-400">×10³/µL</span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-900/70 border border-slate-800 rounded-lg p-3">
                <div>
                  <span className="text-xs text-slate-300 font-medium block">Platelets Count:</span>
                  <span className="text-[10px] text-slate-400">Normal range: 150 - 450 × 10³/µL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="20"
                    max="900"
                    step="5"
                    value={params.bloodReport.platelets}
                    onChange={(e) =>
                      updateParams({
                        bloodReport: {
                          ...params.bloodReport,
                          platelets: parseInt(e.target.value) || 200,
                        },
                      })
                    }
                    className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm font-mono text-white text-right"
                  />
                  <span className="text-xs text-slate-400">×10³/µL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Comorbidities / Pre-existing Diseases */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HeartPulse className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
                  3. Pre-existing Diseases & Comorbidities
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">
                {params.comorbidities.length} active conditions selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {COMMON_COMORBIDITIES.map((c) => {
                const isChecked = params.comorbidities.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleComorbidity(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                      isChecked
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                        : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isChecked ? "bg-emerald-400" : "bg-slate-600"}`} />
                    <span>{c}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Prior Antibiotic Misuse, Pathogen Virulence & Immunity Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prior Misuse */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4.5 space-y-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  4. Prior Antibiotic Misuse / Exposure History
                </h4>
              </div>
              <textarea
                rows={2}
                value={params.priorAntibioticMisuse}
                onChange={(e) => updateParams({ priorAntibioticMisuse: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
                placeholder="Specify any previous OTC consumption or incomplete antimicrobial courses..."
              />
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold block">Quick Misuse Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {PRIOR_MISUSE_PRESETS.slice(0, 3).map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => updateParams({ priorAntibioticMisuse: p })}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-left truncate max-w-full"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pathogen Virulence & Host Immunity Capacity */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4.5 space-y-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  5. Virulence & Host Immunity Index
                </h4>
              </div>

              {/* Virulence Index */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Pathogen Virulence Index:</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {VIRULENCE_OPTIONS.map((v) => {
                    const isSelected = params.pathogenVirulenceIndex === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => updateParams({ pathogenVirulenceIndex: v })}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all ${
                          isSelected
                            ? "bg-purple-600 text-white shadow-sm ring-1 ring-purple-400"
                            : "bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800"
                        }`}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Host Immunity Capacity */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Host Immunity Capacity:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {IMMUNITY_OPTIONS.map((imm) => {
                    const isSelected = params.immunityCapacity === imm;
                    return (
                      <button
                        key={imm}
                        type="button"
                        onClick={() => updateParams({ immunityCapacity: imm })}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all ${
                          isSelected
                            ? "bg-teal-600 text-white shadow-sm ring-1 ring-teal-300"
                            : "bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800 text-left"
                        }`}
                      >
                        {imm}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/70">
          <div className="text-xs text-slate-400">
            Parameters apply directly to clinical risk scoring, renal-adjusted dosing, and cross-comparison report.
          </div>
          <button
            id="save-and-close-params-btn"
            onClick={onClose}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-teal-500/20 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply Verified Parameters</span>
          </button>
        </div>
      </div>
    </div>
  );
};
