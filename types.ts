export enum Tab {
  PROFILE = 'PROFILE',
  WORK = 'WORK',
  CAREER = 'CAREER',
  GAME = 'GAME',
  ANALYTICS = 'ANALYTICS'
}

export interface SensoryProfile {
  soundSensitivity: 'LOW' | 'MEDIUM' | 'HIGH';
  lightSensitivity: 'LOW' | 'MEDIUM' | 'HIGH';
  preferredCommunication: 'TEXT' | 'VOICE' | 'IN_PERSON';
  triggers: string[];
  accommodations: string[];
}

export interface Skill {
  name: string;
  level: number; // 1-5
  icon: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  coins: number;
  avatarUrl: string;
  sensoryProfile: SensoryProfile;
  skills: Skill[];
  strengths: string[];
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  REVIEW = 'REVIEW'
}

export interface Task {
  id: string;
  title: string;
  description: string; // Literal description
  visualGuideUrl?: string;
  status: TaskStatus;
  timeEstimateMinutes: number;
  xpReward: number;
  coinReward: number;
  checklist: { id: string; text: string; isChecked: boolean }[];
}

export interface CareerNode {
  id: string;
  title: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  requirements: string[];
}