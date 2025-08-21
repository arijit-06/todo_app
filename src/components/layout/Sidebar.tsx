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
}

const Sidebar: React.FC<SidebarProps> = ({
  viewMode,
  setViewMode,
  activeFilter,
  setActiveFilter,
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

  return (
    <div className={styles.sidebar}>
      {/* User Profile */}
      <div className={styles.userProfile}>
        <div className={styles.userInfo}>
          {/* ONLY show one avatar - either image OR placeholder, not both */}
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <User size={20} />
            </div>
          )}
          <div className={styles.userDetails}>
            <p className={styles.userName}>
              {user?.displayName || user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <motion.li key={item.id}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode(item.id as ViewMode)}
                className={`${styles.navItem} ${
                  viewMode === item.id ? styles.active : ''
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </motion.button>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Filters */}
      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Filters</h3>
        <ul className={styles.filterList}>
          {filterItems.map((item) => (
            <motion.li key={item.id}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveFilter(item.id as FilterType)}
                className={`${styles.filterItem} ${
                  activeFilter === item.id ? styles.active : ''
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </motion.button>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Bottom Actions */}
      <div className={styles.bottomActions}>
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
