import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Camera,
  FileText,
  FileImage,
  CheckCircle2,
  Trash2,
  ScanLine,
  Sparkles,
  Layers,
  ArrowLeftRight,
  HelpCircle,
  FileCheck,
  AlertCircle,
  Stethoscope,
  Sliders,
  Droplets,
  HeartPulse,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { PatientData, PatientClinicalParameters } from "../types";
import { SAMPLE_SCENARIOS } from "../data/mockData";
import { CameraModal } from "./CameraModal";
import { ClinicalParameterControlModal } from "./ClinicalParameterControlModal";

interface DualPatientScannerProps {
  patient1: PatientData;
  setPatient1: React.Dispatch<React.SetStateAction<PatientData>>;
  patient2: PatientData;
  setPatient2: React.Dispatch<React.SetStateAction<PatientData>>;
  onRunScan: () => void;
  isScanning: boolean;
}

export const DualPatientScanner: React.FC<DualPatientScannerProps> = ({
  patient1,
  setPatient1,
  patient2,
  setPatient2,
  onRunScan,
  isScanning,
}) => {
  const [cameraModalTarget, setCameraModalTarget] = useState<"p1" | "p2" | null>(null);
  const [clinicalParamsTarget, setClinicalParamsTarget] = useState<"p1" | "p2" | null>(null);
  const [dragOverP1, setDragOverP1] = useState(false);
  const [dragOverP2, setDragOverP2] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>("icuCarbapenem");

  const p1FileInputRef = useRef<HTMLInputElement | null>(null);
  const p2FileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSaveClinicalParams = (updatedParams: PatientClinicalParameters) => {
    if (clinicalParamsTarget === "p1") {
      setPatient1((prev) => ({
        ...prev,
        clinicalParams: updatedParams,
      }));
    } else if (clinicalParamsTarget === "p2") {
      setPatient2((prev) => ({
        ...prev,
        clinicalParams: updatedParams,
      }));
    }
  };

  const handleFileUpload = (
    files: FileList | null,
    target: "p1" | "p2"
  ) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const previewUrl = URL.createObjectURL(file);

    const filePayload = {
      name: file.name,
      size: file.size,
      type: file.type || "application/pdf",
      previewUrl,
      uploadedAt: "Just now",
    };

    if (target === "p1") {
      setPatient1((prev) => ({
        ...prev,
        file: filePayload,
      }));
    } else {
      setPatient2((prev) => ({
        ...prev,
        file: filePayload,
      }));
    }
  };

  const handleScenarioChange = (key: string) => {
    setSelectedScenario(key);
    if (key === "icuCarbapenem") {
      setPatient1(SAMPLE_SCENARIOS.icuCarbapenem.p1);
      setPatient2(SAMPLE_SCENARIOS.icuCarbapenem.p2);
    } else if (key === "postOpSurgery") {
      setPatient1(SAMPLE_SCENARIOS.postOpSurgery.p1);
      setPatient2(SAMPLE_SCENARIOS.postOpSurgery.p2);
    }
  };

  const handleCameraCapture = (file: { name: string; size: number; type: string; previewUrl: string }) => {
    if (cameraModalTarget === "p1") {
      setPatient1((prev) => ({
        ...prev,
        file: { ...file, uploadedAt: "Camera Captured" },
      }));
    } else if (cameraModalTarget === "p2") {
      setPatient2((prev) => ({
        ...prev,
        file: { ...file, uploadedAt: "Camera Captured" },
      }));
    }
  };

  const renderPatientCard = (
    target: "p1" | "p2",
    patient: PatientData,
    setPatient: React.Dispatch<React.SetStateAction<PatientData>>,
    isDragOver: boolean,
    setIsDragOver: (b: boolean) => void,
    fileInputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    const isP1 = target === "p1";
    const labelNumber = isP1 ? "1" : "2";
    const tagBorder = isP1 ? "border-teal-500/40" : "border-cyan-500/40";
    const tagBg = isP1 ? "bg-teal-500/10 text-teal-300" : "bg-cyan-500/10 text-cyan-300";
    const resistantCount = patient.antibiotics.filter((a) => a.status === "Resistant").length;
    const sensitiveCount = patient.antibiotics.filter((a) => a.status === "Sensitive").length;
    const intermediateCount = patient.antibiotics.filter((a) => a.status === "Intermediate").length;

    return (
      <div
        id={`patient-upload-card-${target}`}
        className={`rounded-2xl glass-panel p-5 sm:p-6 border transition-all duration-300 ${
          isDragOver
            ? "border-teal-400 shadow-[0_0_25px_rgba(13,148,136,0.3)] bg-slate-800/80"
            : "border-slate-700/70 hover:border-slate-600/80 bg-slate-900/70"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFileUpload(e.dataTransfer.files, target);
        }}
      >
        {/* Card Header & Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <span
              className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold font-mono text-sm border ${tagBorder} ${tagBg}`}
            >
              P{labelNumber}
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">
                Person {labelNumber} Report Profile
              </h3>
              <p className="text-xs text-slate-400">
                Primary Antibiogram &amp; Isolate Data
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {patient.ward || "General Inpatient"}
          </span>
        </div>

        {/* Inputs: Patient ID, Name, Pathogen */}
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor={`patient-id-${target}`}
                className="block text-xs font-medium text-slate-300 mb-1"
              >
                Patient ID
              </label>
              <input
                id={`patient-id-${target}`}
                type="text"
                value={patient.id}
                onChange={(e) =>
                  setPatient((prev) => ({ ...prev, id: e.target.value }))
                }
                placeholder="e.g. P-9021"
                className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700/80 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor={`patient-name-${target}`}
                className="block text-xs font-medium text-slate-300 mb-1"
              >
                Patient Full Name
              </label>
              <input
                id={`patient-name-${target}`}
                type="text"
                value={patient.name}
                onChange={(e) =>
                  setPatient((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g. Marcus Vance"
                className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor={`patient-pathogen-${target}`}
                className="block text-xs font-medium text-slate-300 mb-1"
              >
                Isolated Pathogen
              </label>
              <input
                id={`patient-pathogen-${target}`}
                type="text"
                value={patient.pathogen}
                onChange={(e) =>
                  setPatient((prev) => ({ ...prev, pathogen: e.target.value }))
                }
                placeholder="e.g. Klebsiella pneumoniae"
                className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor={`patient-specimen-${target}`}
                className="block text-xs font-medium text-slate-300 mb-1"
              >
                Specimen Source
              </label>
              <input
                id={`patient-specimen-${target}`}
                type="text"
                value={patient.specimen}
                onChange={(e) =>
                  setPatient((prev) => ({ ...prev, specimen: e.target.value }))
                }
                placeholder="e.g. Endotracheal Aspirate"
                className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Drag & Drop Upload Zone + Camera Action */}
        <div className="mt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files, target)}
          />

          {!patient.file ? (
            <div
              id={`dropzone-${target}`}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                isDragOver
                  ? "border-teal-400 bg-teal-500/10"
                  : "border-slate-700 hover:border-teal-500/60 hover:bg-slate-800/40"
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-200">
                    <span className="text-teal-400 font-semibold underline underline-offset-2">
                      Click to upload
                    </span>{" "}
                    or drag &amp; drop AST report
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supports laboratory PDF, JPG, or PNG antibiograms
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Uploaded File Status Preview */
            <div
              id={`file-status-preview-${target}`}
              className="rounded-xl bg-slate-950/90 border border-teal-500/40 p-3.5 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-9 h-9 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                  {patient.file.type.includes("image") ? (
                    <FileImage className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>
                <div className="truncate">
                  <div className="flex items-center space-x-1.5">
                    <p className="text-xs font-semibold text-white truncate">
                      {patient.file.name}
                    </p>
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {(patient.file.size / 1024).toFixed(0)} KB • {patient.file.uploadedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 ml-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2 py-1 text-[11px] rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPatient((prev) => ({ ...prev, file: null }))
                  }
                  className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Camera Button Bar & Antibiogram counts */}
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              id={`scan-camera-button-${target}`}
              onClick={() => setCameraModalTarget(target)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-teal-400" />
              <span>Scan via Camera</span>
            </button>

            {/* Quick Antibiogram Summary Pill */}
            <div className="flex items-center space-x-1.5 text-[11px] font-mono">
              <span className="px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/50">
                {resistantCount} R
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/50">
                {intermediateCount} I
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                {sensitiveCount} S
              </span>
            </div>
          </div>

          {/* Verified Clinical Parameters Controller & Indicator */}
          <div className="mt-4 pt-3 border-t border-slate-800/90 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-200">
                <Sliders className="w-3.5 h-3.5 text-teal-400" />
                <span>Verified Clinical Parameters</span>
              </div>
              <button
                type="button"
                id={`configure-parameters-btn-${target}`}
                onClick={() => setClinicalParamsTarget(target)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-medium transition-colors"
              >
                <span>Edit / Calibrate</span>
              </button>
            </div>

            {patient.clinicalParams ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px] font-mono">
                <div className="bg-slate-950/70 border border-slate-800 rounded p-1.5">
                  <span className="text-slate-400 block text-[10px]">Blood &amp; Anemia:</span>
                  <span className="text-teal-300 font-bold">{patient.clinicalParams.bloodGroup}</span> &bull;{" "}
                  <span className={patient.clinicalParams.anemia.hasAnemia ? "text-rose-300" : "text-emerald-300"}>
                    {patient.clinicalParams.anemia.hemoglobin} g/dL
                  </span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded p-1.5">
                  <span className="text-slate-400 block text-[10px]">Weight &amp; BMI:</span>
                  <span className="text-white">{patient.clinicalParams.vitals.weightKg} kg</span> &bull;{" "}
                  <span className="text-cyan-300">BMI {patient.clinicalParams.vitals.bmi}</span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded p-1.5 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10px]">eGFR &amp; Creatinine:</span>
                  <span className="text-amber-300 font-bold">{patient.clinicalParams.bloodReport.eGfr} mL/min</span> &bull;{" "}
                  <span className="text-slate-300">{patient.clinicalParams.bloodReport.serumCreatinine} mg/dL</span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded p-1.5 col-span-2 sm:col-span-3 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="text-slate-400 text-[10px] mr-1">Prior Misuse:</span>
                    <span className="text-slate-200 truncate">{patient.clinicalParams.priorAntibioticMisuse || "None"}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-950/60 text-purple-300 border border-purple-800/40 shrink-0">
                    {patient.clinicalParams.pathogenVirulenceIndex} Virulence
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 bg-slate-950/40 border border-dashed border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
                <span>No clinical biomarkers configured yet.</span>
                <button
                  type="button"
                  onClick={() => setClinicalParamsTarget(target)}
                  className="text-teal-400 underline hover:text-teal-300 text-xs"
                >
                  Set Parameters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="dual-scanner-section" className="relative py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Preset Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <ScanLine className="w-5 h-5 text-teal-400" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Comparative Resistance Scanner (Person 1 vs Person 2)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Upload two antimicrobial sensitivity profiles to cross-correlate drug resistance, detect strain mutation divergence, and check transmission compatibility.
            </p>
          </div>

          {/* Quick Scenario Preset Dropdown */}
          <div className="flex items-center space-x-2 self-start md:self-auto bg-slate-900/90 border border-slate-700/80 rounded-xl p-1.5">
            <span className="text-xs text-slate-400 font-medium pl-2 hidden sm:inline">
              Sample Case:
            </span>
            <select
              value={selectedScenario}
              onChange={(e) => handleScenarioChange(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="icuCarbapenem">ICU CRE Overlap (K. pneumoniae vs A. baumannii)</option>
              <option value="postOpSurgery">Surgical Site (P. aeruginosa vs E. coli ESBL)</option>
            </select>
          </div>
        </div>

        {/* Side-by-Side Upload Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          {/* Left Box: Person 1 */}
          {renderPatientCard(
            "p1",
            patient1,
            setPatient1,
            dragOverP1,
            setDragOverP1,
            p1FileInputRef
          )}

          {/* Center Connector Badge (Desktop) */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-teal-500/60 shadow-[0_0_15px_rgba(13,148,136,0.4)] flex items-center justify-center text-cyan-400">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700 mt-1">
              VS
            </span>
          </div>

          {/* Right Box: Person 2 */}
          {renderPatientCard(
            "p2",
            patient2,
            setPatient2,
            dragOverP2,
            setDragOverP2,
            p2FileInputRef
          )}
        </div>

        {/* Central Action Trigger: High-Visibility Glowing CTA Button */}
        <div className="mt-8 flex flex-col items-center justify-center">
          <div className="relative group">
            {/* Glowing Aura */}
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition duration-300 animate-pulse-glow" />

            <button
              id="run-comparative-scan-button"
              onClick={onRunScan}
              disabled={isScanning}
              className="relative flex items-center justify-center space-x-3 px-8 sm:px-12 py-4 rounded-xl bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-400 text-slate-950 font-bold text-base tracking-wide shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {isScanning ? (
                <>
                  <div className="w-5 h-5 border-3 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Cross-Referencing Phenotypic &amp; Genomic AST Vectors...</span>
                </>
              ) : (
                <>
                  <ScanLine className="w-5 h-5 text-slate-950" />
                  <span>Run Comparative Scan &amp; Analysis</span>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
          </div>

          {/* Processing Status Tracker */}
          {isScanning && (
            <div className="mt-4 w-full max-w-md bg-slate-900/90 border border-teal-500/40 rounded-xl p-3 shadow-lg animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs text-teal-300 font-mono mb-1.5">
                <span>AI Clinical Inference Pipeline</span>
                <span className="animate-pulse">Active</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full rounded-full animate-laser" />
              </div>
              <p className="text-[11px] text-slate-400 mt-2 text-center">
                Comparing {patient1.antibiotics.length} antibiotic agents • Computing EUCAST cross-resistance matrices
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={cameraModalTarget !== null}
        patientTarget={cameraModalTarget || "p1"}
        patientLabel={cameraModalTarget === "p1" ? patient1.name : patient2.name}
        onClose={() => setCameraModalTarget(null)}
        onCapture={handleCameraCapture}
      />

      {/* Clinical Parameter Input & Calibration Modal */}
      {clinicalParamsTarget && (
        <ClinicalParameterControlModal
          isOpen={clinicalParamsTarget !== null}
          patientTarget={clinicalParamsTarget}
          patientName={clinicalParamsTarget === "p1" ? patient1.name : patient2.name}
          initialParams={
            (clinicalParamsTarget === "p1" ? patient1.clinicalParams : patient2.clinicalParams) ||
            SAMPLE_SCENARIOS.icuCarbapenem[clinicalParamsTarget].clinicalParams!
          }
          onClose={() => setClinicalParamsTarget(null)}
          onSave={handleSaveClinicalParams}
        />
      )}
    </section>
  );
};
