import React from 'react';
import { useOSStore } from '../store/useOSStore';
import { Info, Award, CheckCircle, X } from 'lucide-react';

export const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useOSStore();

  return (
    <div className="absolute top-14 right-4 w-80 z-[110] flex flex-col space-y-2 pointer-events-none select-none">
      {notifications.map((notif) => {
        const isAchievement = notif.type === 'achievement';
        const isSuccess = notif.type === 'success';

        return (
          <div
            key={notif.id}
            className={`w-full pointer-events-auto p-4 rounded-xl border flex items-start space-x-3 shadow-2xl animate-fade-in transition duration-300 ${
              isAchievement
                ? 'bg-yellow-950/80 border-yellow-500 text-yellow-300 shadow-neon-blue'
                : isSuccess
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                : 'bg-slate-900/90 border-indigo-500/30 text-slate-200'
            }`}
          >
            {/* Icon */}
            <div className="mt-0.5 shrink-0">
              {isAchievement ? (
                <Award size={18} className="text-yellow-400 animate-bounce" />
              ) : isSuccess ? (
                <CheckCircle size={18} className="text-emerald-400" />
              ) : (
                <Info size={18} className="text-indigo-400" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold font-display uppercase tracking-wider">
                {notif.title}
              </div>
              <div className="text-[11px] font-mono mt-1 opacity-90 leading-relaxed break-words">
                {notif.text}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeNotification(notif.id)}
              className="text-slate-400 hover:text-slate-200 shrink-0 self-start"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
