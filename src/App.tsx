import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { IdeaGeneratorView } from "./components/IdeaGeneratorView";
import { MilestonesView } from "./components/MilestonesView";
import { VersionControlView } from "./components/VersionControlView";
import { ArchitectureView } from "./components/ArchitectureView";
import { MentorAndVivaView } from "./components/MentorAndVivaView";
import { AuthView } from "./components/AuthView";
import { CommitModal } from "./components/CommitModal";
import { SynopsisExportModal } from "./components/SynopsisExportModal";
import { ActiveProject, Milestone, ProjectIdea, StudentProfile, UserProfile } from "./types";
import { INITIAL_DEFAULT_PROJECT, CURATED_IDEAS, createDefaultProjectForIdea } from "./data/sampleProjects";
import { getStoredCurrentUser, setStoredCurrentUser } from "./data/authDemoUsers";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "generator" | "milestones" | "vcs" | "architecture" | "mentor" | "synopsis" | "auth"
  >("milestones");

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getStoredCurrentUser());

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setStoredCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setStoredCurrentUser(null);
    setActiveTab("auth");
  };

  const handleSwitchUser = (user: UserProfile) => {
    setCurrentUser(user);
    setStoredCurrentUser(user);
  };

  const [activeProject, setActiveProject] = useState<ActiveProject>(() => {
    try {
      const saved = localStorage.getItem("capstone_active_project");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          parsed.idea &&
          Array.isArray(parsed.milestones) &&
          Array.isArray(parsed.commits) &&
          Array.isArray(parsed.branches)
        ) {
          return {
            ...INITIAL_DEFAULT_PROJECT,
            ...parsed,
            milestones: parsed.milestones || INITIAL_DEFAULT_PROJECT.milestones,
            commits: parsed.commits || INITIAL_DEFAULT_PROJECT.commits,
            branches: parsed.branches || INITIAL_DEFAULT_PROJECT.branches,
            architecture: parsed.architecture || INITIAL_DEFAULT_PROJECT.architecture,
            vivaDefenseGuide: parsed.vivaDefenseGuide || INITIAL_DEFAULT_PROJECT.vivaDefenseGuide,
            improvements: parsed.improvements || INITIAL_DEFAULT_PROJECT.improvements,
            mentorChat: parsed.mentorChat || INITIAL_DEFAULT_PROJECT.mentorChat,
          };
        }
      }
    } catch (e) {
      console.error("Failed to load saved project:", e);
    }
    return INITIAL_DEFAULT_PROJECT;
  });

  const [generatedIdeas, setGeneratedIdeas] = useState<ProjectIdea[]>(CURATED_IDEAS);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [isAdoptingProjectId, setIsAdoptingProjectId] = useState<string | null>(null);
  const [isSendingChatMessage, setIsSendingChatMessage] = useState(false);
  const [isGeneratingImprovements, setIsGeneratingImprovements] = useState(false);
  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [isSynopsisModalOpen, setIsSynopsisModalOpen] = useState(false);
  const [commitMilestoneHint, setCommitMilestoneHint] = useState<string>("");

  // Persist project changes
  useEffect(() => {
    if (activeProject) {
      localStorage.setItem("capstone_active_project", JSON.stringify(activeProject));
    }
  }, [activeProject]);

  // Handle Idea Generation
  const handleGenerateIdeas = async (profile: StudentProfile) => {
    setIsGeneratingIdeas(true);
    try {
      const res = await fetch("/api/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
        setGeneratedIdeas(data.projects);
      }
    } catch (error) {
      console.error("Error generating ideas:", error);
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  // Handle Adopting / Selecting a Project with resilient fallback
  const handleSelectProject = async (idea: ProjectIdea) => {
    if (isAdoptingProjectId) return;
    setIsAdoptingProjectId(idea.id);

    // Build immediate, comprehensive fallback tailored to the adopted idea
    const fallbackProject = createDefaultProjectForIdea(idea);

    try {
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: idea }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.milestones && Array.isArray(data.milestones) && data.milestones.length > 0) {
          fallbackProject.milestones = data.milestones;
        }
        if (data.systemArchitecture && Array.isArray(data.systemArchitecture.components)) {
          fallbackProject.architecture = data.systemArchitecture;
        }
        if (data.vivaDefenseGuide && Array.isArray(data.vivaDefenseGuide) && data.vivaDefenseGuide.length > 0) {
          fallbackProject.vivaDefenseGuide = data.vivaDefenseGuide;
        }
      }
    } catch (e) {
      console.warn("Roadmap API request failed or timed out, adopting with verified defaults:", e);
    } finally {
      setActiveProject(fallbackProject);
      setActiveTab("milestones");
      setIsAdoptingProjectId(null);
    }
  };

  // Toggle Deliverable Completion
  const handleToggleDeliverable = (milestoneId: string, deliverableId: string) => {
    setActiveProject((prev) => {
      const updatedMilestones = prev.milestones.map((m) => {
        if (m.id !== milestoneId) return m;
        return {
          ...m,
          deliverables: m.deliverables.map((d) => {
            if (d.id !== deliverableId) return d;
            const willBeCompleted = !d.completed;
            return {
              ...d,
              completed: willBeCompleted,
              completedAt: willBeCompleted
                ? new Date().toISOString().slice(0, 10)
                : undefined,
            };
          }),
        };
      });

      return {
        ...prev,
        milestones: updatedMilestones,
        lastUpdated: new Date().toISOString().replace("T", " ").slice(0, 16),
      };
    });
  };

  // Switch Branch
  const handleSwitchBranch = (branchName: string) => {
    setActiveProject((prev) => ({
      ...prev,
      currentBranch: branchName,
    }));
  };

  // Create Branch
  const handleCreateBranch = (branchName: string) => {
    setActiveProject((prev) => {
      const exists = prev.branches.some((b) => b.name === branchName);
      if (exists) {
        return { ...prev, currentBranch: branchName };
      }
      return {
        ...prev,
        branches: [
          ...prev.branches,
          {
            name: branchName,
            isDefault: false,
            lastCommitHash: prev.commits[0]?.hash || "1a8f92c",
          },
        ],
        currentBranch: branchName,
      };
    });
  };

  // Save Commit
  const handleSaveCommit = (commitData: {
    message: string;
    branch: string;
    tag?: string;
    filesChanged: string[];
    insertions: number;
    deletions: number;
  }) => {
    const newHash = Math.random().toString(16).substring(2, 9);
    const newCommit = {
      id: `c-${Date.now()}`,
      hash: newHash,
      message: commitData.message,
      branch: commitData.branch,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      author: "Student Researcher <researcher@univ.edu>",
      filesChanged: commitData.filesChanged,
      insertions: commitData.insertions,
      deletions: commitData.deletions,
      tag: commitData.tag,
    };

    setActiveProject((prev) => ({
      ...prev,
      commits: [newCommit, ...prev.commits],
      currentBranch: commitData.branch,
      lastUpdated: new Date().toISOString().replace("T", " ").slice(0, 16),
    }));
  };

  // Send Mentor Chat Message
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: "student" as const,
      text: text.trim(),
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
    };

    setActiveProject((prev) => ({
      ...prev,
      mentorChat: [...prev.mentorChat, userMsg],
    }));

    setIsSendingChatMessage(true);
    try {
      const currentMilestone = activeProject.milestones.find(
        (m) => m.phase === activeProject.currentMilestonePhase
      );

      const res = await fetch("/api/mentor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: activeProject.idea,
          message: text,
          currentMilestone,
          chatHistory: activeProject.mentorChat.slice(-6),
        }),
      });
      const data = await res.json();

      const mentorMsg = {
        id: `msg-mentor-${Date.now()}`,
        sender: "mentor" as const,
        text: data.reply || "Keep up the momentum on your current phase deliverables.",
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      };

      setActiveProject((prev) => ({
        ...prev,
        mentorChat: [...prev.mentorChat, mentorMsg],
      }));
    } catch (e) {
      console.error("Chat error:", e);
    } finally {
      setIsSendingChatMessage(false);
    }
  };

  // Ask Mentor about a specific milestone
  const handleAskMentorAboutMilestone = async (milestone: Milestone) => {
    setActiveTab("mentor");
    await handleSendMessage(
      `What are the most critical reviewer expectations for Phase ${milestone.phase}: "${milestone.title}"? What common pitfalls should I avoid during this review?`
    );
  };

  // Generate Improvements
  const handleGenerateImprovements = async () => {
    setIsGeneratingImprovements(true);
    try {
      const res = await fetch("/api/improve-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: activeProject.idea }),
      });
      const data = await res.json();
      if (data.improvements && Array.isArray(data.improvements)) {
        setActiveProject((prev) => ({
          ...prev,
          improvements: data.improvements,
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingImprovements(false);
    }
  };

  // Open Commit Modal with optional milestone context
  const handleOpenCommitModal = (milestoneTitle?: string) => {
    setCommitMilestoneHint(milestoneTitle || "");
    setIsCommitModalOpen(true);
  };

  // Compute Completion %
  const allDeliverables = activeProject ? activeProject.milestones.flatMap((m) => m.deliverables) : [];
  const completedCount = allDeliverables.filter((d) => d.completed).length;
  const completionPercentage =
    allDeliverables.length > 0 ? Math.round((completedCount / allDeliverables.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#090D16] text-[#1A1C1E] dark:text-[#F1F5F9] flex flex-col font-sans transition-colors duration-200">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeProject={activeProject}
        onOpenNewProject={() => setActiveTab("generator")}
        onOpenSynopsis={() => setIsSynopsisModalOpen(true)}
        completionPercentage={completionPercentage}
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
        {activeTab === "auth" && (
          <AuthView
            currentUser={currentUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onContinueToWorkspace={() => setActiveTab("milestones")}
          />
        )}

        {activeTab === "generator" && (
          <IdeaGeneratorView
            onSelectProject={handleSelectProject}
            isGenerating={isGeneratingIdeas}
            onGenerateIdeas={handleGenerateIdeas}
            generatedIdeas={generatedIdeas}
            activeProjectId={activeProject?.idea.id}
            adoptingProjectId={isAdoptingProjectId}
          />
        )}

        {activeTab === "milestones" && (
          <MilestonesView
            project={activeProject}
            onToggleDeliverable={handleToggleDeliverable}
            onSelectBranch={handleSwitchBranch}
            onOpenCommitModal={handleOpenCommitModal}
            onAskMentorAboutMilestone={handleAskMentorAboutMilestone}
            onOpenDownloadPdf={() => setIsSynopsisModalOpen(true)}
          />
        )}

        {activeTab === "vcs" && (
          <VersionControlView
            project={activeProject}
            onOpenCommitModal={() => handleOpenCommitModal()}
            onSwitchBranch={handleSwitchBranch}
            onCreateBranch={handleCreateBranch}
          />
        )}

        {activeTab === "architecture" && (
          <ArchitectureView
            project={activeProject}
            onOpenDownloadPdf={() => setIsSynopsisModalOpen(true)}
          />
        )}

        {activeTab === "mentor" && (
          <MentorAndVivaView
            project={activeProject}
            onSendMessage={handleSendMessage}
            isSendingMessage={isSendingChatMessage}
            onGenerateImprovements={handleGenerateImprovements}
            isGeneratingImprovements={isGeneratingImprovements}
          />
        )}
      </main>

      {/* Professional Polish Bottom Status Bar */}
      <footer className="h-12 bg-white dark:bg-[#0F172A] border-t border-[#E2E8F0] dark:border-[#1E293B] px-4 sm:px-8 flex items-center justify-between text-[11px] text-[#94A3B8] dark:text-[#64748B] shrink-0 sticky bottom-0 z-30 transition-colors duration-200">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></div>
            <span className="font-semibold text-[#334155] dark:text-[#E2E8F0]">System Active</span>
          </div>
          {currentUser && (
            <div className="hidden md:flex items-center gap-1.5 text-[#475569] dark:text-[#94A3B8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
              <span>
                User: <strong className="text-[#0F172A] dark:text-white">{currentUser.name}</strong> ({currentUser.role})
              </span>
            </div>
          )}
          <div className="hidden sm:flex items-center gap-2 text-[#64748B] dark:text-[#94A3B8]">
            <span>Branch: <strong className="text-[#0F172A] dark:text-[#93C5FD] font-mono">{activeProject.currentBranch}</strong></span>
            <span>•</span>
            <span>{activeProject.commits.length} commits verified</span>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden sm:inline text-[#64748B] dark:text-[#94A3B8] font-medium">Total Progress</span>
          <div className="w-32 sm:w-48 h-2 bg-[#F1F5F9] dark:bg-[#1E293B] rounded-full overflow-hidden border border-[#E2E8F0] dark:border-[#334155]">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="font-bold text-[#0F172A] dark:text-white">{completionPercentage}%</span>
        </div>
      </footer>

      {/* Modals */}
      <CommitModal
        isOpen={isCommitModalOpen}
        onClose={() => setIsCommitModalOpen(false)}
        project={activeProject}
        defaultMilestoneTitle={commitMilestoneHint}
        onSaveCommit={handleSaveCommit}
      />

      <SynopsisExportModal
        isOpen={isSynopsisModalOpen}
        onClose={() => setIsSynopsisModalOpen(false)}
        project={activeProject}
        currentUser={currentUser}
      />
    </div>
  );
}
