import React, { useState, useEffect } from 'react';
import {
  initialStudentProfile,
  initialTransactions,
  initialBudgets,
  initialGoals,
  initialAIInsights,
  initialNotifications,
  financeService,
} from './services/financeService';
import {
  Transaction,
  Budget,
  FinancialGoal,
  AIInsight,
  StudentProfile,
  NotificationItem,
  TransactionCategory,
  BudgetPeriod,
  AppPage,
} from './types/finance';
import { formatNaira } from './utils/financeCalculations';
import { AppLayout } from './components/layout';
import { DashboardPage } from './pages/DashboardPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { GoalsPage } from './pages/GoalsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ProfileModal } from './components/profile/ProfileModal';
import { NotificationsPopover } from './components/notifications/NotificationsPopover';
import { FloatingAskZukoModal } from './components/assistant/FloatingAskZukoModal';
import { ToastContainer, ToastMessage } from './components/shared';

export default function App() {
  // Navigation View State (Approved 5-Destination Layout - D11)
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');

  // Core Financial State synchronized with IFinanceService (D07)
  const [profile, setProfile] = useState<StudentProfile>(initialStudentProfile);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [goals, setGoals] = useState<FinancialGoal[]>(initialGoals);
  const [insights] = useState<AIInsight[]>(initialAIInsights);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Authoritative Wallet Balance strictly isolated from budget subtractions (D05, D07)
  const [walletBalance, setWalletBalance] = useState<{ available_balance: number; currency: 'NGN' }>({
    available_balance: 125000,
    currency: 'NGN',
  });

  // Application-wide Toast Notification System (Stage 7 Reliability)
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string, title?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message, title }]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    financeService
      .getWalletBalance()
      .then((balance) => {
        setWalletBalance(balance);
      })
      .catch((err) => {
        console.error('Failed to load wallet balance', err);
        addToast('error', 'Unable to retrieve wallet balance.', 'Service Error');
      });
  }, []);

  const handleRefreshWallet = () => {
    financeService
      .getWalletBalance()
      .then((balance) => {
        setWalletBalance(balance);
        addToast('info', 'Simulated cash balance verified (D05 Isolation)', 'Balance Synchronized');
      })
      .catch((err) => {
        console.error('Failed to refresh wallet balance', err);
        addToast('error', 'Unable to refresh balance.', 'Service Error');
      });
  };

  // Modals & Panels State (D11, FR-005, FR-006)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState<string | null>(null);
  const [assistantInsight, setAssistantInsight] = useState<AIInsight | null>(null);

  const handleOpenAssistant = (prompt?: string, insight?: AIInsight) => {
    setAssistantPrompt(prompt || null);
    setAssistantInsight(insight || null);
    setIsAssistantModalOpen(true);
  };

  const handleCloseAssistant = () => {
    setIsAssistantModalOpen(false);
    setAssistantPrompt(null);
    setAssistantInsight(null);
  };

  // Profile Mutation Handler (D10, D11)
  const handleUpdateProfile = (updatedFields: Partial<StudentProfile>) => {
    financeService
      .updateProfile(updatedFields)
      .then((updated) => {
        setProfile(updated);
        addToast('success', 'Your student profile information has been saved.', 'Profile Updated');
      })
      .catch((err) => {
        console.error('Failed to update profile', err);
        addToast('error', 'Could not save profile updates.', 'Update Failed');
      });
  };

  // Notification Handlers (D11, FR-006)
  const handleMarkNotificationRead = (id: string) => {
    financeService.markNotificationAsRead(id).then(() => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    });
  };

  const handleMarkAllNotificationsRead = () => {
    financeService.markAllNotificationsAsRead().then(() => {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      addToast('info', 'All notifications marked as read.');
    });
  };

  // Budget Handlers (D06, D10)
  const handleAddBudget = (newBudget: {
    category: TransactionCategory;
    limit: number;
    period: BudgetPeriod;
  }) => {
    financeService
      .createBudget({
        category: newBudget.category,
        limit: newBudget.limit,
        period: newBudget.period,
        color: '#10b981',
        icon: 'PieChart',
      })
      .then((created) => {
        setBudgets((prev) => [created, ...prev]);
        addToast(
          'success',
          `${newBudget.category} budget envelope set to ${formatNaira(newBudget.limit)}`,
          'Budget Envelope Added'
        );
      })
      .catch((err) => {
        console.error('Failed to add budget', err);
        addToast('error', 'Failed to create budget envelope.', 'Operation Failed');
      });
  };

  const handleDeleteBudget = (id: string) => {
    const target = budgets.find((b) => b.id === id);
    financeService
      .deleteBudget(id)
      .then(() => {
        setBudgets((prev) => prev.filter((b) => b.id !== id));
        addToast(
          'info',
          target ? `${target.category} budget envelope removed.` : 'Budget envelope removed.',
          'Budget Deleted'
        );
      })
      .catch((err) => {
        console.error('Failed to delete budget', err);
        addToast('error', 'Could not remove budget.', 'Operation Failed');
      });
  };

  const handleUpdateBudget = (updatedBudget: {
    id: string;
    category: TransactionCategory;
    limit: number;
    period: BudgetPeriod;
  }) => {
    const existing = budgets.find((b) => b.id === updatedBudget.id);
    if (!existing) return;

    const modified: Budget = {
      ...existing,
      category: updatedBudget.category,
      limit: updatedBudget.limit,
      period: updatedBudget.period,
    };

    financeService
      .updateBudget(modified)
      .then((saved) => {
        setBudgets((prev) => prev.map((b) => (b.id === saved.id ? saved : b)));
        addToast(
          'success',
          `${saved.category} budget limit updated to ${formatNaira(saved.limit)}`,
          'Budget Updated'
        );
      })
      .catch((err) => {
        console.error('Failed to update budget', err);
        addToast('error', 'Could not update budget envelope.', 'Operation Failed');
      });
  };

  // Goal Handlers
  const handleAddGoal = (newGoal: {
    title: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    category: string;
    description?: string;
  }) => {
    financeService
      .createGoal({
        title: newGoal.title,
        targetAmount: newGoal.targetAmount,
        currentAmount: newGoal.currentAmount,
        targetDate: newGoal.targetDate,
        category: newGoal.category,
        status: 'in_progress',
        description: newGoal.description,
        color: '#059669',
        icon: 'Target',
      })
      .then((created) => {
        setGoals((prev) => [created, ...prev]);
        addToast(
          'success',
          `Savings milestone "${created.title}" created with target of ${formatNaira(created.targetAmount)}`,
          'Savings Goal Created'
        );
      })
      .catch((err) => {
        console.error('Failed to add goal', err);
        addToast('error', 'Failed to create savings goal.', 'Operation Failed');
      });
  };

  const handleUpdateGoal = (updatedGoal: FinancialGoal) => {
    financeService
      .updateGoal(updatedGoal)
      .then((saved) => {
        setGoals((prev) => prev.map((g) => (g.id === saved.id ? saved : g)));
        addToast(
          'success',
          `Goal "${saved.title}" updated (${formatNaira(saved.currentAmount)} of ${formatNaira(saved.targetAmount)})`,
          'Goal Progress Saved'
        );
      })
      .catch((err) => {
        console.error('Failed to update goal', err);
        addToast('error', 'Failed to update savings goal.', 'Operation Failed');
      });
  };

  const handleDeleteGoal = (id: string) => {
    const target = goals.find((g) => g.id === id);
    financeService
      .deleteGoal(id)
      .then(() => {
        setGoals((prev) => prev.filter((g) => g.id !== id));
        addToast(
          'info',
          target ? `Goal "${target.title}" removed.` : 'Goal removed.',
          'Goal Deleted'
        );
      })
      .catch((err) => {
        console.error('Failed to delete goal', err);
        addToast('error', 'Could not delete savings goal.', 'Operation Failed');
      });
  };

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    financeService
      .createTransaction(newTx)
      .then((created) => {
        setTransactions((prev) => [created, ...prev]);
        addToast(
          'success',
          `${created.title} (${formatNaira(created.amount)}) recorded to campus ledger.`,
          'Transaction Logged'
        );
      })
      .catch((err) => {
        console.error('Failed to create transaction', err);
        addToast('error', 'Failed to record transaction.', 'Operation Failed');
      });
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppLayout
      currentPage={currentPage}
      onNavigate={(page) => setCurrentPage(page)}
      profile={profile}
      budgetCount={budgets.length}
      goalCount={goals.length}
      unreadNotificationsCount={unreadNotificationsCount}
      onOpenNotifications={() => setIsNotificationsOpen(true)}
      onOpenProfile={() => setIsProfileModalOpen(true)}
    >
      {/* 1. Overview Dashboard (Home) */}
      {currentPage === 'dashboard' && (
        <DashboardPage
          transactions={transactions}
          budgets={budgets}
          goals={goals}
          insights={insights}
          profile={profile}
          walletBalance={walletBalance}
          onNavigate={(page) => setCurrentPage(page)}
          onAddBudget={() => {
            setCurrentPage('budgets');
            setIsBudgetModalOpen(true);
          }}
          onAddGoal={() => {
            setCurrentPage('goals');
            setIsGoalModalOpen(true);
          }}
          onOpenAssistantModal={handleOpenAssistant}
          onRefreshWallet={handleRefreshWallet}
        />
      )}

      {/* 2. Budgets & Limits */}
      {currentPage === 'budgets' && (
        <BudgetsPage
          budgets={budgets}
          transactions={transactions}
          onAddBudget={handleAddBudget}
          onUpdateBudget={handleUpdateBudget}
          onDeleteBudget={handleDeleteBudget}
          isModalOpen={isBudgetModalOpen}
          setIsModalOpen={setIsBudgetModalOpen}
        />
      )}

      {/* 3. Transaction Ledger (Canonical Model - D01, D03, D04) */}
      {currentPage === 'transactions' && (
        <TransactionsPage
          transactions={transactions}
          onAddTransaction={handleAddTransaction}
        />
      )}

      {/* 4. Financial Goals */}
      {currentPage === 'goals' && (
        <GoalsPage
          goals={goals}
          onAddGoal={handleAddGoal}
          onUpdateGoal={handleUpdateGoal}
          onDeleteGoal={handleDeleteGoal}
          isModalOpen={isGoalModalOpen}
          setIsModalOpen={setIsGoalModalOpen}
        />
      )}

      {/* 5. Financial AI Advisor (D08) */}
      {currentPage === 'ai-assistant' && (
        <AIAssistantPage
          insights={insights}
          transactions={transactions}
          budgets={budgets}
          goals={goals}
        />
      )}

      {/* Modals & Overlays (D11, FR-005, FR-006) */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={handleUpdateProfile}
      />

      <NotificationsPopover
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationRead}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onNavigate={(page) => setCurrentPage(page)}
      />

      <FloatingAskZukoModal
        isOpen={isAssistantModalOpen}
        onClose={handleCloseAssistant}
        insights={insights}
        transactions={transactions}
        budgets={budgets}
        goals={goals}
        initialPrompt={assistantPrompt}
        initialInsight={assistantInsight}
      />

      {/* Toast Notification Mount (Stage 7 Reliability) */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </AppLayout>
  );
}
