import React from 'react';
import { FinancialGoal, GoalProgress } from '../../types/finance';
import { formatNaira } from '../../utils/financeCalculations';
import {
  Laptop,
  Home,
  ShieldCheck,
  Award,
  Calendar,
  CheckCircle2,
  Trash2,
  Pencil,
  PlusCircle,
  TrendingUp,
  PauseCircle,
  BookOpen,
  Plane,
} from 'lucide-react';

interface GoalCardProps {
  goal: FinancialGoal;
  progress: GoalProgress;
  onEdit?: (goal: FinancialGoal) => void;
  onDelete?: (id: string) => void;
  onQuickContribute?: (goal: FinancialGoal) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  progress,
  onEdit,
  onDelete,
  onQuickContribute,
}) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'Technology':
        return <Laptop className="w-5 h-5 text-emerald-600" />;
      case 'Housing':
        return <Home className="w-5 h-5 text-blue-600" />;
      case 'Safety Net':
        return <ShieldCheck className="w-5 h-5 text-teal-600" />;
      case 'Career & Certs':
        return <Award className="w-5 h-5 text-amber-600" />;
      case 'Books & Project':
        return <BookOpen className="w-5 h-5 text-indigo-600" />;
      case 'Travel / Field Trip':
        return <Plane className="w-5 h-5 text-violet-600" />;
      default:
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const dateObj = new Date(
          parseInt(parts[0], 10),
          parseInt(parts[1], 10) - 1,
          parseInt(parts[2], 10)
        );
        return dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const isCompleted = progress.isCompleted || goal.status === 'completed';
  const isPaused = goal.status === 'paused';

  return (
    <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-100 rounded-2xl shrink-0">
              {getIcon(goal.category)}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {goal.title}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                <span className="capitalize">{goal.category}</span>
                {goal.targetDate && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(goal.targetDate)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons (Edit, Delete) */}
          <div className="flex items-center gap-1 shrink-0">
            {onEdit && (
              <button
                onClick={() => onEdit(goal)}
                className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Edit goal"
                aria-label={`Edit ${goal.title}`}
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(goal.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Remove goal"
                aria-label={`Delete ${goal.title}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Status tag */}
        <div className="mt-3 flex items-center gap-2">
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Target Completed
            </span>
          ) : isPaused ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
              <PauseCircle className="w-3.5 h-3.5" />
              Savings Paused
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg">
              {progress.daysRemaining > 0
                ? `${progress.daysRemaining} days left`
                : 'Target Due'}
            </span>
          )}
        </div>

        {goal.description && (
          <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {goal.description}
          </p>
        )}

        {/* Amounts Grid */}
        <div className="mt-4 flex items-baseline justify-between text-sm">
          <div>
            <span className="text-xs text-slate-400 font-medium">Accumulated</span>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 tabular-nums">
              {formatNaira(progress.currentAmount)}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">Target Cap</span>
            <p className="text-sm font-semibold text-slate-600 mt-0.5 tabular-nums">
              {formatNaira(progress.targetAmount)}
            </p>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-2.5">
          <div className="w-full bg-slate-100 rounded-lg h-2.5 overflow-hidden">
            <div
              style={{ width: `${progress.percentComplete}%` }}
              className={`h-full rounded-lg transition-all duration-300 ${
                isCompleted ? 'bg-emerald-500' : 'bg-emerald-600'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Truthful Footer per Rule 8.C & Quick Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div>
          {isCompleted ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% achieved
            </span>
          ) : (
            <span>
              Remaining:{' '}
              <span className="font-bold text-slate-800 tabular-nums">
                {formatNaira(progress.remainingAmount)}
              </span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="font-bold text-emerald-700 tabular-nums">
            {progress.percentComplete}%
          </span>

          {!isCompleted && onQuickContribute && (
            <button
              onClick={() => onQuickContribute(goal)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Progress</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
