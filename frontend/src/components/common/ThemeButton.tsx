import React from 'react';
import { Link } from 'react-router-dom';

export interface ThemeButtonProps {
  to?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'gold' | 'solid' | 'dark';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
  id?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Clean typography text wrapper component for button labels.
 */
export const WavyLetters: React.FC<{ text: string }> = ({ text }) => {
  return <span>{text}</span>;
};

export const ThemeButton: React.FC<ThemeButtonProps> = ({
  to,
  href,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'gold',
  icon,
  iconPosition = 'left',
  children,
  className = '',
  id,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'text-[11px] sm:text-xs py-2 px-4 sm:px-5 gap-2 rounded-full',
    md: 'text-xs sm:text-[13px] py-2.5 sm:py-3 px-6 sm:px-8 gap-2.5 rounded-full',
    lg: 'text-xs sm:text-sm py-3.5 sm:py-4 px-8 sm:px-10 gap-3 rounded-full',
  }[size];

  const variantClass = variant === 'solid' ? 'btn-gold-solid' : 'btn-gold-luxury';

  const content = (
    <span className="relative z-10 flex items-center justify-center gap-2 select-none">
      {icon && iconPosition === 'left' && (
        <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </span>
  );

  const combinedClasses = `${variantClass} ${sizeClasses} ${className} ${disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`;

  if (to && !disabled) {
    return (
      <Link to={to} id={id} className={combinedClasses} onClick={onClick}>
        {content}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a href={href} id={id} className={combinedClasses} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button
      id={id}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combinedClasses}
    >
      {content}
    </button>
  );
};

export default ThemeButton;
