import React, { useState, useEffect } from 'react';
import { FinancialGoal, GoalStatus } from '../../types/finance';
import { Button } from '../shared/Button';

export interface GoalFormData {
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  status: GoalStatus;
  description?: string;
}

interface GoalFormProps {
  initialGoal?: FinancialGoal | null;
  onSubmit: (goal: GoalFormData) => void;
  onCancel: () => void;
}

const goalCategories = [
  'Technology',
  'Housing',
  'Safety Net',
  'Career & Certs',
  'Books & Project',
  'Travel / Field Trip',
  'General Savings',
];

export const GoalForm: React.FC<GoalFormProps> = ({
  initialGoal,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialGoal?.title || '');
  const [targetAmountStr, setTargetAmountStr] = useState(
    initialGoal ? initialGoal.targetAmount.toString() : '100000'
  );
  const [currentAmountStr, setCurrentAmountStr] = useState(
    initialGoal ? initialGoal.currentAmount.toString() : '20000'
  );
  const [targetDate, setTargetDate] = useState(
    initialGoal?.targetDate || '2026-12-31'
  );
  const [category, setCategory] = useState(
    initialGoal?.category || 'Technology'
  );
  const [status, setStatus] = useState<GoalStatus>(
    initialGoal?.status || 'in_progress'
  );
  const [description, setDescription] = useState(
    initialGoal?.description || ''
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialGoal) {
      setTitle(initialGoal.title);
      setTargetAmountStr(initialGoal.targetAmount.toString());
      setCurrentAmountStr(initialGoal.currentAmount.toString());
      setTargetDate(initialGoal.targetDate);
      setCategory(initialGoal.category);
      setStatus(initialGoal.status);
      setDescription(initialGoal.description || '');
    }
  }, [initialGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAmount = parseFloat(targetAmountStr);
    const currentAmount = parseFloat(currentAmountStr) || 0;

    if (!title.trim()) {
      setError('Please provide a goal title.');
      return;
    }

    if (isNaN(targetAmount) || targetAmount <= 0) {
      setError('Please specify a positive target amount in Naira.');
      return;
    }

    if (currentAmount < 0) {
      setError('Current saved amount cannot be negative.');
      return;
    }

    setError(null);
    onSubmit({
      title: title.trim(),
      targetAmount,
      currentAmount,
      targetDate,
      category,
      status,
      description: description.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Goal Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Laptop Upgrade for ML Project"
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Target Cap (₦ Naira)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
              ₦
            </span>
            <input
              type="number"
              min="1000"
              step="1000"
              value={targetAmountStr}
              onChange={(e) => setTargetAmountStr(e.target.value)}
              className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white tabular-nums"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Current Saved (₦ Naira)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
              ₦
            </span>
            <input
              type="number"
              min="0"
              step="1000"
              value={currentAmountStr}
              onChange={(e) => setCurrentAmountStr(e.target.value)}
              className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white tabular-nums"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          >
            {goalCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Target Completion Date
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            required
          />
        </div>
      </div>

      {initialGoal && (
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Goal Lifecycle Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as GoalStatus)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          >
            <option value="in_progress">In Progress (Active savings track)</option>
            <option value="completed">Completed (Target milestone achieved)</option>
            <option value="paused">Paused (Temporarily on hold)</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Notes & Milestones (Optional)
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Needs to be purchased before project defense"
          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
        />
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" type="submit">
          {initialGoal ? 'Update Goal' : 'Save Goal'}
        </Button>
      </div>
    </form>
  );
};
