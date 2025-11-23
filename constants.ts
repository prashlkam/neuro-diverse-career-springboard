import { User, Task, TaskStatus, CareerNode } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Chen',
  role: 'Data Quality Specialist',
  level: 4,
  xp: 3450,
  nextLevelXp: 5000,
  coins: 120,
  avatarUrl: 'https://picsum.photos/200/200',
  sensoryProfile: {
    soundSensitivity: 'HIGH',
    lightSensitivity: 'MEDIUM',
    preferredCommunication: 'TEXT',
    triggers: ['Flickering lights', 'Sudden loud noises', 'Ambiguous instructions'],
    accommodations: ['Noise-cancelling headphones', 'Corner desk', 'Written instructions only']
  },
  skills: [
    { name: 'Pattern Recognition', level: 5, icon: 'eye' },
    { name: 'Data Entry', level: 4, icon: 'keyboard' },
    { name: 'Consistency', level: 5, icon: 'check' },
    { name: 'Communication', level: 2, icon: 'message-square' }
  ],
  strengths: ['Hyper-focus', 'Rule Adherence', 'Visual Thinker']
};

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Verify Image Tags',
    description: 'Look at 50 images. Check if the "Dog" tag is correct. Click Yes or No.',
    status: TaskStatus.TODO,
    timeEstimateMinutes: 30,
    xpReward: 50,
    coinReward: 10,
    checklist: [
      { id: 'c1', text: 'Open Image Batch A', isChecked: false },
      { id: 'c2', text: 'Process 50 images', isChecked: false },
      { id: 'c3', text: 'Click Submit', isChecked: false }
    ]
  },
  {
    id: 't2',
    title: 'Sort Physical Mail',
    description: 'Put letters into boxes A, B, and C based on the color of the stamp.',
    status: TaskStatus.TODO,
    timeEstimateMinutes: 45,
    xpReward: 75,
    coinReward: 15,
    visualGuideUrl: 'https://picsum.photos/300/200',
    checklist: [
      { id: 'c1', text: 'Collect mail from front desk', isChecked: false },
      { id: 'c2', text: 'Sort into Box A (Red Stamp)', isChecked: false },
      { id: 'c3', text: 'Sort into Box B (Blue Stamp)', isChecked: false },
      { id: 'c4', text: 'Sort into Box C (Green Stamp)', isChecked: false }
    ]
  }
];

export const CAREER_PATH: CareerNode[] = [
  { id: 'n1', title: 'Trainee', isUnlocked: true, isCompleted: true, requirements: ['Complete Onboarding'] },
  { id: 'n2', title: 'Junior Associate', isUnlocked: true, isCompleted: true, requirements: ['100 Tasks Completed'] },
  { id: 'n3', title: 'Specialist', isUnlocked: true, isCompleted: false, requirements: ['95% Accuracy Rate', 'Level 5 Pattern Recognition'] },
  { id: 'n4', title: 'Senior Specialist', isUnlocked: false, isCompleted: false, requirements: ['Mentor 1 Peer'] },
  { id: 'n5', title: 'Quality Lead', isUnlocked: false, isCompleted: false, requirements: ['Advanced Certification'] }
];