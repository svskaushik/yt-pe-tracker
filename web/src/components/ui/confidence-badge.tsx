import * as React from 'react';

import { cn } from '../../lib/utils';

interface ConfidenceBadgeProps {
  confidence: 'high' | 'medium' | 'low';
  status: string;
  className?: string;
}

function ConfidenceBadge({ confidence, status, className }: ConfidenceBadgeProps) {
  const getStyles = (level: 'high' | 'medium' | 'low') => {
    const baseStyles =
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent';

    switch (level) {
      case 'high':
        return `${baseStyles} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100`;
      case 'medium':
        return `${baseStyles} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100`;
      case 'low':
        return `${baseStyles} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100`;
      default:
        return baseStyles;
    }
  };

  const getDisplayText = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return 'Confirmed';
      case 'medium':
        return 'Unverified';
      case 'low':
        return 'Low Confidence';
      default:
        return status;
    }
  };

  return <div className={cn(getStyles(confidence), className)}>{getDisplayText(confidence)}</div>;
}

export { ConfidenceBadge };
