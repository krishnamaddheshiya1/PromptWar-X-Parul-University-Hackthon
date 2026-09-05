export interface ProjectIdea {
  id: string;
  title: string;
  tagline: string;
  category: string;
  complexity: "Moderate" | "Advanced" | "Research / Publication Grade" | string;
  problemStatement: string;
  practicalImpact: string;
  keyFeatures: string[];
  stretchFeatures: string[];
  techStack: {
    frontend: string[];
    backend: string[];
    ai_ml: string[];
    database: string[];
    hardware_cloud: string[];
  };
  academicRubric: {
    noveltyScore: number;
    implementationFeasibility: number;
    vivaAppeal: number;
    industryRelevance: number;
  };
  sampleDatasetSources: string[];
  vivaQuestions: {
    question: string;
    guidance: string;
  }[];
  estimatedWeeks: number;
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
}

export interface Milestone {
  id: string;
  phase: number;
  title: string;
  duration: string;
  objective: string;
  deliverables: Deliverable[];
  academicTips: string;
  gitBranchName: string;
  suggestedCommit: string;
}

export interface CommitLog {
  id: string;
  hash: string;
  message: string;
  branch: string;
  timestamp: string;
  author: string;
  milestoneId?: string;
  filesChanged: string[];
  insertions: number;
  deletions: number;
  tag?: string;
}

export interface Branch {
  name: string;
  isDefault: boolean;
  lastCommitHash: string;
}

export interface ArchitectureComponent {
  name: string;
  role: string;
  technologies: string;
}

export interface ProjectArchitecture {
  components: ArchitectureComponent[];
  dataFlow: string[];
  securityAndOptimization: string[];
}

export interface VivaDefenseItem {
  concept: string;
  toughQuestion: string;
  strongAnswer: string;
}

export interface ChatMessage {
  id: string;
  sender: "student" | "mentor";
  text: string;
  timestamp: string;
}

export interface ProjectImprovement {
  title: string;
  category: string;
  impact: string;
  description: string;
  actionSteps: string[];
}

export interface ActiveProject {
  id: string;
  idea: ProjectIdea;
  milestones: Milestone[];
  currentMilestonePhase: number;
  branches: Branch[];
  currentBranch: string;
  commits: CommitLog[];
  architecture: ProjectArchitecture;
  vivaDefenseGuide: VivaDefenseItem[];
  improvements: ProjectImprovement[];
  mentorChat: ChatMessage[];
  createdAt: string;
  lastUpdated: string;
}

export interface StudentProfile {
  degreeLevel: string;
  teamSize: number;
  duration: string;
  complexity: string;
  hardware: string;
  interests: string[];
  skills: string[];
  customTheme: string;
}

export type UserRole = "student" | "guide" | "evaluator";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rollNumber?: string;
  department?: string;
  institution?: string;
  avatarUrl?: string;
  joinedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
}
