import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { AIInsight, Transaction, Budget, FinancialGoal } from '../../types/finance';
import { formatNaira } from '../../utils/financeCalculations';

export interface FloatingAskZukoModalProps {
  isOpen: boolean;
  onClose: () => void;
  insights: AIInsight[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: FinancialGoal[];
  initialPrompt?: string | null;
  initialInsight?: AIInsight | null;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  highlightCategory?: string;
}

export const FloatingAskZukoModal: React.FC<FloatingAskZukoModalProps> = ({
  isOpen,
  onClose,
  insights,
  transactions,
  budgets,
  goals,
  initialPrompt,
  initialInsight,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Hello! I am Zuko, your student financial intelligence advisor. Ask me anything about your campus budgets, expenditures, or semester milestones.',
      timestamp: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Sync initial insight or prompt when opened
  useEffect(() => {
    if (isOpen && initialInsight) {
      setMessages([
        {
          id: `ins-${Date.now()}`,
          sender: 'ai',
          text: `You are reviewing the insight: "${initialInsight.title}".\n\n${initialInsight.summary}\n\nHow would you like to handle this recommendation? I can calculate alternative budget allocations or project your end-of-term cash reserve.`,
          timestamp: 'Just now',
        },
      ]);
      if (initialPrompt) {
        setInputVal(initialPrompt);
      }
    } else if (isOpen && initialPrompt) {
      setInputVal(initialPrompt);
    }
  }, [isOpen, initialInsight, initialPrompt]);

  const defaultPrompts = [
    'How much do I have left in Food & Dining?',
    'What was my largest expenditure this month?',
    'How close am I to my MacBook Air goal?',
    'Show my over-budget envelopes',
  ];

  const insightPrompts = initialInsight
    ? [
        `How do I resolve "${initialInsight.title}"?`,
        'Suggest budget reallocations for this',
        'How does this affect my net term savings?',
      ]
    : defaultPrompts;

  if (!isOpen) return null;

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    setTimeout(() => {
      let reply = "I'm analyzing your semester ledger records...";
      const q = text.toLowerCase();

      if (q.includes('food') || q.includes('dining')) {
        const foodBudget = budgets.find((b) => b.category === 'Food & Dining');
        const spent = transactions
          .filter((t) => t.category === 'Food & Dining' && t.is_budget_eligible)
          .reduce((acc, t) => acc + t.amount, 0);
        const limit = foodBudget?.limit || 42000;
        const remaining = limit - spent;

        reply = `You currently have ${formatNaira(
          remaining
        )} remaining in your Food & Dining envelope (${formatNaira(
          spent
        )} spent of your ${formatNaira(limit)} limit).`;
      } else if (q.includes('largest') || q.includes('big') || q.includes('highest')) {
        const sorted = [...transactions]
          .filter((t) => t.type === 'expense')
          .sort((a, b) => b.amount - a.amount);
        const top = sorted[0];
        if (top) {
          reply = `Your largest single expenditure this term was ${formatNaira(
            top.amount
          )} for "${top.title}" on ${top.date} (${top.category}).`;
        } else {
          reply = 'You currently have no recorded expenses this term.';
        }
      } else if (q.includes('macbook') || q.includes('laptop') || q.includes('goal')) {
        const laptopGoal = goals.find((g) => g.title.toLowerCase().includes('laptop') || g.title.toLowerCase().includes('macbook')) || goals[0];
        if (laptopGoal) {
          const pct = Math.round((laptopGoal.currentAmount / laptopGoal.targetAmount) * 100);
          reply = `Your "${laptopGoal.title}" has ${formatNaira(
            laptopGoal.currentAmount
          )} saved towards the ${formatNaira(laptopGoal.targetAmount)} target (${pct}% funded).`;
        }
      } else if (q.includes('entertainment') || q.includes('over')) {
        reply =
          'Your Entertainment budget (limit ₦8,000.00) has reached ₦8,500.00, placing you ₦500.00 over envelope limit. Skipping one off-campus weekend cinema visit will bring you back into safety.';
      } else if (q.includes('textbook') || q.includes('book')) {
        reply =
          'You spent ₦12,500.00 on CSC textbooks on Oct 03. For next semester, sharing senior departmental PDF reserves or library reserve books can save an estimated ₦15,000.00.';
      } else {
        reply = `I analyzed your query: "${text}". Based on your 6 active category envelopes and ledger activity, your financial posture is healthy with 1 active envelope alert (Entertainment).`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-end sm:justify-end sm:p-6">
      {/* Backdrop overlay for closing on outside click */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ask Zuko Assistant"
        className="relative z-10 w-full sm:w-[420px] bg-white sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col h-[520px] sm:h-[580px] overflow-hidden animate-in slide-in-from-bottom duration-300"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight">Ask Zuko AI</h3>
              </div>
              <p className="text-[11px] text-slate-300">Student financial guidance & answers</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Assistant Panel"
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                m.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-emerald-700 text-white'
                }`}
              >
                {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none shadow-2xs'
                }`}
              >
                <p>{m.text}</p>
                <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-slate-100">
                  <span className="text-[9px] text-slate-400">{m.timestamp}</span>
                  {m.sender === 'ai' && (
                    <span className="text-[8px] px-1 py-0.2 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Assistive AI
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Ideas:
          </span>
          {insightPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[10px] font-medium px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 transition-colors whitespace-nowrap cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputVal);
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]"
        >
          <input
            type="text"
            placeholder="Ask about envelopes, goals, or expenses..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
          />
          <button
            type="submit"
            aria-label="Send Message"
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
