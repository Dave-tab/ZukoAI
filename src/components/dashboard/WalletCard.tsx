import React, { useState } from 'react';
import { formatNaira } from '../../utils/financeCalculations';
import { Wallet, Eye, EyeOff, RotateCw, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';

interface WalletCardProps {
  balance: number;
  currency?: string;
  onRefresh?: () => void;
  onViewTransactions?: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  balance,
  currency = 'NGN',
  onRefresh,
  onViewTransactions,
}) => {
  const [isMasked, setIsMasked] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncText, setLastSyncText] = useState<string>('Simulated Student Balance');

  const handleRefreshClick = () => {
    setIsSyncing(true);
    setLastSyncText('Refreshing simulated balance...');
    if (onRefresh) {
      onRefresh();
    }
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncText('Simulated balance verified');
    }, 600);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-5 sm:p-6 border border-emerald-800/40 shadow-sm">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-12 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between gap-5">
        {/* Header bar */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Connected Wallet Balance
                </h2>
                
              </div>
            </div>
          </div>

          {/* Action buttons (Privacy Mask & Simulated Refresh) */}
          <div className="flex items-center gap-1.5 shrink-0 bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setIsMasked(!isMasked)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label={isMasked ? 'Reveal wallet balance' : 'Hide wallet balance'}
              title={isMasked ? 'Reveal balance' : 'Hide balance'}
            >
              {isMasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={handleRefreshClick}
              disabled={isSyncing}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Refresh simulated balance"
              title="Refresh simulated balance"
            >
              <RotateCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Central Balance Display */}
        <div className="py-1">
          <span className="text-xs uppercase tracking-wider text-emerald-300/80 font-semibold block mb-1">
            Available Spendable Cash
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans tabular-nums">
              {isMasked ? '₦••••••••' : formatNaira(balance)}
            </span>
            <span className="text-xs font-semibold text-emerald-400 uppercase">
              {currency}
            </span>
          </div>
        </div>

        {/* Footer / Status rail */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-300 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{lastSyncText}</span>
          </div>

          {onViewTransactions && (
            <button
              onClick={onViewTransactions}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 hover:text-white transition-colors cursor-pointer ml-auto"
            >
              <span>View ledger records</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
