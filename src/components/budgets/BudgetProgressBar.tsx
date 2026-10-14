import React from 'react';

interface BudgetProgressBarProps {
  spent: number;
  limit: number;
  percentUsed: number;
  isOverBudget: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({
  spent,
  limit,
  percentUsed,
  isOverBudget,
  color,
  size = 'md',
}) => {
  const visualProgress = Math.min(100, Math.max(0, percentUsed));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const getBarColor = () => {
    if (isOverBudget) return 'bg-rose-500';
    if (percentUsed >= 85) return 'bg-amber-500';
    if (color) return color;
    return 'bg-emerald-500';
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-100 rounded-md overflow-hidden ${sizeClasses[size]}`}>
        <div
          style={{ width: `${visualProgress}%` }}
          className={`h-full rounded-md transition-all duration-300 ${getBarColor()}`}
        />
      </div>
    </div>
  );
};
