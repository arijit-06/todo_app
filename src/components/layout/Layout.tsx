import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Sidebar from './Sidebar';
import TaskList from '../tasks/TaskList';
import CalendarView from '../calendar/CalendarView';
import { ViewMode, FilterType, SortOption } from '../../types';
import styles from './layout.module.css';

const Layout: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('created');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSortChange = (field: SortOption, ascending: boolean) => {
    setSortBy(field);
  };

  return (
    <div className={`${styles.layout} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
      <Sidebar
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className={styles.main}>
        {/* Floating Search Bar */}
        <div className={styles.floatingSearch}>
          <div className={`${styles.searchContainer} ${isSearchFocused ? styles.searchExpanded : ''}`}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={styles.searchInput}
            />
          </div>
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
