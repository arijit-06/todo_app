import React, { useMemo } from 'react';
import styles from './ui.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium', 
  children, 
  className = '', 
  ...props 
}) => {
  const buttonClass = useMemo(() => 
    `${styles.button} ${styles[`button${capitalizeFirst(variant)}`]} ${styles[`button${capitalizeFirst(size)}`]} ${className}`,
    [variant, size, className]
  );

  return (
    <button
      className={buttonClass}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
