import React from 'react';
import { Transaction } from '../../types/finance';
import { formatNaira } from '../../utils/financeCalculations';
import {
  ArrowDownLeft,
  ArrowUpRight,
  BookOpen,
  Coffee,
  Bus,
  Gamepad2,
  Home,
  Sparkles,
  Wifi,
  ShoppingBag,
} from 'lucide-react';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onViewAll?: () => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  onViewAll,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food & Dining':
        return <Coffee className="w-4 h-4 text-emerald-600" />;
      case 'Books & Academic':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'Transportation':
        return <Bus className="w-4 h-4 text-amber-600" />;
      case 'Housing & Rent':
        return <Home className="w-4 h-4 text-indigo-600" />;
      case 'Entertainment':
        return <Gamepad2 className="w-4 h-4 text-pink-600" />;
      case 'Utilities & Tech':
        return <Wifi className="w-4 h-4 text-purple-600" />;
      case 'Personal Care':
        return <Sparkles className="w-4 h-4 text-teal-600" />;
      default:
        return <ShoppingBag className="w-4 h-4 text-slate-600" />;
    }
  };

  const getSourceBadge = (source?: string) => {
    switch (source) {
      case 'campus_card':
        return 'Campus ID';
      case 'bank_transfer':
        return 'Transfer';
      case 'cash':
        return 'Cash';
      default:
        return 'Card';
    }
  };

  return (
    <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Recent Campus Transactions</h3>
          <p className="text-xs text-slate-500">Recent student ledger records</p>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            Full Ledger →
          </button>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          No campus transactions recorded yet.
        </div>
      ) : (
        <div className="mt-4 divide-y divide-slate-100">
          {transactions.slice(0, 6).map((tx) => {
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between gap-3 group hover:bg-slate-50/70 -mx-2 px-2 rounded-xl transition-colors"
              >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60 group-hover:scale-105 transition-transform">
                  {getCategoryIcon(tx.category)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                    {tx.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500">
                    <span className="truncate">{tx.merchant || tx.category}</span>
                    <span className="text-slate-300">·</span>
                    <span>{tx.date}</span>
                    <span className="hidden sm:inline-block text-slate-400">
                      · {getSourceBadge(tx.source)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p
                  className={`text-xs sm:text-sm font-bold flex items-center justify-end gap-1 tabular-nums ${
                    isIncome ? 'text-emerald-600' : 'text-slate-900'
                  }`}
                >
                  {isIncome ? (
                    <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>
                    {isIncome ? '+' : '-'}
                    {formatNaira(tx.amount)}
                  </span>
                </p>
                <span className="text-[10px] text-slate-400 capitalize">{tx.type}</span>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};
