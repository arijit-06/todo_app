import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import TaskList from '../tasks/TaskList';
import CalendarView from '../calendar/CalendarView';
import { ViewMode, FilterType, SortOption } from '../../types';
import styles from './layout.module.css';

const Layout: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('created');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSortChange = (field: SortOption, ascending: boolean) => {
    setSortBy(field);
    // You can store ascending state if needed for future use
  };

  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar
          viewMode={viewMode}
          setViewMode={setViewMode}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </div>
      
      <div className={styles.main}>
        <div className={styles.header}>
          <Header 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
          />
        </div>
        
        <div className={styles.content}>
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === 'list' ? (
              <TaskList 
                filter={activeFilter} 
                searchQuery={searchQuery} 
                sortBy={sortBy} 
                onSortChange={handleSortChange}
              />
            ) : (
              <CalendarView />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
