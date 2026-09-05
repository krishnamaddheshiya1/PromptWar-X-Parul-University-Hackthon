import { UserProfile } from "../types";

export const DEMO_USERS: UserProfile[] = [
  {
    id: "user-student-aarav",
    name: "Aarav Sharma",
    email: "aarav.sharma@engg.edu",
    role: "student",
    rollNumber: "CS21B042",
    department: "Computer Science & Engineering",
    institution: "National Institute of Technology",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    joinedAt: "August 2026",
  },
  {
    id: "user-guide-radhika",
    name: "Dr. Radhika Sen",
    email: "radhika.sen@faculty.edu",
    role: "guide",
    rollNumber: "FAC-CS-109",
    department: "AI & Data Science Laboratory",
    institution: "Department of Computer Science & Engineering",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    joinedAt: "June 2024",
  },
  {
    id: "user-evaluator-vikram",
    name: "Prof. Vikram Malhotra",
    email: "v.malhotra@univ-evaluators.org",
    role: "evaluator",
    rollNumber: "EXT-EVAL-88",
    department: "External Board of Examiners",
    institution: "Apex University Examination Council",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    joinedAt: "January 2025",
  },
];

const LOCAL_STORAGE_USERS_KEY = "capstone_registered_users";
const LOCAL_STORAGE_CURRENT_USER_KEY = "capstone_current_user";

export function getStoredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(DEMO_USERS));
      return DEMO_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEMO_USERS;
  } catch (e) {
    console.error("Failed to load stored users:", e);
    return DEMO_USERS;
  }
}

export function saveUser(user: UserProfile): void {
  try {
    const existing = getStoredUsers();
    const updated = [user, ...existing.filter((u) => u.id !== user.id && u.email.toLowerCase() !== user.email.toLowerCase())];
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save user:", e);
  }
}

export function getStoredCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
    if (!raw) {
      // Default to lead student Aarav for seamless instant preview experience
      const defaultUser = DEMO_USERS[0];
      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to get current user:", e);
    return DEMO_USERS[0];
  }
}

export function setStoredCurrentUser(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
    }
  } catch (e) {
    console.error("Failed to set current user:", e);
  }
}
