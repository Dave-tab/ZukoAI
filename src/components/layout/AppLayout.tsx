import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { StudentProfile, AppPage } from '../../types/finance';
import {
  LayoutDashboard,
  PieChart,
  Receipt,
  Target,
  Sparkles,
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  profile: StudentProfile;
  budgetCount: number;
  goalCount: number;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentPage,
  onNavigate,
  profile,
  budgetCount,
  goalCount,
  unreadNotificationsCount = 0,
  onOpenNotifications,
  onOpenProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row antialiased">
      {/* Desktop Sidebar (5 Destinations & Profile Trigger - D11) */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(p) => {
          onNavigate(p);
          setMobileMenuOpen(false);
        }}
        profile={profile}
        budgetCount={budgetCount}
        goalCount={goalCount}
        onOpenProfile={onOpenProfile}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          profile={profile}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenNotifications={onOpenNotifications}
          onOpenProfile={onOpenProfile}
        />

        {/* Mobile Navigation Drawer (Optional Dropdown from Hamburger) */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 z-20 shadow-lg animate-in slide-in-from-top duration-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    item.active
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-white/20">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Content Shell with mobile bottom nav safe padding (D11, FR-004) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
          {children}
        </main>
      </div>

      {/* Dedicated Mobile Bottom Navigation Bar (D11, FR-004) */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={onNavigate}
        budgetCount={budgetCount}
        goalCount={goalCount}
      />
    </div>
  );
};
