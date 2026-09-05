import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Circle,
  Clock,
  GitBranch,
  AlertCircle,
  Sparkles,
  ChevronRight,
  BookOpen,
  Award,
  Terminal,
  FileCheck,
  Flame,
  HelpCircle,
  PlusCircle,
  Download,
  Printer,
} from "lucide-react";
import { ActiveProject, Milestone, Deliverable } from "../types";

interface MilestonesViewProps {
  project: ActiveProject;
  onToggleDeliverable: (milestoneId: string, deliverableId: string) => void;
  onSelectBranch: (branchName: string) => void;
  onOpenCommitModal: (milestoneTitle?: string) => void;
  onAskMentorAboutMilestone: (milestone: Milestone) => void;
  onOpenDownloadPdf?: () => void;
}

export const MilestonesView: React.FC<MilestonesViewProps> = ({
  project,
  onToggleDeliverable,
  onSelectBranch,
  onOpenCommitModal,
  onAskMentorAboutMilestone,
  onOpenDownloadPdf,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<number>(project.currentMilestonePhase || 1);

  // Compute stats
  const allDeliverables = project.milestones.flatMap((m) => m.deliverables);
  const completedDeliverables = allDeliverables.filter((d) => d.completed).length;
  const totalDeliverables = allDeliverables.length;
  const overallPercentage = totalDeliverables > 0 ? Math.round((completedDeliverables / totalDeliverables) * 100) : 0;

  const activeMilestone = project.milestones.find((m) => m.phase === selectedPhase) || project.milestones[0];

  const handleToggle = (milestoneId: string, deliverableId: string, currentlyCompleted: boolean) => {
    onToggleDeliverable(milestoneId, deliverableId);
    if (!currentlyCompleted) {
      // Fire confetti celebration!
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Overview Card */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] p-6 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0] dark:border-[#1E293B]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] dark:bg-[#1E293B] text-[#1E40AF] dark:text-[#60A5FA] border border-[#DBEAFE] dark:border-[#2563EB]/40">
                Capstone Development Roadmap
              </span>
              <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">6 Academic Phases</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Milestone Progress & Academic Deliverables
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Track progress from initial project synopsis to the final thesis viva voce defense.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {onOpenDownloadPdf && (
              <button
                id="btn-milestones-download-pdf"
                onClick={onOpenDownloadPdf}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all shadow-xs"
                title="Download official milestone verification dossier as PDF"
              >
                <Download className="w-4 h-4" />
                <span>Download as PDF</span>
              </button>
            )}

            <div className="flex items-center gap-4 bg-[#F8FAFC] dark:bg-[#131D2F] p-3 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]">
              <div className="text-right">
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">Overall Completion</div>
                <div className="text-xl font-extrabold text-[#2563EB] dark:text-[#60A5FA]">{overallPercentage}%</div>
                <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                  {completedDeliverables} of {totalDeliverables} items
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-[#E2E8F0] dark:border-[#1E293B] border-t-[#2563EB] dark:border-t-[#60A5FA] flex items-center justify-center font-bold text-xs text-[#0F172A] dark:text-white">
                {overallPercentage}%
              </div>
            </div>
          </div>
        </div>

        {/* 4 Professional Polish Metric Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 pb-2">
          <div className="p-3 bg-[#F8FAFC] dark:bg-[#131D2F] border border-[#EDF2F7] dark:border-[#1E293B] rounded-xl text-center">
            <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] uppercase font-bold mb-1">Active Phase</p>
            <p className="text-lg font-bold text-[#0F172A] dark:text-white">Phase {project.currentMilestonePhase} of 6</p>
          </div>
          <div className="p-3 bg-[#F8FAFC] dark:bg-[#131D2F] border border-[#EDF2F7] dark:border-[#1E293B] rounded-xl text-center">
            <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] uppercase font-bold mb-1">Deliverables Done</p>
            <p className="text-lg font-bold text-[#2563EB] dark:text-[#60A5FA]">{completedDeliverables} / {totalDeliverables}</p>
          </div>
          <div className="p-3 bg-[#F8FAFC] dark:bg-[#131D2F] border border-[#EDF2F7] dark:border-[#1E293B] rounded-xl text-center">
            <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] uppercase font-bold mb-1">Tasks Remaining</p>
            <p className="text-lg font-bold text-[#0F172A] dark:text-white">{totalDeliverables - completedDeliverables}</p>
          </div>
          <div className="p-3 bg-[#F8FAFC] dark:bg-[#131D2F] border border-[#EDF2F7] dark:border-[#1E293B] rounded-xl text-center">
            <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] uppercase font-bold mb-1">Git Commits</p>
            <p className="text-lg font-bold text-[#166534] dark:text-[#4ADE80]">{project.commits.length} Logged</p>
          </div>
        </div>

        {/* Milestone Phase Pipeline Visualizer */}
        <div className="pt-4">
          <div className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-3">
            Capstone Academic Phases (Select to view deliverables)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {project.milestones.map((m) => {
              const totalItems = m.deliverables.length;
              const finishedItems = m.deliverables.filter((d) => d.completed).length;
              const isFullyDone = totalItems > 0 && finishedItems === totalItems;
              const isSelected = selectedPhase === m.phase;

              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedPhase(m.phase)}
                  className={`p-3.5 rounded-xl text-left border transition-all relative ${
                    isSelected
                      ? "bg-[#EFF6FF] dark:bg-[#1E293B] border-[#2563EB] dark:border-[#3B82F6] ring-2 ring-[#2563EB]/15 dark:ring-[#3B82F6]/30 shadow-xs"
                      : "bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-[#1E293B] hover:border-[#CBD5E1] dark:hover:border-[#334155] hover:bg-[#F8FAFC] dark:hover:bg-[#131D2F]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                        isFullyDone
                          ? "bg-[#22C55E] text-white"
                          : isSelected
                          ? "bg-[#2563EB] dark:bg-[#3B82F6] text-white"
                          : "bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8]"
                      }`}
                    >
                      {isFullyDone ? "✓" : m.phase}
                    </span>
                    <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium">{m.duration}</span>
                  </div>
                  <div className="text-xs font-bold text-[#0F172A] dark:text-white line-clamp-2 min-h-[32px] mb-1" title={m.title}>
                    Phase {m.phase}: {m.title.split(",")[0].split("&")[0]}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    <span>
                      {finishedItems}/{totalItems} done
                    </span>
                    <div className="w-12 bg-[#F1F5F9] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${isFullyDone ? "bg-[#22C55E]" : "bg-[#2563EB] dark:bg-[#3B82F6]"}`}
                        style={{ width: `${totalItems > 0 ? (finishedItems / totalItems) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Phase Deep Dive */}
      {activeMilestone && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Deliverables Checklist */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0] dark:border-[#1E293B]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#EFF6FF] dark:bg-[#1E293B] text-[#1E40AF] dark:text-[#60A5FA] border border-[#DBEAFE] dark:border-[#2563EB]/40">
                      Phase {activeMilestone.phase}
                    </span>
                    <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">{activeMilestone.duration}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mt-1">{activeMilestone.title}</h3>
                </div>

                <button
                  onClick={() => onOpenCommitModal(activeMilestone.title)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0F172A] hover:bg-slate-800 dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] transition-colors shadow-xs self-start"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Log Work & Commit</span>
                </button>
              </div>

              {/* Objective */}
              <div className="my-4 p-3.5 bg-[#F8FAFC] dark:bg-[#131D2F] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] text-xs sm:text-sm">
                <span className="font-semibold text-[#0F172A] dark:text-white">Academic Objective: </span>
                <span className="text-[#334155] dark:text-[#CBD5E1]">{activeMilestone.objective}</span>
              </div>

              {/* Deliverable Checkbox Items */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                  Mandatory Phase Deliverables ({activeMilestone.deliverables.filter((d) => d.completed).length}/
                  {activeMilestone.deliverables.length})
                </div>

                {activeMilestone.deliverables.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggle(activeMilestone.id, item.id, item.completed)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      item.completed
                        ? "bg-[#F0FDF4] dark:bg-[#052E16]/40 border-[#BBF7D0] dark:border-[#14532D] text-[#0F172A] dark:text-white"
                        : "bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-[#1E293B] hover:border-[#CBD5E1] dark:hover:border-[#334155] hover:bg-[#F8FAFC] dark:hover:bg-[#131D2F]"
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-[#94A3B8] dark:text-[#64748B] hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors shrink-0"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#CBD5E1] dark:text-[#475569]" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs sm:text-sm font-semibold ${
                            item.completed ? "line-through text-[#64748B] dark:text-[#94A3B8]" : "text-[#0F172A] dark:text-white"
                          }`}
                        >
                          {item.title}
                        </span>
                        {item.completedAt && (
                          <span className="text-[10px] font-mono text-[#166534] dark:text-[#4ADE80] bg-[#DCFCE7] dark:bg-[#14532D]/60 px-1.5 py-0.5 rounded border border-[#BBF7D0] dark:border-[#166534]">
                            Done {item.completedAt}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Academic Defense & Git Advice */}
          <div className="lg:col-span-5 space-y-6">
            {/* College Evaluator Expectation Card */}
            <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] p-6 shadow-xs">
              <div className="flex items-center gap-2 text-[#0F172A] dark:text-white font-semibold text-sm mb-3">
                <Award className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
                <span>What College Evaluators Look For</span>
              </div>
              <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed bg-[#F8FAFC] dark:bg-[#131D2F] p-3.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] mb-4">
                {activeMilestone.academicTips}
              </p>

              <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#1E293B] space-y-3">
                <div className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                  Associated Version Control Branch
                </div>
                <div className="flex items-center justify-between p-3 bg-[#F8FAFC] dark:bg-[#131D2F] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] font-mono text-xs">
                  <div className="flex items-center gap-2 text-[#0F172A] dark:text-white truncate">
                    <GitBranch className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA] shrink-0" />
                    <span className="truncate">{activeMilestone.gitBranchName}</span>
                  </div>
                  <button
                    onClick={() => onSelectBranch(activeMilestone.gitBranchName)}
                    className="px-2.5 py-1 text-[11px] font-sans font-semibold rounded-md bg-white dark:bg-[#1E293B] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] border border-[#E2E8F0] dark:border-[#334155] text-[#334155] dark:text-[#E2E8F0] shadow-2xs"
                  >
                    Checkout
                  </button>
                </div>

                <div className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mt-2">
                  Suggested Commit Message
                </div>
                <div className="p-3 bg-[#0F172A] dark:bg-[#020617] text-slate-200 rounded-xl font-mono text-xs overflow-x-auto border border-transparent dark:border-[#1E293B]">
                  <code className="text-[#22C55E]">$ git commit -m </code>
                  <span>"{activeMilestone.suggestedCommit}"</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B]">
                <button
                  onClick={() => onAskMentorAboutMilestone(activeMilestone)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-[#1E293B] hover:bg-[#DBEAFE] dark:hover:bg-[#1E293B]/80 transition-colors flex items-center justify-center gap-2 border border-[#DBEAFE] dark:border-[#2563EB]/40"
                >
                  <Sparkles className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
                  <span>Ask AI Mentor: "How do I ace Phase {activeMilestone.phase} review?"</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
