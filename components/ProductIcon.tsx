import React from 'react';

const CATEGORY_CONFIG: Record<string, { bg: string; fg: string; icon: React.ReactNode }> = {
  Bebidas: {
    bg: '#EFF6FF',
    fg: '#3B82F6',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15m-1.8 0V18a2.25 2.25 0 01-2.25 2.25H8.25A2.25 2.25 0 016 18v-3M5 14.5h14" />
      </svg>
    ),
  },
  'Lácteos': {
    bg: '#FFFBEB',
    fg: '#F59E0B',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-4M9 3a2 2 0 012-2h2a2 2 0 012 2M9 3h6m-6 4l1.5 8h5L17 7" />
      </svg>
    ),
  },
  Carnes: {
    bg: '#FFF1F2',
    fg: '#F43F5E',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.522 4.82 3.889 6.115L6 21h12l-.889-4.77C19.478 14.935 21 12.672 21 10.115 21 6.185 16.97 3 12 3z" />
      </svg>
    ),
  },
  'Almacén': {
    bg: '#FFF7ED',
    fg: '#EA580C',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  Congelados: {
    bg: '#ECFEFF',
    fg: '#06B6D4',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M18.364 5.636L5.636 18.364" />
      </svg>
    ),
  },
  'Pan y Panadería': {
    bg: '#FEFCE8',
    fg: '#CA8A04',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1012 10.125 2.625 2.625 0 0012 4.875zM12 10.125v.75m-2.812-1.5l.75.75m4.125-.75l-.75.75M9.375 7.125l-.75-.75m7.5 0l-.75.75" />
      </svg>
    ),
  },
  Snacks: {
    bg: '#FFF7ED',
    fg: '#F97316',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  'Perfumería e Higiene': {
    bg: '#FDF4FF',
    fg: '#A855F7',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5" />
      </svg>
    ),
  },
  Limpieza: {
    bg: '#F0FDF4',
    fg: '#22C55E',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636" />
      </svg>
    ),
  },
};

const DEFAULT_CONFIG = {
  bg: '#F1F5F9',
  fg: '#64748B',
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
};

interface ProductIconProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProductIcon: React.FC<ProductIconProps> = ({ category, size = 'md', className = '' }) => {
  const config = CATEGORY_CONFIG[category] || DEFAULT_CONFIG;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-full h-full',
    lg: 'w-16 h-16',
  };

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <div
      className={`flex items-center justify-center rounded-lg ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: config.bg, color: config.fg }}
    >
      <div className={iconSize[size]}>
        {config.icon}
      </div>
    </div>
  );
};

export const getCategoryColor = (category: string) => {
  const config = CATEGORY_CONFIG[category] || DEFAULT_CONFIG;
  return config.fg;
};
