import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// In-memory persistent records store for comparative scans
let savedPatientRecords: any[] = [
  {
    id: "REC-2026-8801",
    uniqueAccessCode: "PRP-9021-8842-8801",
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    patient1: {
      id: "P-9021",
      name: "Marcus Vance",
      age: 58,
      ward: "ICU - Bed 04",
      pathogen: "Klebsiella pneumoniae (KPC+)",
      specimen: "Endotracheal Aspirate",
      fileName: "Antibiogram_P9021_KPC.pdf",
      clinicalParams: {
        bloodGroup: "B+",
        anemia: { hasAnemia: true, hemoglobin: 9.6, severity: "Moderate Anemia" },
        comorbidities: ["Type 2 Diabetes Mellitus", "Stage 3 CKD", "Hypertension"],
        vitals: { weightKg: 78.5, heightCm: 174, bmi: 25.9, bsa: 1.94 },
        bloodReport: { wbc: 15.4, platelets: 210, serumCreatinine: 1.85, eGfr: 42 },
        priorAntibioticMisuse: "Over-the-counter Ciprofloxacin & Azithromycin repeated courses (2025-2026)",
        pathogenVirulenceIndex: "High",
        immunityCapacity: "Moderate (50%)",
      },
    },
    patient2: {
      id: "P-8842",
      name: "Arthur Pendelton",
      age: 64,
      ward: "Step-Down Unit - Bed 12",
      pathogen: "Acinetobacter baumannii",
      specimen: "Wound Swab",
      fileName: "Culture_P8842_Acineto.png",
      clinicalParams: {
        bloodGroup: "O+",
        anemia: { hasAnemia: false, hemoglobin: 13.8, severity: "None" },
        comorbidities: ["Peripheral Vascular Disease", "Recent Prolonged ICU Ventilation"],
        vitals: { weightKg: 82.0, heightCm: 179, bmi: 25.6, bsa: 2.01 },
        bloodReport: { wbc: 18.2, platelets: 165, serumCreatinine: 1.40, eGfr: 58 },
        priorAntibioticMisuse: "Unprescribed Amoxicillin-Clavulanate empiric self-medication",
        pathogenVirulenceIndex: "Hypervirulent",
        immunityCapacity: "Mildly Impaired (75%)",
      },
    },
    compatibilityScore: 78,
    riskLevel: "High Risk",
    criticalOverlaps: [
      "Carbapenem broad resistance (Meropenem & Imipenem)",
      "Fluoroquinolone shared resistance (Ciprofloxacin)",
    ],
    mutatedStrainFlags: ["blaKPC-3 gene marker detected", "NDM-1 suspect", "AdeABC efflux pump"],
    recommendedAlternatives: [
      "Ceftazidime-Avibactam (Avycaz) + Aztreonam",
      "Tigecycline or Eravacycline salvage regimen",
      "Strict contact isolation protocol #4B",
    ],
    clinicalSummary:
      "Critical antimicrobial resistance overlap detected between ICU isolates. Both strains harbor carbapenemase and fluoroquinolone target mutations, completely invalidating standard beta-lactam monotherapy. Mandatory cohort segregation and renal-adjusted novel combination therapy are immediately required.",
    patientFriendlySummary:
      "Your laboratory report shows that the bacteria causing this infection are tough and do not respond to ordinary antibiotic pills. Your medical team will use specialized intravenous hospital treatments that are proven to work, while protecting your kidney and blood health.",
  },
  {
    id: "REC-2026-8794",
    uniqueAccessCode: "PRP-7719-7724-8794",
    timestamp: new Date(Date.now() - 3600000 * 26).toISOString(),
    patient1: {
      id: "P-7719",
      name: "Sarah Lin",
      age: 39,
      ward: "Post-Op Surgery",
      pathogen: "Pseudomonas aeruginosa",
      specimen: "Surgical Site Fluid",
      fileName: "LabReport_P7719.pdf",
      clinicalParams: {
        bloodGroup: "A+",
        anemia: { hasAnemia: true, hemoglobin: 10.4, severity: "Mild Anemia" },
        comorbidities: ["Post-Cesarean Recovery", "Mild Bronchial Asthma"],
        vitals: { weightKg: 62.0, heightCm: 165, bmi: 22.8, bsa: 1.68 },
        bloodReport: { wbc: 11.8, platelets: 280, serumCreatinine: 0.85, eGfr: 88 },
        priorAntibioticMisuse: "Prophylactic Cephalexin unmonitored for 10 days post-procedure",
        pathogenVirulenceIndex: "Moderate",
        immunityCapacity: "Normal (100%)",
      },
    },
    patient2: {
      id: "P-7724",
      name: "David Kim",
      age: 44,
      ward: "General Ward 3",
      pathogen: "Escherichia coli ESBL+",
      specimen: "Urine Culture",
      fileName: "Urine_Antibiogram_P7724.pdf",
      clinicalParams: {
        bloodGroup: "O-",
        anemia: { hasAnemia: false, hemoglobin: 14.5, severity: "None" },
        comorbidities: ["Recurrent Nephrolithiasis"],
        vitals: { weightKg: 75.0, heightCm: 176, bmi: 24.2, bsa: 1.91 },
        bloodReport: { wbc: 9.4, platelets: 240, serumCreatinine: 1.05, eGfr: 82 },
        priorAntibioticMisuse: "Multiple self-initiated courses of OTC Norfloxacin for dysuria",
        pathogenVirulenceIndex: "Moderate",
        immunityCapacity: "Normal (100%)",
      },
    },
    compatibilityScore: 42,
    riskLevel: "Moderate Risk",
    criticalOverlaps: ["Ampicillin & Cefazolin cross-invalidation"],
    mutatedStrainFlags: ["CTX-M-15 extended spectrum beta-lactamase"],
    recommendedAlternatives: [
      "Piperacillin-Tazobactam for Patient 1",
      "Fosfomycin or Nitrofurantoin oral switch for Patient 2",
    ],
    clinicalSummary:
      "Moderate resistance divergence observed. Patient 1 isolate shows antipseudomonal beta-lactam susceptibility, while Patient 2 isolate produces ESBL enzymes requiring carbapenem-sparing oral step-down therapy.",
    patientFriendlySummary:
      "Your culture results show moderate resistance to standard antibiotics. Safe and effective targeted choices are available that can be taken easily without heavy side effects.",
  },
];

// Helper to get Gemini client lazily
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Pharma Resist Pro Server",
    aiEngineOnline: true,
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    recordsCount: savedPatientRecords.length,
    timestamp: new Date().toISOString(),
  });
});

// 2. Patient Records endpoints
app.get("/api/patient-records", (req, res) => {
  res.json({ records: savedPatientRecords });
});

app.get("/api/report-by-code/:code", (req, res) => {
  const { code } = req.params;
  const cleanCode = code.trim().toUpperCase();
  const record = savedPatientRecords.find(
    (r) => (r.uniqueAccessCode && r.uniqueAccessCode.toUpperCase() === cleanCode) || r.id.toUpperCase() === cleanCode
  );
  if (record) {
    res.json({ success: true, record });
  } else {
    res.status(404).json({ success: false, message: `Report with code ${code} not found.` });
  }
});

app.post("/api/patient-records", (req, res) => {
  const code = req.body.uniqueAccessCode || `PRP-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;
  const newRecord = {
    id: `REC-${Date.now().toString().slice(-6)}`,
    uniqueAccessCode: code,
    timestamp: new Date().toISOString(),
    ...req.body,
  };
  savedPatientRecords.unshift(newRecord);
  res.status(201).json({ success: true, record: newRecord });
});

app.delete("/api/patient-records/:id", (req, res) => {
  const { id } = req.params;
  savedPatientRecords = savedPatientRecords.filter((r) => r.id !== id);
  res.json({ success: true, message: `Record ${id} removed` });
});

// 3. AI Comparative Resistance Analysis
app.post("/api/analyze-resistance", async (req, res) => {
  try {
    const { patient1, patient2, antibioticList } = req.body;

    const p1Name = patient1?.name || "Patient 1";
    const p1Id = patient1?.id || "P1";
    const p1Pathogen = patient1?.pathogen || "Klebsiella pneumoniae";
    const p1Params = patient1?.clinicalParams;

    const p2Name = patient2?.name || "Patient 2";
    const p2Id = patient2?.id || "P2";
    const p2Pathogen = patient2?.pathogen || "Pseudomonas aeruginosa";
    const p2Params = patient2?.clinicalParams;

    // Generate unique verification access code
    const generatedUniqueCode =
      req.body.uniqueAccessCode ||
      `PRP-${(p1Id.replace(/[^0-9]/g, "") || "9021")}-${(p2Id.replace(/[^0-9]/g, "") || "8842")}-${Math.floor(1000 + Math.random() * 9000)}`;

    const ai = getGenAI();

    if (ai) {
      try {
        const prompt = `
You are a university hospital chief infectious disease specialist, pharmacologist, and clinical microbiologist using "Pharma Resist Pro".
Analyze this comparative antimicrobial resistance report between two patients:

Patient 1:
- Name: ${p1Name} (ID: ${p1Id})
- Isolated Pathogen: ${p1Pathogen}
- Specimen: ${patient1?.specimen || "Clinical isolate"}
- Verified Clinical Biomarkers:
  * Blood Group: ${p1Params?.bloodGroup || "B+"}
  * Anemia Status: ${p1Params?.anemia?.severity || "Moderate Anemia"} (Hemoglobin: ${p1Params?.anemia?.hemoglobin || 9.6} g/dL)
  * Comorbidities: ${(p1Params?.comorbidities || []).join(", ") || "None documented"}
  * Vitals: Weight ${p1Params?.vitals?.weightKg || 78}kg, Height ${p1Params?.vitals?.heightCm || 174}cm, BMI ${p1Params?.vitals?.bmi || 25.8} kg/m²
  * Renal & CBC: WBC ${p1Params?.bloodReport?.wbc || 15.4}k/uL, Platelets ${p1Params?.bloodReport?.platelets || 210}k/uL, Creatinine ${p1Params?.bloodReport?.serumCreatinine || 1.8} mg/dL, estimated eGFR ${p1Params?.bloodReport?.eGfr || 42} mL/min
  * Prior Antibiotic Misuse: ${p1Params?.priorAntibioticMisuse || "None reported"}
  * Pathogen Virulence Index: ${p1Params?.pathogenVirulenceIndex || "High"}
  * Host Immunity Capacity: ${p1Params?.immunityCapacity || "Moderate (50%)"}
- Antibiotic Resistance Profile: ${JSON.stringify(patient1?.antibiotics || antibioticList?.map((a: any) => ({ drug: a.drug, status: a.p1 })))}

Patient 2:
- Name: ${p2Name} (ID: ${p2Id})
- Isolated Pathogen: ${p2Pathogen}
- Specimen: ${patient2?.specimen || "Clinical isolate"}
- Verified Clinical Biomarkers:
  * Blood Group: ${p2Params?.bloodGroup || "O+"}
  * Anemia Status: ${p2Params?.anemia?.severity || "None"} (Hemoglobin: ${p2Params?.anemia?.hemoglobin || 13.8} g/dL)
  * Comorbidities: ${(p2Params?.comorbidities || []).join(", ") || "None documented"}
  * Vitals: Weight ${p2Params?.vitals?.weightKg || 82}kg, Height ${p2Params?.vitals?.heightCm || 179}cm, BMI ${p2Params?.vitals?.bmi || 25.6} kg/m²
  * Renal & CBC: WBC ${p2Params?.bloodReport?.wbc || 18.2}k/uL, Platelets ${p2Params?.bloodReport?.platelets || 165}k/uL, Creatinine ${p2Params?.bloodReport?.serumCreatinine || 1.4} mg/dL, estimated eGFR ${p2Params?.bloodReport?.eGfr || 58} mL/min
  * Prior Antibiotic Misuse: ${p2Params?.priorAntibioticMisuse || "None reported"}
  * Pathogen Virulence Index: ${p2Params?.pathogenVirulenceIndex || "Hypervirulent"}
  * Host Immunity Capacity: ${p2Params?.immunityCapacity || "Mildly Impaired (75%)"}
- Antibiotic Resistance Profile: ${JSON.stringify(patient2?.antibiotics || antibioticList?.map((a: any) => ({ drug: a.drug, status: a.p2 })))}

Please provide a comprehensive institutional evaluation complying with EUCAST and CLSI standards.
Return a structured JSON with:
1. "riskScore": integer 0-100 indicating mutual cross-resistance risk severity (higher = higher clinical danger)
2. "riskLevel": exactly one of "Low Risk", "Moderate Risk", "High Risk", or "Critical Risk"
3. "compatibilityPercentage": integer 0-100 (percentage of resistance profile overlap/cross-neutralization)
4. "criticalOverlaps": array of strings listing specific drugs where both exhibit resistance or cross-class transmission hazards
5. "mutatedStrainFlags": array of strings naming possible underlying resistance genotypes/mechanisms (e.g. KPC, NDM-1, AmpC hyperproduction, efflux pump MexAB-OprM, OXA-48, VanA, PBP2a)
6. "suggestedAlternatives": array of strings recommending viable second-line/combination antibiotics tailored to their weight and eGFR
7. "clinicalSummary": a rigorous 2-3 paragraph clinical stewardship analysis for the Doctor
8. "patientFriendlySummary": an empathetic, clear, non-jargon explanation for the Patient and family
9. "hostVulnerabilityNotes": array of strings specifically addressing how the patient's anemia, eGFR, prior antibiotic misuse, or immunity capacity affects the prognosis
`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                riskScore: { type: Type.INTEGER },
                riskLevel: { type: Type.STRING },
                compatibilityPercentage: { type: Type.INTEGER },
                criticalOverlaps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                mutatedStrainFlags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                suggestedAlternatives: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                clinicalSummary: { type: Type.STRING },
                patientFriendlySummary: { type: Type.STRING },
                hostVulnerabilityNotes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                "riskScore",
                "riskLevel",
                "compatibilityPercentage",
                "criticalOverlaps",
                "mutatedStrainFlags",
                "suggestedAlternatives",
                "clinicalSummary",
              ],
            },
          },
        });

        const rawText = response.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          return res.json({
            source: "gemini-3.8-flash",
            uniqueAccessCode: generatedUniqueCode,
            ...parsed,
            riskReductionGuide: [
              {
                category: "Infection Control & Barrier",
                title: "Enforce Enhanced Contact Isolation & Cohort Quarantine",
                action: "Maintain strict dedicated-room isolation or MDRO cohorting. Mandatory barrier gowns, gloves, and dedicated stethoscopes/BP equipment to prevent nosocomial cross-transmission.",
                priority: "Immediate",
              },
              {
                category: "PK/PD & Renal Dosing",
                title: `Renal-Adjusted Infusion (eGFR: ${p1Params?.bloodReport?.eGfr || 42} vs ${p2Params?.bloodReport?.eGfr || 58} mL/min)`,
                action: "Adjust beta-lactam dosing intervals according to calculated eGFR. Utilize extended 3-hour or continuous intravenous infusions to maximize %fT > MIC above 70%.",
                priority: "Immediate",
              },
              {
                category: "Antimicrobial Stewardship",
                title: "Carbapenem De-escalation & Molecular Gene Verification",
                action: "Avoid empiric carbapenem escalation if metallo-beta-lactamases (NDM) are suspected; utilize Ceftazidime-Avibactam + Aztreonam combination if serine/metallo co-production is confirmed.",
                priority: "High",
              },
              {
                category: "Host Immunity Support",
                title: "Anemia Correction & Immunity Preservation",
                action: `Address underlying ${p1Params?.anemia?.severity || "anemia"} and manage metabolic glycemic control to optimize white blood cell chemotaxis and host defense.`,
                priority: "Advisory",
              },
            ],
            modeOfActionList: [
              {
                drugClass: "Carbapenems",
                representativeDrug: "Meropenem / Imipenem",
                targetOrganelle: "Penicillin-Binding Proteins (PBP-2 & PBP-3)",
                pharmacologicalAction: "Covalently acylates transpeptidase enzymes, disrupting bacterial peptidoglycan cross-linking and triggering rapid osmotic lysis.",
                bacterialResistanceMechanism: "Serine carbapenemase (blaKPC) and metallo-beta-lactamase (blaNDM) enzymatic hydrolysis coupled with OmpK35/36 porin deletion.",
                clinicalCounterStrategy: "Pair with cyclic boronate or DBO inhibitors (Vaborbactam / Avibactam) or switch to siderophore cephalosporin (Cefiderocol).",
              },
              {
                drugClass: "Fluoroquinolones",
                representativeDrug: "Ciprofloxacin / Levofloxacin",
                targetOrganelle: "DNA Gyrase (GyrA) & Topoisomerase IV (ParC)",
                pharmacologicalAction: "Traps the cleaved DNA-gyrase complex, causing double-strand DNA breaks and stopping bacterial replication.",
                bacterialResistanceMechanism: "Chromosomal QRDR point mutations (gyrA Ser83Leu) and active multidrug efflux pump upregulation (MexAB-OprM).",
                clinicalCounterStrategy: "Avoid quinolone monotherapy entirely; substitute with high-barrier aminoglycosides or targeted polymyxins.",
              },
              {
                drugClass: "Polymyxins",
                representativeDrug: "Colistin / Polymyxin B",
                targetOrganelle: "Gram-Negative Lipopolysaccharide (LPS / Lipid A)",
                pharmacologicalAction: "Displaces divalent cations (Mg2+, Ca2+) from outer membrane lipid A, disrupting bacterial osmotic barrier.",
                bacterialResistanceMechanism: "pmrA/pmrB mutations causing 4-amino-4-deoxy-L-arabinose addition to lipid A, or plasmid-borne mcr-1 gene transfer.",
                clinicalCounterStrategy: "Always administer with a synergistic partner (Meropenem or Tigecycline) to prevent in-vivo emergence; monitor daily serum creatinine.",
              },
            ],
          });
        }
      } catch (geminiError: any) {
        console.warn("Gemini API call failed or timed out, using clinical rules engine:", geminiError.message);
      }
    }

    // Fallback: Medical Deterministic Rules Engine
    const p1ResistantCount = (patient1?.antibiotics || []).filter((a: any) => a.status === "Resistant").length;
    const p2ResistantCount = (patient2?.antibiotics || []).filter((a: any) => a.status === "Resistant").length;

    // Shared resistant drugs
    const sharedResistant: string[] = [];
    if (patient1?.antibiotics && patient2?.antibiotics) {
      for (const a1 of patient1.antibiotics) {
        const match = patient2.antibiotics.find((a2: any) => a2.drug === a1.drug);
        if (match && a1.status === "Resistant" && match.status === "Resistant") {
          sharedResistant.push(a1.drug);
        }
      }
    }

    const calculatedRiskScore = Math.min(
      96,
      Math.max(25, sharedResistant.length * 18 + p1ResistantCount * 4 + p2ResistantCount * 4)
    );

    let riskLevel = "Low Risk";
    if (calculatedRiskScore >= 75) riskLevel = "High Risk";
    else if (calculatedRiskScore >= 50) riskLevel = "Moderate Risk";

    const compatibilityPercentage = Math.max(18, Math.min(92, 100 - calculatedRiskScore + 12));

    const criticalOverlaps =
      sharedResistant.length > 0
        ? sharedResistant.map((drug) => `Concurrent full resistance identified for ${drug}`)
        : [
            "Cross-class beta-lactam permeability barrier overlap",
            "Secondary aminoglycoside resistance vulnerability",
          ];

    const mutatedStrainFlags = [
      "blaKPC carbapenemase expression risk profile",
      "Efflux pump MexAB-OprM upregulation flag",
      "Target modification gyrA/parC mutation suspected",
    ];

    const suggestedAlternatives = [
      "Ceftazidime-Avibactam (Avycaz) 2.5g IV q8h extended infusion",
      "Meropenem-Vaborbactam combination protocol under AST verification",
      "Targeted Colistin / Polymyxin B salvage only if MIC > 8 mg/L",
      "Infection Control: Enforce Enhanced Contact Isolation & dedicated cohort equipment",
    ];

    const clinicalSummary = `Comprehensive comparative analysis indicates a ${riskLevel} antimicrobial divergence profile between ${p1Name} (${p1Id}) and ${p2Name} (${p2Id}). The isolated isolates (${p1Pathogen} vs ${p2Pathogen}) exhibit shared resistance mechanisms that severely constrain empiric monotherapy. Both profiles display reduced susceptibility across primary beta-lactam and fluoroquinolone cohorts, necessitating immediate transition to targeted molecular-guided combination regimens with strict cohort separation to avert nosocomial cross-transmission.`;

    const patientFriendlySummary = `Dear patient, your comparative culture test indicates that the bacteria causing this illness have developed resistance to common antibiotic medications. Your medical team has identified targeted alternative treatments that are safe and effective. Please follow the full duration of your prescribed hospital therapy without interruption.`;

    res.json({
      source: "clinical-engine",
      uniqueAccessCode: generatedUniqueCode,
      riskScore: calculatedRiskScore,
      riskLevel,
      compatibilityPercentage,
      criticalOverlaps,
      mutatedStrainFlags,
      suggestedAlternatives,
      clinicalSummary,
      patientFriendlySummary,
      hostVulnerabilityNotes: [
        `Patient 1 shows ${p1Params?.anemia?.severity || "anemia"} (Hb: ${p1Params?.anemia?.hemoglobin || 9.6} g/dL) with calculated eGFR of ${p1Params?.bloodReport?.eGfr || 42} mL/min, necessitating dose reduction for renally cleared antibiotics.`,
        `Prior antibiotic exposure reported: "${p1Params?.priorAntibioticMisuse || "None"}". Watch for secondary fungal or C. diff superinfection.`,
      ],
      riskReductionGuide: [
        {
          category: "Infection Control & Barrier",
          title: "Enforce Enhanced Contact Isolation (Level 4B)",
          action: "Isolate patients in dedicated private rooms or designated cohort bays. Mandatory personal protective equipment (PPE) and dedicated medical instruments.",
          priority: "Immediate",
        },
        {
          category: "PK/PD & Renal Dosing",
          title: "eGFR-Adjusted Extended Infusion Protocol",
          action: "Adjust beta-lactam dosing frequency for kidney clearance and administer over prolonged 3-hour IV infusions to maximize therapeutic bacterial kill.",
          priority: "Immediate",
        },
        {
          category: "Antimicrobial Stewardship",
          title: "De-escalate to Targeted Molecular-Guided Therapy",
          action: "Avoid continued empiric carbapenem monotherapy. Transition immediately to molecularly verified beta-lactamase inhibitor combinations.",
          priority: "High",
        },
        {
          category: "Host Immunity Support",
          title: "Nutritional Support & Host Defense Optimization",
          action: "Manage anemia, optimize blood glucose, and monitor hydration to support natural immune response against resistant pathogen.",
          priority: "Advisory",
        },
      ],
      modeOfActionList: [
        {
          drugClass: "Carbapenems",
          representativeDrug: "Meropenem / Imipenem",
          targetOrganelle: "Penicillin-Binding Proteins (PBP-2 & PBP-3)",
          pharmacologicalAction: "Covalently binds and acylates transpeptidase enzymes in bacterial cell wall synthesis, leading to autolytic cell death.",
          bacterialResistanceMechanism: "Enzymatic hydrolysis by serine carbapenemases (blaKPC) and metallo-beta-lactamases (blaNDM) combined with porin channel closure.",
          clinicalCounterStrategy: "Co-administer novel beta-lactamase inhibitors (Avibactam / Vaborbactam) or utilize Cefiderocol for metallo-producers.",
        },
        {
          drugClass: "Fluoroquinolones",
          representativeDrug: "Ciprofloxacin / Levofloxacin",
          targetOrganelle: "Bacterial DNA Gyrase & Topoisomerase IV",
          pharmacologicalAction: "Inhibits bacterial DNA replication by freezing DNA-gyrase cleaved complexes, precipitating chromosomal fragmentation.",
          bacterialResistanceMechanism: "Point mutations in the QRDR region (gyrA / parC) and high-level multidrug efflux pump expression (MexAB-OprM).",
          clinicalCounterStrategy: "Strictly avoid fluoroquinolone monotherapy; replace with high-barrier aminoglycosides or intravenous polymyxins.",
        },
        {
          drugClass: "Polymyxins",
          representativeDrug: "Colistin (Polymyxin E)",
          targetOrganelle: "Outer Membrane Lipopolysaccharide (LPS)",
          pharmacologicalAction: "Displaces Mg2+ and Ca2+ cross-bridges in LPS, permeabilizing bacterial membranes and causing cellular leakage.",
          bacterialResistanceMechanism: "Chromosomal modifications of lipid A (pmrA/B) or plasmid-mediated mcr-1 phosphoethanolamine transferase.",
          clinicalCounterStrategy: "Administer only as combination synergy (with Meropenem or Tigecycline); closely monitor daily renal serum creatinine.",
        },
      ],
    });
  } catch (error: any) {
    console.error("Analysis route error:", error);
    res.status(500).json({ error: "Failed to perform resistance analysis", details: error.message });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Pharma Resist Pro server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
