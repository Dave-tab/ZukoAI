import React from 'react';
import { Budget, BudgetStatus } from '../../types/finance';
import { formatNaira } from '../../utils/financeCalculations';
import { BudgetProgressBar } from './BudgetProgressBar';
import {
  AlertTriangle,
  CheckCircle2,
  Coffee,
  BookOpen,
  Bus,
  Gamepad2,
  Home,
  Sparkles,
  Wifi,
  Trash2,
  Edit2,
} from 'lucide-react';

interface BudgetCardProps {
  budget: Budget;
  status: BudgetStatus;
  onEdit?: (budget: Budget) => void;
  onDelete?: (id: string) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  status,
  onEdit,
  onDelete,
}) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'Food & Dining':
        return <Coffee className="w-5 h-5 text-emerald-600" />;
      case 'Books & Academic':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'Transportation':
        return <Bus className="w-5 h-5 text-amber-600" />;
      case 'Entertainment':
        return <Gamepad2 className="w-5 h-5 text-pink-600" />;
      case 'Utilities & Tech':
        return <Wifi className="w-5 h-5 text-purple-600" />;
      case 'Personal Care':
        return <Sparkles className="w-5 h-5 text-teal-600" />;
      default:
        return <Home className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div
      className={`p-5 sm:p-6 bg-white rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between ${
        status.isOverBudget
          ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/10'
          : status.percentUsed >= 85
          ? 'border-amber-200'
          : 'border-slate-200/80'
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-100 rounded-2xl shrink-0">
              {getIcon(budget.category)}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {budget.category}
              </h3>
              <span className="text-[11px] font-medium text-slate-400 capitalize">
                {budget.period} budget
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {status.isOverBudget ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 bg-rose-50 text-rose-700 rounded-full border border-rose-200">
                <AlertTriangle className="w-3.5 h-3.5" />
                Over Limit
              </span>
            ) : status.percentUsed >= 85 ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                Critical
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                Healthy
              </span>
            )}

            {/* Quick Actions (Edit & Delete) */}
            <div className="flex items-center ml-1 border-l border-slate-200 pl-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(budget)}
                  className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Edit budget limit"
                  aria-label={`Edit ${budget.category} budget`}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(budget.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Remove budget"
                  aria-label={`Delete ${budget.category} budget`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Amounts */}
        <div className="mt-5 flex items-baseline justify-between text-sm">
          <div>
            <span className="text-xs text-slate-500 font-medium">Spent so far</span>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
              {formatNaira(status.spent)}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium">Cap limit</span>
            <p className="text-sm font-semibold text-slate-600 mt-0.5">
              {formatNaira(status.limit)}
            </p>
          </div>
        </div>

        {/* Progress Visual */}
        <div className="mt-3">
          <BudgetProgressBar
            spent={status.spent}
            limit={status.limit}
            percentUsed={status.percentUsed}
            isOverBudget={status.isOverBudget}
            size="md"
          />
        </div>
      </div>

      {/* Truthful Remaining Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div>
          {status.isOverBudget ? (
            <span className="text-rose-600 font-semibold">
              Over budget by {formatNaira(status.overAmount)}
            </span>
          ) : (
            <span className="text-slate-600">
              Remaining:{' '}
              <span className="font-bold text-slate-900">{formatNaira(status.remaining)}</span>
            </span>
          )}
        </div>
        <span
          className={`font-bold ${
            status.isOverBudget
              ? 'text-rose-600'
              : status.percentUsed >= 85
              ? 'text-amber-600'
              : 'text-emerald-700'
          }`}
        >
          {status.percentUsed}%
        </span>
      </div>
    </div>
  );
};
