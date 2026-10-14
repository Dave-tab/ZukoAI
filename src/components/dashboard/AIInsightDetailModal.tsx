import React, { useEffect } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Trophy,
  X,
  MessageSquare,
  ArrowRight,
  Target,
  PieChart,
  Receipt,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { AIInsight, AppPage } from '../../types/finance';
import { formatNaira } from '../../utils/financeCalculations';
import { Button } from '../shared/Button';

interface AIInsightDetailModalProps {
  insight: AIInsight | null;
  isOpen: boolean;
  onClose: () => void;
  onAskZukoAboutInsight?: (insight: AIInsight) => void;
  onNavigate?: (page: AppPage) => void;
}

export const AIInsightDetailModal: React.FC<AIInsightDetailModalProps> = ({
  insight,
  isOpen,
  onClose,
  onAskZukoAboutInsight,
  onNavigate,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !insight) return null;

  const getTypeConfig = (type: AIInsight['type']) => {
    switch (type) {
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
          badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
          metricBg: 'bg-rose-50/70 border-rose-200 text-rose-900',
          label: 'Budget Envelope Alert',
          metricLabel: 'Variance / Over-Limit Amount',
          actionLabel: 'Review Budgets',
          targetPage: 'budgets' as AppPage,
        };
      case 'achievement':
        return {
          icon: <Trophy className="w-5 h-5 text-amber-600" />,
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
          metricBg: 'bg-amber-50/70 border-amber-200 text-amber-900',
          label: 'Milestone Progress',
          metricLabel: 'Accumulated Milestone Funds',
          actionLabel: 'Review Goals',
          targetPage: 'goals' as AppPage,
        };
      case 'opportunity':
        return {
          icon: <Sparkles className="w-5 h-5 text-blue-600" />,
          badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
          metricBg: 'bg-blue-50/70 border-blue-200 text-blue-900',
          label: 'Student Savings Opportunity',
          metricLabel: 'Potential Term Savings',
          actionLabel: 'View Transactions',
          targetPage: 'transactions' as AppPage,
        };
      case 'tip':
      default:
        return {
          icon: <Lightbulb className="w-5 h-5 text-emerald-600" />,
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          metricBg: 'bg-emerald-50/70 border-emerald-200 text-emerald-900',
          label: 'Spending Efficiency Tip',
          metricLabel: 'Estimated Term Efficiency Gain',
          actionLabel: 'Review Budgets',
          targetPage: 'budgets' as AppPage,
        };
    }
  };

  const config = getTypeConfig(insight.type);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="insight-modal-title"
    >
      {/* Click outside backdrop */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-start justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 shrink-0">
              {config.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${config.badgeBg}`}
                >
                  {config.label}
                </span>
                <span className="text-[10px] text-slate-400">
                  {insight.date}
                </span>
              </div>
              <h3
                id="insight-modal-title"
                className="mt-1 text-base sm:text-lg font-bold text-white tracking-tight"
              >
                {insight.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Close insight details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Financial Impact Metric Card */}
          {insight.impactAmount !== undefined && (
            <div className={`p-4 rounded-2xl border ${config.metricBg} flex items-center justify-between`}>
              <div>
                <p className="text-xs font-semibold text-slate-600">{config.metricLabel}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight tabular-nums mt-0.5">
                  {formatNaira(insight.impactAmount)}
                </p>
              </div>
              <div className="p-2.5 bg-white/80 rounded-xl border border-slate-200/60 shadow-2xs">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          )}

          {/* Full Insight Narrative */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Detailed Analysis & Context
            </h4>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <p className="text-sm text-slate-800 leading-relaxed">
                {insight.summary}
              </p>
            </div>
          </div>

          {/* Campus Context & Architecture Note */}
          <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200/60 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-600 leading-relaxed">
              <strong className="text-slate-800 font-semibold">Zuko Intelligence Boundary:</strong> Generated from your campus spending ledger. This insight is advisory; your manual budgeting rules and transactions always take absolute precedence.
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto text-slate-600 hover:bg-slate-200/70"
          >
            Close
          </Button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onNavigate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onNavigate(config.targetPage);
                }}
                className="w-full sm:w-auto border-slate-300 text-slate-800 hover:bg-slate-100"
              >
                <span>{config.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            )}

            {onAskZukoAboutInsight && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onAskZukoAboutInsight(insight);
                  onClose();
                }}
                icon={<MessageSquare className="w-3.5 h-3.5 text-white" />}
                className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
              >
                Ask Zuko About This
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
