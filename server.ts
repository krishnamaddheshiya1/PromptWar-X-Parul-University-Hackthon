import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Lazy server-side Gemini client initialization
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Resilient helper to clean markdown fences (```json ... ```) and safely parse JSON
function cleanAndParseJSON<T>(rawText: string | undefined | null, fallback: T): T {
  if (!rawText || typeof rawText !== "string") return fallback;

  let cleaned = rawText.trim();
  // Strip markdown code fences like ```json ... ``` or ``` ... ```
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");
  cleaned = cleaned.trim();

  try {
    const parsed = JSON.parse(cleaned);
    return parsed as T;
  } catch (err) {
    // Attempt to extract JSON bracketed boundaries if response had conversational framing
    const firstBracket = cleaned.indexOf("[");
    const lastBracket = cleaned.lastIndexOf("]");
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBracket !== -1 && lastBracket > firstBracket && (firstBrace === -1 || firstBracket < firstBrace)) {
      try {
        return JSON.parse(cleaned.slice(firstBracket, lastBracket + 1)) as T;
      } catch {
        // continue
      }
    } else if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)) as T;
      } catch {
        // continue
      }
    }

    console.warn("cleanAndParseJSON failed to parse text, returning fallback:", err);
    return fallback;
  }
}

// Fallback curated project ideas for reliable resilience
const FALLBACK_PROJECTS = [
  {
    id: "proj-neuroscan",
    title: "NeuroScan: Federated Brain Tumor MRI Segmentation & Explainable Heatmaps",
    tagline: "Privacy-preserving collaborative medical imaging with Grad-CAM visualization for clinical trust",
    category: "AI & Healthcare",
    complexity: "Research / Publication Grade",
    problemStatement:
      "Hospitals cannot easily pool sensitive patient MRI scans due to HIPAA/GDPR constraints, leading to localized data scarcity and biased neural network diagnostics.",
    practicalImpact:
      "Allows disparate healthcare institutions to collaboratively train robust 3D U-Net models without sharing raw MRI scans, displaying explainable saliency heatmaps for radiologists.",
    keyFeatures: [
      "Federated Averaging (FedAvg) client-server coordinator with differential privacy noise",
      "3D U-Net architecture for multi-modal brain lesion and tumor boundary segmentation",
      "Explainable AI (Grad-CAM & Integrated Gradients) visual overlay dashboard",
      "DICOM file parser and pre-processing pipeline (intensity normalization, skull stripping)",
    ],
    stretchFeatures: [
      "Quantized ONNX runtime for sub-second edge inference on standard diagnostic tablets",
      "Automated PDF Clinical Report generator adhering to standard radiological templates",
    ],
    techStack: {
      frontend: ["React 19", "Tailwind CSS", "Lucide React", "Cornerstone.js / Canvas"],
      backend: ["FastAPI", "Python 3.11", "Celery", "Redis"],
      ai_ml: ["PyTorch", "Flower (Federated Learning)", "MONAI", "Albumentations"],
      database: ["PostgreSQL", "MinIO / S3 for DICOM blobs"],
      hardware_cloud: ["CUDA GPU (Google Colab / Kaggle / Local RTX)", "Docker"],
    },
    academicRubric: {
      noveltyScore: 9,
      implementationFeasibility: 8,
      vivaAppeal: 10,
      industryRelevance: 10,
    },
    sampleDatasetSources: ["BraTS 2023/2024 Challenge Dataset", "The Cancer Imaging Archive (TCIA)"],
    vivaQuestions: [
      {
        question: "How does Federated Averaging safeguard patient data privacy mathematically?",
        guidance: "Explain weight delta updates instead of raw data transmission, combined with differential privacy Laplace/Gaussian noise to prevent model inversion attacks.",
      },
      {
        question: "Why use 3D U-Net over traditional 2D slice-by-slice Convolutional Networks?",
        guidance: "3D convolutions capture spatial inter-slice depth dependencies critical for measuring true volumetric tumor boundaries.",
      },
    ],
    estimatedWeeks: 16,
  },
  {
    id: "proj-aquapulse",
    title: "AquaPulse: LoRaWAN Multi-Parameter IoT River Monitor & Predictive Contamination Alerter",
    tagline: "Ultra-low-power edge sensing network with LSTM time-series heavy-metal contaminant forecasting",
    category: "IoT & Environmental Computing",
    complexity: "Advanced",
    problemStatement:
      "Industrial runoff into rivers is typically discovered days after contamination events, because manual water sampling is infrequent, sparse, and chemically delayed.",
    practicalImpact:
      "Real-time early warning telemetry deployed along river basins detects pH, turbidity, TDS, and dissolved oxygen deviations, forecasting pollutant dispersion plumes 6 hours before they reach municipal intake points.",
    keyFeatures: [
      "Solar-powered ESP32/STM32 node reading analog pH, Turbidity, TDS, DO, and temperature sensors",
      "Long-range LoRaWAN communication backhauling packet frames to The Things Network (TTN)",
      "LSTM / Prophet forecasting engine predicting contamination dispersion vectors",
      "Interactive GIS map dashboard with real-time geospatial alert thresholds and SMS webhooks",
    ],
    stretchFeatures: [
      "TinyML anomaly detection running directly on-microcontroller for immediate local acoustic alarm",
      "Decentralized tamper-proof logging of water test proof-of-audit",
    ],
    techStack: {
      frontend: ["React 19", "Leaflet / Mapbox GL", "Tailwind CSS", "Recharts"],
      backend: ["Node.js / Express", "MQTT Broker (Mosquitto)", "TimescaleDB"],
      ai_ml: ["TensorFlow Lite for Microcontrollers (TinyML)", "Scikit-Learn", "PyTorch LSTM"],
      database: ["TimescaleDB (PostgreSQL time-series)", "Redis Cache"],
      hardware_cloud: ["ESP32-S3", "SX1276 LoRa Module", "Analog Sensor Array", "Solar LiFePO4"],
    },
    academicRubric: {
      noveltyScore: 8,
      implementationFeasibility: 9,
      vivaAppeal: 9,
      industryRelevance: 9,
    },
    sampleDatasetSources: ["USGS Water Quality Data", "Kaggle Water Quality Assessment Dataset"],
    vivaQuestions: [
      {
        question: "How do you handle sensor drift and temperature compensation on analog pH probes?",
        guidance: "Explain Nernst equation calibration and software-based temperature calibration tables.",
      },
      {
        question: "What makes LoRaWAN preferable over standard 4G/GSM or Wi-Fi for river monitoring?",
        guidance: "Low power consumption enabling years on solar/battery, up to 10km line-of-sight range, and zero recurring cellular SIM costs.",
      },
    ],
    estimatedWeeks: 14,
  },
  {
    id: "proj-verichain",
    title: "VeriGrade: Zero-Knowledge Decentralized Academic Credential & Transcript Verification",
    tagline: "Cryptographic tamper-proof diploma verification preserving student GPA privacy with zk-SNARKs",
    category: "Cybersecurity & Blockchain",
    complexity: "Research / Publication Grade",
    problemStatement:
      "Resume fraud and fabricated degree certificates cost employers billions, while traditional verification requires weeks of manual registrar validation and exposes complete student grades.",
    practicalImpact:
      "Universities cryptographically sign diplomas on-chain; students can prove they graduated with a GPA >= 3.5 without revealing their exact transcript or course breakdown using zero-knowledge proofs.",
    keyFeatures: [
      "zk-SNARK circuits written in Circom proving threshold criteria without revealing private inputs",
      "Ethereum/Polygon Smart Contract registry for accredited university verification keys",
      "W3C Verifiable Credentials & Decentralized Identifier (DID) compliant format",
      "One-click QR Code employer verification scanner verifying cryptographic proofs in under 200ms",
    ],
    stretchFeatures: [
      "IPFS encrypted decentralized metadata storage with dual-key access delegation",
      "Gas-optimized batch verification contract reducing verification fee by 80%",
    ],
    techStack: {
      frontend: ["React 19", "Ethers.js / Viem", "Tailwind CSS", "Html5-Qrcode"],
      backend: ["Node.js / TypeScript", "SnarkJS", "Express API"],
      ai_ml: ["Circom 2.0 (zk-SNARK compiler)", "Groth16 proving system"],
      database: ["IPFS / Filecoin", "MongoDB for university registry indexing"],
      hardware_cloud: ["Polygon Amoy Testnet / Local Hardhat Node"],
    },
    academicRubric: {
      noveltyScore: 10,
      implementationFeasibility: 8,
      vivaAppeal: 10,
      industryRelevance: 9,
    },
    sampleDatasetSources: ["Synthetic University Registrar Transcript DB", "W3C VC Test Suite"],
    vivaQuestions: [
      {
        question: "What is a zk-SNARK and how does it prevent a student from faking a proof?",
        guidance: "Explain Zero-Knowledge Succinct Non-Interactive Argument of Knowledge, mathematical commitment polynomials, and soundness/completeness properties.",
      },
      {
        question: "Why not simply store the student's diploma and GPA in a regular public database or standard hash?",
        guidance: "Standard databases are vulnerable to rogue admin edits; public blockchain hashes reveal exact data unless salted, and standard hashes don't support selective range disclosures like 'GPA > 3.5'.",
      },
    ],
    estimatedWeeks: 14,
  },
  {
    id: "proj-edusync",
    title: "CodeSense: Autonomous Multimodal Programming Tutor with Real-time AST Debugging",
    tagline: "Interactive coding mentor that identifies student logical misconceptions before syntax compilation",
    category: "EdTech & Software Engineering",
    complexity: "Advanced",
    problemStatement:
      "Beginner programmers struggle with cryptic compiler error messages and stack traces, leading to high abandonment rates in introductory computer science courses.",
    practicalImpact:
      "Parses student code into Abstract Syntax Trees (AST) in real-time, matching anti-patterns and synthesizing custom step-by-step Socratic hints rather than just giving away copy-paste solutions.",
    keyFeatures: [
      "Browser-based Monaco code editor with live AST parse stream and linting tree",
      "Socratic Hint Generation engine that prompts students through guided reasoning",
      "Automated Test-Case synthesizer highlighting edge-case inputs that break student logic",
      "Teacher analytics dashboard identifying class-wide concept bottlenecks and syntax blockers",
    ],
    stretchFeatures: [
      "WebAssembly-isolated sandbox execution for C++, Python, and Java directly in-browser",
      "Code timeline scrubber replaying student keystrokes to detect struggle patterns",
    ],
    techStack: {
      frontend: ["React 19", "Monaco Editor", "Tailwind CSS", "Web Workers"],
      backend: ["Node.js / Express", "Tree-sitter AST parser", "Docker container runner"],
      ai_ml: ["Gemini 3.8 Flash for Socratic reasoning", "Tree-sitter Python/JS grammar"],
      database: ["PostgreSQL", "Redis"],
      hardware_cloud: ["Docker Sandbox runtime", "Cloud Run"],
    },
    academicRubric: {
      noveltyScore: 8,
      implementationFeasibility: 9,
      vivaAppeal: 9,
      industryRelevance: 10,
    },
    sampleDatasetSources: ["Codeforces / LeetCode public submissions", "Defects4J dataset"],
    vivaQuestions: [
      {
        question: "How do you securely execute arbitrary student submitted code without compromising the server?",
        guidance: "Explain containerization (Docker with gVisor/firecracker, dropped root privileges, memory limits, seccomp filters, and no network egress) or client-side WebAssembly.",
      },
      {
        question: "Why use Abstract Syntax Trees (AST) instead of raw text regex or naive string matching?",
        guidance: "AST represents structural semantics independent of variable naming and formatting, allowing detection of uninitialized variables, infinite loops, and dead code.",
      },
    ],
    estimatedWeeks: 12,
  },
];

// 1. API: Generate Project Ideas
app.post("/api/generate-ideas", async (req, res) => {
  try {
    const {
      interests = [],
      skills = [],
      degreeLevel = "Undergraduate (B.Tech/BS)",
      teamSize = 1,
      duration = "6 months",
      complexity = "Advanced",
      customTheme = "",
      hardware = "Standard Laptop",
    } = req.body;

    const ai = getAIClient();
    if (!ai) {
      console.warn("No GEMINI_API_KEY detected, providing curated domain projects.");
      return res.json({ projects: FALLBACK_PROJECTS, source: "curated" });
    }

    const prompt = `You are a distinguished Senior Computer Science Professor, Capstone Project Coordinator, and Research Director.
A final-year student (or team of ${teamSize}) is preparing their final-year capstone project.

Student Profile:
- Degree Level: ${degreeLevel}
- Domains of Interest: ${interests.length > 0 ? interests.join(", ") : "Modern Applied Computing, AI, Systems"}
- Existing Skills & Technologies: ${skills.length > 0 ? skills.join(", ") : "Python, JavaScript, SQL, Git"}
- Timeline: ${duration}
- Target Complexity: ${complexity}
- Hardware / Infrastructure: ${hardware}
${customTheme ? `- Specific Student Theme or Problem Area: "${customTheme}"` : ""}

Generate exactly 3 to 4 distinct, highly practical, academically rigorous, and impressive Final-Year Project Proposals.
Every project MUST:
1. Solve a genuine real-world problem with clear practical impact (not a trivial clone like a generic todo app or simple blog).
2. Be technically sound and completely feasible within the ${duration} timeline.
3. Feature high evaluation marks in typical academic project evaluation rubrics (Novelty, Technical Depth, Testing, Viva Appeal).
4. Include realistic tech stacks that match or extend the student's skills reasonably.
5. Provide 2 tough viva voce defense questions with model guidance.

Return ONLY a valid JSON array of objects conforming to this schema:
[
  {
    "id": "unique-slug-string",
    "title": "Full Academic Project Title",
    "tagline": "A punchy, informative one-line summary",
    "category": "e.g. AI & Healthcare / Cybersecurity / IoT / Cloud Systems",
    "complexity": "Moderate | Advanced | Research / Publication Grade",
    "problemStatement": "Precise real-world problem being addressed (2-3 sentences)",
    "practicalImpact": "How the solution benefits society, industry, or research (2-3 sentences)",
    "keyFeatures": ["Core feature 1", "Core feature 2", "Core feature 3", "Core feature 4"],
    "stretchFeatures": ["Stretch feature 1", "Stretch feature 2"],
    "techStack": {
      "frontend": ["Tech 1", "Tech 2"],
      "backend": ["Tech 1", "Tech 2"],
      "ai_ml": ["Model/Lib 1", "Model/Lib 2"],
      "database": ["DB 1"],
      "hardware_cloud": ["Cloud/Hardware 1"]
    },
    "academicRubric": {
      "noveltyScore": 8,
      "implementationFeasibility": 9,
      "vivaAppeal": 9,
      "industryRelevance": 9
    },
    "sampleDatasetSources": ["Dataset 1", "Dataset 2"],
    "vivaQuestions": [
      {
        "question": "Realistic challenging viva defense question",
        "guidance": "Key technical explanation and theoretical rationale expected by evaluators"
      },
      {
        "question": "Second challenging defense question",
        "guidance": "Key justification on architecture or performance tradeoff"
      }
    ],
    "estimatedWeeks": 14
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction:
          "You are an expert academic project advisor. You provide rigorous, innovative, feasible final-year project ideas structured cleanly as JSON.",
      },
    });

    const text = response.text || "[]";
    const parsedProjects = cleanAndParseJSON(text, FALLBACK_PROJECTS);
    if (!Array.isArray(parsedProjects) || parsedProjects.length === 0) {
      return res.json({ projects: FALLBACK_PROJECTS, source: "fallback" });
    }

    res.json({ projects: parsedProjects, source: "ai" });
  } catch (error: any) {
    console.error("Error in /api/generate-ideas:", error);
    res.json({ projects: FALLBACK_PROJECTS, source: "fallback_on_error", error: error.message });
  }
});

// 2. API: Generate Complete Roadmap & Milestone Plan
app.post("/api/generate-roadmap", async (req, res) => {
  try {
    const { project } = req.body;
    if (!project || !project.title) {
      return res.status(400).json({ error: "Missing project details" });
    }

    const ai = getAIClient();
    if (!ai) {
      // Provide robust curated default roadmap
      return res.json({
        milestones: generateDefaultMilestones(project),
        systemArchitecture: generateDefaultArchitecture(project),
        vivaDefenseGuide: project.vivaQuestions || [],
      });
    }

    const prompt = `You are a Senior Project Guide & Capstone Committee Chairperson.
Create a comprehensive 6-Phase Milestone Roadmap, System Architecture Blueprint, and Viva Voce Defense Prep for this Final-Year Project:

Project Title: "${project.title}"
Category: ${project.category}
Complexity: ${project.complexity}
Problem Statement: ${project.problemStatement}
Tech Stack: ${JSON.stringify(project.techStack)}
Key Features: ${JSON.stringify(project.keyFeatures)}

Return a strict JSON object with:
1. "milestones": array of exactly 6 academic milestone phases:
   Phase 1: Project Synopsis, Literature Review & Dataset Acquisition
   Phase 2: Architectural Design, DB Schema & Environment Baseline
   Phase 3: Core Algorithm / Model Pipeline / Core Logic Engine (MVP)
   Phase 4: Full Stack Integration, REST/gRPC API & Interactive UI
   Phase 5: Benchmarking, Validation, Unit/Load Testing & Error Handling
   Phase 6: Documentation, Final Thesis/Report, Demo Video & Viva Voce

For each milestone, provide:
- "id": string (e.g., "m1", "m2"...)
- "phase": number (1 to 6)
- "title": string
- "duration": string (e.g., "Weeks 1-2")
- "objective": string (1-2 sentences on what must be proven)
- "deliverables": array of 3-4 actionable items, each with { "id": "d-x-y", "title": string, "description": string, "completed": false }
- "academicTips": string (Advice on what college evaluators look for during this phase review)
- "gitBranchName": string (e.g., "phase-1/synopsis-and-data-prep")
- "suggestedCommit": string (Conventional commit message for completing this milestone)

2. "systemArchitecture": object with:
- "components": array of { "name": string, "role": string, "technologies": string }
- "dataFlow": array of 4-5 ordered steps describing end-to-end data/request flow
- "securityAndOptimization": array of 3-4 critical considerations (e.g. caching, sanitization, tokenization, model quantization)

3. "vivaDefenseGuide": array of 3-4 items with:
- "concept": string (e.g. "Tradeoff Analysis", "Latency vs Accuracy")
- "toughQuestion": string
- "strongAnswer": string (academic rationale that earns top marks)
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are an expert capstone supervisor. Return high-quality, practical roadmap plans in clean JSON.",
      },
    });

    const parsed = cleanAndParseJSON<any>(response.text, {});
    if (!parsed.milestones || !Array.isArray(parsed.milestones) || parsed.milestones.length === 0) {
      parsed.milestones = generateDefaultMilestones(project);
    }
    if (!parsed.systemArchitecture || !Array.isArray(parsed.systemArchitecture.components)) {
      parsed.systemArchitecture = generateDefaultArchitecture(project);
    }
    if (!parsed.vivaDefenseGuide || !Array.isArray(parsed.vivaDefenseGuide) || parsed.vivaDefenseGuide.length === 0) {
      parsed.vivaDefenseGuide = project.vivaQuestions || [];
    }

    res.json(parsed);
  } catch (error: any) {
    console.error("Error generating roadmap:", error);
    res.json({
      milestones: generateDefaultMilestones(req.body.project || { title: "Capstone Project" }),
      systemArchitecture: generateDefaultArchitecture(req.body.project || { title: "Capstone Project" }),
      vivaDefenseGuide: req.body.project?.vivaQuestions || [],
    });
  }
});

// 3. API: AI Mentor Chat
app.post("/api/mentor-chat", async (req, res) => {
  try {
    const { project, message, chatHistory = [], currentMilestone } = req.body;
    const ai = getAIClient();
    if (!ai) {
      return res.json({
        reply: `Hello! As your Capstone Project Mentor for "${project?.title || "your project"}", I recommend focusing on your deliverables for ${currentMilestone?.title || "the current phase"}. Ensure your data pipeline is reproducible and your Git commit history clearly reflects your experimental methodology. What specific technical obstacle are you facing right now?`,
      });
    }

    const contextPrompt = `You are "Prof. Alexander Vance", an experienced, encouraging, yet technically sharp Final-Year Project Mentor and University Evaluator.
You are mentoring a student working on their final-year engineering capstone project:
- Title: "${project?.title}"
- Problem: "${project?.problemStatement}"
- Tech Stack: ${JSON.stringify(project?.techStack)}
- Current Milestone: Phase ${currentMilestone?.phase || 1} - ${currentMilestone?.title || "General Progress"}

Student Question: "${message}"

Guidelines:
- Give concrete, actionable advice with code snippets, architecture tips, or academic defense pointers where relevant.
- Do NOT just write generic boilerplate; tailor your response directly to their stack and project domain.
- Keep the tone professional, supportive, and focused on helping them excel in their project defense.
- Format with clean Markdown (bullet points, bold highlights, code blocks).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contextPrompt,
      config: {
        systemInstruction: "You are a knowledgeable university capstone project guide and senior researcher.",
      },
    });

    res.json({ reply: response.text || "I'm reviewing your question. Could you clarify your current implementation?" });
  } catch (error: any) {
    console.error("Error in mentor chat:", error);
    res.json({
      reply: "I am having trouble connecting to the mentor service right now, but please verify your unit test coverage and verify your data inputs against your schema.",
    });
  }
});

// 4. API: AI Git Commit & PR Message Generator
app.post("/api/generate-commit", async (req, res) => {
  const { workSummary = "", currentBranch = "main", projectTitle = "", milestoneTitle = "" } = req.body;
  try {
    const ai = getAIClient();
    if (!ai) {
      const sanitized = (workSummary || "update feature implementation").slice(0, 50);
      return res.json({
        commitMessage: `feat(core): ${sanitized}`,
        branchName: currentBranch || "feature/implementation",
        gitCommands: `git add .\ngit commit -m "feat(core): ${sanitized}"\ngit push origin ${currentBranch || "main"}`,
        prDescription: `### Summary of Changes\n- ${workSummary}\n\n### Linked Milestone\n- ${milestoneTitle || "Core Development"}`,
      });
    }

    const prompt = `Student is working on: "${projectTitle || "Final Year Project"}"
Current Phase/Milestone: "${milestoneTitle || "Implementation"}"
Active Branch: "${currentBranch || "main"}"
What student actually did/completed:
"${workSummary}"

Generate a professional conventional commit message, Git branch name recommendation, shell commands, and concise PR review notes.
Return ONLY valid JSON matching:
{
  "commitMessage": "feat(scope): concise imperative sentence under 72 chars",
  "branchName": "feature/descriptive-slug",
  "gitCommands": "git add ...\\ngit commit -m ...",
  "prDescription": "Markdown summary of changes, motivation, and tests conducted"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const fallbackCommit = {
      commitMessage: `feat: progress on ${workSummary || "project milestone"}`,
      branchName: currentBranch || "feature/dev",
      gitCommands: `git add .\ngit commit -m "feat: ${workSummary || "update"}"`,
      prDescription: workSummary || "Progress update.",
    };

    const parsed = cleanAndParseJSON(response.text, fallbackCommit);
    res.json(parsed);
  } catch (error: any) {
    res.json({
      commitMessage: `feat: progress on ${workSummary || "project"}`,
      branchName: currentBranch || "feature/dev",
      gitCommands: `git add .\ngit commit -m "feat: ${workSummary || "update"}"`,
      prDescription: workSummary || "Progress update.",
    });
  }
});

// 5. API: AI Project Improvement & Defense Analyzer
app.post("/api/improve-project", async (req, res) => {
  try {
    const { project } = req.body;
    const ai = getAIClient();
    if (!ai) {
      return res.json({ improvements: generateDefaultImprovements(project) });
    }

    const prompt = `As a Senior Capstone Examiner, provide 3 to 4 high-impact technical enhancements to elevate this final-year project:
Project Title: "${project?.title || "Capstone Project"}"
Current Tech Stack: ${JSON.stringify(project?.techStack || {})}
Key Features: ${JSON.stringify(project?.keyFeatures || [])}

Focus on:
1. Making the project stand out from typical undergraduate clones.
2. Enhancing evaluation scores for viva voce / academic defense.
3. Feasible additions that can be showcased during live demonstration.

Return JSON array of:
[
  {
    "title": "Clear enhancement title",
    "category": "e.g. Scalability / Research Novelty / Security / Edge Deployment",
    "impact": "High | Medium | Exceptional",
    "description": "Why this impresses college evaluators and judges",
    "actionSteps": ["Step 1", "Step 2", "Step 3"]
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const defaultImprovements = generateDefaultImprovements(project);
    const parsed = cleanAndParseJSON(response.text, defaultImprovements);
    res.json({
      improvements: Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultImprovements,
    });
  } catch (error: any) {
    console.warn("Fallback on improve-project error:", error);
    res.json({ improvements: generateDefaultImprovements(req.body?.project) });
  }
});

// Helper: default improvements generator
function generateDefaultImprovements(project: any) {
  const title = project?.title || "Capstone Project";
  return [
    {
      title: "Automated CI/CD Pipeline & Multi-Stage Dockerization",
      category: "DevOps & Reproducibility",
      impact: "High",
      description: `Allows evaluation committee to run and inspect ${title} with zero dependency configuration or environment conflicts.`,
      actionSteps: [
        "Write Dockerfile for client & backend microservices",
        "Configure GitHub Actions workflow running unit tests on pull requests",
      ],
    },
    {
      title: "Quantitative Latency, Throughput & Resource Benchmarking",
      category: "Academic Rigor",
      impact: "High",
      description:
        "College evaluators award highest marks to projects with concrete numbers comparing p50/p95/p99 latency against baseline models.",
      actionSteps: [
        "Execute load tests with realistic traffic distributions",
        "Plot comparative performance graphs in Chapter 4 of the final thesis",
      ],
    },
    {
      title: "Comprehensive Ablation Study & Algorithmic Sensitivity Matrix",
      category: "Publication Grade",
      impact: "Exceptional",
      description:
        "Mathematically isolates each architectural component to demonstrate empirical contribution to accuracy and convergence.",
      actionSteps: [
        "Run ablation runs removing individual feature modules",
        "Compile formal IEEE comparative matrix for viva voce defense",
      ],
    },
  ];
}

// Helper: default milestones generator for immediate fallback
function generateDefaultMilestones(project: any) {
  return [
    {
      id: "m1",
      phase: 1,
      title: "Project Synopsis, Feasibility & Dataset Curation",
      duration: "Weeks 1 - 2",
      objective: "Formulate problem statement, verify algorithmic feasibility, and curate clean ground-truth datasets.",
      deliverables: [
        { id: "d1-1", title: "Project Synopsis Document", description: "Formal 3-page problem formulation and objective document for department approval", completed: true },
        { id: "d1-2", title: "Dataset Acquisition & Cleansing", description: "Gather, clean, normalize, and split dataset (70% train, 15% val, 15% test)", completed: true },
        { id: "d1-3", title: "Literature Survey Matrix", description: "Comparative review of at least 6 IEEE/ACM papers published within past 3 years", completed: false },
      ],
      academicTips: "Evaluators scrutinize dataset bias, ethics, and clear problem boundaries. Have exact dataset row counts and license terms ready.",
      gitBranchName: "phase-1/synopsis-and-data-prep",
      suggestedCommit: "docs(synopsis): finalize problem statement, data ingestion pipeline & literature review matrix",
    },
    {
      id: "m2",
      phase: 2,
      title: "System Architecture, DB Schema & Tech Stack Setup",
      duration: "Weeks 3 - 4",
      objective: "Design component architecture, database ER diagrams, API contracts, and scaffold repository structure.",
      deliverables: [
        { id: "d2-1", title: "UML / High-Level Architecture Diagram", description: "Component interaction, sequence diagrams, and microservice/monolith layout", completed: false },
        { id: "d2-2", title: "Database Schema & Migration Scripts", description: "Normalized relational or document schema with foreign keys and indexes", completed: false },
        { id: "d2-3", title: "Repository Scaffolding & CI Linter", description: "Configured package managers, TypeScript/Python linting, and Docker container baseline", completed: false },
      ],
      academicTips: "Prepare to justify why you chose your specific database and backend framework over popular alternatives.",
      gitBranchName: "phase-2/architecture-and-schema",
      suggestedCommit: "feat(arch): initialize project boilerplate, database schemas and API specifications",
    },
    {
      id: "m3",
      phase: 3,
      title: "Core Algorithm / Model Pipeline / Logic Engine (MVP)",
      duration: "Weeks 5 - 8",
      objective: "Develop the primary intellectual property of the project—the algorithmic core, AI model, or processing engine.",
      deliverables: [
        { id: "d3-1", title: "Baseline Algorithm/Model Implementation", description: "Working end-to-end execution of the primary processing pipeline", completed: false },
        { id: "d3-2", title: "Loss & Metric Convergence Logging", description: "Document training/validation loss curves, accuracy, F1-score, or latency metrics", completed: false },
        { id: "d3-3", title: "Unit Test Harness for Core Functions", description: "Automated test cases validating edge cases and input sanitization", completed: false },
      ],
      academicTips: "Never show a demo without evaluation numbers. Have precision, recall, RMSE, or throughput numbers on hand.",
      gitBranchName: "phase-3/core-engine-mvp",
      suggestedCommit: "feat(core): implement baseline processing pipeline with evaluation metrics logger",
    },
    {
      id: "m4",
      phase: 4,
      title: "Full-Stack Integration & Interactive User Interface",
      duration: "Weeks 9 - 11",
      objective: "Connect the computational engine to real-time client interfaces, providing responsive user workflows.",
      deliverables: [
        { id: "d4-1", title: "RESTful / WebSocket API Endpoints", description: "Authenticated endpoints exposing core functionality with validation schemas", completed: false },
        { id: "d4-2", title: "Responsive Frontend Dashboard", description: "Modern UI allowing file uploads, interactive parameter tuning, and dynamic charts", completed: false },
        { id: "d4-3", title: "Error Handling & Asynchronous Task Worker", description: "Graceful toast notifications, loading states, and background queue for heavy tasks", completed: false },
      ],
      academicTips: "Ensure your UI does not freeze during long calculations. Show progress bars or asynchronous polling.",
      gitBranchName: "phase-4/fullstack-integration",
      suggestedCommit: "feat(ui): complete end-to-end user workflow with interactive visualization dashboard",
    },
    {
      id: "m5",
      phase: 5,
      title: "Benchmarking, Edge-Case Stress Testing & Optimization",
      duration: "Weeks 12 - 13",
      objective: "Perform rigorous verification, stress testing under unexpected inputs, and optimize bottlenecks.",
      deliverables: [
        { id: "d5-1", title: "Ablation Studies & Comparative Analysis", description: "Direct performance comparison against 2 baseline methods or off-the-shelf tools", completed: false },
        { id: "d5-2", title: "Stress & Security Hardening", description: "Penetration checks (SQL injection, XSS, rate limiting) and memory profiling", completed: false },
        { id: "d5-3", title: "Containerized Production Build", description: "Multi-stage Dockerfile producing a minimal, deployable production artifact", completed: false },
      ],
      academicTips: "Highlight what fails and how your system recovers. Demonstrating resilience wins top viva marks.",
      gitBranchName: "phase-5/testing-and-optimization",
      suggestedCommit: "test(benchmarks): conduct stress tests, ablation comparison & memory profiling",
    },
    {
      id: "m6",
      phase: 6,
      title: "Final Thesis/Report, Live Demo & Viva Voce Preparation",
      duration: "Weeks 14 - 15",
      objective: "Compile the IEEE/University standard thesis report, record fallback video, and rehearse defense questions.",
      deliverables: [
        { id: "d6-1", title: "Final Project Thesis / Report (LaTeX/Word)", description: "Complete documentation: Abstract, Literature Survey, System Design, Results, Conclusion", completed: false },
        { id: "d6-2", title: "3-Minute Video Walkthrough (Backup Demo)", description: "High-resolution recorded screen demo in case live Wi-Fi fails during college presentation", completed: false },
        { id: "d6-3", title: "Viva Presentation Slides & Q&A Defense Sheet", description: "Structured 15-slide presentation deck emphasizing methodology and novelty", completed: false },
      ],
      academicTips: "Always have a pre-recorded video backup ready in case network or server issues occur in the seminar hall.",
      gitBranchName: "phase-6/final-report-and-viva",
      suggestedCommit: "docs(thesis): finalize thesis documentation, viva slide deck and demonstration artifacts",
    },
  ];
}

// Helper: default architecture generator
function generateDefaultArchitecture(project: any) {
  return {
    components: [
      { name: "Client Presentation Layer", role: "Responsive UI with interactive visualization", technologies: "React 19, Tailwind CSS, Lucide React, Motion" },
      { name: "Application & API Gateway", role: "Request routing, authentication, input validation", technologies: "Node.js / Express or FastAPI with OpenAPI Docs" },
      { name: "Core Computational / AI Engine", role: "Data transformations, inference, and algorithmic execution", technologies: project.techStack?.ai_ml?.join(", ") || "PyTorch / ONNX Runtime / SciPy" },
      { name: "Data Persistence & Storage", role: "Structured transactional data, user logs, and artifact caches", technologies: project.techStack?.database?.join(", ") || "PostgreSQL, Redis Cache" },
    ],
    dataFlow: [
      "1. User initiates analysis by uploading data payload or configuring parameters on the client UI.",
      "2. API Gateway validates request schema, sanitizes inputs, and enqueues payload for processing.",
      "3. Core Engine executes pipeline (feature extraction, algorithmic inference, post-processing).",
      "4. Results, metrics, and generated artifacts are stored in database and cached for fast retrieval.",
      "5. Response payload is streamed or returned to the UI with visual charts and actionable insights.",
    ],
    securityAndOptimization: [
      "Input payload sanitization and strict schema validation preventing injection vulnerabilities.",
      "Model inference quantization (FP16 / INT8) reducing latency and memory footprint by over 50%.",
      "In-memory caching (Redis) for repeated queries to prevent redundant compute cycles.",
      "Air-gapped local execution option ensuring zero sensitive data leaks during demonstration.",
    ],
  };
}

// Vite middleware setup
async function startServer() {
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
    console.log(`Final-Year Project Mentor server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
