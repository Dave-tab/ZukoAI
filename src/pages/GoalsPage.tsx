import React, { useState } from 'react';
import { FinancialGoal } from '../types/finance';
import { calculateGoalProgress, formatNaira } from '../utils/financeCalculations';
import { GoalCard, GoalForm, QuickContributeModal, GoalFormData } from '../components/goals';
import { Modal } from '../components/shared/Modal';
import { Button } from '../components/shared/Button';
import { EmptyState } from '../components/shared/EmptyState';
import { Target, Plus, Trophy, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface GoalsPageProps {
  goals: FinancialGoal[];
  onAddGoal: (goal: {
    title: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    category: string;
    description?: string;
  }) => void;
  onUpdateGoal?: (goal: FinancialGoal) => void;
  onDeleteGoal: (id: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export const GoalsPage: React.FC<GoalsPageProps> = ({
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed' | 'paused'>('all');
  const [goalToEdit, setGoalToEdit] = useState<FinancialGoal | null>(null);
  const [contributeGoal, setContributeGoal] = useState<FinancialGoal | null>(null);

  const goalProgresses = goals.map((g) => ({
    goal: g,
    progress: calculateGoalProgress(g),
  }));

  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const completedGoalsCount = goalProgresses.filter((p) => p.progress.isCompleted || p.goal.status === 'completed').length;
  const pausedGoalsCount = goals.filter((g) => g.status === 'paused').length;
  const inProgressGoalsCount = goals.filter((g) => g.status === 'in_progress' && !calculateGoalProgress(g).isCompleted).length;

  const filteredGoals = goalProgresses.filter(({ goal, progress }) => {
    if (filter === 'completed') return progress.isCompleted || goal.status === 'completed';
    if (filter === 'paused') return goal.status === 'paused';
    if (filter === 'in_progress') return goal.status === 'in_progress' && !progress.isCompleted;
    return true;
  });

  const handleOpenCreateModal = () => {
    setGoalToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (goal: FinancialGoal) => {
    setGoalToEdit(goal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setGoalToEdit(null);
  };

  const handleFormSubmit = (data: GoalFormData) => {
    if (goalToEdit && onUpdateGoal) {
      onUpdateGoal({
        ...goalToEdit,
        ...data,
      });
    } else {
      onAddGoal({
        title: data.title,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount,
        targetDate: data.targetDate,
        category: data.category,
        description: data.description,
      });
    }
    handleCloseModal();
  };

  const handleContributeSubmit = (updatedGoal: FinancialGoal) => {
    if (onUpdateGoal) {
      onUpdateGoal(updatedGoal);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Academic & Financial Goals
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Track student target.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreateModal}
        >
          Create Goal
        </Button>
      </div>

      {/* Aggregate Goal Progress Card */}
      <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-sm border border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Cumulative Goals Target
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold mt-1 text-white tabular-nums">
              {formatNaira(totalTarget)}
            </p>
            <span className="text-xs text-slate-400 mt-1 block">
              Across {goals.length} academic and equipment goals
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Total Saved / Accumulated
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold mt-1 text-emerald-300 tabular-nums">
              {formatNaira(totalSaved)}
            </p>
            <span className="text-xs text-slate-400 mt-1 block tabular-nums">
              {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}% aggregate goal progress
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              Completed Milestones
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold mt-1 text-amber-300 tabular-nums">
              {completedGoalsCount} / {goals.length}
            </p>
            <span className="text-xs text-slate-400 mt-1 block tabular-nums">
              {inProgressGoalsCount} in progress · {pausedGoalsCount} paused
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Goals ({goals.length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filter === 'in_progress'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Progress ({inProgressGoalsCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filter === 'completed'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({completedGoalsCount})
          </button>
          {pausedGoalsCount > 0 && (
            <button
              onClick={() => setFilter('paused')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filter === 'paused'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paused ({pausedGoalsCount})
            </button>
          )}
        </div>

        <span className="text-xs text-slate-400">
          Showing {filteredGoals.length} of {goals.length} goals
        </span>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map(({ goal, progress }) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              progress={progress}
              onEdit={handleOpenEditModal}
              onDelete={onDeleteGoal}
              onQuickContribute={(g) => setContributeGoal(g)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Target className="w-6 h-6" />}
          title="No Goals Found"
          description="You do not have any goals matching this filter criteria."
          actionLabel="Create Goal"
          onAction={handleOpenCreateModal}
        />
      )}

      {/* Create / Edit Goal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={goalToEdit ? 'Edit Goal Target' : 'Set Academic or Financial Target'}
        description={
          goalToEdit
            ? `Modify settings, target cap, or status for "${goalToEdit.title}".`
            : 'Establish target amount, deadline, and notes for this student milestone.'
        }
      >
        <GoalForm
          initialGoal={goalToEdit}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Quick Contribute / Record Savings Modal */}
      <QuickContributeModal
        isOpen={!!contributeGoal}
        onClose={() => setContributeGoal(null)}
        goal={contributeGoal}
        onContribute={handleContributeSubmit}
      />
    </div>
  );
};
