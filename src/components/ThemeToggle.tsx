import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  showLabel = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      id="btn-theme-toggle"
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 border focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]/40 ${
        isDark
          ? "bg-[#1E293B] hover:bg-[#334155] text-[#F8FAFC] border-[#334155] shadow-xs"
          : "bg-white hover:bg-[#F8FAFC] text-[#0F172A] border-[#CBD5E1] shadow-xs"
      } ${className}`}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5 text-[#FBBF24] transition-transform duration-200 rotate-0" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-[#64748B] transition-transform duration-200" />
      )}
      {showLabel && (
        <span className="text-[11px] font-medium tracking-tight">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
};
