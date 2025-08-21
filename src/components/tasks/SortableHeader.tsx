import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { SortOption } from '../../types';
import styles from './SortableHeader.module.css';

interface SortableHeaderProps {
  sortBy: SortOption;
  onSortChange: (field: SortOption, ascending: boolean) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ sortBy, onSortChange }) => {
  const [ascending, setAscending] = useState<boolean>(true);

  const sortFields = [
    { id: 'deadline', label: 'Due Date' },
    { id: 'importance', label: 'Priority' },
    { id: 'urgency', label: 'Urgency' },
  ];

  const handleClick = (field: SortOption) => {
    if (field === sortBy) {
      const newAscending = !ascending;
      setAscending(newAscending);
      onSortChange(field, newAscending);
    } else {
      setAscending(true);
      onSortChange(field, true);
    }
  };

  return (
    <div className={styles.sortHeader}>
      {sortFields.map((field) => (
        <div
          key={field.id}
          className={`${styles.sortField} ${sortBy === field.id ? styles.active : ''}`}
          onClick={() => handleClick(field.id as SortOption)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick(field.id as SortOption);
            }
          }}
        >
          <span className={styles.fieldLabel}>{field.label}</span>
          {sortBy === field.id && (
            <span className={styles.sortIcon}>
              {ascending ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default SortableHeader;
