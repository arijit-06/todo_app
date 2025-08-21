import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskItem from './TaskItem';
import QuickAddTask from './QuickAddTask';
import SortableHeader from './SortableHeader';
import { FilterType, SortOption } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import { filterTasks, sortTasks } from '../../utils/taskUtils';
import styles from './tasks.module.css';

interface TaskListProps {
  filter: FilterType;
  searchQuery: string;
  sortBy: SortOption;
  onSortChange: (field: SortOption, ascending: boolean) => void;
}

const TaskList: React.FC<TaskListProps> = ({ filter, searchQuery, sortBy, onSortChange }) => {
  const { tasks, loading } = useTasks();

  const filteredTasks = filterTasks(tasks, filter, searchQuery);
  const sortedTasks = sortTasks(filteredTasks, sortBy);

  const getFilterTitle = (filter: FilterType): string => {
    const titles: Record<FilterType, string> = {
      all: 'All Tasks',
      important: 'Important Tasks',
      urgent: 'Urgent Tasks',
      completed: 'Completed Tasks',
      today: 'Due Today',
      upcoming: 'Upcoming Tasks',
    };
    return titles[filter];
  };

  if (loading) {
    return (
      <div className={styles.loadingSpinner}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.taskList}>
      <QuickAddTask />
      
      <div className={styles.taskListHeader}>
        <h2 className={styles.taskListTitle}>
          {getFilterTitle(filter)}
          <span className={styles.taskCount}>({sortedTasks.length})</span>
        </h2>
      </div>

      {/* Add Sortable Header above tasks */}
      <SortableHeader sortBy={sortBy} onSortChange={onSortChange} />

      <AnimatePresence mode="popLayout">
        {sortedTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.2, 
              delay: index * 0.05,
              layout: { duration: 0.2 }
            }}
            layout
          >
            <TaskItem task={task} />
          </motion.div>
        ))}
      </AnimatePresence>

      {sortedTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.emptyState}
        >
          <div className={styles.emptyStateMessage}>
            {searchQuery 
              ? 'No tasks found matching your search.' 
              : 'No tasks yet.'
            }
          </div>
          {!searchQuery && (
            <div className={styles.emptyStateSubtext}>
              Add your first task above to get started!
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TaskList;
