import React from 'react';
import { Menu, X, Sparkles, ShieldCheck, Bell, User } from 'lucide-react';
import { StudentProfile } from '../../types/finance';

interface HeaderProps {
  profile: StudentProfile;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  mobileMenuOpen,
  onToggleMobileMenu,
  unreadNotificationsCount = 0,
  onOpenNotifications,
  onOpenProfile,
}) => {
  return (
    <>
      {/* Mobile Top App Bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-200" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-950 flex items-center gap-1">
              ZUKO
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notification Bell (D11, FR-006) */}
          <button
            onClick={onOpenNotifications}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
            aria-label="View Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* Profile View/Edit Trigger (D11, FR-005) */}
          <button
            onClick={onOpenProfile}
            className="p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Open Profile"
          >
            <img
              src={profile.avatarUrl || '/src/assets/images/student_user_avatar_1791964531534.jpg'}
              referrerPolicy="no-referrer"
              alt={profile.name}
              className="w-7 h-7 rounded-lg object-cover border border-emerald-200"
            />
          </button>

          {/* Mobile Menu Drawer Toggle */}
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Desktop Top Sub-header Bar (D11) */}
      <div className="hidden md:flex items-center justify-between px-6 lg:px-8 py-3.5 bg-white/80 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-20">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-800">Campus Term:</span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium border border-emerald-200">
            {profile.semester}
          </span>
          <span className="text-slate-300">•</span>
          <span>{profile.university}</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Student Financial Intelligence v1.0</span>
          </span>

          <div className="h-4 w-px bg-slate-200" />

          {/* Notification Bell (D11, FR-006) */}
          <button
            onClick={onOpenNotifications}
            className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer flex items-center gap-1.5"
            aria-label="View Notifications"
          >
            <div className="relative">
              <Bell className="w-4 h-4 text-slate-600" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] flex items-center justify-center px-1 rounded-full text-[9px] font-bold bg-rose-500 text-white">
                  {unreadNotificationsCount}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-slate-700">Alerts</span>
          </button>

          {/* Profile Trigger (D11, FR-005) */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer"
            aria-label="Open Profile Details"
          >
            <img
              src={profile.avatarUrl || '/src/assets/images/student_user_avatar_1791964531534.jpg'}
              referrerPolicy="no-referrer"
              alt={profile.name}
              className="w-6 h-6 rounded-lg object-cover border border-emerald-200"
            />
            <span className="font-semibold text-slate-800 text-xs">{profile.name}</span>
          </button>
        </div>
      </div>
    </>
  );
};
