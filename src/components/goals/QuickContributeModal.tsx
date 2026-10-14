import React, { useState } from 'react';
import { FinancialGoal } from '../../types/finance';
import { formatNaira } from '../../utils/financeCalculations';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { PlusCircle, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

interface QuickContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: FinancialGoal | null;
  onContribute: (updatedGoal: FinancialGoal) => void;
}

const PRESET_AMOUNTS = [2000, 5000, 10000, 20000, 50000];

export const QuickContributeModal: React.FC<QuickContributeModalProps> = ({
  isOpen,
  onClose,
  goal,
  onContribute,
}) => {
  const [amountStr, setAmountStr] = useState('5000');
  const [error, setError] = useState<string | null>(null);

  if (!goal) return null;

  const currentAmount = goal.currentAmount;
  const targetAmount = goal.targetAmount;
  const contributionAmount = parseFloat(amountStr) || 0;
  const projectedAmount = currentAmount + contributionAmount;
  const projectedPercent =
    targetAmount > 0
      ? Math.min(100, Math.round((projectedAmount / targetAmount) * 100 * 10) / 10)
      : 100;
  const willComplete = projectedAmount >= targetAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      setError('Please specify a positive contribution amount.');
      return;
    }

    setError(null);
    const updatedGoal: FinancialGoal = {
      ...goal,
      currentAmount: projectedAmount,
      status: willComplete ? 'completed' : goal.status,
    };

    onContribute(updatedGoal);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Savings Contribution"
      description={`Add progress towards "${goal.title}"`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
            {error}
          </div>
        )}

        {/* Current Standing Summary */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Current Saved</span>
            <span>Target Cap</span>
          </div>
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {formatNaira(currentAmount)}
            </span>
            <span className="text-sm font-semibold text-slate-500 tabular-nums">
              {formatNaira(targetAmount)}
            </span>
          </div>

          {/* Progress bar with projected preview */}
          <div className="h-2.5 w-full bg-slate-200 rounded-lg overflow-hidden relative">
            <div
              style={{
                width: `${Math.min(
                  100,
                  (currentAmount / targetAmount) * 100
                )}%`,
              }}
              className="h-full bg-emerald-600 rounded-lg absolute left-0 top-0 transition-all"
            />
            {contributionAmount > 0 && (
              <div
                style={{
                  width: `${projectedPercent}%`,
                }}
                className="h-full bg-emerald-400/50 rounded-lg absolute left-0 top-0 transition-all"
              />
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
            <span>
              Projected: <strong className="text-emerald-700 tabular-nums">{formatNaira(projectedAmount)}</strong>
            </span>
            <span className="font-semibold text-emerald-700 tabular-nums">
              {projectedPercent}%
            </span>
          </div>
        </div>

        {/* Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Contribution Amount (₦ Naira)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
              ₦
            </span>
            <input
              type="number"
              min="500"
              step="500"
              value={amountStr}
              onChange={(e) => {
                setAmountStr(e.target.value);
                setError(null);
              }}
              placeholder="5000"
              className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white tabular-nums"
              required
            />
          </div>
        </div>

        {/* Preset quick buttons */}
        <div>
          <span className="block text-[11px] font-medium text-slate-500 mb-1.5">
            Quick increments:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmountStr(preset.toString())}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  amountStr === preset.toString()
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                +{formatNaira(preset)}
              </button>
            ))}
          </div>
        </div>

        {/* Notice of completion or milestone note */}
        {willComplete ? (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Milestone Target Met!</strong> This contribution will complete the {goal.title} goal.
            </span>
          </div>
        ) : (
          <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center gap-2 text-[11px] text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              Remaining gap after this deposit:{' '}
              <strong className="text-slate-800 tabular-nums">
                {formatNaira(Math.max(0, targetAmount - projectedAmount))}
              </strong>
            </span>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" icon={<PlusCircle className="w-4 h-4" />}>
            Record Contribution
          </Button>
        </div>
      </form>
    </Modal>
  );
};
