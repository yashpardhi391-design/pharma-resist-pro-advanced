export type ResistanceLevel = "Resistant" | "Intermediate" | "Sensitive";

export interface AntibioticItem {
  drug: string;
  drugClass: string;
  status: ResistanceLevel;
  mic?: string; // Minimum Inhibitory Concentration, e.g., ">= 16 ug/mL"
}

export type CrossCompatibilityStatus = 
  | "Shared Resistance" 
  | "Divergent" 
  | "Sensitive to Both" 
  | "Intermediate Overlap";

export interface ComparativeDrugRow {
  id: string;
  drug: string;
  drugClass: string;
  p1Status: ResistanceLevel;
  p1Mic?: string;
  p2Status: ResistanceLevel;
  p2Mic?: string;
  crossCompatibility: CrossCompatibilityStatus;
  clinicalNote?: string;
}

export interface PatientFile {
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  uploadedAt: string;
}

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type AnemiaSeverity = "None" | "Mild Anemia" | "Moderate Anemia" | "Severe Anemia";
export type VirulenceIndex = "Low" | "Moderate" | "High" | "Hypervirulent";
export type ImmunityCapacity = "Normal (100%)" | "Mildly Impaired (75%)" | "Moderate (50%)" | "Severely Compromised (25%)";

export interface PatientClinicalParameters {
  bloodGroup: BloodGroup;
  anemia: {
    hasAnemia: boolean;
    hemoglobin: number; // g/dL
    severity: AnemiaSeverity;
  };
  comorbidities: string[]; // e.g. Diabetes, CKD, Hypertension, Immunosuppression
  vitals: {
    weightKg: number;
    heightCm: number;
    bmi: number;
    bsa: number; // m²
  };
  bloodReport: {
    wbc: number; // x10^3/uL
    platelets: number; // x10^3/uL
    serumCreatinine: number; // mg/dL
    eGfr: number; // mL/min/1.73m²
  };
  priorAntibioticMisuse: string; // e.g. "Frequent OTC Azithromycin in past 90 days"
  pathogenVirulenceIndex: VirulenceIndex;
  immunityCapacity: ImmunityCapacity;
}

export interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  ward: string;
  pathogen: string;
  specimen: string;
  collectionDate: string;
  antibiotics: AntibioticItem[];
  file: PatientFile | null;
  clinicalParams: PatientClinicalParameters;
}

export type RiskLevel = "Low Risk" | "Moderate Risk" | "High Risk" | "Critical Risk";

export interface RiskReductionStep {
  category: "Infection Control & Barrier" | "PK/PD & Renal Dosing" | "Antimicrobial Stewardship" | "Host Immunity Support";
  title: string;
  action: string;
  priority: "Immediate" | "High" | "Advisory";
}

export interface ModeOfActionItem {
  drugClass: string;
  representativeDrug: string;
  targetOrganelle: string;
  pharmacologicalAction: string;
  bacterialResistanceMechanism: string;
  clinicalCounterStrategy: string;
}

export interface AnalysisOutput {
  uniqueAccessCode: string; // e.g. "PRP-9021-8842-749"
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  compatibilityPercentage: number; // 0 to 100 match/overlap
  criticalOverlaps: string[];
  mutatedStrainFlags: string[];
  suggestedAlternatives: string[];
  clinicalSummary: string;
  patientFriendlySummary: string;
  riskReductionGuide: RiskReductionStep[];
  modeOfActionList: ModeOfActionItem[];
  hostVulnerabilityNotes: string[];
  analyzedAt: string;
  source?: "gemini-3.8-flash" | "clinical-engine";
}

export interface SavedComparativeRecord {
  id: string;
  uniqueAccessCode: string;
  timestamp: string;
  patient1: {
    id: string;
    name: string;
    age: number;
    ward: string;
    pathogen: string;
    specimen: string;
    fileName?: string;
    clinicalParams?: PatientClinicalParameters;
  };
  patient2: {
    id: string;
    name: string;
    age: number;
    ward: string;
    pathogen: string;
    specimen: string;
    fileName?: string;
    clinicalParams?: PatientClinicalParameters;
  };
  compatibilityScore: number;
  riskLevel: RiskLevel;
  criticalOverlaps: string[];
  mutatedStrainFlags: string[];
  recommendedAlternatives: string[];
  clinicalSummary?: string;
  patientFriendlySummary?: string;
  riskReductionGuide?: RiskReductionStep[];
  modeOfActionList?: ModeOfActionItem[];
}

export interface ResistanceTrendData {
  month: string;
  Carbapenems: number;
  Fluoroquinolones: number;
  Cephalosporins: number;
  Aminoglycosides: number;
  Glycopeptides: number;
}

