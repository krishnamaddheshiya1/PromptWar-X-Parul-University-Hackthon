import { ActiveProject, ProjectIdea } from "../types";

export const CURATED_IDEAS: ProjectIdea[] = [
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
];

export const INITIAL_DEFAULT_PROJECT: ActiveProject = {
  id: "proj-neuroscan-active",
  idea: CURATED_IDEAS[0],
  currentMilestonePhase: 2,
  branches: [
    { name: "main", isDefault: true, lastCommitHash: "7b4c9e1" },
    { name: "phase-1/synopsis-and-data-prep", isDefault: false, lastCommitHash: "3f82a1b" },
    { name: "feature/3d-unet-monai", isDefault: false, lastCommitHash: "d8102ec" },
    { name: "feature/fedavg-differential-privacy", isDefault: false, lastCommitHash: "9a2f44c" },
  ],
  currentBranch: "feature/3d-unet-monai",
  commits: [
    {
      id: "c-1",
      hash: "8f1a23b",
      message: "chore(init): repository scaffolding, poetry pyproject.toml & docker baseline",
      branch: "main",
      timestamp: "2026-08-12 10:14",
      author: "Student Researcher <researcher@univ.edu>",
      filesChanged: ["README.md", "pyproject.toml", "Dockerfile", ".gitignore"],
      insertions: 142,
      deletions: 0,
      tag: "v0.1.0-init",
    },
    {
      id: "c-2",
      hash: "3f82a1b",
      message: "docs(synopsis): approved Capstone Project Synopsis & Literature Survey Matrix",
      branch: "phase-1/synopsis-and-data-prep",
      timestamp: "2026-08-18 14:30",
      author: "Student Researcher <researcher@univ.edu>",
      milestoneId: "m1",
      filesChanged: ["docs/synopsis.pdf", "docs/literature_survey.md", "data/download_brats.py"],
      insertions: 380,
      deletions: 12,
      tag: "milestone-1-approved",
    },
    {
      id: "c-3",
      hash: "d8102ec",
      message: "feat(dataset): DICOM affine transform pipeline, intensity Z-score normalization & skull stripping",
      branch: "feature/3d-unet-monai",
      timestamp: "2026-08-25 18:45",
      author: "Student Researcher <researcher@univ.edu>",
      milestoneId: "m2",
      filesChanged: ["src/pipeline/dicom_loader.py", "src/pipeline/transforms.py", "tests/test_preprocessing.py"],
      insertions: 520,
      deletions: 24,
    },
    {
      id: "c-4",
      hash: "9a2f44c",
      message: "feat(model): MONAI 3D U-Net residual architecture with DiceFocal combined loss",
      branch: "feature/3d-unet-monai",
      timestamp: "2026-09-02 11:20",
      author: "Student Researcher <researcher@univ.edu>",
      milestoneId: "m2",
      filesChanged: ["src/models/unet3d.py", "src/training/loss.py", "configs/train_config.yaml"],
      insertions: 430,
      deletions: 18,
    },
    {
      id: "c-5",
      hash: "7b4c9e1",
      message: "feat(xai): Grad-CAM saliency heatmaps generator and bounding slice extractor",
      branch: "main",
      timestamp: "2026-09-04 16:05",
      author: "Student Researcher <researcher@univ.edu>",
      milestoneId: "m2",
      filesChanged: ["src/explainability/gradcam.py", "src/utils/visualizer.py"],
      insertions: 310,
      deletions: 9,
      tag: "v0.3.0-alpha",
    },
  ],
  milestones: [
    {
      id: "m1",
      phase: 1,
      title: "Project Synopsis, Feasibility & Dataset Curation",
      duration: "Weeks 1 - 2",
      objective: "Formulate problem statement, verify algorithmic feasibility, and curate clean ground-truth BraTS MRI datasets.",
      deliverables: [
        { id: "d1-1", title: "Project Synopsis Document", description: "Formal 3-page problem formulation and objective document for department approval", completed: true, completedAt: "2026-08-18" },
        { id: "d1-2", title: "Dataset Acquisition & Cleansing", description: "Acquire BraTS 2023 dataset, verify NIfTI/DICOM headers, and create 70/15/15 validation splits", completed: true, completedAt: "2026-08-22" },
        { id: "d1-3", title: "Literature Survey Matrix", description: "Comparative review of 8 IEEE TMI / MICCAI papers published in the last 3 years", completed: true, completedAt: "2026-08-24" },
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
        { id: "d2-1", title: "UML / High-Level Architecture Diagram", description: "Federated coordinator-client interaction and sequence diagrams", completed: true, completedAt: "2026-09-01" },
        { id: "d2-2", title: "Pre-processing Pipeline & Skull Stripping", description: "N4ITK bias field correction and intensity normalization scripts", completed: true, completedAt: "2026-09-03" },
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
      objective: "Develop the primary intellectual property of the project—the 3D U-Net and Flower FedAvg aggregation loop.",
      deliverables: [
        { id: "d3-1", title: "3D U-Net Model Implementation", description: "End-to-end forward/backward pass with Dice loss on volumetric patches", completed: false },
        { id: "d3-2", title: "Federated Averaging Server & 2 Simulated Clients", description: "Flower FL coordinator with secure parameter weight serialization", completed: false },
        { id: "d3-3", title: "Loss & Metric Convergence Logging", description: "Weights & Biases logging tracking Dice coefficient across 50 communication rounds", completed: false },
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
        { id: "d4-1", title: "FastAPI DICOM Ingestion & Inference Endpoint", description: "Asynchronous task queue processing volumetric scans with Grad-CAM overlays", completed: false },
        { id: "d4-2", title: "Radiology Web Dashboard", description: "Interactive 3D axial, sagittal, and coronal slice viewer with tumor mask toggle", completed: false },
        { id: "d4-3", title: "Automated Clinical PDF Summary Generator", description: "Generates clinical summary with volumetric measurements and confidence score", completed: false },
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
        { id: "d5-1", title: "Ablation Study vs Centralized Training", description: "Compare accuracy drop of Federated Learning vs Centralized baseline (target < 2% gap)", completed: false },
        { id: "d5-2", title: "Model Quantization & Inference Benchmark", description: "ONNX FP16 quantization measuring latency improvement on CPU vs GPU", completed: false },
        { id: "d5-3", title: "Dockerized Reproduction Package", description: "Single-command reproducible environment with verified synthetic test DICOM", completed: false },
      ],
      academicTips: "Highlight what fails and how your system recovers. Demonstrating resilience wins top viva marks.",
      gitBranchName: "phase-5/testing-and-optimization",
      suggestedCommit: "test(benchmarks): conduct stress tests, ablation comparison & memory profiling",
    },
    {
      id: "m6",
      phase: 6,
      title: "Final Thesis/Report, Live Demo & Viva Voce Preparation",
      duration: "Weeks 14 - 16",
      objective: "Compile the IEEE/University standard thesis report, record fallback video, and rehearse defense questions.",
      deliverables: [
        { id: "d6-1", title: "Final Project Thesis / Report (LaTeX/Word)", description: "Complete 60-page documentation: Abstract, Literature Survey, System Design, Results, Conclusion", completed: false },
        { id: "d6-2", title: "3-Minute Video Walkthrough (Backup Demo)", description: "High-resolution recorded screen demo in case live Wi-Fi fails during college presentation", completed: false },
        { id: "d6-3", title: "Viva Presentation Slides & Q&A Defense Sheet", description: "Structured 18-slide presentation deck emphasizing privacy proofs and clinical utility", completed: false },
      ],
      academicTips: "Always have a pre-recorded video backup ready in case network or server issues occur in the seminar hall.",
      gitBranchName: "phase-6/final-report-and-viva",
      suggestedCommit: "docs(thesis): finalize thesis documentation, viva slide deck and demonstration artifacts",
    },
  ],
  architecture: {
    components: [
      { name: "Radiology Web Client", role: "Volumetric slice navigation, mask opacity sliders, Grad-CAM toggle", technologies: "React 19, Tailwind CSS, Lucide, HTML5 Canvas" },
      { name: "API Gateway & Task Manager", role: "Session authentication, DICOM parsing, Celery task distribution", technologies: "FastAPI, Python 3.11, Redis, Celery" },
      { name: "Federated Coordinator (Flower)", role: "Aggregates client model weight deltas using FedAvg with DP Gaussian noise", technologies: "Flower Framework, PyTorch 2.3" },
      { name: "Inference Engine", role: "3D U-Net volumetric tumor segmentation with GPU acceleration", technologies: "MONAI, PyTorch, CUDA, ONNX Runtime" },
      { name: "Storage & Artifact DB", role: "Stores patient anonymized metadata and output segmentation masks", technologies: "PostgreSQL, S3/MinIO Object Store" },
    ],
    dataFlow: [
      "1. Radiologist uploads anonymized multi-modal MRI (T1, T1Gd, T2, FLAIR) via web portal.",
      "2. FastAPI parses DICOM tags, verifies NIfTI orientation, and applies N4 bias-field correction.",
      "3. 3D U-Net segments whole tumor (WT), tumor core (TC), and enhancing tumor (ET) regions.",
      "4. Grad-CAM backpropagates final layer gradients to generate heatmaps highlighting lesion focus.",
      "5. Volumetric statistics and bounding boxes are returned with rendered overlay contours.",
    ],
    securityAndOptimization: [
      "Differential privacy Laplace noise injected into weight updates prevents model reconstruction attacks.",
      "DICOM tag stripping guarantees strict zero-PHI (Protected Health Information) compliance.",
      "Sliding window inference with 50% Gaussian patch overlap eliminates boundary artifacts.",
      "FP16 half-precision CUDA kernel cuts peak VRAM requirements from 12GB to 5.8GB.",
    ],
  },
  vivaDefenseGuide: [
    {
      concept: "Privacy Preservation in Federated Learning",
      toughQuestion: "Can an attacker reconstruct original MRI scans just from examining the transmitted weight updates?",
      strongAnswer: "Yes, without protection, gradient inversion attacks (such as DLG) can reconstruct training images. We mitigate this by adding Differential Privacy (Gaussian noise with calculated clipping norm) and secure aggregation protocols so individual client updates cannot be isolated.",
    },
    {
      concept: "Loss Function Selection for Medical Imaging",
      toughQuestion: "Why did you use Dice Loss instead of standard Cross-Entropy Loss?",
      strongAnswer: "Medical imaging suffers from extreme class imbalance: healthy brain tissue comprises >98% of voxel volume while tumors are under 2%. Cross-entropy is dominated by background voxels, leading to false negatives. Dice Loss directly optimizes the overlap harmonic mean (F1 score), penalizing boundary misclassifications regardless of background volume.",
    },
    {
      concept: "Clinical Explainability",
      toughQuestion: "How do you prove to a medical board that your neural network isn't overfitting to MRI scanner artifacts?",
      strongAnswer: "We integrate Grad-CAM and Integrated Gradients to produce spatial saliency maps. Radiologists can visually verify that the model's highest activation gradients correspond to biological hyperintense edema and necrotic cores rather than skull boundaries or machine calibration markers.",
    },
  ],
  improvements: [
    {
      title: "Deploy Lightweight Quantized ONNX Runtime on Edge Device",
      category: "Edge Deployment & Optimization",
      impact: "High",
      description: "Converts the 3D U-Net into an INT8/FP16 ONNX model capable of running directly on a mobile workstation without dedicated GPU server infrastructure.",
      actionSteps: [
        "Export PyTorch weights using torch.onnx.export with dynamic batching",
        "Benchmark inference throughput and measure Dice degradation (<0.5%)",
        "Document latency gains in Project Thesis Chapter 5",
      ],
    },
    {
      title: "IEEE / Springer Conference Paper Manuscript Preparation",
      category: "Publication & Academic Recognition",
      impact: "Exceptional",
      description: "Structure an 8-page IEEE formatting paper detailing the novel differential privacy aggregation budget tradeoffs on the BraTS benchmark.",
      actionSteps: [
        "Draft comparative results table against standard Centralized FedAvg",
        "Compile ablation study graphs of varying noise scales epsilon",
        "Target IEEE BHI (Biomedical and Health Informatics) or EMBC",
      ],
    },
    {
      title: "Automated Radiological PDF Report Generator",
      category: "Productization & Clinical Usability",
      impact: "Medium",
      description: "Generates standardized structured reports with RECIST 1.1 tumor diameter measurements and 3D volumetric cubic centimeter estimations.",
      actionSteps: [
        "Compute 3D bounding box volume (cm³) from voxel spacing dimensions",
        "Format report utilizing ReportLab or Weasyprint adhering to RSNA guidelines",
      ],
    },
  ],
  mentorChat: [
    {
      id: "msg-1",
      sender: "mentor",
      text: "Welcome to your Capstone Project Workspace! I am your AI Academic Guide for **NeuroScan**. You have already completed the Synopsis and Data Curation milestone with approved literature matrices. What technical phase should we focus on next?",
      timestamp: "2026-09-04 16:30",
    },
  ],
  createdAt: "2026-08-10",
  lastUpdated: "2026-09-04 22:45",
};

export const COMMON_DOMAINS = [
  "Artificial Intelligence & ML",
  "Computer Vision & Imaging",
  "Cybersecurity & Cryptography",
  "IoT & Embedded Systems",
  "Cloud & Distributed Systems",
  "Healthcare & BioTech",
  "Web3 & Blockchain",
  "Fintech & Algorithmic Systems",
  "Sustainable Tech & Clean Energy",
  "Robotics & Autonomous Systems",
  "EdTech & Developer Tools",
  "Natural Language Processing",
];

export const POPULAR_SKILLS = [
  "Python",
  "JavaScript / TypeScript",
  "React",
  "FastAPI",
  "Node.js",
  "PyTorch",
  "TensorFlow",
  "Docker",
  "PostgreSQL",
  "MongoDB",
  "ESP32 / C++",
  "Solidity",
  "Git & CI/CD",
  "OpenCV",
  "Tailwind CSS",
  "Redis",
];

export function createDefaultProjectForIdea(idea: ProjectIdea): ActiveProject {
  const shortTitle = idea.title.slice(0, 45);
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toISOString().replace("T", " ").slice(0, 16);

  return {
    id: `proj-${Date.now()}`,
    idea,
    currentMilestonePhase: 1,
    branches: [
      { name: "main", isDefault: true, lastCommitHash: "1a8f92c" },
      { name: "phase-1/synopsis-and-data-prep", isDefault: false, lastCommitHash: "1a8f92c" },
    ],
    currentBranch: "phase-1/synopsis-and-data-prep",
    commits: [
      {
        id: `c-${Date.now()}`,
        hash: "1a8f92c",
        message: `chore(init): initialize capstone repository for ${shortTitle}`,
        branch: "main",
        timestamp: timeStr,
        author: "Student Researcher <researcher@univ.edu>",
        filesChanged: ["README.md", ".gitignore", "package.json"],
        insertions: 85,
        deletions: 0,
        tag: "v0.1.0-init",
      },
    ],
    milestones: [
      {
        id: "m1",
        phase: 1,
        title: "Project Synopsis, Literature Review & Dataset Acquisition",
        duration: "Weeks 1 - 2",
        objective: `Formalize problem statement for ${idea.title}, establish academic novelty, and acquire clean ground-truth data.`,
        deliverables: [
          {
            id: "d1-1",
            title: "Project Synopsis Document",
            description: `Formal 3-page problem formulation and IEEE-style methodology document for departmental committee approval.`,
            completed: true,
            completedAt: dateStr,
          },
          {
            id: "d1-2",
            title: "Dataset Acquisition & Preprocessing",
            description: `Acquire and validate source datasets (${idea.sampleDatasetSources?.join(", ") || "Standard Challenge DB"}), creating 70/15/15 splits.`,
            completed: true,
            completedAt: dateStr,
          },
          {
            id: "d1-3",
            title: "Literature Survey Matrix",
            description: "Comparative matrix of at least 6 recent IEEE/ACM publications analyzing existing limitations.",
            completed: false,
          },
        ],
        academicTips: "Evaluators scrutinize dataset integrity, ethical compliance, and precise scope boundaries. Prepare exact record counts.",
        gitBranchName: "phase-1/synopsis-and-data-prep",
        suggestedCommit: "docs(synopsis): finalize problem statement, data ingestion pipeline & literature review matrix",
      },
      {
        id: "m2",
        phase: 2,
        title: "System Architecture, DB Schema & Tech Stack Setup",
        duration: "Weeks 3 - 4",
        objective: "Design component architecture, database schemas, API contracts, and scaffold repository structure.",
        deliverables: [
          {
            id: "d2-1",
            title: "UML & High-Level Architecture Diagram",
            description: "Component interaction and sequence diagrams detailing data flow between frontend, backend, and processing engines.",
            completed: false,
          },
          {
            id: "d2-2",
            title: "Database Schema & Migration Scripts",
            description: "Normalized relational/document schema with indexing strategies for high throughput.",
            completed: false,
          },
          {
            id: "d2-3",
            title: "Repository Scaffolding & CI Pipeline",
            description: "Scaffolded environment with TypeScript/Python linters, testing frameworks, and Docker baseline.",
            completed: false,
          },
        ],
        academicTips: "Prepare to defend why you selected your primary frameworks over standard alternatives.",
        gitBranchName: "phase-2/architecture-and-schema",
        suggestedCommit: "feat(arch): initialize project boilerplate, database schemas and API specifications",
      },
      {
        id: "m3",
        phase: 3,
        title: "Core Algorithm / Model Pipeline / Logic Engine (MVP)",
        duration: "Weeks 5 - 8",
        objective: "Implement the primary intellectual core and algorithms powering the project.",
        deliverables: [
          {
            id: "d3-1",
            title: "Core Computational Pipeline Implementation",
            description: `Implement the primary logic: ${idea.keyFeatures[0] || "core processing algorithm"} with verifiable outputs.`,
            completed: false,
          },
          {
            id: "d3-2",
            title: "Convergence & Metric Logging",
            description: "Document baseline performance metrics (accuracy, F1-score, latency, or throughput) on test sets.",
            completed: false,
          },
          {
            id: "d3-3",
            title: "Automated Unit Test Suite",
            description: "Test cases validating mathematical invariants, boundary conditions, and edge-case sanitization.",
            completed: false,
          },
        ],
        academicTips: "Never demonstrate without quantitative numbers. Have concrete benchmark results ready for review.",
        gitBranchName: "phase-3/core-engine-mvp",
        suggestedCommit: "feat(core): implement baseline processing pipeline with evaluation metrics logger",
      },
      {
        id: "m4",
        phase: 4,
        title: "Full-Stack Integration & Interactive User Interface",
        duration: "Weeks 9 - 11",
        objective: "Connect the core engine to an interactive presentation layer and REST/WebSocket APIs.",
        deliverables: [
          {
            id: "d4-1",
            title: "RESTful / Async API Endpoints",
            description: "Secure API endpoints exposing core functionality with schema validation.",
            completed: false,
          },
          {
            id: "d4-2",
            title: "Interactive User Dashboard",
            description: "Responsive UI allowing real-time parameter tuning, visual charts, and feedback alerts.",
            completed: false,
          },
          {
            id: "d4-3",
            title: "Asynchronous Task Handling & Error Recovery",
            description: "Non-blocking background worker queues with comprehensive user error alerts.",
            completed: false,
          },
        ],
        academicTips: "Ensure your UI never hangs during intensive compute cycles. Show responsive progress indicators.",
        gitBranchName: "phase-4/fullstack-integration",
        suggestedCommit: "feat(ui): complete end-to-end user workflow with interactive visualization dashboard",
      },
      {
        id: "m5",
        phase: 5,
        title: "Benchmarking, Edge-Case Stress Testing & Optimization",
        duration: "Weeks 12 - 13",
        objective: "Perform rigorous verification, stress testing under unexpected loads, and optimize bottlenecks.",
        deliverables: [
          {
            id: "d5-1",
            title: "Ablation Studies & Comparative Analysis",
            description: "Compare performance against at least 2 baseline algorithms or off-the-shelf industry solutions.",
            completed: false,
          },
          {
            id: "d5-2",
            title: "Security & Penetration Hardening",
            description: "Audit for payload injection, authentication bypasses, and optimize memory/compute footprints.",
            completed: false,
          },
          {
            id: "d5-3",
            title: "Containerized Production Deployment",
            description: "Multi-stage Dockerfile producing a minimal, deployable production artifact.",
            completed: false,
          },
        ],
        academicTips: "Highlight what fails and how your system recovers. Demonstrating resilience wins top viva marks.",
        gitBranchName: "phase-5/testing-and-optimization",
        suggestedCommit: "test(benchmarks): conduct stress tests, ablation comparison & memory profiling",
      },
      {
        id: "m6",
        phase: 6,
        title: "Final Thesis/Report, Live Demo & Viva Voce Preparation",
        duration: "Weeks 14 - 16",
        objective: "Compile the IEEE/University standard thesis report, record backup demo video, and rehearse defense questions.",
        deliverables: [
          {
            id: "d6-1",
            title: "Final Capstone Thesis / Dissertation",
            description: "Complete academic report: Abstract, Literature Survey, Architecture, Results, and Future Scope.",
            completed: false,
          },
          {
            id: "d6-2",
            title: "3-Minute Video Walkthrough (Backup Demo)",
            description: "High-resolution pre-recorded walkthrough in case live Wi-Fi or hardware fails during the defense.",
            completed: false,
          },
          {
            id: "d6-3",
            title: "Viva Voce Slide Deck & Q&A Defense Sheet",
            description: "Structured 15-slide presentation highlighting design trade-offs and answering examiner questions.",
            completed: false,
          },
        ],
        academicTips: "Always have a pre-recorded demo video ready in case network or server issues occur in the seminar hall.",
        gitBranchName: "phase-6/final-report-and-viva",
        suggestedCommit: "docs(thesis): finalize thesis documentation, viva slide deck and demonstration artifacts",
      },
    ],
    architecture: {
      components: [
        {
          name: "Client Presentation Layer",
          role: "Responsive UI with interactive parameter controls and visual feedback",
          technologies: idea.techStack.frontend.join(", "),
        },
        {
          name: "Application & API Gateway",
          role: "Request routing, authentication, and input schema sanitization",
          technologies: idea.techStack.backend.join(", "),
        },
        {
          name: "Core Computational / AI Engine",
          role: "Core algorithmic execution, model inference, and data transformations",
          technologies: idea.techStack.ai_ml.join(", "),
        },
        {
          name: "Data Persistence & Storage",
          role: "Structured transactions, user sessions, and cached pipeline artifacts",
          technologies: idea.techStack.database.join(", "),
        },
      ],
      dataFlow: [
        "1. User initiates analysis by uploading data payload or configuring parameters on the client UI.",
        "2. API Gateway validates request schema, sanitizes inputs, and enqueues payload for processing.",
        `3. Core Engine executes pipeline (${idea.keyFeatures[0] || "core processing algorithm"}).`,
        "4. Results, metrics, and generated artifacts are stored in database and cached for fast retrieval.",
        "5. Response payload is streamed or returned to the UI with visual charts and actionable insights.",
      ],
      securityAndOptimization: [
        "Input payload sanitization and strict schema validation preventing injection vulnerabilities.",
        "Model inference quantization or query caching reducing latency by over 50%.",
        "In-memory caching for repeated queries to prevent redundant compute cycles.",
        "Air-gapped local execution option ensuring zero sensitive data leaks during demonstration.",
      ],
    },
    vivaDefenseGuide:
      idea.vivaQuestions && idea.vivaQuestions.length > 0
        ? idea.vivaQuestions.map((q) => ({
            concept: "Design Trade-Off & Defense Rationale",
            toughQuestion: q.question,
            strongAnswer: q.guidance,
          }))
        : [
            {
              concept: "Architecture Selection",
              toughQuestion: `Why is this tech stack optimal for ${idea.title}?`,
              strongAnswer: `We selected ${idea.techStack.backend[0]} and ${idea.techStack.frontend[0]} to balance rapid development velocity with asynchronous throughput and strong type safety.`,
            },
            {
              concept: "Failure Mode & Edge Cases",
              toughQuestion: "What is the primary failure mode of your system and how is it mitigated?",
              strongAnswer: "We incorporate input validation guards, graceful fallback responses, and detailed telemetry logging to prevent cascade failures.",
            },
          ],
    improvements: INITIAL_DEFAULT_PROJECT.improvements,
    mentorChat: [
      {
        id: `msg-${Date.now()}`,
        sender: "mentor",
        text: `Welcome to your project workspace for **${idea.title}**!\nI am Prof. Alexander Vance, your AI Capstone Guide. We will be executing across 6 structured academic phases. Start with Phase 1 deliverables by formalizing your Problem Synopsis and curating ground-truth datasets. Feel free to ask me anything as you code!`,
        timestamp: timeStr,
      },
    ],
    createdAt: dateStr,
    lastUpdated: timeStr,
  };
}

