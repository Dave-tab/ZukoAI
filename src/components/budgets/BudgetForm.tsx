import React, { useState, useEffect } from 'react';
import { TransactionCategory, BudgetPeriod, Budget } from '../../types/finance';
import { Button } from '../shared/Button';

interface BudgetFormProps {
  initialBudget?: Budget | null;
  onSubmit: (budget: {
    category: TransactionCategory;
    limit: number;
    period: BudgetPeriod;
  }) => void;
  onCancel: () => void;
  existingCategories: TransactionCategory[];
}

const availableCategories: TransactionCategory[] = [
  'Food & Dining',
  'Books & Academic',
  'Housing & Rent',
  'Transportation',
  'Entertainment',
  'Utilities & Tech',
  'Personal Care',
  'Miscellaneous',
];

export const BudgetForm: React.FC<BudgetFormProps> = ({
  initialBudget,
  onSubmit,
  onCancel,
  existingCategories,
}) => {
  const isEditing = Boolean(initialBudget);

  const [category, setCategory] = useState<TransactionCategory>(
    initialBudget?.category ||
      availableCategories.find((c) => !existingCategories.includes(c)) ||
      'Miscellaneous'
  );
  const [limitStr, setLimitStr] = useState<string>(
    initialBudget ? String(initialBudget.limit) : '25000'
  );
  const [period, setPeriod] = useState<BudgetPeriod>(
    initialBudget?.period || 'monthly'
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialBudget) {
      setCategory(initialBudget.category);
      setLimitStr(String(initialBudget.limit));
      setPeriod(initialBudget.period);
    }
  }, [initialBudget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limitNum = parseFloat(limitStr);

    if (isNaN(limitNum) || limitNum <= 0) {
      setError('Please specify a positive budget limit in Naira (₦).');
      return;
    }

    // Only check duplicate category if we are creating new OR changing category on edit
    if (!isEditing && existingCategories.includes(category)) {
      setError(`A budget for "${category}" already exists.`);
      return;
    }

    if (
      isEditing &&
      initialBudget &&
      initialBudget.category !== category &&
      existingCategories.includes(category)
    ) {
      setError(`A budget for "${category}" already exists.`);
      return;
    }

    setError(null);
    onSubmit({
      category,
      limit: limitNum,
      period,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl animate-in fade-in">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Campus Expense Category
        </label>
        <select
          value={category}
          disabled={isEditing}
          onChange={(e) => setCategory(e.target.value as TransactionCategory)}
          className={`w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white ${
            isEditing ? 'opacity-80 cursor-not-allowed bg-slate-100' : ''
          }`}
        >
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}{' '}
              {!isEditing && existingCategories.includes(cat)
                ? '(Already set)'
                : ''}
            </option>
          ))}
        </select>
        {isEditing && (
          <p className="mt-1 text-[11px] text-slate-400">
            Category name is locked while adjusting spending limit.
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Budget Limit (₦ Naira)
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
            ₦
          </span>
          <input
            type="number"
            step="1000"
            min="1000"
            value={limitStr}
            onChange={(e) => setLimitStr(e.target.value)}
            className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            placeholder="e.g. 25000"
            required
          />
        </div>
        <p className="mt-1 text-[11px] text-slate-400">
          Set your maximum planned spending for this budget period.
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Budget Interval
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['monthly', 'weekly', 'semester'] as BudgetPeriod[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`py-2 text-xs font-semibold rounded-xl border capitalize transition-all cursor-pointer ${
                period === p
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" type="submit">
          {isEditing ? 'Update Budget' : 'Create Budget'}
        </Button>
      </div>
    </form>
  );
};
