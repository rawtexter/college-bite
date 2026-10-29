import React from 'react';
import { Clock, Users, Flame, AlertTriangle, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

interface LiveQueueTrackerProps {
  onOrderNow: () => void;
}

export const LiveQueueTracker: React.FC<LiveQueueTrackerProps> = ({ onOrderNow }) => {
  const counters = [
    {
      counterNumber: 1,
      title: 'Counter 1: Hot Meals & Thalis',
      currentLoad: 'Heavy Rush',
      queueLength: 6,
      averageWaitMins: 12,
      servingTokens: ['CB-839', 'CB-841'],
      nextReadyIn: '~3 mins',
      color: 'border-amber-500 bg-amber-50/50',
      badgeColor: 'bg-rose-100 text-rose-800',
    },
    {
      counterNumber: 2,
      title: 'Counter 2: Snacks & Quick Bites',
      currentLoad: 'Normal Pace',
      queueLength: 3,
      averageWaitMins: 6,
      servingTokens: ['CB-840', 'CB-842'],
      nextReadyIn: '~1 min',
      color: 'border-emerald-500 bg-emerald-50/40',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      counterNumber: 3,
      title: 'Counter 3: Beverages & Bakery',
      currentLoad: 'Fast Clearance',
      queueLength: 1,
      averageWaitMins: 3,
      servingTokens: ['CB-844'],
      nextReadyIn: 'Instant',
      color: 'border-blue-500 bg-blue-50/40',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title Strip */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
            <Clock className="w-4 h-4" />
            <span>Realtime Canteen Operations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Live Kitchen Queues & Counter Display
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Monitor real-time waiting times across counters. CollegeBite allows you to pre-order and reserve a pickup slot so your food is packed and ready the moment your lecture concludes.
          </p>
        </div>
      </div>

      {/* Counters Real-time Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {counters.map((c) => (
          <div
            key={c.counterNumber}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-900 font-mono">
                  COUNTER {c.counterNumber}
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${c.badgeColor}`}>
                  {c.currentLoad}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-800 mb-4">{c.title}</h4>

              {/* Waiting metrics */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl mb-4">
                <div>
                  <span className="text-[11px] text-slate-500 block">Est. Prep Wait</span>
                  <span className="text-lg font-black font-mono text-slate-900">
                    ~{c.averageWaitMins}m
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Orders in Queue</span>
                  <span className="text-lg font-black font-mono text-slate-900">
                    {c.queueLength} orders
                  </span>
                </div>
              </div>

              {/* Currently Serving Display */}
              <div className="p-3 bg-slate-900 text-white rounded-xl mb-4">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mb-1">
                  Now Calling at Counter
                </span>
                <div className="flex items-center gap-2 font-mono font-bold text-base text-amber-100">
                  {c.servingTokens.map((t) => (
                    <span key={t} className="bg-white/10 px-2 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Next ticket: {c.nextReadyIn}</span>
              <button
                onClick={onOrderNow}
                className="text-amber-800 font-semibold hover:underline cursor-pointer"
              >
                Order here
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Peak Hours Guide & Campus Rush Schedule */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-600" />
          <span>Campus Peak Hour Schedule & Pro-Tips</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60">
            <div className="text-xs font-bold text-amber-900 mb-1">Morning Break</div>
            <div className="text-sm font-extrabold text-slate-900 font-mono mb-1">
              10:15 AM – 10:45 AM
            </div>
            <p className="text-xs text-slate-600">
              Heavy rush for Masala Chai, Filter Coffee, and Samosas. Pre-order 10 mins before class ends.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/60">
            <div className="text-xs font-bold text-rose-900 mb-1">Peak Lunch Break</div>
            <div className="text-sm font-extrabold text-slate-900 font-mono mb-1">
              12:30 PM – 01:45 PM
            </div>
            <p className="text-xs text-slate-600">
              Maximum queue time (~20 mins walk-in). Reserve an advance pickup slot (e.g. 1:00 PM) to bypass counter wait.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/60">
            <div className="text-xs font-bold text-blue-900 mb-1">Evening Snack Shift</div>
            <div className="text-sm font-extrabold text-slate-900 font-mono mb-1">
              04:30 PM – 05:30 PM
            </div>
            <p className="text-xs text-slate-600">
              Sandwiches, Fries & Cold Brew in high demand. Moderate waiting time.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900 text-white rounded-2xl">
          <div>
            <h4 className="text-sm font-bold text-white mb-0.5">
              Ready to skip the canteen line?
            </h4>
            <p className="text-xs text-slate-300">
              Add your favourite meal to tray and reserve your pickup slot.
            </p>
          </div>
          <button
            onClick={onOrderNow}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span>Browse Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
