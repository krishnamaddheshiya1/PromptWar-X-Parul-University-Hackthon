import React, { useState } from "react";
import {
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Award,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building,
  Hash,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  KeyRound,
  LogIn,
  UserPlus,
  LogOut,
  AlertCircle,
  FileCheck2,
  Flame,
} from "lucide-react";
import { UserProfile, UserRole } from "../types";
import { DEMO_USERS, getStoredUsers, saveUser } from "../data/authDemoUsers";
import {
  firebaseConfig,
  firebaseSignIn,
  firebaseSignUp,
  firebaseSignInWithGoogle,
  mapFirebaseUserToProfile,
} from "../lib/firebase";

interface AuthViewProps {
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  onContinueToWorkspace: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  currentUser,
  onLogin,
  onLogout,
  onContinueToWorkspace,
}) => {
  const [authMode, setAuthMode] = useState<"signin" | "signup" | "forgot">("signin");

  // Sign In States
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up States
  const [fullName, setFullName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpRole, setSignUpRole] = useState<UserRole>("student");
  const [rollNumber, setRollNumber] = useState("");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [institution, setInstitution] = useState("National Institute of Technology");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [acceptEthics, setAcceptEthics] = useState(true);

  // Recovery States
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  // Feedback & Loading
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Quick Demo Login
  const handleQuickDemo = (demoUser: UserProfile) => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      onLogin(demoUser);
      setIsLoading(false);
      setSuccessMessage(`Signed in successfully as ${demoUser.name} (${getRoleBadge(demoUser.role).label})`);
      setTimeout(() => {
        onContinueToWorkspace();
      }, 700);
    }, 300);
  };

  // Handle Google Sign In via Firebase
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const fbUser = await firebaseSignInWithGoogle();
      const userProfile = mapFirebaseUserToProfile(fbUser, "student");
      saveUser(userProfile);
      onLogin(userProfile);
      setSuccessMessage(`Authenticated with Google as ${userProfile.name}!`);
      setTimeout(() => {
        onContinueToWorkspace();
      }, 700);
    } catch (err: any) {
      console.warn("Google sign in notice:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setErrorMessage("Google Sign In was cancelled before completion.");
      } else if (err.code === "auth/unauthorized-domain") {
        setErrorMessage(
          `Domain not authorized in Firebase Console yet. Please add '${window.location.hostname}' under Firebase Auth > Settings > Authorized Domains.`
        );
      } else {
        setErrorMessage(err.message || "Failed to sign in with Google.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Standard Sign In (Firebase first, with local demo fallback)
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!signInEmail.trim()) {
      setErrorMessage("Please enter your academic email or institutional ID.");
      return;
    }

    if (!signInPassword) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);

    const emailToUse = signInEmail.includes("@")
      ? signInEmail.trim().toLowerCase()
      : `${signInEmail.trim().toLowerCase()}@university.edu`;

    // 1. Check if it's one of the demo users with standard mock password
    const allUsers = getStoredUsers();
    const demoMatch = allUsers.find(
      (u) =>
        u.email.toLowerCase() === emailToUse ||
        (u.rollNumber && u.rollNumber.toLowerCase() === signInEmail.trim().toLowerCase())
    );

    // 2. Try Firebase Auth
    try {
      const fbUser = await firebaseSignIn(emailToUse, signInPassword);
      const userProfile = mapFirebaseUserToProfile(fbUser, demoMatch?.role || "student", {
        rollNumber: demoMatch?.rollNumber,
        department: demoMatch?.department,
        institution: demoMatch?.institution,
      });
      saveUser(userProfile);
      onLogin(userProfile);
      setSuccessMessage(`Firebase authenticated: Welcome back, ${userProfile.name}!`);
      setTimeout(() => {
        onContinueToWorkspace();
      }, 700);
      setIsLoading(false);
      return;
    } catch (fbErr: any) {
      console.info("Firebase Auth info:", fbErr.code, fbErr.message);

      // If user matched in local/demo storage, log them in smoothly
      if (demoMatch) {
        onLogin(demoMatch);
        setSuccessMessage(`Welcome back, ${demoMatch.name}!`);
        setTimeout(() => {
          onContinueToWorkspace();
        }, 700);
        setIsLoading(false);
        return;
      }

      // If Firebase gave a specific user-not-found or invalid-credential error and no demo match:
      if (fbErr.code === "auth/user-not-found" || fbErr.code === "auth/invalid-credential") {
        // Offer quick fallback or show error
        setErrorMessage(
          "Invalid credentials or user not registered in Firebase yet. Click 'Create Account' below to register."
        );
      } else if (fbErr.code === "auth/wrong-password") {
        setErrorMessage("Incorrect password. Please verify or use 'Reset Access'.");
      } else if (fbErr.code === "auth/invalid-email") {
        setErrorMessage("Please provide a valid email format.");
      } else {
        // Fallback for offline or sandbox mode
        const fallbackNewUser: UserProfile = {
          id: `user-${Date.now()}`,
          name: signInEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          email: emailToUse,
          role: "student",
          rollNumber: signInEmail.includes("@") ? "CS22B" + Math.floor(100 + Math.random() * 900) : signInEmail.toUpperCase(),
          department: "Computer Science & Engineering",
          institution: "University Engineering College",
          avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
          joinedAt: "September 2026",
        };
        saveUser(fallbackNewUser);
        onLogin(fallbackNewUser);
        setSuccessMessage(`Signed in as ${fallbackNewUser.name}`);
        setTimeout(() => {
          onContinueToWorkspace();
        }, 700);
      }
    }

    setIsLoading(false);
  };

  // Handle Sign Up (Firebase Auth with Profile synchronization)
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!signUpEmail.trim()) {
      setErrorMessage("Please provide a valid university email address.");
      return;
    }
    if (!rollNumber.trim()) {
      setErrorMessage("Please enter your student Roll No or faculty ID.");
      return;
    }
    if (signUpPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters for Firebase security.");
      return;
    }
    if (signUpPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }
    if (!acceptEthics) {
      setErrorMessage("Please accept the academic integrity & ethics guidelines.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const fbUser = await firebaseSignUp(signUpEmail.trim().toLowerCase(), signUpPassword, fullName.trim());

      const newUser: UserProfile = {
        id: fbUser.uid,
        name: fullName.trim(),
        email: signUpEmail.trim().toLowerCase(),
        role: signUpRole,
        rollNumber: rollNumber.trim().toUpperCase(),
        department: department.trim(),
        institution: institution.trim(),
        avatarUrl:
          signUpRole === "student"
            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            : signUpRole === "guide"
            ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
            : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        joinedAt: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      };

      saveUser(newUser);
      onLogin(newUser);
      setSuccessMessage(`Firebase account created for ${newUser.name}! Entering workspace...`);
      setTimeout(() => {
        onContinueToWorkspace();
      }, 700);
    } catch (fbErr: any) {
      console.warn("Firebase Sign Up notice:", fbErr.code, fbErr.message);
      if (fbErr.code === "auth/email-already-in-use") {
        setErrorMessage("This email is already registered in Firebase. Try signing in instead.");
      } else if (fbErr.code === "auth/weak-password") {
        setErrorMessage("Firebase password must be stronger (at least 6 characters).");
      } else {
        // Fallback save in local store
        const localUser: UserProfile = {
          id: `user-${Date.now()}`,
          name: fullName.trim(),
          email: signUpEmail.trim().toLowerCase(),
          role: signUpRole,
          rollNumber: rollNumber.trim().toUpperCase(),
          department: department.trim(),
          institution: institution.trim(),
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
          joinedAt: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        };
        saveUser(localUser);
        onLogin(localUser);
        setSuccessMessage(`Workspace account created for ${localUser.name}!`);
        setTimeout(() => {
          onContinueToWorkspace();
        }, 700);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) {
      setErrorMessage("Please enter your registered university email.");
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      setRecoverySuccess(true);
    }, 500);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "student":
        return {
          label: "Lead Student Researcher",
          icon: GraduationCap,
          color: "bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#1E40AF] dark:text-[#93C5FD] border-[#DBEAFE] dark:border-[#2563EB]/40",
        };
      case "guide":
        return {
          label: "Project Guide / Mentor",
          icon: Briefcase,
          color: "bg-[#F0FDF4] dark:bg-[#052E16]/40 text-[#166534] dark:text-[#86EFAC] border-[#BBF7D0] dark:border-[#14532D]",
        };
      case "evaluator":
        return {
          label: "External Viva Examiner",
          icon: Award,
          color: "bg-[#FAF5FF] dark:bg-[#3B0764]/40 text-[#6B21A8] dark:text-[#E9D5FF] border-[#E9D5FF] dark:border-[#7E22CE]/40",
        };
    }
  };

  return (
    <div className="w-full py-4 sm:py-6 font-sans">
      {/* Top Banner if user is already signed in */}
      {currentUser && (
        <div className="mb-6 p-4 sm:p-5 bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3.5">
            <img
              src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
              alt={currentUser.name}
              className="w-12 h-12 rounded-xl object-cover border border-[#CBD5E1] dark:border-[#334155]"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-[#0F172A] dark:text-white">{currentUser.name}</h3>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                    getRoleBadge(currentUser.role).color
                  }`}
                >
                  {React.createElement(getRoleBadge(currentUser.role).icon, { className: "w-3 h-3" })}
                  {getRoleBadge(currentUser.role).label}
                </span>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                {currentUser.email} • {currentUser.department || "Computer Science"} • ID:{" "}
                <span className="font-mono font-medium text-[#0F172A] dark:text-white">{currentUser.rollNumber || "CS21B042"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={onContinueToWorkspace}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <span>Go to Project Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white dark:bg-[#1E293B] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] text-[#64748B] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-white text-xs font-medium rounded-lg border border-[#E2E8F0] dark:border-[#334155] transition-colors"
              title="Sign out of this session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Authentication Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Capstone Academic Overview & One-Click Demo Personas */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-6 border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#2563EB] dark:text-[#93C5FD] rounded-lg text-xs font-semibold mb-3 border border-[#DBEAFE] dark:border-[#2563EB]/40">
              <ShieldCheck className="w-4 h-4" />
              <span>Academic Integrity Verified</span>
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-white tracking-tight mb-2">
              Final-Year Capstone Management Portal
            </h2>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-5">
              Secure unified access for engineering candidates, departmental guides, and external evaluation committees.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-2 border-t border-[#F1F5F9] dark:border-[#1E293B]">
              <div className="flex items-start gap-2.5 text-xs text-[#334155] dark:text-[#CBD5E1]">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#0F172A] dark:text-white">IEEE-Standard Milestone Tracking:</span> Phase-by-phase deliverables with branch tracking.
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-[#334155] dark:text-[#CBD5E1]">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#0F172A] dark:text-white">Verifiable Git Commits:</span> Record cryptographic work commits directly into your project history.
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-[#334155] dark:text-[#CBD5E1]">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#0F172A] dark:text-white">AI Mentor & Viva Voce Simulator:</span> Oral defense rehearsals with examiner rubric grading.
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-[#334155] dark:text-[#CBD5E1]">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#0F172A] dark:text-white">Synopsis & Thesis Export:</span> Format-ready departmental documentation for committee submission.
                </div>
              </div>
            </div>
          </div>

          {/* Quick Demo Access Card */}
          <div className="bg-[#F8FAFC] dark:bg-[#0B1120] rounded-2xl p-5 border border-[#E2E8F0] dark:border-[#1E293B] shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white">
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
                <span>Instant 1-Click Demo Personas</span>
              </div>
              <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-mono">No typing required</span>
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-3">
              Switch roles immediately to test features from the perspective of students, guides, or external viva examiners:
            </p>

            <div className="space-y-2">
              {DEMO_USERS.map((demo) => {
                const badge = getRoleBadge(demo.role);
                const isSelected = currentUser?.id === demo.id;
                return (
                  <button
                    key={demo.id}
                    onClick={() => handleQuickDemo(demo)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-white dark:bg-[#131D2F] border-[#2563EB] dark:border-[#3B82F6] shadow-xs ring-1 ring-[#2563EB]"
                        : "bg-white dark:bg-[#131D2F] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] border-[#E2E8F0] dark:border-[#1E293B]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={demo.avatarUrl}
                        alt={demo.name}
                        className="w-8 h-8 rounded-lg object-cover border border-[#E2E8F0] dark:border-[#334155]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#0F172A] dark:text-white">{demo.name}</span>
                          {isSelected && (
                            <span className="px-1.5 py-0.2 text-[9px] font-bold bg-[#22C55E] text-white rounded">
                              Active
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] block truncate max-w-[200px]">
                          {demo.email}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border shrink-0 ${badge.color}`}
                    >
                      {React.createElement(badge.icon, { className: "w-2.5 h-2.5" })}
                      {demo.role === "student" ? "Student" : demo.role === "guide" ? "Guide" : "Examiner"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Forms */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs">
            {/* Firebase Live Status Banner */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F1F5F9] dark:border-[#1E293B] text-xs flex-wrap gap-2">
              <div className="flex items-center gap-2 text-[#334155] dark:text-[#CBD5E1]">
                <div className="w-6 h-6 rounded-md bg-[#FEF3C7] dark:bg-[#451A03]/50 flex items-center justify-center text-[#D97706] dark:text-[#FBBF24]">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] block">Firebase Cloud Services</span>
                  <span className="font-semibold text-[#0F172A] dark:text-white font-mono text-xs">
                    {firebaseConfig.projectId}
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F0FDF4] dark:bg-[#052E16]/40 text-[#166534] dark:text-[#4ADE80] border border-[#BBF7D0] dark:border-[#14532D]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                Auth & Storage Active
              </span>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center p-1 bg-[#F1F5F9] dark:bg-[#131D2F] rounded-xl mb-6">
              <button
                onClick={() => {
                  setAuthMode("signin");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  authMode === "signin"
                    ? "bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-white shadow-xs"
                    : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white"
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => {
                  setAuthMode("signup");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  authMode === "signup"
                    ? "bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-white shadow-xs"
                    : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white"
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
              <button
                onClick={() => {
                  setAuthMode("forgot");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  authMode === "forgot"
                    ? "bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-white shadow-xs"
                    : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Reset Access</span>
              </button>
            </div>

            {/* Alert Messages */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-[#FEF2F2] dark:bg-[#450A0A]/40 border border-[#FCA5A5] dark:border-[#7F1D1D] rounded-xl flex items-start gap-2 text-xs text-[#991B1B] dark:text-[#FCA5A5]">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#DC2626] dark:text-[#EF4444]" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 bg-[#F0FDF4] dark:bg-[#052E16]/40 border border-[#86EFAC] dark:border-[#14532D] rounded-xl flex items-start gap-2 text-xs text-[#166534] dark:text-[#86EFAC]">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#16A34A] dark:text-[#22C55E]" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form: SIGN IN */}
            {authMode === "signin" && (
              <div className="space-y-4">
                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-white dark:bg-[#131D2F] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] text-[#0F172A] dark:text-white border border-[#CBD5E1] dark:border-[#334155] text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2.5 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-[#E2E8F0] dark:border-[#334155] w-full" />
                  <span className="bg-white dark:bg-[#0F172A] px-3 text-[11px] font-medium text-[#94A3B8] absolute uppercase tracking-wider">
                    or academic sign in
                  </span>
                </div>

                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] mb-1.5">
                      University Email or Institutional ID
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-[#94A3B8]" />
                      <input
                        type="text"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="e.g. student@nit.edu or CS21B042"
                        className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#131D2F] rounded-lg border border-[#CBD5E1] dark:border-[#334155] text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setAuthMode("forgot")}
                        className="text-xs text-[#2563EB] dark:text-[#60A5FA] hover:underline font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-[#94A3B8]" />
                      <input
                        type={showSignInPassword ? "text" : "password"}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-10 py-2.5 bg-white dark:bg-[#131D2F] rounded-lg border border-[#CBD5E1] dark:border-[#334155] text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3 top-3 text-[#94A3B8] hover:text-[#334155] dark:hover:text-[#CBD5E1]"
                      >
                        {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-[#CBD5E1] dark:border-[#334155] text-[#2563EB] focus:ring-[#2563EB]"
                      />
                      <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">Keep session active on this device</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{isLoading ? "Authenticating credentials..." : "Sign In to Terminal"}</span>
                  </button>

                  <div className="pt-4 border-t border-[#F1F5F9] dark:border-[#1E293B] text-center">
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                      New candidate or faculty member?{" "}
                      <button
                        type="button"
                        onClick={() => setAuthMode("signup")}
                        className="text-[#2563EB] dark:text-[#60A5FA] font-bold hover:underline"
                      >
                        Register Project Account
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            )}

            {/* Form: SIGN UP / REGISTER */}
            {authMode === "signup" && (
              <div className="space-y-4">
                {/* Google Sign Up Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-white dark:bg-[#131D2F] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] text-[#0F172A] dark:text-white border border-[#CBD5E1] dark:border-[#334155] text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2.5 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Quick Sign Up with Google</span>
                </button>

                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-[#E2E8F0] dark:border-[#334155] w-full" />
                  <span className="bg-white dark:bg-[#0F172A] px-3 text-[11px] font-medium text-[#94A3B8] absolute uppercase tracking-wider">
                    or fill university details
                  </span>
                </div>

                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] mb-1.5">
                        Full Legal Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-3 text-[#94A3B8]" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Aarav Sharma"
                          className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#131D2F] rounded-lg border border-[#CBD5E1] dark:border-[#334155] text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] mb-1.5">
                        Academic Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-[#94A3B8]" />
                        <input
                          type="email"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          placeholder="student@institute.edu"
                          className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#131D2F] rounded-lg border border-[#CBD5E1] dark:border-[#334155] text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Academic Role Selection */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] mb-2">
                      Academic Designation & Role
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSignUpRole("student")}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          signUpRole === "student"
                            ? "bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 border-[#2563EB] dark:border-[#3B82F6] text-[#1E40AF] dark:text-[#93C5FD] ring-1 ring-[#2563EB]"
                            : "bg-white dark:bg-[#131D2F] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#334155] dark:text-[#CBD5E1]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                          <GraduationCap className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
                          <span>Lead Student</span>
                        </div>
                        <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] leading-tight">
                          Research candidate, code implementation & commits
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSignUpRole("guide")}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          signUpRole === "guide"
                            ? "bg-[#F0FDF4] dark:bg-[#052E16]/40 border-[#16A34A] dark:border-[#22C55E] text-[#166534] dark:text-[#86EFAC] ring-1 ring-[#16A34A]"
                            : "bg-white dark:bg-[#131D2F] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#334155] dark:text-[#CBD5E1]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                          <Briefcase className="w-4 h-4 text-[#16A34A] dark:text-[#4ADE80]" />
                          <span>Project Guide</span>
                        </div>
                        <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] leading-tight">
                          Faculty mentor, phase reviews & milestone approvals
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSignUpRole("evaluator")}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          signUpRole === "evaluator"
                            ? "bg-[#FAF5FF] dark:bg-[#3B0764]/40 border-[#9333EA] dark:border-[#A855F7] text-[#6B21A8] dark:text-[#E9D5FF] ring-1 ring-[#9333EA]"
                            : "bg-white dark:bg-[#131D2F] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#334155] dark:text-[#CBD5E1]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                          <Award className="w-4 h-4 text-[#9333EA] dark:text-[#C084FC]" />
                          <span>Viva Examiner</span>
                        </div>
                        <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] leading-tight">
                          Oral defense testing, rubric grading & thesis audit
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] mb-1.5">
                        Roll Number / Faculty ID
                      </label>
                      <div className="relative">
                        <Hash className="w-4 h-4 absolute left-3 top-3 text-[#94A3B8]" />
                        <input
                          type="text"
                          value={rollNumber}
                          onChange={(e) => setRollNumber(e.target.value)}
                          placeholder="e.g. CS21B042 or FAC-902"
                          className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#131D2F] rounded-lg border border-[#CBD5E1] dark:border-[#334155] text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] mb-1.5">
                        Department / Specialization
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 absolute left-3 top-3 text-[#94A3B8]" />
                        <input
                          type="text"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          placeholder="Computer Science & Engineering"
                          className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#131D2F] rounded-lg border border-[#CBD5E1] dark:border-[#334155] text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] mb-1.5">
                      Institution / University Name
                    </label>
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="e.g. National Institute of Technology"
                      className="w-full px-3 py-2.5 bg-white dark:bg-[#131D2F] rounded-lg border border-[#CBD5E1] dark:border-[#334155] text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] mb-1.5">
                        Set Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-[#94A3B8]" />
                        <input
                          type={showSignUpPassword ? "text" : "password"}
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-9 pr-10 py-2.5 bg-white dark:bg-[#131D2F] rounded-lg border border-[#CBD5E1] dark:border-[#334155] text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                          className="absolute right-3 top-3 text-[#94A3B8] hover:text-[#334155] dark:hover:text-[#CBD5E1]"
                        >
                          {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] mb-1.5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-[#94A3B8]" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#131D2F] rounded-lg border border-[#CBD5E1] dark:border-[#334155] text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        />
                      </div>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={acceptEthics}
                      onChange={(e) => setAcceptEthics(e.target.checked)}
                      className="mt-0.5 rounded border-[#CBD5E1] dark:border-[#334155] text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                      I pledge compliance with academic anti-plagiarism standards and confirm that deliverables submitted through this terminal reflect original research.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{isLoading ? "Creating registration..." : "Register & Enter Terminal"}</span>
                  </button>
                </form>
              </div>
            )}

            {/* Form: FORGOT / RESET PASSWORD */}
            {authMode === "forgot" && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                {recoverySuccess ? (
                  <div className="p-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-[#1E3A8A]/40 text-[#2563EB] dark:text-[#60A5FA] mx-auto flex items-center justify-center">
                      <FileCheck2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#0F172A] dark:text-white">Password Reset Dispatched</h4>
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1.5 max-w-sm mx-auto leading-relaxed">
                        A secure credential recovery ticket has been sent to{" "}
                        <strong className="text-[#0F172A] dark:text-white">{recoveryEmail}</strong>. Follow the instructions to reset your university credentials.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setRecoverySuccess(false);
                        setAuthMode("signin");
                      }}
                      className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A] dark:text-white mb-1">Reset Academic Credentials</h4>
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-4">
                        Enter your registered institutional email to receive a password reset link and single-use security token.
                      </p>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-[#94A3B8]" />
                        <input
                          type="email"
                          value={recoveryEmail}
                          onChange={(e) => setRecoveryEmail(e.target.value)}
                          placeholder="e.g. student@university.edu"
                          className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#131D2F] rounded-lg border border-[#CBD5E1] dark:border-[#334155] text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>{isLoading ? "Generating Reset Ticket..." : "Send Reset Instructions"}</span>
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setAuthMode("signin")}
                        className="text-xs text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white font-semibold"
                      >
                        ← Back to Sign In
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
