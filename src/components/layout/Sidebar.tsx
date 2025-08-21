import React from 'react';
import { motion } from 'framer-motion';
import { 
  List, 
  Calendar, 
  Star, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Calendar as CalendarIcon,
  User,
  LogOut
} from 'lucide-react';
import { ViewMode, FilterType } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { logout } from '../../services/auth';
import ThemeToggle from '../ui/ThemeToggle';
import styles from './layout.module.css';

interface SidebarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  viewMode,
  setViewMode,
  activeFilter,
  setActiveFilter,
  collapsed,
  onToggleCollapse,
}) => {
  const { user } = useAuth();

  const navItems = [
    { id: 'list', label: 'Tasks', icon: List },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  const filterItems = [
    { id: 'all', label: 'All Tasks', icon: List },
    { id: 'important', label: 'Important', icon: Star },
    { id: 'urgent', label: 'Urgent', icon: AlertCircle },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
    { id: 'today', label: 'Today', icon: Clock },
    { id: 'upcoming', label: 'Upcoming', icon: CalendarIcon },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Handle sidebar background click to toggle collapse
  const handleSidebarClick = (e: React.MouseEvent) => {
    // Only toggle if clicking on the sidebar background, not on buttons
    if (e.target === e.currentTarget) {
      onToggleCollapse();
    }
  };

  // Prevent event bubbling when clicking on interactive elements
  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation(); // Prevent sidebar click
    callback();
  };

  return (
    <div 
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}
      onClick={handleSidebarClick}
    >
      {/* User Profile */}
      <div 
        className={styles.userProfile}
        onClick={handleSidebarClick} // Allow clicking on profile area to collapse
      >
        <div className={styles.userInfo}>
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <User size={collapsed ? 16 : 20} />
            </div>
          )}
          {!collapsed && (
            <div className={styles.userDetails}>
              <p className={styles.userName}>
                {user?.displayName || user?.email}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <motion.li key={item.id}>
              <motion.button
                whileHover={{ scale: collapsed ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => handleButtonClick(e, () => setViewMode(item.id as ViewMode))}
                className={`${styles.navItem} ${
                  viewMode === item.id ? styles.active : ''
                }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={20} className={styles.navItemIcon} />
                {!collapsed && (
                  <span className={styles.navItemLabel}>{item.label}</span>
                )}
              </motion.button>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Filters */}
      <div className={styles.filterSection}>
        {!collapsed && <h3 className={styles.filterTitle}>Filters</h3>}
        <ul className={styles.filterList}>
          {filterItems.map((item) => (
            <motion.li key={item.id}>
              <motion.button
                whileHover={{ scale: collapsed ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => handleButtonClick(e, () => setActiveFilter(item.id as FilterType))}
                className={`${styles.filterItem} ${
                  activeFilter === item.id ? styles.active : ''
                }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={16} className={styles.filterItemIcon} />
                {!collapsed && (
                  <span className={styles.filterItemLabel}>{item.label}</span>
                )}
              </motion.button>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Bottom Actions */}
      <div className={styles.bottomActions}>
        <div onClick={(e) => e.stopPropagation()}>
          <ThemeToggle />
        </div>
        <button
          onClick={(e) => handleButtonClick(e, handleLogout)}
          className={styles.logoutButton}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut size={16} className={styles.logoutButtonIcon} />
          {!collapsed && (
            <span className={styles.logoutButtonLabel}>Sign Out</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
