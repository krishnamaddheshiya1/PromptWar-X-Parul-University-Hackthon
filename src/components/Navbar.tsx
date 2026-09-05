import React from "react";
import {
  Sparkles,
  GitBranch,
  Download,
  FolderGit2,
  Layers,
  MessageSquareCode,
  Milestone,
  Terminal,
  ShieldCheck,
} from "lucide-react";
import { ActiveProject, UserProfile } from "../types";
import { UserProfileMenu } from "./UserProfileMenu";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  activeTab: "generator" | "milestones" | "vcs" | "architecture" | "mentor" | "synopsis" | "auth";
  setActiveTab: (tab: "generator" | "milestones" | "vcs" | "architecture" | "mentor" | "synopsis" | "auth") => void;
  activeProject: ActiveProject | null;
  onOpenNewProject: () => void;
  onOpenSynopsis: () => void;
  completionPercentage: number;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onSwitchUser: (user: UserProfile) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeProject,
  onOpenNewProject,
  onOpenSynopsis,
  completionPercentage,
  currentUser,
  onLogout,
  onSwitchUser,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#0F172A] border-b border-[#E2E8F0] dark:border-[#1E293B] shadow-xs transition-colors duration-200 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand matching Professional Polish */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#2563EB] rounded-lg flex items-center justify-center text-white shadow-xs">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-[#0F172A] dark:text-white">Mentor.AI</h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#EFF6FF] dark:bg-[#1E293B] text-[#1E40AF] dark:text-[#60A5FA] rounded border border-[#DBEAFE] dark:border-[#2563EB]/40">
                  Capstones
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-widest font-semibold hidden md:block">
                Final Year Terminal
              </p>
            </div>
          </div>

          {/* Active Project Meta & Action */}
          <div className="flex items-center gap-2 sm:gap-3">
            {activeProject && (
              <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#F8FAFC] dark:bg-[#131D2F] border border-[#E2E8F0] dark:border-[#1E293B] text-xs">
                <div className="flex items-center gap-1.5 text-[#334155] dark:text-[#CBD5E1] font-medium max-w-[260px] lg:max-w-[380px] xl:max-w-[500px] 2xl:max-w-[650px] truncate">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0" />
                  <span className="truncate font-semibold text-[#0F172A] dark:text-white">{activeProject.idea.title}</span>
                </div>
                <div className="h-3.5 w-px bg-[#E2E8F0] dark:bg-[#1E293B]" />
                <div className="flex items-center gap-1 text-[#64748B] dark:text-[#94A3B8] font-mono">
                  <GitBranch className="w-3.5 h-3.5 text-[#94A3B8] dark:text-[#64748B]" />
                  <span className="text-[#0F172A] dark:text-[#93C5FD]">{activeProject.currentBranch}</span>
                </div>
                <div className="h-3.5 w-px bg-[#E2E8F0] dark:bg-[#1E293B]" />
                <div className="flex items-center gap-1.5">
                  <div className="w-16 bg-[#F1F5F9] dark:bg-[#1E293B] rounded-full h-2 overflow-hidden border border-[#E2E8F0] dark:border-[#334155]">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                  <span className="text-[#0F172A] dark:text-white font-bold text-[11px]">{completionPercentage}%</span>
                </div>
              </div>
            )}

            <button
              id="btn-nav-export-synopsis"
              onClick={onOpenSynopsis}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] bg-white dark:bg-[#1E293B] hover:bg-[#F8FAFC] dark:hover:bg-[#334155] border border-[#CBD5E1] dark:border-[#334155] transition-colors shadow-xs"
              title="Generate clean, document-ready summary of architecture and milestones for official university submission"
            >
              <Download className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
              <span className="hidden sm:inline">Download as PDF</span>
            </button>

            <button
              id="btn-nav-new-idea"
              onClick={onOpenNewProject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Generate Ideas</span>
            </button>

            {/* Theme Toggle (Light / Dark) */}
            <ThemeToggle />

            {/* Profile Dropdown / Auth status */}
            <UserProfileMenu
              currentUser={currentUser}
              onLogout={onLogout}
              onOpenAuthPage={() => setActiveTab("auth")}
              onSwitchUser={onSwitchUser}
            />
          </div>
        </div>

        {/* Navigation Tabs with Professional Polish styling */}
        <div className="flex space-x-1 sm:space-x-1.5 border-t border-[#E2E8F0] dark:border-[#1E293B] py-1.5 overflow-x-auto scrollbar-none">
          <button
            id="tab-generator"
            onClick={() => setActiveTab("generator")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "generator"
                ? "bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA] border border-[#DBEAFE] dark:border-[#2563EB]/40 shadow-xs"
                : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/60"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Idea Studio</span>
          </button>

          <button
            id="tab-milestones"
            onClick={() => setActiveTab("milestones")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "milestones"
                ? "bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA] border border-[#DBEAFE] dark:border-[#2563EB]/40 shadow-xs"
                : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/60"
            }`}
          >
            <Milestone className="w-4 h-4" />
            <span>Milestones & Roadmap</span>
            {activeProject && (
              <span className="ml-1 px-1.5 py-0.5 bg-[#DBEAFE] dark:bg-[#1E3A8A] text-[#1E40AF] dark:text-[#93C5FD] rounded text-[10px] font-bold">
                Phase {activeProject.currentMilestonePhase}/6
              </span>
            )}
          </button>

          <button
            id="tab-vcs"
            onClick={() => setActiveTab("vcs")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "vcs"
                ? "bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA] border border-[#DBEAFE] dark:border-[#2563EB]/40 shadow-xs"
                : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/60"
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Version Control Tracker</span>
            {activeProject && (
              <span className="ml-1 px-1.5 py-0.5 bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#94A3B8] rounded text-[10px] font-mono font-medium border border-[#E2E8F0] dark:border-[#334155]">
                {activeProject.commits.length} commits
              </span>
            )}
          </button>

          <button
            id="tab-architecture"
            onClick={() => setActiveTab("architecture")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "architecture"
                ? "bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA] border border-[#DBEAFE] dark:border-[#2563EB]/40 shadow-xs"
                : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/60"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Architecture & Blueprint</span>
          </button>

          <button
            id="tab-mentor"
            onClick={() => setActiveTab("mentor")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "mentor"
                ? "bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA] border border-[#DBEAFE] dark:border-[#2563EB]/40 shadow-xs"
                : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/60"
            }`}
          >
            <MessageSquareCode className="w-4 h-4" />
            <span>AI Mentor & Viva Prep</span>
          </button>

          <button
            id="tab-auth"
            onClick={() => setActiveTab("auth")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "auth"
                ? "bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA] border border-[#DBEAFE] dark:border-[#2563EB]/40 shadow-xs"
                : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/60"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Auth & Access Portal</span>
            {currentUser && (
              <span className="ml-0.5 w-2 h-2 rounded-full bg-[#22C55E]" title="Authenticated" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
