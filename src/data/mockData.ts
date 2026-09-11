import {
  PatientData,
  ComparativeDrugRow,
  ResistanceTrendData,
  RiskReductionStep,
  ModeOfActionItem,
} from "../types";

export const DEFAULT_CLINICAL_PARAMS_P1 = {
  bloodGroup: "B+" as const,
  anemia: {
    hasAnemia: true,
    hemoglobin: 9.6, // Moderate Anemia
    severity: "Moderate Anemia" as const,
  },
  comorbidities: ["Type 2 Diabetes Mellitus", "Stage 3 CKD", "Hypertension"],
  vitals: {
    weightKg: 78.5,
    heightCm: 174,
    bmi: 25.9,
    bsa: 1.94,
  },
  bloodReport: {
    wbc: 15.4, // Leukocytosis
    platelets: 210,
    serumCreatinine: 1.85, // Elevated
    eGfr: 42, // Reduced renal clearance
  },
  priorAntibioticMisuse: "Over-the-counter Ciprofloxacin & Azithromycin repeated courses (2025-2026)",
  pathogenVirulenceIndex: "High" as const,
  immunityCapacity: "Moderate (50%)" as const,
};

export const DEFAULT_CLINICAL_PARAMS_P2 = {
  bloodGroup: "O+" as const,
  anemia: {
    hasAnemia: false,
    hemoglobin: 13.8,
    severity: "None" as const,
  },
  comorbidities: ["Peripheral Vascular Disease", "Recent Prolonged ICU Ventilation"],
  vitals: {
    weightKg: 82.0,
    heightCm: 179,
    bmi: 25.6,
    bsa: 2.01,
  },
  bloodReport: {
    wbc: 18.2,
    platelets: 165,
    serumCreatinine: 1.40,
    eGfr: 58,
  },
  priorAntibioticMisuse: "Unprescribed Amoxicillin-Clavulanate empiric self-medication",
  pathogenVirulenceIndex: "Hypervirulent" as const,
  immunityCapacity: "Mildly Impaired (75%)" as const,
};

export const SAMPLE_SCENARIOS = {
  icuCarbapenem: {
    name: "ICU Carbapenem-Resistant Enterobacteriaceae (CRE) Overlap",
    description: "Compare Klebsiella pneumoniae (KPC+) vs Acinetobacter baumannii (CRAB)",
    p1: {
      id: "P-9021",
      name: "Marcus Vance",
      age: 58,
      gender: "Male" as const,
      ward: "ICU - Bed 04",
      pathogen: "Klebsiella pneumoniae (KPC-3+)",
      specimen: "Endotracheal Aspirate",
      collectionDate: "2026-09-08",
      file: {
        name: "Antibiogram_P9021_KPC.pdf",
        size: 1420000,
        type: "application/pdf",
        uploadedAt: "10:42 AM Today",
      },
      clinicalParams: DEFAULT_CLINICAL_PARAMS_P1,
      antibiotics: [
        { drug: "Meropenem", drugClass: "Carbapenem", status: "Resistant" as const, mic: ">= 16 ug/mL" },
        { drug: "Imipenem-Relebactam", drugClass: "Carbapenem / Beta-lactamase inhibitor", status: "Intermediate" as const, mic: "4 ug/mL" },
        { drug: "Ceftriaxone", drugClass: "3rd Gen Cephalosporin", status: "Resistant" as const, mic: ">= 64 ug/mL" },
        { drug: "Cefepime", drugClass: "4th Gen Cephalosporin", status: "Resistant" as const, mic: ">= 32 ug/mL" },
        { drug: "Ciprofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: ">= 4 ug/mL" },
        { drug: "Levofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: ">= 8 ug/mL" },
        { drug: "Piperacillin-Tazobactam", drugClass: "Penicillin combination", status: "Resistant" as const, mic: ">= 128 ug/mL" },
        { drug: "Amikacin", drugClass: "Aminoglycoside", status: "Intermediate" as const, mic: "16 ug/mL" },
        { drug: "Gentamicin", drugClass: "Aminoglycoside", status: "Resistant" as const, mic: ">= 16 ug/mL" },
        { drug: "Ceftazidime-Avibactam", drugClass: "Novel Beta-lactam inhibitor", status: "Sensitive" as const, mic: "<= 1 ug/mL" },
        { drug: "Colistin (Polymyxin E)", drugClass: "Polymyxin", status: "Sensitive" as const, mic: "<= 0.5 ug/mL" },
        { drug: "Tigecycline", drugClass: "Glycylcycline", status: "Sensitive" as const, mic: "0.5 ug/mL" },
      ],
    },
    p2: {
      id: "P-8842",
      name: "Arthur Pendelton",
      age: 64,
      gender: "Male" as const,
      ward: "Step-Down Unit - Bed 12",
      pathogen: "Acinetobacter baumannii (MDR)",
      specimen: "Deep Wound Swab",
      collectionDate: "2026-09-09",
      file: {
        name: "Culture_P8842_Acineto.png",
        size: 980000,
        type: "image/png",
        uploadedAt: "11:15 AM Today",
      },
      clinicalParams: DEFAULT_CLINICAL_PARAMS_P2,
      antibiotics: [
        { drug: "Meropenem", drugClass: "Carbapenem", status: "Resistant" as const, mic: ">= 32 ug/mL" },
        { drug: "Imipenem-Relebactam", drugClass: "Carbapenem / Beta-lactamase inhibitor", status: "Resistant" as const, mic: ">= 16 ug/mL" },
        { drug: "Ceftriaxone", drugClass: "3rd Gen Cephalosporin", status: "Resistant" as const, mic: ">= 64 ug/mL" },
        { drug: "Cefepime", drugClass: "4th Gen Cephalosporin", status: "Resistant" as const, mic: ">= 32 ug/mL" },
        { drug: "Ciprofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: ">= 8 ug/mL" },
        { drug: "Levofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: ">= 8 ug/mL" },
        { drug: "Piperacillin-Tazobactam", drugClass: "Penicillin combination", status: "Resistant" as const, mic: ">= 128 ug/mL" },
        { drug: "Amikacin", drugClass: "Aminoglycoside", status: "Resistant" as const, mic: ">= 64 ug/mL" },
        { drug: "Gentamicin", drugClass: "Aminoglycoside", status: "Resistant" as const, mic: ">= 16 ug/mL" },
        { drug: "Ceftazidime-Avibactam", drugClass: "Novel Beta-lactam inhibitor", status: "Resistant" as const, mic: ">= 16 ug/mL" },
        { drug: "Colistin (Polymyxin E)", drugClass: "Polymyxin", status: "Sensitive" as const, mic: "1 ug/mL" },
        { drug: "Tigecycline", drugClass: "Glycylcycline", status: "Sensitive" as const, mic: "1 ug/mL" },
      ],
    },
  },
  postOpSurgery: {
    name: "Surgical Site Infection: P. aeruginosa vs E. coli ESBL",
    description: "Compare Pseudomonas aeruginosa vs Escherichia coli (CTX-M-15)",
    p1: {
      id: "P-7719",
      name: "Sarah Lin",
      age: 39,
      gender: "Female" as const,
      ward: "Post-Op Surgery Ward B",
      pathogen: "Pseudomonas aeruginosa",
      specimen: "Surgical Site Fluid",
      collectionDate: "2026-09-07",
      file: {
        name: "Antibiogram_P7719_Pseudomonas.pdf",
        size: 1100000,
        type: "application/pdf",
        uploadedAt: "Yesterday 2:30 PM",
      },
      clinicalParams: {
        bloodGroup: "A+" as const,
        anemia: {
          hasAnemia: true,
          hemoglobin: 10.4,
          severity: "Mild Anemia" as const,
        },
        comorbidities: ["Post-Cesarean Recovery", "Mild Bronchial Asthma"],
        vitals: {
          weightKg: 62.0,
          heightCm: 165,
          bmi: 22.8,
          bsa: 1.68,
        },
        bloodReport: {
          wbc: 11.8,
          platelets: 280,
          serumCreatinine: 0.85,
          eGfr: 88,
        },
        priorAntibioticMisuse: "Prophylactic Cephalexin unmonitored for 10 days post-procedure",
        pathogenVirulenceIndex: "Moderate" as const,
        immunityCapacity: "Normal (100%)" as const,
      },
      antibiotics: [
        { drug: "Meropenem", drugClass: "Carbapenem", status: "Sensitive" as const, mic: "1 ug/mL" },
        { drug: "Imipenem-Relebactam", drugClass: "Carbapenem / Beta-lactamase inhibitor", status: "Sensitive" as const, mic: "0.5 ug/mL" },
        { drug: "Ceftriaxone", drugClass: "3rd Gen Cephalosporin", status: "Resistant" as const, mic: ">= 64 ug/mL" },
        { drug: "Cefepime", drugClass: "4th Gen Cephalosporin", status: "Intermediate" as const, mic: "8 ug/mL" },
        { drug: "Ciprofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: ">= 4 ug/mL" },
        { drug: "Levofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: ">= 8 ug/mL" },
        { drug: "Piperacillin-Tazobactam", drugClass: "Penicillin combination", status: "Sensitive" as const, mic: "8 ug/mL" },
        { drug: "Amikacin", drugClass: "Aminoglycoside", status: "Sensitive" as const, mic: "4 ug/mL" },
        { drug: "Gentamicin", drugClass: "Aminoglycoside", status: "Sensitive" as const, mic: "2 ug/mL" },
        { drug: "Ceftazidime-Avibactam", drugClass: "Novel Beta-lactam inhibitor", status: "Sensitive" as const, mic: "2 ug/mL" },
        { drug: "Colistin (Polymyxin E)", drugClass: "Polymyxin", status: "Sensitive" as const, mic: "1 ug/mL" },
        { drug: "Tigecycline", drugClass: "Glycylcycline", status: "Intermediate" as const, mic: "2 ug/mL" },
      ],
    },
    p2: {
      id: "P-7724",
      name: "David Kim",
      age: 44,
      gender: "Male" as const,
      ward: "General Surgery Bed 14",
      pathogen: "Escherichia coli (ESBL+)",
      specimen: "Urine & Catheter Tip",
      collectionDate: "2026-09-08",
      file: {
        name: "Culture_P7724_ESBL.png",
        size: 740000,
        type: "image/png",
        uploadedAt: "Yesterday 4:10 PM",
      },
      clinicalParams: {
        bloodGroup: "O-" as const,
        anemia: {
          hasAnemia: false,
          hemoglobin: 14.5,
          severity: "None" as const,
        },
        comorbidities: ["Recurrent Nephrolithiasis"],
        vitals: {
          weightKg: 75.0,
          heightCm: 176,
          bmi: 24.2,
          bsa: 1.91,
        },
        bloodReport: {
          wbc: 9.4,
          platelets: 240,
          serumCreatinine: 1.05,
          eGfr: 82,
        },
        priorAntibioticMisuse: "Multiple self-initiated courses of OTC Norfloxacin for dysuria",
        pathogenVirulenceIndex: "Moderate" as const,
        immunityCapacity: "Normal (100%)" as const,
      },
      antibiotics: [
        { drug: "Meropenem", drugClass: "Carbapenem", status: "Sensitive" as const, mic: "<= 0.25 ug/mL" },
        { drug: "Imipenem-Relebactam", drugClass: "Carbapenem / Beta-lactamase inhibitor", status: "Sensitive" as const, mic: "<= 0.25 ug/mL" },
        { drug: "Ceftriaxone", drugClass: "3rd Gen Cephalosporin", status: "Resistant" as const, mic: ">= 32 ug/mL" },
        { drug: "Cefepime", drugClass: "4th Gen Cephalosporin", status: "Resistant" as const, mic: ">= 16 ug/mL" },
        { drug: "Ciprofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: ">= 4 ug/mL" },
        { drug: "Levofloxacin", drugClass: "Fluoroquinolone", status: "Resistant" as const, mic: ">= 4 ug/mL" },
        { drug: "Piperacillin-Tazobactam", drugClass: "Penicillin combination", status: "Intermediate" as const, mic: "16 ug/mL" },
        { drug: "Amikacin", drugClass: "Aminoglycoside", status: "Sensitive" as const, mic: "2 ug/mL" },
        { drug: "Gentamicin", drugClass: "Aminoglycoside", status: "Intermediate" as const, mic: "4 ug/mL" },
        { drug: "Ceftazidime-Avibactam", drugClass: "Novel Beta-lactam inhibitor", status: "Sensitive" as const, mic: "<= 0.5 ug/mL" },
        { drug: "Colistin (Polymyxin E)", drugClass: "Polymyxin", status: "Sensitive" as const, mic: "<= 0.5 ug/mL" },
        { drug: "Tigecycline", drugClass: "Glycylcycline", status: "Sensitive" as const, mic: "0.25 ug/mL" },
      ],
    },
  },
};

export const DEFAULT_PATIENT_1: PatientData = SAMPLE_SCENARIOS.icuCarbapenem.p1;
export const DEFAULT_PATIENT_2: PatientData = SAMPLE_SCENARIOS.icuCarbapenem.p2;

export const STANDARD_MODE_OF_ACTION_CATALOG: ModeOfActionItem[] = [
  {
    drugClass: "Carbapenems",
    representativeDrug: "Meropenem / Imipenem",
    targetOrganelle: "Penicillin-Binding Proteins (PBP-2 & PBP-3) in bacterial peptidoglycan wall",
    pharmacologicalAction: "Covalently acylates the transpeptidase enzyme domain, blocking cross-linking of peptide side chains, causing osmotic autolysis and bactericidal death.",
    bacterialResistanceMechanism: "Production of serine carbapenemases (blaKPC), metallo-beta-lactamases (blaNDM, blaVIM), and loss of outer membrane porin channels (OmpK35/36, OprD).",
    clinicalCounterStrategy: "Co-administer novel diazabicyclooctane (DBO) inhibitors (Avibactam, Relebactam) or cyclic boronic acid inhibitors (Vaborbactam); consider Cefiderocol for metallo-enzymes.",
  },
  {
    drugClass: "Fluoroquinolones",
    representativeDrug: "Ciprofloxacin / Levofloxacin",
    targetOrganelle: "Bacterial DNA Gyrase (GyrA/GyrB) & Topoisomerase IV (ParC/ParE)",
    pharmacologicalAction: "Traps the gyrase-DNA cleaved complex, precipitating double-stranded DNA breaks and triggering bacterial apoptotic SOS responses.",
    bacterialResistanceMechanism: "Chromosomal point mutations in the Quinolone Resistance-Determining Region (QRDR: Ser83Leu, Asp87Asn) and upregulation of multidrug efflux pumps (MexAB-OprM, AcrAB-TolC).",
    clinicalCounterStrategy: "Strict avoidance of fluoroquinolone monotherapy in hospital isolates; rotate to high-barrier aminoglycosides or intravenous polymyxin targeted therapy.",
  },
  {
    drugClass: "Cephalosporins (3rd/4th Gen)",
    representativeDrug: "Ceftriaxone / Cefepime",
    targetOrganelle: "PBP-1a, PBP-1b, and PBP-3 transpeptidases",
    pharmacologicalAction: "Interferes with peptidoglycan synthesis during active bacterial cell division, leading to cell elongation, spheroplast formation, and lysis.",
    bacterialResistanceMechanism: "Plasmid-mediated Extended-Spectrum Beta-Lactamases (ESBL: CTX-M, TEM, SHV) and stably derepressed chromosomal AmpC cephalosporinases.",
    clinicalCounterStrategy: "Avoid all 3rd gen cephalosporins even if in vitro susceptible (inoculum effect); use Cefepime/Zidebactam or transition to Carbapenem-sparing combinations.",
  },
  {
    drugClass: "Polymyxins",
    representativeDrug: "Colistin (Polymyxin E) / Polymyxin B",
    targetOrganelle: "Gram-negative outer membrane Lipopolysaccharide (LPS / Lipid A)",
    pharmacologicalAction: "Electrostatic displacement of Mg2+ and Ca2+ counterions on lipid A phosphate groups, causing permeabilization of bacterial membrane and leakage of intracellular contents.",
    bacterialResistanceMechanism: "Chromosomal mutations in pmrA/pmrB or phoP/phoQ two-component regulatory systems causing addition of 4-amino-4-deoxy-L-arabinose (L-Ara4N) or plasmid-borne mcr-1 to mcr-10 genes.",
    clinicalCounterStrategy: "Always pair Colistin with a synergy backbone (e.g. Meropenem or Tigecycline) to prevent in-therapy resistance emergence; monitor daily serum creatinine.",
  },
  {
    drugClass: "Glycylcyclines",
    representativeDrug: "Tigecycline / Eravacycline",
    targetOrganelle: "30S Ribosomal subunit (A-site tRNA binding)",
    pharmacologicalAction: "Binds reversibly to the 30S ribosomal subunit with 5x greater affinity than tetracyclines, blocking aminoacyl-tRNA accommodation and halting peptide elongation.",
    bacterialResistanceMechanism: "Hyper-expression of Resistance-Nodulation-Division (RND) type efflux pumps (AdeABC in A. baumannii, AcrAB in Enterobacteriaceae).",
    clinicalCounterStrategy: "Utilize high-dose strategy (200mg IV loading dose, then 100mg q12h); avoid for bloodstream infections due to low serum Cmax (large volume of distribution).",
  },
];

export const STANDARD_RISK_REDUCTION_GUIDE: RiskReductionStep[] = [
  {
    category: "Infection Control & Barrier",
    title: "Enforce Enhanced Contact Precautions (Level 4B)",
    action: "Place both patients in dedicated single-room contact isolation or cohort in dedicated MDRO bay. Mandatory gown, gloves, and dedicated bedside monitoring equipment (stethoscopes, BP cuffs).",
    priority: "Immediate",
  },
  {
    category: "PK/PD & Renal Dosing",
    title: "eGFR-Adjusted Extended Infusion Dosing",
    action: "For patients with CKD/low eGFR, adjust beta-lactam dosing intervals and administer via prolonged 3-hour or continuous IV infusions to optimize time above MIC (%fT > MIC > 70%).",
    priority: "Immediate",
  },
  {
    category: "Antimicrobial Stewardship",
    title: "Carbapenem-Sparing Step-Down Strategy",
    action: "De-escalate from empiric broad-spectrum carbapenems as soon as pathogen identity is verified. Reserve Ceftazidime-Avibactam or Cefiderocol strictly for molecularly verified resistant isolates.",
    priority: "High",
  },
  {
    category: "Host Immunity Support",
    title: "Anemia & Immunocompetence Management",
    action: "Support host defenses by treating moderate-to-severe anemia (target Hb > 10 g/dL), managing glycemic control (target blood glucose 140-180 mg/dL), and optimizing nutritional albumin levels.",
    priority: "Advisory",
  },
  {
    category: "Antimicrobial Stewardship",
    title: "Prior Antibiotic Misuse Audit",
    action: "Document and review patient's OTC antibiotic history to anticipate hidden collateral selection (e.g. quinolone-driven Clostridioides difficile colonization or fungal overgrowth).",
    priority: "Advisory",
  },
];

export function buildComparativeRows(p1: PatientData, p2: PatientData): ComparativeDrugRow[] {
  const rows: ComparativeDrugRow[] = [];
  const p1Map = new Map(p1.antibiotics.map((a) => [a.drug, a]));
  const p2Map = new Map(p2.antibiotics.map((a) => [a.drug, a]));

  const allDrugs = Array.from(new Set([...p1Map.keys(), ...p2Map.keys()]));

  for (const drug of allDrugs) {
    const a1 = p1Map.get(drug);
    const a2 = p2Map.get(drug);

    const p1Status = a1?.status || "Sensitive";
    const p2Status = a2?.status || "Sensitive";
    const drugClass = a1?.drugClass || a2?.drugClass || "Antimicrobial";

    let crossCompatibility: ComparativeDrugRow["crossCompatibility"] = "Divergent";
    let clinicalNote = "";

    if (p1Status === "Resistant" && p2Status === "Resistant") {
      crossCompatibility = "Shared Resistance";
      clinicalNote = "High hazard: Complete treatment failure risk across both patients.";
    } else if (p1Status === "Sensitive" && p2Status === "Sensitive") {
      crossCompatibility = "Sensitive to Both";
      clinicalNote = "Viable therapeutic candidate for both clinical isolates.";
    } else if (p1Status === "Intermediate" || p2Status === "Intermediate") {
      crossCompatibility = "Intermediate Overlap";
      clinicalNote = "Dose escalation or combination synergy required.";
    } else {
      crossCompatibility = "Divergent";
      clinicalNote = `Selective efficacy: Effective in ${p1Status === "Sensitive" ? p1.name : p2.name} only.`;
    }

    rows.push({
      id: drug.toLowerCase().replace(/\s+/g, "-"),
      drug,
      drugClass,
      p1Status,
      p1Mic: a1?.mic,
      p2Status,
      p2Mic: a2?.mic,
      crossCompatibility,
      clinicalNote,
    });
  }

  // Sort: Shared Resistance first, then Intermediate, then Divergent, then Sensitive to Both
  const orderWeight = {
    "Shared Resistance": 0,
    "Intermediate Overlap": 1,
    "Divergent": 2,
    "Sensitive to Both": 3,
  };

  return rows.sort((a, b) => orderWeight[a.crossCompatibility] - orderWeight[b.crossCompatibility]);
}

export const RESISTANCE_TREND_DATA: ResistanceTrendData[] = [
  { month: "Oct 2025", Carbapenems: 18.2, Fluoroquinolones: 44.5, Cephalosporins: 52.1, Aminoglycosides: 26.4, Glycopeptides: 8.1 },
  { month: "Nov 2025", Carbapenems: 19.1, Fluoroquinolones: 46.0, Cephalosporins: 54.3, Aminoglycosides: 25.8, Glycopeptides: 8.4 },
  { month: "Dec 2025", Carbapenems: 21.4, Fluoroquinolones: 47.8, Cephalosporins: 55.6, Aminoglycosides: 27.2, Glycopeptides: 9.0 },
  { month: "Jan 2026", Carbapenems: 23.0, Fluoroquinolones: 49.2, Cephalosporins: 58.0, Aminoglycosides: 28.5, Glycopeptides: 9.3 },
  { month: "Feb 2026", Carbapenems: 22.6, Fluoroquinolones: 48.7, Cephalosporins: 57.2, Aminoglycosides: 26.9, Glycopeptides: 8.8 },
  { month: "Mar 2026", Carbapenems: 24.5, Fluoroquinolones: 51.1, Cephalosporins: 59.8, Aminoglycosides: 29.1, Glycopeptides: 9.7 },
  { month: "Apr 2026", Carbapenems: 25.8, Fluoroquinolones: 52.4, Cephalosporins: 61.2, Aminoglycosides: 30.0, Glycopeptides: 10.2 },
  { month: "May 2026", Carbapenems: 27.3, Fluoroquinolones: 54.0, Cephalosporins: 63.5, Aminoglycosides: 31.4, Glycopeptides: 10.8 },
  { month: "Jun 2026", Carbapenems: 26.7, Fluoroquinolones: 53.2, Cephalosporins: 62.0, Aminoglycosides: 30.8, Glycopeptides: 10.1 },
  { month: "Jul 2026", Carbapenems: 28.9, Fluoroquinolones: 55.6, Cephalosporins: 64.7, Aminoglycosides: 32.5, Glycopeptides: 11.4 },
  { month: "Aug 2026", Carbapenems: 30.2, Fluoroquinolones: 57.1, Cephalosporins: 66.3, Aminoglycosides: 33.1, Glycopeptides: 11.9 },
  { month: "Sep 2026", Carbapenems: 31.5, Fluoroquinolones: 58.4, Cephalosporins: 67.8, Aminoglycosides: 34.0, Glycopeptides: 12.3 },
];

export const PATHOGEN_BREAKDOWN = [
  { pathogen: "K. pneumoniae", isolates: 4820, mdrRate: 46.2, riskColor: "#F43F5E" },
  { pathogen: "P. aeruginosa", isolates: 3940, mdrRate: 38.5, riskColor: "#FB923C" },
  { pathogen: "A. baumannii", isolates: 2810, mdrRate: 74.8, riskColor: "#EF4444" },
  { pathogen: "E. coli (ESBL)", isolates: 5120, mdrRate: 31.2, riskColor: "#FBBF24" },
  { pathogen: "S. aureus (MRSA)", isolates: 3400, mdrRate: 41.0, riskColor: "#E11D48" },
  { pathogen: "E. faecium (VRE)", isolates: 1240, mdrRate: 59.4, riskColor: "#DC2626" },
];

export const QUICK_STATS = {
  totalReportsScanned: 14892,
  reportsScannedDelta: "+8.4%",
  criticalAlerts: 142,
  alertsDelta: "+12 active",
  activeStrainsMonitored: 28,
  strainsDelta: "6 High-Concern",
  efficacyIndex: "94.2%",
  efficacyDelta: "+1.8% alignment",
};
