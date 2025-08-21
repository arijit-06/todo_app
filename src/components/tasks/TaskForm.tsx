import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Task } from '../../types';
import { createTask, updateTask } from '../../services/tasks';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import styles from './tasks.module.css';

const today = new Date().toISOString().split('T')[0];

interface TaskFormData {
  title: string;
  description?: string;
  importance: 'low' | 'medium' | 'high';
  urgency: 'flexible' | 'normal' | 'urgent';
  deadline?: string;
}

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
  onSuccess: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const isEditing = !!task;

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm<TaskFormData>({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      importance: task?.importance || 'medium',
      urgency: task?.urgency || 'normal',
      deadline: task?.deadline ? task.deadline.toISOString().split('T')[0] : '',
    }
  });

  const onSubmit = async (data: TaskFormData) => {
    if (!user) return;

    setLoading(true);
    try {
      const taskData = {
        title: data.title.trim(),
        description: data.description?.trim() || undefined,
        importance: data.importance,
        urgency: data.urgency,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
      };

      if (isEditing) {
        await updateTask(task.id, taskData);
        toast.success('Task updated successfully!');
      } else {
        await createTask({
          ...taskData,
          userId: user.id,
          completed: false,
        });
        toast.success('Task created successfully!');
      }

      onSuccess();
      if (!isEditing) reset();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update task' : 'Failed to create task');
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={styles.taskForm}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <label className={styles.formLabel}>
              Title *
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              type="text"
              className={styles.formInput}
              placeholder="Enter task title"
            />
            {errors.title && (
              <span className={styles.errorText}>{errors.title.message}</span>
            )}
          </div>

          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <label className={styles.formLabel}>
              Description
            </label>
            <textarea
              {...register('description')}
              className={`${styles.formInput} ${styles.formTextarea}`}
              placeholder="Add a description (optional)"
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Importance
            </label>
            <select
              {...register('importance')}
              className={`${styles.formInput} ${styles.formSelect}`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Urgency
            </label>
            <select
              {...register('urgency')}
              className={`${styles.formInput} ${styles.formSelect}`}
            >
              <option value="flexible">Flexible</option>
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
            <label className={styles.formLabel}>
              Deadline
            </label>
            <input
              {...register('deadline')}
              type="date"
              className={styles.formInput}
              min={today}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onClose}
            className={`${styles.formButton} ${styles.formButtonSecondary}`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`${styles.formButton} ${styles.formButtonPrimary}`}
          >
            {loading 
              ? (isEditing ? 'Updating...' : 'Creating...') 
              : (isEditing ? 'Update Task' : 'Create Task')
            }
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TaskForm;
