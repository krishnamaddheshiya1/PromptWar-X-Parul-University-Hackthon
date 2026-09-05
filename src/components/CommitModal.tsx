import React, { useState } from "react";
import {
  GitCommit,
  Sparkles,
  X,
  Terminal,
  FileCode,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { ActiveProject } from "../types";

interface CommitModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ActiveProject;
  defaultMilestoneTitle?: string;
  onSaveCommit: (commitData: {
    message: string;
    branch: string;
    tag?: string;
    filesChanged: string[];
    insertions: number;
    deletions: number;
  }) => void;
}

export const CommitModal: React.FC<CommitModalProps> = ({
  isOpen,
  onClose,
  project,
  defaultMilestoneTitle,
  onSaveCommit,
}) => {
  const [workSummary, setWorkSummary] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [branch, setBranch] = useState(project.currentBranch || "main");
  const [tag, setTag] = useState("");
  const [filesInput, setFilesInput] = useState(
    "src/pipeline/main.py, tests/test_core.py, configs/config.yaml"
  );
  const [insertions, setInsertions] = useState(180);
  const [deletions, setDeletions] = useState(14);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerateAI = async () => {
    if (!workSummary.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workSummary,
          currentBranch: branch,
          projectTitle: project.idea.title,
          milestoneTitle: defaultMilestoneTitle,
        }),
      });
      const data = await res.json();
      if (data.commitMessage) {
        setCommitMessage(data.commitMessage);
      }
      if (data.branchName) {
        setBranch(data.branchName);
      }
    } catch (err) {
      console.error(err);
      setCommitMessage(`feat: ${workSummary.slice(0, 60)}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;

    const filesChanged = filesInput
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    onSaveCommit({
      message: commitMessage.trim(),
      branch,
      tag: tag.trim() || undefined,
      filesChanged: filesChanged.length > 0 ? filesChanged : ["src/core/main.py"],
      insertions: Number(insertions) || 50,
      deletions: Number(deletions) || 5,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl max-w-xl w-full p-6 shadow-xl border border-[#E2E8F0] dark:border-[#1E293B] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#1E293B] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] dark:bg-[#1E3A8A]/30 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white">Log Implementation Work</h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Record a verifiable Git commit to your project history</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#334155] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Work summary input with AI generator */}
          <div className="bg-[#F8FAFC] dark:bg-[#131D2F] p-3.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                What did you code or complete?
              </label>
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGenerating || !workSummary.trim()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? "Formatting..." : "AI Conventional Format"}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={workSummary}
              onChange={(e) => setWorkSummary(e.target.value)}
              placeholder="e.g., 'Implemented the 3D U-Net forward pass, added Dice-Focal loss function, and created a script to log validation metrics to W&B'"
              className="w-full text-xs sm:text-sm bg-white dark:bg-[#0B1120] p-2.5 rounded-lg border border-[#CBD5E1] dark:border-[#334155] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none placeholder:text-[#94A3B8]"
            />
          </div>

          {/* Commit message */}
          <div>
            <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Conventional Commit Message
            </label>
            <input
              type="text"
              required
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="feat(core): implement 3D U-Net architecture with combined loss"
              className="w-full text-xs sm:text-sm font-mono p-2.5 rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0B1120] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] placeholder:text-[#94A3B8]"
            />
          </div>

          {/* Branch & Tag */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1.5">
                Target Branch
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full text-xs sm:text-sm font-mono p-2.5 rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0B1120] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                {project.branches.map((b) => (
                  <option key={b.name} value={b.name} className="bg-white dark:bg-[#0B1120] text-[#0F172A] dark:text-white">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1.5">
                Optional Release Tag
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. milestone-2-approved"
                className="w-full text-xs sm:text-sm font-mono p-2.5 rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0B1120] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] placeholder:text-[#94A3B8]"
              />
            </div>
          </div>

          {/* Changed Files */}
          <div>
            <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Files Changed (comma separated)
            </label>
            <input
              type="text"
              value={filesInput}
              onChange={(e) => setFilesInput(e.target.value)}
              placeholder="src/pipeline/loader.py, configs/config.yaml"
              className="w-full text-xs sm:text-sm font-mono p-2.5 rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0B1120] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] placeholder:text-[#94A3B8]"
            />
          </div>

          {/* Additions / Deletions */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1.5">
                Lines Inserted (+)
              </label>
              <input
                type="number"
                min={0}
                value={insertions}
                onChange={(e) => setInsertions(Number(e.target.value))}
                className="w-full text-xs sm:text-sm font-mono p-2 rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0B1120] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1.5">
                Lines Deleted (-)
              </label>
              <input
                type="number"
                min={0}
                value={deletions}
                onChange={(e) => setDeletions(Number(e.target.value))}
                className="w-full text-xs sm:text-sm font-mono p-2 rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0B1120] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0] dark:border-[#1E293B]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Commit & Record Work</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
