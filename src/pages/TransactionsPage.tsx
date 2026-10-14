import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Plus,
  CreditCard,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Transaction, TransactionType } from '../types/finance';
import { formatNaira } from '../utils/financeCalculations';
import { AddExpenseModal } from '../components/transactions/AddExpenseModal';

interface TransactionsPageProps {
  transactions: Transaction[];
  onAddTransaction?: (tx: Transaction) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  transactions,
  onAddTransaction,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter((tx) => {
    // Type Filter
    if (filterType === 'expense' && tx.type !== 'expense') return false;
    if (filterType === 'income' && tx.type !== 'income') return false;
    if (
      filterType === 'transfer' &&
      tx.type !== 'transfer' &&
      tx.type !== 'deposit' &&
      tx.type !== 'withdrawal'
    )
      return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = tx.title.toLowerCase().includes(q);
      const matchMerchant = tx.merchant?.toLowerCase().includes(q) || false;
      const matchCategory = tx.category.toLowerCase().includes(q);
      if (!matchTitle && !matchMerchant && !matchCategory) return false;
    }

    return true;
  });

  // Calculate Integration Metrics across ledger records
  const totalEligibleExpenses = transactions
    .filter((t) => t.type === 'expense' && t.is_budget_eligible)
    .reduce((acc, t) => acc + t.amount, 0);

  const totalIsolatedTransfers = transactions
    .filter((t) => !t.is_budget_eligible)
    .reduce((acc, t) => acc + t.amount, 0);

  const getSourceBadge = (source?: string) => {
    switch (source) {
      case 'bmoni_card':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <CreditCard className="w-3 h-3" />
            BMONI Card
          </span>
        );
      case 'bmoni_wallet':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Wallet className="w-3 h-3" />
            BMONI Wallet
          </span>
        );
      case 'bmoni_transfer':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <ArrowDownLeft className="w-3 h-3" />
            BMONI Transfer
          </span>
        );
      case 'manual':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Receipt className="w-3 h-3" />
            Manual Entry
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Bank Transfer
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Transaction Ledger
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
           Multi-channel transaction ledger with automatic envelope eligibility
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Manual Expense</span>
          </button>
        </div>
      </div>

      {/* Integration Boundary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Records</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 tracking-tight tabular-nums">
            {transactions.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Settled campus ledger records</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Budget-Debited Outlays</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-800 tracking-tight tabular-nums">
            {formatNaira(totalEligibleExpenses)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Active against monthly envelopes</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Isolated Transfers</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-blue-800 tracking-tight tabular-nums">
            {formatNaira(totalIsolatedTransfers)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Non-envelope account movements</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by title, merchant, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Activity' },
            { id: 'expense', label: 'Expenses' },
            { id: 'income', label: 'Income & Allowance' },
            { id: 'transfer', label: 'Transfers & Deposits' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterType === tab.id
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Canonical Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Transaction / Merchant</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Source Channel</th>
                <th className="py-3 px-4">Budget Eligible</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount (₦)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No transactions matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-500 whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            tx.type === 'income'
                              ? 'bg-emerald-100 text-emerald-700'
                              : tx.type === 'transfer'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {tx.type === 'income' ? (
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          ) : tx.type === 'transfer' ? (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{tx.title}</p>
                          {tx.merchant && (
                            <p className="text-[11px] text-slate-400">{tx.merchant}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getSourceBadge(tx.source)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {tx.is_budget_eligible ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Debits Budget</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Isolated</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="capitalize">{tx.status}</span>
                      </span>
                    </td>
                    <td
                      className={`py-3.5 px-4 text-right font-bold whitespace-nowrap tabular-nums ${
                        tx.type === 'income'
                          ? 'text-emerald-700'
                          : tx.type === 'transfer'
                          ? 'text-blue-700'
                          : 'text-slate-900'
                      }`}
                    >
                      {tx.type === 'income' ? `+${formatNaira(tx.amount)}` : `-${formatNaira(tx.amount)}`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredTransactions.length} of {transactions.length} records</span>
          <span className="font-medium text-slate-700">Currency: Nigerian Naira (₦)</span>
        </div>
      </div>

      {/* Manual Expense Modal (Frontend Dev B Contract) */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(tx) => {
          onAddTransaction?.(tx);
        }}
      />
    </div>
  );
};
