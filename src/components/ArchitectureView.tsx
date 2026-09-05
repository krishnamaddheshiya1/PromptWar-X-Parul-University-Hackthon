import React from "react";
import {
  Layers,
  Cpu,
  Database,
  ShieldCheck,
  Zap,
  ArrowRight,
  Server,
  Monitor,
  HardDrive,
  Workflow,
  CheckCircle2,
  Download,
  Printer,
} from "lucide-react";
import { ActiveProject } from "../types";

interface ArchitectureViewProps {
  project: ActiveProject;
  onOpenDownloadPdf?: () => void;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ project, onOpenDownloadPdf }) => {
  const { architecture, idea } = project;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] dark:bg-[#1E293B] text-[#1E40AF] dark:text-[#60A5FA] border border-[#DBEAFE] dark:border-[#2563EB]/40">
              System Design & Topology
            </span>
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">IEEE Standard Architectural Blueprint</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
            Architecture, Data Flow & Tech Specification
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Detailed technical blueprint required for Chapter 3 ("System Design & Methodology") of your final thesis report.
          </p>
        </div>

        {onOpenDownloadPdf && (
          <button
            id="btn-architecture-download-pdf"
            onClick={onOpenDownloadPdf}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all shadow-xs shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download as PDF</span>
          </button>
        )}
      </div>

      {/* Visual System Block Diagram */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#1E293B] mb-6">
          <div className="flex items-center gap-2 font-semibold text-[#0F172A] dark:text-white text-sm">
            <Workflow className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
            <span>Interactive System Topology & Component Layout</span>
          </div>
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">Tiered Block Representation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {architecture.components.map((comp, idx) => (
            <div
              key={idx}
              className="bg-[#F8FAFC] dark:bg-[#131D2F] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] p-4 flex flex-col justify-between hover:border-[#2563EB] dark:hover:border-[#3B82F6] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-lg bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center shadow-2xs">
                    {idx + 1}
                  </span>
                  <span className="text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8]">Layer {idx + 1}</span>
                </div>
                <h4 className="text-sm font-bold text-[#0F172A] dark:text-white mb-1">{comp.name}</h4>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-3 leading-relaxed">{comp.role}</p>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#1E293B]">
                <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block mb-1">
                  Technologies
                </span>
                <span className="font-mono text-xs text-[#1E40AF] dark:text-[#93C5FD] bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 px-2 py-0.5 rounded inline-block border border-[#DBEAFE] dark:border-[#2563EB]/40 font-medium">
                  {comp.technologies}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: End-to-End Data Flow */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] p-6 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] dark:text-white mb-4 pb-3 border-b border-[#E2E8F0] dark:border-[#1E293B]">
              <Zap className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
              <span>Step-by-Step Data Flow Pipeline</span>
            </div>

            <div className="space-y-3">
              {architecture.dataFlow.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 bg-[#F8FAFC] dark:bg-[#131D2F] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]">
                  <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="text-xs sm:text-sm text-[#0F172A] dark:text-[#F1F5F9] leading-relaxed font-medium">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Performance Optimization */}
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] p-6 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] dark:text-white mb-4 pb-3 border-b border-[#E2E8F0] dark:border-[#1E293B]">
              <ShieldCheck className="w-4 h-4 text-[#166534] dark:text-[#4ADE80]" />
              <span>Security Hardening & Production Optimization</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {architecture.securityAndOptimization.map((sec, idx) => (
                <div key={idx} className="p-3.5 bg-[#F0FDF4] dark:bg-[#052E16]/40 rounded-xl border border-[#BBF7D0] dark:border-[#14532D] flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#0F172A] dark:text-white leading-relaxed">{sec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Comprehensive Tech Stack Matrix */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] p-6 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] dark:text-white mb-4 pb-3 border-b border-[#E2E8F0] dark:border-[#1E293B]">
              <Cpu className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
              <span>Full Technology Stack Matrix</span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-[#334155] dark:text-[#CBD5E1] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
                  Frontend & Presentation
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {idea.techStack.frontend.map((t) => (
                    <span key={t} className="px-2 py-1 bg-[#EFF6FF] dark:bg-[#1E3A8A]/30 border border-[#DBEAFE] dark:border-[#2563EB]/40 text-[#1E40AF] dark:text-[#93C5FD] text-[10px] font-bold rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-[#334155] dark:text-[#CBD5E1] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-[#166534] dark:text-[#4ADE80]" />
                  Backend & API Gateway
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {idea.techStack.backend.map((t) => (
                    <span key={t} className="px-2 py-1 bg-[#F0FDF4] dark:bg-[#052E16]/40 border border-[#BBF7D0] dark:border-[#166534]/50 text-[#166534] dark:text-[#86EFAC] text-[10px] font-bold rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-[#334155] dark:text-[#CBD5E1] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#6B21A8] dark:text-[#C084FC]" />
                  AI / Machine Learning / Core Engine
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {idea.techStack.ai_ml.map((t) => (
                    <span key={t} className="px-2 py-1 bg-[#FAF5FF] dark:bg-[#3B0764]/40 border border-[#E9D5FF] dark:border-[#7E22CE]/40 text-[#6B21A8] dark:text-[#E9D5FF] text-[10px] font-bold rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-[#334155] dark:text-[#CBD5E1] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#92400E] dark:text-[#FBBF24]" />
                  Database & Storage
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {idea.techStack.database.map((t) => (
                    <span key={t} className="px-2 py-1 bg-[#FEF3C7] dark:bg-[#451A03]/40 border border-[#FDE68A] dark:border-[#B45309]/40 text-[#92400E] dark:text-[#FDE68A] text-[10px] font-bold rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-[#334155] dark:text-[#CBD5E1] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-[#475569] dark:text-[#94A3B8]" />
                  Hardware, Compute & Cloud
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {idea.techStack.hardware_cloud.map((t) => (
                    <span key={t} className="px-2 py-1 bg-[#F1F5F9] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#334155] dark:text-[#CBD5E1] text-[10px] font-bold rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
