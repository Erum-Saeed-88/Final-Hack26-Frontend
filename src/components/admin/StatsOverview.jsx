import { Ticket, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const StatsOverview = ({ stats }) => {
  const cards = [
    { label: 'Total Tickets', val: stats.total, icon: Ticket, color: 'text-teal-200', bg: 'bg-themePurple/10 border-teal-700' },
    { label: 'New Tickets', val: stats.new, icon: AlertTriangle, color: 'text-emerald-700', bg: 'bg-themeDeepPink/10 border-teal-700' },
    { label: 'In Progress', val: stats.inProgress, icon: Clock, color: 'text-teal-200', bg: 'bg-themeBurlywood/10 border-teal-700' },
    { label: 'Resolved', val: stats.resolved, icon: CheckCircle, color: 'text-emerald-700', bg: 'bg-emerald-500/10 border-teal-700' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div key={idx} className={`p-4 rounded-xl border-2 border-teal-700 ${c.bg} backdrop-blur-md flex items-center justify-between`}>
            <div>
              <p className="text-xs text-teal-700 uppercase font-bold">{c.label}</p>
              <h3 className="text-2xl font-black text-teal-100 mt-1">{c.val || 0}</h3>
            </div>
            <div className={`p-3 rounded-lg ${c.bg}`}>
              <Icon className={`w-6 h-6 ${c.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview;