import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Star, 
  Edit3, 
  Trash2, 
  AlertCircle,
  Calendar
} from 'lucide-react';
import { Task } from '../../types';
import { updateTask, deleteTask } from '../../services/tasks';
import { getTaskPriorityColor, formatTimeLeft } from '../../utils/taskUtils';
import { toast } from 'react-hot-toast';
import TaskForm from './TaskForm';
import styles from './tasks.module.css';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      await updateTask(task.id, { completed: !task.completed });
      toast.success(task.completed ? 'Task reopened' : 'Task completed!');
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    setLoading(true);
    try {
      await deleteTask(task.id);
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const priorityColor = getTaskPriorityColor(task);

  if (isEditing) {
    return (
      <TaskForm
        task={task}
        onClose={() => setIsEditing(false)}
        onSuccess={() => setIsEditing(false)}
      />
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${styles.taskItem} ${task.completed ? styles.completed : ''}`}
      style={{ borderLeftColor: priorityColor }}
    >
      <div className={styles.taskContent}>
        <button
          onClick={handleToggleComplete}
          disabled={loading}
          className={styles.checkButton}
        >
          <Check size={16} className={task.completed ? styles.checked : ''} />
        </button>

        <div className={styles.taskDetails}>
          <h3 className={styles.taskTitle}>{task.title}</h3>
          
          {task.description && (
            <p className={styles.taskDescription}>{task.description}</p>
          )}
          
          <div className={styles.taskMeta}>
            <div className={styles.taskTags}>
              {task.importance === 'high' && (
                <span className={styles.tag} style={{ color: 'var(--error)' }}>
                  <Star size={12} />
                  High Priority
                </span>
              )}
              
              {task.urgency === 'urgent' && (
                <span className={styles.tag} style={{ color: 'var(--warning)' }}>
                  <AlertCircle size={12} />
                  Urgent
                </span>
              )}
              
              {task.deadline && (
                <span className={styles.tag}>
                  <Calendar size={12} />
                  {formatTimeLeft(task.deadline)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.taskActions}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsEditing(true)}
          className={styles.actionButton}
          title="Edit task"
        >
          <Edit3 size={14} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDelete}
          className={`${styles.actionButton} ${styles.deleteButton}`}
          title="Delete task"
        >
          <Trash2 size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TaskItem;
