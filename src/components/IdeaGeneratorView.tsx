import React, { useState } from "react";
import {
  Sparkles,
  Cpu,
  Layers,
  Award,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Clock,
  Users,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  Database,
  Code2,
  Terminal,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { ProjectIdea, StudentProfile } from "../types";
import { COMMON_DOMAINS, POPULAR_SKILLS, CURATED_IDEAS } from "../data/sampleProjects";

interface IdeaGeneratorViewProps {
  onSelectProject: (idea: ProjectIdea) => void;
  isGenerating: boolean;
  onGenerateIdeas: (profile: StudentProfile) => void;
  generatedIdeas: ProjectIdea[];
  activeProjectId?: string;
  adoptingProjectId?: string | null;
}

export const IdeaGeneratorView: React.FC<IdeaGeneratorViewProps> = ({
  onSelectProject,
  isGenerating,
  onGenerateIdeas,
  generatedIdeas,
  activeProjectId,
  adoptingProjectId,
}) => {
  const [profile, setProfile] = useState<StudentProfile>({
    degreeLevel: "Undergraduate (B.Tech / BS)",
    teamSize: 2,
    duration: "6 months",
    complexity: "Advanced",
    hardware: "Standard Laptop + Cloud GPU (Colab/Kaggle)",
    interests: ["Artificial Intelligence & ML", "Healthcare & BioTech"],
    skills: ["Python", "React", "PyTorch", "FastAPI"],
    customTheme: "",
  });

  const [customInterestInput, setCustomInterestInput] = useState("");
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [selectedTab, setSelectedTab] = useState<"generator" | "curated">("generator");

  const toggleInterest = (domain: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.includes(domain)
        ? prev.interests.filter((d) => d !== domain)
        : [...prev.interests, domain],
    }));
  };

  const toggleSkill = (skill: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const addCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInterestInput.trim() && !profile.interests.includes(customInterestInput.trim())) {
      setProfile((prev) => ({
        ...prev,
        interests: [...prev.interests, customInterestInput.trim()],
      }));
      setCustomInterestInput("");
    }
  };

  const addCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkillInput.trim() && !profile.skills.includes(customSkillInput.trim())) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, customSkillInput.trim()],
      }));
      setCustomSkillInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateIdeas(profile);
  };

  const displayedIdeas = selectedTab === "curated" ? CURATED_IDEAS : generatedIdeas.length > 0 ? generatedIdeas : CURATED_IDEAS;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] p-6 sm:p-8 shadow-xs transition-colors">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#1E40AF] dark:text-[#93C5FD] text-xs font-semibold mb-3 border border-[#DBEAFE] dark:border-[#2563EB]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
            AI Capstone Formulation Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white mb-2">
            AI Project Idea Generator & Academic Mentor
          </h1>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-sm sm:text-base leading-relaxed">
            Generate high-impact, practical final-year engineering projects tailored to your technical skills, timeline, and academic viva voce evaluation rubrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Student Profile & Preferences */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0] dark:border-[#1E293B]">
              <div className="flex items-center gap-2 text-[#0F172A] dark:text-white font-semibold text-base">
                <SlidersHorizontal className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
                <span>Student Academic Profile</span>
              </div>
              <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">Parameters</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Degree Level */}
              <div>
                <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                  Academic Level
                </label>
                <select
                  value={profile.degreeLevel}
                  onChange={(e) => setProfile({ ...profile, degreeLevel: e.target.value })}
                  className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-3 py-2 text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="Undergraduate (B.Tech / BS / BE)">Undergraduate (B.Tech / BS / BE)</option>
                  <option value="Postgraduate (M.Tech / MS / MCA)">Postgraduate (M.Tech / MS / MCA)</option>
                  <option value="Polytechnic / Diploma">Polytechnic / Diploma</option>
                  <option value="Honours Research Capstone">Honours Research Capstone</option>
                </select>
              </div>

              {/* Team Size & Timeline */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                    Team Size
                  </label>
                  <div className="flex items-center border border-[#CBD5E1] dark:border-[#334155] rounded-lg px-3 py-2 bg-white dark:bg-[#1E293B]">
                    <Users className="w-4 h-4 text-[#94A3B8] mr-2" />
                    <select
                      value={profile.teamSize}
                      onChange={(e) => setProfile({ ...profile, teamSize: Number(e.target.value) })}
                      className="w-full text-sm bg-transparent text-[#0F172A] dark:text-white focus:outline-none"
                    >
                      <option value={1} className="dark:bg-[#1E293B]">1 (Individual)</option>
                      <option value={2} className="dark:bg-[#1E293B]">2 Students</option>
                      <option value={3} className="dark:bg-[#1E293B]">3 Students</option>
                      <option value={4} className="dark:bg-[#1E293B]">4 Students</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                    Duration
                  </label>
                  <div className="flex items-center border border-[#CBD5E1] dark:border-[#334155] rounded-lg px-3 py-2 bg-white dark:bg-[#1E293B]">
                    <Clock className="w-4 h-4 text-[#94A3B8] mr-2" />
                    <select
                      value={profile.duration}
                      onChange={(e) => setProfile({ ...profile, duration: e.target.value })}
                      className="w-full text-sm bg-transparent text-[#0F172A] dark:text-white focus:outline-none"
                    >
                      <option value="3 months (1 Semester fast-track)" className="dark:bg-[#1E293B]">3 months</option>
                      <option value="6 months (Standard Semester)" className="dark:bg-[#1E293B]">6 months</option>
                      <option value="1 Academic Year (2 Semesters)" className="dark:bg-[#1E293B]">1 Full Year</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Target Complexity */}
              <div>
                <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                  Target Complexity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Moderate", "Advanced", "Research / Publication Grade"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setProfile({ ...profile, complexity: lvl })}
                      className={`px-2.5 py-2 text-xs font-medium rounded-lg border transition-all text-center leading-tight ${
                        profile.complexity === lvl
                          ? "bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 border-[#2563EB] dark:border-[#3B82F6] text-[#1E40AF] dark:text-[#93C5FD] font-semibold"
                          : "border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hardware / Compute Availability */}
              <div>
                <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                  Compute & Hardware Setup
                </label>
                <select
                  value={profile.hardware}
                  onChange={(e) => setProfile({ ...profile, hardware: e.target.value })}
                  className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-3 py-2 text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="Standard Laptop (CPU only)" className="dark:bg-[#1E293B]">Standard Laptop (CPU only, Web/API)</option>
                  <option value="Standard Laptop + Cloud GPU (Colab/Kaggle)" className="dark:bg-[#1E293B]">Standard Laptop + Free Cloud GPU (Colab/Kaggle)</option>
                  <option value="Dedicated Workstation (NVIDIA RTX GPU)" className="dark:bg-[#1E293B]">Dedicated Workstation (Local NVIDIA RTX GPU)</option>
                  <option value="Embedded Hardware (Raspberry Pi / ESP32 / Arduino)" className="dark:bg-[#1E293B]">Embedded Hardware (Raspberry Pi / ESP32 / Arduino)</option>
                  <option value="Edge AI (Jetson Nano / Coral TPU)" className="dark:bg-[#1E293B]">Edge AI Accelerator (Jetson Nano / Coral)</option>
                </select>
              </div>

              {/* Domains of Interest */}
              <div>
                <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                  Domains of Interest ({profile.interests.length} selected)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {COMMON_DOMAINS.map((domain) => {
                    const isSelected = profile.interests.includes(domain);
                    return (
                      <button
                        key={domain}
                        type="button"
                        onClick={() => toggleInterest(domain)}
                        className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                          isSelected
                            ? "bg-[#2563EB] text-white font-medium shadow-xs"
                            : "bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#CBD5E1] hover:bg-[#E2E8F0] dark:hover:bg-[#334155]"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {domain}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 flex gap-1.5">
                  <input
                    type="text"
                    value={customInterestInput}
                    onChange={(e) => setCustomInterestInput(e.target.value)}
                    placeholder="Add custom domain (e.g. Agritech)..."
                    className="text-xs px-2.5 py-1.5 border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-white rounded-md w-full focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                  <button
                    type="button"
                    onClick={addCustomInterest}
                    className="px-2.5 py-1 text-xs bg-[#F1F5F9] dark:bg-[#1E293B] hover:bg-[#E2E8F0] dark:hover:bg-[#334155] rounded-md font-medium text-[#334155] dark:text-[#CBD5E1]"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Skills & Technologies Known */}
              <div>
                <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                  Your Skills & Tech Stack ({profile.skills.length} selected)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {POPULAR_SKILLS.map((skill) => {
                    const isSelected = profile.skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                          isSelected
                            ? "bg-[#2563EB] text-white font-medium shadow-xs"
                            : "bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#CBD5E1] hover:bg-[#E2E8F0] dark:hover:bg-[#334155]"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {skill}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 flex gap-1.5">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    placeholder="Add other skill (e.g. Rust, OpenCV)..."
                    className="text-xs px-2.5 py-1.5 border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-white rounded-md w-full focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    className="px-2.5 py-1 text-xs bg-[#F1F5F9] dark:bg-[#1E293B] hover:bg-[#E2E8F0] dark:hover:bg-[#334155] rounded-md font-medium text-[#334155] dark:text-[#CBD5E1]"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Custom Problem Theme / Prompt */}
              <div>
                <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                  Specific Problem Theme or Idea Angle (Optional)
                </label>
                <textarea
                  rows={2}
                  value={profile.customTheme}
                  onChange={(e) => setProfile({ ...profile, customTheme: e.target.value })}
                  placeholder="e.g., 'Automatic detection of pothole depth using dashcam footage' or 'Decentralized voting for campus elections'"
                  className="w-full text-xs sm:text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-white p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
                />
              </div>

              {/* Submit button */}
              <button
                id="btn-generate-proposals"
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm bg-[#2563EB] hover:bg-[#1D4ED8] transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing Academic Rubrics & Formulating Ideas...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Capstone Proposals</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Section: Generated Proposals & Showcase */}
        <div className="lg:col-span-7 space-y-6">
          {/* Subheader tabs */}
          <div className="flex items-center justify-between bg-white dark:bg-[#0F172A] p-3 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedTab("generator")}
                className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                  selectedTab === "generator"
                    ? "bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A]"
                    : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white"
                }`}
              >
                AI Generated Proposals ({displayedIdeas.length})
              </button>
              <button
                onClick={() => setSelectedTab("curated")}
                className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                  selectedTab === "curated"
                    ? "bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A]"
                    : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white"
                }`}
              >
                Curated Capstones (3 Showcase)
              </button>
            </div>
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8] hidden sm:inline">
              Click any project to initialize roadmap & Git tracker
            </span>
          </div>

          {/* Project Cards List */}
          <div className="space-y-6">
            {displayedIdeas.map((idea) => {
              const isActive = activeProjectId === idea.id || activeProjectId === `${idea.id}-active`;
              return (
                <div
                  key={idea.id}
                  className={`bg-white dark:bg-[#0F172A] rounded-2xl border transition-all p-6 relative shadow-xs hover:shadow-sm ${
                    isActive ? "border-[#2563EB] ring-2 ring-[#2563EB]/15 dark:ring-[#3B82F6]/30" : "border-[#E2E8F0] dark:border-[#1E293B]"
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DCFCE7] dark:bg-[#14532D]/50 text-[#166534] dark:text-[#4ADE80] border border-[#BBF7D0] dark:border-[#166534] text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                      Active Workspace Project
                    </div>
                  )}

                  {/* Header badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#1E40AF] dark:text-[#93C5FD] text-xs font-medium border border-[#DBEAFE] dark:border-[#2563EB]/40">
                      {idea.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FEF3C7] dark:bg-[#451A03]/50 text-[#92400E] dark:text-[#FDE68A] text-xs font-medium border border-[#FDE68A] dark:border-[#B45309]/50">
                      {idea.complexity}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#94A3B8] text-xs font-medium border border-[#E2E8F0] dark:border-[#334155]">
                      Est. {idea.estimatedWeeks} Weeks
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white leading-snug mb-1">
                    {idea.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#2563EB] dark:text-[#60A5FA] font-medium mb-3">
                    {idea.tagline}
                  </p>

                  {/* Problem & Impact */}
                  <div className="space-y-2 mb-4 bg-[#F8FAFC] dark:bg-[#131D2F] rounded-xl p-3.5 border border-[#E2E8F0] dark:border-[#1E293B] text-xs sm:text-sm">
                    <div>
                      <span className="font-semibold text-[#0F172A] dark:text-white">Problem Statement: </span>
                      <span className="text-[#334155] dark:text-[#CBD5E1]">{idea.problemStatement}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#0F172A] dark:text-white">Real-World Impact: </span>
                      <span className="text-[#334155] dark:text-[#CBD5E1]">{idea.practicalImpact}</span>
                    </div>
                  </div>

                  {/* Academic Rubric Scores */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 p-3 bg-[#F8FAFC] dark:bg-[#131D2F] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]">
                    <div>
                      <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider font-semibold">Novelty</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-sm font-bold text-[#0F172A] dark:text-white">{idea.academicRubric.noveltyScore}/10</span>
                        <div className="w-full bg-[#E2E8F0] dark:bg-[#334155] rounded-full h-1.5">
                          <div
                            className="bg-[#2563EB] dark:bg-[#3B82F6] h-1.5 rounded-full"
                            style={{ width: `${idea.academicRubric.noveltyScore * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider font-semibold">Feasibility</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-sm font-bold text-[#0F172A] dark:text-white">{idea.academicRubric.implementationFeasibility}/10</span>
                        <div className="w-full bg-[#E2E8F0] dark:bg-[#334155] rounded-full h-1.5">
                          <div
                            className="bg-[#22C55E] h-1.5 rounded-full"
                            style={{ width: `${idea.academicRubric.implementationFeasibility * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider font-semibold">Viva Appeal</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-sm font-bold text-[#0F172A] dark:text-white">{idea.academicRubric.vivaAppeal}/10</span>
                        <div className="w-full bg-[#E2E8F0] dark:bg-[#334155] rounded-full h-1.5">
                          <div
                            className="bg-[#F59E0B] h-1.5 rounded-full"
                            style={{ width: `${idea.academicRubric.vivaAppeal * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider font-semibold">Industry Relevance</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-sm font-bold text-[#0F172A] dark:text-white">{idea.academicRubric.industryRelevance}/10</span>
                        <div className="w-full bg-[#E2E8F0] dark:bg-[#334155] rounded-full h-1.5">
                          <div
                            className="bg-[#2563EB] dark:bg-[#3B82F6] h-1.5 rounded-full"
                            style={{ width: `${idea.academicRubric.industryRelevance * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Core Features */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                      Core Functional Deliverables
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {idea.keyFeatures.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-[#334155] dark:text-[#CBD5E1]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-[#3B82F6] mt-1.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack Matrix */}
                  <div className="mb-5 pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B]">
                    <div className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                      Recommended Tech Stack
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {idea.techStack.frontend.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#1E40AF] dark:text-[#93C5FD] border border-[#DBEAFE] dark:border-[#2563EB]/40 text-xs font-medium">
                          {t}
                        </span>
                      ))}
                      {idea.techStack.backend.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-[#F0FDF4] dark:bg-[#052E16]/40 text-[#166534] dark:text-[#86EFAC] border border-[#BBF7D0] dark:border-[#14532D] text-xs font-medium">
                          {t}
                        </span>
                      ))}
                      {idea.techStack.ai_ml.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-[#FAF5FF] dark:bg-[#3B0764]/40 text-[#6B21A8] dark:text-[#E9D5FF] border border-[#E9D5FF] dark:border-[#7E22CE]/40 text-xs font-medium">
                          {t}
                        </span>
                      ))}
                      {idea.techStack.database.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-[#FEF3C7] dark:bg-[#451A03]/50 text-[#92400E] dark:text-[#FDE68A] border border-[#FDE68A] dark:border-[#B45309]/50 text-xs font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Viva Voce Question Preview */}
                  {idea.vivaQuestions && idea.vivaQuestions.length > 0 && (
                    <div className="mb-5 bg-[#FEF3C7]/60 dark:bg-[#451A03]/30 rounded-xl p-3 border border-[#FDE68A] dark:border-[#B45309]/50">
                      <div className="flex items-center gap-1.5 text-[#92400E] dark:text-[#FDE68A] font-semibold text-xs mb-1">
                        <HelpCircle className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FBBF24]" />
                        <span>Sample Viva Voce Defense Question:</span>
                      </div>
                      <p className="text-xs text-[#0F172A] dark:text-[#F1F5F9] italic">
                        "{idea.vivaQuestions[0].question}"
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                      Datasets: {idea.sampleDatasetSources?.join(", ") || "Standard Challenge DB"}
                    </span>
                    <button
                      id={`btn-select-project-${idea.id}`}
                      disabled={Boolean(adoptingProjectId)}
                      onClick={() => onSelectProject(idea)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-xs"
                    >
                      {adoptingProjectId === idea.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Configuring Workspace...</span>
                        </>
                      ) : (
                        <>
                          <span>Adopt as Capstone Project</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
