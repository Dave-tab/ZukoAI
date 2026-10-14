import React from 'react';
import { AIInsight } from '../../types/finance';
import { formatNaira } from '../../utils/financeCalculations';
import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Trophy,
  MessageSquare,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

export interface AIInsightCardProps {
  insights: AIInsight[];
  onOpenAssistant?: () => void;
  onSelectInsight?: (insight: AIInsight) => void;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  insights,
  onOpenAssistant,
  onSelectInsight,
}) => {
  const getIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'achievement':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'opportunity':
        return <Sparkles className="w-4 h-4 text-blue-400" />;
      case 'tip':
      default:
        return <Lightbulb className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getCardTone = (type: AIInsight['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-rose-950/20 border-rose-800/40 hover:border-rose-700/60 text-rose-100';
      case 'achievement':
        return 'bg-amber-950/20 border-amber-800/40 hover:border-amber-700/60 text-amber-100';
      case 'opportunity':
        return 'bg-blue-950/20 border-blue-800/40 hover:border-blue-700/60 text-blue-100';
      case 'tip':
      default:
        return 'bg-emerald-950/20 border-emerald-800/40 hover:border-emerald-700/60 text-emerald-100';
    }
  };

  const getBadgeText = (type: AIInsight['type']) => {
    switch (type) {
      case 'warning':
        return 'Alert';
      case 'achievement':
        return 'Milestone';
      case 'opportunity':
        return 'Opportunity';
      case 'tip':
      default:
        return 'Tip';
    }
  };

  return (
    <div className="p-5 sm:p-6 bg-slate-900 text-white rounded-2xl shadow-xs border border-slate-800 relative overflow-hidden">
      {/* Subtle ambient accent */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-52 h-52 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Zuko Financial Intelligence
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>Campus Expenditure Analysis</span>
              <span aria-hidden="true">·</span>
            </div>
          </div>
        </div>

        {onOpenAssistant && (
          <button
            onClick={onOpenAssistant}
            aria-label="Open Ask Zuko Assistant"
            className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-all shadow-xs cursor-pointer shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask Zuko</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
        {insights.slice(0, 2).map((insight) => (
          <div
            key={insight.id}
            onClick={() => {
              if (onSelectInsight) {
                onSelectInsight(insight);
              } else if (onOpenAssistant) {
                onOpenAssistant();
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectInsight?.(insight);
              }
            }}
            className={`p-3.5 rounded-xl border ${getCardTone(
              insight.type
            )} hover:brightness-110 transition-all cursor-pointer group flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="shrink-0">{getIcon(insight.type)}</div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-white/10 text-white/90">
                    {getBadgeText(insight.type)}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {insight.date}
                </span>
              </div>

              <h4 className="mt-2 text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                {insight.title}
              </h4>

              <p className="mt-1 text-xs text-slate-300 leading-relaxed line-clamp-2">
                {insight.summary}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
              {insight.impactAmount !== undefined ? (
                <span className="font-semibold text-emerald-400 tabular-nums">
                  Impact: {formatNaira(insight.impactAmount)}
                </span>
              ) : (
                <span className="text-slate-400">Term Insight</span>
              )}

              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium group-hover:translate-x-0.5 transition-transform">
                <span>View analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
