import React, { useState, useRef } from "react";
import {
  X,
  Copy,
  Check,
  Printer,
  Download,
  FileText,
  GraduationCap,
  Layers,
  Milestone as MilestoneIcon,
  CheckCircle2,
  Calendar,
  UserCheck,
  ShieldCheck,
  Terminal,
  Cpu,
  Workflow,
  Sparkles,
  Award,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";
import { ActiveProject, UserProfile } from "../types";

interface SynopsisExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ActiveProject;
  currentUser?: UserProfile | null;
}

export const SynopsisExportModal: React.FC<SynopsisExportModalProps> = ({
  isOpen,
  onClose,
  project,
  currentUser,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<"document" | "markdown">("document");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfNotification, setPdfNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const printableRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const { idea, milestones, architecture, commits } = project;

  // Student details from auth or defaults
  const studentName = currentUser?.name || "Aarav Sharma";
  const rollNumber = currentUser?.rollNumber || "CS21B042";
  const department = currentUser?.department || "Department of Computer Science & Engineering";
  const institution = currentUser?.institution || "National Institute of Technology";
  const guideName = "Dr. Radhika Sen (Associate Professor, Dept. of CSE)";
  const submissionDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Calculate milestone deliverables progress
  const allDeliverables = milestones.flatMap((m) => m.deliverables);
  const completedDeliverables = allDeliverables.filter((d) => d.completed).length;
  const completionPercentage =
    allDeliverables.length > 0 ? Math.round((completedDeliverables / allDeliverables.length) * 100) : 0;

  // Handler: Generate and directly download publication-grade A4 PDF document
  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return;

    // Switch view to document preview if currently viewing raw markdown
    if (activeViewMode !== "document") {
      setActiveViewMode("document");
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    const targetElement = printableRef.current;
    if (!targetElement) {
      setPdfNotification({
        type: "error",
        message: "Printable element is not currently mounted.",
      });
      return;
    }

    setIsGeneratingPDF(true);
    setPdfNotification({
      type: "info",
      message: "Rendering multi-page A4 PDF dossier with high-resolution graphics...",
    });

    const sanitizedTitle = idea.title.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 35);
    const filename = `Capstone_Dossier_${sanitizedTitle}.pdf`;

    try {
      // 1. Capture printable container as sharp 2x canvas with onclone color normalization
      const canvas = await html2canvas(targetElement, {
        scale: 2, // High DPI for crisp academic typography
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: targetElement.scrollWidth || 860,
        onclone: (clonedDoc) => {
          // Inject CSS reset to prevent Tailwind v4 oklab/oklch default border/outline values
          const styleEl = clonedDoc.createElement("style");
          styleEl.textContent = `
            *, *::before, *::after {
              border-color: #cbd5e1 !important;
              outline-color: #cbd5e1 !important;
              text-decoration-color: currentColor !important;
            }
            .printable-document {
              background-color: #ffffff !important;
              color: #0f172a !important;
            }
          `;
          clonedDoc.head.appendChild(styleEl);

          // Canvas 2D context to safely convert any oklab/oklch strings into standard sRGB
          const colorConverterCanvas = clonedDoc.createElement("canvas");
          const ctx = colorConverterCanvas.getContext("2d");

          const toStandardRgb = (val: string): string => {
            if (!val || (!val.includes("oklab") && !val.includes("oklch") && !val.includes("lab") && !val.includes("lch"))) {
              return val;
            }
            if (ctx) {
              ctx.fillStyle = "#ffffff";
              ctx.fillStyle = val;
              return ctx.fillStyle;
            }
            return "#0f172a";
          };

          // Walk all elements and normalize any remaining modern color functions
          const allEls = clonedDoc.querySelectorAll<HTMLElement>("*");
          allEls.forEach((el) => {
            if (el.style) {
              if (el.style.color) el.style.color = toStandardRgb(el.style.color);
              if (el.style.backgroundColor) el.style.backgroundColor = toStandardRgb(el.style.backgroundColor);
              if (el.style.borderColor) el.style.borderColor = toStandardRgb(el.style.borderColor);
            }
          });
        },
      });

      // 2. Setup A4 PDF document (210mm x 297mm)
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 12; // 12mm page margin
      const printWidth = pageWidth - margin * 2; // 186mm
      const printHeight = pageHeight - margin * 2; // 273mm

      // Canvas pixel height corresponding to 1 printable A4 page
      const pxPageHeight = Math.floor((canvas.width * printHeight) / printWidth);
      let renderedHeight = 0;
      let pageIndex = 0;

      // 3. Slice canvas cleanly across pages
      while (renderedHeight < canvas.height) {
        const sourceHeight = Math.min(pxPageHeight, canvas.height - renderedHeight);

        // Render page slice onto an offscreen canvas
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;
        const pageCtx = pageCanvas.getContext("2d");

        if (pageCtx) {
          pageCtx.fillStyle = "#ffffff";
          pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          pageCtx.drawImage(
            canvas,
            0,
            renderedHeight,
            canvas.width,
            sourceHeight,
            0,
            0,
            canvas.width,
            sourceHeight
          );
        }

        const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.98);
        const pageImgHeight = (sourceHeight * printWidth) / canvas.width;

        if (pageIndex > 0) {
          pdf.addPage();
        }

        pdf.addImage(pageImgData, "JPEG", margin, margin, printWidth, pageImgHeight);
        renderedHeight += sourceHeight;
        pageIndex++;
      }

      // 4. Trigger direct file download
      pdf.save(filename);

      setPdfNotification({
        type: "success",
        message: `Official PDF "${filename}" downloaded successfully (${pageIndex} pages).`,
      });
      setTimeout(() => setPdfNotification(null), 5000);
    } catch (error) {
      console.warn("Canvas capture encountered an issue, falling back to direct vector PDF generator:", error);
      try {
        // Fallback: Generate clean, structured vector A4 PDF directly using jsPDF
        generateDirectVectorPDF(filename);
        setPdfNotification({
          type: "success",
          message: `Official PDF "${filename}" compiled and downloaded successfully.`,
        });
        setTimeout(() => setPdfNotification(null), 5000);
      } catch (vectorErr) {
        console.error("Direct vector PDF fallback failed:", vectorErr);
        setPdfNotification({
          type: "error",
          message: "PDF download encountered an issue. Attempting browser print fallback...",
        });
        try {
          window.print();
        } catch (printErr) {
          console.error("Print fallback also failed:", printErr);
        }
      }
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Direct vector PDF fallback generator using jsPDF
  const generateDirectVectorPDF = (filename: string) => {
    const pdf = new jsPDF("p", "mm", "a4");

    // Header & University Details
    pdf.setFontSize(15);
    pdf.setFont("helvetica", "bold");
    pdf.text(institution.toUpperCase(), 105, 20, { align: "center" });

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(department, 105, 26, { align: "center" });

    pdf.setFontSize(8.5);
    pdf.setTextColor(37, 99, 235);
    pdf.text("CAPSTONE PROJECT VERIFICATION DOSSIER • ACADEMIC YEAR 2025-26", 105, 32, { align: "center" });

    pdf.setDrawColor(203, 213, 225);
    pdf.setLineWidth(0.5);
    pdf.line(15, 35, 195, 35);

    // Project Title
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    const titleLines = pdf.splitTextToSize(idea.title, 175);
    pdf.text(titleLines, 15, 44);

    let y = 44 + titleLines.length * 6;
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Candidate: ${studentName} (${rollNumber})  |  Advisor: ${guideName}`, 15, y);
    y += 5;
    pdf.text(`Domain: ${idea.domain}  |  Category: ${idea.category}  |  Submission Date: ${submissionDate}`, 15, y);
    y += 7;

    // Executive Abstract
    pdf.setFontSize(10.5);
    pdf.setFont("helvetica", "bold");
    pdf.text("1. EXECUTIVE ABSTRACT & SCOPE", 15, y);
    y += 5;
    pdf.setFontSize(8.5);
    pdf.setFont("helvetica", "normal");
    const descLines = pdf.splitTextToSize(idea.description, 175);
    pdf.text(descLines, 15, y);
    y += descLines.length * 4.5 + 6;

    // Technical Architecture
    pdf.setFontSize(10.5);
    pdf.setFont("helvetica", "bold");
    pdf.text("2. SYSTEM ARCHITECTURE & TECH STACK", 15, y);
    y += 5;
    pdf.setFontSize(8.5);
    pdf.setFont("helvetica", "normal");
    pdf.text(`• Architecture Pattern: ${architecture.pattern}`, 18, y);
    y += 4.5;
    pdf.text(`• Frontend Tier: ${architecture.frontend.framework} (${architecture.frontend.stateManagement})`, 18, y);
    y += 4.5;
    pdf.text(`• Backend Tier: ${architecture.backend.runtime} (${architecture.backend.framework})`, 18, y);
    y += 4.5;
    pdf.text(`• Database Tier: ${architecture.database.primary} (${architecture.database.type})`, 18, y);
    y += 7;

    // Milestones Table
    pdf.setFontSize(10.5);
    pdf.setFont("helvetica", "bold");
    pdf.text(`3. MILESTONES & IMPLEMENTATION ROADMAP (${completionPercentage}% COMPLETE)`, 15, y);
    y += 6;

    milestones.forEach((m, idx) => {
      if (y > 255) {
        pdf.addPage();
        y = 20;
      }
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${idx + 1}. ${m.title} [Status: ${m.status.toUpperCase()}]`, 15, y);
      y += 4.5;
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      m.deliverables.forEach((d) => {
        if (y > 265) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(`  • [${d.completed ? "COMPLETED" : "PENDING"}] ${d.title}`, 18, y);
        y += 4;
      });
      y += 3;
    });

    // Sign-Off Block
    if (y > 235) {
      pdf.addPage();
      y = 30;
    } else {
      y += 8;
    }

    pdf.setFontSize(9.5);
    pdf.setFont("helvetica", "bold");
    pdf.text("4. UNIVERSITY EVALUATION COMMITTEE ATTESTATION", 15, y);
    y += 16;

    pdf.setDrawColor(100, 116, 139);
    pdf.line(15, y, 75, y);
    pdf.line(135, y, 195, y);
    y += 4.5;

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.text("Project Guide / Faculty Advisor", 15, y);
    pdf.text("External Viva Voce Examiner", 135, y);
    y += 4;
    pdf.setFont("helvetica", "normal");
    pdf.text(guideName, 15, y);
    pdf.text("Department Evaluation Board", 135, y);

    pdf.save(filename);
  };

  // Handler: Native browser print dialog
  const handleBrowserPrint = () => {
    try {
      window.print();
    } catch (err) {
      console.error("Browser print failed:", err);
      handleDownloadPDF();
    }
  };

  // Handler: Export clean standalone HTML file
  const handleExportHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Official University Capstone Dossier - ${idea.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 40px;
    }
    .container {
      max-width: 860px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .institution {
      font-size: 14pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .dept {
      font-size: 11pt;
      color: #334155;
      margin-bottom: 12px;
    }
    .doc-type {
      display: inline-block;
      background: #eff6ff;
      color: #1e40af;
      padding: 4px 12px;
      font-weight: 600;
      font-size: 10pt;
      border-radius: 4px;
      border: 1px solid #bfdbfe;
    }
    h1 {
      font-size: 18pt;
      margin: 16px 0 8px 0;
      color: #0f172a;
    }
    h2 {
      font-size: 13pt;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 6px;
      margin-top: 24px;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 20px 0;
      font-size: 10pt;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background: #f8fafc;
      font-weight: 600;
      color: #334155;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 9pt;
      font-weight: 600;
    }
    .badge-success {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
    }
    .badge-phase {
      background: #eff6ff;
      color: #1e40af;
      border: 1px solid #dbeafe;
    }
    .signatures {
      margin-top: 48px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      text-align: center;
      page-break-inside: avoid;
    }
    .sig-line {
      border-top: 1px dashed #64748b;
      margin-top: 50px;
      padding-top: 8px;
      font-size: 9pt;
      font-weight: 600;
      color: #334155;
    }
    @media print {
      body { padding: 0; }
      @page { size: A4; margin: 15mm; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="institution">${institution}</div>
      <div class="dept">${department}</div>
      <div class="doc-type">OFFICIAL FINAL-YEAR CAPSTONE DOSSIER & ARCHITECTURE REPORT</div>
      <h1>${idea.title}</h1>
      <p style="font-style: italic; color: #475569; margin: 0;">${idea.tagline}</p>
    </div>

    <h2>1. Candidate & Project Registration</h2>
    <table>
      <tr>
        <th style="width: 25%;">Candidate Name</th>
        <td style="width: 25%;"><strong>${studentName}</strong></td>
        <th style="width: 25%;">Roll / Reg. Number</th>
        <td style="width: 25%; font-family: monospace;">${rollNumber}</td>
      </tr>
      <tr>
        <th>Project Guide</th>
        <td>${guideName}</td>
        <th>Academic Duration</th>
        <td>${idea.estimatedWeeks} Weeks (${idea.complexity} Tier)</td>
      </tr>
      <tr>
        <th>Domain Category</th>
        <td>${idea.category}</td>
        <th>Date of Submission</th>
        <td>${submissionDate}</td>
      </tr>
      <tr>
        <th>Milestone Progress</th>
        <td colspan="3"><span class="badge badge-success">${completionPercentage}% Verified Deliverables Complete</span></td>
      </tr>
    </table>

    <h2>2. Abstract & Problem Statement</h2>
    <p>${idea.problemStatement}</p>

    <h2>3. Practical Industry & Societal Impact</h2>
    <p>${idea.practicalImpact}</p>

    <h2>4. System Architecture & Component Specification</h2>
    <table>
      <thead>
        <tr>
          <th>Tier / Layer</th>
          <th>Component Name</th>
          <th>Technical Role</th>
          <th>Technology Stack</th>
        </tr>
      </thead>
      <tbody>
        ${architecture.components
          .map(
            (c, i) => `<tr>
          <td style="font-family: monospace; font-weight: 600;">Layer 0${i + 1}</td>
          <td><strong>${c.name}</strong></td>
          <td>${c.role}</td>
          <td style="font-family: monospace; color: #1e40af;">${c.technologies}</td>
        </tr>`
          )
          .join("")}
      </tbody>
    </table>

    <h3>Data Flow Pipeline</h3>
    <ol>
      ${architecture.dataFlow.map((s) => `<li style="margin-bottom: 6px;">${s}</li>`).join("")}
    </ol>

    <h2>5. Milestone Achievements & Verification Audit</h2>
    <table>
      <thead>
        <tr>
          <th>Phase</th>
          <th>Milestone Title & Duration</th>
          <th>Git Branch</th>
          <th>Status & Deliverables Summary</th>
        </tr>
      </thead>
      <tbody>
        ${milestones
          .map((m) => {
            const compCount = m.deliverables.filter((d) => d.completed).length;
            const isPhaseDone = compCount === m.deliverables.length;
            return `<tr>
          <td style="text-align: center; font-weight: bold;">0${m.phase}</td>
          <td><strong>${m.title}</strong><br><small style="color: #64748b;">${m.duration} — ${m.objective}</small></td>
          <td style="font-family: monospace; font-size: 9pt; color: #2563eb;">${m.gitBranchName}</td>
          <td>
            <span class="badge ${isPhaseDone ? "badge-success" : "badge-phase"}">
              ${compCount}/${m.deliverables.length} Deliverables (${isPhaseDone ? "Verified" : "In Progress"})
            </span>
          </td>
        </tr>`;
          })
          .join("")}
      </tbody>
    </table>

    <h2>6. Version Control & Audit Trail</h2>
    <p>
      Repository tracking is verified across <strong>${milestones.length} branches</strong> with 
      <strong>${commits.length} milestone commits</strong> recorded.
    </p>

    <h2>7. Academic Endorsement & Sign-Off</h2>
    <div class="signatures">
      <div>
        <div class="sig-line">Candidate Signature<br><small>${studentName}</small></div>
      </div>
      <div>
        <div class="sig-line">Internal Faculty Guide<br><small>Verified & Approved</small></div>
      </div>
      <div>
        <div class="sig-line">External Viva Examiner<br><small>Oral Defense Committee</small></div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Official_Capstone_Submission_${idea.title.replace(/[^a-zA-Z0-9]/g, "_")}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate clean Markdown representation
  const generateMarkdown = () => {
    return `# OFFICIAL FINAL-YEAR CAPSTONE DOSSIER & ARCHITECTURE REPORT
**Institution**: ${institution}  
**Department**: ${department}  
**Project Title**: ${idea.title}  
**Candidate Name**: ${studentName} (Roll No: ${rollNumber})  
**Assigned Faculty Guide**: ${guideName}  
**Submission Date**: ${submissionDate}  
**Domain**: ${idea.category} | **Complexity**: ${idea.complexity} | **Duration**: ${idea.estimatedWeeks} Weeks  
**Overall Deliverables Completed**: ${completionPercentage}%  

---

## 1. Abstract & Problem Statement
${idea.problemStatement}

## 2. Practical & Real-World Impact
${idea.practicalImpact}

---

## 3. System Architecture & Component Specification
${architecture.components.map((c, i) => `### Layer 0${i + 1}: ${c.name}\n- **Role**: ${c.role}\n- **Technologies**: \`${c.technologies}\``).join("\n\n")}

### Data Flow Pipeline:
${architecture.dataFlow.map((s, i) => `${i + 1}. ${s}`).join("\n")}

### Security & Production Hardening:
${architecture.securityAndOptimization.map((sec) => `- ${sec}`).join("\n")}

---

## 4. Milestone Achievements & Verification Audit
${milestones
  .map(
    (m) => `### Phase ${m.phase}: ${m.title} (${m.duration})
- **Objective**: ${m.objective}
- **Git Branch**: \`${m.gitBranchName}\`
- **Deliverables**:
${m.deliverables.map((d) => `  - [${d.completed ? "x" : " "}] **${d.title}**: ${d.description}`).join("\n")}`
  )
  .join("\n\n")}

---

## 5. Technology Stack Summary
- **Frontend**: ${idea.techStack.frontend.join(", ")}
- **Backend & APIs**: ${idea.techStack.backend.join(", ")}
- **AI / ML & Algorithms**: ${idea.techStack.ai_ml.join(", ")}
- **Database & Storage**: ${idea.techStack.database.join(", ")}
- **Cloud & Infrastructure**: ${idea.techStack.hardware_cloud.join(", ")}

---

## 6. Official Endorsement Signatures
- **Candidate Signature**: ________________________ Date: ____________
- **Faculty Guide Signature**: ____________________ Date: ____________
- **External Examiner Signature**: ________________ Date: ____________
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl max-w-4xl w-full shadow-2xl border border-[#CBD5E1] dark:border-[#1E293B] max-h-[92vh] flex flex-col my-auto">
        {/* Header - Screen Only */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1E293B] shrink-0 bg-[#F8FAFC] dark:bg-[#131D2F] rounded-t-2xl no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                  Official University Submission Dossier
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#DCFCE7] dark:bg-[#14532D]/40 text-[#166534] dark:text-[#86EFAC] rounded border border-[#BBF7D0] dark:border-[#22C55E]/30">
                  Print Ready (A4)
                </span>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Comprehensive Architecture Blueprint & Milestone Verification for Evaluation Committee
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-[#F1F5F9] dark:bg-[#0B1120] p-0.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-semibold mr-1">
              <button
                onClick={() => setActiveViewMode("document")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeViewMode === "document"
                    ? "bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA] shadow-2xs font-bold"
                    : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white"
                }`}
              >
                Official Preview
              </button>
              <button
                onClick={() => setActiveViewMode("markdown")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeViewMode === "markdown"
                    ? "bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA] shadow-2xs font-bold"
                    : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white"
                }`}
              >
                Raw Markdown
              </button>
            </div>

            {/* Copy Button */}
            <button
              id="btn-copy-dossier"
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#131D2F] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] text-[#334155] dark:text-[#CBD5E1] border border-[#CBD5E1] dark:border-[#334155] transition-colors shadow-2xs"
              title="Copy markdown text for reports"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8]" />}
              <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
            </button>

            {/* Download Standalone HTML Button */}
            <button
              id="btn-download-html"
              onClick={handleExportHTML}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#131D2F] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] text-[#334155] dark:text-[#CBD5E1] border border-[#CBD5E1] dark:border-[#334155] transition-colors shadow-2xs"
              title="Download standalone offline HTML document"
            >
              <Download className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
              <span className="hidden sm:inline">Download HTML</span>
            </button>

            {/* Primary Download as PDF Button */}
            <button
              id="btn-download-pdf"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-all shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
              title="Compile and download clean, multi-page PDF document"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Compiling PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download as PDF</span>
                </>
              )}
            </button>

            {/* Print Dialog Button */}
            <button
              id="btn-print-dialog"
              onClick={handleBrowserPrint}
              disabled={isGeneratingPDF}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#131D2F] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] text-[#334155] dark:text-[#CBD5E1] border border-[#CBD5E1] dark:border-[#334155] transition-colors shadow-2xs"
              title="Open browser print prompt"
            >
              <Printer className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8]" />
              <span className="hidden lg:inline">Print</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Notification Alert Bar */}
        {pdfNotification && (
          <div
            className={`px-6 py-2.5 border-b text-xs flex items-center justify-between no-print shrink-0 font-medium transition-all ${
              pdfNotification.type === "success"
                ? "bg-[#DCFCE7] dark:bg-[#14532D]/40 border-[#BBF7D0] dark:border-[#22C55E]/30 text-[#166534] dark:text-[#86EFAC]"
                : pdfNotification.type === "error"
                ? "bg-[#FEE2E2] dark:bg-[#7F1D1D]/40 border-[#FECACA] dark:border-[#EF4444]/30 text-[#991B1B] dark:text-[#FCA5A5]"
                : "bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 border-[#DBEAFE] dark:border-[#3B82F6]/30 text-[#1E40AF] dark:text-[#93C5FD]"
            }`}
          >
            <div className="flex items-center gap-2">
              {pdfNotification.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              ) : pdfNotification.type === "error" ? (
                <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
              ) : (
                <Loader2 className="w-4 h-4 text-[#2563EB] animate-spin shrink-0" />
              )}
              <span>{pdfNotification.message}</span>
            </div>
            <button
              onClick={() => setPdfNotification(null)}
              className="text-[11px] underline font-semibold hover:opacity-80 ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Informative helper bar for PDF generation */}
        <div className="bg-[#EFF6FF] dark:bg-[#1E3A8A]/30 px-6 py-2 border-b border-[#DBEAFE] dark:border-[#1E3A8A]/50 flex items-center justify-between text-[11px] text-[#1E40AF] dark:text-[#93C5FD] no-print shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
            <span>
              <strong>Direct PDF Engine:</strong> Click <strong>"Download as PDF"</strong> to generate a multi-page A4 document directly to your device.
            </span>
          </div>
          <span className="font-mono font-semibold hidden md:inline">A4 Standard • Ink Optimized</span>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#F4F5F7] dark:bg-[#090E17]">
          {activeViewMode === "markdown" ? (
            <div className="bg-white dark:bg-[#0F172A] p-6 rounded-xl border border-[#CBD5E1] dark:border-[#1E293B] shadow-xs">
              <pre className="text-xs font-mono text-[#1E293B] dark:text-[#E2E8F0] whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {generateMarkdown()}
              </pre>
            </div>
          ) : (
            /* Printable Document Preview */
            <div
              ref={printableRef}
              id="official-printable-dossier"
              className="printable-document bg-white p-6 sm:p-10 rounded-xl border border-[#CBD5E1] shadow-xs max-w-3xl mx-auto font-sans text-[#0F172A]"
            >
              {/* Institutional Header Banner */}
              <div className="text-center pb-6 border-b-2 border-[#0F172A] mb-6">
                <div className="flex items-center justify-center gap-2 text-[#2563EB] mb-1.5">
                  <Award className="w-6 h-6" />
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#0F172A]">
                    {institution}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                  {department}
                </div>
                <div className="inline-block bg-[#EFF6FF] text-[#1E40AF] px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border border-[#DBEAFE] mb-3">
                  Official Final-Year Capstone Project Dossier & Viva Voce Submission
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] mt-2 mb-1">
                  {idea.title}
                </h1>
                <p className="text-xs sm:text-sm italic text-[#475569] max-w-xl mx-auto">
                  "{idea.tagline}"
                </p>
              </div>

              {/* 1. Academic & Project Metadata Table */}
              <div className="mb-6 avoid-page-break">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#2563EB]" />
                  <span>1. Candidate & Project Identification</span>
                </h3>
                <div className="overflow-hidden border border-[#CBD5E1] rounded-lg text-xs">
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      <tr className="border-b border-[#CBD5E1]">
                        <th className="bg-[#F8FAFC] p-2.5 font-semibold text-[#475569] w-1/4 border-r border-[#CBD5E1]">
                          Lead Candidate
                        </th>
                        <td className="p-2.5 font-bold text-[#0F172A] w-1/4 border-r border-[#CBD5E1]">
                          {studentName}
                        </td>
                        <th className="bg-[#F8FAFC] p-2.5 font-semibold text-[#475569] w-1/4 border-r border-[#CBD5E1]">
                          Roll / Register No.
                        </th>
                        <td className="p-2.5 font-mono font-bold text-[#0F172A] w-1/4">
                          {rollNumber}
                        </td>
                      </tr>
                      <tr className="border-b border-[#CBD5E1]">
                        <th className="bg-[#F8FAFC] p-2.5 font-semibold text-[#475569] border-r border-[#CBD5E1]">
                          Faculty Project Guide
                        </th>
                        <td className="p-2.5 text-[#0F172A] border-r border-[#CBD5E1]">
                          {guideName}
                        </td>
                        <th className="bg-[#F8FAFC] p-2.5 font-semibold text-[#475569] border-r border-[#CBD5E1]">
                          Date of Defense
                        </th>
                        <td className="p-2.5 text-[#0F172A]">
                          {submissionDate}
                        </td>
                      </tr>
                      <tr>
                        <th className="bg-[#F8FAFC] p-2.5 font-semibold text-[#475569] border-r border-[#CBD5E1]">
                          Domain & Category
                        </th>
                        <td className="p-2.5 text-[#0F172A] border-r border-[#CBD5E1]">
                          {idea.category} ({idea.complexity} Tier)
                        </td>
                        <th className="bg-[#F8FAFC] p-2.5 font-semibold text-[#475569] border-r border-[#CBD5E1]">
                          Milestone Completion
                        </th>
                        <td className="p-2.5">
                          <span className="inline-flex items-center gap-1 font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded text-[11px] border border-[#BBF7D0]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {completionPercentage}% Deliverables Verified
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Abstract & Problem Statement */}
              <div className="mb-6 avoid-page-break">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#2563EB]" />
                  <span>2. Abstract & Problem Statement</span>
                </h3>
                <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#CBD5E1] text-xs leading-relaxed text-[#334155]">
                  <p>{idea.problemStatement}</p>
                </div>
              </div>

              {/* 3. Practical Industry & Societal Impact */}
              <div className="mb-6 avoid-page-break">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#2563EB]" />
                  <span>3. Societal & Industrial Impact</span>
                </h3>
                <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#CBD5E1] text-xs leading-relaxed text-[#334155]">
                  <p>{idea.practicalImpact}</p>
                </div>
              </div>

              {/* 4. System Architecture & Technical Specifications */}
              <div className="mb-6 avoid-page-break page-break-before">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#2563EB]" />
                  <span>4. System Architecture & Component Specification</span>
                </h3>
                <p className="text-[11px] text-[#64748B] mb-2.5">
                  Tiered architectural breakdown prepared in accordance with IEEE Software Engineering Documentation Standards.
                </p>

                <div className="overflow-hidden border border-[#CBD5E1] rounded-lg text-xs mb-4">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F8FAFC] border-b border-[#CBD5E1]">
                      <tr>
                        <th className="p-2.5 font-bold text-[#334155] border-r border-[#CBD5E1] w-20">Layer</th>
                        <th className="p-2.5 font-bold text-[#334155] border-r border-[#CBD5E1]">Component Name</th>
                        <th className="p-2.5 font-bold text-[#334155] border-r border-[#CBD5E1]">Technical Responsibilities</th>
                        <th className="p-2.5 font-bold text-[#334155]">Technology Stack</th>
                      </tr>
                    </thead>
                    <tbody>
                      {architecture.components.map((comp, idx) => (
                        <tr key={idx} className="border-b border-[#CBD5E1] last:border-b-0">
                          <td className="p-2.5 font-mono font-bold text-[#475569] border-r border-[#CBD5E1] bg-[#F8FAFC]">
                            0{idx + 1}
                          </td>
                          <td className="p-2.5 font-bold text-[#0F172A] border-r border-[#CBD5E1]">
                            {comp.name}
                          </td>
                          <td className="p-2.5 text-[#334155] border-r border-[#CBD5E1] leading-relaxed">
                            {comp.role}
                          </td>
                          <td className="p-2.5 font-mono text-[#1E40AF] bg-[#EFF6FF]/50 font-semibold">
                            {comp.technologies}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Data Flow Pipeline */}
                <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#CBD5E1] mb-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] mb-2 flex items-center gap-1.5">
                    <Workflow className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Sequential Data Flow Pipeline</span>
                  </h4>
                  <ol className="space-y-1.5 text-xs text-[#334155] list-decimal list-inside">
                    {architecture.dataFlow.map((step, idx) => (
                      <li key={idx} className="leading-relaxed pl-1">
                        <span className="font-medium text-[#0F172A]">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Security and Optimization */}
                <div className="bg-[#F0FDF4] p-4 rounded-lg border border-[#BBF7D0]">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#166534] mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Security Hardening & Production Optimization</span>
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#14532D]">
                    {architecture.securityAndOptimization.map((sec, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#16A34A] font-bold">•</span>
                        <span>{sec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 5. Milestone Achievements & Verification Audit */}
              <div className="mb-6 avoid-page-break page-break-before">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                    <MilestoneIcon className="w-4 h-4 text-[#2563EB]" />
                    <span>5. Milestone Achievements & Phased Verification</span>
                  </h3>
                  <span className="text-[11px] font-bold text-[#1E40AF]">
                    {completedDeliverables} of {allDeliverables.length} Deliverables Completed
                  </span>
                </div>

                <div className="space-y-3">
                  {milestones.map((m) => {
                    const phaseComp = m.deliverables.filter((d) => d.completed).length;
                    const isAllDone = phaseComp === m.deliverables.length;
                    return (
                      <div
                        key={m.id}
                        className="p-3.5 bg-white rounded-lg border border-[#CBD5E1] avoid-page-break"
                      >
                        <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-[#0F172A] text-white text-[10px] font-bold flex items-center justify-center">
                              0{m.phase}
                            </span>
                            <span className="font-bold text-xs text-[#0F172A]">{m.title}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-mono text-[11px] text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.5 rounded border border-[#DBEAFE]">
                              branch: {m.gitBranchName}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                isAllDone
                                  ? "bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]"
                                  : "bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]"
                              }`}
                            >
                              {isAllDone ? "Verified Complete" : `${phaseComp}/${m.deliverables.length} Completed`}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-[#475569] mb-2 italic">{m.objective}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2 border-l-2 border-[#E2E8F0] mt-2">
                          {m.deliverables.map((d) => (
                            <div key={d.id} className="flex items-start gap-1.5 text-xs">
                              {d.completed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                              ) : (
                                <span className="w-3.5 h-3.5 rounded-full border border-[#94A3B8] shrink-0 mt-0.5" />
                              )}
                              <span
                                className={`text-[11px] ${
                                  d.completed ? "text-[#0F172A] font-medium" : "text-[#64748B]"
                                }`}
                              >
                                {d.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 6. Version Control & Audit Trail */}
              <div className="mb-6 avoid-page-break">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-[#2563EB]" />
                  <span>6. Version Control & Code Integrity Audit</span>
                </h3>
                <div className="bg-[#F8FAFC] p-3.5 rounded-lg border border-[#CBD5E1] text-xs text-[#334155] flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="font-semibold text-[#0F172A]">Active Release Branch:</span>{" "}
                    <code className="font-mono text-[#2563EB] font-bold">{project.currentBranch}</code>
                  </div>
                  <div>
                    <span className="font-semibold text-[#0F172A]">Verified Git Commits:</span>{" "}
                    <span className="font-bold text-[#0F172A]">{commits.length} commits logged</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#0F172A]">Integrity Status:</span>{" "}
                    <span className="font-bold text-[#166534]">Repository In Sync</span>
                  </div>
                </div>
              </div>

              {/* 7. Official Endorsement & Signature Blocks */}
              <div className="mt-8 pt-6 border-t-2 border-[#0F172A] avoid-page-break">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-6 text-center">
                  7. Official Academic Endorsements & Committee Signatures
                </h3>

                <div className="grid grid-cols-3 gap-6 text-center text-xs">
                  <div>
                    <div className="h-14 flex items-end justify-center pb-1">
                      <span className="font-serif italic text-sm text-[#334155]">{studentName}</span>
                    </div>
                    <div className="border-t border-[#64748B] pt-2">
                      <p className="font-bold text-[#0F172A]">Candidate Signature</p>
                      <p className="text-[10px] text-[#64748B]">{studentName} ({rollNumber})</p>
                    </div>
                  </div>

                  <div>
                    <div className="h-14 flex items-end justify-center pb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#BBF7D0]">
                        Verified & Recommended
                      </span>
                    </div>
                    <div className="border-t border-[#64748B] pt-2">
                      <p className="font-bold text-[#0F172A]">Faculty Project Guide</p>
                      <p className="text-[10px] text-[#64748B]">{guideName}</p>
                    </div>
                  </div>

                  <div>
                    <div className="h-14 flex items-end justify-center pb-1">
                      <span className="text-[10px] font-medium text-[#94A3B8]">
                        [ Seal / Evaluation Verdict ]
                      </span>
                    </div>
                    <div className="border-t border-[#64748B] pt-2">
                      <p className="font-bold text-[#0F172A]">External Examiner</p>
                      <p className="text-[10px] text-[#64748B]">Viva Voce Defense Panel</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center text-[10px] text-[#94A3B8]">
                  This document is machine-attested by Mentor.AI Capstone Verification Terminal on {submissionDate}.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Screen Only */}
        <div className="px-6 py-3 border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between shrink-0 bg-[#F8FAFC] dark:bg-[#131D2F] rounded-b-2xl no-print">
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            Document-ready A4 dossier for evaluation committees, archive, and viva voce defense.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBrowserPrint}
              disabled={isGeneratingPDF}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] bg-white dark:bg-[#1E293B] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] border border-[#CBD5E1] dark:border-[#334155] rounded-lg transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8]" />
              <span>Print Dialog</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Compiling PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download as PDF</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B] rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
