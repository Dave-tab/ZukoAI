import React, { useState } from 'react';
import { formatNaira } from '../../utils/financeCalculations';
import { BarChart3, PieChart as PieIcon, Calendar, ArrowUpRight, TrendingUp } from 'lucide-react';

interface SpendingChartProps {
  dailyData: { day: string; date: string; amount: number }[];
  categoryData: { category: string; spent: number; percentage: number }[];
}

export const SpendingChart: React.FC<SpendingChartProps> = ({
  dailyData,
  categoryData,
}) => {
  const [viewMode, setViewMode] = useState<'daily' | 'category'>('daily');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxDaily = Math.max(...dailyData.map((d) => d.amount), 1);
  const totalWeekly = dailyData.reduce((acc, d) => acc + d.amount, 0);
  const dailyAverage = Math.round(totalWeekly / Math.max(1, dailyData.length));

  // Category palette aligning with Emerald Ledger Design system
  const categoryPalette = [
    { bg: 'bg-emerald-500', barBg: '#10b981', border: 'border-emerald-200' },
    { bg: 'bg-teal-500', barBg: '#14b8a6', border: 'border-teal-200' },
    { bg: 'bg-blue-500', barBg: '#3b82f6', border: 'border-blue-200' },
    { bg: 'bg-indigo-500', barBg: '#6366f1', border: 'border-indigo-200' },
    { bg: 'bg-amber-500', barBg: '#f59e0b', border: 'border-amber-200' },
    { bg: 'bg-rose-500', barBg: '#ef4444', border: 'border-rose-200' },
    { bg: 'bg-purple-500', barBg: '#a855f7', border: 'border-purple-200' },
  ];

  return (
    <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Spending Patterns & Analytics
            </h3>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-emerald-800">
              Active Term
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Total 7-day campus expenses:{' '}
            <span className="font-bold text-slate-800 tabular-nums">{formatNaira(totalWeekly)}</span>
            <span className="text-slate-300 mx-1.5">•</span>
            Daily avg:{' '}
            <span className="font-semibold text-slate-700 tabular-nums">{formatNaira(dailyAverage)}</span>
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl self-start sm:self-auto border border-slate-200/60">
          <button
            onClick={() => setViewMode('daily')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'daily'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Daily Outlay</span>
          </button>
          <button
            onClick={() => setViewMode('category')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'category'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Category Share</span>
          </button>
        </div>
      </div>

      {viewMode === 'daily' ? (
        <div className="mt-6">
          {/* Responsive Bar Visualization with Guide lines */}
          <div className="relative">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 text-[10px] text-slate-300 tabular-nums">
              <div className="border-b border-dashed border-slate-100 w-full flex justify-end pr-1">
                <span>{formatNaira(maxDaily, false)}</span>
              </div>
              <div className="border-b border-dashed border-slate-100 w-full flex justify-end pr-1">
                <span>{formatNaira(Math.round(maxDaily / 2), false)}</span>
              </div>
              <div className="border-b border-slate-100 w-full flex justify-end pr-1">
                <span>₦0</span>
              </div>
            </div>

            {/* Bars Column Container - Mobile optimized height */}
            <div className="h-36 sm:h-48 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 pt-6 pb-2 relative z-10">
              {dailyData.map((item, index) => {
                const heightPercent = Math.max(8, Math.round((item.amount / maxDaily) * 100));
                const isHovered = hoveredIndex === index;
                const isToday = index === dailyData.length - 1;

                return (
                  <div
                    key={item.date}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Floating Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-12 z-30 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-xl shadow-xl whitespace-nowrap pointer-events-none transform -translate-y-1 transition-all border border-slate-700">
                        <div className="font-bold text-emerald-300">{formatNaira(item.amount)}</div>
                        <div className="text-[10px] text-slate-300">{item.day}, {item.date}</div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                      </div>
                    )}

                    {/* Bar Pill */}
                    <div className="w-full max-w-[44px] bg-slate-100/80 rounded-t-xl overflow-hidden flex items-end h-full">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-xl transition-all duration-300 ${
                          isToday
                            ? 'bg-emerald-600 group-hover:bg-emerald-500 shadow-sm'
                            : isHovered
                            ? 'bg-emerald-500'
                            : 'bg-emerald-400/80 group-hover:bg-emerald-500'
                        }`}
                      />
                    </div>

                    {/* Label below bar */}
                    <div className="mt-3 text-center">
                      <span
                        className={`block text-xs font-semibold ${
                          isToday ? 'text-emerald-700 font-bold' : 'text-slate-600'
                        }`}
                      >
                        {item.day}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {item.date.slice(8)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart Footer metadata */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Oct 06 — Oct 12, 2026 (Active Week)</span>
            </span>
            <span className="font-semibold text-slate-700">
              Peak: {formatNaira(maxDaily)}
            </span>
          </div>
        </div>
      ) : categoryData.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          No category expenses recorded yet.
        </div>
      ) : (
        <div className="mt-6 space-y-3.5">
          {categoryData.slice(0, 6).map((cat, index) => {
            const palette = categoryPalette[index % categoryPalette.length];
            return (
              <div key={cat.category} className="space-y-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-sm ${palette.bg}`} />
                    <span className="font-bold text-slate-800">{cat.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{formatNaira(cat.spent)}</span>
                    <span className="text-slate-400 font-medium">({cat.percentage}%)</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-md overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, cat.percentage)}%` }}
                    className={`h-full rounded-md ${palette.bg} transition-all duration-300`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
