import React, { useState } from 'react';
import { Search } from 'lucide-react';
import styles from './layout.module.css';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className={styles.header}>
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
    </header>
  );
};

export default Header;
