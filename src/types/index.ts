export interface Task {
  id: string;
  title: string;
  description?: string;
  importance: 'low' | 'medium' | 'high';
  urgency: 'flexible' | 'normal' | 'urgent';
  deadline?: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  category?: string;
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number; // Must be positive integer >= 1
  };
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export type ViewMode = 'list' | 'calendar';
export type FilterType = 'all' | 'important' | 'urgent' | 'completed' | 'today' | 'upcoming';
export type SortOption = 'importance' | 'urgency' | 'deadline' | 'created';
