import React, { useState, useRef, useEffect } from "react";
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  LogOut,
  ChevronDown,
  UserCheck,
  Shield,
  Layers,
  ArrowRightLeft,
} from "lucide-react";
import { UserProfile, UserRole } from "../types";
import { DEMO_USERS } from "../data/authDemoUsers";

interface UserProfileMenuProps {
  currentUser: UserProfile | null;
  onLogout: () => void;
  onOpenAuthPage: () => void;
  onSwitchUser: (user: UserProfile) => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  currentUser,
  onLogout,
  onOpenAuthPage,
  onSwitchUser,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case "student":
        return {
          title: "Lead Student",
          icon: GraduationCap,
          badgeColor: "bg-[#EFF6FF] text-[#1E40AF] border-[#DBEAFE]",
        };
      case "guide":
        return {
          title: "Faculty Guide",
          icon: Briefcase,
          badgeColor: "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]",
        };
      case "evaluator":
        return {
          title: "Viva Examiner",
          icon: Award,
          badgeColor: "bg-[#FAF5FF] text-[#6B21A8] border-[#E9D5FF]",
        };
    }
  };

  if (!currentUser) {
    return (
      <button
        id="btn-nav-auth-login"
        onClick={onOpenAuthPage}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-xs"
      >
        <User className="w-3.5 h-3.5" />
        <span>Sign In / Register</span>
      </button>
    );
  }

  const roleConfig = getRoleConfig(currentUser.role);
  const IconComponent = roleConfig.icon;

  return (
    <div className="relative" ref={menuRef}>
      <button
        id="btn-user-profile-menu"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-white dark:bg-[#1E293B] hover:bg-[#F8FAFC] dark:hover:bg-[#334155] border border-[#E2E8F0] dark:border-[#334155] transition-colors shadow-xs text-left"
      >
        <img
          src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
          alt={currentUser.name}
          className="w-7 h-7 rounded-lg object-cover border border-[#CBD5E1] dark:border-[#475569] shrink-0"
        />
        <div className="hidden md:block max-w-[120px] lg:max-w-[150px]">
          <div className="text-xs font-bold text-[#0F172A] dark:text-white truncate leading-tight">
            {currentUser.name}
          </div>
          <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] truncate leading-tight">
            {roleConfig.title}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] dark:text-[#64748B] shrink-0 hidden sm:block" />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-xl z-50 p-3 animate-in fade-in zoom-in-95 duration-100 font-sans text-[#0F172A] dark:text-[#F1F5F9]">
          {/* User Details */}
          <div className="p-2 border-b border-[#F1F5F9] dark:border-[#1E293B] mb-2">
            <div className="flex items-center gap-2.5 mb-2">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-10 h-10 rounded-xl object-cover border border-[#E2E8F0] dark:border-[#334155]"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-[#0F172A] dark:text-white truncate">{currentUser.name}</h4>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">{currentUser.email}</p>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${roleConfig.badgeColor}`}
                  >
                    <IconComponent className="w-2.5 h-2.5" />
                    <span>{roleConfig.title}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] space-y-0.5 bg-[#F8FAFC] dark:bg-[#1E293B]/60 p-2 rounded-lg border border-[#F1F5F9] dark:border-[#334155]">
              <div>
                ID: <span className="font-mono text-[#0F172A] dark:text-[#93C5FD] font-semibold">{currentUser.rollNumber || "CS21B042"}</span>
              </div>
              <div className="truncate">
                Dept: <span className="text-[#0F172A] dark:text-white font-medium">{currentUser.department || "Computer Science"}</span>
              </div>
              <div className="truncate">
                Institute: <span className="text-[#0F172A] dark:text-white font-medium">{currentUser.institution || "NIT"}</span>
              </div>
            </div>
          </div>

          {/* Quick Switch Persona */}
          <div className="px-2 py-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1.5">
              <span>Switch Demo Persona</span>
              <ArrowRightLeft className="w-3 h-3 text-[#94A3B8]" />
            </div>
            <div className="space-y-1">
              {DEMO_USERS.map((demo) => {
                const isSelected = demo.id === currentUser.id;
                return (
                  <button
                    key={demo.id}
                    onClick={() => {
                      onSwitchUser(demo);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-[#EFF6FF] dark:bg-[#1E293B] text-[#1E40AF] dark:text-[#60A5FA] font-bold border border-[#DBEAFE] dark:border-[#3B82F6]/30"
                        : "text-[#334155] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/80"
                    }`}
                  >
                    <span className="truncate">{demo.name}</span>
                    <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] capitalize shrink-0 ml-1">
                      {demo.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-2 mt-2 border-t border-[#F1F5F9] dark:border-[#1E293B] space-y-1">
            <button
              onClick={() => {
                onOpenAuthPage();
                setIsOpen(false);
              }}
              className="w-full text-left px-2.5 py-1.5 text-xs text-[#334155] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] rounded-lg font-medium flex items-center gap-2"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8]" />
              <span>Authentication & Account Portal</span>
            </button>
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full text-left px-2.5 py-1.5 text-xs text-[#DC2626] dark:text-[#F87171] hover:bg-[#FEF2F2] dark:hover:bg-[#7F1D1D]/30 rounded-lg font-medium flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5 text-[#DC2626] dark:text-[#F87171]" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
