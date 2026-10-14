import React from 'react';
import {
  LayoutDashboard,
  PieChart,
  Receipt,
  Target,
  Sparkles,
} from 'lucide-react';
import { AppPage } from '../../types/finance';

interface MobileBottomNavProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  budgetCount: number;
  goalCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate,
  budgetCount,
  goalCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as AppPage,
      label: 'Home',
      icon: LayoutDashboard,
      active: currentPage === 'dashboard',
    },
    {
      id: 'budgets' as AppPage,
      label: 'Budgets',
      icon: PieChart,
      active: currentPage === 'budgets',
      badge: budgetCount > 0 ? `${budgetCount}` : undefined,
    },
    {
      id: 'transactions' as AppPage,
      label: 'Ledger',
      icon: Receipt,
      active: currentPage === 'transactions',
    },
    {
      id: 'goals' as AppPage,
      label: 'Goals',
      icon: Target,
      active: currentPage === 'goals',
      badge: goalCount > 0 ? `${goalCount}` : undefined,
    },
    {
      id: 'ai-assistant' as AppPage,
      label: 'AI Advisor',
      icon: Sparkles,
      active: currentPage === 'ai-assistant',
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      aria-label="Mobile Bottom Navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            aria-label={item.label}
            aria-current={item.active ? 'page' : undefined}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1.5 rounded-xl transition-all cursor-pointer relative ${
              item.active
                ? 'text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-all relative ${
                item.active ? 'bg-emerald-100/80 text-emerald-800 scale-105' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.badge && (
                <span
                  className={`absolute -top-1 -right-1 text-[9px] min-w-[14px] h-[14px] flex items-center justify-center px-1 rounded-full font-bold ${
                    item.active
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-none">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
