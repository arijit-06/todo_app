import React from 'react';
import { motion } from 'framer-motion';
import styles from './calendar.module.css';

const CalendarView: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.calendarContainer}
    >
      <div className={styles.calendarHeader}>
        <h2 className={styles.calendarTitle}>Calendar View</h2>
        <p className={styles.calendarSubtitle}>Calendar functionality coming soon!</p>
      </div>
      
      <div className={styles.calendarPlaceholder}>
        <div className={styles.placeholderContent}>
          <div className={styles.placeholderIcon}>📅</div>
          <h3>Calendar Integration</h3>
          <p>This feature will include:</p>
          <ul>
            <li>Monthly/Weekly/Daily views</li>
            <li>Drag & drop task scheduling</li>
            <li>Deadline visualization</li>
            <li>Task filtering by date</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarView;
