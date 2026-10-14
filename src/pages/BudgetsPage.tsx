import React, { useState } from 'react';
import { Budget, Transaction, TransactionCategory, BudgetPeriod } from '../types/finance';
import { calculateBudgetStatus, formatNaira } from '../utils/financeCalculations';
import { BudgetCard, BudgetForm } from '../components/budgets';
import { Modal } from '../components/shared/Modal';
import { Button } from '../components/shared/Button';
import { EmptyState } from '../components/shared/EmptyState';
import {
  PieChart,
  Plus,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Info,
} from 'lucide-react';

interface BudgetsPageProps {
  budgets: Budget[];
  transactions: Transaction[];
  onAddBudget: (budget: {
    category: TransactionCategory;
    limit: number;
    period: BudgetPeriod;
  }) => void;
  onUpdateBudget?: (budget: {
    id: string;
    category: TransactionCategory;
    limit: number;
    period: BudgetPeriod;
  }) => void;
  onDeleteBudget: (id: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export const BudgetsPage: React.FC<BudgetsPageProps> = ({
  budgets,
  transactions,
  onAddBudget,
  onUpdateBudget,
  onDeleteBudget,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [filter, setFilter] = useState<'all' | 'over_budget' | 'healthy'>('all');
  const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);

  const budgetStatuses = budgets.map((b) => ({
    budget: b,
    status: calculateBudgetStatus(b, transactions),
  }));

  const totalLimit = budgets.reduce((acc, b) => acc + b.limit, 0);
  const totalSpent = budgetStatuses.reduce((acc, s) => acc + s.status.spent, 0);
  const totalOverAmount = budgetStatuses
    .filter((s) => s.status.isOverBudget)
    .reduce((acc, s) => acc + s.status.overAmount, 0);

  const filteredStatuses = budgetStatuses.filter(({ status }) => {
    if (filter === 'over_budget') return status.isOverBudget;
    if (filter === 'healthy') return !status.isOverBudget;
    return true;
  });

  const existingCategories = budgets.map((b) => b.category);

  const handleOpenCreateModal = () => {
    setBudgetToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (budget: Budget) => {
    setBudgetToEdit(budget);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBudgetToEdit(null);
  };

  const handleFormSubmit = (data: {
    category: TransactionCategory;
    limit: number;
    period: BudgetPeriod;
  }) => {
    if (budgetToEdit && onUpdateBudget) {
      onUpdateBudget({
        id: budgetToEdit.id,
        ...data,
      });
    } else {
      onAddBudget(data);
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Campus Budgets & Limits
            </h1>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              Active Term
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Keep track of monthly spending limits per category.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreateModal}
        >
          Create Budget
        </Button>
      </div>

      {/* Aggregate Overview Card following Stitch visual tokens */}
      <div className="p-6 bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 rounded-3xl text-white shadow-sm border border-slate-800 relative overflow-hidden">
        {/* Subtle ambient blur */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-52 h-52 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Total Budgeted Allocation
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold mt-1 text-white">
              {formatNaira(totalLimit)}
            </p>
            <span className="text-xs text-slate-400 mt-1 block">
              Across {budgets.length} active spending envelopes
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Current Utilization
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold mt-1 text-emerald-300">
              {formatNaira(totalSpent)}
            </p>
            <span className="text-xs text-slate-400 mt-1 block">
              {totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0}% of semester cap utilized
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              Over-Limit Alerts
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold mt-1 text-rose-300">
              {totalOverAmount > 0 ? formatNaira(totalOverAmount) : '₦0.00'}
            </p>
            <span className="text-xs text-slate-400 mt-1 block">
              {budgetStatuses.filter((s) => s.status.isOverBudget).length} categories exceeded
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Header Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({budgets.length})
          </button>
          <button
            onClick={() => setFilter('over_budget')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filter === 'over_budget'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Over Budget ({budgetStatuses.filter((s) => s.status.isOverBudget).length})
          </button>
          <button
            onClick={() => setFilter('healthy')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filter === 'healthy'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Healthy ({budgetStatuses.filter((s) => !s.status.isOverBudget).length})
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Info className="w-4 h-4 text-slate-400" />
          <span>Click the edit pen icon on any card to adjust limits</span>
        </div>
      </div>

      {/* Budgets Responsive Grid */}
      {filteredStatuses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStatuses.map(({ budget, status }) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              status={status}
              onEdit={handleOpenEditModal}
              onDelete={onDeleteBudget}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<PieChart className="w-6 h-6" />}
          title="No Budgets in this Filter"
          description="You do not have any budget envelopes matching this filter criteria."
          actionLabel="Create Budget"
          onAction={handleOpenCreateModal}
        />
      )}

      {/* Create / Edit Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={budgetToEdit ? `Edit ${budgetToEdit.category} Budget` : 'Set Category Budget Threshold'}
        description={
          budgetToEdit
            ? 'Adjust the spending cap for this campus budget.'
            : 'Allocate monthly spending limit for this campus category.'
        }
      >
        <BudgetForm
          initialBudget={budgetToEdit}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          existingCategories={existingCategories}
        />
      </Modal>
    </div>
  );
};
