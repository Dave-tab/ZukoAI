import React, { useState } from 'react';
import {
  WalletCard,
  SummaryCard,
  SpendingChart,
  BudgetProgress,
  RecentTransactions,
  AIInsightCard,
  AIInsightDetailModal,
} from '../components/dashboard';
import {
  Transaction,
  Budget,
  FinancialGoal,
  AIInsight,
  StudentProfile,
  AppPage,
} from '../types/finance';
import {
  calculateFinancialSummary,
  calculateBudgetStatus,
  calculateDailySpendingBreakdown,
  calculateCategoryBreakdown,
  calculateGoalProgress,
  formatNaira,
} from '../utils/financeCalculations';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Target,
  Sparkles,
  Plus,
  ShieldCheck,
  Calendar,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../components/shared/Button';

interface DashboardPageProps {
  transactions: Transaction[];
  budgets: Budget[];
  goals: FinancialGoal[];
  insights: AIInsight[];
  profile: StudentProfile;
  walletBalance?: { available_balance: number; currency: 'NGN' };
  onNavigate: (page: AppPage) => void;
  onAddBudget: () => void;
  onAddGoal: () => void;
  onOpenAssistantModal: (initialPrompt?: string, initialInsight?: AIInsight) => void;
  onRefreshWallet?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  transactions,
  budgets,
  goals,
  insights,
  profile,
  walletBalance,
  onNavigate,
  onAddBudget,
  onAddGoal,
  onOpenAssistantModal,
  onRefreshWallet,
}) => {
  const [selectedInsightForDetail, setSelectedInsightForDetail] = useState<AIInsight | null>(null);

  const summary = calculateFinancialSummary(
    transactions,
    budgets,
    goals,
    walletBalance?.available_balance
  );
  const budgetStatuses = budgets.map((b) => calculateBudgetStatus(b, transactions));
  const dailyBreakdown = calculateDailySpendingBreakdown(transactions, 7);
  const categoryBreakdown = calculateCategoryBreakdown(transactions);

  // Top active academic goal for the right-hand dashboard column
  const primaryGoal = goals.find((g) => g.status === 'in_progress') || goals[0];
  const goalProgress = primaryGoal ? calculateGoalProgress(primaryGoal) : null;

  const firstName = profile.name.split(' ')[0] || 'Student';

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. Greeting & Identity Header (Positioned cleanly directly beneath top bar, outside cards) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome back, {firstName} 👋
          </h1>
        </div>

        {/* Quick Actions Cluster */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5 text-slate-600" />}
            onClick={onAddBudget}
            className="border-slate-300 hover:bg-slate-100 text-slate-800"
          >
            New Budget
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Target className="w-3.5 h-3.5 text-slate-600" />}
            onClick={onAddGoal}
            className="border-slate-300 hover:bg-slate-100 text-slate-800"
          >
            New Goal
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<MessageSquare className="w-3.5 h-3.5 text-white" />}
            onClick={() => onOpenAssistantModal()}
            className="bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
          >
            Ask Zuko
          </Button>
        </div>
      </div>

      {/* 2. Authoritative Spendable Wallet Balance (D05 Isolation) */}
      <WalletCard
        balance={summary.authoritativeBalance}
        currency={walletBalance?.currency || 'NGN'}
        onRefresh={onRefreshWallet}
        onViewTransactions={() => onNavigate('transactions')}
      />

      {/* 3. Derived Financial Summary Grid (3 balanced, truthful metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <SummaryCard
          title="Monthly Income"
          amount={summary.totalIncome}
          subtitle="Family allowance & stipends"
          icon={ArrowDownLeft}
          variant="blue"
          trend={{ value: '100%', isPositive: true, label: 'Allocated' }}
        />
        <SummaryCard
          title="Eligible Expenses"
          amount={summary.totalExpenses}
          subtitle="Tracked against envelopes"
          icon={ArrowUpRight}
          variant="amber"
          badge={summary.overBudgetsCount > 0 ? `${summary.overBudgetsCount} over limit` : undefined}
        />
        <SummaryCard
          title="Net Term Savings"
          amount={summary.netSavings}
          subtitle={`${summary.savingsRate}% savings momentum`}
          icon={Target}
          variant="emerald"
          trend={{ value: `${summary.savingsRate}%`, isPositive: true, label: 'Rate' }}
        />
      </div>

      {/* 4. Non-Intrusive Zuko AI Financial Intelligence (Distinct detail view and assistant triggers) */}
      <AIInsightCard
        insights={insights}
        onOpenAssistant={() => onOpenAssistantModal()}
        onSelectInsight={(insight) => setSelectedInsightForDetail(insight)}
      />

      {/* 5. Primary Analytics & Tracking Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 spans): Spending Patterns & Recent Campus Transactions */}
        <div className="lg:col-span-2 space-y-6">
          <SpendingChart
            dailyData={dailyBreakdown}
            categoryData={categoryBreakdown}
          />
          <RecentTransactions
            transactions={transactions}
            onViewAll={() => onNavigate('transactions')}
          />
        </div>

        {/* Right Column (1 span): Budget Thresholds & Academic Goal Progress */}
        <div className="space-y-6">
          <BudgetProgress
            statuses={budgetStatuses}
            onViewAll={() => onNavigate('budgets')}
          />

          {/* Academic Goal Snapshot Card */}
          {primaryGoal && goalProgress ? (
            <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Academic Goal Target</h3>
                    <p className="text-xs text-slate-500">Milestone savings progress</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('goals')}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  <span>Goals</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{primaryGoal.title}</span>
                  <span className="font-semibold text-emerald-700 tabular-nums">
                    {goalProgress.percentComplete}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 w-full bg-slate-100 rounded-md overflow-hidden">
                  <div
                    style={{ width: `${goalProgress.percentComplete}%` }}
                    className="h-full bg-emerald-600 rounded-md transition-all duration-300"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>
                    Saved: <strong className="text-slate-800 tabular-nums">{formatNaira(goalProgress.currentAmount)}</strong>
                  </span>
                  <span>
                    Target: <strong className="text-slate-800 tabular-nums">{formatNaira(goalProgress.targetAmount)}</strong>
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Remaining gap: {formatNaira(goalProgress.remainingAmount)}</span>
                  <span className="text-emerald-700 font-medium">
                    {goalProgress.daysRemaining} days left
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-3">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl w-11 h-11 mx-auto flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">No Savings Goals Active</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Set a semester target to track laptop funds, textbooks, or off-campus housing.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={onAddGoal}
                className="mt-2 text-xs"
              >
                Set First Milestone
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 6. Dedicated AI Insight Detail Modal */}
      <AIInsightDetailModal
        insight={selectedInsightForDetail}
        isOpen={Boolean(selectedInsightForDetail)}
        onClose={() => setSelectedInsightForDetail(null)}
        onAskZukoAboutInsight={(insight) => {
          setSelectedInsightForDetail(null);
          onOpenAssistantModal(
            `Explain and help me resolve this insight: "${insight.title}"`,
            insight
          );
        }}
        onNavigate={onNavigate}
      />

      {/* 7. Floating "Ask Zuko" Action Button */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-30">
        <button
          onClick={() => onOpenAssistantModal()}
          aria-label="Open Ask Zuko Financial Assistant"
          className="flex items-center gap-2 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl shadow-lg shadow-emerald-900/20 active:scale-95 transition-all cursor-pointer font-semibold text-xs border border-emerald-600"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Ask Zuko</span>
        </button>
      </div>
    </div>
  );
};
