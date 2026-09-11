# Pharma Resist Pro 🧬🔬
### AI-Powered Dual-Patient Antibiogram Cross-Resistance & Clinical Stewardship Platform

**Pharma Resist Pro** is a clinical microbiology and antimicrobial resistance (AMR) analytics platform designed for infection control teams, hospital epidemiologists, and clinical pharmacologists. It compares antibiogram panels (AST) between two patients, calculates cross-resistance risks, evaluates host clinical biomarkers (blood group, anemia, eGFR, weight, prior antibiotic misuse), and provides dual-perspective doctor and patient guidance verified by a unique access key.

---

## 🌟 Key Features

1. **Dual Antibiogram Comparison & AST Cross-Analysis**:
   - Compares Antimicrobial Susceptibility Testing (AST) panels across both patients.
   - Computes Cross-Resistance Overlap Score and dynamic Compatibility Index.
   - Flags shared critical resistance drivers (e.g., Carbapenemases `blaKPC-3`, Metallo-beta-lactamases, Fluoroquinolone efflux pumps).

2. **Verified Patient Clinical Biomarkers**:
   - **Blood Group & Anemia Profile**: Hemoglobin (g/dL) severity mapping.
   - **Body Vitals & Clearance**: Weight, Height, BMI, and Cockcroft-Gault estimated eGFR (mL/min) to guide nephrotoxic dosing.
   - **Host Immunity & Virulence**: Pathogen virulence classification and prior antibiotic misuse tracking.

3. **Unique Report Access Code & Dual-Perspective Verification Portal**:
   - Generates official verification codes (e.g., `PRP-9021-8842-8801`).
   - **Doctor Portal**: Full phenotypic resistance tables, genomic markers, and salvage therapy regimens.
   - **Patient Portal**: Plain-language explanations of resistance without clinical jargon, reassuring guidance, and safety reminders.

4. **Actionable Risk Mitigation & Pharmacological Mode of Action**:
   - Step-by-step barrier isolation and PK/PD antibiotic infusion protocols.
   - Comprehensive biochemical catalog detailing drug targets, bacterial mutation pathways, and clinical counter-strategies.

---

## 📂 Project Directory Structure

```text
pharma-resist-pro/
├── index.html                   # HTML entry point
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript compiler config
├── vite.config.ts               # Vite configuration with Tailwind CSS v4
├── server.ts                    # Express + Gemini AI backend server
├── metadata.json                # Applet configuration metadata
├── .gitignore                   # Files excluded from git
├── README.md                    # Project documentation
└── src/
    ├── main.tsx                 # Client entry point
    ├── App.tsx                  # Primary application component
    ├── index.css                # Global styling with Tailwind CSS
    ├── types.ts                 # TypeScript data contracts & interfaces
    ├── data/
    │   └── mockData.ts          # Clinical scenarios, drug catalog & templates
    └── components/
        ├── Navbar.tsx           # Navigation bar with verification code trigger
        ├── DualPatientScanner.tsx # Dual AST panel input & biomarker calibration
        ├── ComparativeAnalysisOutput.tsx # Analysis gauges, reports & protocols
        ├── ClinicalParameterControlModal.tsx # Host biomarker calibration modal
        ├── CodeLookupModal.tsx  # Dual Doctor & Patient portal verification modal
        ├── CameraCaptureModal.tsx # Mobile/webcam AST scanner modal
        ├── PatientRecordsView.tsx # Archived comparative records & export
        ├── LabAnalyticsView.tsx # AMR surveillance trends & distribution
        └── ReportModal.tsx      # Printable PDF-style clinical report summary
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository or extract the downloaded project folder:
   ```bash
   git clone https://github.com/YOUR_USERNAME/pharma-resist-pro.git
   cd pharma-resist-pro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Set up your Gemini API key in a `.env` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(The app also includes a fully functional offline clinical rule-engine if an API key is not configured).*

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts, Motion
- **Backend**: Node.js, Express, tsx, esbuild
- **AI & Reasoning**: Google Gen AI SDK (`@google/genai`) with Gemini models
