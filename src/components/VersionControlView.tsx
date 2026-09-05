import React, { useState } from "react";
import {
  FolderGit2,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Plus,
  Terminal,
  FileCode,
  Copy,
  Check,
  Sparkles,
  Tag,
  Clock,
  User,
  ArrowUpRight,
  ChevronDown,
  Layers,
} from "lucide-react";
import { ActiveProject, CommitLog } from "../types";

interface VersionControlViewProps {
  project: ActiveProject;
  onOpenCommitModal: () => void;
  onSwitchBranch: (branchName: string) => void;
  onCreateBranch: (branchName: string) => void;
}

export const VersionControlView: React.FC<VersionControlViewProps> = ({
  project,
  onOpenCommitModal,
  onSwitchBranch,
  onCreateBranch,
}) => {
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>("all");
  const [selectedCommit, setSelectedCommit] = useState<CommitLog | null>(project.commits[0] || null);
  const [newBranchInput, setNewBranchInput] = useState("");
  const [showNewBranchModal, setShowNewBranchModal] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const filteredCommits =
    selectedBranchFilter === "all"
      ? project.commits
      : project.commits.filter((c) => c.branch === selectedBranchFilter);

  const handleCreateBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBranchInput.trim()) {
      const sanitized = newBranchInput.trim().toLowerCase().replace(/\s+/g, "-");
      onCreateBranch(sanitized);
      setNewBranchInput("");
      setShowNewBranchModal(false);
    }
  };

  const generateTerminalScript = () => {
    const slug = project.idea.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 25);
    return `# 1. Initialize local repository
mkdir ${slug} && cd ${slug}
git init -b main

# 2. Add initial boilerplate and README
echo "# ${project.idea.title}" >> README.md
echo "### ${project.idea.tagline}" >> README.md
echo "node_modules/\\n__pycache__/\\n.env\\n*.pyc\\n*.pt\\n*.h5\\nweights/" > .gitignore

git add README.md .gitignore
git commit -m "chore(init): initial capstone repository structure"

# 3. Create active branch for current milestone
git checkout -b ${project.currentBranch}
`;
  };

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(generateTerminalScript());
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] p-6 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] dark:bg-[#1E293B] text-[#1E40AF] dark:text-[#60A5FA] border border-[#DBEAFE] dark:border-[#2563EB]/40">
                Integrated Git Version Control
              </span>
              <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">
                {project.branches.length} branches • {project.commits.length} commits logged
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Repository Tracking & Commit Timeline
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Academic project reviewers inspect consistent git histories as proof of authentic, steady student authorship.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowNewBranchModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] bg-white dark:bg-[#1E293B] hover:bg-[#F8FAFC] dark:hover:bg-[#334155] border border-[#E2E8F0] dark:border-[#334155] transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Branch</span>
            </button>

            <button
              id="btn-log-work-commit"
              onClick={onOpenCommitModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all shadow-xs"
            >
              <GitCommit className="w-4 h-4" />
              <span>Log Work & Commit</span>
            </button>
          </div>
        </div>

        {/* Branch Selector Bar */}
        <div className="mt-6 pt-4 border-t border-[#E2E8F0] dark:border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mr-1 flex items-center gap-1">
              <GitBranch className="w-3.5 h-3.5" /> Branch Filter:
            </span>
            <button
              onClick={() => setSelectedBranchFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedBranchFilter === "all"
                  ? "bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] font-semibold"
                  : "bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#94A3B8] hover:bg-[#E2E8F0] dark:hover:bg-[#334155]"
              }`}
            >
              All Branches ({project.commits.length})
            </button>
            {project.branches.map((b) => (
              <button
                key={b.name}
                onClick={() => setSelectedBranchFilter(b.name)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
                  selectedBranchFilter === b.name
                    ? "bg-[#2563EB] text-white font-semibold shadow-xs"
                    : "bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#94A3B8] hover:bg-[#E2E8F0] dark:hover:bg-[#334155]"
                }`}
              >
                <span>{b.name}</span>
                {project.currentBranch === b.name && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">
            <span>Active HEAD:</span>
            <span className="px-2 py-0.5 rounded bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#1E40AF] dark:text-[#93C5FD] font-bold border border-[#DBEAFE] dark:border-[#2563EB]/40">
              {project.currentBranch}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Commit History Visual Graph */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0] dark:border-[#1E293B]">
              <div className="flex items-center gap-2 font-semibold text-[#0F172A] dark:text-white text-sm">
                <FolderGit2 className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
                <span>Commit Graph & Audit History</span>
              </div>
              <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">
                {filteredCommits.length} commits listed
              </span>
            </div>

            {/* Commits Tree List */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E2E8F0] dark:before:bg-[#1E293B]">
              {filteredCommits.map((commit, idx) => {
                const isSelected = selectedCommit?.id === commit.id;
                return (
                  <div
                    key={commit.id}
                    onClick={() => setSelectedCommit(commit)}
                    className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#EFF6FF] dark:bg-[#1E293B] border-[#2563EB] dark:border-[#3B82F6] ring-2 ring-[#2563EB]/15 dark:ring-[#3B82F6]/30 shadow-xs"
                        : "bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-[#1E293B] hover:border-[#CBD5E1] dark:hover:border-[#334155] hover:bg-[#F8FAFC] dark:hover:bg-[#131D2F]"
                    }`}
                  >
                    {/* Node Dot on line */}
                    <div
                      className={`absolute -left-[19px] top-5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0F172A] transition-colors ${
                        isSelected
                          ? "bg-[#2563EB] ring-2 ring-blue-200 dark:ring-blue-900"
                          : commit.tag
                          ? "bg-[#22C55E]"
                          : "bg-[#94A3B8] dark:bg-[#475569]"
                      }`}
                    />

                    {/* Commit Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#334155] dark:text-[#CBD5E1] bg-[#F1F5F9] dark:bg-[#1E293B] px-2 py-0.5 rounded border border-[#E2E8F0] dark:border-[#334155]">
                          {commit.hash}
                        </span>
                        <span className="font-mono text-xs text-[#1E40AF] dark:text-[#93C5FD] bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 px-2 py-0.5 rounded border border-[#DBEAFE] dark:border-[#2563EB]/40">
                          {commit.branch}
                        </span>
                        {commit.tag && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#166534] dark:text-[#4ADE80] bg-[#DCFCE7] dark:bg-[#14532D]/50 px-2 py-0.5 rounded border border-[#BBF7D0] dark:border-[#166534]">
                            <Tag className="w-3 h-3" />
                            {commit.tag}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {commit.timestamp}
                      </span>
                    </div>

                    {/* Commit Message */}
                    <div className="font-mono text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white mb-2 leading-snug">
                      {commit.message}
                    </div>

                    {/* Author & Diff summary */}
                    <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8] pt-2 border-t border-[#E2E8F0] dark:border-[#1E293B]">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-[#94A3B8] dark:text-[#64748B]" />
                        {commit.author.split("<")[0]}
                      </span>
                      <span className="font-mono text-[11px]">
                        <span className="text-[#166534] dark:text-[#4ADE80] font-semibold">+{commit.insertions}</span>{" "}
                        <span className="text-[#B91C1C] dark:text-[#F87171] font-semibold">-{commit.deletions}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Selected Commit Inspection & Terminal Scaffolder */}
        <div className="lg:col-span-5 space-y-6">
          {/* Commit Inspector */}
          {selectedCommit && (
            <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#1E293B] mb-4">
                <div className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                  Commit Details & Diff
                </div>
                <span className="font-mono text-xs text-[#64748B] dark:text-[#94A3B8]">Hash: {selectedCommit.hash}</span>
              </div>

              <div className="p-3.5 bg-[#0F172A] dark:bg-[#020617] text-slate-200 rounded-xl font-mono text-xs mb-4 border border-transparent dark:border-[#1E293B]">
                <div className="text-[#22C55E] font-semibold mb-1">commit {selectedCommit.hash}</div>
                <div className="text-slate-400">Author: {selectedCommit.author}</div>
                <div className="text-slate-400">Date: {selectedCommit.timestamp}</div>
                <div className="text-slate-400 mb-2">Branch: {selectedCommit.branch}</div>
                <div className="text-white font-sans text-sm font-semibold pt-2 border-t border-slate-800 dark:border-slate-700">
                  {selectedCommit.message}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                  Modified Artifacts & Files ({selectedCommit.filesChanged.length})
                </div>
                <div className="space-y-1.5 font-mono text-xs">
                  {selectedCommit.filesChanged.map((file) => (
                    <div
                      key={file}
                      className="flex items-center gap-2 p-2 bg-[#F8FAFC] dark:bg-[#131D2F] rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] text-[#334155] dark:text-[#CBD5E1]"
                    >
                      <FileCode className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
                      <span className="truncate">{file}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Real Terminal Command Generator */}
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#1E293B] mb-3">
              <div className="flex items-center gap-2 text-[#0F172A] dark:text-white font-semibold text-sm">
                <Terminal className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
                <span>Run in Your Real Terminal</span>
              </div>
              <button
                onClick={copyScriptToClipboard}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-white dark:bg-[#1E293B] hover:bg-[#F8FAFC] dark:hover:bg-[#334155] text-[#334155] dark:text-[#CBD5E1] border border-[#E2E8F0] dark:border-[#334155] transition-colors shadow-2xs"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8]" />}
                <span>{copiedScript ? "Copied!" : "Copy Script"}</span>
              </button>
            </div>

            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-3">
              Copy and paste these commands into your terminal or VS Code to initialize this real Git repository on your computer.
            </p>

            <pre className="p-3.5 bg-[#0F172A] dark:bg-[#020617] text-slate-200 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-transparent dark:border-[#1E293B]">
              <code>{generateTerminalScript()}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* New Branch Modal */}
      {showNewBranchModal && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E2E8F0] dark:border-[#1E293B]">
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">Create New Feature Branch</h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-4">
              Enter a descriptive branch name following academic feature conventions (e.g. <code>feature/dataset-cleaning</code> or <code>phase-3/inference-api</code>).
            </p>
            <form onSubmit={handleCreateBranchSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={newBranchInput}
                  onChange={(e) => setNewBranchInput(e.target.value)}
                  placeholder="feature/your-topic"
                  className="w-full text-sm font-mono p-2.5 rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewBranchModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg shadow-xs"
                >
                  Create Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
