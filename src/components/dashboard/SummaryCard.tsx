import React from 'react';
import { formatNaira } from '../../utils/financeCalculations';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'emerald' | 'blue' | 'amber' | 'rose' | 'default';
  trend?: {
    value: string;
    isPositive: boolean;
    label: string;
  };
  badge?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  amount,
  subtitle,
  icon: Icon,
  variant = 'default',
  trend,
  badge,
}) => {
  const variantStyles = {
    emerald: {
      bg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-100',
      pillBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    blue: {
      bg: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-100',
      pillBg: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    amber: {
      bg: 'bg-amber-500/10',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-100',
      pillBg: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    rose: {
      bg: 'bg-rose-500/10',
      iconColor: 'text-rose-600',
      borderColor: 'border-rose-100',
      pillBg: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    default: {
      bg: 'bg-slate-100',
      iconColor: 'text-slate-700',
      borderColor: 'border-slate-200',
      pillBg: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  };

  const style = variantStyles[variant];

  return (
    <div className="relative p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-sans tabular-nums">
              {formatNaira(amount)}
            </span>
          </div>
        </div>

        <div className={`p-3 rounded-2xl ${style.bg} ${style.iconColor} shrink-0`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>

      {(subtitle || trend || badge) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-slate-500 truncate">{subtitle}</span>
          )}

          {trend && (
            <div className="flex items-center gap-1 font-medium ml-auto">
              {trend.isPositive ? (
                <span className="flex items-center text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  {trend.value}
                </span>
              ) : (
                <span className="flex items-center text-rose-600">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                  {trend.value}
                </span>
              )}
              <span className="text-slate-400 font-normal">{trend.label}</span>
            </div>
          )}

          {badge && !trend && (
            <span className="text-xs font-semibold text-slate-600 ml-auto flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>{badge}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
