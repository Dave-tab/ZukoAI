import React from 'react';
import { Budget, BudgetStatus } from '../../types/finance';
import { formatNaira } from '../../utils/financeCalculations';
import { AlertCircle, CheckCircle2, ChevronRight, PieChart } from 'lucide-react';

interface BudgetProgressProps {
  statuses: BudgetStatus[];
  onViewAll?: () => void;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({
  statuses,
  onViewAll,
}) => {
  return (
    <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Budget Thresholds</h3>
              <p className="text-xs text-slate-500">Real-time category allocation</p>
            </div>
          </div>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              <span>Manage</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {statuses.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No active category budgets configured yet.
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {statuses.slice(0, 4).map((status) => {
              const visualProgress = Math.min(100, Math.max(0, status.percentUsed));

              return (
                <div key={status.category} className="space-y-1.5 group">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                        {status.category}
                      </span>
                      {status.isOverBudget && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600">
                          <AlertCircle className="w-3 h-3" /> Over limit
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 tabular-nums font-mono text-xs">
                      <span className="font-bold text-slate-900">
                        {formatNaira(status.spent, false)}
                      </span>
                      <span className="text-slate-400">/ {formatNaira(status.limit, false)}</span>
                    </div>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="h-2.5 w-full bg-slate-100 rounded-md overflow-hidden relative">
                    <div
                      style={{ width: `${visualProgress}%` }}
                      className={`h-full rounded-md transition-all duration-300 ${
                        status.isOverBudget
                          ? 'bg-rose-500'
                          : status.percentUsed >= 85
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>

                  {/* Remaining & Percentage truthful caption */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      {status.isOverBudget ? (
                        <span className="text-rose-600 font-medium">
                          Exceeded by {formatNaira(status.overAmount)}
                        </span>
                      ) : (
                        <span>
                          Remaining: <span className="text-slate-700 font-semibold">{formatNaira(status.remaining)}</span>
                        </span>
                      )}
                    </span>
                    <span
                      className={`font-semibold ${
                        status.isOverBudget
                          ? 'text-rose-600'
                          : status.percentUsed >= 85
                          ? 'text-amber-600'
                          : 'text-slate-600'
                      }`}
                    >
                      {status.percentUsed}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Active alert monitoring enabled</span>
        </div>
      </div>
    </div>
  );
};
