import { Task, FilterType, SortOption } from '../types';
import { isToday, isPast, differenceInDays } from 'date-fns';

export const filterTasks = (tasks: Task[], filter: FilterType, searchQuery: string = ''): Task[] => {
  let filtered = tasks;

  // Apply text search
  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    filtered = filtered.filter(task => {
      const lowerTitle = task.title.toLowerCase();
      const lowerDescription = task.description?.toLowerCase();
      return lowerTitle.includes(lowerQuery) || lowerDescription?.includes(lowerQuery);
    });
  }

  // Apply filter
  switch (filter) {
    case 'important':
      filtered = filtered.filter(task => task.importance === 'high');
      break;
    case 'urgent':
      filtered = filtered.filter(task => task.urgency === 'urgent');
      break;
    case 'completed':
      filtered = filtered.filter(task => task.completed);
      break;
    case 'today':
      filtered = filtered.filter(task => {
        if (task.completed) return false;
        return task.deadline ? isToday(task.deadline) : false;
      });
      break;
    case 'upcoming':
      filtered = filtered.filter(task => {
        if (task.completed) return false;
        return task.deadline ? !isPast(task.deadline) && !isToday(task.deadline) : false;
      });
      break;
    default:
      // 'all' - no additional filtering
      break;
  }

  return filtered;
};

export const sortTasks = (tasks: Task[], sortBy: SortOption): Task[] => {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'importance':
        const importanceOrder = { high: 3, medium: 2, low: 1 };
        return importanceOrder[b.importance] - importanceOrder[a.importance];
      case 'urgency':
        const urgencyOrder = { urgent: 3, normal: 2, flexible: 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      case 'deadline':
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.getTime() - b.deadline.getTime();
      case 'created':
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });
};

export const getTaskPriorityColor = (task: Task): string => {
  if (task.completed) return 'var(--gray-400)';
  
  if (task.importance === 'high') return 'var(--error)';
  if (task.urgency === 'urgent') return 'var(--warning)';
  if (task.importance === 'medium') return 'var(--primary-500)';
  
  return 'var(--gray-500)';
};

export const formatTimeLeft = (deadline: Date): string => {
  const now = new Date();
  const diffInDays = differenceInDays(deadline, now);
  
  if (diffInDays < 0) return 'Overdue';
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Tomorrow';
  if (diffInDays <= 7) return `${diffInDays} days`;
  
  return deadline.toLocaleDateString();
};
