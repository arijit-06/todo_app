import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { createTask } from '../../services/tasks';
import { toast } from 'react-hot-toast';
import styles from './tasks.module.css';

const QuickAddTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user) return;

    setLoading(true);
    try {
      await createTask({
        title: title.trim(),
        importance: 'medium',
        urgency: 'normal',
        completed: false,
        userId: user.id,
        deadline: deadline ? new Date(deadline) : undefined,
      });
      
      setTitle('');
      setDeadline('');
      setIsExpanded(false);
      toast.success('Task added successfully!');
    } catch (error) {
      toast.error('Failed to add task');
      console.error('Error adding task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
      setTitle('');
      setDeadline('');
    }
  };

  return (
    <motion.div
      layout
      className={styles.quickAdd}
    >
      {!isExpanded ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsExpanded(true)}
          className={styles.quickAddButton}
        >
          <Plus size={16} />
          <span>Add a task</span>
        </motion.button>
      ) : (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className={styles.quickAddForm}
        >
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className={styles.quickAddInput}
          />
          
          <div className={styles.quickAddOptions}>
            <div className={styles.dateInputContainer}>
              <Calendar size={16} className={styles.calendarIcon} />
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={styles.dateInput}
                placeholder="Due date (optional)"
              />
            </div>
          </div>
          
          <div className={styles.quickAddActions}>
            <button
              type="submit"
              disabled={!title.trim() || loading}
              className={styles.quickAddSubmit}
            >
              {loading ? 'Adding...' : 'Add Task'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                setTitle('');
                setDeadline('');
              }}
              className={styles.quickAddCancel}
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
};

export default QuickAddTask;
