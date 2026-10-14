import React from 'react';
import {
  LayoutDashboard,
  PieChart,
  Receipt,
  Target,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { StudentProfile, AppPage } from '../../types/finance';

interface SidebarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  profile: StudentProfile;
  budgetCount: number;
  goalCount: number;
  onOpenProfile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  profile,
  budgetCount,
  goalCount,
  onOpenProfile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as AppPage,
      label: 'Overview Dashboard',
      icon: LayoutDashboard,
      active: currentPage === 'dashboard',
    },
    {
      id: 'budgets' as AppPage,
      label: 'Budgets & Limits',
      icon: PieChart,
      active: currentPage === 'budgets',
      badge: `${budgetCount}`,
    },
    {
      id: 'transactions' as AppPage,
      label: 'Transaction Ledger',
      icon: Receipt,
      active: currentPage === 'transactions',
    },
    {
      id: 'goals' as AppPage,
      label: 'Financial Goals',
      icon: Target,
      active: currentPage === 'goals',
      badge: `${goalCount}`,
    },
    {
      id: 'ai-assistant' as AppPage,
      label: 'Financial AI Advisor',
      icon: Sparkles,
      active: currentPage === 'ai-assistant',
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200/80 p-5 shrink-0 sticky top-0 h-screen overflow-y-auto">
      {/* Brand Logo & Identifier */}
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
          <Sparkles className="w-5 h-5 text-emerald-200" />
        </div>
        <div>
          <span className="text-xl font-black tracking-tight text-slate-950 flex items-center gap-1.5">
            ZUKO
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-widest">
              MVP
            </span>
          </span>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Student Finance
          </p>
        </div>
      </div>

      {/* Main Navigation Items (Approved 5-Destination Layout - D11) */}
      <div className="mt-8 space-y-1.5">
        <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Core Navigation
        </span>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                item.active
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-bold'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${item.active ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    item.active
                      ? 'bg-emerald-700 text-emerald-100'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cross-Developer Architecture Integration Notice */}
      <div className="mt-8 space-y-1.5 pt-5 border-t border-slate-100">
        <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>System Pipeline</span>
            <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              D01–D12
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Unified canonical transactions, Africa/Lagos calendar months, and isolated wallet balances.
          </p>
        </div>
      </div>

      {/* Student Profile Trigger Card in Sidebar (D11, FR-005) */}
      <div className="mt-auto pt-6 border-t border-slate-100">
        <button
          onClick={onOpenProfile}
          className="w-full p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/70 flex items-center justify-between gap-3 text-left transition-all cursor-pointer group"
          title="Click to view and edit student profile"
        >
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-9 h-9 rounded-xl object-cover border border-emerald-200 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-800">
                {profile.name}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {profile.major}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0" />
        </button>
      </div>
    </aside>
  );
};
