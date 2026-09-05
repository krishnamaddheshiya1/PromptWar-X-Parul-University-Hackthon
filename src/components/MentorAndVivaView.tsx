import React, { useState } from "react";
import {
  MessageSquareCode,
  Send,
  Sparkles,
  HelpCircle,
  Award,
  ChevronDown,
  ChevronUp,
  Flame,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import { ActiveProject, ChatMessage, ProjectImprovement } from "../types";

interface MentorAndVivaViewProps {
  project: ActiveProject;
  onSendMessage: (message: string) => Promise<void>;
  isSendingMessage: boolean;
  onGenerateImprovements: () => Promise<void>;
  isGeneratingImprovements: boolean;
}

export const MentorAndVivaView: React.FC<MentorAndVivaViewProps> = ({
  project,
  onSendMessage,
  isSendingMessage,
  onGenerateImprovements,
  isGeneratingImprovements,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [expandedVivaIndex, setExpandedVivaIndex] = useState<number | null>(0);

  const quickPrompts = [
    "What are the top 3 viva defense questions evaluators will ask?",
    "How can I prove this project is technically novel and not just a tutorial clone?",
    "How should I design the database schema for fast queries?",
    "What ablation experiments should I run for Chapter 4 results?",
  ];

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isSendingMessage) return;
    const msg = inputMessage;
    setInputMessage("");
    await onSendMessage(msg);
  };

  const handleQuickPromptClick = async (prompt: string) => {
    if (isSendingMessage) return;
    await onSendMessage(prompt);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] p-6 shadow-xs transition-colors">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] dark:bg-[#1E293B] text-[#1E40AF] dark:text-[#60A5FA] border border-[#DBEAFE] dark:border-[#2563EB]/40">
            Capstone Advisory & Defense Prep
          </span>
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">Mentorship & Examination Preparation</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
          AI Capstone Mentor & Viva Voce Drill
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-0.5">
          Ask technical guidance questions anytime, rehearse tough viva voce questions, and explore publication-grade upgrades.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: AI Mentor Chat - Dark Executive Terminal Console */}
        <div className="lg:col-span-7 flex flex-col h-[650px] bg-[#0F172A] rounded-2xl border border-[#1E293B] shadow-sm overflow-hidden text-white">
          {/* Chat Header */}
          <div className="p-4 bg-[#1E293B]/80 border-b border-[#334155] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                PV
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Prof. Alexander Vance</h4>
                <p className="text-[11px] text-[#94A3B8]">Capstone Project Advisor & External Evaluator</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[#22C55E] bg-[#166534]/30 px-2.5 py-1 rounded-full border border-[#22C55E]/40 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              Context: {project.idea.title.slice(0, 20)}...
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {project.mentorChat.map((msg) => {
              const isMentor = msg.sender === "mentor";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isMentor ? "justify-start" : "justify-end"}`}
                >
                  {isMentor && (
                    <div className="w-7 h-7 rounded-lg bg-[#1E293B] text-[#93C5FD] border border-[#334155] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      isMentor
                        ? "bg-[#1E293B] text-slate-200 border border-[#334155]"
                        : "bg-[#2563EB] text-white shadow-xs"
                    }`}
                  >
                    {msg.text}
                    <div
                      className={`text-[10px] mt-1 text-right font-mono ${
                        isMentor ? "text-[#94A3B8]" : "text-blue-200"
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isSendingMessage && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#1E293B] text-[#93C5FD] border border-[#334155] flex items-center justify-center font-bold text-[11px] shrink-0">
                  AI
                </div>
                <div className="bg-[#1E293B] p-3 rounded-2xl border border-[#334155] text-xs text-[#94A3B8] flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
                  <span>Prof. Vance is reviewing your project context...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 border-t border-[#1E293B] bg-[#0B1120] flex gap-2 overflow-x-auto scrollbar-none">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickPromptClick(qp)}
                className="px-2.5 py-1 text-[11px] bg-[#1E293B] hover:bg-[#334155] text-slate-300 border border-[#334155] rounded-full shrink-0 transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} className="p-3 bg-[#1E293B]/60 border-t border-[#334155] flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask your capstone guide about architecture, Viva defense, or code..."
              className="flex-1 text-xs sm:text-sm bg-[#0F172A] text-white placeholder:text-slate-400 rounded-xl px-3.5 py-2.5 border border-[#334155] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
            <button
              type="submit"
              disabled={isSendingMessage || !inputMessage.trim()}
              className="px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Right: Viva Voce Defense Prep & Project Enhancements */}
        <div className="lg:col-span-5 space-y-6">
          {/* Viva Voce Defense Drill */}
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#1E293B] mb-4">
              <div className="flex items-center gap-2 text-[#0F172A] dark:text-white font-semibold text-sm">
                <HelpCircle className="w-4 h-4 text-[#D97706] dark:text-[#FBBF24]" />
                <span>Viva Voce Defense Drill (Tough Questions)</span>
              </div>
              <span className="text-[11px] font-semibold text-[#92400E] dark:text-[#FDE68A] bg-[#FEF3C7] dark:bg-[#451A03]/50 px-2 py-0.5 rounded border border-[#FDE68A] dark:border-[#B45309]/50">
                Examination Prep
              </span>
            </div>

            <div className="space-y-3">
              {project.vivaDefenseGuide.map((item, idx) => {
                const isExpanded = expandedVivaIndex === idx;
                return (
                  <div key={idx} className="border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedVivaIndex(isExpanded ? null : idx)}
                      className="w-full text-left p-3.5 bg-[#F8FAFC] dark:bg-[#131D2F] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] flex items-start justify-between gap-2 transition-colors"
                    >
                      <div>
                        <span className="text-[11px] font-bold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider block mb-0.5">
                          {item.concept}
                        </span>
                        <div className="text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white">
                          {item.toughQuestion}
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8] shrink-0 mt-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8] shrink-0 mt-1" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="p-3.5 bg-white dark:bg-[#0F172A] border-t border-[#E2E8F0] dark:border-[#1E293B] text-xs sm:text-sm space-y-2">
                        <div className="text-[11px] font-semibold text-[#166534] dark:text-[#4ADE80] uppercase tracking-wider">
                          Model Answer Rationale (Evaluator Grade: 10/10):
                        </div>
                        <p className="text-[#334155] dark:text-[#CBD5E1] leading-relaxed bg-[#F0FDF4] dark:bg-[#052E16]/40 p-3 rounded-lg border border-[#BBF7D0] dark:border-[#14532D]">
                          {item.strongAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Publication Grade Project Improvements */}
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#1E293B] mb-4">
              <div className="flex items-center gap-2 text-[#0F172A] dark:text-white font-semibold text-sm">
                <Lightbulb className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
                <span>Project Improvements & Publication Edge</span>
              </div>
              <button
                onClick={onGenerateImprovements}
                disabled={isGeneratingImprovements}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] disabled:opacity-40"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isGeneratingImprovements ? "Analyzing..." : "Refresh"}</span>
              </button>
            </div>

            <div className="space-y-3">
              {project.improvements.map((imp, idx) => (
                <div key={idx} className="p-3.5 bg-[#F8FAFC] dark:bg-[#131D2F] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-[#0F172A] dark:text-white">{imp.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#1E40AF] dark:text-[#93C5FD] border border-[#DBEAFE] dark:border-[#2563EB]/40">
                      {imp.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-2 leading-relaxed">{imp.description}</p>
                  <div className="space-y-1">
                    {imp.actionSteps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-1.5 text-[11px] text-[#334155] dark:text-[#CBD5E1]">
                        <CheckCircle2 className="w-3 h-3 text-[#22C55E] shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
